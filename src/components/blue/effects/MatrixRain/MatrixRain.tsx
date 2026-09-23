'use client'

import { useEffect, useRef } from 'react'
import styles from './styles.module.scss'

const binary = '010011010110100101001101'.split('').join('\n')

export function MatrixRain() {
  const rainRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const update = () => {
      if (rainRef.current) rainRef.current.dataset.paused = String(document.hidden)
    }
    const column = rainRef.current?.querySelector<HTMLElement>('pre')
    if (column) column.style.left = `${3 + Math.random() * 92}%`
    update()
    document.addEventListener('visibilitychange', update)
    return () => document.removeEventListener('visibilitychange', update)
  }, [])

  return (
    <div className={styles.rain} ref={rainRef} aria-hidden="true">
      <pre
        className={styles.codeColumn}
        onAnimationIteration={(event) => {
          event.currentTarget.style.left = `${3 + Math.random() * 92}%`
          event.currentTarget.textContent = Array.from({ length: 24 }, () =>
            Math.random() < 0.5 ? '0' : '1'
          ).join('\n')
        }}
      >
        {binary}
      </pre>
    </div>
  )
}
