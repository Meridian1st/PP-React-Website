import type { ServiceDetail } from '../content/charities'

type ServiceListProps = {
  services: ServiceDetail[]
  /** Controls the accent colour — teal for charities, navy for business. */
  variant: 'charities' | 'business'
}

/** Expanded service breakdown for the /charities and /business pages. */
export default function ServiceList({ services, variant }: ServiceListProps) {
  return (
    <section className="shell services" aria-label="Services">
      <div className="services__grid">
        {services.map((service, i) => (
          <article key={service.title} className={`service service--${variant}`}>
            <span className="service__num">{String(i + 1).padStart(2, '0')}</span>
            <h2 className="service__title">{service.title}</h2>
            <p className="service__description">{service.description}</p>
          </article>
        ))}
      </div>
    </section>
  )
}
