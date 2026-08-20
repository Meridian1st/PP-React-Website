import { CONTACT_EMAIL } from '../content/home'

export default function Contact() {
  return (
    <section id="contact" className="contact" aria-labelledby="contact-title">
      <div className="shell contact__inner">
        <div className="contact__copy">
          <h2 className="contact__title" id="contact-title">
            Start with a conversation, not a proposal
          </h2>
          <p className="contact__blurb">
            Tell us what you are trying to change. If we are not the right fit, we will
            say so.
          </p>
        </div>

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
