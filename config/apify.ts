import env from '#start/env'
import type { ApifyConfig } from '#types/config/apify_config'

const config: ApifyConfig = {
  /**
   * Apify API token
   */
  token: env.get('APIFY_TOKEN'),

  /**
   * Actor ID for the Twitter scraper actor
   */
  actorId: env.get('APIFY_ACTOR_ID', 'apidojo~twitter-scraper-lite'),

  /**
   * Base URL for Apify API
   */
  baseUrl: env.get('APIFY_BASE_URL', 'https://api.apify.com'),

  /**
   * Number of items to retrieve per page when listing dataset items
   */
  datasetPageSize: env.get('APIFY_DATASET_PAGE_SIZE', 1000),

  /**
   * Maximum number of retries for Apify client requests
   */
  maxRetries: env.get('APIFY_MAX_RETRIES', 8),

  /**
   * Minimum delay between retries in milliseconds
   */
  minDelayBetweenRetriesMillis: env.get('APIFY_MIN_DELAY_BETWEEN_RETRIES_MILLIS', 500),

  /**
   * Request timeout in seconds for Apify client
   */
  timeoutSecs: env.get('APIFY_TIMEOUT_SECS', 360),

  /**
   * Seconds to wait for actor run completion
   */
  waitSecs: env.get('APIFY_WAIT_SECS', 300),
}

export default config
