import { gsap, ScrollTrigger, prefersReducedMotion } from './gsap';

/** Height of the fixed navbar; anchors land this far below the viewport top. */
export const NAV_OFFSET = 72;

/**
 * Resolve the document-Y that an anchor id should scroll to.
 *
 * Pinned sections (the horizontal gallery) are `position: fixed` while pinned, so
 * getBoundingClientRect() lies about where they live in the document. If a
 * ScrollTrigger with the same id exists, its `start` is the authoritative answer.
 * Convention: a section that pins MUST give its main ScrollTrigger `id` equal to
 * its DOM id (e.g. id: 'lineup').
 */
export function resolveSectionY(id: string): number | null {
  const st = ScrollTrigger.getById(id);
  if (st) return st.start;
  const el = document.getElementById(id);
  if (!el) return null;
  return el.getBoundingClientRect().top + window.scrollY - NAV_OFFSET;
}

/**
 * Smoothly scroll to a section by DOM id. Retries for up to ~3s because on a route
 * change the target (and its ScrollTrigger) may not exist yet. Resolves true when it
 * scrolled, false when the id never appeared. Respects prefers-reduced-motion.
 */
export function scrollToSection(id: string, { behavior }: { behavior?: 'smooth' | 'auto' } = {}): Promise<boolean> {
  const clean = id.replace(/^#/, '');
  return new Promise((resolve) => {
    const started = performance.now();
    const attempt = () => {
      ScrollTrigger.refresh(); // positions may be stale after fonts/images/route change
      const y = resolveSectionY(clean);
      if (y === null) {
        if (performance.now() - started > 3000) return resolve(false);
        return void setTimeout(attempt, 100);
      }
      if (prefersReducedMotion() || behavior === 'auto') {
        window.scrollTo(0, y);
      } else {
        gsap.to(window, { scrollTo: { y, autoKill: true }, duration: 1.1, ease: 'power3.inOut', overwrite: true });
      }
      resolve(true);
    };
    // let React commit + ScrollTriggers register first
    requestAnimationFrame(() => requestAnimationFrame(attempt));
  });
}

/** Instantly jump to the top (route changes without a hash). */
export function scrollToTop(): void {
  gsap.killTweensOf(window);
  window.scrollTo(0, 0);
}
