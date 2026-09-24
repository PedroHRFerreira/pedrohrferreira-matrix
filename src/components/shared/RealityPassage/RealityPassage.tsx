'use client'

import { useEffect, useId, useRef, useState, type KeyboardEvent } from 'react'
import styles from './styles.module.scss'
import { PassageArtwork } from './PassageArtwork'
import { BluePassageArtwork } from './BluePassageArtwork'
import { NeonSprite } from './NeonSprite'
import { SmithAgents } from './SmithAgents'
import { pursueAgents, type Agent } from './agentEncounter'

function returnToDream(immediate = false) {
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
    behavior:
      immediate || window.matchMedia('(prefers-reduced-motion: reduce)').matches
        ? 'instant'
        : 'smooth'
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
  reality = 'red',
  onCapture,
  captureCount = 0
}: {
  onReconsider: () => void
  reality?: 'red' | 'blue'
  onCapture?: () => void
  captureCount?: number
}) {
  const [desktop, setDesktop] = useState(false)
  useEffect(() => {
    const media = window.matchMedia('(min-width: 769px) and (hover: hover) and (pointer: fine)')
    const update = () => setDesktop(media.matches)
    update()
    media.addEventListener('change', update)
    return () => media.removeEventListener('change', update)
  }, [])
  if (!desktop && reality !== 'blue')
    return (
      <div className={styles.mobileReturn}>
        <button type="button" onClick={onReconsider}>
          E se você pudesse voltar a sonhar?
          <small>Voltar à escolha das pílulas ↗</small>
        </button>
      </div>
    )
  return (
    <PassageGame
      reality={reality}
      onReconsider={onReconsider}
      onCapture={onCapture}
      captureCount={captureCount}
    />
  )
}

function PassageGame({
  onReconsider,
  reality = 'red',
  onCapture,
  captureCount = 0
}: {
  onReconsider: () => void
  reality?: 'red' | 'blue'
  onCapture?: () => void
  captureCount?: number
}) {
  const blue = reality === 'blue'
  const instructionsId = useId()
  const Artwork = blue ? BluePassageArtwork : PassageArtwork
  const [active, setActive] = useState(false)
  const [position, setPosition] = useState(origin)
  const player = useRef(origin)
  const encounter = useRef(0)
  const agents = useRef<Agent[]>([])
  const character = useRef<HTMLSpanElement>(null)
  const wake = useRef<() => void>(() => {})
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
    character.current?.style.removeProperty('transform')
    setPosition(origin)
    if (character.current) {
      character.current.dataset.moving = 'false'
      character.current.dataset.facing = 'down'
    }
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
      if (event.key !== 'Enter' || event.repeat || active) return
      if (!hovered.current && document.activeElement !== scene.current) return
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
    const onVisibility = () => {
      if (document.hidden) stop()
    }
    window.addEventListener('blur', stop)
    document.addEventListener('visibilitychange', onVisibility)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('blur', stop)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [active])

  useEffect(() => {
    if (!active) return
    const element = scene.current
    if (!element) return
    const characterNode = character.current
    const keys = pressed.current
    let frame = 0
    let previousTime = performance.now()
    let bounds = element.getBoundingClientRect()
    const agentNodes = element.querySelectorAll<HTMLElement>('[data-passage-agent]')
    const paintPlayer = () => {
      const point = player.current
      if (characterNode) {
        characterNode.style.transform = `translate(${((point.x - origin.x) * bounds.width) / 100}px, ${((point.y - origin.y) * bounds.height) / 100}px) translate(-50%, -100%)`
      }
    }
    const paintAgents = () => {
      for (const agent of agents.current) {
        const node = agentNodes[agent.id]
        if (!node) continue
        if (node.hidden) node.hidden = false
        node.style.transform = `translate(${(agent.x * bounds.width) / 100}px, ${(agent.y * bounds.height) / 100}px) translate(-50%, -100%)`
        if (node.dataset.ready !== String(agent.ready)) node.dataset.ready = String(agent.ready)
        if (node.dataset.moving !== String(agent.ready)) node.dataset.moving = String(agent.ready)
      }
    }
    const measure = () => {
      bounds = element.getBoundingClientRect()
      paintPlayer()
      paintAgents()
    }
    const sizing = new ResizeObserver(measure)
    sizing.observe(element)
    // React owns door/status changes; the frame loop only moves existing sprites.
    let previousZone = ''
    const tick = (time: number) => {
      frame = 0
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
      let didMove = false
      if (magnitude && scene.current) {
        const { width, height } = bounds
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
        didMove = next.x !== previous.x || next.y !== previous.y
        if (characterNode) {
          const facing = x ? (x < 0 ? 'left' : 'right') : y < 0 ? 'up' : 'down'
          if (characterNode.dataset.facing !== facing) characterNode.dataset.facing = facing
        }
        player.current = next
        paintPlayer()
        const zone = `${next.y <= 72 ? (next.x <= 23 ? 'exit' : next.x >= 72 ? 'dream' : '') : ''}:${next.y <= 68 ? (next.x <= 15 ? 'exit' : next.x >= 80 ? 'dream' : '') : ''}`
        if (zone !== previousZone) {
          previousZone = zone
          setPosition(next)
        }
      }
      if (characterNode && characterNode.dataset.moving !== String(didMove)) {
        characterNode.dataset.moving = String(didMove)
      }
      if (blue && scene.current) {
        const { width, height } = bounds
        const result = pursueAgents(
          agents.current,
          player.current,
          encounter.current,
          elapsed,
          width && height ? width / height : 3
        )
        agents.current = result.agents
        paintAgents()
        if (result.caught) {
          keys.clear()
          setActive(false)
          returnToDream(captureCount >= 3)
          onCapture?.()
          return
        }
      }
      if (blue || keys.size) frame = requestAnimationFrame(tick)
    }
    wake.current = () => {
      if (frame) return
      previousTime = performance.now()
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
      if (characterNode) characterNode.dataset.moving = 'false'
      sizing.disconnect()
      wake.current = () => {}
      keys.clear()
      window.removeEventListener('keyup', release)
      window.removeEventListener('blur', clear)
      document.removeEventListener('visibilitychange', clear)
    }
  }, [active, blue, onCapture, captureCount])

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
      wake.current()
    }
  }

  return (
    <section
      className={`${styles.passage} ${blue ? styles.blue : ''}`}
      aria-label={blue ? 'Passagem além do sonho' : 'Passagem para o sonho'}
      data-keyboard-only={active}
      onPointerDownCapture={(event) => {
        if (!active || (event.target as HTMLElement).closest('[data-game-control]')) return
        event.preventDefault()
        event.stopPropagation()
        scene.current?.focus({ preventScroll: true })
      }}
      onClickCapture={(event) => {
        if (!active || (event.target as HTMLElement).closest('[data-game-control]')) return
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
          if (
            !event.currentTarget.contains(event.relatedTarget) &&
            !(event.relatedTarget as HTMLElement | null)?.closest('[data-game-control]')
          )
            leave()
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
        {blue && active && <SmithAgents />}
        <span
          ref={character}
          className={styles.character}
          data-moving="false"
          data-facing="down"
          style={{ left: `${origin.x}%`, top: `${origin.y}%` }}
          aria-hidden="true"
        >
          <NeonSprite />
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
          data-game-control
          className={styles.startButton}
          aria-describedby={instructionsId}
          ref={start}
          type="button"
          onClick={() => (active ? leave(true) : enter())}
        >
          <span aria-hidden="true">{active ? '■' : '▶'}</span>
          {active ? 'Encerrar minigame' : 'Iniciar minigame'}
        </button>
        <p id={instructionsId}>
          <span className={styles.startHint}>
            Clique para jogar ou pressione <kbd>Enter</kbd> com o jogo selecionado.
            <br />
          </span>
          WASD / setas para mover · Atravesse uma porta · <kbd>Esc</kbd> para sair
        </p>
        {blue && (
          <div className={styles.directionPad} aria-label="Controles de movimento">
            {(
              [
                ['ArrowLeft', 'Esquerda', '←'],
                ['ArrowUp', 'Cima', '↑'],
                ['ArrowDown', 'Baixo', '↓'],
                ['ArrowRight', 'Direita', '→']
              ] as const
            ).map(([key, label, symbol]) => (
              <button
                key={key}
                type="button"
                data-game-control
                aria-label={label}
                disabled={!active}
                onPointerDown={(event) => {
                  event.preventDefault()
                  event.currentTarget.setPointerCapture(event.pointerId)
                  pressed.current.add(key)
                  wake.current()
                }}
                onPointerUp={() => pressed.current.delete(key)}
                onPointerCancel={() => pressed.current.delete(key)}
                onLostPointerCapture={() => pressed.current.delete(key)}
                onKeyDown={(event) => {
                  if (event.key === ' ' || event.key === 'Enter') {
                    event.preventDefault()
                    pressed.current.add(key)
                    wake.current()
                  }
                }}
                onKeyUp={() => pressed.current.delete(key)}
                onBlur={() => pressed.current.delete(key)}
              >
                {symbol}
              </button>
            ))}
          </div>
        )}
        <p className={styles.touchHint}>
          Toque em “Iniciar minigame” para jogar. Use os botões de direção para mover Neon.
        </p>
      </div>
    </section>
  )
}
