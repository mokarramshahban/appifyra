import React, { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    // Check local storage or default to system preference (but default to dark fallback if unspecified)
    if (typeof window !== 'undefined') {
      const storedTheme = localStorage.getItem('appifyra_theme');
      if (storedTheme) return storedTheme;
      const userMedia = window.matchMedia('(prefers-color-scheme: light)');
      if (userMedia.matches) return 'light';
    }
    return 'dark'; // The site natively started as dark mode
  });

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('appifyra_theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  // Sync state with HTML attribute if it mounts (safety catch)
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Optionally listen for system changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e) => {
      if (!localStorage.getItem('appifyra_theme')) {
        setTheme(e.matches ? 'dark' : 'light');
      }
    };
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
