import type { ReactNode } from 'react'
import styles from './styles.module.scss'

export function Terminal({ children }: { children: ReactNode }) {
  return (
    <section className={styles.terminal} aria-label="Terminal da Matrix" aria-live="polite">
      <div className={styles.terminalChrome} aria-hidden="true">
        <span>SYS://UNKNOWN</span>
        <span>CH. 84</span>
      </div>
      <div className={styles.terminalOutput}>{children}</div>
    </section>
  )
}

export function TerminalContinue({
  onContinue,
  prompt,
  touchLabel
}: {
  onContinue: () => void
  prompt: string
  touchLabel: string
}) {
  return (
    <div className={styles.continueBlock}>
      <p className={styles.continuePrompt}>
        {prompt}
        <span className={styles.cursor} aria-hidden="true" />
      </p>
      <button className={styles.touchContinue} type="button" onClick={onContinue}>
        {touchLabel}
      </button>
    </div>
  )
}
