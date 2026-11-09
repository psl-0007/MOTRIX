import { useEffect, useLayoutEffect, useRef } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';
import { ScrollTrigger } from '@/lib/gsap';
import { scrollToSection, scrollToTop } from '@/lib/scroll';

/** Scroll positions per history entry, so Back/Forward restores where the user was. */
const savedScroll = new Map<string, number>();

const afterLayout = (fn: () => void) =>
  requestAnimationFrame(() => requestAnimationFrame(fn));

/** Resolves once fonts and the window `load` event have settled (pin positions are final). */
function whenSettled(): Promise<void> {
  const load = new Promise<void>((resolve) => {
    if (document.readyState === 'complete') resolve();
    else window.addEventListener('load', () => resolve(), { once: true });
  });
  const fonts =
    'fonts' in document ? document.fonts.ready.then(() => undefined) : Promise.resolve();
  // never wait longer than 2.5s, a stuck font request must not strand the user at 0
  const cap = new Promise<void>((resolve) => setTimeout(resolve, 2500));
  return Promise.race([Promise.all([load, fonts]).then(() => undefined), cap]);
}

/**
 * Single owner of route/anchor scrolling (see PHASE2 brief).
 *  - no hash  -> instant jump to top (or restore the saved position on Back/Forward)
 *  - hash     -> scrollToSection(hash); on a fresh load waits for fonts + load first
 *  - `#main`  -> skip link: focus the landmark, let the browser scroll
 * Must render inside <Router>. A newer navigation cancels the pending one; Navbar's own direct
 * scrollToSection() calls on the same target collapse into one tween (overwrite: true).
 */
export const ScrollManager: React.FC = () => {
  const location = useLocation();
  const navType = useNavigationType();
  const initialSignature = useRef(`${location.key}|${location.pathname}|${location.hash}`);
  const currentKey = useRef(location.key);
  currentKey.current = location.key;

  // Take over restoration from the browser (pinned pages make native restoration wrong).
  useLayoutEffect(() => {
    const prev = history.scrollRestoration;
    history.scrollRestoration = 'manual';
    return () => {
      history.scrollRestoration = prev;
    };
  }, []);

  // Remember scroll for the active history entry.
  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        savedScroll.set(currentKey.current, window.scrollY);
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  useEffect(() => {
    const signature = `${location.key}|${location.pathname}|${location.hash}`;
    // Fresh page load (also true for both StrictMode passes of the first effect).
    const isFirst = signature === initialSignature.current;
    let cancelled = false;
    const hash = location.hash.replace(/^#/, '');
    const saved = savedScroll.get(location.key);

    const focusMain = () => {
      const main = document.getElementById('main');
      if (main) main.focus({ preventScroll: true });
    };

    if (hash === 'main') {
      focusMain();
      return;
    }

    if (hash) {
      (async () => {
        if (isFirst) await whenSettled();
        if (cancelled) return;
        await scrollToSection(hash, { behavior: isFirst ? 'auto' : undefined });
      })();
    } else if (navType === 'POP' && saved !== undefined && saved > 0) {
      (async () => {
        await whenSettled();
        if (cancelled) return;
        afterLayout(() => {
          ScrollTrigger.refresh();
          window.scrollTo(0, saved);
        });
      })();
    } else {
      scrollToTop();
      afterLayout(() => {
        if (cancelled) return;
        scrollToTop();
        ScrollTrigger.refresh();
      });
    }

    // Keyboard / screen-reader users: move focus into the new page on route changes.
    if (!isFirst && !hash) focusMain();

    return () => {
      cancelled = true; // a newer navigation (or StrictMode re-run) supersedes this one
    };
  }, [location.key, location.pathname, location.hash, navType]);

  return null;
};
