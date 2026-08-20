import PageHero from '../components/PageHero'
import ServiceList from '../components/ServiceList'
import PageCta from '../components/PageCta'
import { CHARITIES_HERO, CHARITIES_SERVICES, CHARITIES_CTA } from '../content/charities'

export default function Charities() {
  return (
    <>
      <PageHero
        eyebrow={CHARITIES_HERO.eyebrow}
        title={CHARITIES_HERO.title}
        blurb={CHARITIES_HERO.blurb}
      />
      <ServiceList services={CHARITIES_SERVICES} variant="charities" />
      <PageCta label={CHARITIES_CTA} />
    </>
  )
}
