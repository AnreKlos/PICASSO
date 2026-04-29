import { Star } from 'lucide-react'
import { useContext } from 'react'
import { picassoConfig } from '../../configs/picasso.config'
import { ConfigContext } from '../../contexts/ConfigContext'
import FadeIn from '../../components/FadeIn'
import TiltHeading from '../../components/TiltHeading'
import GoldSpan from '../../components/GoldSpan'

function Reviews() {
  const configFromContext = useContext(ConfigContext)
  const config = configFromContext || picassoConfig
  const { GOLD, TEXT, TEXT_SOFT, BG } = config.tokens
  const defaultReviews = [
    { text: 'Удобное расположение. Приятный персонал. Была на стрижке – всё быстро и качественно. Приятная музыка и интересные разговоры. Если нужно, всегда помогут с Wi‑Fi.', author: 'Евгения К.' },
    { text: 'Лучшие салоны Фокинского района, очень порядочные мастера, как профессионалы и как люди.', author: 'Михаил С.' },
    { text: 'Уютная студия. Девочки всегда проконсультируют перед записью на процедуру. Хожу уже 5 лет, и детей на стрижку – только сюда.', author: 'Анна' },
    { text: 'Уже лет 5 хожу только к Виктории – лучший мастер. У неё много наград, и она заняла 1 место по причёскам. От окрашивания бровей до наращивания волос на каре – всё нравится.', author: 'Ольга' },
  ]
  const reviews = Array.isArray(config.sections?.reviews?.items) && config.sections.reviews.items.length
    ? config.sections.reviews.items
    : defaultReviews

  if (!reviews.length) return null

  return (
    <section id="reviews" className="scroll-mt-20 py-28 sm:py-36" style={{ background: BG }}>
      <div className="mx-auto max-w-5xl px-5 sm:px-8">
        <FadeIn>
          <p className="font-picasso-body text-[12px] uppercase tracking-[0.4em] mb-5 select-none text-center" style={{ color: GOLD }}>Отзывы</p>
        </FadeIn>
        <FadeIn delay={0.1}>
          <TiltHeading className="font-picasso-display text-3xl sm:text-4xl lg:text-5xl font-medium text-center leading-[1.15]" style={{ color: TEXT }}>
            Нам <GoldSpan>доверяют</GoldSpan>
          </TiltHeading>
        </FadeIn>
        <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 gap-6">
          {reviews.map((r, i) => (
            <FadeIn key={i} delay={i * 0.08} className="flex">
              <div
                className="group p-7 flex flex-col flex-1 bg-[#050505] transition-[box-shadow] duration-300 group-hover:shadow-[0_4px_20px_rgba(201,168,122,0.05)]" style={{ borderRadius: 16 }}>
                <div className="flex gap-1 mb-5">
                  {[...Array(5)].map((_, j) => <Star key={j} size={14} fill={GOLD} style={{ color: GOLD }} />)}
                </div>
                <p className="text-[15px] font-light leading-relaxed flex-1" style={{ color: TEXT_SOFT }}>{r.text}</p>
                <div className="mt-6">
                  <p className="font-picasso-display text-sm font-medium" style={{ color: TEXT }}>{r.author}</p>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Reviews
