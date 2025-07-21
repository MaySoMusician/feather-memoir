import Factory from '@adonisjs/lucid/factories'
import TargetUser from '#models/target_user'

export const TargetUserFactory = Factory.define(TargetUser, async ({ faker }) => {
  return {
    username: faker.internet.username(),
    enabled: true,
  }
})
  .state('disabled', (targetUser) => {
    targetUser.enabled = false
    return targetUser
  })
  .build()
