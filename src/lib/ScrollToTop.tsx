import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { refreshScrollTriggers } from '../animations'

/**
 * Resets scroll position on route change, except when navigating to a
 * #hash target (HashLink handles that scroll itself).
 *
 * Also re-measures scroll-triggered animations once the new page has
 * rendered, so their trigger points match the new page's layout.
 */
export default function ScrollToTop() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (!hash) window.scrollTo(0, 0)

    // Wait a frame so the incoming page is laid out before measuring.
    const frame = requestAnimationFrame(refreshScrollTriggers)
    return () => cancelAnimationFrame(frame)
  }, [pathname, hash])

  return null
}
