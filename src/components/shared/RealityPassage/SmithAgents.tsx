import { type Agent } from './agentEncounter'
import styles from './styles.module.scss'

export function SmithAgents({ agents }: { agents: Agent[] }) {
  return (
    <div aria-hidden="true">
      {agents.map((agent) => (
        <span
          key={agent.id}
          className={styles.agent}
          data-ready={agent.ready}
          style={{ left: `${agent.x}%`, top: `${agent.y}%` }}
        >
          <svg viewBox="0 0 16 24" shapeRendering="crispEdges">
            <path fill="#182129" d="M5 0h7v2h2v7h-2v2h2v3h2v7h-3v3H3v-3H0v-7h3v-4h2z" />
            <path fill="#bba995" d="M5 3h7v6H5z" />
            <path fill="#050c11" d="M4 4h9v2H4zM4 20h3v4H4zM10 20h3v4h-3z" />
            <path fill="#34404a" d="M3 10h10v10H3zM1 13h2v7H1zM13 13h2v7h-2z" />
            <path fill="#d5dcda" d="M6 10h4l-2 7z" />
            <path fill="#101820" d="M7 11h2v6H7z" />
            <path fill="#bba995" d="M1 20h2v2H1zM13 20h2v2h-2z" />
          </svg>
        </span>
      ))}
    </div>
  )
}
