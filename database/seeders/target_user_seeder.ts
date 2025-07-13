import { BaseSeeder } from '@adonisjs/lucid/seeders'
import TargetUser from '#models/target_user'

export default class TargetUserSeeder extends BaseSeeder {
  public async run() {
    await TargetUser.createMany([
      { id: 1, username: 'bob', enabled: true },
      { id: 2, username: 'alice', enabled: false },
    ])
  }
}
