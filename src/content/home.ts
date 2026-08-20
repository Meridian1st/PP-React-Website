/**
 * Shared site-wide content (nav, contact) plus homepage-only copy.
 *
 * The homepage is a short overview/hub: hero, a brief "two ways in" teaser
 * linking through to the dedicated /charities and /business pages, and a
 * contact section. Full service detail lives on those dedicated pages —
 * see content/charities.ts and content/business.ts.
 */

export const CONTACT_EMAIL = 'hello@purposepartners.co.uk'

export type NavItem = {
  href: string
  label: string
  /** Sub-label shown only in the mobile drawer. */
  hint?: string
}

export const NAV_ITEMS: NavItem[] = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About Us' },
  { href: '/charities', label: 'Charities', hint: 'Strategy, income, governance' },
  { href: '/business', label: 'Business', hint: 'Social value, CSR, ESG' },
]

export type AudienceTeaser = {
  id: string
  variant: 'charities' | 'businesses'
  eyebrow: string
  title: string
  blurb: string
  /** Short highlight list — the full, expanded service breakdown lives on the dedicated page. */
  highlights: string[]
  cta: string
  href: string
}

export const AUDIENCE_TEASERS: AudienceTeaser[] = [
  {
    id: 'charities',
    variant: 'charities',
    eyebrow: 'For charities & social enterprises',
    title: 'Clear thinking, made practical',
    blurb:
      'Consultancy and facilitation for small and mid-sized teams, sized to the time and budget you actually have.',
    highlights: [
      'Strategic planning',
      'Income diversification',
      'Governance and impact measurement',
    ],
    cta: 'Explore charity support',
    href: '/charities',
  },
  {
    id: 'businesses',
    variant: 'businesses',
    eyebrow: 'For businesses',
    title: 'Social value that survives scrutiny',
    blurb:
      'Social impact embedded in operations rather than bolted on for the annual report.',
    highlights: [
      'Social value, CSR and ESG strategy',
      'Corporate volunteering',
      'Charity partnerships',
    ],
    cta: 'Explore business support',
    href: '/business',
  },
]
