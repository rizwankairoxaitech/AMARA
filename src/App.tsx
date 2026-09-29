import { useState, useCallback } from 'react'
import { LandingIntroTransition } from './components/cinematic/LandingIntroTransition'
import { CinematicScroll } from './components/cinematic/CinematicScroll'
import { ArchitecturalManifesto } from './components/sections/ArchitecturalManifesto'
import { ResidenceSpecifications } from './components/sections/ResidenceSpecifications'
import { PrivateConsultation } from './components/sections/PrivateConsultation'
import { LuxuryFooter } from './components/sections/LuxuryFooter'
import { CinematicProject } from './components/CinematicProject'
import { cinematicProjectsByProjectId } from './data/cinematicProjects'
import { projects } from './data/projects'

export default function App() {
  const [cinematicModalIndex, setCinematicModalIndex] = useState<number | null>(null)
  const [showIntro, setShowIntro] = useState(true)

  const closeCinematicModal = useCallback(() => {
    setCinematicModalIndex(null)
  }, [])

  const scrollToSection = useCallback((sectionId: string) => {
    const target = document.getElementById(sectionId)
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' })
    }
  }, [])

  return (
    <div className="amara-app">
      {/* 
        LANDING INTRO TRANSITION:
        Centered AMARA logo with automatic bottom-to-top sweep animation
      */}
      {showIntro && (
        <LandingIntroTransition
          autoDurationMs={1800}
          onTransitionComplete={() => setShowIntro(false)}
        />
      )}

      {/* 
        CORE EXPERIENCE:
        Full-Screen Pinned Cinematic Scroll Section
        Sticky 100vw × 100vh Viewport driven by scroll progress
      */}
      <CinematicScroll
        trackHeightVh={650}
        onExploreNext={() => scrollToSection('architecture')}
      />

      {/* 
        NEXT SECTIONS:
        Appear naturally as user scrolls past the cinematic sequence
      */}
      <main className="website-content">
        <ArchitecturalManifesto />
        <ResidenceSpecifications />
        <PrivateConsultation />
      </main>

      <LuxuryFooter />

      {cinematicModalIndex !== null && projects[cinematicModalIndex] && (
        <CinematicProject
          project={cinematicProjectsByProjectId[projects[cinematicModalIndex].id]}
          onClose={closeCinematicModal}
        />
      )}
    </div>
  )
}


