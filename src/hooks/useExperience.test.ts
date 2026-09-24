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

describe('blue rupture journey', () => {
  beforeEach(() => installMatchMedia(false))
  afterEach(() => vi.unstubAllGlobals())

  function reachBlue() {
    const hook = renderHook(() => useExperience())
    for (let step = 0; step < 8; step += 1) {
      act(() => hook.result.current.advanceSequence())
    }
    act(() => hook.result.current.chooseReality('blue'))
    act(() => hook.result.current.completeTransition())
    return hook
  }

  it('corrupts the third capture and reveals the TV only on the fourth', () => {
    const { result } = reachBlue()
    const capture = result.current.registerBlueCapture
    for (let count = 1; count <= 3; count += 1) {
      act(() => result.current.registerBlueCapture())
      expect(result.current.blueCaptureCount).toBe(count)
      expect(result.current.blueCorrupted).toBe(count === 3)
      expect(result.current.state).toBe('ready-blue')
      expect(result.current.registerBlueCapture).toBe(capture)
    }
    act(() => result.current.registerBlueCapture())
    expect(result.current.state).toBe('blue-revelation-one')
    act(() => result.current.registerBlueCapture())
    expect(result.current.blueCaptureCount).toBe(4)
    act(() => result.current.completeZionChase())
    expect(result.current.state).toBe('blue-revelation-one')
    act(() => result.current.advanceSequence())
    expect(result.current.state).toBe('blue-revelation-two')
    act(() => result.current.advanceSequence())
    expect(result.current.state).toBe('zion-chase')
    act(() => result.current.advanceSequence())
    expect(result.current.state).toBe('zion-chase')
    act(() => result.current.completeZionChase())
    expect(result.current.state).toBe('zion-loading')
    act(() => result.current.completeTransition())
    expect(result.current.state).toBe('ready-zion')
  })

  it('forgets all captures and the destination after a fresh mount', () => {
    const first = reachBlue()
    for (let capture = 0; capture < 4; capture += 1) {
      act(() => first.result.current.registerBlueCapture())
    }
    act(() => first.result.current.advanceSequence())
    act(() => first.result.current.advanceSequence())
    act(() => first.result.current.completeZionChase())
    act(() => first.result.current.completeTransition())
    expect(first.result.current.state).toBe('ready-zion')
    first.unmount()
    const refreshed = renderHook(() => useExperience())
    expect(refreshed.result.current.state).toBe('cold-boot')
    expect(refreshed.result.current.blueCaptureCount).toBe(0)
    expect(refreshed.result.current.blueCorrupted).toBe(false)
  })

  it('ignores captures outside the blue portfolio', () => {
    const { result } = renderHook(() => useExperience())
    act(() => result.current.registerBlueCapture())
    expect(result.current.blueCaptureCount).toBe(0)
    expect(result.current.state).toBe('cold-boot')
  })
})
