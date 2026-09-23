'use client'

import { useEffect, useRef } from 'react'
import type { CSSProperties } from 'react'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import styles from './styles.module.scss'

export interface SkyBackgroundProps {
  className?: string
}

const clouds = [
  { top: 8, left: 5, size: 36, duration: 18, delay: -8, opacity: 0.78, depth: 0.4 },
  { top: 29, left: 68, size: 29, duration: 22, delay: -17, opacity: 0.7, depth: 0.6 },
  { top: 48, left: 30, size: 43, duration: 25, delay: -11, opacity: 0.82, depth: 1 },
  { top: 68, left: 75, size: 33, duration: 20, delay: -4, opacity: 0.72, depth: 0.8 },
  { top: 82, left: 3, size: 47, duration: 23, delay: -19, opacity: 0.76, depth: 1.2 },
  { top: 14, left: 44, size: 32, duration: 29, delay: -12, opacity: 0.6, depth: 0.5 },
  { top: 58, left: 9, size: 24, duration: 31, delay: -6, opacity: 0.5, depth: 0.7 },
  { top: 88, left: 62, size: 35, duration: 26, delay: -14, opacity: 0.6, depth: 0.9 }
] as const

export function SkyBackground({ className }: SkyBackgroundProps) {
  const reducedMotion = useReducedMotion()
  const fieldRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const field = fieldRef.current
    if (!field || reducedMotion) return
    const updateVisibility = () => {
      field.dataset.playing = String(!document.hidden)
    }
    const start = window.setTimeout(updateVisibility, 300)
    document.addEventListener('visibilitychange', updateVisibility)
    const precise = window.matchMedia('(min-width: 64rem) and (pointer: fine)')
    let frame = 0
    let x = 0
    let y = 0
    const move = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse' || !precise.matches) return
      x = event.clientX
      y = event.clientY
      if (frame) return
      frame = requestAnimationFrame(() => {
        frame = 0
        field.style.setProperty('--parallax-x', `${(x / innerWidth - 0.5) * 12}px`)
        field.style.setProperty('--parallax-y', `${(y / innerHeight - 0.5) * 8}px`)
      })
    }
    window.addEventListener('pointermove', move, { passive: true })
    return () => {
      window.clearTimeout(start)
      document.removeEventListener('visibilitychange', updateVisibility)
      window.removeEventListener('pointermove', move)
      cancelAnimationFrame(frame)
      field.style.removeProperty('--parallax-x')
      field.style.removeProperty('--parallax-y')
    }
  }, [reducedMotion])

  return (
    <div className={[styles.sky, className].filter(Boolean).join(' ')} aria-hidden="true">
      <div className={styles.cloudField} ref={fieldRef}>
        {clouds.map((cloud, index) => (
          <span
            className={styles.cloudPosition}
            key={index}
            style={
              {
                '--cloud-top': `${cloud.top}%`,
                '--cloud-static-left': `${cloud.left}%`,
                '--cloud-size': `${cloud.size}rem`,
                '--cloud-duration': `${cloud.duration}s`,
                '--cloud-delay': `${cloud.delay}s`,
                '--cloud-opacity': Math.min(1, cloud.opacity + 0.15),
                '--cloud-depth': cloud.depth
              } as CSSProperties
            }
          >
            {index === 0 && (
              <span className={styles.cloudEcho}>
                <span className={styles.cloudShape} />
              </span>
            )}
            <span className={styles.cloudBob}>
              <span className={styles.cloudShape} />
            </span>
          </span>
        ))}
      </div>
    </div>
  )
}
