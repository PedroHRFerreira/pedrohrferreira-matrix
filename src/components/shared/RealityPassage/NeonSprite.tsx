import styles from './styles.module.scss'

// Integer coordinates and stepped poses keep every limb on the sprite's pixel grid.
export function NeonSprite() {
  return (
    <svg viewBox="0 0 20 32" shapeRendering="crispEdges">
      <g data-pose="front">
        <path className={styles.leftLeg} fill="#080e14" d="M6 23h3v7h1v2H5v-3h1z" />
        <path className={styles.rightLeg} fill="#26343e" d="M11 23h3v6h2v3h-5z" />
        <g className={styles.spriteBody}>
          <g className={styles.cape}>
            <path fill="#060c12" d="M5 10h10v7h1v4h1v4h2v3h-7v-2H8v3H1v-4h2v-5h1v-5h1z" />
            <path fill="#22313c" d="M5 14h2v7H6v4H4v2H2v-2h2v-5h1zM13 14h2v7h1v4h2v2h-4v-5h-1z" />
            <path fill="#40505b" d="M4 24h1v3H3v1H2v-2h2zM15 24h1v2h2v1h-3z" />
          </g>
          <path fill="#111d27" d="M6 10h8v13H6z" />
          <path fill="#354651" d="M6 11h2v10H6zM12 11h2v3h-2z" />
          <path fill="#050a10" d="M9 11h2v13H9zM6 22h8v2H6z" />
          <g className={styles.leftArm}>
            <path fill="#0a121b" d="M4 12h2v9H3v-6h1z" />
            <path fill="#b5a994" d="M3 21h3v3H3z" />
          </g>
          <g className={styles.rightArm}>
            <path fill="#293944" d="M14 12h2v3h1v6h-3z" />
            <path fill="#c8baa2" d="M14 21h3v3h-3z" />
          </g>
          <path fill="#050a0f" d="M6 0h7v1h2v2h1v5h-2v3H7V9H5V2h1z" />
          <path fill="#c8baa2" d="M7 3h7v6H7zM9 9h3v2H9z" />
          <path fill="#928b7e" d="M7 7h2v2H7zM12 8h2v1h-2z" />
          <path fill="#060b12" d="M6 4h9v2h-1v1h-3V6h-1v1H7V6H6z" />
          <path fill="#8aabb7" d="M7 4h2v1H7zM12 4h2v1h-2z" />
        </g>
      </g>
      <g data-pose="side">
        <path className={styles.leftLeg} fill="#080e14" d="M7 23h3v7h3v2H6v-3h1z" />
        <path className={styles.rightLeg} fill="#26343e" d="M10 23h3v6h3v3h-6z" />
        <g className={styles.spriteBody}>
          <g className={styles.cape}>
            <path fill="#060c12" d="M7 10h5v7h-1v10H8v2H2v-3h2v-5h1v-5h2z" />
            <path fill="#354651" d="M7 14h1v8H6v4H4v2H2v-2h2v-5h2v-5h1z" />
          </g>
          <path fill="#111d27" d="M8 10h5v3h1v10H8z" />
          <path fill="#354651" d="M12 12h2v9h-2z" />
          <g className={styles.rightArm}>
            <path fill="#293944" d="M9 12h3v9H9z" />
            <path fill="#c8baa2" d="M9 21h3v3H9z" />
          </g>
          <path fill="#050a0f" d="M7 0h7v2h2v6h-2v3H8V9H6V2h1z" />
          <path fill="#c8baa2" d="M11 3h4v3h2v2h-2v2h-4z" />
          <path fill="#060b12" d="M10 4h6v2h-4v1h-2z" />
          <path fill="#8aabb7" d="M13 4h2v1h-2z" />
        </g>
      </g>
      <g data-pose="back">
        <path className={styles.leftLeg} fill="#080e14" d="M6 23h3v9H5v-3h1z" />
        <path className={styles.rightLeg} fill="#26343e" d="M11 23h3v6h1v3h-4z" />
        <g className={styles.spriteBody}>
          <g className={styles.leftArm}>
            <path fill="#0a121b" d="M4 12h3v9H3v-6h1z" />
            <path fill="#b5a994" d="M3 21h3v3H3z" />
          </g>
          <g className={styles.rightArm}>
            <path fill="#293944" d="M13 12h3v3h1v6h-4z" />
            <path fill="#c8baa2" d="M14 21h3v3h-3z" />
          </g>
          <g className={styles.cape}>
            <path fill="#101b25" d="M6 10h8v5h1v6h1v4h2v3h-6v-1H8v2H2v-4h2v-5h1v-5h1z" />
            <path fill="#354651" d="M6 11h8v2H6zM5 17h1v7H5zM14 19h1v6h-1zM3 26h3v2H3z" />
            <path fill="#060c12" d="M9 14h2v13H9zM6 24h2v3H6z" />
          </g>
          <path fill="#050a0f" d="M6 0h7v1h2v2h1v5h-2v3H7V9H5V2h1z" />
          <path fill="#24333d" d="M7 1h6v1H7zM6 3h2v4H6z" />
          <path fill="#928b7e" d="M8 9h5v1H8z" />
        </g>
      </g>
    </svg>
  )
}
