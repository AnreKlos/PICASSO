import { getDb } from '../lib/db.js'
import notifyError, { escapeHtml } from '../lib/notifyError.js'
import { getClientBySlug } from '../lib/clientResolver.js'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { name, phone, session_id, service } = req.body || {}
  const safeName = String(name || '').trim()
  const safePhone = String(phone || '').trim()
  const safeService = typeof service === 'string' ? service.trim() : ''
  const sessionId = typeof session_id === 'string' ? session_id.trim() : ''

  if (!safeName || !safePhone) {
    return res.status(400).json({ error: 'Name and phone are required' })
  }

  const timestamp = new Date().toLocaleString('ru-RU', { timeZone: 'Europe/Moscow' })

  let dbSuccess = false
  let telegramSuccess = false
  let clientMissing = false

  let leadId = null
  let dialogueId = null
  let telegramChatId = null

  try {
    const client = await getClientBySlug('picasso')
    if (!client?.id) {
      throw new Error('Client with slug "picasso" not found')
    }

    telegramChatId = client.telegram_chat_id ? String(client.telegram_chat_id) : null
    const sql = getDb()

    if (sessionId) {
      const dialogueRows = await sql`
        select id
        from dialogues
        where client_id = ${client.id} and session_id = ${sessionId}
        limit 1
      `
      dialogueId = dialogueRows[0]?.id || null
    }

    const leadRows = await sql`
      insert into leads (client_id, dialogue_id, name, phone, service)
      values (${client.id}, ${dialogueId}, ${safeName}, ${safePhone}, ${safeService || null})
      returning id, telegram_notified_at
    `

    leadId = leadRows[0]?.id || null

    if (dialogueId) {
      await sql`
        update dialogues
        set became_lead = true
        where id = ${dialogueId}
      `
    }

    dbSuccess = Boolean(leadId)
  } catch (err) {
    if (err instanceof Error && err.message.includes('Client with slug "picasso" not found')) {
      clientMissing = true
    }
    await notifyError('booking_db_failed', err, {
      sessionId,
      name: safeName,
      phone: safePhone,
    }).catch(() => {})
  }

  if (clientMissing) {
    return res.status(500).json({ error: 'Internal server error' })
  }

  try {
    const botToken = process.env.TELEGRAM_BOT_TOKEN
    const fallbackChatId = process.env.TELEGRAM_CHAT_ID
    const targetChatId = telegramChatId || (!dbSuccess ? fallbackChatId : null)

    if (!botToken || !targetChatId) {
      throw new Error('TELEGRAM_BOT_TOKEN or target chat_id missing')
    }

    let canNotify = true
    if (leadId) {
      try {
        const sql = getDb()
        const leadCheck = await sql`
          select telegram_notified_at
          from leads
          where id = ${leadId}
          limit 1
        `
        canNotify = !leadCheck[0]?.telegram_notified_at
      } catch (err) {
        await notifyError('booking_lead_check_failed', err, { leadId }).catch(() => {})
      }
    }

    if (canNotify) {
      const textLines = [
        '🔥 Новая заявка с сайта PICASSO',
        '',
        `👤 Имя: ${escapeHtml(safeName)}`,
        `📞 Телефон: ${escapeHtml(safePhone)}`,
      ]

      if (safeService) {
        textLines.push(`💼 Услуга: ${escapeHtml(safeService)}`)
      }

      textLines.push('', `🕐 ${escapeHtml(timestamp)}`)

      const payload = {
        chat_id: targetChatId,
        text: textLines.join('\n'),
        parse_mode: 'HTML',
      }

      if (dialogueId) {
        payload.reply_markup = {
          inline_keyboard: [[{ text: '📄 Прочитать диалог', callback_data: `history_${dialogueId}` }]],
        }
      }

      const tgRes = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!tgRes.ok) {
        const tgError = await tgRes.text().catch(() => 'unknown telegram error')
        throw new Error(`Telegram sendMessage failed: ${tgError}`)
      }

      telegramSuccess = true

      if (leadId) {
        try {
          const sql = getDb()
          await sql`
            update leads
            set telegram_notified_at = now()
            where id = ${leadId}
          `
        } catch (err) {
          await notifyError('booking_mark_notified_failed', err, { leadId }).catch(() => {})
        }
      }
    }
  } catch (err) {
    await notifyError('booking_telegram_failed', err, {
      leadId,
      dialogueId,
      sessionId,
    }).catch(() => {})
  }

  if (dbSuccess || telegramSuccess) {
    return res.status(200).json({ ok: true })
  }

  return res.status(500).json({ error: 'Internal server error' })
}
