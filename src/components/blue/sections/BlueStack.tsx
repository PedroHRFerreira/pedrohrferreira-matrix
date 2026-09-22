import type { PortfolioContent } from '@/types'

import styles from './BlueStack/styles.module.scss'

interface BlueStackProps {
  content: PortfolioContent
}

export function BlueStack({ content }: BlueStackProps) {
  const { sections, skillGroups } = content

  return (
    <section
      className={styles.section}
      id="stack"
      aria-labelledby="blue-stack-title"
      data-horizontal-gallery
      data-direction="right"
    >
      <div className={styles.stage} data-horizontal-stage>
        <div className={styles.sectionHeader}>
          <p className={styles.eyebrow}>{sections.stack.eyebrow}</p>
          <h2 id="blue-stack-title">{sections.stack.title}</h2>
        </div>
        <div className={styles.viewport} data-horizontal-viewport>
          <div className={styles.stackConstellation} data-horizontal-track>
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
        </div>
        <div className={styles.scrollProgress} aria-hidden="true">
          <span />
        </div>
      </div>
    </section>
  )
}
