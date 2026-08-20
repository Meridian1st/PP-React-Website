import Hero from '../components/Hero'
import Audiences from '../components/Audiences'
import ContactTeaser from '../components/ContactTeaser'

/**
 * Homepage — a short overview/hub. Full service detail lives on the
 * dedicated /charities and /business pages, and the founder/team content
 * lives on /about; this page just introduces and links through.
 */
export default function Home() {
  return (
    <>
      <Hero />
      <Audiences />
      <ContactTeaser />
    </>
  )
}
