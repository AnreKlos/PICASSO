import { useState, useRef, useEffect, useContext } from 'react'
import { ArrowRight } from 'lucide-react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { picassoConfig } from '../../configs/picasso.config'
import { ConfigContext } from '../../contexts/ConfigContext'
import TiltHeading from '../../components/TiltHeading'
import MagneticButton from '../../components/MagneticButton'
import DustParticles from '../../components/DustParticles'
import TiltGlare from '../../components/TiltGlare'

function Hero({ scrollTo }) {
  const configFromContext = useContext(ConfigContext)
  const config = configFromContext || picassoConfig
  const { GOLD, GOLD_DIM, GOLD_BRIGHT, TEXT, TEXT_SOFT, BG, BORDER_H, EASE } = config.tokens
  const heroConfig = config.sections?.hero || {}
  const brandName = config.meta?.brand?.name || config.meta?.name || 'PICASSO'
  const defaultTitleLine1 = 'Салон эстетики'
  const alternativeTitleLine1 = config.meta?.tagline || defaultTitleLine1
  const configuredTitleLine1 = heroConfig.titleLine1 || defaultTitleLine1
  const heroTitleLine1 = configuredTitleLine1 === brandName ? alternativeTitleLine1 : configuredTitleLine1
  const heroTitleLine2 = brandName
  const showWorksButton = config.sections?.gallery?.enabled !== false
  const heroTopLabel = heroConfig.topLabel || config.meta?.tagline || 'Premium Beauty Studio'
  const heroLead = heroConfig.lead || 'Стрижка, цвет, ногти, брови — полный цикл красоты в одном пространстве'

  const ref = useRef(null)
  const [isMobile, setIsMobile] = useState(false)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const heroY = useTransform(scrollYProgress, [0, 1], isMobile ? [0, 0] : [0, -120])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0])
  const bgY = useTransform(scrollYProgress, [0, 1], [0, 500])
  const midY = useTransform(scrollYProgress, [0, 1], [0, 250])
  const imgY = useTransform(scrollYProgress, [0, 1], isMobile ? [0, 0] : [0, 150])

  useEffect(() => {
    const mql = window.matchMedia('(max-width: 767px)')
    setIsMobile(mql.matches)
    const handler = (e) => setIsMobile(e.matches)
    mql.addEventListener('change', handler)
    return () => mql.removeEventListener('change', handler)
  }, [])

  return (
    <section ref={ref} className="relative min-h-screen flex items-center overflow-hidden" style={{ background: BG }}>

      <div className="absolute inset-0 overflow-hidden pointer-events-none w-full">
        {!isMobile && (
          <>
            <motion.div style={{ y: bgY, willChange: 'transform' }} className="absolute -top-[400px] -bottom-[400px] left-0 right-0">
              <div className="absolute top-[15%] left-[10%] w-[80vw] max-w-[420px] h-[80vw] max-h-[420px] rounded-full blur-[200px]" style={{ background: 'rgba(201,168,122,0.035)' }} />
              <div className="absolute bottom-[10%] right-[5%] w-[70vw] max-w-[360px] h-[70vw] max-h-[360px] rounded-full blur-[160px]" style={{ background: 'rgba(184,146,138,0.025)' }} />
            </motion.div>
            <motion.div style={{ y: midY, willChange: 'transform' }} className="absolute -top-[200px] -bottom-[200px] left-0 right-0">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-[500px] h-[90vw] max-h-[500px] rounded-full blur-[240px]" style={{ background: 'rgba(201,168,122,0.018)' }} />
            </motion.div>
          </>
        )}
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 70% 55% at 50% 42%, rgba(201,168,122,0.05) 0%, transparent 65%)', filter: 'blur(80px)' }} />
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 100% 100% at 50% 50%, transparent 40%, rgba(14,12,11,0.7) 75%, rgba(14,12,11,0.95) 100%)' }} />
        {!isMobile && <DustParticles />}
      </div>

      <div className="relative z-[5] w-full pointer-events-auto">
        <div className="mx-auto max-w-6xl px-5 sm:px-8 flex flex-col lg:flex-row items-center gap-12 lg:gap-16 pt-28 pb-16">
          <div className="flex-1 text-center lg:text-left">
            <motion.div style={{ y: heroY, opacity: heroOpacity, willChange: 'transform' }}>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, ease: EASE }}>
                <p className="font-picasso-body text-[9px] sm:text-[10px] md:text-[11px] font-light uppercase tracking-[0.2em] sm:tracking-[0.24em] whitespace-nowrap mb-5 select-none" style={{ color: 'rgba(240,235,227,0.4)' }}>{heroTopLabel}</p>
              </motion.div>

              <div className="relative">
                <div className="hidden md:block">
                  <div className="smoke-layer smoke-layer-1" />
                  <div className="smoke-layer smoke-layer-2" />
                  <div className="smoke-layer smoke-layer-3" />
                </div>
                <motion.div
                  initial={{ opacity: 0, filter: 'blur(20px) brightness(2.5)' }}
                  animate={{ opacity: 1, filter: 'blur(0px) brightness(1)' }}
                  transition={{ duration: 2, ease: EASE, delay: 0.2 }}
                >
                  <TiltHeading as="h1" className="font-picasso-display font-medium tracking-[-0.01em] leading-[1.1]" style={{ color: TEXT }}>
                    <span className="text-4xl sm:text-5xl lg:text-[3.8rem] xl:text-[4.5rem]" style={{ color: TEXT }}>{heroTitleLine1}</span> <span className="block italic text-5xl sm:text-6xl lg:text-[5.5rem] xl:text-[6.5rem]" style={{
                      color: GOLD,
                      textShadow: `
                    0 1px 0 #A68B5A,
                    0 2px 0 #8A742B,
                    0 3px 0 #6E5D22,
                    0 4px 0 #53491A,
                    0 5px 0 #3D3614,
                    0 6px 14px rgba(0,0,0,0.35),
                    0 12px 40px rgba(201,168,122,0.18),
                    0 0 80px rgba(201,168,122,0.08),
                    0 0 160px rgba(201,168,122,0.03),
                    0 0 260px rgba(201,168,122,0.01)
                  `,
                    }}>{heroTitleLine2}</span>
                  </TiltHeading>
                </motion.div>
              </div>

              <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: EASE, delay: 0.8 }}
                className="mt-7 font-picasso-body text-lg sm:text-xl font-light leading-relaxed" style={{ color: TEXT_SOFT }}>
                {heroLead}
              </motion.p>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: EASE, delay: 0.8 }}
                className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mt-12 overflow-hidden">
                <MagneticButton href="#booking" onClick={(e) => { e.preventDefault(); scrollTo('booking') }}
                  whileHover={{ boxShadow: '0 6px 40px rgba(201,168,122,0.25), inset 0 1px 0 rgba(255,255,255,0.15)' }}
                  whileTap={{ boxShadow: '0 2px 12px rgba(201,168,122,0.15)' }}
                  className="btn-shine group inline-flex items-center justify-center gap-2 px-9 py-4 font-picasso-body text-[13px] font-medium uppercase tracking-[0.14em] transition-all duration-300 cursor-pointer"
                  style={{ background: `linear-gradient(to bottom, ${GOLD_BRIGHT} 0%, ${GOLD} 40%, ${GOLD_DIM} 100%)`, color: BG, borderRadius: 9999, boxShadow: '0 1px 0 rgba(255,255,255,0.25) inset, 0 -2px 0 rgba(0,0,0,0.2) inset, 0 4px 8px rgba(0,0,0,0.3), 0 8px 30px rgba(201,168,122,0.18)', textShadow: '0 1px 2px rgba(0,0,0,0.25)' }}>
                  Онлайн запись <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
                </MagneticButton>
                {showWorksButton && (
                  <MagneticButton href="#gallery" onClick={(e) => { e.preventDefault(); scrollTo('gallery') }}
                    whileHover={{ boxShadow: '0 6px 30px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.06)' }}
                    whileTap={{ boxShadow: '0 2px 10px rgba(0,0,0,0.3)' }}
                    className="inline-flex items-center justify-center font-picasso-body text-[13px] font-medium uppercase tracking-[0.14em] px-9 py-4 transition-all duration-300 cursor-pointer"
                    style={{ border: `1px solid ${BORDER_H}`, color: TEXT, borderRadius: 9999, boxShadow: '0 4px 20px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.04), inset 0 -1px 0 rgba(0,0,0,0.2)' }}>
                    Наши работы
                  </MagneticButton>
                )}
              </motion.div>
            </motion.div>
          </div>

          <div className="flex-1 relative max-w-md lg:max-w-none max-w-full">
            <motion.div
              style={{ y: imgY, willChange: 'transform' }}
              className="relative z-10"
              initial={{ opacity: 0, scale: 1.08, filter: 'blur(20px) brightness(2) saturate(0)' }}
              animate={{ opacity: 1, scale: 1, filter: 'blur(0px) brightness(1) saturate(1)' }}
              transition={{ duration: 2.2, ease: EASE, delay: 0.6 }}
            >
              <TiltGlare
                className="relative rounded-3xl"
                style={{ boxShadow: '0 20px 60px rgba(0,0,0,0.5), 0 0 80px rgba(201,168,122,0.04)' }}
              >
                <div
                  className="relative rounded-3xl overflow-hidden w-full h-full"
                  style={{
                    isolation: 'isolate',
                    background: '#0E0C0B',
                    transform: 'translateZ(0)',
                    backfaceVisibility: 'hidden',
                    boxShadow: 'inset 0 0 0 2px #0E0C0B',
                  }}
                >
                  <div className="w-full h-full">
                    <img
                      src="/images/hair/hair_1.webp"
                      alt="PICASSO hair styling"
                      className="w-full max-w-full aspect-[3/4] object-cover block rounded-3xl transform-gpu scale-[1.03]"
                      style={{
                        backfaceVisibility: 'hidden',
                        transform: 'translateZ(0)',
                      }}
                      width={500}
                      height={666}
                      fetchPriority="high"
                      decoding="async"
                    />
                  </div>
                  <div
                    className="absolute inset-0 pointer-events-none rounded-3xl"
                    style={{ background: 'linear-gradient(to top, rgba(14,12,11,0.7) 0%, transparent 40%), linear-gradient(to right, rgba(14,12,11,0.4) 0%, transparent 30%)' }}
                  />
                </div>
              </TiltGlare>
              {!isMobile && <div className="absolute -bottom-6 -left-6 w-32 h-32 rounded-full blur-[60px] pointer-events-none z-[-1]" style={{ background: 'rgba(201,168,122,0.06)' }} />}
              {!isMobile && <div className="absolute -top-4 -right-4 w-24 h-24 rounded-full blur-[40px] pointer-events-none z-[-1]" style={{ background: 'rgba(184,146,138,0.04)' }} />}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
