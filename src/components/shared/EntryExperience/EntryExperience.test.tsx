import { render, screen } from '@testing-library/react'
import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'

import { getPortfolioContent } from '@/config'

import { ENTRY_TIMING, EntryExperience } from './EntryExperience'

const noop = vi.fn()

beforeEach(() => {
  noop.mockClear()
})

beforeAll(() => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn()
    }))
  })
  Object.defineProperty(HTMLCanvasElement.prototype, 'getContext', {
    configurable: true,
    value: vi.fn(() => ({
      createImageData: (width: number, height: number) => ({
        data: new Uint8ClampedArray(width * height * 4),
        width,
        height
      }),
      putImageData: vi.fn()
    }))
  })
})

describe('EntryExperience', () => {
  it('uses the requested cinematic timing', () => {
    expect(ENTRY_TIMING.staticNoise).toBe(5)
    expect(ENTRY_TIMING.terminalPause).toBe(1.2)
    expect(ENTRY_TIMING.questionCharacter).toBeGreaterThan(ENTRY_TIMING.initialCharacter)
  })

  it('shows the final question and accessible pill controls', () => {
    render(
      <EntryExperience
        content={getPortfolioContent()}
        state="pill-selection"
        onAdvanceSequence={noop}
        onChooseReality={noop}
        onTransitionComplete={noop}
      />
    )

    expect(
      screen.getByRole('heading', {
        name: 'E se eu te dissesse que tudo o que você conhece é uma mentira?'
      })
    ).toBeVisible()
    expect(screen.getByRole('button', { name: 'Pílula vermelha' })).toBeEnabled()
    expect(screen.getByRole('button', { name: 'Pílula azul' })).toBeEnabled()
  })

  it('does not offer a control to skip the introduction', () => {
    render(
      <EntryExperience
        content={getPortfolioContent()}
        state="static-noise"
        onAdvanceSequence={noop}
        onChooseReality={noop}
        onTransitionComplete={noop}
      />
    )

    expect(screen.queryByRole('button', { name: 'Pular introdução' })).not.toBeInTheDocument()
  })
})
