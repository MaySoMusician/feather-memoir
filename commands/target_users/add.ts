import { BaseCommand, flags } from '@adonisjs/core/ace'
import TargetUser from '#models/target_user'

export default class AddTargetUser extends BaseCommand {
  public static commandName = 'target_users:add'
  public static description = 'Register a new target user'
  public static options = {
    startApp: true,
  }

  @flags.number({ description: 'ID of the new target user', required: true })
  declare id: number

  @flags.string({ description: 'Username of the new target user', required: true })
  declare username: string

  @flags.boolean({ name: 'enabled', description: 'Whether the user is enabled', default: true })
  declare enabled: boolean

  public async run() {
    // Prevent duplicate id or username
    const exists = await TargetUser.query()
      .where('id', this.id)
      .orWhere('username', this.username)
      .first()
    if (exists) {
      this.logger.error('A target user with the same id or username already exists')
      this.exitCode = 1
      return
    }

    await TargetUser.create({ id: this.id, username: this.username, enabled: this.enabled })
    this.logger.success(`Created target user ${this.id}`)
  }
}
