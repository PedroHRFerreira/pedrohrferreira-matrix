'use client'

import { useEffect, useState } from 'react'

const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)'

export function useReducedMotion(): boolean {
  // Keep the server and first client render aligned, then synchronize with the
  // browser preference after hydration.
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  useEffect(() => {
    if (typeof window.matchMedia !== 'function') return

    const mediaQuery = window.matchMedia(REDUCED_MOTION_QUERY)
    const updatePreference = (event?: MediaQueryListEvent) => {
      setPrefersReducedMotion(event?.matches ?? mediaQuery.matches)
    }

    updatePreference()
    mediaQuery.addEventListener('change', updatePreference)

    return () => mediaQuery.removeEventListener('change', updatePreference)
  }, [])

  return prefersReducedMotion
}
