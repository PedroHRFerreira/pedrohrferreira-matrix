import { TerminalScene, type TerminalCommand } from '@/components/red/effects/TerminalScene'
import type { PortfolioContent } from '@/types'

import styles from './RedAbout/styles.module.scss'

interface RedAboutProps {
  content: PortfolioContent
}

export function RedAbout({ content }: RedAboutProps) {
  const { profile, sections } = content
  const commands: readonly TerminalCommand[] = [
    {
      id: 'identity',
      label: 'Inspecionar perfil',
      panel: (
        <div className={styles.aboutTerminal}>
          <p className={styles.terminalCommand} aria-hidden="true">
            $ whoami --verbose
          </p>
          <div className={styles.aboutCopy}>
            {profile.about.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
          <p className={styles.availability}>
            <span className={styles.statusDot} aria-hidden="true" />
            {profile.availability}
          </p>
        </div>
      )
    }
  ]

  return (
    <TerminalScene
      animateOnce
      commands={commands}
      eyebrow={sections.about.eyebrow}
      id="about"
      title={sections.about.title}
    />
  )
}
