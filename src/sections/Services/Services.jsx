import { useState } from 'react'
import { Scissors, HandMetal, Eye, Flower2, FlaskConical } from 'lucide-react'
import { picassoConfig } from '../../configs/picasso.config'
import FadeIn from '../../components/FadeIn'
import TiltHeading from '../../components/TiltHeading'
import GoldSpan from '../../components/GoldSpan'
import ServiceCard from '../../components/ServiceCard'
import DirectionCard from '../../components/DirectionCard'

const { GOLD, TEXT, TEXT_SOFT, BG } = picassoConfig.tokens

function Services() {
  const [openIdx, setOpenIdx] = useState(0)
  const directions = [
    {
      Icon: Scissors, title: 'Hair — Парикмахерские услуги', tagline: 'Стрижки, окрашивания, кератин, укладки', items: [
        { name: 'Женская стрижка', price: 'от 2 000 ₽' },
        { name: 'Окрашивание (однотонное)', price: 'от 4 500 ₽' },
        { name: 'Кератиновое выпрямление', price: 'от 5 000 ₽' },
        { name: 'Укладка / вечерняя', price: 'от 1 500 ₽' },
      ]
    },
    {
      Icon: HandMetal, title: 'Nail сервис', tagline: 'Маникюр, педикюр, наращивание, дизайн', items: [
        { name: 'Маникюр «Всё включено»', price: 'от 1 800 ₽' },
        { name: 'Smart-педикюр', price: 'от 2 200 ₽' },
        { name: 'Наращивание ногтей', price: 'от 3 000 ₽' },
        { name: 'Дизайн (Nail Art)', price: 'от 500 ₽' },
      ]
    },
    {
      Icon: Eye, title: 'Брови', tagline: 'Архитектура, ламинирование, окрашивание', items: [
        { name: 'Архитектура бровей', price: 'от 1 200 ₽' },
        { name: 'Ламинирование + ботокс', price: 'от 1 500 ₽' },
        { name: 'Окрашивание (хна/краска)', price: 'от 600 ₽' },
      ]
    },
    {
      Icon: Flower2, title: 'Шугаринг', tagline: 'Депиляция сахарной пастой', items: [
        { name: 'Ноги полностью', price: 'от 1 800 ₽' },
        { name: 'Руки до локтя', price: 'от 700 ₽' },
        { name: 'Бикини (классика)', price: 'от 1 200 ₽' },
      ]
    },
    {
      Icon: FlaskConical, title: 'Уход за лицом', tagline: 'УЗ-чистка, пилинги, маски', items: [
        { name: 'УЗ-чистка лица', price: 'от 1 500 ₽' },
        { name: 'Молочный пилинг', price: 'от 1 800 ₽' },
        { name: 'Ретиноевый пилинг', price: 'от 3 000 ₽' },
      ]
    },
  ]

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
          <ServiceCard Icon={Scissors} title="Hair — Парикмахерские услуги"
            desc="Стрижки, окрашивание, кератин, укладки — главное направление PICASSO. Мастера-стилисты создают образ, который подчёркивает вашу индивидуальность."
            image="/images/services/kabinet_parikmaherskaya.webp" featured />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <ServiceCard Icon={HandMetal} title="Nail сервис"
              desc="Маникюр, педикюр, наращивание, дизайн. Премиальные материалы и техника выравнивания." />
            <ServiceCard Icon={Eye} title="Брови"
              desc="Архитектура, ламинирование, окрашивание. Форма, которая работает на ваш образ." />
            <ServiceCard Icon={Flower2} title="Шугаринг"
              desc="Депиляция сахарной пастой. Мягко, бережно, для всех зон." />
            <ServiceCard Icon={FlaskConical} title="Уход за лицом"
              desc="УЗ-чистка, кислотные пилинги, маски. Здоровая кожа — основа красоты." />
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
