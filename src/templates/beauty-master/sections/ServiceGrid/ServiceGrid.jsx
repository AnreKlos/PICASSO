import { useContext, useState } from 'react'
import { X, ChevronRight, Phone, CalendarDays } from 'lucide-react'
import { defaultConfig } from '../../../../configs/_default.config'
import { ConfigContext } from '../../../../../shared/contexts/ConfigContext'

function ServiceGrid() {
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
  } = config.tokens

  const [activeIndex, setActiveIndex] = useState(null)

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

  const bookingUrl = config.booking?.url || ''
  const phoneRaw = config.contacts?.phoneRaw || config.contacts?.phone?.replace(/\D/g, '') || ''
  const phoneLabel = config.contacts?.phone || ''

  if (!sectionConfig.enabled || !items.length) {
    return null
  }

  const activeItem = activeIndex === null ? null : items[activeIndex] || null

  return (
    <>
      <section id="service-grid" className="scroll-mt-20 py-24 sm:py-32" style={{ background: BG }}>
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <p className="font-wow-body text-[12px] uppercase tracking-[0.4em] mb-5 select-none text-center" style={{ color: GOLD }}>
            Услуги
          </p>
          <h2 className="font-wow-display text-3xl sm:text-4xl lg:text-5xl font-medium text-center leading-[1.12]" style={{ color: TEXT }}>
            Наши услуги
          </h2>
          <p className="mt-6 text-center text-base font-light leading-relaxed max-w-2xl mx-auto" style={{ color: TEXT_SOFT }}>
            Выберите услугу и запишитесь онлайн
          </p>

          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
            {items.map((item, index) => {
              const itemTitle = getItemTitle(item)
              const itemPrice = getItemPrice(item)
              const itemImage = getItemImage(item)

              return (
                <button
                  key={`${itemTitle}-${index}`}
                  type="button"
                  onClick={() => setActiveIndex(index)}
                  className="relative rounded-xl overflow-hidden text-left group"
                  style={{ aspectRatio: '3 / 4' }}
                >
                  {itemImage ? (
                    <img
                      src={itemImage}
                      alt={itemTitle}
                      className="absolute inset-0 w-full h-full object-cover transition-all duration-300 group-hover:opacity-70"
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

                  <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, transparent 70%)' }} />

                  <div className="absolute left-3 right-3 bottom-3 p-3">
                    <h3
                      className="font-wow-display text-xl leading-tight transition-all duration-300 group-hover:-translate-y-1"
                      style={{ color: TEXT }}
                    >
                      {itemTitle}
                    </h3>
                    <p className="mt-1 font-wow-body text-sm" style={{ color: GOLD }}>
                      от {itemPrice}
                    </p>
                    <div
                      className="mt-3 opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:-translate-y-1"
                      style={{ opacity: 0 }}
                    >
                      <button
                        type="button"
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-wow-body uppercase tracking-[0.1em] transition-all duration-300"
                        style={{
                          background: GOLD,
                          color: BG,
                        }}
                      >
                        Подробнее
                        <ChevronRight size={14} className="transition-transform duration-300 group-hover:translate-x-1" />
                      </button>
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      </section>

      {activeItem && (
        <div
          className="fixed inset-0 z-[130] p-4 sm:p-8 flex items-center justify-center"
          style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(5px)' }}
          onClick={() => setActiveIndex(null)}
        >
          <div
            className="relative w-full max-w-4xl rounded-2xl overflow-hidden transition-all duration-300"
            style={{ background: SURFACE, border: `1px solid ${BORDER_H}` }}
            onClick={(event) => event.stopPropagation()}
          >
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
                  <p className="font-wow-body text-[11px] uppercase tracking-[0.18em] mb-3" style={{ color: GOLD }}>
                    {activeItem.category}
                  </p>
                )}

                <h3 className="font-wow-display text-3xl sm:text-4xl leading-tight" style={{ color: TEXT }}>
                  {getItemTitle(activeItem)}
                </h3>

                <p className="mt-4 font-wow-display text-2xl italic" style={{ color: GOLD }}>
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
                      className="inline-flex items-center justify-center gap-2 px-6 py-3 text-[13px] font-wow-body uppercase tracking-[0.14em]"
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
                      className="inline-flex items-center justify-center gap-2 px-6 py-3 text-[13px] font-wow-body uppercase tracking-[0.14em]"
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
          </div>
        </div>
      )}
    </>
  )
}

export default ServiceGrid
