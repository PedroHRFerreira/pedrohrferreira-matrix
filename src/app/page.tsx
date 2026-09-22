import { ExperienceTemplate } from '@/templates/ExperienceTemplate'

export default function HomePage() {
  const person = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Pedro Henrique Rodrigues',
    url: 'https://pedrohr.dev',
    sameAs: ['https://github.com/PedroHRFerreira', 'https://www.linkedin.com/in/pedrohr-dev/'],
    jobTitle: 'Engenheiro de Software Full Stack',
    knowsLanguage: 'pt-BR'
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(person) }}
      />
      <ExperienceTemplate />
    </>
  )
}
