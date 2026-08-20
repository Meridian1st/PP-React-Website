/**
 * ------------------------------------------------------------------
 * Contact page copy + form configuration
 * ------------------------------------------------------------------
 *
 * Same split as the rest of the site: copy and configuration live here,
 * the components just render what they are given.
 */

import { CONTACT_EMAIL } from './home'

export const CONTACT_HERO = {
  eyebrow: 'Get in touch',
  title: 'Start with a conversation, not a proposal',
  blurb:
    'Tell us what you are trying to change and we will come back to you. If we are not the right fit for the work, we will say so and, where we can, point you to someone who is.',
}

/**
 * ------------------------------------------------------------------
 * WHERE SUBMISSIONS GO  ← the one thing left to wire up
 * ------------------------------------------------------------------
 *
 * The form is complete and validates, but nothing is posted anywhere
 * until `endpoint` below is filled in.
 *
 * While `endpoint` is empty the form degrades gracefully: on submit it
 * opens the visitor's email client with a pre-filled message to
 * CONTACT_EMAIL. That means the form is genuinely usable even before it
 * is wired up — it never silently swallows an enquiry.
 *
 * To activate proper background submission, paste an endpoint URL from a
 * form service (Formspree, Web3Forms, Netlify Forms, Basin, …) here:
 *
 *     endpoint: 'https://formspree.io/f/xxxxxxxx',
 *
 * The form POSTs JSON with the keys: name, email, organisation, message.
 * Most services accept that shape as-is.
 */
export const FORM_CONFIG = {
  endpoint: '',
  /** Where the mailto fallback sends to while `endpoint` is empty. */
  fallbackEmail: CONTACT_EMAIL,
  fallbackSubject: 'Website enquiry — Purpose Partners',
} as const

export type FieldName = 'name' | 'email' | 'organisation' | 'message'

export type FormField = {
  name: FieldName
  label: string
  type: 'text' | 'email' | 'textarea'
  required: boolean
  /** Browser autofill hint. */
  autoComplete?: string
  /** Small note under the label. */
  hint?: string
  rows?: number
}

export const FORM_FIELDS: FormField[] = [
  {
    name: 'name',
    label: 'Your name',
    type: 'text',
    required: true,
    autoComplete: 'name',
  },
  {
    name: 'email',
    label: 'Email address',
    type: 'email',
    required: true,
    autoComplete: 'email',
  },
  {
    name: 'organisation',
    label: 'Organisation',
    type: 'text',
    required: false,
    autoComplete: 'organization',
    // No hint needed — the label already marks this field "(optional)".
  },
  {
    name: 'message',
    label: 'How can we help?',
    type: 'textarea',
    required: true,
    rows: 7,
    hint: 'A sentence or two on what you are trying to change is plenty to start.',
  },
]

/** Validation messages, kept here so wording stays consistent and editable. */
export const FORM_MESSAGES = {
  required: (label: string) => `${label} is required.`,
  email: 'Enter an email address in the format name@example.com.',
  submitting: 'Sending…',
  submit: 'Send enquiry',
  success:
    'Thank you — your enquiry has been sent. We aim to come back to you within two working days.',
  fallbackSuccess:
    'Your email client should now be open with your message ready to send. If nothing happened, email us directly at',
  error:
    'Something went wrong sending your enquiry. Please try again, or email us directly at',
  errorSummary: 'Please check the following:',
} as const

/** Contact details shown alongside the form. */
export const CONTACT_DETAILS = [
  { label: 'Email', value: CONTACT_EMAIL, href: `mailto:${CONTACT_EMAIL}` },
  { label: 'Where we work', value: 'North Yorkshire — working UK-wide' },
  { label: 'Response time', value: 'Within two working days' },
]
