import notifyError from '../lib/notifyError.js'
import { getClientBySlug } from '../lib/clientResolver.js'
import { getOrCreateDialogue, appendMessage } from '../lib/dialogue.js'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const apiKey = process.env.OPENROUTER_API_KEY
  if (!apiKey) {
    return res.status(500).json({ error: 'OPENROUTER_API_KEY not configured' })
  }

  try {
    const { model, messages, max_tokens, temperature, session_id } = req.body
    const sessionId = typeof session_id === 'string' ? session_id.trim() : ''

    let dialogueId = null
    const latestUserMessage = Array.isArray(messages)
      ? [...messages].reverse().find((item) => item?.role === 'user' && typeof item?.content === 'string')
      : null

    if (sessionId) {
      try {
        const client = await getClientBySlug('picasso')
        if (!client?.id) {
          throw new Error('Client with slug "picasso" not found')
        }

        const dialogue = await getOrCreateDialogue(client.id, sessionId)
        dialogueId = dialogue?.id || null

        if (dialogueId && latestUserMessage?.content) {
          await appendMessage(dialogueId, {
            role: 'user',
            content: latestUserMessage.content,
          })
        }
      } catch (dbError) {
        await notifyError('chat_db_before_openrouter', dbError, { sessionId })
      }
    }

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': req.headers.origin || 'https://picasso-salon.vercel.app',
        'X-Title': 'PICASSO Concierge',
      },
      body: JSON.stringify({ model, messages, max_tokens, temperature }),
    })

    const data = await response.json()

    if (!response.ok) {
      return res.status(response.status).json({ error: data.error?.message || 'OpenRouter error' })
    }

    const assistantReply =
      data.choices?.[0]?.message?.content || data.error?.message || null

    if (dialogueId && assistantReply) {
      try {
        await appendMessage(dialogueId, {
          role: 'assistant',
          content: assistantReply,
          model,
        })
      } catch (dbError) {
        await notifyError('chat_db_after_openrouter', dbError, { dialogueId, sessionId })
      }
    }

    return res.status(200).json(data)
  } catch (err) {
    await notifyError('chat_unhandled', err).catch(() => {})
    return res.status(500).json({ error: 'Internal server error' })
  }
}
