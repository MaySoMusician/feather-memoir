import { BaseSchema } from '@adonisjs/lucid/schema'

export default class AddLastFetchedAtToTargetUsers extends BaseSchema {
  protected tableName = 'target_users'

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dateTime('last_fetched_at').nullable()
    })
  }

  public async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('last_fetched_at')
    })
  }
}
