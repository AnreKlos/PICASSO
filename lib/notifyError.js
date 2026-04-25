const DEDUPE_WINDOW_MS = 10 * 60 * 1000
const lastByType = new Map()

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function shouldSkip(type) {
  const now = Date.now()
  const prev = lastByType.get(type) || 0
  if (now - prev < DEDUPE_WINDOW_MS) return true
  lastByType.set(type, now)
  return false
}

export default async function notifyError(type, error, details = {}) {
  console.error(`[${type}]`, error, details)
  if (!type || shouldSkip(type)) return

  const botToken = process.env.TELEGRAM_BOT_TOKEN
  const chatId = process.env.TELEGRAM_CHAT_ID
  if (!botToken || !chatId) return

  const message = error instanceof Error ? error.message : String(error || 'Unknown error')
  const safeDetails = Object.entries(details)
    .map(([key, value]) => `${escapeHtml(key)}: <code>${escapeHtml(value)}</code>`)
    .join('\n')

  const text = [
    '<b>⚠️ PICASSO Critical Error</b>',
    `<b>Type:</b> <code>${escapeHtml(type)}</code>`,
    `<b>Message:</b> <code>${escapeHtml(message)}</code>`,
    safeDetails ? `<b>Details:</b>\n${safeDetails}` : '',
  ]
    .filter(Boolean)
    .join('\n')

  try {
    await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: 'HTML',
      }),
    })
  } catch {
    // Silence to avoid cascading failures
  }
}

export { escapeHtml }
