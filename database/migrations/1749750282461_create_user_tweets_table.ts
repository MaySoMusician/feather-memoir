import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'user_tweets'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table.string('type').notNullable().checkIn(['normal', 'retweet', 'quoted'])

      table.integer('target_user_id').notNullable()
      table.string('tweet_id').notNullable().unique()
      table.string('tweeter_username').notNullable()
      table.text('content').notNullable()

      table.dateTime('published_at').notNullable()
      table.dateTime('processed_at').notNullable()

      table.boolean('retweet').notNullable().defaultTo(false)
      table.string('quoter_username').nullable()
      table.text('quoter_comment').nullable()

      table.timestamp('created_at')
      table.timestamp('updated_at')

      table.index(
        ['target_user_id', 'published_at'],
        'idx_user_tweets_target_user_id_and_published_at'
      )
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
