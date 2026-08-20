/**
 * ------------------------------------------------------------------
 * Animation hooks
 * ------------------------------------------------------------------
 *
 * Each hook returns a ref to attach to an element. All timing values come
 * from `./config` — nothing is hardcoded here, and nothing is hardcoded in
 * the components that call these.
 *
 * Every hook is wrapped in `gsap.matchMedia`, so when a visitor has
 * "reduce motion" enabled at OS level no animation is created at all and
 * elements simply render in their normal, final state.
 *
 * Cleanup is handled by `useGSAP` (which reverts on unmount) plus an
 * explicit `mm.revert()`, so route changes never leave stale ScrollTriggers.
 */
import { useRef } from 'react'
import { gsap, useGSAP, ScrollTrigger, MOTION_OK } from './gsap-setup'
import {
  INTRO,
  HEADER_INTRO,
  REVEAL,
  STAGGER,
  CASCADE,
  DRAW,
  PORTRAIT,
  BUTTON,
  PARALLAX,
  scaled,
} from './config'

/**
 * Recalculates every ScrollTrigger's start/end position. Call after a route
 * change, once the new page's content is in the DOM — otherwise triggers can
 * keep positions measured against the previous page's height.
 */
export const refreshScrollTriggers = () => ScrollTrigger.refresh()

/** Collects elements matching `selector` inside `root`. */
const find = (root: HTMLElement | null, selector: string): HTMLElement[] =>
  root ? Array.from(root.querySelectorAll<HTMLElement>(selector)) : []

/**
 * 1. Page-load intro.
 * A gentle staggered settle for the elements matching `selector` inside the
 * scope, run once on mount rather than on scroll. Used for the hero, so the
 * first thing a visitor sees composes itself rather than snapping in.
 */
export function useIntroSequence<T extends HTMLElement>(selector: string) {
  const ref = useRef<T>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(MOTION_OK, () => {
        const targets = find(ref.current, selector)
        if (!targets.length) return

        gsap.from(targets, {
          opacity: 0,
          y: INTRO.y,
          duration: scaled(INTRO.duration),
          stagger: INTRO.stagger,
          delay: INTRO.delay,
          ease: INTRO.ease,
        })
      })
      return () => mm.revert()
    },
    { scope: ref },
  )

  return ref
}

/**
 * 2. Header intro.
 * The sticky header eases down on first load. Mounted once for the whole
 * app, so this deliberately does not re-run on route changes.
 */
export function useHeaderIntro<T extends HTMLElement>() {
  const ref = useRef<T>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(MOTION_OK, () => {
        if (!ref.current) return
        gsap.from(ref.current, {
          opacity: 0,
          y: HEADER_INTRO.y,
          duration: scaled(HEADER_INTRO.duration),
          ease: HEADER_INTRO.ease,
          // The header is position:sticky — clear the transform afterwards so
          // no inline transform is left sitting on it.
          clearProps: 'transform',
        })
      })
      return () => mm.revert()
    },
    { scope: ref },
  )

  return ref
}

/**
 * 3. Scroll reveal.
 * Fades and lifts the element itself as it enters the viewport. The
 * workhorse used on section intros and standalone blocks.
 */
export function useScrollReveal<T extends HTMLElement>() {
  const ref = useRef<T>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(MOTION_OK, () => {
        if (!ref.current) return
        gsap.from(ref.current, {
          opacity: 0,
          y: REVEAL.y,
          duration: scaled(REVEAL.duration),
          ease: REVEAL.ease,
          scrollTrigger: {
            trigger: ref.current,
            start: REVEAL.start,
            once: true,
          },
        })
      })
      return () => mm.revert()
    },
    { scope: ref },
  )

  return ref
}

/**
 * 4. Staggered reveal.
 * Children matching `selector` enter one after another as the group scrolls
 * into view — used for the audience cards and the service grids.
 */
export function useStaggerReveal<T extends HTMLElement>(selector: string) {
  const ref = useRef<T>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(MOTION_OK, () => {
        const targets = find(ref.current, selector)
        if (!targets.length) return

        gsap.from(targets, {
          opacity: 0,
          y: STAGGER.y,
          duration: scaled(STAGGER.duration),
          stagger: STAGGER.each,
          ease: STAGGER.ease,
          scrollTrigger: {
            trigger: ref.current,
            start: STAGGER.start,
            once: true,
          },
        })
      })
      return () => mm.revert()
    },
    { scope: ref },
  )

  return ref
}

/**
 * 5. Cascade.
 * A tighter, quicker version of the stagger for small items nested inside a
 * block that is already animating — list rows, credential rows. Keeping it
 * faster than its parent stops the two motions fighting each other.
 */
export function useCascade<T extends HTMLElement>(selector: string) {
  const ref = useRef<T>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(MOTION_OK, () => {
        const targets = find(ref.current, selector)
        if (!targets.length) return

        gsap.from(targets, {
          opacity: 0,
          y: CASCADE.y,
          duration: scaled(CASCADE.duration),
          stagger: CASCADE.each,
          ease: CASCADE.ease,
          scrollTrigger: {
            trigger: ref.current,
            start: CASCADE.start,
            once: true,
          },
        })
      })
      return () => mm.revert()
    },
    { scope: ref },
  )

  return ref
}

/**
 * 6. Draw-in rule.
 * Scales a hairline rule out from its origin, as though it were being drawn.
 * A different mechanic from the fades, so the page does not feel like one
 * effect repeated.
 */
export function useDrawIn<T extends HTMLElement>() {
  const ref = useRef<T>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(MOTION_OK, () => {
        if (!ref.current) return
        gsap.from(ref.current, {
          scaleX: 0,
          transformOrigin: DRAW.origin,
          duration: scaled(DRAW.duration),
          ease: DRAW.ease,
          scrollTrigger: {
            trigger: ref.current,
            start: DRAW.start,
            once: true,
          },
        })
      })
      return () => mm.revert()
    },
    { scope: ref },
  )

  return ref
}

/**
 * 7. Portrait reveal.
 * A soft wipe down the frame while the image settles back from slightly
 * over-scaled. Used on the /about portraits, including the placeholder
 * frame, so that section has a moment of its own.
 */
export function usePortraitReveal<T extends HTMLElement>() {
  const ref = useRef<T>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(MOTION_OK, () => {
        if (!ref.current) return

        const trigger = {
          trigger: ref.current,
          start: PORTRAIT.start,
          once: true,
        }

        // fromTo with explicit inset() at both ends: animating *to* the
        // natural `clip-path: none` gives GSAP nothing to interpolate
        // towards and the wipe snaps instead of sweeping. clearProps then
        // removes the inline clip once the reveal has finished.
        gsap.fromTo(
          ref.current,
          { clipPath: 'inset(0% 0% 100% 0%)' },
          {
            clipPath: 'inset(0% 0% 0% 0%)',
            duration: scaled(PORTRAIT.duration),
            ease: PORTRAIT.ease,
            clearProps: 'clipPath',
            scrollTrigger: trigger,
          },
        )

        // Settle the inner content back from over-scaled, so the frame
        // reveals and the image relaxes at the same time.
        const inner = find(ref.current, '.portrait__image, .portrait__note')
        if (inner.length) {
          gsap.from(inner, {
            scale: PORTRAIT.scaleFrom,
            duration: scaled(PORTRAIT.duration),
            ease: PORTRAIT.ease,
            transformOrigin: 'center center',
            scrollTrigger: trigger,
          })
        }
      })
      return () => mm.revert()
    },
    { scope: ref },
  )

  return ref
}

/**
 * 8. Scroll-linked parallax.
 * The only scrubbed animation on the site: content drifts slightly against
 * the scroll rather than triggering once. Used sparingly on the contact
 * band to give the foot of the page some depth.
 */
export function useParallax<T extends HTMLElement>() {
  const ref = useRef<T>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(MOTION_OK, () => {
        if (!ref.current) return
        gsap.fromTo(
          ref.current,
          { y: PARALLAX.distance / 2 },
          {
            y: -PARALLAX.distance / 2,
            ease: PARALLAX.ease,
            scrollTrigger: {
              trigger: ref.current,
              start: PARALLAX.start,
              end: PARALLAX.end,
              scrub: PARALLAX.scrub,
            },
          },
        )
      })
      return () => mm.revert()
    },
    { scope: ref },
  )

  return ref
}

/**
 * 9. Button micro-interactions.
 * Called once, at app level. Uses event delegation rather than a ref per
 * button, so every button on every page — including any added later —
 * picks up the same hover lift and press feedback for free.
 */
export function useButtonMicroInteractions() {
  useGSAP(() => {
    const mm = gsap.matchMedia()

    mm.add(MOTION_OK, () => {
      const resolve = (event: Event): HTMLElement | null => {
        const target = event.target as HTMLElement | null
        return target?.closest<HTMLElement>(BUTTON.selector) ?? null
      }

      const onEnter = (event: Event) => {
        const el = resolve(event)
        if (el) gsap.to(el, { ...BUTTON.hover, duration: scaled(BUTTON.hover.duration) })
      }

      const onLeave = (event: Event) => {
        const el = resolve(event)
        if (el) {
          gsap.to(el, {
            y: 0,
            scale: 1,
            duration: scaled(BUTTON.hover.duration),
            ease: BUTTON.hover.ease,
          })
        }
      }

      const onDown = (event: Event) => {
        const el = resolve(event)
        if (el) gsap.to(el, { ...BUTTON.press, duration: scaled(BUTTON.press.duration) })
      }

      const onUp = (event: Event) => {
        const el = resolve(event)
        if (el) gsap.to(el, { ...BUTTON.hover, duration: scaled(BUTTON.press.duration) })
      }

      document.addEventListener('mouseover', onEnter)
      document.addEventListener('mouseout', onLeave)
      document.addEventListener('pointerdown', onDown)
      document.addEventListener('pointerup', onUp)
      // Keyboard users get the same affordance as pointer users.
      document.addEventListener('focusin', onEnter)
      document.addEventListener('focusout', onLeave)

      return () => {
        document.removeEventListener('mouseover', onEnter)
        document.removeEventListener('mouseout', onLeave)
        document.removeEventListener('pointerdown', onDown)
        document.removeEventListener('pointerup', onUp)
        document.removeEventListener('focusin', onEnter)
        document.removeEventListener('focusout', onLeave)
      }
    })

    return () => mm.revert()
  })
}
