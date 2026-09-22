import type { PortfolioContent } from '@/types'

import styles from './BlueContact/styles.module.scss'

interface BlueContactProps {
  content: PortfolioContent
}

export function BlueContact({ content }: BlueContactProps) {
  const { contacts, sections } = content

  return (
    <section className={styles.contactSection} id="contact" aria-labelledby="blue-contact-title">
      <div className={styles.contactGlow} aria-hidden="true" />
      <p className={styles.eyebrow}>{sections.contact.eyebrow}</p>
      <h2 id="blue-contact-title">{sections.contact.title}</h2>
      {sections.contact.description && <p>{sections.contact.description}</p>}
      <address className={styles.contactLinks}>
        {contacts.map((contact) => (
          <a
            href={contact.href}
            key={`${contact.kind}-${contact.href}`}
            rel={contact.kind === 'email' ? undefined : 'noreferrer'}
            target={contact.kind === 'email' ? undefined : '_blank'}
          >
            <span>{contact.label}</span>
            <strong>{contact.handle}</strong>
            <span aria-hidden="true">↗</span>
          </a>
        ))}
      </address>
    </section>
  )
}
