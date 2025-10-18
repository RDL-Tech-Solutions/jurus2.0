import React, { Suspense, lazy, ComponentType } from 'react';
import { motion } from 'framer-motion';
import { LoadingStatesEnhanced } from './LoadingStatesEnhanced';

interface LazyComponentProps {
  fallback?: React.ReactNode;
  loadingType?: 'calculation' | 'chart' | 'data' | 'analysis' | 'general';
  loadingMessage?: string;
  errorBoundary?: boolean;
}

// Error Boundary para componentes lazy
class LazyErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback?: React.ReactNode },
  { hasError: boolean; error?: Error }
> {
  constructor(props: { children: React.ReactNode; fallback?: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Lazy component error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 text-center bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg"
          >
            <div className="text-red-600 dark:text-red-400 mb-2">
              ⚠️ Erro ao carregar componente
            </div>
            <p className="text-sm text-red-500 dark:text-red-300">
              Ocorreu um erro inesperado. Tente recarregar a página.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="mt-3 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
            >
              Recarregar
            </button>
          </motion.div>
        )
      );
    }

    return this.props.children;
  }
}

// HOC para criar componentes lazy com configurações personalizadas
export function createLazyComponent<T extends ComponentType<any>>(
  importFn: () => Promise<{ default: T }>,
  options: LazyComponentProps = {}
) {
  const LazyComponent = lazy(importFn);

  return React.forwardRef<any, React.ComponentProps<T>>((props, ref) => {
    const {
      fallback,
      loadingType = 'general',
      loadingMessage,
      errorBoundary = true
    } = options;

    const defaultFallback = (
      <LoadingStatesEnhanced
        isLoading={true}
        type={loadingType}
        message={loadingMessage}
        size="md"
      />
    );

    const content = (
      <Suspense fallback={fallback || defaultFallback}>
        <LazyComponent {...(props as any)} ref={ref} />
      </Suspense>
    );

    if (errorBoundary) {
      return (
        <LazyErrorBoundary fallback={options.fallback}>
          {content}
        </LazyErrorBoundary>
      );
    }

    return content;
  });
}

// Componente para lazy loading com intersection observer
interface LazyLoadOnViewProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  rootMargin?: string;
  threshold?: number;
  className?: string;
  once?: boolean;
}

export function LazyLoadOnView({
  children,
  fallback,
  rootMargin = '50px',
  threshold = 0.1,
  className = '',
  once = true
}: LazyLoadOnViewProps) {
  const [isInView, setIsInView] = React.useState(false);
  const [hasLoaded, setHasLoaded] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          if (once) {
            setHasLoaded(true);
            observer.disconnect();
          }
        } else if (!once) {
          setIsInView(false);
        }
      },
      {
        rootMargin,
        threshold
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [rootMargin, threshold, once]);

  const shouldRender = once ? hasLoaded || isInView : isInView;

  return (
    <div ref={ref} className={className}>
      {shouldRender ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {children}
        </motion.div>
      ) : (
        fallback || (
          <div className="h-32 bg-gray-100 dark:bg-gray-800 rounded-lg animate-pulse" />
        )
      )}
    </div>
  );
}

// Hook para lazy loading de dados
export function useLazyData<T>(
  fetchFn: () => Promise<T>,
  dependencies: React.DependencyList = []
) {
  const [data, setData] = React.useState<T | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<Error | null>(null);

  const loadData = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await fetchFn();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
    } finally {
      setLoading(false);
    }
  }, dependencies);

  React.useEffect(() => {
    loadData();
  }, [loadData]);

  return { data, loading, error, refetch: loadData };
}

// Componente para lazy loading de imagens
interface LazyImageProps extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'onDrag' | 'onDragStart' | 'onDragEnd' | 'onAnimationStart' | 'onAnimationEnd'> {
  src: string;
  alt: string;
  fallback?: React.ReactNode;
  loadingClassName?: string;
  errorClassName?: string;
}

export function LazyImage({
  src,
  alt,
  fallback,
  loadingClassName = 'bg-gray-200 dark:bg-gray-700 animate-pulse',
  errorClassName = 'bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400',
  className = '',
  ...props
}: LazyImageProps) {
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(false);
  const [inView, setInView] = React.useState(false);
  const imgRef = React.useRef<HTMLImageElement>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleLoad = () => {
    setLoading(false);
    setError(false);
  };

  const handleError = () => {
    setLoading(false);
    setError(true);
  };

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {inView && (
        <>
          {loading && (
            <div className={`absolute inset-0 flex items-center justify-center ${loadingClassName}`}>
              {fallback || (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full"
                />
              )}
            </div>
          )}
          
          {error ? (
            <div className={`flex items-center justify-center p-4 ${errorClassName}`}>
              <span className="text-sm">Erro ao carregar imagem</span>
            </div>
          ) : (
            <motion.img
              ref={imgRef}
              src={src}
              alt={alt}
              onLoad={handleLoad}
              onError={handleError}
              initial={{ opacity: 0 }}
              animate={{ opacity: loading ? 0 : 1 }}
              transition={{ duration: 0.3 }}
              className={loading ? 'invisible' : 'visible'}
              {...props}
            />
          )}
        </>
      )}
    </div>
  );
}

// Componente para lazy loading de listas virtualizadas
interface VirtualizedListProps<T> {
  items: T[];
  itemHeight: number;
  containerHeight: number;
  renderItem: (item: T, index: number) => React.ReactNode;
  overscan?: number;
  className?: string;
}

export function VirtualizedList<T>({
  items,
  itemHeight,
  containerHeight,
  renderItem,
  overscan = 5,
  className = ''
}: VirtualizedListProps<T>) {
  const [scrollTop, setScrollTop] = React.useState(0);
  const scrollElementRef = React.useRef<HTMLDivElement>(null);

  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
  const endIndex = Math.min(
    items.length - 1,
    Math.ceil((scrollTop + containerHeight) / itemHeight) + overscan
  );

  const visibleItems = items.slice(startIndex, endIndex + 1);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  };

  return (
    <div
      ref={scrollElementRef}
      className={`overflow-auto ${className}`}
      style={{ height: containerHeight }}
      onScroll={handleScroll}
    >
      <div style={{ height: items.length * itemHeight, position: 'relative' }}>
        {visibleItems.map((item, index) => (
          <div
            key={startIndex + index}
            style={{
              position: 'absolute',
              top: (startIndex + index) * itemHeight,
              height: itemHeight,
              width: '100%'
            }}
          >
            {renderItem(item, startIndex + index)}
          </div>
        ))}
      </div>
    </div>
  );
}

export default LazyLoadOnView;