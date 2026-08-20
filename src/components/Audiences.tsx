import { Link } from 'react-router-dom'
import { AUDIENCE_TEASERS } from '../content/home'
import { useStaggerReveal, useCascade } from '../animations'

/**
 * Homepage "Two ways in" teaser: a short highlight list for each audience,
 * linking through to the full /charities and /business pages for detail.
 */
export default function Audiences() {
  // The two cards enter one after the other as the section scrolls in...
  const sectionRef = useStaggerReveal<HTMLElement>('.audience')
  // ...and the highlight rows ripple in behind them, slightly quicker.
  const gridRef = useCascade<HTMLDivElement>('.audience__list li')

  return (
    <section
      id="audiences"
      className="shell audiences"
      aria-labelledby="audiences-label"
      ref={sectionRef}
    >
      <span className="eyebrow eyebrow--muted audiences__label" id="audiences-label">
        Two ways in
      </span>

      <div className="audiences__grid" ref={gridRef}>
        {AUDIENCE_TEASERS.map((audience) => (
          <div
            key={audience.id}
            id={audience.id}
            className={`audience audience--${audience.variant}`}
          >
            <span className="audience__tick" aria-hidden="true" />
            <span className={`eyebrow eyebrow--${audience.variant === 'charities' ? 'teal' : 'navy'}`}>
              {audience.eyebrow}
            </span>
            <h2 className="audience__title">{audience.title}</h2>
            <p className="audience__blurb">{audience.blurb}</p>

            <ul className="audience__list">
              {audience.highlights.map((highlight) => (
                <li key={highlight}>{highlight}</li>
              ))}
            </ul>

            <Link
              to={audience.href}
              className={`link-rule link-rule--cta link-rule--${
                audience.variant === 'charities' ? 'teal' : 'navy'
              } audience__cta`}
            >
              {audience.cta}
            </Link>
          </div>
        ))}
      </div>
    </section>
  )
}
