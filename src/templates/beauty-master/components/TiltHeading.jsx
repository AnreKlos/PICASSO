import { useState, useRef, useEffect, useCallback } from 'react'
import { defaultConfig } from '../../../configs/_default.config'

const { GOLD, GOLD_DIM, GOLD_BRIGHT, TEXT, TEXT_SOFT, MUTED, BG, CHOCOLATE, SURFACE, SURFACE_L, BORDER, BORDER_H, EASE } = defaultConfig.tokens

function TiltHeading({ children, className = '', as: Tag = 'h2', style = {} }) {
  const ref = useRef(null)
  const targetRef = useRef({ x: 0, y: 0 })
  const currentRef = useRef({ x: 0, y: 0 })
  const [render, setRender] = useState({ x: 0, y: 0 })
  const [hovering, setHovering] = useState(false)
  const swayAngleRef = useRef(0)
  const frameRef = useRef(null)

  useEffect(() => {
    const isDesktop = window.matchMedia('(hover: hover) and (pointer: fine)').matches

    if (!isDesktop) {
      setRender({ x: 0, y: 0 })
      return
    }

    let lastX = 0
    let lastY = 0
    let running = false

    function startLoop() {
      if (!running) { running = true; frameRef.current = requestAnimationFrame(animateFrame) }
    }

    function animateFrame() {
      swayAngleRef.current += hovering ? 0.02 : 0

      const swayX = hovering ? Math.sin(swayAngleRef.current) * 1.5 : 0
      const swayY = hovering ? Math.cos(swayAngleRef.current * 0.7) * 1.0 : 0

      currentRef.current.x += (targetRef.current.x + swayX - currentRef.current.x) * 0.08
      currentRef.current.y += (targetRef.current.y + swayY - currentRef.current.y) * 0.08

      const nx = Math.round(currentRef.current.x * 100) / 100
      const ny = Math.round(currentRef.current.y * 100) / 100

      if (nx !== lastX || ny !== lastY) {
        lastX = nx
        lastY = ny
        setRender({ x: nx, y: ny })
      }

      const settled = !hovering && Math.abs(nx) < 0.01 && Math.abs(ny) < 0.01
      if (settled) { running = false; frameRef.current = null } else { frameRef.current = requestAnimationFrame(animateFrame) }
    }

    startLoop()

    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current)
      running = false
    }
  }, [hovering])

  const handleMouseMove = useCallback((e) => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    targetRef.current = { x: y * -5, y: x * 5 }
  }, [])

  return (
    <Tag
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => { targetRef.current = { x: 0, y: 0 }; setHovering(false) }}
      className={`${className} cursor-default select-none will-change-transform`}
      style={{
        ...style,
        transform: `perspective(800px) rotateX(${render.x}deg) rotateY(${render.y}deg) translateZ(0)`,
        textShadow: hovering
          ? `0 0 40px rgba(201,168,122,0.12), 0 4px 20px rgba(0,0,0,0.3)`
          : `0 4px 20px rgba(0,0,0,0.2)`,
      }}
    >
      {children}
    </Tag>
  )
}

export default TiltHeading
