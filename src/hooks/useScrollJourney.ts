import { useEffect, useRef } from 'react'

type Options = {
  sectionRef: React.RefObject<HTMLElement | null>
  currentIndex: number
  itemCount: number
  enabled: boolean
  onChange: (index: number) => void
}

export function useScrollJourney({ sectionRef, currentIndex, itemCount, enabled, onChange }: Options) {
  const lockedUntil = useRef(0)
  const indexRef = useRef(currentIndex)
  indexRef.current = currentIndex

  useEffect(() => {
    const onWheel = (event: WheelEvent) => {
      if (!enabled || Math.abs(event.deltaY) < 12) return
      const section = sectionRef.current
      if (!section) return
      const rect = section.getBoundingClientRect()
      const isJourneyViewport = rect.top <= 2 && rect.bottom >= window.innerHeight - 2
      if (!isJourneyViewport) return

      const direction = event.deltaY > 0 ? 1 : -1
      const index = indexRef.current
      const atBoundary = (direction > 0 && index === itemCount - 1) || (direction < 0 && index === 0)
      if (atBoundary) return

      event.preventDefault()
      const now = performance.now()
      if (now < lockedUntil.current) return
      lockedUntil.current = now + 1180
      onChange(Math.max(0, Math.min(itemCount - 1, index + direction)))
    }

    window.addEventListener('wheel', onWheel, { passive: false })
    return () => window.removeEventListener('wheel', onWheel)
  }, [enabled, itemCount, onChange, sectionRef])
}
