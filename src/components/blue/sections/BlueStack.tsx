'use client'

import { useState } from 'react'
import type { PortfolioContent } from '@/types'
import styles from './BlueStack/styles.module.scss'

interface BlueStackProps {
  content: PortfolioContent
}

const descriptions: Record<string, string> = {
  frontend: 'Interfaces, componentes e experiências para a web.',
  backend: 'Serviços, APIs e regras que sustentam os produtos.',
  tooling: 'Ferramentas para entregar, testar e observar software.',
  practices: 'Arquitetura de sistemas, persistência de dados e inteligência artificial.'
}
const icons: Record<string, string> = {
  frontend: 'M8 5 2 12l6 7M16 5l6 7-6 7M14 3l-4 18',
  backend: 'M3 3h18v7H3zM3 14h18v7H3zM6 6h2M6 17h2',
  tooling: 'm14 5 5 5M3 21l7-7M14 2l-4 4 2 6 6 2 4-4-6-1z',
  practices: 'M12 3 3 8l9 5 9-5-9-5ZM3 12l9 5 9-5M3 16l9 5 9-5'
}

export function BlueStack({ content }: BlueStackProps) {
  const { sections, skillGroups } = content
  const [tooltip, setTooltip] = useState<string | null>(null)

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
                <div
                  className={styles.iconHelp}
                  onMouseEnter={() => setTooltip(group.id)}
                  onMouseLeave={() => setTooltip(null)}
                >
                  <button
                    className={styles.iconButton}
                    aria-label={`Sobre ${group.title}`}
                    aria-describedby={tooltip === group.id ? `hint-${group.id}` : undefined}
                    onFocus={() => setTooltip(group.id)}
                    onBlur={() => setTooltip(null)}
                    onClick={() => setTooltip(tooltip === group.id ? null : group.id)}
                    onKeyDown={(event) => {
                      if (event.key === 'Escape') {
                        event.preventDefault()
                        setTooltip(null)
                      }
                    }}
                  >
                    <svg
                      className={styles.categoryIcon}
                      width="32"
                      height="32"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.4"
                      aria-hidden="true"
                    >
                      <path d={icons[group.id]} />
                    </svg>
                  </button>
                  {tooltip === group.id && (
                    <span className={styles.tooltip} id={`hint-${group.id}`} role="tooltip">
                      {descriptions[group.id]}
                    </span>
                  )}
                </div>
                <h3>{group.title}</h3>
                <p className={styles.groupDescription}>{descriptions[group.id]}</p>
                <ul>
                  {group.skills.map((skill) => (
                    <li key={skill}>{skill}</li>
                  ))}
                </ul>
                <details className={styles.categoryHelp}>
                  <summary>Sobre esta categoria</summary>
                  <p>{descriptions[group.id]}</p>
                </details>
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
