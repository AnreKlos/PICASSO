import { useState, useContext } from 'react'
import { Sparkles } from 'lucide-react'
import { AnimatePresence } from 'framer-motion'
import { defaultConfig } from '../../../../configs/_default.config'
import { ConfigContext } from '../../../../contexts/ConfigContext'
import FadeIn from '../../components/FadeIn'
import TiltHeading from '../../components/TiltHeading'
import GoldSpan from '../../components/GoldSpan'
import MasterModal from '../../components/MasterModal'

const { GOLD, TEXT, TEXT_SOFT, MUTED, CHOCOLATE, SURFACE, SURFACE_L } = defaultConfig.tokens

function Team() {
  const [selectedMaster, setSelectedMaster] = useState(null)
  const configFromContext = useContext(ConfigContext)
  const config = configFromContext || defaultConfig
  const team = Array.isArray(config?.team) ? config.team : []
  const realTeam = team.filter(item => item?.name)
  
  if (!realTeam.length) return null
  
  const masters = [
    {
      name: 'Юлия Котомина', role: 'Мастер-универсал', exp: 'Опыт 15+ лет', specialty: 'Стрижки, окрашивания, свадебный стилист',
      image: '/images/team/yulia_kotomina.webp',
      details: [
        'Опыт работы 15 лет',
        'Стрижки женские и мужские любой сложности, сложные окрашивания',
        'Свадебный стилист — причёски, макияж',
        '09.10.2015 — программа «Базовый визаж», квалификация визажист',
        '05.12.2018 — «Окрашивание в технике Airtouch» — Светлова Оксана',
        '18.04.2019 — семинар «Роскошь блонда» — Ольшанская Лола',
        '02.03.2020 — «Свадебный стилист. Текстура и форма» — А. М. Саядян',
        '05.07.2021 — международный Академический Базовый Онлайн-курс по причёскам G. Кот',
      ],
    },
    {
      name: 'Виктория Бобкова', role: 'Топ-стилист', exp: 'Опыт 8+ лет', specialty: 'Окрашивание, сложные стрижки, кератин',
      image: '/images/team/viktoria_bobkova.webp',
      details: [
        '2017–2020 ГБПОУ Брянский Техникум Профессиональных технологий и Сферы услуг — парикмахер-модельер 4 разряда',
        'С 2019 — работает в студии PICASSO',
        '2018 — 1 место, 4-й открытый чемпионат Брянской области «Хрустальные ножницы» (Юниоры)',
        '2019 — 1 место, 5-й открытый чемпионат Брянской области «Хрустальные ножницы» (Юниоры)',
        '2020 — 2 место, 4-й открытый региональный чемпионат «Молодые профессионалы» WorldSkills Russia',
        'Мастер-класс «Роскошь блонда» — Лола Ольшанская, Москва',
        'Обучение «Наращивание волос» — Мария Зотова',
        'Обучение «Колористика» — Мария Зотова',
        'Сложные окрашивания: Airtouch, шатуш, мелирование',
        'Окрашивание в тон, наращивание волос, все виды стрижек, современные мужские стрижки',
        'Процедуры для волос: ботокс, протеин, восстановление',
        'Подбор домашнего ухода, коррекция и окрашивание бровей',
      ],
    },
    { name: 'Место в команде', role: 'Мы ищем мастеров', exp: 'PICASSO растёт', specialty: 'Присоединяйтесь к нашей команде', image: '/images/team/PICASSO_JOB.webp', details: [] },
  ]

  return (
    <section id="team-section" className="scroll-mt-20 py-28 sm:py-36" style={{ background: CHOCOLATE }}>
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <FadeIn>
          <p className="font-picasso-body text-[12px] uppercase tracking-[0.4em] mb-5 select-none text-center" style={{ color: GOLD }}>Команда</p>
        </FadeIn>
        <FadeIn delay={0.1}>
          <TiltHeading className="font-picasso-display text-3xl sm:text-4xl lg:text-5xl font-medium text-center leading-[1.15]" style={{ color: TEXT }}>
            Наши <GoldSpan>мастера</GoldSpan>
          </TiltHeading>
        </FadeIn>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-20">
          {masters.map((m, i) => (
            <FadeIn key={m.name} delay={i * 0.1}>
              <div className="group overflow-hidden h-full bg-[#050505]" style={{ borderRadius: 16 }}
                onClick={() => m.details.length > 0 ? setSelectedMaster(m) : undefined}>
                <div className="relative w-full aspect-[3/4] max-h-[55vh] sm:max-h-none overflow-hidden cursor-pointer">
                  {m.image ? (
                    <img src={m.image} alt={m.name} className="w-full h-full object-cover transform-gpu scale-[1.01] group-hover:scale-[1.03] transition-transform duration-500 ease-out pointer-events-none" style={{ backfaceVisibility: 'hidden', willChange: 'transform' }} width={400} height={533} loading="lazy" decoding="async" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center" style={{ background: `linear-gradient(145deg, ${SURFACE_L} 0%, ${SURFACE} 100%)` }}>
                      <Sparkles size={36} style={{ color: `${GOLD}15` }} strokeWidth={1} />
                    </div>
                  )}
                  <div className="absolute inset-0 pointer-events-none transition-opacity duration-500 opacity-25 group-hover:opacity-5" style={{ background: 'rgba(14,12,11,0.35)' }} />
                  <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(14,12,11,0.95) 0%, rgba(14,12,11,0.5) 35%, transparent 55%)' }} />
                  <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6 flex flex-col justify-end sm:min-h-[160px]">
                    <p className="font-picasso-body text-[11px] uppercase tracking-[0.2em] mb-2" style={{ color: GOLD }}>{m.role}</p>
                    <h3 className="font-picasso-display text-lg sm:text-xl font-medium" style={{ color: TEXT }}>{m.name}</h3>
                    <p className="mt-1 text-[12px] sm:text-[13px] font-light" style={{ color: TEXT_SOFT }}>{m.exp}</p>
                    <p className="mt-2 text-[12px] sm:text-[13px] font-light" style={{ color: MUTED }}>{m.specialty}</p>
                    <span className="mt-3 inline-block font-picasso-body text-[11px] sm:text-[12px] uppercase tracking-[0.14em] cursor-pointer transition-opacity hover:opacity-70"
                      style={{ color: GOLD }}>{m.details.length > 0 ? 'Подробнее →' : '\u00A0'}</span>
                  </div>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
      <AnimatePresence>
        {selectedMaster && <MasterModal master={selectedMaster} onClose={() => setSelectedMaster(null)} />}
      </AnimatePresence>
    </section>
  )
}

export default Team
