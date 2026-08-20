import { LOGOS, type LogoVariant } from '../brand/logos'

type LogoProps = {
  /** Which lockup to render — see `src/brand/logos.ts`. */
  variant?: LogoVariant
  /** Rendered height in px; width is derived from the artwork's ratio. */
  height: number
  className?: string
  /**
   * Alt text. Empty by default: the logo usually sits inside a link that
   * already carries an accessible name, and repeating it would make screen
   * readers announce the brand twice.
   */
  alt?: string
}

/**
 * Renders a brand lockup. Sizing is by height only, with width derived from
 * the artwork's intrinsic ratio so the space is reserved before the SVG
 * loads and nothing shifts on screen.
 */
export default function Logo({ variant = 'teal', height, className, alt = '' }: LogoProps) {
  const logo = LOGOS[variant]
  const width = Math.round(height * logo.ratio)

  return (
    <img
      src={logo.src}
      width={width}
      height={height}
      alt={alt}
      className={className}
      decoding="async"
    />
  )
}
