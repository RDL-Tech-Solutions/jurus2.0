import { useState, useEffect } from 'react';
import { Theme } from '../types';
import { carregarTemaPreferido, salvarTemaPreferido } from '../utils/localStorage';

export function useTheme(): [Theme, (theme: Theme) => void, boolean] {
  const [theme, setTheme] = useState<Theme>(() => {
    const savedTheme = carregarTemaPreferido();
    if (savedTheme) {
      return savedTheme;
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  useEffect(() => {
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(theme);
    salvarTemaPreferido(theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  const setThemeDirectly = (newTheme: Theme) => {
    setTheme(newTheme);
  };

  return [theme, setThemeDirectly, theme === 'dark'];
}

// Hook alternativo com interface de objeto (compatibilidade)
export function useThemeObject() {
  const [theme, setTheme, isDark] = useTheme();
  
  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return {
    theme,
    setTheme,
    toggleTheme,
    isDark
  };
}