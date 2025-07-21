import { test } from '@japa/runner'
import FetchTweets from '#commands/fetch/tweets'
import ace from '@adonisjs/core/services/ace'
import sinon from 'sinon'
import ApifyClientService from '#services/apify_client_service'
import app from '@adonisjs/core/services/app'
import testUtils from '@adonisjs/core/services/test_utils'
import { DateTime } from 'luxon'
import { TargetUserFactory } from '#database/factories/target_user_factory'
import { defaultData } from '#tests/fixtures/fetched_tweet_data_partial_type'

test.group('fetch:tweets command', (group) => {
  let runActorSpy: any
  let fetchRunDatasetSpy: any
  group.setup(() => {
    class FakeApifyClientService extends ApifyClientService {
      constructor() {
        super({
          client: { actor: () => {} } as any,
          actorId: 'test',
          datasetPageSize: 1,
          waitSecs: 1,
        })
      }
      async runActor() {
        return {
          runId: '1',
          datasetId: '1',
          buildId: '1',
          startedAt: new Date(),
          finishedAt: new Date(),
        }
      }

      async fetchRunDataset() {
        return [defaultData()]
      }
    }
    runActorSpy = sinon.spy(FakeApifyClientService.prototype, 'runActor')
    fetchRunDatasetSpy = sinon.spy(FakeApifyClientService.prototype, 'fetchRunDataset')
    app.container.swap(ApifyClientService, () => new FakeApifyClientService())
  })

  group.teardown(() => {
    app.container.restoreAll()
  })

  group.each.setup(async () => {
    const rollback = await testUtils.db().truncate()
    ace.ui.switchMode('raw')
    return async () => {
      ace.ui.switchMode('normal')
      await rollback()
    }
  })

  group.each.teardown(() => {
    sinon.restore()
  })

  test('uses since flag when provided and valid', async ({ assert }) => {
    const targetUser = await TargetUserFactory.create()
    const isoString = '2025-01-01T00:00:00Z'
    const command = await ace.create(FetchTweets, [
      `--target-user-id=${targetUser.id}`,
      `--since=${isoString}`,
    ])

    await command.exec()
    command.assertSucceeded()
    command.assertLogMatches(/"since" flag is passed. Use the value as the "since" value./)
    assert.isTrue(runActorSpy.calledOnce)
    assert.isTrue(fetchRunDatasetSpy.calledOnce)
  })

  test('throws when since flag is invalid', async ({ assert }) => {
    const targetUser = await TargetUserFactory.create()
    const invalidDate = 'invalid'
    const command = await ace.create(FetchTweets, [
      `--target-user-id=${targetUser.id}`,
      `--since=${invalidDate}`,
    ])

    await command.exec()
    command.assertFailed()
    command.assertLogMatches(/"since" flag is passed. Use the value as the "since" value./)
    assert.include(
      command.error.message,
      `"since" flag invalid DateTime: unparsable: the input "invalid" can't be parsed as ISO 8601`
    )
  })

  test('uses lastFetchedAt when no since flag and valid', async ({ assert }) => {
    const targetUser = await TargetUserFactory.merge({
      lastFetchedAt: DateTime.fromISO('2025-01-01T00:00:00Z'),
    }).create()
    const command = await ace.create(FetchTweets, [`--target-user-id=${targetUser.id}`])

    await command.exec()
    command.assertSucceeded()
    command.assertLogMatches(
      /No "since" flag is passed. Try to read the "lastFetchedAt" of the TargetUser./
    )
    command.assertLogMatches(/since \(from TargetUser\) = 2025-01-01T00:00:00.000\+00:00/)
    assert.isTrue(runActorSpy.calledOnce)
    assert.isTrue(fetchRunDatasetSpy.calledOnce)
  })

  test('throws when no since flag and lastFetchedAt is null', async ({ assert }) => {
    const targetUser = await TargetUserFactory.merge({
      lastFetchedAt: null,
    }).create()
    const command = await ace.create(FetchTweets, [`--target-user-id=${targetUser.id}`])

    await command.exec()
    command.assertFailed()
    command.assertLogMatches(
      /No "since" flag is passed. Try to read the "lastFetchedAt" of the TargetUser./
    )
    assert.include(
      command.error.message,
      `Couldn't read the "lastFetchedAt" of the TargetUser. Re-run with "since" flag specified!`
    )
  })
})
