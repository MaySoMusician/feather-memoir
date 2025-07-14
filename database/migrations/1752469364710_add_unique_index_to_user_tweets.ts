import { BaseSchema } from '@adonisjs/lucid/schema'

export default class AddUniqueIndexToUserTweets extends BaseSchema {
  protected tableName = 'user_tweets'

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      // Drop single-column unique constraint on tweet_id
      table.dropUnique(['tweet_id'])
      // Add composite unique index on (target_user_id, tweet_id)
      table.unique(['target_user_id', 'tweet_id'])
    })
  }

  public async down() {
    this.schema.alterTable(this.tableName, (table) => {
      // Drop composite unique index
      table.dropUnique(['target_user_id', 'tweet_id'])
      // Reinstate unique constraint on tweet_id
      table.unique(['tweet_id'])
    })
  }
}
