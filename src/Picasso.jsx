import { useState, useEffect, useCallback } from 'react'
import Lenis from 'lenis'
import { picassoConfig } from './config/picasso.config'
import SectionBoundary from './components/SectionBoundary'
import ChatWidget from './widgets/Kolya/ChatWidget'
import Nav from './sections/Nav/Nav'
import Hero from './sections/Hero/Hero'
import About from './sections/About/About'
import Services from './sections/Services/Services'
import Prices from './sections/Prices/Prices'
import Gallery from './sections/Gallery/Gallery'
import Team from './sections/Team/Team'
import Reviews from './sections/Reviews/Reviews'
import FAQ from './sections/FAQ/FAQ'
import Booking from './sections/Booking/Booking'
import Contacts from './sections/Contacts/Contacts'
import Footer from './sections/Footer/Footer'

const { BG, TEXT } = picassoConfig.tokens

export default function Picasso() {
  const [showWidget, setShowWidget] = useState(false)
  const { sections } = picassoConfig
  const { enabled: chatWidgetEnabled, tooltipDelayMs, mountDelayMs } = picassoConfig.features.chatWidget

  void tooltipDelayMs

  useEffect(() => {
    const id = setTimeout(() => setShowWidget(true), mountDelayMs)
    return () => clearTimeout(id)
  }, [mountDelayMs])

  useEffect(() => {
    let lenis, rafId = 0, tabVisible = true, cancelled = false
    let startLenis = () => {}, stopLenis = () => {}, cleanupVis = () => {}, cleanupScroll = () => {}

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

      const emitScroll = () => window.dispatchEvent(new Event('scroll'))
      lenis.on('scroll', emitScroll)
      cleanupScroll = () => lenis.off('scroll', emitScroll)

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
      cleanupScroll()
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
    const HEADER_OFFSET = 88

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
    <div
      className="relative w-full overflow-hidden flex flex-col min-h-screen font-picasso-body"
      style={{ background: BG, color: TEXT, lineHeight: 1.7 }}
    >
      {chatWidgetEnabled && showWidget && <ChatWidget />}
      <Nav scrollTo={scrollTo} scrollToTop={scrollToTop} />
      <main>
        {sections.hero?.enabled && (
          <SectionBoundary name="hero">
            <Hero scrollTo={scrollTo} />
          </SectionBoundary>
        )}

        {sections.about?.enabled && (
          <SectionBoundary name="about">
            <About />
          </SectionBoundary>
        )}

        {sections.services?.enabled && (
          <SectionBoundary name="services">
            <Services />
          </SectionBoundary>
        )}

        {sections.services?.enabled && (
          <SectionBoundary name="prices">
            <Prices />
          </SectionBoundary>
        )}

        {sections.gallery?.enabled && (
          <SectionBoundary name="gallery">
            <Gallery />
          </SectionBoundary>
        )}

        {sections.team?.enabled && (
          <SectionBoundary name="team">
            <Team />
          </SectionBoundary>
        )}

        {sections.reviews?.enabled && (
          <SectionBoundary name="reviews">
            <Reviews />
          </SectionBoundary>
        )}

        {sections.faq?.enabled && (
          <SectionBoundary name="faq">
            <FAQ />
          </SectionBoundary>
        )}

        {sections.bookingContacts?.enabled && (
          <SectionBoundary name="booking">
            <Booking />
          </SectionBoundary>
        )}

        {sections.bookingContacts?.enabled && (
          <SectionBoundary name="contacts">
            <Contacts />
          </SectionBoundary>
        )}
      </main>
      <Footer />
    </div>
  )
}
