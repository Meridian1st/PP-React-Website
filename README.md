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

Stack: Vite 7, React 19, TypeScript, React Router 7, GSAP (ScrollTrigger).

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
- `/contact` — the enquiry form plus contact details. Every "Get in Touch"
  CTA on the site points here.

## Layout

```
src/
  App.tsx                 routes + Header/Footer shell
  main.tsx                BrowserRouter + app root
  brand/
    logos.ts               logo variants + intrinsic ratios
  animations/
    config.ts              ALL animation values — durations, eases, distances
    hooks.ts                the hooks components actually call
    gsap-setup.ts           one-time GSAP plugin registration
    index.ts                public entry point (import from '../animations')
  lib/
    HashLink.tsx           <Link> that also scrolls to #hash targets,
                            including same-page hash navigation
    ScrollToTop.tsx         resets scroll position on route change
  content/
    home.ts                nav items, contact email, homepage teaser copy
    about.ts                Becci + placeholder second-partner copy
    charities.ts             charities page copy + expanded service list
    business.ts              business page copy + expanded service list
    contact.ts               contact copy, form fields, SUBMIT ENDPOINT
  styles/globals.css       design tokens + every component class
  components/
    Header.tsx              sticky nav + mobile drawer (routes, not anchors)
    Footer.tsx
    Hero.tsx                 homepage hero
    Audiences.tsx            homepage "Two ways in" teaser, links to /charities /business
    ContactTeaser.tsx         homepage contact band, links through to /contact
    ContactForm.tsx           the enquiry form (validation, a11y, spam trap)
    PageHero.tsx              shared intro banner for /about /charities /business
    ServiceList.tsx            expanded per-service grid for /charities /business
    PageCta.tsx                end-of-page contact prompt for /charities /business
    PersonProfile.tsx          single team-member profile, used twice on /about
    Logo.tsx                   renders a brand lockup by variant
  pages/
    Home.tsx
    About.tsx
    Charities.tsx
    Business.tsx
    Contact.tsx
```

Copy changes go in the relevant `src/content/*.ts` file — the components and
pages read from it, so layout code rarely needs touching.

## Brand

Client-supplied logo assets live in `public/brand/` and are registered in
`src/brand/logos.ts`. Components never reference a file path directly — they
render `<Logo variant="..." height={n} />`, so changing which lockup appears
somewhere is a one-word change at the call site.

Variants available:

| Variant | Artwork | Use |
| --- | --- | --- |
| `teal` | transparent, teal strokes | **default** — header and footer, on `--paper` |
| `reversedWhite` | transparent, white | dark `--ink` sections (e.g. founder block) |
| `monoBlack` | transparent, near-black | single-colour / print contexts |
| `duotone` | teal + pale blue | decorative two-tone |
| `primary` | white lockup on a teal tile | standalone badge, social card |
| `icon` / `iconWhite` | PP monogram tile | favicon, app icons |

`Logo` sizes by **height only** and derives width from each asset's intrinsic
ratio, setting both as attributes so the space is reserved before the SVG
loads and nothing shifts on screen.

The brand teal is `#027F7C`, which is already the site's `--teal` token — the
logo drops into the existing palette with no colour change.

Also wired up in `index.html`: SVG + PNG favicons, an apple-touch-icon, a
`theme-color` that tints mobile browser chrome, Open Graph / Twitter card
tags, and `public/site.webmanifest` for installable-app icons.

> **Note:** the previous serif "Purpose Partners" text wordmark (with the
> apricot dot) has been replaced by the client's logo in both the header and
> the footer. The old `.wordmark` CSS has been removed.

> **To do:** `og:image` and `twitter:image` in `index.html` are relative
> paths. Most social scrapers require absolute URLs — swap in the full
> `https://…` once the production domain is confirmed.

## Contact form

The form lives at `/contact` (`src/components/ContactForm.tsx`). Fields,
copy, validation messages and — importantly — where submissions go are all
configured in `src/content/contact.ts`.

### Wiring up submissions  ← the one outstanding job

A static React site has no backend, so the form needs an endpoint. Until one
is set, `FORM_CONFIG.endpoint` in `src/content/contact.ts` is an empty
string, and the form **degrades gracefully**: on submit it opens the
visitor's email client with a pre-filled message to `hello@purposepartners.co.uk`.

That means the form is usable right now and never silently swallows an
enquiry — but it does depend on the visitor having a mail client set up, so
it is a stopgap rather than the finished article.

To switch on proper background submission, sign up with a form service
(Formspree, Web3Forms, Netlify Forms, Basin — all have free tiers that suit
this volume) and paste the endpoint in:

```ts
// src/content/contact.ts
export const FORM_CONFIG = {
  endpoint: 'https://formspree.io/f/xxxxxxxx',
  ...
}
```

The form POSTs JSON with the keys `name`, `email`, `organisation`,
`message`. Most services accept that shape as-is. Nothing else needs
changing — the success and error states are already built.

### What's already handled

- **Validation** — required fields and email format, checked on submit and
  then live as the visitor corrects things (so it never scolds someone
  mid-typing).
- **Accessibility** — every field has a real `<label>`; errors are wired via
  `aria-describedby` and `aria-invalid`; a summary box at the top lists all
  problems, links to each field, and takes focus on a failed submit so screen
  reader users hear it immediately.
- **Spam** — an off-screen honeypot field. Bots fill it, people can't see it,
  and a filled honeypot silently discards the submission.
- **States** — idle, submitting (button disabled), success, and error with a
  direct mailto fallback.

## Animations

Motion is built on GSAP + ScrollTrigger, and follows the same split as the
copy: **all tuning values live in `src/animations/config.ts`**, and
components only ever call a named hook. No component contains a duration, an
easing curve or a distance.

To retune the site's motion, edit `config.ts` alone:

- `SPEED` — a global multiplier. Set `1.2` to slow everything down, `0.8` to
  tighten it up, without touching any individual animation.
- `EASE` — the shared easing curves.
- `INTRO` / `HEADER_INTRO` — the first-paint entrance.
- `REVEAL` / `STAGGER` / `CASCADE` — scroll-triggered entrances.
- `DRAW`, `PORTRAIT`, `PARALLAX`, `BUTTON` — the individual set-pieces.

The hooks, all exported from `src/animations`:

| Hook | What it does | Used by |
| --- | --- | --- |
| `useIntroSequence(sel)` | staggered settle on mount, for above-the-fold content | `Hero`, `PageHero` |
| `useHeaderIntro()` | header eases down on first load | `Header` |
| `useScrollReveal()` | element fades and lifts as it enters view | `Contact`, `PageCta`, `PersonProfile` |
| `useStaggerReveal(sel)` | children enter one after another | `Audiences`, `ServiceList` |
| `useCascade(sel)` | tighter, quicker ripple for nested small items | `Audiences`, `Footer`, `PersonProfile` |
| `useDrawIn()` | hairline rule draws itself across | `Hero` |
| `usePortraitReveal()` | clip-path wipe + scale settle | `PersonProfile` |
| `useParallax()` | scroll-linked drift (the only scrubbed effect) | `Contact` |
| `useButtonMicroInteractions()` | hover lift + press feedback, site-wide | `App` (once) |

Notes:

- **Reduced motion is respected throughout.** Every hook runs inside
  `gsap.matchMedia`, so a visitor with "reduce motion" enabled at OS level
  gets no animation created at all — elements render in their normal final
  state rather than being animated to it.
- **Buttons use event delegation**, registered once in `App.tsx`. Any button
  added later picks up the same micro-interaction automatically; there is no
  per-button wiring.
- **Don't apply `useParallax` to anything containing a button** — both animate
  `y`, and they will fight each other.
- `refreshScrollTriggers()` is called on route change (from `ScrollToTop`) so
  trigger positions are re-measured against the incoming page's layout.

## Outstanding

- **Contact form endpoint** — `FORM_CONFIG.endpoint` in
  `src/content/contact.ts` is empty, so the form currently falls back to
  opening the visitor's email client. See the Contact form section above.

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
