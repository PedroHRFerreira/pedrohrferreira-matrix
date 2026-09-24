'use client'

import { useEffect } from 'react'
import { ZionSequence } from '@/components/shared/ZionSequence/ZionSequence'
import { ZionTemplate } from './ZionTemplate'
import { EntryExperience } from '@/components/shared/EntryExperience'
import { getPortfolioContent } from '@/config'
import { useExperience } from '@/hooks/useExperience'
import { useMotionVisibility } from '@/hooks/useMotionVisibility'

import { BlueTemplate } from './BlueTemplate'
import { RedTemplate } from './RedTemplate'

export function ExperienceTemplate() {
  const experience = useExperience()
  useMotionVisibility(experience.state)
  const content = getPortfolioContent()
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [experience.state])

  if (experience.state === 'ready-zion') return <ZionTemplate content={content} />
  if (
    experience.state === 'blue-revelation-one' ||
    experience.state === 'blue-revelation-two' ||
    experience.state === 'zion-chase' ||
    experience.state === 'zion-loading'
  ) {
    return (
      <ZionSequence
        state={experience.state}
        onAdvance={experience.advanceSequence}
        onEscape={experience.completeZionChase}
        onLoaded={experience.completeTransition}
      />
    )
  }

  if (experience.state === 'ready-red') {
    return <RedTemplate content={content} onReconsider={experience.reconsiderReality} />
  }

  if (experience.state === 'ready-blue') {
    return (
      <BlueTemplate
        content={content}
        onReconsider={experience.reconsiderReality}
        captureCount={experience.blueCaptureCount}
        corrupted={experience.blueCorrupted}
        onCapture={experience.registerBlueCapture}
      />
    )
  }

  return (
    <EntryExperience
      content={content}
      state={experience.state}
      onAdvanceSequence={experience.advanceSequence}
      onChooseReality={experience.chooseReality}
      onTransitionComplete={experience.completeTransition}
    />
  )
}
