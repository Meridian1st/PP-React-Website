/**
 * Copy for the dedicated /business page.
 *
 * Each service from the old homepage bullet list now gets its own short
 * description, mirroring the structure of content/charities.ts.
 */

export const BUSINESS_HERO = {
  eyebrow: 'For businesses',
  title: 'Social value that survives scrutiny',
  blurb:
    'Social impact embedded in operations rather than bolted on for the annual report. We work with businesses that fund and partner with charities to make sure that social value is genuine, well governed, and holds up when someone looks closely.',
}

export type ServiceDetail = {
  title: string
  description: string
}

export const BUSINESS_SERVICES: ServiceDetail[] = [
  {
    title: 'Social value, CSR and ESG strategy',
    description:
      'Strategy that connects social value, CSR and ESG commitments to what the business actually does, rather than a set of pledges written for the annual report. We help build a plan that a board — and a funder or regulator — will find credible.',
  },
  {
    title: 'Corporate volunteering',
    description:
      'Volunteering programmes designed to be worthwhile for staff and genuinely useful for the charities on the receiving end, not just a photo opportunity. We help match skills and time to work that actually needs doing.',
  },
  {
    title: 'Charity partnerships',
    description:
      'Partnerships with charities that are structured to work for both sides, from initial due diligence through to a relationship that lasts longer than one campaign or one financial year.',
  },
  {
    title: 'Community projects',
    description:
      'Practical, locally grounded community projects that reflect a genuine understanding of need, rather than a generic corporate giving programme applied everywhere the business operates.',
  },
  {
    title: 'Impact measurement and reporting',
    description:
      'Impact measurement and reporting that stands up to scrutiny from investors, regulators and the public — evidence of what social value work is actually achieving, not just what was spent on it.',
  },
]

export const BUSINESS_CTA = 'Talk to us about your business'
