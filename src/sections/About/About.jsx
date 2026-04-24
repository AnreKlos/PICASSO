import { useState } from 'react'
import { Shield, Clock, Coffee, Diamond } from 'lucide-react'
import { AnimatePresence } from 'framer-motion'
import { picassoConfig } from '../../config/picasso.config'
import FadeIn from '../../components/FadeIn'
import TiltHeading from '../../components/TiltHeading'
import GoldSpan from '../../components/GoldSpan'
import Lightbox from '../../components/Lightbox'

const { GOLD, TEXT, TEXT_SOFT, CHOCOLATE, BORDER_H } = picassoConfig.tokens

function About() {
  const [lightbox, setLightbox] = useState(null)

  return (
    <section
      id="about"
      className="scroll-mt-12 sm:scroll-mt-20 py-28 sm:py-36 relative overflow-hidden"
      style={{ background: CHOCOLATE }}
    >
      <div className="absolute inset-0 overflow-hidden pointer-events-none w-full">
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70vw] max-w-[380px] h-[70vw] max-h-[380px] rounded-full blur-[200px]"
          style={{ background: 'rgba(201,168,122,0.02)' }}
        />
      </div>

      <div className="mx-auto max-w-6xl px-5 sm:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          <div className="flex-1 min-w-0">
            <FadeIn>
              <p
                className="font-picasso-body text-[12px] uppercase tracking-[0.4em] mb-5 select-none"
                style={{ color: GOLD }}
              >
                О салоне
              </p>
            </FadeIn>

            <FadeIn delay={0.1}>
              <TiltHeading
                className="font-picasso-display text-3xl sm:text-4xl lg:text-5xl font-medium"
                style={{ color: TEXT }}
              >
                Пространство,
                <br />
                где хочется <GoldSpan>оставаться</GoldSpan>
              </TiltHeading>
            </FadeIn>

            <FadeIn delay={0.2}>
              <p
                className="mt-7 text-[16px] font-light leading-relaxed max-w-lg"
                style={{ color: TEXT_SOFT }}
              >
                PICASSO — студия, куда приходят за понятным результатом.
                Мы честно обсуждаем пожелания, подбираем решения под качество волос и кожи,
                работаем только на проверенных составах и держим высокий стандарт чистоты.
                В одном визите можно обновить стрижку и цвет, привести в порядок
                ногти и брови и уйти с ощущением, что о вас действительно позаботились.
              </p>
            </FadeIn>

            <FadeIn delay={0.3}>
              <div className="mt-12 grid grid-cols-2 gap-4 sm:gap-5">
                {[
                  { Icon: Shield, title: 'Абсолютная стерильность' },
                  { Icon: Clock, title: 'Гарантированное качество' },
                  { Icon: Coffee, title: 'Премиальные сервисы' },
                  { Icon: Diamond, title: 'Проф. материалы' },
                ].map((item) => (
                  <div
                    key={item.title}
                    className="group relative overflow-hidden min-h-[150px] px-4 py-6 sm:px-5 sm:py-6 flex flex-col items-center justify-center text-center"
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
                  </div>
                ))}
              </div>
            </FadeIn>
          </div>

          <div className="flex-1 flex flex-col gap-4">
            <FadeIn>
              <div
                className="group relative overflow-hidden bg-[#050505] cursor-pointer"
                style={{
                  borderRadius: 12,
                  filter:
                    'brightness(0.97) contrast(1.15) saturate(0.87) sepia(0.10) hue-rotate(-8deg)',
                  WebkitMaskImage: 'linear-gradient(to bottom, black 70%, transparent 100%)',
                  maskImage: 'linear-gradient(to bottom, black 70%, transparent 100%)',
                }}
                onClick={() =>
                  setLightbox({
                    src: '/images/interior/whod_s_ulitci.webp',
                    alt: 'Вход в салон PICASSO',
                  })
                }
              >
                <img
                  src="/images/interior/whod_s_ulitci.webp"
                  alt="Вход в салон PICASSO"
                  className="w-full max-w-full h-full object-cover transform-gpu scale-[1.01] group-hover:scale-[1.03] transition-transform duration-500 ease-out aspect-[4/3] pointer-events-none"
                  style={{ backfaceVisibility: 'hidden', willChange: 'transform' }}
                  width={750}
                  height={563}
                  loading="lazy"
                  decoding="async"
                />
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background:
                      'radial-gradient(ellipse at 50% 40%, rgba(201,168,122,0.11) 0%, rgba(138,106,74,0.08) 50%, transparent 80%)',
                  }}
                />
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{ boxShadow: 'inset 0 0 100px 40px rgba(14,12,11,0.175)' }}
                />
                <div
                  className="absolute inset-0 pointer-events-none transition-opacity duration-500 opacity-20 group-hover:opacity-10"
                  style={{ background: 'rgba(14,12,11,0.2)' }}
                />
              </div>
            </FadeIn>

            <div className="grid grid-cols-2 gap-4">
              <FadeIn delay={0.1}>
                <div
                  className="group relative overflow-hidden bg-[#050505] cursor-pointer"
                  style={{
                    borderRadius: 12,
                    filter: 'brightness(0.875) contrast(1.15) saturate(0.85)',
                    WebkitMaskImage: 'linear-gradient(to bottom, black 60%, transparent 100%)',
                    maskImage: 'linear-gradient(to bottom, black 60%, transparent 100%)',
                  }}
                  onClick={() =>
                    setLightbox({
                      src: '/images/interior/kabinet_1.webp',
                      alt: 'Кабинет салона',
                    })
                  }
                >
                  <img
                    src="/images/interior/kabinet_1.webp"
                    alt="Кабинет салона"
                    className="w-full max-w-full h-full object-cover transform-gpu scale-[1.01] group-hover:scale-[1.03] transition-transform duration-500 ease-out aspect-square pointer-events-none"
                    style={{ backfaceVisibility: 'hidden', willChange: 'transform' }}
                    width={500}
                    height={500}
                    loading="lazy"
                    decoding="async"
                  />
                  <div
                    className="absolute inset-0 pointer-events-none transition-opacity duration-500 opacity-20 group-hover:opacity-10"
                    style={{ background: 'rgba(14,12,11,0.2)' }}
                  />
                </div>
              </FadeIn>

              <FadeIn delay={0.15}>
                <div
                  className="group relative overflow-hidden bg-[#050505] cursor-pointer"
                  style={{
                    borderRadius: 12,
                    filter: 'brightness(0.875) contrast(1.15) saturate(0.85)',
                    WebkitMaskImage: 'linear-gradient(to bottom, black 60%, transparent 100%)',
                    maskImage: 'linear-gradient(to bottom, black 60%, transparent 100%)',
                  }}
                  onClick={() =>
                    setLightbox({
                      src: '/images/interior/pritmnaya.webp',
                      alt: 'Интерьер салона',
                    })
                  }
                >
                  <img
                    src="/images/interior/pritmnaya.webp"
                    alt="Интерьер салона"
                    className="w-full max-w-full h-full object-cover transform-gpu scale-[1.01] group-hover:scale-[1.03] transition-transform duration-500 ease-out aspect-square pointer-events-none"
                    style={{ backfaceVisibility: 'hidden', willChange: 'transform' }}
                    width={500}
                    height={500}
                    loading="lazy"
                    decoding="async"
                  />
                  <div
                    className="absolute inset-0 pointer-events-none transition-opacity duration-500 opacity-20 group-hover:opacity-10"
                    style={{ background: 'rgba(14,12,11,0.2)' }}
                  />
                </div>
              </FadeIn>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {lightbox && (
          <Lightbox
            src={lightbox.src}
            alt={lightbox.alt}
            onClose={() => setLightbox(null)}
          />
        )}
      </AnimatePresence>
    </section>
  )
}

export default About
