import React, { useRef, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { BMW_MODELS, BMWModel } from '../data/models';
import { ChevronDown, ArrowLeft, ArrowRight, Gauge, Zap, Compass, Shield } from 'lucide-react';

gsap.registerPlugin(useGSAP, ScrollTrigger);

export const ModelPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const pageContainerRef = useRef<HTMLDivElement>(null);

  // Model identification & fallback
  const model: BMWModel | undefined = BMW_MODELS.find(
    (m) => m.id.toLowerCase() === (id || '').toLowerCase()
  );

  // Other models for "EXPLORE ANOTHER M"
  const otherModels = BMW_MODELS.filter((m) => m.id !== (model?.id || ''));

  // Always reset scroll to top on model change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  // Handle invalid model ID
  if (!model) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'var(--bg-primary)',
          color: 'var(--text-heading)',
          padding: '2rem',
        }}
      >
        <h1 className="font-display" style={{ fontSize: '3rem', marginBottom: '1rem' }}>
          MODEL NOT FOUND
        </h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
          Please choose from our five featured models: M2, M3, M4, M5, or M8.
        </p>
        <Link to="/" className="btn-m-primary">
          RETURN TO LINEUP
        </Link>
      </div>
    );
  }

  // Coordinated GSAP Scroll Animations for 5-Stage Progressive Storytelling
  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      // Reduced motion: every stage's finished state is set immediately, with no
      // entrance tweens, no stagger, and — most importantly — no Stage 2 parallax
      // scrub (continuous scroll-linked movement is the main vestibular trigger).
      mm.add('(prefers-reduced-motion: reduce)', () => {
        gsap.set(['.model-hero-title', '.model-hero-tagline', '.model-hero-img', '.model-hero-indicator'], {
          opacity: 1,
          y: 0,
          scale: 1,
        });
        gsap.set('.statement-line', { opacity: 1, y: 0 });
        gsap.set('.spec-cell', { opacity: 1, y: 0 });
        gsap.set('.detail-img', { clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)', scale: 1 });
        gsap.set('.detail-text', { opacity: 1, x: 0 });
        gsap.set('.stage-final-content', { opacity: 1, y: 0 });
        ScrollTrigger.refresh();
      });

      mm.add('(prefers-reduced-motion: no-preference)', () => {
      // Stage 1 Entrance: Oversized Vehicle & Model Name
      const heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      heroTl
        .fromTo(
          '.model-hero-title',
          { opacity: 0, y: 70, scale: 0.95 },
          { opacity: 1, y: 0, scale: 1, duration: 1.1 }
        )
        .fromTo(
          '.model-hero-tagline',
          { opacity: 0, y: 25 },
          { opacity: 1, y: 0, duration: 0.8 },
          '-=0.7'
        )
        .fromTo(
          '.model-hero-img',
          { scale: 1.08, opacity: 0.7 },
          { scale: 1, opacity: 1, duration: 1.4 },
          0
        )
        .fromTo(
          '.model-hero-indicator',
          { opacity: 0, y: -10 },
          { opacity: 0.8, y: 0, duration: 0.6 },
          '-=0.4'
        );

      // Stage 2: Opening statement with parallax car translation
      gsap.to('.model-hero-img-wrap', {
        y: 180,
        scale: 1.05,
        opacity: 0.45,
        ease: 'none',
        scrollTrigger: {
          trigger: '.stage-statement',
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1,
        },
      });

      // Masked reveal for Statement lines
      gsap.fromTo(
        '.statement-line',
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.9,
          stagger: 0.15,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.stage-statement',
            start: 'top 70%',
            toggleActions: 'play none none none',
          },
        }
      );

      // Stage 3: Performance specifications staggered reveals
      gsap.fromTo(
        '.spec-cell',
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          stagger: 0.1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '.stage-specs',
            start: 'top 75%',
            toggleActions: 'play none none none',
          },
        }
      );

      // Stage 4: Design detail cards clipping masks & alternating reveals
      const detailItems = gsap.utils.toArray<HTMLElement>('.design-detail-item');
      detailItems.forEach((item, index) => {
        const img = item.querySelector('.detail-img');
        const text = item.querySelector('.detail-text');

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: item,
            start: 'top 75%',
            toggleActions: 'play none none none',
          },
        });

        tl.fromTo(
          img,
          {
            clipPath: index % 2 === 0
              ? 'polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)'
              : 'polygon(100% 0%, 100% 0%, 100% 100%, 100% 100%)',
            scale: 1.1,
          },
          {
            clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
            scale: 1,
            duration: 1.1,
            ease: 'power3.inOut',
          }
        ).fromTo(
          text,
          { opacity: 0, x: index % 2 === 0 ? 30 : -30 },
          { opacity: 1, x: 0, duration: 0.8, ease: 'power2.out' },
          '-=0.5'
        );
      });

      // Stage 5: Final composition entrance
      gsap.fromTo(
        '.stage-final-content',
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.stage-final',
            start: 'top 65%',
            toggleActions: 'play none none none',
          },
        }
      );

      // Refresh ScrollTrigger to ensure exact trigger coordinates
      ScrollTrigger.refresh();
      });
    },
    { dependencies: [id], scope: pageContainerRef, revertOnUpdate: true }
  );

  return (
    <div
      ref={pageContainerRef}
      style={{
        backgroundColor: 'var(--bg-primary)',
        color: 'var(--text-primary)',
        minHeight: '100vh',
        overflowX: 'hidden',
        position: 'relative',
      }}
      aria-label={`${model.name} Detail Experience`}
    >
      {/* Back button strip */}
      <div
        style={{
          position: 'fixed',
          top: 'clamp(68px, 10vw, 80px)',
          left: 'clamp(1rem, 6vw, 3.5rem)',
          zIndex: 80,
        }}
      >
        <button
          onClick={() => navigate('/#lineup')}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 14px',
            backgroundColor: 'rgba(var(--bg-primary-rgb), 0.75)',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(var(--overlay-rgb), 0.1)',
            borderRadius: '2px',
            fontSize: '0.75rem',
            color: 'var(--text-secondary)',
            letterSpacing: '0.12em',
            transition: 'all 0.3s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = 'var(--text-heading)';
            e.currentTarget.style.borderColor = 'var(--m-red)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = 'var(--text-secondary)';
            e.currentTarget.style.borderColor = 'rgba(var(--overlay-rgb), 0.1)';
          }}
          aria-label="Back to lineup"
        >
          <ArrowLeft size={14} />
          <span>BACK TO LINEUP</span>
        </button>
      </div>

      {/* =========================================================================
          STAGE 1: THE CAR REVEAL (HERO)
          ========================================================================= */}
      <section
        className="stage-hero"
        style={{
          position: 'relative',
          isolation: 'isolate',
          width: '100vw',
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          padding: '0 clamp(1.25rem, 6vw, 3.5rem) clamp(3rem, 10vw, 5rem)',
          overflow: 'hidden',
        }}
      >
        {/* Dominant Vehicle Background Image */}
        <div
          className="model-hero-img-wrap"
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 1,
            pointerEvents: 'none',
          }}
        >
          <img
            src={model.heroImage}
            alt={model.name}
            className="model-hero-img will-animate"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center 40%',
              filter: 'brightness(0.9) contrast(1.15)',
            }}
          />
          <div
            style={{
              position: 'absolute',
              inset: 0,
              // Dark-biased vignette (not the page background) so the white hero
              // title/tagline stay legible in light mode too — fading to the
              // light page bg instead washed the photo into a pale haze and
              // dropped the white text to near-zero contrast.
              background: 'linear-gradient(180deg, rgba(var(--vignette-rgb), 0.35) 0%, rgba(var(--vignette-rgb), 0.15) 35%, rgba(var(--vignette-rgb), 0.95) 100%)',
            }}
          />
        </div>

        {/* Hero Title & Identity */}
        <div style={{ position: 'relative', zIndex: 10, maxWidth: '1000px' }}>
          <div
            className="font-tech"
            style={{
              fontSize: '0.9rem',
              letterSpacing: '0.3em',
              color: 'var(--m-red)',
              textTransform: 'uppercase',
              marginBottom: '0.75rem',
              fontWeight: 700,
            }}
          >
            CHASSIS {model.chassisCode} • {model.descriptor}
          </div>

          <h1
            className="model-hero-title font-display will-animate"
            style={{
              fontSize: 'clamp(4rem, 11vw, 10rem)',
              fontWeight: 800,
              lineHeight: 0.9,
              letterSpacing: '-0.04em',
              // Constant white: sits directly on the hero photo (still dark/vivid
              // at this height, before the bottom gradient fully fades to bg), not
              // on the page background, so it shouldn't flip with the theme.
              color: '#ffffff',
              marginBottom: '1.25rem',
              textTransform: 'uppercase',
            }}
          >
            {model.name}
          </h1>

          <p
            className="model-hero-tagline will-animate"
            style={{
              fontSize: 'clamp(1.15rem, 2.2vw, 1.6rem)',
              color: '#c3c7cf',
              maxWidth: '650px',
              fontWeight: 400,
              lineHeight: 1.45,
            }}
          >
            {model.tagline}
          </p>
        </div>

        {/* Scroll Indicator */}
        <div
          className="model-hero-indicator will-animate"
          style={{
            position: 'absolute',
            bottom: '2rem',
            right: 'clamp(1.25rem, 6vw, 3.5rem)',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            color: '#c3c7cf',
            zIndex: 10,
          }}
        >
          <span className="font-tech" style={{ fontSize: '0.75rem', letterSpacing: '0.2em' }}>
            SCROLL TO EXPLORE
          </span>
          <ChevronDown size={16} />
        </div>
      </section>

      {/* =========================================================================
          STAGE 2: THE OPENING STATEMENT
          ========================================================================= */}
      <section
        className="stage-statement"
        style={{
          position: 'relative',
          padding: 'clamp(4rem, 10vw, 8rem) clamp(1.25rem, 6vw, 3.5rem)',
          maxWidth: '1200px',
          margin: '0 auto',
          zIndex: 10,
        }}
      >
        <div
          className="font-tech"
          style={{
            fontSize: '0.8rem',
            color: 'var(--m-red)',
            letterSpacing: '0.25em',
            marginBottom: '1.5rem',
            textTransform: 'uppercase',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
          }}
        >
          <div className="m-badge-stripes">
            <span className="m-stripe-1"></span>
            <span className="m-stripe-2"></span>
            <span className="m-stripe-3"></span>
          </div>
          <span>PHILOSOPHY OF PERFORMANCE</span>
        </div>

        {/* Large Editorial Statement */}
        <h2
          className="font-display"
          style={{
            fontSize: 'clamp(2.4rem, 5vw, 4.2rem)',
            fontWeight: 800,
            lineHeight: 1.15,
            letterSpacing: '-0.02em',
            color: 'var(--text-heading)',
            marginBottom: '3rem',
          }}
        >
          <span className="mask-reveal-wrap">
            <span className="statement-line" style={{ display: 'inline-block' }}>
              "{model.statement}"
            </span>
          </span>
        </h2>

        {/* Supporting Narrative & Quote */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '3rem',
            borderTop: '1px solid rgba(var(--overlay-rgb), 0.1)',
            paddingTop: '2.5rem',
          }}
        >
          <div>
            <p
              style={{
                fontSize: '1.15rem',
                color: 'var(--text-secondary)',
                lineHeight: 1.7,
                marginBottom: '1.5rem',
              }}
            >
              {model.narrative}
            </p>
          </div>
          <div
            style={{
              borderLeft: '2px solid var(--m-red)',
              paddingLeft: '1.75rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
            }}
          >
            <blockquote
              className="font-display"
              style={{
                fontSize: '1.35rem',
                fontWeight: 700,
                color: 'var(--text-heading)',
                fontStyle: 'italic',
                marginBottom: '0.75rem',
              }}
            >
              "{model.quote}"
            </blockquote>
            <cite className="font-tech" style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', letterSpacing: '0.12em' }}>
              BMW M MOTORSPORT ENGINEERING TEAM
            </cite>
          </div>
        </div>
      </section>

      {/* =========================================================================
          STAGE 3: VERIFIED PERFORMANCE SPECIFICATIONS
          ========================================================================= */}
      <section
        className="stage-specs"
        style={{
          position: 'relative',
          padding: 'clamp(3.5rem, 10vw, 6rem) clamp(1.25rem, 6vw, 3.5rem) clamp(4rem, 12vw, 8rem)',
          backgroundColor: 'var(--bg-surface)',
          borderTop: '1px solid rgba(var(--overlay-rgb), 0.05)',
          borderBottom: '1px solid rgba(var(--overlay-rgb), 0.05)',
          zIndex: 10,
        }}
      >
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-end',
              marginBottom: '3.5rem',
              flexWrap: 'wrap',
              gap: '1rem',
            }}
          >
            <div>
              <div
                className="font-tech"
                style={{
                  fontSize: '0.8rem',
                  color: 'var(--m-red)',
                  letterSpacing: '0.25em',
                  marginBottom: '0.5rem',
                }}
              >
                TELEMETRY & HARDWARE
              </div>
              <h2
                className="font-display"
                style={{
                  fontSize: 'clamp(2.2rem, 4vw, 3.5rem)',
                  fontWeight: 800,
                  letterSpacing: '-0.03em',
                  color: 'var(--text-heading)',
                }}
              >
                TECHNICAL SPECIFICATIONS
              </h2>
            </div>

            <div
              className="font-tech"
              style={{
                fontSize: '0.8rem',
                color: 'var(--text-secondary)',
                letterSpacing: '0.15em',
              }}
            >
              CERTIFIED TRACK BENCHMARK
            </div>
          </div>

          {/* Clean Typography Specification Grid */}
          <div className="specs-grid">
            <div className="spec-cell will-animate">
              <div className="spec-number">{model.specs.power}</div>
              <div className="spec-label">PEAK HORSEPOWER</div>
            </div>
            <div className="spec-cell will-animate">
              <div className="spec-number">{model.specs.acceleration}</div>
              <div className="spec-label">0–60 MPH ACCELERATION</div>
            </div>
            <div className="spec-cell will-animate">
              <div className="spec-number">{model.specs.torque}</div>
              <div className="spec-label">MAXIMUM TORQUE</div>
            </div>
            <div className="spec-cell will-animate">
              <div className="spec-number">{model.specs.topSpeed}</div>
              <div className="spec-label">TRACK TOP SPEED</div>
            </div>
            <div className="spec-cell will-animate">
              <div className="spec-number" style={{ fontSize: '1.8rem' }}>{model.specs.engine}</div>
              <div className="spec-label">POWERTRAIN ARCHITECTURE</div>
            </div>
            <div className="spec-cell will-animate">
              <div className="spec-number" style={{ fontSize: '1.8rem' }}>{model.specs.transmission}</div>
              <div className="spec-label">TRANSMISSION</div>
            </div>
            <div className="spec-cell will-animate">
              <div className="spec-number" style={{ fontSize: '1.8rem' }}>{model.specs.drivetrain}</div>
              <div className="spec-label">DRIVETRAIN CONFIGURATION</div>
            </div>
            <div className="spec-cell will-animate">
              <div className="spec-number" style={{ fontSize: '1.8rem' }}>{model.specs.weight}</div>
              <div className="spec-label">CURB WEIGHT</div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          STAGE 4: EXTERIOR AND DESIGN DETAILS
          ========================================================================= */}
      <section
        className="stage-details"
        style={{
          position: 'relative',
          padding: 'clamp(4rem, 10vw, 8rem) clamp(1.25rem, 6vw, 3.5rem)',
          maxWidth: '1400px',
          margin: '0 auto',
          zIndex: 10,
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '6rem' }}>
          <div
            className="font-tech"
            style={{
              fontSize: '0.8rem',
              color: 'var(--m-red)',
              letterSpacing: '0.25em',
              marginBottom: '0.5rem',
            }}
          >
            AERODYNAMICS & CRAFTSMANSHIP
          </div>
          <h2
            className="font-display"
            style={{
              fontSize: 'clamp(2.5rem, 5vw, 4.5rem)',
              fontWeight: 800,
              letterSpacing: '-0.03em',
              color: 'var(--text-heading)',
            }}
          >
            SCULPTED BY THE WIND TUNNEL
          </h2>
        </div>

        {/* Alternating Photographic Detail Sections with Clipping Masks */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8rem' }}>
          {model.details.map((detail, index) => {
            const isReversed = index % 2 === 1;
            return (
              <div
                key={detail.title}
                className="design-detail-item"
                style={{
                  display: 'grid',
                  gridTemplateColumns: isReversed ? '1fr 1.25fr' : '1.25fr 1fr',
                  gap: '4rem',
                  alignItems: 'center',
                }}
              >
                {/* Image Side */}
                <div
                  className="detail-img will-animate"
                  style={{
                    order: isReversed ? 2 : 1,
                    position: 'relative',
                    height: '520px',
                    borderRadius: '2px',
                    overflow: 'hidden',
                    border: '1px solid rgba(var(--overlay-rgb), 0.1)',
                  }}
                >
                  <img
                    src={detail.image}
                    alt={detail.title}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      filter: 'brightness(0.9) contrast(1.1)',
                    }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'linear-gradient(180deg, transparent 60%, rgba(var(--vignette-rgb), 0.7) 100%)',
                    }}
                  />
                </div>

                {/* Text Side */}
                <div
                  className="detail-text will-animate"
                  style={{
                    order: isReversed ? 1 : 2,
                    padding: '2rem',
                  }}
                >
                  <span
                    className="font-tech"
                    style={{
                      fontSize: '0.78rem',
                      letterSpacing: '0.2em',
                      color: 'var(--m-red)',
                      fontWeight: 700,
                    }}
                  >
                    0{index + 1} // {detail.subtitle}
                  </span>
                  <h3
                    className="font-display"
                    style={{
                      fontSize: 'clamp(2rem, 3.5vw, 3rem)',
                      fontWeight: 800,
                      letterSpacing: '-0.02em',
                      color: 'var(--text-heading)',
                      margin: '1rem 0 1.25rem',
                      lineHeight: 1.1,
                    }}
                  >
                    {detail.title}
                  </h3>
                  <p
                    style={{
                      fontSize: '1.1rem',
                      color: 'var(--text-secondary)',
                      lineHeight: 1.7,
                    }}
                  >
                    {detail.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* =========================================================================
          STAGE 5: FINAL CINEMATIC COMPOSITION & DUAL NAVIGATION
          ========================================================================= */}
      <section
        className="stage-final"
        style={{
          position: 'relative',
          width: '100vw',
          minHeight: '85vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 'clamp(3.5rem, 10vw, 6rem) clamp(1.25rem, 6vw, 3.5rem)',
          backgroundColor: 'var(--bg-primary)',
          overflow: 'hidden',
          borderTop: '1px solid rgba(var(--overlay-rgb), 0.08)',
          zIndex: 10,
        }}
      >
        {/* Background Overview Car Image */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            opacity: 0.25,
            pointerEvents: 'none',
          }}
        >
          <img
            src={model.overviewImage || model.heroImage}
            alt={model.name}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              filter: 'grayscale(60%) contrast(1.2)',
            }}
          />
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'radial-gradient(ellipse at center, transparent 30%, var(--bg-primary) 90%)',
            }}
          />
        </div>

        {/* Final Navigation Container */}
        <div
          className="stage-final-content will-animate"
          style={{
            position: 'relative',
            zIndex: 15,
            textAlign: 'center',
            maxWidth: '1000px',
          }}
        >
          <div className="m-badge-stripes" style={{ marginBottom: '1.5rem' }}>
            <span className="m-stripe-1"></span>
            <span className="m-stripe-2"></span>
            <span className="m-stripe-3"></span>
          </div>

          <div
            className="font-tech"
            style={{
              fontSize: '0.85rem',
              letterSpacing: '0.3em',
              color: 'var(--text-secondary)',
              textTransform: 'uppercase',
              marginBottom: '0.75rem',
            }}
          >
            THE CHAPTER CLOSES • THE THRILL ENDURES
          </div>

          <h2
            className="font-display"
            style={{
              fontSize: 'clamp(2.8rem, 6vw, 5.5rem)',
              fontWeight: 800,
              letterSpacing: '-0.03em',
              color: 'var(--text-heading)',
              lineHeight: 1,
              marginBottom: '2.5rem',
              textTransform: 'uppercase',
            }}
          >
            READY TO COMMAND THE {model.shortName}?
          </h2>

          {/* Dual Navigation Options: BACK TO LINEUP and EXPLORE ANOTHER M */}
          <div
            style={{
              display: 'flex',
              gap: '1.5rem',
              justifyContent: 'center',
              flexWrap: 'wrap',
              marginBottom: '3.5rem',
            }}
          >
            <button
              onClick={() => navigate('/#lineup')}
              className="btn-m-primary"
              id="model-back-lineup-btn"
            >
              <ArrowLeft size={16} />
              <span>BACK TO LINEUP</span>
            </button>

            <a
              href="#explore-others"
              onClick={(e) => {
                e.preventDefault();
                const el = document.getElementById('explore-others');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="btn-m-secondary"
              id="model-explore-another-btn"
            >
              <span>EXPLORE ANOTHER M</span>
              <ArrowRight size={16} />
            </a>
          </div>

          {/* Quick Lineup Switcher Row */}
          <div id="explore-others" style={{ paddingTop: '2rem' }}>
            <div
              className="font-tech"
              style={{
                fontSize: '0.75rem',
                color: 'var(--text-muted)',
                letterSpacing: '0.2em',
                marginBottom: '1.5rem',
                textTransform: 'uppercase',
              }}
            >
              SELECT ANOTHER FEATURED M MODEL
            </div>

            <div
              style={{
                display: 'flex',
                gap: '1rem',
                justifyContent: 'center',
                flexWrap: 'wrap',
              }}
            >
              {otherModels.map((other) => (
                <Link
                  key={other.id}
                  to={`/models/${other.id}`}
                  style={{
                    padding: '12px 20px',
                    backgroundColor: 'rgba(var(--overlay-rgb), 0.03)',
                    border: '1px solid rgba(var(--overlay-rgb), 0.08)',
                    borderRadius: '2px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '4px',
                    transition: 'all 0.3s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'var(--m-red)';
                    e.currentTarget.style.transform = 'translateY(-3px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(var(--overlay-rgb), 0.08)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  <span className="font-display" style={{ fontWeight: 800, color: 'var(--text-heading)' }}>
                    {other.name}
                  </span>
                  <span className="font-tech" style={{ fontSize: '0.65rem', color: 'var(--text-secondary)' }}>
                    {other.specs.power} • {other.specs.acceleration}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
