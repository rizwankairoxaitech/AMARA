import { useState } from 'react'

export function PrivateConsultation() {
  const [submitted, setSubmitted] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    configuration: '4 BHK Sky Residence',
    preferredDate: '',
    notes: '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <section id="consultation" className="consultation-section" aria-label="Private Viewing Reservation">
      <div className="consultation-container">
        <div className="consultation-content">
          <span className="consultation-eyebrow">Private Viewing · Bespoke Concierge</span>
          <h2 className="consultation-heading">
            Experience Amara Anika in person.
          </h2>
          <p className="consultation-desc">
            We invite prospective residents to schedule a discreet private appointment at our Egmore
            Experience Lounge to review architectural models, material samples, and customized layouts.
          </p>

          <div className="consultation-contacts">
            <div className="contact-item">
              <span className="contact-label">ADDRESS</span>
              <p className="contact-value">Montieth Road / Red Cross Road, Egmore, Chennai 600008</p>
            </div>
            <div className="contact-item">
              <span className="contact-label">CONCIERGE DIRECT</span>
              <p className="contact-value">+91 (044) 4000 8888 · concierge@amarahomes.in</p>
            </div>
            <div className="contact-item">
              <span className="contact-label">VIEWING HOURS</span>
              <p className="contact-value">Tuesday – Sunday · 10:00 AM to 7:00 PM (By Appointment)</p>
            </div>
          </div>
        </div>

        <div className="consultation-form-card">
          {submitted ? (
            <div className="form-success-state">
              <svg viewBox="0 0 24 24" className="icon-check" aria-hidden="true">
                <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="1.5" />
                <path d="M8 12l2.5 2.5L16 9" fill="none" stroke="currentColor" strokeWidth="2" />
              </svg>
              <h3>Appointment Request Received</h3>
              <p>
                Our private client advisor will contact you within 4 business hours to confirm your tailored viewing
                schedule.
              </p>
              <button
                type="button"
                className="btn-reset"
                onClick={() => setSubmitted(false)}
              >
                Submit another inquiry
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="consultation-form">
              <h3 className="form-title">Reserve a Private Tour</h3>

              <div className="form-group">
                <label htmlFor="client-name">Full Name *</label>
                <input
                  id="client-name"
                  type="text"
                  required
                  placeholder="e.g. Ramesh Sundaram"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="client-phone">Phone Number *</label>
                  <input
                    id="client-phone"
                    type="tel"
                    required
                    placeholder="+91 98400 00000"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="client-email">Email Address *</label>
                  <input
                    id="client-email"
                    type="email"
                    required
                    placeholder="name@domain.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="client-config">Preferred Residence</label>
                  <select
                    id="client-config"
                    value={formData.configuration}
                    onChange={(e) => setFormData({ ...formData, configuration: e.target.value })}
                  >
                    <option value="3 BHK Signature Residence">3 BHK Signature Residence (3,400 sq.ft)</option>
                    <option value="4 BHK Sky Residence">4 BHK Sky Residence (4,250 sq.ft)</option>
                    <option value="Duplex Sky Villa">Duplex Sky Villa (5,200 sq.ft)</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="client-date">Preferred Date</label>
                  <input
                    id="client-date"
                    type="date"
                    value={formData.preferredDate}
                    onChange={(e) => setFormData({ ...formData, preferredDate: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="client-notes">Specific Requirements / Notes</label>
                <textarea
                  id="client-notes"
                  rows={3}
                  placeholder="Special preferences regarding floor level, vaastu or private parking..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                />
              </div>

              <button type="submit" className="form-submit-btn">
                Confirm Reservation Request
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  )
}
