import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { transitions, fadeInVariants } from '../utils/animations';
import { clsx } from 'clsx';

interface AnimatedInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  error?: string;
  hint?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'filled' | 'outline';
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  loading?: boolean;
}

const baseClasses = 'w-full transition-all duration-200 focus:outline-none';

const variantClasses = {
  default: 'border-b-2 border-gray-300 bg-transparent focus:border-blue-500 pb-1',
  filled: 'border border-gray-300 bg-gray-50 rounded-lg focus:border-blue-500 focus:bg-white',
  outline: 'border-2 border-gray-300 bg-transparent rounded-lg focus:border-blue-500',
};

const sizeClasses = {
  sm: 'px-3 py-2 text-sm',
  md: 'px-4 py-3 text-base',
  lg: 'px-5 py-4 text-lg',
};

export const AnimatedInput: React.FC<AnimatedInputProps> = ({
  label,
  error,
  hint,
  size = 'md',
  variant = 'outline',
  icon,
  iconPosition = 'left',
  loading = false,
  className,
  value,
  onChange,
  onFocus,
  onBlur,
  ...props
}) => {
  const [isFocused, setIsFocused] = React.useState(false);
  const [hasValue, setHasValue] = React.useState(!!value);

  React.useEffect(() => {
    setHasValue(!!value);
  }, [value]);

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(true);
    onFocus?.(e);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(false);
    onBlur?.(e);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHasValue(!!e.target.value);
    onChange?.(e);
  };

  const inputClasses = clsx(
    baseClasses,
    variantClasses[variant],
    sizeClasses[size],
    {
      'pl-10': icon && iconPosition === 'left' && size === 'md',
      'pr-10': icon && iconPosition === 'right' && size === 'md',
      'pl-8': icon && iconPosition === 'left' && size === 'sm',
      'pr-8': icon && iconPosition === 'right' && size === 'sm',
      'pl-12': icon && iconPosition === 'left' && size === 'lg',
      'pr-12': icon && iconPosition === 'right' && size === 'lg',
      'border-red-500 focus:border-red-500': error,
      'border-green-500 focus:border-green-500': !error && hasValue && !isFocused,
    },
    className
  );

  const containerClasses = 'relative';

  return (
    <motion.div
      className={containerClasses}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={transitions.medium}
    >
      {/* Label flutuante */}
      {label && (
        <motion.label
          className={clsx(
            'absolute left-0 transition-all duration-200 pointer-events-none',
            {
              'text-xs text-blue-500 -top-2': isFocused || hasValue,
              'text-gray-500': !isFocused && !hasValue,
              'text-red-500': error,
              'top-3': !isFocused && !hasValue && size === 'md',
              'top-2': !isFocused && !hasValue && size === 'sm',
              'top-4': !isFocused && !hasValue && size === 'lg',
            }
          )}
          animate={{
            scale: isFocused || hasValue ? 0.85 : 1,
            y: isFocused || hasValue ? -8 : 0,
          }}
          transition={transitions.fast}
        >
          {label}
        </motion.label>
      )}

      {/* Container do input */}
      <div className="relative">
        {/* Ícone */}
        {icon && (
          <motion.div
            className={clsx(
              'absolute top-1/2 transform -translate-y-1/2 text-gray-400',
              {
                'left-3': iconPosition === 'left',
                'right-3': iconPosition === 'right',
                'text-blue-500': isFocused,
                'text-red-500': error,
              }
            )}
            animate={{
              scale: isFocused ? 1.1 : 1,
              color: error ? '#ef4444' : isFocused ? '#3b82f6' : '#9ca3af',
            }}
            transition={transitions.fast}
          >
            {icon}
          </motion.div>
        )}

        {/* Input */}
        <motion.input
          className={inputClasses}
          value={value}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          whileFocus={{
            scale: 1.01,
          }}
          transition={transitions.fast}
          {...(props as any)}
        />

        {/* Loading spinner */}
        {loading && (
          <motion.div
            className="absolute right-3 top-1/2 transform -translate-y-1/2"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            transition={transitions.fast}
          >
            <motion.div
              className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full"
              animate={{ rotate: 360 }}
              transition={{
                duration: 1,
                repeat: Infinity,
                ease: 'linear',
              }}
            />
          </motion.div>
        )}
      </div>

      {/* Linha de foco animada */}
      {variant === 'default' && (
        <motion.div
          className="absolute bottom-0 left-0 h-0.5 bg-blue-500"
          initial={{ width: 0 }}
          animate={{ width: isFocused ? '100%' : 0 }}
          transition={transitions.fast}
        />
      )}

      {/* Mensagens de erro e dica */}
      <AnimatePresence mode="wait">
        {error && (
          <motion.div
            key="error"
            className="mt-1 text-sm text-red-500"
            variants={fadeInVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {error}
          </motion.div>
        )}
        {!error && hint && (
          <motion.div
            key="hint"
            className="mt-1 text-sm text-gray-500"
            variants={fadeInVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {hint}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default AnimatedInput;