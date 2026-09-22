import type { PortfolioContent } from '@/types'

import styles from './BlueExperience/styles.module.scss'

interface BlueExperienceProps {
  content: PortfolioContent
}

export function BlueExperience({ content }: BlueExperienceProps) {
  const { experience, sections } = content

  return (
    <section className={styles.section} id="experience" aria-labelledby="blue-experience-title">
      <div className={styles.sectionHeader}>
        <p className={styles.eyebrow}>{sections.experience.eyebrow}</p>
        <h2 id="blue-experience-title">{sections.experience.title}</h2>
        {sections.experience.description && <p>{sections.experience.description}</p>}
      </div>
      <ol className={styles.blueTimeline}>
        {experience.map((entry) => (
          <li className={styles.timelineItem} key={entry.id}>
            <span className={styles.timelineMarker} aria-hidden="true" />
            <article>
              <p className={styles.period}>{entry.period}</p>
              <h3>{entry.title}</h3>
              {entry.organization && <p className={styles.organization}>{entry.organization}</p>}
              <p>{entry.summary}</p>
              <ul className={styles.highlights}>
                {entry.highlights.map((highlight) => (
                  <li key={highlight}>{highlight}</li>
                ))}
              </ul>
            </article>
          </li>
        ))}
      </ol>
    </section>
  )
}
