import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { picassoConfig } from '../../config/picasso.config'
import FadeIn from '../../components/FadeIn'
import TiltHeading from '../../components/TiltHeading'
import GoldSpan from '../../components/GoldSpan'

const { GOLD, GOLD_DIM, GOLD_BRIGHT, TEXT, TEXT_SOFT, BG, BORDER_H } = picassoConfig.tokens

function Booking() {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [sent, setSent] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  function formatPhone(value) {
    const digits = value.replace(/\D/g, '')
    const d = digits.startsWith('8') ? '7' + digits.slice(1) : digits.startsWith('7') ? digits : '7' + digits
    let result = '+7'
    if (d.length > 1) result += ' (' + d.slice(1, 4)
    if (d.length > 4) result += ') ' + d.slice(4, 7)
    if (d.length > 7) result += '-' + d.slice(7, 9)
    if (d.length > 9) result += '-' + d.slice(9, 11)
    return result
  }

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
                onSubmit={async (e) => {
                  e.preventDefault()
                  setError('')
                  setSubmitting(true)
                  try {
                    const res = await fetch('/api/booking', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ name: name.trim(), phone: phone.trim() }),
                    })
                    if (!res.ok) throw new Error()
                    setSent(true)
                    setName('')
                    setPhone('')
                  } catch {
                    setError(`Не удалось отправить. Позвоните нам: ${picassoConfig.contacts.phone}`)
                  } finally {
                    setSubmitting(false)
                  }
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
                  onChange={(e) => setPhone(formatPhone(e.target.value))}
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
                    opacity: submitting ? 0.6 : 1,
                  }}
                  disabled={submitting}
                >
                  {submitting ? 'Отправка…' : 'Записаться'}
                </motion.button>

                {error && <p className="text-[13px] font-light mt-2" style={{ color: '#e57373' }}>{error}</p>}
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

export default Booking
