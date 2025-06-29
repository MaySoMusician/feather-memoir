import { DateTime } from 'luxon'
import { BaseModel, beforeSave, column } from '@adonisjs/lucid/orm'

import TargetUser from '#models/target_user'

export default class UserTweet extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare type: 'normal' | 'retweet' | 'quoted'

  @column()
  declare target_user_id: number

  @column()
  declare tweet_id: string

  @column()
  declare tweeter_username: string

  @column()
  declare content: string

  @column.dateTime()
  declare published_at: DateTime

  @column.dateTime()
  declare processed_at: DateTime

  @column({
    consume: (value: number) => !!value,
    prepare: (value: boolean) => (value ? 1 : 0),
  })
  declare retweet: boolean

  @column()
  declare quoter_username?: string

  @column()
  declare quoter_comment?: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @beforeSave()
  static async validateTweetTypeAndQuoterValues(userTweet: UserTweet) {
    /*
      (type = 'normal' && retweet = false && quoter_username is null && quoter_comment is null)
      or
      (type = 'retweet' && retweet = true && quoter_username is null && quoter_comment is null)
      or
      (type = 'quoted'  && retweet = true && quoter_username is not null && quoter_comment is not null)
    */

    // Normal Tweet validation
    if (userTweet.type === 'normal') {
      if (
        userTweet.retweet ||
        typeof userTweet.quoter_username !== 'undefined' ||
        typeof userTweet.quoter_comment !== 'undefined'
      ) {
        throw new Error(
          'Invalid "normal" tweet: "retweet" must be false and "quoter_*" fields must be undefined'
        )
      }
    }

    // Retweet validation
    if (userTweet.type === 'retweet') {
      if (
        !userTweet.retweet ||
        typeof userTweet.quoter_username !== 'undefined' ||
        typeof userTweet.quoter_comment !== 'undefined'
      ) {
        throw new Error(
          'Invalid "retweet" tweet: "retweet" must be true and "quoter_*" fields must be undefined'
        )
      }
    }

    // Quoted validation
    if (userTweet.type === 'quoted') {
      if (!userTweet.retweet || !userTweet.quoter_username || !userTweet.quoter_comment) {
        throw new Error(
          'Invalid "quoted" tweet: "retweet" must be true and "quoter_*" fields must be set'
        )
      }
    }
  }

  /**
   * Validates that the target_user_id exists in the static TargetUser dataset
   */
  @beforeSave()
  static validateTargetUserId(userTweet: UserTweet) {
    if (!TargetUser.find(userTweet.target_user_id)) {
      throw new Error(
        `Invalid target_user_id: ${userTweet.target_user_id} does not exist.`
      )
    }
  }
}
