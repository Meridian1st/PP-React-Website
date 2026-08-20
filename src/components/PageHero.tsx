import { useIntroSequence } from '../animations'

type PageHeroProps = {
  eyebrow: string
  title: string
  blurb: string
}

/** Shared intro banner for the dedicated /about, /charities and /business pages. */
export default function PageHero({ eyebrow, title, blurb }: PageHeroProps) {
  // Above the fold, so this uses the mount-based intro rather than a scroll
  // trigger — the page composes itself as it arrives.
  const ref = useIntroSequence<HTMLElement>('[data-intro]')

  return (
    <section className="shell page-hero" ref={ref}>
      <span className="eyebrow eyebrow--teal" data-intro>
        {eyebrow}
      </span>
      <h1 className="page-hero__title" data-intro>
        {title}
      </h1>
      <p className="page-hero__blurb" data-intro>
        {blurb}
      </p>
    </section>
  )
}
