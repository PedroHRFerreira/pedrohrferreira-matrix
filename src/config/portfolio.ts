import type { PortfolioContent } from '@/types'

const githubUrl = 'https://github.com/PedroHRFerreira'
const linkedInUrl = 'https://www.linkedin.com/in/pedrohr-dev'

export const portfolioContent = {
  navigation: [
    { id: 'about', label: 'Sobre' },
    { id: 'experience', label: 'Trajetória' },
    { id: 'projects', label: 'Projetos' },
    { id: 'stack', label: 'Stack' },
    { id: 'contact', label: 'Contato' }
  ],
  profile: {
    name: 'Pedro Henrique Rodrigues',
    role: 'Engenheiro de Software Full Stack',
    introduction:
      'Desenvolvo produtos web e mobile, microsserviços e soluções de IA para plataformas de grande escala.',
    about: [
      'Sou desenvolvedor Full Stack com mais de 4 anos de experiência, atuando da arquitetura à implementação com TypeScript, Go, Laravel e Python.',
      'Minha experiência reúne produtos com centenas de milhares de usuários, aplicativos publicados, ferramentas open source e soluções de IA com LLM e RAG em produção.'
    ],
    availability: 'Aberto a conversas profissionais e novos desafios.',
    location: 'Governador Valadares, MG'
  },
  entry: {
    identityLabel: 'IDENTIDADE ENCONTRADA',
    identityValue: 'usuário: Neo',
    welcome: 'Bem-vindo, Neo.',
    question: 'E se eu te dissesse que tudo o que você conhece é uma mentira?',
    redPillLabel: 'Pílula vermelha',
    bluePillLabel: 'Pílula azul',
    redTransition: [
      'Você escolheu enxergar além da interface.',
      'Bem-vindo ao código por trás da realidade.'
    ],
    blueTransition: [
      'Você escolheu permanecer no sonho.',
      'Relaxe. Tudo aqui foi feito para parecer perfeito.'
    ],
    terminalConnection: 'C:\\> CONEXÃO ESTABELECIDA',
    terminalIdentify: 'C:\\> IDENTIFICAR USUÁRIO',
    terminalUser: 'USUÁRIO: NEO',
    terminalWakeUp: 'Acorde, Neo...',
    terminalMatrixHasYou: 'A Matrix possui você...',
    continuePrompt: '[ PRESSIONE ENTER PARA CONTINUAR ]',
    touchContinue: '[ CONTINUAR ↵ ]',
    choicePrompt: 'Eu só posso lhe mostrar a porta.\nVocê tem que atravessá-la.'
  },
  sections: {
    about: { eyebrow: 'Perfil', title: 'Por trás da interface' },
    experience: {
      eyebrow: 'Trajetória',
      title: 'Experiência em produtos de escala',
      description: 'Da arquitetura à evolução em produção de produtos web, mobile e IA.'
    },
    projects: {
      eyebrow: 'Projetos em destaque',
      title: 'Produtos e ferramentas construídos de ponta a ponta',
      description: 'Uma seleção de projetos públicos, mobile e developer tools.'
    },
    stack: {
      eyebrow: 'Ferramentas',
      title: 'Tecnologia a serviço de produtos escaláveis'
    },
    contact: {
      eyebrow: 'Sinal aberto',
      title: 'Vamos construir algo relevante',
      description: 'A melhor forma de iniciar uma conversa é pelos meus perfis profissionais.'
    }
  },
  actions: {
    viewProjects: 'Ver projetos',
    contactMe: 'Entrar em contato',
    visitProject: 'Ver projeto',
    skipToContent: 'Ir para o conteúdo',
    reviewChoice: 'Rever escolha',
    resume: { label: 'Baixar meu currículo', href: '/curriculo-pedro.pdf' }
  },
  experience: [
    {
      id: 'braip',
      period: 'Mar 2022 — presente',
      title: 'Engenheiro de Software',
      organization: 'Braip',
      summary:
        'Na Braip desde 2022 e engenheiro de software desde 2023, atuo em produtos digitais e pagamentos para uma plataforma com mais de 900 mil usuários.',
      highlights: [
        'Microsserviços com Go, Node.js e Laravel, além de interfaces com Vue, React e TypeScript',
        'Soluções de IA/LLM em Python e FastAPI com contexto via RAG',
        'Aplicativo financeiro em React Native e Expo publicado na Google Play e App Store'
      ]
    },
    {
      id: 'freelancer',
      period: 'Mar 2023 — presente',
      title: 'Desenvolvedor Full Stack',
      organization: 'Freelancer',
      summary:
        'Desenvolvimento de produtos completos, de sites institucionais a sistemas de gestão.',
      highlights: [
        'ERP EMPI Autocenter com Go, Echo, GORM, Nuxt 4 e PostgreSQL',
        'Site institucional EMPI com Next.js e TypeScript',
        'Rods Themes publicado nos marketplaces do VS Code e JetBrains'
      ]
    },
    {
      id: 'bigbotcommunity',
      period: 'Jan 2026 — Jun 2026',
      title: 'Curador Front-end',
      organization: 'BigBotCommunity · Open Source',
      summary: 'Contribuição para o core da biblioteca bigbot-ui.',
      highlights: [
        'Componente em Vue 3 e TypeScript',
        'Testes com Vitest e documentação de API',
        'Integração à @braiphub/ui'
      ]
    }
  ],
  projects: [
    {
      slug: 'rods-sdk',
      title: 'Rods SDK',
      summary:
        'Framework TypeScript/npm open source para recuperação de contexto, governança e fluxos com agentes de IA.',
      technologies: ['TypeScript', 'IA', 'MCP', 'Codex', 'Claude Code', 'Gemini'],
      links: [{ label: 'Ver repositório', href: `${githubUrl}/rods-sdk` }],
      status: 'Open source'
    },
    {
      slug: 'erp-empi-autocenter',
      title: 'ERP EMPI Autocenter',
      summary:
        'Sistema completo de gestão administrativa construído do zero com arquitetura modularizada e BFF.',
      technologies: ['Go', 'Echo', 'GORM', 'Nuxt 4', 'PostgreSQL'],
      links: [{ label: 'Ver repositório', href: `${githubUrl}/erp-empi` }],
      status: 'Projeto público'
    },
    {
      slug: 'arca-tracker',
      title: 'ARCA Tracker',
      summary: 'Aplicativo local-first para acompanhamento de carteira.',
      technologies: ['React Native', 'Expo', 'SQLite', 'Cloudflare Workers'],
      links: [{ label: 'Ver repositório', href: `${githubUrl}/arca-pessoal` }]
    },
    {
      slug: 'rods-themes',
      title: 'Rods Themes',
      summary: 'Extensão de temas publicada para VS Code e JetBrains.',
      technologies: ['VS Code', 'JetBrains', 'Developer Tools'],
      links: [{ label: 'Ver repositório', href: `${githubUrl}/rods-themes` }],
      status: 'Publicado'
    }
  ],
  skillGroups: [
    {
      id: 'frontend',
      title: 'Front-end',
      skills: ['React', 'Next.js', 'TypeScript', 'JavaScript', 'HTML', 'CSS', 'Sass']
    },
    {
      id: 'backend',
      title: 'Back-end',
      skills: [
        'Go',
        'Node.js',
        'Python',
        'FastAPI',
        'Laravel',
        'Echo',
        'GORM',
        'REST',
        'Microsserviços',
        'BFF'
      ]
    },
    {
      id: 'tooling',
      title: 'Ferramentas',
      skills: [
        'Git',
        'Docker',
        'GitHub Actions',
        'Vitest',
        'Playwright',
        'RabbitMQ',
        'SonarQube',
        'Sentry'
      ]
    },
    {
      id: 'practices',
      title: 'Arquitetura, dados e IA',
      skills: [
        'DDD',
        'Clean Architecture',
        'PostgreSQL',
        'MySQL',
        'Redis',
        'SQLite',
        'IA generativa',
        'LLM',
        'RAG',
        'MCP'
      ]
    }
  ],
  contacts: [
    { kind: 'github', label: 'GitHub', href: githubUrl, handle: 'PedroHRFerreira' },
    { kind: 'linkedin', label: 'LinkedIn', href: linkedInUrl, handle: 'pedrohr-dev' }
  ],
  footer: {
    closingMessage: 'O sinal continua aberto.',
    copyright: 'Pedro Henrique Rodrigues. Construído com intenção.'
  }
} satisfies PortfolioContent

export function getPortfolioContent(): PortfolioContent {
  return portfolioContent
}
