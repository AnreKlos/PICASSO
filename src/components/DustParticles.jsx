import { useRef, useEffect } from 'react'
import { picassoConfig } from '../config/picasso.config'

const { GOLD, GOLD_DIM, GOLD_BRIGHT, TEXT, TEXT_SOFT, MUTED, BG, CHOCOLATE, SURFACE, SURFACE_L, BORDER, BORDER_H, EASE } = picassoConfig.tokens

function DustParticles({ className = '', density = 1, opacityBoost = 1 }) {
  const canvasRef = useRef(null)
  const frameRef = useRef(null)
  const particlesRef = useRef([])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const isDesktop = window.matchMedia('(min-width: 768px)').matches
    if (!isDesktop) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const setup = () => {
      const parent = canvas.parentElement
      const width = parent?.offsetWidth || window.innerWidth
      const height = parent?.offsetHeight || 600
      const dpr = Math.min(window.devicePixelRatio || 1, 2)

      canvas.width = width * dpr
      canvas.height = height * dpr
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      const fallCount = Math.round(26 * density)
      const driftCount = Math.round(12 * density)
      const largeCount = Math.round(5 * density)

      const particles = []

      for (let i = 0; i < fallCount; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          r: Math.random() * 1.4 + 0.4,
          vx: (Math.random() - 0.5) * 0.06,
          vy: Math.random() * 0.18 + 0.03,
          a: (Math.random() * 0.18 + 0.05) * opacityBoost,
          type: 'fall',
        })
      }

      for (let i = 0; i < driftCount; i++) {
        const dir = i < driftCount / 2 ? 1 : -1
        particles.push({
          x: dir === 1 ? -20 : width + 20,
          y: Math.random() * height,
          r: Math.random() * 1.8 + 0.7,
          vx: dir * (Math.random() * 0.22 + 0.08),
          vy: Math.random() * 0.05 + 0.01,
          a: (Math.random() * 0.22 + 0.08) * opacityBoost,
          type: 'drift',
        })
      }

      for (let i = 0; i < largeCount; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          r: Math.random() * 2.2 + 1.8,
          vx: (Math.random() - 0.5) * 0.02,
          vy: Math.random() * 0.05 + 0.01,
          a: (Math.random() * 0.06 + 0.025) * opacityBoost,
          type: 'large',
        })
      }

      particlesRef.current = particles
    }

    const render = () => {
      const width = canvas.clientWidth
      const height = canvas.clientHeight

      ctx.clearRect(0, 0, width, height)

      for (const p of particlesRef.current) {
        p.x += p.vx
        p.y += p.vy

        if (p.type === 'fall' || p.type === 'large') {
          if (p.y > height + 12) {
            p.y = -12
            p.x = Math.random() * width
          }
          if (p.x > width + 12) p.x = -12
          if (p.x < -12) p.x = width + 12
        }

        if (p.type === 'drift') {
          if (p.vx > 0 && p.x > width + 20) {
            p.x = -20
            p.y = Math.random() * height
          }
          if (p.vx < 0 && p.x < -20) {
            p.x = width + 20
            p.y = Math.random() * height
          }
          if (p.y > height + 12) p.y = -12
        }

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(201,168,122,${Math.min(p.a * 0.55, 0.12)})`
        ctx.fill()
      }

      frameRef.current = requestAnimationFrame(render)
    }

    let visible = true
    let inViewport = true

    function start() {
      if (!frameRef.current && visible && inViewport) {
        frameRef.current = requestAnimationFrame(render)
      }
    }

    function stop() {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current)
        frameRef.current = null
      }
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        inViewport = entry.isIntersecting
        inViewport ? start() : stop()
      },
      { threshold: 0 }
    )
    observer.observe(canvas)

    const onVisChange = () => {
      visible = !document.hidden
      visible ? start() : stop()
    }
    document.addEventListener('visibilitychange', onVisChange)

    setup()
    start()

    window.addEventListener('resize', setup, { passive: true })

    return () => {
      stop()
      observer.disconnect()
      document.removeEventListener('visibilitychange', onVisChange)
      window.removeEventListener('resize', setup)
    }
  }, [density, opacityBoost])

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 pointer-events-none hidden md:block ${className}`}
      style={{ zIndex: 3, opacity: 0.7, filter: 'blur(1.4px)' }}
      aria-hidden="true"
    />
  )
}

export default DustParticles
