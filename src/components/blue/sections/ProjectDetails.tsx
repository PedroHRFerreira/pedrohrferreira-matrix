'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import type { Project } from '@/types'
import styles from './BlueProjects/styles.module.scss'

interface ProjectDetailsProps {
  projects: readonly Project[]
  selected: string
  onClose: () => void
  onSelect: (slug: string) => void
}

export function ProjectDetails({ projects, selected, onClose, onSelect }: ProjectDetailsProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const [expanded, setExpanded] = useState(false)
  const index = projects.findIndex((project) => project.slug === selected)
  const project = projects[index]

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    const opener = document.activeElement instanceof HTMLElement ? document.activeElement : null
    const previousOverflow = document.body.style.overflow
    dialog.showModal()
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previousOverflow
      dialog.close()
      if (opener?.isConnected) opener.focus({ preventScroll: true })
    }
  }, [])

  if (!project) return null
  const navigate = (offset: number) => {
    setExpanded(false)
    onSelect(projects[(index + offset + projects.length) % projects.length].slug)
    dialogRef.current?.scrollTo({ top: 0, behavior: 'instant' })
  }

  return (
    <dialog
      ref={dialogRef}
      className={styles.dialog}
      aria-labelledby="project-detail-title"
      onKeyDown={(event) => {
        if (event.key !== 'Tab') return
        const controls = Array.from(
          event.currentTarget.querySelectorAll<HTMLElement>(
            'button, a[href], input, select, [tabindex="0"]'
          )
        ).filter((element) => !element.hasAttribute('disabled'))
        const first = controls[0]
        const last = controls.at(-1)
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault()
          last?.focus()
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault()
          first?.focus()
        }
      }}
      onCancel={(event) => {
        event.preventDefault()
        onClose()
      }}
      onClick={(event) => {
        if (event.target !== event.currentTarget) return
        const bounds = event.currentTarget.getBoundingClientRect()
        if (
          event.clientX < bounds.left ||
          event.clientX > bounds.right ||
          event.clientY < bounds.top ||
          event.clientY > bounds.bottom
        )
          onClose()
      }}
    >
      <div className={styles.dialogTop}>
        <span>
          Projeto {index + 1} de {projects.length}
        </span>
        <button onClick={onClose} aria-label="Fechar detalhes">
          Fechar ×
        </button>
      </div>
      <div aria-live="polite" aria-atomic="true">
        <p className={styles.eyebrow}>{project.status ?? 'Projeto em destaque'}</p>
        <h2 id="project-detail-title">{project.title}</h2>
        <p className={styles.detailSummary}>{project.summary}</p>
      </div>
      {project.image && (
        <button
          className={styles.imageButton}
          data-expanded={expanded}
          onClick={() => setExpanded(!expanded)}
          aria-expanded={expanded}
          aria-label={expanded ? 'Reduzir imagem' : 'Ampliar imagem'}
        >
          <Image
            src={project.image.src}
            alt={project.image.alt}
            width={project.image.width}
            height={project.image.height}
            sizes="(max-width: 768px) 90vw, 800px"
          />
          <span>{expanded ? 'Reduzir imagem −' : 'Ampliar imagem +'}</span>
        </button>
      )}
      <h3>Tecnologias utilizadas</h3>
      <ul className={styles.tags}>
        {project.technologies.map((technology) => (
          <li key={technology}>{technology}</li>
        ))}
      </ul>
      <div className={styles.projectLinks}>
        {project.links.map((link) => (
          <a href={link.href} key={link.href} target="_blank" rel="noreferrer">
            {link.label} ↗
          </a>
        ))}
      </div>
      {projects.length > 1 && (
        <nav className={styles.dialogNavigation} aria-label="Navegar entre projetos">
          <button onClick={() => navigate(-1)}>← Anterior</button>
          <button onClick={() => navigate(1)}>Próximo →</button>
        </nav>
      )}
    </dialog>
  )
}
