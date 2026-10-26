import React, { useRef } from 'react';
import { BMWModel } from '../data/models';
import { ArrowRight } from 'lucide-react';

interface ModelCardProps {
  model: BMWModel;
  onSelect: (model: BMWModel, cardEl: HTMLElement) => void;
  isExpanding: boolean;
  isSelected: boolean;
  isOther: boolean;
}

export const ModelCard: React.FC<ModelCardProps> = ({
  model,
  onSelect,
  isExpanding,
  isSelected,
  isOther,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (cardRef.current && !isExpanding) {
      onSelect(model, cardRef.current);
    }
  };

  return (
    <div
      ref={cardRef}
      id={`model-card-${model.id}`}
      className="model-card-container will-animate"
      onClick={handleClick}
      style={{
        opacity: isOther ? 0 : 1,
        transform: isOther ? 'scale(0.9) translateY(40px)' : isSelected ? 'scale(1.04)' : undefined,
        transition: isExpanding
          ? 'all 0.8s cubic-bezier(0.25, 1, 0.5, 1)'
          : 'border-color 0.4s ease, box-shadow 0.4s ease, transform 0.4s ease',
        pointerEvents: isExpanding ? 'none' : 'auto',
      }}
      role="button"
      tabIndex={0}
      aria-label={`Explore ${model.name}`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          handleClick(e as any);
        }
      }}
    >
      {/* Background Vehicle Image */}
      <div className="model-card-img-wrap">
        <img
          src={model.heroImage}
          alt={model.name}
          className="model-card-img"
          loading="lazy"
        />
        <div className="model-card-gradient" />
      </div>

      {/* Card Header Info */}
      <div
        style={{
          position: 'absolute',
          top: '2rem',
          left: '2rem',
          right: '2rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          zIndex: 5,
        }}
      >
        <span
          className="font-tech"
          style={{
            fontSize: '0.8rem',
            letterSpacing: '0.2em',
            color: '#8e95a5',
          }}
        >
          {model.index} / 05
        </span>
        <div className="m-badge-stripes">
          <span className="m-stripe-1"></span>
          <span className="m-stripe-2"></span>
          <span className="m-stripe-3"></span>
        </div>
      </div>

      {/* Card Bottom Content */}
      <div
        style={{
          position: 'absolute',
          bottom: '2rem',
          left: '2rem',
          right: '2rem',
          zIndex: 5,
        }}
      >
        <div
          className="font-tech"
          style={{
            fontSize: '0.75rem',
            color: '#e2001a',
            letterSpacing: '0.2em',
            fontWeight: 700,
            textTransform: 'uppercase',
            marginBottom: '0.4rem',
          }}
        >
          {model.descriptor}
        </div>

        <h3
          className="font-display"
          style={{
            fontSize: 'clamp(2.4rem, 4.5vw, 3.4rem)',
            fontWeight: 900,
            lineHeight: 1,
            color: '#f5f5f7',
            marginBottom: '1rem',
            letterSpacing: '-0.03em',
          }}
        >
          {model.name}
        </h3>

        {/* Quick Spec Highlights */}
        <div
          style={{
            display: 'flex',
            gap: '1.25rem',
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            paddingTop: '1rem',
            marginBottom: '1.25rem',
          }}
        >
          <div>
            <div className="font-tech" style={{ fontSize: '0.65rem', color: '#8e95a5' }}>POWER</div>
            <div className="font-display" style={{ fontSize: '1.1rem', fontWeight: 800, color: '#fff' }}>
              {model.specs.power}
            </div>
          </div>
          <div style={{ width: '1px', backgroundColor: 'rgba(255,255,255,0.1)' }} />
          <div>
            <div className="font-tech" style={{ fontSize: '0.65rem', color: '#8e95a5' }}>0–60 MPH</div>
            <div className="font-display" style={{ fontSize: '1.1rem', fontWeight: 800, color: '#fff' }}>
              {model.specs.acceleration}
            </div>
          </div>
          <div style={{ width: '1px', backgroundColor: 'rgba(255,255,255,0.1)' }} />
          <div>
            <div className="font-tech" style={{ fontSize: '0.65rem', color: '#8e95a5' }}>CHASSIS</div>
            <div className="font-display" style={{ fontSize: '1.1rem', fontWeight: 800, color: '#fff' }}>
              {model.chassisCode}
            </div>
          </div>
        </div>

        {/* Explore CTA */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '0.8rem',
            fontWeight: 700,
            letterSpacing: '0.15em',
            color: '#ffffff',
            textTransform: 'uppercase',
          }}
        >
          <span>EXPLORE MODEL</span>
          <ArrowRight size={16} color="#e2001a" />
        </div>
      </div>
    </div>
  );
};
