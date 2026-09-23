'use client'

import { useEffect, useRef } from 'react'
import type { CSSProperties } from 'react'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import styles from './styles.module.scss'
import { useCloudPull } from './useCloudPull'

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
  const skyRef = useRef<HTMLDivElement>(null)
  const faultPlayed = useRef(false)
  useCloudPull(fieldRef, reducedMotion)

  useEffect(() => {
    const sky = skyRef.current
    const about = document.getElementById('about')
    if (!sky || !about || reducedMotion || faultPlayed.current) return
    let timer = 0
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return
        faultPlayed.current = true
        sky.dataset.fault = 'active'
        timer = window.setTimeout(() => {
          sky.dataset.fault = 'complete'
        }, 3600)
        observer.disconnect()
      },
      { threshold: 0.25 }
    )
    observer.observe(about)
    return () => {
      observer.disconnect()
      window.clearTimeout(timer)
      delete sky.dataset.fault
    }
  }, [reducedMotion])
  useEffect(() => {
    const field = fieldRef.current
    if (!field || reducedMotion) return
    const updateVisibility = () => {
      field.dataset.playing = String(!document.hidden)
    }
    const start = window.setTimeout(updateVisibility, 300)
    document.addEventListener('visibilitychange', updateVisibility)
    return () => {
      window.clearTimeout(start)
      document.removeEventListener('visibilitychange', updateVisibility)
      field.dataset.playing = 'false'
    }
  }, [reducedMotion])

  return (
    <div
      ref={skyRef}
      className={[styles.sky, className].filter(Boolean).join(' ')}
      aria-hidden="true"
      data-sky
    >
      <div className={styles.cloudField} ref={fieldRef}>
        {clouds.map((cloud, index) => (
          <span
            className={styles.cloudPosition}
            key={index}
            data-cloud={index}
            style={
              {
                '--cloud-top': `${cloud.top}%`,
                '--cloud-static-left': `${cloud.left}%`,
                '--cloud-size': `${cloud.size}rem`,
                '--cloud-duration': `${cloud.duration * 2.4}s`,
                '--cloud-delay': `${cloud.delay * 2.4}s`,
                '--cloud-opacity': Math.min(1, cloud.opacity + 0.15),
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
      <div className={styles.faultVeil} />
      <div className={styles.faultRift}>
        <span>01001101 ネ 001 ケ 10110 ロ 01001 ワ 110 サ 001 ト 101</span>
        <span>011 ネ 10010 ロ 101 ワ 01101 ケ 001 サ 110 ト 01001</span>
      </div>
    </div>
  )
}
