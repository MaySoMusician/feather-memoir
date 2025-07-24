import TargetUser from '#models/target_user'
import TweetImportService from '#services/tweet_import_service'
import { type FetchedTweetDataPartialType } from '#types/apify/fetched_tweet_data'
import { inject } from '@adonisjs/core'
import { BaseCommand, flags } from '@adonisjs/core/ace'
import type { CommandOptions } from '@adonisjs/core/types/ace'
import fsp from 'node:fs/promises'
import path from 'node:path'

export default class LoadTweets extends BaseCommand {
  static commandName = 'load:tweets'
  static description = 'Load the tweet JSON data'

  static options: CommandOptions = {
    startApp: true,
  }

  @flags.number({ description: 'ID of the TargetUser', required: true })
  declare targetUserId: number

  @flags.string({
    flagName: 'path',
    description: 'Path to json file to load',
    required: true,
  })
  declare jsonPath: string

  @inject()
  async run(tweetImportService: TweetImportService) {
    const targetUser = await TargetUser.findByOrFail('id', this.targetUserId)
    const resolvedJsonPath = path.resolve(this.jsonPath)
    this.logger.info(`Importing tweets from ${resolvedJsonPath}`)

    const readDataJsonString = await fsp.readFile(resolvedJsonPath, {
      encoding: 'utf-8',
      flag: 'r',
    })
    const readDataItems = JSON.parse(readDataJsonString) as FetchedTweetDataPartialType[]
    this.logger.success(`Fetched ${readDataItems.length} items from file`)

    await tweetImportService.import(readDataItems, targetUser)
  }
}
