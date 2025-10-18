import React from 'react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';

interface SkeletonLoaderProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular' | 'card' | 'chart';
  width?: string | number;
  height?: string | number;
  lines?: number;
  animated?: boolean;
}

const shimmerVariants = {
  initial: { x: '-100%' },
  animate: { x: '100%' },
};

export const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
  className,
  variant = 'rectangular',
  width,
  height,
  lines = 1,
  animated = true,
}) => {
  const baseClasses = 'bg-gray-200 dark:bg-gray-700 relative overflow-hidden';
  
  const variantClasses = {
    text: 'h-4 rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-md',
    card: 'rounded-lg',
    chart: 'rounded-lg h-64',
  };

  const shimmerEffect = animated && (
    <motion.div
      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 dark:via-gray-600/20 to-transparent"
      variants={shimmerVariants}
      initial="initial"
      animate="animate"
      transition={{
        duration: 1.5,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    />
  );

  if (variant === 'text' && lines > 1) {
    return (
      <div className={clsx('space-y-2', className)}>
        {Array.from({ length: lines }).map((_, index) => (
          <div
            key={index}
            className={clsx(
              baseClasses,
              variantClasses.text,
              index === lines - 1 && 'w-3/4' // Última linha mais curta
            )}
            style={{ width, height }}
          >
            {shimmerEffect}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div
      className={clsx(
        baseClasses,
        variantClasses[variant],
        className
      )}
      style={{ width, height }}
    >
      {shimmerEffect}
    </div>
  );
};

// Componentes específicos para diferentes casos de uso
export const SkeletonCard: React.FC<{ className?: string }> = ({ className }) => (
  <div className={clsx('p-6 space-y-4', className)}>
    <SkeletonLoader variant="rectangular" height="20px" width="60%" />
    <SkeletonLoader variant="text" lines={3} />
    <div className="flex space-x-4">
      <SkeletonLoader variant="rectangular" height="40px" width="100px" />
      <SkeletonLoader variant="rectangular" height="40px" width="100px" />
    </div>
  </div>
);

export const SkeletonChart: React.FC<{ className?: string }> = ({ className }) => (
  <div className={clsx('space-y-4', className)}>
    <SkeletonLoader variant="text" width="40%" />
    <SkeletonLoader variant="chart" />
    <div className="flex justify-between">
      <SkeletonLoader variant="text" width="20%" />
      <SkeletonLoader variant="text" width="20%" />
      <SkeletonLoader variant="text" width="20%" />
    </div>
  </div>
);

export const SkeletonTable: React.FC<{ rows?: number; columns?: number; className?: string }> = ({ 
  rows = 5, 
  columns = 4, 
  className 
}) => (
  <div className={clsx('space-y-3', className)}>
    {/* Header */}
    <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
      {Array.from({ length: columns }).map((_, index) => (
        <SkeletonLoader key={`header-${index}`} variant="text" height="16px" />
      ))}
    </div>
    
    {/* Rows */}
    {Array.from({ length: rows }).map((_, rowIndex) => (
      <div key={`row-${rowIndex}`} className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
        {Array.from({ length: columns }).map((_, colIndex) => (
          <SkeletonLoader key={`cell-${rowIndex}-${colIndex}`} variant="text" height="14px" />
        ))}
      </div>
    ))}
  </div>
);

export const SkeletonDashboard: React.FC<{ className?: string }> = ({ className }) => (
  <div className={clsx('space-y-6', className)}>
    {/* Header */}
    <div className="flex justify-between items-center">
      <SkeletonLoader variant="text" width="200px" height="24px" />
      <SkeletonLoader variant="rectangular" width="120px" height="40px" />
    </div>
    
    {/* Stats Cards */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {Array.from({ length: 4 }).map((_, index) => (
        <div key={index} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
          <SkeletonLoader variant="text" width="60%" height="16px" className="mb-2" />
          <SkeletonLoader variant="text" width="80%" height="24px" />
        </div>
      ))}
    </div>
    
    {/* Chart */}
    <SkeletonChart />
    
    {/* Table */}
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
      <SkeletonLoader variant="text" width="30%" height="20px" className="mb-4" />
      <SkeletonTable />
    </div>
  </div>
);

export default SkeletonLoader;