import type { PortfolioContent } from '@/types/portfolio'

const isBlank = (value: string): boolean => value.trim().length === 0

/** Validates the invariants required by the single Portuguese portfolio document. */
export function validatePortfolioContent(content: PortfolioContent): string[] {
  const issues: string[] = []

  if (isBlank(content.profile.name)) issues.push('profile.name: required')
  if (isBlank(content.profile.role)) issues.push('profile.role: required')
  if (!content.actions.resume.href.startsWith('/')) {
    issues.push('actions.resume.href: expected a public path')
  }
  if (isBlank(content.actions.resume.label)) issues.push('actions.resume.label: required')

  const projectSlugs = new Set<string>()
  content.projects.forEach((project, index) => {
    if (projectSlugs.has(project.slug)) {
      issues.push(`projects[${index}].slug: duplicate value "${project.slug}"`)
    }
    projectSlugs.add(project.slug)
    if (project.links.length === 0)
      issues.push(`projects[${index}].links: expected at least one link`)
  })

  const experienceIds = new Set<string>()
  content.experience.forEach((entry, index) => {
    if (experienceIds.has(entry.id)) {
      issues.push(`experience[${index}].id: duplicate value "${entry.id}"`)
    }
    experienceIds.add(entry.id)
  })

  return issues
}

export function assertPortfolioContent(content: PortfolioContent): void {
  const issues = validatePortfolioContent(content)
  if (issues.length > 0) {
    throw new Error(`Portfolio content validation failed:\n${issues.join('\n')}`)
  }
}
