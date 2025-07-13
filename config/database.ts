import app from '@adonisjs/core/services/app'
import { defineConfig } from '@adonisjs/lucid'

const isTest = process.env.NODE_ENV === 'test'
const sqliteFilename = isTest ? ':memory:' : app.tmpPath('db.sqlite3')

const dbConfig = defineConfig({
  connection: 'sqlite',
  connections: {
    sqlite: {
      client: 'better-sqlite3',
      connection: {
        filename: sqliteFilename,
      },
      useNullAsDefault: true,
      migrations: {
        naturalSort: true,
        paths: ['database/migrations'],
      },
    },
  },
})

export default dbConfig
