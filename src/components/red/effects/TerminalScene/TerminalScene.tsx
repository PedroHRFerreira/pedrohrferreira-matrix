'use client'

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type HTMLAttributes,
  type ReactNode
} from 'react'

import styles from './styles.module.scss'

export interface TerminalCommand {
  id: string
  label: string
  meta?: string
  panel: ReactNode
}

interface TerminalSceneProps {
  id: string
  eyebrow: string
  title: string
  description?: string
  commands: readonly TerminalCommand[]
  variant?: 'standard' | 'timeline'
  className?: string
  animateOnce?: boolean
  horizontal?: boolean
  panelClassName?: string
  panelsClassName?: string
  viewportClassName?: string
  rootAttributes?: HTMLAttributes<HTMLElement>
}

export function TerminalScene({
  id,
  eyebrow,
  title,
  description,
  commands,
  variant = 'standard',
  className,
  horizontal = false,
  animateOnce = false,
  panelClassName,
  panelsClassName,
  viewportClassName,
  rootAttributes
}: TerminalSceneProps) {
  const [activeId, setActiveId] = useState(commands[0]?.id ?? '')
  const [reducedMotion, setReducedMotion] = useState(false)
  const [sceneVisible, setSceneVisible] = useState(false)
  const sceneRef = useRef<HTMLElement>(null)
  const hasAnimated = useRef(false)
  const activeCommand = commands.find((command) => command.id === activeId) ?? commands[0]

  const selectOffset = (offset: number) => {
    const currentIndex = Math.max(
      0,
      commands.findIndex((command) => command.id === activeCommand.id)
    )
    const nextIndex = (currentIndex + offset + commands.length) % commands.length
    setActiveId(commands[nextIndex]?.id ?? activeCommand.id)
  }

  const advance = () => {
    const scenes = Array.from(document.querySelectorAll<HTMLElement>('[data-terminal-scene]'))
    const currentIndex = scenes.indexOf(sceneRef.current as HTMLElement)
    scenes[currentIndex + 1]?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const selectCommand = (commandId: string, index: number) => {
    setActiveId(commandId)
    if (variant !== 'timeline' || reducedMotion) return

    const workspace = sceneRef.current?.querySelector<HTMLElement>(
      '[data-workspace-variant="timeline"]'
    )
    if (!workspace) return

    const bounds = workspace.getBoundingClientRect()
    const top = window.scrollY + bounds.top
    const travel = Math.max(1, bounds.height - window.innerHeight * 0.58)
    const progress = (index + 0.5) / commands.length
    window.scrollTo({
      top: top + travel * progress - window.innerHeight * 0.22,
      behavior: 'smooth'
    })
  }

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null
      if (
        event.defaultPrevented ||
        event.metaKey ||
        event.ctrlKey ||
        event.altKey ||
        target?.matches('input, button, a, textarea, select, [contenteditable="true"]')
      ) {
        return
      }

      const scene = sceneRef.current
      if (!scene) return
      const bounds = scene.getBoundingClientRect()
      const center = window.innerHeight / 2
      if (bounds.top > center || bounds.bottom < center) return

      if (event.key === 'Enter') {
        event.preventDefault()
        advance()
      }
      if (event.key === 'ArrowRight') {
        event.preventDefault()
        selectOffset(1)
      }
      if (event.key === 'ArrowLeft') {
        event.preventDefault()
        selectOffset(-1)
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  })

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setReducedMotion(media.matches)
    update()
    media.addEventListener('change', update)
    return () => media.removeEventListener('change', update)
  }, [])

  useEffect(() => {
    const scene = sceneRef.current
    if (!scene) return

    const observer = new IntersectionObserver(
      ([entry]) => setSceneVisible(Boolean(entry?.isIntersecting)),
      { rootMargin: '-12% 0px -12% 0px', threshold: 0.12 }
    )
    observer.observe(scene)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (variant !== 'timeline' || reducedMotion) return

    const scene = sceneRef.current
    const workspace = scene?.querySelector<HTMLElement>('[data-workspace-variant="timeline"]')
    if (!workspace) return

    let frame = 0
    const updateFromScroll = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        const bounds = workspace.getBoundingClientRect()
        const travel = Math.max(1, bounds.height - window.innerHeight * 0.58)
        const travelled = window.innerHeight * 0.22 - bounds.top
        const progress = Math.min(0.999, Math.max(0, travelled / travel))
        const next = commands[Math.floor(progress * commands.length)]
        if (next) setActiveId((current) => (current === next.id ? current : next.id))
      })
    }

    updateFromScroll()
    window.addEventListener('scroll', updateFromScroll, { passive: true })
    window.addEventListener('resize', updateFromScroll)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', updateFromScroll)
      window.removeEventListener('resize', updateFromScroll)
    }
  }, [commands, reducedMotion, variant])

  useEffect(() => {
    const scene = sceneRef.current
    if (!scene || !sceneVisible || reducedMotion || (animateOnce && hasAnimated.current)) return

    const targets = Array.from(scene.querySelectorAll<HTMLElement>('[data-terminal-type="true"]'))
    const textNodes: Array<{ node: Text; content: string; lineIndex: number }> = []

    targets.forEach((target) => {
      target.setAttribute('aria-busy', 'true')
      const walker = document.createTreeWalker(target, NodeFilter.SHOW_TEXT)
      let lineIndex = 0
      let current = walker.nextNode()
      while (current) {
        const node = current as Text
        const content = node.textContent ?? ''
        if (content.trim()) {
          textNodes.push({ node, content, lineIndex })
          lineIndex += 1
        }
        current = walker.nextNode()
      }
    })

    if (!textNodes.length) return
    hasAnimated.current = true

    textNodes.forEach(({ node }) => {
      node.textContent = ''
    })

    const startedAt = performance.now()
    const characterDuration = 8
    const lineDelay = 70
    const totalDuration = textNodes.reduce(
      (longest, item) =>
        Math.max(longest, item.lineIndex * lineDelay + item.content.length * characterDuration),
      0
    )
    let frame = 0

    const render = (now: number) => {
      const elapsed = now - startedAt
      textNodes.forEach(({ node, content, lineIndex }) => {
        const visible = Math.min(
          content.length,
          Math.max(0, Math.floor((elapsed - lineIndex * lineDelay) / characterDuration))
        )
        node.textContent = content.slice(0, visible)
      })

      if (elapsed < totalDuration) {
        frame = requestAnimationFrame(render)
      } else {
        targets.forEach((target) => target.setAttribute('aria-busy', 'false'))
      }
    }

    frame = requestAnimationFrame(render)
    return () => {
      cancelAnimationFrame(frame)
      textNodes.forEach(({ node, content }) => {
        node.textContent = content
      })
      targets.forEach((target) => target.setAttribute('aria-busy', 'false'))
    }
  }, [activeId, animateOnce, reducedMotion, sceneVisible])

  if (!activeCommand) return null

  const commandControls = (
    <div className={styles.commands} role="toolbar" aria-label={`Comandos de ${title}`}>
      {commands.map((command, index) => {
        const selected = command.id === activeCommand.id

        return (
          <button
            aria-controls={`${id}-panel-${command.id}`}
            aria-pressed={selected}
            className={styles.commandButton}
            key={command.id}
            onClick={() => selectCommand(command.id, index)}
            type="button"
          >
            <span aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
            <span className={styles.commandCopy}>
              {command.label}
              {command.meta && <small>{command.meta}</small>}
            </span>
          </button>
        )
      })}
    </div>
  )

  return (
    <section
      ref={sceneRef}
      {...rootAttributes}
      className={`${styles.scene} ${className ?? ''}`}
      id={id}
      aria-labelledby={`${id}-title`}
      data-red-scene={horizontal ? undefined : true}
      data-red-type-scene={horizontal || undefined}
      data-projects-root={horizontal || undefined}
      data-terminal-scene
      data-variant={variant}
    >
      <div className={styles.chrome} aria-hidden="true">
        <span>SYS://MATRIX_TERMINAL</span>
        <span>SESSION_ACTIVE · 01</span>
      </div>
      <div className={styles.intro} data-red-reveal>
        <p className={styles.eyebrow}>{`// ${eyebrow}`}</p>
        <h2 id={`${id}-title`}>{title}</h2>
        {description && <p className={styles.description}>{description}</p>}
      </div>

      {variant === 'standard' && !horizontal && commands.length > 1 && (
        <div className={styles.sectionControls} data-red-reveal>
          <span aria-hidden="true">$ selecionar:</span>
          {commandControls}
        </div>
      )}

      <div
        className={styles.workspace}
        data-workspace-variant={variant}
        style={{ '--timeline-count': commands.length } as CSSProperties}
      >
        <div className={variant === 'timeline' ? styles.timelineStage : undefined}>
          {variant === 'timeline' && <div className={styles.timelineRail}>{commandControls}</div>}
          <div
            className={horizontal ? `${styles.viewport} ${viewportClassName ?? ''}` : undefined}
            data-projects-viewport={horizontal || undefined}
          >
            <div
              className={`${styles.panels} ${panelsClassName ?? ''}`}
              data-projects-track={horizontal || undefined}
            >
              {commands.map((command) => (
                <div
                  aria-hidden={
                    horizontal
                      ? false
                      : variant === 'timeline'
                        ? command.id !== activeCommand.id
                        : !reducedMotion && command.id !== activeCommand.id
                  }
                  className={`${styles.panel} ${panelClassName ?? ''}`}
                  data-active={command.id === activeCommand.id}
                  data-terminal-type={
                    horizontal || command.id === activeCommand.id ? 'true' : undefined
                  }
                  id={`${id}-panel-${command.id}`}
                  key={command.id}
                >
                  {command.panel}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
