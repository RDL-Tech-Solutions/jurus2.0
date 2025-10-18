import { motion } from 'framer-motion';
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { LoadingState } from '../hooks/useLoadingStates';

interface LoadingProgressProps {
  loadingState: LoadingState;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'linear' | 'circular' | 'dots';
}

export function LoadingProgress({ 
  loadingState, 
  className = '',
  size = 'md',
  variant = 'linear'
}: LoadingProgressProps) {
  const { isLoading, progress = 0, message, error } = loadingState;

  const sizeClasses = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3'
  };

  if (variant === 'circular') {
    return (
      <div className={`flex flex-col items-center justify-center p-6 ${className}`}>
        <div className="relative">
          {isLoading ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            >
              <Loader2 className="w-8 h-8 text-blue-500" />
            </motion.div>
          ) : error ? (
            <AlertCircle className="w-8 h-8 text-red-500" />
          ) : (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200 }}
            >
              <CheckCircle className="w-8 h-8 text-green-500" />
            </motion.div>
          )}
        </div>
        
        {message && (
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-3 text-sm text-gray-600 dark:text-gray-400 text-center"
          >
            {message}
          </motion.p>
        )}
        
        {error && (
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-3 text-sm text-red-600 dark:text-red-400 text-center"
          >
            {error}
          </motion.p>
        )}
      </div>
    );
  }

  if (variant === 'dots') {
    return (
      <div className={`flex flex-col items-center justify-center p-6 ${className}`}>
        <div className="flex space-x-2">
          {[0, 1, 2].map((index) => (
            <motion.div
              key={index}
              className="w-3 h-3 bg-blue-500 rounded-full"
              animate={{
                scale: isLoading ? [1, 1.2, 1] : 1,
                opacity: isLoading ? [0.5, 1, 0.5] : error ? 0.3 : 1
              }}
              transition={{
                duration: 0.8,
                repeat: isLoading ? Infinity : 0,
                delay: index * 0.2
              }}
            />
          ))}
        </div>
        
        {message && (
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-3 text-sm text-gray-600 dark:text-gray-400 text-center"
          >
            {message}
          </motion.p>
        )}
      </div>
    );
  }

  // Variant linear (default)
  return (
    <div className={`w-full ${className}`}>
      {message && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-2"
        >
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {message}
          </span>
          {progress > 0 && (
            <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
              {Math.round(progress)}%
            </span>
          )}
        </motion.div>
      )}
      
      <div className={`w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden ${sizeClasses[size]}`}>
        <motion.div
          className={`h-full rounded-full ${
            error 
              ? 'bg-red-500' 
              : isLoading 
                ? 'bg-gradient-to-r from-blue-500 to-purple-500' 
                : 'bg-green-500'
          }`}
          initial={{ width: 0 }}
          animate={{ 
            width: error ? '100%' : `${progress}%`,
            opacity: isLoading ? [0.7, 1, 0.7] : 1
          }}
          transition={{ 
            width: { duration: 0.5, ease: "easeOut" },
            opacity: { duration: 1, repeat: isLoading ? Infinity : 0 }
          }}
        />
      </div>
      
      {error && (
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-2 text-sm text-red-600 dark:text-red-400"
        >
          {error}
        </motion.p>
      )}
    </div>
  );
}

// Componente de overlay de loading para tela inteira
export function LoadingOverlay({ 
  loadingState, 
  children 
}: { 
  loadingState: LoadingState; 
  children: React.ReactNode;
}) {
  const { isLoading } = loadingState;

  return (
    <div className="relative">
      {children}
      
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm flex items-center justify-center z-50 rounded-lg"
        >
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 min-w-[300px]">
            <LoadingProgress 
              loadingState={loadingState} 
              variant="circular"
            />
          </div>
        </motion.div>
      )}
    </div>
  );
}