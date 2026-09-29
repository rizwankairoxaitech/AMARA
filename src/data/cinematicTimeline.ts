export type CinematicPhaseConfig = {
  id: string
  phaseNumber: string
  name: string
  subtitle: string
  progressRange: readonly [number, number]
  startFrame: number
  endFrame: number
  eyebrow: string
  title: readonly string[]
  description: string
  placement: 'bottom-left' | 'top-right' | 'top-left' | 'bottom-right'
  architecturalDetails?: readonly string[]
  ctaText?: string
}

export const TOTAL_FRAMES = 240 // Full 24fps 10-second cinematic sequence (0 to 239)
export const FRAME_PATH_BASE = '/frames/project-03/frame_'

export function getFrameUrlByIndex(index: number): string {
  const clamped = Math.max(0, Math.min(TOTAL_FRAMES - 1, Math.round(index)))
  return `${FRAME_PATH_BASE}${String(clamped).padStart(4, '0')}.jpg`
}

export const CINEMATIC_TIMELINE: readonly CinematicPhaseConfig[] = [
  {
    id: 'phase-01',
    phaseNumber: '01',
    name: 'Opening',
    subtitle: 'Environmental Mood',
    progressRange: [0.00, 0.14] as const,
    startFrame: 0,
    endFrame: 34,
    eyebrow: 'Phase 01 · Establishing Environment',
    title: ['Canopy Light', 'and Sanctuary'],
    description: 'A serene arrival enveloped in lush coastal canopy, where modern brick textures meet architectural calm.',
    placement: 'bottom-left',
    architecturalDetails: ['Morning southern exposure', 'Lush biophilic envelope', 'Terraced brick composition'],
  },
  {
    id: 'phase-02',
    phaseNumber: '02',
    name: 'Approach',
    subtitle: 'Camera Progression',
    progressRange: [0.14, 0.28] as const,
    startFrame: 35,
    endFrame: 70,
    eyebrow: 'Phase 02 · Architectural Approach',
    title: ['Drawn Into', 'The Volume'],
    description: 'The camera advances through tree canopies, bringing brick textures and structural depth into focus.',
    placement: 'top-right',
    architecturalDetails: ['Recessed balconies', 'Hand-laid masonry', 'Rhythm of solid and void'],
  },
  {
    id: 'phase-03',
    phaseNumber: '03',
    name: 'Reveal',
    subtitle: 'Facade Composition',
    progressRange: [0.28, 0.48] as const,
    startFrame: 71,
    endFrame: 115,
    eyebrow: 'Phase 03 · Facade Reveal',
    title: ['Architecture,', 'In Full Poise'],
    description: 'The full facade unfolds with double-height glazing, cascading vertical planters, and warm wood accents.',
    placement: 'bottom-left',
    architecturalDetails: ['Floor-to-ceiling glass', 'Acoustic thermal glazing', 'Cantilevered sky terraces'],
  },
  {
    id: 'phase-04',
    phaseNumber: '04',
    name: 'Movement',
    subtitle: 'Spatial Passage',
    progressRange: [0.48, 0.67] as const,
    startFrame: 116,
    endFrame: 160,
    eyebrow: 'Phase 04 · Cinematic Passage',
    title: ['Living Space', 'Meets Sky'],
    description: 'Gliding seamlessly from deep-shaded interior lounges toward expansive balconies overlooking Egmore.',
    placement: 'top-left',
    architecturalDetails: ['Seamless indoor-outdoor threshold', '3.4m ceiling clearance', 'Panoramic city sightlines'],
  },
  {
    id: 'phase-05',
    phaseNumber: '05',
    name: 'Luxury Details',
    subtitle: 'Material & Light',
    progressRange: [0.67, 0.81] as const,
    startFrame: 161,
    endFrame: 195,
    eyebrow: 'Phase 05 · Material Craft',
    title: ['Material.', 'Light. Silence.'],
    description: 'Warm internal lighting washes against Italian travertine, dark louvers, and bespoke architectural metalwork.',
    placement: 'bottom-right',
    architecturalDetails: ['Concealed cove lighting', 'Natural stone veneer', 'Architectural bronze joinery'],
  },
  {
    id: 'phase-06',
    phaseNumber: '06',
    name: 'Hero Reveal',
    subtitle: 'Twilight Climax',
    progressRange: [0.81, 0.93] as const,
    startFrame: 196,
    endFrame: 228,
    eyebrow: 'Phase 06 · Golden Climax',
    title: ['A Landmark', 'In Twilight'],
    description: 'The structure awakens in the evening glow, standing as a sculptured jewel against Chennai’s dusk horizon.',
    placement: 'top-left',
    architecturalDetails: ['Dramatic facade uplighting', 'Skyline silhouette', 'Artisanal courtyard illumination'],
  },
  {
    id: 'phase-07',
    phaseNumber: '07',
    name: 'Amara Brand Reveal',
    subtitle: 'The Signature Identity',
    progressRange: [0.93, 1.00] as const,
    startFrame: 229,
    endFrame: 239,
    eyebrow: 'Phase 07 · Signature Address',
    title: ['AANYA', 'By Amara Homes'],
    description: 'Montieth Road · Red Cross Road, Egmore. A definitive standard of contemporary Indian luxury living.',
    placement: 'bottom-right',
    architecturalDetails: ['Egmore Prime Address', 'Nine Bespoke Floors', 'Signature Amara Craft'],
    ctaText: 'Explore Residences',
  },
] as const

/**
 * Maps global scroll progress (0.00 -> 1.00) to exact continuous frame position (0.00 -> 239.00)
 */
export function getTimelineFramePosition(progress: number): {
  framePosition: number
  activePhase: CinematicPhaseConfig
  phaseProgress: number
} {
  const clampedProgress = Math.max(0, Math.min(1, progress))

  // Find corresponding phase
  let activePhase = CINEMATIC_TIMELINE[CINEMATIC_TIMELINE.length - 1]
  for (let i = 0; i < CINEMATIC_TIMELINE.length; i++) {
    const p = CINEMATIC_TIMELINE[i]
    if (clampedProgress >= p.progressRange[0] && clampedProgress <= p.progressRange[1]) {
      activePhase = p
      break
    }
  }

  const [pStart, pEnd] = activePhase.progressRange
  const duration = Math.max(0.0001, pEnd - pStart)
  const phaseProgress = Math.max(0, Math.min(1, (clampedProgress - pStart) / duration))

  // Map seamlessly across the full 240 frames
  const framePosition = clampedProgress * (TOTAL_FRAMES - 1)

  return {
    framePosition,
    activePhase,
    phaseProgress,
  }
}
