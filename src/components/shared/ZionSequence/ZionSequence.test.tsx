import { act, cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { ZionSequence } from './ZionSequence'

let responsive = false
const mediaListeners = new Set<() => void>()
beforeEach(() => {
  responsive = false
  mediaListeners.clear()
  vi.stubGlobal(
    'matchMedia',
    vi.fn((query: string) => ({
      matches: query.includes('48rem') && responsive,
      addEventListener: (_: string, listener: () => void) => {
        if (query.includes('48rem')) mediaListeners.add(listener)
      },
      removeEventListener: (_: string, listener: () => void) => mediaListeners.delete(listener)
    }))
  )
})
afterEach(() => {
  cleanup()
  vi.useRealTimers()
  vi.unstubAllGlobals()
})
const props = () => ({ onAdvance: vi.fn(), onEscape: vi.fn(), onLoaded: vi.fn() })
const finishTyping = () => act(() => vi.advanceTimersByTime(20000))

describe('ZionSequence', () => {
  it('starts moving immediately on entering the chase and keeps held input', () => {
    vi.useFakeTimers()
    render(<ZionSequence state="zion-chase" {...props()} />)
    expect(screen.getByRole('button', { name: 'Pausar' })).toBeVisible()
    expect(screen.queryByRole('button', { name: 'Iniciar fuga' })).not.toBeInTheDocument()
    fireEvent.keyDown(window, { key: 'ArrowRight' })
    act(() => vi.advanceTimersByTime(300))
    const before = Number(screen.getByTestId('zion-neon').getAttribute('data-x'))
    act(() => vi.advanceTimersByTime(300))
    expect(Number(screen.getByTestId('zion-neon').getAttribute('data-x'))).toBeGreaterThan(
      before + 3
    )
    fireEvent.keyUp(window, { key: 'ArrowRight' })
  })

  it('types messages before allowing a fresh Enter and never skips two phases', () => {
    vi.useFakeTimers()
    const callbacks = props()
    const { rerender } = render(<ZionSequence state="blue-revelation-one" {...callbacks} />)
    act(() => vi.advanceTimersByTime(1000))
    const heading = screen.getByRole('heading')
    expect(heading.textContent).toMatch(/^A real/)
    expect(heading.textContent).not.toContain('algumas pessoas.')
    fireEvent.keyDown(window, { key: 'Enter' })
    expect(callbacks.onAdvance).not.toHaveBeenCalled()
    finishTyping()
    expect(heading).toHaveTextContent(
      'A realidade pode ser uma coisa assustadora para algumas pessoas.'
    )
    fireEvent.keyDown(window, { key: 'Enter' })
    fireEvent.keyDown(window, { key: 'Enter' })
    expect(callbacks.onAdvance).toHaveBeenCalledTimes(1)
    rerender(<ZionSequence state="blue-revelation-two" {...callbacks} />)
    finishTyping()
    fireEvent.keyDown(window, { key: 'Enter', repeat: true })
    expect(callbacks.onAdvance).toHaveBeenCalledTimes(1)
    fireEvent.keyDown(window, { key: 'Enter' })
    expect(callbacks.onAdvance).toHaveBeenCalledTimes(2)
  })

  it('pauses on focus loss and resumes with Enter', () => {
    render(<ZionSequence state="zion-chase" {...props()} />)
    fireEvent.blur(window)
    expect(screen.getByText('Fuga pausada. Pressione Enter para retomar.')).toBeVisible()
    fireEvent.keyDown(window, { key: 'Enter' })
    expect(screen.getByRole('button', { name: 'Pausar' })).toBeVisible()
  })

  it('keeps messages on responsive screens and bypasses only the game on deliberate click', () => {
    vi.useFakeTimers()
    responsive = true
    const events: string[] = []
    render(
      <ZionSequence
        state="blue-revelation-two"
        onAdvance={() => events.push('advance')}
        onEscape={() => events.push('escape')}
        onLoaded={vi.fn()}
      />
    )
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
    finishTyping()
    expect(screen.getByRole('heading')).toHaveTextContent(
      'Isso não é real, e o mundo real fica em algum outro lugar.'
    )
    expect(screen.queryByTestId('zion-arena')).not.toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: /IR PARA O MUNDO REAL/ }))
    expect(events).toEqual(['advance', 'escape'])
  })

  it('removes the arena when resized to responsive, then resumes only deliberately', () => {
    vi.useFakeTimers()
    render(<ZionSequence state="zion-chase" {...props()} />)
    fireEvent.keyDown(window, { key: 'ArrowRight' })
    act(() => vi.advanceTimersByTime(300))
    const before = screen.getByTestId('zion-neon').getAttribute('data-x')
    act(() => {
      responsive = true
      ;[...mediaListeners].forEach((listener) => listener())
    })
    expect(screen.queryByTestId('zion-arena')).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: /IR PARA O MUNDO REAL/ })).toBeVisible()
    act(() => vi.advanceTimersByTime(1000))
    act(() => {
      responsive = false
      ;[...mediaListeners].forEach((listener) => listener())
    })
    expect(screen.getByTestId('zion-neon')).toHaveAttribute('data-x', before)
    expect(screen.getByRole('button', { name: 'Retomar' })).toBeVisible()
  })

  it('restarts a captured game with Enter', () => {
    vi.useFakeTimers()
    render(<ZionSequence state="zion-chase" {...props()} />)
    act(() => vi.advanceTimersByTime(12000))
    expect(screen.getByRole('button', { name: 'Tentar novamente' })).toBeVisible()
    fireEvent.keyDown(window, { key: 'Enter' })
    expect(screen.queryByRole('button', { name: 'Tentar novamente' })).not.toBeInTheDocument()
    expect(screen.getByTestId('zion-neon')).toHaveAttribute('data-x', '50')
    expect(screen.getByRole('button', { name: 'Pausar' })).toBeVisible()
  })

  it('finishes typing and allows reading time even if the image is cached', () => {
    vi.useFakeTimers()
    class LoadedImage {
      onload: (() => void) | null = null
      onerror: (() => void) | null = null
      set src(_: string) {
        this.onload?.()
      }
    }
    vi.stubGlobal('Image', LoadedImage)
    const callbacks = props()
    render(<ZionSequence state="zion-loading" {...callbacks} />)
    finishTyping()
    expect(screen.getByRole('heading')).toHaveTextContent('que manchamos os céus.')
    expect(callbacks.onLoaded).not.toHaveBeenCalled()
    act(() => vi.advanceTimersByTime(5999))
    expect(callbacks.onLoaded).not.toHaveBeenCalled()
    act(() => vi.advanceTimersByTime(1))
    expect(callbacks.onLoaded).toHaveBeenCalledTimes(1)
  })

  it('allows continuing after reading when the artwork fails', () => {
    vi.useFakeTimers()
    class FailedImage {
      onload: (() => void) | null = null
      onerror: (() => void) | null = null
      set src(_: string) {
        this.onerror?.()
      }
    }
    vi.stubGlobal('Image', FailedImage)
    const callbacks = props()
    render(<ZionSequence state="zion-loading" {...callbacks} />)
    finishTyping()
    const fallback = screen.getByRole('button', { name: 'Continuar mesmo assim' })
    expect(fallback).toBeDisabled()
    act(() => vi.advanceTimersByTime(6000))
    fireEvent.click(fallback)
    expect(callbacks.onLoaded).toHaveBeenCalledTimes(1)
  })
})
