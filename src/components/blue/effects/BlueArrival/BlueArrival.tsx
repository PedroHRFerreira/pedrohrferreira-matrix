'use client'

import { useEffect, useRef } from 'react'
import styles from './styles.module.scss'

export function BlueArrival() {
  const cat = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const root = document.documentElement
    const previous = root.style.overflow
    root.style.overflow = 'hidden'
    const preventScroll = (event: Event) => event.preventDefault()
    const preventKeys = (event: KeyboardEvent) => {
      if (['ArrowDown', 'ArrowUp', 'PageDown', 'PageUp', 'Home', 'End', ' '].includes(event.key))
        event.preventDefault()
    }
    window.addEventListener('wheel', preventScroll, { passive: false })
    window.addEventListener('touchmove', preventScroll, { passive: false })
    window.addEventListener('keydown', preventKeys)
    const release = () => {
      root.style.overflow = previous
      window.removeEventListener('wheel', preventScroll)
      window.removeEventListener('touchmove', preventScroll)
      window.removeEventListener('keydown', preventKeys)
      if (cat.current) cat.current.hidden = true
    }
    const timer = window.setTimeout(release, 4300)
    return () => {
      window.clearTimeout(timer)
      release()
    }
  }, [])

  return (
    <div ref={cat} className={styles.passage} aria-hidden="true" data-black-cat>
      <svg viewBox="0 0 384 220" className={styles.cat}>
        <image href="/black-cat-walk.png" width="1536" height="1024" className={styles.frames} />
      </svg>
    </div>
  )
}
