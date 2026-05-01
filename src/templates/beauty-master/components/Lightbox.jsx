import { useEffect, useRef } from 'react'
import { X, ChevronDown } from 'lucide-react'
import useEmblaCarousel from 'embla-carousel-react'
import { defaultConfig } from '../../../configs/_default.config'

const { TEXT, SURFACE, BORDER, BORDER_H } = defaultConfig.tokens

function Lightbox({ src, alt, onClose, works, initialIndex }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: 'center',
    dragFree: false,
    containScroll: false,
  })
  const isInitializedRef = useRef(false)

  useEffect(() => {
    if (!emblaApi || isInitializedRef.current) return
    emblaApi.scrollTo(initialIndex, true)
    isInitializedRef.current = true
  }, [emblaApi, initialIndex])

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose()
        return
      }
      if (event.key === 'ArrowLeft') {
        emblaApi?.scrollPrev()
        return
      }
      if (event.key === 'ArrowRight') {
        emblaApi?.scrollNext()
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [onClose, emblaApi])

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center"
      style={{ background: 'rgba(0,0,0,0.92)', backdropFilter: 'blur(20px)' }}
    >
      <div ref={emblaRef} className="absolute inset-0 overflow-hidden">
        <div className="flex h-full">
          {works.map((work, i) => (
            <div key={i} className="flex-[0_0_75vw] min-w-0 flex items-center justify-center pointer-events-none">
              <img
                src={work.src}
                alt={work.alt}
                className="max-w-[75vw] max-h-[75vh] object-contain pointer-events-none"
              />
            </div>
          ))}
        </div>
      </div>
      <button
        onClick={(e) => { e.stopPropagation(); onClose() }}
        className="absolute top-6 right-6 z-10 w-10 h-10 flex items-center justify-center cursor-pointer pointer-events-auto"
        aria-label="Закрыть"
        style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 9999, color: TEXT }}
      >
        <X size={18} />
      </button>
      {works.length > 1 && (
        <>
          <button
            onClick={(e) => { e.stopPropagation(); emblaApi?.scrollPrev() }}
            aria-label="Предыдущее фото"
            className="fixed left-3 sm:left-6 top-1/2 -translate-y-1/2 z-[120] w-11 h-11 sm:w-12 sm:h-12 flex items-center justify-center cursor-pointer transition-opacity opacity-85 hover:opacity-100 pointer-events-auto"
            style={{ background: SURFACE, border: `1px solid ${BORDER_H}`, borderRadius: 9999, color: TEXT }}
          >
            <ChevronDown size={20} style={{ transform: 'rotate(90deg)' }} />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); emblaApi?.scrollNext() }}
            aria-label="Следующее фото"
            className="fixed right-3 sm:right-6 top-1/2 -translate-y-1/2 z-[120] w-11 h-11 sm:w-12 sm:h-12 flex items-center justify-center cursor-pointer transition-opacity opacity-85 hover:opacity-100 pointer-events-auto"
            style={{ background: SURFACE, border: `1px solid ${BORDER_H}`, borderRadius: 9999, color: TEXT }}
          >
            <ChevronDown size={20} style={{ transform: 'rotate(-90deg)' }} />
          </button>
        </>
      )}
    </div>
  )
}

export default Lightbox
