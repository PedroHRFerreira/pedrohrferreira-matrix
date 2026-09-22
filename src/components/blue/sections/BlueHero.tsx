import type { PortfolioContent } from '@/types'

import styles from './BlueHero/styles.module.scss'

interface BlueHeroProps {
  content: PortfolioContent
}

export function BlueHero({ content }: BlueHeroProps) {
  const { actions, profile } = content

  return (
    <header className={styles.hero} data-section="hero">
      <p className={styles.heroKicker}>Uma prática digital centrada em pessoas</p>
      <h1 className={styles.heroTitle}>{profile.name}</h1>
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
