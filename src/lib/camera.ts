import type { Map } from 'maplibre-gl'

export const CITY_OVERVIEW: [number, number] = [80.245, 13.06]

export function flyToCity(map: Map, reducedMotion: boolean) {
  map.flyTo({
    center: CITY_OVERVIEW,
    zoom: 11.45,
    pitch: 54,
    bearing: -19,
    duration: reducedMotion ? 0 : 5200,
    curve: 1.42,
    essential: false,
  })
}

export function flyToProject(map: Map, coordinates: [number, number], index: number, reducedMotion: boolean) {
  map.stop()
  if (reducedMotion) {
    map.jumpTo({ center: coordinates, zoom: index === 0 ? 14.35 : 15.05, pitch: 58, bearing: -18 })
    return
  }

  const currentZoom = map.getZoom()
  map.easeTo({
    zoom: Math.min(currentZoom, 12.8),
    pitch: 48,
    bearing: -18 + (index % 3) * 3,
    duration: 420,
    easing: t => 1 - Math.pow(1 - t, 3),
  })

  window.setTimeout(() => {
    map.flyTo({
      center: coordinates,
      zoom: index === 0 ? 14.35 : 15.05,
      pitch: 61,
      bearing: -22 + (index % 4) * 4,
      duration: 1850,
      curve: 1.28,
      essential: false,
      easing: t => t < .5 ? 8 * t * t * t * t : 1 - Math.pow(-2 * t + 2, 4) / 2,
    })
  }, 360)
}
