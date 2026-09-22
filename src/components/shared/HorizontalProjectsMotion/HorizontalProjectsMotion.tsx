'use client'

import { useLayoutEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

export function HorizontalProjectsMotion() {
  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger)

    const media = gsap.matchMedia()

    media.add(
      {
        motionEnabled: '(prefers-reduced-motion: no-preference)'
      },
      (context) => {
        const { motionEnabled } = context.conditions ?? {}
        if (!motionEnabled) return

        const root = document.querySelector<HTMLElement>('[data-projects-root]')
        const viewport = root?.querySelector<HTMLElement>('[data-projects-viewport]')
        const track = root?.querySelector<HTMLElement>('[data-projects-track]')
        if (!root || !viewport || !track) return
        const panels = Array.from(track.children).filter(
          (element): element is HTMLElement => element instanceof HTMLElement
        )

        const centerCards = () => {
          const firstCard = track.querySelector<HTMLElement>('[data-project-card]')
          if (!firstCard) return

          const sideInset = Math.max(0, (viewport.clientWidth - firstCard.offsetWidth) / 2)
          track.style.setProperty('--projects-side-inset', `${sideInset}px`)
        }

        centerCards()

        const distance = () => {
          centerCards()
          return Math.max(0, track.scrollWidth - viewport.clientWidth)
        }
        const centeredTop = () => {
          const availableCenter = (window.innerHeight - viewport.offsetHeight) / 2
          return Math.max(88, Math.round(availableCenter))
        }
        if (distance() === 0) return

        const tween = gsap.to(track, {
          x: () => -distance(),
          ease: 'none',
          scrollTrigger: {
            trigger: viewport,
            start: () => `top ${centeredTop()}px`,
            end: () => `+=${distance() + window.innerHeight * 1.5}`,
            pin: true,
            scrub: 1.05,
            snap:
              panels.length > 1
                ? {
                    snapTo: 1 / (panels.length - 1),
                    duration: { min: 0.2, max: 0.45 },
                    delay: 0.08,
                    ease: 'power1.inOut'
                  }
                : undefined,
            onUpdate: (self) => {
              const activeIndex = Math.round(self.progress * Math.max(0, panels.length - 1))
              panels.forEach((panel, index) => {
                panel.dataset.active = index === activeIndex ? 'true' : 'false'
                panel.setAttribute('aria-hidden', index === activeIndex ? 'false' : 'true')
              })
            },
            invalidateOnRefresh: true,
            anticipatePin: 1
          }
        })

        return () => tween.kill()
      }
    )

    return () => media.revert()
  }, [])

  return null
}
