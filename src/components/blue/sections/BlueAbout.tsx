import type { PortfolioContent } from '@/types'

import styles from './BlueAbout/styles.module.scss'

interface BlueAboutProps {
  content: PortfolioContent
}

export function BlueAbout({ content }: BlueAboutProps) {
  const { profile, sections } = content

  return (
    <section className={styles.section} id="about" aria-labelledby="blue-about-title">
      <div className={styles.sectionHeader}>
        <p className={styles.eyebrow}>{sections.about.eyebrow}</p>
        <h2 id="blue-about-title">{sections.about.title}</h2>
      </div>
      <div className={styles.aboutLayout}>
        <div className={styles.aboutCopy}>
          {profile.about.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
          <p className={styles.availability}>{profile.availability}</p>
        </div>
      </div>
    </section>
  )
}
