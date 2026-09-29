import { useScrollReveal } from '../../hooks/useScrollReveal'

interface StoryBlock {
  title: string
  subtitle?: string
  description: string
  image: string
  imageAlt: string
  reversed?: boolean
}

const STORY_BLOCKS: StoryBlock[] = [
  {
    title: 'Trustworthy',
    description:
      'At Amara Homes, we embody the highest level of standards, realizing our vision without compromise. Honesty and integrity at the heart of every conversation, every pricing decision, and every material choice. The people behind Amara Homes take an unprecedented approach to service and exceptional standards of care.',
    image: '/frames/project-03/frame_0000.jpg',
    imageAlt: 'Amara Anika Arrival Canopy',
    reversed: false,
  },
  {
    title: 'Beautiful',
    description:
      'Amara Homes is a brand renowned for its ability to craft some of the most elegant homes with lasting impressions. Each Amara home speaks to the undeniable power of beauty. We have taken a novel approach to refinement, crafting beautiful living spaces for the most discerning residents.',
    image: '/frames/project-03/frame_0144.jpg',
    imageAlt: 'Amara Anika Sky Living Terrace',
    reversed: true,
  },
  {
    title: 'Considered Architecture',
    description:
      'Conceived as nine singular residential pavilions in historic Egmore, Amara Anika balances textured hand-laid kiln brickwork with expansive cantilevered private sky terraces. Every residence is 100% Vaastu compliant with 3.4-meter ceiling clearances, offering cathedral-like volume and acoustic quiet.',
    image: '/frames/project-03/frame_0239.jpg',
    imageAlt: 'Amara Anika Twilight Silhouette',
    reversed: false,
  },
]

function StoryRowCard({ block }: { block: StoryBlock }) {
  const [rowRef, isRevealed] = useScrollReveal({
    threshold: 0.15,
    rootMargin: '0px 0px -40px 0px',
  })

  return (
    <div
      ref={rowRef}
      className={`amara-story-row ${block.reversed ? 'is-reversed' : ''} ${isRevealed ? 'is-revealed' : ''}`}
    >
      <div className="story-text-col">
        <h2 className="amara-story-title">{block.title}</h2>
        <div className="amara-heading-bar" />
        <p className="amara-story-body">{block.description}</p>
      </div>

      <div className="story-image-col">
        <div className="story-image-wrapper">
          <div className="story-image-shimmer" aria-hidden="true" />
          <img
            src={block.image}
            alt={block.imageAlt}
            className="story-image"
            loading="lazy"
          />
        </div>
      </div>
    </div>
  )
}

export function ArchitecturalManifesto() {
  const [statsRef, isStatsRevealed] = useScrollReveal({
    threshold: 0.2,
    rootMargin: '0px 0px -40px 0px',
  })

  return (
    <section id="architecture" className="manifesto-section" aria-label="Architectural Manifesto">
      <div className="manifesto-container">
        {/* Alternating Amara Story Blocks with Scroll-Triggered Transition Motion */}
        <div className="amara-story-list">
          {STORY_BLOCKS.map((block) => (
            <StoryRowCard key={block.title} block={block} />
          ))}
        </div>

        {/* Key Architectural Metrics Banner with Staggered Entrance */}
        <div
          ref={statsRef}
          className={`manifesto-stats-grid ${isStatsRevealed ? 'is-revealed' : ''}`}
        >
          <div className="stat-box">
            <span className="stat-number">9</span>
            <span className="stat-name">Levels of Poise</span>
            <span className="stat-desc">Montieth Road Vantage</span>
          </div>
          <div className="stat-box">
            <span className="stat-number">100%</span>
            <span className="stat-name">Vaastu Compliant</span>
            <span className="stat-desc">Solar & Wind Aligned</span>
          </div>
          <div className="stat-box">
            <span className="stat-number">3.4m</span>
            <span className="stat-name">Ceiling Heights</span>
            <span className="stat-desc">Expansive Spatial Freedom</span>
          </div>
          <div className="stat-box">
            <span className="stat-number">2</span>
            <span className="stat-name">Private Elevators</span>
            <span className="stat-desc">Dedicated Foyer Arrival</span>
          </div>
        </div>
      </div>
    </section>
  )
}

