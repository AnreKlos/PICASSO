import { useEffect } from 'react'
import { X } from 'lucide-react'
import { motion } from 'framer-motion'
import { picassoConfig } from '../configs/picasso.config'

const { GOLD, GOLD_DIM, GOLD_BRIGHT, TEXT, TEXT_SOFT, MUTED, BG, CHOCOLATE, SURFACE, SURFACE_L, BORDER, BORDER_H, EASE } = picassoConfig.tokens

function Lightbox({ src, alt, onClose }) {
  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') onClose() }
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleKey)
    return () => { document.body.style.overflow = ''; window.removeEventListener('keydown', handleKey) }
  }, [onClose])

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}
      className="fixed inset-0 z-[60] w-full h-[100dvh] flex items-center justify-center overflow-hidden cursor-pointer"
      style={{ background: 'rgba(0,0,0,0.92)', backdropFilter: 'blur(20px)' }}
      onClick={onClose}>
      <motion.img
        initial={{ scale: 0.85, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.85, opacity: 0 }}
        transition={{ duration: 0.35, ease: EASE }}
        src={src} alt={alt} className="block max-w-[95vw] max-h-[80vh] w-auto h-auto object-contain pointer-events-none" style={{ borderRadius: 8 }} />
      <button onClick={onClose} className="absolute top-6 right-6 w-10 h-10 flex items-center justify-center cursor-pointer" aria-label="Закрыть"
        style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 9999, color: TEXT }}>
        <X size={18} />
      </button>
    </motion.div>
  )
}

export default Lightbox
