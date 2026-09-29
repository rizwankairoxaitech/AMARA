export function LuxuryFooter() {
  const scrollToTop = (e: React.MouseEvent) => {
    e.preventDefault()
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <footer className="luxury-footer" aria-label="Amara Homes Footer">
      <div className="footer-inner">
        <div className="footer-top">
          <div className="footer-brand-pane">
            <img src="/amara-logo.png" alt="Amara Homes" className="footer-logo" />
            <p className="footer-motto">
              Shaping landmark residential architecture across Chennai’s most revered neighborhoods.
            </p>
          </div>

          <div className="footer-nav-columns">
            <div className="footer-col">
              <h4>Amara Anika</h4>
              <p>Montieth Road / Red Cross Road</p>
              <p>Egmore, Chennai 600008</p>
              <p>Tamil Nadu, India</p>
            </div>

            <div className="footer-col">
              <h4>Navigation</h4>
              <ul>
                <li><a href="#top" onClick={scrollToTop}>Cinematic Film</a></li>
                <li><a href="#architecture">Architecture & Pillars</a></li>
                <li><a href="#specifications">Living Spaces & Specs</a></li>
                <li><a href="#chennai-map">Chennai Collection Map</a></li>
                <li><a href="#consultation">Private Viewing</a></li>
              </ul>
            </div>

            <div className="footer-col">
              <h4>Regulatory</h4>
              <p>TN RERA No: TN/29/Building/0142/2023</p>
              <p>Available at: rera.tn.gov.in</p>
              <p>Architectural design subject to local sanctions.</p>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <span className="copyright">© {new Date().getFullYear()} Amara Homes LLP. All rights reserved.</span>
          <button type="button" className="btn-return-top" onClick={scrollToTop}>
            Replay Cinematic Film ↑
          </button>
        </div>
      </div>
    </footer>
  )
}
