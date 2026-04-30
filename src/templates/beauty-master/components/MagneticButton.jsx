import { useRef, useEffect, useCallback } from 'react'
import { motion, useMotionValue, animate } from 'framer-motion'
import { defaultConfig } from '../../../configs/_default.config'

const { GOLD, GOLD_DIM, GOLD_BRIGHT, TEXT, TEXT_SOFT, MUTED, BG, CHOCOLATE, SURFACE, SURFACE_L, BORDER, BORDER_H, EASE } = defaultConfig.tokens

function MagneticButton({ children, className = '', style = {}, ...rest }) {
  const ref = useRef(null)
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const isDesktop = useRef(false)

  useEffect(() => {
    const mql = window.matchMedia('(hover: hover) and (pointer: fine)')
    isDesktop.current = mql.matches
    const handler = (e) => { isDesktop.current = e.matches }
    mql.addEventListener('change', handler)
    return () => mql.removeEventListener('change', handler)
  }, [])

  const handleMouseMove = useCallback((e) => {
    if (!isDesktop.current || !ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const nx = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2)
    const ny = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2)
    mx.set(Math.round(Math.max(-5, Math.min(5, nx * 5)) * 100) / 100)
    my.set(Math.round(Math.max(-3, Math.min(3, ny * 3)) * 100) / 100)
  }, [mx, my])

  const handleMouseLeave = useCallback(() => {
    animate(mx, 0, { duration: 0.18, ease: [0.16, 1, 0.3, 1] })
    animate(my, 0, { duration: 0.18, ease: [0.16, 1, 0.3, 1] })
  }, [mx, my])

  return (
    <motion.a ref={ref} onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}
      style={{ x: mx, y: my, ...style }} className={className} {...rest}>
      {children}
    </motion.a>
  )
}

export default MagneticButton
