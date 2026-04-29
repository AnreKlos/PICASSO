import { useState } from 'react'
import { useContext } from 'react'
import { defaultConfig } from '../../configs/_default.config'
import { ConfigContext } from '../../contexts/ConfigContext'
import FadeIn from '../../components/FadeIn'
import TiltHeading from '../../components/TiltHeading'
import GoldSpan from '../../components/GoldSpan'
import FAQItem from '../../components/FAQItem'

function FAQ() {
  const configFromContext = useContext(ConfigContext)
  const config = configFromContext || defaultConfig
  const { GOLD, TEXT, CHOCOLATE } = config.tokens
  const [openIdx, setOpenIdx] = useState(null)
  const defaultFaqs = [
    { q: 'Работаете ли вы со сложными окрашиваниями — выход из чёрного, тотал блонд?', a: 'Да, это наша специализация. Мы используем плекс-системы и защитные добавки на каждом этапе осветления, чтобы сохранить качество волос. Мастер предварительно оценивает историю ваших окрашиваний и подбирает безопасную схему перехода.' },
    { q: 'Как долго держится результат после процедур ухода?', a: 'Ботокс и кератин — до 3 месяцев при правильном домашнем уходе, который мы подберём. Окрашивание держит тон 4–6 недель. Точные сроки зависят от структуры волос — мастер расскажет на консультации.' },
    { q: 'Могу ли я прийти с картинкой из Пинтерест, и вы сделаете точно так же?', a: 'Конечно, приносите референс! Но мы обязательно обсудим, как желаемый результат ляжет на вашу структуру и текстуру волос. Честность — наш принцип: если оттенок на ваших волосах будет отличаться, мы предложим альтернативу, которая сработает именно у вас.' },
    { q: 'Как вы стерилизуете инструменты?', a: 'Тройная обработка: дезинфекция, предстерилизационная очистка и сухожар при 180°C. Каждый инструмент хранится в запечатанном крафт-пакете — вскрываем строго при вас. Для маникюра и бровей используем только одноразовые расходники.' },
    { q: 'Можно ли записаться сразу на несколько услуг?', a: 'Да, мы подберём удобный слот для комплекса — например, стрижка + маникюр или окрашивание + брови. Укажите это при онлайн-записи или скажите нашему консьержу, и мы составим оптимальное расписание.' },
  ]
  const faqs = Array.isArray(config.sections?.faq?.items) && config.sections.faq.items.length
    ? config.sections.faq.items
    : defaultFaqs

  if (!faqs.length) return null

  return (
    <section id="faq-section" className="scroll-mt-16 sm:scroll-mt-20 py-28 sm:py-36" style={{ background: CHOCOLATE }}>
      <div className="mx-auto max-w-3xl px-5 sm:px-8">
        <FadeIn>
          <p className="font-picasso-body text-[12px] uppercase tracking-[0.4em] mb-5 select-none text-center" style={{ color: GOLD }}>FAQ</p>
        </FadeIn>
        <FadeIn delay={0.1}>
          <TiltHeading className="font-picasso-display text-3xl sm:text-4xl lg:text-5xl font-medium text-center leading-[1.15]" style={{ color: TEXT }}>
            Частые <GoldSpan>вопросы</GoldSpan>
          </TiltHeading>
        </FadeIn>
        <div className="mt-16">
          {faqs.map((f, i) => (
            <FadeIn key={f.q} delay={i * 0.06}>
              <FAQItem q={f.q} a={f.a} isOpen={openIdx === i} onToggle={() => setOpenIdx(openIdx === i ? null : i)} />
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  )
}

export default FAQ
