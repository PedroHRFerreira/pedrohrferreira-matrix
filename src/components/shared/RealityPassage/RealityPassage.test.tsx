import { act, cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { RealityPassage } from './RealityPassage'

beforeEach(() => {
  vi.useFakeTimers()
  vi.stubGlobal(
    'matchMedia',
    vi.fn((query: string) => ({
      matches: query.includes('min-width'),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn()
    }))
  )
  vi.spyOn(window, 'scrollTo').mockImplementation(() => {})
})
afterEach(() => {
  cleanup()
  vi.useRealTimers()
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
})

function hold(scene: HTMLElement, key: string, ms: number) {
  fireEvent.keyDown(scene, { key })
  act(() => {
    vi.advanceTimersByTime(ms)
  })
  fireEvent.keyUp(window, { key })
}

function setup(reality: 'red' | 'blue') {
  const reconsider = vi.fn()
  render(
    <>
      <main id="main-content" tabIndex={-1} />
      <RealityPassage reality={reality} onReconsider={reconsider} />
    </>
  )
  const scene = screen.getByRole('group', {
    name: reality === 'red' ? 'Corredor interativo' : 'Caminho entre nuvens'
  })
  const start = screen.getByRole('button', { name: /Explorar/ })
  return { reconsider, scene, start }
}

describe.each(['red', 'blue'] as const)('RealityPassage %s', (reality) => {
  it('requires activation and only enters the portal when nearby', () => {
    const { scene, start, reconsider } = setup(reality)
    fireEvent.pointerEnter(scene)
    expect(scene).toHaveAttribute('data-active', 'false')
    fireEvent.click(start)
    expect(scene).toHaveFocus()
    fireEvent.keyDown(scene, { key: 'Enter' })
    expect(reconsider).not.toHaveBeenCalled()
    hold(scene, 'd', 1900)
    act(() => {
      vi.advanceTimersByTime(350)
    })
    expect(reconsider).toHaveBeenCalledOnce()
  })

  it('exits through the door and restores keyboard focus', () => {
    const { scene, start } = setup(reality)
    fireEvent.click(start)
    hold(scene, 'ArrowLeft', 900)
    act(() => {
      vi.advanceTimersByTime(350)
    })
    expect(scene).toHaveAttribute('data-active', 'false')
    if (reality === 'blue') {
      expect(screen.getByRole('main')).toHaveFocus()
      expect(window.scrollTo).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' })
      expect(screen.getByRole('button', { name: /Volte a sonhar/ })).toBeInTheDocument()
    } else expect(start).toHaveFocus()
  })

  it.each(['escape', 'scroll', 'blur'])('releases control on %s', (exit) => {
    const { scene, start } = setup(reality)
    fireEvent.click(start)
    if (exit === 'escape') fireEvent.keyDown(scene, { key: 'Escape' })
    if (exit === 'scroll') {
      vi.spyOn(window, 'scrollY', 'get').mockReturnValue(100)
      fireEvent.scroll(window)
      vi.restoreAllMocks()
    }
    if (exit === 'blur') fireEvent.blur(window)
    expect(scene).toHaveAttribute('data-active', 'false')
  })

  it('ignores pointer clicks and pointer departure while exploring', () => {
    const { scene, start, reconsider } = setup(reality)
    fireEvent.click(start)
    fireEvent.click(screen.getByRole('button', { name: /E se você/ }))
    fireEvent.click(
      screen.getByRole('button', { name: reality === 'blue' ? /Volte a sonhar/ : /SAIR/ })
    )
    fireEvent.click(start)
    fireEvent.pointerLeave(scene)
    expect(reconsider).not.toHaveBeenCalled()
    expect(scene).toHaveAttribute('data-active', 'true')
    fireEvent.keyDown(scene, { key: 'Escape' })
    expect(scene).toHaveAttribute('data-active', 'false')
  })

  it('moves while held and stops immediately after release', () => {
    const { scene, start } = setup(reality)
    fireEvent.click(start)
    hold(scene, 'd', 1550)
    expect(screen.getByRole('status')).toHaveTextContent('VOLTAR À ESCOLHA')
    act(() => {
      vi.advanceTimersByTime(100)
    })
    expect(screen.getByRole('status')).toHaveTextContent('VOLTAR À ESCOLHA')
    hold(scene, 'a', 500)
    expect(screen.getByRole('status')).toHaveTextContent(
      reality === 'blue' ? /AGENTES/ : 'ENCONTRE A PASSAGEM'
    )
    act(() => {
      vi.advanceTimersByTime(100)
    })
    expect(screen.getByRole('status')).toHaveTextContent(
      reality === 'blue' ? /AGENTES/ : 'ENCONTRE A PASSAGEM'
    )
  })

  it('allows direct portal activation without playing', () => {
    const { reconsider } = setup(reality)
    fireEvent.click(screen.getByRole('button', { name: /E se você/ }))
    expect(reconsider).toHaveBeenCalledOnce()
  })
})

it('returns to the blue top without animation when reduced motion is requested', () => {
  vi.stubGlobal(
    'matchMedia',
    vi.fn(() => ({ matches: true, addEventListener: vi.fn(), removeEventListener: vi.fn() }))
  )
  const { reconsider } = setup('blue')
  fireEvent.click(screen.getByRole('button', { name: /Volte a sonhar/ }))
  expect(window.scrollTo).toHaveBeenCalledWith({ top: 0, behavior: 'instant' })
  expect(reconsider).not.toHaveBeenCalled()
})

it.each(['red', 'blue'] as const)(
  'only renders the return button on touch screens: %s',
  (reality) => {
    vi.stubGlobal(
      'matchMedia',
      vi.fn(() => ({ matches: false, addEventListener: vi.fn(), removeEventListener: vi.fn() }))
    )
    const reconsider = vi.fn()
    render(<RealityPassage reality={reality} onReconsider={reconsider} />)
    expect(screen.queryByRole('group')).not.toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: /E se você/ }))
    expect(reconsider).toHaveBeenCalledOnce()
  }
)
