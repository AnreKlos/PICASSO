import { useState, useRef, useEffect, useCallback } from 'react'
import { ChevronDown } from 'lucide-react'
import { AnimatePresence } from 'framer-motion'
import useEmblaCarousel from 'embla-carousel-react'
import { picassoConfig } from '../../configs/picasso.config'
import FadeIn from '../../components/FadeIn'
import TiltHeading from '../../components/TiltHeading'
import GoldSpan from '../../components/GoldSpan'
import Lightbox from '../../components/Lightbox'

const { GOLD, TEXT, TEXT_SOFT, MUTED, BG, SURFACE, BORDER, BORDER_H } = picassoConfig.tokens

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

  const galleryRef = useRef(null)

  useEffect(() => {
    if (!emblaApi) return
    let id = null
    let inViewport = true
    let visible = true

    function startAutoplay() {
      if (!visible) return
      if (!inViewport && id) return
      if (id) return
      id = setInterval(() => emblaApi.scrollNext(), 4000)
    }
    function stopAutoplay() { if (id) { clearInterval(id); id = null } }

    const observer = new IntersectionObserver(
      ([entry]) => { inViewport = entry.isIntersecting; inViewport && visible ? startAutoplay() : stopAutoplay() },
      { threshold: 0 }
    )
    if (galleryRef.current) observer.observe(galleryRef.current)

    const onVis = () => { visible = !document.hidden; visible && inViewport ? startAutoplay() : stopAutoplay() }
    document.addEventListener('visibilitychange', onVis)

    emblaApi.on('pointerDown', stopAutoplay)
    emblaApi.on('settle', startAutoplay)

    startAutoplay()
    return () => {
      stopAutoplay()
      observer.disconnect()
      document.removeEventListener('visibilitychange', onVis)
      emblaApi.off('pointerDown', stopAutoplay)
      emblaApi.off('settle', startAutoplay)
    }
  }, [emblaApi])

  function scrollPrev() { emblaApi?.scrollPrev() }
  function scrollNext() { emblaApi?.scrollNext() }

  return (
    <section ref={galleryRef} id="gallery" className="scroll-mt-20 sm:scroll-mt-24 py-28 sm:py-36" style={{ background: BG }}>
      <div
        className="mx-auto max-w-6xl px-5 sm:px-8"
        data-gallery-anchor
      >
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
                    <img src={w.src} alt={w.alt} className="w-full max-w-full h-full object-cover" width={420} height={560} loading="lazy" decoding="async" draggable={false} />
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

export default Gallery
