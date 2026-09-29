import { useState, useCallback } from 'react'
import { ChennaiMap } from '../ChennaiMap'
import { ProjectCard } from '../ProjectCard'
import { projects } from '../../data/projects'
import { cinematicProjectsByProjectId } from '../../data/cinematicProjects'

interface ChennaiCityCollectionProps {
  onOpenCinematicModal?: (index: number) => void
}

export function ChennaiCityCollection({ onOpenCinematicModal }: ChennaiCityCollectionProps) {
  const [activeProjectIndex, setActiveProjectIndex] = useState(2)
  const [, setMapReady] = useState(false)

  const handleSelect = useCallback((index: number) => {
    setActiveProjectIndex(Math.max(0, Math.min(projects.length - 1, index)))
  }, [])

  return (
    <section id="chennai-map" className="collection-section" aria-label="Amara Chennai City Collection">
      <div className="collection-header">
        <span className="collection-eyebrow">Chennai City Collection · 10 Prime Addresses</span>
        <h2 className="collection-title">An archipelago of architectural distinction across Chennai.</h2>
        <p className="collection-desc">
          From the leafy heritage of Egmore to the vertical pulse of Koyambedu, Amara crafts bespoke
          residences anchored to the culture and energy of their neighborhoods.
        </p>
      </div>

      <div className="collection-map-stage">
        <div className="collection-live-map">
          <ChennaiMap
            projects={projects}
            activeIndex={activeProjectIndex}
            descentStarted={true}
            introComplete={true}
            cinematicProjectIndex={null}
            onSelect={handleSelect}
            onOpenProject={(idx) => {
              if (onOpenCinematicModal) onOpenCinematicModal(idx)
            }}
            onReady={() => setMapReady(true)}
          />
        </div>

        <div className="collection-card-overlay">
          <ProjectCard
            project={projects[activeProjectIndex]}
            index={activeProjectIndex}
            count={projects.length}
            onExplore={
              cinematicProjectsByProjectId[projects[activeProjectIndex].id]
                ? (idx) => onOpenCinematicModal?.(idx)
                : undefined
            }
            onPrevious={() => handleSelect(activeProjectIndex - 1)}
            onNext={() => handleSelect(activeProjectIndex + 1)}
          />
        </div>

        <nav className="collection-rail" aria-label="Select Chennai project address">
          {projects.map((proj, idx) => {
            const isSelected = idx === activeProjectIndex
            return (
              <button
                key={proj.id}
                type="button"
                className={`collection-rail-item ${isSelected ? 'is-selected' : ''}`}
                onClick={() => handleSelect(idx)}
              >
                <span className="rail-item-num">{String(idx + 1).padStart(2, '0')}</span>
                <span className="rail-item-name">{proj.name.replace('Amara ', '')}</span>
                <span className="rail-item-place">{proj.neighbourhood}</span>
              </button>
            )
          })}
        </nav>
      </div>
    </section>
  )
}
