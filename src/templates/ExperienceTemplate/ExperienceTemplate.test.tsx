import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { getPortfolioContent } from '@/config'
import type { ExperienceController } from '@/hooks/useExperience'

const mocks = vi.hoisted(() => ({
  useExperience: vi.fn<() => ExperienceController>(),
  entry: vi.fn(),
  red: vi.fn(),
  blue: vi.fn(),
  zion: vi.fn(),
  sequence: vi.fn()
}))

vi.mock('@/hooks/useExperience', () => ({ useExperience: mocks.useExperience }))
vi.mock('@/components/shared/EntryExperience', () => ({
  EntryExperience: (props: unknown) => {
    mocks.entry(props)
    return <div data-testid="entry" />
  }
}))
vi.mock('./RedTemplate', () => ({
  RedTemplate: (props: unknown) => {
    mocks.red(props)
    return <div data-testid="red-tree" />
  }
}))
vi.mock('./BlueTemplate', () => ({
  BlueTemplate: (props: unknown) => {
    mocks.blue(props)
    return <div data-testid="blue-tree" />
  }
}))

vi.mock('./ZionTemplate', () => ({
  ZionTemplate: (props: unknown) => {
    mocks.zion(props)
    return <div data-testid="zion" />
  }
}))
vi.mock('@/components/shared/ZionSequence/ZionSequence', () => ({
  ZionSequence: (props: unknown) => {
    mocks.sequence(props)
    return <div data-testid="zion-sequence" />
  }
}))

import { ExperienceTemplate } from './ExperienceTemplate'

afterEach(cleanup)

const noop = () => undefined

function controller(
  state: ExperienceController['state'],
  reality: ExperienceController['reality']
): ExperienceController {
  return {
    state,
    reality,
    blueCaptureCount: 0,
    blueCorrupted: false,
    registerBlueCapture: noop,
    completeZionChase: noop,
    canChoose: state === 'pill-selection',
    advanceSequence: noop,
    chooseReality: noop,
    reconsiderReality: () => undefined,
    completeTransition: noop
  }
}

describe('ExperienceTemplate', () => {
  beforeEach(() => {
    cleanup()
    mocks.useExperience.mockReset()
    mocks.entry.mockReset()
    mocks.red.mockReset()
    mocks.blue.mockReset()
  })

  it('keeps the entry mounted throughout pre-ready states', () => {
    mocks.useExperience.mockReturnValue(controller('transitioning-red', 'red'))
    render(<ExperienceTemplate />)

    expect(screen.getByTestId('entry')).toBeInTheDocument()
    expect(screen.queryByTestId('red-tree')).not.toBeInTheDocument()
    expect(mocks.entry).toHaveBeenCalledWith(
      expect.objectContaining({
        content: getPortfolioContent()
      })
    )
  })

  it.each([
    ['ready-red', 'red', 'red-tree', 'blue-tree'],
    ['ready-blue', 'blue', 'blue-tree', 'red-tree']
  ] as const)('mounts only the selected tree in %s', (state, reality, present, absent) => {
    mocks.useExperience.mockReturnValue(controller(state, reality))
    render(<ExperienceTemplate />)

    expect(screen.getByTestId(present)).toBeInTheDocument()
    expect(screen.queryByTestId(absent)).not.toBeInTheDocument()
    expect(screen.queryByTestId('entry')).not.toBeInTheDocument()
  })
})

it.each(['blue-revelation-one', 'blue-revelation-two', 'zion-chase', 'zion-loading'] as const)(
  'routes %s into the TV sequence',
  (state) => {
    mocks.useExperience.mockReturnValue(controller(state, null))
    render(<ExperienceTemplate />)
    expect(screen.getByTestId('zion-sequence')).toBeInTheDocument()
    expect(screen.queryByTestId('entry')).not.toBeInTheDocument()
  }
)
it('mounts the new portfolio after escaping', () => {
  mocks.useExperience.mockReturnValue(controller('ready-zion', null))
  render(<ExperienceTemplate />)
  expect(screen.getByTestId('zion')).toBeInTheDocument()
})
