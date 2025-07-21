import { DateTime } from 'luxon'

/**
 * Convert a datatime string used in Twitter (via Apify) to a Luxon's DateTime object
 * @param twitterDateTimeString Twitter-formatted datetime string
 * @returns Converted {@linkcode DateTime} object
 */
export function DateTimeFromTwitterFormat(twitterDateTimeString: string): DateTime {
  return DateTime.fromFormat(twitterDateTimeString, 'EEE MMM dd HH:mm:ss ZZZ yyyy')
}
