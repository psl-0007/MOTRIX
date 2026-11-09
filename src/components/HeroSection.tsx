import React, { useEffect, useRef, useState } from 'react';
import { ArrowDown } from 'lucide-react';
import { gsap, ScrollTrigger, SplitText, useGSAP, MQ } from '@/lib/gsap';
import { scrollToSection } from '@/lib/scroll';
import { BMW_MODELS } from '../data/models';
import '../styles/hero.css';

// Existing assets, unchanged: the video is the motion layer, the JPG is its poster and the
// reduced-motion / save-data / error fallback.
const HERO_VIDEO_SRC = '/videos/m4-hero.mp4';
const HERO_POSTER_SRC = '/images/models/m4-hero.jpg';

type SpecKey = 'power' | 'acceleration' | 'topSpeed';

/** Leading number of a spec string, e.g. "3,814 LBS" -> 3814. */
const num = (s: string): number => parseFloat(s.replace(/,/g, ''));

/** Lineup-wide extreme for one spec, plus every model that shares it. Keeps copy honest vs models.ts. */
function extreme(key: SpecKey, pick: 'max' | 'min') {
  const rows = BMW_MODELS.map((m) => ({ id: m.shortName, v: num(m.specs[key]) }));
  const target = Math[pick](...rows.map((r) => r.v));
  return { value: target, models: rows.filter((r) => r.v === target).map((r) => r.id).join(' · ') };
}

const POWER_MAX = extreme('power', 'max');
const POWER_MIN = extreme('power', 'min');
const ACCEL_BEST = extreme('acceleration', 'min');
const SPEED_MAX = extreme('topSpeed', 'max');

const TELEMETRY = [
  { label: 'Peak power', models: POWER_MAX.models, value: POWER_MAX.value, decimals: 0, unit: 'HP' },
  { label: '0–60 mph', models: ACCEL_BEST.models, value: ACCEL_BEST.value, decimals: 1, unit: 'SEC' },
  { label: 'Top speed', models: SPEED_MAX.models, value: SPEED_MAX.value, decimals: 0, unit: 'MPH' },
] as const;

const fmt = (v: number, decimals: number) => v.toFixed(decimals);

/** Decide once at mount whether to ship the 13 MB video at all. */
function initialMedia() {
  if (typeof window === 'undefined') return { video: false, light: false };
  const reduced = window.matchMedia(MQ.reduced).matches;
  const conn = (navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } }).connection;
  const constrained = !!conn && (conn.saveData === true || /(^|-)2g$|3g/.test(conn.effectiveType ?? ''));
  return { video: !reduced && !constrained, light: window.matchMedia(MQ.mobile).matches };
}

export const HeroSection: React.FC = () => {
  const rootRef = useRef<HTMLElement>(null);
  const mediaRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const eyebrowRef = useRef<HTMLParagraphElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const ledeRef = useRef<HTMLParagraphElement>(null);
  const actionsRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLAnchorElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const ruleRef = useRef<HTMLSpanElement>(null);
  const cueBarRef = useRef<HTMLSpanElement>(null);
  const inViewRef = useRef(false);

  const [{ video: wantVideo, light: lightPreload }] = useState(initialMedia);
  const [videoFailed, setVideoFailed] = useState(false);
  const useVideo = wantVideo && !videoFailed;

  // Attach the video source only once the page is idle (never competes with first paint / LCP),
  // and release it on unmount so the download is aborted when the user leaves.
  useEffect(() => {
    const v = videoRef.current;
    if (!useVideo || !v) return;
    const attach = () => {
      if (!v.getAttribute('src')) v.src = HERO_VIDEO_SRC;
    };
    const w = window as Window & {
      requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number;
      cancelIdleCallback?: (h: number) => void;
    };
    const idle = typeof w.requestIdleCallback === 'function';
    const handle = idle ? w.requestIdleCallback!(attach, { timeout: 1500 }) : window.setTimeout(attach, 600);
    return () => {
      if (idle) w.cancelIdleCallback?.(handle);
      else window.clearTimeout(handle);
      v.pause();
      v.removeAttribute('src');
      v.load();
    };
  }, [useVideo]);

  useGSAP(
    () => {
      const root = rootRef.current;
      const title = titleRef.current;
      const media = mediaRef.current;
      if (!root || !title || !media) return;

      // Anchor for scrollToSection('hero') / the intro cue: where the hero is flush with the top.
      // (Not an animation, so it lives outside matchMedia and exists in every motion mode.)
      ScrollTrigger.create({ id: 'hero', trigger: root, start: 'top top', end: 'bottom top', refreshPriority: 1 });

      const mm = gsap.matchMedia();

      // Reduced motion: the resting CSS state is final (poster still, all text visible).
      // Intentionally no branch for it: nothing below runs, so nothing is hidden, scrubbed or parallaxed.

      mm.add(MQ.motionOK, () => {
        const q = <T extends Element>(sel: string) => gsap.utils.toArray<T>(sel, root);

        // Play the video only while the hero is on screen (saves CPU/battery and bandwidth).
        ScrollTrigger.create({
          trigger: root,
          start: 'top bottom',
          end: 'bottom top',
          onToggle: (self) => {
            inViewRef.current = self.isActive;
            const v = videoRef.current;
            if (!v) return;
            if (self.isActive) void v.play().catch(() => undefined);
            else v.pause();
          },
        });

        // Entrance (plays once when the hero is ~35% visible: i.e. while it slides over the intro).
        let entered = false;
        let headline: gsap.core.Tween | undefined;

        SplitText.create(title, {
          type: 'lines',
          mask: 'lines',
          autoSplit: true,
          aria: 'auto',
          onSplit(self) {
            headline = gsap.from(self.lines, {
              yPercent: 108,
              duration: 1.15,
              ease: 'expo.out',
              stagger: 0.12,
              paused: !entered,
            });
            return headline;
          },
        });

        const counters = q<HTMLElement>('[data-count]');
        const countUp = gsap.timeline();
        counters.forEach((el) => {
          const target = Number(el.dataset.value);
          const decimals = Number(el.dataset.decimals ?? 0);
          const state = { v: 0 };
          countUp.to(
            state,
            {
              v: target,
              duration: 1.5,
              ease: 'power3.out',
              snap: { v: decimals ? 0.1 : 1 },
              onStart: () => { el.textContent = fmt(0, decimals); },
              onUpdate: () => { el.textContent = fmt(state.v, decimals); },
              onComplete: () => { el.textContent = fmt(target, decimals); },
            },
            0
          );
        });

        const entrance = gsap
          .timeline({ paused: true, defaults: { ease: 'power3.out' } })
          .from(eyebrowRef.current, { opacity: 0, y: 16, duration: 0.7 }, 0)
          .from([ledeRef.current, actionsRef.current], { opacity: 0, y: 24, duration: 0.8, stagger: 0.12 }, 0.45)
          .from(ruleRef.current, { scaleX: 0, duration: 1.3, ease: 'expo.out' }, 0.6)
          .from(barRef.current ? Array.from(barRef.current.querySelectorAll('.hero__stat, .hero__cue')) : [], {
            opacity: 0,
            y: 18,
            duration: 0.7,
            stagger: 0.1,
          }, 0.8)
          .add(countUp, 0.9);

        ScrollTrigger.create({
          trigger: root,
          start: 'top 65%',
          once: true,
          onEnter: () => {
            entered = true;
            entrance.play();
            headline?.play();
          },
        });

        // Scroll cue line (decorative loop)
        gsap.fromTo(
          cueBarRef.current,
          { xPercent: -110 },
          { xPercent: 260, duration: 1.4, ease: 'power2.inOut', repeat: -1, repeatDelay: 0.35 }
        );

        // If the context reverts mid-count (breakpoint change), leave the real numbers in place.
        return () => {
          counters.forEach((el) => {
            el.textContent = fmt(Number(el.dataset.value), Number(el.dataset.decimals ?? 0));
          });
        };
      });

      // Scrubbed parallax on the video wrapper: desktop + motion-OK only.
      mm.add(`${MQ.motionOK} and ${MQ.desktop}`, () => {
        gsap.fromTo(
          media,
          { yPercent: -7 },
          {
            yPercent: 7,
            ease: 'none',
            scrollTrigger: { trigger: root, start: 'top bottom', end: 'bottom top', scrub: true },
          }
        );
      });

      // Magnetic CTA: fine pointers only.
      mm.add(`${MQ.motionOK} and (hover: hover) and (pointer: fine)`, () => {
        const cta = ctaRef.current;
        if (!cta) return;
        const xTo = gsap.quickTo(cta, 'x', { duration: 0.5, ease: 'power3.out' });
        const yTo = gsap.quickTo(cta, 'y', { duration: 0.5, ease: 'power3.out' });
        const move = (e: PointerEvent) => {
          const r = cta.getBoundingClientRect();
          xTo((e.clientX - (r.left + r.width / 2)) * 0.28);
          yTo((e.clientY - (r.top + r.height / 2)) * 0.4);
        };
        const leave = () => { xTo(0); yTo(0); };
        cta.addEventListener('pointermove', move);
        cta.addEventListener('pointerleave', leave);
        return () => {
          cta.removeEventListener('pointermove', move);
          cta.removeEventListener('pointerleave', leave);
        };
      });
    },
    { scope: rootRef }
  );

  const onCtaClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    // Real link semantics (middle-click / copy link work); plain clicks get the smooth anchored scroll.
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    void scrollToSection('lineup');
  };

  return (
    <section ref={rootRef} id="hero" className={`hero${useVideo ? '' : ' hero--still'}`} aria-labelledby="hero-title">
      <div ref={mediaRef} className="hero__media" aria-hidden="true">
        {useVideo ? (
          <video
            ref={videoRef}
            className="hero__video"
            autoPlay
            muted
            loop
            playsInline
            preload={lightPreload ? 'metadata' : 'auto'}
            poster={HERO_POSTER_SRC}
            tabIndex={-1}
            onPlay={() => {
              if (!inViewRef.current) videoRef.current?.pause();
            }}
            onError={() => {
              // ignore the error event our own teardown (removeAttribute + load) raises
              if (videoRef.current?.getAttribute('src')) setVideoFailed(true);
            }}
          />
        ) : (
          <img className="hero__poster" src={HERO_POSTER_SRC} alt="" />
        )}
      </div>
      <div className="hero__scrim" aria-hidden="true" />

      <div className="hero__inner">
        <p ref={eyebrowRef} className="hero__eyebrow font-tech">
          <span className="m-badge-stripes" aria-hidden="true">
            <span className="m-stripe-1" />
            <span className="m-stripe-2" />
            <span className="m-stripe-3" />
          </span>
          BMW M • The essence of motorsport
        </p>

        <h1 ref={titleRef} id="hero-title" className="hero__title font-display" tabIndex={-1}>
          <span>Built for the</span>{' '}
          <span>unforgiving.</span>
        </h1>

        <p ref={ledeRef} className="hero__lede">
          Five M cars from {POWER_MIN.value} to {POWER_MAX.value} horsepower. Pick one and see what it was built for.
        </p>

        <div ref={actionsRef} className="hero__actions">
          <a ref={ctaRef} href="/#lineup" id="hero-explore-cta" className="hero__cta font-tech" onClick={onCtaClick}>
            <span>Explore the lineup</span>
            <ArrowDown size={16} aria-hidden="true" />
          </a>
        </div>

        <div ref={barRef} className="hero__bar">
          <span ref={ruleRef} className="hero__rule" aria-hidden="true" />
          <div className="hero__cue font-tech" aria-hidden="true">
            <span>Scroll</span>
            <span className="hero__cue-track">
              <span ref={cueBarRef} className="hero__cue-bar" />
            </span>
          </div>
          <dl className="hero__telemetry font-tech">
            {TELEMETRY.map((t) => (
              <div key={t.label} className="hero__stat">
                <dt>
                  {t.label}
                  <small>{t.models}</small>
                </dt>
                <dd>
                  <span
                    className="hero__num font-display"
                    data-count
                    data-value={t.value}
                    data-decimals={t.decimals}
                  >
                    {fmt(t.value, t.decimals)}
                  </span>
                  <span className="hero__unit">{t.unit}</span>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
};
