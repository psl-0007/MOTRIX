import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

type Theme = 'dark' | 'light';

const STORAGE_KEY = 'bmw-m-theme';
/** Canvas colours (match --bg-primary) used for <meta name="theme-color">. */
const THEME_COLOR: Record<Theme, string> = { dark: '#050505', light: '#f5f4f2' };

interface ThemeContextValue {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

function getInitialTheme(): Theme {
  if (typeof document === 'undefined') return 'dark';
  // Mirrors the blocking inline script in index.html, which already applied
  // the right class before paint — just read it back so React's state agrees.
  return document.documentElement.classList.contains('dark') ? 'dark' : 'light';
}

/** Keep <html> class, color-scheme and theme-color metas in step with the theme. */
function applyTheme(theme: Theme) {
  const root = document.documentElement;
  root.classList.toggle('dark', theme === 'dark');
  root.style.colorScheme = theme;
  document
    .querySelector('meta[name="color-scheme"]')
    ?.setAttribute('content', theme === 'dark' ? 'dark light' : 'light dark');
  document
    .querySelectorAll('meta[name="theme-color"]')
    .forEach((m) => m.setAttribute('content', THEME_COLOR[theme]));
}

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>(getInitialTheme);

  // Apply on every change (no storage write here: a default is not a user choice).
  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  const setTheme = useCallback((next: Theme) => {
    setThemeState(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // localStorage can throw (private mode / disabled storage); the theme still works for this session
    }
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeState((t) => {
      const next: Theme = t === 'dark' ? 'light' : 'dark';
      try {
        window.localStorage.setItem(STORAGE_KEY, next);
      } catch {
        /* see above */
      }
      return next;
    });
  }, []);

  const value = useMemo(() => ({ theme, toggleTheme, setTheme }), [theme, toggleTheme, setTheme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}
