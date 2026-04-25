import { useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { picassoConfig } from '../../config/picasso.config'
import FadeIn from '../../components/FadeIn'
import TiltHeading from '../../components/TiltHeading'
import GoldSpan from '../../components/GoldSpan'
import Lightbox from '../../components/Lightbox'

const { GOLD, TEXT, TEXT_SOFT, CHOCOLATE } = picassoConfig.tokens

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
        <div className="flex flex-col lg:flex-row items-stretch gap-16">
          <div className="flex-1 min-w-0 flex flex-col justify-center">
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
          </div>

          <div className="flex-1 flex flex-col gap-4 justify-center">
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
