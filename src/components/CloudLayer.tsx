type Props = { revealing: boolean; hidden: boolean }

export function CloudLayer({ revealing, hidden }: Props) {
  return (
    <div className={`cinematic-clouds ${revealing ? 'is-revealing' : ''} ${hidden ? 'is-hidden' : ''}`} aria-hidden="true">
      <div className="cloud-depth cloud-depth--far" />
      <div className="cloud-depth cloud-depth--mid" />
      <div className="cloud-depth cloud-depth--near" />
      <div className="cloud-light" />
      <div className="atmospheric-haze" />
    </div>
  )
}
