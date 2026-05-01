import { useState, useRef, useEffect, useContext } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Send, MessageCircle } from 'lucide-react'
import { salesSalonPrompt } from '../../../../prompts/salesSalonPrompt'
import { defaultConfig } from '../../../../configs/_default.config'
import { getOrCreateSessionId } from '../../../../shared/lib/session.js'
import { ConfigContext } from '../../../../shared/contexts/ConfigContext'

function parseToolArguments(raw) {
  if (!raw) return {}
  if (typeof raw === 'object') return raw
  if (typeof raw !== 'string') return {}
  try {
    return JSON.parse(raw)
  } catch {
    return {}
  }
}

function ChatWidget() {
  const configFromContext = useContext(ConfigContext)
  const config = configFromContext || defaultConfig
  const { SURFACE, SURFACE_L, TEXT, MUTED, GOLD, GOLD_DIM, GOLD_BRIGHT, BG, BORDER, BORDER_H, EASE } = config.tokens
  const brandName = config.meta?.brand?.name || config.meta?.name || 'Brand'
  const clientSlug = config.meta?.brand?.slug || config.meta?.slug || 'default'
  const headerLabel = config.features?.chatWidget?.headerLabel || `${brandName} Concierge`
  const greetingTemplate = config.features?.chatWidget?.greeting || 'Здравствуйте! Я цифровой консьерж {{brandName}}. Чем могу помочь?'
  const greetingText = greetingTemplate.replace('{{brandName}}', brandName)

  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([
    { from: 'bot', text: greetingText },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [showTooltip, setShowTooltip] = useState(false)
  const hasBeenOpened = useRef(false)
  const scrollRef = useRef(null)
  const inputRef = useRef(null)
  const widgetRef = useRef(null)

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight
  }, [messages])

  useEffect(() => {
    if (open) {
      hasBeenOpened.current = true
      setShowTooltip(false)
      setTimeout(() => inputRef.current?.focus(), 50)
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [open])

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!hasBeenOpened.current) setShowTooltip(true)
    }, config.features.chatWidget.tooltipDelayMs)
    return () => clearTimeout(timer)
  }, [config.features.chatWidget.tooltipDelayMs])

  useEffect(() => {
    function handleClickOutside(e) {
      if (widgetRef.current && !widgetRef.current.contains(e.target)) {
        setOpen(false)
      }
    }

    if (open) {
      document.addEventListener('mousedown', handleClickOutside)
      document.addEventListener('touchstart', handleClickOutside, { passive: true })
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('touchstart', handleClickOutside)
    }
  }, [open])

  function handleLeadButtonClick(leadService) {
    setOpen(false)
    setShowTooltip(false)
    window.dispatchEvent(new CustomEvent('open-booking-form', {
      detail: { service: leadService },
    }))
  }

  async function handleSend() {
    const text = input.trim()
    if (!text || loading) return
    const sessionId = getOrCreateSessionId()
    const updated = [...messages, { from: 'user', text }]
    setMessages(updated)
    setInput('')
    setLoading(true)
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'openai/gpt-4o-mini',
          slug: clientSlug,
          messages: [
            {
              role: 'system',
              content: salesSalonPrompt,
            },
            ...updated.map((m) => ({
              role: m.from === 'bot' ? 'assistant' : 'user',
              content: m.text,
            })),
          ],
          session_id: sessionId,
          max_tokens: 300,
          temperature: 0.7,
        }),
      })
      if (!res.ok) {
        const err = await res.json().catch(() => null)
        throw new Error(err?.error || `Ошибка ${res.status}`)
      }
      const data = await res.json()
      const modelMessage = data.choices?.[0]?.message || null
      const toolCall = modelMessage?.tool_calls?.[0]
      const hasLeadTool = toolCall?.function?.name === 'show_lead_button'
      const toolArgs = hasLeadTool ? parseToolArguments(toolCall?.function?.arguments) : {}
      const leadService = typeof toolArgs?.service_name === 'string' ? toolArgs.service_name.trim() : ''
      const rawContent = typeof modelMessage?.content === 'string' ? modelMessage.content : ''
      const reply = rawContent.trim() || (!hasLeadTool ? (data.error?.message || 'Попробуйте ещё раз.') : '')

      setMessages([
        ...updated,
        {
          from: 'bot',
          text: reply,
          ...(hasLeadTool ? { showLeadButton: true, leadService: leadService || undefined } : {}),
        },
      ])
    } catch {
      setMessages([...updated, { from: 'bot', text: 'Связь прервалась. Попробуйте снова.' }])
    } finally {
      setLoading(false)
      setTimeout(() => inputRef.current?.focus(), 0)
    }
  }

  return (
    <div ref={widgetRef} className={`fixed z-50 ${open ? 'inset-0 sm:inset-auto sm:bottom-4 sm:right-4' : 'bottom-4 right-4'}`}>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.92 }}
            transition={{ duration: 0.35, ease: EASE }}
            data-lenis-prevent
            className="fixed inset-0 sm:absolute sm:inset-auto sm:right-0 sm:bottom-0 w-full sm:w-[400px] sm:max-w-[calc(100vw-24px)] overflow-hidden flex flex-col sm:rounded-2xl"
            style={{
              background: SURFACE,
              border: `1px solid ${BORDER}`,
              boxShadow: '0 12px 60px rgba(0,0,0,0.5)',
              overscrollBehavior: 'contain',
              touchAction: 'none',
            }}
            onTouchMove={(e) => e.stopPropagation()}
          >
            <div
              className="flex items-center justify-between px-6 py-5"
              style={{ borderBottom: `1px solid ${BORDER}` }}
            >
              <div>
                <p
                  className="font-wow-display text-sm font-semibold"
                  style={{ color: TEXT }}
                >
                  {headerLabel}
                </p>
                <p
                  className="text-[12px] font-wow-body"
                  style={{ color: MUTED }}
                >
                  Онлайн 24/7
                </p>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="cursor-pointer"
                style={{ color: MUTED }}
                aria-label="Закрыть чат"
              >
                <X size={18} />
              </button>
            </div>

            <div
              ref={scrollRef}
              className="flex-1 sm:h-80 sm:flex-none overflow-y-auto px-6 py-5 flex flex-col gap-3"
              style={{ touchAction: 'pan-y', overscrollBehavior: 'contain' }}
              onTouchMove={(e) => e.stopPropagation()}
            >
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={`max-w-[85%] px-4 py-3 text-sm font-wow-body leading-relaxed ${m.from === 'bot' ? 'self-start' : 'self-end'
                    }`}
                  style={{
                    background: m.from === 'bot' ? SURFACE_L : GOLD,
                    color: m.from === 'bot' ? TEXT : BG,
                    borderRadius: 12,
                  }}
                >
                  {m.text}
                  {m.showLeadButton && (
                    <button
                      type="button"
                      onClick={() => handleLeadButtonClick(m.leadService)}
                      className="mt-3 w-full py-3 px-4 text-[12px] uppercase tracking-[0.12em] font-medium transition-all cursor-pointer"
                      style={{
                        background: `linear-gradient(to bottom, ${GOLD_BRIGHT} 0%, ${GOLD} 40%, ${GOLD_DIM} 100%)`,
                        color: BG,
                        borderRadius: 9999,
                        boxShadow:
                          '0 4px 20px rgba(201,168,122,0.12), inset 0 1px 0 rgba(255,255,255,0.2), inset 0 -1px 0 rgba(0,0,0,0.15)',
                        border: 'none',
                      }}
                    >
                      Оставить заявку
                    </button>
                  )}
                </div>
              ))}
              {loading && (
                <div
                  className="self-start max-w-[85%] px-4 py-3 text-sm font-wow-body italic"
                  style={{ background: SURFACE_L, color: MUTED, borderRadius: 12 }}
                >
                  Консьерж подбирает ответ...
                </div>
              )}
            </div>

            <div
              className="px-5 py-4 flex items-center gap-3"
              style={{ borderTop: `1px solid ${BORDER}` }}
            >
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ваш вопрос..."
                className="flex-1 bg-transparent text-sm font-wow-body outline-none"
                style={{ color: TEXT }}
                readOnly={loading}
              />
              <button
                onClick={handleSend}
                disabled={loading || !input.trim()}
                className="shrink-0 cursor-pointer transition-all disabled:opacity-40"
                style={{
                  background: input.trim() ? GOLD : 'transparent',
                  color: input.trim() ? BG : MUTED,
                  border: `1px solid ${input.trim() ? GOLD : BORDER_H}`,
                  borderRadius: 9999,
                  width: 40,
                  height: 40,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
                aria-label="Отправить сообщение"
              >
                <Send size={16} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {!open && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            setOpen(true)
            setShowTooltip(false)
          }}
          aria-label="Открыть чат"
          className="w-14 h-14 flex items-center justify-center cursor-pointer"
          style={{
            background: `linear-gradient(to bottom, ${GOLD_BRIGHT} 0%, ${GOLD} 50%, ${GOLD_DIM} 100%)`,
            color: BG,
            borderRadius: 9999,
            boxShadow:
              '0 4px 30px rgba(201,168,122,0.2), inset 0 1px 0 rgba(255,255,255,0.25), inset 0 -1px 0 rgba(0,0,0,0.15)',
          }}
        >
          <MessageCircle size={20} />
        </motion.button>
      )}

      <AnimatePresence>
        {showTooltip && !open && (
          <motion.div
            initial={{ opacity: 0, x: 10, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 10, scale: 0.9 }}
            transition={{ duration: 0.35, ease: EASE }}
            onClick={() => {
              setOpen(true)
              setShowTooltip(false)
            }}
            className="absolute bottom-4 right-[68px] max-w-[calc(100vw-90px)] sm:max-w-none min-w-[220px] sm:min-w-[280px] px-5 py-3 font-wow-body text-[14px] sm:text-[14px] cursor-pointer whitespace-normal leading-relaxed"
            style={{
              background: SURFACE,
              color: TEXT,
              border: `1px solid ${BORDER_H}`,
              borderRadius: window.innerWidth < 640 ? 16 : 9999,
              boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
            }}
          >
            Я ИИ-консьерж. Помочь подобрать время?
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default ChatWidget
