import styles from './styles.module.scss'

export function BluePassageArtwork({ openDoor }: { openDoor: 'exit' | 'dream' | null }) {
  return (
    <svg
      className={styles.artwork}
      viewBox="0 0 320 112"
      preserveAspectRatio="none"
      shapeRendering="crispEdges"
      aria-hidden="true"
    >
      <path fill="#b2cadf" d="M0 0h320v112H0z" />
      <path fill="#c5d8e7" d="M0 38h320v74H0z" />
      <path fill="#dddfea" d="M0 63h320v49H0z" />
      <path
        fill="#dce8ef"
        d="M0 29h10v-5h12v-7h23v4h16v8h16v8H0zM174 21h14v-6h21v-4h18v5h19v8h15v7h-87z"
      />
      <path
        fill="#eff2f6"
        d="M0 33h17v-5h17v-6h16v7h20v7h18v7H0zM183 24h21v-6h21v5h16v8h20v5h-78z"
      />
      <path
        fill="#c4c8df"
        d="M110 42h14v-6h19v-5h23v8h18v6h15v8h-89zM279 47h12v-8h18v-5h11v24h-41z"
      />
      <path fill="#dbe0ee" d="M112 45h21v-6h29v5h24v8h18v5h-92zM277 50h19v-6h24v19h-43z" />
      <path fill="#999eb9" d="M20 69h280v24h-10v8H33v-7H20z" />
      <path fill="#b4b5cc" d="M20 69h280v15H20zM33 94h257v4H33z" />
      <path fill="#f0eaf1" d="M20 65h280v5H20z" />
      <path fill="#d5cedd" d="M20 70h280v14H20z" />
      {[45, 82, 119, 156, 193, 230, 267].map((x) => (
        <path key={x} stroke="#b7b3c7" d={`M${x} 70v14`} />
      ))}
      <path
        fill="#edf0f5"
        d="M0 88h19v-5h28v6h17v7h20v16H0zM222 102h15v-8h21v-6h30v6h17v-8h15v26h-98z"
      />
      <path fill="#f7f4f7" d="M0 99h27v-7h22v7h18v7h19v6H0zM235 109h19v-8h24v-4h16v7h26v8h-85z" />
      <path fill="#8a91ad" d="M31 30h23v38H31z" />
      <path fill="#ede9f4" d="M33 32h19v34H33z" />
      <path fill="#91a8c1" d="M35 34h15v32H35z" />
      <g
        className={styles.doorLeaf}
        data-open={openDoor === 'exit'}
        style={{ transformOrigin: '35px 50px' }}
      >
        <path fill="#bac3d8" d="M35 34h15v32H35z" />
        <path fill="#dfe5ef" d="M37 36h11v27H37z" />
        <path fill="#73849b" d="M44 48h2v2h-2z" />
      </g>
      <path fill="#b1a9c6" d="M242 66h41v4h-41z" />
      <path fill="#303f46" d="M246 26h33v40h-33z" />
      <path fill="#15292c" d="M249 29h27v35h-27z" />
      <path fill="#73ab92" d="M251 31h23v31h-23z" />
      <path fill="#0c1c1c" d="M253 33h19v27h-19z" />
      <path
        fill="#72b69a"
        d="M255 35h6v2h-6zM263 39h7v1h-7zM255 43h12v1h-12zM259 48h11v2h-11zM255 55h9v1h-9z"
      />
      <g
        className={styles.doorLeaf}
        data-open={openDoor === 'dream'}
        style={{ transformOrigin: '251px 46px' }}
      >
        <path fill="#354951" d="M251 31h23v31h-23z" />
        <path fill="#15292e" d="M254 34h17v23h-17z" />
        <path fill="#7bab9d" d="M256 38h13v1h-13zM256 42h8v2h-8zM261 47h8v1h-8zM256 52h13v1h-13z" />
        <path fill="#abbec4" d="M265 59h4v1h-4z" />
      </g>
      <path fill="#6e7b88" d="M253 22h2v4h-2zM252 21h1v2h-1zM267 23h2v3h-2zM269 21h2v2h-2z" />
      <path fill="#a5a1be" d="M250 70h25l7 8h-39z" />
    </svg>
  )
}
