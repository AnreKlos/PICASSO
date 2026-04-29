import { useRef, useEffect } from 'react'
import { defaultConfig } from '../configs/_default.config'

const { GOLD, GOLD_DIM, GOLD_BRIGHT, TEXT, TEXT_SOFT, MUTED, BG, CHOCOLATE, SURFACE, SURFACE_L, BORDER, BORDER_H, EASE } = defaultConfig.tokens

function TiltGlare({ children, className = '', style = {} }) {
  const ref = useRef(null)
  const tiltRef = useRef({ x: 0, y: 0, glareX: 50, glareY: 50, glareO: 0 })

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const target = { x: 0, y: 0, glareX: 50, glareY: 50, glareO: 0 }
    const current = { x: 0, y: 0, glareX: 50, glareY: 50, glareO: 0 }

    const glare = el.querySelector('.tilt-glare')
    let frame = null
    let active = false

    function startLoop() {
      if (!active) { active = true; frame = requestAnimationFrame(tick) }
    }

    function tick() {
      current.x += (target.x - current.x) * 0.025
      current.y += (target.y - current.y) * 0.025
      current.glareX += (target.glareX - current.glareX) * 0.04
      current.glareY += (target.glareY - current.glareY) * 0.04
      current.glareO += (target.glareO - current.glareO) * 0.02
      el.style.transform = `perspective(800px) rotateX(${current.x}deg) rotateY(${current.y}deg)`
      if (glare) {
        glare.style.background = `radial-gradient(circle at ${current.glareX}% ${current.glareY}%, rgba(255,255,255,${current.glareO}), transparent 60%)`
      }
      const settled = Math.abs(target.x - current.x) < 0.01 && Math.abs(target.y - current.y) < 0.01 && Math.abs(target.glareO - current.glareO) < 0.001
      if (settled) { active = false; frame = null } else { frame = requestAnimationFrame(tick) }
    }

    function onMove(e) {
      const rect = el.getBoundingClientRect()
      const px = (e.clientX - rect.left) / rect.width
      const py = (e.clientY - rect.top) / rect.height
      target.x = (py - 0.5) * -8
      target.y = (px - 0.5) * 8
      target.glareX = px * 100
      target.glareY = py * 100
      target.glareO = 0.15
      startLoop()
    }

    function onLeave() {
      target.x = 0; target.y = 0; target.glareO = 0
      startLoop()
    }

    el.addEventListener('mousemove', onMove)
    el.addEventListener('mouseleave', onLeave)
    return () => {
      if (frame) cancelAnimationFrame(frame)
      el.removeEventListener('mousemove', onMove)
      el.removeEventListener('mouseleave', onLeave)
    }
  }, [])

  return (
    <div ref={ref} className={className} style={{ ...style, transformStyle: 'preserve-3d' }}>
      {children}
      <div className="tilt-glare absolute inset-0 pointer-events-none rounded-3xl" style={{ mixBlendMode: 'overlay' }} />
    </div>
  )
}

export default TiltGlare
