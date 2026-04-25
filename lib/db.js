import postgres from 'postgres'

const connectionString = process.env.DATABASE_URL

const sql = connectionString
  ? postgres(connectionString, {
      prepare: false,
      max: 1,
      idle_timeout: 20,
    })
  : null

export function getDb() {
  if (!sql) {
    throw new Error('DATABASE_URL is not configured')
  }
  return sql
}

export default sql
