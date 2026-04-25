import { getDb } from './db.js'

const clientsCache = new Map()

export async function getClientBySlug(slug) {
  if (!slug) return null

  const cacheKey = String(slug).trim().toLowerCase()
  if (clientsCache.has(cacheKey)) {
    return clientsCache.get(cacheKey)
  }

  const sql = getDb()
  const rows = await sql`
    select id, slug, telegram_chat_id
    from clients
    where slug = ${cacheKey}
    limit 1
  `

  const client = rows[0] || null
  clientsCache.set(cacheKey, client)
  return client
}

export function clearClientCache() {
  clientsCache.clear()
}
