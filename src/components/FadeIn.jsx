import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { picassoConfig } from '../configs/picasso.config'

const { GOLD, GOLD_DIM, GOLD_BRIGHT, TEXT, TEXT_SOFT, MUTED, BG, CHOCOLATE, SURFACE, SURFACE_L, BORDER, BORDER_H, EASE } = picassoConfig.tokens

function FadeIn({ children, className = '', delay = 0, direction = 'up', distance = 50 }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-50px' })
  const d = { up: { y: distance }, down: { y: -distance }, left: { x: distance }, right: { x: -distance } }[direction] || { y: distance }
  return (
    <motion.div ref={ref} initial={{ opacity: 0, ...d }} animate={inView ? { opacity: 1, y: 0, x: 0 } : {}} transition={{ duration: 1, ease: EASE, delay }} className={className}>
      {children}
    </motion.div>
  )
}

export default FadeIn
