import { Sparkles } from 'lucide-react'
import { useContext } from 'react'
import { defaultConfig } from '../../../../configs/_default.config'
import { ConfigContext } from '../../../../contexts/ConfigContext'
import FadeIn from '../../components/FadeIn'
import TiltHeading from '../../components/TiltHeading'

function Promotion() {
  const configFromContext = useContext(ConfigContext)
  const config = configFromContext || defaultConfig
  const { GOLD, TEXT, TEXT_SOFT, CHOCOLATE, BORDER_H } = config.tokens
  const title = config.content?.promotion?.title || 'Особое предложение'
  const text = config.content?.promotion?.text || 'Для новых клиентов — приятный бонус при первой записи. Узнайте подробности у нашего консьержа или по телефону.'

  if (!title && !text) return null

  return (
    <section id="promotion-section" className="scroll-mt-20 py-16 sm:py-20" style={{ background: CHOCOLATE }}>
      <div className="mx-auto max-w-3xl px-5 sm:px-8">
        <FadeIn>
          <div
            className="px-6 py-10 sm:px-12 sm:py-14 text-center"
            style={{
              borderRadius: 24,
              border: `1px solid ${BORDER_H}`,
              background: 'linear-gradient(180deg, rgba(255,255,255,0.03) 0%, rgba(201,168,122,0.06) 100%)',
              boxShadow: '0 14px 40px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.05)',
            }}
          >
            <div
              className="mx-auto w-12 h-12 flex items-center justify-center mb-5"
              style={{
                border: `1px solid ${BORDER_H}`,
                borderRadius: 9999,
                background: 'rgba(201,168,122,0.08)',
              }}
            >
              <Sparkles size={18} style={{ color: GOLD }} strokeWidth={1.5} />
            </div>

            <TiltHeading className="font-picasso-display text-3xl sm:text-4xl font-medium leading-[1.15]" style={{ color: TEXT }}>
              {title}
            </TiltHeading>

            <p className="mt-5 text-base font-light leading-relaxed" style={{ color: TEXT_SOFT }}>
              {text}
            </p>
          </div>
        </FadeIn>
      </div>
    </section>
  )
}

export default Promotion
