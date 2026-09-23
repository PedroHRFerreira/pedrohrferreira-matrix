'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import type { ExperienceState, PortfolioContent, Reality } from '@/types'

import styles from './styles.module.scss'

export interface EntryExperienceProps {
  content: PortfolioContent
  state: ExperienceState
  onAdvanceSequence: () => void
  onChooseReality: (reality: Reality) => void
  onTransitionComplete: () => void
}

const blueReturnQuestion = ['O que é real? Como você define o real?']
const blueReturnChoice = ['Há uma diferença entre conhecer o caminho e percorrer o caminho.']

const redReturnQuestion = ['Você tem a cara de quem aceita o que vê, porque tá esperando acordar?']
const redReturnChoice = ['A ignorância é uma bênção!']
const dreamDisplayStates: Partial<Record<ExperienceState, ExperienceState>> = {
  'dream-question': 'return-question',
  'dream-waiting': 'waiting-return-enter',
  'dream-choice': 'return-choice',
  'dream-selection': 'return-selection'
}

export const ENTRY_TIMING = {
  coldBoot: 1.5,
  staticNoise: 3.5,
  signalReveal: 2,
  terminalPause: 1.2,
  initialCharacter: 42,
  questionCharacter: 68,
  reducedStagePause: 1.4,
  realityTransition: 2.1
} as const

function useReducedMotion() {
  const [reduced, setReduced] = useState(false)

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setReduced(media.matches)
    update()
    media.addEventListener('change', update)
    return () => media.removeEventListener('change', update)
  }, [])

  return reduced
}

function AnalogStatic({ reducedMotion }: { reducedMotion: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const context = canvas?.getContext('2d', { alpha: false })
    if (!canvas || !context) return

    const width = 320
    const height = 180
    canvas.width = width
    canvas.height = height
    const frame = context.createImageData(width, height)
    // Bake the CRT contrast/brightness into the small noise buffer instead of
    // filtering the enlarged screen every frame. Noise is already grayscale.
    const palette = new Uint8ClampedArray(256 * 4)
    for (let value = 0; value < 256; value++) {
      const shade = Math.max(0, Math.min(255, (value - 127.5) * 1.7 + 127.5)) * 0.58
      palette[value * 4] = shade
      palette[value * 4 + 1] = shade
      palette[value * 4 + 2] = shade
      palette[value * 4 + 3] = 255
    }
    const colors = new Uint32Array(palette.buffer)
    const pixels = new Uint32Array(frame.data.buffer, frame.data.byteOffset, width * height)
    let animationFrame = 0
    let previousFrame = 0

    const paint = () => {
      for (let pixel = 0; pixel < pixels.length; pixel++) {
        const grain = Math.random()
        const value = grain > 0.56 ? grain * 150 + 55 : grain * 58 + 8
        pixels[pixel] = colors[Math.round(value)]
      }
      context.putImageData(frame, 0, 0)
    }

    const draw = (time: number) => {
      if (time - previousFrame > 66) {
        paint()
        previousFrame = time
      }
      animationFrame = window.requestAnimationFrame(draw)
    }

    paint()
    const sync = () => {
      window.cancelAnimationFrame(animationFrame)
      if (!reducedMotion && !document.hidden) animationFrame = window.requestAnimationFrame(draw)
    }
    sync()
    document.addEventListener('visibilitychange', sync)
    return () => {
      window.cancelAnimationFrame(animationFrame)
      document.removeEventListener('visibilitychange', sync)
    }
  }, [reducedMotion])

  return <canvas ref={canvasRef} className={styles.staticCanvas} aria-hidden="true" />
}

function ColdBoot() {
  return (
    <div className={styles.coldBoot} role="status" aria-label="Inicializando televisão">
      <div className={styles.bootFlash} aria-hidden="true" />
      <div className={styles.bootScan} aria-hidden="true" />
    </div>
  )
}

function SignalReveal({ content }: { content: PortfolioContent }) {
  return (
    <div className={styles.signalReveal} role="status" aria-label="Materializando sinal">
      <div className={styles.revealGhost} aria-hidden="true">
        <div className={styles.revealChrome}>
          <span>SYS://UNKNOWN</span>
          <span>CH. 84</span>
        </div>
        <div className={styles.revealLines}>
          <span>{content.entry.terminalConnection}</span>
          <span>{content.entry.terminalIdentify}</span>
          <span>{content.entry.terminalUser}</span>
          <strong>{content.entry.terminalWakeUp}</strong>
        </div>
      </div>
      <div className={styles.revealSweep} aria-hidden="true" />
    </div>
  )
}

function useTypedLines(
  lines: readonly string[],
  active: boolean,
  characterDelay: number,
  reducedMotion: boolean,
  onComplete: () => void
) {
  const [visibleLines, setVisibleLines] = useState<readonly string[]>([])

  useEffect(() => {
    let cancelled = false
    let timer = 0
    const resetTimer = window.setTimeout(() => setVisibleLines([]), 0)

    if (!active) return () => window.clearTimeout(resetTimer)

    if (reducedMotion) {
      timer = window.setTimeout(() => {
        if (cancelled) return
        setVisibleLines(lines)
        onComplete()
      }, ENTRY_TIMING.reducedStagePause * 1000)
      return () => {
        cancelled = true
        window.clearTimeout(resetTimer)
        window.clearTimeout(timer)
      }
    }

    let lineIndex = 0
    let characterIndex = 0

    const typeNextCharacter = () => {
      if (cancelled) return
      const line = lines[lineIndex]
      if (line === undefined) {
        onComplete()
        return
      }

      const currentLineIndex = lineIndex
      const nextCharacterIndex = characterIndex + 1
      characterIndex = nextCharacterIndex
      setVisibleLines((current) => {
        const next = [...current]
        next[currentLineIndex] = line.slice(0, nextCharacterIndex)
        return next
      })

      if (nextCharacterIndex >= line.length) {
        lineIndex += 1
        characterIndex = 0
        timer = window.setTimeout(typeNextCharacter, 260)
        return
      }

      const character = line[nextCharacterIndex - 1] ?? ''
      const punctuationPause = /[.,:]/.test(character) ? 120 : 0
      const variation = (character.charCodeAt(0) % 5) * 7
      timer = window.setTimeout(typeNextCharacter, characterDelay + variation + punctuationPause)
    }

    timer = window.setTimeout(typeNextCharacter, 420)
    return () => {
      cancelled = true
      window.clearTimeout(resetTimer)
      window.clearTimeout(timer)
    }
  }, [active, characterDelay, lines, onComplete, reducedMotion])

  return visibleLines
}

export function EntryExperience({
  content,
  state: experienceState,
  onAdvanceSequence,
  onChooseReality,
  onTransitionComplete
}: EntryExperienceProps) {
  const state = dreamDisplayStates[experienceState] ?? experienceState
  const returningFromRed = experienceState.startsWith('dream-')
  const returnQuestion = returningFromRed ? redReturnQuestion : blueReturnQuestion
  const returnChoice = returningFromRed ? redReturnChoice : blueReturnChoice
  const reducedMotion = useReducedMotion()
  const isSelection = state === 'pill-selection' || state === 'return-selection'
  const typedReturnQuestion = useTypedLines(
    returnQuestion,
    state === 'return-question',
    ENTRY_TIMING.questionCharacter,
    reducedMotion,
    onAdvanceSequence
  )
  const typedReturnChoice = useTypedLines(
    returnChoice,
    state === 'return-choice',
    ENTRY_TIMING.initialCharacter,
    reducedMotion,
    onAdvanceSequence
  )
  const [selectedReality, setSelectedReality] = useState<Reality | null>(null)
  const initialLines = useMemo(
    () => [
      content.entry.terminalConnection,
      content.entry.terminalIdentify,
      content.entry.terminalUser,
      content.entry.terminalWakeUp,
      content.entry.terminalMatrixHasYou
    ],
    [content]
  )
  const questionLines = useMemo(() => [content.entry.question], [content.entry.question])
  const choiceLines = useMemo(() => [content.entry.choicePrompt], [content.entry.choicePrompt])

  const typedInitialLines = useTypedLines(
    initialLines,
    state === 'initial-message',
    ENTRY_TIMING.initialCharacter,
    reducedMotion,
    onAdvanceSequence
  )
  const typedQuestionLines = useTypedLines(
    questionLines,
    state === 'reality-question',
    ENTRY_TIMING.questionCharacter,
    reducedMotion,
    onAdvanceSequence
  )

  useEffect(() => {
    const previousRootOverflow = document.documentElement.style.overflow
    document.documentElement.style.overflow = 'hidden'
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.documentElement.style.overflow = previousRootOverflow
      document.body.style.overflow = previousOverflow
    }
  }, [])

  useEffect(() => {
    if (
      state !== 'cold-boot' &&
      state !== 'static-noise' &&
      state !== 'signal-reveal' &&
      state !== 'terminal-connecting'
    )
      return
    const duration =
      state === 'cold-boot'
        ? ENTRY_TIMING.coldBoot
        : state === 'static-noise'
          ? ENTRY_TIMING.staticNoise
          : state === 'signal-reveal'
            ? ENTRY_TIMING.signalReveal
            : ENTRY_TIMING.terminalPause
    const timer = window.setTimeout(onAdvanceSequence, duration * 1000)
    return () => window.clearTimeout(timer)
  }, [onAdvanceSequence, state])

  useEffect(() => {
    if (state !== 'transitioning-red' && state !== 'transitioning-blue') return
    const timer = window.setTimeout(onTransitionComplete, ENTRY_TIMING.realityTransition * 1000)
    return () => window.clearTimeout(timer)
  }, [onTransitionComplete, state])

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const target = event.target
      if (target instanceof HTMLElement && target.closest('button, a, input, select, textarea')) {
        return
      }

      if (event.key === 'Enter') {
        if (
          state === 'waiting-first-enter' ||
          state === 'waiting-second-enter' ||
          state === 'waiting-return-enter'
        ) {
          event.preventDefault()
          onAdvanceSequence()
        } else if (isSelection && selectedReality) {
          event.preventDefault()
          onChooseReality(selectedReality)
        }
      }

      if (isSelection && (event.key === 'ArrowLeft' || event.key === 'ArrowRight')) {
        event.preventDefault()
        setSelectedReality(event.key === 'ArrowLeft' ? 'red' : 'blue')
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onAdvanceSequence, onChooseReality, selectedReality, state, isSelection])

  const isTransitioning = state === 'transitioning-red' || state === 'transitioning-blue'
  const transitionReality = state === 'transitioning-red' ? 'red' : 'blue'
  const transitionLines =
    transitionReality === 'red' ? content.entry.redTransition : content.entry.blueTransition
  const displayedLines =
    state === 'return-question'
      ? typedReturnQuestion
      : state === 'waiting-return-enter'
        ? returnQuestion
        : state === 'return-choice'
          ? typedReturnChoice
          : state === 'return-selection'
            ? returnChoice
            : state === 'initial-message'
              ? typedInitialLines
              : state === 'waiting-first-enter'
                ? initialLines
                : state === 'reality-question'
                  ? typedQuestionLines
                  : state === 'waiting-second-enter'
                    ? questionLines
                    : state === 'pill-selection'
                      ? choiceLines
                      : []
  const isWaiting =
    state === 'waiting-first-enter' ||
    state === 'waiting-second-enter' ||
    state === 'waiting-return-enter'
  return (
    <main
      className={styles.entry}
      data-state={state}
      data-transition={isTransitioning ? transitionReality : undefined}
    >
      <div className={styles.television} aria-label="Tela CRT com terminal da Matrix">
        <div className={styles.screen}>
          {state === 'cold-boot' ? <ColdBoot /> : null}

          {state === 'static-noise' ? (
            <div className={styles.static} role="status" aria-label="Procurando sinal analógico">
              <AnalogStatic reducedMotion={reducedMotion} />
              <div className={styles.staticBand} aria-hidden="true" />
              <div className={styles.staticFlicker} aria-hidden="true" />
            </div>
          ) : null}

          {state === 'signal-reveal' ? <SignalReveal content={content} /> : null}

          {!isTransitioning &&
          state !== 'cold-boot' &&
          state !== 'static-noise' &&
          state !== 'signal-reveal' ? (
            <section className={styles.terminal} aria-live="polite" aria-label="Terminal da Matrix">
              <div className={styles.terminalChrome} aria-hidden="true">
                <span>SYS://UNKNOWN</span>
                <span>CH. 84</span>
              </div>
              <div className={styles.terminalOutput}>
                {state === 'terminal-connecting' ? (
                  <p className={styles.emptyLine}>
                    <span className={styles.cursor} aria-hidden="true" />
                  </p>
                ) : null}

                {displayedLines.map((line, index) => {
                  const isQuestion =
                    state === 'reality-question' ||
                    state === 'waiting-second-enter' ||
                    isSelection ||
                    state === 'return-question' ||
                    state === 'waiting-return-enter' ||
                    state === 'return-choice'
                  const LineElement = isQuestion ? 'h1' : 'p'

                  return (
                    <LineElement
                      className={
                        isQuestion
                          ? styles.questionLine
                          : index >= 3
                            ? styles.messageLine
                            : styles.systemLine
                      }
                      key={`terminal-line-${index}`}
                    >
                      {line}
                      {index === displayedLines.length - 1 && !isWaiting ? (
                        <span className={styles.cursor} aria-hidden="true" />
                      ) : null}
                    </LineElement>
                  )
                })}

                {isWaiting ? (
                  <div className={styles.continueBlock}>
                    <p className={styles.continuePrompt}>
                      {content.entry.continuePrompt}
                      <span className={styles.cursor} aria-hidden="true" />
                    </p>
                    <button
                      className={styles.touchContinue}
                      type="button"
                      onClick={onAdvanceSequence}
                    >
                      {content.entry.touchContinue}
                    </button>
                  </div>
                ) : null}

                {isSelection ? (
                  <div className={styles.selection}>
                    <div className={styles.pills} role="group">
                      {(['red', 'blue'] as const).map((reality) => (
                        <button
                          aria-pressed={selectedReality === reality}
                          className={reality === 'red' ? styles.redPill : styles.bluePill}
                          data-selected={selectedReality === reality || undefined}
                          key={reality}
                          type="button"
                          onClick={() => onChooseReality(reality)}
                          onFocus={() => setSelectedReality(reality)}
                          onPointerEnter={() => setSelectedReality(reality)}
                        >
                          <span className={styles.pillShape} aria-hidden="true" />
                          <span>
                            {reality === 'red'
                              ? content.entry.redPillLabel
                              : content.entry.bluePillLabel}
                          </span>
                        </button>
                      ))}
                    </div>
                    <p className={styles.keyboardHint}>← / → · ENTER</p>
                  </div>
                ) : null}
              </div>
            </section>
          ) : null}

          {isTransitioning ? (
            <div className={styles.transition} role="status">
              {transitionLines.map((line) => (
                <p key={line}>{line}</p>
              ))}
            </div>
          ) : null}

          <div className={styles.scanlines} aria-hidden="true" />
          <div className={styles.vignette} aria-hidden="true" />
          <div className={styles.glass} aria-hidden="true" />
          <span className={styles.formatBadge} aria-hidden="true">
            1920 × 1080 | 30 FPS
          </span>
        </div>
      </div>
    </main>
  )
}
