/**
 * Single source of truth for GSAP in this app.
 *
 * Import everything GSAP-related from here, never from 'gsap' directly, so every
 * plugin is registered exactly once before first use:
 *
 *   import { gsap, ScrollTrigger, SplitText, useGSAP, prefersReducedMotion } from '@/lib/gsap';
 *
 * All GSAP plugins are free (public `gsap` npm package), including SplitText.
 */
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { SplitText } from 'gsap/SplitText';
import { Observer } from 'gsap/Observer';

gsap.registerPlugin(useGSAP, ScrollTrigger, ScrollToPlugin, SplitText, Observer);

export { gsap, useGSAP, ScrollTrigger, ScrollToPlugin, SplitText, Observer };

/** Media queries shared by every gsap.matchMedia() call so breakpoints stay consistent. */
export const MQ = {
  motionOK: '(prefers-reduced-motion: no-preference)',
  reduced: '(prefers-reduced-motion: reduce)',
  desktop: '(min-width: 769px)',
  mobile: '(max-width: 768px)',
} as const;

/** One-shot check for imperative code paths (scroll helpers, event handlers). */
export const prefersReducedMotion = (): boolean =>
  typeof window !== 'undefined' && window.matchMedia(MQ.reduced).matches;
