import { useEffect, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { HashLink } from '../lib/HashLink'
import { NAV_ITEMS } from '../content/home'
import { useHeaderIntro } from '../animations'

/**
 * Sticky header. The desktop nav / menu-button swap is handled in CSS at the
 * 1040px breakpoint; React only owns whether the drawer is open.
 *
 * Nav items are real routes now (see content/home.ts) rather than in-page
 * anchors, so active state comes from NavLink matching the current URL.
 */
export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const headerRef = useHeaderIntro<HTMLElement>()

  // Close the drawer if the viewport grows past the breakpoint, so it can't
  // be left open behind the desktop nav.
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 1040px)')
    const sync = () => {
      if (!mq.matches) setMenuOpen(false)
    }
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [])

  const closeNav = () => setMenuOpen(false)

  return (
    <header className="header" ref={headerRef}>
      <div className="header__bar">
        <Link to="/" className="wordmark header__wordmark" onClick={closeNav}>
          Purpose Partners
          <span className="wordmark__dot" aria-hidden="true" />
        </Link>

        <nav className="nav" aria-label="Primary">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.href}
              to={item.href}
              end={item.href === '/'}
              className={({ isActive }) =>
                `nav__link${isActive ? ' nav__link--active' : ''}`
              }
            >
              {item.label}
            </NavLink>
          ))}
          <HashLink to="/#contact" className="nav__link nav__link--cta">
            Get in Touch
          </HashLink>
        </nav>

        <button
          type="button"
          className="nav-toggle"
          aria-expanded={menuOpen}
          aria-controls="mobile-nav"
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? 'Close' : 'Menu'}
          <span className="nav-toggle__bars" aria-hidden="true">
            <span />
            <span />
          </span>
        </button>
      </div>

      {menuOpen && (
        <div className="mobile-nav" id="mobile-nav">
          <nav aria-label="Mobile">
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.href}
                to={item.href}
                end={item.href === '/'}
                onClick={closeNav}
                className={`mobile-nav__link${
                  item.hint ? ' mobile-nav__link--split' : ''
                }`}
              >
                {item.label}
                {item.hint && <span className="mobile-nav__hint">{item.hint}</span>}
              </NavLink>
            ))}
            <HashLink to="/#contact" onClick={closeNav} className="mobile-nav__cta">
              Get in Touch
            </HashLink>
          </nav>
        </div>
      )}
    </header>
  )
}
