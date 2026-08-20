import PageHero from '../components/PageHero'
import ServiceList from '../components/ServiceList'
import PageCta from '../components/PageCta'
import { BUSINESS_HERO, BUSINESS_SERVICES, BUSINESS_CTA } from '../content/business'

export default function Business() {
  return (
    <>
      <PageHero
        eyebrow={BUSINESS_HERO.eyebrow}
        title={BUSINESS_HERO.title}
        blurb={BUSINESS_HERO.blurb}
      />
      <ServiceList services={BUSINESS_SERVICES} variant="business" />
      <PageCta label={BUSINESS_CTA} />
    </>
  )
}
