/**
 * Copy for the dedicated /charities page.
 *
 * Each service from the old homepage bullet list now gets its own short
 * description, so the page stands on its own rather than just repeating
 * the homepage teaser.
 */

export const CHARITIES_HERO = {
  eyebrow: 'For charities & social enterprises',
  title: 'Clear thinking, made practical',
  blurb:
    'Consultancy and facilitation for small and mid-sized teams, sized to the time and budget you actually have. We work alongside charities and social enterprises to turn hard questions into decisions your board and your team can actually act on.',
}

export type ServiceDetail = {
  title: string
  description: string
}

export const CHARITIES_SERVICES: ServiceDetail[] = [
  {
    title: 'Strategic planning',
    description:
      'Strategic planning that ends in decisions people can act on, not a document that sits on a shared drive. We help boards and leadership teams get clear on priorities, so resource allocation and everyday decision-making get easier, not harder.',
  },
  {
    title: 'Income diversification',
    description:
      'A broader, steadier income base built on what the organisation can realistically deliver, so you rely less on any single funder. We help develop investable business cases and new income routes that hold up under scrutiny.',
  },
  {
    title: 'Governance and impact measurement',
    description:
      'Governance that supports the work rather than slowing it down, paired with impact measurement that stands up to a funder or a board. The result is confident reporting and evidence of what is actually working.',
  },
  {
    title: 'People and operations',
    description:
      'Teams that are clear on their remit and structures that match the size of the organisation you actually are. We look at roles, capacity and day-to-day operations so the people doing the work are set up to do it well.',
  },
  {
    title: 'Facilitated away days',
    description:
      'Facilitated sessions for boards and staff teams that create space to think beyond the day-to-day — useful for strategy resets, away days, and moments where a neutral outside voice helps the room reach a real decision.',
  },
]

export const CHARITIES_CTA = 'Talk to us about your charity'
