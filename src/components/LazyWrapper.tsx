import React, { Suspense, ComponentType, useEffect, useRef, useState, forwardRef } from 'react';
import { motion } from 'framer-motion';
import { SkeletonLoader, SkeletonCard, SkeletonChart, SkeletonDashboard } from './SkeletonLoader';

interface LazyWrapperProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  skeletonType?: 'default' | 'card' | 'chart' | 'dashboard';
  className?: string;
}

const skeletonComponents = {
  default: () => <SkeletonLoader variant="rectangular" height="200px" />,
  card: () => <SkeletonCard />,
  chart: () => <SkeletonChart />,
  dashboard: () => <SkeletonDashboard />,
};

export const LazyWrapper: React.FC<LazyWrapperProps> = ({
  children,
  fallback,
  skeletonType = 'default',
  className,
}) => {
  const defaultFallback = fallback || (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={className}
    >
      {skeletonComponents[skeletonType]()}
    </motion.div>
  );

  return (
    <Suspense fallback={defaultFallback}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
        className={className}
      >
        {children}
      </motion.div>
    </Suspense>
  );
};

// HOC para criar componentes lazy
export function withLazyLoading<T extends object>(
  Component: ComponentType<T>,
  skeletonType: 'text' | 'card' | 'chart' | 'rectangular' = 'text'
) {
  return forwardRef<any, T>((props, ref) => (
    <Suspense fallback={<SkeletonLoader variant={skeletonType} />}>
      <Component {...(props as any)} ref={ref} />
    </Suspense>
  ));
}

// Hook para lazy loading com intersection observer
export const useLazyLoading = (threshold = 0.1) => {
  const [isVisible, setIsVisible] = React.useState(false);
  const [hasLoaded, setHasLoaded] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasLoaded) {
          setIsVisible(true);
          setHasLoaded(true);
        }
      },
      { threshold }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [threshold, hasLoaded]);

  return { ref, isVisible, hasLoaded };
};

// Componente para lazy loading baseado em viewport
interface LazyViewportProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  skeletonType?: 'default' | 'card' | 'chart' | 'dashboard';
  threshold?: number;
  className?: string;
  minHeight?: string;
}

export const LazyViewport: React.FC<LazyViewportProps> = ({
  children,
  fallback,
  skeletonType = 'default',
  threshold = 0.1,
  className,
  minHeight = '200px',
}) => {
  const { ref, isVisible } = useLazyLoading(threshold);

  const defaultFallback = fallback || (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={className}
      style={{ minHeight }}
    >
      {skeletonComponents[skeletonType]()}
    </motion.div>
  );

  return (
    <div ref={ref} className={className} style={{ minHeight }}>
      {isVisible ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {children}
        </motion.div>
      ) : (
        defaultFallback
      )}
    </div>
  );
};

export default LazyWrapper;