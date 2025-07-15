export interface ApifyConfig {
  token: string
  actorId: string
  baseUrl: string
  datasetPageSize: number
  maxRetries: number
  minDelayBetweenRetriesMillis: number
  timeoutSecs: number
  waitSecs: number
}
