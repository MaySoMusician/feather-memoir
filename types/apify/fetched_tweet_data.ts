export type FetchedTweetDataPartialType = FetchedTweetDataBasePartialType & {
  url: string
  twitterUrl: string
  isReply: boolean
  conversationId: string
} & (
    | FetchedNormalTweetDataPartialType
    | FetchedRetweetDataPartialType
    | FetchedQuoteDataPartialType
  )

export type FetchedNormalTweetDataPartialType = {
  isRetweet: false
  isQuote: false
}

export type FetchedRetweetDataPartialType = {
  isRetweet: true
  isQuote: false
  retweet: FetchedTweetDataBasePartialType
}

export type FetchedQuoteDataPartialType = {
  isRetweet: false
  isQuote: true
  quote: FetchedTweetDataBasePartialType
}

export type FetchedTweetDataBasePartialType = {
  type: 'tweet'
  id: string
  text: string
  source: string
  retweetCount: number
  replyCount: number
  likeCount: number
  quoteCount: number
  viewCount: number
  createdAt: string
  bookmarkCount: number
  author: FethcedTwitterUserDataPartialType
}

export type FethcedTwitterUserDataPartialType = {
  type: 'user'
  userName: string
  url: string
  twitterUrl: string
  id: string
  name: string
}
