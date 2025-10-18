import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx } from 'clsx';
import { useAnimationConfig } from '../hooks/useReducedMotion';

interface AnimatedTooltipProps {
  children: React.ReactNode;
  content: React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  delay?: number;
  disabled?: boolean;
  className?: string;
}

const positionClasses = {
  top: 'bottom-full left-1/2 transform -translate-x-1/2 mb-2',
  bottom: 'top-full left-1/2 transform -translate-x-1/2 mt-2',
  left: 'right-full top-1/2 transform -translate-y-1/2 mr-2',
  right: 'left-full top-1/2 transform -translate-y-1/2 ml-2'
};

const arrowClasses = {
  top: 'top-full left-1/2 transform -translate-x-1/2 border-l-transparent border-r-transparent border-b-transparent border-t-gray-900',
  bottom: 'bottom-full left-1/2 transform -translate-x-1/2 border-l-transparent border-r-transparent border-t-transparent border-b-gray-900',
  left: 'left-full top-1/2 transform -translate-y-1/2 border-t-transparent border-b-transparent border-r-transparent border-l-gray-900',
  right: 'right-full top-1/2 transform -translate-y-1/2 border-t-transparent border-b-transparent border-l-transparent border-r-gray-900'
};

// Mover para dentro da função para acessar prefersReducedMotion

const getInitialPosition = (position: string) => {
  switch (position) {
    case 'top':
      return { y: 10 };
    case 'bottom':
      return { y: -10 };
    case 'left':
      return { x: 10 };
    case 'right':
      return { x: -10 };
    default:
      return { y: 10 };
  }
};

export function AnimatedTooltip({
  children,
  content,
  position = 'top',
  delay = 500,
  disabled = false,
  className = ''
}: AnimatedTooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout>();
  const containerRef = useRef<HTMLDivElement>(null);
  const { prefersReducedMotion, spring } = useAnimationConfig();

  const tooltipVariants = {
    hidden: { 
      opacity: 0,
      scale: prefersReducedMotion ? 1 : 0.8,
      y: 0
    },
    visible: { 
      opacity: 1,
      scale: 1,
      y: 0,
      transition: prefersReducedMotion ? { duration: 0.1 } : spring
    }
  };

  const showTooltip = () => {
    if (disabled) return;
    
    timeoutRef.current = setTimeout(() => {
      setIsVisible(true);
    }, delay);
  };

  const hideTooltip = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsVisible(false);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const initialPosition = getInitialPosition(position);

  return (
    <div
      ref={containerRef}
      className={`relative inline-block ${className}`}
      onMouseEnter={showTooltip}
      onMouseLeave={hideTooltip}
      onFocus={showTooltip}
      onBlur={hideTooltip}
    >
      {children}
      
      <AnimatePresence>
        {isVisible && (
          <motion.div
            className={`absolute z-50 ${positionClasses[position]}`}
            variants={{
              hidden: { 
                opacity: 0,
                scale: prefersReducedMotion ? 1 : 0.8,
                ...(prefersReducedMotion ? {} : initialPosition)
              },
              visible: tooltipVariants.visible
            }}
            initial="hidden"
            animate="visible"
            exit="hidden"
            style={{ pointerEvents: 'none' }}
          >
            {/* Tooltip content */}
            <motion.div
              className="px-3 py-2 text-sm text-white bg-gray-900 dark:bg-gray-700 rounded-lg shadow-lg whitespace-nowrap max-w-xs"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              {content}
            </motion.div>
            
            {/* Arrow */}
            <motion.div
              className={`absolute w-0 h-0 border-4 ${arrowClasses[position]}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}