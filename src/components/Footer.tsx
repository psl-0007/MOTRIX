import React, { useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowUp } from 'lucide-react';
import { gsap, useGSAP, MQ, prefersReducedMotion } from '@/lib/gsap';
import { BMW_MODELS } from '@/data/models';
import { scrollToTop } from '@/lib/scroll';
import '@/styles/footer.css';

export const Footer: React.FC = () => {
  const root = useRef<HTMLElement>(null);
  const { pathname } = useLocation();
  const year = new Date().getFullYear();

  // Re-created per route: the page above has a different height after navigation.
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.motionOK, () => {
        const tl = gsap.timeline({
          scrollTrigger: { trigger: '.site-footer__brand', start: 'top 92%', once: true, refreshPriority: -1 },
          defaults: { ease: 'power3.out' },
        });
        tl.fromTo('.site-footer__stripe', { scaleX: 0 }, { scaleX: 1, duration: 1.1, stagger: 0.12, ease: 'expo.out' })
          .fromTo('.site-footer__word', { yPercent: 110 }, { yPercent: 0, duration: 1, stagger: 0.08 }, 0.1)
          .fromTo(
            '.site-footer__col',
            { autoAlpha: 0, y: 24 },
            { autoAlpha: 1, y: 0, duration: 0.8, stagger: 0.08 },
            0.3,
          );
      });
    },
    { scope: root, dependencies: [pathname], revertOnUpdate: true },
  );

  const toTop = (e: React.MouseEvent) => {
    e.preventDefault();
    if (prefersReducedMotion()) scrollToTop();
    else gsap.to(window, { scrollTo: 0, duration: 1.2, ease: 'power3.inOut', overwrite: true, autoKill: true });
  };

  return (
    <footer ref={root} className="site-footer">
      <div className="site-footer__inner">
        <div className="site-footer__brand" aria-hidden="true">
          <div className="site-footer__mark font-display">
            <span className="site-footer__mask">
              <span className="site-footer__word">BMW</span>
            </span>
            <span className="site-footer__mask">
              <span className="site-footer__word site-footer__word--m">///M</span>
            </span>
          </div>
          <div className="site-footer__stripes">
            <span className="site-footer__stripe site-footer__stripe--1" />
            <span className="site-footer__stripe site-footer__stripe--2" />
            <span className="site-footer__stripe site-footer__stripe--3" />
          </div>
        </div>

        <div className="site-footer__grid">
          <div className="site-footer__col site-footer__about">
            <p className="site-footer__lead">A concept showcase of the BMW M lineup: M2, M3, M4, M5 and M8.</p>
          </div>

          <nav className="site-footer__col" aria-label="Models">
            <h2 className="site-footer__heading font-tech">Lineup</h2>
            <ul className="site-footer__list">
              {BMW_MODELS.map((m) => (
                <li key={m.id}>
                  <Link to={`/models/${m.id}`} className="site-footer__link font-tech">
                    {m.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav className="site-footer__col" aria-label="Explore">
            <h2 className="site-footer__heading font-tech">Explore</h2>
            <ul className="site-footer__list">
              <li>
                <Link to={{ pathname: '/', hash: '#lineup' }} className="site-footer__link font-tech">
                  Lineup
                </Link>
              </li>
              <li>
                <Link to={{ pathname: '/', hash: '#philosophy' }} className="site-footer__link font-tech">
                  About M
                </Link>
              </li>
            </ul>
          </nav>

          <div className="site-footer__col">
            <h2 className="site-footer__heading font-tech">Appearance</h2>
            <p className="site-footer__note">
              Dark and light themes are available. Use the toggle in the top navigation to switch.
            </p>
          </div>
        </div>

        <div className="site-footer__legal">
          <p className="site-footer__copy font-tech">
            © {year} Independent concept site. BMW, M and the M tricolour are trademarks of BMW AG.
          </p>
          <a href="#main" className="site-footer__top font-tech" onClick={toTop}>
            Back to top
            <ArrowUp size={16} aria-hidden="true" focusable="false" />
          </a>
        </div>
      </div>
    </footer>
  );
};
