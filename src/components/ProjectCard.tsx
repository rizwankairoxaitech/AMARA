import type { Project } from '../data/projects'

function ArrowIcon(){return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M14 7l5 5-5 5"/></svg>}

type Props = {
  project: Project
  index: number
  count: number
  onExplore?: (index: number, trigger?: HTMLElement) => void
  onPrevious: () => void
  onNext: () => void
}

export function ProjectCard({ project, index, count, onExplore, onPrevious, onNext }: Props) {
  const openProject = (event: React.MouseEvent<HTMLElement>) => {
    if ((event.target as HTMLElement).closest('button, a, details')) return
    if (onExplore) {
      onExplore(index, event.currentTarget)
      return
    }
    window.open(project.href, '_blank', 'noopener,noreferrer')
  }

  const exploreProject = (event: React.MouseEvent<HTMLElement>) => {
    if (onExplore) onExplore(index, event.currentTarget)
  }

  return (
    <article className="project-card" aria-live="polite" onClick={openProject}>
      {onExplore ? <button type="button" className="project-card__image-wrap" onClick={exploreProject} aria-label={`Open the ${project.name} cinematic experience`}>
        <img src={project.image} alt={`${project.name} exterior`} className="project-card__image" />
        <span className="project-card__count">{String(index + 1).padStart(2,'0')} / {String(count).padStart(2,'0')}</span>
      </button> : <a className="project-card__image-wrap" href={project.href} target="_blank" rel="noreferrer" aria-label={`Explore ${project.name}`}>
        <img src={project.image} alt={`${project.name} exterior`} className="project-card__image" />
        <span className="project-card__count">{String(index + 1).padStart(2,'0')} / {String(count).padStart(2,'0')}</span>
      </a>}
      <div className="project-card__body">
        <div className="project-card__eyebrow"><span /> {project.neighbourhood}, Chennai</div>
        <h2>{project.name}</h2>
        <p className="project-card__address">{project.address}</p>
        <div className="project-card__facts"><span>{project.levels}</span><span>{project.homes}</span></div>
        <details className="location-note">
          <summary><span className={`precision-dot precision-dot--${project.precision}`} /> Location precision</summary>
          <p>{project.locationNote}</p>
        </details>
        <div className="project-card__actions">
          {onExplore ? <button type="button" className="project-card__explore" onClick={exploreProject}>Enter cinematic <ArrowIcon /></button> : <a href={project.href} target="_blank" rel="noreferrer">Explore project <ArrowIcon /></a>}
          <div className="project-card__nav" aria-label="Project navigation">
            <button type="button" onClick={onPrevious} aria-label="Previous project">←</button>
            <button type="button" onClick={onNext} aria-label="Next project">→</button>
          </div>
        </div>
      </div>
    </article>
  )
}
