'use client'

import { useEffect, useRef } from 'react'
import styles from './styles.module.scss'

const binary = '010011010110100101001101'.split('').join('\n')

export function MatrixRain({
  corrupted = false,
  level = corrupted ? 3 : 0,
  paused = false
}: {
  level?: number
  corrupted?: boolean
  paused?: boolean
}) {
  const rainRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const update = () => {
      if (rainRef.current) rainRef.current.dataset.paused = String(document.hidden || paused)
    }
    const column = rainRef.current?.querySelector<HTMLElement>('pre')
    if (column && level === 0) column.style.left = `${3 + Math.random() * 92}%`
    update()
    document.addEventListener('visibilitychange', update)
    return () => document.removeEventListener('visibilitychange', update)
  }, [paused, level])

  useEffect(() => {
    const rain = rainRef.current
    if (!rain || level === 0) return
    const columns = Array.from(rain.querySelectorAll<HTMLElement>('pre'))
    const mask = () => {
      const width = rain.clientWidth
      const edge = width * ([0, 0.08, 0.21, 0.44][level] ?? 0.44)
      // Each thin strip carries the same horizontal fade as the old full-screen
      // mask, so moving glyphs no longer require a viewport-sized masked layer.
      const offsets = columns.map((column) => column.offsetLeft)
      columns.forEach((column, index) => {
        const left = offsets[index]
        column.style.maskImage = `linear-gradient(90deg, #000 ${edge - left}px, transparent ${edge + width * 0.06 - left}px, transparent ${width * 0.94 - edge - left}px, #000 ${width - edge - left}px)`
      })
    }
    const sizing = new ResizeObserver(mask)
    sizing.observe(rain)
    mask()
    return () => {
      sizing.disconnect()
      columns.forEach((column) => column.style.removeProperty('mask-image'))
    }
  }, [level])

  return (
    <div
      className={styles.rain}
      ref={rainRef}
      aria-hidden="true"
      data-corrupted={corrupted}
      data-level={level}
    >
      {Array.from({ length: [1, 8, 20, 38][level] ?? 38 }, (_, index) => (
        <pre
          key={index}
          style={{ left: `${2 + ((index * 17) % 96)}%`, animationDelay: `${-index * 1.7}s` }}
          className={styles.codeColumn}
          onAnimationIteration={(event) => {
            if (level === 0) event.currentTarget.style.left = `${3 + Math.random() * 92}%`
            event.currentTarget.textContent = Array.from({ length: 24 }, () =>
              Math.random() < 0.5 ? '0' : '1'
            ).join('\n')
          }}
        >
          {binary}
        </pre>
      ))}
    </div>
  )
}
