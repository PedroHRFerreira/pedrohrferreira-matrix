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
    choicePrompt: 'Eu só posso lhe mostrar a porta. Você tem que atravessá-la.',
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
    touchContinue: '[ CONTINUAR ↵ ]'
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
      id: 'rods',
      period: 'Jun 2026 — presente',
      title: 'Founder & Software Engineer',
      organization: 'Rods',
      summary:
        'Criei a Rods para desenvolver e manter produtos que uso no meu dia a dia como desenvolvedor. Cuido da arquitetura, implementação, publicação e evolução das três ferramentas.',
      highlights: [
        '23/06/2026 · Rods Themes — coleção de temas para VS Code, JetBrains e Zed.',
        '02/07/2026 · Rods SDK — CLI, integração MCP e busca de contexto em repositórios para agentes de código.',
        '05/09/2026 · Rods Leet — plataforma de prática de programação com desafios, trilhas e progresso.',
        '26/09/2026 · Rods SDK — adição do marketplace do plugin para Codex.',
        '01/10/2026 · Rods Leet — lições de fundamentos antes dos desafios.',
        '02/10/2026 · Rods Leet — prática de JavaScript e TypeScript no navegador.',
        '21/10/2026 · Rods SDK — menus de configuração inicial e diagnósticos de planejamento.',
        '24/10/2026 · Rods Themes — lançamento da versão 0.1.0.'
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
        'Site institucional EMPI com Next.js e TypeScript'
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
      slug: 'rods-leet',
      title: 'Rods Leet',
      summary:
        'Plataforma para praticar programação com desafios, trilhas de estudo e acompanhamento de progresso.',
      technologies: ['React', 'TypeScript'],
      links: [{ label: 'Abrir Rods Leet', href: 'https://rodsleet.com/' }],
      status: 'Publicado'
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
      links: [{ label: 'Ver repositório', href: `${githubUrl}/arca-tracker` }]
    },
    {
      slug: 'rods-themes',
      title: 'Rods Themes',
      summary: 'Coleção de temas para VS Code, IDEs da JetBrains e Zed.',
      technologies: ['VS Code', 'JetBrains', 'Zed'],
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
