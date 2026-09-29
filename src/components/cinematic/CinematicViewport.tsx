import { FrameRenderer } from './FrameRenderer'
import { CinematicOverlay } from './CinematicOverlay'

interface CinematicViewportProps {
  scrollProgress: number // 0.00 to 1.00
  onJumpToPhase?: (progress: number) => void
  onExploreNext?: () => void
  onReady?: () => void
  isAutoPlaying?: boolean
  onToggleAutoPlay?: () => void
}

export function CinematicViewport({
  scrollProgress,
  onJumpToPhase,
  onExploreNext,
  onReady,
  isAutoPlaying,
  onToggleAutoPlay,
}: CinematicViewportProps) {
  return (
    <div className="cinematic-viewport">
      {/* 2D Canvas Architectural Frame Renderer */}
      <FrameRenderer
        scrollProgress={scrollProgress}
        onReady={onReady}
      />

      {/* Luxury Minimalist Text Overlay & Phase Controls */}
      <CinematicOverlay
        scrollProgress={scrollProgress}
        onJumpToPhase={onJumpToPhase}
        onExploreNext={onExploreNext}
        isAutoPlaying={isAutoPlaying}
        onToggleAutoPlay={onToggleAutoPlay}
      />
    </div>
  )
}
