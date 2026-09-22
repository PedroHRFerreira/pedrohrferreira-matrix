import { act, renderHook, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { EXPERIENCE_STORAGE_KEY, useExperience } from './useExperience'

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

  it('orchestrates and persists a completed reality', async () => {
    const { result } = renderHook(() => useExperience())

    expect(result.current.state).toBe('static-noise')

    for (let step = 0; step < 6; step += 1) {
      act(() => result.current.advanceSequence())
    }
    expect(result.current.state).toBe('pill-selection')

    act(() => result.current.chooseReality('red'))
    act(() => result.current.completeTransition())

    expect(result.current.state).toBe('ready-red')
    await waitFor(() => expect(window.localStorage.getItem(EXPERIENCE_STORAGE_KEY)).toBe('red'))
  })

  it('restores a valid persisted reality without replaying the introduction', async () => {
    window.localStorage.setItem(EXPERIENCE_STORAGE_KEY, 'blue')
    const { result } = renderHook(() => useExperience())

    await waitFor(() => expect(result.current.state).toBe('ready-blue'))
    expect(result.current.reality).toBe('blue')
  })

  it('clears a restored reality and returns directly to the explicit choice', async () => {
    window.localStorage.setItem(EXPERIENCE_STORAGE_KEY, 'blue')
    const { result } = renderHook(() => useExperience())

    await waitFor(() => expect(result.current.state).toBe('ready-blue'))
    act(() => result.current.reviewChoice())

    expect(result.current.state).toBe('pill-selection')
    expect(result.current.reality).toBeNull()
    expect(result.current.canChoose).toBe(true)
    expect(window.localStorage.getItem(EXPERIENCE_STORAGE_KEY)).toBeNull()
  })

  it('ignores invalid persisted values', () => {
    window.localStorage.setItem(EXPERIENCE_STORAGE_KEY, 'invalid')
    const { result } = renderHook(() => useExperience())

    expect(result.current.state).toBe('static-noise')
  })

  it('skips long introductory motion but still requires a first-time choice', () => {
    installMatchMedia(true)
    const { result } = renderHook(() => useExperience())

    expect(result.current.state).toBe('pill-selection')
    expect(result.current.reality).toBeNull()
    expect(result.current.canChoose).toBe(true)
  })
})
