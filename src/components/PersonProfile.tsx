import type { Credential } from '../content/about'

type PersonProfileProps = {
  id: string
  eyebrow: string
  title: string
  bio: string
  team?: string
  pullquote: string
  disclaimer: string
  credentials: Credential[]
  portraitLabel: string
  /** Drop a real portrait in here; falls back to the hatched placeholder. */
  portraitSrc?: string
  /** Set on placeholder profiles so it's visually obvious pending real copy. */
  isPlaceholder?: boolean
}

/**
 * A single team member's profile — bio, credentials, portrait slot.
 * Refactored from the old homepage Founder section so /about can render it
 * more than once (Becci, plus a placeholder second partner).
 */
export default function PersonProfile({
  id,
  eyebrow,
  title,
  bio,
  team,
  pullquote,
  disclaimer,
  credentials,
  portraitLabel,
  portraitSrc,
  isPlaceholder = false,
}: PersonProfileProps) {
  return (
    <section
      id={id}
      className={`founder${isPlaceholder ? ' founder--placeholder' : ''}`}
      aria-labelledby={`${id}-title`}
    >
      <div className="shell">
        {isPlaceholder && <span className="founder__placeholder-flag">Placeholder content</span>}
        <div className="founder__body">
          <div className="founder__main">
            <span className="eyebrow eyebrow--pale">{eyebrow}</span>
            <h2 className="founder__title" id={`${id}-title`}>
              {title}
            </h2>
            <p className="founder__bio">{bio}</p>
            {team && <p className="founder__team">{team}</p>}

            <dl className="credentials">
              {credentials.map((credential) => (
                <div key={credential.label} className="credential">
                  <dt className="credential__label">{credential.label}</dt>
                  <dd className="credential__value">{credential.value}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="founder__aside">
            {portraitSrc ? (
              <div className="portrait portrait--filled">
                <img className="portrait__image" src={portraitSrc} alt={portraitLabel} />
              </div>
            ) : (
              <div className="portrait">
                <span className="portrait__note">
                  portrait — {portraitLabel}
                  <br />
                  4:5, natural light, no stock
                </span>
              </div>
            )}

            <p className="founder__pullquote">{pullquote}</p>
            <span className="founder__disclaimer">{disclaimer}</span>
          </div>
        </div>
      </div>
    </section>
  )
}
