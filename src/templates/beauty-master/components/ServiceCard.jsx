import { useState, useRef, useEffect } from 'react'
import { AnimatePresence } from 'framer-motion'
import FadeIn from './FadeIn'
import Lightbox from './Lightbox'
import { defaultConfig } from '../../../configs/_default.config'

const { GOLD, GOLD_DIM, GOLD_BRIGHT, TEXT, TEXT_SOFT, MUTED, BG, CHOCOLATE, SURFACE, SURFACE_L, BORDER, BORDER_H, EASE } = defaultConfig.tokens

function ServiceCard({ Icon, title, desc, image, featured }) {
  const [showLightbox, setShowLightbox] = useState(false)
  const cardRef = useRef(null)

  const [isMobile, setIsMobile] = useState(false)
  useEffect(() => {
    const mql = window.matchMedia('(max-width: 767px)')
    setIsMobile(mql.matches)
    const handler = (e) => setIsMobile(e.matches)
    mql.addEventListener('change', handler)
    return () => mql.removeEventListener('change', handler)
  }, [])

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
              transform: 'translateZ(0)',
              boxShadow: 'inset 0 0 0 1.5px #0E0C0B'
            }}
          >
            <div
              className="absolute"
              style={{
                willChange: 'transform',
                inset: '-6px',
                transform: 'translateZ(0)',
                backfaceVisibility: 'hidden',
              }}
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
                decoding="async"
              />
            </div>
            <div
              className="absolute inset-0 pointer-events-none transition-opacity duration-500 opacity-30 group-hover:opacity-10"
              style={{ background: 'rgba(14,12,11,0.35)' }}
            />
            <div
              className="absolute inset-0"
              style={{
                background:
                  isMobile
                    ? 'linear-gradient(to top, rgba(14,12,11,0.96) 0%, rgba(14,12,11,0.88) 38%, rgba(14,12,11,0.52) 58%, rgba(14,12,11,0.12) 100%)'
                    : 'linear-gradient(to top, rgba(14,12,11,0.95) 0%, rgba(14,12,11,0.7) 50%, transparent 80%)',
              }}
            />
            <div
              className="absolute bottom-0 left-0 right-0 p-6 sm:p-8"
            >
              <div className="flex items-center gap-3 mb-3">
                <div
                  className="w-10 h-10 flex items-center justify-center"
                  style={{
                    border: `1px solid ${BORDER_H}`,
                    borderRadius: 9999,
                    background: 'rgba(201,168,122,0.06)',
                  }}
                >
                  <Icon size={18} style={{ color: GOLD }} strokeWidth={1.5} />
                </div>
                <p className="font-wow-body text-[11px] uppercase tracking-[0.2em]" style={{ color: GOLD }}>Главное направление</p>
              </div>
              <h3 className="font-wow-display text-2xl sm:text-3xl font-medium" style={{ color: TEXT, textShadow: isMobile ? '0 2px 10px rgba(0,0,0,0.85), 0 1px 2px rgba(0,0,0,0.9)' : 'none' }}>{title}</h3>
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
            <h3 className="font-wow-display text-lg font-medium" style={{ color: TEXT }}>{title}</h3>
          </div>
          <p className="text-[14px] font-light leading-relaxed line-clamp-3 sm:line-clamp-4" style={{ color: TEXT_SOFT }}>{desc}</p>
        </div>
      </div>
    </FadeIn>
  )
}

export default ServiceCard
