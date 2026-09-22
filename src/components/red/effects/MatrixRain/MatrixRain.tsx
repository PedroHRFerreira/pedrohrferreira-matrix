'use client'

import { useEffect, useRef } from 'react'

import styles from './styles.module.scss'

export interface MatrixRainProps {
  className?: string
}

const glyphs = '01アイウエオカキクケコサシスセソABCDEFGHIJKLMNOPQRSTUVWXYZ'

export function MatrixRain({ className }: MatrixRainProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const context = canvas.getContext('2d')
    if (!context) return

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    let frame = 0
    let visible = true
    let previousTime = 0
    let columns = 0
    let drops: number[] = []
    const fontSize = window.innerWidth < 720 ? 15 : 18

    const resize = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 1.5)
      const rect = canvas.getBoundingClientRect()
      canvas.width = Math.max(1, Math.floor(rect.width * ratio))
      canvas.height = Math.max(1, Math.floor(rect.height * ratio))
      context.setTransform(ratio, 0, 0, ratio, 0, 0)
      columns = Math.ceil(rect.width / fontSize)
      drops = Array.from({ length: columns }, (_, index) => drops[index] ?? Math.random() * -40)
    }

    const draw = (time = 0) => {
      if (!visible || document.hidden || reducedMotion.matches) return
      frame = requestAnimationFrame(draw)
      if (time - previousTime < 52) return
      previousTime = time

      const width = canvas.clientWidth
      const height = canvas.clientHeight
      context.fillStyle = 'rgba(0, 0, 0, 0.075)'
      context.fillRect(0, 0, width, height)
      context.font = `${fontSize}px monospace`
      context.textAlign = 'center'

      drops.forEach((drop, index) => {
        const glyph = glyphs[Math.floor(Math.random() * glyphs.length)]
        context.fillStyle = Math.random() > 0.975 ? '#d7ffe3' : '#22e66b'
        context.fillText(glyph, index * fontSize + fontSize / 2, drop * fontSize)
        drops[index] = drop * fontSize > height && Math.random() > 0.982 ? 0 : drop + 0.68
      })
    }

    const renderStill = () => {
      context.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight)
      context.fillStyle = 'rgba(34, 230, 107, 0.2)'
      context.font = `${fontSize}px monospace`
      for (let index = 0; index < Math.min(columns, 24); index += 2) {
        context.fillText(
          glyphs[index % glyphs.length],
          index * fontSize,
          (index % 6) * fontSize * 2
        )
      }
    }

    const syncAnimation = () => {
      cancelAnimationFrame(frame)
      if (reducedMotion.matches) {
        renderStill()
      } else if (visible && !document.hidden) {
        frame = requestAnimationFrame(draw)
      }
    }

    const observer = new IntersectionObserver(([entry]) => {
      visible = entry?.isIntersecting ?? false
      syncAnimation()
    })
    const resizeObserver = new ResizeObserver(() => {
      resize()
      syncAnimation()
    })

    observer.observe(canvas)
    resizeObserver.observe(canvas)
    reducedMotion.addEventListener('change', syncAnimation)
    document.addEventListener('visibilitychange', syncAnimation)
    resize()
    syncAnimation()

    return () => {
      cancelAnimationFrame(frame)
      observer.disconnect()
      resizeObserver.disconnect()
      reducedMotion.removeEventListener('change', syncAnimation)
      document.removeEventListener('visibilitychange', syncAnimation)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className={[styles.canvas, className].filter(Boolean).join(' ')}
      aria-hidden="true"
    />
  )
}
