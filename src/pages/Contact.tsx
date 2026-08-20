import PageHero from '../components/PageHero'
import ContactForm from '../components/ContactForm'
import { CONTACT_HERO, CONTACT_DETAILS } from '../content/contact'
import { useScrollReveal } from '../animations'

export default function Contact() {
  const asideRef = useScrollReveal<HTMLElement>()

  return (
    <>
      <PageHero
        eyebrow={CONTACT_HERO.eyebrow}
        title={CONTACT_HERO.title}
        blurb={CONTACT_HERO.blurb}
      />

      <section className="shell contact-page" aria-label="Contact form">
        <div className="contact-page__grid">
          <div className="contact-page__form">
            <ContactForm />
          </div>

          <aside className="contact-page__aside" ref={asideRef}>
            <dl className="contact-details">
              {CONTACT_DETAILS.map((detail) => (
                <div className="contact-detail" key={detail.label}>
                  <dt className="contact-detail__label">{detail.label}</dt>
                  <dd className="contact-detail__value">
                    {detail.href ? (
                      <a href={detail.href}>{detail.value}</a>
                    ) : (
                      detail.value
                    )}
                  </dd>
                </div>
              ))}
            </dl>
          </aside>
        </div>
      </section>
    </>
  )
}
