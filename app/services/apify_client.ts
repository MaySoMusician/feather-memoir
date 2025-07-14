import { ApifyClient, ApifyApiError } from 'apify-client'
import ApifyConfig from '#config/apify'
import logger from '@adonisjs/core/services/logger'

const {
  token,
  baseUrl,
  actorId,
  datasetPageSize,
  maxRetries,
  minDelayBetweenRetriesMillis,
  timeoutSecs,
  waitSecs,
} = ApifyConfig

const client = new ApifyClient({
  token,
  baseUrl,
  maxRetries,
  minDelayBetweenRetriesMillis,
  timeoutSecs,
})

const actor = client.actor(actorId)

/**
 * Starts the Twitter scraper actor and waits for completion.
 * @returns runId and datasetId for data retrieval.
 */
export async function startActorRun(
  username: string,
  since?: string
): Promise<{ runId: string; datasetId: string }> {
  const searchTerms = [
    `from:${username} include:nativeretweets -filter:replies${since ? ` since:${since}` : ''}`,
  ]
  try {
    const runData = await actor.call({ searchTerms, sort: 'Latest' }, { waitSecs })
    return { runId: runData.id, datasetId: runData.defaultDatasetId }
  } catch (error) {
    if (error instanceof ApifyApiError) {
      logger.error('Apify actor call failed', {
        statusCode: error.statusCode,
        type: error.type,
        clientMethod: error.clientMethod,
        path: error.path,
      })
    }
    throw error
  }
}

/**
 * Paginates through the actor run dataset and returns all items.
 */
export async function fetchRunDataset(datasetId: string): Promise<any[]> {
  const datasetClient = client.dataset(datasetId)
  const results: any[] = []
  let offset = 0
  while (true) {
    const { items } = await datasetClient.listItems({
      limit: datasetPageSize,
      offset,
    })
    if (!items.length) break
    results.push(...items)
    offset += items.length
  }
  return results
}
