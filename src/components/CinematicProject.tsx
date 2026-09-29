import { useCallback, useEffect, useRef, useState } from 'react'
import type { CinematicProjectData } from '../data/cinematicProjects'

type Props = {
  project: CinematicProjectData
  onClose: () => void
}

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value))

function ArrowIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M14 7l5 5-5 5" /></svg>
}

export function CinematicProject({ project, onClose }: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const progressRef = useRef<HTMLSpanElement>(null)
  const frameLabelRef = useRef<HTMLSpanElement>(null)
  const returnFocusRef = useRef<HTMLElement | null>(document.activeElement as HTMLElement | null)
  const closeTimerRef = useRef<number | null>(null)
  const [visible, setVisible] = useState(false)
  const [closing, setClosing] = useState(false)
  const [ready, setReady] = useState(false)
  const [loadProgress, setLoadProgress] = useState(0)
  const [frameError, setFrameError] = useState(false)
  const [activePhaseId, setActivePhaseId] = useState(project.phases[0]?.id ?? '')

  const closeExperience = useCallback(() => {
    if (closing) return
    setClosing(true)
    setVisible(false)
    closeTimerRef.current = window.setTimeout(() => {
      dialogRef.current?.close()
      onClose()
      window.requestAnimationFrame(() => returnFocusRef.current?.focus())
    }, 520)
  }, [closing, onClose])

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    dialog.showModal()
    dialog.scrollTop = 0
    const revealFrame = window.requestAnimationFrame(() => setVisible(true))
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      window.cancelAnimationFrame(revealFrame)
      if (closeTimerRef.current !== null) window.clearTimeout(closeTimerRef.current)
      document.body.style.overflow = previousOverflow
      if (dialog.open) dialog.close()
    }
  }, [])

  useEffect(() => {
    const dialog = dialogRef.current
    const stage = stageRef.current
    const canvas = canvasRef.current
    const context = canvas?.getContext('2d', { alpha: false })
    if (!dialog || !stage || !canvas || !context) return
    const renderCanvas = canvas
    const renderContext = context

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const narrowScreen = window.matchMedia('(max-width: 700px)')
    const cache = new Map<number, HTMLImageElement>()
    const pending = new Map<number, Promise<HTMLImageElement>>()
    const maxCache = project.maxCache ?? (narrowScreen.matches ? 28 : 48)
    const initialBuffer = reducedMotion ? 1 : Math.min(project.initialBuffer ?? 6, project.frameCount)
    let destroyed = false
    let targetFrame = reducedMotion ? project.frameCount - 1 : 0
    let displayFrame = targetFrame
    let renderedPosition = -1
    let animationFrame = 0
    let initialLoaded = 0

    const frameUrl = (index: number) => {
      const basePath = narrowScreen.matches && project.mobileFramePath ? project.mobileFramePath : project.framePath
      return project.frameFiles
        ? basePath + project.frameFiles[index]
        : basePath + String(index).padStart(5, '0') + '.webp'
    }

    const resizeCanvas = () => {
      const bounds = stage.getBoundingClientRect()
      const pixelRatio = Math.min(window.devicePixelRatio || 1, narrowScreen.matches ? 1.25 : 1.6)
      canvas.width = Math.max(1, Math.round(bounds.width * pixelRatio))
      canvas.height = Math.max(1, Math.round(bounds.height * pixelRatio))
      canvas.style.width = `${bounds.width}px`
      canvas.style.height = `${bounds.height}px`
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0)
      renderedPosition = -1
      drawFrame(displayFrame)
    }

    const pruneCache = () => {
      if (cache.size <= maxCache) return
      const keep = [...cache.keys()]
        .sort((a, b) => Math.abs(a - targetFrame) - Math.abs(b - targetFrame))
        .slice(0, maxCache)
      const keepSet = new Set(keep)
      for (const key of cache.keys()) if (!keepSet.has(key)) cache.delete(key)
    }

    const nearestLoaded = (index: number) => {
      if (cache.has(index)) return cache.get(index)
      let nearest: HTMLImageElement | undefined
      let nearestDistance = Number.POSITIVE_INFINITY
      for (const [key, image] of cache) {
        const distance = Math.abs(key - index)
        if (distance < nearestDistance) {
          nearest = image
          nearestDistance = distance
        }
      }
      return nearest
    }

    const drawImage = (image: HTMLImageElement, opacity = 1, motionScale = 1, motionX = 0) => {
      const width = renderCanvas.clientWidth
      const height = renderCanvas.clientHeight
      const useContain = narrowScreen.matches
      const baseScale = useContain
        ? Math.min(width / image.naturalWidth, height / image.naturalHeight)
        : Math.max(width / image.naturalWidth, height / image.naturalHeight)
      const scale = baseScale * motionScale
      const drawWidth = image.naturalWidth * scale
      const drawHeight = image.naturalHeight * scale
      const x = (width - drawWidth) / 2 + width * motionX
      const y = (height - drawHeight) / 2
      renderContext.globalAlpha = opacity
      renderContext.drawImage(image, x, y, drawWidth, drawHeight)
      renderContext.globalAlpha = 1
    }

    function drawFrame(position: number) {
      const lowerIndex = Math.floor(position)
      const upperIndex = Math.ceil(position)
      const lowerImage = nearestLoaded(lowerIndex)
      if (!lowerImage || !lowerImage.naturalWidth || !lowerImage.naturalHeight) return

      const width = renderCanvas.clientWidth
      const height = renderCanvas.clientHeight
      renderContext.fillStyle = '#111310'
      renderContext.fillRect(0, 0, width, height)
      const blend = position - lowerIndex
      const motionStrength = project.motionStrength ?? 0
      drawImage(lowerImage, 1, 1 + blend * motionStrength, blend * motionStrength * 0.2)

      if (project.blendFrames && upperIndex !== lowerIndex) {
        const upperImage = cache.get(upperIndex)
        if (upperImage?.naturalWidth && upperImage.naturalHeight) {
          drawImage(upperImage, blend, 1 - (1 - blend) * motionStrength * 0.5, (blend - 1) * motionStrength * 0.2)
        }
      }
      renderedPosition = position
    }

    const loadFrame = (rawIndex: number) => {
      const index = clamp(Math.round(rawIndex), 0, project.frameCount - 1)
      const cached = cache.get(index)
      if (cached) return Promise.resolve(cached)
      const inFlight = pending.get(index)
      if (inFlight) return inFlight

      const request = new Promise<HTMLImageElement>((resolve, reject) => {
        const image = new Image()
        image.decoding = 'async'
        image.onload = () => {
          if (destroyed) return
          cache.set(index, image)
          pending.delete(index)
          pruneCache()
          if (index === 0 || index === project.frameCount - 1 || Math.abs(index - targetFrame) <= 1) {
            drawFrame(displayFrame)
          }
          resolve(image)
        }
        image.onerror = () => {
          pending.delete(index)
          if (index === 0 || reducedMotion) setFrameError(true)
          reject(new Error(`Unable to load cinematic frame ${index}`))
        }
        image.src = frameUrl(index)
      })
      pending.set(index, request)
      return request
    }

    const preloadWindow = (center: number) => {
      const radius = project.preloadRadius ?? (narrowScreen.matches ? 7 : 11)
      const priority = [center]
      for (let distance = 1; distance <= radius; distance += 1) {
        priority.push(center + distance, center - distance)
      }
      priority
        .filter(index => index >= 0 && index < project.frameCount)
        .forEach(index => { void loadFrame(index).catch(() => undefined) })
    }

    const tick = () => {
      const distance = targetFrame - displayFrame
      displayFrame = Math.abs(distance) < 0.08 ? targetFrame : displayFrame + distance * 0.2
      const nextPosition = project.blendFrames ? displayFrame : Math.round(displayFrame)
      if (nextPosition !== renderedPosition) drawFrame(nextPosition)
      if (displayFrame !== targetFrame) animationFrame = window.requestAnimationFrame(tick)
    }

    const updateTimeline = () => {
      const scrollRange = Math.max(1, dialog.scrollHeight - dialog.clientHeight)
      const progress = reducedMotion ? 1 : clamp(dialog.scrollTop / scrollRange, 0, 1)
      const phase = project.phases.find(item => progress >= item.progressStart && progress <= item.progressEnd) ?? project.phases.at(-1)
      const phaseDuration = Math.max(0.001, (phase?.progressEnd ?? 1) - (phase?.progressStart ?? 0))
      const phaseProgress = clamp((progress - (phase?.progressStart ?? 0)) / phaseDuration, 0, 1)
      targetFrame = (phase?.start ?? 0) + phaseProgress * ((phase?.end ?? project.frameCount - 1) - (phase?.start ?? 0))
      const activeFrame = Math.round(targetFrame)
      dialog.dataset.phase = phase?.id ?? 'intro'
      setActivePhaseId(phase?.id ?? '')
      dialog.dataset.scrolled = progress > 0.035 ? 'true' : 'false'
      progressRef.current?.style.setProperty('transform', `scaleX(${progress})`)
      if (frameLabelRef.current) frameLabelRef.current.textContent = String(activeFrame + 1).padStart(3, '0') + ' / ' + project.frameCount
      preloadWindow(activeFrame)
      window.cancelAnimationFrame(animationFrame)
      animationFrame = window.requestAnimationFrame(tick)
    }

    const primeFrames = async () => {
      try {
        const firstIndex = reducedMotion ? project.frameCount - 1 : 0
        for (let offset = 0; offset < initialBuffer; offset += 1) {
          const index = reducedMotion ? firstIndex : offset
          await loadFrame(index)
          if (destroyed) return
          initialLoaded = offset + 1
          setLoadProgress(initialLoaded / initialBuffer)
        }
        setReady(true)
        drawFrame(firstIndex)
      } catch {
        if (!destroyed) setFrameError(true)
      }
    }

    const resizeObserver = new ResizeObserver(resizeCanvas)
    resizeObserver.observe(stage)
    dialog.addEventListener('scroll', updateTimeline, { passive: true })
    narrowScreen.addEventListener('change', resizeCanvas)
    resizeCanvas()
    updateTimeline()
    void primeFrames()

    return () => {
      destroyed = true
      window.cancelAnimationFrame(animationFrame)
      dialog.removeEventListener('scroll', updateTimeline)
      narrowScreen.removeEventListener('change', resizeCanvas)
      resizeObserver.disconnect()
      cache.clear()
      pending.clear()
    }
  }, [project])

  return (
    <dialog
      ref={dialogRef}
      className={`cinematic-project ${visible ? 'is-visible' : ''} ${closing ? 'is-closing' : ''}`}
      data-project={project.id}
      aria-labelledby="cinematic-project-title"
      aria-describedby="cinematic-project-description"
      onCancel={event => { event.preventDefault(); closeExperience() }}
    >
      <div className="cinematic-project__timeline">
        <div ref={stageRef} className="cinematic-project__stage">
          {frameError ? (
            <img className="cinematic-project__fallback" src={project.fallbackImage} alt={`${project.title} exterior`} />
          ) : (
            <canvas ref={canvasRef} className="cinematic-project__canvas" role="img" aria-label={`Scroll-controlled cinematic view of ${project.title}`} />
          )}
          <div className="cinematic-project__grade" aria-hidden="true" />

          <header className="cinematic-project__header">
            <button ref={undefined} type="button" className="cinematic-project__back" onClick={closeExperience} autoFocus>
              <span aria-hidden="true">←</span> Back to projects
            </button>
            <img src="/amara-logo.png" alt="Amara Homes" />
            <span className="cinematic-project__location">{project.location}</span>
          </header>

          <h1 id="cinematic-project-title" className="cinematic-project__sr-only">{project.title}</h1>
          <p id="cinematic-project-description" className="cinematic-project__sr-only">{project.description}</p>

          {project.phases.map(phase => (
            <div
              key={phase.id}
              className={'cinematic-project__phase cinematic-project__phase--' + phase.placement}
              data-active={phase.id === activePhaseId ? 'true' : undefined}
              aria-hidden={phase.id !== activePhaseId}
            >
              {phase.eyebrow && <p>{phase.eyebrow}</p>}
              {phase.title && (
                <h2>
                  {(phase.title ?? []).map((line, index) => (
                    <span key={line}>
                      {phase.emphasizeLastLine && index === (phase.title?.length ?? 0) - 1 ? <em>{line}</em> : line}
                      {index < (phase.title?.length ?? 0) - 1 && <br />}
                    </span>
                  ))}
                </h2>
              )}
              {phase.body && <span>{phase.body}</span>}
              {phase.facts && (
                <div className="cinematic-project__facts">
                  {phase.facts.map((fact, index) => <span key={fact}><small>0{index + 1}</small>{fact}</span>)}
                </div>
              )}
              {phase.cta && <a href={project.href} target="_blank" rel="noreferrer">Explore full project <ArrowIcon /></a>}
            </div>
          ))}

          <div className={`cinematic-project__loader ${ready || frameError ? 'is-ready' : ''}`} aria-live="polite" aria-atomic="true">
            <span>{frameError ? 'Still image mode' : ready ? 'Film ready' : `Preparing ${project.title.replace(/^Amara\s+/, '')}`}</span>
            <i><b style={{ transform: `scaleX(${frameError ? 1 : loadProgress})` }} /></i>
          </div>

          <div className="cinematic-project__scroll-cue" aria-hidden="true"><i /> Scroll to move through {project.title.replace(/^Amara\s+/, '')}</div>

          <footer className="cinematic-project__footer">
            <span className="cinematic-project__frame" ref={frameLabelRef}>001 / {project.frameCount}</span>
            <div className="cinematic-project__progress"><span ref={progressRef} /></div>
            <span>{project.sequenceLabel}</span>
          </footer>
        </div>
      </div>
    </dialog>
  )
}
