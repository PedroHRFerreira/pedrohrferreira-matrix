import type { PortfolioContent } from '@/types'

import styles from './BlueStack/styles.module.scss'

interface BlueStackProps {
  content: PortfolioContent
}

export function BlueStack({ content }: BlueStackProps) {
  const { sections, skillGroups } = content

  return (
    <section className={styles.section} id="stack" aria-labelledby="blue-stack-title">
      <div className={styles.sectionHeader}>
        <p className={styles.eyebrow}>{sections.stack.eyebrow}</p>
        <h2 id="blue-stack-title">{sections.stack.title}</h2>
      </div>
      <div className={styles.stackConstellation}>
        {skillGroups.map((group) => (
          <article className={styles.stackCloud} key={group.id}>
            <h3>{group.title}</h3>
            <ul>
              {group.skills.map((skill) => (
                <li key={skill}>{skill}</li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  )
}
