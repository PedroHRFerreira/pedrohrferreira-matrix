import { act, render, screen } from '@testing-library/react'
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'

import { getPortfolioContent } from '@/config'

import { ENTRY_TIMING, EntryExperience } from './EntryExperience'

const noop = vi.fn()

beforeEach(() => {
  noop.mockClear()
})

afterEach(() => {
  vi.useRealTimers()
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
    expect(ENTRY_TIMING.coldBoot).toBe(1.5)
    expect(ENTRY_TIMING.staticNoise).toBe(3.5)
    expect(ENTRY_TIMING.signalReveal).toBe(2)
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
      screen.getAllByText('Eu só posso lhe mostrar a porta. Você tem que atravessá-la.')
    ).toHaveLength(1)
    expect(
      screen.getByRole('heading', {
        name: 'Eu só posso lhe mostrar a porta. Você tem que atravessá-la.'
      })
    ).toBeVisible()
    expect(screen.getByRole('button', { name: 'Pílula vermelha' })).toBeEnabled()
    expect(screen.getByRole('button', { name: 'Pílula azul' })).toBeEnabled()
  })

  it('types every character without losing content between renders', () => {
    vi.useFakeTimers()
    const content = getPortfolioContent()

    render(
      <EntryExperience
        content={content}
        state="initial-message"
        onAdvanceSequence={noop}
        onChooseReality={noop}
        onTransitionComplete={noop}
      />
    )

    act(() => vi.runAllTimers())

    for (const line of [
      content.entry.terminalConnection,
      content.entry.terminalIdentify,
      content.entry.terminalUser,
      content.entry.terminalWakeUp,
      content.entry.terminalMatrixHasYou
    ]) {
      expect(screen.getByText(line)).toBeVisible()
    }
    expect(noop).toHaveBeenCalledTimes(1)
  })

  it('does not offer a control to skip the introduction', () => {
    render(
      <EntryExperience
        content={getPortfolioContent()}
        state="cold-boot"
        onAdvanceSequence={noop}
        onChooseReality={noop}
        onTransitionComplete={noop}
      />
    )

    expect(screen.queryByRole('button', { name: 'Pular introdução' })).not.toBeInTheDocument()
  })
})
