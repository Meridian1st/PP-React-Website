type PageHeroProps = {
  eyebrow: string
  title: string
  blurb: string
}

/** Shared intro banner for the dedicated /about, /charities and /business pages. */
export default function PageHero({ eyebrow, title, blurb }: PageHeroProps) {
  return (
    <section className="shell page-hero">
      <span className="eyebrow eyebrow--teal">{eyebrow}</span>
      <h1 className="page-hero__title">{title}</h1>
      <p className="page-hero__blurb">{blurb}</p>
    </section>
  )
}
