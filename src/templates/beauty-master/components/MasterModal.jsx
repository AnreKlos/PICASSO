import { useEffect } from 'react'
import { X } from 'lucide-react'
import { motion } from 'framer-motion'
import { defaultConfig } from '../configs/_default.config'

const { GOLD, GOLD_DIM, GOLD_BRIGHT, TEXT, TEXT_SOFT, MUTED, BG, CHOCOLATE, SURFACE, SURFACE_L, BORDER, BORDER_H, EASE } = defaultConfig.tokens

function MasterModal({ master, onClose }) {
  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') onClose() }
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleKey)
    return () => { document.body.style.overflow = ''; window.removeEventListener('keydown', handleKey) }
  }, [onClose])

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 w-full h-[100dvh] overflow-hidden cursor-pointer"
      style={{ background: 'rgba(0,0,0,0.88)', backdropFilter: 'blur(20px)' }}
      onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 30, scale: 0.95 }}
        transition={{ duration: 0.4, ease: EASE }}
        className="w-full max-w-[90vw] sm:max-w-3xl max-h-[90vh] overflow-y-auto cursor-default"
        style={{ background: SURFACE, border: `1px solid ${BORDER_H}`, borderRadius: 20 }}
        onClick={(e) => e.stopPropagation()}
        data-lenis-prevent>
        <div className="flex flex-col sm:flex-row gap-8 p-6 sm:p-8">
          <div className="shrink-0 sm:w-[220px] max-h-[40vh] sm:max-h-none overflow-hidden" style={{ borderRadius: 12 }}>
            <img src={master.image} alt={master.name} className="w-full max-w-[90vw] sm:max-w-full h-full aspect-[3/4] object-cover pointer-events-none" style={{ borderRadius: 12 }} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-picasso-body text-[11px] uppercase tracking-[0.2em] mb-2" style={{ color: GOLD }}>{master.role}</p>
            <h3 className="font-picasso-display text-2xl sm:text-3xl font-medium mb-1" style={{ color: TEXT }}>{master.name}</h3>
            <p className="text-[14px] font-light mb-6" style={{ color: MUTED }}>{master.exp}</p>
            <div className="flex flex-col gap-y-2">
              {master.details.map((d, i) => (
                <div key={i} className="flex items-start gap-3">
                  <span className="mt-[7px] shrink-0 w-1.5 h-1.5 rounded-full" style={{ background: GOLD }} />
                  <p className="text-[14px] font-light leading-relaxed" style={{ color: TEXT_SOFT }}>{d}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
        <button onClick={onClose} className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center cursor-pointer" aria-label="Закрыть информацию о мастере"
          style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 9999, color: TEXT }}>
          <X size={18} />
        </button>
      </motion.div>
    </motion.div>
  )
}

export default MasterModal
