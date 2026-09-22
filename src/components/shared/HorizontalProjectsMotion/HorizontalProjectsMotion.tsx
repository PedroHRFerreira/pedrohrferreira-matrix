'use client'

import { useLayoutEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

/** The document keeps vertical scrolling while each gallery crosses the viewport. */
export function HorizontalProjectsMotion() {
  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger)
    const media = gsap.matchMedia()

    media.add('(prefers-reduced-motion: no-preference)', () => {
      const galleries = gsap.utils.toArray<HTMLElement>('[data-horizontal-gallery]')
      const cleanups = galleries.map((gallery) => {
        const stage = gallery.querySelector<HTMLElement>('[data-horizontal-stage]')
        const viewport = gallery.querySelector<HTMLElement>('[data-horizontal-viewport]')
        const track = gallery.querySelector<HTMLElement>('[data-horizontal-track]')
        const first = track?.firstElementChild as HTMLElement | null
        if (!stage || !viewport || !track || !first) return null

        const measure = () => {
          const inset = Math.max(20, (viewport.clientWidth - first.offsetWidth) / 2)
          track.style.setProperty('--gallery-inset', `${inset}px`)
          return Math.max(0, track.scrollWidth - viewport.clientWidth)
        }

        if (measure() < 1) return null
        gallery.dataset.enhanced = 'true'
        const movesRight = gallery.dataset.direction === 'right'

        const context = gsap.context(() => {
          gsap.fromTo(
            track,
            {
              x: () => (movesRight ? -measure() : 0)
            },
            {
              x: () => (movesRight ? 0 : -measure()),
              ease: 'none',
              scrollTrigger: {
                trigger: stage,
                start: 'top top',
                end: () => `+=${measure()}`,
                pin: true,
                scrub: 0.7,
                anticipatePin: 1,
                invalidateOnRefresh: true,
                onUpdate: (self) =>
                  gallery.style.setProperty('--gallery-progress', `${self.progress * 100}%`)
              }
            }
          )
        }, gallery)

        return () => {
          context.revert()
          delete gallery.dataset.enhanced
          gallery.style.removeProperty('--gallery-progress')
          track.style.removeProperty('--gallery-inset')
        }
      })

      ScrollTrigger.refresh()
      return () => cleanups.forEach((cleanup) => cleanup?.())
    })

    return () => media.revert()
  }, [])

  return null
}
