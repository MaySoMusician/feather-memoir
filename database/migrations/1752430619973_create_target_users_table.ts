import { BaseSchema } from '@adonisjs/lucid/schema'

export default class CreateTargetUsersTable extends BaseSchema {
  protected tableName = 'target_users'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('username').notNullable().unique()
      table.boolean('enabled').notNullable().defaultTo(true)
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
