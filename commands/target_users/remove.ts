import { BaseCommand, flags } from '@adonisjs/core/ace'
import TargetUser from '#models/target_user'

export default class RemoveTargetUser extends BaseCommand {
  public static commandName = 'target_users:remove'
  public static description = 'Remove an existing target user'
  public static options = {
    startApp: true,
  }

  @flags.number({ description: 'ID of the target user to remove' })
  declare id: number

  public async run() {
    const user = await TargetUser.find(this.id)
    if (!user) {
      this.logger.error(`Target user with id ${this.id} not found`)
      this.exitCode = 1
      return
    }
    await user.delete()
    this.logger.success(`Removed target user ${this.id}`)
  }
}
