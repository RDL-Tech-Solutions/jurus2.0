import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import {
  Settings,
  HelpCircle,
  X,
  ChevronRight,
  Accessibility,
  Database,
  GraduationCap,
  LifeBuoy,
  Palette,
  Calculator,
  Home
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getZIndexClass, Z_INDEX } from '../constants/zIndex';
import { useResponsiveNavigation, useBreakpoint } from '../hooks/useResponsive';
import { useFocusManagement, useKeyboardNavigation, useAriaAttributes } from '../hooks/useAccessibility';
import { ComponentErrorBoundary } from './ErrorBoundary';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  onAccessibilityClick: () => void;
  onGlobalSettingsClick: () => void;
  onBackupClick: () => void;
  onTutorialClick: () => void;
  onHelpClick: () => void;
}

interface SidebarSection {
  title: string;
  icon: React.ReactNode;
  items: SidebarItem[];
}

interface SidebarItem {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  onClick: () => void;
  shortcut?: string;
}

const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onToggle,
  onAccessibilityClick,
  onGlobalSettingsClick,
  onBackupClick,
  onTutorialClick,
  onHelpClick
}) => {
  const [expandedSection, setExpandedSection] = useState<string | null>('Ferramentas');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Responsive hooks
  const { shouldShowMobileMenu, shouldCollapseSidebar, navigationMode } = useResponsiveNavigation();
  const { isMobile, isTablet, isDesktop } = useBreakpoint();

  // Accessibility hooks
  const { trapFocus, pushFocus, popFocus } = useFocusManagement();
  const { setAriaExpanded, setAriaHidden } = useAriaAttributes();

  // Detectar tema escuro
  useEffect(() => {
    const checkDarkMode = () => {
      const isDark = document.documentElement.classList.contains('dark');
      setIsDarkMode(isDark);
    };
    
    checkDarkMode();
    
    // Observer para mudanças no tema
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });
    
    return () => observer.disconnect();
  }, []);

  // Persistir estado da sidebar no localStorage
  useEffect(() => {
    const savedState = localStorage.getItem('sidebar-open');
    if (savedState !== null) {
      // O estado é controlado pelo componente pai, apenas para referência
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('sidebar-open', isOpen.toString());
  }, [isOpen]);

  // Focus management
  useEffect(() => {
    if (isOpen && sidebarRef.current) {
      const cleanup = trapFocus(sidebarRef.current);
      return cleanup;
    }
  }, [isOpen, trapFocus]);

  // Fechar sidebar ao clicar fora (apenas em mobile)
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isMobile &&
        isOpen &&
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node)
      ) {
        onToggle();
      }
    };

    if (isOpen && isMobile) {
      // Adicionar delay para evitar fechamento imediato
      const timeoutId = setTimeout(() => {
        document.addEventListener('mousedown', handleClickOutside);
      }, 100);

      return () => {
        clearTimeout(timeoutId);
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [isOpen, isMobile, onToggle]);

  // Fechar sidebar com ESC
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        onToggle();
      }
    };

    document.addEventListener('keydown', handleEscKey);
    return () => document.removeEventListener('keydown', handleEscKey);
  }, [isOpen, onToggle]);

  // Atalho de teclado Ctrl+B para toggle
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.key === 'b') {
        event.preventDefault();
        onToggle();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onToggle]);

  // Prevenir scroll do body quando sidebar está aberta em mobile
  useEffect(() => {
    if (isMobile && isOpen) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = 'unset';
      };
    }
  }, [isMobile, isOpen]);

  // Auto-close em mobile após seleção
  const handleItemClick = useCallback((onClick: () => void) => {
    onClick();
    if (isMobile) {
      // Pequeno delay para melhor UX
      setTimeout(() => {
        onToggle();
      }, 150);
    }
  }, [isMobile, onToggle]);

  const sections: SidebarSection[] = [
    {
      title: 'Navegação Principal',
      icon: <Home className="w-5 h-5" />,
      items: [
        {
          id: 'home',
          title: 'Início',
          description: 'Página inicial do sistema',
          icon: <Home className="w-4 h-4" />,
          onClick: () => navigate('/'),
          shortcut: 'Ctrl+H'
        },
        {
          id: 'calculadora',
          title: 'Calculadora',
          description: 'Calculadora de juros compostos',
          icon: <Calculator className="w-4 h-4" />,
          onClick: () => navigate('/'),
          shortcut: 'Ctrl+C'
        }
      ]
    },

    {
      title: 'Sistema',
      icon: <Settings className="w-5 h-5" />,
      items: [
        {
          id: 'sistema-temas',
          title: 'Sistema de Temas',
          description: 'Personalizar aparência',
          icon: <Palette className="w-4 h-4" />,
          onClick: () => navigate('/sistema-temas'),
        },
        {
          id: 'sistema-educacao',
          title: 'Sistema de Educação',
          description: 'Educação financeira',
          icon: <GraduationCap className="w-4 h-4" />,
          onClick: () => navigate('/sistema-educacao'),
        }
      ]
    },
    {
      title: 'Configurações',
      icon: <Settings className="w-5 h-5" />,
      items: [
        {
          id: 'global-settings',
          title: 'Configurações Globais',
          description: 'Preferências gerais do sistema',
          icon: <Settings className="w-4 h-4" />,
          onClick: onGlobalSettingsClick,
          shortcut: 'Ctrl+,'
        },
        {
          id: 'accessibility',
          title: 'Acessibilidade',
          description: 'Opções de acessibilidade',
          icon: <Accessibility className="w-4 h-4" />,
          onClick: onAccessibilityClick,
          shortcut: 'Alt+A'
        },
        {
          id: 'backup',
          title: 'Backup e Restauração',
          description: 'Gerenciar dados e backups',
          icon: <Database className="w-4 h-4" />,
          onClick: onBackupClick,
          shortcut: 'Ctrl+Shift+B'
        }
      ]
    },
    {
      title: 'Ajuda & Suporte',
      icon: <HelpCircle className="w-5 h-5" />,
      items: [
        {
          id: 'help',
          title: 'Ajuda Contextual',
          description: 'Obter ajuda sobre funcionalidades',
          icon: <LifeBuoy className="w-4 h-4" />,
          onClick: onHelpClick,
          shortcut: 'F1'
        },

      ]
    }
  ];

  const toggleSection = (sectionTitle: string) => {
    setExpandedSection(expandedSection === sectionTitle ? null : sectionTitle);
  };

  // Responsive sidebar width
  const getSidebarWidth = () => {
    if (isMobile) return '85vw';
    if (isTablet) return '300px';
    return '320px';
  };

  return (
    <ComponentErrorBoundary>
      {isOpen && (
        <>
          {/* Overlay para mobile */}
          {isMobile && (
            <div
              onClick={onToggle}
              className="fixed inset-0 bg-black bg-opacity-50 z-[9998]"
              aria-hidden="true"
            />
          )}

          {/* Sidebar */}
          <aside
            ref={sidebarRef}
            role="navigation"
            aria-label="Menu de navegação principal"
            aria-hidden={!isOpen}
            className={`
              fixed top-0 left-0 h-screen flex flex-col z-[9999]
              ${isDarkMode ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-200'}
              border-r shadow-2xl
            `}
            style={{
              width: getSidebarWidth(),
              maxWidth: isMobile ? '85vw' : 'none',
              transform: isOpen ? 'translateX(0)' : 'translateX(-100%)',
              transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
            }}
          >
            {/* Header da Sidebar */}
            <header 
              className={`
                flex items-center justify-between p-4 border-b
                ${isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'}
              `}
            >
              <h2 
                className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}
                id="sidebar-title"
              >
                Menu de Navegação
              </h2>
              <button
                onClick={onToggle}
                aria-label="Fechar menu lateral"
                className={`
                  p-2 rounded-lg transition-colors
                  ${isDarkMode 
                    ? 'hover:bg-gray-600 text-gray-400 hover:text-white' 
                    : 'hover:bg-gray-200 text-gray-600 hover:text-gray-900'
                  }
                `}
              >
                <X className="w-5 h-5" />
              </button>
            </header>

            {/* Conteúdo da Sidebar */}
            <nav 
              className="flex-1 overflow-y-auto p-4"
              aria-labelledby="sidebar-title"
            >
              {sections.map((section) => (
                <div key={section.title} className="mb-2">
                  {/* Cabeçalho da Seção */}
                  <button
                    onClick={() => toggleSection(section.title)}
                    aria-expanded={expandedSection === section.title}
                    aria-controls={`section-${section.title.replace(/\s+/g, '-').toLowerCase()}`}
                    className={`
                      w-full flex items-center justify-between p-3 text-left rounded-lg
                      transition-colors mb-1
                      ${isDarkMode 
                        ? 'hover:bg-gray-700 text-white' 
                        : 'hover:bg-gray-100 text-gray-900'
                      }
                    `}
                  >
                    <div className="flex items-center gap-3">
                      <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                        {section.icon}
                      </span>
                      <span className="font-medium">
                        {section.title}
                      </span>
                    </div>
                    <ChevronRight
                      className={`
                        w-4 h-4 text-gray-400 transition-transform
                        ${expandedSection === section.title ? 'rotate-90' : 'rotate-0'}
                      `}
                    />
                  </button>

                  {/* Items da Seção */}
                  <div
                    id={`section-${section.title.replace(/\s+/g, '-').toLowerCase()}`}
                    className={`
                      ml-4 mt-1 space-y-1 overflow-hidden transition-all duration-200
                      ${expandedSection === section.title 
                        ? 'max-h-96 opacity-100' 
                        : 'max-h-0 opacity-0'
                      }
                    `}
                  >
                    {section.items.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => handleItemClick(item.onClick)}
                        className={`
                          w-full flex items-start gap-3 p-3 rounded-lg text-left
                          transition-colors
                          ${isDarkMode 
                            ? 'hover:bg-gray-700 text-white' 
                            : 'hover:bg-gray-50 text-gray-900'
                          }
                        `}
                        aria-describedby={`${item.id}-description`}
                      >
                        <span className={`
                          mt-0.5 flex-shrink-0
                          ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}
                        `}>
                          {item.icon}
                        </span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium truncate">
                              {item.title}
                            </p>
                            {item.shortcut && (
                              <kbd className={`
                                text-xs px-2 py-1 rounded ml-2 flex-shrink-0
                                ${isDarkMode 
                                  ? 'bg-gray-700 text-gray-300' 
                                  : 'bg-gray-100 text-gray-600'
                                }
                              `}>
                                {item.shortcut}
                              </kbd>
                            )}
                          </div>
                          <p 
                            id={`${item.id}-description`}
                            className={`
                              text-xs mt-1 line-clamp-2
                              ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}
                            `}
                          >
                            {item.description}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </nav>

            {/* Footer da Sidebar */}
            <footer className={`
              p-4 border-t text-center
              ${isDarkMode ? 'bg-gray-800 border-gray-600' : 'bg-gray-50 border-gray-200'}
            `}>
              <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                <p>
                  Pressione{' '}
                  <kbd className={`
                    px-2 py-1 rounded font-mono
                    ${isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'}
                  `}>
                    Ctrl+B
                  </kbd>{' '}
                  para alternar
                </p>
                {isMobile && (
                  <p className={`mt-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                    Toque fora para fechar
                  </p>
                )}
              </div>
            </footer>
          </aside>
        </>
      )}
    </ComponentErrorBoundary>
  );
};

export default Sidebar;