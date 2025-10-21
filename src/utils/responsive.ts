// Responsive design utilities

// Breakpoint definitions (matching Tailwind CSS)
export const breakpoints = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536
} as const;

export type Breakpoint = keyof typeof breakpoints;

// Media query utilities
export class MediaQueryManager {
  private queries: Map<string, MediaQueryList> = new Map();
  private listeners: Map<string, Set<(matches: boolean) => void>> = new Map();

  constructor() {
    this.setupBreakpointQueries();
  }

  private setupBreakpointQueries() {
    Object.entries(breakpoints).forEach(([name, width]) => {
      const query = `(min-width: ${width}px)`;
      const mql = window.matchMedia(query);
      this.queries.set(name, mql);
      this.listeners.set(name, new Set());

      mql.addEventListener('change', (e) => {
        const listeners = this.listeners.get(name);
        if (listeners) {
          listeners.forEach(callback => callback(e.matches));
        }
      });
    });

    // Additional useful queries
    const additionalQueries = {
      'prefers-reduced-motion': '(prefers-reduced-motion: reduce)',
      'prefers-dark': '(prefers-color-scheme: dark)',
      'prefers-light': '(prefers-color-scheme: light)',
      'high-contrast': '(prefers-contrast: high)',
      'portrait': '(orientation: portrait)',
      'landscape': '(orientation: landscape)',
      'touch': '(pointer: coarse)',
      'hover': '(hover: hover)',
      'retina': '(-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi)'
    };

    Object.entries(additionalQueries).forEach(([name, query]) => {
      const mql = window.matchMedia(query);
      this.queries.set(name, mql);
      this.listeners.set(name, new Set());

      mql.addEventListener('change', (e) => {
        const listeners = this.listeners.get(name);
        if (listeners) {
          listeners.forEach(callback => callback(e.matches));
        }
      });
    });
  }

  // Check if a breakpoint matches
  matches(breakpoint: Breakpoint | string): boolean {
    const query = this.queries.get(breakpoint);
    return query ? query.matches : false;
  }

  // Subscribe to breakpoint changes
  subscribe(breakpoint: Breakpoint | string, callback: (matches: boolean) => void): () => void {
    const listeners = this.listeners.get(breakpoint);
    if (listeners) {
      listeners.add(callback);
      
      // Call immediately with current state
      const query = this.queries.get(breakpoint);
      if (query) {
        callback(query.matches);
      }

      // Return unsubscribe function
      return () => {
        listeners.delete(callback);
      };
    }
    
    return () => {};
  }

  // Get current screen size category
  getCurrentBreakpoint(): Breakpoint | null {
    const sortedBreakpoints = Object.entries(breakpoints)
      .sort(([, a], [, b]) => b - a); // Sort descending

    for (const [name, width] of sortedBreakpoints) {
      if (window.innerWidth >= width) {
        return name as Breakpoint;
      }
    }

    return null;
  }

  // Check if device is mobile
  isMobile(): boolean {
    return !this.matches('md');
  }

  // Check if device is tablet
  isTablet(): boolean {
    return this.matches('md') && !this.matches('lg');
  }

  // Check if device is desktop
  isDesktop(): boolean {
    return this.matches('lg');
  }

  // Check if device supports touch
  isTouch(): boolean {
    return this.matches('touch');
  }

  // Check if device supports hover
  canHover(): boolean {
    return this.matches('hover');
  }

  // Check if user prefers reduced motion
  prefersReducedMotion(): boolean {
    return this.matches('prefers-reduced-motion');
  }

  // Check if user prefers dark mode
  prefersDark(): boolean {
    return this.matches('prefers-dark');
  }

  // Check if device has high DPI
  isRetina(): boolean {
    return this.matches('retina');
  }
}

// Global media query manager instance
export const mediaQueryManager = new MediaQueryManager();

// Viewport utilities
export function getViewportSize(): { width: number; height: number } {
  return {
    width: window.innerWidth,
    height: window.innerHeight
  };
}

export function getScrollbarWidth(): number {
  const outer = document.createElement('div');
  outer.style.visibility = 'hidden';
  outer.style.overflow = 'scroll';
  (outer.style as any).msOverflowStyle = 'scrollbar';
  document.body.appendChild(outer);

  const inner = document.createElement('div');
  outer.appendChild(inner);

  const scrollbarWidth = outer.offsetWidth - inner.offsetWidth;
  outer.parentNode?.removeChild(outer);

  return scrollbarWidth;
}

// Responsive image utilities
export function generateSrcSet(baseUrl: string, sizes: number[]): string {
  return sizes
    .map(size => `${baseUrl}?w=${size} ${size}w`)
    .join(', ');
}

export function generateSizes(breakpoints: Array<{ breakpoint?: Breakpoint; size: string }>): string {
  return breakpoints
    .map(({ breakpoint, size }) => {
      if (breakpoint) {
        return `(min-width: ${breakpoints[breakpoint]}px) ${size}`;
      }
      return size;
    })
    .join(', ');
}

// Container query utilities (for future support)
export function supportsContainerQueries(): boolean {
  return 'container' in document.documentElement.style;
}

// Responsive text utilities
export function getResponsiveFontSize(baseSize: number, scale: number = 1.2): {
  sm: string;
  md: string;
  lg: string;
  xl: string;
} {
  return {
    sm: `${baseSize * 0.875}rem`,
    md: `${baseSize}rem`,
    lg: `${baseSize * scale}rem`,
    xl: `${baseSize * scale * scale}rem`
  };
}

// Layout utilities
export function calculateOptimalColumns(containerWidth: number, minColumnWidth: number, gap: number = 16): number {
  return Math.floor((containerWidth + gap) / (minColumnWidth + gap));
}

export function calculateGridItemWidth(containerWidth: number, columns: number, gap: number = 16): number {
  return (containerWidth - (gap * (columns - 1))) / columns;
}

// Responsive behavior hooks
export interface ResponsiveConfig<T> {
  sm?: T;
  md?: T;
  lg?: T;
  xl?: T;
  '2xl'?: T;
}

export function getResponsiveValue<T>(config: ResponsiveConfig<T>, fallback: T): T {
  const currentBreakpoint = mediaQueryManager.getCurrentBreakpoint();
  
  if (currentBreakpoint && config[currentBreakpoint] !== undefined) {
    return config[currentBreakpoint]!;
  }

  // Fallback to smaller breakpoints
  const breakpointOrder: Breakpoint[] = ['2xl', 'xl', 'lg', 'md', 'sm'];
  for (const bp of breakpointOrder) {
    if (config[bp] !== undefined) {
      return config[bp]!;
    }
  }

  return fallback;
}

// Touch and gesture utilities
export interface TouchGesture {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  deltaX: number;
  deltaY: number;
  duration: number;
  distance: number;
  direction: 'left' | 'right' | 'up' | 'down' | 'none';
}

export class TouchGestureManager {
  private startTime: number = 0;
  private startTouch: Touch | null = null;
  private threshold: number = 50;
  private maxTime: number = 300;

  constructor(threshold: number = 50, maxTime: number = 300) {
    this.threshold = threshold;
    this.maxTime = maxTime;
  }

  handleTouchStart(e: TouchEvent): void {
    this.startTime = Date.now();
    this.startTouch = e.touches[0];
  }

  handleTouchEnd(e: TouchEvent): TouchGesture | null {
    if (!this.startTouch) return null;

    const endTime = Date.now();
    const endTouch = e.changedTouches[0];
    const duration = endTime - this.startTime;

    if (duration > this.maxTime) return null;

    const deltaX = endTouch.clientX - this.startTouch.clientX;
    const deltaY = endTouch.clientY - this.startTouch.clientY;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

    if (distance < this.threshold) return null;

    let direction: TouchGesture['direction'] = 'none';
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      direction = deltaX > 0 ? 'right' : 'left';
    } else {
      direction = deltaY > 0 ? 'down' : 'up';
    }

    return {
      startX: this.startTouch.clientX,
      startY: this.startTouch.clientY,
      endX: endTouch.clientX,
      endY: endTouch.clientY,
      deltaX,
      deltaY,
      duration,
      distance,
      direction
    };
  }
}

// Responsive navigation utilities
export function shouldShowMobileMenu(): boolean {
  return mediaQueryManager.isMobile();
}

export function shouldCollapseSidebar(): boolean {
  return !mediaQueryManager.isDesktop();
}

// Performance-aware responsive loading
export function shouldLoadHighResImages(): boolean {
  // Don't load high-res images on slow connections or mobile
  const connection = (navigator as any).connection;
  if (connection) {
    if (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g') {
      return false;
    }
    if (connection.saveData) {
      return false;
    }
  }

  return mediaQueryManager.isRetina() && !mediaQueryManager.isMobile();
}

// Responsive table utilities
export function shouldStackTable(): boolean {
  return mediaQueryManager.isMobile();
}

export function getTableDisplayMode(): 'table' | 'cards' | 'list' {
  if (mediaQueryManager.isMobile()) {
    return 'cards';
  } else if (mediaQueryManager.isTablet()) {
    return 'list';
  }
  return 'table';
}

// Responsive modal utilities
export function getModalSize(): 'sm' | 'md' | 'lg' | 'xl' | 'full' {
  if (mediaQueryManager.isMobile()) {
    return 'full';
  } else if (mediaQueryManager.isTablet()) {
    return 'lg';
  }
  return 'xl';
}

// Safe area utilities (for mobile devices with notches)
export function getSafeAreaInsets(): {
  top: number;
  right: number;
  bottom: number;
  left: number;
} {
  const style = getComputedStyle(document.documentElement);
  
  return {
    top: parseInt(style.getPropertyValue('env(safe-area-inset-top)') || '0'),
    right: parseInt(style.getPropertyValue('env(safe-area-inset-right)') || '0'),
    bottom: parseInt(style.getPropertyValue('env(safe-area-inset-bottom)') || '0'),
    left: parseInt(style.getPropertyValue('env(safe-area-inset-left)') || '0')
  };
}

// Responsive debugging utilities
export function logResponsiveInfo(): void {
  const viewport = getViewportSize();
  const breakpoint = mediaQueryManager.getCurrentBreakpoint();
  const deviceInfo = {
    viewport,
    breakpoint,
    isMobile: mediaQueryManager.isMobile(),
    isTablet: mediaQueryManager.isTablet(),
    isDesktop: mediaQueryManager.isDesktop(),
    isTouch: mediaQueryManager.isTouch(),
    canHover: mediaQueryManager.canHover(),
    isRetina: mediaQueryManager.isRetina(),
    prefersReducedMotion: mediaQueryManager.prefersReducedMotion(),
    prefersDark: mediaQueryManager.prefersDark()
  };

  console.table(deviceInfo);
}

// Initialize responsive utilities
export function initializeResponsiveUtils(): void {
  // Add CSS custom properties for JavaScript access
  const updateCSSProps = () => {
    const viewport = getViewportSize();
    document.documentElement.style.setProperty('--viewport-width', `${viewport.width}px`);
    document.documentElement.style.setProperty('--viewport-height', `${viewport.height}px`);
    document.documentElement.style.setProperty('--scrollbar-width', `${getScrollbarWidth()}px`);
  };

  updateCSSProps();
  window.addEventListener('resize', updateCSSProps);

  // Add responsive classes to document
  const updateResponsiveClasses = () => {
    const classes = [
      mediaQueryManager.isMobile() ? 'is-mobile' : 'not-mobile',
      mediaQueryManager.isTablet() ? 'is-tablet' : 'not-tablet',
      mediaQueryManager.isDesktop() ? 'is-desktop' : 'not-desktop',
      mediaQueryManager.isTouch() ? 'is-touch' : 'not-touch',
      mediaQueryManager.canHover() ? 'can-hover' : 'cannot-hover',
      mediaQueryManager.isRetina() ? 'is-retina' : 'not-retina'
    ];

    // Remove old classes
    document.documentElement.className = document.documentElement.className
      .replace(/\b(is|not|can|cannot)-(mobile|tablet|desktop|touch|hover|retina)\b/g, '');

    // Add new classes
    document.documentElement.classList.add(...classes);
  };

  updateResponsiveClasses();

  // Subscribe to breakpoint changes
  Object.keys(breakpoints).forEach(bp => {
    mediaQueryManager.subscribe(bp, updateResponsiveClasses);
  });

  // Subscribe to other media queries
  ['prefers-reduced-motion', 'prefers-dark', 'touch', 'hover', 'retina'].forEach(query => {
    mediaQueryManager.subscribe(query, updateResponsiveClasses);
  });
}