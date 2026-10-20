import { act, cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { MobileTvExperience } from './MobileTvExperience'

let mobile: boolean
let landscape: boolean
let fullscreen: Element | null
let media: Map<string, MediaQueryList>
const lock = vi.fn()
const unlock = vi.fn()
const requestFullscreen = vi.fn()
const exitFullscreen = vi.fn()

function rotate() {
  landscape = true
  for (const query of media.values()) query.dispatchEvent(new Event('change'))
}

beforeEach(() => {
  mobile = true
  landscape = false
  fullscreen = null
  media = new Map()
  lock.mockReset().mockResolvedValue(undefined)
  unlock.mockReset()
  requestFullscreen.mockReset().mockImplementation(() => {
    fullscreen = document.querySelector('[data-tv-immersion]')
    return Promise.resolve()
  })
  exitFullscreen.mockReset().mockImplementation(() => {
    fullscreen = null
    return Promise.resolve()
  })
  vi.stubGlobal('screen', { orientation: { lock, unlock } })
  vi.stubGlobal(
    'matchMedia',
    vi.fn((query: string) => {
      if (!media.has(query)) {
        const target = new EventTarget()
        media.set(query, Object.assign(target, { media: query }) as MediaQueryList)
        Object.defineProperty(media.get(query), 'matches', {
          get: () => (query.includes('orientation: landscape') ? landscape : mobile)
        })
      }
      return media.get(query)
    })
  )
  Object.defineProperty(document, 'fullscreenElement', {
    configurable: true,
    get: () => fullscreen
  })
  Object.defineProperty(HTMLElement.prototype, 'requestFullscreen', {
    configurable: true,
    value: requestFullscreen
  })
  Object.defineProperty(document, 'exitFullscreen', {
    configurable: true,
    value: exitFullscreen
  })
})

afterEach(() => {
  cleanup()
  vi.unstubAllGlobals()
  Reflect.deleteProperty(document, 'fullscreenElement')
  Reflect.deleteProperty(document, 'exitFullscreen')
  Reflect.deleteProperty(HTMLElement.prototype, 'requestFullscreen')
  document.documentElement.style.overflow = ''
  document.body.style.overflow = ''
})

function renderTv() {
  return render(
    <MobileTvExperience>
      <p>Transmissão da TV</p>
    </MobileTvExperience>
  )
}

async function start() {
  await act(async () => fireEvent.click(screen.getByRole('button', { name: 'Iniciar' })))
}

describe('MobileTvExperience', () => {
  it('preserves automatic desktop playback without requesting orientation or fullscreen', () => {
    mobile = false
    const { unmount } = renderTv()
    expect(screen.getByText('Transmissão da TV')).toBeVisible()
    expect(screen.queryByRole('button', { name: 'Iniciar' })).not.toBeInTheDocument()
    unmount()
    expect(requestFullscreen).not.toHaveBeenCalled()
    expect(lock).not.toHaveBeenCalled()
    expect(unlock).not.toHaveBeenCalled()
  })

  it('waits for a tap before mounting the mobile TV and requesting browser access', () => {
    renderTv()
    expect(screen.getByRole('button', { name: 'Iniciar' })).toHaveFocus()
    expect(screen.queryByText('Transmissão da TV')).not.toBeInTheDocument()
    expect(requestFullscreen).not.toHaveBeenCalled()
    expect(lock).not.toHaveBeenCalled()
  })

  it('keeps desktop playback mounted when the viewport becomes narrow', () => {
    mobile = false
    renderTv()
    const transmission = screen.getByText('Transmissão da TV')
    act(() => {
      mobile = true
      for (const query of media.values()) query.dispatchEvent(new Event('change'))
    })
    expect(screen.getByText('Transmissão da TV')).toBe(transmission)
    expect(screen.queryByRole('button', { name: 'Iniciar' })).not.toBeInTheDocument()
  })

  it('requests fullscreen before locking landscape and releases both on entering a site', async () => {
    document.documentElement.style.overflow = 'auto'
    document.body.style.overflow = 'clip'
    lock.mockImplementation(async () => rotate())
    const { unmount } = renderTv()
    await start()
    expect(requestFullscreen).toHaveBeenCalledOnce()
    expect(lock).toHaveBeenCalledWith('landscape')
    expect(requestFullscreen.mock.invocationCallOrder[0]).toBeLessThan(
      lock.mock.invocationCallOrder[0]
    )
    expect(screen.getByText('Transmissão da TV')).toBeVisible()
    unmount()
    expect(unlock).toHaveBeenCalledOnce()
    expect(exitFullscreen).toHaveBeenCalledOnce()
    expect(document.documentElement.style.overflow).toBe('auto')
    expect(document.body.style.overflow).toBe('clip')
  })

  it('allows manual rotation when fullscreen is denied, without restarting on rotating back', async () => {
    requestFullscreen.mockRejectedValue(new Error('Denied'))
    renderTv()
    await start()
    expect(screen.getByRole('heading', { name: 'Gire o celular' })).toBeVisible()
    expect(screen.queryByText('Transmissão da TV')).not.toBeInTheDocument()
    act(rotate)
    const transmission = screen.getByText('Transmissão da TV')
    act(() => {
      landscape = false
      for (const query of media.values()) query.dispatchEvent(new Event('change'))
    })
    expect(screen.getByText('Transmissão da TV')).toBe(transmission)
  })

  it('supports continuing vertically when both APIs are unavailable', async () => {
    Reflect.deleteProperty(HTMLElement.prototype, 'requestFullscreen')
    vi.stubGlobal('screen', {})
    renderTv()
    await start()
    fireEvent.click(screen.getByRole('button', { name: 'Continuar na vertical' }))
    expect(screen.getByText('Transmissão da TV')).toBeVisible()
    expect(exitFullscreen).not.toHaveBeenCalled()
  })

  it('keeps the rotation fallback available when orientation locking is rejected', async () => {
    lock.mockRejectedValue(new Error('Not supported'))
    renderTv()
    await start()
    expect(screen.getByRole('heading', { name: 'Gire o celular' })).toBeVisible()
    fireEvent.click(screen.getByRole('button', { name: 'Continuar na vertical' }))
    expect(screen.getByText('Transmissão da TV')).toBeVisible()
    expect(unlock).toHaveBeenCalled()
    expect(exitFullscreen).toHaveBeenCalledOnce()
  })

  it('still requests immersion when the phone is already horizontal', async () => {
    landscape = true
    renderTv()
    await start()
    expect(screen.getByText('Transmissão da TV')).toBeVisible()
    expect(lock).toHaveBeenCalledWith('landscape')
  })

  it('releases a late fullscreen request after choosing vertical and leaving the TV', async () => {
    let finishFullscreen!: () => void
    requestFullscreen.mockImplementation(() => {
      const root = document.querySelector('[data-tv-immersion]')
      return new Promise<void>((resolve) => {
        finishFullscreen = () => {
          fullscreen = root
          resolve()
        }
      })
    })
    const { unmount } = renderTv()
    await start()
    fireEvent.click(screen.getByRole('button', { name: 'Continuar na vertical' }))
    unmount()
    await act(async () => finishFullscreen())
    expect(lock).not.toHaveBeenCalled()
    expect(exitFullscreen).toHaveBeenCalledOnce()
  })

  it('does not leave a late orientation lock active after the TV unmounts', async () => {
    let finishLock!: () => void
    lock.mockImplementation(() => new Promise<void>((resolve) => (finishLock = resolve)))
    const { unmount } = renderTv()
    await start()
    unmount()
    await act(async () => finishLock())
    expect(unlock).toHaveBeenCalled()
    expect(exitFullscreen).toHaveBeenCalledOnce()
  })

  it('does not close fullscreen owned by a different element', async () => {
    renderTv()
    await start()
    fullscreen = document.body
    cleanup()
    expect(exitFullscreen).not.toHaveBeenCalled()
  })
})
