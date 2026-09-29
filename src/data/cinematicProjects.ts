export type CinematicPlacement = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'

export type CinematicPhase = {
  id: string
  start: number
  end: number
  progressStart: number
  progressEnd: number
  placement: CinematicPlacement
  eyebrow?: string
  title?: string[]
  body?: string
  facts?: string[]
  emphasizeLastLine?: boolean
  cta?: boolean
}

export type CinematicProjectData = {
  id: string
  projectNumber: number
  title: string
  location: string
  description: string
  address: string
  framePath: string
  mobileFramePath?: string
  frameFiles?: string[]
  frameCount: number
  sequenceLabel: string
  blendFrames?: boolean
  initialBuffer?: number
  preloadRadius?: number
  maxCache?: number
  motionStrength?: number
  fallbackImage: string
  href: string
  phases: CinematicPhase[]
  facts: string[]
}

export const alaayaCinematic: CinematicProjectData = {
  id: 'project-01',
  projectNumber: 1,
  title: 'Amara Alaaya',
  location: 'Koyambedu, Chennai',
  description: 'A poised vertical address shaped around light, calm and the pulse of the city.',
  address: 'Poonamallee High Road, Koyambedu, Chennai 600107',
  framePath: '/frames/project-01/frame_',
  frameCount: 240,
  sequenceLabel: '24 fps sequence',
  initialBuffer: 6,
  fallbackImage: '/project-cards/alaaya.jpg',
  href: 'https://www.amarahomes.in/alaaya.html',
  phases: [
    { id: 'intro', start: 0, end: 60, progressStart: 0, progressEnd: 0.25, placement: 'bottom-left', eyebrow: 'Amara city collection · Project 01', title: ['Arrive at', 'Alaaya'], emphasizeLastLine: true },
    { id: 'reveal', start: 61, end: 130, progressStart: 0.25, progressEnd: 0.55, placement: 'top-left', eyebrow: 'Now revealing', title: ['Amara Alaaya'], body: 'A poised vertical address shaped around light, calm and the pulse of the city.' },
    { id: 'detail', start: 131, end: 190, progressStart: 0.55, progressEnd: 0.8, placement: 'bottom-left', eyebrow: 'Considered vertical living', facts: ['24 levels', '136 residences', 'Koyambedu'] },
    { id: 'final', start: 191, end: 239, progressStart: 0.8, progressEnd: 1, placement: 'bottom-left', eyebrow: 'Discover the address', title: ['Amara Alaaya'], body: 'Poonamallee High Road, Koyambedu, Chennai 600107', cta: true },
  ],
  facts: ['24 levels', '136 residences', 'Koyambedu'],
}

export const anikaCinematic: CinematicProjectData = {
  id: 'project-03',
  projectNumber: 3,
  title: 'Amara Anika',
  location: 'Egmore, Chennai',
  description: 'A nine-level residential address at Montieth Road and Red Cross Road, in the heart of Egmore.',
  address: 'Montieth Road / Red Cross Road, Egmore, Chennai 600008',
  framePath: '/cinematic/anika/desktop/',
  mobileFramePath: '/cinematic/anika/mobile/',
  frameFiles: [
    'phase-01/frame_0000.jpg',
    'phase-01/frame_0016.jpg',
    'phase-01/frame_0030.jpg',
    'phase-02/frame_0038.jpg',
    'phase-02/frame_0047.jpg',
    'phase-02/frame_0056.jpg',
    'phase-02/frame_0064.jpg',
    'phase-03/frame_0072.jpg',
    'phase-03/frame_0080.jpg',
    'phase-03/frame_0088.jpg',
    'phase-03/frame_0096.jpg',
    'phase-03/frame_0108.jpg',
    'phase-04/frame_0120.jpg',
    'phase-04/frame_0132.jpg',
    'phase-04/frame_0144.jpg',
    'phase-04/frame_0152.jpg',
    'phase-04/frame_0158.jpg',
    'phase-05/frame_0166.jpg',
    'phase-05/frame_0174.jpg',
    'phase-05/frame_0184.jpg',
    'phase-05/frame_0194.jpg',
    'phase-06/frame_0204.jpg',
    'phase-06/frame_0214.jpg',
    'phase-06/frame_0224.jpg',
    'phase-06/frame_0230.jpg',
    'phase-07/frame_0234.jpg',
    'phase-07/frame_0237.jpg',
    'phase-07/frame_0239.jpg',
  ],
  frameCount: 28,
  sequenceLabel: '28 curated frames',
  blendFrames: true,
  initialBuffer: 4,
  preloadRadius: 4,
  maxCache: 14,
  motionStrength: 0.012,
  fallbackImage: '/project-cards/anika.jpg',
  href: 'https://www.amarahomes.in/anika.html',
  phases: [
    { id: 'opening', start: 0, end: 2, progressStart: 0, progressEnd: 0.12, placement: 'bottom-left', eyebrow: 'Amara city collection · Project 03', title: ['A quiet', 'arrival'], emphasizeLastLine: true },
    { id: 'approach', start: 3, end: 6, progressStart: 0.12, progressEnd: 0.27, placement: 'top-right', eyebrow: 'Egmore · Chennai', title: ['Drawn closer'] },
    { id: 'architecture', start: 7, end: 11, progressStart: 0.27, progressEnd: 0.45, placement: 'bottom-left', eyebrow: 'The residence', title: ['Architecture,', 'revealed'], emphasizeLastLine: true },
    { id: 'movement', start: 12, end: 16, progressStart: 0.45, progressEnd: 0.63, placement: 'top-left', eyebrow: 'A continuous passage', title: ['From outside, in'], body: 'Living, light and the city move through one considered frame.' },
    { id: 'details', start: 17, end: 20, progressStart: 0.63, progressEnd: 0.77, placement: 'bottom-right', eyebrow: 'The composed exterior', title: ['Material. Light.', 'Landscape.'] },
    { id: 'hero', start: 21, end: 24, progressStart: 0.77, progressEnd: 0.91, placement: 'top-left', eyebrow: 'Golden hour', title: ['A new city', 'silhouette.'] },
    { id: 'brand', start: 25, end: 27, progressStart: 0.91, progressEnd: 1, placement: 'top-right', eyebrow: 'The final reveal', title: ['AMARA'], body: 'Homes of distinction in the heart of Chennai.', cta: true },
  ],
  facts: ['9 levels', 'Signature residences', 'Egmore'],
}

export const cinematicProjectsByProjectId: Record<string, CinematicProjectData> = {
  alaaya: alaayaCinematic,
  anika: anikaCinematic,
}
