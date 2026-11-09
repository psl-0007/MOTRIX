import React from 'react';
import { Link } from 'react-router-dom';

interface State {
  error: Error | null;
}

/**
 * Catches render errors in a route so the Navbar and footer stay alive.
 * App keys it by pathname, so navigating away remounts it with a clean state.
 */
export class ErrorBoundary extends React.Component<React.PropsWithChildren, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('Route crashed:', error, info.componentStack);
  }

  render() {
    if (!this.state.error) return this.props.children;
    return (
      <section className="shell-state" role="alert" aria-labelledby="error-title">
        <p className="shell-state__eyebrow font-tech">Something went wrong</p>
        <h1 id="error-title" className="shell-state__title font-display">
          This page hit a red flag.
        </h1>
        <p className="shell-state__copy">
          An unexpected error stopped this page from loading. The rest of the site is still running.
        </p>
        <div className="shell-state__actions">
          <Link to="/" className="btn-m-primary">
            Back to home
          </Link>
          <button type="button" className="btn-m-secondary" onClick={() => window.location.reload()}>
            Reload page
          </button>
        </div>
      </section>
    );
  }
}
