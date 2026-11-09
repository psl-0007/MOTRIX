import React, { useMemo, useRef } from 'react';
import { Feather, Gauge, Route } from 'lucide-react';
import { gsap, ScrollTrigger, SplitText, useGSAP, MQ } from '@/lib/gsap';
import { BMW_MODELS } from '@/data/models';
import '@/styles/home.css';

const num = (s: string) => parseFloat(s.replace(/[^0-9.]/g, ''));

interface Stat {
  key: string;
  label: string;
  value: number;
  decimals: number;
  unit: string;
  note: string;
}

/** Lineup-wide figures, computed from the model data (never hard-coded). */
function useLineupStats(): Stat[] {
  return useMemo(() => {
    const top = (pick: (m: (typeof BMW_MODELS)[number]) => number, dir: 1 | -1) =>
      BMW_MODELS.reduce((best, m) => (pick(m) * dir > pick(best) * dir ? m : best), BMW_MODELS[0]);
    const power = top((m) => num(m.specs.power), 1);
    const accel = top((m) => num(m.specs.acceleration), -1);
    const speed = top((m) => num(m.specs.topSpeed), 1);
    return [
      { key: 'models', label: 'Models', value: BMW_MODELS.length, decimals: 0, unit: '', note: BMW_MODELS.map((m) => m.shortName).join(' · ') },
      { key: 'power', label: 'Peak power', value: num(power.specs.power), decimals: 0, unit: 'HP', note: `${power.shortName}, lineup high` },
      { key: 'accel', label: 'Quickest 0–60', value: num(accel.specs.acceleration), decimals: 1, unit: 'SEC', note: `${accel.shortName}, lineup best` },
      { key: 'speed', label: 'Top speed', value: num(speed.specs.topSpeed), decimals: 0, unit: 'MPH', note: `${speed.shortName}, lineup high` },
    ];
  }, []);
}

const PILLARS = [
  {
    n: '01',
    Icon: Gauge,
    tone: 'blue',
    title: 'TwinPower & M Hybrid',
    copy: 'High-revving inline-six and twin-turbocharged V8 engines, paired with instant hybrid response on the M5, deliver sharp throttle modulation and relentless top-end power.',
  },
  {
    n: '02',
    Icon: Feather,
    tone: 'silver',
    title: 'Intelligent Lightweight Design',
    copy: 'Carbon fibre reinforced plastic (CFRP) on roofs, chassis bracing and optional bucket seats lowers the centre of gravity and raises torsional rigidity.',
  },
  {
    n: '03',
    Icon: Route,
    tone: 'red',
    title: 'Adaptive M Dynamics',
    copy: 'Rear-biased M xDrive with active electronic differentials and a 2WD drift mode puts control of lateral slip angle in the driver’s hands.',
  },
] as const;

const fmt = (v: number, d: number) => v.toFixed(d);

export const PhilosophySection: React.FC = () => {
  const root = useRef<HTMLElement>(null);
  const stats = useLineupStats();

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(MQ.motionOK, () => {
        // (a) Headline: line-masked rise, then words brighten as you scroll through it.
        let rise: gsap.core.Tween | undefined;
        SplitText.create('.philo__title', {
          type: 'lines,words',
          mask: 'lines',
          autoSplit: true,
          aria: 'auto',
          onSplit(self) {
            rise = gsap.fromTo(
              self.words,
              { yPercent: 105 },
              {
                yPercent: 0,
                ease: 'none',
                stagger: 0.08,
                scrollTrigger: { trigger: '.philo__title', start: 'top 92%', end: 'top 62%', scrub: 0.6, refreshPriority: -1 },
              },
            );
            const light = gsap.fromTo(
              self.words,
              { opacity: 0.16 },
              {
                opacity: 1,
                ease: 'none',
                stagger: 0.12,
                scrollTrigger: { trigger: '.philo__title', start: 'top 72%', end: 'bottom 38%', scrub: 0.6, refreshPriority: -1 },
              },
            );
            return light;
          },
          onRevert() {
            // `rise` is the second tween of this split; SplitText only tracks the returned one.
            rise?.scrollTrigger?.kill();
            rise?.kill();
          },
        });

        // (b) Lede + stats strip + pillars: batched, staggered reveal.
        const reveal = gsap.utils.toArray<HTMLElement>('.philo__lede, .philo__stat, .philo__pillar');
        gsap.set(reveal, { autoAlpha: 0, y: 36 });
        ScrollTrigger.batch(reveal, {
          start: 'top 90%',
          once: true,
          interval: 0.1,
          batchMax: 4,
          onEnter: (batch) =>
            gsap.to(batch, { autoAlpha: 1, y: 0, duration: 0.9, ease: 'power3.out', stagger: 0.1, overwrite: true }),
        });

        // (c) Count-up for the "by the numbers" strip.
        gsap.utils.toArray<HTMLElement>('.philo__stat-value').forEach((el) => {
          const target = Number(el.dataset.value);
          const decimals = Number(el.dataset.decimals);
          const out = el.querySelector<HTMLElement>('.philo__stat-num');
          if (!out || Number.isNaN(target)) return;
          const counter = { v: 0 };
          out.textContent = fmt(0, decimals);
          ScrollTrigger.create({
            trigger: el,
            start: 'top 92%',
            once: true,
            refreshPriority: -1,
            onEnter: () =>
              gsap.to(counter, {
                v: target,
                duration: 1.6,
                ease: 'power3.out',
                snap: { v: decimals ? 0.1 : 1 },
                onUpdate: () => (out.textContent = fmt(counter.v, decimals)),
                onComplete: () => (out.textContent = fmt(target, decimals)),
              }),
          });
        });

        // (d) Ghost numerals drift slower than the pillars (desktop only).
        if (window.matchMedia(MQ.desktop).matches) {
          gsap.utils.toArray<HTMLElement>('.philo__ghost').forEach((el) => {
            gsap.fromTo(
              el,
              { yPercent: 12 },
              {
                yPercent: -12,
                ease: 'none',
                scrollTrigger: { trigger: el.closest('.philo__pillar'), start: 'top bottom', end: 'bottom top', scrub: 0.6, refreshPriority: -1 },
              },
            );
          });
        }
      });

      // Reduced motion: no branch registered, everything stays in its final, readable resting state.
    },
    { scope: root },
  );

  return (
    <section id="philosophy" ref={root} className="philo" aria-labelledby="philosophy-title">
      <div className="philo__inner">
        <header className="philo__head">
          <p className="philo__eyebrow font-tech">
            <span className="m-badge-stripes" aria-hidden="true">
              <span className="m-stripe-1" />
              <span className="m-stripe-2" />
              <span className="m-stripe-3" />
            </span>
            <span>02 — Motorsport DNA</span>
          </p>
          <h2 id="philosophy-title" className="philo__title font-display">
            <span className="philo__line">Five machines.</span>{' '}
            <span className="philo__line">One uncompromising code.</span>
          </h2>
          <p className="philo__lede">
            Born on the racetrack and refined through decades of touring car and endurance racing, every BMW M car carries
            that motorsport engineering into daily driving.
          </p>
        </header>

        <dl className="philo__stats" aria-label="The lineup by the numbers">
          {stats.map((s) => (
            <div key={s.key} className="philo__stat">
              <dt className="philo__stat-label font-tech">{s.label}</dt>
              <dd className="philo__stat-value font-display" data-value={s.value} data-decimals={s.decimals}>
                <span className="philo__stat-num">{fmt(s.value, s.decimals)}</span>
                {s.unit && <span className="philo__stat-unit font-tech">{s.unit}</span>}
              </dd>
              <dd className="philo__stat-note font-tech">{s.note}</dd>
            </div>
          ))}
        </dl>

        <ol className="philo__pillars" aria-label="Three engineering principles">
          {PILLARS.map(({ n, Icon, tone, title, copy }) => (
            <li key={n} className={`philo__pillar philo__pillar--${tone}`}>
              <span className="philo__ghost font-display" aria-hidden="true">
                {n}
              </span>
              <Icon className="philo__icon" size={28} strokeWidth={1.5} aria-hidden="true" focusable="false" />
              <h3 className="philo__pillar-title font-display">{title}</h3>
              <p className="philo__pillar-copy">{copy}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
};
