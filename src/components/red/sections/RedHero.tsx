import type { PortfolioContent } from '@/types'

import styles from './RedHero/styles.module.scss'

interface RedHeroProps {
  content: PortfolioContent
}

export function RedHero({ content }: RedHeroProps) {
  const { profile, actions } = content
  const nameParts = profile.name.split(' ')
  const surname = nameParts.pop()
  const firstNames = nameParts.join(' ')
  const linkedIn = content.contacts.find((contact) => contact.kind === 'linkedin')

  return (
    <header className={styles.hero} data-section="hero">
      <div className={styles.heroCard}>
        <div className={styles.heroChrome}>
          <span className={styles.windowLights} aria-hidden="true">
            <i />
            <i />
            <i />
          </span>
          <span>pedro@matrix:~/identity/manifest.sh</span>
          <span className={styles.chromeStatus}>[ SYS: ONLINE ] &nbsp; [ ENCRYPTION: ACTIVE ]</span>
        </div>
        <div className={styles.heroGrid}>
          <div className={styles.heroMain}>
            <p className={styles.prompt}>
              &gt; Wake up, Pedro
              <span className={styles.cursor} aria-hidden="true" />
            </p>
            <h1 className={styles.heroTitle}>
              {firstNames} <span>{surname}</span>
            </h1>
            <p className={styles.heroIntroduction}>
              <strong>{profile.role}.</strong> Desenvolvimento Full Stack com foco em back-end,
              arquitetura distribuída e experiências digitais que conectam sistemas e pessoas.
            </p>
            <div className={styles.quote}>
              <p>“Sempre aprendendo. Sempre refatorando. Sempre melhorando.”</p>
              <span>
                {
                  '// GITHUB: @PedroHRFerreira · FOCO: Back-end, AI Agent Workflows & Local-First Systems'
                }
              </span>
            </div>
            <div className={styles.heroActions}>
              <a className={styles.primaryAction} href="#projects">
                &lt;&gt; &nbsp; EXPLORAR REPOSITÓRIOS
              </a>
              <a className={styles.secondaryAction} href="#dialogue">
                &gt;_ &nbsp; ABRIR SHELL REPL
              </a>
              {linkedIn ? (
                <a
                  className={styles.textAction}
                  href={linkedIn.href}
                  target="_blank"
                  rel="noreferrer"
                >
                  [LinkedIn] ↗
                </a>
              ) : null}
              <a
                className={styles.mobileResume}
                href={actions.resume.href}
                download
                aria-label={actions.resume.label}
              >
                {actions.resume.label} ↘
              </a>
            </div>
          </div>
          <aside className={styles.identityPanel} aria-label="Resumo profissional">
            <div className={styles.panelHead}>
              <span>{'// KERNEL TELEMETRY'}</span>
              <span>● LIVE</span>
            </div>
            <dl>
              <div>
                <dt>HOST</dt>
                <dd>{profile.location}</dd>
              </div>
              <div>
                <dt>AFFILIATION</dt>
                <dd>Braip · Software Engineer</dd>
              </div>
              <div>
                <dt>PRIMARY ARCHITECTURE</dt>
                <dd>Go / TypeScript / Python</dd>
              </div>
              <div>
                <dt>AGENT PROTOCOLS</dt>
                <dd>MCP / LLM / RAG</dd>
              </div>
            </dl>
            <a
              className={styles.resumeLink}
              href={actions.resume.href}
              download
              aria-label={actions.resume.label}
            >
              {actions.resume.label} ↘
            </a>
          </aside>
        </div>
      </div>
    </header>
  )
}
