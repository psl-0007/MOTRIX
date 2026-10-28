import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { BMW_MODELS } from '../data/models';
import { Volume2, VolumeX, Menu, X, ArrowUpRight } from 'lucide-react';

export const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [audioActive, setAudioActive] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    setMenuOpen(false);
    if (location.pathname !== '/') {
      navigate('/#' + id);
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <nav 
        className="navbar-fixed"
        style={{
          background: scrolled ? 'rgba(5, 5, 5, 0.92)' : 'linear-gradient(180deg, rgba(5,5,5,0.85) 0%, rgba(5,5,5,0) 100%)',
          borderColor: scrolled ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.04)',
        }}
        aria-label="Main Navigation"
      >
        <Link to="/" className="nav-brand" aria-label="BMW M Home">
          <span style={{ fontWeight: 900, letterSpacing: '0.15em', fontSize: '1.25rem' }}>BMW</span>
          <div className="m-badge-stripes">
            <span className="m-stripe-1"></span>
            <span className="m-stripe-2"></span>
            <span className="m-stripe-3"></span>
          </div>
          <span style={{ color: '#e2001a', fontWeight: 800 }}>///M</span>
        </Link>

        {/* Desktop Nav Links */}
        <div className="nav-links">
          <button 
            onClick={() => scrollToSection('lineup')} 
            className="nav-link"
            id="nav-lineup-btn"
          >
            LINEUP
          </button>
          <button 
            onClick={() => scrollToSection('philosophy')} 
            className="nav-link"
            id="nav-about-btn"
          >
            ABOUT M
          </button>
          <div style={{ width: '1px', height: '18px', backgroundColor: 'rgba(255,255,255,0.15)' }} />
          
          {/* Quick Model Links */}
          <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
            {BMW_MODELS.map((m) => (
              <Link
                key={m.id}
                to={`/models/${m.id}`}
                className="nav-link font-tech"
                style={{
                  fontSize: '0.75rem',
                  padding: '4px 6px',
                  color: location.pathname === `/models/${m.id}` ? '#e2001a' : '#8e95a5',
                  fontWeight: location.pathname === `/models/${m.id}` ? 700 : 500,
                }}
              >
                {m.shortName}
              </Link>
            ))}
          </div>

          {/* Sound Experience Toggle (simulated exhaust ambiance) */}
          <button
            onClick={() => setAudioActive(!audioActive)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 10px',
              borderRadius: '2px',
              background: audioActive ? 'rgba(226, 0, 26, 0.15)' : 'rgba(255, 255, 255, 0.04)',
              border: `1px solid ${audioActive ? '#e2001a' : 'rgba(255, 255, 255, 0.08)'}`,
              fontSize: '0.7rem',
              color: audioActive ? '#ffffff' : '#8e95a5',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
            }}
            title={audioActive ? 'M V8 Sound Ambient: Active' : 'Enable M V8 Sound Ambient'}
          >
            {audioActive ? <Volume2 size={13} color="#e2001a" /> : <VolumeX size={13} />}
            <span className="font-tech" style={{ letterSpacing: '0.08em' }}>{audioActive ? 'SOUND ON' : 'M SOUND'}</span>
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="mobile-menu-toggle"
          onClick={() => setMenuOpen(!menuOpen)}
          style={{ color: '#fff', padding: '8px' }}
          aria-label="Toggle navigation menu"
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile Drawer */}
      {menuOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: '#050505',
            zIndex: 99,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '2rem',
            padding: '2rem',
          }}
        >
          <button onClick={() => scrollToSection('lineup')} style={{ fontSize: '1.5rem', fontWeight: 800, letterSpacing: '0.1em' }}>
            LINEUP
          </button>
          <button onClick={() => scrollToSection('philosophy')} style={{ fontSize: '1.5rem', fontWeight: 800, letterSpacing: '0.1em' }}>
            ABOUT M
          </button>
          <div style={{ width: '40px', height: '2px', backgroundColor: '#e2001a' }} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center' }}>
            {BMW_MODELS.map((m) => (
              <Link
                key={m.id}
                to={`/models/${m.id}`}
                onClick={() => setMenuOpen(false)}
                style={{ fontSize: '1.25rem', color: '#8e95a5', display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                {m.name} <ArrowUpRight size={16} />
              </Link>
            ))}
          </div>
        </div>
      )}
    </>
  );
};
