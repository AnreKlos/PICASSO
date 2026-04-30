import { ChevronDown } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { defaultConfig } from '../../../configs/_default.config'

const { GOLD, GOLD_DIM, GOLD_BRIGHT, TEXT, TEXT_SOFT, MUTED, BG, CHOCOLATE, SURFACE, SURFACE_L, BORDER, BORDER_H, EASE } = defaultConfig.tokens

function FAQItem({ q, a, isOpen, onToggle }) {
  return (
    <div style={{ borderBottom: `1px solid ${BORDER}` }}>
      <button onClick={onToggle} className="w-full flex items-center justify-between py-6 text-left group cursor-pointer">
        <span className="font-wow-display text-lg sm:text-xl font-medium pr-6" style={{ color: TEXT }}>{q}</span>
        <motion.span animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.3, ease: EASE }} className="shrink-0" style={{ color: MUTED }}>
          <ChevronDown size={22} />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.4, ease: EASE }} style={{ overflow: 'hidden' }}>
            <p className="pb-6 leading-relaxed pr-8 text-[15px] font-light" style={{ color: TEXT_SOFT }}>{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default FAQItem
