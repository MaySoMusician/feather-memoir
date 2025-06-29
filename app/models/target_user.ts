import { readFileSync } from 'node:fs'
import app from '@adonisjs/core/services/app'

export interface TargetUserProps {
  id: number
  username: string
  enabled: boolean
}

export default class TargetUser {
  private static data: TargetUserProps[] = TargetUser.loadData()

  private static loadData(): TargetUserProps[] {
    const filePath = app.makeURL('./static_data/target_users.json')
    try {
      const contents = readFileSync(filePath, 'utf8')
      return JSON.parse(contents) as TargetUserProps[]
    } catch (error) {
      console.error(`Failed to load target users from ${filePath}`, error)
      return []
    }
  }

  public static all(): TargetUserProps[] {
    return this.data
  }

  public static find(id: number): TargetUserProps | undefined {
    return this.data.find((user) => user.id === id)
  }

  public static enabledUsers(): TargetUserProps[] {
    return this.data.filter((user) => user.enabled)
  }
}
