'use client'

import { useEffect, useMemo, useState } from 'react'
import type { CSSProperties } from 'react'

import styles from './styles.module.scss'

export interface SkyBackgroundProps {
  className?: string
}

const clouds = [
  { depth: 'far', top: 8, size: 34, duration: 128, delay: -81, opacity: 0.42 },
  { depth: 'far', top: 48, size: 28, duration: 142, delay: -24, opacity: 0.34 },
  { depth: 'middle', top: 18, size: 44, duration: 102, delay: -66, opacity: 0.58 },
  { depth: 'middle', top: 62, size: 39, duration: 116, delay: -14, opacity: 0.5 },
  { depth: 'middle', top: 36, size: 36, duration: 110, delay: -94, opacity: 0.46 },
  { depth: 'near', top: 70, size: 58, duration: 88, delay: -47, opacity: 0.72 },
  { depth: 'near', top: 4, size: 52, duration: 94, delay: -9, opacity: 0.66 }
] as const

export function SkyBackground({ className }: SkyBackgroundProps) {
  const [faultedCloud, setFaultedCloud] = useState<number | null>(null)
  const faultSequence = useMemo(() => [2, 5], [])

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (media.matches) return

    const timers: number[] = []
    faultSequence.forEach((cloudIndex, sequenceIndex) => {
      const start = 7000 + sequenceIndex * 11500 + Math.round(Math.random() * 3500)
      timers.push(
        window.setTimeout(() => {
          setFaultedCloud(cloudIndex)
          timers.push(window.setTimeout(() => setFaultedCloud(null), 520))
        }, start)
      )
    })

    return () => timers.forEach((timer) => window.clearTimeout(timer))
  }, [faultSequence])

  return (
    <div className={[styles.sky, className].filter(Boolean).join(' ')} aria-hidden="true">
      <div className={styles.skyImage} />
      <div className={styles.atmosphere} />
      <div className={styles.light} />
      <div className={styles.cloudField}>
        {clouds.map((cloud, index) => (
          <span
            className={styles.cloud}
            data-depth={cloud.depth}
            data-faulting={faultedCloud === index || undefined}
            key={`${cloud.depth}-${index}`}
            style={
              {
                '--cloud-top': `${cloud.top}%`,
                '--cloud-size': `${cloud.size}rem`,
                '--cloud-duration': `${cloud.duration}s`,
                '--cloud-delay': `${cloud.delay}s`,
                '--cloud-opacity': cloud.opacity
              } as CSSProperties
            }
          >
            <span className={styles.cloudTexture} />
            <span className={styles.cloudFault} />
          </span>
        ))}
      </div>
      <div className={styles.horizonHaze} />
    </div>
  )
}
