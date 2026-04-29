import { useState, useContext } from 'react'
import { Scissors, HandMetal, Eye, Flower2, FlaskConical } from 'lucide-react'
import { picassoConfig } from '../../configs/picasso.config'
import { ConfigContext } from '../../contexts/ConfigContext'
import FadeIn from '../../components/FadeIn'
import TiltHeading from '../../components/TiltHeading'
import GoldSpan from '../../components/GoldSpan'
import ServiceCard from '../../components/ServiceCard'
import DirectionCard from '../../components/DirectionCard'

const DEFAULT_SERVICE_ITEMS = [
  {
    title: 'Hair — Парикмахерские услуги',
    desc: 'Стрижки, окрашивание, кератин, укладки — главное направление PICASSO. Мастера-стилисты создают образ, который подчёркивает вашу индивидуальность.',
    priceFrom: 'от 2 000 ₽',
    short: 'Стрижки, окрашивания, кератин, укладки',
    image: '/images/services/kabinet_parikmaherskaya.webp',
    featured: true,
  },
  {
    title: 'Nail сервис',
    desc: 'Маникюр, педикюр, наращивание, дизайн. Премиальные материалы и техника выравнивания.',
    priceFrom: 'от 1 800 ₽',
    short: 'Маникюр, педикюр, наращивание, дизайн',
  },
  {
    title: 'Брови',
    desc: 'Архитектура, ламинирование, окрашивание. Форма, которая работает на ваш образ.',
    priceFrom: 'от 600 ₽',
    short: 'Архитектура, ламинирование, окрашивание',
  },
  {
    title: 'Шугаринг',
    desc: 'Депиляция сахарной пастой. Мягко, бережно, для всех зон.',
    priceFrom: 'от 700 ₽',
    short: 'Депиляция сахарной пастой',
  },
  {
    title: 'Уход за лицом',
    desc: 'УЗ-чистка, кислотные пилинги, маски. Здоровая кожа — основа красоты.',
    priceFrom: 'от 1 500 ₽',
    short: 'УЗ-чистка, пилинги, маски',
  },
]

const ICONS = [Scissors, HandMetal, Eye, Flower2, FlaskConical]

function Services() {
  const configFromContext = useContext(ConfigContext)
  const config = configFromContext || picassoConfig
  const { GOLD, TEXT, TEXT_SOFT, BG } = config.tokens
  const [openIdx, setOpenIdx] = useState(0)
  const servicesConfig = Array.isArray(config.sections?.services?.items) && config.sections.services.items.length
    ? config.sections.services.items
    : DEFAULT_SERVICE_ITEMS

  if (!servicesConfig.length) return null

  const directions = servicesConfig.map((service, index) => ({
    Icon: ICONS[index % ICONS.length],
    title: service.title,
    tagline: service.short || service.description || service.desc || '',
    items: [
      { name: service.title, price: service.priceFrom || 'по запросу' },
    ],
  }))

  return (
    <section id="services" className="scroll-mt-20 py-28 sm:py-36" style={{ background: BG }}>
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <FadeIn>
          <p className="font-picasso-body text-[12px] uppercase tracking-[0.4em] mb-5 select-none text-center" style={{ color: GOLD }}>Направления</p>
        </FadeIn>
        <FadeIn delay={0.1}>
          <TiltHeading className="font-picasso-display text-3xl sm:text-4xl lg:text-5xl font-medium text-center leading-[1.15]" style={{ color: TEXT }}>
            Полный цикл <GoldSpan>красоты</GoldSpan>
          </TiltHeading>
        </FadeIn>
        <FadeIn delay={0.2}>
          <p className="mt-6 text-center text-base font-light leading-relaxed max-w-md mx-auto" style={{ color: TEXT_SOFT }}>
            Пять миров эстетики под одной крышей
          </p>
        </FadeIn>

        <div data-services-anchor className="mt-16 flex flex-col gap-5">
          {servicesConfig[0] && (
            <ServiceCard
              Icon={ICONS[0]}
              title={servicesConfig[0].title}
              desc={servicesConfig[0].description || servicesConfig[0].desc || servicesConfig[0].short || ''}
              image={servicesConfig[0].image}
              featured={Boolean(servicesConfig[0].featured)}
            />
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {servicesConfig.slice(1).map((service, index) => (
              <ServiceCard
                key={service.title}
                Icon={ICONS[(index + 1) % ICONS.length]}
                title={service.title}
                desc={service.description || service.desc || service.short || ''}
              />
            ))}
          </div>
        </div>

        <div id="prices" className="mt-20 max-w-2xl mx-auto scroll-mt-20">
          <FadeIn>
            <p className="font-picasso-body text-[12px] uppercase tracking-[0.4em] mb-5 select-none text-center" style={{ color: GOLD }}>Прайс</p>
          </FadeIn>
          <FadeIn delay={0.1}>
            <TiltHeading className="font-picasso-display text-3xl sm:text-4xl lg:text-5xl font-medium text-center leading-[1.15]" style={{ color: TEXT }}>
              Цены по <GoldSpan>направлениям</GoldSpan>
            </TiltHeading>
          </FadeIn>
          <div className="mt-16 flex flex-col gap-4">
            {directions.map((d, i) => (
              <DirectionCard key={d.title} {...d} isOpen={openIdx === i} onToggle={() => setOpenIdx(openIdx === i ? -1 : i)} delay={i * 0.07} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default Services
