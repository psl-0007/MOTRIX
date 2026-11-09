import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { BMW_MODELS } from '@/data/models';
import { Horizon } from '@/components/ui/horizon';
import { useTheme } from '@/lib/theme';
import { gsap, ScrollTrigger, useGSAP, MQ, prefersReducedMotion } from '@/lib/gsap';
import { scrollToSection, scrollToTop } from '@/lib/scroll';
import '@/styles/navbar.css';

type SectionId = 'lineup' | 'philosophy';

const SECTIONS: { id: SectionId; label: string; btnId: string }[] = [
  { id: 'lineup', label: 'Lineup', btnId: 'nav-lineup-btn' },
  { id: 'philosophy', label: 'About M', btnId: 'nav-about-btn' },
];

const DESKTOP_MQ = '(min-width: 1024px)';
const isModifiedClick = (e: React.MouseEvent) =>
  e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey;

/** Document-Y range during which a home-page section counts as "current". Lazy so pins/fonts are honoured on refresh. */
const sectionRange = (id: SectionId) => ({
  start: () => {
    const st = ScrollTrigger.getById(id);
    if (st) return st.start - window.innerHeight * 0.35;
    const el = document.getElementById(id);
    return el ? el.getBoundingClientRect().top + window.scrollY - window.innerHeight * 0.45 : 1e9;
  },
  end: () => {
    const st = ScrollTrigger.getById(id);
    if (st) return st.end;
    const el = document.getElementById(id);
    return el ? el.getBoundingClientRect().bottom + window.scrollY - window.innerHeight * 0.45 : 1e9 + 1;
  },
});

export const Navbar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  const [menuOpen, setMenuOpen] = useState(false); // logical state (drives aria / scroll lock)
  const [mounted, setMounted] = useState(false); // drawer in the DOM (stays true during the close animation)
  const [activeSection, setActiveSection] = useState<SectionId | null>(null);

  const rootRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const firstItemRef = useRef<HTMLAnchorElement>(null);
  const menuOpenRef = useRef(false);
  const quietUntil = useRef(0); // keep the bar visible while a nav-initiated scroll is running
  const drawerApi = useRef<{ close: () => void; reopen: () => void } | null>(null);

  const onHome = location.pathname === '/';
  const isDark = theme === 'dark';

  /* ------------------------------------------------------------------ drawer open / close */
  const closeMenu = useCallback((restoreFocus = true) => {
    if (!menuOpenRef.current) return;
    menuOpenRef.current = false;
    setMenuOpen(false);
    if (drawerApi.current) drawerApi.current.close();
    else setMounted(false);
    if (restoreFocus) toggleRef.current?.focus({ preventScroll: true });
  }, []);

  const openMenu = useCallback(() => {
    menuOpenRef.current = true;
    setMenuOpen(true);
    setMounted(true);
    drawerApi.current?.reopen(); // re-opened while the close animation was still running
  }, []);

  // Drawer timeline: clip-path wipe + staggered rows. Reduced motion -> instant.
  useGSAP(
    () => {
      if (!mounted || !drawerRef.current) return;
      const panel = drawerRef.current;
      const items = gsap.utils.toArray<HTMLElement>('[data-drawer-item]', panel);
      const mm = gsap.matchMedia();
      mm.add({ motion: MQ.motionOK, reduced: MQ.reduced }, (ctx) => {
        if (!ctx.conditions?.motion) {
          drawerApi.current = { close: () => setMounted(false), reopen: () => undefined };
          return () => {
            drawerApi.current = null;
          };
        }
        const tl = gsap.timeline({ onReverseComplete: () => setMounted(false) });
        tl.fromTo(
          panel,
          { clipPath: 'inset(0% 0% 100% 0%)' },
          { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.7, ease: 'power3.inOut' },
        ).from(items, { y: 28, opacity: 0, duration: 0.6, stagger: 0.06, ease: 'power3.out' }, '-=0.35');
        drawerApi.current = {
          close: () => void tl.timeScale(1.5).reverse(),
          reopen: () => void tl.timeScale(1).play(),
        };
        return () => {
          drawerApi.current = null;
        };
      });
      return () => mm.revert();
    },
    { dependencies: [mounted], scope: drawerRef },
  );

  // Scroll lock + Escape + initial focus while open
  useEffect(() => {
    if (!menuOpen) return;
    const html = document.documentElement;
    const prev = { overflow: html.style.overflow, pr: html.style.paddingRight };
    const sbw = window.innerWidth - html.clientWidth;
    html.style.overflow = 'hidden';
    if (sbw > 0) html.style.paddingRight = `${sbw}px`;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        closeMenu(true);
      }
    };
    document.addEventListener('keydown', onKey);
    firstItemRef.current?.focus({ preventScroll: true });

    return () => {
      document.removeEventListener('keydown', onKey);
      html.style.overflow = prev.overflow;
      html.style.paddingRight = prev.pr;
    };
  }, [menuOpen, closeMenu]);

  // Close when navigating (focus is left to the route's focus management) or when widening to the desktop bar
  useEffect(() => {
    closeMenu(false);
  }, [location.key, closeMenu]);
  useEffect(() => {
    const mq = window.matchMedia(DESKTOP_MQ);
    const onChange = () => {
      if (mq.matches && menuOpenRef.current) {
        menuOpenRef.current = false;
        setMenuOpen(false);
        setMounted(false);
      }
    };
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  const onDrawerKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== 'Tab' || !drawerRef.current) return;
    const nodes = Array.from(
      drawerRef.current.querySelectorAll<HTMLElement>('a[href], button:not([disabled])'),
    );
    if (!nodes.length) return;
    const first = nodes[0];
    const last = nodes[nodes.length - 1];
    const active = document.activeElement;
    if (e.shiftKey && (active === first || !drawerRef.current.contains(active))) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && (active === last || !drawerRef.current.contains(active))) {
      e.preventDefault();
      first.focus();
    }
  };

  /* ------------------------------------------------------------------ link behaviour */
  const onSectionClick = (id: SectionId) => (e: React.MouseEvent<HTMLAnchorElement>) => {
    closeMenu(false);
    if (isModifiedClick(e)) return; // let the browser open a new tab / window
    quietUntil.current = performance.now() + 1800;
    if (onHome) {
      e.preventDefault();
      navigate({ pathname: '/', hash: `#${id}` });
      void scrollToSection(id); // immediate; ScrollManager de-dupes by location.key
    }
    // off-home: react-router's <Link> navigates to /#id and ScrollManager does the scroll
  };

  const onBrandClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    closeMenu(false);
    if (isModifiedClick(e) || !onHome) return; // from a model page: navigate('/') + ScrollManager -> top
    e.preventDefault();
    if (location.hash) {
      navigate('/'); // clears the hash; ScrollManager jumps to the top
    } else if (prefersReducedMotion()) {
      scrollToTop();
    } else {
      gsap.to(window, { scrollTo: 0, duration: 1, ease: 'power3.inOut', overwrite: true });
    }
  };

  const onSkip = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const main = document.getElementById('main');
    if (!main) return; // fall back to the native fragment jump
    e.preventDefault();
    main.focus({ preventScroll: false });
  };

  /* ------------------------------------------------------------------ entrance + stripe (once) */
  useGSAP(
    () => {
      const bar = barRef.current;
      if (!bar) return;
      const mm = gsap.matchMedia();
      mm.add(MQ.motionOK, () => {
        const q = gsap.utils.selector(bar);
        const tl = gsap.timeline({ defaults: { ease: 'power3.out' }, delay: 0.1 });
        tl.from(q('.mnav__stripe'), { scaleX: 0, duration: 1.2, ease: 'expo.out' }, 0)
          .from(q('.mnav__brand'), { autoAlpha: 0, y: -12, duration: 0.7 }, 0.1)
          .from(q('[data-nav-item]'), { autoAlpha: 0, y: -12, duration: 0.6, stagger: 0.07 }, 0.2);
      });
      return () => mm.revert();
    },
    { scope: rootRef },
  );

  /* ------------------------------------------------------------------ scroll-linked: state, progress, hide/show, sections */
  useGSAP(
    () => {
      const bar = barRef.current;
      const progress = progressRef.current;
      const root = rootRef.current;
      if (!bar || !progress || !root) return;

      const mm = gsap.matchMedia();
      mm.add({ motion: MQ.motionOK, reduced: MQ.reduced }, (ctx) => {
        const motion = !!ctx.conditions?.motion;
        const setProgress = motion ? (gsap.quickSetter(progress, 'scaleX') as (v: number) => void) : null;
        let hidden = false;
        const show = () => {
          if (!hidden) return;
          hidden = false;
          gsap.to(bar, { yPercent: 0, duration: 0.45, ease: 'power3.out', overwrite: 'auto' });
        };
        const hide = () => {
          if (hidden) return;
          hidden = true;
          gsap.to(bar, { yPercent: -100, duration: 0.5, ease: 'power3.inOut', overwrite: 'auto' });
        };

        if (!motion) gsap.set(progress, { autoAlpha: 0 });

        ScrollTrigger.create({
          start: 0,
          end: 'max',
          onUpdate: (self) => {
            const y = self.scroll();
            bar.dataset.scrolled = y > 24 ? 'true' : 'false';
            if (!motion) return;
            setProgress?.(self.progress);
            const keep = menuOpenRef.current || performance.now() < quietUntil.current || !!bar.querySelector(':focus-visible');
            if (y < 160 || self.direction === -1 || keep) show();
            else if (self.direction === 1 && y > 240) hide();
          },
        });
        bar.dataset.scrolled = window.scrollY > 24 ? 'true' : 'false';
        setProgress?.(ScrollTrigger.maxScroll(window) > 0 ? window.scrollY / ScrollTrigger.maxScroll(window) : 0);

        // never leave the bar hidden under a focused control
        const onFocusIn = () => show();
        bar.addEventListener('focusin', onFocusIn);

        // section highlighting on the home page (guards: targets may not exist yet -> range sits off-screen)
        if (location.pathname === '/') {
          (['lineup', 'philosophy'] as SectionId[]).forEach((id) => {
            ScrollTrigger.create({
              ...sectionRange(id),
              refreshPriority: -1,
              onToggle: (self) =>
                setActiveSection((a) => (self.isActive ? id : a === id ? null : a)),
            });
          });
        } else {
          setActiveSection(null);
        }

        return () => {
          bar.removeEventListener('focusin', onFocusIn);
          gsap.set(bar, { clearProps: 'transform' });
        };
      });
      return () => mm.revert();
    },
    { scope: rootRef, dependencies: [location.pathname], revertOnUpdate: true },
  );

  /* ------------------------------------------------------------------ magnetic hover (fine pointers only) */
  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root) return;
      const mm = gsap.matchMedia();
      mm.add(`(hover: hover) and (pointer: fine) and ${MQ.motionOK}`, () => {
        const cleanups = gsap.utils.toArray<HTMLElement>('[data-magnet]', root).map((el) => {
          const strength = parseFloat(el.dataset.magnet || '0.25');
          const xTo = gsap.quickTo(el, 'x', { duration: 0.5, ease: 'power3.out' });
          const yTo = gsap.quickTo(el, 'y', { duration: 0.5, ease: 'power3.out' });
          const onMove = (e: PointerEvent) => {
            const r = el.getBoundingClientRect();
            const cx = r.left + r.width / 2 - (gsap.getProperty(el, 'x') as number);
            const cy = r.top + r.height / 2 - (gsap.getProperty(el, 'y') as number);
            xTo((e.clientX - cx) * strength);
            yTo((e.clientY - cy) * strength);
          };
          const onLeave = () => {
            xTo(0);
            yTo(0);
          };
          el.addEventListener('pointermove', onMove);
          el.addEventListener('pointerleave', onLeave);
          return () => {
            el.removeEventListener('pointermove', onMove);
            el.removeEventListener('pointerleave', onLeave);
            gsap.set(el, { clearProps: 'x,y' });
          };
        });
        return () => cleanups.forEach((fn) => fn());
      });
      return () => mm.revert();
    },
    { scope: rootRef },
  );

  /* ------------------------------------------------------------------ render */
  const themeLabel = 'Dark mode';
  const sectionTo = (id: SectionId) => ({ pathname: '/', hash: `#${id}` });

  return (
    <div className="mnav-root" ref={rootRef}>
      <a href="#main" className="skip-link mnav-skip" onClick={onSkip}>
        Skip to content
      </a>
      <div className="mnav-progress" ref={progressRef} aria-hidden="true" />

      <header
        className="mnav"
        ref={barRef}
        data-scrolled="false"
        data-nav-surface={location.pathname.startsWith('/models/') ? 'photo' : 'plain'}
      >
        <span className="mnav__bg" aria-hidden="true" />
        <span className="mnav__rule" aria-hidden="true" />
        <span className="mnav__stripe" aria-hidden="true" />

        <div className="mnav__inner">
          <Link to="/" className="mnav__brand" aria-label="BMW M, home" onClick={onBrandClick}>
            <span>BMW</span>
            <span className="mnav__mark" aria-hidden="true">
              <i />
              <i />
              <i />
            </span>
            <span className="mnav__brand-m">M</span>
          </Link>

          {/* Desktop navigation */}
          <nav className="mnav__nav" aria-label="Main">
            <ul className="mnav__list">
              {SECTIONS.map((s) => (
                <li key={s.id} data-nav-item>
                  <Link
                    to={sectionTo(s.id)}
                    id={s.btnId}
                    className="mnav__link"
                    data-magnet="0.2"
                    aria-current={onHome && activeSection === s.id ? 'location' : undefined}
                    onClick={onSectionClick(s.id)}
                  >
                    {s.label}
                  </Link>
                </li>
              ))}
              <li className="mnav__sep" aria-hidden="true" data-nav-item />
              {BMW_MODELS.map((m) => (
                <li key={m.id} data-nav-item>
                  <Link
                    to={`/models/${m.id}`}
                    className="mnav__link mnav__link--model"
                    data-magnet="0.2"
                    aria-current={location.pathname === `/models/${m.id}` ? 'page' : undefined}
                  >
                    {m.shortName}
                  </Link>
                </li>
              ))}
              <li className="mnav__sep" aria-hidden="true" data-nav-item />
              <li data-nav-item>
                <Horizon
                  className="mnav__theme"
                  data-magnet="0.3"
                  toggled={isDark}
                  onClick={toggleTheme}
                  title={themeLabel}
                  aria-label={themeLabel}
                />
              </li>
            </ul>
          </nav>

          {/* Compact actions (< 1024px) */}
          <div className="mnav__actions">
            <Horizon
              className="mnav__theme"
              data-nav-item
              toggled={isDark}
              onClick={toggleTheme}
              title={themeLabel}
              aria-label={themeLabel}
            />
            <button
              ref={toggleRef}
              type="button"
              className="mnav__burger"
              data-nav-item
              aria-label="Menu"
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              onClick={() => (menuOpenRef.current ? closeMenu(true) : openMenu())}
            >
              <Menu size={24} aria-hidden="true" />
            </button>
          </div>
        </div>
      </header>

      {mounted && (
        <div
          id="mobile-menu"
          ref={drawerRef}
          className="mnav-drawer"
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
          onKeyDown={onDrawerKeyDown}
        >
          <div className="mnav-drawer__top" data-drawer-item>
            <span className="mnav-drawer__title">Menu</span>
            <button type="button" className="mnav__burger" aria-label="Close menu" onClick={() => closeMenu(true)}>
              <X size={24} aria-hidden="true" />
            </button>
          </div>

          <nav className="mnav-drawer__body" aria-label="Mobile">
            <ul className="mnav-drawer__list">
              {SECTIONS.map((s, i) => (
                <li key={s.id} data-drawer-item>
                  <Link
                    to={sectionTo(s.id)}
                    ref={i === 0 ? firstItemRef : undefined}
                    className="mnav-drawer__row mnav-drawer__row--main"
                    aria-current={onHome && activeSection === s.id ? 'location' : undefined}
                    onClick={onSectionClick(s.id)}
                  >
                    <span className="mnav-drawer__idx">{String(i + 1).padStart(2, '0')}</span>
                    {s.label}
                  </Link>
                </li>
              ))}
            </ul>
            <ul className="mnav-drawer__list">
              {BMW_MODELS.map((m) => (
                <li key={m.id} data-drawer-item>
                  <Link
                    to={`/models/${m.id}`}
                    className="mnav-drawer__row"
                    aria-current={location.pathname === `/models/${m.id}` ? 'page' : undefined}
                    onClick={() => closeMenu(false)}
                  >
                    <span className="mnav-drawer__idx">{m.shortName}</span>
                    <span className="mnav-drawer__name">{m.name}</span>
                    <span className="mnav-drawer__desc">{m.descriptor}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="mnav-drawer__foot" data-drawer-item>
            <span className="mnav-drawer__title">Theme</span>
            <Horizon
              className="mnav__theme"
              toggled={isDark}
              onClick={toggleTheme}
              title={themeLabel}
              aria-label={themeLabel}
            />
          </div>
          <div className="mnav-drawer__stripe" aria-hidden="true" />
        </div>
      )}
    </div>
  );
};
