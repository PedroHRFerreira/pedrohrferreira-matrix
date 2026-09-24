'use client'

import { useEffect, useRef } from 'react'
import styles from './StormAtmosphere.module.scss'

export function StormAtmosphere({
  paused = false,
  className = ''
}: {
  paused?: boolean
  className?: string
}) {
  const root = useRef<HTMLDivElement>(null)
  const canvas = useRef<HTMLCanvasElement>(null)
  const flash = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const element = root.current
    const surface = canvas.current
    const light = flash.current
    if (!element || !surface || !light) return
    const context = surface.getContext('2d')
    if (!context) return
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)')
    let frame = 0
    let visible = true
    let running = false
    let width = 1
    let height = 1
    let previous = 0
    let nextFlash = 0
    let flashStart = -Infinity
    let strength = 0
    // Keep all 105 drops and their trajectories; batch similar ink weights.
    const layers = Array.from({ length: 12 }, (_, index) => {
      const depth = 0.4 + ((index + 0.5) / 12) * 0.6
      return {
        depth,
        stroke: `rgba(220,218,195,${depth * 0.2})`,
        drops: [] as Array<{ x: number; y: number; depth: number }>
      }
    })
    for (let index = 0; index < 105; index++) {
      const drop = { x: Math.random(), y: Math.random(), depth: 0.4 + Math.random() * 0.6 }
      layers[Math.min(11, Math.floor(((drop.depth - 0.4) / 0.6) * 12))].drops.push(drop)
    }
    let previousOpacity = '0'
    const resize = () => {
      const bounds = element.getBoundingClientRect()
      width = bounds.width
      height = bounds.height
      const ratio = Math.min(window.devicePixelRatio || 1, 1.5)
      surface.width = Math.round(width * ratio)
      surface.height = Math.round(height * ratio)
      context.setTransform(ratio, 0, 0, ratio, 0, 0)
    }
    const draw = (time: number) => {
      if (!running) return
      const delta = Math.min((time - previous) / 1000, 0.05)
      previous = time
      context.clearRect(0, 0, width, height)
      for (const layer of layers) {
        context.strokeStyle = layer.stroke
        context.lineWidth = layer.depth * 0.8
        context.beginPath()
        for (const drop of layer.drops) {
          drop.y += delta * (0.32 + drop.depth * 0.42)
          drop.x -= delta * 0.035 * drop.depth
          if (drop.y > 1.05) {
            drop.y = -0.05
            drop.x = Math.random()
          }
          if (drop.x < -0.05) drop.x = 1.05
          const x = drop.x * width
          const y = drop.y * height
          context.moveTo(x, y)
          context.lineTo(x - drop.depth * 5, y + drop.depth * 24)
        }
        context.stroke()
      }
      if (time >= nextFlash) {
        flashStart = time
        strength = 0.1 + Math.random() * 0.12
        nextFlash = time + 7000 + Math.random() * 7000
      }
      const elapsed = time - flashStart
      const opacity = elapsed < 650 ? String(strength * Math.max(0, 1 - elapsed / 650)) : '0'
      if (opacity !== previousOpacity) {
        light.style.opacity = opacity
        previousOpacity = opacity
      }
      frame = requestAnimationFrame(draw)
    }
    const sync = () => {
      cancelAnimationFrame(frame)
      running = !paused && !preference.matches && !document.hidden && visible
      light.style.opacity = '0'
      previousOpacity = '0'
      context.clearRect(0, 0, width, height)
      if (running) {
        previous = performance.now()
        nextFlash = previous + 7000 + Math.random() * 7000
        flashStart = -Infinity
        frame = requestAnimationFrame(draw)
      }
    }
    const observer = new IntersectionObserver((entries) => {
      visible = entries[0].isIntersecting
      sync()
    })
    const sizing = new ResizeObserver(resize)
    observer.observe(element)
    sizing.observe(element)
    document.addEventListener('visibilitychange', sync)
    preference.addEventListener('change', sync)
    resize()
    sync()
    return () => {
      running = false
      cancelAnimationFrame(frame)
      observer.disconnect()
      sizing.disconnect()
      document.removeEventListener('visibilitychange', sync)
      preference.removeEventListener('change', sync)
      light.style.opacity = '0'
    }
  }, [paused])

  return (
    <div ref={root} className={`${styles.atmosphere} ${className}`} aria-hidden="true">
      <canvas ref={canvas} />
      <div ref={flash} className={styles.flash} />
    </div>
  )
}
