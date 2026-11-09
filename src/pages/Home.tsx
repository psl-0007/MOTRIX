import React from 'react';
import { IntroSequence } from '@/components/IntroSequence';
import { HeroSection } from '@/components/HeroSection';
import { HorizontalModelGallery } from '@/components/HorizontalModelGallery';
import { PhilosophySection } from '@/components/PhilosophySection';

/**
 * Page order (top to bottom) is also ScrollTrigger creation order, which keeps pin-spacer
 * measurements correct: Intro -> Hero -> Lineup gallery -> Philosophy. The footer is rendered by App.
 */
export const Home: React.FC = () => (
  <div style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)', overflowX: 'clip' }}>
    <IntroSequence />
    <HeroSection />
    <HorizontalModelGallery />
    <PhilosophySection />
  </div>
);
