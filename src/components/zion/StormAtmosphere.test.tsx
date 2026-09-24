import { cleanup, render } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { StormAtmosphere } from './StormAtmosphere'

describe('StormAtmosphere', () => {
  const clear = vi.fn()
  const disconnect = vi.fn()
  const cancel = vi.fn()
  const request = vi.fn<(callback: FrameRequestCallback) => number>(() => 9)
  const stroke = vi.fn()
  const line = vi.fn()
  let reduced = false

  beforeEach(() => {
    reduced = false
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue({
      clearRect: clear,
      setTransform: vi.fn(),
      beginPath: vi.fn(),
      moveTo: vi.fn(),
      lineTo: line,
      stroke
    } as unknown as CanvasRenderingContext2D)
    vi.stubGlobal('requestAnimationFrame', request)
    vi.stubGlobal('cancelAnimationFrame', cancel)
    vi.stubGlobal('matchMedia', () => ({
      matches: reduced,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn()
    }))
    vi.stubGlobal(
      'IntersectionObserver',
      class {
        observe() {}
        disconnect = disconnect
      }
    )
    vi.stubGlobal(
      'ResizeObserver',
      class {
        observe() {}
        disconnect = disconnect
      }
    )
  })

  afterEach(() => {
    cleanup()
    vi.restoreAllMocks()
    vi.unstubAllGlobals()
    vi.clearAllMocks()
  })

  it('does not animate when paused or when reduced motion is requested', () => {
    const view = render(<StormAtmosphere paused />)
    expect(request).not.toHaveBeenCalled()
    reduced = true
    view.rerender(<StormAtmosphere paused={false} />)
    expect(request).not.toHaveBeenCalled()
  })

  it('cancels animation and disconnects both observers on unmount', () => {
    const view = render(<StormAtmosphere />)
    expect(request).toHaveBeenCalledOnce()
    view.unmount()
    expect(cancel).toHaveBeenCalledWith(9)
    expect(disconnect).toHaveBeenCalledTimes(2)
  })

  it('draws all 105 drops with only 12 stroke batches per frame', () => {
    render(<StormAtmosphere />)
    const draw = request.mock.calls.at(-1)![0]
    draw(performance.now() + 16)
    expect(line).toHaveBeenCalledTimes(105)
    expect(stroke).toHaveBeenCalledTimes(12)
  })

  it('clears animation when paused during playback', () => {
    const view = render(<StormAtmosphere />)
    view.rerender(<StormAtmosphere paused />)
    expect(request).toHaveBeenCalledOnce()
    expect(cancel).toHaveBeenCalledWith(9)
    expect(clear).toHaveBeenCalled()
  })
})
