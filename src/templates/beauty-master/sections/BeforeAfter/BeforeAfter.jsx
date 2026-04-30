import { useContext } from 'react'
import { defaultConfig } from '../../configs/_default.config'
import { ConfigContext } from '../../contexts/ConfigContext'
import FadeIn from '../../components/FadeIn'
import TiltHeading from '../../components/TiltHeading'
import GoldSpan from '../../components/GoldSpan'

function BeforeAfter() {
  const configFromContext = useContext(ConfigContext)
  const config = configFromContext || defaultConfig
  const { GOLD, TEXT, TEXT_SOFT, BG } = config.tokens
  const sectionConfig = config.sections?.beforeAfter || {}
  const items = Array.isArray(sectionConfig.items) ? sectionConfig.items : []

  if (sectionConfig.enabled === false || !items.length) return null

  return (
    <section id="beforeAfter-section" className="scroll-mt-20 py-28 sm:py-36" style={{ background: BG }}>
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <FadeIn>
          <p className="font-picasso-body text-[12px] uppercase tracking-[0.4em] mb-5 select-none text-center" style={{ color: GOLD }}>
            До/после
          </p>
        </FadeIn>
        <FadeIn delay={0.1}>
          <TiltHeading className="font-picasso-display text-3xl sm:text-4xl lg:text-5xl font-medium text-center leading-[1.15]" style={{ color: TEXT }}>
            Реальные работы <GoldSpan>мастеров</GoldSpan>
          </TiltHeading>
        </FadeIn>

        <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item, index) => (
            <FadeIn key={index} delay={index * 0.1}>
              <div className="flex flex-col gap-3">
                <div className="relative flex flex-col sm:flex-row gap-2">
                  <div className="flex-1 relative overflow-hidden bg-[#050505]" style={{ borderRadius: 12 }}>
                    {item.before && (
                      <img
                        src={item.before}
                        alt="До"
                        className="w-full h-full object-cover"
                        loading="lazy"
                        decoding="async"
                      />
                    )}
                    <div className="absolute top-2 left-2 px-3 py-1 text-[11px] font-picasso-body uppercase tracking-[0.1em] rounded-full" style={{ background: 'rgba(14,12,11,0.8)', color: TEXT }}>
                      До
                    </div>
                  </div>
                  <div className="flex-1 relative overflow-hidden bg-[#050505]" style={{ borderRadius: 12 }}>
                    {item.after && (
                      <img
                        src={item.after}
                        alt="После"
                        className="w-full h-full object-cover"
                        loading="lazy"
                        decoding="async"
                      />
                    )}
                    <div className="absolute top-2 left-2 px-3 py-1 text-[11px] font-picasso-body uppercase tracking-[0.1em] rounded-full" style={{ background: GOLD, color: BG }}>
                      После
                    </div>
                  </div>
                </div>
                {item.title && (
                  <p className="text-sm font-picasso-display font-medium" style={{ color: TEXT }}>
                    {item.title}
                  </p>
                )}
                {item.note && (
                  <p className="text-[13px] font-light" style={{ color: TEXT_SOFT }}>
                    {item.note}
                  </p>
                )}
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  )
}

export default BeforeAfter

