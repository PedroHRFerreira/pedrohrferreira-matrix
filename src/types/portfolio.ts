export type Reality = 'red' | 'blue'

export type ExperienceState =
  | 'static-noise'
  | 'terminal-connecting'
  | 'initial-message'
  | 'waiting-first-enter'
  | 'reality-question'
  | 'waiting-second-enter'
  | 'pill-selection'
  | 'transitioning-red'
  | 'transitioning-blue'
  | 'ready-red'
  | 'ready-blue'

export type SectionId = 'about' | 'experience' | 'projects' | 'dialogue' | 'stack' | 'contact'

export interface NavigationItem {
  id: SectionId
  label: string
}

export interface SocialContact {
  kind: 'github' | 'linkedin'
  label: string
  href: string
  handle: string
}

export interface EmailContact {
  kind: 'email'
  label: string
  href: `mailto:${string}`
  handle: string
}

export type Contact = SocialContact | EmailContact

export interface Profile {
  name: string
  role: string
  introduction: string
  about: readonly string[]
  availability: string
  location?: string
}

export interface ProjectLink {
  label: string
  href: string
}

export interface ProjectImage {
  src: string
  alt: string
  width: number
  height: number
}

export interface Project {
  slug: string
  title: string
  summary: string
  technologies: readonly string[]
  links: readonly ProjectLink[]
  image?: ProjectImage
  status?: string
}

export interface ExperienceEntry {
  id: string
  period: string
  title: string
  organization?: string
  summary: string
  highlights: readonly string[]
}

export interface SkillGroup {
  id: 'frontend' | 'backend' | 'tooling' | 'practices'
  title: string
  skills: readonly string[]
}

export interface EntryNarrative {
  identityLabel: string
  identityValue: string
  welcome: string
  question: string
  redPillLabel: string
  bluePillLabel: string
  redTransition: readonly string[]
  blueTransition: readonly string[]
  terminalConnection: string
  terminalIdentify: string
  terminalUser: string
  terminalWakeUp: string
  terminalMatrixHasYou: string
  continuePrompt: string
  touchContinue: string
  choicePrompt: string
}

export interface SectionCopy {
  eyebrow: string
  title: string
  description?: string
}

export interface PortfolioSections {
  about: SectionCopy
  experience: SectionCopy
  projects: SectionCopy
  stack: SectionCopy
  contact: SectionCopy
}

export interface PortfolioActions {
  viewProjects: string
  contactMe: string
  visitProject: string
  skipToContent: string
  reviewChoice: string
  resume: ProjectLink
}

export interface PortfolioContent {
  navigation: readonly NavigationItem[]
  profile: Profile
  entry: EntryNarrative
  sections: PortfolioSections
  actions: PortfolioActions
  experience: readonly ExperienceEntry[]
  projects: readonly Project[]
  skillGroups: readonly SkillGroup[]
  contacts: readonly Contact[]
  footer: {
    closingMessage: string
    copyright: string
  }
}
