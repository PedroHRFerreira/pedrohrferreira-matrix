import { MatrixRain } from '@/components/red/effects/MatrixRain'
import { RedFooter } from '@/components/red/effects/RedFooter'
import { RedAbout, RedExperience, RedHero, RedProjects, RedStack } from '@/components/red/sections'
import { CustomCursor } from '@/components/shared/CustomCursor'
import { HorizontalProjectsMotion } from '@/components/shared/HorizontalProjectsMotion'
import { RealityNavigation } from '@/components/shared/RealityNavigation'
import type { PortfolioContent } from '@/types'

import styles from './styles.module.scss'

interface RedTemplateProps {
  content: PortfolioContent
  onReviewChoice: () => void
}

export function RedTemplate({ content, onReviewChoice }: RedTemplateProps) {
  return (
    <div className={`${styles.shell} ${styles.red}`} data-reality="red">
      <MatrixRain className={styles.backdrop} />
      <RealityNavigation
        items={content.navigation.filter((item) => item.id !== 'contact')}
        reality="red"
      />
      <button className={styles.reviewChoice} type="button" onClick={onReviewChoice}>
        {content.actions.reviewChoice}
      </button>
      <CustomCursor reality="red" />
      <HorizontalProjectsMotion />
      <main id="main-content" className={`${styles.main} ${styles.portfolio}`}>
        <RedHero content={content} />
        <RedAbout content={content} />
        <RedExperience content={content} />
        <RedProjects content={content} />
        <RedStack content={content} />
      </main>
      <RedFooter
        message={content.footer.closingMessage}
        copyright={content.footer.copyright}
        contacts={content.contacts}
        name={content.profile.name}
        role={content.profile.role}
        resume={content.actions.resume}
      />
    </div>
  )
}
