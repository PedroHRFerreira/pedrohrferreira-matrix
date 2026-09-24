import { describe, expect, it } from 'vitest'

import { createZionEncounter, stepZionEncounter, ZION_ARENA } from './zionEncounter'

describe('Zion encounter', () => {
  it('starts fresh with distant agents and no saved attempt', () => {
    const first = createZionEncounter()
    first.player.x = 9
    expect(createZionEncounter().player).toEqual({ x: 50, y: 58 })
    expect(first.agents).toHaveLength(4)
    expect(createZionEncounter().elapsed).toBe(0)
  })

  it('gives the player a grace period while agents remain still', () => {
    const state = createZionEncounter()
    const next = stepZionEncounter(state, { x: 1, y: 0 }, 0.05)
    expect(next.player.x).toBeGreaterThan(state.player.x)
    expect(next.agents).toEqual(state.agents)
    expect(next.status).toBe('playing')
    expect(state.elapsed).toBe(0)
  })

  it('caps suspended frames and normalizes diagonal movement', () => {
    const state = createZionEncounter()
    const next = stepZionEncounter(state, { x: 1, y: -1 }, 20)
    expect(next.elapsed).toBe(0.05)
    expect(Math.hypot(next.player.x - 50, next.player.y - 58)).toBeCloseTo(23 * 0.05)
    expect(stepZionEncounter(state, { x: 1, y: 0 }, Number.NaN)).toEqual(state)
  })

  it('blocks obstacles and clamps arena boundaries', () => {
    const state = createZionEncounter()
    state.player = { x: 50, y: 46 }
    expect(stepZionEncounter(state, { x: 0, y: -1 }, 0.05).player.y).toBe(46)
    state.player = { x: 2, y: 58 }
    expect(stepZionEncounter(state, { x: -1, y: 0 }, 0.05).player.x).toBe(ZION_ARENA.playerRadius)
  })

  it('captures only after grace and freezes completed attempts', () => {
    const state = createZionEncounter()
    state.agents = [{ id: 0, ...state.player }]
    expect(stepZionEncounter(state, { x: 0, y: 0 }, 0.05).status).toBe('playing')
    state.elapsed = 2
    const caught = stepZionEncounter(state, { x: 0, y: 0 }, 0.05)
    expect(caught.status).toBe('caught')
    expect(stepZionEncounter(caught, { x: 1, y: 0 }, 0.05)).toBe(caught)
  })

  it('provides a winning route around the center obstacle with all agents active', () => {
    let state = createZionEncounter()
    const advance = (x: number, y: number, frames: number) => {
      for (let frame = 0; frame < frames; frame++)
        state = stepZionEncounter(state, { x, y }, 1 / 60)
    }
    advance(1, 0, 32)
    advance(0, -1, 66)
    advance(-1, 0, 32)
    advance(0, -1, 78)
    expect(state.status).toBe('won')
    expect(state.elapsed).toBeGreaterThan(ZION_ARENA.graceSeconds)
    expect(stepZionEncounter(state, { x: 1, y: 0 }, 0.05)).toBe(state)
  })
})
