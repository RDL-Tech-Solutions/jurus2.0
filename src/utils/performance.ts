// Performance optimization utilities

// Debounce function for search and input optimization
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number,
  immediate?: boolean
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      if (!immediate) func(...args);
    };
    
    const callNow = immediate && !timeout;
    
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    
    if (callNow) func(...args);
  };
}

// Throttle function for scroll and resize events
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  
  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// Lazy image loading with intersection observer
export class LazyImageLoader {
  private observer: IntersectionObserver;
  private images: Set<HTMLImageElement> = new Set();

  constructor(options?: IntersectionObserverInit) {
    this.observer = new IntersectionObserver(
      this.handleIntersection.bind(this),
      {
        rootMargin: '50px 0px',
        threshold: 0.01,
        ...options
      }
    );
  }

  private handleIntersection(entries: IntersectionObserverEntry[]) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target as HTMLImageElement;
        this.loadImage(img);
        this.observer.unobserve(img);
        this.images.delete(img);
      }
    });
  }

  private loadImage(img: HTMLImageElement) {
    const src = img.dataset.src;
    if (src) {
      img.src = src;
      img.removeAttribute('data-src');
      img.classList.add('loaded');
    }
  }

  observe(img: HTMLImageElement) {
    this.images.add(img);
    this.observer.observe(img);
  }

  unobserve(img: HTMLImageElement) {
    this.images.delete(img);
    this.observer.unobserve(img);
  }

  disconnect() {
    this.observer.disconnect();
    this.images.clear();
  }
}

// Create global lazy image loader instance
export const lazyImageLoader = new LazyImageLoader();

// Preload critical resources
export function preloadResource(href: string, as: string, type?: string) {
  const link = document.createElement('link');
  link.rel = 'preload';
  link.href = href;
  link.as = as;
  if (type) link.type = type;
  document.head.appendChild(link);
}

// Prefetch resources for future navigation
export function prefetchResource(href: string) {
  const link = document.createElement('link');
  link.rel = 'prefetch';
  link.href = href;
  document.head.appendChild(link);
}

// Memory usage monitoring
interface MemoryInfo {
  usedJSHeapSize: number;
  totalJSHeapSize: number;
  jsHeapSizeLimit: number;
}

export function getMemoryUsage(): MemoryInfo | null {
  if ('memory' in performance) {
    return (performance as any).memory;
  }
  return null;
}

// Performance metrics collection
export interface PerformanceMetrics {
  fcp: number | null; // First Contentful Paint
  lcp: number | null; // Largest Contentful Paint
  fid: number | null; // First Input Delay
  cls: number | null; // Cumulative Layout Shift
  ttfb: number | null; // Time to First Byte
}

export function collectPerformanceMetrics(): Promise<PerformanceMetrics> {
  return new Promise((resolve) => {
    const metrics: PerformanceMetrics = {
      fcp: null,
      lcp: null,
      fid: null,
      cls: null,
      ttfb: null
    };

    // Get navigation timing
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    if (navigation) {
      metrics.ttfb = navigation.responseStart - navigation.requestStart;
    }

    // Get paint timing
    const paintEntries = performance.getEntriesByType('paint');
    const fcpEntry = paintEntries.find(entry => entry.name === 'first-contentful-paint');
    if (fcpEntry) {
      metrics.fcp = fcpEntry.startTime;
    }

    // Use PerformanceObserver for other metrics
    if ('PerformanceObserver' in window) {
      // Largest Contentful Paint
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        metrics.lcp = lastEntry.startTime;
      });
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

      // First Input Delay
      const fidObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry: any) => {
          metrics.fid = entry.processingStart - entry.startTime;
        });
      });
      fidObserver.observe({ entryTypes: ['first-input'] });

      // Cumulative Layout Shift
      let clsValue = 0;
      const clsObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry: any) => {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
          }
        });
        metrics.cls = clsValue;
      });
      clsObserver.observe({ entryTypes: ['layout-shift'] });

      // Resolve after a delay to collect metrics
      setTimeout(() => {
        lcpObserver.disconnect();
        fidObserver.disconnect();
        clsObserver.disconnect();
        resolve(metrics);
      }, 5000);
    } else {
      resolve(metrics);
    }
  });
}

// Bundle size analyzer
export function analyzeBundleSize() {
  const scripts = Array.from(document.querySelectorAll('script[src]'));
  const styles = Array.from(document.querySelectorAll('link[rel="stylesheet"]'));
  
  const resources = [...scripts, ...styles].map(element => {
    const src = element.getAttribute('src') || element.getAttribute('href');
    return {
      url: src,
      type: element.tagName.toLowerCase(),
      size: 0 // Would need to fetch to get actual size
    };
  });

  return resources;
}

// Critical resource hints
export function addResourceHints() {
  // DNS prefetch for external domains
  const domains = [
    'fonts.googleapis.com',
    'fonts.gstatic.com',
    'cdn.jsdelivr.net'
  ];

  domains.forEach(domain => {
    const link = document.createElement('link');
    link.rel = 'dns-prefetch';
    link.href = `//${domain}`;
    document.head.appendChild(link);
  });

  // Preconnect to critical origins
  const criticalOrigins = [
    'https://fonts.googleapis.com',
    'https://fonts.gstatic.com'
  ];

  criticalOrigins.forEach(origin => {
    const link = document.createElement('link');
    link.rel = 'preconnect';
    link.href = origin;
    link.crossOrigin = 'anonymous';
    document.head.appendChild(link);
  });
}

// Viewport-based loading
export function isInViewport(element: Element): boolean {
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

// Service Worker registration for caching
export async function registerServiceWorker(): Promise<ServiceWorkerRegistration | null> {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      console.log('Service Worker registered successfully:', registration);
      return registration;
    } catch (error) {
      console.error('Service Worker registration failed:', error);
      return null;
    }
  }
  return null;
}

// Critical CSS inlining helper
export function inlineCriticalCSS(css: string) {
  const style = document.createElement('style');
  style.textContent = css;
  style.setAttribute('data-critical', 'true');
  document.head.appendChild(style);
}

// Resource loading priority
export function setLoadingPriority(element: HTMLElement, priority: 'high' | 'low' | 'auto') {
  if ('importance' in element) {
    (element as any).importance = priority;
  }
}

// Performance budget checker
export interface PerformanceBudget {
  maxBundleSize: number; // in KB
  maxImageSize: number; // in KB
  maxLoadTime: number; // in ms
  maxMemoryUsage: number; // in MB
}

export function checkPerformanceBudget(budget: PerformanceBudget): {
  passed: boolean;
  violations: string[];
} {
  const violations: string[] = [];
  
  // Check load time
  const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
  if (navigation) {
    const loadTime = navigation.loadEventEnd - navigation.fetchStart;
    if (loadTime > budget.maxLoadTime) {
      violations.push(`Load time exceeded: ${loadTime}ms > ${budget.maxLoadTime}ms`);
    }
  }

  // Check memory usage
  const memory = getMemoryUsage();
  if (memory) {
    const memoryMB = memory.usedJSHeapSize / 1024 / 1024;
    if (memoryMB > budget.maxMemoryUsage) {
      violations.push(`Memory usage exceeded: ${memoryMB.toFixed(2)}MB > ${budget.maxMemoryUsage}MB`);
    }
  }

  return {
    passed: violations.length === 0,
    violations
  };
}

// Initialize performance optimizations
export function initializePerformanceOptimizations() {
  // Add resource hints
  addResourceHints();
  
  // Register service worker
  registerServiceWorker();
  
  // Set up lazy image loading
  const images = document.querySelectorAll('img[data-src]');
  images.forEach(img => lazyImageLoader.observe(img as HTMLImageElement));
  
  // Monitor performance
  collectPerformanceMetrics().then(metrics => {
    console.log('Performance metrics:', metrics);
  });
}