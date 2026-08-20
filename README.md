# Purpose Partners — React site

React implementation of the **Purpose Partners** site, originally ported from
a Claude Design canvas (`Purpose Partners Homepage.dc.html`, Claude Design
project `56c86533-d106-4c3a-b49d-cc9955b06044`), and later split into
separate routed pages.

## Running it

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # type-check + production build into dist/
npm run preview  # serve the production build
```

Stack: Vite 7, React 19, TypeScript, React Router 7.

## Pages

The site is a proper multi-page app now (client-side routed via
`react-router-dom`), not a single scrolling page with anchors:

- `/` — Home: a short overview/hub (hero, a brief "two ways in" teaser
  linking to `/charities` and `/business`, and a contact section).
- `/about` — About Us: Becci's founder profile plus a second team-member
  profile. **The second profile is placeholder Latin filler text** — see
  `src/content/about.ts`, `PARTNER_TWO` — until real copy is supplied.
- `/charities` — full service breakdown for charities & social enterprises,
  each service expanded into its own short section.
- `/business` — full service breakdown for businesses, same structure as
  `/charities`.

## Layout

```
src/
  App.tsx                 routes + Header/Footer shell
  main.tsx                BrowserRouter + app root
  lib/
    HashLink.tsx           <Link> that also scrolls to #hash targets,
                            including same-page hash navigation
    ScrollToTop.tsx         resets scroll position on route change
  content/
    home.ts                nav items, contact email, homepage teaser copy
    about.ts                Becci + placeholder second-partner copy
    charities.ts             charities page copy + expanded service list
    business.ts              business page copy + expanded service list
  styles/globals.css       design tokens + every component class
  components/
    Header.tsx              sticky nav + mobile drawer (routes, not anchors)
    Footer.tsx
    Hero.tsx                 homepage hero
    Audiences.tsx            homepage "Two ways in" teaser, links to /charities /business
    Contact.tsx               homepage contact section (#contact)
    PageHero.tsx              shared intro banner for /about /charities /business
    ServiceList.tsx            expanded per-service grid for /charities /business
    PageCta.tsx                end-of-page contact prompt for /charities /business
    PersonProfile.tsx          single team-member profile, used twice on /about
  pages/
    Home.tsx
    About.tsx
    Charities.tsx
    Business.tsx
```

Copy changes go in the relevant `src/content/*.ts` file — the components and
pages read from it, so layout code rarely needs touching.

## Outstanding

- `content/about.ts` — `PARTNER_TWO` and `PARTNER_TWO_CREDENTIALS` are
  placeholder Latin text. Replace with real copy and credentials for the
  second team member when ready; the section is visually flagged
  ("Placeholder content") until then.
- `Footer.tsx` — the LinkedIn link still points at `/`; swap in the real
  company page URL.
- `PersonProfile.tsx` (used by `/about`) — renders a hatched placeholder
  frame until a portrait is supplied. Pass one through the `portraitSrc`
  prop on each `<PersonProfile>` in `pages/About.tsx`.
- Old single-page components `Founder.tsx` and `Pillars.tsx` were removed
  from `src/components` (superseded by `PersonProfile.tsx` and the
  `/charities` `/business` service pages) and moved to a `_to_delete`
  folder alongside the project rather than deleted outright — safe to
  delete once you've confirmed nothing else referenced them.
