'use client'

import { useEffect, useRef, useState } from 'react'
import type { PortfolioContent } from '@/types'

import styles from './BlueHero/styles.module.scss'

interface BlueHeroProps {
  content: PortfolioContent
}

export function BlueHero({ content }: BlueHeroProps) {
  const { actions, profile } = content
  const heroRef = useRef<HTMLElement>(null)
  const [returned, setReturned] = useState(false)
  const [secretClicks, setSecretClicks] = useState(0)
  useEffect(() => {
    let explored = false
    const update = () => {
      const hero = heroRef.current
      if (!hero) return
      if (hero.getBoundingClientRect().bottom < 0) explored = true
      if (explored && window.scrollY < 80) {
        setReturned(true)
        window.removeEventListener('scroll', update)
      }
    }
    window.addEventListener('scroll', update, { passive: true })
    return () => window.removeEventListener('scroll', update)
  }, [])
  return (
    <header ref={heroRef} className={styles.hero} data-section="hero">
      <p className={styles.heroKicker}>
        {returned ? 'Você já esteve aqui' : 'Uma prática digital centrada em pessoas'}
      </p>
      <h1 className={styles.heroTitle}>
        <button
          type="button"
          className={styles.secretName}
          onClick={() => setSecretClicks((count) => Math.min(3, count + 1))}
          aria-expanded={secretClicks === 3}
          aria-controls="blue-secret-message"
        >
          {profile.name}
        </button>
      </h1>
      <div className={styles.secretSlot}>
        <p id="blue-secret-message" className={styles.secretMessage} role="status">
          {secretClicks === 3 && <span>Acorda, Pedro…</span>}
        </p>
      </div>
      <p className={styles.heroRole}>{profile.role}</p>
      <p className={styles.heroIntroduction}>{profile.introduction}</p>
      <div className={styles.heroActions}>
        <a className={styles.primaryAction} href="#projects">
          {actions.viewProjects}
        </a>
        <a className={styles.secondaryAction} href="#contact">
          {actions.contactMe}
        </a>
        <a className={styles.secondaryAction} href={actions.resume.href} download>
          {actions.resume.label}
        </a>
      </div>
      <a className={styles.scrollCue} href="#about" aria-label={content.navigation[0]?.label}>
        <span aria-hidden="true">Explorar ↓</span>
      </a>
    </header>
  )
}
