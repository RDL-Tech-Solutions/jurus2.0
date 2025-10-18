import { motion } from 'framer-motion';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  color?: string;
  className?: string;
  variant?: 'spinner' | 'dots' | 'pulse' | 'bars';
}

const sizeMap = {
  sm: 'w-4 h-4',
  md: 'w-6 h-6',
  lg: 'w-8 h-8',
  xl: 'w-12 h-12'
};

const spinnerVariants = {
  animate: {
    rotate: 360
  }
};

const dotsVariants = {
  animate: {}
};

const dotVariants = {
  animate: {
    y: [0, -10, 0]
  }
};

const pulseVariants = {
  animate: {
    scale: [1, 1.2, 1],
    opacity: [1, 0.7, 1]
  }
};

const barsVariants = {
  animate: {}
};

const barVariants = {
  animate: {
    scaleY: [1, 2, 1]
  }
};

export function LoadingSpinner({ 
  size = 'md', 
  color = 'text-blue-600', 
  className = '',
  variant = 'spinner'
}: LoadingSpinnerProps) {
  const sizeClass = sizeMap[size];

  if (variant === 'spinner') {
    return (
      <motion.div
        className={`${sizeClass} ${color} ${className}`}
        variants={spinnerVariants}
        animate="animate"
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: "linear"
        }}
      >
        <svg
          className="w-full h-full"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeDasharray="31.416"
            strokeDashoffset="31.416"
            className="opacity-25"
          />
          <circle
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeDasharray="31.416"
            strokeDashoffset="23.562"
            className="opacity-75"
          />
        </svg>
      </motion.div>
    );
  }

  if (variant === 'dots') {
    return (
      <motion.div
        className={`flex space-x-1 ${className}`}
        variants={dotsVariants}
        animate="animate"
        transition={{
          staggerChildren: 0.2,
          repeat: Infinity,
          repeatType: "reverse" as const
        }}
      >
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className={`w-2 h-2 rounded-full ${color.replace('text-', 'bg-')}`}
            variants={dotVariants}
            transition={{
              duration: 0.6,
              ease: "easeInOut"
            }}
          />
        ))}
      </motion.div>
    );
  }

  if (variant === 'pulse') {
    return (
      <motion.div
        className={`${sizeClass} rounded-full ${color.replace('text-', 'bg-')} ${className}`}
        variants={pulseVariants}
        animate="animate"
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
    );
  }

  if (variant === 'bars') {
    return (
      <motion.div
        className={`flex space-x-1 ${className}`}
        variants={barsVariants}
        animate="animate"
        transition={{
          staggerChildren: 0.1,
          repeat: Infinity,
          repeatType: "reverse" as const
        }}
      >
        {[0, 1, 2, 3].map((i) => (
          <motion.div
            key={i}
            className={`w-1 h-4 ${color.replace('text-', 'bg-')} rounded-full`}
            variants={barVariants}
            transition={{
              duration: 0.8,
              ease: "easeInOut"
            }}
          />
        ))}
      </motion.div>
    );
  }

  return null;
}