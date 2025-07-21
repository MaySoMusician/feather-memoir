import { type ApifyClient, ApifyApiError, type ActorClient, type ActorRun } from 'apify-client'
import logger from '@adonisjs/core/services/logger'

export type ApifyClientServiceConfig = {
  client: ApifyClient
  actorId: string
  datasetPageSize: number
  waitSecs: number
}

export type RunActorResult = {
  runId: ActorRun['id']
  datasetId: ActorRun['defaultDatasetId']
  buildId: ActorRun['buildId']
  startedAt: ActorRun['startedAt']
  finishedAt: ActorRun['finishedAt']
}

// Max number of pages to fetch to avoid infinite loops
const MAX_DATASET_PAGES = 1000

export default class ApifyClientService {
  private client: ApifyClient
  private actorId: string
  private actor: ActorClient
  private datasetPageSize: number
  private waitSecs: number

  constructor(config: ApifyClientServiceConfig) {
    this.client = config.client
    this.actorId = config.actorId
    this.actor = this.client.actor(this.actorId)
    this.datasetPageSize = config.datasetPageSize
    this.waitSecs = config.waitSecs
  }

  /**
   * Starts the Twitter scraper actor and waits for completion.
   * @returns runId and datasetId for data retrieval.
   */
  async runActor(username: string, since?: string): Promise<RunActorResult> {
    const searchTerms = [
      `from:${username} include:nativeretweets -filter:replies${since ? ` since:${since}` : ''}`,
    ]
    try {
      const { id, defaultDatasetId, buildId, startedAt, finishedAt } = await this.actor.call(
        { searchTerms, sort: 'Latest' },
        { waitSecs: this.waitSecs }
      )
      return { runId: id, datasetId: defaultDatasetId, buildId, startedAt, finishedAt }
    } catch (error) {
      if (error instanceof ApifyApiError) {
        logger.error('Apify actor call failed', {
          statusCode: error.statusCode,
          type: error.type,
          clientMethod: error.clientMethod,
          path: error.path,
          message: error.message,
          stack: error.stack,
        })
      }
      throw error
    }
  }

  /**
   * Paginates through the actor run dataset and returns all items.
   */
  async fetchRunDataset(datasetId: string, maxPages: number = MAX_DATASET_PAGES): Promise<any[]> {
    const datasetClient = this.client.dataset(datasetId)
    const results: any[] = []
    let offset = 0
    let pageCount = 0

    while (true) {
      if (pageCount >= maxPages) {
        logger.error('Exceeded max dataset pages', { datasetId, pageCount, maxPages })
        throw new Error(`Exceeded max dataset pages (${maxPages}) for dataset ${datasetId}`)
      }
      const { items } = await datasetClient.listItems({
        limit: this.datasetPageSize,
        offset,
      })
      if (!items.length) break
      results.push(...items)
      offset += items.length
      pageCount++
    }
    return results
  }
}
