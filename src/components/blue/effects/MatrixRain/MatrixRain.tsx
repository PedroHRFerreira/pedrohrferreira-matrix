'use client'

import { useEffect, useRef, useState } from 'react'
import type { CSSProperties } from 'react'
import styles from './styles.module.scss'

interface Beam {
  id: number
  left: number
  top: number
}

export function MatrixRain() {
  const [beam, setBeam] = useState<Beam | null>(null)
  const rainRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (media.matches) return
    let timer = 0
    let hideTimer = 0
    let id = 0
    const move = (event: PointerEvent) => {
      const node = rainRef.current?.firstElementChild as HTMLElement | null
      if (!node || event.pointerType !== 'mouse') return
      const bounds = node.getBoundingClientRect()
      node.dataset.near = String(
        Math.abs(event.clientX - bounds.left) < 70 && Math.abs(event.clientY - bounds.top) < 100
      )
    }
    window.addEventListener('pointermove', move, { passive: true })
    const schedule = (first = false) => {
      timer = window.setTimeout(
        () => {
          if (!media.matches) {
            setBeam({ id: ++id, left: 5 + Math.random() * 90, top: Math.random() * 75 })
            hideTimer = window.setTimeout(() => setBeam(null), 800)
          }
          schedule()
        },
        first
          ? 2200
          : (window.matchMedia('(max-width: 48rem)').matches ? 8000 : 4000) + Math.random() * 2000
      )
    }
    schedule(true)
    return () => {
      window.removeEventListener('pointermove', move)
      window.clearTimeout(timer)
      window.clearTimeout(hideTimer)
    }
  }, [])

  return (
    <div className={styles.rain} ref={rainRef} aria-hidden="true">
      {beam && (
        <span
          key={beam.id}
          className={styles.beam}
          style={{ left: `${beam.left}%`, top: `${beam.top}%` } as CSSProperties}
        />
      )}
    </div>
  )
}
