import React, { useRef } from 'react';
import { gsap, SplitText, useGSAP, MQ } from '@/lib/gsap';
import { scrollToSection } from '@/lib/scroll';
import '../styles/intro.css';

/**
 * Intro title card.
 *
 * Desktop: the section is pinned with `pinSpacing:false` for exactly one viewport of scroll while the
 * hero (next sibling, higher z-index) slides up over it; the wordmark scales and fades on scrub as the
 * hero arrives. There is no dead scroll space: when the pin ends the hero is flush with the viewport top.
 * Mobile: no pin; the wordmark only fades/scales as the card scrolls away.
 * Reduced motion: everything is in its final state (CSS shows all content; JS never hides anything).
 */
export const IntroSequence: React.FC = () => {
  const rootRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const markRef = useRef<HTMLParagraphElement>(null);
  const stripesRef = useRef<HTMLDivElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const cueRef = useRef<HTMLAnchorElement>(null);
  const cueBarRef = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const root = rootRef.current;
      const stage = stageRef.current;
      const sub = subRef.current;
      const cue = cueRef.current;
      if (!root || !stage || !sub || !cue) return;

      const mm = gsap.matchMedia();

      // Reduced motion needs no branch: the CSS resting state IS the final state (nothing is hidden, the
      // cue line is static) and every pin / scrub / entrance below is gated on MQ.motionOK.

      // 1. Scrubbed hand-off, desktop: pinned for one viewport, hero covers the card.
      // Created first so its trigger precedes the hero's (page order).
      mm.add(`${MQ.motionOK} and ${MQ.desktop}`, () => {
        const tl = gsap.timeline({
          defaults: { ease: 'none' },
          scrollTrigger: {
            id: 'intro',
            trigger: root,
            start: 'top top',
            end: () => '+=' + root.offsetHeight,
            pin: true,
            pinSpacing: false,
            scrub: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            refreshPriority: 2,
          },
        });
        tl.to(stage, { scale: 1.45, opacity: 0, duration: 0.8 }, 0)
          .to(sub, { opacity: 0, y: -24, duration: 0.3 }, 0)
          .to(cue, { opacity: 0, duration: 0.2 }, 0);
      });

      // 1b. Mobile: no pin, the card just eases away as it scrolls off.
      mm.add(`${MQ.motionOK} and ${MQ.mobile}`, () => {
        gsap.to(stage, {
          scale: 1.2,
          opacity: 0.15,
          ease: 'none',
          scrollTrigger: { trigger: root, start: 'top top', end: 'bottom top', scrub: true },
        });
        gsap.to([sub, cue], {
          opacity: 0,
          ease: 'none',
          scrollTrigger: { trigger: root, start: 'top top', end: '45% top', scrub: true },
        });
      });

      // 2. Entrance (once, on load). Hidden "from" states are set from JS only.
      mm.add(MQ.motionOK, () => {
        if (window.scrollY > 10) return; // scroll restored mid-page: skip straight to the final state

        const mark = markRef.current;
        const stripes = stripesRef.current?.children;
        if (!mark || !stripes) return;

        SplitText.create(mark, {
          type: 'chars',
          mask: 'chars',
          autoSplit: true,
          aria: 'auto',
          onSplit(self) {
            return gsap.from(self.chars, {
              yPercent: 115,
              duration: 1.15,
              ease: 'expo.out',
              stagger: 0.09,
              delay: 0.15,
            });
          },
        });

        gsap.from(stripes, {
          scaleX: 0,
          duration: 0.9,
          ease: 'expo.out',
          stagger: 0.12,
          delay: 0.65,
        });

        SplitText.create(sub, {
          type: 'lines',
          mask: 'lines',
          autoSplit: true,
          aria: 'auto',
          onSplit(self) {
            return gsap.from(self.lines, {
              yPercent: 110,
              duration: 0.9,
              ease: 'power3.out',
              stagger: 0.1,
              delay: 1.0,
            });
          },
        });

        gsap.from(cue, { opacity: 0, y: 10, duration: 0.7, ease: 'power3.out', delay: 1.5 });

        // The animated cue line
        gsap.fromTo(
          cueBarRef.current,
          { yPercent: -110 },
          { yPercent: 230, duration: 1.4, ease: 'power2.inOut', repeat: -1, repeatDelay: 0.35, delay: 1.8 }
        );
      });
    },
    { scope: rootRef }
  );

  // Keyboard/skip affordance: a real link to the hero. Smooth-scroll on plain clicks, then move focus.
  const onCueClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    void scrollToSection('hero').then((ok) => {
      if (ok) document.getElementById('hero-title')?.focus({ preventScroll: true });
    });
  };

  return (
    <section ref={rootRef} id="intro" className="intro" aria-label="BMW M introduction">
      <div className="intro__hud" aria-hidden="true" />

      <div ref={stageRef} className="intro__stage">
        <p ref={markRef} className="intro__mark font-display">
          BMW
        </p>
        <div ref={stripesRef} className="intro__stripes" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
      </div>

      <p ref={subRef} className="intro__sub font-tech">
        M Division • The most powerful letter in the world
      </p>

      <a ref={cueRef} href="#hero" className="intro__cue font-tech" onClick={onCueClick}>
        <span>Scroll to explore</span>
        <span className="intro__cue-track" aria-hidden="true">
          <span ref={cueBarRef} className="intro__cue-bar" />
        </span>
      </a>
    </section>
  );
};
