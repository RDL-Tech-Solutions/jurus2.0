import React, { useEffect, useState } from 'react';
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
  X
} from 'lucide-react';

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
    id: 'performance',
    label: 'Performance',
    icon: <TrendingUp className="w-4 h-4" />,
    shortcut: '5',
    description: 'Dashboard de performance'
  },
  {
    id: 'cenarios',
    label: 'Cenários',
    icon: <Lightbulb className="w-4 h-4" />,
    shortcut: '6',
    description: 'Simulador de cenários'
  },
  {
    id: 'recomendacoes',
    label: 'Recomendações',
    icon: <Lightbulb className="w-4 h-4" />,
    shortcut: '7',
    description: 'Recomendações IA'
  },
  {
    id: 'aposentadoria',
    label: 'Aposentadoria',
    icon: <PiggyBank className="w-4 h-4" />,
    shortcut: '8',
    description: 'Planejamento de aposentadoria'
  }
];

export function NavigationEnhanced({ activeTab, onTabChange, onTabHover, className = '' }: NavigationEnhancedProps) {
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Detectar se é mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Atalhos de teclado
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Ctrl/Cmd + número para navegar
      if ((e.ctrlKey || e.metaKey) && e.key >= '1' && e.key <= '8') {
        e.preventDefault();
        const tab = tabs.find(t => t.shortcut === e.key);
        if (tab) {
          onTabChange(tab.id);
        }
      }
      
      // Ctrl/Cmd + K para mostrar atalhos
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setShowShortcuts(!showShortcuts);
      }
      
      // ESC para fechar atalhos
      if (e.key === 'Escape') {
        setShowShortcuts(false);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [onTabChange, showShortcuts]);

  const currentTab = tabs.find(tab => tab.id === activeTab);

  return (
    <>
      {/* Breadcrumbs */}
      <nav className={`flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400 mb-4 ${className}`}>
        <Home className="w-4 h-4" />
        <ChevronRight className="w-3 h-3" />
        <span className="text-gray-900 dark:text-white font-medium">
          {currentTab?.label || 'Simulação'}
        </span>
        {currentTab?.description && (
          <>
            <ChevronRight className="w-3 h-3" />
            <span className="text-gray-500 dark:text-gray-400 text-xs">
              {currentTab.description}
            </span>
          </>
        )}
      </nav>

      {/* Navegação por abas */}
      <div className="relative">
        {/* Desktop Navigation */}
        <div className="hidden md:block">
          <nav className="flex space-x-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
            {tabs.map((tab) => (
              <motion.button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                onMouseEnter={() => onTabHover?.(tab.id)}
                className={`
                  relative flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200
                  ${activeTab === tab.id
                    ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-gray-700/50'
                  }
                `}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                title={`${tab.description} (Ctrl+${tab.shortcut})`}
              >
                {tab.icon}
                <span>{tab.label}</span>
                {tab.shortcut && (
                  <span className="text-xs opacity-60 ml-1">
                    ⌘{tab.shortcut}
                  </span>
                )}
                
                {/* Indicador ativo */}
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-blue-500/10 dark:bg-blue-400/10 rounded-md"
                    initial={false}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
              </motion.button>
            ))}
          </nav>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden">
          <div className="flex overflow-x-auto scrollbar-hide space-x-2 pb-2">
            {tabs.map((tab) => (
              <motion.button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                onMouseEnter={() => onTabHover?.(tab.id)}
                className={`
                  flex-shrink-0 flex flex-col items-center space-y-1 p-2 rounded-lg min-w-[80px] transition-all duration-200
                  ${activeTab === tab.id
                    ? 'bg-blue-500 text-white shadow-lg'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                  }
                `}
                whileTap={{ scale: 0.95 }}
              >
                {tab.icon}
                <span className="text-xs font-medium text-center leading-tight">
                  {tab.label}
                </span>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Botão de atalhos */}
        <motion.button
          onClick={() => setShowShortcuts(!showShortcuts)}
          className="absolute top-2 right-2 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          title="Mostrar atalhos (Ctrl+K)"
        >
          <Keyboard className="w-4 h-4" />
        </motion.button>
      </div>

      {/* Modal de atalhos */}
      <AnimatePresence>
        {showShortcuts && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
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
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3">
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
    </>
  );
}

export default NavigationEnhanced;