'use client'

import { useEffect, useRef, useState, useSyncExternalStore, type ReactNode } from 'react'

import styles from './mobileTv.module.scss'

const mobileQuery = '(max-width: 48rem), (pointer: coarse)'
const landscapeQuery = '(orientation: landscape)'
const subscribeMobile = (notify: () => void) => {
  const media = window.matchMedia?.(mobileQuery)
  media?.addEventListener('change', notify)
  return () => media?.removeEventListener('change', notify)
}
const mobileSnapshot = () => window.matchMedia?.(mobileQuery).matches ?? false
const serverSnapshot = () => null

type LockableOrientation = ScreenOrientation & {
  lock?: (orientation: 'landscape') => Promise<void>
}

interface ImmersionSession {
  cancelled: boolean
  lockRequested: boolean
  orientation: LockableOrientation | undefined
  root: HTMLDivElement
}

function releaseSession(session: ImmersionSession) {
  session.cancelled = true
  try {
    if (session.lockRequested) session.orientation?.unlock?.()
  } catch {
    // A browser may revoke orientation access while leaving fullscreen.
  }
  if (document.fullscreenElement === session.root) {
    void document.exitFullscreen?.().catch(() => {})
  }
}

/** The fullscreen owner stays mounted across TV scenes and leaves with the TV. */
export function MobileTvExperience({ children }: { children: ReactNode }) {
  const mobile = useSyncExternalStore(subscribeMobile, mobileSnapshot, serverSnapshot)
  const [phase, setPhase] = useState<'idle' | 'rotate' | 'playing'>('idle')
  const rootRef = useRef<HTMLDivElement>(null)
  const actionRef = useRef<HTMLButtonElement>(null)
  const sessionRef = useRef<ImmersionSession | null>(null)
  const playing = mobile === false || phase === 'playing'

  useEffect(() => {
    const media = window.matchMedia?.(landscapeQuery)
    const mobileMedia = window.matchMedia?.(mobileQuery)
    const onDesktop = () => {
      if (mobileMedia?.matches === false) setPhase('playing')
    }
    const onRotate = () => {
      if (media?.matches) setPhase((current) => (current === 'rotate' ? 'playing' : current))
    }
    onDesktop()
    mobileMedia?.addEventListener('change', onDesktop)
    media?.addEventListener('change', onRotate)
    return () => {
      mobileMedia?.removeEventListener('change', onDesktop)
      media?.removeEventListener('change', onRotate)
    }
  }, [])

  useEffect(() => {
    if (!playing) actionRef.current?.focus({ preventScroll: true })
  }, [phase, playing])

  useEffect(() => {
    const rootOverflow = document.documentElement.style.overflow
    const bodyOverflow = document.body.style.overflow
    document.documentElement.style.overflow = 'hidden'
    document.body.style.overflow = 'hidden'
    return () => {
      document.documentElement.style.overflow = rootOverflow
      document.body.style.overflow = bodyOverflow
      if (sessionRef.current) releaseSession(sessionRef.current)
    }
  }, [])

  const start = async () => {
    const root = rootRef.current
    if (!root || sessionRef.current) return
    const session: ImmersionSession = {
      cancelled: false,
      lockRequested: false,
      orientation: window.screen.orientation,
      root
    }
    sessionRef.current = session
    setPhase(window.matchMedia(landscapeQuery).matches ? 'playing' : 'rotate')

    try {
      // Fullscreen must be requested directly from the user's tap.
      if (root.requestFullscreen && !document.fullscreenElement) {
        await root.requestFullscreen()
      }
      if (session.cancelled) {
        releaseSession(session)
        return
      }
      if (session.orientation?.lock) {
        session.lockRequested = true
        await session.orientation.lock('landscape')
      }
    } catch {
      // Unsupported or denied requests leave the manual rotation prompt usable.
    }
    if (session.cancelled) releaseSession(session)
    else if (window.matchMedia(landscapeQuery).matches) setPhase('playing')
  }

  const continuePortrait = () => {
    if (sessionRef.current) releaseSession(sessionRef.current)
    setPhase('playing')
  }

  return (
    <div className={styles.frame} ref={rootRef} data-tv-immersion>
      {playing ? (
        children
      ) : (
        <main className={styles.gate} aria-labelledby="tv-start-title">
          <div className={styles.card}>
            <p className={styles.channel}>SYS://UNKNOWN · CH. 84</p>
            <svg className={styles.phone} viewBox="0 0 80 80" fill="none" aria-hidden="true">
              <rect x="26" y="16" width="28" height="48" rx="5" />
              <path d="M36 56h8M14 39a26 26 0 0 1 41-21m0-9v9h9M66 41a26 26 0 0 1-41 21m0 9v-9h-9" />
            </svg>
            <h1 id="tv-start-title">
              {phase === 'idle' ? 'Entre na experiência' : 'Gire o celular'}
            </h1>
            <p className={styles.description}>
              {phase === 'idle'
                ? 'A transmissão começa em tela cheia, na horizontal, quando seu celular permitir.'
                : 'Deixe o celular na horizontal para acompanhar a transmissão da TV.'}
            </p>
            {phase === 'idle' ? (
              <button className={styles.start} type="button" ref={actionRef} onClick={start}>
                Iniciar
              </button>
            ) : (
              <button
                className={styles.continue}
                type="button"
                ref={actionRef}
                onClick={continuePortrait}
              >
                Continuar na vertical
              </button>
            )}
            <p className={styles.hint}>Ao entrar no portfólio, a orientação será liberada.</p>
          </div>
        </main>
      )}
    </div>
  )
}
