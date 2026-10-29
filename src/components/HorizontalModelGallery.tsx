import React, { useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { BMW_MODELS, BMWModel } from '../data/models';
import { ModelCard } from './ModelCard';
import { ArrowLeft, ArrowRight } from 'lucide-react';

gsap.registerPlugin(useGSAP, ScrollTrigger);

export const HorizontalModelGallery: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const progressTextRef = useRef<HTMLSpanElement>(null);
  const expansionOverlayRef = useRef<HTMLDivElement>(null);

  const [activeModelId, setActiveModelId] = useState<string | null>(null);
  const [isExpanding, setIsExpanding] = useState(false);
  const [expandingModel, setExpandingModel] = useState<BMWModel | null>(null);

  const horizontalScrollTriggerRef = useRef<ScrollTrigger | null>(null);

  const navigate = useNavigate();

  // ScrollTrigger Horizontal Tween setup using verified GSAP skill instructions
  useGSAP(
    () => {
      const track = trackRef.current;
      const container = containerRef.current;
      if (!track || !container) return;

      // Calculate total horizontal scroll distance
      const getScrollDistance = () => track.scrollWidth - window.innerWidth + 120;

      // GSAP matchMedia to provide responsive desktop horizontal scroll vs mobile swipe.
      // Reduced-motion users get the same native-scroll fallback as mobile, regardless
      // of viewport width — pin + scrub is a scroll-jacking pattern that's exactly the
      // kind of motion `prefers-reduced-motion` is meant to suppress. The native-scroll
      // path is enabled by a matching `prefers-reduced-motion` rule on
      // `.model-gallery-section` in index.css.
      const mm = gsap.matchMedia();

      mm.add('(min-width: 769px) and (prefers-reduced-motion: no-preference)', () => {
        const horizontalTween = gsap.to(track, {
          x: () => -getScrollDistance(),
          ease: 'none', // MANDATORY ease: "none" according to gsap-scrolltrigger skill
          scrollTrigger: {
            trigger: container,
            pin: true,
            scrub: 1,
            start: 'top top',
            end: () => `+=${getScrollDistance()}`,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              // Update progress bar & index
              if (progressBarRef.current) {
                progressBarRef.current.style.width = `${Math.min(100, Math.max(0, self.progress * 100))}%`;
              }
              if (progressTextRef.current) {
                const activeIndex = Math.min(5, Math.max(1, Math.floor(self.progress * 5) + 1));
                progressTextRef.current.innerText = `0${activeIndex} / 05`;
              }
            },
          },
        });

        horizontalScrollTriggerRef.current = horizontalTween.scrollTrigger ?? null;

        return () => {
          horizontalScrollTriggerRef.current = null;
          horizontalTween.kill();
        };
      });

      mm.add('(max-width: 768px), (prefers-reduced-motion: reduce)', () => {
        // Touch friendly horizontal layout on mobile, and the reduced-motion
        // fallback on any width: native swipe/scroll, no pin, no scrub.
        horizontalScrollTriggerRef.current = null;
        gsap.set(track, { x: 0 });
      });
    },
    { scope: containerRef }
  );

  // Signature Car Selection & Expansion Animation (Section 6A)
  const handleSelectModel = (model: BMWModel, cardEl: HTMLElement) => {
    if (isExpanding) return;

    // Capture the clicked card's exact position before any state-driven layout shift
    const rect = cardEl.getBoundingClientRect();

    // Flush synchronously so `.expanding-car-img` exists in the DOM before we query it below
    flushSync(() => {
      setActiveModelId(model.id);
      setIsExpanding(true);
      setExpandingModel(model);
    });

    const overlay = expansionOverlayRef.current;
    if (!overlay) return;

    // Create expansion animation:
    // 1. Overlay image starts at clicked card rect
    // 2. Other cards animate away (handled via isOther prop)
    // 3. Overlay image expands to cover full viewport
    // 4. Model typography emerges with masked reveal
    // 5. Route seamlessly transitions to /models/:id

    const tl = gsap.timeline({
      onComplete: () => {
        navigate(`/models/${model.id}`);
      },
    });

    tl.set(overlay, {
      display: 'flex',
      opacity: 1,
    })
      .fromTo(
        overlay.querySelector('.expanding-car-img'),
        {
          top: rect.top,
          left: rect.left,
          width: rect.width,
          height: rect.height,
          borderRadius: '4px',
          scale: 1,
        },
        {
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          borderRadius: '0px',
          scale: 1,
          duration: 0.9,
          ease: 'power3.inOut',
        }
      )
      .fromTo(
        overlay.querySelector('.expansion-bg-veil'),
        { opacity: 0 },
        { opacity: 0.75, duration: 0.6, ease: 'power2.inOut' },
        0
      )
      .fromTo(
        overlay.querySelectorAll('.expansion-title-word'),
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: 'power3.out' },
        '-=0.3'
      )
      .fromTo(
        overlay.querySelector('.expansion-tagline'),
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' },
        '-=0.2'
      );
  };

  // Prev/Next controls: drive the pinned horizontal scroll on desktop,
  // or natively scroll the track on mobile where there is no pin/ScrollTrigger.
  const stepGallery = (direction: 1 | -1) => {
    const st = horizontalScrollTriggerRef.current;
    const track = trackRef.current;

    if (st) {
      const totalCards = BMW_MODELS.length;
      const currentIndex = Math.round(st.progress * (totalCards - 1));
      const nextIndex = Math.min(totalCards - 1, Math.max(0, currentIndex + direction));
      const targetProgress = nextIndex / (totalCards - 1);
      const targetScroll = st.start + targetProgress * (st.end - st.start);
      window.scrollTo({ top: targetScroll, behavior: 'smooth' });
    } else if (track && containerRef.current) {
      const cardWidth = track.scrollWidth / BMW_MODELS.length;
      containerRef.current.scrollBy({ left: direction * cardWidth, behavior: 'smooth' });
    }
  };

  return (
    <section
      ref={containerRef}
      id="lineup"
      className="model-gallery-section"
      style={{
        position: 'relative',
        isolation: 'isolate',
        width: '100vw',
        minHeight: '100vh',
        backgroundColor: 'var(--bg-primary)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '5rem 0 3rem',
      }}
      aria-label="BMW M Horizontal Gallery"
    >
      {/* Header Bar */}
      <div
        className="gallery-header"
        style={{
          marginBottom: '2rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          flexWrap: 'wrap',
          gap: '1.5rem',
          zIndex: 10,
        }}
      >
        <div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginBottom: '0.5rem',
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
                fontSize: '0.8rem',
                color: 'var(--m-red)',
                letterSpacing: '0.25em',
                fontWeight: 700,
                textTransform: 'uppercase',
              }}
            >
              FEATURED PERFORMANCE LINEUP
            </span>
          </div>

          <h2
            className="font-display"
            style={{
              fontSize: 'clamp(2.5rem, 5vw, 4.5rem)',
              fontWeight: 800,
              lineHeight: 1,
              letterSpacing: '-0.03em',
              color: 'var(--text-primary)',
              textTransform: 'uppercase',
            }}
          >
            CHOOSE YOUR WEAPON
          </h2>
        </div>

        {/* Progress & Controls */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-end',
            gap: '8px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span
              ref={progressTextRef}
              className="font-tech"
              style={{
                fontSize: '1.1rem',
                fontWeight: 700,
                color: 'var(--text-heading)',
                letterSpacing: '0.15em',
              }}
            >
              01 / 05
            </span>
            <div
              style={{
                display: 'flex',
                gap: '8px',
              }}
            >
              <button
                type="button"
                onClick={() => stepGallery(-1)}
                aria-label="Previous model"
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '2px',
                  border: '1px solid rgba(var(--overlay-rgb), 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--text-secondary)',
                }}
              >
                <ArrowLeft size={16} />
              </button>
              <button
                type="button"
                onClick={() => stepGallery(1)}
                aria-label="Next model"
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '2px',
                  border: '1px solid rgba(var(--overlay-rgb), 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--text-heading)',
                }}
              >
                <ArrowRight size={16} />
              </button>
            </div>
          </div>

          {/* Progress track */}
          <div
            style={{
              width: '180px',
              height: '3px',
              backgroundColor: 'rgba(var(--overlay-rgb), 0.1)',
              borderRadius: '2px',
              overflow: 'hidden',
            }}
          >
            <div
              ref={progressBarRef}
              style={{
                width: '20%',
                height: '100%',
                backgroundColor: 'var(--m-red)',
                transition: 'width 0.1s linear',
              }}
            />
          </div>
        </div>
      </div>

      {/* Horizontal Scroll Track */}
      <div
        ref={trackRef}
        style={{
          display: 'flex',
          gap: '2.5rem',
          padding: '1.5rem clamp(1.25rem, 6vw, 3.5rem)',
          width: 'max-content',
          willChange: 'transform',
        }}
      >
        {BMW_MODELS.map((model) => (
          <ModelCard
            key={model.id}
            model={model}
            onSelect={handleSelectModel}
            isExpanding={isExpanding}
            isSelected={activeModelId === model.id}
            isOther={activeModelId !== null && activeModelId !== model.id}
          />
        ))}
      </div>

      {/* Signature Expansion Transition Overlay (Section 6A) */}
      <div
        ref={expansionOverlayRef}
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 200,
          display: 'none',
          opacity: 0,
          pointerEvents: 'none',
        }}
        aria-hidden="true"
      >
        {/* Darkening Veil */}
        <div
          className="expansion-bg-veil"
          style={{
            position: 'absolute',
            inset: 0,
            backgroundColor: 'var(--bg-primary)',
          }}
        />

        {/* Expanding Car Image */}
        {expandingModel && (
          <div
            className="expanding-car-img"
            style={{
              position: 'fixed',
              overflow: 'hidden',
              zIndex: 205,
            }}
          >
            <img
              src={expandingModel.heroImage}
              alt={expandingModel.name}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                filter: 'brightness(0.95) contrast(1.15)',
              }}
            />
            {/* Cinematic Gradient — a scrim that darkens the photo for text legibility,
                so it stays dark-based in both themes rather than fading to the page bg */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(180deg, rgba(var(--vignette-rgb), 0.2) 0%, rgba(var(--vignette-rgb), 0.7) 100%)',
              }}
            />

            {/* Emergent Title Overlay */}
            <div
              style={{
                position: 'absolute',
                bottom: '15%',
                left: 'clamp(1.25rem, 6vw, 3.5rem)',
                right: 'clamp(1.25rem, 6vw, 3.5rem)',
                zIndex: 210,
              }}
            >
              <div
                className="expansion-tagline font-tech"
                style={{
                  fontSize: '0.9rem',
                  letterSpacing: '0.3em',
                  color: 'var(--m-red)',
                  marginBottom: '0.75rem',
                  textTransform: 'uppercase',
                }}
              >
                {expandingModel.descriptor}
              </div>
              <h2
                className="font-display"
                style={{
                  fontSize: 'clamp(3rem, 8vw, 7rem)',
                  fontWeight: 800,
                  // Constant white: sits on the expanding car photo + dark scrim
                  // above, not on the page background
                  color: '#ffffff',
                  lineHeight: 0.95,
                  letterSpacing: '-0.04em',
                }}
              >
                <span className="expansion-title-word" style={{ display: 'inline-block' }}>
                  {expandingModel.name}
                </span>
              </h2>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
