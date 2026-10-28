import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowDown, Flame } from 'lucide-react';

gsap.registerPlugin(useGSAP, ScrollTrigger);

export const HeroSection: React.FC = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const carImageRef = useRef<HTMLImageElement>(null);
  const carWrapperRef = useRef<HTMLDivElement>(null);
  const supportingTextRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      // Staggered word reveal for "BUILT FOR THE UNFORGIVING"
      const words = headlineRef.current?.querySelectorAll('.headline-word');
      if (words && words.length > 0) {
        gsap.fromTo(
          words,
          { y: 60, opacity: 0, rotateZ: 2 },
          {
            y: 0,
            opacity: 1,
            rotateZ: 0,
            duration: 1,
            stagger: 0.12,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: heroRef.current,
              start: 'top 60%',
              toggleActions: 'play none none none',
            },
          }
        );
      }

      // Parallax scroll coordination: headline vs vehicle at differential speeds
      gsap.to(carImageRef.current, {
        y: 120,
        scale: 1.05,
        ease: 'none',
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 1.2,
        },
      });

      gsap.to(headlineRef.current, {
        y: -70,
        opacity: 0.2,
        ease: 'none',
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 1,
        },
      });

      // Supporting elements reveal
      gsap.fromTo(
        [badgeRef.current, supportingTextRef.current, ctaRef.current],
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          stagger: 0.15,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: heroRef.current,
            start: 'top 50%',
            toggleActions: 'play none none none',
          },
        }
      );
    },
    { scope: heroRef }
  );

  const scrollToLineup = () => {
    const el = document.getElementById('lineup');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      ref={heroRef}
      id="hero"
      style={{
        position: 'relative',
        isolation: 'isolate',
        minHeight: '100vh',
        backgroundColor: '#050505',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: 'clamp(5.5rem, 16vw, 6rem) clamp(1.25rem, 6vw, 3.5rem) clamp(2rem, 6vw, 4rem)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
      }}
      aria-label="BMW M Series Hero"
    >
      {/* Background Vehicle Image with Parallax & Dramatic Studio Shadow */}
      <div
        ref={carWrapperRef}
        className="hero-car-wrap"
        style={{
          position: 'absolute',
          right: '-5%',
          top: '15%',
          width: '72%',
          height: '75%',
          zIndex: 1,
          pointerEvents: 'none',
        }}
      >
        <img
          ref={carImageRef}
          src="/images/models/m4-hero.jpg"
          alt="BMW M4 Competition Coupé"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            objectPosition: 'right center',
            filter: 'brightness(0.95) contrast(1.15) drop-shadow(0 30px 50px rgba(0,0,0,0.9))',
            willChange: 'transform',
          }}
        />
        {/* Soft studio spot highlight */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(ellipse at 70% 40%, rgba(255, 255, 255, 0.08) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />
      </div>

      {/* Content Container */}
      <div
        style={{
          position: 'relative',
          zIndex: 10,
          maxWidth: '850px',
        }}
      >
        {/* Small Upper Label */}
        <div
          ref={badgeRef}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '1.5rem',
          }}
        >
          <div className="m-badge-stripes">
            <span className="m-stripe-1"></span>
            <span className="m-stripe-2"></span>
            <span className="m-stripe-3"></span>
          </div>
          <span
            className="font-tech"
            style={{
              fontSize: '0.82rem',
              letterSpacing: '0.25em',
              color: '#8e97a4',
              textTransform: 'uppercase',
              fontWeight: 600,
            }}
          >
            BMW M SERIES • THE ESSENCE OF MOTORSPORT
          </span>
        </div>

        {/* Main Headline: BUILT FOR THE UNFORGIVING */}
        <h1
          ref={headlineRef}
          className="font-display hero-headline"
          style={{
            fontSize: 'clamp(3rem, 7.4vw, 6.8rem)',
            fontWeight: 900,
            lineHeight: 0.95,
            letterSpacing: '-0.03em',
            color: '#f5f5f7',
            marginBottom: '1.75rem',
            textTransform: 'uppercase',
          }}
        >
          <span className="mask-reveal-wrap">
            <span className="headline-word" style={{ display: 'inline-block', marginRight: '0.25em' }}>BUILT</span>
          </span>
          <span className="mask-reveal-wrap">
            <span className="headline-word" style={{ display: 'inline-block', marginRight: '0.25em' }}>FOR</span>
          </span>
          <br />
          <span className="mask-reveal-wrap">
            <span className="headline-word" style={{ display: 'inline-block', marginRight: '0.25em' }}>THE</span>
          </span>
          <span className="mask-reveal-wrap">
            <span
              className="headline-word"
              style={{
                display: 'inline-block',
                background: 'linear-gradient(90deg, #f5f5f7 0%, #e2001a 85%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              UNFORGIVING.
            </span>
          </span>
        </h1>

        {/* Supporting text */}
        <p
          ref={supportingTextRef}
          style={{
            fontSize: 'clamp(1.1rem, 2vw, 1.45rem)',
            color: '#8e95a5',
            fontWeight: 400,
            maxWidth: '560px',
            lineHeight: 1.5,
            marginBottom: '2.5rem',
          }}
        >
          Five machines. One uncompromising philosophy. Engineered without concession to dominate asphalt and ignite human emotion.
        </p>

        {/* Understated Call To Action */}
        <div
          ref={ctaRef}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1.5rem',
            flexWrap: 'wrap',
          }}
        >
          <button
            onClick={scrollToLineup}
            className="btn-m-primary"
            id="hero-explore-cta"
            aria-label="Explore the BMW M lineup"
          >
            <span>EXPLORE THE LINEUP</span>
            <ArrowDown size={15} />
          </button>

          <div
            className="font-tech"
            style={{
              fontSize: '0.8rem',
              color: '#555b6a',
              letterSpacing: '0.12em',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <Flame size={14} color="#e2001a" />
            <span>M2 • M3 • M4 • M5 • M8</span>
          </div>
        </div>
      </div>

      {/* Floating Specs Strip on the bottom left */}
      <div
        className="hero-stats-strip"
        style={{
          position: 'absolute',
          bottom: '2rem',
          left: 'clamp(1.25rem, 6vw, 3.5rem)',
          right: 'clamp(1.25rem, 6vw, 3.5rem)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          paddingTop: '1.5rem',
          zIndex: 10,
        }}
      >
        <div style={{ display: 'flex', gap: '3rem', flexWrap: 'wrap', rowGap: '1.25rem' }}>
          <div>
            <div className="font-display" style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fff' }}>523 HP</div>
            <div className="font-tech" style={{ fontSize: '0.7rem', color: '#8e95a5', letterSpacing: '0.12em' }}>M4 MAX POWER</div>
          </div>
          <div>
            <div className="font-display" style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fff' }}>3.0 SEC</div>
            <div className="font-tech" style={{ fontSize: '0.7rem', color: '#8e95a5', letterSpacing: '0.12em' }}>0–60 MPH (M8)</div>
          </div>
          <div>
            <div className="font-display" style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fff' }}>738 LB-FT</div>
            <div className="font-tech" style={{ fontSize: '0.7rem', color: '#8e95a5', letterSpacing: '0.12em' }}>M HYBRID TORQUE (M5)</div>
          </div>
        </div>

        <button
          onClick={scrollToLineup}
          className="font-tech"
          style={{
            fontSize: '0.75rem',
            letterSpacing: '0.2em',
            color: '#8e95a5',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <span>PROCEED TO GALLERY</span>
          <ArrowDown size={14} />
        </button>
      </div>
    </section>
  );
};
