import type { PortfolioContent } from '@/types'

import styles from './RedHero/styles.module.scss'

interface RedHeroProps {
  content: PortfolioContent
}

export function RedHero({ content }: RedHeroProps) {
  const { profile, actions } = content

  return (
    <header className={styles.hero} data-section="hero">
      <div className={styles.heroPrompt} aria-hidden="true">
        root@matrix:~$
      </div>
      <p className={styles.heroStatus}>ACESSO AO SISTEMA CONCEDIDO</p>
      <h1 className={styles.heroTitle}>{profile.name}</h1>
      <p className={styles.heroRole}>&lt;{profile.role} /&gt;</p>
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
        <span aria-hidden="true">↓</span>
      </a>
    </header>
  )
}
