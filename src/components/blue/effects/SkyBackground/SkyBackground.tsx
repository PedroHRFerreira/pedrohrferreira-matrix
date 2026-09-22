'use client'

import { useEffect, useRef } from 'react'
import type { CSSProperties } from 'react'
import styles from './styles.module.scss'

export interface SkyBackgroundProps {
  className?: string
}

const clouds = [
  { top: 8, left: 5, size: 36, duration: 18, delay: -8, opacity: 0.78, depth: 0.4 },
  { top: 29, left: 68, size: 29, duration: 22, delay: -17, opacity: 0.7, depth: 0.6 },
  { top: 48, left: 30, size: 43, duration: 25, delay: -11, opacity: 0.82, depth: 1 },
  { top: 68, left: 75, size: 33, duration: 20, delay: -4, opacity: 0.72, depth: 0.8 },
  { top: 82, left: 3, size: 47, duration: 23, delay: -19, opacity: 0.76, depth: 1.2 }
] as const

export function SkyBackground({ className }: SkyBackgroundProps) {
  const fieldRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const field = fieldRef.current
    if (!field || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const start = window.setTimeout(() => {
      field.dataset.playing = 'true'
    }, 2200)
    let frame = 0
    const move = (event: PointerEvent) => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        field.style.setProperty('--parallax-x', `${(event.clientX / innerWidth - 0.5) * 12}px`)
        field.style.setProperty('--parallax-y', `${(event.clientY / innerHeight - 0.5) * 8}px`)
        if (event.pointerType === 'mouse') {
          field.querySelectorAll<HTMLElement>(`.${styles.cloudPosition}`).forEach((cloud) => {
            const bounds = cloud.getBoundingClientRect()
            const near =
              event.clientX > bounds.left - 80 &&
              event.clientX < bounds.right + 80 &&
              event.clientY > bounds.top - 80 &&
              event.clientY < bounds.bottom + 80
            cloud.dataset.near = String(near)
          })
        }
      })
    }
    window.addEventListener('pointermove', move, { passive: true })
    return () => {
      window.clearTimeout(start)
      window.removeEventListener('pointermove', move)
      cancelAnimationFrame(frame)
    }
  }, [])

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
                '--cloud-opacity': cloud.opacity,
                '--cloud-depth': cloud.depth
              } as CSSProperties
            }
          >
            <span className={styles.cloudBob}>
              <span className={styles.cloudShape} />
            </span>
          </span>
        ))}
      </div>
    </div>
  )
}
