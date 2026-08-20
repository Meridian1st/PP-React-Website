/**
 * ------------------------------------------------------------------
 * Animation configuration — the single source of truth.
 * ------------------------------------------------------------------
 *
 * Every duration, easing, distance and delay used anywhere on the site
 * lives in this file. Components never hardcode animation values; they
 * call a hook from `src/animations/`, and the hook reads from here.
 *
 * To retune the whole site's motion, change the numbers below — you
 * should not need to open a single component.
 *
 * House style: restrained and editorial. Short distances, soft eases,
 * nothing bouncy. Motion should be noticed as polish, not as effect.
 */

/** Shared easing curves. GSAP ease strings. */
export const EASE = {
  /** Default for entrances — decelerates into place. */
  entrance: 'power3.out',
  /** Slightly sharper, for small UI feedback. */
  ui: 'power2.out',
  /** For scrubbed/scroll-linked motion — must be linear-ish to track scroll. */
  scrub: 'none',
} as const

/**
 * Global speed dial. Every duration below is multiplied by this, so you
 * can slow the whole site down (1.2) or tighten it up (0.8) in one place.
 */
export const SPEED = 1

/** Where a scroll-triggered element starts animating, in ScrollTrigger syntax. */
export const TRIGGER_START = 'top 85%'

/**
 * First-paint intro: header and hero settle in when the site loads.
 * Deliberately gentle — this is the first impression for a consultancy,
 * so it should read as considered rather than flashy.
 */
export const INTRO = {
  /** Delay before anything moves, letting fonts settle. */
  delay: 0.15,
  duration: 0.9,
  /** How far elements travel up into place, in px. */
  y: 18,
  /** Gap between each element in the intro sequence. */
  stagger: 0.09,
  ease: EASE.entrance,
} as const

/** The sticky header's own entrance on first load. */
export const HEADER_INTRO = {
  duration: 0.7,
  /** Negative = slides down from above. */
  y: -12,
  ease: EASE.entrance,
} as const

/** Generic "fade and rise as it enters the viewport" reveal. */
export const REVEAL = {
  duration: 0.85,
  y: 26,
  ease: EASE.entrance,
  start: TRIGGER_START,
} as const

/** Grouped children entering one after another (cards, list items). */
export const STAGGER = {
  duration: 0.75,
  y: 24,
  /** Seconds between each child. */
  each: 0.1,
  ease: EASE.entrance,
  start: TRIGGER_START,
} as const

/** Tighter cascade for small items nested inside an already-animating block. */
export const CASCADE = {
  duration: 0.55,
  y: 12,
  each: 0.06,
  ease: EASE.ui,
  start: TRIGGER_START,
} as const

/** Hairline rules that draw themselves across (hero meta rule, section rules). */
export const DRAW = {
  duration: 1.1,
  ease: EASE.entrance,
  /** Transform origin for the scaleX — 'left' draws left-to-right. */
  origin: 'left center',
  start: TRIGGER_START,
} as const

/**
 * Portrait frames on /about — a soft wipe plus a settle from slightly
 * over-scaled, so the image feels like it eases into its frame.
 */
export const PORTRAIT = {
  duration: 1.25,
  ease: EASE.entrance,
  /** Starting scale of the inner content; settles to 1. */
  scaleFrom: 1.06,
  start: 'top 80%',
} as const

/**
 * Button and text-link micro-interactions. Applied site-wide by a single
 * delegated hook, so every current and future button picks these up.
 */
export const BUTTON = {
  hover: {
    /** Lift in px — kept tiny so it reads as responsive, not springy. */
    y: -2,
    scale: 1.015,
    duration: 0.28,
    ease: EASE.ui,
  },
  press: {
    y: 0,
    scale: 0.985,
    duration: 0.12,
    ease: EASE.ui,
  },
  /** Selector for elements that get the lift treatment. */
  selector: '.btn, .mobile-nav__cta',
} as const

/** Scroll-linked (scrubbed) parallax on the contact/CTA band. */
export const PARALLAX = {
  /** Total travel in px across the whole scroll range. */
  distance: 40,
  /** Smoothing between scroll position and animation, in seconds. */
  scrub: 0.6,
  start: 'top bottom',
  end: 'bottom top',
  ease: EASE.scrub,
} as const

/** Media query used to switch every animation off. */
export const REDUCED_MOTION = '(prefers-reduced-motion: reduce)'

/** Applies the global SPEED dial to a configured duration. */
export const scaled = (duration: number) => duration * SPEED
