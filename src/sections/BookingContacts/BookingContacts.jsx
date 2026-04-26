import { useState, useEffect, useRef, useContext } from 'react'
import { MapPin, Phone, Clock3 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { picassoConfig } from '../../configs/picasso.config'
import { ConfigContext } from '../../contexts/ConfigContext'
import FadeIn from '../../components/FadeIn'
import TiltHeading from '../../components/TiltHeading'
import GoldSpan from '../../components/GoldSpan'
import { getOrCreateSessionId } from '../../lib/session.js'

function BookingContacts() {
  const configFromContext = useContext(ConfigContext)
  const config = configFromContext || picassoConfig
  const { GOLD, GOLD_DIM, GOLD_BRIGHT, TEXT, TEXT_SOFT, MUTED, BG, BORDER_H } = config.tokens
  const bookingSection = config.sections?.bookingContacts || {}
  const showMap = bookingSection.showMap !== false
  const mapTitle = bookingSection.mapTitle || 'Как нас найти'

  const primaryPhone = config.contacts?.phone || config.contacts?.phones?.[0] || '+7 (000) 000-00-00'
  const primaryPhoneRaw = config.contacts?.phoneRaw || primaryPhone.replace(/\D/g, '')
  const address = config.contacts?.address || ''
  const coordinates = config.contacts?.coordinates || null
  const lat = Number(coordinates?.lat)
  const lng = Number(coordinates?.lng)
  const hasCoordinates = Number.isFinite(lat) && Number.isFinite(lng)
  const addressNote = config.contacts?.addressNote || ''
  const hours = config.contacts?.hours || config.contacts?.workingHours || ''
  const hoursNote = config.contacts?.hoursNote || ''
  const mapUrl = hasCoordinates
    ? `https://yandex.ru/map-widget/v1/?ll=${lng},${lat}&z=15&pt=${lng},${lat},pm2rdm`
    : `https://yandex.ru/map-widget/v1/?text=${encodeURIComponent(address)}`

  const formRef = useRef(null)
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [prefillService, setPrefillService] = useState('')
  const [sent, setSent] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    function handleOpenBookingForm(event) {
      const service = typeof event?.detail?.service === 'string' ? event.detail.service.trim() : ''
      setPrefillService(service)
      setSent(false)

      const target = formRef.current || document.getElementById('booking')
      if (target && typeof target.scrollIntoView === 'function') {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }

    window.addEventListener('open-booking-form', handleOpenBookingForm)
    return () => window.removeEventListener('open-booking-form', handleOpenBookingForm)
  }, [])

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
            Оставьте заявку — подберём удобное время и мастера
          </p>
        </FadeIn>

        <FadeIn delay={0.3}>
          <AnimatePresence mode="wait">
            {!sent ? (
              <motion.form
                key="form"
                ref={formRef}
                className="mt-12 flex flex-col gap-5"
                onSubmit={async (e) => {
                  e.preventDefault()
                  setError('')
                  setSubmitting(true)
                  try {
                    const sessionId = getOrCreateSessionId()
                    const res = await fetch('/api/booking', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({
                        name: name.trim(),
                        phone: phone.trim(),
                        session_id: sessionId,
                        service: prefillService || undefined,
                      }),
                    })
                    if (!res.ok) throw new Error()
                    setSent(true)
                    setName('')
                    setPhone('')
                  } catch {
                    setError(`Не удалось отправить. Позвоните нам: ${primaryPhone}`)
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

      <div className="mx-auto max-w-6xl px-5 sm:px-8 mt-24 sm:mt-32 relative z-10">
        <div id="contacts" className="scroll-mt-20">
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
                <p className="text-[15px] font-light leading-relaxed" style={{ color: TEXT_SOFT }}>{address}</p>
                <p className="text-[13px] font-light" style={{ color: MUTED }}>{addressNote}</p>
              </div>
            </FadeIn>
            <FadeIn delay={0.15}>
              <div className="flex flex-col items-center gap-3">
                <div className="w-12 h-12 flex items-center justify-center" style={{ border: `1px solid ${BORDER_H}`, borderRadius: 9999 }}>
                  <Phone size={20} style={{ color: GOLD }} strokeWidth={1.5} />
                </div>
                <a href={`tel:${primaryPhoneRaw}`} className="text-[15px] font-light transition-colors hover:underline" style={{ color: TEXT_SOFT }}>{primaryPhone}</a>
                <p className="text-[13px] font-light" style={{ color: MUTED }}>WhatsApp / Telegram</p>
              </div>
            </FadeIn>
            <FadeIn delay={0.2}>
              <div className="flex flex-col items-center gap-3">
                <div className="w-12 h-12 flex items-center justify-center" style={{ border: `1px solid ${BORDER_H}`, borderRadius: 9999 }}>
                  <Clock3 size={20} style={{ color: GOLD }} strokeWidth={1.5} />
                </div>
                <p className="text-[15px] font-light" style={{ color: TEXT_SOFT }}>{hours}</p>
                <p className="text-[13px] font-light" style={{ color: MUTED }}>{hoursNote}</p>
              </div>
            </FadeIn>
          </div>

          {showMap && address && (
            <FadeIn delay={0.25}>
              <div className="mt-14 text-left">
                <h3 className="font-picasso-display text-xl sm:text-2xl mb-5" style={{ color: TEXT }}>
                  {mapTitle}
                </h3>
                <div
                  className="w-full overflow-hidden"
                  style={{ borderRadius: 18, border: `1px solid ${BORDER_H}` }}
                >
                  <iframe
                    src={mapUrl}
                    title={mapTitle}
                    width="100%"
                    style={{ border: 0, width: '100%', height: 'clamp(280px, 46vw, 360px)' }}
                    loading="lazy"
                    allowFullScreen
                  />
                </div>
              </div>
            </FadeIn>
          )}
        </div>
      </div>
    </section>
  )
}

export default BookingContacts
