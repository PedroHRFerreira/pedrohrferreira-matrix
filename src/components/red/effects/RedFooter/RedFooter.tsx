'use client'

import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import type { Contact, ProjectLink } from '@/types'

import styles from './styles.module.scss'

export interface RedFooterProps {
  message: string
  copyright: string
  contacts?: readonly Contact[]
  name: string
  role: string
  resume: ProjectLink
}

export function RedFooter({
  message,
  copyright,
  contacts = [],
  name,
  role,
  resume
}: RedFooterProps) {
  const footerRef = useRef<HTMLElement>(null)

  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger)
    const footer = footerRef.current
    if (!footer) return

    const media = gsap.matchMedia()
    media.add('(prefers-reduced-motion: no-preference)', () => {
      const context = gsap.context(() => {
        gsap
          .timeline({
            scrollTrigger: {
              trigger: footer,
              start: 'top 82%',
              once: true
            }
          })
          .fromTo(
            '[data-transmission-line]',
            { x: -18 },
            {
              x: 0,
              duration: 0.5,
              stagger: 0.12,
              ease: 'power2.out'
            }
          )
          .fromTo(
            '[data-transmission-actions]',
            { y: 18 },
            { y: 0, duration: 0.45, ease: 'power2.out' },
            '-=0.15'
          )
      }, footer)

      return () => context.revert()
    })

    return () => media.revert()
  }, [])

  return (
    <footer
      ref={footerRef}
      className={styles.footer}
      id="contact"
      aria-labelledby="red-footer-title"
    >
      <div className={styles.frame}>
        <div className={styles.chrome} aria-hidden="true">
          <span>SYS://TRANSMISSION_END</span>
          <span>CANAL 84 · SEGURO</span>
        </div>

        <div className={styles.transmission}>
          <p className={styles.protocol} data-transmission-line>
            &gt; trajetória decodificada.
          </p>
          <p className={styles.protocol} data-transmission-line>
            &gt; canal profissional disponível.
          </p>
          <p className={styles.protocol} data-transmission-line>
            &gt; aguardando nova conexão...
          </p>

          <div className={styles.identity} data-transmission-line>
            <span className={styles.signal} aria-hidden="true" />
            <div>
              <p className={styles.status}>SINAL ATIVO</p>
              <h2 id="red-footer-title">{name}</h2>
              <p>{role}</p>
            </div>
          </div>

          <p className={styles.message} data-transmission-line>
            {message}
            <span className={styles.cursor} aria-hidden="true" />
          </p>

          <nav
            className={styles.actions}
            aria-label="Canais profissionais"
            data-transmission-actions
          >
            {contacts.map((contact) => (
              <a
                href={contact.href}
                key={contact.kind}
                rel={contact.kind === 'email' ? undefined : 'noreferrer'}
                target={contact.kind === 'email' ? undefined : '_blank'}
              >
                <span>{contact.label}</span>
                <small>{contact.handle}</small>
              </a>
            ))}
            <a href={resume.href} download>
              <span>{resume.label}</span>
              <small>PDF · currículo</small>
            </a>
          </nav>
        </div>

        <div className={styles.legal}>
          <small>{copyright}</small>
          <small>CONEXÃO PERMANECE ABERTA</small>
        </div>
      </div>
    </footer>
  )
}
