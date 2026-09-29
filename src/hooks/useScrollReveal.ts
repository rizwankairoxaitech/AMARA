import { useEffect, useRef, useState } from 'react'

interface ScrollRevealOptions {
  threshold?: number
  rootMargin?: string
  once?: boolean
}

export function useScrollReveal<T extends HTMLElement = HTMLDivElement>({
  threshold = 0.18,
  rootMargin = '0px 0px -50px 0px',
  once = false,
}: ScrollRevealOptions = {}) {
  const ref = useRef<T>(null)
  const [isRevealed, setIsRevealed] = useState(false)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    // Fallback if IntersectionObserver is unavailable
    if (typeof IntersectionObserver === 'undefined') {
      setIsRevealed(true)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsRevealed(true)
          if (once) {
            observer.unobserve(element)
          }
        } else if (!once) {
          // Allow re-animating when scrolling back into view
          setIsRevealed(false)
        }
      },
      {
        threshold,
        rootMargin,
      }
    )

    observer.observe(element)
    return () => observer.disconnect()
  }, [threshold, rootMargin, once])

  return [ref, isRevealed] as const
}
