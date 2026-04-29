import { useContext } from 'react'
import { picassoConfig } from '../configs/picasso.config'
import { ConfigContext } from '../contexts/ConfigContext'

export default function StickyBar({ enabled = false }) {
  if (!enabled) return null

  const configFromContext = useContext(ConfigContext)
  const config = configFromContext || picassoConfig
  const { GOLD, GOLD_BRIGHT, TEXT, BG } = config.tokens

  const handleScrollToBooking = () => {
    const target = document.getElementById('booking')
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <div className="sticky-bar-mobile">
      <div className="flex items-center justify-between px-4 py-3" style={{ background: 'rgba(0, 0, 0, 0.88)', color: '#F0EBE3', height: '56px' }}>
        <span className="text-sm font-picasso-body" style={{ color: '#F0EBE3' }}>
          Записаться в студию
        </span>
        <button
          onClick={handleScrollToBooking}
          className="px-5 py-2 rounded-full font-picasso-body text-[13px] font-medium uppercase tracking-[0.14em] transition-all duration-300 cursor-pointer"
          style={{
            background: GOLD,
            color: BG,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = GOLD_BRIGHT
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = GOLD
          }}
        >
          Записаться
        </button>
      </div>
    </div>
  )
}
