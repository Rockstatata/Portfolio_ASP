'use client';

import { useEffect, useMemo, useState } from 'react';
import { FiMoon, FiSun } from 'react-icons/fi';

const THEME_STORAGE_KEY = 'theme';

function resolveInitialTheme() {
  if (typeof window === 'undefined') {
    return false;
  }

  const storedTheme = localStorage.getItem(THEME_STORAGE_KEY);
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  return storedTheme ? storedTheme === 'dark' : prefersDark;
}

function applyTheme(isDark: boolean) {
  document.documentElement.classList.toggle('dark', isDark);
  document.body.classList.toggle('dark', isDark);
}

export default function PortfolioThemeToggle() {
  const [isDark, setIsDark] = useState(resolveInitialTheme);

  useEffect(() => {
    applyTheme(isDark);
  }, [isDark]);

  const label = useMemo(
    () => (isDark ? 'Switch to light mode' : 'Switch to dark mode'),
    [isDark],
  );

  const handleToggle = () => {
    const nextIsDark = !isDark;
    setIsDark(nextIsDark);
    localStorage.setItem(THEME_STORAGE_KEY, nextIsDark ? 'dark' : 'light');
    applyTheme(nextIsDark);
  };

  return (
    <button
      type="button"
      className="theme-toggle"
      aria-label={label}
      title={label}
      onClick={handleToggle}
    >
      <FiSun className="theme-icon sun-icon" />
      <FiMoon className="theme-icon moon-icon" />
    </button>
  );
}
