import { getDb } from './db.js'

export async function getOrCreateDialogue(clientId, sessionId) {
  if (!clientId || !sessionId) return null

  const sql = getDb()

  const existing = await sql`
    select id
    from dialogues
    where client_id = ${clientId} and session_id = ${sessionId}
    limit 1
  `

  if (existing[0]?.id) {
    return existing[0]
  }

  const created = await sql`
    insert into dialogues (client_id, session_id, messages_json)
    values (${clientId}, ${sessionId}, ${sql.json([])}::jsonb)
    returning id
  `

  return created[0] || null
}

export async function appendMessage(dialogueId, { role, content, model }) {
  if (!dialogueId || !role || !content) return

  const sql = getDb()
  const message = {
    role,
    content,
    timestamp: new Date().toISOString(),
    ...(model ? { model } : {}),
  }

  await sql`
    update dialogues
    set messages_json = coalesce(messages_json::jsonb, '[]'::jsonb) || ${sql.json([message])}::jsonb,
        last_at = now()
    where id = ${dialogueId}
  `
}
