import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LoadingSpinner } from './LoadingSpinner';
import { CheckCircle, AlertTriangle, XCircle } from 'lucide-react';
import { useAnimationConfig } from '../hooks/useReducedMotion';

interface StateTransitionProps {
  state: 'idle' | 'loading' | 'success' | 'error';
  loadingText?: string;
  successText?: string;
  errorText?: string;
  children?: React.ReactNode;
  className?: string;
}

// Variantes movidas para dentro da função para acessar prefersReducedMotion

export function StateTransition({
  state,
  loadingText = 'Carregando...',
  successText = 'Sucesso!',
  errorText = 'Erro!',
  children,
  className = ''
}: StateTransitionProps) {
  const { prefersReducedMotion, spring } = useAnimationConfig();

  const stateVariants = {
    idle: {
      opacity: 1,
      scale: 1,
      transition: prefersReducedMotion ? { duration: 0.1 } : { duration: 0.3 }
    },
    loading: {
      opacity: 1,
      scale: 1,
      transition: prefersReducedMotion ? { duration: 0.1 } : { duration: 0.3 }
    },
    success: {
      opacity: 1,
      scale: 1,
      transition: prefersReducedMotion ? { duration: 0.1 } : { duration: 0.3 }
    },
    error: {
      opacity: 1,
      scale: 1,
      transition: prefersReducedMotion ? { duration: 0.1 } : { duration: 0.3 }
    }
  };

  const contentVariants = {
    enter: {
      opacity: 0,
      y: prefersReducedMotion ? 0 : 20,
      scale: prefersReducedMotion ? 1 : 0.9
    },
    center: {
      opacity: 1,
      y: 0,
      scale: 1
    },
    exit: {
      opacity: 0,
      y: prefersReducedMotion ? 0 : -20,
      scale: prefersReducedMotion ? 1 : 0.9
    }
  };

  const iconVariants = {
    enter: {
      scale: prefersReducedMotion ? 1 : 0,
      rotate: prefersReducedMotion ? 0 : -180
    },
    center: {
      scale: 1,
      rotate: 0
    },
    exit: {
      scale: prefersReducedMotion ? 1 : 0,
      rotate: prefersReducedMotion ? 0 : 180
    }
  };

  const renderStateContent = () => {
    switch (state) {
      case 'loading':
        return (
          <motion.div
            key="loading"
            variants={contentVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={prefersReducedMotion ? { duration: 0.1 } : spring}
            className="flex flex-col items-center justify-center space-y-4 py-8"
          >
            <LoadingSpinner size="lg" />
            <motion.p
              className="text-gray-600 dark:text-gray-400"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {loadingText}
            </motion.p>
          </motion.div>
        );

      case 'success':
        return (
          <motion.div
            key="success"
            variants={contentVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={prefersReducedMotion ? { duration: 0.1 } : spring}
            className="flex flex-col items-center justify-center space-y-4 py-8"
          >
            <motion.div
              variants={iconVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={prefersReducedMotion ? { duration: 0.1 } : spring}
              className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center"
            >
              <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
            </motion.div>
            <motion.p
              className="text-green-600 dark:text-green-400 font-medium"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              {successText}
            </motion.p>
          </motion.div>
        );

      case 'error':
        return (
          <motion.div
            key="error"
            variants={contentVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={prefersReducedMotion ? { duration: 0.1 } : spring}
            className="flex flex-col items-center justify-center space-y-4 py-8"
          >
            <motion.div
              variants={iconVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={prefersReducedMotion ? { duration: 0.1 } : spring}
              className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center"
            >
              <XCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
            </motion.div>
            <motion.p
              className="text-red-600 dark:text-red-400 font-medium"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              {errorText}
            </motion.p>
          </motion.div>
        );

      case 'idle':
      default:
        return (
          <motion.div
            key="idle"
            variants={contentVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={prefersReducedMotion ? { duration: 0.1 } : spring}
          >
            {children}
          </motion.div>
        );
    }
  };

  return (
    <motion.div
      className={className}
      variants={stateVariants}
      animate={state}
    >
      <AnimatePresence mode="wait">
        {renderStateContent()}
      </AnimatePresence>
    </motion.div>
  );
}