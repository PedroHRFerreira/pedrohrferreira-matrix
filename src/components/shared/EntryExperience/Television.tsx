import type { ComponentPropsWithRef } from 'react'
import styles from './styles.module.scss'

/** The same CRT surface hosts the opening and the journey to Zion. */
export function Television({ children, className = '', ...props }: ComponentPropsWithRef<'main'>) {
  return (
    <main {...props} className={`${styles.entry} ${className}`}>
      <div
        className={styles.television}
        aria-label="Tela CRT com terminal da Matrix"
        data-testid="experience-tv"
      >
        <div className={styles.screen} data-testid="experience-screen">
          {children}
          <div className={styles.scanlines} aria-hidden="true" />
          <div className={styles.vignette} aria-hidden="true" />
          <div className={styles.glass} aria-hidden="true" />
          <span className={styles.formatBadge} aria-hidden="true">
            1920 × 1080 | 30 FPS
          </span>
        </div>
      </div>
    </main>
  )
}
