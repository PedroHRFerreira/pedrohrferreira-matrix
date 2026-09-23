import { BluePageMotion } from '@/components/blue/effects/BluePageMotion/BluePageMotion'
import { BlueFooter } from '@/components/blue/effects/BlueFooter'
import { SkyBackground } from '@/components/blue/effects/SkyBackground'
import { MatrixRain } from '@/components/blue/effects/MatrixRain/MatrixRain'
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
}

export function BlueTemplate({ content }: BlueTemplateProps) {
  const blueNavigationOrder = ['about', 'projects', 'experience', 'stack', 'contact']
  const blueNavigation = [...content.navigation].sort(
    (a, b) => blueNavigationOrder.indexOf(a.id) - blueNavigationOrder.indexOf(b.id)
  )
  return (
    <div className={`${styles.shell} ${styles.blue}`} data-reality="blue">
      <SkyBackground className={styles.backdrop} />
      <MatrixRain />
      <BluePageMotion />
      <p className={styles.blueIntro} aria-hidden="true">
        Você escolheu permanecer na realidade...
      </p>
      <RealityNavigation
        items={blueNavigation}
        reality="blue"
        skipLabel={content.actions.skipToContent}
      />
      <CustomCursor reality="blue" />
      <HorizontalProjectsMotion />
      <main id="main-content" className={`${styles.main} ${styles.portfolio}`}>
        <BlueHero content={content} />
        <BlueAbout content={content} />
        <BlueProjects content={content} />
        <BlueExperience content={content} />
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
