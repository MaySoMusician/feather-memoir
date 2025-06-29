import { test } from '@japa/runner'
import TargetUser, { TargetUserProps } from '#models/target_user'

// Tests for the static TargetUser model methods

test.group('TargetUser static model', () => {
  test('all returns complete list from example JSON', async ({ assert }) => {
    const users = await TargetUser.all()
    assert.isArray(users)
    assert.lengthOf(users, 2)
    assert.deepEqual(users, [
      { id: 1, username: 'bob', enabled: true },
      { id: 2, username: 'alice', enabled: false },
    ] as TargetUserProps[])
  })

  test('find returns correct user when exists', async ({ assert }) => {
    const user = await TargetUser.find(1)
    assert.deepEqual(user, { id: 1, username: 'bob', enabled: true })
  })

  test('find returns undefined when user does not exist', async ({ assert }) => {
    const user = await TargetUser.find(999)
    assert.isUndefined(user)
  })

  test('enabledUsers returns only enabled users', async ({ assert }) => {
    const enabled = await TargetUser.enabledUsers()
    assert.lengthOf(enabled, 1)
    assert.deepEqual(enabled[0], { id: 1, username: 'bob', enabled: true })
  })
})
