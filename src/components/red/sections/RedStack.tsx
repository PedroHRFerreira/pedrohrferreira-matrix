import { TerminalScene, type TerminalCommand } from '@/components/red/effects/TerminalScene'
import type { PortfolioContent } from '@/types'

import styles from './RedStack/styles.module.scss'

interface RedStackProps {
  content: PortfolioContent
}

export function RedStack({ content }: RedStackProps) {
  const { sections, skillGroups } = content
  const commands: readonly TerminalCommand[] = skillGroups.map((group) => ({
    id: group.id,
    label: group.title,
    panel: (
      <article className={styles.stackConsole}>
        <p className={styles.moduleLabel}>MÓDULO // {group.id.toUpperCase()}</p>
        <h3>{group.title}</h3>
        <ul>
          {group.skills.map((skill) => (
            <li key={skill}>
              <span aria-hidden="true">&gt;</span> {skill}
            </li>
          ))}
        </ul>
      </article>
    )
  }))

  return (
    <TerminalScene
      commands={commands}
      eyebrow={sections.stack.eyebrow}
      id="stack"
      title={sections.stack.title}
    />
  )
}
