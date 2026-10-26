import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ChevronDown } from 'lucide-react';

gsap.registerPlugin(useGSAP, ScrollTrigger);

export const IntroSequence: React.FC = () => {
  const introContainerRef = useRef<HTMLDivElement>(null);
  const letterBRef = useRef<HTMLSpanElement>(null);
  const letterMRef = useRef<HTMLSpanElement>(null);
  const letterWRef = useRef<HTMLSpanElement>(null);
  const carRevealRef = useRef<HTMLDivElement>(null);
  const lightSweepRef = useRef<HTMLDivElement>(null);
  const subtitleRef = useRef<HTMLDivElement>(null);
  const scrollPromptRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      // 1. Initial entrance timeline (on page load)
      const entranceTl = gsap.timeline({
        defaults: { ease: 'power3.out' },
      });

      entranceTl
        .fromTo(
          [letterBRef.current, letterMRef.current, letterWRef.current],
          { opacity: 0, scale: 0.9, y: 30 },
          { opacity: 1, scale: 1, y: 0, duration: 1.2, stagger: 0.15 }
        )
        .fromTo(
          lightSweepRef.current,
          { xPercent: -150, opacity: 0 },
          { xPercent: 200, opacity: 0.8, duration: 1.6, ease: 'power2.inOut' },
          '-=0.6'
        )
        .fromTo(
          subtitleRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.8 },
          '-=0.8'
        )
        .fromTo(
          scrollPromptRef.current,
          { opacity: 0 },
          { opacity: 0.7, duration: 0.6 },
          '-=0.2'
        );

      // 2. Scroll-linked separation & car emergence timeline
      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: introContainerRef.current,
          start: 'top top',
          end: '+=1200',
          pin: true,
          scrub: 1,
          anticipatePin: 1,
        },
      });

      scrollTl
        // Hide subtitle and prompt quickly as scroll starts
        .to([subtitleRef.current, scrollPromptRef.current], {
          opacity: 0,
          y: -20,
          duration: 0.2,
          ease: 'power1.out',
        })
        // Typography separates horizontally: B moves left, W moves right, M scales & fades
        .to(letterBRef.current, {
          xPercent: -130,
          opacity: 0,
          scale: 1.15,
          duration: 0.8,
          ease: 'power2.inOut',
        }, 0.1)
        .to(letterWRef.current, {
          xPercent: 130,
          opacity: 0,
          scale: 1.15,
          duration: 0.8,
          ease: 'power2.inOut',
        }, 0.1)
        .to(letterMRef.current, {
          scale: 1.4,
          opacity: 0,
          duration: 0.7,
          ease: 'power2.inOut',
        }, 0.15)
        // Vehicle emerges from behind typography with clipping mask & scale
        .fromTo(
          carRevealRef.current,
          {
            clipPath: 'polygon(30% 25%, 70% 25%, 70% 75%, 30% 75%)',
            scale: 0.75,
            opacity: 0,
            y: 60,
          },
          {
            clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
            scale: 1,
            opacity: 1,
            y: 0,
            duration: 1,
            ease: 'power2.out',
          },
          0.2
        );
    },
    { scope: introContainerRef }
  );

  return (
    <section
      ref={introContainerRef}
      id="intro"
      style={{
        position: 'relative',
        width: '100vw',
        height: '100vh',
        backgroundColor: '#050505',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 20,
      }}
      aria-label="BMW Cinematic Introduction"
    >
      {/* Background Car Reveal Layer (revealed on scroll) */}
      <div
        ref={carRevealRef}
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 5,
          opacity: 0,
          pointerEvents: 'none',
        }}
      >
        <div style={{ position: 'relative', width: '100%', height: '100%', maxWidth: '1600px' }}>
          <img
            src="/images/models/m4-hero.jpg"
            alt="BMW M4 Competition Emergence"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center 45%',
              filter: 'brightness(0.9) contrast(1.15)',
            }}
          />
          {/* Subtle gradient overlays to blend seamlessly */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'radial-gradient(ellipse at center, transparent 35%, #050505 95%)',
            }}
          />
          <div
            style={{
              position: 'absolute',
              bottom: '12%',
              left: '50%',
              transform: 'translateX(-50%)',
              textAlign: 'center',
              width: '100%',
              padding: '0 2rem',
            }}
          >
            <div
              className="font-tech"
              style={{
                fontSize: '0.85rem',
                letterSpacing: '0.3em',
                color: '#e2001a',
                marginBottom: '0.5rem',
                textTransform: 'uppercase',
              }}
            >
              BMW ///M POWERHOUSE
            </div>
            <h2
              className="font-display"
              style={{
                fontSize: 'clamp(2rem, 5vw, 4.5rem)',
                fontWeight: 900,
                letterSpacing: '-0.03em',
                color: '#ffffff',
                lineHeight: 1.05,
              }}
            >
              EMERGE INTO THE UNFORGIVING
            </h2>
          </div>
        </div>
      </div>

      {/* Typography Stage (BMW Center) */}
      <div
        style={{
          position: 'relative',
          zIndex: 10,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          pointerEvents: 'none',
          userSelect: 'none',
        }}
      >
        {/* Giant BMW Letters */}
        <div
          style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 'clamp(7rem, 24vw, 22rem)',
            fontWeight: 900,
            lineHeight: 0.85,
            fontFamily: 'var(--font-display)',
            letterSpacing: '-0.02em',
            color: '#f5f5f7',
            overflow: 'hidden',
            padding: '1rem 3rem',
          }}
        >
          {/* Light Sweep Reflection Line */}
          <div
            ref={lightSweepRef}
            style={{
              position: 'absolute',
              top: 0,
              bottom: 0,
              width: '160px',
              background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent)',
              transform: 'skewX(-25deg)',
              pointerEvents: 'none',
            }}
          />

          <span
            ref={letterBRef}
            style={{
              display: 'inline-block',
              willChange: 'transform, opacity',
            }}
          >
            B
          </span>
          <span
            ref={letterMRef}
            style={{
              display: 'inline-block',
              color: '#ffffff',
              willChange: 'transform, opacity',
            }}
          >
            M
          </span>
          <span
            ref={letterWRef}
            style={{
              display: 'inline-block',
              willChange: 'transform, opacity',
            }}
          >
            W
          </span>
        </div>

        {/* Subtitle / Department of Power */}
        <div
          ref={subtitleRef}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            marginTop: '1.5rem',
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
              fontSize: 'clamp(0.75rem, 1.5vw, 1rem)',
              letterSpacing: '0.35em',
              color: 'var(--text-secondary)',
              textTransform: 'uppercase',
            }}
          >
            M DIVISION • THE MOST POWERFUL LETTER IN THE WORLD
          </span>
        </div>
      </div>

      {/* Subtle Scroll Indicator */}
      <div
        ref={scrollPromptRef}
        style={{
          position: 'absolute',
          bottom: '2.5rem',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '8px',
          zIndex: 15,
          pointerEvents: 'none',
        }}
      >
        <span
          className="font-tech"
          style={{
            fontSize: '0.68rem',
            letterSpacing: '0.25em',
            color: '#8e95a5',
            textTransform: 'uppercase',
          }}
        >
          SCROLL TO UNLEASH
        </span>
        <ChevronDown size={18} color="#8e95a5" className="animate-bounce" />
      </div>
    </section>
  );
};
