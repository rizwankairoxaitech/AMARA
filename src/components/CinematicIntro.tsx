type Props = { loaded: boolean; started: boolean; complete: boolean; onStart: () => void; onSkip: () => void }

export function CinematicIntro({ loaded, started, complete, onStart, onSkip }: Props) {
  return (
    <div className={`cinematic-intro ${loaded ? 'is-loaded' : ''} ${complete ? 'is-complete' : ''}`}>
      <div className="cinematic-intro__loader">
        <img src="/amara-logo.png" alt="Amara Homes" />
        <span>Chennai · 10 signature addresses</span>
        <div className="cinematic-intro__track"><i /></div>
        <small>{started ? 'Descending' : loaded ? 'Ready above Chennai' : 'Preparing the city'}</small>
      </div>
      <div className="cinematic-intro__copy">
        <p>The Amara City Collection</p>
        <h1>Chennai,<br/><em>elevated.</em></h1>
        <span>Descend through the clouds and discover ten singular addresses shaping the city’s most coveted neighbourhoods.</span>
      </div>
      {loaded && !started && <button type="button" className="cinematic-intro__descent-cue" onClick={onStart}><i /><span>Scroll or tap to descend</span></button>}
      <button type="button" className="cinematic-intro__skip" onClick={onSkip}>Skip intro</button>
    </div>
  )
}
