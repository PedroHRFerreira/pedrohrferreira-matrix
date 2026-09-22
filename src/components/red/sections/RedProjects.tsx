import Image from 'next/image'

import type { PortfolioContent } from '@/types'

import { HorizontalGallery } from './HorizontalGallery'
import styles from './RedProjects/styles.module.scss'

interface RedProjectsProps {
  content: PortfolioContent
}

export function RedProjects({ content }: RedProjectsProps) {
  const { projects, sections } = content

  return (
    <HorizontalGallery
      id="projects"
      eyebrow="ARQUIVO / PROJETOS_SELECIONADOS"
      title="Projetos em Destaque"
      description={sections.projects.description}
      count={projects.length}
    >
      {projects.map((project, index) => (
        <article className={styles.card} key={project.slug}>
          <div className={styles.topline}>
            <span>
              {String(index + 1).padStart(2, '0')} / {String(projects.length).padStart(2, '0')}
            </span>
            <span>{project.status ?? 'PROJETO'}</span>
          </div>
          {project.image && (
            <Image
              className={styles.image}
              src={project.image.src}
              alt={project.image.alt}
              width={project.image.width}
              height={project.image.height}
              loading="lazy"
            />
          )}
          <div className={styles.body}>
            <p className={styles.command}>$ inspect --project {project.slug}</p>
            <h3>{project.title}</h3>
            <p className={styles.summary}>{project.summary}</p>
            <ul className={styles.tags} aria-label="Tecnologias">
              {project.technologies.slice(0, 5).map((technology) => (
                <li key={technology}>{technology}</li>
              ))}
            </ul>
          </div>
          <div className={styles.links}>
            {project.links.map((link) => (
              <a href={link.href} key={link.href} rel="noreferrer" target="_blank">
                {link.label || content.actions.visitProject} <span aria-hidden="true">↗</span>
              </a>
            ))}
          </div>
        </article>
      ))}
    </HorizontalGallery>
  )
}
