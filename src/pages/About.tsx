import PageHero from '../components/PageHero'
import PersonProfile from '../components/PersonProfile'
import {
  BECCI,
  BECCI_CREDENTIALS,
  PARTNER_TWO,
  PARTNER_TWO_CREDENTIALS,
} from '../content/about'

export default function About() {
  return (
    <>
      <PageHero
        eyebrow="About us"
        title="Two people who have sat on both sides of the table"
        blurb="Purpose Partners is built on commercial strategy experience and hands-on charity leadership. Here's who's behind the work."
      />

      <PersonProfile
        id="becci"
        eyebrow={BECCI.eyebrow}
        title={BECCI.title}
        bio={BECCI.bio}
        team={BECCI.team}
        pullquote={BECCI.pullquote}
        disclaimer={BECCI.disclaimer}
        credentials={BECCI_CREDENTIALS}
        portraitLabel="Becci Blues, founder of Purpose Partners"
      />

      {/* Placeholder — Harry to supply real copy and credentials for this profile. */}
      <PersonProfile
        id="partner-two"
        eyebrow={PARTNER_TWO.eyebrow}
        title={PARTNER_TWO.title}
        bio={PARTNER_TWO.bio}
        team={PARTNER_TWO.team}
        pullquote={PARTNER_TWO.pullquote}
        disclaimer={PARTNER_TWO.disclaimer}
        credentials={PARTNER_TWO_CREDENTIALS}
        portraitLabel="Placeholder — co-founder portrait"
        isPlaceholder
      />
    </>
  )
}
