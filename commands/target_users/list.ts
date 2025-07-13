import { BaseCommand } from '@adonisjs/core/ace'
import TargetUser from '#models/target_user'

export default class ListTargetUsers extends BaseCommand {
  public static commandName = 'target_users:list'
  public static description = 'List all registered target users'
  public static options = {
    startApp: true,
  }

  public async run() {
    const users = await TargetUser.all()
    if (users.length === 0) {
      this.logger.info('No target users found')
      return
    }

    const tableData = users.map((u) => ({
      id: u.id,
      username: u.username,
      enabled: u.enabled,
    }))
    // Build and output table
    const headers = ['id', 'username', 'enabled']
    const rows = tableData.map(({ id, username, enabled }) => [
      String(id),
      username,
      String(enabled),
    ])
    const colWidths = headers.map((h, i) => Math.max(h.length, ...rows.map((row) => row[i].length)))
    const headerLine = headers.map((h, i) => h.padEnd(colWidths[i])).join('  ')
    const separator = colWidths.map((w) => '-'.repeat(w)).join('  ')
    const rowLines = rows.map((row) => row.map((cell, i) => cell.padEnd(colWidths[i])).join('  '))
    this.logger.log([headerLine, separator, ...rowLines].join('\n'))
  }
}
