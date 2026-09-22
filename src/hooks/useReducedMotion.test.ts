import { act, renderHook } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { useReducedMotion } from './useReducedMotion'

function installMatchMedia(initialMatches: boolean) {
  let listener: ((event: MediaQueryListEvent) => void) | undefined
  const mediaQuery = {
    matches: initialMatches,
    media: '(prefers-reduced-motion: reduce)',
    onchange: null,
    addEventListener: vi.fn((_type: string, nextListener: EventListenerOrEventListenerObject) => {
      listener = nextListener as (event: MediaQueryListEvent) => void
    }),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn()
  } satisfies MediaQueryList

  vi.stubGlobal(
    'matchMedia',
    vi.fn(() => mediaQuery)
  )

  return {
    mediaQuery,
    change(matches: boolean) {
      listener?.({ matches } as MediaQueryListEvent)
    }
  }
}

describe('useReducedMotion', () => {
  afterEach(() => vi.unstubAllGlobals())

  it('reads the current preference and reacts to changes', () => {
    const matchMedia = installMatchMedia(true)
    const { result, unmount } = renderHook(() => useReducedMotion())

    expect(result.current).toBe(true)

    act(() => matchMedia.change(false))
    expect(result.current).toBe(false)

    unmount()
    expect(matchMedia.mediaQuery.removeEventListener).toHaveBeenCalledWith(
      'change',
      expect.any(Function)
    )
  })
})
