import { memo } from 'react'
import { AgentSprite } from './PixelCharacters'
import styles from './styles.module.scss'

// The game loop updates transforms. Mount each sprite once per encounter.
export const SmithAgents = memo(function SmithAgents() {
  return (
    <div aria-hidden="true">
      {[0, 1, 2].map((id) => (
        <span
          key={id}
          className={styles.agent}
          data-passage-agent={id}
          data-moving="false"
          hidden
          style={{ left: 0, top: 0 }}
        >
          <AgentSprite />
        </span>
      ))}
    </div>
  )
})
