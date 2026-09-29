import { useEffect, useRef, useState, useCallback } from 'react'
import {
  TOTAL_FRAMES,
  getFrameUrlByIndex,
  getTimelineFramePosition,
} from '../../data/cinematicTimeline'

interface FrameRendererProps {
  scrollProgress: number // 0.00 to 1.00
  onReady?: () => void
  onProgress?: (progress: number) => void
  priorityBufferCount?: number
}

const clamp = (val: number, min: number, max: number) => Math.max(min, Math.min(max, val))

export function FrameRenderer({
  scrollProgress,
  onReady,
  onProgress,
  priorityBufferCount = 12,
}: FrameRendererProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const posterRef = useRef<HTMLImageElement>(null)
  const [isReady, setIsReady] = useState(false)
  const [loadPct, setLoadPct] = useState(0)

  // Memory-efficient persistent frame cache
  const cacheRef = useRef<Map<number, HTMLImageElement>>(new Map())
  const inFlightRef = useRef<Map<number, Promise<HTMLImageElement>>>(new Map())

  // Motion physics state
  const stateRef = useRef({
    targetFrame: 0,
    displayFrame: 0,
  })

  // Frame loader with Promise memoization
  const loadFrame = useCallback((index: number): Promise<HTMLImageElement> => {
    const validIdx = clamp(index, 0, TOTAL_FRAMES - 1)
    const cache = cacheRef.current
    if (cache.has(validIdx)) return Promise.resolve(cache.get(validIdx)!)

    const inFlight = inFlightRef.current
    if (inFlight.has(validIdx)) return inFlight.get(validIdx)!

    const request = new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new Image()
      img.decoding = 'async'
      img.onload = () => {
        cache.set(validIdx, img)
        inFlight.delete(validIdx)
        resolve(img)
      }
      img.onerror = () => {
        inFlight.delete(validIdx)
        reject(new Error(`Failed to load frame ${validIdx}`))
      }
      img.src = getFrameUrlByIndex(validIdx)
    })

    inFlight.set(validIdx, request)
    return request
  }, [])

  // Sliding window preloader around active frame
  const preloadWindow = useCallback((center: number) => {
    // Prioritize forward scroll direction (+25 frames) and slight backward context (-8 frames)
    const forwardRadius = 25
    const backwardRadius = 8

    // Forward priority
    for (let offset = 0; offset <= forwardRadius; offset++) {
      const idx = center + offset
      if (idx < TOTAL_FRAMES) {
        void loadFrame(idx).catch(() => undefined)
      }
    }

    // Backward priority
    for (let offset = 1; offset <= backwardRadius; offset++) {
      const idx = center - offset
      if (idx >= 0) {
        void loadFrame(idx).catch(() => undefined)
      }
    }
  }, [loadFrame])

  // Sync scroll progress with target frame
  useEffect(() => {
    const { framePosition } = getTimelineFramePosition(scrollProgress)
    stateRef.current.targetFrame = clamp(framePosition, 0, TOTAL_FRAMES - 1)
    preloadWindow(Math.round(framePosition))
  }, [scrollProgress, preloadWindow])

  // Initial priority preloading
  useEffect(() => {
    let canceled = false

    const prime = async () => {
      try {
        const count = Math.min(priorityBufferCount, TOTAL_FRAMES)
        for (let i = 0; i < count; i++) {
          await loadFrame(i)
          if (canceled) return
          const pct = Math.round(((i + 1) / count) * 100)
          setLoadPct(pct)
          onProgress?.(pct / 100)
        }

        if (!canceled) {
          setIsReady(true)
          onReady?.()
          // Start background preloading of subsequent frames
          for (let i = count; i < Math.min(60, TOTAL_FRAMES); i++) {
            if (canceled) return
            void loadFrame(i).catch(() => undefined)
          }
        }
      } catch (err) {
        console.warn('Initial prime notice:', err)
        if (!canceled) {
          setIsReady(true)
          onReady?.()
        }
      }
    }

    void prime()
    return () => {
      canceled = true
    }
  }, [loadFrame, onProgress, onReady, priorityBufferCount])

  // 60FPS Video Canvas Render Loop
  useEffect(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return

    const ctx = canvas.getContext('2d', { alpha: false })
    if (!ctx) return

    let isEffectActive = true
    let animationFrameId = 0

    const updateCanvasDimensions = () => {
      const rect = container.getBoundingClientRect()
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5)
      const w = Math.max(1, Math.round(rect.width * dpr))
      const h = Math.max(1, Math.round(rect.height * dpr))

      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w
        canvas.height = h
        canvas.style.width = `${rect.width}px`
        canvas.style.height = `${rect.height}px`
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      }
    }

    updateCanvasDimensions()
    const resizeObserver = new ResizeObserver(updateCanvasDimensions)
    resizeObserver.observe(container)

    const getNearestLoadedFrame = (index: number): HTMLImageElement | undefined => {
      const cache = cacheRef.current
      if (cache.has(index)) return cache.get(index)

      let nearest: HTMLImageElement | undefined
      let minDist = Infinity
      for (const [key, img] of cache) {
        const dist = Math.abs(key - index)
        if (dist < minDist) {
          nearest = img
          minDist = dist
        }
      }
      return nearest
    }

    const drawFrameImage = (
      img: HTMLImageElement,
      opacity: number,
      clientW: number,
      clientH: number
    ) => {
      const natW = img.naturalWidth || 1920
      const natH = img.naturalHeight || 1080

      // Exact 16:9 cinematic cover
      const scaleW = clientW / natW
      const scaleH = clientH / natH
      const baseScale = Math.max(scaleW, scaleH)

      const drawW = natW * baseScale
      const drawH = natH * baseScale

      let posX = (clientW - drawW) / 2
      let posY = (clientH - drawH) / 2

      // Portrait mobile adjustment: ensure bottom-left Amara branding and central facade are framed
      if (clientH > clientW) {
        posY = (clientH - drawH) * 0.42
      }

      ctx.globalAlpha = clamp(opacity, 0, 1)
      ctx.drawImage(img, posX, posY, drawW, drawH)
      ctx.globalAlpha = 1.0
    }

    const render = () => {
      if (!isEffectActive) return

      const state = stateRef.current
      const containerW = container.clientWidth
      const containerH = container.clientHeight

      if (containerW > 0 && containerH > 0) {
        // High-responsiveness smooth camera tracking (0.32 lerp for immediate response)
        const frameDiff = state.targetFrame - state.displayFrame
        state.displayFrame =
          Math.abs(frameDiff) < 0.005
            ? state.targetFrame
            : state.displayFrame + frameDiff * 0.32

        const pos = state.displayFrame
        const lowerIdx = Math.floor(pos)
        const upperIdx = Math.min(TOTAL_FRAMES - 1, Math.ceil(pos))
        const blend = pos - lowerIdx

        const lowerImg = getNearestLoadedFrame(lowerIdx)

        if (lowerImg && lowerImg.complete && lowerImg.naturalWidth > 0) {
          // Clear background
          ctx.fillStyle = '#0b0e0d'
          ctx.fillRect(0, 0, containerW, containerH)

          // Draw base frame (100% video sharpness)
          drawFrameImage(lowerImg, 1.0, containerW, containerH)

          // Sub-frame motion crossfade for buttery 60fps/120fps video smoothness between frames
          if (upperIdx !== lowerIdx && blend > 0.02) {
            const upperImg = cacheRef.current.get(upperIdx)
            if (upperImg && upperImg.complete && upperImg.naturalWidth > 0) {
              drawFrameImage(upperImg, blend, containerW, containerH)
            }
          }

          // Hide instant poster once canvas starts drawing
          if (posterRef.current && posterRef.current.style.opacity !== '0') {
            posterRef.current.style.opacity = '0'
          }
        }
      }

      animationFrameId = requestAnimationFrame(render)
    }

    animationFrameId = requestAnimationFrame(render)

    return () => {
      isEffectActive = false
      cancelAnimationFrame(animationFrameId)
      resizeObserver.disconnect()
    }
  }, [])

  return (
    <div ref={containerRef} className="frame-renderer-container" aria-hidden="true">
      {/* Instant poster ensuring immediate image paint */}
      <img
        ref={posterRef}
        src={getFrameUrlByIndex(0)}
        alt="Amara Anika Arrival"
        className="frame-renderer-poster"
      />

      {/* Main 60fps Video Canvas */}
      <canvas ref={canvasRef} className="frame-renderer-canvas" />

      {/* Subtle cinematic edge vignette */}
      <div className="frame-renderer-vignette" />

      {/* Loading indicator */}
      {!isReady && (
        <div className="frame-renderer-loading">
          <div className="loading-spinner" />
          <span className="loading-label">Buffering Video · {loadPct}%</span>
        </div>
      )}
    </div>
  )
}
