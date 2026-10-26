import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { BMW_MODELS, BMWModel } from '../data/models';
import { ModelCard } from './ModelCard';
import { ArrowLeft, ArrowRight, Gauge } from 'lucide-react';

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

  const navigate = useNavigate();

  // ScrollTrigger Horizontal Tween setup using verified GSAP skill instructions
  useGSAP(
    () => {
      const track = trackRef.current;
      const container = containerRef.current;
      if (!track || !container) return;

      // Calculate total horizontal scroll distance
      const getScrollDistance = () => track.scrollWidth - window.innerWidth + 120;

      // GSAP matchMedia to provide responsive desktop horizontal scroll vs mobile swipe
      const mm = gsap.matchMedia();

      mm.add('(min-width: 769px)', () => {
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

        return () => {
          horizontalTween.kill();
        };
      });

      mm.add('(max-width: 768px)', () => {
        // Touch friendly horizontal layout on mobile without forced pin trapping
        gsap.set(track, { x: 0 });
      });
    },
    { scope: containerRef }
  );

  // Signature Car Selection & Expansion Animation (Section 6A)
  const handleSelectModel = (model: BMWModel, cardEl: HTMLElement) => {
    if (isExpanding) return;

    setActiveModelId(model.id);
    setIsExpanding(true);
    setExpandingModel(model);

    const overlay = expansionOverlayRef.current;
    if (!overlay) return;

    // Get clicked card's exact position on screen
    const rect = cardEl.getBoundingClientRect();

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

  return (
    <section
      ref={containerRef}
      id="lineup"
      style={{
        position: 'relative',
        width: '100vw',
        minHeight: '100vh',
        backgroundColor: '#050505',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '5rem 0 3rem',
      }}
      aria-label="BMW M Horizontal Gallery"
    >
      {/* Header Bar */}
      <div
        style={{
          padding: '0 3.5rem',
          marginBottom: '2rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
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
                color: '#e2001a',
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
              fontWeight: 900,
              lineHeight: 1,
              letterSpacing: '-0.03em',
              color: '#f5f5f7',
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
                color: '#ffffff',
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
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '2px',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#8e95a5',
                }}
              >
                <ArrowLeft size={16} />
              </div>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '2px',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                }}
              >
                <ArrowRight size={16} />
              </div>
            </div>
          </div>

          {/* Progress track */}
          <div
            style={{
              width: '180px',
              height: '3px',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '2px',
              overflow: 'hidden',
            }}
          >
            <div
              ref={progressBarRef}
              style={{
                width: '20%',
                height: '100%',
                backgroundColor: '#e2001a',
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
          padding: '1.5rem 3.5rem',
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
            backgroundColor: '#050505',
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
            {/* Cinematic Gradient */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(180deg, rgba(5,5,5,0.2) 0%, rgba(5,5,5,0.7) 100%)',
              }}
            />

            {/* Emergent Title Overlay */}
            <div
              style={{
                position: 'absolute',
                bottom: '15%',
                left: '3.5rem',
                right: '3.5rem',
                zIndex: 210,
              }}
            >
              <div
                className="expansion-tagline font-tech"
                style={{
                  fontSize: '0.9rem',
                  letterSpacing: '0.3em',
                  color: '#e2001a',
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
                  fontWeight: 900,
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
