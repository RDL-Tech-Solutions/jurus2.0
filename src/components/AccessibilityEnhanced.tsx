import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Eye, 
  EyeOff, 
  Volume2, 
  VolumeX, 
  Type, 
  Contrast, 
  MousePointer,
  Keyboard,
  Settings,
  X
} from 'lucide-react';

interface AccessibilitySettings {
  highContrast: boolean;
  largeText: boolean;
  reducedMotion: boolean;
  screenReader: boolean;
  keyboardNavigation: boolean;
  focusIndicators: boolean;
  fontSize: number;
  soundEnabled: boolean;
}

interface AccessibilityEnhancedProps {
  className?: string;
}

export function AccessibilityEnhanced({ className = '' }: AccessibilityEnhancedProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [settings, setSettings] = useState<AccessibilitySettings>({
    highContrast: false,
    largeText: false,
    reducedMotion: false,
    screenReader: false,
    keyboardNavigation: true,
    focusIndicators: true,
    fontSize: 16,
    soundEnabled: true
  });

  const panelRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Carregar configurações salvas
  useEffect(() => {
    const savedSettings = localStorage.getItem('accessibility-settings');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setSettings(parsed);
        applySettings(parsed);
      } catch (error) {
        console.error('Erro ao carregar configurações de acessibilidade:', error);
      }
    }
  }, []);

  // Salvar configurações
  useEffect(() => {
    localStorage.setItem('accessibility-settings', JSON.stringify(settings));
    applySettings(settings);
  }, [settings]);

  // Aplicar configurações ao DOM
  const applySettings = (newSettings: AccessibilitySettings) => {
    const root = document.documentElement;
    
    // Alto contraste
    if (newSettings.highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }

    // Texto grande
    if (newSettings.largeText) {
      root.classList.add('large-text');
    } else {
      root.classList.remove('large-text');
    }

    // Movimento reduzido
    if (newSettings.reducedMotion) {
      root.classList.add('reduce-motion');
    } else {
      root.classList.remove('reduce-motion');
    }

    // Indicadores de foco
    if (newSettings.focusIndicators) {
      root.classList.add('enhanced-focus');
    } else {
      root.classList.remove('enhanced-focus');
    }

    // Tamanho da fonte
    root.style.fontSize = `${newSettings.fontSize}px`;
  };

  // Navegação por teclado
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!settings.keyboardNavigation) return;

      // Alt + A para abrir painel de acessibilidade
      if (event.altKey && event.key === 'a') {
        event.preventDefault();
        setIsOpen(!isOpen);
        if (!isOpen) {
          setTimeout(() => panelRef.current?.focus(), 100);
        }
      }

      // Escape para fechar
      if (event.key === 'Escape' && isOpen) {
        setIsOpen(false);
        buttonRef.current?.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, settings.keyboardNavigation]);

  // Anunciar mudanças para leitores de tela
  const announceChange = (message: string) => {
    if (!settings.screenReader) return;

    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = message;
    
    document.body.appendChild(announcement);
    setTimeout(() => document.body.removeChild(announcement), 1000);
  };

  const updateSetting = <K extends keyof AccessibilitySettings>(
    key: K,
    value: AccessibilitySettings[K]
  ) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    
    // Anunciar mudança
    const settingNames = {
      highContrast: 'Alto contraste',
      largeText: 'Texto grande',
      reducedMotion: 'Movimento reduzido',
      screenReader: 'Leitor de tela',
      keyboardNavigation: 'Navegação por teclado',
      focusIndicators: 'Indicadores de foco',
      fontSize: 'Tamanho da fonte',
      soundEnabled: 'Som'
    };

    const settingName = settingNames[key];
    const status = typeof value === 'boolean' ? (value ? 'ativado' : 'desativado') : `alterado para ${value}`;
    announceChange(`${settingName} ${status}`);
  };

  const resetSettings = () => {
    const defaultSettings: AccessibilitySettings = {
      highContrast: false,
      largeText: false,
      reducedMotion: false,
      screenReader: false,
      keyboardNavigation: true,
      focusIndicators: true,
      fontSize: 16,
      soundEnabled: true
    };
    
    setSettings(defaultSettings);
    announceChange('Configurações de acessibilidade redefinidas');
  };

  return (
    <div className={`relative ${className}`}>
      {/* Botão de acessibilidade */}
      <motion.button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="
          flex items-center justify-center w-10 h-10 rounded-lg
          bg-blue-100 dark:bg-blue-900 hover:bg-blue-200 dark:hover:bg-blue-800
          text-blue-600 dark:text-blue-400 transition-colors duration-200
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
        "
        aria-label="Abrir configurações de acessibilidade (Alt + A)"
        title="Configurações de Acessibilidade"
      >
        <Settings className="w-5 h-5" />
      </motion.button>

      {/* Painel de configurações */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"
              onClick={() => setIsOpen(false)}
            />

            {/* Painel */}
            <motion.div
              ref={panelRef}
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ duration: 0.2 }}
              className="
                absolute top-full right-0 mt-2 w-80 z-50
                bg-white dark:bg-gray-800 rounded-lg shadow-xl 
                border border-gray-200 dark:border-gray-700
                max-h-96 overflow-y-auto
              "
              tabIndex={-1}
              role="dialog"
              aria-label="Configurações de Acessibilidade"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Acessibilidade
                </h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className="
                    p-1 rounded-md text-gray-400 hover:text-gray-600 dark:hover:text-gray-300
                    focus:outline-none focus:ring-2 focus:ring-blue-500
                  "
                  aria-label="Fechar configurações"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Configurações */}
              <div className="p-4 space-y-4">
                {/* Alto Contraste */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Contrast className="w-5 h-5 text-gray-500" />
                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Alto Contraste
                      </label>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Aumenta o contraste das cores
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => updateSetting('highContrast', !settings.highContrast)}
                    className={`
                      relative inline-flex h-6 w-11 items-center rounded-full transition-colors
                      focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                      ${settings.highContrast ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'}
                    `}
                    role="switch"
                    aria-checked={settings.highContrast}
                  >
                    <span
                      className={`
                        inline-block h-4 w-4 transform rounded-full bg-white transition-transform
                        ${settings.highContrast ? 'translate-x-6' : 'translate-x-1'}
                      `}
                    />
                  </button>
                </div>

                {/* Texto Grande */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Type className="w-5 h-5 text-gray-500" />
                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Texto Grande
                      </label>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Aumenta o tamanho do texto
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => updateSetting('largeText', !settings.largeText)}
                    className={`
                      relative inline-flex h-6 w-11 items-center rounded-full transition-colors
                      focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                      ${settings.largeText ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'}
                    `}
                    role="switch"
                    aria-checked={settings.largeText}
                  >
                    <span
                      className={`
                        inline-block h-4 w-4 transform rounded-full bg-white transition-transform
                        ${settings.largeText ? 'translate-x-6' : 'translate-x-1'}
                      `}
                    />
                  </button>
                </div>

                {/* Movimento Reduzido */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <MousePointer className="w-5 h-5 text-gray-500" />
                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Reduzir Movimento
                      </label>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Reduz animações e transições
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => updateSetting('reducedMotion', !settings.reducedMotion)}
                    className={`
                      relative inline-flex h-6 w-11 items-center rounded-full transition-colors
                      focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                      ${settings.reducedMotion ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'}
                    `}
                    role="switch"
                    aria-checked={settings.reducedMotion}
                  >
                    <span
                      className={`
                        inline-block h-4 w-4 transform rounded-full bg-white transition-transform
                        ${settings.reducedMotion ? 'translate-x-6' : 'translate-x-1'}
                      `}
                    />
                  </button>
                </div>

                {/* Navegação por Teclado */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Keyboard className="w-5 h-5 text-gray-500" />
                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Navegação por Teclado
                      </label>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Atalhos e navegação por teclado
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => updateSetting('keyboardNavigation', !settings.keyboardNavigation)}
                    className={`
                      relative inline-flex h-6 w-11 items-center rounded-full transition-colors
                      focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                      ${settings.keyboardNavigation ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'}
                    `}
                    role="switch"
                    aria-checked={settings.keyboardNavigation}
                  >
                    <span
                      className={`
                        inline-block h-4 w-4 transform rounded-full bg-white transition-transform
                        ${settings.keyboardNavigation ? 'translate-x-6' : 'translate-x-1'}
                      `}
                    />
                  </button>
                </div>

                {/* Tamanho da Fonte */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Tamanho da Fonte: {settings.fontSize}px
                  </label>
                  <input
                    type="range"
                    min="12"
                    max="24"
                    value={settings.fontSize}
                    onChange={(e) => updateSetting('fontSize', parseInt(e.target.value))}
                    className="
                      w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer
                      focus:outline-none focus:ring-2 focus:ring-blue-500
                    "
                    aria-label="Tamanho da fonte"
                  />
                  <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                    <span>Pequeno</span>
                    <span>Grande</span>
                  </div>
                </div>

                {/* Som */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {settings.soundEnabled ? (
                      <Volume2 className="w-5 h-5 text-gray-500" />
                    ) : (
                      <VolumeX className="w-5 h-5 text-gray-500" />
                    )}
                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Sons do Sistema
                      </label>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Feedback sonoro para ações
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => updateSetting('soundEnabled', !settings.soundEnabled)}
                    className={`
                      relative inline-flex h-6 w-11 items-center rounded-full transition-colors
                      focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                      ${settings.soundEnabled ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'}
                    `}
                    role="switch"
                    aria-checked={settings.soundEnabled}
                  >
                    <span
                      className={`
                        inline-block h-4 w-4 transform rounded-full bg-white transition-transform
                        ${settings.soundEnabled ? 'translate-x-6' : 'translate-x-1'}
                      `}
                    />
                  </button>
                </div>
              </div>

              {/* Footer */}
              <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={resetSettings}
                  className="
                    w-full px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300
                    bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600
                    rounded-md transition-colors duration-200
                    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                  "
                >
                  Redefinir Configurações
                </button>
                
                <div className="mt-2 text-xs text-gray-500 dark:text-gray-400 text-center">
                  Pressione Alt + A para abrir este painel
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

export default AccessibilityEnhanced;