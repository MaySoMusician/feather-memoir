import ApifyClientService from '#services/apify_client_service'
import type { ApifyConfig } from '#types/config/apify_config'
import type { ApplicationService } from '@adonisjs/core/types'
import { ApifyClient } from 'apify-client'

export default class ApifyClientProvider {
  constructor(protected app: ApplicationService) {}

  /**
   * Register bindings to the container
   */
  register() {
    this.app.container.singleton(ApifyClientService, async (resolver) => {
      const configService = await resolver.make('config')
      const apifyClientConfig = configService.get<ApifyConfig>('apify')
      const apifyClient = new ApifyClient({
        token: apifyClientConfig.token,
        baseUrl: apifyClientConfig.baseUrl,
        maxRetries: apifyClientConfig.maxRetries,
        minDelayBetweenRetriesMillis: apifyClientConfig.minDelayBetweenRetriesMillis,
        timeoutSecs: apifyClientConfig.timeoutSecs,
      })

      return new ApifyClientService({
        client: apifyClient,
        actorId: apifyClientConfig.actorId,
        datasetPageSize: apifyClientConfig.datasetPageSize,
        waitSecs: apifyClientConfig.waitSecs,
      })
    })
  }

  /**
   * The container bindings have booted
   */
  async boot() {}

  /**
   * The application has been booted
   */
  async start() {}

  /**
   * The process has been started
   */
  async ready() {}

  /**
   * Preparing to shutdown the app
   */
  async shutdown() {}
}
