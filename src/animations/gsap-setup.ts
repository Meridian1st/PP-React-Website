/**
 * Central GSAP registration. Imported by the hooks module only, so plugins
 * are registered exactly once regardless of how many components animate.
 */
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(useGSAP, ScrollTrigger)

export { gsap, useGSAP, ScrollTrigger }

/** Media query string GSAP matches against to decide whether to animate at all. */
export const MOTION_OK = '(prefers-reduced-motion: no-preference)'
