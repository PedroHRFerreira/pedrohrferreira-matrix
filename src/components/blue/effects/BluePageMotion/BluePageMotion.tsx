'use client'

import { useEffect, useRef } from 'react'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import styles from './styles.module.scss'

export function BluePageMotion() {
  const progressRef = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()

  useEffect(() => {
    let frame = 0
    const update = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        const max = document.documentElement.scrollHeight - window.innerHeight
        const progress = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0
        progressRef.current?.style.setProperty('--progress', String(progress))
        progressRef.current?.setAttribute('aria-valuenow', String(Math.round(progress * 100)))
      })
    }
    const observer = new ResizeObserver(update)
    observer.observe(document.body)
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    update()
    return () => {
      cancelAnimationFrame(frame)
      observer.disconnect()
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [])

  useEffect(() => {
    if (reduced) return
    const animations: Animation[] = []
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          animations.push(
            entry.target.animate(
              [
                { opacity: 0.35, transform: 'translateY(16px)' },
                { opacity: 1, transform: 'translateY(0)' }
              ],
              { duration: 600, easing: 'cubic-bezier(0.22, 1, 0.36, 1)' }
            )
          )
          observer.unobserve(entry.target)
        }
      },
      { threshold: 0.12 }
    )
    document
      .querySelectorAll('[data-reality="blue"] main > section:not([data-horizontal-gallery])')
      .forEach((section) => observer.observe(section))
    return () => {
      observer.disconnect()
      animations.forEach((animation) => animation.cancel())
    }
  }, [reduced])

  return (
    <div
      ref={progressRef}
      className={styles.progress}
      role="progressbar"
      aria-label="Progresso da página"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={0}
    >
      <span />
    </div>
  )
}
