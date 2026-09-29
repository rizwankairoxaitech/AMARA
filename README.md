# Amara Chennai project map — Phase 1

An immersive React + MapLibre satellite/3D experience for ten verified Amara Homes project addresses in Chennai.

## Run locally

```bash
npm install
npm run dev
```

No map token is required. The live map combines real satellite imagery, open vector building footprints, 3D extrusion and terrain data. Mouse-wheel input advances the project journey instead of zooming the map; dedicated controls and touch gestures remain available for manual exploration.

## Location data

`src/data/projects.ts` records the public source precision for each pin. Pins are based on published door numbers or mapped streets. Amara Sarita is explicitly marked as a neighbourhood-level placement because no public door number was found.
