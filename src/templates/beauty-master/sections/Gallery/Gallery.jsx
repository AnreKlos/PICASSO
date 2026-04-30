import { useState, useRef, useEffect, useCallback, useContext } from 'react'
import { ChevronDown } from 'lucide-react'
import { AnimatePresence } from 'framer-motion'
import useEmblaCarousel from 'embla-carousel-react'
import { defaultConfig } from '../../../../configs/_default.config'
import { ConfigContext } from '../../../../contexts/ConfigContext'
import FadeIn from '../../../../components/FadeIn'
import TiltHeading from '../../../../components/TiltHeading'
import GoldSpan from '../../../../components/GoldSpan'
import Lightbox from '../../../../components/Lightbox'

function Gallery() {
  const configFromContext = useContext(ConfigContext)
  const config = configFromContext || defaultConfig
  const { GOLD, TEXT, TEXT_SOFT, MUTED, BG, SURFACE, BORDER, BORDER_H } = config.tokens
  const sectionConfig = config.sections?.gallery || {}
  const brandName = config.meta?.brand?.text || config.meta?.brand?.shortName || config.meta?.brand?.name || 'салона'
  const [lightbox, setLightbox] = useState(null)
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [activeIndex, setActiveIndex] = useState(0)
  const lightboxIndexRef = useRef(0)

  const defaultWorks = [
    { src: '/images/hair/hair_1.webp', alt: `Окрашивание волос в ${brandName}` },
    { src: '/images/hair/hair_2.webp', alt: `Женская стрижка и укладка в ${brandName}` },
    { src: '/images/hair/hair_3.webp', alt: 'Преображение волос после окрашивания' },
    { src: '/images/hair/hair_4.webp', alt: 'Сложное окрашивание волос' },
    { src: '/images/hair/hair_5.webp', alt: 'Укладка волос после салонного ухода' },
    { src: '/images/hair/hair_6.webp', alt: `Результат работы мастеров ${brandName}` },
  ]
  const configuredItems = Array.isArray(sectionConfig.items) ? sectionConfig.items : []
  const works = configuredItems.length
    ? configuredItems
      .map((item, index) => {
        if (typeof item === 'string') {
          return { src: item, alt: `Работа ${index + 1}` }
        }

        if (item && typeof item === 'object' && typeof item.src === 'string') {
          return {
            src: item.src,
            alt: item.alt || `Работа ${index + 1}`,
          }
        }

        return null
      })
      .filter(Boolean)
    : defaultWorks

  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: 'center',
  })

  const onSelect = useCallback(() => {
    if (!emblaApi) return
    const snap = emblaApi.selectedScrollSnap()
    setSelectedIndex(snap)
    setActiveIndex(snap % works.length)
  }, [emblaApi, works.length])

  useEffect(() => {
    if (!emblaApi) return
    // Sync indices after Embla measures layout
    requestAnimationFrame(() => {
      onSelect()
    })
    emblaApi.on('select', onSelect)
    emblaApi.on('reInit', onSelect)
    return () => {
      emblaApi.off('select', onSelect)
      emblaApi.off('reInit', onSelect)
    }
  }, [emblaApi, onSelect])

  const galleryRef = useRef(null)

  useEffect(() => {
    if (!emblaApi) return

    const intervalId = setInterval(() => {
      emblaApi.scrollNext()
    }, 4000)

    return () => {
      clearInterval(intervalId)
    }
  }, [emblaApi])

  function scrollPrev() { emblaApi?.scrollPrev() }
  function scrollNext() { emblaApi?.scrollNext() }

  const openLightbox = useCallback((index) => {
    const item = works[index]
    if (!item) return
    lightboxIndexRef.current = index
    setLightbox({ src: item.src, alt: item.alt })
  }, [works])

  const closeLightbox = useCallback(() => {
    setLightbox(null)
  }, [])

  if (sectionConfig.enabled === false || !works.length) {
    return null
  }

  return (
    <section ref={galleryRef} id="gallery-section" className="scroll-mt-20 sm:scroll-mt-24 py-28 sm:py-36" style={{ background: BG }}>
      <div
        className="mx-auto max-w-6xl px-5 sm:px-8"
        data-gallery-anchor
      >
        <FadeIn>
          <p className="font-wow-body text-[12px] uppercase tracking-[0.4em] mb-5 select-none text-center" style={{ color: GOLD }}>Портфолио</p>
        </FadeIn>
        <FadeIn delay={0.1}>
          <TiltHeading className="font-wow-display text-3xl sm:text-4xl lg:text-5xl font-medium text-center leading-[1.15]" style={{ color: TEXT }}>
            {sectionConfig.title || <>Наши <GoldSpan>работы</GoldSpan></>}
          </TiltHeading>
        </FadeIn>
        <FadeIn delay={0.2}>
          <p className="mt-6 text-center text-base font-light leading-relaxed max-w-lg mx-auto" style={{ color: TEXT_SOFT }}>
            {sectionConfig.subtitle || 'Каждая работа — отражение мастерства и вашего стиля'}
          </p>
        </FadeIn>

        <div className="mt-20 relative">
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex items-center" style={{ gap: '1.5rem' }}>
              {works.map((w, i) => {
                const isActive = i === activeIndex
                return (
                <div key={i} className="embla-slide shrink-0 px-2"
                  style={{ flex: '0 0 auto', width: 'min(65vw, 380px)' }}>
                  <div
                    className="w-full overflow-hidden cursor-pointer relative transition-[transform,opacity,filter] duration-500 aspect-[3/4]"
                    style={{
                      borderRadius: 16,
                      border: `1px solid ${BORDER}`,
                      transform: `scale(${isActive ? 0.95 : 0.88})`,
                      opacity: isActive ? 0.9 : 0.5,
                      filter: isActive ? 'brightness(0.8)' : 'brightness(0.55)',
                    }}
                    onClick={() => openLightbox(i)}>
                    <img src={w.src} alt={w.alt} className="w-full h-full object-cover" width={420} height={560} loading="lazy" decoding="async" draggable={false} />
                    <div className="absolute inset-0" style={{
                      background: isActive
                        ? 'linear-gradient(to top, rgba(14,12,11,0.4) 0%, transparent 35%)'
                        : 'linear-gradient(to top, rgba(14,12,11,0.7) 0%, transparent 30%)',
                    }} />
                  </div>
                </div>
                )
              })}
            </div>
          </div>

          <button onClick={() => emblaApi?.scrollPrev()}
            aria-label="Предыдущее фото"
            className="absolute left-0 sm:left-2 top-1/2 -translate-y-1/2 z-20 w-10 h-10 flex items-center justify-center cursor-pointer transition-opacity opacity-40 hover:opacity-80"
            style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 9999, color: TEXT }}>
            <ChevronDown size={18} style={{ transform: 'rotate(90deg)' }} />
          </button>
          <button onClick={() => emblaApi?.scrollNext()}
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
        {lightbox && (
          <div
            className="fixed inset-0 z-[60]"
            onClick={closeLightbox}
          >
            <Lightbox
              src={lightbox.src}
              alt={lightbox.alt}
              onClose={closeLightbox}
              works={works}
              initialIndex={lightboxIndexRef.current}
            />
          </div>
        )}
      </AnimatePresence>
    </section>
  )
}

export default Gallery
