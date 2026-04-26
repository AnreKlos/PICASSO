import { useContext, useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import useEmblaCarousel from 'embla-carousel-react'
import { Play, X } from 'lucide-react'
import { picassoConfig } from '../../configs/picasso.config'
import { ConfigContext } from '../../contexts/ConfigContext'
import FadeIn from '../../components/FadeIn'
import TiltHeading from '../../components/TiltHeading'
import GoldSpan from '../../components/GoldSpan'

function Reels() {
  const configFromContext = useContext(ConfigContext)
  const config = configFromContext || picassoConfig
  const sectionConfig = config.sections?.reels
  const items = Array.isArray(sectionConfig?.items) ? sectionConfig.items : []

  const { GOLD, TEXT, TEXT_SOFT, BG, SURFACE, BORDER_H, EASE } = config.tokens
  const [emblaRef] = useEmblaCarousel({ align: 'start', dragFree: true })
  const [activeItem, setActiveItem] = useState(null)

  useEffect(() => {
    if (!activeItem) return undefined

    function onKeyDown(event) {
      if (event.key === 'Escape') setActiveItem(null)
    }

    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKeyDown)

    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [activeItem])

  if (!sectionConfig?.enabled || !items.length) {
    return null
  }

  return (
    <section id="reels" className="scroll-mt-20 py-28 sm:py-36" style={{ background: BG }}>
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <FadeIn>
          <p className="font-picasso-body text-[12px] uppercase tracking-[0.4em] mb-5 select-none text-center" style={{ color: GOLD }}>
            Reels
          </p>
        </FadeIn>

        <FadeIn delay={0.1}>
          <TiltHeading className="font-picasso-display text-3xl sm:text-4xl lg:text-5xl font-medium text-center leading-[1.15]" style={{ color: TEXT }}>
            {sectionConfig.title || 'Из жизни'} <GoldSpan>студии</GoldSpan>
          </TiltHeading>
        </FadeIn>

        <FadeIn delay={0.2}>
          <p className="mt-6 text-center text-base font-light leading-relaxed max-w-xl mx-auto" style={{ color: TEXT_SOFT }}>
            {sectionConfig.subtitle || 'Короткие видео о процессе, мастерах и атмосфере'}
          </p>
        </FadeIn>

        <div className="mt-14 overflow-hidden" ref={emblaRef}>
          <div className="flex -ml-4">
            {items.map((item, index) => (
              <div key={`${item.embedUrl}-${index}`} className="min-w-0 pl-4 basis-[82%] sm:basis-1/2 lg:basis-1/3 xl:basis-1/4">
                <button
                  type="button"
                  className="w-full text-left group"
                  onClick={() => setActiveItem(item)}
                >
                  <div
                    className="relative aspect-[9/16] overflow-hidden transition-all duration-300"
                    style={{
                      borderRadius: 18,
                      border: `1px solid ${BORDER_H}`,
                      background: `radial-gradient(circle at 50% 30%, rgba(201,168,122,0.12) 0%, rgba(201,168,122,0.03) 40%, ${SURFACE} 100%)`,
                      boxShadow: '0 10px 30px rgba(0,0,0,0.25)',
                    }}
                  >
                    <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(14,12,11,0.2) 0%, rgba(14,12,11,0.75) 100%)' }} />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span
                        className="w-14 h-14 rounded-full flex items-center justify-center transition-transform duration-300 group-hover:scale-105"
                        style={{ border: `1px solid ${BORDER_H}`, background: 'rgba(0,0,0,0.35)' }}
                      >
                        <Play size={20} style={{ color: GOLD, marginLeft: 2 }} />
                      </span>
                    </div>

                    {item.duration && (
                      <span
                        className="absolute right-3 top-3 text-[12px] px-2 py-1 rounded-full"
                        style={{ background: 'rgba(0,0,0,0.45)', color: TEXT_SOFT, border: `1px solid ${BORDER_H}` }}
                      >
                        {item.duration}
                      </span>
                    )}

                    <div className="absolute left-0 right-0 bottom-0 px-4 py-4">
                      <p className="text-sm sm:text-[15px] leading-snug" style={{ color: TEXT }}>
                        {item.title || 'Видео'}
                      </p>
                    </div>
                  </div>
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {activeItem && (
          <motion.div
            className="fixed inset-0 z-[120] flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveItem(null)}
          >
            <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)' }} />

            <motion.div
              className="relative w-full"
              initial={{ opacity: 0, scale: 0.94, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 8 }}
              transition={{ duration: 0.24, ease: EASE }}
              onClick={(event) => event.stopPropagation()}
              style={{ maxWidth: 420 }}
            >
              <button
                type="button"
                className="absolute -top-3 -right-3 z-10 w-9 h-9 rounded-full flex items-center justify-center"
                style={{ background: 'rgba(0,0,0,0.75)', border: `1px solid ${BORDER_H}`, color: TEXT }}
                onClick={() => setActiveItem(null)}
                aria-label="Закрыть"
              >
                <X size={18} />
              </button>

              <div
                className="overflow-hidden"
                style={{ borderRadius: 18, border: `1px solid ${BORDER_H}`, background: '#000', maxHeight: '80vh' }}
              >
                <div className="w-full aspect-[9/16] max-h-[80vh]">
                  <iframe
                    src={activeItem.embedUrl}
                    title={activeItem.title || 'Видео'}
                    className="w-full h-full border-0"
                    allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
                    allowFullScreen
                  />
                </div>
              </div>

              <a
                href={activeItem.externalUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-4 inline-flex w-full items-center justify-center py-3 px-5 text-[13px] uppercase tracking-[0.12em]"
                style={{
                  borderRadius: 9999,
                  color: '#0E0C0B',
                  background: 'linear-gradient(to bottom, #D4B88A 0%, #C9A87A 40%, #A68B5A 100%)',
                  boxShadow: '0 4px 20px rgba(201,168,122,0.2)',
                }}
              >
                Смотреть в VK
              </a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}

export default Reels
