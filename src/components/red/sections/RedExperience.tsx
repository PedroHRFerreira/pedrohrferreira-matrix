import type { PortfolioContent } from '@/types'

import styles from './RedExperience/styles.module.scss'

interface RedExperienceProps {
  content: PortfolioContent
}

export function RedExperience({ content }: RedExperienceProps) {
  const { experience, sections } = content

  return (
    <section className={styles.section} id="experience" aria-labelledby="experience-title">
      <div className={styles.heading}>
        <div>
          <p className={styles.eyebrow}>{'// TRAJETÓRIA / EXECUTION_LOG'}</p>
          <h2 id="experience-title">{sections.experience.title}</h2>
          {sections.experience.description && (
            <p className={styles.description}>{sections.experience.description}</p>
          )}
        </div>
        <span className={styles.count}>0{experience.length} REGISTROS ENCONTRADOS</span>
      </div>

      <ol className={styles.timeline}>
        {experience.map((entry, index) => (
          <li className={styles.milestone} key={entry.id}>
            <div className={styles.meta}>
              <span className={styles.index}>LOG_{String(index + 1).padStart(2, '0')}</span>
              <span className={styles.period}>{entry.period}</span>
            </div>
            <span className={styles.node} aria-hidden="true" />
            <article className={styles.card}>
              <div className={styles.cardTop}>
                <span className={styles.organization}>
                  {entry.organization ?? 'Projeto independente'}
                </span>
                <span className={styles.signal}>● ATIVO NO HISTÓRICO</span>
              </div>
              <h3>{entry.title}</h3>
              <p className={styles.summary}>{entry.summary}</p>
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
