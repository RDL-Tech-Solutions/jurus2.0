import { useState, useEffect, useCallback } from 'react';

interface ImageOptimizationOptions {
  quality?: number;
  format?: 'webp' | 'jpeg' | 'png';
  width?: number;
  height?: number;
  lazy?: boolean;
}

interface OptimizedImage {
  src: string;
  srcSet?: string;
  loading: boolean;
  error: boolean;
}

// Hook para otimização de imagens
export const useImageOptimization = (
  originalSrc: string,
  options: ImageOptimizationOptions = {}
): OptimizedImage => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [optimizedSrc, setOptimizedSrc] = useState(originalSrc);

  const {
    quality = 80,
    format = 'webp',
    width,
    height,
    lazy = true
  } = options;

  useEffect(() => {
    if (!originalSrc) return;

    const optimizeImage = async () => {
      try {
        setLoading(true);
        setError(false);

        // Simular otimização de imagem (em produção, usaria um serviço real)
        const optimizedUrl = generateOptimizedUrl(originalSrc, {
          quality,
          format,
          width,
          height
        });

        // Verificar se a imagem pode ser carregada
        await preloadImage(optimizedUrl);
        setOptimizedSrc(optimizedUrl);
      } catch (err) {
        setError(true);
        setOptimizedSrc(originalSrc); // Fallback para imagem original
      } finally {
        setLoading(false);
      }
    };

    if (!lazy) {
      optimizeImage();
    } else {
      // Lazy loading - otimizar apenas quando necessário
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              optimizeImage();
              observer.disconnect();
            }
          });
        },
        { threshold: 0.1 }
      );

      // Para lazy loading, precisaríamos de uma referência ao elemento
      // Por simplicidade, vamos otimizar imediatamente
      optimizeImage();
    }
  }, [originalSrc, quality, format, width, height, lazy]);

  return {
    src: optimizedSrc,
    srcSet: generateSrcSet(originalSrc, { quality, format }),
    loading,
    error
  };
};

// Hook para preload de recursos críticos
export const useResourcePreload = () => {
  const preloadResource = useCallback((url: string, type: 'image' | 'font' | 'script' | 'style') => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = url;
    
    switch (type) {
      case 'image':
        link.as = 'image';
        break;
      case 'font':
        link.as = 'font';
        link.crossOrigin = 'anonymous';
        break;
      case 'script':
        link.as = 'script';
        break;
      case 'style':
        link.as = 'style';
        break;
    }

    document.head.appendChild(link);
  }, []);

  const preloadCriticalResources = useCallback(() => {
    // Preload de fontes críticas
    preloadResource('/fonts/inter-var.woff2', 'font');
    
    // Preload de imagens críticas (logos, ícones principais)
    preloadResource('/logo.svg', 'image');
    preloadResource('/favicon.ico', 'image');
  }, [preloadResource]);

  return {
    preloadResource,
    preloadCriticalResources
  };
};

// Hook para otimização de bundle
export const useBundleOptimization = () => {
  const [bundleInfo, setBundleInfo] = useState({
    size: 0,
    chunks: 0,
    loadTime: 0
  });

  useEffect(() => {
    // Monitorar performance do bundle
    const measureBundlePerformance = () => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      const loadTime = navigation.loadEventEnd - navigation.fetchStart;
      
      setBundleInfo({
        size: 0, // Em produção, seria calculado dinamicamente
        chunks: 0, // Número de chunks carregados
        loadTime
      });
    };

    if (document.readyState === 'complete') {
      measureBundlePerformance();
    } else {
      window.addEventListener('load', measureBundlePerformance);
      return () => window.removeEventListener('load', measureBundlePerformance);
    }
  }, []);

  return bundleInfo;
};

// Funções auxiliares
const generateOptimizedUrl = (
  originalUrl: string,
  options: {
    quality: number;
    format: string;
    width?: number;
    height?: number;
  }
): string => {
  // Em produção, isso seria integrado com um serviço de otimização de imagens
  // como Cloudinary, ImageKit, ou similar
  const params = new URLSearchParams();
  params.set('q', options.quality.toString());
  params.set('f', options.format);
  
  if (options.width) params.set('w', options.width.toString());
  if (options.height) params.set('h', options.height.toString());

  // Por enquanto, retorna a URL original
  return originalUrl;
};

const generateSrcSet = (
  originalUrl: string,
  options: { quality: number; format: string }
): string => {
  // Gerar srcSet para diferentes densidades de tela
  const densities = [1, 1.5, 2, 3];
  
  return densities
    .map(density => {
      const url = generateOptimizedUrl(originalUrl, {
        ...options,
        quality: Math.max(60, options.quality - (density - 1) * 10)
      });
      return `${url} ${density}x`;
    })
    .join(', ');
};

const preloadImage = (src: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = reject;
    img.src = src;
  });
};

// Hook para monitoramento de performance
export const usePerformanceMonitoring = () => {
  const [metrics, setMetrics] = useState({
    fcp: 0, // First Contentful Paint
    lcp: 0, // Largest Contentful Paint
    fid: 0, // First Input Delay
    cls: 0, // Cumulative Layout Shift
    ttfb: 0 // Time to First Byte
  });

  useEffect(() => {
    const measurePerformance = () => {
      // First Contentful Paint
      const fcpEntry = performance.getEntriesByName('first-contentful-paint')[0];
      const fcp = fcpEntry ? fcpEntry.startTime : 0;

      // Time to First Byte
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      const ttfb = navigation ? navigation.responseStart - navigation.fetchStart : 0;

      setMetrics(prev => ({
        ...prev,
        fcp,
        ttfb
      }));
    };

    // Observar Largest Contentful Paint
    const lcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];
      setMetrics(prev => ({
        ...prev,
        lcp: lastEntry.startTime
      }));
    });

    // Observar Cumulative Layout Shift
    const clsObserver = new PerformanceObserver((list) => {
      let clsValue = 0;
      for (const entry of list.getEntries()) {
        if (!(entry as any).hadRecentInput) {
          clsValue += (entry as any).value;
        }
      }
      setMetrics(prev => ({
        ...prev,
        cls: clsValue
      }));
    });

    // Observar First Input Delay
    const fidObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        setMetrics(prev => ({
          ...prev,
          fid: (entry as any).duration || 0
        }));
      }
    });

    try {
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
      clsObserver.observe({ entryTypes: ['layout-shift'] });
      fidObserver.observe({ entryTypes: ['first-input'] });
    } catch (e) {
      // Fallback para navegadores que não suportam essas métricas
    }

    measurePerformance();

    return () => {
      lcpObserver.disconnect();
      clsObserver.disconnect();
      fidObserver.disconnect();
    };
  }, []);

  return metrics;
};