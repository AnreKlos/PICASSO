import { useState } from 'react'
import { picassoConfig } from '../config/picasso.config'

const { GOLD, GOLD_DIM, GOLD_BRIGHT, TEXT, TEXT_SOFT, MUTED, BG, CHOCOLATE, SURFACE, SURFACE_L, BORDER, BORDER_H, EASE } = picassoConfig.tokens

function GoldSpan({ children }) {
  const [glow, setGlow] = useState(false)
  return (
    <span
      className="italic inline-block transition-all duration-300 select-none"
      style={{
        color: GOLD,
        textShadow: glow
          ? `0 0 18px rgba(201,168,122,0.3), 0 0 40px rgba(201,168,122,0.1)`
          : 'none',
      }}
      onMouseEnter={() => setGlow(true)}
      onMouseLeave={() => setGlow(false)}
    >
      {children}
    </span>
  )
}

export default GoldSpan
