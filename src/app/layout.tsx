import type { Metadata, Viewport } from 'next'
import type { ReactNode } from 'react'
import '@/assets/globals.scss'

export const metadata: Metadata = {
  metadataBase: new URL('https://pedrohr.dev'),
  title: {
    default: 'Pedro Henrique Rodrigues — Engenheiro de Software Full Stack',
    template: '%s · Pedro Henrique Rodrigues'
  },
  description:
    'Portfólio de Pedro Henrique Rodrigues: produtos web e mobile, microsserviços e soluções de IA.',
  alternates: {
    canonical: '/'
  },
  openGraph: {
    type: 'profile',
    locale: 'pt_BR',
    title: 'Pedro Henrique Rodrigues — Engenheiro de Software Full Stack',
    description: 'Escolha uma realidade e conheça o trabalho por trás da interface.',
    url: '/',
    siteName: 'Pedro Henrique Rodrigues'
  },
  twitter: {
    card: 'summary',
    title: 'Pedro Henrique Rodrigues — Engenheiro de Software Full Stack',
    description: 'Escolha uma realidade e conheça o trabalho por trás da interface.'
  },
  icons: { icon: '/favicon.svg' }
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#050807',
  colorScheme: 'dark light'
}

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body>
        <a className="skip-link" href="#main-content">
          Ir para o conteúdo
        </a>
        {children}
      </body>
    </html>
  )
}
