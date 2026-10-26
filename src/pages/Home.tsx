import React from 'react';
import { IntroSequence } from '../components/IntroSequence';
import { HeroSection } from '../components/HeroSection';
import { HorizontalModelGallery } from '../components/HorizontalModelGallery';
import { Flame, Shield, Gauge, Cpu, ArrowUpRight } from 'lucide-react';
import { BMW_MODELS } from '../data/models';
import { Link } from 'react-router-dom';

export const Home: React.FC = () => {
  return (
    <div style={{ backgroundColor: '#050505', color: '#f5f5f7', overflowX: 'hidden' }}>
      {/* 1. Cinematic Opening BMW Typography Reveal */}
      <IntroSequence />

      {/* 2. Hero Section: The M Experience */}
      <HeroSection />

      {/* 3. Main Feature: Horizontal BMW M Car Gallery (M2, M3, M4, M5, M8) */}
      <HorizontalModelGallery />

      {/* 4. Philosophy Section: The M Code */}
      <section
        id="philosophy"
        style={{
          position: 'relative',
          padding: '8rem 3.5rem',
          maxWidth: '1400px',
          margin: '0 auto',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        }}
      >
        <div style={{ maxWidth: '800px', marginBottom: '5rem' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginBottom: '1rem',
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
              MOTORSPORT DNA
            </span>
          </div>

          <h2
            className="font-display"
            style={{
              fontSize: 'clamp(2.5rem, 5vw, 4.5rem)',
              fontWeight: 900,
              lineHeight: 1.05,
              letterSpacing: '-0.03em',
              color: '#ffffff',
              marginBottom: '1.5rem',
            }}
          >
            FIVE MACHINES. ONE UNCOMPROMISING CODE.
          </h2>

          <p
            style={{
              fontSize: '1.2rem',
              color: '#8e95a5',
              lineHeight: 1.6,
            }}
          >
            Born on the racetrack, forged through decades of touring car and endurance triumphs. Every BMW M automobile is an unyielding synthesis of motorsport technology and daily driving capability.
          </p>
        </div>

        {/* 3 Core Pillars */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '2.5rem',
          }}
        >
          <div
            style={{
              padding: '2.5rem',
              backgroundColor: '#0a0c10',
              border: '1px solid rgba(255, 255, 255, 0.06)',
              borderRadius: '2px',
              borderTop: '2px solid #0066b1',
            }}
          >
            <Gauge size={28} color="#0066b1" style={{ marginBottom: '1.5rem' }} />
            <h3
              className="font-display"
              style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.75rem', color: '#fff' }}
            >
              TwinPower & M Hybrid
            </h3>
            <p style={{ color: '#8e95a5', lineHeight: 1.6, fontSize: '0.95rem' }}>
              High-revving inline-six and twin-turbocharged V8 engines paired with instantaneous hybrid response deliver immediate throttle modulation and relentless top-end power.
            </p>
          </div>

          <div
            style={{
              padding: '2.5rem',
              backgroundColor: '#0a0c10',
              border: '1px solid rgba(255, 255, 255, 0.06)',
              borderRadius: '2px',
              borderTop: '2px solid #002b49',
            }}
          >
            <Shield size={28} color="#8e97a4" style={{ marginBottom: '1.5rem' }} />
            <h3
              className="font-display"
              style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.75rem', color: '#fff' }}
            >
              Intelligent Lightweight Design
            </h3>
            <p style={{ color: '#8e95a5', lineHeight: 1.6, fontSize: '0.95rem' }}>
              Extensive utilization of carbon fiber reinforced plastic (CFRP) on roofs, chassis bracing, and optional bucket seats lowers the center of gravity and elevates torsional rigidity.
            </p>
          </div>

          <div
            style={{
              padding: '2.5rem',
              backgroundColor: '#0a0c10',
              border: '1px solid rgba(255, 255, 255, 0.06)',
              borderRadius: '2px',
              borderTop: '2px solid #e2001a',
            }}
          >
            <Flame size={28} color="#e2001a" style={{ marginBottom: '1.5rem' }} />
            <h3
              className="font-display"
              style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.75rem', color: '#fff' }}
            >
              Adaptive M Dynamics
            </h3>
            <p style={{ color: '#8e95a5', lineHeight: 1.6, fontSize: '0.95rem' }}>
              Rear-biased M xDrive with active electronic differentials and 2WD drift capability puts full control over lateral slip angles into the driver's hands.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer
        style={{
          borderTop: '1px solid rgba(255, 255, 255, 0.06)',
          padding: '4rem 3.5rem',
          backgroundColor: '#030303',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '2rem',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '0.5rem' }}>
            <span className="font-display" style={{ fontWeight: 900, fontSize: '1.25rem', letterSpacing: '0.15em' }}>
              BMW
            </span>
            <div className="m-badge-stripes">
              <span className="m-stripe-1"></span>
              <span className="m-stripe-2"></span>
              <span className="m-stripe-3"></span>
            </div>
            <span style={{ color: '#e2001a', fontWeight: 800 }}>///M</span>
          </div>
          <p className="font-tech" style={{ fontSize: '0.75rem', color: '#555b6a', letterSpacing: '0.1em' }}>
            OFFICIAL M MOTORSPORT CAMPAIGN EXPERIENCE • ALL FIVE MODELS CERTIFIED
          </p>
        </div>

        <div style={{ display: 'flex', gap: '1.5rem' }}>
          {BMW_MODELS.map((m) => (
            <Link
              key={m.id}
              to={`/models/${m.id}`}
              className="font-tech"
              style={{
                fontSize: '0.8rem',
                color: '#8e95a5',
                letterSpacing: '0.12em',
                transition: 'color 0.2s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#e2001a')}
              onMouseLeave={(e) => (e.currentTarget.style.color = '#8e95a5')}
            >
              {m.shortName}
            </Link>
          ))}
        </div>
      </footer>
    </div>
  );
};
