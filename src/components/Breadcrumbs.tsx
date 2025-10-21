import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Home, MoreHorizontal } from 'lucide-react';

export interface BreadcrumbItem {
  label: string;
  path: string;
  icon?: React.ReactNode;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  maxItems?: number;
  className?: string;
  onItemClick?: (item: BreadcrumbItem) => void;
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({
  items,
  maxItems = 3,
  className = '',
  onItemClick
}) => {
  const [showTooltip, setShowTooltip] = useState<string | null>(null);
  const [showCollapsed, setShowCollapsed] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);

  // Monitorar largura do container para responsividade
  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
      }
    };

    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  // Determinar se deve mostrar breadcrumbs colapsados
  const shouldCollapse = items.length > maxItems || containerWidth < 400;

  // Função para truncar texto baseado na largura disponível
  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength - 3) + '...';
  };

  // Calcular maxLength baseado na largura do container
  const getMaxLength = () => {
    if (containerWidth < 300) return 8;
    if (containerWidth < 500) return 12;
    if (containerWidth < 700) return 16;
    return 20;
  };

  // Renderizar breadcrumbs normais
  const renderNormalBreadcrumbs = () => {
    const maxLength = getMaxLength();
    
    return items.map((item, index) => (
      <div key={`${item.path}-${index}`} className="flex items-center min-w-0">
        {index > 0 && (
          <ChevronRight className="mx-1 sm:mx-2 w-3 h-3 sm:w-4 sm:h-4 text-gray-400 dark:text-gray-600 flex-shrink-0" />
        )}
        
        <div className="relative min-w-0">
          <button
            onClick={() => onItemClick?.(item)}
            onMouseEnter={() => setShowTooltip(`${item.path}-${index}`)}
            onMouseLeave={() => setShowTooltip(null)}
            className={`
              flex items-center gap-1 sm:gap-2 min-w-0 transition-colors duration-200 rounded px-1 sm:px-2 py-1
              ${index === items.length - 1
                ? 'text-blue-600 dark:text-blue-400 font-medium cursor-default'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer'
              }
            `}
            disabled={index === items.length - 1}
          >
            {index === 0 && item.icon && (
              <span className="flex-shrink-0 w-3 h-3 sm:w-4 sm:h-4">
                {item.icon}
              </span>
            )}
            <span className="truncate text-xs sm:text-sm">
              {truncateText(item.label, maxLength)}
            </span>
          </button>

          {/* Tooltip */}
          <AnimatePresence>
            {showTooltip === `${item.path}-${index}` && item.label.length > maxLength && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 dark:bg-gray-700 text-white text-xs rounded shadow-lg whitespace-nowrap z-50"
              >
                {item.label}
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900 dark:border-t-gray-700"></div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    ));
  };

  // Renderizar breadcrumbs colapsados
  const renderCollapsedBreadcrumbs = () => {
    if (items.length <= 2) return renderNormalBreadcrumbs();

    const firstItem = items[0];
    const lastItem = items[items.length - 1];
    const middleItems = items.slice(1, -1);
    const maxLength = getMaxLength();

    return (
      <>
        {/* Primeiro item */}
        <div className="flex items-center min-w-0">
          <button
            onClick={() => onItemClick?.(firstItem)}
            className="flex items-center gap-1 sm:gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors rounded px-1 sm:px-2 py-1"
          >
            {firstItem.icon && (
              <span className="flex-shrink-0 w-3 h-3 sm:w-4 sm:h-4">
                {firstItem.icon}
              </span>
            )}
            <span className="truncate text-xs sm:text-sm">
              {truncateText(firstItem.label, maxLength)}
            </span>
          </button>
        </div>

        {/* Separador */}
        <ChevronRight className="mx-1 sm:mx-2 w-3 h-3 sm:w-4 sm:h-4 text-gray-400 dark:text-gray-600 flex-shrink-0" />

        {/* Items colapsados */}
        <div className="relative">
          <button
            onClick={() => setShowCollapsed(!showCollapsed)}
            onMouseEnter={() => setShowTooltip('collapsed')}
            onMouseLeave={() => setShowTooltip(null)}
            className="flex items-center gap-1 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors rounded px-1 sm:px-2 py-1"
          >
            <MoreHorizontal className="w-3 h-3 sm:w-4 sm:h-4" />
          </button>

          {/* Dropdown com items colapsados */}
          <AnimatePresence>
            {showCollapsed && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                className="absolute top-full left-0 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg py-1 z-50 min-w-48"
              >
                {middleItems.map((item, index) => (
                  <button
                    key={`collapsed-${item.path}-${index}`}
                    onClick={() => {
                      onItemClick?.(item);
                      setShowCollapsed(false);
                    }}
                    className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    {item.label}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Tooltip para items colapsados */}
          <AnimatePresence>
            {showTooltip === 'collapsed' && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 dark:bg-gray-700 text-white text-xs rounded shadow-lg whitespace-nowrap z-50"
              >
                {middleItems.length} item{middleItems.length > 1 ? 's' : ''} oculto{middleItems.length > 1 ? 's' : ''}
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900 dark:border-t-gray-700"></div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Separador */}
        <ChevronRight className="mx-1 sm:mx-2 w-3 h-3 sm:w-4 sm:h-4 text-gray-400 dark:text-gray-600 flex-shrink-0" />

        {/* Último item */}
        <div className="flex items-center min-w-0">
          <span className="text-blue-600 dark:text-blue-400 font-medium text-xs sm:text-sm truncate px-1 sm:px-2 py-1">
            {truncateText(lastItem.label, maxLength)}
          </span>
        </div>
      </>
    );
  };

  // Fechar dropdown ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowCollapsed(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (items.length === 0) return null;

  return (
    <nav
      ref={containerRef}
      className={`flex items-center gap-0 text-xs sm:text-sm text-gray-600 dark:text-gray-400 overflow-hidden ${className}`}
      aria-label="Breadcrumb"
    >
      <div className="flex items-center min-w-0 flex-1">
        {shouldCollapse ? renderCollapsedBreadcrumbs() : renderNormalBreadcrumbs()}
      </div>
    </nav>
  );
};

export default Breadcrumbs;