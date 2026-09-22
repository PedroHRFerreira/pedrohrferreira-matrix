import { describe, expect, it } from 'vitest'

import { portfolioContent } from '@/config/portfolio'

import type { PortfolioContent } from '@/types/portfolio'

import { assertPortfolioContent, validatePortfolioContent } from './contentValidation'

const copyContent = (): PortfolioContent => structuredClone(portfolioContent)

describe('portfolio content validation', () => {
  it('accepts the published Portuguese content', () => {
    expect(validatePortfolioContent(portfolioContent)).toEqual([])
    expect(() => assertPortfolioContent(portfolioContent)).not.toThrow()
  })

  it('requires the professional identity and a public resume path', () => {
    const content = copyContent()
    content.profile.name = ' '
    content.profile.role = ''
    content.actions.resume = { label: '', href: 'https://example.com/curriculo.pdf' }

    expect(validatePortfolioContent(content)).toEqual([
      'profile.name: required',
      'profile.role: required',
      'actions.resume.href: expected a public path',
      'actions.resume.label: required'
    ])
  })

  it('reports duplicate project slugs, empty links, and duplicate experience ids', () => {
    const content = copyContent()
    content.projects[1] = { ...content.projects[1], slug: content.projects[0].slug, links: [] }
    content.experience[1] = { ...content.experience[1], id: content.experience[0].id }

    expect(validatePortfolioContent(content)).toEqual([
      'projects[1].slug: duplicate value "rods-sdk"',
      'projects[1].links: expected at least one link',
      'experience[1].id: duplicate value "braip"'
    ])
  })

  it('throws one actionable error containing every issue', () => {
    const content = copyContent()
    content.actions.resume = { label: '', href: 'curriculo.pdf' }

    expect(() => assertPortfolioContent(content)).toThrow(
      'Portfolio content validation failed:\nactions.resume.href: expected a public path\nactions.resume.label: required'
    )
  })
})
