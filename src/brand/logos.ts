/**
 * ------------------------------------------------------------------
 * Brand assets — supplied by the client.
 * ------------------------------------------------------------------
 *
 * Every logo variant the site can render is registered here, with its
 * intrinsic aspect ratio so components can size by height alone and still
 * reserve the right amount of space (no layout shift while the SVG loads).
 *
 * Files live in `public/brand/`, so these paths are served from the site
 * root and are stable in dev and in the production build alike.
 *
 * To swap which lockup a component uses, change the `variant` prop at the
 * call site — never a path in the component itself.
 */

export type LogoVariant =
  | 'teal'
  | 'monoBlack'
  | 'reversedWhite'
  | 'duotone'
  | 'primary'
  | 'icon'
  | 'iconWhite'

type LogoAsset = {
  src: string
  /** width / height of the artwork, used to derive the rendered width. */
  ratio: number
  /** Human note on where each variant is meant to be used. */
  use: string
}

export const LOGOS: Record<LogoVariant, LogoAsset> = {
  /** Transparent background, teal strokes — for the pale `--paper` surfaces. */
  teal: {
    src: '/brand/purpose-partners-teal.svg',
    ratio: 682 / 240,
    use: 'Default lockup on light backgrounds (header, footer).',
  },
  /** Transparent, near-black — mono/print contexts. */
  monoBlack: {
    src: '/brand/purpose-partners-mono-black.svg',
    ratio: 682 / 240,
    use: 'Single-colour contexts where teal is unavailable.',
  },
  /** Transparent, white strokes — for the dark `--ink` sections. */
  reversedWhite: {
    src: '/brand/purpose-partners-reversed-white.svg',
    ratio: 682 / 240,
    use: 'Dark backgrounds, e.g. the founder section on /about.',
  },
  /** Two-tone teal + pale blue. */
  duotone: {
    src: '/brand/purpose-partners-duotone.svg',
    ratio: 682 / 240,
    use: 'Decorative two-tone treatment.',
  },
  /** The full badge: white lockup on a rounded teal tile. */
  primary: {
    src: '/brand/purpose-partners-primary.svg',
    ratio: 754 / 348,
    use: 'Standalone badge — social sharing images, app tiles.',
  },
  /** PP monogram, white on teal. */
  icon: {
    src: '/brand/purpose-partners-icon.svg',
    ratio: 1,
    use: 'Favicon and app icon.',
  },
  /** PP monogram, teal on white. */
  iconWhite: {
    src: '/brand/purpose-partners-icon-white.svg',
    ratio: 1,
    use: 'App icon on surfaces that need a light tile.',
  },
}

/** Raster assets referenced from index.html / the web manifest. */
export const BRAND_RASTER = {
  favicon32: '/brand/favicon-32.png',
  icon192: '/brand/purpose-partners-icon-192w.png',
  icon512: '/brand/purpose-partners-icon-512w.png',
  socialCard: '/brand/purpose-partners-primary-1200w.png',
} as const

/** The brand teal, matching `--teal` in globals.css. */
export const BRAND_TEAL = '#027F7C'
