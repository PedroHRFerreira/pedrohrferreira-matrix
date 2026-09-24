export interface Point {
  x: number
  y: number
}

export interface Rect extends Point {
  width: number
  height: number
}

export interface ZionAgent extends Point {
  id: number
}

export interface ZionEncounter {
  player: Point
  agents: ZionAgent[]
  elapsed: number
  status: 'playing' | 'caught' | 'won'
}

// A fixed logical arena keeps touch and keyboard movement identical at every viewport.
export const ZION_ARENA = {
  width: 100,
  height: 64,
  playerRadius: 1.8,
  graceSeconds: 1.2,
  exit: { x: 45, y: 0, width: 10, height: 7 },
  obstacles: [
    { x: 20, y: 23, width: 18, height: 5 },
    { x: 62, y: 23, width: 18, height: 5 },
    { x: 42, y: 39, width: 16, height: 5 }
  ] as readonly Rect[]
} as const

export function createZionEncounter(): ZionEncounter {
  return {
    player: { x: 50, y: 58 },
    agents: [
      { id: 0, x: 9, y: 15 },
      { id: 1, x: 91, y: 15 },
      { id: 2, x: 12, y: 49 },
      { id: 3, x: 88, y: 49 }
    ],
    elapsed: 0,
    status: 'playing'
  }
}

function blocked(point: Point): boolean {
  const radius = ZION_ARENA.playerRadius
  return ZION_ARENA.obstacles.some(
    (rect) =>
      point.x > rect.x - radius &&
      point.x < rect.x + rect.width + radius &&
      point.y > rect.y - radius &&
      point.y < rect.y + rect.height + radius
  )
}

function move(point: Point, vector: Point, distance: number): Point {
  const magnitude = Math.hypot(vector.x, vector.y)
  if (!Number.isFinite(magnitude) || magnitude === 0) return { ...point }
  const scale = distance / Math.max(1, magnitude)
  const radius = ZION_ARENA.playerRadius
  const next = { ...point }
  const x = Math.max(radius, Math.min(ZION_ARENA.width - radius, point.x + vector.x * scale))
  if (!blocked({ x, y: next.y })) next.x = x
  const y = Math.max(radius, Math.min(ZION_ARENA.height - radius, point.y + vector.y * scale))
  if (!blocked({ x: next.x, y })) next.y = y
  return next
}

export function stepZionEncounter(
  state: ZionEncounter,
  input: Point,
  dtSeconds: number
): ZionEncounter {
  if (state.status !== 'playing') return state
  // Returning from a suspended tab must never teleport a character into a capture.
  const dt = Number.isFinite(dtSeconds) ? Math.max(0, Math.min(0.05, dtSeconds)) : 0
  const elapsed = state.elapsed + dt
  const player = move(state.player, input, 23 * dt)
  const activeDt = Math.max(0, elapsed - Math.max(state.elapsed, ZION_ARENA.graceSeconds))
  const agents = state.agents.map((agent) => ({
    ...agent,
    ...move(agent, { x: player.x - agent.x, y: player.y - agent.y }, 11 * activeDt)
  }))
  const exit = ZION_ARENA.exit
  const won =
    player.x >= exit.x && player.x <= exit.x + exit.width && player.y <= exit.y + exit.height
  const caught =
    activeDt > 0 && agents.some((agent) => Math.hypot(player.x - agent.x, player.y - agent.y) < 3.6)
  return { player, agents, elapsed, status: won ? 'won' : caught ? 'caught' : 'playing' }
}
