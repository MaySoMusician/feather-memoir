import { BaseSeeder } from '@adonisjs/lucid/seeders'
import UserTweet from '#models/user_tweet'
import { DateTime } from 'luxon'

export default class extends BaseSeeder {
  async run() {
    await UserTweet.createMany([
      {
        type: 'normal',
        target_user_id: 1,
        tweet_id: '1938521540867629212',
        tweeter_username: 'kantei',
        content:
          '【林官房長官・記者会見】\n本日(6月27日)午後の動画を掲載しました。\nhttps://t.co/syrRaSyh58',
        published_at: DateTime.fromISO('2025-06-27T08:55:25.000Z', { zone: 'UTC' }),
        processed_at: DateTime.utc(),
        retweet: false,
      },
      {
        type: 'retweet',
        target_user_id: 1,
        tweet_id: '1937382151160484349',
        tweeter_username: 'digital_jpn',
        content:
          '6月24日からiPhoneのマイナンバーカードの提供を開始しました。いつでもどこにいても、カードをかざさず、簡単、安全かつ便利にマイナポータルにアクセスすることができます。また、コンビニで証明書の取得ができます。詳しくは紹介サイトをご参照ください。', // retweet.text
        published_at: DateTime.fromISO('2025-06-24T05:27:54.000Z', { zone: 'UTC' }),
        processed_at: DateTime.utc(),
        retweet: true,
      },
      {
        type: 'quoted',
        target_user_id: 1,
        tweet_id: '1938160306095628451',
        tweeter_username: 'digital_jpn',
        content:
          '【新卒採用】官庁訪問（一般職）予約受付のお知らせ📢\n2025年度一般職志望者向けに、官庁訪問の予約申込を開始しました。\n官庁訪問に参加するには、官庁訪問予約フォームの入力及びエントリーシートの提出が必要です。みなさまのご予約をお待ちしております。\n\n詳細はこちら↓\nhttps://t.co/MXi5eRXyff', // quote.text
        published_at: DateTime.fromISO('2025-06-26T09:00:00.000Z', { zone: 'UTC' }),
        processed_at: DateTime.utc(),
        retweet: true,
        quoter_username: 'digital_jpn',
        quoter_comment:
          '官庁訪問（一般職）予約は、6月30日（月）9時が応募締切となります。\nぜひお早めにお申し込みください。', //text
      },
    ])
  }
}
