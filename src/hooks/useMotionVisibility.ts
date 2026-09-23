'use client'

import { useEffect } from 'react'

/** Observe stationary sections, never moving clouds: offscreen clouds must return. */
export function useMotionVisibility(scene: string) {
  useEffect(() => {
    const root = document.documentElement
    const sync = () => {
      if (document.hidden) root.dataset.motionPaused = 'true'
      else delete root.dataset.motionPaused
    }
    sync()
    document.addEventListener('visibilitychange', sync)

    const observer =
      typeof IntersectionObserver === 'undefined'
        ? null
        : new IntersectionObserver(
            (entries) => {
              for (const entry of entries) {
                if (entry.isIntersecting) entry.target.removeAttribute('data-motion-paused')
                else entry.target.setAttribute('data-motion-paused', 'true')
              }
            },
            // Resume just before entry so the effect is already moving when it appears.
            { rootMargin: '200px' }
          )
    const sections = document.querySelectorAll('main > section, [data-section="hero"], footer')
    sections.forEach((section) => observer?.observe(section))
    return () => {
      observer?.disconnect()
      document.removeEventListener('visibilitychange', sync)
      delete root.dataset.motionPaused
      sections.forEach((section) => section.removeAttribute('data-motion-paused'))
    }
  }, [scene])
}
