import { useMemo, useState } from 'react'
import {
  CINEMATIC_TIMELINE,
  TOTAL_FRAMES,
  getTimelineFramePosition,
} from '../../data/cinematicTimeline'

interface CinematicOverlayProps {
  scrollProgress: number // 0.00 to 1.00
  onJumpToPhase?: (progress: number) => void
  onExploreNext?: () => void
  isAutoPlaying?: boolean
  onToggleAutoPlay?: () => void
}

export function CinematicOverlay({
  scrollProgress,
  onJumpToPhase,
  onExploreNext,
  isAutoPlaying,
  onToggleAutoPlay,
}: CinematicOverlayProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const { activePhase, phaseProgress, framePosition } = useMemo(
    () => getTimelineFramePosition(scrollProgress),
    [scrollProgress]
  )

  const currentFrameInt = Math.min(TOTAL_FRAMES, Math.round(framePosition) + 1)
  const isStarted = scrollProgress > 0.035
  const isClimax = scrollProgress >= 0.93

  // Balanced text opacity ensuring Phase 01 is immediately readable and transitions are smooth
  const textOpacity = useMemo(() => {
    if (activePhase.id === 'phase-01') {
      return phaseProgress < 0.75 ? 1 : Math.max(0.2, (1 - phaseProgress) / 0.25)
    }
    if (activePhase.id === 'phase-07') {
      return phaseProgress > 0.25 ? 1 : Math.max(0.2, phaseProgress / 0.25)
    }
    if (phaseProgress < 0.15) return Math.max(0.2, phaseProgress / 0.15)
    if (phaseProgress > 0.85) return Math.max(0.2, (1 - phaseProgress) / 0.15)
    return 1
  }, [activePhase.id, phaseProgress])

  return (
    <div className="cinematic-overlay" aria-live="polite">
      {/* Top Header - Amara Homes Style */}
      <header className="cinematic-overlay__header">
        <div className="cinematic-overlay__brand">
          <a href="https://www.amarahomes.in/" target="_blank" rel="noreferrer" aria-label="Amara Homes">
            <img src="/amara-logo.png" alt="Amara Homes" className="cinematic-overlay__logo" />
          </a>
          <div className="cinematic-overlay__tagline">
            <span>Amara Anika</span>
            <i className="dot" />
            <span>Egmore · Chennai</span>
          </div>
        </div>

        <nav className={`cinematic-overlay__nav ${mobileMenuOpen ? 'is-open' : ''}`} aria-label="Page navigation">
          <button
            type="button"
            className="nav-link active"
            onClick={() => {
              onJumpToPhase?.(0)
              setMobileMenuOpen(false)
            }}
          >
            Cinematic Film
          </button>

          {/* Automated Tour Toggle Button */}
          <button
            type="button"
            className={`nav-auto-btn ${isAutoPlaying ? 'is-playing' : ''}`}
            onClick={onToggleAutoPlay}
            title="Automatically play the architectural film from bottom to top"
          >
            <span className="btn-play-ic">{isAutoPlaying ? '⏸' : '▶'}</span>
            <span>{isAutoPlaying ? 'Pause Tour' : 'Auto Play'}</span>
          </button>

          <a href="#architecture" className="nav-link" onClick={() => setMobileMenuOpen(false)}>
            Architecture
          </a>
          <a href="#specifications" className="nav-link" onClick={() => setMobileMenuOpen(false)}>
            Residences
          </a>
          <a href="#chennai-map" className="nav-link" onClick={() => setMobileMenuOpen(false)}>
            Chennai Map
          </a>
          <a href="#consultation" className="nav-cta" onClick={() => setMobileMenuOpen(false)}>
            Book Viewing
          </a>
        </nav>

        {/* Amara Hamburger Menu Icon (Top Right) */}
        <button
          type="button"
          className={`amara-menu-toggle ${mobileMenuOpen ? 'is-active' : ''}`}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle navigation menu"
        >
          <span className="menu-bar bar-top" />
          <span className="menu-bar bar-bottom" />
        </button>
      </header>

      {/* Floating Right Scroll Position Dot */}
      <div className="amara-side-dot-indicator" aria-hidden="true">
        <div
          className="side-dot"
          style={{
            transform: `translateY(${scrollProgress * 120}px)`,
          }}
        />
      </div>

      {/* Floating Bottom-Left Concierge Inquiry Bubble */}
      <a
        href="#consultation"
        className="amara-floating-inquiry-btn"
        aria-label="Contact Amara Concierge"
      >
        <svg viewBox="0 0 24 24" className="inquiry-icon" aria-hidden="true">
          <path
            d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-7 12h-2v-2h2v2zm0-4h-2V6h2v4z"
            fill="currentColor"
          />
        </svg>
      </a>


      {/* Dynamic Phase Typography with Signature Amara Orange Accent Bar */}
      <div
        className={`cinematic-overlay__content placement--${activePhase.placement}`}
        style={{
          opacity: textOpacity,
          transform: `translateY(${(1 - textOpacity) * 8}px)`,
        }}
      >
        <div className="cinematic-overlay__badge">
          <span className="badge-phase">PHASE {activePhase.phaseNumber}</span>
          <span className="badge-divider">/</span>
          <span className="badge-name">{activePhase.name}</span>
        </div>

        <h2 className="cinematic-overlay__title">
          {activePhase.title.map((line, idx) => (
            <span key={line} className="title-line">
              {line}
              {idx < activePhase.title.length - 1 && <br />}
            </span>
          ))}
        </h2>

        {/* Amara Signature Orange Underline Bar */}
        <div className="amara-title-underline" />

        <p className="cinematic-overlay__desc">{activePhase.description}</p>

        {activePhase.architecturalDetails && (
          <div className="cinematic-overlay__chips">
            {activePhase.architecturalDetails.map((detail) => (
              <span key={detail} className="detail-chip">
                {detail}
              </span>
            ))}
          </div>
        )}

        {isClimax && (
          <div className="cinematic-overlay__climax-cta">
            <button
              type="button"
              className="btn-discover"
              onClick={onExploreNext}
            >
              Explore Residence Specifications
              <svg viewBox="0 0 24 24" className="icon-arrow" aria-hidden="true">
                <path d="M5 12h14M14 7l5 5-5 5" fill="none" stroke="currentColor" strokeWidth="2" />
              </svg>
            </button>
          </div>
        )}
      </div>

      {/* Initial Minimalist Scroll Cue */}
      <div className={`cinematic-overlay__scroll-cue ${isStarted ? 'is-faded' : ''}`}>
        <div className="cue-track">
          <div className="cue-thumb" />
        </div>
        <span>Scroll down to control camera</span>
      </div>

      {/* Bottom Timeline Bar & Phase Scrubber */}
      <footer className="cinematic-overlay__footer">
        <div className="footer-left">
          <span className="frame-counter">
            FRAME <b>{String(currentFrameInt).padStart(3, '0')}</b> / {TOTAL_FRAMES}
          </span>
          <span className="phase-indicator">
            {activePhase.name.toUpperCase()}
          </span>
        </div>

        {/* Interactive Phase Rail */}
        <div className="phase-rail" role="tablist" aria-label="Cinematic phases">
          {CINEMATIC_TIMELINE.map((p) => {
            const isActive = p.id === activePhase.id
            const midProgress = (p.progressRange[0] + p.progressRange[1]) / 2
            return (
              <button
                key={p.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                className={`rail-segment ${isActive ? 'is-active' : ''}`}
                onClick={() => onJumpToPhase?.(midProgress)}
                title={`Phase ${p.phaseNumber}: ${p.name}`}
              >
                <span className="rail-number">{p.phaseNumber}</span>
                <span className="rail-bar" />
                <span className="rail-label">{p.name}</span>
              </button>
            )
          })}
        </div>

        <div className="footer-right">
          <div className="progress-track">
            <div
              className="progress-fill"
              style={{ transform: `scaleX(${scrollProgress})` }}
            />
          </div>
          <span className="percent-label">{Math.round(scrollProgress * 100)}%</span>
        </div>
      </footer>
    </div>
  )
}
