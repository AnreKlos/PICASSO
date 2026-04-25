import { Shield, Clock, Coffee, Diamond } from 'lucide-react'
import { picassoConfig } from '../../config/picasso.config'
import FadeIn from '../../components/FadeIn'
import TiltHeading from '../../components/TiltHeading'
import GoldSpan from '../../components/GoldSpan'

const { GOLD, TEXT, BG, BORDER_H } = picassoConfig.tokens

function Advantages() {
  return (
    <section id="advantages" className="scroll-mt-20 py-20 sm:py-24" style={{ background: BG }}>
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <FadeIn>
          <p className="font-picasso-body text-[12px] uppercase tracking-[0.4em] mb-5 select-none text-center" style={{ color: GOLD }}>Почему мы</p>
        </FadeIn>

        <FadeIn delay={0.1}>
          <TiltHeading className="font-picasso-display text-3xl sm:text-4xl lg:text-5xl font-medium text-center leading-[1.15]" style={{ color: TEXT }}>
            Что отличает <GoldSpan>PICASSO</GoldSpan>
          </TiltHeading>
        </FadeIn>

        <div className="mt-12 grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {[
            { Icon: Shield, title: 'Абсолютная стерильность' },
            { Icon: Clock, title: 'Гарантированное качество' },
            { Icon: Coffee, title: 'Премиальные сервисы' },
            { Icon: Diamond, title: 'Проф. материалы' },
          ].map((item) => (
            <FadeIn key={item.title}>
              <div
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
                    background: 'rgba(201,168,122,0.06)',
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
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Advantages
