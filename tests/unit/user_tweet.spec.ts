import { test } from '@japa/runner'
import UserTweet from '#models/user_tweet'

// Tests for the static method validateTweetTypeAndQuoterValues on UserTweet model

test.group('UserTweet.validateTweetTypeAndQuoterValues', () => {
  test('allows valid normal tweet', async ({ assert }) => {
    const tweet = new UserTweet()
    tweet.type = 'normal'
    tweet.retweet = false
    // quoter_username and quoter_comment remain undefined
    await UserTweet.validateTweetTypeAndQuoterValues(tweet)
    assert.isTrue(true)
  })

  test('rejects normal tweet with retweet true', async ({ assert }) => {
    const tweet = new UserTweet()
    tweet.type = 'normal'
    tweet.retweet = true
    try {
      await UserTweet.validateTweetTypeAndQuoterValues(tweet)
      assert.fail('Expected error not thrown')
    } catch (error) {
      assert.equal(
        (error as Error).message,
        'Invalid "normal" tweet: "retweet" must be false and "quoter_*" fields must be undefined'
      )
    }
  })

  test('allows valid retweet tweet', async ({ assert }) => {
    const tweet = new UserTweet()
    tweet.type = 'retweet'
    tweet.retweet = true
    await UserTweet.validateTweetTypeAndQuoterValues(tweet)
    assert.isTrue(true)
  })

  test('rejects retweet tweet with quoter_username set', async ({ assert }) => {
    const tweet = new UserTweet()
    tweet.type = 'retweet'
    tweet.retweet = true
    tweet.quoter_username = 'john_doe'
    try {
      await UserTweet.validateTweetTypeAndQuoterValues(tweet)
      assert.fail('Expected error not thrown')
    } catch (error) {
      assert.equal(
        (error as Error).message,
        'Invalid "retweet" tweet: "retweet" must be true and "quoter_*" fields must be undefined'
      )
    }
  })

  test('allows valid quoted tweet', async ({ assert }) => {
    const tweet = new UserTweet()
    tweet.type = 'quoted'
    tweet.retweet = true
    tweet.quoter_username = 'jane_doe'
    tweet.quoter_comment = 'Nice!'
    await UserTweet.validateTweetTypeAndQuoterValues(tweet)
    assert.isTrue(true)
  })

  test('rejects quoted tweet missing quoter_comment', async ({ assert }) => {
    const tweet = new UserTweet()
    tweet.type = 'quoted'
    tweet.retweet = true
    tweet.quoter_username = 'jane_doe'
    // tweet.quoter_comment remains undefined
    try {
      await UserTweet.validateTweetTypeAndQuoterValues(tweet)
      assert.fail('Expected error not thrown')
    } catch (error) {
      assert.equal(
        (error as Error).message,
        'Invalid "quoted" tweet: "retweet" must be true and "quoter_*" fields must be set'
      )
    }
  })
})
