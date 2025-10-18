import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Moon, Monitor, Palette } from 'lucide-react';

type Theme = 'light' | 'dark' | 'system';

interface ThemeToggleEnhancedProps {
  className?: string;
  showLabel?: boolean;
  variant?: 'button' | 'dropdown';
}

export function ThemeToggleEnhanced({ 
  className = '', 
  showLabel = false,
  variant = 'button'
}: ThemeToggleEnhancedProps) {
  const [theme, setTheme] = useState<Theme>('system');
  const [systemTheme, setSystemTheme] = useState<'light' | 'dark'>('light');
  const [showDropdown, setShowDropdown] = useState(false);

  // Detectar tema do sistema
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setSystemTheme(mediaQuery.matches ? 'dark' : 'light');

    const handleChange = (e: MediaQueryListEvent) => {
      setSystemTheme(e.matches ? 'dark' : 'light');
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Carregar tema salvo
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as Theme;
    if (savedTheme && ['light', 'dark', 'system'].includes(savedTheme)) {
      setTheme(savedTheme);
    }
  }, []);

  // Aplicar tema
  useEffect(() => {
    const root = document.documentElement;
    const effectiveTheme = theme === 'system' ? systemTheme : theme;
    
    // Remover classes anteriores
    root.classList.remove('light', 'dark');
    
    // Adicionar nova classe com transição
    root.style.transition = 'background-color 0.3s ease, color 0.3s ease';
    root.classList.add(effectiveTheme);
    
    // Salvar no localStorage
    localStorage.setItem('theme', theme);
    
    // Limpar transição após aplicar
    setTimeout(() => {
      root.style.transition = '';
    }, 300);
  }, [theme, systemTheme]);

  const themes = [
    {
      id: 'light' as Theme,
      label: 'Claro',
      icon: <Sun className="w-4 h-4" />,
      description: 'Tema claro'
    },
    {
      id: 'dark' as Theme,
      label: 'Escuro',
      icon: <Moon className="w-4 h-4" />,
      description: 'Tema escuro'
    },
    {
      id: 'system' as Theme,
      label: 'Sistema',
      icon: <Monitor className="w-4 h-4" />,
      description: 'Seguir sistema'
    }
  ];

  const currentTheme = themes.find(t => t.id === theme);
  const effectiveTheme = theme === 'system' ? systemTheme : theme;

  if (variant === 'button') {
    return (
      <motion.button
        onClick={() => {
          const nextTheme = theme === 'light' ? 'dark' : theme === 'dark' ? 'system' : 'light';
          setTheme(nextTheme);
        }}
        className={`
          relative flex items-center space-x-2 p-2 rounded-lg transition-all duration-200
          bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700
          text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white
          ${className}
        `}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        title={`Tema atual: ${currentTheme?.label} (${effectiveTheme})`}
      >
        <motion.div
          key={theme}
          initial={{ rotate: -180, opacity: 0 }}
          animate={{ rotate: 0, opacity: 1 }}
          transition={{ duration: 0.3, type: "spring", stiffness: 200 }}
        >
          {currentTheme?.icon}
        </motion.div>
        
        {showLabel && (
          <motion.span
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-sm font-medium"
          >
            {currentTheme?.label}
          </motion.span>
        )}

        {/* Indicador de tema ativo */}
        <motion.div
          className={`
            absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 border-white dark:border-gray-800
            ${effectiveTheme === 'dark' ? 'bg-blue-500' : 'bg-yellow-500'}
          `}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.1, type: "spring", stiffness: 300 }}
        />
      </motion.button>
    );
  }

  return (
    <div className={`relative ${className}`}>
      <motion.button
        onClick={() => setShowDropdown(!showDropdown)}
        className="
          flex items-center space-x-2 p-2 rounded-lg transition-all duration-200
          bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700
          text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white
        "
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Palette className="w-4 h-4" />
        {showLabel && (
          <span className="text-sm font-medium">Tema</span>
        )}
      </motion.button>

      <AnimatePresence>
        {showDropdown && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40"
              onClick={() => setShowDropdown(false)}
            />

            {/* Dropdown */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ duration: 0.2 }}
              className="
                absolute top-full right-0 mt-2 w-48 z-50
                bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700
                overflow-hidden
              "
            >
              <div className="p-2 space-y-1">
                {themes.map((themeOption) => (
                  <motion.button
                    key={themeOption.id}
                    onClick={() => {
                      setTheme(themeOption.id);
                      setShowDropdown(false);
                    }}
                    className={`
                      w-full flex items-center space-x-3 p-2 rounded-md text-left transition-all duration-200
                      ${theme === themeOption.id
                        ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }
                    `}
                    whileHover={{ x: 4 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <motion.div
                      animate={{ 
                        rotate: theme === themeOption.id ? 360 : 0,
                        scale: theme === themeOption.id ? 1.1 : 1
                      }}
                      transition={{ duration: 0.3 }}
                    >
                      {themeOption.icon}
                    </motion.div>
                    
                    <div className="flex-1">
                      <div className="text-sm font-medium">
                        {themeOption.label}
                      </div>
                      <div className="text-xs opacity-60">
                        {themeOption.description}
                        {themeOption.id === 'system' && (
                          <span className="ml-1">({systemTheme})</span>
                        )}
                      </div>
                    </div>

                    {/* Indicador de seleção */}
                    {theme === themeOption.id && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-2 h-2 bg-blue-500 rounded-full"
                      />
                    )}
                  </motion.button>
                ))}
              </div>

              {/* Informação adicional */}
              <div className="border-t border-gray-200 dark:border-gray-700 p-3">
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  <div className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${effectiveTheme === 'dark' ? 'bg-blue-500' : 'bg-yellow-500'}`} />
                    <span>Tema ativo: {effectiveTheme}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

export default ThemeToggleEnhanced;