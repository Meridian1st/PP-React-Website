import { Link, useLocation, useNavigate, type LinkProps } from 'react-router-dom'

/**
 * A <Link> that also scrolls to an in-page #hash target, including when the
 * hash points at the page we're already on (plain react-router Links don't
 * scroll in that case, since the URL "change" is just the hash).
 */
export function HashLink({ to, onClick, ...props }: LinkProps) {
  const navigate = useNavigate()
  const location = useLocation()

  const href = typeof to === 'string' ? to : `${to.pathname ?? ''}${to.hash ?? ''}`
  const [path, hash] = href.split('#')
  const targetPath = path || '/'

  return (
    <Link
      to={to}
      onClick={(event) => {
        onClick?.(event)
        if (event.defaultPrevented) return

        const alreadyThere = location.pathname === targetPath
        if (alreadyThere && hash) {
          event.preventDefault()
          const el = document.getElementById(hash)
          el?.scrollIntoView({ behavior: 'smooth' })
          navigate(`${targetPath}#${hash}`, { replace: true })
        }
      }}
      {...props}
    />
  )
}
