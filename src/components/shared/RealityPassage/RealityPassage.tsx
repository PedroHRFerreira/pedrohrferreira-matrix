'use client'

import { useEffect, useId, useRef, useState, type KeyboardEvent } from 'react'
import styles from './styles.module.scss'
import { PassageArtwork } from './PassageArtwork'
import { BluePassageArtwork } from './BluePassageArtwork'
import { SmithAgents } from './SmithAgents'
import { pursueAgents, type Agent } from './agentEncounter'

function returnToDream() {
  const main = document.getElementById('main-content')
  if (main) {
    if (!main.hasAttribute('tabindex')) {
      main.setAttribute('tabindex', '-1')
      main.addEventListener('blur', () => main.removeAttribute('tabindex'), { once: true })
    }
    main.focus({ preventScroll: true })
  }
  window.scrollTo({
    top: 0,
    behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth'
  })
}

const origin = { x: 36, y: 66 }
const directions: Record<string, [number, number]> = {
  ArrowLeft: [-1, 0],
  a: [-1, 0],
  ArrowRight: [1, 0],
  d: [1, 0],
  ArrowUp: [0, -1],
  w: [0, -1],
  ArrowDown: [0, 1],
  s: [0, 1]
}

export function RealityPassage({
  onReconsider,
  reality = 'red'
}: {
  onReconsider: () => void
  reality?: 'red' | 'blue'
}) {
  const [desktop, setDesktop] = useState(false)
  useEffect(() => {
    const media = window.matchMedia('(min-width: 769px) and (hover: hover) and (pointer: fine)')
    const update = () => setDesktop(media.matches)
    update()
    media.addEventListener('change', update)
    return () => media.removeEventListener('change', update)
  }, [])
  if (!desktop)
    return (
      <div className={`${styles.mobileReturn} ${reality === 'blue' ? styles.mobileBlue : ''}`}>
        <button type="button" onClick={onReconsider}>
          {reality === 'blue'
            ? 'E se você tivesse escolhido diferente?'
            : 'E se você pudesse voltar a sonhar?'}
          <small>Voltar à escolha das pílulas ↗</small>
        </button>
      </div>
    )
  return <PassageGame reality={reality} onReconsider={onReconsider} />
}

function PassageGame({
  onReconsider,
  reality = 'red'
}: {
  onReconsider: () => void
  reality?: 'red' | 'blue'
}) {
  const blue = reality === 'blue'
  const instructionsId = useId()
  const Artwork = blue ? BluePassageArtwork : PassageArtwork
  const [active, setActive] = useState(false)
  const [position, setPosition] = useState(origin)
  const player = useRef(origin)
  const encounter = useRef(0)
  const agents = useRef<Agent[]>([])
  const [encounterView, setEncounterView] = useState<Agent[]>([])
  const scene = useRef<HTMLDivElement>(null)
  const start = useRef<HTMLButtonElement>(null)
  const hovered = useRef(false)
  const entryScroll = useRef(0)
  const pressed = useRef(new Set<string>())
  const destination =
    position.y <= 72 ? (position.x <= 23 ? 'exit' : position.x >= 72 ? 'dream' : null) : null
  const crossing =
    position.y <= 68 ? (position.x <= 15 ? 'exit' : position.x >= 80 ? 'dream' : null) : null

  function enter() {
    pressed.current.clear()
    entryScroll.current = window.scrollY
    player.current = origin
    encounter.current = 0
    agents.current = []
    setEncounterView([])
    setPosition(origin)
    setActive(true)
    scene.current?.focus({ preventScroll: true })
  }

  function leave(restoreFocus = false) {
    pressed.current.clear()
    setActive(false)
    if (restoreFocus) start.current?.focus({ preventScroll: true })
  }

  useEffect(() => {
    const invite = (event: globalThis.KeyboardEvent) => {
      if (event.key !== 'Enter' || event.repeat || !hovered.current || active) return
      // Hover never overrides a focused link, form, or another keyboard control.
      if (document.activeElement !== document.body && document.activeElement !== scene.current)
        return
      event.preventDefault()
      enter()
    }
    window.addEventListener('keydown', invite)
    return () => window.removeEventListener('keydown', invite)
  }, [active])

  useEffect(() => {
    if (!active) return
    const stop = () => setActive(false)
    const onScroll = () => {
      if (Math.abs(window.scrollY - entryScroll.current) > 2) stop()
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('blur', stop)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('blur', stop)
    }
  }, [active])

  useEffect(() => {
    if (!active) return
    const keys = pressed.current
    let frame = 0
    let previousTime = performance.now()
    const tick = (time: number) => {
      const elapsed = Math.min((time - previousTime) / 1000, 0.04)
      previousTime = time
      let x = 0
      let y = 0
      for (const key of keys) {
        x += directions[key]?.[0] ?? 0
        y += directions[key]?.[1] ?? 0
      }
      x = Math.sign(x)
      y = Math.sign(y)
      const magnitude = Math.hypot(x, y)
      if (blue && !document.hidden) encounter.current += elapsed
      if (magnitude && scene.current) {
        const { width, height } = scene.current.getBoundingClientRect()
        // Equal on-screen speed on both axes, independent of keyboard repeat and refresh rate.
        const distance = 25 * elapsed
        const previous = player.current
        const next = {
          x: Math.max(12, Math.min(86, previous.x + (x / magnitude) * distance)),
          y: Math.max(
            57,
            Math.min(84, previous.y + (y / magnitude) * distance * (width / (height || 1)))
          )
        }
        player.current = next
        setPosition(next)
      }
      if (blue && scene.current) {
        const { width, height } = scene.current.getBoundingClientRect()
        const result = pursueAgents(
          agents.current,
          player.current,
          encounter.current,
          elapsed,
          width && height ? width / height : 3
        )
        agents.current = result.agents
        setEncounterView(result.agents)
        if (result.caught) {
          keys.clear()
          setActive(false)
          returnToDream()
          return
        }
      }
      frame = requestAnimationFrame(tick)
    }
    const release = (event: globalThis.KeyboardEvent) => {
      keys.delete(event.key.length === 1 ? event.key.toLowerCase() : event.key)
    }
    const clear = () => keys.clear()
    frame = requestAnimationFrame(tick)
    window.addEventListener('keyup', release)
    window.addEventListener('blur', clear)
    document.addEventListener('visibilitychange', clear)
    return () => {
      cancelAnimationFrame(frame)
      keys.clear()
      window.removeEventListener('keyup', release)
      window.removeEventListener('blur', clear)
      document.removeEventListener('visibilitychange', clear)
    }
  }, [active, blue])

  useEffect(() => {
    if (!active || !crossing) return
    // Let the opening finish before leaving the scene. Cleanup cancels a retreat.
    const passage = window.setTimeout(() => {
      pressed.current.clear()
      setActive(false)
      if (crossing === 'dream') onReconsider()
      else if (blue) returnToDream()
      else start.current?.focus({ preventScroll: true })
    }, 320)
    return () => window.clearTimeout(passage)
  }, [active, crossing, onReconsider, blue])

  function handleKey(event: KeyboardEvent<HTMLDivElement>) {
    if (
      !active ||
      event.target !== event.currentTarget ||
      event.altKey ||
      event.ctrlKey ||
      event.metaKey
    )
      return
    if (event.key === 'Escape') {
      event.preventDefault()
      leave(true)
    } else if (event.key === 'Enter') {
      event.preventDefault()
    } else {
      const direction = directions[event.key.length === 1 ? event.key.toLowerCase() : event.key]
      if (!direction) return
      event.preventDefault()
      pressed.current.add(event.key.length === 1 ? event.key.toLowerCase() : event.key)
    }
  }

  return (
    <section
      className={`${styles.passage} ${blue ? styles.blue : ''}`}
      aria-label={blue ? 'Passagem além do sonho' : 'Passagem para o sonho'}
      data-keyboard-only={active}
      onPointerDownCapture={(event) => {
        if (!active) return
        event.preventDefault()
        event.stopPropagation()
        scene.current?.focus({ preventScroll: true })
      }}
      onClickCapture={(event) => {
        if (!active) return
        event.preventDefault()
        event.stopPropagation()
      }}
    >
      <div className={styles.heading}>
        <span>{blue ? 'DREAM://LIMIAR' : 'SYS://LIMIAR'}</span>
        <span>UMA OUTRA POSSIBILIDADE</span>
      </div>
      <div
        ref={scene}
        className={styles.scene}
        data-active={active}
        tabIndex={0}
        role="group"
        aria-label={blue ? 'Caminho entre nuvens' : 'Corredor interativo'}
        aria-describedby={instructionsId}
        onKeyDown={handleKey}
        onPointerEnter={() => {
          hovered.current = true
        }}
        onPointerLeave={() => {
          hovered.current = false
        }}
        onBlur={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget)) leave()
        }}
      >
        <Artwork openDoor={active ? destination : null} />
        <span className={styles.coordinates} aria-hidden="true">
          {blue ? 'SINAL INTERROMPIDO / OUTRA REALIDADE' : 'SECTOR 07 / CONEXÃO ABERTA'}
        </span>
        <button
          className={styles.exit}
          type="button"
          disabled={active}
          onClick={() => {
            leave(!blue)
            if (blue) returnToDream()
          }}
        >
          <span>
            {blue ? 'Volte a sonhar' : 'SAIR'} <span aria-hidden="true">↗</span>
          </span>
        </button>
        <button className={styles.portal} type="button" disabled={active} onClick={onReconsider}>
          <span>
            {blue ? (
              <>
                E se você tivesse
                <br />
                escolhido diferente?
              </>
            ) : (
              <>
                E se você pudesse
                <br />
                voltar a sonhar?
              </>
            )}
          </span>
        </button>
        {blue && active && <SmithAgents agents={encounterView} />}
        <span
          className={styles.character}
          style={{ left: `${position.x}%`, top: `${position.y}%` }}
          aria-hidden="true"
        >
          <svg viewBox="0 0 20 32" shapeRendering="crispEdges">
            <path
              fill="#05090c"
              d="M7 0h7v2h2v7h-2v3h2v3h2v8h-2l3 6h-6v3H5v-3H1l3-8H2v-6h2v-4h3z"
            />
            <path fill="#171f25" d="M6 11h9v8l3 9h-6l-2-5-2 5H3l3-11z" />
            <path fill="#c1b5a2" d="M7 3h7v6h-7z" />
            <path fill="#080d13" d="M6 4h9v3H6zM7 0h6v2H7zM6 1h9v2H6z" />
            <path fill="#61737c" d="M7 4h2v1H7zM12 4h2v1h-2z" />
            <path fill="#2f3d43" d="M6 11h2v13H6zM14 13h1v10h-1zM4 24h2v3H4z" />
            <path fill="#0b1218" d="M9 10h3v17H9zM6 28h3v4H6zM12 28h3v4h-3z" />
            <path fill="#b8ae9c" d="M2 20h2v3H2zM16 20h2v3h-2z" />
          </svg>
        </span>
        <span className={styles.status} role="status">
          {active
            ? destination === 'dream'
              ? 'ATRAVESSE A PORTA · VOLTAR À ESCOLHA'
              : destination === 'exit'
                ? blue
                  ? 'VOLTE A SONHAR · ATRAVESSE PARA VOLTAR AO TOPO'
                  : 'ATRAVESSE A PORTA · SAIR DA EXPLORAÇÃO'
                : blue
                  ? 'OS AGENTES VÊM ATRÁS · ESCOLHA SEU CAMINHO'
                  : 'ENCONTRE A PASSAGEM'
            : blue
              ? 'O QUE EXISTE ALÉM DO SONHO?'
              : 'HÁ UM CAMINHO ALÉM DO SISTEMA.'}
        </span>
      </div>
      <div className={styles.controls}>
        <button
          ref={start}
          aria-disabled={active}
          tabIndex={active ? -1 : 0}
          type="button"
          onClick={() => (active ? leave(true) : enter())}
        >
          {active
            ? 'Encerrar exploração · Esc'
            : blue
              ? 'Explorar as nuvens · Enter'
              : 'Explorar o corredor · Enter'}
        </button>
        <p id={instructionsId}>WASD / setas para mover · Atravesse uma porta · Esc para sair</p>
        <p className={styles.touchHint}>Toque em uma porta para escolher seu caminho.</p>
      </div>
    </section>
  )
}
