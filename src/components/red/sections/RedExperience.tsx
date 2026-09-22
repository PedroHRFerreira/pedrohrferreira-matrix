import { TerminalScene, type TerminalCommand } from '@/components/red/effects/TerminalScene'
import type { PortfolioContent } from '@/types'

import styles from './RedExperience/styles.module.scss'

interface RedExperienceProps {
  content: PortfolioContent
}

export function RedExperience({ content }: RedExperienceProps) {
  const { experience, sections } = content
  const commands: readonly TerminalCommand[] = experience.map((entry) => ({
    id: entry.id,
    label: entry.organization ?? entry.title,
    meta: entry.period,
    panel: (
      <article className={styles.experiencePanel}>
        <p className={styles.period}>{entry.period}</p>
        <h3>{entry.title}</h3>
        {entry.organization && <p className={styles.organization}>{entry.organization}</p>}
        <p className={styles.summary}>{entry.summary}</p>
        <ul className={styles.highlights}>
          {entry.highlights.map((highlight) => (
            <li key={highlight}>{highlight}</li>
          ))}
        </ul>
      </article>
    )
  }))

  return (
    <TerminalScene
      commands={commands}
      description={sections.experience.description}
      eyebrow={sections.experience.eyebrow}
      id="experience"
      title={sections.experience.title}
      variant="timeline"
    />
  )
}
