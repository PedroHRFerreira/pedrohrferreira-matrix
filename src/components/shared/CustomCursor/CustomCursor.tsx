'use client'

import { useEffect, useRef, useState } from 'react'
import type { Reality } from '@/types'

import styles from './styles.module.scss'

export interface CustomCursorProps {
  reality: Reality
}

export function CustomCursor({ reality }: CustomCursorProps) {
  const cursorRef = useRef<HTMLDivElement>(null)
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    const precisePointer = window.matchMedia('(hover: hover) and (pointer: fine)')
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')

    const updateAvailability = () => setEnabled(precisePointer.matches && !reducedMotion.matches)
    updateAvailability()
    precisePointer.addEventListener('change', updateAvailability)
    reducedMotion.addEventListener('change', updateAvailability)

    return () => {
      precisePointer.removeEventListener('change', updateAvailability)
      reducedMotion.removeEventListener('change', updateAvailability)
    }
  }, [])

  useEffect(() => {
    if (!enabled) return

    const cursor = cursorRef.current
    if (!cursor) return

    const move = (event: PointerEvent) => {
      cursor.style.setProperty('--cursor-x', `${event.clientX}px`)
      cursor.style.setProperty('--cursor-y', `${event.clientY}px`)
      cursor.dataset.visible = 'true'
    }
    const hide = () => {
      cursor.dataset.visible = 'false'
    }
    const updateTarget = (event: PointerEvent) => {
      const target = event.target as Element | null
      cursor.dataset.interactive = String(
        Boolean(target?.closest('a, button, input, textarea, select, [role="button"]'))
      )
    }

    window.addEventListener('pointermove', move, { passive: true })
    window.addEventListener('pointerover', updateTarget, { passive: true })
    document.documentElement.addEventListener('mouseleave', hide)
    window.addEventListener('blur', hide)

    return () => {
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerover', updateTarget)
      document.documentElement.removeEventListener('mouseleave', hide)
      window.removeEventListener('blur', hide)
    }
  }, [enabled])

  if (!enabled) return null

  return <div ref={cursorRef} className={styles.cursor} data-reality={reality} aria-hidden="true" />
}
