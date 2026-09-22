import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { useExperience } from './useExperience'

function installMatchMedia(matches: boolean) {
  vi.stubGlobal(
    'matchMedia',
    vi.fn(() => ({
      matches,
      media: '(prefers-reduced-motion: reduce)',
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn()
    }))
  )
}

describe('useExperience', () => {
  beforeEach(() => {
    window.localStorage.clear()
    installMatchMedia(false)
  })

  afterEach(() => vi.unstubAllGlobals())

  it('orchestrates a completed reality without persisting the choice', () => {
    const { result } = renderHook(() => useExperience())

    expect(result.current.state).toBe('cold-boot')

    for (let step = 0; step < 8; step += 1) {
      act(() => result.current.advanceSequence())
    }
    expect(result.current.state).toBe('pill-selection')

    act(() => result.current.chooseReality('red'))
    act(() => result.current.completeTransition())

    expect(result.current.state).toBe('ready-red')
    expect(window.localStorage).toHaveLength(0)
  })

  it('returns directly to the explicit choice while the current session is open', () => {
    const { result } = renderHook(() => useExperience())

    for (let step = 0; step < 8; step += 1) {
      act(() => result.current.advanceSequence())
    }
    act(() => result.current.chooseReality('blue'))
    act(() => result.current.completeTransition())
    act(() => result.current.reviewChoice())

    expect(result.current.state).toBe('pill-selection')
    expect(result.current.reality).toBeNull()
    expect(result.current.canChoose).toBe(true)
  })

  it('starts from the cold boot on every new mount', () => {
    const first = renderHook(() => useExperience())
    for (let step = 0; step < 8; step += 1) {
      act(() => first.result.current.advanceSequence())
    }
    act(() => first.result.current.chooseReality('red'))
    act(() => first.result.current.completeTransition())
    expect(first.result.current.state).toBe('ready-red')
    first.unmount()

    const refreshed = renderHook(() => useExperience())
    expect(refreshed.result.current.state).toBe('cold-boot')
  })

  it('skips long introductory motion but still requires a first-time choice', () => {
    installMatchMedia(true)
    const { result } = renderHook(() => useExperience())

    expect(result.current.state).toBe('pill-selection')
    expect(result.current.reality).toBeNull()
    expect(result.current.canChoose).toBe(true)
  })
})
