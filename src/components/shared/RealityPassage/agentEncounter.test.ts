import { describe, expect, it } from 'vitest'
import { pursueAgents, type Agent } from './agentEncounter'

describe('agent pursuit', () => {
  it('catches a stationary player and caps copies at three', () => {
    let agents: Agent[] = []
    let caught = false
    for (let frame = 0; frame < 300; frame++) {
      const result = pursueAgents(agents, { x: 36, y: 66 }, frame / 60, 1 / 60)
      agents = result.agents
      caught ||= result.caught
    }
    expect(caught).toBe(true)
    expect(agents).toHaveLength(3)
  })
  it('lets a moving player outrun the agents', () => {
    let agents: Agent[] = []
    for (let frame = 0; frame < 120; frame++) {
      const result = pursueAgents(
        agents,
        { x: Math.min(86, 36 + (frame / 60) * 25), y: 66 },
        frame / 60,
        1 / 60
      )
      agents = result.agents
      expect(result.caught).toBe(false)
    }
  })
  it('changes direction toward the player without teleporting', () => {
    const result = pursueAgents([{ id: 0, x: 50, y: 60, ready: true }], { x: 36, y: 80 }, 2, 1 / 60)
    expect(result.agents[0].x).toBeLessThan(50)
    expect(result.agents[0].x).toBeGreaterThan(49)
    expect(result.agents[0].y).toBeGreaterThan(60)
  })
})
