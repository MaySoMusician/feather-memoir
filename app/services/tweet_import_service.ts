import TargetUser from '#models/target_user'
import type { FetchedTweetDataPartialType } from '#types/apify/fetched_tweet_data'
import { DateTime } from 'luxon'
import db from '@adonisjs/lucid/services/db'
import { type TransactionClientContract } from '@adonisjs/lucid/types/database'
import UserTweet from '#models/user_tweet'
import { CreateManyValue } from '#types/lucid_helpers'
import { DateTimeFromTwitterFormat } from '#utils/twitter'
import logger from '@adonisjs/core/services/logger'

export type TweetImportServiceConfig = {}

export default class TweetImportService {
  constructor() {}

  /**
   * Imports the tweet data fetched from Apify and updates the `targetUser`'s `lastFetchedAt` with the latest `createdAt` (to be stored as `publishedAt` in the database) value
   * @returns Promise to run database transaction
   */
  async import(tweetsData: FetchedTweetDataPartialType[], targetUser: TargetUser) {
    if (tweetsData.length === 0) {
      return
    }

    const maxCreatedAt = this.computeLastFetchedAt(tweetsData)

    return db.transaction(async (transaction) => {
      const created = await this.upsertTweets(tweetsData, targetUser, transaction)
      logger.info(`${created.length} items of UserTweet inserted.`)

      await this.updateTargetUserTimestamp(targetUser, maxCreatedAt, transaction)
      logger.info(
        `TargetUser (id = ${targetUser.id}) lastFetchedAt updated to ${maxCreatedAt.toISO()}`
      )
    })
  }

  private computeLastFetchedAt(tweetsData: FetchedTweetDataPartialType[]): DateTime {
    return tweetsData
      .map((data) => DateTimeFromTwitterFormat(data.createdAt))
      .reduce((a, b) => (b > a ? b : a), DateTime.fromMillis(0))
  }

  private async upsertTweets(
    tweetsData: FetchedTweetDataPartialType[],
    targetUser: TargetUser,
    transaction: TransactionClientContract
  ) {
    const values: CreateManyValue<typeof UserTweet>[] = tweetsData.map((data) =>
      this.convertTweetDataToModelAttributes(data, targetUser)
    )

    return UserTweet.createMany(values, {
      client: transaction,
    })
  }

  private convertTweetDataToModelAttributes(
    data: FetchedTweetDataPartialType,
    targetUser: TargetUser
  ): CreateManyValue<typeof UserTweet> {
    const targetUserId = targetUser.id
    const tweetId = data.id
    const publishedAt = DateTimeFromTwitterFormat(data.createdAt)
    const processedAt = DateTime.utc()
    const retweet = data.isRetweet || data.isQuote

    if (!retweet) {
      const type = 'normal'
      const tweeterUsername = data.author.userName
      const content = data.text

      return {
        type,
        target_user_id: targetUserId,
        tweet_id: tweetId,
        tweeter_username: tweeterUsername,
        content,
        published_at: publishedAt,
        processed_at: processedAt,
        retweet,
      }
    }

    if (data.isRetweet) {
      const type = 'retweet'
      const tweeterUsername = data.retweet.author.userName
      const content = data.retweet.text

      return {
        type,
        target_user_id: targetUserId,
        tweet_id: tweetId,
        tweeter_username: tweeterUsername,
        content,
        published_at: publishedAt,
        processed_at: processedAt,
        retweet,
      }
    }

    if (data.isQuote) {
      const type = 'quoted'
      const tweeterUsername = data.quote.author.userName
      const content = data.quote.text
      const quoterUsername = data.author.userName
      const quoterComment = data.text

      return {
        type,
        target_user_id: targetUserId,
        tweet_id: tweetId,
        tweeter_username: tweeterUsername,
        content,
        published_at: publishedAt,
        processed_at: processedAt,
        retweet,
        quoter_username: quoterUsername,
        quoter_comment: quoterComment,
      }
    }

    throw new Error('Invalid data type')
  }

  private async updateTargetUserTimestamp(
    targetUser: TargetUser,
    maxCreatedAt: DateTime,
    transaction: TransactionClientContract
  ) {
    targetUser.useTransaction(transaction)
    targetUser.lastFetchedAt = maxCreatedAt
    return targetUser.save()
  }
}
