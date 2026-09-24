'use client'

import Image from 'next/image'
import { useState } from 'react'
import { StormAtmosphere } from '@/components/zion/StormAtmosphere'
import type { PortfolioContent } from '@/types'
import styles from './ZionTemplate.module.scss'

export function ZionTemplate({ content }: { content: PortfolioContent }) {
  const [paused, setPaused] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const items = content.navigation.filter((item) => item.id !== 'dialogue')
  return (
    <div className={styles.shell} data-reality="zion">
      <a href="#main-content" className={styles.skip}>
        {content.actions.skipToContent}
      </a>
      <header className={styles.header}>
        <a href="#zion-top" className={styles.wordmark} aria-label="Mundo real — início">
          MUNDO REAL
        </a>
        <button
          className={styles.menuButton}
          type="button"
          aria-controls="zion-navigation"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((value) => !value)}
        >
          {menuOpen ? 'Fechar' : 'Menu'} <span aria-hidden="true">{menuOpen ? '−' : '+'}</span>
        </button>
        <nav
          id="zion-navigation"
          aria-label="Navegação do portfólio"
          className={`${styles.navigation} ${menuOpen ? styles.open : ''}`}
          onKeyDown={(event) => {
            if (event.key === 'Escape') {
              setMenuOpen(false)
              document
                .querySelector<HTMLButtonElement>('[aria-controls="zion-navigation"]')
                ?.focus()
            }
          }}
        >
          {items.map((item) => (
            <a href={`#${item.id}`} key={item.id} onClick={() => setMenuOpen(false)}>
              {item.label}
            </a>
          ))}
        </nav>
      </header>
      <main id="main-content">
        <section
          className={styles.hero}
          id="zion-top"
          data-section="hero"
          aria-labelledby="zion-heading"
        >
          <Image
            className={styles.city}
            src="/images/zion-city.webp"
            alt=""
            fill
            sizes="100vw"
            preload
          />
          <div className={styles.heroShade} />
          <StormAtmosphere paused={paused} />
          <div className={styles.heroContent}>
            <p className={styles.eyebrow}>A SIMULAÇÃO TERMINOU.</p>
            <h1 id="zion-heading">
              Bem-vindo
              <br />
              ao mundo <em>real.</em>
            </h1>
            <p className={styles.heroNote}>O céu mudou. A vontade de construir permanece.</p>
            <a href="#about" className={styles.explore}>
              Conheça quem está por trás <span aria-hidden="true">↓</span>
            </a>
          </div>
          <div className={styles.heroBottom}>
            <span>PORTFÓLIO / {content.profile.name}</span>
          </div>
        </section>

        <div className={styles.document}>
          <section
            id="about"
            className={`${styles.section} ${styles.about}`}
            aria-labelledby="zion-about"
          >
            <div>
              <p className={styles.eyebrow}>01 / {content.sections.about.eyebrow}</p>
              <h2 id="zion-about">{content.profile.name}</h2>
              <p className={styles.role}>{content.profile.role}</p>
              {content.profile.location && (
                <p className={styles.location}>{content.profile.location}</p>
              )}
            </div>
            <div className={styles.aboutBody}>
              <p className={styles.lead}>{content.profile.introduction}</p>
              {content.profile.about.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
              <a
                className={styles.textLink}
                href={content.actions.resume.href}
                target="_blank"
                rel="noreferrer"
              >
                {content.actions.resume.label} <span aria-hidden="true">↗</span>
              </a>
            </div>
          </section>

          <section id="projects" className={styles.section} aria-labelledby="zion-projects">
            <p className={styles.eyebrow}>02 / {content.sections.projects.eyebrow}</p>
            <div className={styles.sectionHeading}>
              <h2 id="zion-projects">O que eu construo.</h2>
              <p>{content.sections.projects.description}</p>
            </div>
            <div className={styles.projects}>
              {content.projects.map((project, index) => (
                <article key={project.slug} className={styles.project}>
                  <div className={styles.projectTop}>
                    <span>PROJETO / {String(index + 1).padStart(2, '0')}</span>
                    {project.status && <span>{project.status}</span>}
                  </div>
                  {project.image && (
                    <Image
                      className={styles.projectImage}
                      src={project.image.src}
                      alt={project.image.alt}
                      width={project.image.width}
                      height={project.image.height}
                      sizes="(max-width: 700px) 90vw, 45vw"
                    />
                  )}
                  <h3>{project.title}</h3>
                  <p>{project.summary}</p>
                  <ul className={styles.tags} aria-label="Tecnologias">
                    {project.technologies.map((technology) => (
                      <li key={technology}>{technology}</li>
                    ))}
                  </ul>
                  <div className={styles.projectLinks}>
                    {project.links.map((link) => (
                      <a
                        href={link.href}
                        key={link.href}
                        target="_blank"
                        rel="noreferrer"
                        aria-label={`${link.label}: ${project.title}`}
                      >
                        {link.label} <span aria-hidden="true">↗</span>
                      </a>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section id="experience" className={styles.section} aria-labelledby="zion-experience">
            <p className={styles.eyebrow}>03 / {content.sections.experience.eyebrow}</p>
            <div className={styles.sectionHeading}>
              <h2 id="zion-experience">Experiência que permanece.</h2>
              <p>{content.sections.experience.description}</p>
            </div>
            <div className={styles.timeline}>
              {content.experience.map((entry) => (
                <article key={entry.id} className={styles.experience}>
                  <div>
                    <p className={styles.period}>{entry.period}</p>
                    {entry.organization && (
                      <p className={styles.organization}>{entry.organization}</p>
                    )}
                  </div>
                  <div>
                    <h3>{entry.title}</h3>
                    <p>{entry.summary}</p>
                    <ul>
                      {entry.highlights.map((highlight) => (
                        <li key={highlight}>{highlight}</li>
                      ))}
                    </ul>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section id="stack" className={styles.section} aria-labelledby="zion-stack">
            <p className={styles.eyebrow}>04 / {content.sections.stack.eyebrow}</p>
            <h2 id="zion-stack">{content.sections.stack.title}</h2>
            <div className={styles.stack}>
              {content.skillGroups.map((group) => (
                <div key={group.id}>
                  <h3>{group.title}</h3>
                  <ul>
                    {group.skills.map((skill) => (
                      <li key={skill}>{skill}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          <section
            id="contact"
            className={`${styles.section} ${styles.contact}`}
            aria-labelledby="zion-contact"
          >
            <p className={styles.eyebrow}>05 / {content.sections.contact.eyebrow}</p>
            <h2 id="zion-contact">
              Ainda existe alguém
              <br />
              <em>do outro lado.</em>
            </h2>
            <p>
              {content.sections.contact.title}. {content.profile.availability}
            </p>
            <div className={styles.contacts}>
              {content.contacts.map((contact) => (
                <a
                  key={contact.kind}
                  href={contact.href}
                  target={contact.kind === 'email' ? undefined : '_blank'}
                  rel={contact.kind === 'email' ? undefined : 'noreferrer'}
                >
                  <span>
                    {contact.label}
                    <small>{contact.handle}</small>
                  </span>
                  <span aria-hidden="true">↗</span>
                </a>
              ))}
            </div>
          </section>
          <footer className={styles.footer}>
            <span>{content.footer.copyright}</span>
            <a href="#zion-top">Voltar ao topo ↑</a>
          </footer>
        </div>
      </main>
    </div>
  )
}
