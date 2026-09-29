import { useState } from 'react'
import { useScrollReveal } from '../../hooks/useScrollReveal'

interface SpaceHighlight {
  id: string
  name: string
  subtitle: string
  description: string
  specifications: string[]
  image: string
}

const HIGHLIGHTS: SpaceHighlight[] = [
  {
    id: 'living',
    name: 'The Grand Living Suite & Sky Terrace',
    subtitle: 'Expansive entertaining wrapped in light',
    description:
      'Seamless glass sliding portals open onto generous cantilevered decks. Crafted with large-format imported marble and integrated Lutron architectural mood lighting.',
    specifications: [
      'Italian Statuario marble flooring',
      'Saint-Gobain acoustic double glazing',
      'Deep cantilevered shaded balcony deck',
      'Concealed VRV multi-zone climate control',
    ],
    image: '/frames/project-03/frame_0144.jpg',
  },
  {
    id: 'arrival',
    name: 'Private Arrival Foyer & Elevator Lounge',
    subtitle: 'Bespoke threshold of seclusion',
    description:
      'Direct elevator access opens directly into an exclusive private foyer. Clad with custom walnut timber paneling and ambient recessed LED strip channels.',
    specifications: [
      'Dedicated biometric high-speed elevator access',
      'Solid Burma teak entrance door with smart lock',
      'Custom stone vanity & shoe vitrine',
      'Video door phone with concierge link',
    ],
    image: '/frames/project-03/frame_0072.jpg',
  },
  {
    id: 'master',
    name: 'Master Sanctuary & Ensuite Bath',
    subtitle: 'Unrivaled privacy and rest',
    description:
      'Engineered herringbone European oak flooring underfoot, panoramic morning eastern light, and an ensuite spa bath with freestanding soaking tub and Dornbracht rainfall fittings.',
    specifications: [
      'Engineered oak hardwood floors',
      'Gessi / Dornbracht gunmetal fixtures',
      'Frameless glass steam shower enclosure',
      'Expansive walk-in dressing wardrobe suite',
    ],
    image: '/frames/project-03/frame_0184.jpg',
  },
  {
    id: 'exterior',
    name: 'Evening Courtyard & Illuminated Facade',
    subtitle: 'A landmark presence at Montieth Road',
    description:
      'Warm custom exterior lighting scheme choreographs the textured brick facades and cascading lush planters against the golden hour sky.',
    specifications: [
      'Custom IP68 exterior architectural uplighters',
      'Automated drip irrigation for vertical greenery',
      'Illuminated signature Amara entry totem',
      '24/7 manned security & biometric barrier gates',
    ],
    image: '/frames/project-03/frame_0239.jpg',
  },
]

export function ResidenceSpecifications() {
  const [activeId, setActiveId] = useState(HIGHLIGHTS[0].id)
  const current = HIGHLIGHTS.find((h) => h.id === activeId) || HIGHLIGHTS[0]

  const [headerRef, isHeaderRevealed] = useScrollReveal({
    threshold: 0.15,
    rootMargin: '0px 0px -40px 0px',
  })

  const [cardRef, isCardRevealed] = useScrollReveal({
    threshold: 0.15,
    rootMargin: '0px 0px -40px 0px',
  })

  return (
    <section id="specifications" className="specs-section" aria-label="Residence Specifications">
      <div className="specs-container">
        <div
          ref={headerRef}
          className={`specs-header ${isHeaderRevealed ? 'is-revealed' : ''}`}
        >
          <span className="specs-eyebrow">Living Spaces · Material Distinction</span>
          <h2 className="specs-heading">Curated details for an elevated everyday rhythm.</h2>
          <p className="specs-subheading">
            Every millimeter at Amara Anika has been conceived with uncompromising rigor — from the
            tactile resistance of door handles to the acoustics of double-glazed glass panes.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="specs-tabs" role="tablist">
          {HIGHLIGHTS.map((item) => (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={item.id === activeId}
              className={`spec-tab-btn ${item.id === activeId ? 'is-active' : ''}`}
              onClick={() => setActiveId(item.id)}
            >
              {item.name.split('&')[0].trim()}
            </button>
          ))}
        </div>

        {/* Active Space Detail Card with Scroll Transition */}
        <div
          ref={cardRef}
          className={`specs-detail-grid ${isCardRevealed ? 'is-revealed' : ''}`}
        >
          <div className="specs-image-wrap">
            <img
              src={current.image}
              alt={current.name}
              className="specs-main-image"
              loading="lazy"
            />
            <div className="specs-image-caption">
              <span>{current.subtitle}</span>
            </div>
          </div>

          <div className="specs-info-pane">
            <span className="specs-info-tag">SIGNATURE RESIDENCE HIGHLIGHT</span>
            <h3 className="specs-info-title">{current.name}</h3>
            <p className="specs-info-desc">{current.description}</p>

            <div className="specs-features-list">
              <span className="features-header">SPECIFICATIONS & FITTINGS</span>
              <ul>
                {current.specifications.map((spec) => (
                  <li key={spec}>
                    <svg viewBox="0 0 24 24" className="spec-check-icon" aria-hidden="true">
                      <polyline points="20 6 9 17 4 12" fill="none" stroke="currentColor" strokeWidth="2" />
                    </svg>
                    <span>{spec}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

