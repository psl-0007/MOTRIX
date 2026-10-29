import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { BMW_MODELS } from '../data/models';
import { Menu, X, ArrowUpRight } from 'lucide-react';
import { Horizon } from '@/components/ui/horizon';
import { useTheme } from '@/lib/theme';

export const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();

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
          background: scrolled ? 'rgba(var(--bg-primary-rgb), 0.92)' : 'linear-gradient(180deg, rgba(var(--bg-primary-rgb), 0.85) 0%, rgba(var(--bg-primary-rgb), 0) 100%)',
          borderColor: scrolled ? 'rgba(var(--overlay-rgb), 0.1)' : 'rgba(var(--overlay-rgb), 0.04)',
        }}
        aria-label="Main Navigation"
      >
        <Link to="/" className="nav-brand" aria-label="BMW M Home">
          <span style={{ fontWeight: 800, letterSpacing: '0.15em', fontSize: '1.25rem' }}>BMW</span>
          <div className="m-badge-stripes">
            <span className="m-stripe-1"></span>
            <span className="m-stripe-2"></span>
            <span className="m-stripe-3"></span>
          </div>
          <span style={{ color: 'var(--m-red)', fontWeight: 800 }}>///M</span>
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
          <div style={{ width: '1px', height: '18px', backgroundColor: 'rgba(var(--overlay-rgb), 0.15)' }} />
          
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
                  color: location.pathname === `/models/${m.id}` ? 'var(--m-red)' : 'var(--text-secondary)',
                  fontWeight: location.pathname === `/models/${m.id}` ? 700 : 500,
                }}
              >
                {m.shortName}
              </Link>
            ))}
          </div>

          <div style={{ width: '1px', height: '18px', backgroundColor: 'rgba(var(--overlay-rgb), 0.15)' }} />

          <Horizon
            toggled={theme === 'dark'}
            onClick={toggleTheme}
            style={{ fontSize: '1.1rem', color: 'var(--text-secondary)' }}
          />
        </div>

        {/* Mobile Menu Button */}
        <button
          className="mobile-menu-toggle"
          onClick={() => setMenuOpen(!menuOpen)}
          style={{ color: 'var(--text-heading)', padding: '8px' }}
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
            backgroundColor: 'var(--bg-primary)',
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
          <div style={{ width: '40px', height: '2px', backgroundColor: 'var(--m-red)' }} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center' }}>
            {BMW_MODELS.map((m) => (
              <Link
                key={m.id}
                to={`/models/${m.id}`}
                onClick={() => setMenuOpen(false)}
                style={{ fontSize: '1.25rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                {m.name} <ArrowUpRight size={16} />
              </Link>
            ))}
          </div>

          <Horizon
            toggled={theme === 'dark'}
            onClick={toggleTheme}
            style={{ fontSize: '1.5rem', color: 'var(--text-secondary)' }}
          />
        </div>
      )}
    </>
  );
};
