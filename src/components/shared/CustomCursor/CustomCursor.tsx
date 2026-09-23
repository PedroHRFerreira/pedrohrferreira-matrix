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
    document.documentElement.dataset.customCursor = 'true'

    let frame = 0
    let x = 0
    let y = 0
    const move = (event: PointerEvent) => {
      x = event.clientX
      y = event.clientY
      if (frame) return
      frame = requestAnimationFrame(() => {
        frame = 0
        cursor.style.setProperty('--cursor-x', `${x}px`)
        cursor.style.setProperty('--cursor-y', `${y}px`)
        cursor.dataset.visible = 'true'
      })
    }
    const hide = () => {
      cancelAnimationFrame(frame)
      frame = 0
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
      cancelAnimationFrame(frame)
      delete document.documentElement.dataset.customCursor
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerover', updateTarget)
      document.documentElement.removeEventListener('mouseleave', hide)
      window.removeEventListener('blur', hide)
    }
  }, [enabled])

  if (!enabled) return null

  return <div ref={cursorRef} className={styles.cursor} data-reality={reality} aria-hidden="true" />
}
