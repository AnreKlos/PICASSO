import { useState, useRef, useEffect, useCallback } from 'react'
import { Shield, Clock, Coffee, ChevronDown, MessageCircle, X, Send, ArrowRight, Sparkles, Diamond, Scissors, HandMetal, Eye, Flower2, FlaskConical, Star, MapPin, Phone, Clock3, Menu } from 'lucide-react'
import { motion, useScroll, useTransform, useInView, AnimatePresence, useMotionValue, animate } from 'framer-motion'
import Lenis from 'lenis'
import useEmblaCarousel from 'embla-carousel-react'

const EASE = [0.16, 1, 0.3, 1]
const GOLD = '#C9A87A'
const GOLD_DIM = '#A68B5A'
const GOLD_BRIGHT = '#D4B88A'
const TEXT = '#F0EBE3'
const TEXT_SOFT = '#B5AFA7'
const MUTED = '#9A938B'
const BG = '#0E0C0B'
const CHOCOLATE = '#151210'
const SURFACE = '#1A1714'
const SURFACE_L = '#262220'
const BORDER = 'rgba(255,255,255,0.06)'
const BORDER_H = 'rgba(255,255,255,0.14)'

function TiltHeading({ children, className = '', as: Tag = 'h2', style = {} }) {
  const ref = useRef(null)
  const targetRef = useRef({ x: 0, y: 0 })
  const currentRef = useRef({ x: 0, y: 0 })
  const [render, setRender] = useState({ x: 0, y: 0 })
  const [hovering, setHovering] = useState(false)
  const swayAngleRef = useRef(0)
  const frameRef = useRef(null)

  useEffect(() => {
    const isDesktop = window.matchMedia('(hover: hover) and (pointer: fine)').matches

    if (!isDesktop) {
      setRender({ x: 0, y: 0 })
      return
    }

    let lastX = 0
    let lastY = 0

    function animateFrame() {
      swayAngleRef.current += hovering ? 0.02 : 0

      const swayX = hovering ? Math.sin(swayAngleRef.current) * 1.5 : 0
      const swayY = hovering ? Math.cos(swayAngleRef.current * 0.7) * 1.0 : 0

      currentRef.current.x += (targetRef.current.x + swayX - currentRef.current.x) * 0.08
      currentRef.current.y += (targetRef.current.y + swayY - currentRef.current.y) * 0.08

      const nx = Math.round(currentRef.current.x * 100) / 100
      const ny = Math.round(currentRef.current.y * 100) / 100

      if (nx !== lastX || ny !== lastY) {
        lastX = nx
        lastY = ny
        setRender({ x: nx, y: ny })
      }

      frameRef.current = requestAnimationFrame(animateFrame)
    }

    frameRef.current = requestAnimationFrame(animateFrame)

    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current)
    }
  }, [hovering])

  const handleMouseMove = useCallback((e) => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    targetRef.current = { x: y * -5, y: x * 5 }
  }, [])

  return (
    <Tag
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => { targetRef.current = { x: 0, y: 0 }; setHovering(false) }}
      className={`${className} cursor-default select-none will-change-transform`}
      style={{
        ...style,
        transform: `perspective(800px) rotateX(${render.x}deg) rotateY(${render.y}deg) translateZ(0)`,
        textShadow: hovering
          ? `0 0 40px rgba(201,168,122,0.12), 0 4px 20px rgba(0,0,0,0.3)`
          : `0 4px 20px rgba(0,0,0,0.2)`,
      }}
    >
      {children}
    </Tag>
  )
}

function GoldSpan({ children }) {
  const [glow, setGlow] = useState(false)
  return (
    <span
      className="italic inline-block transition-all duration-300 select-none"
      style={{
        color: GOLD,
        textShadow: glow
          ? `0 0 18px rgba(201,168,122,0.3), 0 0 40px rgba(201,168,122,0.1)`
          : 'none',
      }}
      onMouseEnter={() => setGlow(true)}
      onMouseLeave={() => setGlow(false)}
    >
      {children}
    </span>
  )
}

function FadeIn({ children, className = '', delay = 0, direction = 'up', distance = 50 }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-50px' })
  const d = { up: { y: distance }, down: { y: -distance }, left: { x: distance }, right: { x: -distance } }[direction] || { y: distance }
  return (
    <motion.div ref={ref} initial={{ opacity: 0, ...d }} animate={inView ? { opacity: 1, y: 0, x: 0 } : {}} transition={{ duration: 1, ease: EASE, delay }} className={className}>
      {children}
    </motion.div>
  )
}

function MagneticButton({ children, className = '', style = {}, ...rest }) {
  const ref = useRef(null)
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const isDesktop = useRef(false)

  useEffect(() => {
    const mql = window.matchMedia('(hover: hover) and (pointer: fine)')
    isDesktop.current = mql.matches
    const handler = (e) => { isDesktop.current = e.matches }
    mql.addEventListener('change', handler)
    return () => mql.removeEventListener('change', handler)
  }, [])

  const handleMouseMove = useCallback((e) => {
    if (!isDesktop.current || !ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const nx = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2)
    const ny = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2)
    mx.set(Math.round(Math.max(-5, Math.min(5, nx * 5)) * 100) / 100)
    my.set(Math.round(Math.max(-3, Math.min(3, ny * 3)) * 100) / 100)
  }, [mx, my])

  const handleMouseLeave = useCallback(() => {
    animate(mx, 0, { duration: 0.18, ease: [0.16, 1, 0.3, 1] })
    animate(my, 0, { duration: 0.18, ease: [0.16, 1, 0.3, 1] })
  }, [mx, my])

  return (
    <motion.a ref={ref} onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}
      style={{ x: mx, y: my, ...style }} className={className} {...rest}>
      {children}
    </motion.a>
  )
}

function DustParticles({ className = '', density = 1, opacityBoost = 1 }) {
  const canvasRef = useRef(null)
  const frameRef = useRef(null)
  const particlesRef = useRef([])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const isDesktop = window.matchMedia('(min-width: 768px)').matches
    if (!isDesktop) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const setup = () => {
      const parent = canvas.parentElement
      const width = parent?.offsetWidth || window.innerWidth
      const height = parent?.offsetHeight || 600
      const dpr = Math.min(window.devicePixelRatio || 1, 2)

      canvas.width = width * dpr
      canvas.height = height * dpr
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      const fallCount = Math.round(26 * density)
      const driftCount = Math.round(12 * density)
      const largeCount = Math.round(5 * density)

      const particles = []

      for (let i = 0; i < fallCount; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          r: Math.random() * 1.4 + 0.4,
          vx: (Math.random() - 0.5) * 0.06,
          vy: Math.random() * 0.18 + 0.03,
          a: (Math.random() * 0.18 + 0.05) * opacityBoost,
          type: 'fall',
        })
      }

      for (let i = 0; i < driftCount; i++) {
        const dir = i < driftCount / 2 ? 1 : -1
        particles.push({
          x: dir === 1 ? -20 : width + 20,
          y: Math.random() * height,
          r: Math.random() * 1.8 + 0.7,
          vx: dir * (Math.random() * 0.22 + 0.08),
          vy: Math.random() * 0.05 + 0.01,
          a: (Math.random() * 0.22 + 0.08) * opacityBoost,
          type: 'drift',
        })
      }

      for (let i = 0; i < largeCount; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          r: Math.random() * 2.2 + 1.8,
          vx: (Math.random() - 0.5) * 0.02,
          vy: Math.random() * 0.05 + 0.01,
          a: (Math.random() * 0.06 + 0.025) * opacityBoost,
          type: 'large',
        })
      }

      particlesRef.current = particles
    }

    const render = () => {
      const width = canvas.clientWidth
      const height = canvas.clientHeight

      ctx.clearRect(0, 0, width, height)

      for (const p of particlesRef.current) {
        p.x += p.vx
        p.y += p.vy

        if (p.type === 'fall' || p.type === 'large') {
          if (p.y > height + 12) {
            p.y = -12
            p.x = Math.random() * width
          }
          if (p.x > width + 12) p.x = -12
          if (p.x < -12) p.x = width + 12
        }

        if (p.type === 'drift') {
          if (p.vx > 0 && p.x > width + 20) {
            p.x = -20
            p.y = Math.random() * height
          }
          if (p.vx < 0 && p.x < -20) {
            p.x = width + 20
            p.y = Math.random() * height
          }
          if (p.y > height + 12) p.y = -12
        }

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(201,168,122,${Math.min(p.a * 0.55, 0.12)})`
        ctx.fill()
      }

      frameRef.current = requestAnimationFrame(render)
    }

    setup()
    render()

    window.addEventListener('resize', setup, { passive: true })

    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current)
      window.removeEventListener('resize', setup)
    }
  }, [density, opacityBoost])

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 pointer-events-none hidden md:block ${className}`}
      style={{ zIndex: 3, opacity: 0.7, filter: 'blur(1.4px)' }}
      aria-hidden="true"
    />
  )
}

function FAQItem({ q, a, isOpen, onToggle }) {
  return (
    <div style={{ borderBottom: `1px solid ${BORDER}` }}>
      <button onClick={onToggle} className="w-full flex items-center justify-between py-6 text-left group cursor-pointer">
        <span className="font-picasso-display text-lg sm:text-xl font-medium pr-6" style={{ color: TEXT }}>{q}</span>
        <motion.span animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.3, ease: EASE }} className="shrink-0" style={{ color: MUTED }}>
          <ChevronDown size={22} />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.4, ease: EASE }} style={{ overflow: 'hidden' }}>
            <p className="pb-6 leading-relaxed pr-8 text-[15px] font-light" style={{ color: TEXT_SOFT }}>{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function ConciergeWidget() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([
    { from: 'bot', text: 'Здравствуйте! Я цифровой консьерж PICASSO. Чем могу помочь?' },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [showTooltip, setShowTooltip] = useState(false)
  const scrollRef = useRef(null)
  const inputRef = useRef(null)
  const widgetRef = useRef(null)

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight
  }, [messages])

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [open])

  useEffect(() => {
    const timer = setTimeout(() => setShowTooltip(true), 25000)
    return () => clearTimeout(timer)
  }, [])

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

  async function handleSend() {
    const text = input.trim()
    if (!text || loading) return
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
          messages: [
            {
              role: 'system',
              content:
                'Ты — цифровой консьерж премиум салона красоты «PICASSO». Салон полного цикла: парикмахерские услуги, ногтевой сервис, брови, шугаринг, уход за лицом. Отвечай сдержанно, элегантно, как luxury-консультант. Кратко (2-4 предложения), без эмодзи, на «вы». Цены: стрижка от 2000₽, окрашивание от 4500₽, маникюр от 1800₽, архитектура бровей от 1200₽, шугаринг от 800₽, УЗ-чистка от 1500₽, пилинг от 1800₽. СТРОГОЕ ПРАВИЛО: Отвечай только финальным текстом ответа. Никогда не показывай шаги своих рассуждений, анализ, планирование или рассуждения (Analyze, Identify, Consider, Plan и т.д.). Сразу давай готовый ответ.',
            },
            ...updated.map((m) => ({
              role: m.from === 'bot' ? 'assistant' : 'user',
              content: m.text,
            })),
          ],
          max_tokens: 300,
          temperature: 0.7,
        }),
      })
      if (!res.ok) {
        const err = await res.json().catch(() => null)
        throw new Error(err?.error || `Ошибка ${res.status}`)
      }
      const data = await res.json()
      const reply =
        data.choices?.[0]?.message?.content || data.error?.message || 'Попробуйте ещё раз.'
      setMessages([...updated, { from: 'bot', text: reply }])
    } catch {
      setMessages([...updated, { from: 'bot', text: 'Связь прервалась. Попробуйте снова.' }])
    } finally {
      setLoading(false)
      setTimeout(() => inputRef.current?.focus(), 0)
    }
  }

  return (
    <div ref={widgetRef} className="fixed bottom-4 right-4 z-50">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.92 }}
            transition={{ duration: 0.35, ease: EASE }}
            data-lenis-prevent
            className="absolute right-0 w-[320px] sm:w-[400px] max-w-[calc(100vw-24px)] overflow-hidden"
            style={{
              background: SURFACE,
              border: `1px solid ${BORDER}`,
              borderRadius: 16,
              boxShadow: '0 12px 60px rgba(0,0,0,0.5)',
              bottom: 0,
            }}
          >
            <div
              className="flex items-center justify-between px-6 py-5"
              style={{ borderBottom: `1px solid ${BORDER}` }}
            >
              <div>
                <p
                  className="font-picasso-display text-sm font-semibold"
                  style={{ color: TEXT }}
                >
                  PICASSO Concierge
                </p>
                <p
                  className="text-[12px] font-picasso-body"
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
              className="h-80 overflow-y-auto px-6 py-5 flex flex-col gap-3"
            >
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={`max-w-[85%] px-4 py-3 text-sm font-picasso-body leading-relaxed ${m.from === 'bot' ? 'self-start' : 'self-end'
                    }`}
                  style={{
                    background: m.from === 'bot' ? SURFACE_L : GOLD,
                    color: m.from === 'bot' ? TEXT : BG,
                    borderRadius: 12,
                  }}
                >
                  {m.text}
                </div>
              ))}
              {loading && (
                <div
                  className="self-start max-w-[85%] px-4 py-3 text-sm font-picasso-body italic"
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
                className="flex-1 bg-transparent text-sm font-picasso-body outline-none"
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
            className="absolute bottom-4 right-[68px] max-w-[calc(100vw-90px)] sm:max-w-none min-w-[220px] sm:min-w-[280px] px-5 py-3 font-picasso-body text-[14px] sm:text-[14px] cursor-pointer whitespace-normal leading-relaxed"
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

function Nav({ scrollTo, scrollToTop }) {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  const links = [
    { href: '#about', label: 'О салоне' },
    { href: '#services', label: 'Услуги' },
    { href: '#gallery', label: 'Галерея' },
    { href: '#team', label: 'Мастера' },
    { href: '#reviews', label: 'Отзывы' },
    { href: '#faq', label: 'FAQ' },
    { href: '#contacts', label: 'Контакты' },
  ]

  return (
    <motion.nav initial={{ y: -40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.6, ease: EASE }}
      className={`fixed top-0 left-0 right-0 w-full z-40 transition-all duration-500 overflow-hidden ${scrolled ? 'backdrop-blur-lg' : ''}`}
      style={{ background: scrolled ? 'rgba(14,12,11,0.92)' : 'transparent', borderBottom: `1px solid ${scrolled ? BORDER : 'transparent'}` }}>
      <div className="mx-auto max-w-6xl px-5 sm:px-8 flex items-center justify-between h-16">
        <button
          type="button"
          onClick={scrollToTop}
          className="font-picasso-display text-xl font-semibold tracking-[0.08em] select-none cursor-pointer"
          style={{ color: GOLD, textShadow: '0 0 20px rgba(201,168,122,0.15)' }}
        >
          PICASSO
        </button>
        <div className="hidden lg:flex items-center gap-7 font-picasso-body text-[13px] font-medium uppercase tracking-[0.12em]" style={{ color: MUTED }}>
          {links.map(l => <a key={l.href} href={l.href} onClick={(e) => { e.preventDefault(); scrollTo(l.href) }} className="hover:text-[var(--color-picasso-text)] transition-colors duration-200" style={{ color: MUTED }}>{l.label}</a>)}
          <MagneticButton onClick={(e) => { e.preventDefault(); scrollTo('booking') }}
            className="inline-flex items-center gap-2 px-5 py-2 transition-all duration-300 font-picasso-body text-[13px] font-medium uppercase tracking-[0.12em]"
            style={{ background: `linear-gradient(to bottom, ${GOLD_BRIGHT} 0%, ${GOLD} 50%, ${GOLD_DIM} 100%)`, color: BG, borderRadius: 9999, boxShadow: '0 2px 12px rgba(201,168,122,0.15), inset 0 1px 0 rgba(255,255,255,0.2), inset 0 -1px 0 rgba(0,0,0,0.12)' }}>
            Записаться
          </MagneticButton>
        </div>
        <button className="lg:hidden cursor-pointer" style={{ color: TEXT }} onClick={() => setMobileOpen(!mobileOpen)} aria-label={mobileOpen ? 'Закрыть меню' : 'Открыть меню'}>
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
      <AnimatePresence>
        {mobileOpen && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }}
            className="lg:hidden overflow-hidden" style={{ background: 'rgba(14,12,11,0.97)', borderTop: `1px solid ${BORDER}` }}>
            <div className="flex flex-col gap-4 px-6 py-6 font-picasso-body text-[14px] uppercase tracking-[0.1em]" style={{ color: MUTED }}>
              {links.map(l => <a key={l.href} href={l.href} onClick={(e) => { e.preventDefault(); setMobileOpen(false); scrollTo(l.href) }} className="py-1" style={{ color: MUTED }}>{l.label}</a>)}
              <button
                type="button"
                onClick={() => {
                  setMobileOpen(false)
                  scrollTo('booking')
                }}
                className="mt-2 inline-flex items-center justify-center gap-2 px-5 py-3 cursor-pointer"
                style={{ background: GOLD, color: BG, borderRadius: 9999 }}
                aria-label="Перейти к записи"
              >
                Записаться
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}

function TiltGlare({ children, className = '', style = {} }) {
  const ref = useRef(null)
  const tiltRef = useRef({ x: 0, y: 0, glareX: 50, glareY: 50, glareO: 0 })

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const target = { x: 0, y: 0, glareX: 50, glareY: 50, glareO: 0 }
    const current = { x: 0, y: 0, glareX: 50, glareY: 50, glareO: 0 }

    function onMove(e) {
      const rect = el.getBoundingClientRect()
      const px = (e.clientX - rect.left) / rect.width
      const py = (e.clientY - rect.top) / rect.height
      target.x = (py - 0.5) * -8
      target.y = (px - 0.5) * 8
      target.glareX = px * 100
      target.glareY = py * 100
      target.glareO = 0.15
    }

    function onLeave() {
      target.x = 0; target.y = 0; target.glareO = 0
    }

    let frame
    function animate() {
      current.x += (target.x - current.x) * 0.025
      current.y += (target.y - current.y) * 0.025
      current.glareX += (target.glareX - current.glareX) * 0.04
      current.glareY += (target.glareY - current.glareY) * 0.04
      current.glareO += (target.glareO - current.glareO) * 0.02
      el.style.transform = `perspective(800px) rotateX(${current.x}deg) rotateY(${current.y}deg)`
      const glare = el.querySelector('.tilt-glare')
      if (glare) {
        glare.style.background = `radial-gradient(circle at ${current.glareX}% ${current.glareY}%, rgba(255,255,255,${current.glareO}), transparent 60%)`
      }
      frame = requestAnimationFrame(animate)
    }
    frame = requestAnimationFrame(animate)

    el.addEventListener('mousemove', onMove)
    el.addEventListener('mouseleave', onLeave)
    return () => {
      cancelAnimationFrame(frame)
      el.removeEventListener('mousemove', onMove)
      el.removeEventListener('mouseleave', onLeave)
    }
  }, [])

  return (
    <div ref={ref} className={className} style={{ ...style, transformStyle: 'preserve-3d' }}>
      {children}
      <div className="tilt-glare absolute inset-0 pointer-events-none rounded-3xl" style={{ mixBlendMode: 'overlay' }} />
    </div>
  )
}

function Hero({ scrollTo }) {
  const ref = useRef(null)
  const [isMobile, setIsMobile] = useState(false)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const heroY = useTransform(scrollYProgress, [0, 1], isMobile ? [0, 0] : [0, -120])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0])
  const bgY = useTransform(scrollYProgress, [0, 1], [0, 500])
  const midY = useTransform(scrollYProgress, [0, 1], [0, 250])
  const imgY = useTransform(scrollYProgress, [0, 1], isMobile ? [0, 0] : [0, 150])

  useEffect(() => {
    const mql = window.matchMedia('(max-width: 767px)')
    setIsMobile(mql.matches)
    const handler = (e) => setIsMobile(e.matches)
    mql.addEventListener('change', handler)
    return () => mql.removeEventListener('change', handler)
  }, [])

  return (
    <section ref={ref} className="relative min-h-screen flex items-center overflow-hidden" style={{ background: BG }}>

      <div className="absolute inset-0 overflow-hidden pointer-events-none w-full">
        {!isMobile && (
          <>
            <motion.div style={{ y: bgY, willChange: 'transform' }} className="absolute -top-[400px] -bottom-[400px] left-0 right-0">
              <div className="absolute top-[15%] left-[10%] w-[80vw] max-w-[420px] h-[80vw] max-h-[420px] rounded-full blur-[200px]" style={{ background: 'rgba(201,168,122,0.035)' }} />
              <div className="absolute bottom-[10%] right-[5%] w-[70vw] max-w-[360px] h-[70vw] max-h-[360px] rounded-full blur-[160px]" style={{ background: 'rgba(184,146,138,0.025)' }} />
            </motion.div>
            <motion.div style={{ y: midY, willChange: 'transform' }} className="absolute -top-[200px] -bottom-[200px] left-0 right-0">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-[500px] h-[90vw] max-h-[500px] rounded-full blur-[240px]" style={{ background: 'rgba(201,168,122,0.018)' }} />
            </motion.div>
          </>
        )}
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 70% 55% at 50% 42%, rgba(201,168,122,0.05) 0%, transparent 65%)', filter: 'blur(80px)' }} />
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 100% 100% at 50% 50%, transparent 40%, rgba(14,12,11,0.7) 75%, rgba(14,12,11,0.95) 100%)' }} />
        {!isMobile && <DustParticles />}
      </div>

      <div className="relative z-[5] w-full pointer-events-auto">
        <div className="mx-auto max-w-6xl px-5 sm:px-8 flex flex-col lg:flex-row items-center gap-12 lg:gap-16 pt-28 pb-16">
          <div className="flex-1 text-center lg:text-left">
            <motion.div style={{ y: heroY, opacity: heroOpacity, willChange: 'transform' }}>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, ease: EASE }}>
                <p className="font-picasso-body text-[12px] uppercase tracking-[0.4em] mb-8 select-none" style={{ color: GOLD }}>Premium Beauty Studio</p>
              </motion.div>

              <div className="relative">
                <div className="hidden md:block">
                  <div className="smoke-layer smoke-layer-1" />
                  <div className="smoke-layer smoke-layer-2" />
                  <div className="smoke-layer smoke-layer-3" />
                </div>
                <motion.div
                  initial={{ opacity: 0, filter: 'blur(20px) brightness(2.5)' }}
                  animate={{ opacity: 1, filter: 'blur(0px) brightness(1)' }}
                  transition={{ duration: 2, ease: EASE, delay: 0.2 }}
                >
                  <TiltHeading as="h1" className="font-picasso-display font-medium tracking-[-0.01em] leading-[1.1]" style={{ color: TEXT }}>
                    <span className="text-4xl sm:text-5xl lg:text-[3.8rem] xl:text-[4.5rem]" style={{ color: TEXT }}>Салон эстетики</span> <span className="block italic text-5xl sm:text-6xl lg:text-[5.5rem] xl:text-[6.5rem]" style={{
                      color: GOLD,
                      textShadow: `
                    0 1px 0 #A68B5A,
                    0 2px 0 #8A742B,
                    0 3px 0 #6E5D22,
                    0 4px 0 #53491A,
                    0 5px 0 #3D3614,
                    0 6px 14px rgba(0,0,0,0.35),
                    0 12px 40px rgba(201,168,122,0.18),
                    0 0 80px rgba(201,168,122,0.08),
                    0 0 160px rgba(201,168,122,0.03),
                    0 0 260px rgba(201,168,122,0.01)
                  `,
                    }}>PICASSO</span>
                  </TiltHeading>
                </motion.div>
              </div>

              <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: EASE, delay: 0.8 }}
                className="mt-7 font-picasso-body text-lg sm:text-xl font-light leading-relaxed" style={{ color: TEXT_SOFT }}>
                Стрижка, цвет, ногти, брови — полный цикл красоты в одном пространстве
              </motion.p>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: EASE, delay: 0.8 }}
                className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mt-12 overflow-hidden">
                <MagneticButton onClick={(e) => { e.preventDefault(); scrollTo('booking') }}
                  whileHover={{ boxShadow: '0 6px 40px rgba(201,168,122,0.25), inset 0 1px 0 rgba(255,255,255,0.15)' }}
                  whileTap={{ boxShadow: '0 2px 12px rgba(201,168,122,0.15)' }}
                  className="btn-shine group inline-flex items-center justify-center gap-2 px-9 py-4 font-picasso-body text-[13px] font-medium uppercase tracking-[0.14em] transition-all duration-300 cursor-pointer"
                  style={{ background: `linear-gradient(to bottom, ${GOLD_BRIGHT} 0%, ${GOLD} 40%, ${GOLD_DIM} 100%)`, color: BG, borderRadius: 9999, boxShadow: '0 1px 0 rgba(255,255,255,0.25) inset, 0 -2px 0 rgba(0,0,0,0.2) inset, 0 4px 8px rgba(0,0,0,0.3), 0 8px 30px rgba(201,168,122,0.18)', textShadow: '0 1px 2px rgba(0,0,0,0.25)' }}>
                  Онлайн запись <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
                </MagneticButton>
                <MagneticButton onClick={(e) => { e.preventDefault(); scrollTo('gallery') }}
                  whileHover={{ boxShadow: '0 6px 30px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.06)' }}
                  whileTap={{ boxShadow: '0 2px 10px rgba(0,0,0,0.3)' }}
                  className="inline-flex items-center justify-center font-picasso-body text-[13px] font-medium uppercase tracking-[0.14em] px-9 py-4 transition-all duration-300 cursor-pointer"
                  style={{ border: `1px solid ${BORDER_H}`, color: TEXT, borderRadius: 9999, boxShadow: '0 4px 20px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.04), inset 0 -1px 0 rgba(0,0,0,0.2)' }}>
                  Наши работы
                </MagneticButton>
              </motion.div>
            </motion.div>
          </div>

          <div className="flex-1 relative max-w-md lg:max-w-none max-w-full">
            <motion.div
              style={{ y: imgY, willChange: 'transform' }}
              className="relative z-10"
              initial={{ opacity: 0, scale: 1.08, filter: 'blur(20px) brightness(2) saturate(0)' }}
              animate={{ opacity: 1, scale: 1, filter: 'blur(0px) brightness(1) saturate(1)' }}
              transition={{ duration: 2.2, ease: EASE, delay: 0.6 }}
            >

              {/* 1. TiltGlare — это сама физическая карточка. Она вращается и отбрасывает тень */}
              <TiltGlare
                className="relative rounded-3xl"
                style={{ boxShadow: '0 20px 60px rgba(0,0,0,0.5), 0 0 80px rgba(201,168,122,0.04)' }}
              >

                {/* 2. Внутренний слой. Он обрезает фото, но крутится ВМЕСТЕ с TiltGlare */}
                {/* isolation: 'isolate' — магия, которая не даёт углам ломаться в браузере при 3D */}
                <div
                  className="relative rounded-3xl overflow-hidden w-full h-full"
                  style={{
                    isolation: 'isolate',
                    background: '#0E0C0B',
                    transform: 'translateZ(0)',
                    backfaceVisibility: 'hidden',
                    boxShadow: 'inset 0 0 0 2px #0E0C0B',
                  }}
                >
                  <div className="w-full h-full">
                    <img
                      src="/images/hair/hair_1.webp"
                      alt="PICASSO hair styling"
                      className="w-full max-w-full aspect-[3/4] object-cover block rounded-3xl transform-gpu scale-[1.03]"
                      style={{
                        backfaceVisibility: 'hidden',
                        transform: 'translateZ(0)',
                      }}
                    />
                  </div>

                  {/* Градиент затемнения */}
                  <div
                    className="absolute inset-0 pointer-events-none rounded-3xl"
                    style={{ background: 'linear-gradient(to top, rgba(14,12,11,0.7) 0%, transparent 40%), linear-gradient(to right, rgba(14,12,11,0.4) 0%, transparent 30%)' }}
                  />

                </div>
              </TiltGlare>

              {/* Светящиеся пятна лежат сзади (z-[-1]) и просто висят в воздухе, не участвуя во вращении */}
              {!isMobile && <div className="absolute -bottom-6 -left-6 w-32 h-32 rounded-full blur-[60px] pointer-events-none z-[-1]" style={{ background: 'rgba(201,168,122,0.06)' }} />}
              {!isMobile && <div className="absolute -top-4 -right-4 w-24 h-24 rounded-full blur-[40px] pointer-events-none z-[-1]" style={{ background: 'rgba(184,146,138,0.04)' }} />}

            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}

function About() {
  const [lightbox, setLightbox] = useState(null)

  return (
    <section
      id="about"
      className="scroll-mt-12 sm:scroll-mt-20 py-28 sm:py-36 relative overflow-hidden"
      style={{ background: CHOCOLATE }}
    >
      <div className="absolute inset-0 overflow-hidden pointer-events-none w-full">
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70vw] max-w-[380px] h-[70vw] max-h-[380px] rounded-full blur-[200px]"
          style={{ background: 'rgba(201,168,122,0.02)' }}
        />
      </div>

      <div className="mx-auto max-w-6xl px-5 sm:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row items-center lg:items-end gap-16">
          <div className="flex-1 min-w-0">
            <FadeIn>
              <p
                className="font-picasso-body text-[12px] uppercase tracking-[0.4em] mb-5 select-none"
                style={{ color: GOLD }}
              >
                О салоне
              </p>
            </FadeIn>

            <FadeIn delay={0.1}>
              <TiltHeading
                className="font-picasso-display text-3xl sm:text-4xl lg:text-5xl font-medium leading-[1.15]"
                style={{ color: TEXT }}
              >
                Пространство,
                <br />
                где хочется <GoldSpan>оставаться</GoldSpan>
              </TiltHeading>
            </FadeIn>

            <FadeIn delay={0.2}>
              <p
                className="mt-7 text-[16px] font-light leading-relaxed max-w-lg"
                style={{ color: TEXT_SOFT }}
              >
                PICASSO — студия, куда приходят за понятным результатом.
                Мы честно обсуждаем пожелания, подбираем решения под качество волос и кожи,
                работаем только на проверенных составах и держим высокий стандарт чистоты.
                В одном визите можно обновить стрижку и цвет, привести в порядок
                ногти и брови и уйти с ощущением, что о вас действительно позаботились.
              </p>
            </FadeIn>

            <FadeIn delay={0.3}>
              <div className="mt-12 grid grid-cols-2 gap-4 sm:gap-5">
                {[
                  { Icon: Shield, title: 'Абсолютная стерильность' },
                  { Icon: Clock, title: 'Гарантированное качество' },
                  { Icon: Coffee, title: 'Премиальные сервисы' },
                  { Icon: Diamond, title: 'Проф. материалы' },
                ].map((item) => (
                  <div
                    key={item.title}
                    className="group relative overflow-hidden min-h-[150px] px-4 py-6 sm:px-5 sm:py-6 flex flex-col items-center justify-center text-center"
                    style={{
                      border: '1px solid rgba(255,255,255,0.08)',
                      borderRadius: 18,
                      background:
                        'linear-gradient(180deg, rgba(255,255,255,0.035) 0%, rgba(255,255,255,0.018) 100%)',
                      boxShadow:
                        'inset 0 1px 0 rgba(255,255,255,0.04), 0 10px 30px rgba(0,0,0,0.12)',
                    }}
                  >
                    <div
                      className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                      style={{
                        background:
                          'radial-gradient(circle at top left, rgba(201,168,122,0.08), transparent 45%)',
                      }}
                    />

                    <div
                      className="relative w-12 h-12 flex items-center justify-center mb-4 shrink-0"
                      style={{
                        border: `1px solid ${BORDER_H}`,
                        borderRadius: 9999,
                        background:
                          'linear-gradient(180deg, rgba(201,168,122,0.09), rgba(201,168,122,0.03))',
                        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.05)',
                      }}
                    >
                      <item.Icon size={18} style={{ color: GOLD }} strokeWidth={1.5} />
                    </div>

                    <h3
                      className="relative font-picasso-display text-[15px] sm:text-[17px] leading-snug text-center max-w-[14ch]"
                      style={{ color: TEXT }}
                    >
                      {item.title}
                    </h3>
                  </div>
                ))}
              </div>
            </FadeIn>
          </div>

          <div className="flex-1 flex flex-col gap-4">
            <FadeIn>
              <div
                className="group relative overflow-hidden bg-[#050505] cursor-pointer"
                style={{
                  borderRadius: 12,
                  filter:
                    'brightness(0.94) contrast(1.15) saturate(0.87) sepia(0.10) hue-rotate(-8deg)',
                  WebkitMaskImage: 'linear-gradient(to bottom, black 70%, transparent 100%)',
                  maskImage: 'linear-gradient(to bottom, black 70%, transparent 100%)',
                }}
                onClick={() =>
                  setLightbox({
                    src: '/images/interior/whod_s_ulitci.webp',
                    alt: 'Вход в салон PICASSO',
                  })
                }
              >
                <img
                  src="/images/interior/whod_s_ulitci.webp"
                  alt="Вход в салон PICASSO"
                  className="w-full max-w-full h-full object-cover transform-gpu scale-[1.01] group-hover:scale-[1.03] transition-transform duration-500 ease-out aspect-[4/3] pointer-events-none"
                  style={{ backfaceVisibility: 'hidden', willChange: 'transform' }}
                  loading="lazy"
                />
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background:
                      'radial-gradient(ellipse at 50% 40%, rgba(201,168,122,0.11) 0%, rgba(138,106,74,0.08) 50%, transparent 80%)',
                  }}
                />
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{ boxShadow: 'inset 0 0 100px 40px rgba(14,12,11,0.35)' }}
                />
                <div
                  className="absolute inset-0 pointer-events-none transition-opacity duration-500 opacity-40 group-hover:opacity-20"
                  style={{ background: 'rgba(14,12,11,0.4)' }}
                />
              </div>
            </FadeIn>

            <div className="grid grid-cols-2 gap-4">
              <FadeIn delay={0.1}>
                <div
                  className="group relative overflow-hidden bg-[#050505] cursor-pointer"
                  style={{
                    borderRadius: 12,
                    filter: 'brightness(0.75) contrast(1.15) saturate(0.85)',
                    WebkitMaskImage: 'linear-gradient(to bottom, black 60%, transparent 100%)',
                    maskImage: 'linear-gradient(to bottom, black 60%, transparent 100%)',
                  }}
                  onClick={() =>
                    setLightbox({
                      src: '/images/interior/kabinet_1.webp',
                      alt: 'Кабинет салона',
                    })
                  }
                >
                  <img
                    src="/images/interior/kabinet_1.webp"
                    alt="Кабинет салона"
                    className="w-full max-w-full h-full object-cover transform-gpu scale-[1.01] group-hover:scale-[1.03] transition-transform duration-500 ease-out aspect-square pointer-events-none"
                    style={{ backfaceVisibility: 'hidden', willChange: 'transform' }}
                    loading="lazy"
                  />
                  <div
                    className="absolute inset-0 pointer-events-none transition-opacity duration-500 opacity-40 group-hover:opacity-20"
                    style={{ background: 'rgba(14,12,11,0.4)' }}
                  />
                </div>
              </FadeIn>

              <FadeIn delay={0.15}>
                <div
                  className="group relative overflow-hidden bg-[#050505] cursor-pointer"
                  style={{
                    borderRadius: 12,
                    filter: 'brightness(0.75) contrast(1.15) saturate(0.85)',
                    WebkitMaskImage: 'linear-gradient(to bottom, black 60%, transparent 100%)',
                    maskImage: 'linear-gradient(to bottom, black 60%, transparent 100%)',
                  }}
                  onClick={() =>
                    setLightbox({
                      src: '/images/interior/pritmnaya.webp',
                      alt: 'Интерьер салона',
                    })
                  }
                >
                  <img
                    src="/images/interior/pritmnaya.webp"
                    alt="Интерьер салона"
                    className="w-full max-w-full h-full object-cover transform-gpu scale-[1.01] group-hover:scale-[1.03] transition-transform duration-500 ease-out aspect-square pointer-events-none"
                    style={{ backfaceVisibility: 'hidden', willChange: 'transform' }}
                    loading="lazy"
                  />
                  <div
                    className="absolute inset-0 pointer-events-none transition-opacity duration-500 opacity-40 group-hover:opacity-20"
                    style={{ background: 'rgba(14,12,11,0.4)' }}
                  />
                </div>
              </FadeIn>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {lightbox && (
          <Lightbox
            src={lightbox.src}
            alt={lightbox.alt}
            onClose={() => setLightbox(null)}
          />
        )}
      </AnimatePresence>
    </section>
  )
}

function ServiceCard({ Icon, title, desc, image, featured }) {
  const [showLightbox, setShowLightbox] = useState(false)
  const cardRef = useRef(null)

  const { scrollYProgress } = useScroll({ target: cardRef, offset: ['start end', 'end start'] })
  const [isMobile, setIsMobile] = useState(false)
  useEffect(() => {
    const mql = window.matchMedia('(max-width: 767px)')
    setIsMobile(mql.matches)
    const handler = (e) => setIsMobile(e.matches)
    mql.addEventListener('change', handler)
    return () => mql.removeEventListener('change', handler)
  }, [])
  const imgY = 0

  if (featured) {
    return (
      <FadeIn>
        <div ref={cardRef} className="group bg-[#050505] cursor-pointer" style={{ borderRadius: 16 }}
          onClick={() => setShowLightbox(true)}>
          <div
            className="relative overflow-hidden aspect-[4/3] sm:aspect-[16/9]"
            style={{
              borderRadius: 16,
              backgroundColor: '#0E0C0B',
              // ЖЁСТКИЙ ФИКС БЕЛЫХ ПОЛОС НА КРАЯХ:
              transform: 'translateZ(0)',
              boxShadow: 'inset 0 0 0 1.5px #0E0C0B' // эта тень перекроет всё светлое по краям
            }}
          >
            <motion.div
              style={{
                y: imgY,
                willChange: 'transform',
                inset: '-6px',
                transform: 'translateZ(0)',
                backfaceVisibility: 'hidden',
              }}
              className="absolute"
            >
              <img
                src={image} alt={title}
                className="block w-full h-full object-cover transform-gpu scale-[1.24] group-hover:scale-[1.26] transition-transform duration-500 ease-out pointer-events-none"
                style={{
                  backfaceVisibility: 'hidden',
                  willChange: 'transform',
                  transform: 'translateZ(0)',
                }}
                loading="lazy"
              />
            </motion.div>
            <div className="absolute inset-0 pointer-events-none transition-opacity duration-500 opacity-30 group-hover:opacity-10" style={{ background: 'rgba(14,12,11,0.35)' }} />
            <div className="absolute inset-0" style={{ background: isMobile ? 'linear-gradient(to top, rgba(14,12,11,0.96) 0%, rgba(14,12,11,0.88) 38%, rgba(14,12,11,0.52) 58%, rgba(14,12,11,0.12) 100%)' : 'linear-gradient(to top, rgba(14,12,11,0.95) 0%, rgba(14,12,11,0.7) 50%, transparent 80%)' }} />
            <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 flex items-center justify-center" style={{ border: `1px solid ${BORDER_H}`, borderRadius: 9999, background: 'rgba(201,168,122,0.06)' }}>
                  <Icon size={18} style={{ color: GOLD }} strokeWidth={1.5} />
                </div>
                <p className="font-picasso-body text-[11px] uppercase tracking-[0.2em]" style={{ color: GOLD }}>Главное направление</p>
              </div>
              <h3 className="font-picasso-display text-2xl sm:text-3xl font-medium" style={{ color: TEXT, textShadow: isMobile ? '0 2px 10px rgba(0,0,0,0.85), 0 1px 2px rgba(0,0,0,0.9)' : 'none' }}>{title}</h3> {/* Added line-clamp to desc */}
              <p className="mt-3 text-[15px] font-light leading-relaxed max-w-md line-clamp-3 sm:line-clamp-4" style={{ color: isMobile ? '#E8E0D6' : TEXT_SOFT, textShadow: isMobile ? '0 2px 8px rgba(0,0,0,0.9)' : 'none' }}>{desc}</p>
            </div>
          </div>
        </div>
        <AnimatePresence>
          {showLightbox && <Lightbox src={image} alt={title} onClose={() => setShowLightbox(false)} />}
        </AnimatePresence>
      </FadeIn>
    )
  }

  return (
    <FadeIn>
      <div className="group h-full bg-[#050505] transition-[box-shadow] duration-300 group-hover:shadow-[0_4px_24px_rgba(201,168,122,0.06)]" style={{ borderRadius: 16 }}>
        <div className="p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 flex items-center justify-center" style={{ border: `1px solid ${BORDER_H}`, borderRadius: 9999, background: 'rgba(201,168,122,0.06)' }}>
              <Icon size={18} style={{ color: GOLD }} strokeWidth={1.5} />
            </div>
            <h3 className="font-picasso-display text-lg font-medium" style={{ color: TEXT }}>{title}</h3> {/* Added line-clamp to desc */}
          </div>
          <p className="text-[14px] font-light leading-relaxed line-clamp-3 sm:line-clamp-4" style={{ color: TEXT_SOFT }}>{desc}</p>
        </div>
      </div>
    </FadeIn>
  )
}

function Services() {
  return (
    <section id="services" className="scroll-mt-0 py-28 sm:py-36" style={{ background: BG, scrollMarginTop: '-260px' }}>
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <FadeIn>
          <p className="font-picasso-body text-[12px] uppercase tracking-[0.4em] mb-5 select-none text-center" style={{ color: GOLD }}>Направления</p>
        </FadeIn>
        <FadeIn delay={0.1}>
          <TiltHeading className="font-picasso-display text-3xl sm:text-4xl lg:text-5xl font-medium text-center leading-[1.15]" style={{ color: TEXT }}>
            Полный цикл <GoldSpan>красоты</GoldSpan>
          </TiltHeading>
        </FadeIn>
        <FadeIn delay={0.2}>
          <p className="mt-6 text-center text-base font-light leading-relaxed max-w-md mx-auto" style={{ color: TEXT_SOFT }}>
            Пять миров эстетики под одной крышей
          </p>
        </FadeIn>

        <div className="mt-16 flex flex-col gap-5">
          <ServiceCard Icon={Scissors} title="Hair — Парикмахерские услуги"
            desc="Стрижки, окрашивание, кератин, укладки — главное направление PICASSO. Мастера-стилисты создают образ, который подчёркивает вашу индивидуальность."
            image="/images/services/kabinet_parikmaherskaya.webp" featured />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <ServiceCard Icon={HandMetal} title="Nail сервис"
              desc="Маникюр, педикюр, наращивание, дизайн. Премиальные материалы и техника выравнивания." />
            <ServiceCard Icon={Eye} title="Брови"
              desc="Архитектура, ламинирование, окрашивание. Форма, которая работает на ваш образ." />
            <ServiceCard Icon={Flower2} title="Шугаринг"
              desc="Депиляция сахарной пастой. Мягко, бережно, для всех зон." />
            <ServiceCard Icon={FlaskConical} title="Уход за лицом"
              desc="УЗ-чистка, кислотные пилинги, маски. Здоровая кожа — основа красоты." />
          </div>
        </div>
      </div>
    </section>
  )
}

function DirectionCard({ Icon, title, tagline, items, isOpen, onToggle, delay = 0 }) {
  return (
    <FadeIn delay={delay}>
      <div className="group cursor-pointer transition-[box-shadow,border-color] duration-300"
        style={{ background: SURFACE, border: `1px solid ${isOpen ? BORDER_H : BORDER}`, borderRadius: 16, overflow: 'hidden' }}
        onClick={onToggle}>
        <div className="px-6 sm:px-7 py-6 flex items-center gap-5">
          <div className="w-12 h-12 shrink-0 flex items-center justify-center" style={{ border: `1px solid ${BORDER_H}`, borderRadius: 9999, background: 'rgba(201,168,122,0.04)' }}>
            <Icon size={20} style={{ color: GOLD }} strokeWidth={1.5} />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-picasso-display text-lg sm:text-xl font-medium" style={{ color: TEXT }}>{title}</h3>
            <p className="mt-0.5 text-[13px] font-light truncate" style={{ color: MUTED }}>{tagline}</p>
          </div>
          <motion.span animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.3, ease: EASE }} className="shrink-0" style={{ color: MUTED }}>
            <ChevronDown size={20} />
          </motion.span>
        </div>
        <AnimatePresence initial={false}>
          {isOpen && (
            <motion.div key="content" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.4, ease: EASE }} style={{ overflow: 'hidden' }}>
              <div className="px-6 sm:px-7 pb-6">
                <div style={{ borderTop: `1px solid ${BORDER}`, paddingTop: 20 }} className="flex flex-col gap-4">
                  {items.map((item) => (
                    <div key={item.name} className="flex items-baseline gap-3 flex-wrap">
                      <span className="font-picasso-body text-[14px] sm:text-[15px] font-light" style={{ color: TEXT_SOFT }}>{item.name}</span>
                      <span className="hidden sm:inline flex-1 border-b min-w-[30px] mb-1" style={{ borderColor: 'rgba(255,255,255,0.04)', borderStyle: 'dotted' }} />
                      <span className="font-picasso-body text-[14px] sm:text-[15px] font-light shrink-0" style={{ color: GOLD }}>{item.price}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </FadeIn>
  )
}

function Prices() {
  const [openIdx, setOpenIdx] = useState(0)
  const directions = [
    {
      Icon: Scissors, title: 'Hair — Парикмахерские услуги', tagline: 'Стрижки, окрашивание, кератин, укладки', items: [
        { name: 'Женская стрижка', price: 'от 2 000 ₽' },
        { name: 'Окрашивание (однотонное)', price: 'от 4 500 ₽' },
        { name: 'Кератиновое выпрямление', price: 'от 5 000 ₽' },
        { name: 'Укладка / вечерняя', price: 'от 1 500 ₽' },
      ]
    },
    {
      Icon: HandMetal, title: 'Nail сервис', tagline: 'Маникюр, педикюр, наращивание, дизайн', items: [
        { name: 'Маникюр «Всё включено»', price: 'от 1 800 ₽' },
        { name: 'Smart-педикюр', price: 'от 2 200 ₽' },
        { name: 'Наращивание ногтей', price: 'от 3 000 ₽' },
        { name: 'Дизайн (Nail Art)', price: 'от 500 ₽' },
      ]
    },
    {
      Icon: Eye, title: 'Брови', tagline: 'Архитектура, ламинирование, окрашивание', items: [
        { name: 'Архитектура бровей', price: 'от 1 200 ₽' },
        { name: 'Ламинирование + ботокс', price: 'от 1 500 ₽' },
        { name: 'Окрашивание (хна/краска)', price: 'от 600 ₽' },
      ]
    },
    {
      Icon: Flower2, title: 'Шугаринг', tagline: 'Депиляция сахарной пастой', items: [
        { name: 'Ноги полностью', price: 'от 1 800 ₽' },
        { name: 'Руки до локтя', price: 'от 700 ₽' },
        { name: 'Бикини (классика)', price: 'от 1 200 ₽' },
      ]
    },
    {
      Icon: FlaskConical, title: 'Уход за лицом', tagline: 'УЗ-чистка, пилинги, маски', items: [
        { name: 'УЗ-чистка лица', price: 'от 1 500 ₽' },
        { name: 'Молочный пилинг', price: 'от 1 800 ₽' },
        { name: 'Ретиноевый пилинг', price: 'от 3 000 ₽' },
      ]
    },
  ]

  return (
    <section id="prices" className="scroll-mt-20 py-28 sm:py-36" style={{ background: CHOCOLATE }}>
      <div className="mx-auto max-w-2xl px-5 sm:px-8">
        <FadeIn>
          <p className="font-picasso-body text-[12px] uppercase tracking-[0.4em] mb-5 select-none text-center" style={{ color: GOLD }}>Прайс</p>
        </FadeIn>
        <FadeIn delay={0.1}>
          <TiltHeading className="font-picasso-display text-3xl sm:text-4xl lg:text-5xl font-medium text-center leading-[1.15]" style={{ color: TEXT }}>
            Направления <GoldSpan>эстетики</GoldSpan>
          </TiltHeading>
        </FadeIn>
        <div className="mt-16 flex flex-col gap-4">
          {directions.map((d, i) => (
            <DirectionCard key={d.title} {...d} isOpen={openIdx === i} onToggle={() => setOpenIdx(openIdx === i ? -1 : i)} delay={i * 0.07} />
          ))}
        </div>
      </div>
    </section>
  )
}

function Lightbox({ src, alt, onClose }) {
  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [onClose])

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}
      className="fixed inset-0 z-[60] w-full h-[100dvh] flex items-center justify-center overflow-hidden cursor-pointer"
      style={{ background: 'rgba(0,0,0,0.92)', backdropFilter: 'blur(20px)' }}
      onClick={onClose}>
      <motion.img
        initial={{ scale: 0.85, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.85, opacity: 0 }}
        transition={{ duration: 0.35, ease: EASE }}
        src={src} alt={alt} className="block max-w-[95vw] max-h-[80vh] w-auto h-auto object-contain pointer-events-none" style={{ borderRadius: 8 }} />
      <button onClick={onClose} className="absolute top-6 right-6 w-10 h-10 flex items-center justify-center cursor-pointer" aria-label="Закрыть"
        style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 9999, color: TEXT }}>
        <X size={18} />
      </button>
    </motion.div>
  )
}

function Gallery() {
  const [lightbox, setLightbox] = useState(null) 
  const [selectedIndex, setSelectedIndex] = useState(0)

  const works = [
    { src: '/images/hair/hair_1.webp', alt: 'Окрашивание волос в салоне PICASSO' },
    { src: '/images/hair/hair_2.webp', alt: 'Женская стрижка и укладка в салоне PICASSO' },
    { src: '/images/hair/hair_3.webp', alt: 'Преображение волос после окрашивания' },
    { src: '/images/hair/hair_4.webp', alt: 'Сложное окрашивание волос' },
    { src: '/images/hair/hair_5.webp', alt: 'Укладка волос после салонного ухода' },
    { src: '/images/hair/hair_6.webp', alt: 'Результат работы мастеров PICASSO' },
  ]

  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: 'center',
    skipSnaps: false,
    dragFree: false,
  })

  const onSelect = useCallback(() => {
    if (!emblaApi) return
    setSelectedIndex(emblaApi.selectedScrollSnap())
  }, [emblaApi])

  useEffect(() => {
    if (!emblaApi) return
    onSelect()
    emblaApi.on('select', onSelect)
    emblaApi.on('reInit', onSelect)
    return () => {
      emblaApi.off('select', onSelect)
      emblaApi.off('reInit', onSelect)
    }
  }, [emblaApi, onSelect])

  useEffect(() => {
    if (!emblaApi) return
    const id = setInterval(() => emblaApi.scrollNext(), 4000)
    return () => clearInterval(id)
  }, [emblaApi])

  function scrollPrev() { emblaApi?.scrollPrev() }
  function scrollNext() { emblaApi?.scrollNext() }

  return (
    <section id="gallery" className="scroll-mt-20 sm:scroll-mt-24 py-28 sm:py-36" style={{ background: BG }}>
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <FadeIn>
          <p className="font-picasso-body text-[12px] uppercase tracking-[0.4em] mb-5 select-none text-center" style={{ color: GOLD }}>Портфолио</p>
        </FadeIn>
        <FadeIn delay={0.1}>
          <TiltHeading className="font-picasso-display text-3xl sm:text-4xl lg:text-5xl font-medium text-center leading-[1.15]" style={{ color: TEXT }}>
            Наши <GoldSpan>работы</GoldSpan>
          </TiltHeading>
        </FadeIn>
        <FadeIn delay={0.2}>
          <p className="mt-6 text-center text-base font-light leading-relaxed max-w-lg mx-auto" style={{ color: TEXT_SOFT }}>
            Каждая работа — отражение мастерства и вашего стиля
          </p>
        </FadeIn>

        <div className="mt-20 relative">
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex items-center" style={{ gap: '1.5rem' }}>
              {works.map((w, i) => (
                <div key={i} className="embla-slide shrink-0 flex items-center justify-center"
                  style={{ flex: '0 0 70%', maxWidth: 420 }}>
                  <div
                    className="w-full overflow-hidden cursor-pointer relative transition-[transform,opacity,filter] duration-500"
                    style={{
                      aspectRatio: '3/4',
                      borderRadius: i === selectedIndex ? 20 : 16,
                      border: `1px solid ${i === selectedIndex ? BORDER_H : BORDER}`,
                      transform: `scale(${i === selectedIndex ? 1 : 0.88})`,
                      opacity: i === selectedIndex ? 1 : 0.5,
                      filter: i === selectedIndex ? 'brightness(1)' : 'brightness(0.55)',
                    }}
                    onClick={() => {
                      if (i === selectedIndex) setLightbox({ src: w.src, alt: w.alt })
                      else emblaApi?.scrollTo(i)
                    }}>
                    <img src={w.src} alt={w.alt} className="w-full max-w-full h-full object-cover" loading="lazy" draggable={false} />
                    <div className="absolute inset-0" style={{
                      background: i === selectedIndex
                        ? 'linear-gradient(to top, rgba(14,12,11,0.5) 0%, transparent 35%)'
                        : 'linear-gradient(to top, rgba(14,12,11,0.7) 0%, transparent 30%)',
                    }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button onClick={scrollPrev}
            aria-label="Предыдущее фото"
            className="absolute left-0 sm:left-2 top-1/2 -translate-y-1/2 z-20 w-10 h-10 flex items-center justify-center cursor-pointer transition-opacity opacity-40 hover:opacity-80"
            style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 9999, color: TEXT }}>
            <ChevronDown size={18} style={{ transform: 'rotate(90deg)' }} />
          </button>
          <button onClick={scrollNext}
            aria-label="Следующее фото"
            className="absolute right-0 sm:right-2 top-1/2 -translate-y-1/2 z-20 w-10 h-10 flex items-center justify-center cursor-pointer transition-opacity opacity-40 hover:opacity-80"
            style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 9999, color: TEXT }}>
            <ChevronDown size={18} style={{ transform: 'rotate(-90deg)' }} />
          </button>
        </div>

        <div className="flex justify-center gap-2 mt-8">
          {works.map((_, i) => (
            <button key={i} onClick={() => emblaApi?.scrollTo(i)} aria-label={`Перейти к слайду ${i + 1}`}
              className="w-12 h-12 flex items-center justify-center cursor-pointer"
            >
              <span
                className="w-2 h-2 rounded-full transition-all duration-300 block"
                style={{ background: i === selectedIndex ? GOLD : `${MUTED}40`, transform: i === selectedIndex ? 'scale(1.4)' : 'scale(1)' }} />
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {lightbox && <Lightbox src={lightbox.src} alt={lightbox.alt} onClose={() => setLightbox(null)} />}
      </AnimatePresence>
    </section>
  )
}

function MasterModal({ master, onClose }) {
  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') onClose() }
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleKey)
    return () => { document.body.style.overflow = ''; window.removeEventListener('keydown', handleKey) }
  }, [onClose])

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 w-full h-[100dvh] overflow-hidden cursor-pointer"
      style={{ background: 'rgba(0,0,0,0.88)', backdropFilter: 'blur(20px)' }}
      onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 30, scale: 0.95 }}
        transition={{ duration: 0.4, ease: EASE }}
        className="w-full max-w-[90vw] sm:max-w-3xl max-h-[90vh] overflow-y-auto cursor-default"
        style={{ background: SURFACE, border: `1px solid ${BORDER_H}`, borderRadius: 20 }}
        onClick={(e) => e.stopPropagation()}
        data-lenis-prevent>
        <div className="flex flex-col sm:flex-row gap-8 p-6 sm:p-8">
          <div className="shrink-0 sm:w-[220px] max-h-[40vh] sm:max-h-none overflow-hidden" style={{ borderRadius: 12 }}>
            <img src={master.image} alt={master.name} className="w-full max-w-[90vw] sm:max-w-full h-full aspect-[3/4] object-cover pointer-events-none" style={{ borderRadius: 12 }} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-picasso-body text-[11px] uppercase tracking-[0.2em] mb-2" style={{ color: GOLD }}>{master.role}</p>
            <h3 className="font-picasso-display text-2xl sm:text-3xl font-medium mb-1" style={{ color: TEXT }}>{master.name}</h3>
            <p className="text-[14px] font-light mb-6" style={{ color: MUTED }}>{master.exp}</p>
            <div className="flex flex-col gap-y-2">
              {master.details.map((d, i) => (
                <div key={i} className="flex items-start gap-3">
                  <span className="mt-[7px] shrink-0 w-1.5 h-1.5 rounded-full" style={{ background: GOLD }} />
                  <p className="text-[14px] font-light leading-relaxed" style={{ color: TEXT_SOFT }}>{d}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
        <button onClick={onClose} className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center cursor-pointer" aria-label="Закрыть информацию о мастере"
          style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 9999, color: TEXT }}>
          <X size={18} />
        </button>
      </motion.div>
    </motion.div>
  )
}

function Team() {
  const [selectedMaster, setSelectedMaster] = useState(null)
  const masters = [
    {
      name: 'Юлия Котомина', role: 'Мастер-универсал', exp: 'Опыт 15+ лет', specialty: 'Стрижки, окрашивания, свадебный стилист',
      image: '/images/team/yulia_kotomina.webp',
      details: [
        'Опыт работы 15 лет',
        'Стрижки женские и мужские любой сложности, сложные окрашивания',
        'Свадебный стилист — причёски, макияж',
        '09.10.2015 — программа «Базовый визаж», квалификация визажист',
        '05.12.2018 — «Окрашивание в технике Airtouch» — Светлова Оксана',
        '18.04.2019 — семинар «Роскошь блонда» — Ольшанская Лола',
        '02.03.2020 — «Свадебный стилист. Текстура и форма» — А. М. Саядян',
        '05.07.2021 — международный Академический Базовый Онлайн-курс по причёскам G. Кот',
      ],
    },
    {
      name: 'Виктория Бобкова', role: 'Топ-стилист', exp: 'Опыт 8+ лет', specialty: 'Окрашивание, сложные стрижки, кератин',
      image: '/images/team/viktoria_bobkova.webp',
      details: [
        '2017–2020 ГБПОУ Брянский Техникум Профессиональных технологий и Сферы услуг — парикмахер-модельер 4 разряда',
        'С 2019 — работает в студии PICASSO',
        '2018 — 1 место, 4-й открытый чемпионат Брянской области «Хрустальные ножницы» (Юниоры)',
        '2019 — 1 место, 5-й открытый чемпионат Брянской области «Хрустальные ножницы» (Юниоры)',
        '2020 — 2 место, 4-й открытый региональный чемпионат «Молодые профессионалы» WorldSkills Russia',
        'Мастер-класс «Роскошь блонда» — Лола Ольшанская, Москва',
        'Обучение «Наращивание волос» — Мария Зотова',
        'Обучение «Колористика» — Мария Зотова',
        'Сложные окрашивания: Airtouch, шатуш, мелирование',
        'Окрашивание в тон, наращивание волос, все виды стрижек, современные мужские стрижки',
        'Процедуры для волос: ботокс, протеин, восстановление',
        'Подбор домашнего ухода, коррекция и окрашивание бровей',
      ],
    },
    { name: 'Место в команде', role: 'Мы ищем мастеров', exp: 'PICASSO растёт', specialty: 'Присоединяйтесь к нашей команде', image: '/images/team/PICASSO_JOB.webp', details: [] },
  ]

  return (
    <section id="team" className="scroll-mt-20 py-28 sm:py-36" style={{ background: CHOCOLATE, scrollMarginTop: '-20px' }}>
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <FadeIn>
          <p className="font-picasso-body text-[12px] uppercase tracking-[0.4em] mb-5 select-none text-center" style={{ color: GOLD }}>Команда</p>
        </FadeIn>
        <FadeIn delay={0.1}>
          <TiltHeading className="font-picasso-display text-3xl sm:text-4xl lg:text-5xl font-medium text-center leading-[1.15]" style={{ color: TEXT }}>
            Наши <GoldSpan>мастера</GoldSpan>
          </TiltHeading>
        </FadeIn>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-20">
          {masters.map((m, i) => (
            <FadeIn key={m.name} delay={i * 0.1}>
              <div className="group overflow-hidden h-full bg-[#050505]" style={{ borderRadius: 16 }}
                onClick={() => m.details.length > 0 ? setSelectedMaster(m) : undefined}>
                <div className="relative w-full aspect-[3/4] max-h-[55vh] sm:max-h-none overflow-hidden cursor-pointer">
                  {m.image ? (
                    <img src={m.image} alt={m.name} className="w-full h-full object-cover transform-gpu scale-[1.01] group-hover:scale-[1.03] transition-transform duration-500 ease-out pointer-events-none" style={{ backfaceVisibility: 'hidden', willChange: 'transform' }} loading="lazy" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center" style={{ background: `linear-gradient(145deg, ${SURFACE_L} 0%, ${SURFACE} 100%)` }}>
                      <Sparkles size={36} style={{ color: `${GOLD}15` }} strokeWidth={1} />
                    </div>
                  )}
                  <div className="absolute inset-0 pointer-events-none transition-opacity duration-500 opacity-25 group-hover:opacity-5" style={{ background: 'rgba(14,12,11,0.35)' }} />
                  <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(14,12,11,0.95) 0%, rgba(14,12,11,0.5) 35%, transparent 55%)' }} />
                  <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6">
                    <p className="font-picasso-body text-[11px] uppercase tracking-[0.2em] mb-2" style={{ color: GOLD }}>{m.role}</p>
                    <h3 className="font-picasso-display text-lg sm:text-xl font-medium" style={{ color: TEXT }}>{m.name}</h3>
                    <p className="mt-1 text-[12px] sm:text-[13px] font-light" style={{ color: TEXT_SOFT }}>{m.exp}</p>
                    <p className="mt-2 text-[12px] sm:text-[13px] font-light" style={{ color: MUTED }}>{m.specialty}</p>
                    {m.details.length > 0 && (
                      <span className="mt-3 inline-block font-picasso-body text-[11px] sm:text-[12px] uppercase tracking-[0.14em] cursor-pointer transition-opacity hover:opacity-70"
                        style={{ color: GOLD }}>Подробнее →</span>
                    )}
                  </div>
                </div>
                {m.details.length > 0 && (
                  <div className="md:hidden p-4">
                    <div className="flex flex-col gap-2">
                      {m.details.slice(0, 3).map((d, j) => (
                        <div key={j} className="flex items-start gap-2">
                          <span className="mt-[6px] shrink-0 w-1.5 h-1.5 rounded-full" style={{ background: GOLD }} />
                          <p className="text-[12px] font-light leading-snug break-words min-w-0" style={{ color: TEXT_SOFT }}>{d}</p>
                        </div>
                      ))}
                      <span onClick={(e) => { e.stopPropagation(); setSelectedMaster(m) }} className="mt-1 font-picasso-body text-[11px] uppercase tracking-[0.14em] cursor-pointer" style={{ color: GOLD }}>Ещё →</span>
                    </div>
                  </div>
                )}
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
      <AnimatePresence>
        {selectedMaster && <MasterModal master={selectedMaster} onClose={() => setSelectedMaster(null)} />}
      </AnimatePresence>
    </section>
  )
}

function Reviews() {
  const reviews = [
    { text: 'Удобное расположение. Приятный персонал. Была на стрижке – всё быстро и качественно. Приятная музыка и интересные разговоры. Если нужно, всегда помогут с Wi‑Fi.', author: 'Евгения К.' },
    { text: 'Лучшие салоны Фокинского района, очень порядочные мастера, как профессионалы и как люди.', author: 'Михаил С.' },
    { text: 'Уютная студия. Девочки всегда проконсультируют перед записью на процедуру. Хожу уже 5 лет, и детей на стрижку – только сюда.', author: 'Анна' },
    { text: 'Уже лет 5 хожу только к Виктории – лучший мастер. У неё много наград, и она заняла 1 место по причёскам. От окрашивания бровей до наращивания волос на каре – всё нравится.', author: 'Ольга' },
  ]

  return (
    <section id="reviews" className="scroll-mt-20 py-28 sm:py-36" style={{ background: BG, scrollMarginTop: '-10px' }}>
      <div className="mx-auto max-w-5xl px-5 sm:px-8">
        <FadeIn>
          <p className="font-picasso-body text-[12px] uppercase tracking-[0.4em] mb-5 select-none text-center" style={{ color: GOLD }}>Отзывы</p>
        </FadeIn>
        <FadeIn delay={0.1}>
          <TiltHeading className="font-picasso-display text-3xl sm:text-4xl lg:text-5xl font-medium text-center leading-[1.15]" style={{ color: TEXT }}>
            Нам <GoldSpan>доверяют</GoldSpan>
          </TiltHeading>
        </FadeIn>
        <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 gap-6">
          {reviews.map((r, i) => (
            <FadeIn key={i} delay={i * 0.08} className="flex">
              <div
                className="group p-7 flex flex-col flex-1 bg-[#050505] transition-[box-shadow] duration-300 group-hover:shadow-[0_4px_20px_rgba(201,168,122,0.05)]" style={{ borderRadius: 16 }}>
                <div className="flex gap-1 mb-5">
                  {[...Array(5)].map((_, j) => <Star key={j} size={14} fill={GOLD} style={{ color: GOLD }} />)}
                </div>
                <p className="text-[15px] font-light leading-relaxed flex-1" style={{ color: TEXT_SOFT }}>{r.text}</p>
                <div className="mt-6">
                  <p className="font-picasso-display text-sm font-medium" style={{ color: TEXT }}>{r.author}</p>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  )
}

function FAQ() {
  const [openIdx, setOpenIdx] = useState(null)
  const faqs = [
    { q: 'Работаете ли вы со сложными окрашиваниями — выход из чёрного, тотал блонд?', a: 'Да, это наша специализация. Мы используем плекс-системы и защитные добавки на каждом этапе осветления, чтобы сохранить качество волос. Мастер предварительно оценивает историю ваших окрашиваний и подбирает безопасную схему перехода.' },
    { q: 'Как долго держится результат после процедур ухода?', a: 'Ботокс и кератин — до 3 месяцев при правильном домашнем уходе, который мы подберём. Окрашивание держит тон 4–6 недель. Точные сроки зависят от структуры волос — мастер расскажет на консультации.' },
    { q: 'Могу ли я прийти с картинкой из Пинтерест, и вы сделаете точно так же?', a: 'Конечно, приносите референс! Но мы обязательно обсудим, как желаемый результат ляжет на вашу структуру и текстуру волос. Честность — наш принцип: если оттенок на ваших волосах будет отличаться, мы предложим альтернативу, которая сработает именно у вас.' },
    { q: 'Как вы стерилизуете инструменты?', a: 'Тройная обработка: дезинфекция, предстерилизационная очистка и сухожар при 180°C. Каждый инструмент хранится в запечатанном крафт-пакете — вскрываем строго при вас. Для маникюра и бровей используем только одноразовые расходники.' },
    { q: 'Можно ли записаться сразу на несколько услуг?', a: 'Да, мы подберём удобный слот для комплекса — например, стрижка + маникюр или окрашивание + брови. Укажите это при онлайн-записи или скажите нашему консьержу, и мы составим оптимальное расписание.' },
  ]

  return (
    <section id="faq" className="scroll-mt-16 sm:scroll-mt-20 py-28 sm:py-36" style={{ background: CHOCOLATE }}>
      <div className="mx-auto max-w-3xl px-5 sm:px-8">
        <FadeIn>
          <p className="font-picasso-body text-[12px] uppercase tracking-[0.4em] mb-5 select-none text-center" style={{ color: GOLD }}>FAQ</p>
        </FadeIn>
        <FadeIn delay={0.1}>
          <TiltHeading className="font-picasso-display text-3xl sm:text-4xl lg:text-5xl font-medium text-center leading-[1.15]" style={{ color: TEXT }}>
            Частые <GoldSpan>вопросы</GoldSpan>
          </TiltHeading>
        </FadeIn>
        <div className="mt-16">
          {faqs.map((f, i) => (
            <FadeIn key={f.q} delay={i * 0.06}>
              <FAQItem q={f.q} a={f.a} isOpen={openIdx === i} onToggle={() => setOpenIdx(openIdx === i ? null : i)} />
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  )
}

function Booking() {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [sent, setSent] = useState(false)

  const inputStyle = {
    width: '100%',
    border: `1px solid ${BORDER_H}`,
    borderRadius: 12,
    color: TEXT,
    background: 'rgba(26, 23, 20, 0.88)',
    boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.04), 0 8px 30px rgba(0,0,0,0.18)',
    WebkitAppearance: 'none',
    appearance: 'none',
    outline: 'none',
    caretColor: GOLD,
  }

  return (
    <section
      id="booking"
      className="scroll-mt-24 sm:scroll-mt-28 py-28 sm:py-36 relative overflow-hidden"
      style={{ background: BG }} 
    >
      <div className="absolute inset-0 overflow-hidden pointer-events-none w-full">
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(640px,72vw)] h-[min(640px,72vw)] rounded-full blur-[180px]"
          style={{ background: 'rgba(201,168,122,0.018)' }}
        />
      </div>

      <div className="mx-auto max-w-xl px-5 sm:px-8 text-center relative z-10">
        <FadeIn>
          <p
            className="font-picasso-body text-[12px] uppercase tracking-[0.4em] mb-5 select-none"
            style={{ color: `${GOLD}88` }}
          >
            Запись
          </p>
        </FadeIn>

        <FadeIn delay={0.1}>
          <TiltHeading
            as="h2"
            className="font-picasso-display text-3xl sm:text-4xl font-medium leading-tight"
            style={{ color: TEXT }}
          >
            Ваш следующий <GoldSpan>визит</GoldSpan>
          </TiltHeading>
        </FadeIn>

        <FadeIn delay={0.2}>
          <p
            className="mt-5 text-base font-light leading-relaxed"
            style={{ color: TEXT_SOFT }}
          >
            Оставьте заявку - подберём удобное время и мастера
          </p>
        </FadeIn>

        <FadeIn delay={0.3}>
          <AnimatePresence mode="wait">
            {!sent ? (
              <motion.form
                key="form"
                className="mt-12 flex flex-col gap-5"
                onSubmit={(e) => {
                  e.preventDefault()
                  setSent(true)
                  setName('')
                  setPhone('')
                }}
              >
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ваше имя"
                  autoComplete="name"
                  required
                  className="block px-5 py-4 text-base font-picasso-body transition-all placeholder:opacity-60"
                  style={inputStyle}
                />

                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+7 (___) ___-__-__"
                  autoComplete="tel"
                  inputMode="tel"
                  required
                  className="block px-5 py-4 text-base font-picasso-body transition-all placeholder:opacity-60"
                  style={inputStyle}
                />

                <motion.button
                  type="submit"
                  whileHover={{
                    boxShadow:
                      '0 6px 30px rgba(201,168,122,0.2), inset 0 1px 0 rgba(255,255,255,0.15)',
                  }}
                  whileTap={{
                    boxShadow: '0 2px 12px rgba(201,168,122,0.1)',
                  }}
                  className="mt-3 w-full py-4 font-picasso-body text-[13px] font-medium uppercase tracking-[0.14em] transition-all duration-300 cursor-pointer"
                  style={{
                    background: `linear-gradient(to bottom, ${GOLD_BRIGHT} 0%, ${GOLD} 40%, ${GOLD_DIM} 100%)`,
                    color: BG,
                    borderRadius: 9999,
                    boxShadow:
                      '0 4px 20px rgba(201,168,122,0.12), inset 0 1px 0 rgba(255,255,255,0.2), inset 0 -1px 0 rgba(0,0,0,0.15)',
                  }}
                >
                  Записаться
                </motion.button>
              </motion.form>
            ) : (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="mt-12 py-10"
                style={{
                  borderTop: `1px solid ${BORDER_H}`,
                  borderBottom: `1px solid ${BORDER_H}`,
                }}
              >
                <p
                  className="font-picasso-display text-2xl italic"
                  style={{ color: TEXT }}
                >
                  Спасибо!
                </p>
                <p
                  className="mt-3 text-base font-light"
                  style={{ color: TEXT_SOFT }}
                >
                  Мы свяжемся с вами в ближайшее время
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </FadeIn>
      </div>
    </section>
  )
}

function Contacts() {
  return (
    <section id="contacts" className="scroll-mt-20 py-20 sm:py-24" style={{ background: CHOCOLATE }}>
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <FadeIn>
          <TiltHeading as="h2" className="font-picasso-display text-2xl sm:text-3xl font-medium text-center leading-[1.15] mb-12" style={{ color: TEXT }}>
            Контакты
          </TiltHeading>
        </FadeIn>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
          <FadeIn delay={0.1}>
            <div className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 flex items-center justify-center" style={{ border: `1px solid ${BORDER_H}`, borderRadius: 9999 }}>
                <MapPin size={20} style={{ color: GOLD }} strokeWidth={1.5} />
              </div>
              <p className="text-[15px] font-light leading-relaxed" style={{ color: TEXT_SOFT }}>г. Брянск, Московский просп., 106</p>
              <p className="text-[13px] font-light" style={{ color: MUTED }}>вход с улицы</p>
            </div>
          </FadeIn>
          <FadeIn delay={0.15}>
            <div className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 flex items-center justify-center" style={{ border: `1px solid ${BORDER_H}`, borderRadius: 9999 }}>
                <Phone size={20} style={{ color: GOLD }} strokeWidth={1.5} />
              </div>
              <a href="tel:+79208510105" className="text-[15px] font-light transition-colors hover:underline" style={{ color: TEXT_SOFT }}>+7 (920) 851-01-05</a>
              <p className="text-[13px] font-light" style={{ color: MUTED }}>WhatsApp / Telegram</p>
            </div>
          </FadeIn>
          <FadeIn delay={0.2}>
            <div className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 flex items-center justify-center" style={{ border: `1px solid ${BORDER_H}`, borderRadius: 9999 }}>
                <Clock3 size={20} style={{ color: GOLD }} strokeWidth={1.5} />
              </div>
              <p className="text-[15px] font-light" style={{ color: TEXT_SOFT }}>Ежедневно 10:00 — 19:00</p>
              <p className="text-[13px] font-light" style={{ color: MUTED }}>Без выходных</p>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  )
}

function Footer() {
  const socialLinks = [
    {
      href: 'https://vk.com/picasso_salon',
      label: 'ВКонтакте PICASSO',
      short: 'VK',
    },
    {
      href: 'https://instagram.com/picasso_salon',
      label: 'Instagram PICASSO',
      short: 'IG',
    },
  ]

  return (
    <footer className="py-10" style={{ background: BG, borderTop: `1px solid ${BORDER}` }}>
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-5">
          <div className="flex items-center gap-4">
            <span
              className="font-picasso-display text-lg"
              style={{ color: GOLD, textShadow: '0 0 20px rgba(201,168,122,0.1)' }}
            >
              PICASSO
            </span>
            <span className="text-xs" style={{ color: `${MUTED}60` }}>
              Салон эстетики
            </span>
          </div>

          <div className="flex items-center gap-3">
            {socialLinks.map((item) => (
              <a
                key={item.label}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="min-w-[44px] h-10 px-4 flex items-center justify-center transition-all hover:opacity-80"
                style={{
                  border: `1px solid ${BORDER}`,
                  borderRadius: 9999,
                  color: TEXT_SOFT,
                  background: 'rgba(255,255,255,0.02)',
                }}
                aria-label={item.label}
                title={item.label}
              >
                <span className="text-xs uppercase tracking-[0.14em]">{item.short}</span>
              </a>
            ))}
          </div>
        </div>

        <div
          className="mt-6 pt-5 text-center flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-5"
          style={{ borderTop: `1px solid ${BORDER}` }}
        >
          <p className="font-picasso-body text-[11px] tracking-[0.05em]" style={{ color: 'rgba(255,255,255,0.35)' }}>
            © 2026 PICASSO. Все права защищены.
          </p>

          <a
            href="tel:+79208510105"
            className="font-picasso-body text-[11px] tracking-[0.05em] transition-opacity hover:opacity-80"
            style={{ color: 'rgba(255,255,255,0.45)' }}
            aria-label="Позвонить в салон PICASSO"
          >
            +7 (920) 851-01-05
          </a>
        </div>
      </div>
    </footer>
  )
}

export default function Picasso() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.1,
      smoothWheel: true,
      syncTouch: false,
      touchMultiplier: 1.1,
      wheelMultiplier: 1,
      lerp: 0.1,
    })

    window.lenis = lenis

    let rafId = 0

    function raf(time) {
      lenis.raf(time)
      rafId = requestAnimationFrame(raf)
    }

    rafId = requestAnimationFrame(raf)

    const emitScroll = () => window.dispatchEvent(new Event('scroll'))
    lenis.on('scroll', emitScroll)

    window.scrollTo(0, 0)

    return () => {
      cancelAnimationFrame(rafId)
      lenis.off('scroll', emitScroll)
      lenis.destroy()
      if (window.lenis === lenis) {
        delete window.lenis
      }
    }
  }, [])

const scrollTo = useCallback((target) => {
    const id = String(target).replace('#', '')
    const sectionEl = document.getElementById(id)

    if (!sectionEl) {
      console.warn('scroll target not found:', id)
      return
    }

    // Высота шапки (примерно 80–90px на всех устройствах)
    const HEADER_OFFSET = 88

    // 1) Спец-кейс: booking → ведём к форме / первому полю
    if (id === 'booking') {
      const formTarget =
        sectionEl.querySelector('form') ||
        sectionEl.querySelector('input') ||
        sectionEl

      const top = formTarget.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET

      if (window.lenis) {
        window.lenis.scrollTo(top, { duration: 1.15 })
      } else {
        window.scrollTo({ top, behavior: 'smooth' })
      }

      return
    }

    // 2) Все остальные секции — классический anchor + scroll-margin-top
    const scrollMargin =
      parseInt(
        window.getComputedStyle(sectionEl).scrollMarginTop || '0',
        10,
      ) || 0

    const top = sectionEl.getBoundingClientRect().top + window.scrollY - scrollMargin

    if (window.lenis) {
      window.lenis.scrollTo(top, { duration: 1.05 })
    } else {
      window.scrollTo({ top, behavior: 'smooth' })
    }
  }, [])

  const scrollToTop = useCallback(() => {
    if (window.lenis) {
      window.lenis.scrollTo(0, { duration: 1.0 })
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }, [])

  return (
    <div
      className="relative w-full overflow-hidden flex flex-col min-h-screen font-picasso-body"
      style={{ background: BG, color: TEXT, lineHeight: 1.7 }}
    >
      <ConciergeWidget />
      <Nav scrollTo={scrollTo} scrollToTop={scrollToTop} />
      <main>
        <Hero scrollTo={scrollTo} />
        <About />
        <Services />
        <Prices />
        <Gallery />
        <Team />
        <Reviews />
        <FAQ />
        <Booking />
        <Contacts />
      </main>
      <Footer />
    </div>
  )
}