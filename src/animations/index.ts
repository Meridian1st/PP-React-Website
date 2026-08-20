/**
 * Public entry point for site animations.
 *
 * Components import from here (`import { useScrollReveal } from '../animations'`)
 * and never import GSAP directly — so swapping the animation engine later
 * would mean rewriting this folder only, not the components.
 *
 * Tuning values all live in `./config`.
 */
export {
  refreshScrollTriggers,
  useIntroSequence,
  useHeaderIntro,
  useScrollReveal,
  useStaggerReveal,
  useCascade,
  useDrawIn,
  usePortraitReveal,
  useParallax,
  useButtonMicroInteractions,
} from './hooks'
