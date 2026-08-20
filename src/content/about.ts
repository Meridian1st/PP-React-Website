/**
 * Copy for the dedicated /about page.
 *
 * Becci's content is carried over unchanged from the old homepage Founder
 * section. The second team-member section is a placeholder using Latin
 * filler text until real copy is supplied — see PARTNER_TWO below.
 */

export type Credential = {
  label: string
  value: string
}

export const BECCI_CREDENTIALS: Credential[] = [
  { label: 'Strategy', value: 'OC&C Strategy Consultants, London' },
  { label: 'Leadership', value: 'Chief executive, mid-sized and start-up charities' },
  { label: 'Commercial', value: 'Multi-million-pound income for a national charity' },
  { label: 'Education', value: 'BA (Hons), University of Oxford · ILM-accredited coach' },
]

export const BECCI = {
  eyebrow: 'The founder',
  title: 'Becci Blues has sat on both sides of the table',
  bio: `Fifteen years across charity leadership and commercial consulting. She began
    at OC&C Strategy Consultants in London, then held chief executive roles at
    mid-sized and start-up charities, and delivered multi-million-pound
    commercial income for a national charity. The result is advice that holds up
    in a boardroom and lands in a team of four.`,
  team: 'She is joined by Emma Lindsey on sustainability and ESG, and Ruth Fawcett on fundraising.',
  pullquote:
    'Commercial clients during her OC&C years included Sainsbury’s, Morrisons, the RAC, Argos, Pure Gym and Heineken.',
  disclaimer:
    'Client work delivered at OC&C Strategy Consultants, not engagements of Purpose Partners Ltd',
}

/**
 * PLACEHOLDER — Harry to supply real copy for the second team member/business
 * partner. Latin filler text used deliberately per his request, so this is
 * unmistakably a placeholder until replaced in this file.
 */
export const PARTNER_TWO_CREDENTIALS: Credential[] = [
  { label: 'Placeholder', value: 'Lorem ipsum dolor sit amet' },
  { label: 'Placeholder', value: 'Consectetur adipiscing elit' },
  { label: 'Placeholder', value: 'Sed do eiusmod tempor incididunt' },
  { label: 'Placeholder', value: 'Ut labore et dolore magna aliqua' },
]

export const PARTNER_TWO = {
  eyebrow: 'The co-founder',
  title: 'Lorem ipsum dolor sit amet, consectetur',
  bio: `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
    tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
    veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
    commodo consequat. Duis aute irure dolor in reprehenderit in voluptate
    velit esse cillum dolore eu fugiat nulla pariatur.`,
  team: 'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
  pullquote:
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt.',
  disclaimer: 'Placeholder content — replace with real copy for this team member',
}
