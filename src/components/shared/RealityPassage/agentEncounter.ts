export interface Point {
  x: number
  y: number
}
export interface Agent extends Point {
  id: number
  ready: boolean
}

export function pursueAgents(
  previous: Agent[],
  player: Point,
  seconds: number,
  elapsed: number,
  aspect = 3
): { agents: Agent[]; caught: boolean } {
  const agents = [...previous]
  for (let id = 0; id < 3; id++) {
    if (seconds >= 0.8 + id * 0.85 && !agents.some((agent) => agent.id === id)) {
      agents.push({ id, x: Math.max(2, player.x - 14 - id * 3), y: player.y, ready: false })
    }
  }
  let caught = false
  return {
    agents: agents.map((agent) => {
      const ready = seconds >= 1.25 + agent.id * 0.85
      if (!ready) return { ...agent, ready }
      const dx = player.x - agent.x
      const dy = (player.y - agent.y) / aspect
      const distance = Math.hypot(dx, dy)
      const travel = Math.min(distance, 12 * elapsed)
      const next = {
        ...agent,
        ready,
        x: agent.x + (distance ? (dx / distance) * travel : 0),
        y: agent.y + (distance ? (dy / distance) * travel * aspect : 0)
      }
      if (
        Math.hypot(player.x - next.x, (player.y - next.y) / aspect) < 2 &&
        player.x > 23 &&
        player.x < 75
      )
        caught = true
      return next
    }),
    caught
  }
}
