import { MatrixRain } from '@/components/red/effects/MatrixRain'
import { RedPassage } from '@/components/red/effects/RedPassage/RedPassage'
import {
  RedAbout,
  RedContact,
  RedDialogue,
  RedExperience,
  RedHero,
  RedProjects,
  RedStack
} from '@/components/red/sections'
import { CustomCursor } from '@/components/shared/CustomCursor'
import { HorizontalProjectsMotion } from '@/components/shared/HorizontalProjectsMotion'
import { RealityNavigation } from '@/components/shared/RealityNavigation'
import type { NavigationItem, PortfolioContent } from '@/types'

import styles from './styles.module.scss'

interface RedTemplateProps {
  content: PortfolioContent
  onReconsider: () => void
}

const redNavigation: readonly NavigationItem[] = [
  { id: 'projects', label: '//PROJETOS' },
  { id: 'stack', label: '//STACK' },
  { id: 'dialogue', label: '//TERMINAL' },
  { id: 'about', label: '//DOSSIER' }
]

export function RedTemplate({ content, onReconsider }: RedTemplateProps) {
  return (
    <div className={`${styles.shell} ${styles.red}`} data-reality="red">
      <MatrixRain className={styles.backdrop} />
      <RealityNavigation items={redNavigation} reality="red" />
      <CustomCursor reality="red" />
      <HorizontalProjectsMotion />
      <main id="main-content" className={`${styles.main} ${styles.portfolio}`}>
        <RedHero content={content} />
        <RedAbout content={content} />
        <RedExperience content={content} />
        <RedProjects content={content} />
        <RedDialogue />
        <RedStack content={content} />
        <RedContact content={content} />
      </main>
      <RedPassage onReconsider={onReconsider} />
      <footer className={styles.redEnding}>
        <span>SYS://CONEXÃO_PERMANECE_ABERTA</span>
        <span>{content.footer.copyright}</span>
      </footer>
    </div>
  )
}
