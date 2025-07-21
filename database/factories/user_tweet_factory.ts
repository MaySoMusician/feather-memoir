import { DateTime } from 'luxon'
import Factory from '@adonisjs/lucid/factories'
import UserTweet from '#models/user_tweet'

export const UserTweetFactory = Factory.define(UserTweet, ({ faker }) => {
  return {
    type: 'normal' as const,
    target_user_id: 1,
    tweet_id: faker.string.uuid(),
    tweeter_username: faker.internet.userName(),
    content: faker.lorem.sentence(),
    published_at: DateTime.local(),
    processed_at: DateTime.local(),
    retweet: false,
  }
}).build()
