import Image from 'next/image'

import { TerminalScene, type TerminalCommand } from '@/components/red/effects/TerminalScene'
import type { PortfolioContent } from '@/types'

import styles from './RedProjects/styles.module.scss'

interface RedProjectsProps {
  content: PortfolioContent
}

export function RedProjects({ content }: RedProjectsProps) {
  const { actions, projects, sections } = content
  const commands: readonly TerminalCommand[] = projects.map((project, index) => ({
    id: project.slug,
    label: project.title,
    panel: (
      <article className={styles.redProjectCard} data-project-card>
        <div className={styles.projectNumber} aria-hidden="true">
          PROJETO_{String(index + 1).padStart(2, '0')}
        </div>
        {project.image && (
          <Image
            className={styles.projectImage}
            src={project.image.src}
            alt={project.image.alt}
            width={project.image.width}
            height={project.image.height}
            loading="lazy"
          />
        )}
        <div className={styles.projectBody}>
          <div className={styles.projectHeading}>
            <h3>{project.title}</h3>
            {project.status && <span className={styles.projectStatus}>{project.status}</span>}
          </div>
          <p>{project.summary}</p>
          <ul className={styles.tags} aria-label="Tecnologias">
            {project.technologies.map((technology) => (
              <li key={technology}>{technology}</li>
            ))}
          </ul>
          <div className={styles.projectLinks}>
            {project.links.map((link) => (
              <a href={link.href} key={link.href} rel="noreferrer" target="_blank">
                {link.label || actions.visitProject}
                <span aria-hidden="true"> ↗</span>
              </a>
            ))}
          </div>
        </div>
      </article>
    )
  }))

  return (
    <TerminalScene
      className={styles.projectsSection}
      commands={commands}
      description={sections.projects.description}
      eyebrow={sections.projects.eyebrow}
      horizontal
      id="projects"
      panelClassName={styles.projectPanel}
      panelsClassName={styles.projectsTrack}
      title={sections.projects.title}
      viewportClassName={styles.projectsViewport}
    />
  )
}
