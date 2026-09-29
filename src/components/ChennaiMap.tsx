import { useEffect, useRef } from 'react'
import * as maplibregl from 'maplibre-gl'
import type { Map, Marker, StyleSpecification } from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import type { Project } from '../data/projects'
import { flyToCity, flyToProject } from '../lib/camera'

type Props = {
  projects: Project[]
  activeIndex: number
  descentStarted: boolean
  introComplete: boolean
  cinematicProjectIndex: number | null
  onSelect: (index: number) => void
  onOpenProject: (index: number, trigger?: HTMLElement) => void
  onReady: () => void
}

const SATELLITE_STYLE: StyleSpecification = {
  version: 8,
  name: 'Amara satellite Chennai',
  sources: {
    satellite: {
      type: 'raster',
      tiles: ['https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'],
      tileSize: 256,
      maxzoom: 19,
      attribution: 'Imagery © Esri, Maxar, Earthstar Geographics and the GIS User Community',
    },
    openfreemap: { type: 'vector', url: 'https://tiles.openfreemap.org/planet' },
    terrain: {
      type: 'raster-dem',
      tiles: ['https://s3.amazonaws.com/elevation-tiles-prod/terrarium/{z}/{x}/{y}.png'],
      tileSize: 256,
      maxzoom: 15,
      encoding: 'terrarium',
      attribution: 'Elevation tiles © AWS Open Data',
    },
  },
  layers: [
    {
      id: 'satellite-imagery', type: 'raster', source: 'satellite',
      paint: { 'raster-saturation': -.12, 'raster-contrast': .08, 'raster-brightness-min': .04, 'raster-brightness-max': .91, 'raster-fade-duration': 520 },
    },
    {
      id: 'major-road-glow', type: 'line', source: 'openfreemap', 'source-layer': 'transportation', minzoom: 11,
      filter: ['match', ['get', 'class'], ['motorway', 'trunk', 'primary', 'secondary'], true, false],
      paint: {
        'line-color': '#f4efe5', 'line-opacity': ['interpolate', ['linear'], ['zoom'], 11, .12, 15, .34],
        'line-width': ['interpolate', ['linear'], ['zoom'], 11, .5, 16, 4.5], 'line-blur': .35,
      },
    },
    {
      id: 'amara-3d-buildings', type: 'fill-extrusion', source: 'openfreemap', 'source-layer': 'building', minzoom: 14,
      filter: ['!=', ['get', 'hide_3d'], true],
      paint: {
        'fill-extrusion-color': ['interpolate', ['linear'], ['coalesce', ['get', 'render_height'], 8], 0, '#cbc7bd', 40, '#b7b2a8', 120, '#9f9b93'],
        'fill-extrusion-height': ['interpolate', ['linear'], ['zoom'], 14, 0, 15.2, ['coalesce', ['get', 'render_height'], 8]],
        'fill-extrusion-base': ['coalesce', ['get', 'render_min_height'], 0],
        'fill-extrusion-opacity': .64,
      },
    },
  ],
}

export function ChennaiMap({ projects, activeIndex, descentStarted, introComplete, cinematicProjectIndex, onSelect, onOpenProject, onReady }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<Map | null>(null)
  const markersRef = useRef<Marker[]>([])
  const firstProjectFocus = useRef(true)
  const cityDescentStarted = useRef(false)
  const previousCinematicIndex = useRef<number | null>(null)

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const map = new maplibregl.Map({
      container: containerRef.current,
      style: SATELLITE_STYLE,
      center: [80.245, 13.075],
      zoom: reducedMotion ? 11.45 : 8.55,
      pitch: reducedMotion ? 48 : 8,
      bearing: -8,
      minZoom: 8,
      maxZoom: 18,
      scrollZoom: false,
      dragRotate: true,
      touchZoomRotate: true,
      attributionControl: false,
      canvasContextAttributes: { antialias: true },
    })
    mapRef.current = map
    map.scrollZoom.disable()
    map.touchZoomRotate.enable()
    map.addControl(new maplibregl.NavigationControl({ visualizePitch: true, showZoom: true, showCompass: true }), 'bottom-right')
    map.addControl(new maplibregl.AttributionControl({ compact: true }), 'bottom-left')

    map.on('load', () => {
      try { map.setTerrain({ source: 'terrain', exaggeration: 1.16 }) } catch { /* Satellite and buildings remain available. */ }
      onReady()
    })

    markersRef.current = projects.map((project, index) => {
      const button = document.createElement('button')
      button.className = 'map-pin'
      button.type = 'button'
      button.setAttribute('aria-label', `Focus ${project.name}, ${project.neighbourhood}`)
      button.innerHTML = `<span class="map-pin__rings"></span><span class="map-pin__core">${String(index + 1).padStart(2, '0')}</span><span class="map-pin__label"><b>${project.name.replace('Amara ', '')}</b><small>${project.neighbourhood}</small></span>`
      button.addEventListener('click', () => {
        onSelect(index)
        if (project.id === 'alaaya') onOpenProject(index, button)
      })
      return new maplibregl.Marker({ element: button, anchor: 'center' }).setLngLat(project.coordinates).addTo(map)
    })

    return () => {
      markersRef.current.forEach(marker => marker.remove())
      markersRef.current = []
      map.remove()
      mapRef.current = null
    }
  }, [onOpenProject, onReady, onSelect, projects])

  useEffect(() => {
    const map = mapRef.current
    if (!map || !descentStarted || cityDescentStarted.current) return
    cityDescentStarted.current = true
    flyToCity(map, window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  }, [descentStarted])

  useEffect(() => {
    markersRef.current.forEach((marker, index) => {
      const element = marker.getElement()
      element.classList.toggle('is-active', index === activeIndex)
      element.setAttribute('aria-pressed', String(index === activeIndex))
    })
    const map = mapRef.current
    if (!map || !introComplete) return
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (firstProjectFocus.current) firstProjectFocus.current = false
    flyToProject(map, projects[activeIndex].coordinates, activeIndex, reducedMotion)
  }, [activeIndex, introComplete, projects])

  useEffect(() => {
    const map = mapRef.current
    const previous = previousCinematicIndex.current
    previousCinematicIndex.current = cinematicProjectIndex
    if (!map || !introComplete) return
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (cinematicProjectIndex !== null) {
      const project = projects[cinematicProjectIndex]
      map.easeTo({ center: project.coordinates, zoom: 17.1, pitch: 67, bearing: -18, duration: reducedMotion ? 0 : 900, essential: true })
    } else if (previous !== null) {
      flyToProject(map, projects[activeIndex].coordinates, activeIndex, reducedMotion)
    }
  }, [activeIndex, cinematicProjectIndex, introComplete, projects])

  return <div ref={containerRef} className="live-map" aria-label="Interactive satellite and 3D map of Amara projects in Chennai" />
}
