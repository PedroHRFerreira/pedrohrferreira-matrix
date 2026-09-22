import Image from 'next/image'

import type { PortfolioContent } from '@/types'

import styles from './BlueProjects/styles.module.scss'

interface BlueProjectsProps {
  content: PortfolioContent
}

export function BlueProjects({ content }: BlueProjectsProps) {
  const { actions, projects, sections } = content

  return (
    <section
      className={styles.projectsSection}
      id="projects"
      aria-labelledby="blue-projects-title"
      data-projects-root
      data-horizontal-gallery
      data-direction="left"
    >
      <div className={styles.projectsStage} data-horizontal-stage>
        <div className={styles.sectionHeader}>
          <p className={styles.eyebrow}>{sections.projects.eyebrow}</p>
          <h2 id="blue-projects-title">{sections.projects.title}</h2>
          {sections.projects.description && <p>{sections.projects.description}</p>}
        </div>
        <div className={styles.projectsViewport} data-projects-viewport data-horizontal-viewport>
          <div className={styles.projectsTrack} data-projects-track data-horizontal-track>
            {projects.map((project, index) => (
              <article
                className={styles.blueProjectCard}
                data-scene={index % 2 === 0 ? 'daybreak' : 'horizon'}
                key={project.slug}
                data-project-card
              >
                <span className={styles.sceneNumber} aria-hidden="true">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <div className={styles.projectVisual}>
                  {project.image ? (
                    <Image
                      className={styles.projectImage}
                      src={project.image.src}
                      alt={project.image.alt}
                      width={project.image.width}
                      height={project.image.height}
                      loading="lazy"
                    />
                  ) : (
                    <span className={styles.projectPlaceholder} aria-hidden="true">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                  )}
                </div>
                <div className={styles.projectBody}>
                  <div className={styles.projectHeading}>
                    <h3>{project.title}</h3>
                    {project.status && (
                      <span className={styles.projectStatus}>{project.status}</span>
                    )}
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
