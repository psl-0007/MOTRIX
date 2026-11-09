import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BMW_MODELS } from '@/data/models';

export const NotFound: React.FC = () => {
  useEffect(() => {
    const prev = document.title;
    document.title = '404 — BMW M';
    return () => {
      document.title = prev;
    };
  }, []);

  return (
    <section className="shell-state" aria-labelledby="nf-title">
      <meta name="robots" content="noindex" />
      <p className="shell-state__eyebrow font-tech">Error 404</p>
      <h1 id="nf-title" className="shell-state__title font-display">
        Off the racing line.
      </h1>
      <p className="shell-state__copy">
        The page you are looking for does not exist or has moved. Head back to the start, or jump straight to a model.
      </p>
      <div className="shell-state__actions">
        <Link to="/" className="btn-m-primary">
          Back to home
        </Link>
      </div>
      <nav aria-label="Models" className="shell-state__models">
        {BMW_MODELS.map((m) => (
          <Link key={m.id} to={`/models/${m.id}`} className="shell-state__model font-tech">
            {m.name}
          </Link>
        ))}
      </nav>
    </section>
  );
};
