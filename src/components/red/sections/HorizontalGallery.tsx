import type { ReactNode } from 'react'

import styles from './HorizontalGallery.module.scss'

interface HorizontalGalleryProps {
  id: string
  eyebrow: string
  title: string
  description?: string
  children: ReactNode
  count: number
  direction?: 'left' | 'right'
}

export function HorizontalGallery({
  id,
  eyebrow,
  title,
  description,
  children,
  count,
  direction = 'left'
}: HorizontalGalleryProps) {
  return (
    <section
      className={styles.gallery}
      id={id}
      aria-labelledby={`${id}-title`}
      data-horizontal-gallery
      data-direction={direction}
    >
      <div className={styles.stage} data-horizontal-stage>
        <div className={styles.header}>
          <div>
            <p className={styles.eyebrow}>{`// ${eyebrow}`}</p>
            <h2 id={`${id}-title`}>{title}</h2>
            {description && <p className={styles.description}>{description}</p>}
          </div>
          <p className={styles.counter}>01 / {String(count).padStart(2, '0')}</p>
        </div>
        <div className={styles.viewport} data-horizontal-viewport>
          <div className={styles.track} data-horizontal-track>
            {children}
          </div>
        </div>
        <div className={styles.guide} aria-hidden="true">
          <span>SCROLL PARA EXPLORAR</span>
          <div className={styles.progress}>
            <span />
          </div>
          <span>{direction === 'right' ? '→' : '←'}</span>
        </div>
      </div>
    </section>
  )
}
