import notifyError from '../lib/notifyError.js'
import { getClientBySlug } from '../lib/clientResolver.js'
import { getOrCreateDialogue, appendMessage } from '../lib/dialogue.js'

const CHAT_TOOLS = [
  {
    type: 'function',
    function: {
      name: 'show_lead_button',
      description:
        'Показать кнопку "Оставить заявку" в чате. Использовать когда клиент проявил готовность записаться или явно интересуется условиями. Не использовать на каждое сообщение.',
      parameters: {
        type: 'object',
        properties: {
          service_name: {
            type: 'string',
            description:
              'Конкретная услуга, если упомянута клиентом (например "балаяж на длинные", "маникюр")',
          },
        },
        required: [],
      },
    },
  },
]

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const apiKey = process.env.OPENROUTER_API_KEY
  if (!apiKey) {
    return res.status(500).json({ error: 'OPENROUTER_API_KEY not configured' })
  }

  try {
    const { model, messages, max_tokens, temperature, session_id, slug } = req.body
    const sessionId = typeof session_id === 'string' ? session_id.trim() : ''
    const clientSlug = typeof slug === 'string' && slug.trim() ? slug.trim().toLowerCase() : 'picasso'

    let dialogueId = null
    const latestUserMessage = Array.isArray(messages)
      ? [...messages].reverse().find((item) => item?.role === 'user' && typeof item?.content === 'string')
      : null

    if (sessionId) {
      try {
        const client = await getClientBySlug(clientSlug)
        if (client?.id) {
          const dialogue = await getOrCreateDialogue(client.id, sessionId)
          dialogueId = dialogue?.id || null

          if (dialogueId && latestUserMessage?.content) {
            await appendMessage(dialogueId, {
              role: 'user',
              content: latestUserMessage.content,
            })
          }
        } else {
          await notifyError('chat_client_not_found', new Error(`Client not found for slug: ${clientSlug}`), {
            sessionId,
            slug: clientSlug,
          })
        }
      } catch (dbError) {
        await notifyError('chat_db_before_openrouter', dbError, { sessionId, slug: clientSlug })
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
      body: JSON.stringify({
        model,
        messages,
        max_tokens,
        temperature,
        tools: CHAT_TOOLS,
        tool_choice: 'auto',
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      return res.status(response.status).json({ error: data.error?.message || 'OpenRouter error' })
    }

    const assistantMessage = data.choices?.[0]?.message || null
    const toolCalls = Array.isArray(assistantMessage?.tool_calls) ? assistantMessage.tool_calls : []
    const assistantReply = assistantMessage?.content || data.error?.message || null

    if (dialogueId && (assistantReply || toolCalls.length > 0)) {
      try {
        let assistantContent = assistantReply || ''

        if (toolCalls.length > 0) {
          const showLeadButtonCall = toolCalls.find((call) => call?.function?.name === 'show_lead_button')
          const callName = showLeadButtonCall?.function?.name || toolCalls[0]?.function?.name || 'unknown'
          const rawArguments = showLeadButtonCall?.function?.arguments || toolCalls[0]?.function?.arguments || '{}'
          const toolMark = `[tool_call:${callName}] ${rawArguments}`
          assistantContent = assistantContent ? `${assistantContent}\n${toolMark}` : toolMark
        }

        await appendMessage(dialogueId, {
          role: 'assistant',
          content: assistantContent,
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
