'use client'

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from 'react'
import type { ExperienceState } from '@/types'
import { useReducedMotion, useTypedLines } from '@/hooks/useTerminalTyping'
import { createZionEncounter, stepZionEncounter, ZION_ARENA } from '@/utils/zionEncounter'
import { Television } from '../EntryExperience/Television'
import { Terminal, TerminalContinue } from '../EntryExperience/Terminal'
import { getPortfolioContent } from '@/config'
import passageStyles from '../RealityPassage/styles.module.scss'
import { AgentSprite, NeoSprite } from '../RealityPassage/PixelCharacters'
import terminalStyles from '../EntryExperience/styles.module.scss'
import styles from './styles.module.scss'

type SequenceState = Extract<
  ExperienceState,
  'blue-revelation-one' | 'blue-revelation-two' | 'zion-chase' | 'zion-loading'
>
interface Props {
  state: SequenceState
  onAdvance: () => void
  onEscape: () => void
  onLoaded: () => void
}
const responsiveQuery = '(max-width: 48rem), (pointer: coarse)'
function subscribeResponsive(notify: () => void) {
  const media = window.matchMedia(responsiveQuery)
  media.addEventListener('change', notify)
  return () => media.removeEventListener('change', notify)
}
const responsiveSnapshot = () => window.matchMedia(responsiveQuery).matches
const serverSnapshot = () => true
const messages = {
  first: ['A realidade pode ser uma coisa assustadora para algumas pessoas.'],
  second: ['Isso não é real, e o mundo real fica em algum outro lugar.'],
  loading: [
    'Não sabemos quem deu o primeiro golpe, se fomos nós ou eles. Mas sabemos que fomos nós que manchamos os céus.'
  ]
}
const directions: Record<string, [number, number]> = {
  ArrowUp: [0, -1],
  w: [0, -1],
  ArrowDown: [0, 1],
  s: [0, 1],
  ArrowLeft: [-1, 0],
  a: [-1, 0],
  ArrowRight: [1, 0],
  d: [1, 0]
}

export function ZionSequence(props: Props) {
  return <SequencePhase key={props.state} {...props} />
}

function SequencePhase({ state, onAdvance, onEscape, onLoaded }: Props) {
  const root = useRef<HTMLElement>(null)
  const keys = useRef(new Set<string>())
  const consumed = useRef(false)
  const responsive = useSyncExternalStore(subscribeResponsive, responsiveSnapshot, serverSnapshot)
  const reducedMotion = useReducedMotion()
  const [ready, setReady] = useState(false)
  // The deliberate Enter on the last message starts the desktop game immediately.
  const [paused, setPaused] = useState(false)
  const [encounter, setEncounter] = useState(createZionEncounter)
  const encounterRef = useRef(encounter)
  const [facing, setFacing] = useState('up')
  const [moving, setMoving] = useState(false)
  const [asset, setAsset] = useState<'pending' | 'ready' | 'failed'>('pending')
  const [loadAttempt, setLoadAttempt] = useState(0)
  const [readable, setReadable] = useState(false)
  const chase = state === 'zion-chase'
  const loading = state === 'zion-loading'
  const first = state === 'blue-revelation-one'
  const entry = getPortfolioContent().entry
  const doorOpen = Math.abs(encounter.player.x - 50) < 12 && encounter.player.y <= 18
  const lines = loading ? messages.loading : first ? messages.first : messages.second
  const finishTyping = useCallback(() => setReady(true), [])
  const typed = useTypedLines(lines, !chase, 42, reducedMotion, finishTyping)

  useEffect(() => {
    root.current?.focus({ preventScroll: true })
  }, [])

  const advance = useCallback(() => {
    if (consumed.current || (!chase && !ready)) return
    consumed.current = true
    if (chase) onEscape()
    else {
      onAdvance()
      // Reducer events are processed in order: enter the chase, then bypass it.
      if (!first && responsive) onEscape()
    }
  }, [chase, ready, first, responsive, onAdvance, onEscape])

  const retry = useCallback(() => {
    const next = createZionEncounter()
    encounterRef.current = next
    keys.current.clear()
    setEncounter(next)
    setFacing('up')
    setMoving(false)
    setPaused(false)
    root.current?.focus({ preventScroll: true })
  }, [])

  useEffect(() => {
    const activeKeys = keys.current
    const down = (event: KeyboardEvent) => {
      const key = event.key.length === 1 ? event.key.toLowerCase() : event.key
      if (chase && !responsive && directions[key]) {
        event.preventDefault()
        if (!paused) activeKeys.add(key)
      } else if (key === 'Enter' && !loading) {
        // Focused buttons retain their native Enter behavior, without a second action.
        if (event.target instanceof HTMLElement && event.target.closest('button')) return
        event.preventDefault()
        if (event.repeat) return
        if (!chase || responsive) advance()
        else if (encounter.status === 'caught') retry()
        else if (paused) setPaused(false)
      }
    }
    const up = (event: KeyboardEvent) =>
      activeKeys.delete(event.key.length === 1 ? event.key.toLowerCase() : event.key)
    const suspend = () => {
      activeKeys.clear()
      setPaused(true)
    }
    const visibility = () => {
      if (document.hidden) suspend()
    }
    const media = window.matchMedia(responsiveQuery)
    window.addEventListener('keydown', down)
    window.addEventListener('keyup', up)
    window.addEventListener('blur', suspend)
    document.addEventListener('visibilitychange', visibility)
    media.addEventListener('change', suspend)
    return () => {
      window.removeEventListener('keydown', down)
      window.removeEventListener('keyup', up)
      window.removeEventListener('blur', suspend)
      document.removeEventListener('visibilitychange', visibility)
      media.removeEventListener('change', suspend)
      activeKeys.clear()
    }
  }, [chase, loading, responsive, paused, encounter.status, advance, retry])

  useEffect(() => {
    if (!chase || responsive || paused || encounter.status !== 'playing') return
    let frame = 0
    let previous = 0
    const tick = (time: number) => {
      const vector = [...keys.current].reduce(
        (v, key) => ({ x: v.x + directions[key][0], y: v.y + directions[key][1] }),
        { x: 0, y: 0 }
      )
      const next = stepZionEncounter(
        encounterRef.current,
        vector,
        previous ? (time - previous) / 1000 : 0
      )
      const oldPlayer = encounterRef.current.player
      setMoving(next.player.x !== oldPlayer.x || next.player.y !== oldPlayer.y)
      if (vector.x || vector.y) {
        setFacing(vector.x ? (vector.x < 0 ? 'left' : 'right') : vector.y < 0 ? 'up' : 'down')
      }
      previous = time
      encounterRef.current = next
      setEncounter(next)
      if (next.status === 'won') {
        if (!consumed.current) {
          consumed.current = true
          onEscape()
        }
      } else if (next.status === 'playing') frame = requestAnimationFrame(tick)
      else keys.current.clear()
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [chase, responsive, paused, encounter.status, onEscape])

  useEffect(() => {
    if (!loading || !ready) return
    const timer = window.setTimeout(() => setReadable(true), 6000)
    return () => window.clearTimeout(timer)
  }, [loading, ready])

  useEffect(() => {
    if (!loading) return
    let active = true
    const img = new Image()
    const timeout = window.setTimeout(() => {
      if (active) setAsset('failed')
    }, 12000)
    img.onload = () => {
      if (active) {
        setAsset('ready')
        window.clearTimeout(timeout)
      }
    }
    img.onerror = () => {
      if (active) {
        setAsset('failed')
        window.clearTimeout(timeout)
      }
    }
    img.src = '/images/zion-city.webp'
    return () => {
      active = false
      window.clearTimeout(timeout)
      img.onload = null
      img.onerror = null
    }
  }, [loading, loadAttempt])

  useEffect(() => {
    if (loading && readable && asset === 'ready' && !consumed.current) {
      consumed.current = true
      onLoaded()
    }
  }, [loading, readable, asset, onLoaded])

  return (
    <Television
      ref={root}
      tabIndex={-1}
      className={styles.sequence}
      data-testid="zion-sequence"
      data-state={state}
      aria-label={chase ? 'Caminho para o mundo real' : 'Despertar'}
    >
      {!chase || responsive ? (
        <Terminal>
          <h1 className={terminalStyles.questionLine} aria-label={lines[0]}>
            <span aria-hidden="true">{chase ? lines[0] : typed[0]}</span>
            {!ready && !chase && <span className={terminalStyles.cursor} aria-hidden="true" />}
          </h1>
          {!loading && (ready || chase) && (
            <TerminalContinue
              onContinue={advance}
              prompt={entry.continuePrompt}
              touchLabel={responsive && !first ? '[ IR PARA O MUNDO REAL ↵ ]' : entry.touchContinue}
            />
          )}
          {loading && ready && (
            <p className={terminalStyles.systemLine} role="status">
              {asset === 'failed' ? 'O cenário está demorando para carregar.' : 'Atravessando…'}
            </p>
          )}
          {loading && ready && asset === 'failed' && (
            <div className={styles.recovery}>
              <button
                onClick={() => {
                  setAsset('pending')
                  setLoadAttempt((a) => a + 1)
                }}
              >
                Tentar carregar novamente
              </button>
              <button
                disabled={!readable}
                onClick={() => {
                  if (!consumed.current) {
                    consumed.current = true
                    onLoaded()
                  }
                }}
              >
                Continuar mesmo assim
              </button>
            </div>
          )}
        </Terminal>
      ) : (
        <div className={styles.game}>
          <div className={styles.gameHeader}>
            <h1>Alcance o mundo real.</h1>
            {encounter.status === 'playing' && (
              <button
                onClick={() => {
                  keys.current.clear()
                  setPaused(!paused)
                  root.current?.focus({ preventScroll: true })
                }}
              >
                {paused ? 'Retomar' : 'Pausar'}
              </button>
            )}
          </div>
          <div
            className={styles.arena}
            data-testid="zion-arena"
            data-paused={paused}
            aria-label="Arena com Neo, quatro agentes e a saída para o mundo real"
          >
            <svg
              className={styles.scenery}
              viewBox="0 0 100 64"
              preserveAspectRatio="none"
              shapeRendering="crispEdges"
              role="img"
              aria-label="Desvie dos agentes e dos obstáculos para alcançar o mundo real"
            >
              <defs>
                <pattern id="zion-floor" width="8" height="8" patternUnits="userSpaceOnUse">
                  <rect width="8" height="8" fill="#17251f" />
                  <path d="M0 0H8V1H1V8H0Z" fill="#25382b" />
                  <path d="M7 1H8V8H1V7H7Z" fill="#0c1712" />
                  <path d="M2 2H3V3H2ZM5 5H6V6H5Z" fill="#1d2d22" />
                </pattern>
              </defs>
              <rect width="100" height="64" fill="url(#zion-floor)" />
              <path d="M0 0H100V2H2V62H98V2H100V64H0Z" fill="#3c4d40" />
              <path d="M2 2H44V3H3V61H97V3H56V2H98V62H2Z" fill="#0a1510" />
              {ZION_ARENA.obstacles.map((r, i) => (
                <g key={i}>
                  <rect x={r.x + 1} y={r.y + 1} width={r.width} height={r.height} fill="#08110c" />
                  <rect {...r} fill="#33483a" />
                  <path
                    d={`M${r.x} ${r.y + r.height}v-${r.height}h${r.width}v1H${r.x + 1}v${r.height - 1}Z`}
                    fill="#70836b"
                  />
                  <path d={`M${r.x + 2} ${r.y + 2}h${r.width - 4}v1H${r.x + 2}Z`} fill="#17271d" />
                </g>
              ))}
            </svg>
            <svg
              className={styles.door}
              viewBox="0 0 36 56"
              shapeRendering="crispEdges"
              data-testid="zion-door"
              data-open={doorOpen}
              aria-hidden="true"
            >
              <path fill="#070e0b" d="M6 11H32V52H36V56H2V52H6Z" />
              <path fill="#39473e" d="M3 9H33V51H3Z" />
              <path fill="#788574" d="M3 9H33V12H6V51H3Z" />
              <path fill="#566650" d="M30 12H33V51H30Z" />
              <path fill="#15271c" d="M7 13H29V51H7Z" />
              <path fill="#c5ccb1" d="M9 15H27V50H9Z" />
              <path fill="#879581" d="M9 15H27V21H9Z" />
              <path fill="#a8b59c" d="M9 21H27V33H9Z" />
              <path fill="#e0dfbc" d="M9 33H27V50H9Z" />
              <path fill="#b0b596" d="M9 42H27V43H9ZM9 47H27V48H9Z" />
              <g
                className={passageStyles.doorLeaf}
                data-open={doorOpen}
                style={{ transformOrigin: '9px 32px' }}
              >
                <path fill="#1b2920" d="M9 15H27V50H9Z" />
                <path fill="#64745c" d="M9 15H27V17H11V50H9Z" />
                <path fill="#43523e" d="M11 17H26V49H11Z" />
                <path fill="#27382a" d="M13 19H24V31H13ZM13 35H24V46H13Z" />
                <path fill="#768269" d="M13 19H24V20H14V31H13ZM13 35H24V36H14V46H13Z" />
                <path fill="#a3a785" d="M24 32H26V36H24Z" />
                <path fill="#e2dab0" d="M23 33H26V34H23Z" />
              </g>
              <path fill="#8c967e" d="M6 50H30V52H6Z" />
              <path fill="#53654f" d="M3 52H33V54H3Z" />
              <path fill="#263a2b" d="M1 54H35V56H1Z" />
              <path fill="#52644f" d="M6 0H30V8H6Z" />
              <path fill="#111f17" d="M7 1H29V7H7Z" />
              <text
                x="18"
                y="5"
                textAnchor="middle"
                fill="#d2dbb8"
                fontSize="3.1"
                fontFamily="monospace"
                letterSpacing=".1"
              >
                MUNDO REAL
              </text>
            </svg>
            {encounter.agents.map((a) => (
              <span
                key={a.id}
                data-moving={!paused && encounter.status === 'playing'}
                className={`${styles.character} ${passageStyles.animatedSprite}`}
                style={{ left: `${a.x}%`, top: `${(a.y / ZION_ARENA.height) * 100}%` }}
                aria-hidden="true"
              >
                <AgentSprite />
              </span>
            ))}
            <span
              className={`${styles.character} ${passageStyles.animatedSprite}`}
              data-testid="zion-neon"
              data-facing={facing}
              data-moving={!paused && encounter.status === 'playing' && moving}
              data-paused={paused || encounter.status !== 'playing'}
              data-x={encounter.player.x}
              data-y={encounter.player.y}
              style={{
                left: `${encounter.player.x}%`,
                top: `${(encounter.player.y / ZION_ARENA.height) * 100}%`
              }}
              aria-hidden="true"
            >
              <NeoSprite />
            </span>
            {(paused || encounter.status === 'caught') && (
              <div className={styles.overlay} role="status">
                {encounter.status === 'caught' ? (
                  <>
                    <p>Os agentes alcançaram você.</p>
                    <button onClick={retry}>Tentar novamente</button>
                    <small>Pressione Enter para tentar novamente</small>
                  </>
                ) : (
                  <p>Fuga pausada. Pressione Enter para retomar.</p>
                )}
              </div>
            )}
          </div>
          <div className={styles.gameFooter}>
            <p>
              Setas ou WASD para mover.
              <br />
              Desvie pelos lados dos obstáculos.
            </p>
          </div>
        </div>
      )}
    </Television>
  )
}
