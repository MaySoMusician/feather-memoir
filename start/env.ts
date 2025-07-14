/*
|--------------------------------------------------------------------------
| Environment variables service
|--------------------------------------------------------------------------
|
| The `Env.create` method creates an instance of the Env service. The
| service validates the environment variables and also cast values
| to JavaScript data types.
|
*/

import { Env } from '@adonisjs/core/env'

export default await Env.create(new URL('../', import.meta.url), {
  NODE_ENV: Env.schema.enum(['development', 'production', 'test'] as const),
  PORT: Env.schema.number(),
  APP_KEY: Env.schema.string(),
  HOST: Env.schema.string({ format: 'host' }),
  LOG_LEVEL: Env.schema.string(),
  APIFY_TOKEN: Env.schema.string(),
  APIFY_ACTOR_ID: Env.schema.string.optional(),
  APIFY_BASE_URL: Env.schema.string.optional(),
  APIFY_DATASET_PAGE_SIZE: Env.schema.number.optional(),
  APIFY_MAX_RETRIES: Env.schema.number.optional(),
  APIFY_MIN_DELAY_BETWEEN_RETRIES_MILLIS: Env.schema.number.optional(),
  APIFY_TIMEOUT_SECS: Env.schema.number.optional(),
  APIFY_WAIT_SECS: Env.schema.number.optional(),
})
