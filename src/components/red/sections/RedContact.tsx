import type { PortfolioContent } from '@/types'

import styles from './RedContact/styles.module.scss'

interface RedContactProps {
  content: PortfolioContent
}

export function RedContact({ content }: RedContactProps) {
  const { contacts, sections } = content

  return (
    <section
      className={styles.contactSection}
      id="contact"
      aria-labelledby="red-contact-title"
      data-red-scene
    >
      <div className={styles.contactSignal} aria-hidden="true" data-red-type>
        TRANSMISSÃO RECEBIDA
      </div>
      <p className={styles.eyebrow} data-red-type>{`// ${sections.contact.eyebrow}`}</p>
      <h2 id="red-contact-title" data-red-type>
        {sections.contact.title}
      </h2>
      {sections.contact.description && <p data-red-type>{sections.contact.description}</p>}
      <address className={styles.contactLinks} data-red-reveal>
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
