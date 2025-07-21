import TargetUser from '#models/target_user'
import ApifyClientService from '#services/apify_client_service'
import TweetImportService from '#services/tweet_import_service'
import { objectToLogString } from '#utils/log'
import { inject } from '@adonisjs/core'
import { BaseCommand, flags } from '@adonisjs/core/ace'
import type { CommandOptions } from '@adonisjs/core/types/ace'
import { DateTime } from 'luxon'

export default class FetchTweets extends BaseCommand {
  static commandName = 'fetch:tweets'
  static description = 'Fetch the tweets of the specified target_user'

  static options: CommandOptions = {
    startApp: true,
  }

  @flags.number({ description: 'ID of the TargetUser', required: true })
  declare targetUserId: number

  @flags.string({
    flagName: 'since',
    description:
      'Specifies the start time for tweet retrieval, using an ISO 8601-compliant timestamp.',
    required: false,
  })
  declare sinceTimestamp: string | undefined

  @inject()
  async run(apifyClientService: ApifyClientService, tweetImportService: TweetImportService) {
    const targetUser = await TargetUser.findByOrFail('id', this.targetUserId)
    const sinceDatetime = this.decideSinceValue(targetUser)
    const since = `${sinceDatetime.toFormat('yyyy-MM-dd_HH:mm:ss')}_UTC`
    this.logger.info(`since = '${since}'`)

    this.logger.info(`Calling actor...`)
    const runResult = await apifyClientService.runActor(targetUser.username, since)
    this.logger.success(`Actor completed (${objectToLogString(runResult)})`)

    const resultDataItems = await apifyClientService.fetchRunDataset(runResult.datasetId)
    this.logger.success(`Fetched ${resultDataItems.length} items`)

    await tweetImportService.import(resultDataItems, targetUser)
  }

  private decideSinceValue(targetUser: TargetUser): DateTime<true> {
    if (this.sinceTimestamp) {
      this.logger.info(`"since" flag is passed. Use the value as the "since" value.`)
      const sinceFromFlag = DateTime.fromISO(this.sinceTimestamp)

      if (!sinceFromFlag.isValid) {
        throw new Error(
          `"since" flag invalid DateTime: ${sinceFromFlag.invalidReason}: ${sinceFromFlag.invalidExplanation}`
        )
      }
      this.logger.info(`since (from flag) = ${sinceFromFlag.toISO()}`)
      return sinceFromFlag
    }

    this.logger.info(
      `No "since" flag is passed. Try to read the "lastFetchedAt" of the TargetUser.`
    )
    const { lastFetchedAt } = targetUser

    if (!lastFetchedAt) {
      throw new Error(
        `Couldn't read the "lastFetchedAt" of the TargetUser. Re-run with "since" flag specified!`
      )
    }
    if (!lastFetchedAt.isValid) {
      throw new Error(
        `"lastFetchedAt" invalid DateTime: ${lastFetchedAt.invalidReason}: ${lastFetchedAt.invalidExplanation}`
      )
    }
    this.logger.info(`since (from TargetUser) = ${lastFetchedAt.toISO()}`)
    return lastFetchedAt
  }
}
