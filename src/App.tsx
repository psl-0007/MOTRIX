import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Flip } from 'gsap/Flip';

import { Navbar } from './components/Navbar';
import { Home } from './pages/Home';
import { ModelPage } from './pages/ModelPage';
import { ThemeProvider } from './lib/theme';

// Register all GSAP plugins once at application top-level as instructed by GSAP skills
gsap.registerPlugin(useGSAP, ScrollTrigger, Flip);

export const App: React.FC = () => {
  // Web fonts (Syne/Outfit/Space Grotesk) load with display=swap, so the browser
  // first renders with fallback-font metrics, then swaps in the real fonts and
  // reflows. ScrollTriggers created on mount measure positions against the
  // pre-swap layout, so pinned sections (Intro, Gallery) can desync from where
  // they actually sit once fonts land — causing sections to visibly overlap
  // mid-scroll. Refresh once fonts are ready (and again on full page load as a
  // fallback for any image-driven shifts) to resync every trigger.
  useEffect(() => {
    const refresh = () => ScrollTrigger.refresh();
    if (typeof document !== 'undefined' && 'fonts' in document) {
      document.fonts.ready.then(refresh);
    }
    window.addEventListener('load', refresh);
    return () => window.removeEventListener('load', refresh);
  }, []);

  return (
    <ThemeProvider>
      <Router>
        <div style={{ position: 'relative', minHeight: '100vh', backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
          {/* Ambient Film Grain & Cinematic Vignette Overlays */}
          <div className="ambient-film-grain" />
          <div className="cinematic-vignette" />

          {/* Global Navigation */}
          <Navbar />

          {/* Application Routes */}
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/models/:id" element={<ModelPage />} />
            <Route path="*" element={<Home />} />
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
  );
};

export default App;
