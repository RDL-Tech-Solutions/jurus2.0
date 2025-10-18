import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, AlertTriangle, Info, XCircle, TrendingUp, Calculator, Target } from 'lucide-react';
import { useAnimationConfig } from '../hooks/useReducedMotion';

interface ContextualNotificationProps {
  type: 'calculation' | 'success' | 'warning' | 'error' | 'info' | 'growth' | 'goal';
  title: string;
  message?: string;
  value?: string;
  isVisible: boolean;
  onClose?: () => void;
  duration?: number;
}

const typeConfig = {
  calculation: {
    icon: Calculator,
    colors: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-200',
    iconColor: 'text-blue-600 dark:text-blue-400'
  },
  success: {
    icon: CheckCircle,
    colors: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-800 dark:text-green-200',
    iconColor: 'text-green-600 dark:text-green-400'
  },
  warning: {
    icon: AlertTriangle,
    colors: 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800 text-yellow-800 dark:text-yellow-200',
    iconColor: 'text-yellow-600 dark:text-yellow-400'
  },
  error: {
    icon: XCircle,
    colors: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-800 dark:text-red-200',
    iconColor: 'text-red-600 dark:text-red-400'
  },
  info: {
    icon: Info,
    colors: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-200',
    iconColor: 'text-blue-600 dark:text-blue-400'
  },
  growth: {
    icon: TrendingUp,
    colors: 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200',
    iconColor: 'text-emerald-600 dark:text-emerald-400'
  },
  goal: {
    icon: Target,
    colors: 'bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800 text-purple-800 dark:text-purple-200',
    iconColor: 'text-purple-600 dark:text-purple-400'
  }
};

// Variantes movidas para dentro da função para acessar prefersReducedMotion

export function ContextualNotification({
  type,
  title,
  message,
  value,
  isVisible,
  onClose,
  duration = 5000
}: ContextualNotificationProps) {
  const config = typeConfig[type];
  const Icon = config.icon;
  const { prefersReducedMotion, spring } = useAnimationConfig();

  const notificationVariants = {
    hidden: {
      opacity: 0,
      y: prefersReducedMotion ? 0 : -50,
      scale: prefersReducedMotion ? 1 : 0.9
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: prefersReducedMotion ? { duration: 0.1 } : spring
    },
    exit: {
      opacity: 0,
      y: prefersReducedMotion ? 0 : -50,
      scale: prefersReducedMotion ? 1 : 0.9,
      transition: prefersReducedMotion ? { duration: 0.05 } : { duration: 0.2 }
    }
  };

  const iconVariants = {
    hidden: { 
      scale: prefersReducedMotion ? 1 : 0, 
      rotate: prefersReducedMotion ? 0 : -180 
    },
    visible: { 
      scale: 1, 
      rotate: 0,
      transition: prefersReducedMotion ? { duration: 0.1 } : {
        ...spring,
        delay: 0.1
      }
    }
  };

  const valueVariants = {
    hidden: { 
      opacity: 0, 
      x: prefersReducedMotion ? 0 : 20 
    },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: prefersReducedMotion ? { duration: 0.1 } : {
        delay: 0.2,
        duration: 0.3
      }
    }
  };

  // Auto close
  React.useEffect(() => {
    if (isVisible && duration > 0 && onClose) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className={`
            fixed top-4 right-4 z-50 max-w-sm w-full
            ${config.colors} border rounded-lg shadow-lg p-4
            backdrop-blur-sm
          `}
          variants={notificationVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          layout
        >
          <div className="flex items-start space-x-3">
            <motion.div
              variants={iconVariants}
              initial="hidden"
              animate="visible"
              className="flex-shrink-0"
            >
              <Icon className={`w-6 h-6 ${config.iconColor}`} />
            </motion.div>
            
            <div className="flex-1 min-w-0">
              <motion.h4
                className="text-sm font-semibold"
                initial={{ opacity: 0, y: prefersReducedMotion ? 0 : -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={prefersReducedMotion ? { duration: 0.1 } : { delay: 0.1 }}
              >
                {title}
              </motion.h4>
              
              {message && (
                <motion.p
                  className="mt-1 text-sm opacity-90"
                  initial={{ opacity: 0, y: prefersReducedMotion ? 0 : -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={prefersReducedMotion ? { duration: 0.1 } : { delay: 0.15 }}
                >
                  {message}
                </motion.p>
              )}
              
              {value && (
                <motion.div
                  className="mt-2 text-lg font-bold"
                  variants={valueVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {value}
                </motion.div>
              )}
            </div>
            
            {onClose && (
              <motion.button
                onClick={onClose}
                className="flex-shrink-0 opacity-70 hover:opacity-100 transition-opacity"
                whileHover={prefersReducedMotion ? {} : { scale: 1.1 }}
                whileTap={prefersReducedMotion ? {} : { scale: 0.9 }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.7 }}
                transition={prefersReducedMotion ? { duration: 0.1 } : { delay: 0.3 }}
              >
                <XCircle className="w-4 h-4" />
              </motion.button>
            )}
          </div>
          
          {/* Progress bar */}
          {duration > 0 && (
            <motion.div
              className="absolute bottom-0 left-0 h-1 bg-current opacity-30 rounded-b-lg"
              initial={{ width: "100%" }}
              animate={{ width: "0%" }}
              transition={{ duration: duration / 1000, ease: "linear" }}
            />
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}