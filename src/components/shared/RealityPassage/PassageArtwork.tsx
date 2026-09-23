import styles from './styles.module.scss'

// A fixed pixel grid keeps the architecture, light and sprites in one visual language.
export function PassageArtwork({ openDoor }: { openDoor: 'exit' | 'dream' | null }) {
  return (
    <svg
      className={styles.artwork}
      viewBox="0 0 320 112"
      preserveAspectRatio="none"
      shapeRendering="crispEdges"
      aria-hidden="true"
    >
      <path fill="#060d0b" d="M0 0h320v112H0z" />
      <path fill="#0c1915" d="M0 0h320v12H0zM0 12h20v64H0zM300 12h20v64h-20z" />
      <path fill="#182c23" d="M20 16h280v2H20zM20 18h3v48h-3zM297 18h3v48h-3z" />
      <path fill="#10221b" d="M24 22h272v42H24z" />
      <path
        fill="#07110d"
        d="M29 25h44v38H29zM80 25h49v38H80zM136 25h49v38h-49zM192 25h39v38h-39zM239 25h52v38h-52z"
      />
      <path fill="#263d2d" d="M24 20h272v2H24zM24 64h272v3H24z" />
      <path fill="#0d1b15" d="M0 68h320v44H0z" />
      {[70, 80, 94, 110].map((y) => (
        <path key={y} stroke="#203328" strokeWidth="1" d={`M0 ${y}h320`} />
      ))}
      {[0, 40, 80, 120, 160, 200, 240, 280, 320].map((x) => (
        <path key={x} stroke="#1a2a22" d={`M${160 + (x - 160) * 0.7} 68L${x} 112`} />
      ))}
      <path fill="#1b3325" d="M85 29h38v22H85zM141 29h38v22h-38z" />
      <path fill="#06110b" d="M87 31h34v18H87zM143 31h34v18h-34z" />
      <path
        fill="#508563"
        d="M90 34h12v1H90zM90 37h22v1H90zM90 40h7v1H90zM146 34h20v1h-20zM146 37h12v1h-12z"
      />
      <path fill="#294831" d="M90 43h26v1H90zM146 40h25v1h-25zM146 43h17v1h-17z" />
      <path fill="#314b36" d="M97 52h14v2H97zM153 52h14v2h-14z" />
      <path fill="#233b2c" d="M31 30h23v38H31z" />
      <path fill="#527057" d="M33 32h19v34H33z" />
      <path fill="#0a130e" d="M35 34h15v32H35z" />
      <path fill="#b8d1a7" d="M36 26h14v2H36z" />
      <g
        className={styles.doorLeaf}
        data-open={openDoor === 'exit'}
        style={{ transformOrigin: '35px 50px' }}
      >
        <path fill="#1f3526" d="M35 34h15v32H35z" />
        <path fill="#b8d1a7" d="M44 48h2v2h-2z" />
      </g>
      <path fill="#262737" d="M247 26h30v43h-30zM243 67h38v4h-38z" />
      <path fill="#62607c" d="M249 24h26v43h-26z" />
      <path fill="#c2b8da" d="M252 26h20v40h-20z" />
      <path fill="#748daf" d="M254 28h16v36h-16z" />
      <path fill="#a5b8d0" d="M254 39h16v25h-16z" />
      <path fill="#d6cfdf" d="M254 48h5v-3h6v-3h5v22h-16z" />
      <path fill="#ede2e8" d="M254 56h8v-4h8v12h-16z" />
      <g
        className={styles.doorLeaf}
        data-open={openDoor === 'dream'}
        style={{ transformOrigin: '254px 46px' }}
      >
        <path fill="#42465e" d="M254 28h16v36h-16z" />
        <path fill="#72768e" d="M256 30h12v32h-12z" />
        <path fill="#454c68" d="M258 32h8v13h-8zM258 48h8v12h-8z" />
        <path fill="#e4d7f2" d="M266 46h2v2h-2z" />
      </g>
      <path fill="#292f38" d="M251 71h22l8 9h-38z" />
      <path fill="#363a45" d="M254 72h16l3 5h-22z" />
      <path fill="#35513b" d="M5 21h3v42H5zM312 21h3v42h-3z" />
      <path fill="#6d9776" d="M5 23h2v16H5zM312 23h2v16h-2z" />
      <path fill="#223b2c" d="M196 47h27v16h-27z" />
      <path fill="#0b150f" d="M198 49h23v12h-23z" />
      <path fill="#46634a" d="M201 52h2v2h-2zM206 52h2v2h-2zM201 57h17v1h-17z" />
    </svg>
  )
}
