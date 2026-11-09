import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';

import { ScrollTrigger } from '@/lib/gsap';
import { Navbar } from './components/Navbar';
import { Home } from './pages/Home';
import { ModelPage } from './pages/ModelPage';
import { NotFound } from './components/NotFound';
import { ScrollManager } from './components/ScrollManager';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Footer } from './components/Footer';
import { ThemeProvider } from './lib/theme';
import './styles/shell.css';

/** Keeps the crash boundary scoped per route (navigating away recovers). */
const RoutedMain: React.FC = () => {
  const { pathname } = useLocation();
  return (
    <>
      <main id="main" tabIndex={-1}>
        <ErrorBoundary key={pathname}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/models/:id" element={<ModelPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </ErrorBoundary>
      </main>
      <Footer />
    </>
  );
};

export const App: React.FC = () => {
  // Web fonts load with display=swap, so triggers created on mount measure against the
  // fallback-font layout. Re-measure once fonts and the page (images, video posters) have
  // settled. Debounced so several late signals cost a single refresh; safe under StrictMode
  // because the cleanup removes every listener and pending timer.
  useEffect(() => {
    let timer: number | undefined;
    const refresh = () => {
      window.clearTimeout(timer);
      timer = window.setTimeout(() => ScrollTrigger.refresh(), 150);
    };
    if ('fonts' in document) void document.fonts.ready.then(refresh);
    if (document.readyState === 'complete') refresh();
    else window.addEventListener('load', refresh, { once: true });
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener('load', refresh);
    };
  }, []);

  return (
    <ThemeProvider>
      <Router>
        <ScrollManager />
        <div style={{ position: 'relative', minHeight: '100vh', backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
          {/* Ambient Film Grain & Cinematic Vignette Overlays */}
          <div className="ambient-film-grain" aria-hidden="true" />
          <div className="cinematic-vignette" aria-hidden="true" />

          <Navbar />
          <RoutedMain />
        </div>
      </Router>
    </ThemeProvider>
  );
};

export default App;
