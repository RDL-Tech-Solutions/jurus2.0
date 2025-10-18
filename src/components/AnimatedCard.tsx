import { motion } from 'framer-motion';
import { clsx } from 'clsx';
import { useAnimationConfig } from '../hooks/useReducedMotion';

interface AnimatedCardProps {
  children: React.ReactNode;
  variant?: 'default' | 'elevated' | 'outlined' | 'glass' | 'gradient';
  size?: 'sm' | 'md' | 'lg';
  hover?: boolean;
  clickable?: boolean;
  className?: string;
  onClick?: () => void;
}

const variantClasses = {
  default: 'bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700',
  elevated: 'bg-white dark:bg-gray-900 shadow-lg border border-gray-200 dark:border-gray-700',
  outlined: 'bg-transparent border-2 border-gray-300 dark:border-gray-600',
  glass: 'bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border border-white/20 dark:border-gray-700/50',
  gradient: 'bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-900 border border-gray-200 dark:border-gray-700'
};

const sizeClasses = {
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8'
};

export function AnimatedCard({
  children,
  variant = 'default',
  size = 'md',
  hover = true,
  clickable = false,
  className = '',
  onClick
}: AnimatedCardProps) {
  const isInteractive = hover || clickable || onClick;
  const { 
    prefersReducedMotion, 
    spring, 
    hoverScale, 
    tapScale,
    enableComplexAnimations 
  } = useAnimationConfig();

  // Criar variantes dinâmicas baseadas na configuração
  const cardVariants = {
    rest: {
      scale: 1,
      y: 0,
      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
      transition: spring
    },
    hover: {
      scale: hoverScale,
      y: prefersReducedMotion ? 0 : -4,
      boxShadow: prefersReducedMotion 
        ? '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
        : '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      transition: spring
    },
    tap: {
      scale: tapScale,
      y: 0,
      transition: spring
    }
  };

  const glowVariants = {
    rest: {
      opacity: 0,
      scale: prefersReducedMotion ? 1 : 0.8
    },
    hover: {
      opacity: prefersReducedMotion ? 0 : 0.1,
      scale: 1,
      transition: spring
    }
  };

  return (
    <motion.div
      className={clsx(
        'relative rounded-xl overflow-hidden',
        variantClasses[variant],
        sizeClasses[size],
        isInteractive && 'cursor-pointer',
        className
      )}
      variants={isInteractive ? cardVariants : undefined}
      initial="rest"
      whileHover={isInteractive ? "hover" : undefined}
      whileTap={isInteractive ? "tap" : undefined}
      onClick={onClick}
    >
      {/* Glow effect for interactive cards */}
      {isInteractive && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 rounded-xl"
          variants={glowVariants}
          initial="rest"
          whileHover="hover"
          style={{ zIndex: -1 }}
        />
      )}

      {/* Shine effect */}
      {isInteractive && enableComplexAnimations && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 -translate-x-full"
          variants={{
            rest: { x: '-100%' },
            hover: { x: prefersReducedMotion ? '-100%' : '100%' }
          }}
          transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.6, ease: 'easeInOut' }}
        />
      )}

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  );
}