import { RealityPassage } from '@/components/shared/RealityPassage/RealityPassage'

export function RedPassage({ onReconsider }: { onReconsider: () => void }) {
  return <RealityPassage onReconsider={onReconsider} />
}
