'use client'

import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import styles from './styles.module.scss'

export function BlueArrival() {
  const cat = useRef<HTMLDivElement>(null)
  const [footerPass, setFooterPass] = useState(false)
  const reduced = useReducedMotion()
  useEffect(() => {
    if (reduced || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
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
    let observer: IntersectionObserver | undefined
    const timer = window.setTimeout(() => {
      release()
      const footer = document.querySelector('[data-reality="blue"] footer')
      if (!footer) return
      observer = new IntersectionObserver(
        ([entry]) => {
          if (!entry?.isIntersecting) return
          setFooterPass(true)
          observer?.disconnect()
        },
        { threshold: 0.25 }
      )
      observer.observe(footer)
    }, 4300)
    return () => {
      observer?.disconnect()
      window.clearTimeout(timer)
      release()
    }
  }, [reduced])

  if (reduced) return null

  return (
    <div
      key={footerPass ? 'footer' : 'arrival'}
      ref={cat}
      className={styles.passage}
      aria-hidden="true"
      data-black-cat
      data-cat-pass={footerPass ? 'footer' : 'arrival'}
      onAnimationEnd={(event) => {
        if (event.target === event.currentTarget) event.currentTarget.hidden = true
      }}
    >
      <svg viewBox="0 0 384 220" className={styles.cat}>
        <image href="/black-cat-walk.png" width="1536" height="1024" className={styles.frames} />
      </svg>
    </div>
  )
}
