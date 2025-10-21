import { useState, useEffect, useCallback } from 'react';
import { 
  mediaQueryManager, 
  Breakpoint, 
  ResponsiveConfig, 
  getResponsiveValue,
  TouchGestureManager,
  TouchGesture
} from '../utils/responsive';

// Hook for breakpoint detection
export function useBreakpoint(): {
  current: Breakpoint | null;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  matches: (breakpoint: Breakpoint) => boolean;
} {
  const [current, setCurrent] = useState<Breakpoint | null>(
    mediaQueryManager.getCurrentBreakpoint()
  );
  const [isMobile, setIsMobile] = useState(mediaQueryManager.isMobile());
  const [isTablet, setIsTablet] = useState(mediaQueryManager.isTablet());
  const [isDesktop, setIsDesktop] = useState(mediaQueryManager.isDesktop());

  useEffect(() => {
    const updateBreakpoint = () => {
      setCurrent(mediaQueryManager.getCurrentBreakpoint());
      setIsMobile(mediaQueryManager.isMobile());
      setIsTablet(mediaQueryManager.isTablet());
      setIsDesktop(mediaQueryManager.isDesktop());
    };

    // Subscribe to all breakpoint changes
    const unsubscribers = Object.keys(mediaQueryManager['breakpoints'] || {}).map(bp =>
      mediaQueryManager.subscribe(bp, updateBreakpoint)
    );

    return () => {
      unsubscribers.forEach(unsub => unsub());
    };
  }, []);

  const matches = useCallback((breakpoint: Breakpoint) => {
    return mediaQueryManager.matches(breakpoint);
  }, []);

  return {
    current,
    isMobile,
    isTablet,
    isDesktop,
    matches
  };
}

// Hook for media query matching
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia(query).matches;
    }
    return false;
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia(query);
    const handler = (e: MediaQueryListEvent) => setMatches(e.matches);

    mediaQuery.addEventListener('change', handler);
    setMatches(mediaQuery.matches);

    return () => mediaQuery.removeEventListener('change', handler);
  }, [query]);

  return matches;
}

// Hook for responsive values
export function useResponsiveValue<T>(config: ResponsiveConfig<T>, fallback: T): T {
  const { current } = useBreakpoint();
  const [value, setValue] = useState(() => getResponsiveValue(config, fallback));

  useEffect(() => {
    setValue(getResponsiveValue(config, fallback));
  }, [current, config, fallback]);

  return value;
}

// Hook for viewport size
export function useViewportSize(): { width: number; height: number } {
  const [size, setSize] = useState(() => ({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0
  }));

  useEffect(() => {
    const handleResize = () => {
      setSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return size;
}

// Hook for device capabilities
export function useDeviceCapabilities(): {
  isTouch: boolean;
  canHover: boolean;
  prefersReducedMotion: boolean;
  prefersDark: boolean;
  isRetina: boolean;
} {
  const [capabilities, setCapabilities] = useState(() => ({
    isTouch: mediaQueryManager.isTouch(),
    canHover: mediaQueryManager.canHover(),
    prefersReducedMotion: mediaQueryManager.prefersReducedMotion(),
    prefersDark: mediaQueryManager.prefersDark(),
    isRetina: mediaQueryManager.isRetina()
  }));

  useEffect(() => {
    const updateCapabilities = () => {
      setCapabilities({
        isTouch: mediaQueryManager.isTouch(),
        canHover: mediaQueryManager.canHover(),
        prefersReducedMotion: mediaQueryManager.prefersReducedMotion(),
        prefersDark: mediaQueryManager.prefersDark(),
        isRetina: mediaQueryManager.isRetina()
      });
    };

    const queries = ['touch', 'hover', 'prefers-reduced-motion', 'prefers-dark', 'retina'];
    const unsubscribers = queries.map(query =>
      mediaQueryManager.subscribe(query, updateCapabilities)
    );

    return () => {
      unsubscribers.forEach(unsub => unsub());
    };
  }, []);

  return capabilities;
}

// Hook for touch gestures
export function useTouchGestures(
  threshold: number = 50,
  maxTime: number = 300
): {
  onTouchStart: (e: React.TouchEvent) => void;
  onTouchEnd: (e: React.TouchEvent) => void;
  gesture: TouchGesture | null;
} {
  const [gestureManager] = useState(() => new TouchGestureManager(threshold, maxTime));
  const [gesture, setGesture] = useState<TouchGesture | null>(null);

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    gestureManager.handleTouchStart(e.nativeEvent);
  }, [gestureManager]);

  const onTouchEnd = useCallback((e: React.TouchEvent) => {
    const detectedGesture = gestureManager.handleTouchEnd(e.nativeEvent);
    setGesture(detectedGesture);
  }, [gestureManager]);

  return {
    onTouchStart,
    onTouchEnd,
    gesture
  };
}

// Hook for responsive grid
export function useResponsiveGrid(
  minColumnWidth: number,
  gap: number = 16
): {
  columns: number;
  columnWidth: number;
} {
  const { width } = useViewportSize();
  const [grid, setGrid] = useState({ columns: 1, columnWidth: minColumnWidth });

  useEffect(() => {
    const columns = Math.floor((width + gap) / (minColumnWidth + gap)) || 1;
    const columnWidth = (width - (gap * (columns - 1))) / columns;

    setGrid({ columns, columnWidth });
  }, [width, minColumnWidth, gap]);

  return grid;
}

// Hook for responsive font size
export function useResponsiveFontSize(
  baseSize: number,
  scale: number = 1.2
): string {
  const { isMobile, isTablet } = useBreakpoint();

  if (isMobile) {
    return `${baseSize * 0.875}rem`;
  } else if (isTablet) {
    return `${baseSize}rem`;
  } else {
    return `${baseSize * scale}rem`;
  }
}

// Hook for responsive spacing
export function useResponsiveSpacing(
  mobileSpacing: number,
  tabletSpacing: number,
  desktopSpacing: number
): number {
  const { isMobile, isTablet, isDesktop } = useBreakpoint();

  if (isMobile) return mobileSpacing;
  if (isTablet) return tabletSpacing;
  if (isDesktop) return desktopSpacing;
  return mobileSpacing;
}

// Hook for responsive navigation
export function useResponsiveNavigation(): {
  shouldShowMobileMenu: boolean;
  shouldCollapseSidebar: boolean;
  navigationMode: 'mobile' | 'tablet' | 'desktop';
} {
  const { isMobile, isTablet, isDesktop } = useBreakpoint();

  return {
    shouldShowMobileMenu: isMobile,
    shouldCollapseSidebar: !isDesktop,
    navigationMode: isMobile ? 'mobile' : isTablet ? 'tablet' : 'desktop'
  };
}

// Hook for responsive table
export function useResponsiveTable(): {
  displayMode: 'table' | 'cards' | 'list';
  shouldStack: boolean;
} {
  const { isMobile, isTablet } = useBreakpoint();

  return {
    displayMode: isMobile ? 'cards' : isTablet ? 'list' : 'table',
    shouldStack: isMobile
  };
}

// Hook for responsive modal
export function useResponsiveModal(): {
  size: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  isFullscreen: boolean;
} {
  const { isMobile, isTablet } = useBreakpoint();

  return {
    size: isMobile ? 'full' : isTablet ? 'lg' : 'xl',
    isFullscreen: isMobile
  };
}

// Hook for responsive images
export function useResponsiveImages(): {
  shouldLoadHighRes: boolean;
  preferredFormat: 'webp' | 'jpg' | 'png';
  quality: 'low' | 'medium' | 'high';
} {
  const { isRetina } = useDeviceCapabilities();
  const { isMobile } = useBreakpoint();

  // Check for slow connection
  const connection = (navigator as any).connection;
  const isSlowConnection = connection && 
    (connection.effectiveType === 'slow-2g' || 
     connection.effectiveType === '2g' || 
     connection.saveData);

  return {
    shouldLoadHighRes: isRetina && !isMobile && !isSlowConnection,
    preferredFormat: 'webp', // Modern browsers support WebP
    quality: isSlowConnection ? 'low' : isMobile ? 'medium' : 'high'
  };
}

// Hook for responsive animations
export function useResponsiveAnimations(): {
  shouldAnimate: boolean;
  duration: 'fast' | 'normal' | 'slow';
  easing: string;
} {
  const { prefersReducedMotion } = useDeviceCapabilities();
  const { isMobile } = useBreakpoint();

  return {
    shouldAnimate: !prefersReducedMotion,
    duration: prefersReducedMotion ? 'fast' : isMobile ? 'fast' : 'normal',
    easing: prefersReducedMotion ? 'linear' : 'cubic-bezier(0.4, 0, 0.2, 1)'
  };
}

// Hook for responsive layout
export function useResponsiveLayout(): {
  containerMaxWidth: string;
  padding: string;
  margin: string;
  gridGap: string;
} {
  const { isMobile, isTablet } = useBreakpoint();

  if (isMobile) {
    return {
      containerMaxWidth: '100%',
      padding: '1rem',
      margin: '0.5rem',
      gridGap: '0.75rem'
    };
  } else if (isTablet) {
    return {
      containerMaxWidth: '768px',
      padding: '1.5rem',
      margin: '1rem',
      gridGap: '1rem'
    };
  } else {
    return {
      containerMaxWidth: '1200px',
      padding: '2rem',
      margin: '1.5rem',
      gridGap: '1.5rem'
    };
  }
}

// Hook for orientation detection
export function useOrientation(): {
  orientation: 'portrait' | 'landscape';
  isPortrait: boolean;
  isLandscape: boolean;
} {
  const isPortrait = useMediaQuery('(orientation: portrait)');
  const isLandscape = useMediaQuery('(orientation: landscape)');

  return {
    orientation: isPortrait ? 'portrait' : 'landscape',
    isPortrait,
    isLandscape
  };
}

// Hook for safe area (mobile devices with notches)
export function useSafeArea(): {
  top: number;
  right: number;
  bottom: number;
  left: number;
  hasNotch: boolean;
} {
  const [safeArea, setSafeArea] = useState({
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    hasNotch: false
  });

  useEffect(() => {
    const updateSafeArea = () => {
      const style = getComputedStyle(document.documentElement);
      
      const top = parseInt(style.getPropertyValue('env(safe-area-inset-top)') || '0');
      const right = parseInt(style.getPropertyValue('env(safe-area-inset-right)') || '0');
      const bottom = parseInt(style.getPropertyValue('env(safe-area-inset-bottom)') || '0');
      const left = parseInt(style.getPropertyValue('env(safe-area-inset-left)') || '0');
      
      const hasNotch = top > 0 || right > 0 || bottom > 0 || left > 0;

      setSafeArea({ top, right, bottom, left, hasNotch });
    };

    updateSafeArea();
    window.addEventListener('resize', updateSafeArea);
    window.addEventListener('orientationchange', updateSafeArea);

    return () => {
      window.removeEventListener('resize', updateSafeArea);
      window.removeEventListener('orientationchange', updateSafeArea);
    };
  }, []);

  return safeArea;
}