import { getDb } from '../lib/db.js'
import notifyError, { escapeHtml } from '../lib/notifyError.js'

const TG_API = 'https://api.telegram.org/bot'

export default async function handler(req, res) {
  // Telegram always expects 200, even on our errors
  const secret = req.headers['x-telegram-bot-api-secret-token']
  const expected = process.env.TELEGRAM_WEBHOOK_SECRET

  if (!expected || secret !== expected) {
    return res.status(401).end()
  }

  const body = req.body || {}
  const updateId = body.update_id

  if (typeof updateId !== 'number') {
    return res.status(200).json({ ok: true })
  }

  // Deduplication: remember we already processed this update
  try {
    const sql = getDb()
    const inserted = await sql`
      insert into telegram_updates (update_id)
      values (${updateId})
      on conflict (update_id) do nothing
      returning update_id
    `
    if (!inserted?.[0]) {
      // Duplicate — silently accept
      return res.status(200).json({ ok: true })
    }
  } catch (err) {
    await notifyError('webhook_dedup_failed', err, { updateId }).catch(() => {})
    return res.status(200).json({ ok: true })
  }

  const callback = body.callback_query
  if (!callback?.data) {
    return res.status(200).json({ ok: true })
  }

  const match = String(callback.data).match(/^history_([0-9a-fA-F\-]+)$/)
  if (!match) {
    return res.status(200).json({ ok: true })
  }

  const dialogueId = match[1]
  const callbackQueryId = callback.id
  const chatId = callback.message?.chat?.id

  try {
    const sql = getDb()

    const rows = await sql`
      select d.id, d.messages_json, c.telegram_chat_id
      from dialogues d
      join clients c on c.id = d.client_id
      where d.id = ${dialogueId}
      limit 1
    `

    const row = rows?.[0]
    if (!row) {
      await answerCallbackQuery(callbackQueryId, 'Диалог не найден')
      return res.status(200).json({ ok: true })
    }

    if (String(row.telegram_chat_id) !== String(chatId)) {
      await answerCallbackQuery(callbackQueryId, 'Доступ запрещён')
      return res.status(200).json({ ok: true })
    }

    const messages = Array.isArray(row.messages_json) ? row.messages_json : []
    const lines = messages.map((m) => {
      const prefix = m.role === 'user' ? 'Гость:' : m.role === 'assistant' ? 'Коля:' : 'Система:'
      const time = m.timestamp ? ` [${m.timestamp}]` : ''
      return `${prefix}${time}\n${m.content || ''}`
    })

    const text = lines.join('\n\n')

    const botToken = process.env.TELEGRAM_BOT_TOKEN
    if (!botToken) {
      await answerCallbackQuery(callbackQueryId, 'Ошибка конфигурации бота')
      return res.status(200).json({ ok: true })
    }

    if (text.length > 3500) {
      await sendDocument(botToken, chatId, text, dialogueId, callbackQueryId)
    } else {
      await sendMessage(botToken, chatId, text, callbackQueryId)
    }

    return res.status(200).json({ ok: true })
  } catch (err) {
    await notifyError('webhook_history_failed', err, {
      dialogueId,
      chatId: String(chatId),
    }).catch(() => {})
    await answerCallbackQuery(callbackQueryId, 'Ошибка загрузки истории').catch(() => {})
    return res.status(200).json({ ok: true })
  }
}

async function answerCallbackQuery(callbackQueryId, text) {
  if (!callbackQueryId) return
  const botToken = process.env.TELEGRAM_BOT_TOKEN
  if (!botToken) return
  await fetch(`${TG_API}${botToken}/answerCallbackQuery`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ callback_query_id: callbackQueryId, text }),
  })
}

async function sendMessage(botToken, chatId, text, callbackQueryId) {
  const htmlText = escapeHtml(text).replace(/\n/g, '\n')

  await Promise.all([
    fetch(`${TG_API}${botToken}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: `<pre>${htmlText}</pre>`,
        parse_mode: 'HTML',
      }),
    }),
    answerCallbackQuery(callbackQueryId, 'История загружена'),
  ])
}

async function sendDocument(botToken, chatId, text, dialogueId, callbackQueryId) {
  const shortId = String(dialogueId).slice(0, 8)
  const fileName = `dialogue_${shortId}.txt`
  const blob = new Blob([text], { type: 'text/plain; charset=utf-8' })

  const form = new FormData()
  form.append('chat_id', String(chatId))
  form.append('document', blob, fileName)

  await Promise.all([
    fetch(`${TG_API}${botToken}/sendDocument`, {
      method: 'POST',
      body: form,
    }),
    answerCallbackQuery(callbackQueryId, 'История загружена как файл'),
  ])
}
