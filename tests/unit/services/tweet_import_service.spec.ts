import { test } from '@japa/runner'
import sinon from 'sinon'
import TweetImportService from '#services/tweet_import_service'
import testUtils from '@adonisjs/core/services/test_utils'
import UserTweet from '#models/user_tweet'
import { DateTime } from 'luxon'
import { TargetUserFactory } from '#database/factories/target_user_factory'
import {
  defaultData,
  quoteData,
  retweetData,
} from '#tests/fixtures/fetched_tweet_data_partial_type'

test.group('TweetImportService.import', (group) => {
  group.each.setup(async () => {
    const rollback = await testUtils.db().truncate()

    return async () => {
      await rollback()
    }
  })

  group.each.teardown(() => {
    sinon.restore()
  })

  test('stores the tweets and updates the lastFetchedAt', async ({ assert }) => {
    const tweetImportService = new TweetImportService()
    const targetUser = await TargetUserFactory.create()

    await tweetImportService.import([defaultData()], targetUser)

    const storedUserTweets = await UserTweet.all()
    assert.equal(storedUserTweets.length, 1)

    const storedTargetUser = await targetUser.refresh()
    assert.isTrue(storedTargetUser.lastFetchedAt!.equals(DateTime.fromISO('2025-07-20T00:00:00Z')))
  })

  test("doesn't save tweets and keeps lastFetchedAt", async ({ assert }) => {
    const tweetImportService = new TweetImportService()
    const targetUser = await TargetUserFactory.merge({
      lastFetchedAt: DateTime.fromISO('2025-01-01T00:00:00Z'),
    }).create()

    await tweetImportService.import([], targetUser)

    const storedUserTweets = await UserTweet.all()
    assert.equal(storedUserTweets.length, 0)

    const storedTargetUser = await targetUser.refresh()
    assert.isTrue(storedTargetUser.lastFetchedAt!.equals(DateTime.fromISO('2025-01-01T00:00:00Z')))
  })

  test('throws when there are no valid createdAt value', async ({ assert }) => {
    const tweetImportService = new TweetImportService()
    const targetUser = await TargetUserFactory.create()
    const data = defaultData()
    data.createdAt = 'only invalid'

    try {
      await tweetImportService.import([data], targetUser)
      assert.fail('Expected error not thrown')
    } catch (error) {
      assert.include((error as Error).message, 'Failed to compute new lastFetchedAt')
    }
  })

  test('processes retweet data', async ({ assert }) => {
    const tweetImportService = new TweetImportService()
    const targetUser = await TargetUserFactory.create()

    await tweetImportService.import([retweetData()], targetUser)

    const storedUserTweets = await UserTweet.all()
    assert.equal(storedUserTweets.length, 1)

    const storedTargetUser = await targetUser.refresh()
    assert.isTrue(storedTargetUser.lastFetchedAt!.equals(DateTime.fromISO('2025-07-20T00:00:00Z')))
  })

  test('processes quote tweet data', async ({ assert }) => {
    const tweetImportService = new TweetImportService()
    const targetUser = await TargetUserFactory.create()

    await tweetImportService.import([quoteData()], targetUser)

    const storedUserTweets = await UserTweet.all()
    assert.equal(storedUserTweets.length, 1)

    const storedTargetUser = await targetUser.refresh()
    assert.isTrue(storedTargetUser.lastFetchedAt!.equals(DateTime.fromISO('2025-07-20T00:00:00Z')))
  })
})
