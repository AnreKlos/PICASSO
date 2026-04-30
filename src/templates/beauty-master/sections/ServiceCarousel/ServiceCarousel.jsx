import { useCallback, useContext, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import useEmblaCarousel from 'embla-carousel-react'
import { Phone, CalendarDays, X, ChevronLeft, ChevronRight } from 'lucide-react'
import { defaultConfig } from '../../../../configs/_default.config'
import { ConfigContext } from '../../../../contexts/ConfigContext'
import FadeIn from '../../components/FadeIn'
import TiltHeading from '../../components/TiltHeading'
import GoldSpan from '../../components/GoldSpan'

function getLoopDistance(index, selectedIndex, total) {
  if (total <= 1) return 0
  const direct = Math.abs(index - selectedIndex)
  return Math.min(direct, total - direct)
}

function clampPreview(text) {
  if (!text) return 'Выберите карточку, чтобы посмотреть подробности и открыть полное описание услуги.'
  const trimmed = String(text).trim()
  return trimmed.length > 150 ? `${trimmed.slice(0, 147)}...` : trimmed
}

function ServiceCarousel() {
  const configFromContext = useContext(ConfigContext)
  const config = configFromContext || defaultConfig
  const sectionConfig = config.sections?.serviceCarousel || {}
  const items = Array.isArray(sectionConfig.items) ? sectionConfig.items : []

  const {
    GOLD,
    GOLD_DIM,
    GOLD_BRIGHT,
    TEXT,
    TEXT_SOFT,
    BG,
    SURFACE,
    BORDER_H,
    EASE,
  } = config.tokens

  const [selectedIndex, setSelectedIndex] = useState(0)
  const [activeIndex, setActiveIndex] = useState(null)

  const sectionRef = useRef(null)
  const viewportRef = useRef(null)
  const slideRefs = useRef([])
  const textRefs = useRef([])
  const activeIndexRef = useRef(activeIndex)

  useEffect(() => {
    activeIndexRef.current = activeIndex
  }, [activeIndex])
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: 'center',
    skipSnaps: false,
    dragFree: false,
    duration: 35,
    containScroll: 'trimSnaps',
  })

  const customTitle = typeof sectionConfig.title === 'string' ? sectionConfig.title.trim() : ''

  useEffect(() => {
    if (!emblaApi) return
    const engine = emblaApi.internalEngine()
    engine.scrollBody.useFriction(0.68)
    engine.scrollBody.useDuration(35)
  }, [emblaApi])

  useEffect(() => {
    if (!emblaApi) return undefined

    const onScroll = () => {
      const scrollProgress = emblaApi.scrollProgress()
      const engine = emblaApi.internalEngine()

      emblaApi.scrollSnapList().forEach((scrollSnap, index) => {
        let diffToTarget = scrollSnap - scrollProgress

        if (engine.options.loop) {
          engine.slideLooper.loopPoints.forEach((loopItem) => {
            const target = loopItem.target()
            if (index === loopItem.index && target !== 0) {
              const sign = Math.sign(target)
              if (sign === -1) diffToTarget = scrollSnap - (1 + scrollProgress)
              if (sign === 1) diffToTarget = scrollSnap + (1 - scrollProgress)
            }
          })
        }

        const distance = Math.abs(diffToTarget)
        const scale = Math.max(1 - distance * 1.2, 0.82)
        const opacity = Math.max(1 - distance * 2.5, 0.3)
        const textProgress = Math.max(1 - distance * 2.5, 0)

        const slide = slideRefs.current[index]
        if (slide) {
          slide.style.transform = `translateZ(0) scale(${scale})`
          slide.style.opacity = String(opacity)
        }

        const textBlock = textRefs.current[index]
        if (textBlock) {
          textBlock.style.opacity = String(textProgress)
          textBlock.style.height = textProgress > 0.1 ? 'auto' : '0'
          textBlock.style.overflow = textProgress > 0.1 ? 'visible' : 'hidden'
        }
      })
    }

    emblaApi.on('scroll', onScroll)
    emblaApi.on('reInit', onScroll)
    emblaApi.on('slideFocus', onScroll)
    onScroll()

    return () => {
      emblaApi.off('scroll', onScroll)
      emblaApi.off('reInit', onScroll)
      emblaApi.off('slideFocus', onScroll)
    }
  }, [emblaApi])

  const goPrev = useCallback(() => {
    setActiveIndex((current) => {
      if (current === null || items.length < 2) return current
      return (current - 1 + items.length) % items.length
    })
  }, [items.length])

  const goNext = useCallback(() => {
    setActiveIndex((current) => {
      if (current === null || items.length < 2) return current
      return (current + 1) % items.length
    })
  }, [items.length])

  function getItemTitle(item) {
    return item?.name || item?.title || 'Услуга'
  }

  function getItemPrice(item) {
    return item?.price || item?.priceFrom || 'по запросу'
  }

  function getItemImage(item) {
    if (typeof item?.image === 'string' && item.image.trim()) return item.image.trim()
    if (typeof item?.src === 'string' && item.src.trim()) return item.src.trim()
    return ''
  }

  useEffect(() => {
    if (!emblaApi) return undefined

    const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap())
    onSelect()

    emblaApi.on('select', onSelect)
    emblaApi.on('reInit', onSelect)

    return () => {
      emblaApi.off('select', onSelect)
      emblaApi.off('reInit', onSelect)
    }
  }, [emblaApi])

  useEffect(() => {
    if (!emblaApi) return

    let intervalId = null
    let firstStepTimeout = null
    let isPaused = false

    const start = () => {
      if (isPaused || activeIndexRef.current !== null) return
      if (intervalId || firstStepTimeout) return

      firstStepTimeout = setTimeout(() => {
        emblaApi.scrollNext()
        intervalId = setInterval(() => {
          emblaApi.scrollNext()
        }, 4200)
        firstStepTimeout = null
      }, 1200)
    }

    const stop = () => {
      if (firstStepTimeout) {
        clearTimeout(firstStepTimeout)
        firstStepTimeout = null
      }
      if (intervalId) {
        clearInterval(intervalId)
        intervalId = null
      }
    }

    const pause = () => {
      isPaused = true
      stop()
    }

    const resume = () => {
      isPaused = false
      start()
    }

    // СТАРТ сразу после готовности Embla — никаких проверок viewport
    start()

    // Пауза по hover на viewport карусели
    const viewport = emblaApi.rootNode()
    viewport.addEventListener('mouseenter', pause)
    viewport.addEventListener('mouseleave', resume)

    // Пауза при ручном перетаскивании
    emblaApi.on('pointerDown', pause)
    emblaApi.on('pointerUp', resume)

    return () => {
      stop()
      viewport.removeEventListener('mouseenter', pause)
      viewport.removeEventListener('mouseleave', resume)
      emblaApi.off('pointerDown', pause)
      emblaApi.off('pointerUp', resume)
    }
  }, [emblaApi])

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === 'Escape' && activeIndex !== null) {
        setActiveIndex(null)
        return
      }

      if (event.key === 'ArrowLeft') {
        if (activeIndex !== null) goPrev()
        else emblaApi?.scrollPrev()
      }

      if (event.key === 'ArrowRight') {
        if (activeIndex !== null) goNext()
        else emblaApi?.scrollNext()
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [activeIndex, emblaApi, goPrev, goNext])

  useEffect(() => {
    if (activeIndex === null) return undefined
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [activeIndex])

  if (!sectionConfig.enabled || !items.length) {
    return null
  }

  const activeItem = activeIndex === null ? null : items[activeIndex] || null
  const bookingUrl = config.booking?.url || ''
  const phoneRaw = config.contacts?.phoneRaw || config.contacts?.phone?.replace(/\D/g, '') || ''
  const phoneLabel = config.contacts?.phone || ''

  return (
    <section ref={sectionRef} id="service-carousel" className="scroll-mt-20 py-24 sm:py-32" style={{ background: BG }}>
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <FadeIn>
          <p className="font-picasso-body text-[12px] uppercase tracking-[0.4em] mb-5 select-none text-center" style={{ color: GOLD }}>
            Услуги
          </p>
        </FadeIn>

        <FadeIn delay={0.1}>
          <TiltHeading className="font-picasso-display text-3xl sm:text-4xl lg:text-5xl font-medium text-center leading-[1.12]" style={{ color: TEXT }}>
            {customTitle ? customTitle : <>Премиум <GoldSpan>галерея услуг</GoldSpan></>}
          </TiltHeading>
        </FadeIn>

        <FadeIn delay={0.2}>
          <p className="mt-6 text-center text-base font-light leading-relaxed max-w-2xl mx-auto" style={{ color: TEXT_SOFT }}>
            Центральная карточка раскрывает услугу детально, боковые помогают быстро ориентироваться по направлениям.
          </p>
        </FadeIn>

        <div ref={viewportRef} className="mt-12 relative">
          <button
            type="button"
            onClick={() => emblaApi?.scrollPrev()}
            aria-label="Предыдущая услуга"
            className="hidden md:flex absolute left-0 lg:left-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 items-center justify-center"
            style={{ color: TEXT_SOFT }}
          >
            <ChevronLeft size={24} strokeWidth={1} />
          </button>

          <button
            type="button"
            onClick={() => emblaApi?.scrollNext()}
            aria-label="Следующая услуга"
            className="hidden md:flex absolute right-0 lg:right-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 items-center justify-center"
            style={{ color: TEXT_SOFT }}
          >
            <ChevronRight size={24} strokeWidth={1} />
          </button>

          <div ref={emblaRef} className="overflow-hidden cursor-grab active:cursor-grabbing px-0 md:px-14">
            <div className="flex items-center">
              {items.map((item, index) => {
                const itemTitle = getItemTitle(item)
                const itemPrice = getItemPrice(item)
                const itemImage = getItemImage(item)

                const distance = getLoopDistance(index, selectedIndex, items.length)
                const isCenter = distance === 0

                return (
                  <div key={`${itemTitle}-${index}`} className="shrink-0 flex items-center justify-center px-2 sm:px-3 md:px-4" style={{ flex: '0 0 auto' }}>
                    <button
                      ref={(el) => {
                        slideRefs.current[index] = el
                      }}
                      type="button"
                      onClick={() => setActiveIndex(index)}
                      className="relative rounded-2xl overflow-hidden text-left"
                      style={{
                        width: 'min(72vw, 420px)',
                        aspectRatio: '50 / 66',
                        transform: 'translateZ(0) scale(0.85)',
                        opacity: 0.5,
                        border: `1px solid ${BORDER_H}`,
                        background: SURFACE,
                        boxShadow: '0 12px 30px rgba(0,0,0,0.4)',
                        willChange: 'transform, opacity',
                        backfaceVisibility: 'hidden',
                      }}
                    >
                      {itemImage ? (
                        <img
                          src={itemImage}
                          alt={itemTitle}
                          className="absolute inset-0 w-full h-full object-cover"
                          style={{ transform: 'translateZ(0)', willChange: 'transform' }}
                          loading="lazy"
                          decoding="async"
                          draggable={false}
                        />
                      ) : (
                        <div
                          className="absolute inset-0"
                          style={{ background: 'radial-gradient(circle at 35% 22%, rgba(201,168,122,0.2), rgba(26,23,20,1) 60%)' }}
                        />
                      )}

                      <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 60%)' }} />

                      <div
                        className="absolute left-3 right-3 bottom-3 rounded-xl px-3 py-2"
                        style={{
                          background: 'linear-gradient(180deg, rgba(14,12,11,0.14) 0%, rgba(14,12,11,0.7) 100%)',
                          border: '1px solid rgba(255,255,255,0.06)',
                        }}
                      >
                        <p className="font-picasso-display leading-tight text-3xl sm:text-[34px]" style={{ color: TEXT }}>
                          {itemTitle}
                        </p>

                        <p className="mt-2 font-picasso-body text-[14px] tracking-[0.02em]" style={{ color: GOLD }}>
                          {itemTitle} · {itemPrice}
                        </p>

                        <p
                          ref={(el) => {
                            textRefs.current[index] = el
                          }}
                          className="mt-3 text-[14px] leading-relaxed transition-all duration-75 ease-linear"
                          style={{
                            color: TEXT_SOFT,
                            display: '-webkit-box',
                            WebkitLineClamp: 3,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            opacity: 0,
                            height: 0,
                          }}
                        >
                          {clampPreview(item.description || item.short)}
                        </p>
                      </div>
                    </button>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="mt-8 flex justify-center gap-2">
            {items.map((_, index) => {
              const isActive = index === selectedIndex
              return (
                <button
                  key={index}
                  type="button"
                  onClick={() => emblaApi?.scrollTo(index)}
                  aria-label={`Слайд ${index + 1}`}
                  className="h-3 flex items-center justify-center"
                >
                  <span
                    className="block rounded-full transition-all duration-300"
                    style={{
                      width: isActive ? 24 : 8,
                      height: isActive ? 4 : 8,
                      background: isActive ? GOLD : `${TEXT_SOFT}55`,
                    }}
                  />
                </button>
              )
            })}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {activeItem && (
          <motion.div
            className="fixed inset-0 z-[130] p-4 sm:p-8 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveIndex(null)}
          >
            <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(5px)' }} />

            <motion.div
              className="relative w-full max-w-4xl rounded-2xl overflow-hidden"
              initial={{ y: 14, opacity: 0, scale: 0.98 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 8, opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.24, ease: EASE }}
              drag={items.length > 1 ? 'x' : false}
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.08}
              onDragEnd={(_, info) => {
                if (info.offset.x <= -60) goNext()
                if (info.offset.x >= 60) goPrev()
              }}
              style={{ background: SURFACE, border: `1px solid ${BORDER_H}` }}
              onClick={(event) => event.stopPropagation()}
            >
              {items.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation()
                      goPrev()
                    }}
                    className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full flex items-center justify-center"
                    style={{ background: 'rgba(0,0,0,0.62)', border: `1px solid ${BORDER_H}`, color: TEXT }}
                    aria-label="Предыдущая услуга"
                  >
                    <ChevronLeft size={20} strokeWidth={1.5} />
                  </button>
                  <button
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation()
                      goNext()
                    }}
                    className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full flex items-center justify-center"
                    style={{ background: 'rgba(0,0,0,0.62)', border: `1px solid ${BORDER_H}`, color: TEXT }}
                    aria-label="Следующая услуга"
                  >
                    <ChevronRight size={20} strokeWidth={1.5} />
                  </button>
                </>
              )}

              <button
                type="button"
                onClick={() => setActiveIndex(null)}
                className="absolute top-3 right-3 z-10 h-9 w-9 rounded-full flex items-center justify-center"
                style={{ background: 'rgba(0,0,0,0.62)', border: `1px solid ${BORDER_H}`, color: TEXT }}
                aria-label="Закрыть"
              >
                <X size={18} />
              </button>

              <div className="grid grid-cols-1 md:grid-cols-[1fr_1.15fr]">
                <div className="relative min-h-[280px] md:min-h-[420px]">
                  {getItemImage(activeItem) ? (
                    <img
                      src={getItemImage(activeItem)}
                      alt={getItemTitle(activeItem)}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  ) : (
                    <div
                      className="absolute inset-0"
                      style={{ background: 'radial-gradient(circle at 30% 25%, rgba(201,168,122,0.18), rgba(26,23,20,1) 62%)' }}
                    />
                  )}
                  <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(14,12,11,0.04) 0%, rgba(14,12,11,0.35) 100%)' }} />
                </div>

                <div className="p-6 sm:p-8 md:p-9 flex flex-col">
                  {activeItem.category && (
                    <p className="font-picasso-body text-[11px] uppercase tracking-[0.18em] mb-3" style={{ color: GOLD }}>
                      {activeItem.category}
                    </p>
                  )}

                  <h3 className="font-picasso-display text-3xl sm:text-4xl leading-tight" style={{ color: TEXT }}>
                    {getItemTitle(activeItem)}
                  </h3>

                  <p className="mt-4 font-picasso-display text-2xl italic" style={{ color: GOLD }}>
                    {getItemPrice(activeItem)}
                  </p>

                  <p className="mt-5 text-base leading-relaxed" style={{ color: TEXT_SOFT }}>
                    {activeItem.description || activeItem.short || 'Подробности уточняйте у администратора.'}
                  </p>

                  <div className="mt-8 flex flex-col sm:flex-row gap-3">
                    {bookingUrl && (
                      <a
                        href={bookingUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center justify-center gap-2 px-6 py-3 text-[13px] font-picasso-body uppercase tracking-[0.14em]"
                        style={{
                          borderRadius: 9999,
                          color: BG,
                          background: `linear-gradient(to bottom, ${GOLD_BRIGHT} 0%, ${GOLD} 45%, ${GOLD_DIM} 100%)`,
                        }}
                      >
                        <CalendarDays size={14} />
                        Онлайн запись
                      </a>
                    )}

                    {phoneRaw && (
                      <a
                        href={`tel:${phoneRaw}`}
                        className="inline-flex items-center justify-center gap-2 px-6 py-3 text-[13px] font-picasso-body uppercase tracking-[0.14em]"
                        style={{
                          borderRadius: 9999,
                          color: TEXT,
                          border: `1px solid ${BORDER_H}`,
                          background: 'rgba(255,255,255,0.02)',
                        }}
                      >
                        <Phone size={14} />
                        {phoneLabel || 'Позвонить'}
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}

export default ServiceCarousel
