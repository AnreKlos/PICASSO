import { Scissors, HandMetal, Eye, Flower2, FlaskConical } from 'lucide-react'
import { picassoConfig } from '../../config/picasso.config'
import FadeIn from '../../components/FadeIn'
import TiltHeading from '../../components/TiltHeading'
import GoldSpan from '../../components/GoldSpan'
import ServiceCard from '../../components/ServiceCard'

const { GOLD, TEXT, TEXT_SOFT, BG } = picassoConfig.tokens

function Services() {
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
          <p className="mt-6 text-center text-base font-light leading-relaxed max-w-md" style={{ color: TEXT_SOFT }}>
            Пять миров эстетики под одной крышей
          </p>
        </FadeIn>

        <div className="mt-16 flex flex-col gap-5">
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
      </div>
    </section>
  )
}

export default Services
