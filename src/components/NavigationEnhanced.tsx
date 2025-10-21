import React, { useEffect, useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home, 
  Calculator, 
  BarChart3, 
  Target, 
  TrendingUp, 
  Lightbulb, 
  PiggyBank,
  ChevronRight,
  Keyboard,
  X,
  ChevronLeft,
  Heart,
  Brain,
  GraduationCap,
  FileText
} from 'lucide-react';
import { useHoverPreload } from '../hooks/usePreloadComponents';
import { getZIndexClass, Z_INDEX } from '../constants/zIndex';

interface Tab {
  id: string;
  label: string;
  icon: React.ReactNode;
  shortcut?: string;
  description?: string;
}

interface NavigationEnhancedProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onTabHover?: (tab: string) => void;
  className?: string;
  isMinimized?: boolean;
}

const tabs: Tab[] = [
  {
    id: 'simulacao',
    label: 'Simulação',
    icon: <Calculator className="w-4 h-4" />,
    shortcut: '1',
    description: 'Calcular juros compostos'
  },
  {
    id: 'comparador',
    label: 'Comparador',
    icon: <BarChart3 className="w-4 h-4" />,
    shortcut: '2',
    description: 'Comparar investimentos'
  },
  {
    id: 'historico',
    label: 'Histórico',
    icon: <TrendingUp className="w-4 h-4" />,
    shortcut: '3',
    description: 'Histórico de simulações'
  },
  {
    id: 'meta',
    label: 'Metas',
    icon: <Target className="w-4 h-4" />,
    shortcut: '4',
    description: 'Definir metas financeiras'
  },
  {
    id: 'favoritos',
    label: 'Favoritos',
    icon: <Heart className="w-4 h-4" />,
    shortcut: '5',
    description: 'Simulações favoritas'
  },
  {
    id: 'performance',
    label: 'Performance',
    icon: <TrendingUp className="w-4 h-4" />,
    shortcut: '6',
    description: 'Dashboard de performance'
  },
  {
    id: 'cenarios',
    label: 'Cenários',
    icon: <Lightbulb className="w-4 h-4" />,
    shortcut: '7',
    description: 'Simulador de cenários'
  },
  {
    id: 'recomendacoes',
    label: 'Recomendações',
    icon: <Lightbulb className="w-4 h-4" />,
    shortcut: '8',
    description: 'Recomendações IA'
  },
  {
    id: 'aposentadoria',
    label: 'Aposentadoria',
    icon: <PiggyBank className="w-4 h-4" />,
    shortcut: '9',
    description: 'Planejamento de aposentadoria'
  },

  {
    id: 'metas-financeiras',
    label: 'Metas Financeiras',
    icon: <Target className="w-4 h-4" />,
    description: 'Gerenciar metas financeiras'
  },
  {
    id: 'imposto-renda',
    label: 'Imposto de Renda',
    icon: <FileText className="w-4 h-4" />,
    description: 'Calculadora de IR'
  }
];

export function NavigationEnhanced({ activeTab, onTabChange, onTabHover, className = '', isMinimized = false }: NavigationEnhancedProps) {
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const hoverPreload = useHoverPreload();
  
  // Refs para os containers de navegação
  const navRef = useRef<HTMLElement>(null);

  // Função para verificar se pode fazer scroll
  const checkScrollability = useCallback(() => {
    if (navRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = navRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
    }
  }, []);

  // Função para scroll horizontal suave
  const scrollHorizontal = useCallback((direction: 'left' | 'right') => {
    if (navRef.current) {
      const scrollAmount = 200;
      const newScrollLeft = direction === 'left' 
        ? navRef.current.scrollLeft - scrollAmount
        : navRef.current.scrollLeft + scrollAmount;
      
      navRef.current.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth'
      });
    }
  }, []);

  // Função melhorada para scroll horizontal com mouse wheel
  const handleWheelScroll = useCallback((e: WheelEvent) => {
    if (!navRef.current) return;
    
    // Verificar se há conteúdo para fazer scroll
    if (navRef.current.scrollWidth <= navRef.current.clientWidth) {
      return;
    }
    
    // Converter scroll vertical em horizontal se necessário
    if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
      e.preventDefault();
      const scrollAmount = e.deltaY * 0.8;
      navRef.current.scrollLeft += scrollAmount;
    }
  }, []);

  // Função para detectar scroll da página
  const handlePageScroll = useCallback(() => {
    setScrollY(window.scrollY);
  }, []);

  // Effect para detectar mobile e adicionar listeners
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    window.addEventListener('scroll', handlePageScroll, { passive: true });
    
    return () => {
      window.removeEventListener('resize', checkMobile);
      window.removeEventListener('scroll', handlePageScroll);
    };
  }, [handlePageScroll]);

  // Effect para adicionar event listeners de scroll
  useEffect(() => {
    const navElement = navRef.current;
    if (navElement) {
      navElement.addEventListener('wheel', handleWheelScroll, { passive: false });
      navElement.addEventListener('scroll', checkScrollability, { passive: true });
      
      // Verificar scrollability inicial
      checkScrollability();
      
      return () => {
        navElement.removeEventListener('wheel', handleWheelScroll);
        navElement.removeEventListener('scroll', checkScrollability);
      };
    }
  }, [handleWheelScroll, checkScrollability]);

  // Effect para atalhos de teclado
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey) {
        const key = e.key;
        if (key >= '1' && key <= '9') {
          e.preventDefault();
          const tabIndex = parseInt(key) - 1;
          if (tabs[tabIndex]) {
            onTabChange(tabs[tabIndex].id);
          }
        } else if (key === '0') {
          e.preventDefault();
          const tabIndex = 9; // Para o atalho '0' que corresponde ao índice 9
          if (tabs[tabIndex]) {
            onTabChange(tabs[tabIndex].id);
          }
        } else if (key.toLowerCase() === 'k') {
          e.preventDefault();
          setShowShortcuts(prev => !prev);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onTabChange]);

  const handleTabHover = (tabId: string) => {
    if (onTabHover) {
      onTabHover(tabId);
    }

    // Preload baseado na aba
    switch (tabId) {
      case 'simulacao':
        hoverPreload.preloadSimulador();
        break;
      case 'comparador':
        hoverPreload.preloadComparador();
        break;
      case 'historico':
        hoverPreload.preloadHistorico();
        break;
      case 'meta':
        hoverPreload.preloadMetas();
        break;
      case 'performance':
        hoverPreload.preloadPerformance();
        break;
      case 'cenarios':
        hoverPreload.preloadRelatorios();
        break;
      case 'recomendacoes':
        hoverPreload.preloadRecomendacoes();
        break;
      case 'aposentadoria':
        hoverPreload.preloadSimulador();
        break;
    }
  };

  // Determinar se deve estar minimizado baseado no scroll
  const shouldMinimize = isMinimized || scrollY > 100;

  return (
    <motion.div 
      className={`w-full transition-all duration-300 ${className}`}
      animate={{
        scale: shouldMinimize ? 0.95 : 1,
        opacity: shouldMinimize ? 0.8 : 1,
      }}
      transition={{ 
        type: "spring", 
        stiffness: 400, 
        damping: 25,
        duration: 0.3
      }}
    >
      {/* Container de Navegação Responsivo */}
      <div className="relative w-full">
        {/* Botão de Atalhos - Canto Superior Direito */}
        <div className="absolute top-0 right-0 z-10">
          <motion.button
            onClick={() => setShowShortcuts(true)}
            className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 text-xs sm:text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            title="Atalhos de teclado (Ctrl+K)"
            aria-label="Mostrar atalhos de teclado"
          >
            <Keyboard className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
            <span className="hidden sm:inline">Atalhos</span>
          </motion.button>
        </div>

        {/* Container Principal de Navegação */}
        <div className="w-full pr-16 sm:pr-20">
          <div className="relative">
            {/* Botão de Scroll Esquerda */}
            {canScrollLeft && !isMobile && (
              <motion.button
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                onClick={() => scrollHorizontal('left')}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-1.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full shadow-md hover:shadow-lg transition-all"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                aria-label="Scroll para esquerda"
              >
                <ChevronLeft className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              </motion.button>
            )}

            {/* Botão de Scroll Direita */}
            {canScrollRight && !isMobile && (
              <motion.button
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                onClick={() => scrollHorizontal('right')}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 p-1.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full shadow-md hover:shadow-lg transition-all"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                aria-label="Scroll para direita"
              >
                <ChevronRight className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              </motion.button>
            )}

            {/* Container de Navegação Unificado */}
            <div className={`
              bg-gray-100 dark:bg-gray-800 rounded-lg transition-all duration-300 
              ${shouldMinimize ? 'p-0.5' : 'p-1'}
              ${canScrollLeft || canScrollRight ? 'px-8' : ''}
            `}>
              <nav 
                ref={navRef}
                className={`
                  flex gap-1 overflow-x-auto scroll-smooth transition-all duration-300
                  ${isMobile ? 'pb-1' : ''}
                  scrollbar-hide
                `}
                style={{ 
                  scrollbarWidth: 'none',
                  msOverflowStyle: 'none'
                }}
              >
                {tabs.map((tab) => (
                  <motion.button
                    key={tab.id}
                    onClick={() => onTabChange(tab.id)}
                    onMouseEnter={() => handleTabHover(tab.id)}
                    className={`
                      relative flex items-center justify-center gap-2 rounded-md font-medium transition-all duration-200 whitespace-nowrap flex-shrink-0
                      ${isMobile 
                        ? `flex-col text-xs min-w-[60px] ${shouldMinimize ? 'px-2 py-1.5' : 'px-2 py-2'}`
                        : `text-sm ${shouldMinimize ? 'px-2 py-1.5' : 'px-3 py-2'}`
                      }
                      ${activeTab === tab.id
                        ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-gray-700/50'
                      }
                    `}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    title={`${tab.description} (Ctrl+${tab.shortcut})`}
                    aria-label={`${tab.label} - ${tab.description}`}
                  >
                    <div className={isMobile ? 'text-base' : ''}>{tab.icon}</div>
                    
                    {isMobile ? (
                      <span className="text-center leading-tight text-[10px] font-medium">
                        {tab.label.split(' ')[0]}
                      </span>
                    ) : (
                      <>
                        <span className={shouldMinimize ? 'hidden sm:inline' : ''}>
                          {tab.label}
                        </span>
                        {tab.shortcut && !shouldMinimize && (
                          <span className="text-xs opacity-60 ml-1 hidden xl:inline">
                            ⌘{tab.shortcut}
                          </span>
                        )}
                      </>
                    )}
                    
                    {/* Indicador de Aba Ativa */}

                  </motion.button>
                ))}
              </nav>
            </div>

            {/* Indicadores de Scroll para Mobile */}
            {isMobile && (
              <>
                <div className="absolute left-0 top-0 bottom-0 w-4 bg-gradient-to-r from-gray-100 dark:from-gray-800 to-transparent pointer-events-none opacity-60 rounded-l-lg"></div>
                <div className="absolute right-0 top-0 bottom-0 w-4 bg-gradient-to-l from-gray-100 dark:from-gray-800 to-transparent pointer-events-none opacity-60 rounded-r-lg"></div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Modal de Atalhos */}
      <AnimatePresence>
        {showShortcuts && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={`fixed inset-0 bg-black/50 backdrop-blur-sm ${getZIndexClass('MODAL')} flex items-center justify-center p-4`}
            onClick={() => setShowShortcuts(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-md w-full p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Atalhos de Teclado
                </h3>
                <button
                  onClick={() => setShowShortcuts(false)}
                  className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                  aria-label="Fechar modal de atalhos"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3 max-h-80 overflow-y-auto">
                {tabs.map((tab) => (
                  <div key={tab.id} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {tab.icon}
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        {tab.label}
                      </span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <kbd className="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600">
                        Ctrl
                      </kbd>
                      <span className="text-gray-400">+</span>
                      <kbd className="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600">
                        {tab.shortcut}
                      </kbd>
                    </div>
                  </div>
                ))}
                
                <div className="border-t border-gray-200 dark:border-gray-700 pt-3 mt-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      Mostrar atalhos
                    </span>
                    <div className="flex items-center space-x-1">
                      <kbd className="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600">
                        Ctrl
                      </kbd>
                      <span className="text-gray-400">+</span>
                      <kbd className="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600">
                        K
                      </kbd>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default NavigationEnhanced;