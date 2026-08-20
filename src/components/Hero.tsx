import { HashLink } from '../lib/HashLink'
import { Link } from 'react-router-dom'
import { useIntroSequence, useDrawIn } from '../animations'

export default function Hero() {
  // Page-load intro: each element marked data-intro settles in, in order.
  const introRef = useIntroSequence<HTMLElement>('[data-intro]')
  // The hairline rule draws itself across between the two meta labels.
  const ruleRef = useDrawIn<HTMLSpanElement>()

  return (
    <section className="shell hero" ref={introRef}>
      <div className="hero__meta">
        <span className="eyebrow eyebrow--teal" data-intro>
          Charity &amp; social enterprise consultancy
        </span>
        <span className="hero__meta-rule" aria-hidden="true" ref={ruleRef} />
        <span className="hero__place" data-intro>
          North Yorkshire · UK-wide
        </span>
      </div>

      <div className="hero__body">
        <h1 className="hero__title" data-intro>
          Expert support to
          <br />
          amplify your <span className="hero__accent">impact</span>
        </h1>

        <div className="hero__aside">
          <p className="hero__lede" data-intro>
            Strategy, income and governance work for charities and social enterprises —
            and social value, CSR and ESG strategy for the businesses that fund and
            partner with them. Brought by a consultant trained in top-tier commercial
            strategy and tested as a charity chief executive.
          </p>
          <div className="hero__actions" data-intro>
            <HashLink to="/#audiences" className="btn">
              Work with us
            </HashLink>
            <Link to="/about" className="link-rule">
              About us
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
