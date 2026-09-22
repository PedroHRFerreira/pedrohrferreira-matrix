'use client'

import { useLayoutEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const MIN_DWELL_DISTANCE = 460
const VIEWPORT_DWELL_RATIO = 0.9
const MIN_TYPING_DURATION = 0.34
const MAX_TYPING_DURATION = 1.2
const TYPING_CHARACTERS_PER_SECOND = 72

export function RedSectionMotion() {
  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger)

    const media = gsap.matchMedia()

    media.add('(prefers-reduced-motion: no-preference)', () => {
      const scenes = gsap.utils.toArray<HTMLElement>('[data-red-scene], [data-red-type-scene]')

      const contexts = scenes.map((scene) => {
        const revealTargets = gsap.utils.toArray<HTMLElement>('[data-red-reveal]', scene)
        const typingTargets = gsap.utils.toArray<HTMLElement>('[data-red-type]', scene)
        if (!revealTargets.length && !typingTargets.length) return null

        const fitsViewport = false
        const dwellDistance = Math.max(
          MIN_DWELL_DISTANCE,
          Math.round(window.innerHeight * VIEWPORT_DWELL_RATIO)
        )

        return gsap.context(() => {
          const timeline = gsap.timeline({
            defaults: { ease: 'none' },
            scrollTrigger: {
              trigger: scene,
              start: fitsViewport ? 'top top' : 'top 76%',
              end: fitsViewport ? `+=${dwellDistance}` : 'bottom 26%',
              scrub: 0.55,
              invalidateOnRefresh: true
            }
          })

          const staticTargets = revealTargets.filter((target) => !typingTargets.includes(target))

          if (staticTargets.length) {
            timeline.fromTo(
              staticTargets,
              { autoAlpha: 0.16, y: 20 },
              { autoAlpha: 1, y: 0, duration: 0.38, stagger: 0.16 }
            )
          }

          typingTargets.forEach((target) => {
            const content = target.textContent ?? ''
            if (!content.trim()) return

            const typingState = { characters: 0 }
            const duration = Math.min(
              MAX_TYPING_DURATION,
              Math.max(MIN_TYPING_DURATION, content.length / TYPING_CHARACTERS_PER_SECOND)
            )

            target.setAttribute('aria-label', content)

            timeline.set(target, { autoAlpha: 1, y: 0 })
            timeline.to(typingState, {
              characters: content.length,
              duration,
              onUpdate: () => {
                const characters = Math.round(typingState.characters)
                target.textContent = content.slice(0, characters)
                target.dataset.redTyping = characters < content.length ? 'true' : 'false'
              }
            })
          })

          timeline.to(scene, { '--scene-signal': 1, duration: 0.35 }, '-=0.18')
        }, scene)
      })

      ScrollTrigger.refresh()
      return () => contexts.forEach((context) => context?.revert())
    })

    return () => media.revert()
  }, [])

  return null
}
