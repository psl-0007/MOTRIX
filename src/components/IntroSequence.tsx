import React, { useRef, useState } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ChevronDown } from 'lucide-react';

gsap.registerPlugin(useGSAP, ScrollTrigger);

const HERO_VIDEO_SRC = '/videos/m4-hero.mp4';
const HERO_IMAGE_SRC = '/images/models/m4-hero.jpg';

export const IntroSequence: React.FC = () => {
  const introContainerRef = useRef<HTMLDivElement>(null);
  const letterBRef = useRef<HTMLSpanElement>(null);
  const letterMRef = useRef<HTMLSpanElement>(null);
  const letterWRef = useRef<HTMLSpanElement>(null);
  const carRevealRef = useRef<HTMLDivElement>(null);
  const lightSweepRef = useRef<HTMLDivElement>(null);
  const subtitleRef = useRef<HTMLDivElement>(null);
  const scrollPromptRef = useRef<HTMLDivElement>(null);

  // Falls back to the static hero photo if the video can't load. Checked once
  // on mount (matches the getInitialTheme() pattern elsewhere in this app)
  // rather than tracked reactively — reduced-motion preference changing
  // mid-session is not a case worth re-rendering the hero media for.
  const [videoFailed, setVideoFailed] = useState(false);
  const [prefersReducedMotion] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
  const useVideo = !prefersReducedMotion && !videoFailed;

  useGSAP(
    () => {
      if (!introContainerRef.current) return;

      const mm = gsap.matchMedia();

      // Users who've asked their OS for reduced motion get the finished state
      // immediately: no staggered letter build, and critically no pinned
      // scroll-jacking (pin + scrub is exactly the kind of motion that's
      // disorienting for vestibular-sensitive users). They still get the full
      // page — just without the scroll-driven choreography.
      mm.add('(prefers-reduced-motion: reduce)', () => {
        gsap.set([letterBRef.current, letterMRef.current, letterWRef.current], {
          opacity: 1,
          scale: 1,
          y: 0,
          xPercent: 0,
        });
        gsap.set(subtitleRef.current, { opacity: 1, y: 0 });
        // Stays visible (just without its bounce — already neutralized by the
        // global prefers-reduced-motion CSS rule on .animate-bounce)
        gsap.set(scrollPromptRef.current, { opacity: 0.7, xPercent: -50, y: 0 });
        // Leave the car-reveal layer hidden rather than statically showing it
        // behind the wordmark — the car gets its proper moment in HeroSection
        // right below, without the two headings visually colliding here.
      });

      mm.add('(prefers-reduced-motion: no-preference)', () => {
      // Scroll-linked separation & car emergence timeline — created synchronously, right away,
      // so its pin-spacer reserves ~1200px of layout space from the very first paint. Creating
      // this lazily (e.g. only once the user starts scrolling) inserts that spacer into the
      // document AFTER scrolling has already begun, which retroactively shifts every section
      // below Intro and causes a visible jump/layout-thrash right as the user starts scrolling.
      // Its tweens stay a no-op until scroll actually reaches the pin's "top top" start, so
      // creating it up front doesn't fight the entrance timeline below.
      gsap
        .timeline({
          scrollTrigger: {
            trigger: introContainerRef.current,
            start: 'top top',
            end: '+=1200',
            pin: true,
            scrub: 1,
            anticipatePin: 1,
          },
        })
        // Hide subtitle and prompt quickly as scroll starts
        .fromTo(
          subtitleRef.current,
          { opacity: 1, y: 0 },
          {
            opacity: 0,
            y: -20,
            duration: 0.2,
            ease: 'power1.out',
          },
          0
        )
        .fromTo(
          scrollPromptRef.current,
          { opacity: 0.7, y: 0, xPercent: -50 },
          {
            opacity: 0,
            y: -20,
            xPercent: -50,
            duration: 0.2,
            ease: 'power1.out',
          },
          0
        )
        // Typography separates horizontally: B moves left, W moves right, M scales & fades
        .fromTo(
          letterBRef.current,
          { xPercent: 0, opacity: 1, scale: 1, y: 0 },
          {
            xPercent: -130,
            opacity: 0,
            scale: 1.15,
            duration: 0.8,
            ease: 'power2.inOut',
          },
          0.1
        )
        .fromTo(
          letterWRef.current,
          { xPercent: 0, opacity: 1, scale: 1, y: 0 },
          {
            xPercent: 130,
            opacity: 0,
            scale: 1.15,
            duration: 0.8,
            ease: 'power2.inOut',
          },
          0.1
        )
        .fromTo(
          letterMRef.current,
          { scale: 1, opacity: 1, y: 0 },
          {
            scale: 1.4,
            opacity: 0,
            duration: 0.7,
            ease: 'power2.inOut',
          },
          0.15
        )
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

      // If user is already scrolled (e.g. browser restored scroll on refresh), skip entrance
      if (typeof window !== 'undefined' && window.scrollY > 10) {
        gsap.set([letterBRef.current, letterMRef.current, letterWRef.current], { opacity: 1, scale: 1, y: 0 });
        gsap.set(subtitleRef.current, { opacity: 1, y: 0 });
        gsap.set(scrollPromptRef.current, { opacity: 0.7, xPercent: -50, y: 0 });
        return;
      }

      // 1. Initial entrance timeline (on page load) — a quick, confident mask/fade
      // reveal rather than a long staggered build (~1.5s total vs. the previous ~2.9s).
      const entranceTl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      entranceTl
        .fromTo(
          [letterBRef.current, letterMRef.current, letterWRef.current],
          { opacity: 0, scale: 0.96, y: 16 },
          { opacity: 1, scale: 1, y: 0, duration: 0.55, stagger: 0.06 }
        )
        .fromTo(
          lightSweepRef.current,
          { xPercent: -150, opacity: 0 },
          { xPercent: 200, opacity: 0.8, duration: 1.1, ease: 'power2.inOut' },
          '-=0.3'
        )
        .fromTo(
          subtitleRef.current,
          { opacity: 0, y: 12 },
          { opacity: 1, y: 0, duration: 0.5 },
          '-=0.6'
        )
        .fromTo(
          scrollPromptRef.current,
          { opacity: 0, xPercent: -50, y: 0 },
          { opacity: 0.7, xPercent: -50, y: 0, duration: 0.4 },
          '-=0.15'
        );

      // If user starts scrolling during entrance, snap it to completion immediately
      // so the letters/subtitle don't look stuck mid-fade while the user is scrolling.
      const onEarlyScroll = () => {
        if (entranceTl.isActive()) {
          entranceTl.progress(1);
        }
      };

      window.addEventListener('scroll', onEarlyScroll, { passive: true, once: true });
      return () => {
        window.removeEventListener('scroll', onEarlyScroll);
      };
      });
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
        backgroundColor: 'var(--bg-primary)',
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
          {useVideo ? (
            <video
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
              poster={HERO_IMAGE_SRC}
              onError={() => setVideoFailed(true)}
              aria-label="BMW M4 Competition Emergence"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: 'center 45%',
                filter: 'brightness(0.9) contrast(1.15)',
              }}
            >
              <source src={HERO_VIDEO_SRC} type="video/mp4" />
            </video>
          ) : (
            <img
              src={HERO_IMAGE_SRC}
              alt="BMW M4 Competition Emergence"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: 'center 45%',
                filter: 'brightness(0.9) contrast(1.15)',
              }}
            />
          )}
          {/* Edge-darkening vignette so the photo reads as cinematic falloff in
              both themes — deliberately uses the dark-biased vignette token
              rather than the page background, which would wash the photo out
              to a pale haze in light mode instead of a moody dark edge. */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'radial-gradient(ellipse at center, transparent 35%, rgba(var(--vignette-rgb), 0.92) 95%)',
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
                color: 'var(--m-red)',
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
                fontWeight: 800,
                letterSpacing: '-0.03em',
                /* Constant white, not theme-reactive: this sits directly on the
                   car photo, which stays dark in both themes, not on the page bg */
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
            fontSize: 'clamp(3.5rem, 24vw, 22rem)',
            fontWeight: 800,
            lineHeight: 0.85,
            fontFamily: 'var(--font-display)',
            letterSpacing: '-0.02em',
            color: 'var(--text-primary)',
            overflow: 'hidden',
            padding: 'clamp(0.5rem, 3vw, 1rem) clamp(0.5rem, 4vw, 3rem)',
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
              background: 'linear-gradient(90deg, transparent, rgba(var(--overlay-rgb), 0.4), transparent)',
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
              color: 'var(--text-heading)',
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
            justifyContent: 'center',
            flexWrap: 'wrap',
            gap: '16px',
            marginTop: '1.5rem',
            padding: '0 1.5rem',
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
              letterSpacing: 'clamp(1px, 0.5vw, 5.6px)',
              color: 'var(--text-secondary)',
              textTransform: 'uppercase',
              textAlign: 'center',
              maxWidth: '85vw',
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
            color: 'var(--text-secondary)',
            textTransform: 'uppercase',
          }}
        >
          SCROLL TO UNLEASH
        </span>
        <ChevronDown size={18} color="var(--text-secondary)" className="animate-bounce" />
      </div>
    </section>
  );
};
