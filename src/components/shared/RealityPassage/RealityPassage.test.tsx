import { act, cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { RealityPassage } from './RealityPassage'

beforeEach(() => {
  vi.useFakeTimers()
  vi.stubGlobal(
    'ResizeObserver',
    class {
      observe() {}
      disconnect() {}
    }
  )
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
  const start = screen.getByRole('button', { name: /Iniciar minigame/ })
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

  it('starts with Enter on the focused scene even without mouse hover', () => {
    const { scene } = setup(reality)
    scene.focus()
    fireEvent.keyDown(scene, { key: 'Enter' })
    expect(scene).toHaveAttribute('data-active', 'true')
  })

  it('allows the stop button in both themes', () => {
    const { scene, start } = setup(reality)
    fireEvent.click(start)
    fireEvent.click(screen.getByRole('button', { name: 'Encerrar minigame' }))
    expect(scene).toHaveAttribute('data-active', 'false')
    expect(start).toHaveFocus()
  })

  it('animates movement and resets the pose on release, exit and restart', () => {
    const { scene, start } = setup(reality)
    const sprite = scene.querySelector('[data-facing]')!
    fireEvent.click(start)
    fireEvent.keyDown(scene, { key: 'ArrowLeft' })
    act(() => vi.advanceTimersByTime(100))
    expect(sprite).toHaveAttribute('data-moving', 'true')
    expect(sprite).toHaveAttribute('data-facing', 'left')
    // The new renderer anchors the sprite once and moves it only by transform.
    expect(sprite).toHaveStyle({ left: '36%', top: '66%' })
    fireEvent.keyUp(window, { key: 'ArrowLeft' })
    act(() => vi.advanceTimersByTime(32))
    expect(sprite).toHaveAttribute('data-moving', 'false')
    fireEvent.keyDown(scene, { key: 'ArrowRight' })
    act(() => vi.advanceTimersByTime(100))
    expect(sprite).toHaveAttribute('data-moving', 'true')
    expect(sprite).toHaveAttribute('data-facing', 'right')
    fireEvent.keyDown(scene, { key: 'Escape' })
    expect(sprite).toHaveAttribute('data-moving', 'false')
    fireEvent.click(start)
    expect(sprite).toHaveAttribute('data-moving', 'false')
    expect((sprite as HTMLElement).style.transform).toBe('')
  })

  it('faces all four directions and keeps the last direction after stopping', () => {
    const { scene, start } = setup(reality)
    const sprite = scene.querySelector('[data-facing]')!
    fireEvent.click(start)
    for (const [key, facing] of [
      ['ArrowUp', 'up'],
      ['ArrowDown', 'down'],
      ['ArrowLeft', 'left'],
      ['ArrowRight', 'right']
    ]) {
      hold(scene, key, 64)
      act(() => vi.advanceTimersByTime(32))
      expect(sprite).toHaveAttribute('data-facing', facing)
      expect(sprite).toHaveAttribute('data-moving', 'false')
    }
  })

  it('does not remeasure the scene on every movement frame', () => {
    const { scene, start } = setup(reality)
    const measure = vi.spyOn(scene, 'getBoundingClientRect')
    fireEvent.click(start)
    measure.mockClear()
    hold(scene, 'ArrowRight', 300)
    expect(measure).not.toHaveBeenCalled()
  })

  it('ends the encounter while the document is hidden', () => {
    const { scene, start } = setup(reality)
    fireEvent.click(start)
    vi.spyOn(document, 'hidden', 'get').mockReturnValue(true)
    fireEvent(document, new Event('visibilitychange'))
    expect(scene).toHaveAttribute('data-active', 'false')
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

it.each(['red'] as const)('only renders the return button on touch screens: %s', (reality) => {
  vi.stubGlobal(
    'matchMedia',
    vi.fn(() => ({ matches: false, addEventListener: vi.fn(), removeEventListener: vi.fn() }))
  )
  const reconsider = vi.fn()
  render(<RealityPassage reality={reality} onReconsider={reconsider} />)
  expect(screen.queryByRole('group')).not.toBeInTheDocument()
  fireEvent.click(screen.getByRole('button', { name: /E se você/ }))
  expect(reconsider).toHaveBeenCalledOnce()
})

it('keeps Blue exploration available on touch and releases held movement on cancellation', () => {
  vi.stubGlobal(
    'matchMedia',
    vi.fn(() => ({ matches: false, addEventListener: vi.fn(), removeEventListener: vi.fn() }))
  )
  const { scene, start } = setup('blue')
  fireEvent.click(start)
  const right = screen.getByRole('button', { name: 'Direita' })
  right.setPointerCapture = vi.fn()
  fireEvent.pointerDown(right, { pointerId: 1 })
  act(() => vi.advanceTimersByTime(400))
  fireEvent.pointerCancel(right, { pointerId: 1 })
  expect(scene).toHaveAttribute('data-active', 'true')
  fireEvent.click(screen.getByRole('button', { name: /Encerrar minigame/ }))
  expect(scene).toHaveAttribute('data-active', 'false')
})
it.each([0, 3])(
  'reports a capture exactly once at count %s, without scrolling over the TV transition',
  (captureCount) => {
    const capture = vi.fn()
    render(
      <RealityPassage
        reality="blue"
        onReconsider={vi.fn()}
        onCapture={capture}
        captureCount={captureCount}
      />
    )
    fireEvent.click(screen.getByRole('button', { name: /Iniciar minigame/ }))
    act(() => vi.advanceTimersByTime(30000))
    expect(capture).toHaveBeenCalledOnce()
    if (captureCount === 3) expect(window.scrollTo).not.toHaveBeenCalled()
    else expect(window.scrollTo).toHaveBeenCalled()
  }
)

it('animates agents only after materialization in the transform renderer', () => {
  const { scene, start } = setup('blue')
  fireEvent.click(start)
  const agent = scene.querySelector('[data-passage-agent="0"]')!
  expect(agent).toHaveAttribute('hidden')
  act(() => vi.advanceTimersByTime(900))
  expect(agent).not.toHaveAttribute('hidden')
  expect(agent).toHaveAttribute('data-moving', 'false')
  act(() => vi.advanceTimersByTime(450))
  expect(agent).toHaveAttribute('data-moving', 'true')
})
