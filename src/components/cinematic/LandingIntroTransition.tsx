import { useState, useEffect } from 'react'

interface LandingIntroTransitionProps {
  onTransitionComplete?: () => void
  autoDurationMs?: number
}

export function LandingIntroTransition({
  onTransitionComplete,
  autoDurationMs = 2000,
}: LandingIntroTransitionProps) {
  const [stage, setStage] = useState<'revealing' | 'lifting' | 'done'>('revealing')

  useEffect(() => {
    // 1. Loading line animation runs for autoDurationMs
    const timer1 = setTimeout(() => {
      // 2. Automatically lift smoothly from bottom to top
      setStage('lifting')
    }, autoDurationMs)

    // 3. Complete transition and unmount
    const timer2 = setTimeout(() => {
      setStage('done')
      onTransitionComplete?.()
    }, autoDurationMs + 1150)

    return () => {
      clearTimeout(timer1)
      clearTimeout(timer2)
    }
  }, [autoDurationMs, onTransitionComplete])

  if (stage === 'done') return null

  const handleSkip = () => {
    setStage('lifting')
    setTimeout(() => {
      setStage('done')
      onTransitionComplete?.()
    }, 400)
  }

  return (
    <div
      className={`landing-intro-curtain ${stage === 'lifting' ? 'is-lifting' : ''}`}
      onClick={handleSkip}
      role="banner"
      aria-label="Amara Homes Intro"
    >

      {/* Exact Centered Amara Logo & Loading Line */}
      <div className="curtain-center-box">
        <div className="curtain-logo-container">
          <img
            src="/amara-logo.png"
            alt="Amara Homes"
            className="curtain-exact-logo"
          />
        </div>

        {/* The Two-Tone Loading Line: Orange fill / Dark track */}
        <div className="curtain-split-line-track">
          <div className="curtain-split-line-fill" />
        </div>
      </div>
    </div>
  )
}
