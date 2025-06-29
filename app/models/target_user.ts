import { readFile } from 'node:fs/promises'
import app from '@adonisjs/core/services/app'

export interface TargetUserProps {
  id: number
  username: string
  enabled: boolean
}

export default class TargetUser {
  private static dataPromise: Promise<TargetUserProps[]> = TargetUser.loadData()

  private static async loadData(): Promise<TargetUserProps[]> {
    const jsonPath = app.makeURL('./static_data/target_users.json')
    if (!app.inTest) {
      // Production/Development: require main JSON file
      const contents = await readFile(jsonPath, 'utf8')
      return JSON.parse(contents) as TargetUserProps[]
    }

    // Test environment: try main JSON, fallback to example JSON
    const examplePath = app.makeURL('./static_data/target_users.example.json')
    try {
      const contents = await readFile(jsonPath, 'utf8')
      return JSON.parse(contents) as TargetUserProps[]
    } catch (error: any) {
      if (error.code !== 'ENOENT') {
        console.error(`Failed to load target users from ${jsonPath}`, error)
        return []
      }
      try {
        const contents = await readFile(examplePath, 'utf8')
        return JSON.parse(contents) as TargetUserProps[]
      } catch (exampleError: any) {
        if (exampleError.code !== 'ENOENT') {
          console.error(`Failed to load example target users from ${examplePath}`, exampleError)
          return []
        }
        console.error('No target_users.json or example JSON found in static_data folder')
        return []
      }
    }
  }

  private static async getData(): Promise<TargetUserProps[]> {
    return this.dataPromise
  }

  /**
   * Returns all target users
   */
  public static async all(): Promise<TargetUserProps[]> {
    return this.getData()
  }

  /**
   * Finds a target user by ID
   */
  public static async find(id: number): Promise<TargetUserProps | undefined> {
    const data = await this.getData()
    return data.find((user) => user.id === id)
  }

  /**
   * Returns only enabled target users
   */
  public static async enabledUsers(): Promise<TargetUserProps[]> {
    const data = await this.getData()
    return data.filter((user) => user.enabled)
  }
}
