import { Link } from 'react-router-dom'
import { CONTACT_EMAIL } from '../content/home'
import { useParallax, useScrollReveal } from '../animations'

export default function ContactTeaser() {
  // The copy drifts gently against the scroll, giving the band some depth.
  // Note: parallax is kept off the actions block — it also animates `y`,
  // which would fight the button's hover lift.
  const copyRef = useParallax<HTMLDivElement>()
  const actionsRef = useScrollReveal<HTMLDivElement>()

  return (
    <section id="contact" className="contact" aria-labelledby="contact-title">
      <div className="shell contact__inner">
        <div className="contact__copy" ref={copyRef}>
          <h2 className="contact__title" id="contact-title">
            Start with a conversation, not a proposal
          </h2>
          <p className="contact__blurb">
            Tell us what you are trying to change. If we are not the right fit, we will
            say so.
          </p>
        </div>

        <div className="contact__actions" ref={actionsRef}>
          <Link to="/contact" className="btn btn--lg">
            Get in touch
          </Link>
          <span className="contact__email">{CONTACT_EMAIL}</span>
        </div>
      </div>
    </section>
  )
}
