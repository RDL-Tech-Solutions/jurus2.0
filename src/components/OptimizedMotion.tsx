import React, { useEffect, useRef } from 'react';
import { motion, MotionProps } from 'framer-motion';
import { useAnimationConfig } from '../hooks/useReducedMotion';

interface OptimizedMotionProps extends MotionProps {
  children: React.ReactNode;
  enableWillChange?: boolean;
  optimizeFor?: 'transform' | 'opacity' | 'both';
  className?: string;
}

/**
 * Componente de animação otimizado que:
 * - Respeita preferências de movimento reduzido
 * - Usa will-change para otimização de performance
 * - Aplica configurações otimizadas automaticamente
 */
export function OptimizedMotion({
  children,
  enableWillChange = true,
  optimizeFor = 'both',
  className = '',
  initial,
  animate,
  exit,
  whileHover,
  whileTap,
  transition,
  ...props
}: OptimizedMotionProps) {
  const elementRef = useRef<HTMLDivElement>(null);
  const { 
    prefersReducedMotion, 
    duration, 
    spring, 
    hoverScale, 
    tapScale,
    enableComplexAnimations 
  } = useAnimationConfig();

  // Gerenciar will-change para otimização
  useEffect(() => {
    const element = elementRef.current;
    if (!element || !enableWillChange || prefersReducedMotion) return;

    const willChangeValue = optimizeFor === 'both' 
      ? 'transform, opacity' 
      : optimizeFor === 'transform' 
        ? 'transform' 
        : 'opacity';

    // Aplicar will-change no início da animação
    element.style.willChange = willChangeValue;

    // Remover will-change após um tempo para evitar uso excessivo de memória
    const cleanup = setTimeout(() => {
      if (element) {
        element.style.willChange = 'auto';
      }
    }, 1000);

    return () => {
      clearTimeout(cleanup);
      if (element) {
        element.style.willChange = 'auto';
      }
    };
  }, [enableWillChange, optimizeFor, prefersReducedMotion]);

  // Configurações otimizadas baseadas na preferência do usuário
  const optimizedTransition = prefersReducedMotion 
    ? { duration: 0.1 }
    : transition || spring;

  const optimizedInitial = prefersReducedMotion 
    ? (typeof initial === 'object' ? { ...initial, transition: { duration: 0 } } : initial)
    : initial;

  const optimizedAnimate = prefersReducedMotion 
    ? (typeof animate === 'object' ? { ...animate, transition: optimizedTransition } : animate)
    : animate;

  const optimizedWhileHover = prefersReducedMotion 
    ? undefined 
    : whileHover || (enableComplexAnimations ? { scale: hoverScale } : undefined);

  const optimizedWhileTap = prefersReducedMotion 
    ? undefined 
    : whileTap || (enableComplexAnimations ? { scale: tapScale } : undefined);

  return (
    <motion.div
      ref={elementRef}
      className={className}
      initial={optimizedInitial}
      animate={optimizedAnimate}
      exit={exit}
      whileHover={optimizedWhileHover}
      whileTap={optimizedWhileTap}
      transition={optimizedTransition}
      {...props}
    >
      {children}
    </motion.div>
  );
}

/**
 * Componente específico para animações de lista otimizadas
 */
export function OptimizedStaggerContainer({
  children,
  className = '',
  staggerDelay,
  ...props
}: {
  children: React.ReactNode;
  className?: string;
  staggerDelay?: number;
} & MotionProps) {
  const { staggerDelay: optimizedStaggerDelay, prefersReducedMotion } = useAnimationConfig();

  const containerVariants = {
    hidden: { opacity: prefersReducedMotion ? 1 : 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: staggerDelay || optimizedStaggerDelay,
        delayChildren: prefersReducedMotion ? 0 : 0.1
      }
    }
  };

  return (
    <OptimizedMotion
      className={className}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      optimizeFor="opacity"
      {...props}
    >
      {children}
    </OptimizedMotion>
  );
}

/**
 * Componente para itens de lista otimizados
 */
export function OptimizedStaggerItem({
  children,
  className = '',
  ...props
}: {
  children: React.ReactNode;
  className?: string;
} & MotionProps) {
  const { prefersReducedMotion, duration } = useAnimationConfig();

  const itemVariants = {
    hidden: { 
      opacity: prefersReducedMotion ? 1 : 0, 
      y: prefersReducedMotion ? 0 : 20 
    },
    visible: {
      opacity: 1,
      y: 0
    }
  };

  return (
    <OptimizedMotion
      className={className}
      variants={itemVariants}
      optimizeFor="both"
      transition={{ duration, ease: "easeOut" }}
      {...props}
    >
      {children}
    </OptimizedMotion>
  );
}