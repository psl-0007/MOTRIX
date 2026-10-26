import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Flip } from 'gsap/Flip';

import { Navbar } from './components/Navbar';
import { Home } from './pages/Home';
import { ModelPage } from './pages/ModelPage';

// Register all GSAP plugins once at application top-level as instructed by GSAP skills
gsap.registerPlugin(useGSAP, ScrollTrigger, Flip);

export const App: React.FC = () => {
  return (
    <Router>
      <div className="relative min-h-screen bg-[#050505] text-[#f5f5f7]">
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
  );
};

export default App;
