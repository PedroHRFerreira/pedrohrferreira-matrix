import type { ExperienceState, Reality } from '@/types/portfolio'

export type ExperienceEvent =
  | { type: 'SEQUENCE_ADVANCED' }
  | { type: 'INTRODUCTION_SKIPPED' }
  | { type: 'REALITY_CHOSEN'; reality: Reality }
  | { type: 'TRANSITION_COMPLETED' }
  | { type: 'RESET' }

export interface TransitionResult {
  accepted: boolean
  state: ExperienceState
}

export const INITIAL_EXPERIENCE_STATE: ExperienceState = 'cold-boot'

const sequenceState: Partial<Record<ExperienceState, ExperienceState>> = {
  'cold-boot': 'static-noise',
  'static-noise': 'signal-reveal',
  'signal-reveal': 'terminal-connecting',
  'terminal-connecting': 'initial-message',
  'initial-message': 'waiting-first-enter',
  'waiting-first-enter': 'reality-question',
  'reality-question': 'waiting-second-enter',
  'waiting-second-enter': 'pill-selection'
}

const completedTransitionState: Partial<Record<ExperienceState, ExperienceState>> = {
  'transitioning-red': 'ready-red',
  'transitioning-blue': 'ready-blue'
}

/**
 * Applies one protocol event without side effects. Invalid or repeated events
 * preserve the current state, preventing queued Enter presses from skipping steps.
 */
export function applyExperienceEvent(
  state: ExperienceState,
  event: ExperienceEvent
): TransitionResult {
  if (event.type === 'RESET') {
    return {
      accepted: state !== INITIAL_EXPERIENCE_STATE,
      state: INITIAL_EXPERIENCE_STATE
    }
  }

  if (event.type === 'INTRODUCTION_SKIPPED') {
    const introductionState =
      state === 'cold-boot' ||
      state === 'static-noise' ||
      state === 'signal-reveal' ||
      state === 'terminal-connecting' ||
      state === 'initial-message' ||
      state === 'waiting-first-enter' ||
      state === 'reality-question' ||
      state === 'waiting-second-enter'

    if (introductionState) return { accepted: true, state: 'pill-selection' }
  }

  if (event.type === 'SEQUENCE_ADVANCED') {
    const nextState = sequenceState[state]
    if (nextState) return { accepted: true, state: nextState }
  }

  if (state === 'pill-selection' && event.type === 'REALITY_CHOSEN') {
    return {
      accepted: true,
      state: event.reality === 'red' ? 'transitioning-red' : 'transitioning-blue'
    }
  }

  if (event.type === 'TRANSITION_COMPLETED') {
    const nextState = completedTransitionState[state]
    if (nextState) return { accepted: true, state: nextState }
  }

  return { accepted: false, state }
}

export function transitionExperience(
  state: ExperienceState,
  event: ExperienceEvent
): ExperienceState {
  return applyExperienceEvent(state, event).state
}

export function canChooseReality(state: ExperienceState): boolean {
  return state === 'pill-selection'
}

export function realityForState(state: ExperienceState): Reality | null {
  if (state.endsWith('-red')) return 'red'
  if (state.endsWith('-blue')) return 'blue'
  return null
}
