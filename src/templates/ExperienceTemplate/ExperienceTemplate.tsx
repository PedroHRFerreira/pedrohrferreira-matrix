'use client'

import { EntryExperience } from '@/components/shared/EntryExperience'
import { getPortfolioContent } from '@/config'
import { useExperience } from '@/hooks/useExperience'

import { BlueTemplate } from './BlueTemplate'
import { RedTemplate } from './RedTemplate'

export function ExperienceTemplate() {
  const experience = useExperience()
  const content = getPortfolioContent()

  if (experience.state === 'ready-red') {
    return <RedTemplate content={content} onReviewChoice={experience.reviewChoice} />
  }

  if (experience.state === 'ready-blue') {
    return <BlueTemplate content={content} onReviewChoice={experience.reviewChoice} />
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
