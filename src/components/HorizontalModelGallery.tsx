import React, { useRef } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { gsap, ScrollTrigger, SplitText, useGSAP, MQ } from '@/lib/gsap';
import { BMW_MODELS } from '../data/models';
import { ModelCard } from './ModelCard';
import '../styles/gallery.css';

const N = BMW_MODELS.length;
const pad2 = (n: number) => String(n).padStart(2, '0');

interface Controls {
  goTo: (index: number) => void;
  step: (dir: 1 | -1) => void;
}

/**
 * "01 — THE LINEUP"
 *  - desktop + motion OK : section pinned to 100svh, track driven by a scrubbed
 *    `containerAnimation` tween (ScrollTrigger id: 'lineup'), snap per card.
 *  - mobile / reduced motion : native horizontal scroll-snap track, no pin.
 * Navigation is a plain <Link> on every card; no animation callback ever navigates.
 */
export const HorizontalModelGallery: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLUListElement>(null);
  const controls = useRef<Controls | null>(null);

  useGSAP(
    () => {
      const section = sectionRef.current;
      const track = trackRef.current;
      if (!section || !track) return;

      const q = gsap.utils.selector(section);
      const cards = gsap.utils.toArray<HTMLElement>('.lineup-card', track);
      const counterCur = q('.lineup__count-cur')[0] as HTMLElement;
      const barFill = q('.lineup__bar-fill')[0] as HTMLElement;
      const prevBtn = q('[data-lineup-prev]')[0] as HTMLButtonElement;
      const nextBtn = q('[data-lineup-next]')[0] as HTMLButtonElement;
      const setBar = gsap.quickSetter(barFill, 'scaleX');

      let shown = -1;
      /** Update everything that is a pure function of the active index. */
      const showIndex = (i: number, animate: boolean) => {
        if (i === shown) return;
        shown = i;
        counterCur.textContent = pad2(i + 1);
        prevBtn.setAttribute('aria-disabled', String(i === 0));
        nextBtn.setAttribute('aria-disabled', String(i === N - 1));
        cards.forEach((c, k) => c.toggleAttribute('data-active', k === i));
        if (animate) {
          gsap.fromTo(counterCur, { yPercent: 70, autoAlpha: 0 }, { yPercent: 0, autoAlpha: 1, duration: 0.45, ease: 'power3.out', overwrite: true });
        }
      };

      const mm = gsap.matchMedia();

      // ------------------------------------------------------------------
      // DESKTOP + MOTION: pinned horizontal track
      // ------------------------------------------------------------------
      mm.add(`${MQ.desktop} and ${MQ.motionOK}`, () => {
        section.dataset.mode = 'pin';
        const viewport = q('.lineup__viewport')[0] as HTMLElement;
        const dist = () => Math.max(0, track.scrollWidth - viewport.clientWidth);

        const setScale = cards.map((c) => gsap.quickSetter(c, 'scale') as (v: number) => void);
        const setDim = cards.map((c) => gsap.quickSetter(c.querySelector('.lineup-card__dim'), 'opacity') as (v: number) => void);
        const focusEase = gsap.parseEase('power2.out');

        // current-model name swap (clip-masked characters)
        const nowItems = q('.lineup__now-item') as HTMLElement[];
        const nowSplits: SplitText[] = [];
        nowItems.forEach((item, i) => {
          const nameEl = item.querySelector('.lineup__now-name') as HTMLElement;
          const descEl = item.querySelector('.lineup__now-desc') as HTMLElement;
          nowSplits.push(
            SplitText.create(nameEl, {
              type: 'chars',
              mask: 'chars',
              aria: 'auto',
              autoSplit: true,
              onSplit(self) {
                gsap.set(self.chars, { yPercent: i === Math.max(shown, 0) ? 0 : 110 });
                gsap.set(descEl, { autoAlpha: i === Math.max(shown, 0) ? 1 : 0 });
              },
            })
          );
        });

        let nowIndex = 0;
        const swapName = (to: number) => {
          const from = nowIndex;
          if (from === to) return;
          nowIndex = to;
          const dir = to > from ? 1 : -1;
          const outChars = nowSplits[from].chars;
          const inChars = nowSplits[to].chars;
          const outDesc = nowItems[from].querySelector('.lineup__now-desc');
          const inDesc = nowItems[to].querySelector('.lineup__now-desc');
          gsap.killTweensOf([outChars, inChars, outDesc, inDesc]);
          gsap.to(outChars, { yPercent: -110 * dir, duration: 0.4, stagger: 0.018, ease: 'power3.in' });
          gsap.to(outDesc, { autoAlpha: 0, duration: 0.25 });
          gsap.fromTo(inChars, { yPercent: 110 * dir }, { yPercent: 0, duration: 0.8, stagger: 0.03, ease: 'expo.out', delay: 0.18 });
          gsap.to(inDesc, { autoAlpha: 1, duration: 0.5, delay: 0.3 });
        };

        let ready = false;
        const hTween = gsap.to(track, {
          x: () => -dist(),
          ease: 'none',
          onUpdate: () => ready && tick(),
          scrollTrigger: {
            id: 'lineup', // contract: scrollToSection('lineup') resolves through this id
            trigger: section,
            pin: true,
            pinSpacing: true,
            start: 'top top',
            end: () => `+=${dist()}`,
            scrub: 0.5,
            // directional: a 40px arrow-key nudge still advances one card instead of snapping back
            snap: { snapTo: 1 / (N - 1), directional: true, inertia: false, duration: { min: 0.25, max: 0.6 }, delay: 0.12, ease: 'power2.inOut' },
            invalidateOnRefresh: true,
            anticipatePin: 1,
            refreshPriority: 2, // pinned, later than intro/hero, earlier than the content below
            onRefresh: () => ready && tick(),
          },
        });
        const st = hTween.scrollTrigger as ScrollTrigger;

        function tick() {
          const pos = hTween.progress() * (N - 1);
          setBar((pos + 1) / N);
          for (let i = 0; i < N; i++) {
            const f = focusEase(Math.max(0, 1 - Math.abs(pos - i)));
            setScale[i](0.86 + 0.14 * f);
            setDim[i](0.62 * (1 - f));
          }
          const idx = Math.min(N - 1, Math.max(0, Math.round(pos)));
          if (idx !== shown) {
            const first = shown === -1;
            showIndex(idx, !first);
            if (first) nowIndex = idx;
            else swapName(idx);
          }
        }

        // parallax: image drifts against the card, the ghost numeral against the image
        cards.forEach((card) => {
          const img = card.querySelector('.lineup-card__img');
          const ghost = card.querySelector('.lineup-card__ghost');
          gsap
            .timeline({
              defaults: { ease: 'none' },
              scrollTrigger: { trigger: card, containerAnimation: hTween, start: 'left right', end: 'right left', scrub: true },
            })
            .fromTo(img, { xPercent: -6 }, { xPercent: 6 }, 0)
            .fromTo(ghost, { x: 90 }, { x: -90 }, 0);
        });

        // title intro: eyebrow + SplitText headline + card shutters, once, on approach
        const h2 = q('.lineup__h2')[0] as HTMLElement;
        let introPlay: (() => void) | null = null;
        let entered = false;
        ScrollTrigger.create({
          trigger: section,
          start: 'top 78%',
          once: true,
          onEnter: () => {
            entered = true;
            introPlay?.();
          },
        });
        const headSplit = SplitText.create(h2, {
          type: 'lines',
          mask: 'lines',
          aria: 'auto',
          autoSplit: true,
          onSplit(self) {
            const tl = gsap.timeline({ paused: !entered, defaults: { ease: 'expo.out' } });
            tl.from(self.lines, { yPercent: 110, duration: 1.1, stagger: 0.1 }, 0)
              .from(q('.lineup__eyebrow'), { autoAlpha: 0, y: 14, duration: 0.8, ease: 'power3.out' }, 0)
              .from(q('.lineup__controls, .lineup__now'), { autoAlpha: 0, y: 14, duration: 0.8, stagger: 0.08, ease: 'power3.out' }, 0.25)
              .fromTo(
                cards.map((c) => c.querySelector('.lineup-card__media')),
                { clipPath: 'inset(0% 0% 100% 0%)', scale: 1.12 },
                { clipPath: 'inset(0% 0% 0% 0%)', scale: 1, duration: 1.2, stagger: 0.1, ease: 'power3.inOut', clearProps: 'clipPath' },
                0.15
              );
            introPlay = () => tl.play();
            return tl;
          },
        });

        // controls
        let pending: number | null = null;
        let scrollTween: gsap.core.Tween | null = null;
        const current = () => Math.min(N - 1, Math.max(0, Math.round(hTween.progress() * (N - 1))));
        const goTo = (i: number) => {
          const target = Math.min(N - 1, Math.max(0, i));
          const y = st.start + (target / (N - 1)) * (st.end - st.start);
          scrollTween?.kill();
          pending = target; // after kill(): the old tween's onInterrupt must not clear it
          const tw = gsap.to(window, {
            scrollTo: { y, autoKill: true },
            duration: 0.9,
            ease: 'power3.inOut',
            overwrite: true,
            onComplete: () => {
              if (scrollTween === tw) pending = null;
            },
            onInterrupt: () => {
              if (scrollTween === tw) pending = null;
            },
          });
          scrollTween = tw;
        };
        controls.current = { goTo, step: (d) => goTo((pending ?? current()) + d) };

        ready = true;
        tick();

        return () => {
          controls.current = null;
          scrollTween?.kill();
          nowSplits.forEach((s) => s.revert());
          headSplit.revert();
          gsap.killTweensOf(counterCur);
          gsap.set(cards, { clearProps: 'transform' });
          delete section.dataset.mode;
          shown = -1;
        };
      });

      // ------------------------------------------------------------------
      // DESKTOP + MOTION + fine pointer: magnetic CTA
      // ------------------------------------------------------------------
      mm.add(`${MQ.desktop} and ${MQ.motionOK} and (hover: hover) and (pointer: fine)`, () => {
        const offs: Array<() => void> = [];
        cards.forEach((card) => {
          const cta = card.querySelector('.lineup-card__cta') as HTMLElement | null;
          if (!cta) return;
          const qx = gsap.quickTo(cta, 'x', { duration: 0.5, ease: 'power3.out' });
          const qy = gsap.quickTo(cta, 'y', { duration: 0.5, ease: 'power3.out' });
          const move = (e: PointerEvent) => {
            const r = cta.getBoundingClientRect();
            const cx = r.left + r.width / 2 - Number(gsap.getProperty(cta, 'x'));
            const cy = r.top + r.height / 2 - Number(gsap.getProperty(cta, 'y'));
            qx(gsap.utils.clamp(-14, 14, (e.clientX - cx) * 0.16));
            qy(gsap.utils.clamp(-8, 8, (e.clientY - cy) * 0.22));
          };
          const leave = () => {
            qx(0);
            qy(0);
          };
          card.addEventListener('pointermove', move);
          card.addEventListener('pointerleave', leave);
          offs.push(() => {
            card.removeEventListener('pointermove', move);
            card.removeEventListener('pointerleave', leave);
          });
        });
        return () => {
          offs.forEach((f) => f());
          cards.forEach((c) => gsap.set(c.querySelector('.lineup-card__cta'), { clearProps: 'transform' }));
        };
      });

      // ------------------------------------------------------------------
      // MOBILE or REDUCED MOTION: native scroll-snap track, no pin
      // ------------------------------------------------------------------
      mm.add(`${MQ.mobile}, ${MQ.reduced}`, () => {
        section.dataset.mode = 'native';
        const reduced = window.matchMedia(MQ.reduced).matches;
        let pending: number | null = null;
        let pendingTimer = 0;

        const io = new IntersectionObserver(
          (entries) => {
            entries.forEach((e) => {
              if (e.intersectionRatio >= 0.6) {
                const i = cards.indexOf(e.target as HTMLElement);
                if (i >= 0) {
                  showIndex(i, false);
                  setBar((i + 1) / N);
                }
              }
            });
          },
          { root: track, threshold: [0.6] }
        );
        cards.forEach((c) => io.observe(c));

        const goTo = (i: number) => {
          const target = Math.min(N - 1, Math.max(0, i));
          pending = target;
          window.clearTimeout(pendingTimer);
          pendingTimer = window.setTimeout(() => (pending = null), 700);
          const pl = parseFloat(getComputedStyle(track).scrollPaddingInlineStart) || 0;
          track.scrollTo({ left: cards[target].offsetLeft - pl, behavior: reduced ? 'auto' : 'smooth' });
        };
        controls.current = { goTo, step: (d) => goTo((pending ?? Math.max(shown, 0)) + d) };

        showIndex(0, false);
        setBar(1 / N);
        // the track is the horizontal scroller; keep a stale scroll position from a previous mode out
        track.scrollLeft = 0;

        return () => {
          io.disconnect();
          window.clearTimeout(pendingTimer);
          controls.current = null;
          delete section.dataset.mode;
          shown = -1;
        };
      });

      // fixed-size images mean no layout shift, but ScrollTrigger measures after decode anyway
      let cancelled = false;
      const pendingImgs = Array.from(track.querySelectorAll('img')).filter((im) => !im.complete);
      if (pendingImgs.length) {
        Promise.all(pendingImgs.map((im) => im.decode().catch(() => undefined))).then(() => {
          if (!cancelled) ScrollTrigger.refresh();
        });
      }
      return () => {
        cancelled = true;
      };
    },
    { scope: sectionRef }
  );

  const onFocusCard = (index: number, e: React.FocusEvent<HTMLAnchorElement>) => {
    // Only for keyboard focus; a mouse click navigates immediately anyway.
    if (!e.currentTarget.matches(':focus-visible')) return;
    controls.current?.goTo(index);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) return;
    if (!controls.current) return;
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      controls.current.step(1);
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      controls.current.step(-1);
    }
  };

  return (
    <section ref={sectionRef} id="lineup" className="lineup" aria-labelledby="lineup-title">
      <header className="lineup__head">
        <div className="lineup__title">
          <p className="lineup__eyebrow">
            <span className="m-badge-stripes" aria-hidden="true">
              <span className="m-stripe-1" />
              <span className="m-stripe-2" />
              <span className="m-stripe-3" />
            </span>
            <span>01 — The Lineup</span>
          </p>
          <h2 id="lineup-title" className="lineup__h2">
            Choose your weapon
          </h2>
        </div>

        {/* pin mode only: the model currently in the centre */}
        <div className="lineup__now" aria-hidden="true">
          {BMW_MODELS.map((m) => (
            <div className="lineup__now-item" key={m.id}>
              <span className="lineup__now-name">{m.name}</span>
              <span className="lineup__now-desc">{m.descriptor}</span>
            </div>
          ))}
        </div>

        <div className="lineup__controls">
          <p className="lineup__count" aria-label="Model position">
            <span className="lineup__count-cur-wrap">
              <span className="lineup__count-cur">01</span>
            </span>
            <span className="lineup__count-sep" aria-hidden="true">/</span>
            <span className="lineup__count-total">{pad2(N)}</span>
          </p>
          <div className="lineup__btns">
            <button type="button" className="lineup__btn" data-lineup-prev aria-label="Previous model" aria-disabled="true" onClick={() => controls.current?.step(-1)}>
              <ArrowLeft size={18} aria-hidden="true" />
            </button>
            <button type="button" className="lineup__btn" data-lineup-next aria-label="Next model" onClick={() => controls.current?.step(1)}>
              <ArrowRight size={18} aria-hidden="true" />
            </button>
          </div>
        </div>

        <div className="lineup__bar" aria-hidden="true">
          <span className="lineup__bar-fill" />
        </div>
      </header>

      <div className="lineup__viewport" onKeyDown={onKeyDown}>
        <ul ref={trackRef} className="lineup__track" role="list">
          {BMW_MODELS.map((model, i) => (
            <ModelCard key={model.id} model={model} index={i} total={N} onFocusCard={onFocusCard} />
          ))}
        </ul>
      </div>
    </section>
  );
};
