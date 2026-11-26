import type { ExperienceEntry } from '@/types'
import styles from './ExperienceMilestones.module.scss'

const monthFormatter = new Intl.DateTimeFormat('pt-BR', {
  month: 'long',
  year: 'numeric',
  timeZone: 'UTC'
})

export function ExperienceMilestones({
  milestones
}: {
  milestones: NonNullable<ExperienceEntry['milestones']>
}) {
  return (
    <ol className={styles.timeline} aria-label="Marcos em ordem cronológica">
      {milestones.map(({ date, title, description }) => (
        <li key={date} className={styles.milestone}>
          <time dateTime={date}>{monthFormatter.format(new Date(date))}</time>
          <h4>{title}</h4>
          <p>{description}</p>
        </li>
      ))}
    </ol>
  )
}
