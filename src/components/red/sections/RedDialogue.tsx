'use client'

import { useEffect, useRef, useState } from 'react'

import styles from './RedDialogue.module.scss'

const exchange = [
  {
    command: 'Quem é Pedro?',
    answer:
      'Um engenheiro de software que conecta produto, arquitetura e execução — da primeira interface ao sistema em produção.'
  },
  {
    command: 'Como ele constrói?',
    answer:
      'Com sistemas modulares, código testável e escolhas técnicas guiadas pelo problema. Cada camada precisa conversar com a próxima.'
  },
  {
    command: 'Próxima camada',
    answer: 'Arquitetura carregada. Role para explorar as tecnologias que sustentam esses projetos.'
  }
]

export function RedDialogue() {
  const sectionRef = useRef<HTMLElement>(null)
  const [active, setActive] = useState(0)
  const [visible, setVisible] = useState(false)
  const [typed, setTyped] = useState<string | null>(null)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) setVisible(true)
      },
      { threshold: 0.3 }
    )
    observer.observe(section)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!visible) return
    const answer = exchange[active].answer
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let character = 0
    const timer = window.setInterval(() => {
      character = Math.min(answer.length, character + 2)
      setTyped(answer.slice(0, character))
      if (character === answer.length) window.clearInterval(timer)
    }, 24)
    return () => window.clearInterval(timer)
  }, [active, visible])

  const choose = (index: number) => {
    setTyped(null)
    setActive(index)
  }

  return (
    <section
      id="dialogue"
      className={styles.section}
      ref={sectionRef}
      aria-labelledby="dialogue-title"
    >
      <div className={styles.heading}>
        <p>{'// CANAL ABERTO / CONVERSA COM O SISTEMA'}</p>
        <h2 id="dialogue-title">Por trás do código, existe uma conversa.</h2>
      </div>
      <div className={styles.terminal}>
        <div className={styles.bar}>
          <span className={styles.lights}>● ● ●</span>
          <span>mainframe@pedro:~/identity</span>
          <span>ONLINE</span>
        </div>
        <div className={styles.commands} role="group" aria-label="Perguntas ao sistema">
          {exchange.map((item, index) => (
            <button
              type="button"
              key={item.command}
              aria-pressed={active === index}
              onClick={() => choose(index)}
            >
              {item.command}
            </button>
          ))}
        </div>
        <div className={styles.output} aria-live="polite" aria-atomic="true">
          <p className={styles.prompt}>
            visitor@matrix:~$ {exchange[active].command.toLowerCase()}
          </p>
          <p className={styles.answer}>
            {typed ?? exchange[active].answer}
            <span className={styles.cursor} aria-hidden="true" />
          </p>
        </div>
        <div className={styles.bottom}>
          <span>CONEXÃO ESTÁVEL</span>
          <span>↑ SELECIONE UMA PERGUNTA</span>
        </div>
      </div>
    </section>
  )
}
