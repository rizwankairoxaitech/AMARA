import { useCallback, useEffect, useRef, useState } from 'react'
import { CinematicViewport } from './CinematicViewport'

interface CinematicScrollProps {
  onScrollProgressChange?: (progress: number) => void
  onExploreNext?: () => void
  onReady?: () => void
  trackHeightVh?: number // Default: 650vh
}

export function CinematicScroll({
  onScrollProgressChange,
  onExploreNext,
  onReady,
  trackHeightVh = 650,
}: CinematicScrollProps) {
  const containerRef = useRef<HTMLElement>(null)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(false)
  const autoPlayRafRef = useRef<number>(0)

  // Measure and compute progress from scroll position
  const updateScrollProgress = useCallback(() => {
    const el = containerRef.current
    if (!el) return

    const rect = el.getBoundingClientRect()
    const totalDist = el.offsetHeight - window.innerHeight
    if (totalDist <= 0) return

    const scrolled = -rect.top
    const rawProgress = Math.max(0, Math.min(1, scrolled / totalDist))

    setScrollProgress(rawProgress)
    onScrollProgressChange?.(rawProgress)
  }, [onScrollProgressChange])

  useEffect(() => {
    let ticking = false

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          updateScrollProgress()
          ticking = false
        })
        ticking = true
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', handleScroll, { passive: true })
    updateScrollProgress()

    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleScroll)
    }
  }, [updateScrollProgress])

  // Jump to specific progress (e.g. when clicking a phase or button)
  const jumpToProgress = useCallback((targetProgress: number) => {
    const el = containerRef.current
    if (!el) return

    const totalDist = el.offsetHeight - window.innerHeight
    const targetScrollY = el.offsetTop + totalDist * targetProgress

    window.scrollTo({
      top: targetScrollY,
      behavior: 'smooth',
    })
  }, [])

  // Automated Smooth Cinematic Playback (Bottom-to-Top Film Tour)
  useEffect(() => {
    if (!isAutoPlaying) {
      cancelAnimationFrame(autoPlayRafRef.current)
      return
    }

    const el = containerRef.current
    if (!el) return

    let lastTime = performance.now()
    const totalDist = el.offsetHeight - window.innerHeight

    const autoStep = (now: number) => {
      const dt = (now - lastTime) / 1000
      lastTime = now

      // Scroll speed: complete full tour in ~14 seconds
      const speedPxPerSec = totalDist / 14
      const nextY = window.scrollY + speedPxPerSec * dt
      const maxScroll = el.offsetTop + totalDist

      if (nextY >= maxScroll) {
        window.scrollTo({ top: maxScroll, behavior: 'auto' })
        setIsAutoPlaying(false)
        return
      }

      window.scrollTo({ top: nextY, behavior: 'auto' })
      autoPlayRafRef.current = requestAnimationFrame(autoStep)
    }

    autoPlayRafRef.current = requestAnimationFrame(autoStep)

    // Stop auto-play on user manual wheel or touch interaction
    const stopOnUserAction = () => {
      setIsAutoPlaying(false)
    }

    window.addEventListener('wheel', stopOnUserAction, { passive: true })
    window.addEventListener('touchstart', stopOnUserAction, { passive: true })

    return () => {
      cancelAnimationFrame(autoPlayRafRef.current)
      window.removeEventListener('wheel', stopOnUserAction)
      window.removeEventListener('touchstart', stopOnUserAction)
    }
  }, [isAutoPlaying])

  const toggleAutoPlay = useCallback(() => {
    setIsAutoPlaying((prev) => {
      // If at end, rewind to top first
      if (!prev && scrollProgress >= 0.95) {
        jumpToProgress(0)
      }
      return !prev
    })
  }, [jumpToProgress, scrollProgress])

  // Keyboard navigation support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const el = containerRef.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      if (rect.bottom < 0 || rect.top > window.innerHeight) return

      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault()
        toggleAutoPlay()
      } else if (e.key === 'ArrowDown' || e.key === 'PageDown') {
        setIsAutoPlaying(false)
        const next = Math.min(1, scrollProgress + 0.05)
        jumpToProgress(next)
      } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        setIsAutoPlaying(false)
        const prev = Math.max(0, scrollProgress - 0.05)
        jumpToProgress(prev)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [jumpToProgress, scrollProgress, toggleAutoPlay])

  const handleExploreNext = useCallback(() => {
    setIsAutoPlaying(false)
    if (onExploreNext) {
      onExploreNext()
    } else {
      const el = containerRef.current
      if (!el) return
      window.scrollTo({
        top: el.offsetTop + el.offsetHeight + 10,
        behavior: 'smooth',
      })
    }
  }, [onExploreNext])

  return (
    <section
      ref={containerRef}
      className="cinematic-scroll"
      style={{ height: `${trackHeightVh}vh` }}
      aria-label="Amara Anika Cinematic Scroll Film"
    >
      <div className="cinematic-sticky-wrapper">
        <CinematicViewport
          scrollProgress={scrollProgress}
          onJumpToPhase={jumpToProgress}
          onExploreNext={handleExploreNext}
          onReady={onReady}
          isAutoPlaying={isAutoPlaying}
          onToggleAutoPlay={toggleAutoPlay}
        />
      </div>
    </section>
  )
}
