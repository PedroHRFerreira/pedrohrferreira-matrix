'use client'

import { useCallback, useEffect, useReducer } from 'react'

import type { ExperienceState, Reality } from '@/types'
import {
  canChooseReality,
  INITIAL_EXPERIENCE_JOURNEY,
  realityForState,
  transitionJourney
} from '@/utils/experienceMachine'

export interface ExperienceController {
  state: ExperienceState
  reality: Reality | null
  canChoose: boolean
  blueCaptureCount: number
  blueCorrupted: boolean
  registerBlueCapture: () => void
  completeZionChase: () => void
  advanceSequence: () => void
  chooseReality: (reality: Reality) => void
  completeTransition: () => void
  reconsiderReality: () => void
}

export function useExperience(): ExperienceController {
  const [journey, dispatch] = useReducer(transitionJourney, INITIAL_EXPERIENCE_JOURNEY)
  const { state, blueCaptureCount } = journey

  useEffect(() => {
    if (
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      dispatch({ type: 'INTRODUCTION_SKIPPED' })
    }
  }, [])

  const registerBlueCapture = useCallback(() => dispatch({ type: 'BLUE_CAPTURED' }), [])
  const completeZionChase = useCallback(() => dispatch({ type: 'ZION_CHASE_COMPLETED' }), [])
  const advanceSequence = useCallback(() => dispatch({ type: 'SEQUENCE_ADVANCED' }), [])
  const chooseReality = useCallback(
    (reality: Reality) => dispatch({ type: 'REALITY_CHOSEN', reality }),
    []
  )
  const completeTransition = useCallback(() => dispatch({ type: 'TRANSITION_COMPLETED' }), [])
  const reconsiderReality = useCallback(() => {
    dispatch({ type: 'RECONSIDER' })
    window.history.replaceState(null, '', window.location.pathname)
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [])
  const reality = realityForState(state)

  return {
    state,
    reality,
    blueCaptureCount,
    blueCorrupted: blueCaptureCount >= 3,
    registerBlueCapture,
    completeZionChase,
    canChoose: canChooseReality(state),
    advanceSequence,
    chooseReality,
    completeTransition,
    reconsiderReality
  }
}
