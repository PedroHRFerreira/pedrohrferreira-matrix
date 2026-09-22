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

export const EXPERIENCE_STORAGE_KEY = 'portfolio:last-reality'

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

function persistedReality(): Reality | null {
  try {
    const reality = window.localStorage.getItem(EXPERIENCE_STORAGE_KEY)
    return reality === 'red' || reality === 'blue' ? reality : null
  } catch {
    return null
  }
}

export function useExperience(): ExperienceController {
  const [state, dispatch] = useReducer(experienceReducer, INITIAL_EXPERIENCE_STATE)

  useEffect(() => {
    const reality = persistedReality()
    if (reality) {
      dispatch({ type: 'REALITY_RESTORED', reality })
      return
    }

    if (
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      dispatch({ type: 'INTRODUCTION_SKIPPED' })
    }
  }, [])

  useEffect(() => {
    const reality = realityForState(state)
    if (!reality || (state !== 'ready-red' && state !== 'ready-blue')) return

    try {
      window.localStorage.setItem(EXPERIENCE_STORAGE_KEY, reality)
    } catch {
      // Storage can be unavailable in private browsing or restricted embeds.
    }
  }, [state])

  const advanceSequence = useCallback(() => dispatch({ type: 'SEQUENCE_ADVANCED' }), [])
  const reviewChoice = useCallback(() => {
    try {
      window.localStorage.removeItem(EXPERIENCE_STORAGE_KEY)
    } catch {
      // The state transition remains available when storage is restricted.
    }

    dispatch({ type: 'CHOICE_REVIEWED' })
  }, [])
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
