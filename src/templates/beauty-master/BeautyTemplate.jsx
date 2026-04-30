import { useState, useEffect, useCallback } from 'react'
import Lenis from 'lenis'
import { defaultConfig } from '../../configs/_default.config'
import { ConfigContext } from '../../contexts/ConfigContext'
import SectionBoundary from '../../components/SectionBoundary'
import ChatWidget from './widgets/Kolya/ChatWidget'
import Nav from './sections/Nav/Nav'
import Hero from './sections/Hero/Hero'
import Advantages from './sections/Advantages/Advantages'
import Promotion from './sections/Promotion/Promotion'
import About from './sections/About/About'
import Services from './sections/Services/Services'
import ServiceCarousel from './sections/ServiceCarousel/ServiceCarousel'
import Gallery from './sections/Gallery/Gallery'
import BeforeAfter from './sections/BeforeAfter/BeforeAfter'
import Team from './sections/Team/Team'
import Reels from './sections/Reels/Reels'
import Reviews from './sections/Reviews/Reviews'
import FAQ from './sections/FAQ/FAQ'
import BookingContacts from './sections/BookingContacts/BookingContacts'
import Footer from './sections/Footer/Footer'
import StickyBar from './components/StickyBar'
import { getSectionOrder } from '../../utils/getSectionOrder'

export default function BeautyTemplate({ config = defaultConfig }) {
  const [showWidget, setShowWidget] = useState(false)
  const { sections } = config
  const sectionsOrder = getSectionOrder(config)

  const blockFlags = {
    hero: true,
    about: true,
    services: true,
    team: true,
    gallery: true,
    beforeAfter: true,
    reviews: true,
    faq: true,
    promotions: true,
    contacts: true,
    ...(config?.block_flags || {})
  }

  const sectionRenderers = {
    hero: () => <Hero scrollTo={scrollTo} />,
    promotion: () => <Promotion />,
    advantages: () => <Advantages />,
    serviceCarousel: () => <ServiceCarousel />,
    services: () => <Services />,
    gallery: () => <Gallery />,
    beforeAfter: () => <BeforeAfter />,
    team: () => <Team />,
    reels: () => <Reels />,
    reviews: () => <Reviews />,
    about: () => <About />,
    faq: () => <FAQ />,
    bookingContacts: () => <BookingContacts />,
  }
  const { enabled: chatWidgetEnabled, tooltipDelayMs, mountDelayMs } = config.features.chatWidget
  const { BG, TEXT } = config.tokens

  void tooltipDelayMs

  useEffect(() => {
    const id = setTimeout(() => setShowWidget(true), mountDelayMs)
    return () => clearTimeout(id)
  }, [mountDelayMs])

  useEffect(() => {
    let lenis, rafId = 0, tabVisible = true, cancelled = false
    let startLenis = () => {}, stopLenis = () => {}, cleanupVis = () => {}

    function init() {
      if (cancelled) return
      lenis = new Lenis({
        duration: 1.1,
        smoothWheel: true,
        syncTouch: false,
        touchMultiplier: 1.1,
        wheelMultiplier: 1,
        lerp: 0.1,
      })

      window.lenis = lenis

      function raf(time) {
        lenis.raf(time)
        rafId = requestAnimationFrame(raf)
      }

      startLenis = () => { if (tabVisible && !rafId) rafId = requestAnimationFrame(raf) }
      stopLenis = () => { if (rafId) { cancelAnimationFrame(rafId); rafId = 0 } }

      const onVisChange = () => {
        tabVisible = !document.hidden
        tabVisible ? startLenis() : stopLenis()
      }
      document.addEventListener('visibilitychange', onVisChange)
      cleanupVis = () => document.removeEventListener('visibilitychange', onVisChange)

      rafId = requestAnimationFrame(raf)
      window.scrollTo(0, 0)
    }

    const idleId = typeof requestIdleCallback === 'function'
      ? requestIdleCallback(init)
      : setTimeout(init, 0)

    return () => {
      cancelled = true
      typeof cancelIdleCallback === 'function' ? cancelIdleCallback(idleId) : clearTimeout(idleId)
      stopLenis()
      cleanupVis()
      if (lenis) {
        lenis.destroy()
        if (window.lenis === lenis) delete window.lenis
      }
    }
  }, [])

  const scrollTo = useCallback((target) => {
    const id = String(target).replace('#', '')
    const sectionEl = document.getElementById(id)

    if (!sectionEl) {
      console.warn('scroll target not found:', id)
      return
    }

    // Высота шапки (примерно 80–90px на всех устройствах)
    const HEADER_OFFSET = 70

    // 1) Спец-кейс: booking → ведём к форме / первому полю
    if (id === 'booking') {
      const formTarget =
        sectionEl.querySelector('form') ||
        sectionEl.querySelector('input') ||
        sectionEl

      const top = formTarget.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET

      if (window.lenis) {
        window.lenis.scrollTo(top, { duration: 1.15 })
      } else {
        window.scrollTo({ top, behavior: 'smooth' })
      }

      return
    }

    // Спец-кейс: gallery — ведём к началу визуального блока галереи и перепроверяем позицию
    if (id === 'gallery') {
      const anchorTarget =
        sectionEl.querySelector('[data-gallery-anchor]') ||
        sectionEl

      const initialTop =
        anchorTarget.getBoundingClientRect().top +
        window.scrollY -
        HEADER_OFFSET

      if (window.lenis) {
        window.lenis.scrollTo(initialTop, { duration: 1.15 })

        // На случай, если по пути что-то дорендерится и сдвинет галерею
        setTimeout(() => {
          const correctedTop =
            anchorTarget.getBoundingClientRect().top +
            window.scrollY -
            HEADER_OFFSET

          if (Math.abs(window.scrollY - correctedTop) > 40) {
            window.lenis.scrollTo(correctedTop, { duration: 0.45 })
          }
        }, 1200)
      } else {
        window.scrollTo({ top: initialTop, behavior: 'smooth' })
      }

      return
    }

    // Спец-кейс: services — ведём к началу карточек услуг
    if (id === 'services') {
      const anchorTarget =
        sectionEl.querySelector('[data-services-anchor]') ||
        sectionEl

      const top = anchorTarget.getBoundingClientRect().top +
        window.scrollY - HEADER_OFFSET

      if (window.lenis) {
        window.lenis.scrollTo(top, { duration: 1.05 })
      } else {
        window.scrollTo({ top, behavior: 'smooth' })
      }
      return
    }

    // 2) Все остальные секции — классический anchor + HEADER_OFFSET
    const top = sectionEl.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET

    if (window.lenis) {
      window.lenis.scrollTo(top, { duration: 1.05 })
    } else {
      window.scrollTo({ top, behavior: 'smooth' })
    }
  }, [])

  const scrollToTop = useCallback(() => {
    if (window.lenis) {
      window.lenis.scrollTo(0, { duration: 1.0 })
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }, [])

  return (
    <ConfigContext.Provider value={config}>
      <div
        className="relative w-full overflow-hidden flex flex-col min-h-screen font-wow-body"
        style={{ background: BG, color: TEXT, lineHeight: 1.7 }}
      >
        {chatWidgetEnabled && showWidget && <ChatWidget />}
        <Nav scrollTo={scrollTo} scrollToTop={scrollToTop} />
        <main>
          {sectionsOrder.map((sectionName) => {
            if (!sections?.[sectionName]?.enabled) return null
            const renderSection = sectionRenderers[sectionName]
            if (!renderSection) return null

            const blockFlagMap = {
              hero: 'hero',
              promotion: 'promotions',
              advantages: null,
              serviceCarousel: 'services',
              services: 'services',
              gallery: 'gallery',
              beforeAfter: 'beforeAfter',
              team: 'team',
              reels: null,
              reviews: 'reviews',
              about: 'about',
              faq: 'faq',
              bookingContacts: 'contacts',
            }
            const flagKey = blockFlagMap[sectionName]
            if (flagKey && !blockFlags[flagKey]) return null

            return (
              <SectionBoundary key={sectionName} name={sectionName}>
                {renderSection()}
              </SectionBoundary>
            )
          })}
        </main>
        <Footer />
        <StickyBar enabled={blockFlags.contacts} />
      </div>
    </ConfigContext.Provider>
  )
}
