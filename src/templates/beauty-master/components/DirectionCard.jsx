import { ChevronDown } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import FadeIn from './FadeIn'
import { defaultConfig } from '../configs/_default.config'

const { GOLD, GOLD_DIM, GOLD_BRIGHT, TEXT, TEXT_SOFT, MUTED, BG, CHOCOLATE, SURFACE, SURFACE_L, BORDER, BORDER_H, EASE } = defaultConfig.tokens

function DirectionCard({ Icon, title, tagline, items, isOpen, onToggle, delay = 0 }) {
  return (
    <FadeIn delay={delay}>
      <div className="group cursor-pointer transition-[box-shadow,border-color] duration-300"
        style={{ background: SURFACE, border: `1px solid ${isOpen ? BORDER_H : BORDER}`, borderRadius: 16, overflow: 'hidden' }}
        onClick={onToggle}>
        <div className="px-6 sm:px-7 py-6 flex items-center gap-5">
          <div className="w-12 h-12 shrink-0 flex items-center justify-center" style={{ border: `1px solid ${BORDER_H}`, borderRadius: 9999, background: 'rgba(201,168,122,0.04)' }}>
            <Icon size={20} style={{ color: GOLD }} strokeWidth={1.5} />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-picasso-display text-lg sm:text-xl font-medium" style={{ color: TEXT }}>{title}</h3>
            <p className="mt-0.5 text-[13px] font-light truncate" style={{ color: MUTED }}>{tagline}</p>
          </div>
          <motion.span animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.3, ease: EASE }} className="shrink-0" style={{ color: MUTED }}>
            <ChevronDown size={20} />
          </motion.span>
        </div>
        <AnimatePresence initial={false}>
          {isOpen && (
            <motion.div key="content" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.4, ease: EASE }} style={{ overflow: 'hidden' }}>
              <div className="px-6 sm:px-7 pb-6">
                <div style={{ borderTop: `1px solid ${BORDER}`, paddingTop: 20 }} className="flex flex-col gap-4">
                  {items.map((item) => (
                    <div key={item.name} className="flex items-baseline gap-3 flex-wrap">
                      <span className="font-picasso-body text-[14px] sm:text-[15px] font-light" style={{ color: TEXT_SOFT }}>{item.name}</span>
                      <span className="hidden sm:inline flex-1 border-b min-w-[30px] mb-1" style={{ borderColor: 'rgba(255,255,255,0.04)', borderStyle: 'dotted' }} />
                      <span className="font-picasso-body text-[14px] sm:text-[15px] font-light shrink-0" style={{ color: GOLD }}>{item.price}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </FadeIn>
  )
}

export default DirectionCard
