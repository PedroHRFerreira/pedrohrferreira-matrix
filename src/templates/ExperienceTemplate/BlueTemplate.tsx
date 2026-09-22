import { BlueFooter } from '@/components/blue/effects/BlueFooter'
import { SkyBackground } from '@/components/blue/effects/SkyBackground'
import {
  BlueAbout,
  BlueContact,
  BlueExperience,
  BlueHero,
  BlueProjects,
  BlueStack
} from '@/components/blue/sections'
import { CustomCursor } from '@/components/shared/CustomCursor'
import { HorizontalProjectsMotion } from '@/components/shared/HorizontalProjectsMotion'
import { RealityNavigation } from '@/components/shared/RealityNavigation'
import type { PortfolioContent } from '@/types'

import styles from './styles.module.scss'

interface BlueTemplateProps {
  content: PortfolioContent
  onReviewChoice: () => void
}

export function BlueTemplate({ content, onReviewChoice }: BlueTemplateProps) {
  return (
    <div className={`${styles.shell} ${styles.blue}`} data-reality="blue">
      <SkyBackground className={styles.backdrop} />
      <RealityNavigation items={content.navigation} reality="blue" />
      <button className={styles.reviewChoice} type="button" onClick={onReviewChoice}>
        {content.actions.reviewChoice}
      </button>
      <CustomCursor reality="blue" />
      <HorizontalProjectsMotion />
      <main id="main-content" className={`${styles.main} ${styles.portfolio}`}>
        <BlueHero content={content} />
        <BlueAbout content={content} />
        <BlueExperience content={content} />
        <BlueProjects content={content} />
        <BlueStack content={content} />
        <BlueContact content={content} />
      </main>
      <BlueFooter
        message={content.footer.closingMessage}
        copyright={content.footer.copyright}
        contacts={content.contacts}
      />
    </div>
  )
}
