import { useRef, useState } from 'react'
import {
  FORM_CONFIG,
  FORM_FIELDS,
  FORM_MESSAGES,
  type FieldName,
} from '../content/contact'
import { useCascade } from '../animations'

type Values = Record<FieldName, string>
type Errors = Partial<Record<FieldName, string>>
type Status = 'idle' | 'submitting' | 'success' | 'fallback' | 'error'

const EMPTY: Values = { name: '', email: '', organisation: '', message: '' }

/** Deliberately loose — just enough to catch typos, not to police valid addresses. */
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function validate(values: Values): Errors {
  const errors: Errors = {}

  for (const field of FORM_FIELDS) {
    const value = values[field.name].trim()
    if (field.required && !value) {
      errors[field.name] = FORM_MESSAGES.required(field.label)
      continue
    }
    if (field.type === 'email' && value && !EMAIL_PATTERN.test(value)) {
      errors[field.name] = FORM_MESSAGES.email
    }
  }

  return errors
}

/** Builds the mailto: fallback used while no endpoint is configured. */
function mailtoHref(values: Values): string {
  const body = [
    `Name: ${values.name}`,
    `Email: ${values.email}`,
    `Organisation: ${values.organisation || '—'}`,
    '',
    values.message,
  ].join('\n')

  const params = new URLSearchParams({
    subject: FORM_CONFIG.fallbackSubject,
    body,
  })
  return `mailto:${FORM_CONFIG.fallbackEmail}?${params.toString()}`
}

export default function ContactForm() {
  const [values, setValues] = useState<Values>(EMPTY)
  const [errors, setErrors] = useState<Errors>({})
  const [status, setStatus] = useState<Status>('idle')
  // Only start showing errors once a submit has been attempted, so the form
  // doesn't scold someone who is still filling it in.
  const [submitted, setSubmitted] = useState(false)

  const summaryRef = useRef<HTMLDivElement>(null)
  const honeypotRef = useRef<HTMLInputElement>(null)
  const fieldsRef = useCascade<HTMLDivElement>('.field')

  const update = (name: FieldName, value: string) => {
    const next = { ...values, [name]: value }
    setValues(next)
    if (submitted) setErrors(validate(next))
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSubmitted(true)

    // Bots fill hidden fields; humans can't see this one.
    if (honeypotRef.current?.value) return

    const found = validate(values)
    setErrors(found)
    if (Object.keys(found).length > 0) {
      // Move focus to the summary so the problem is announced immediately.
      requestAnimationFrame(() => summaryRef.current?.focus())
      return
    }

    // No endpoint configured yet — hand off to the visitor's email client
    // rather than pretending the enquiry was sent.
    if (!FORM_CONFIG.endpoint) {
      window.location.href = mailtoHref(values)
      setStatus('fallback')
      return
    }

    setStatus('submitting')
    try {
      const response = await fetch(FORM_CONFIG.endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(values),
      })
      if (!response.ok) throw new Error(`Request failed: ${response.status}`)
      setStatus('success')
      setValues(EMPTY)
      setSubmitted(false)
    } catch {
      setStatus('error')
    }
  }

  const errorEntries = Object.entries(errors) as [FieldName, string][]
  const showSummary = submitted && errorEntries.length > 0

  if (status === 'success') {
    return (
      <div className="form-status form-status--success" role="status">
        <p className="form-status__text">{FORM_MESSAGES.success}</p>
      </div>
    )
  }

  return (
    <form className="form" onSubmit={handleSubmit} noValidate>
      {showSummary && (
        <div
          className="form-summary"
          role="alert"
          tabIndex={-1}
          ref={summaryRef}
        >
          <p className="form-summary__title">{FORM_MESSAGES.errorSummary}</p>
          <ul className="form-summary__list">
            {errorEntries.map(([name, message]) => (
              <li key={name}>
                <a href={`#field-${name}`}>{message}</a>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div ref={fieldsRef}>
        {FORM_FIELDS.map((field) => {
          const error = submitted ? errors[field.name] : undefined
          const hintId = field.hint ? `hint-${field.name}` : undefined
          const errorId = error ? `error-${field.name}` : undefined
          const describedBy = [hintId, errorId].filter(Boolean).join(' ') || undefined

          return (
            <div className="field" key={field.name}>
              <label className="field__label" htmlFor={`field-${field.name}`}>
                {field.label}
                {!field.required && <span className="field__optional"> (optional)</span>}
              </label>

              {field.hint && (
                <span className="field__hint" id={hintId}>
                  {field.hint}
                </span>
              )}

              {field.type === 'textarea' ? (
                <textarea
                  className={`field__input field__input--textarea${error ? ' field__input--error' : ''}`}
                  id={`field-${field.name}`}
                  name={field.name}
                  rows={field.rows}
                  value={values[field.name]}
                  onChange={(e) => update(field.name, e.target.value)}
                  aria-invalid={error ? true : undefined}
                  aria-describedby={describedBy}
                  required={field.required}
                />
              ) : (
                <input
                  className={`field__input${error ? ' field__input--error' : ''}`}
                  id={`field-${field.name}`}
                  name={field.name}
                  type={field.type}
                  autoComplete={field.autoComplete}
                  value={values[field.name]}
                  onChange={(e) => update(field.name, e.target.value)}
                  aria-invalid={error ? true : undefined}
                  aria-describedby={describedBy}
                  required={field.required}
                />
              )}

              {error && (
                <span className="field__error" id={errorId}>
                  {error}
                </span>
              )}
            </div>
          )
        })}
      </div>

      {/* Spam trap. Hidden from people and from screen readers; bots fill it. */}
      <div className="field-honeypot" aria-hidden="true">
        <label htmlFor="field-website">Leave this field empty</label>
        <input
          id="field-website"
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          ref={honeypotRef}
        />
      </div>

      <div className="form__actions">
        <button className="btn btn--lg" type="submit" disabled={status === 'submitting'}>
          {status === 'submitting' ? FORM_MESSAGES.submitting : FORM_MESSAGES.submit}
        </button>
      </div>

      <div aria-live="polite">
        {status === 'fallback' && (
          <p className="form-status form-status--note">
            {FORM_MESSAGES.fallbackSuccess}{' '}
            <a href={`mailto:${FORM_CONFIG.fallbackEmail}`}>{FORM_CONFIG.fallbackEmail}</a>.
          </p>
        )}
        {status === 'error' && (
          <p className="form-status form-status--error">
            {FORM_MESSAGES.error}{' '}
            <a href={`mailto:${FORM_CONFIG.fallbackEmail}`}>{FORM_CONFIG.fallbackEmail}</a>.
          </p>
        )}
      </div>
    </form>
  )
}
