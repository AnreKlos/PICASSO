import { Shield, Clock, Coffee, Diamond } from 'lucide-react'
import { defaultConfig } from '../../../../configs/_default.config'
import FadeIn from '../../components/FadeIn'
import TiltHeading from '../../components/TiltHeading'
import GoldSpan from '../../components/GoldSpan'

const { GOLD, TEXT, BG, BORDER_H } = defaultConfig.tokens

const items = [
  {
    Icon: Shield,
    title: 'Абсолютная стерильность',
    desc: 'Стерилизация инструмента в сухожаре. Одноразовые материалы для каждого клиента.',
  },
  {
    Icon: Clock,
    title: 'Точно в срок',
    desc: 'Ценим ваше время. Запись минута в минуту, без томительных ожиданий.',
  },
  {
    Icon: Coffee,
    title: 'Премиальные сервисы',
    desc: 'Кофе, авторские напитки, плед и музыка по настроению — ваш визит как маленький отпуск.',
  },
  {
    Icon: Diamond,
    title: 'Профессиональные материалы',
    desc: 'Только проверенные бренды салонной серии. Никаких компромиссов с качеством.',
  },
]

function Advantages() {
  return (
    <section id="advantages-section" className="scroll-mt-20 py-20 sm:py-24" style={{ background: BG }}>
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <FadeIn>
          <p className="font-picasso-body text-[12px] uppercase tracking-[0.4em] mb-5 select-none text-center" style={{ color: GOLD }}>Почему мы</p>
        </FadeIn>

        <FadeIn delay={0.1}>
          <TiltHeading className="font-picasso-display text-3xl sm:text-4xl lg:text-5xl font-medium text-center leading-[1.15]" style={{ color: TEXT }}>
            Что отличает <GoldSpan>PICASSO</GoldSpan>
          </TiltHeading>
        </FadeIn>

        <div className="mt-12 grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 auto-rows-fr">
          {items.map((item) => (
            <FadeIn key={item.title}>
              <div
                className="group relative overflow-hidden h-full min-h-[230px] sm:min-h-[250px] px-4 py-6 sm:px-5 sm:py-6 flex flex-col items-center justify-center text-center"
                style={{
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: 18,
                  background:
                    'linear-gradient(180deg, rgba(255,255,255,0.035) 0%, rgba(255,255,255,0.018) 100%)',
                  boxShadow:
                    'inset 0 1px 0 rgba(255,255,255,0.04), 0 10px 30px rgba(0,0,0,0.12)',
                }}
              >
                <div
                  className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{
                    background:
                      'radial-gradient(circle at top left, rgba(201,168,122,0.08), transparent 45%)',
                  }}
                />

                <div
                  className="relative w-12 h-12 flex items-center justify-center mb-4 shrink-0"
                  style={{
                    border: `1px solid ${BORDER_H}`,
                    borderRadius: 9999,
                    background: 'rgba(201,168,122,0.06)',
                  }}
                >
                  <item.Icon size={18} style={{ color: GOLD }} strokeWidth={1.5} />
                </div>

                <h3
                  className="relative font-picasso-display text-[15px] sm:text-[17px] leading-snug text-center max-w-[14ch]"
                  style={{ color: TEXT }}
                >
                  {item.title}
                </h3>

                <p
                  className="relative mt-2 text-[12.5px] sm:text-[13px] font-light leading-relaxed text-center max-w-[22ch]"
                  style={{ color: 'rgba(181,175,167,0.85)' }}
                >
                  {item.desc}
                </p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Advantages
