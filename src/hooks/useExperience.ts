'use client'

import { useCallback, useEffect, useReducer } from 'react'

import type { ExperienceState, Reality } from '@/types'
import {
  canChooseReality,
  INITIAL_EXPERIENCE_STATE,
  realityForState,
  transitionExperience,
  type ExperienceEvent
} from '@/utils/experienceMachine'

export interface ExperienceController {
  state: ExperienceState
  reality: Reality | null
  canChoose: boolean
  advanceSequence: () => void
  reviewChoice: () => void
  chooseReality: (reality: Reality) => void
  completeTransition: () => void
}

function experienceReducer(state: ExperienceState, event: ExperienceEvent): ExperienceState {
  return transitionExperience(state, event)
}

export function useExperience(): ExperienceController {
  const [state, dispatch] = useReducer(experienceReducer, INITIAL_EXPERIENCE_STATE)

  useEffect(() => {
    if (
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      dispatch({ type: 'INTRODUCTION_SKIPPED' })
    }
  }, [])

  const advanceSequence = useCallback(() => dispatch({ type: 'SEQUENCE_ADVANCED' }), [])
  const reviewChoice = useCallback(() => dispatch({ type: 'CHOICE_REVIEWED' }), [])
  const chooseReality = useCallback(
    (reality: Reality) => dispatch({ type: 'REALITY_CHOSEN', reality }),
    []
  )
  const completeTransition = useCallback(() => dispatch({ type: 'TRANSITION_COMPLETED' }), [])
  const reality = realityForState(state)

  return {
    state,
    reality,
    canChoose: canChooseReality(state),
    advanceSequence,
    reviewChoice,
    chooseReality,
    completeTransition
  }
}
