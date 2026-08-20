import { CONTACT_EMAIL } from '../content/home'

type PageCtaProps = {
  label: string
}

/** Simple end-of-page call to action, used on /charities and /business. */
export default function PageCta({ label }: PageCtaProps) {
  return (
    <section className="page-cta" aria-labelledby="page-cta-title">
      <div className="shell page-cta__inner">
        <h2 className="page-cta__title" id="page-cta-title">
          {label}
        </h2>
        <div className="contact__actions">
          <a href={`mailto:${CONTACT_EMAIL}`} className="btn btn--lg">
            Get in touch
          </a>
          <span className="contact__email">{CONTACT_EMAIL}</span>
        </div>
      </div>
    </section>
  )
}
