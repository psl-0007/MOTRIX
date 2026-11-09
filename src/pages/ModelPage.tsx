import React, { useEffect, useRef } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, ChevronDown } from 'lucide-react';
import { gsap, ScrollTrigger, SplitText, useGSAP, MQ } from '@/lib/gsap';
import { BMW_MODELS, IMAGERY_NOTE, type BMWModel } from '../data/models';
import '../styles/model.css';

/* -------------------------------------------------------------------------- */
/* helpers                                                                    */
/* -------------------------------------------------------------------------- */

const LINEUP_LINK = { pathname: '/', hash: '#lineup' } as const;

interface ParsedStat {
  value: number;
  decimals: number;
  unit: string;
  text: string;
}

/** '3.4 SEC' -> { value: 3.4, decimals: 1, unit: 'SEC', text: '3.4' } */
const parseStat = (raw: string): ParsedStat => {
  const m = raw.match(/^([\d.,]+)\s*(.*)$/);
  const text = m ? m[1] : raw;
  const clean = text.replace(/,/g, '');
  return {
    value: parseFloat(clean) || 0,
    decimals: (clean.split('.')[1] || '').length,
    unit: m ? m[2] : '',
    text,
  };
};

const formatStat = (value: number, decimals: number): string =>
  value.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });

/** Sets document.title (and the meta description) for the lifetime of a view, restoring on unmount. */
const useDocumentMeta = (title: string, description?: string) => {
  useEffect(() => {
    const prevTitle = document.title;
    document.title = title;

    let meta = document.head.querySelector<HTMLMetaElement>('meta[name="description"]');
    const hadMeta = !!meta;
    const prevDescription = meta?.getAttribute('content') ?? null;
    if (description) {
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute('name', 'description');
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', description);
    }

    return () => {
      document.title = prevTitle;
      if (description && meta) {
        if (!hadMeta) meta.remove();
        else if (prevDescription !== null) meta.setAttribute('content', prevDescription);
      }
    };
  }, [title, description]);
};

const StripeBadge: React.FC = () => (
  <span className="m-badge-stripes" aria-hidden="true">
    <span className="m-stripe-1"></span>
    <span className="m-stripe-2"></span>
    <span className="m-stripe-3"></span>
  </span>
);

/* -------------------------------------------------------------------------- */
/* route component: lookup + not-found branch (NO animation hooks here)       */
/* -------------------------------------------------------------------------- */

export const ModelPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const model = BMW_MODELS.find((m) => m.id.toLowerCase() === (id || '').toLowerCase());

  return model ? <ModelExperience key={model.id} model={model} /> : <ModelNotFound />;
};

const ModelNotFound: React.FC = () => {
  useDocumentMeta('404 — BMW M', 'This BMW M model page does not exist. Choose one of the five featured models.');

  return (
    <div className="mp-404">
      <div className="mp-404-inner">
        <h1>Model not found</h1>
        <p>
          We couldn&rsquo;t find that model. Choose one of the five featured BMW M models below, or head back to the
          home page.
        </p>
        <ul>
          {BMW_MODELS.map((m) => (
            <li key={m.id}>
              <Link to={`/models/${m.id}`}>
                {m.shortName}
                <span>{m.descriptor}</span>
              </Link>
            </li>
          ))}
        </ul>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.9rem' }}>
          <Link to={LINEUP_LINK} className="btn-m-primary">
            <ArrowLeft size={16} aria-hidden="true" />
            <span>Back to lineup</span>
          </Link>
          <Link to="/" className="btn-m-secondary">
            <span>Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* the experience: five stages, all hooks run unconditionally                 */
/* -------------------------------------------------------------------------- */

const ModelExperience: React.FC<{ model: BMWModel }> = ({ model }) => {
  const rootRef = useRef<HTMLDivElement>(null);

  const idx = BMW_MODELS.findIndex((m) => m.id === model.id);
  const prev = BMW_MODELS[(idx - 1 + BMW_MODELS.length) % BMW_MODELS.length];
  const next = BMW_MODELS[(idx + 1) % BMW_MODELS.length];
  const others = BMW_MODELS.filter((m) => m.id !== model.id);

  useDocumentMeta(
    `${model.name} (${model.chassisCode}) — ${model.tagline.split('.')[0]} | BMW M`,
    `${model.name}: ${model.tagline} ${model.specs.power}, ${model.specs.acceleration} 0–60 mph (manufacturer figures).`
  );

  const power = parseStat(model.specs.power);
  const accel = parseStat(model.specs.acceleration);
  const torque = parseStat(model.specs.torque);
  const top = parseStat(model.specs.topSpeed);

  const stats = [
    { key: 'power', label: model.id === 'm5' ? 'System output' : 'Power', raw: model.specs.power, p: power },
    { key: 'accel', label: '0–60 mph', raw: model.specs.acceleration, p: accel },
    { key: 'torque', label: 'Torque', raw: model.specs.torque, p: torque },
    { key: 'top', label: 'Top speed (limited)', raw: model.specs.topSpeed, p: top },
  ];

  const table: [string, string][] = [
    ['Engine', model.specs.engine],
    ['Transmission', model.specs.transmission],
    ['Drivetrain', model.specs.drivetrain],
    ['Curb weight', model.specs.weight],
  ];

  useGSAP(
    (_ctx, contextSafe) => {
      const root = rootRef.current;
      if (!root) return;
      const $ = <T extends Element = HTMLElement>(sel: string) => root.querySelector<T>(sel);
      const $$ = <T extends Element = HTMLElement>(sel: string) => gsap.utils.toArray<T>(sel, root);

      let dead = false;
      const mm = gsap.matchMedia();

      // Reduced motion: nothing is hidden or moved, every stage simply shows its final state
      // (numbers are already final in the DOM, the progress bar stays at rest).
      // Full motion is built below; `desktop` additionally enables the scrubbed parallax.
      mm.add({ ok: MQ.motionOK, desktop: MQ.desktop }, (ctx, safe) => {
        const { ok, desktop } = (ctx.conditions || {}) as { ok?: boolean; desktop?: boolean };
        if (!ok) return;
        const run = safe ?? contextSafe!;
        // ScrollTrigger.batch callbacks fire after setup, so tween creation inside them goes through contextSafe
        const batchIn = (fn: (batch: Element[]) => void) => run(fn) as unknown as (batch: Element[]) => void;

        const hero = $('.mp-hero');
        const media = $('.mp-hero-media');
        const heroBody = $('.mp-hero-body');
        const title = $('.mp-hero-title');

        /* ---- page progress (fixed element, scrubbed scaleX) ---- */
        gsap.to('.mp-progress', {
          scaleX: 1,
          ease: 'none',
          scrollTrigger: { trigger: root, start: 'top top', end: 'bottom bottom', scrub: 0.3 },
        });

        /* ---- Stage 1: hero entrance ---- */
        if (title) {
          SplitText.create(title, {
            type: 'words,chars',
            mask: 'chars',
            aria: 'auto',
            autoSplit: true,
            onSplit(self) {
              return gsap.from(self.chars, {
                yPercent: 112,
                duration: 1.1,
                ease: 'expo.out',
                stagger: 0.05,
                delay: 0.1,
              });
            },
          });
        }
        gsap.from(['.mp-hero-eyebrow', '.mp-hero-tagline', '.mp-chip', '.mp-hero-foot'].flatMap((s) => $$(s)), {
          autoAlpha: 0,
          y: 24,
          duration: 0.9,
          ease: 'power3.out',
          stagger: 0.09,
          delay: 0.45,
        });
        gsap.from('.mp-hero-media img', { scale: 1.1, duration: 1.8, ease: 'expo.out' });

        /* ---- Stage 1: scrubbed parallax (desktop only) ---- */
        if (desktop && hero && media && heroBody) {
          gsap.to(media, {
            yPercent: 8,
            ease: 'none',
            scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true },
          });
          gsap.to(heroBody, {
            yPercent: -14,
            ease: 'none',
            scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true },
          });
        }

        /* ---- Stage 2: word-by-word scrubbed reveal ---- */
        const statement = $('.mp-statement');
        if (statement) {
          SplitText.create(statement, {
            type: 'words',
            aria: 'auto',
            autoSplit: true,
            onSplit(self) {
              return gsap.fromTo(
                self.words,
                { opacity: 0.16 },
                {
                  opacity: 1,
                  ease: 'none',
                  stagger: 0.12,
                  scrollTrigger: { trigger: statement, start: 'top 82%', end: 'bottom 55%', scrub: true },
                }
              );
            },
          });
        }
        gsap.from(['.mp-story > p', '.mp-quote'].flatMap((s) => $$(s)), {
          autoAlpha: 0,
          y: 30,
          duration: 0.9,
          ease: 'power3.out',
          stagger: 0.12,
          scrollTrigger: { trigger: '.mp-story', start: 'top 85%', once: true },
        });

        /* ---- Stage 3: bento stats count up, ruled table fades in ---- */
        const tiles = $$('.mp-stat');
        gsap.set(tiles, { autoAlpha: 0, y: 40 });
        ScrollTrigger.batch(tiles, {
          start: 'top 90%',
          once: true,
          onEnter: batchIn((batch) => {
            gsap.to(batch, { autoAlpha: 1, y: 0, duration: 0.9, ease: 'power3.out', stagger: 0.1 });
          }),
        });
        tiles.forEach((tile) => {
          const num = tile.querySelector<HTMLElement>('.mp-num');
          if (!num) return;
          const value = parseFloat(num.dataset.value || '0');
          const decimals = parseInt(num.dataset.decimals || '0', 10);
          const proxy = { v: 0 };
          num.textContent = formatStat(0, decimals);
          gsap.to(proxy, {
            v: value,
            duration: 1.8,
            ease: 'power3.out',
            snap: { v: decimals ? Math.pow(10, -decimals) : 1 },
            onUpdate: () => {
              num.textContent = formatStat(proxy.v, decimals);
            },
            onComplete: () => {
              num.textContent = formatStat(value, decimals);
            },
            scrollTrigger: { trigger: tile, start: 'top 90%', once: true },
          });
        });
        const rows = $$('.mp-row');
        gsap.set(rows, { autoAlpha: 0, y: 20 });
        ScrollTrigger.batch(rows, {
          start: 'top 92%',
          once: true,
          onEnter: batchIn((batch) => {
            gsap.to(batch, { autoAlpha: 1, y: 0, duration: 0.7, ease: 'power3.out', stagger: 0.08 });
          }),
        });

        /* ---- Stage 4: shutter reveals + inner parallax ---- */
        $$('.mp-detail').forEach((item, i) => {
          const frame = item.querySelector<HTMLElement>('.mp-frame');
          const img = item.querySelector<HTMLElement>('.mp-frame img');
          const par = item.querySelector<HTMLElement>('.mp-parallax');
          const ticks = item.querySelector<HTMLElement>('.mp-ticks');
          const caption = item.querySelector<HTMLElement>('figcaption');
          const textBits = Array.from(item.querySelectorAll<HTMLElement>('.mp-detail-kicker, .mp-detail-title, .mp-detail-text p'));
          const ghost = item.querySelector<HTMLElement>('.mp-ghost');

          if (frame && img) {
            const fromLeft = i % 2 === 0;
            gsap.fromTo(
              frame,
              { clipPath: fromLeft ? 'inset(0% 100% 0% 0%)' : 'inset(0% 0% 0% 100%)' },
              {
                clipPath: 'inset(0% 0% 0% 0%)',
                duration: 1.2,
                ease: 'power3.inOut',
                clearProps: 'clipPath',
                scrollTrigger: { trigger: item, start: 'top 78%', once: true },
              }
            );
            gsap.fromTo(
              img,
              { scale: 1.14 },
              { scale: 1, duration: 1.8, ease: 'expo.out', scrollTrigger: { trigger: item, start: 'top 78%', once: true } }
            );
          }
          if (ticks) {
            gsap.from(ticks, {
              autoAlpha: 0,
              duration: 0.6,
              delay: 0.6,
              ease: 'power2.out',
              scrollTrigger: { trigger: item, start: 'top 78%', once: true },
            });
          }
          if (caption) {
            gsap.from(caption, {
              autoAlpha: 0,
              duration: 0.6,
              delay: 0.8,
              scrollTrigger: { trigger: item, start: 'top 78%', once: true },
            });
          }
          if (desktop && frame && par) {
            gsap.fromTo(
              par,
              { yPercent: -7 },
              {
                yPercent: 7,
                ease: 'none',
                scrollTrigger: { trigger: frame, start: 'top bottom', end: 'bottom top', scrub: true },
              }
            );
          }
          gsap.from(textBits, {
            autoAlpha: 0,
            y: 30,
            duration: 0.9,
            ease: 'power3.out',
            stagger: 0.1,
            delay: 0.3,
            scrollTrigger: { trigger: item, start: 'top 75%', once: true },
          });
          if (ghost) {
            gsap.from(ghost, {
              autoAlpha: 0,
              x: fromRight(i) ? 40 : -40,
              duration: 1.2,
              ease: 'power3.out',
              scrollTrigger: { trigger: item, start: 'top 75%', once: true },
            });
          }
        });

        /* ---- Stage 5: closing ---- */
        const finalTitle = $('.mp-final-title');
        if (finalTitle) {
          SplitText.create(finalTitle, {
            type: 'lines',
            mask: 'lines',
            aria: 'auto',
            autoSplit: true,
            onSplit(self) {
              return gsap.from(self.lines, {
                yPercent: 110,
                duration: 1,
                ease: 'expo.out',
                stagger: 0.1,
                scrollTrigger: { trigger: finalTitle, start: 'top 85%', once: true },
              });
            },
          });
        }
        gsap.from('.mp-cta a', {
          autoAlpha: 0,
          y: 24,
          duration: 0.8,
          ease: 'power3.out',
          stagger: 0.1,
          scrollTrigger: { trigger: '.mp-cta', start: 'top 92%', once: true },
        });
        const cards = $$('.mp-card');
        gsap.set(cards, { autoAlpha: 0, y: 40 });
        ScrollTrigger.batch(cards, {
          start: 'top 92%',
          once: true,
          onEnter: batchIn((batch) => {
            gsap.to(batch, { autoAlpha: 1, y: 0, duration: 0.8, ease: 'power3.out', stagger: 0.1 });
          }),
        });
        gsap.from('.mp-pn a', {
          autoAlpha: 0,
          y: 20,
          duration: 0.7,
          ease: 'power3.out',
          stagger: 0.1,
          scrollTrigger: { trigger: '.mp-pn', start: 'top 95%', once: true },
        });
      });

      // positions shift once the web fonts and the hero photo have settled
      const refresh = () => {
        if (!dead) ScrollTrigger.refresh();
      };
      document.fonts?.ready.then(refresh);
      const heroImg = root.querySelector<HTMLImageElement>('.mp-hero-media img');
      heroImg?.decode().then(refresh, () => undefined);

      return () => {
        dead = true;
        mm.revert();
      };
    },
    { scope: rootRef, dependencies: [model.id], revertOnUpdate: true }
  );

  return (
    <div className="mp" ref={rootRef} data-model={model.id}>
      <div className="mp-progress" aria-hidden="true" />

      {/* ============ STAGE 1 — HERO ============ */}
      <section className="mp-hero" aria-labelledby="mp-title">
        <div className="mp-hero-media">
          <img src={model.heroImage} alt={model.heroAlt} fetchPriority="high" decoding="async" />
        </div>
        <div className="mp-hero-scrim" aria-hidden="true" />

        <Link to={LINEUP_LINK} className="mp-crumb">
          <ArrowLeft size={14} aria-hidden="true" />
          <span>Back to lineup</span>
        </Link>

        <div className="mp-hero-body">
          <span className="mp-hero-eyebrow">
            {model.chassisCode} &middot; {model.descriptor}
          </span>
          <h1 id="mp-title" className="mp-hero-title">
            {model.name}
          </h1>
          <p className="mp-hero-tagline">{model.tagline}</p>
          <ul className="mp-chips" aria-label="Headline manufacturer figures">
            <li className="mp-chip">
              <b>{power.text}</b> {power.unit}
            </li>
            <li className="mp-chip">
              <b>{accel.text}</b> {accel.unit} 0&ndash;60
            </li>
            <li className="mp-chip">
              <b>{torque.text}</b> {torque.unit}
            </li>
          </ul>
        </div>

        <div className="mp-hero-foot">
          <p className="mp-hero-caption">{model.heroCaption}</p>
          <span className="mp-cue" aria-hidden="true">
            <i />
            Scroll <ChevronDown size={14} />
          </span>
        </div>
      </section>

      {/* ============ STAGE 2 — STATEMENT ============ */}
      <section className="mp-statement-sec" aria-labelledby="mp-philosophy">
        <div className="mp-container">
          <h2 id="mp-philosophy" className="mp-eyebrow">
            <StripeBadge />
            <span>02 &mdash; Philosophy</span>
          </h2>
          <p className="mp-statement">{model.statement}</p>
          <div className="mp-story">
            <p>{model.narrative}</p>
            <figure className="mp-quote">
              <p>{model.quote}</p>
              <figcaption>Editorial line</figcaption>
            </figure>
          </div>
        </div>
      </section>

      {/* ============ STAGE 3 — SPECS ============ */}
      <section className="mp-specs" aria-labelledby="mp-specs-title">
        <div className="mp-container">
          <p className="mp-eyebrow">
            <StripeBadge />
            <span>03 &mdash; Manufacturer figures</span>
          </p>
          <h2 id="mp-specs-title" className="mp-h2">
            Specifications
          </h2>

          <div className="mp-bento">
            {stats.map((s) => (
              <div className="mp-stat" key={s.key}>
                <span className="mp-sr">
                  {s.label}: {s.raw}
                </span>
                <div className="mp-stat-value" aria-hidden="true">
                  <span className="mp-num" data-value={s.p.value} data-decimals={s.p.decimals}>
                    {s.p.text}
                  </span>
                  <span className="mp-unit">{s.p.unit}</span>
                </div>
                <div className="mp-stat-label" aria-hidden="true">
                  {s.label}
                </div>
              </div>
            ))}
          </div>

          <dl className="mp-table">
            {table.map(([k, v]) => (
              <div className="mp-row" key={k}>
                <dt>{k}</dt>
                <dd>{v}</dd>
              </div>
            ))}
          </dl>
          <p className="mp-note">{model.specsNote}</p>
        </div>
      </section>

      {/* ============ STAGE 4 — DETAILS ============ */}
      <section className="mp-details" aria-labelledby="mp-details-title">
        <div className="mp-container">
          <p className="mp-eyebrow">
            <StripeBadge />
            <span>04 &mdash; Design &amp; engineering</span>
          </p>
          <h2 id="mp-details-title" className="mp-h2">
            Details that define the {model.shortName}
          </h2>

          <ol className="mp-detail-list">
            {model.details.map((detail, i) => (
              <li className="mp-detail" key={detail.title}>
                <figure className="mp-detail-media">
                  <div className="mp-ticks">
                    <div className="mp-frame">
                      <div className="mp-parallax">
                        <img src={detail.image} alt={detail.alt} loading="lazy" decoding="async" />
                      </div>
                    </div>
                  </div>
                  <figcaption>{detail.caption}</figcaption>
                </figure>
                <div className="mp-detail-text">
                  <span className="mp-ghost" aria-hidden="true">
                    0{i + 1}
                  </span>
                  <span className="mp-detail-kicker">
                    0{i + 1} / {detail.subtitle}
                  </span>
                  <h3 className="mp-detail-title">{detail.title}</h3>
                  <p>{detail.description}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ============ STAGE 5 — CLOSING ============ */}
      <section className="mp-final" aria-labelledby="mp-final-title">
        <div className="mp-final-bg" aria-hidden="true">
          <img src={model.overviewImage || model.heroImage} alt="" loading="lazy" decoding="async" />
        </div>
        <div className="mp-container">
          <p className="mp-eyebrow">
            <StripeBadge />
            <span>05 &mdash; Next</span>
          </p>
          <h2 id="mp-final-title" className="mp-final-title">
            Ready to command the {model.shortName}?
          </h2>
          <div className="mp-cta">
            <Link to={LINEUP_LINK} className="btn-m-primary">
              <ArrowLeft size={16} aria-hidden="true" />
              <span>Back to lineup</span>
            </Link>
            <Link to={`/models/${next.id}`} className="btn-m-secondary">
              <span>Next model: {next.shortName}</span>
              <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </div>

          <h3 className="mp-others-label">Explore another M</h3>
          <ul className="mp-cards">
            {others.map((o) => (
              <li key={o.id}>
                <Link to={`/models/${o.id}`} className="mp-card">
                  <span className="mp-card-img">
                    <img src={o.heroImage} alt="" loading="lazy" decoding="async" />
                  </span>
                  <span className="mp-card-body">
                    <span className="mp-card-name">{o.name}</span>
                    <span className="mp-card-meta">
                      {o.specs.power} &middot; {o.specs.acceleration}
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>

          <nav className="mp-pn" aria-label="Model navigation">
            <Link to={`/models/${prev.id}`} rel="prev">
              <small>Previous</small>
              <strong>{prev.name}</strong>
            </Link>
            <Link to={`/models/${next.id}`} rel="next">
              <small>Next</small>
              <strong>{next.name}</strong>
            </Link>
          </nav>

          <p className="mp-disclaimer">{IMAGERY_NOTE}</p>
        </div>
      </section>
    </div>
  );
};

/** Odd detail rows (1st, 3rd) have the image on the left, so the ghost numeral enters from the right. */
function fromRight(i: number): boolean {
  return i % 2 === 0;
}
