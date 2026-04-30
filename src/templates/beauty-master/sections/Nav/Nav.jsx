import { useState, useEffect, useContext } from 'react'
import { X, Menu } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { defaultConfig } from '../../../../configs/_default.config'
import { ConfigContext } from '../../../../contexts/ConfigContext'
import MagneticButton from '../../components/MagneticButton'
import { scrollToBooking } from '../../../../utils/scrollToBooking'
import { getNavItems } from '../../../../utils/getAvailableSections'

function Nav({ scrollTo, scrollToTop }) {
  const configFromContext = useContext(ConfigContext)
  const config = configFromContext || defaultConfig
  const { GOLD, GOLD_DIM, GOLD_BRIGHT, TEXT, MUTED, BG, BORDER, EASE } = config.tokens
  const brandText = config.meta?.brand?.text || config.meta?.brand?.shortName || config.meta?.brand?.name || config.meta?.name || 'Sample Brand'

  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  const navItems = getNavItems(config)

  return (
    <motion.nav initial={{ y: -40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.6, ease: EASE }}
      className={`fixed top-0 left-0 right-0 w-full z-40 transition-all duration-500 overflow-hidden ${scrolled ? 'backdrop-blur-lg' : ''}`}
      style={{ background: scrolled ? 'rgba(14,12,11,0.92)' : 'transparent', borderBottom: `1px solid ${scrolled ? BORDER : 'transparent'}` }}>
      <div className="mx-auto max-w-6xl px-5 sm:px-8 flex items-center justify-between h-16 gap-3">
        {(() => {
          const words = brandText.split(/\s+/).filter(Boolean)
          const longestWord = Math.max(...words.map(w => w.length))
          
          const sizeClass = longestWord > 10
            ? 'text-sm sm:text-base lg:text-lg tracking-[0.04em]'
            : 'text-base sm:text-lg lg:text-xl'
          
          const baseClasses = 'font-picasso-display font-semibold tracking-[0.06em] select-none cursor-pointer text-left leading-none shrink-0 whitespace-nowrap'
          
          return (
            <button
              type="button"
              onClick={scrollToTop}
              className={`${baseClasses} ${sizeClass}`}
              style={{ color: GOLD, textShadow: '0 0 20px rgba(201,168,122,0.15)' }}
            >
              {brandText}
            </button>
          )
        })()}
        <div className="hidden lg:flex items-center gap-5 font-picasso-body text-[12px] xl:text-[13px] font-medium uppercase tracking-[0.1em]" style={{ color: MUTED }}>
          {navItems.map(item => <a key={item.key} href={`#${item.anchorId}`} onClick={(e) => { e.preventDefault(); scrollTo(`#${item.anchorId}`) }} className="hover:text-[var(--color-picasso-text)] transition-colors duration-200 whitespace-nowrap" style={{ color: MUTED }}>{item.label}</a>)}
          <MagneticButton href="#bookingContacts-section" onClick={(e) => { e.preventDefault(); scrollToBooking() }}
            className="inline-flex items-center gap-2 px-5 py-2 transition-all duration-300 font-picasso-body text-[13px] font-medium uppercase tracking-[0.12em]"
            style={{ background: `linear-gradient(to bottom, ${GOLD_BRIGHT} 0%, ${GOLD} 50%, ${GOLD_DIM} 100%)`, color: BG, borderRadius: 9999, boxShadow: '0 2px 12px rgba(201,168,122,0.15), inset 0 1px 0 rgba(255,255,255,0.2), inset 0 -1px 0 rgba(0,0,0,0.12)' }}>
            Записаться
          </MagneticButton>
        </div>
        <button className="lg:hidden cursor-pointer" style={{ color: TEXT }} onClick={() => setMobileOpen(!mobileOpen)} aria-label={mobileOpen ? 'Закрыть меню' : 'Открыть меню'}>
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
      <AnimatePresence>
        {mobileOpen && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }}
            className="lg:hidden overflow-hidden" style={{ background: 'rgba(14,12,11,0.97)', borderTop: `1px solid ${BORDER}` }}>
            <div className="flex flex-col gap-4 px-6 py-6 font-picasso-body text-[14px] uppercase tracking-[0.1em]" style={{ color: MUTED }}>
              {navItems.map(item => <a key={item.key} href={`#${item.anchorId}`} onClick={(e) => { e.preventDefault(); setMobileOpen(false); scrollTo(`#${item.anchorId}`) }} className="py-1" style={{ color: MUTED }}>{item.label}</a>)}
              <button
                type="button"
                onClick={() => {
                  setMobileOpen(false)
                  scrollToBooking()
                }}
                className="mt-2 inline-flex items-center justify-center gap-2 px-5 py-3 cursor-pointer"
                style={{ background: GOLD, color: BG, borderRadius: 9999 }}
                aria-label="Перейти к записи"
              >
                Записаться
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}

export default Nav
