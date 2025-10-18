import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { buttonHoverVariants, spinnerVariants } from '../utils/animations';
import { clsx } from 'clsx';
import { RippleEffect } from './RippleEffect';

interface AnimatedButtonProps extends Omit<HTMLMotionProps<'button'>, 'variants'> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'gradient';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  className?: string;
}

const baseClasses = 'relative overflow-hidden font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

const variantClasses = {
  primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
  secondary: 'bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500',
  outline: 'border-2 border-blue-600 text-blue-600 hover:bg-blue-50 focus:ring-blue-500',
  ghost: 'text-blue-600 hover:bg-blue-50 focus:ring-blue-500',
  danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
  gradient: 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 focus:ring-purple-500',
};

const sizeClasses = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-6 py-3 text-lg',
};

export const AnimatedButton: React.FC<AnimatedButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  className,
  onClick,
  ...props
}) => {
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled || loading) return;
    onClick?.(event);
  };

  return (
    <RippleEffect
      disabled={disabled || loading}
      color={variant === 'primary' ? 'rgba(255, 255, 255, 0.3)' : 'rgba(59, 130, 246, 0.3)'}
    >
      <motion.button
        className={clsx(
          baseClasses,
          variantClasses[variant],
          sizeClasses[size],
          disabled && 'opacity-50 cursor-not-allowed',
          'w-full h-full',
          className
        )}
        variants={buttonHoverVariants}
        initial="rest"
        whileHover={!disabled && !loading ? "hover" : "rest"}
        whileTap={!disabled && !loading ? "tap" : "rest"}
        transition={{ type: "spring", stiffness: 400, damping: 10 }}
        disabled={disabled || loading}
        onClick={handleClick}
        {...props}
      >
      {/* Conteúdo do botão */}
      <span className={clsx('flex items-center justify-center gap-2', loading && 'opacity-0')}>
        {children}
      </span>

      {/* Loading spinner */}
      {loading && (
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
        >
          <motion.div
            className="w-5 h-5 border-2 border-current border-t-transparent rounded-full"
            animate={{ rotate: 360 }}
            transition={{
              duration: 1,
              repeat: Infinity,
              ease: 'linear',
            }}
          />
        </motion.div>
      )}

      {/* Efeito de brilho no hover */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 -translate-x-full"
        variants={{
          rest: { x: '-100%' },
          hover: { x: '100%' },
        }}
        transition={{ duration: 0.6, ease: 'easeInOut' }}
      />
    </motion.button>
  </RippleEffect>
  );
};

export default AnimatedButton;