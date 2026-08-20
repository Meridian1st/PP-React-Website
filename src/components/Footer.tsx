import { Link } from 'react-router-dom'
import { CONTACT_EMAIL } from '../content/home'
import { useCascade } from '../animations'
import Logo from './Logo'

export default function Footer() {
  // Footer columns settle in as the foot of the page comes into view.
  const ref = useCascade<HTMLDivElement>('.footer__brand, .footer__col')

  return (
    <footer className="footer">
      <div className="shell footer__inner" ref={ref}>
        <div className="footer__top">
          <div className="footer__brand">
            <Logo
              variant="teal"
              height={48}
              className="footer__logo"
              alt="Purpose Partners"
            />
            <p className="footer__blurb">
              Consultancy and facilitation for charities, social enterprises and the
              businesses that partner with them.
            </p>
          </div>

          <div className="footer__col">
            <span className="footer__col-head">Contact</span>
            <a href={`mailto:${CONTACT_EMAIL}`} className="footer__link">
              {CONTACT_EMAIL}
            </a>
            {/* TODO: swap for the real LinkedIn company page URL. */}
            <a href="/" className="footer__link">
              LinkedIn
            </a>
          </div>

          <div className="footer__col">
            <span className="footer__col-head">Sections</span>
            <Link to="/charities" className="footer__link">
              Charities
            </Link>
            <Link to="/business" className="footer__link">
              Business
            </Link>
            <Link to="/about" className="footer__link">
              About us
            </Link>
          </div>

          <div className="footer__col footer__col--wide">
            <span className="footer__col-head">Where we work</span>
            <span className="footer__note">
              Based in North Yorkshire, working with organisations across the UK.
            </span>
          </div>
        </div>

        <div className="footer__legal">
          <span>
            Purpose Partners is the trading name of Purpose Partners Ltd, registered in
            England and Wales.
          </span>
          <span>© {new Date().getFullYear()} Purpose Partners Ltd</span>
        </div>
      </div>
    </footer>
  )
}
