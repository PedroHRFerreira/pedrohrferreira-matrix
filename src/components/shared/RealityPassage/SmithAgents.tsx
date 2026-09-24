import { memo } from 'react'
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
          <svg viewBox="0 0 16 24" shapeRendering="crispEdges">
            <path className={styles.leftLeg} fill="#0a1119" d="M4 18h3v4h1v2H3v-2h1z" />
            <path className={styles.rightLeg} fill="#202e3a" d="M9 18h3v4h2v2H9z" />
            <g className={styles.spriteBody}>
              <path fill="#182129" d="M5 0h7v2h2v7h-2v2h1v9H3V10h2z" />
              <path fill="#bba995" d="M5 3h7v6H5z" />
              <path fill="#050c11" d="M4 4h9v2H4z" />
              <path fill="#42515e" d="M3 10h10v10H3z" />
              <path fill="#d5dcda" d="M6 10h4v3H9v3H7v-3H6z" />
              <path fill="#101820" d="M7 11h2v6H7zM3 19h10v2H3z" />
              <g className={styles.leftArm}>
                <path fill="#283641" d="M1 12h2v7H0v-4h1z" />
                <path fill="#bba995" d="M0 19h3v2H0z" />
              </g>
              <g className={styles.rightArm}>
                <path fill="#34404a" d="M13 12h2v3h1v4h-3z" />
                <path fill="#bba995" d="M13 19h3v2h-3z" />
              </g>
            </g>
          </svg>
        </span>
      ))}
    </div>
  )
})
