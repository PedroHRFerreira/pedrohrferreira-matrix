'use client'

import { useEffect, useState } from 'react'
import type { NavigationItem, Reality } from '@/types'

import styles from './styles.module.scss'

export interface RealityNavigationProps {
  items: readonly NavigationItem[]
  reality: Reality
  label?: string
  skipLabel?: string
}

export function RealityNavigation({
  items,
  reality,
  label = 'Navegação principal',
  skipLabel
}: RealityNavigationProps) {
  const [activeId, setActiveId] = useState('main-content')

  useEffect(() => {
    const sections = items
      .map((item) => item.id)
      .map((id) => document.getElementById(id))
      .filter((section): section is HTMLElement => Boolean(section))
    let frame = 0

    const updateActiveSection = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        const readingLine = window.innerHeight * 0.34
        const visible = sections.find((section) => {
          const bounds = section.getBoundingClientRect()
          return bounds.top <= readingLine && bounds.bottom > readingLine
        })
        const previous = sections
          .filter((section) => section.getBoundingClientRect().top <= readingLine)
          .at(-1)
        const nextId = visible?.id ?? previous?.id ?? 'main-content'
        setActiveId(nextId)
        const nextHash = nextId === 'main-content' ? '' : `#${nextId}`
        window.history.replaceState(null, '', `${window.location.pathname}${nextHash}`)
      })
    }

    updateActiveSection()
    window.addEventListener('scroll', updateActiveSection, { passive: true })
    window.addEventListener('resize', updateActiveSection)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', updateActiveSection)
      window.removeEventListener('resize', updateActiveSection)
    }
  }, [items])

  return (
    <>
      {skipLabel ? (
        <a className={styles.skipLink} href="#main-content">
          {skipLabel}
        </a>
      ) : null}
      <nav className={styles.navigation} data-reality={reality} aria-label={label}>
        <a
          aria-current={activeId === 'main-content' ? 'page' : undefined}
          className={styles.brand}
          href="#main-content"
          aria-label="Pedro Henrique — Início"
        >
          PH
        </a>
        <ul className={styles.list}>
          {items.map((item) => (
            <li key={item.id}>
              <a
                aria-current={activeId === item.id ? 'page' : undefined}
                className={styles.link}
                href={`#${item.id}`}
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </>
  )
}
