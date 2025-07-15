import { BaseCommand, flags } from '@adonisjs/core/ace'
import TargetUser from '#models/target_user'

export default class EnableTargetUser extends BaseCommand {
  public static commandName = 'target_users:enable'
  public static description = 'Enable an existing target user'
  public static options = {
    startApp: true,
  }

  @flags.number({ description: 'ID of the target user to enable', required: true })
  declare id: number

  public async run() {
    const user = await TargetUser.find(this.id)
    if (!user) {
      this.logger.error(`Target user with id ${this.id} not found`)
      this.exitCode = 1
      return
    }
    user.enabled = true
    await user.save()
    this.logger.success(`Enabled target user ${this.id}`)
  }
}
