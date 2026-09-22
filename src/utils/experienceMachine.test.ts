import { describe, expect, it } from 'vitest'

import {
  applyExperienceEvent,
  canChooseReality,
  INITIAL_EXPERIENCE_STATE,
  realityForState,
  transitionExperience
} from './experienceMachine'

describe('experience state machine', () => {
  it('follows the complete initialization protocol before choosing red', () => {
    let state = INITIAL_EXPERIENCE_STATE
    const expectedStates = [
      'static-noise',
      'signal-reveal',
      'terminal-connecting',
      'initial-message',
      'waiting-first-enter',
      'reality-question',
      'waiting-second-enter',
      'pill-selection'
    ] as const

    expectedStates.forEach((expectedState) => {
      state = transitionExperience(state, { type: 'SEQUENCE_ADVANCED' })
      expect(state).toBe(expectedState)
    })

    state = transitionExperience(state, { type: 'REALITY_CHOSEN', reality: 'red' })
    state = transitionExperience(state, { type: 'TRANSITION_COMPLETED' })

    expect(state).toBe('ready-red')
    expect(realityForState(state)).toBe('red')
  })

  it('advances completed typing once and rejects sequence advances at selection', () => {
    expect(
      applyExperienceEvent('initial-message', {
        type: 'SEQUENCE_ADVANCED'
      })
    ).toEqual({ accepted: true, state: 'waiting-first-enter' })

    expect(
      applyExperienceEvent('pill-selection', {
        type: 'SEQUENCE_ADVANCED'
      })
    ).toEqual({ accepted: false, state: 'pill-selection' })
  })

  it('accepts a choice only in pill selection and blocks a second choice', () => {
    expect(canChooseReality('pill-selection')).toBe(true)
    const invalidChoice = applyExperienceEvent('waiting-second-enter', {
      type: 'REALITY_CHOSEN',
      reality: 'red'
    })
    expect(invalidChoice.accepted).toBe(false)

    const firstChoice = applyExperienceEvent('pill-selection', {
      type: 'REALITY_CHOSEN',
      reality: 'red'
    })
    const secondChoice = applyExperienceEvent(firstChoice.state, {
      type: 'REALITY_CHOSEN',
      reality: 'blue'
    })

    expect(firstChoice.state).toBe('transitioning-red')
    expect(secondChoice).toEqual({ accepted: false, state: 'transitioning-red' })
  })

  it('resets any active experience to the cold boot', () => {
    expect(applyExperienceEvent('ready-blue', { type: 'RESET' })).toEqual({
      accepted: true,
      state: 'cold-boot'
    })
  })

  it('reviews a completed choice by resetting before skipping the introduction', () => {
    const review = applyExperienceEvent('ready-red', { type: 'CHOICE_REVIEWED' })

    expect(review).toEqual({ accepted: true, state: 'pill-selection' })
    expect(canChooseReality(review.state)).toBe(true)
  })

  it('skips the introduction while preserving an explicit reality choice', () => {
    expect(applyExperienceEvent('cold-boot', { type: 'INTRODUCTION_SKIPPED' })).toEqual({
      accepted: true,
      state: 'pill-selection'
    })
    expect(applyExperienceEvent('pill-selection', { type: 'INTRODUCTION_SKIPPED' })).toEqual({
      accepted: false,
      state: 'pill-selection'
    })
  })
})
