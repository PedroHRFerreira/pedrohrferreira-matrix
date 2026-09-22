import type { PortfolioContent } from '@/types'

import { HorizontalGallery } from './HorizontalGallery'
import styles from './RedStack/styles.module.scss'

interface RedStackProps {
  content: PortfolioContent
}

export function RedStack({ content }: RedStackProps) {
  const { skillGroups } = content

  return (
    <HorizontalGallery
      id="stack"
      eyebrow="SISTEMA / CAPACIDADES_E_ARQUITETURA"
      title="Stack Principal & Arquitetura"
      description="Ferramentas escolhidas conforme o problema, da interface à infraestrutura e à inteligência aplicada."
      count={skillGroups.length}
      direction="right"
    >
      {skillGroups.map((group, index) => (
        <article className={styles.card} key={group.id}>
          <div className={styles.topline}>
            <span>MOD_{String(index + 1).padStart(2, '0')}</span>
            <span>ONLINE ●</span>
          </div>
          <div className={styles.content}>
            <p className={styles.path}>/system/capabilities/{group.id}</p>
            <h3>{group.title}</h3>
            <p className={styles.label}>TECNOLOGIAS & PRÁTICAS</p>
            <ul>
              {group.skills.map((skill) => (
                <li key={skill}>
                  <span aria-hidden="true">›</span>
                  {skill}
                </li>
              ))}
            </ul>
          </div>
          <div className={styles.bottom}>
            ARQUITETURA ORIENTADA A PRODUTO <span aria-hidden="true">↗</span>
          </div>
        </article>
      ))}
    </HorizontalGallery>
  )
}
