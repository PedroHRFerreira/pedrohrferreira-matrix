'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import type { Contact } from '@/types'

import styles from './styles.module.scss'

export interface BlueFooterProps {
  message: string
  copyright: string
  contacts?: readonly Contact[]
}

export function BlueFooter({ message, copyright, contacts = [] }: BlueFooterProps) {
  const footerRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const footer = footerRef.current
    if (!footer || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let observer: IntersectionObserver | undefined
    const context = gsap.context(() => {
      const timeline = gsap.timeline({ paused: true })
      timeline
        .fromTo(
          '[data-mist]',
          { opacity: 0, scale: 0.82, xPercent: -8 },
          { opacity: 1, scale: 1, xPercent: 0, stagger: 0.12, duration: 1.2, ease: 'sine.out' }
        )
        .fromTo(
          '[data-footer-content]',
          { opacity: 0, y: 18 },
          { opacity: 1, y: 0, duration: 0.65, ease: 'power2.out' },
          '-=0.6'
        )
        .fromTo(
          '[data-fault]',
          { opacity: 0 },
          { opacity: 0.85, repeat: 3, yoyo: true, duration: 0.07 },
          '-=0.1'
        )

      observer = new IntersectionObserver(
        ([entry]) => {
          if (entry?.isIntersecting) {
            timeline.play()
            observer?.disconnect()
          }
        },
        { threshold: 0.3 }
      )
      observer.observe(footer)
    }, footer)

    return () => {
      observer?.disconnect()
      context.revert()
    }
  }, [])

  return (
    <footer ref={footerRef} className={styles.footer}>
      <div className={styles.mist} aria-hidden="true">
        <span data-mist />
        <span data-mist />
        <span data-mist />
      </div>
      <div className={styles.content} data-footer-content>
        <span className={styles.fault} data-fault aria-hidden="true">
          0101
        </span>
        <p className={styles.message}>{message}</p>
        {contacts.length ? (
          <ul className={styles.contacts} aria-label="Professional profiles">
            {contacts.map((contact) => (
              <li key={contact.kind}>
                <a href={contact.href} rel={contact.kind === 'email' ? undefined : 'noreferrer'}>
                  {contact.label}
                </a>
              </li>
            ))}
          </ul>
        ) : null}
        <small>{copyright}</small>
      </div>
    </footer>
  )
}
