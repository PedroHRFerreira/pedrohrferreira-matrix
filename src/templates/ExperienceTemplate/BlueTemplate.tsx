'use client'

import { useEffect, useRef, useState } from 'react'
import { StormAtmosphere } from '@/components/zion/StormAtmosphere'
import { BlueArrival } from '@/components/blue/effects/BlueArrival/BlueArrival'
import { BluePageMotion } from '@/components/blue/effects/BluePageMotion/BluePageMotion'
import { BlueFooter } from '@/components/blue/effects/BlueFooter'
import { SkyBackground } from '@/components/blue/effects/SkyBackground'
import { MatrixRain } from '@/components/blue/effects/MatrixRain/MatrixRain'
import {
  BlueAbout,
  BlueContact,
  BlueExperience,
  BlueHero,
  BlueProjects,
  BlueStack
} from '@/components/blue/sections'
import { CustomCursor } from '@/components/shared/CustomCursor'
import { HorizontalProjectsMotion } from '@/components/shared/HorizontalProjectsMotion'
import { RealityNavigation } from '@/components/shared/RealityNavigation'
import type { PortfolioContent } from '@/types'

import styles from './styles.module.scss'

interface BlueTemplateProps {
  content: PortfolioContent
  onReconsider: () => void
  onCapture: () => void
  captureCount: number
  corrupted: boolean
}

export function BlueTemplate({
  content,
  onReconsider,
  onCapture,
  captureCount,
  corrupted
}: BlueTemplateProps) {
  const corruptionLevel = Math.min(captureCount, 3)
  const corruptionMessage = [
    '',
    'SINAL DETECTADO — A Matrix percebeu você.',
    'INTEGRIDADE COMPROMETIDA — Ela está reagindo.',
    'CONTROLE ASSUMIDO — O sonho está se desfazendo.'
  ][corruptionLevel]
  const [paused, setPaused] = useState(false)
  const shellRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (corrupted) return
    shellRef.current
      ?.querySelectorAll<HTMLElement>('main *, nav *, footer *')
      .forEach((element) => {
        const computed = getComputedStyle(element)
        if (computed.color === 'rgb(0, 0, 0)') element.dataset.originalBlack = 'true'
        const channels = computed.backgroundColor.match(/[\d.]+/g)?.map(Number)
        if (
          channels &&
          channels.length >= 3 &&
          (channels[3] ?? 1) > 0 &&
          Math.min(...channels.slice(0, 3)) > 130
        ) {
          element.dataset.lightSurface = 'true'
        }
      })
  }, [corrupted])
  const visibleContent = corrupted
    ? {
        ...content,
        sections: {
          ...content.sections,
          about: { ...content.sections.about, title: 'Há algo por trás desta interface' },
          projects: { ...content.sections.projects, eyebrow: 'EVIDÊNCIAS DO MUNDO EXTERIOR' },
          contact: { ...content.sections.contact, title: 'Ainda existe alguém do outro lado.' }
        }
      }
    : corruptionLevel >= 2
      ? {
          ...content,
          sections: {
            ...content.sections,
            about: { ...content.sections.about, title: 'Há alg̷o por trás desta interface' }
          }
        }
      : content
  const blueNavigationOrder = ['about', 'projects', 'experience', 'stack', 'contact']
  const blueNavigation = [...content.navigation].sort(
    (a, b) => blueNavigationOrder.indexOf(a.id) - blueNavigationOrder.indexOf(b.id)
  )
  return (
    <div
      ref={shellRef}
      className={`${styles.shell} ${styles.blue}`}
      data-reality="blue"
      data-corrupted={corrupted}
      data-captures={captureCount}
      data-corruption-level={corruptionLevel}
      data-corruption-percent={[0, 15, 40, 85][corruptionLevel]}
      data-effects-paused={paused}
    >
      <SkyBackground className={styles.backdrop} corrupted={corrupted} paused={paused} />
      <MatrixRain corrupted={corrupted} level={corruptionLevel} paused={paused} />
      {corruptionLevel > 0 && (
        <div className={styles.corruptionVeil} aria-hidden="true">
          <div key={corruptionLevel} className={styles.corruptionPulse} />
          <span className={styles.systemSignal} key={`signal-${corruptionLevel}`}>
            {corruptionMessage}
          </span>
        </div>
      )}
      {corruptionLevel > 0 && (
        <>
          {corrupted && <StormAtmosphere paused={paused} className={styles.blueStorm} />}
          <p className={styles.corruptionNotice} role="status">
            {corruptionMessage}
          </p>
        </>
      )}
      <BluePageMotion />
      <BlueArrival />
      <p className={styles.blueIntro} aria-hidden="true">
        Sonhei um sonho, mas agora esse sonho se foi.
      </p>
      <RealityNavigation
        items={blueNavigation}
        reality="blue"
        skipLabel={content.actions.skipToContent}
      />
      <CustomCursor reality="blue" />
      <HorizontalProjectsMotion />
      <main id="main-content" className={`${styles.main} ${styles.portfolio}`}>
        <BlueHero content={visibleContent} />
        <BlueAbout content={visibleContent} />
        <BlueProjects content={visibleContent} />
        <BlueExperience content={visibleContent} />
        <BlueStack content={visibleContent} />
        <BlueContact content={visibleContent} />
      </main>
      <BlueFooter
        onReconsider={onReconsider}
        message={
          corrupted
            ? 'Este lugar não consegue mais esconder o que existe lá fora.'
            : content.footer.closingMessage
        }
        onCapture={onCapture}
        captureCount={captureCount}
        copyright={content.footer.copyright}
        contacts={content.contacts}
      />
    </div>
  )
}
