import { Variants, Transition } from 'framer-motion';

// Configurações de transição otimizadas para performance
export const transitions = {
  // Transições rápidas para micro-interações
  fast: {
    type: 'tween' as const,
    duration: 0.15,
    ease: 'easeOut',
  } as Transition,
  
  // Transições médias para elementos principais
  medium: {
    type: 'tween' as const,
    duration: 0.3,
    ease: [0.4, 0, 0.2, 1], // Material Design easing
  } as Transition,
  
  // Transições suaves para animações de entrada
  smooth: {
    type: 'tween' as const,
    duration: 0.5,
    ease: [0.25, 0.46, 0.45, 0.94], // Ease-out-quad
  } as Transition,
  
  // Transições com spring para elementos interativos
  spring: {
    type: 'spring' as const,
    stiffness: 300,
    damping: 30,
  } as Transition,
  
  // Transições suaves com spring
  springSmooth: {
    type: 'spring' as const,
    stiffness: 100,
    damping: 20,
  } as Transition,
};

// Variantes de animação para fade-in
export const fadeInVariants: Variants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: transitions.medium,
  },
  exit: {
    opacity: 0,
    transition: transitions.fast,
  },
};

// Variantes para slide-in de baixo
export const slideUpVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: transitions.smooth,
  },
  exit: {
    opacity: 0,
    y: -10,
    transition: transitions.fast,
  },
};

// Variantes para slide-in da esquerda
export const slideInLeftVariants: Variants = {
  hidden: {
    opacity: 0,
    x: -20,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: transitions.smooth,
  },
  exit: {
    opacity: 0,
    x: -10,
    transition: transitions.fast,
  },
};

// Variantes para slide-in da direita
export const slideInRightVariants: Variants = {
  hidden: {
    opacity: 0,
    x: 20,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: transitions.smooth,
  },
  exit: {
    opacity: 0,
    x: 10,
    transition: transitions.fast,
  },
};

// Variantes para scale-in
export const scaleInVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.95,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: transitions.springSmooth,
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    transition: transitions.fast,
  },
};

// Variantes para animações staggered (escalonadas)
export const staggerContainerVariants: Variants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      staggerChildren: 0.05,
      staggerDirection: -1,
    },
  },
};

// Variantes para itens em listas staggered
export const staggerItemVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: transitions.medium,
  },
  exit: {
    opacity: 0,
    y: -10,
    transition: transitions.fast,
  },
};

// Variantes para hover em botões
export const buttonHoverVariants: Variants = {
  rest: {
    scale: 1,
  },
  hover: {
    scale: 1.02,
    transition: transitions.fast,
  },
  tap: {
    scale: 0.98,
    transition: transitions.fast,
  },
};

// Variantes para hover em cards
export const cardHoverVariants: Variants = {
  rest: {
    scale: 1,
    y: 0,
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  },
  hover: {
    scale: 1.01,
    y: -2,
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    transition: transitions.medium,
  },
};

// Variantes para loading spinner
export const spinnerVariants: Variants = {
  animate: {
    rotate: 360,
    transition: {
      duration: 1,
      repeat: Infinity,
      ease: 'linear',
    },
  },
};

// Variantes para pulse (indicador de loading)
export const pulseVariants: Variants = {
  animate: {
    scale: [1, 1.05, 1],
    opacity: [0.7, 1, 0.7],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
};

// Variantes para modal/overlay
export const modalVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.95,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: transitions.medium,
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    transition: transitions.fast,
  },
};

// Variantes para backdrop
export const backdropVariants: Variants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: transitions.medium,
  },
  exit: {
    opacity: 0,
    transition: transitions.fast,
  },
};

// Variantes para tooltip
export const tooltipVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.95,
    y: 5,
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: transitions.fast,
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: 5,
    transition: transitions.fast,
  },
};

// Função para detectar preferência de movimento reduzido
export const getReducedMotionVariants = (variants: Variants): Variants => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  
  if (prefersReducedMotion) {
    // Retorna variantes simplificadas sem animações de movimento
    return {
      hidden: { opacity: 0 },
      visible: { opacity: 1, transition: { duration: 0.2 } },
      exit: { opacity: 0, transition: { duration: 0.1 } },
    };
  }
  
  return variants;
};

// Hook para detectar preferência de movimento reduzido
export const useReducedMotion = (): boolean => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};