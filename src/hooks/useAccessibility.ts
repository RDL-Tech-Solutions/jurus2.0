import { useEffect, useRef, useCallback, useState } from 'react';

// Hook for managing focus
export function useFocusManagement() {
  const focusStack = useRef<HTMLElement[]>([]);

  const pushFocus = useCallback((element: HTMLElement) => {
    const currentFocus = document.activeElement as HTMLElement;
    if (currentFocus) {
      focusStack.current.push(currentFocus);
    }
    element.focus();
  }, []);

  const popFocus = useCallback(() => {
    const previousElement = focusStack.current.pop();
    if (previousElement) {
      previousElement.focus();
    }
  }, []);

  const trapFocus = useCallback((container: HTMLElement) => {
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    container.addEventListener('keydown', handleKeyDown);
    firstElement?.focus();

    return () => {
      container.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return {
    pushFocus,
    popFocus,
    trapFocus
  };
}

// Hook for keyboard navigation
export function useKeyboardNavigation(
  items: HTMLElement[],
  options: {
    loop?: boolean;
    orientation?: 'horizontal' | 'vertical' | 'both';
    onSelect?: (index: number) => void;
  } = {}
) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { loop = true, orientation = 'vertical', onSelect } = options;

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    let newIndex = currentIndex;

    switch (e.key) {
      case 'ArrowDown':
        if (orientation === 'vertical' || orientation === 'both') {
          e.preventDefault();
          newIndex = currentIndex + 1;
          if (newIndex >= items.length) {
            newIndex = loop ? 0 : items.length - 1;
          }
        }
        break;
      case 'ArrowUp':
        if (orientation === 'vertical' || orientation === 'both') {
          e.preventDefault();
          newIndex = currentIndex - 1;
          if (newIndex < 0) {
            newIndex = loop ? items.length - 1 : 0;
          }
        }
        break;
      case 'ArrowRight':
        if (orientation === 'horizontal' || orientation === 'both') {
          e.preventDefault();
          newIndex = currentIndex + 1;
          if (newIndex >= items.length) {
            newIndex = loop ? 0 : items.length - 1;
          }
        }
        break;
      case 'ArrowLeft':
        if (orientation === 'horizontal' || orientation === 'both') {
          e.preventDefault();
          newIndex = currentIndex - 1;
          if (newIndex < 0) {
            newIndex = loop ? items.length - 1 : 0;
          }
        }
        break;
      case 'Home':
        e.preventDefault();
        newIndex = 0;
        break;
      case 'End':
        e.preventDefault();
        newIndex = items.length - 1;
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        onSelect?.(currentIndex);
        return;
    }

    if (newIndex !== currentIndex) {
      setCurrentIndex(newIndex);
      items[newIndex]?.focus();
    }
  }, [currentIndex, items, loop, orientation, onSelect]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return {
    currentIndex,
    setCurrentIndex
  };
}

// Hook for screen reader announcements
export function useScreenReader() {
  const liveRegionRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Create live region if it doesn't exist
    if (!liveRegionRef.current) {
      const liveRegion = document.createElement('div');
      liveRegion.setAttribute('aria-live', 'polite');
      liveRegion.setAttribute('aria-atomic', 'true');
      liveRegion.style.position = 'absolute';
      liveRegion.style.left = '-10000px';
      liveRegion.style.width = '1px';
      liveRegion.style.height = '1px';
      liveRegion.style.overflow = 'hidden';
      document.body.appendChild(liveRegion);
      liveRegionRef.current = liveRegion;
    }

    return () => {
      if (liveRegionRef.current && document.body.contains(liveRegionRef.current)) {
        document.body.removeChild(liveRegionRef.current);
        liveRegionRef.current = null;
      }
    };
  }, []);

  const announce = useCallback((message: string, priority: 'polite' | 'assertive' = 'polite') => {
    if (liveRegionRef.current) {
      liveRegionRef.current.setAttribute('aria-live', priority);
      liveRegionRef.current.textContent = message;
      
      // Clear after announcement
      setTimeout(() => {
        if (liveRegionRef.current) {
          liveRegionRef.current.textContent = '';
        }
      }, 1000);
    }
  }, []);

  return { announce };
}

// Hook for skip links
export function useSkipLinks() {
  const skipLinksRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!skipLinksRef.current) {
      const skipLinks = document.createElement('div');
      skipLinks.className = 'skip-links';
      skipLinks.style.position = 'absolute';
      skipLinks.style.top = '-40px';
      skipLinks.style.left = '6px';
      skipLinks.style.zIndex = '1000';
      skipLinks.style.background = '#000';
      skipLinks.style.color = '#fff';
      skipLinks.style.padding = '8px';
      skipLinks.style.textDecoration = 'none';
      skipLinks.style.borderRadius = '4px';
      skipLinks.style.transition = 'top 0.3s';

      const skipToMain = document.createElement('a');
      skipToMain.href = '#main-content';
      skipToMain.textContent = 'Pular para o conteúdo principal';
      skipToMain.style.color = '#fff';
      skipToMain.style.textDecoration = 'none';

      skipToMain.addEventListener('focus', () => {
        skipLinks.style.top = '6px';
      });

      skipToMain.addEventListener('blur', () => {
        skipLinks.style.top = '-40px';
      });

      skipLinks.appendChild(skipToMain);
      document.body.insertBefore(skipLinks, document.body.firstChild);
      skipLinksRef.current = skipLinks;
    }

    return () => {
      if (skipLinksRef.current && document.body.contains(skipLinksRef.current)) {
        document.body.removeChild(skipLinksRef.current);
        skipLinksRef.current = null;
      }
    };
  }, []);
}

// Hook for ARIA attributes management
export function useAriaAttributes() {
  const setAriaLabel = useCallback((element: HTMLElement, label: string) => {
    element.setAttribute('aria-label', label);
  }, []);

  const setAriaDescribedBy = useCallback((element: HTMLElement, id: string) => {
    element.setAttribute('aria-describedby', id);
  }, []);

  const setAriaExpanded = useCallback((element: HTMLElement, expanded: boolean) => {
    element.setAttribute('aria-expanded', expanded.toString());
  }, []);

  const setAriaSelected = useCallback((element: HTMLElement, selected: boolean) => {
    element.setAttribute('aria-selected', selected.toString());
  }, []);

  const setAriaChecked = useCallback((element: HTMLElement, checked: boolean | 'mixed') => {
    element.setAttribute('aria-checked', checked.toString());
  }, []);

  const setAriaDisabled = useCallback((element: HTMLElement, disabled: boolean) => {
    element.setAttribute('aria-disabled', disabled.toString());
  }, []);

  const setAriaHidden = useCallback((element: HTMLElement, hidden: boolean) => {
    element.setAttribute('aria-hidden', hidden.toString());
  }, []);

  return {
    setAriaLabel,
    setAriaDescribedBy,
    setAriaExpanded,
    setAriaSelected,
    setAriaChecked,
    setAriaDisabled,
    setAriaHidden
  };
}

// Hook for color contrast checking
export function useColorContrast() {
  const checkContrast = useCallback((foreground: string, background: string): {
    ratio: number;
    meetsAA: boolean;
    meetsAAA: boolean;
  } => {
    // Convert colors to RGB
    const getRGB = (color: string) => {
      const canvas = document.createElement('canvas');
      canvas.width = canvas.height = 1;
      const ctx = canvas.getContext('2d')!;
      ctx.fillStyle = color;
      ctx.fillRect(0, 0, 1, 1);
      const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
      return [r, g, b];
    };

    // Calculate relative luminance
    const getLuminance = (rgb: number[]) => {
      const [r, g, b] = rgb.map(c => {
        c = c / 255;
        return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
      });
      return 0.2126 * r + 0.7152 * g + 0.0722 * b;
    };

    const fgRGB = getRGB(foreground);
    const bgRGB = getRGB(background);
    
    const fgLuminance = getLuminance(fgRGB);
    const bgLuminance = getLuminance(bgRGB);
    
    const lighter = Math.max(fgLuminance, bgLuminance);
    const darker = Math.min(fgLuminance, bgLuminance);
    
    const ratio = (lighter + 0.05) / (darker + 0.05);

    return {
      ratio,
      meetsAA: ratio >= 4.5,
      meetsAAA: ratio >= 7
    };
  }, []);

  return { checkContrast };
}

// Hook for reduced motion preferences
export function useReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }
    return false;
  });

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);

    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  return prefersReducedMotion;
}

// Hook for high contrast mode detection
export function useHighContrast() {
  const [isHighContrast, setIsHighContrast] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-contrast: high)').matches;
    }
    return false;
  });

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-contrast: high)');
    const handler = (e: MediaQueryListEvent) => setIsHighContrast(e.matches);

    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  return isHighContrast;
}

// Hook for form accessibility
export function useFormAccessibility() {
  const associateLabel = useCallback((input: HTMLElement, labelText: string) => {
    const labelId = `label-${Math.random().toString(36).substr(2, 9)}`;
    
    let label = document.querySelector(`label[for="${input.id}"]`) as HTMLLabelElement;
    if (!label) {
      label = document.createElement('label');
      label.htmlFor = input.id;
      label.id = labelId;
      input.parentNode?.insertBefore(label, input);
    }
    
    label.textContent = labelText;
    input.setAttribute('aria-labelledby', labelId);
  }, []);

  const addErrorMessage = useCallback((input: HTMLElement, message: string) => {
    const errorId = `error-${input.id}`;
    
    let errorElement = document.getElementById(errorId);
    if (!errorElement) {
      errorElement = document.createElement('div');
      errorElement.id = errorId;
      errorElement.setAttribute('role', 'alert');
      errorElement.className = 'error-message';
      input.parentNode?.insertBefore(errorElement, input.nextSibling);
    }
    
    errorElement.textContent = message;
    input.setAttribute('aria-describedby', errorId);
    input.setAttribute('aria-invalid', 'true');
  }, []);

  const removeErrorMessage = useCallback((input: HTMLElement) => {
    const errorId = `error-${input.id}`;
    const errorElement = document.getElementById(errorId);
    
    if (errorElement) {
      errorElement.remove();
    }
    
    input.removeAttribute('aria-describedby');
    input.removeAttribute('aria-invalid');
  }, []);

  return {
    associateLabel,
    addErrorMessage,
    removeErrorMessage
  };
}

// Hook for landmark management
export function useLandmarks() {
  const ensureLandmarks = useCallback(() => {
    const landmarks = [
      { selector: 'header', role: 'banner' },
      { selector: 'nav', role: 'navigation' },
      { selector: 'main', role: 'main' },
      { selector: 'aside', role: 'complementary' },
      { selector: 'footer', role: 'contentinfo' }
    ];

    landmarks.forEach(({ selector, role }) => {
      const elements = document.querySelectorAll(selector);
      elements.forEach(element => {
        if (!element.getAttribute('role')) {
          element.setAttribute('role', role);
        }
      });
    });
  }, []);

  useEffect(() => {
    ensureLandmarks();
    
    // Re-run when DOM changes
    const observer = new MutationObserver(ensureLandmarks);
    observer.observe(document.body, { childList: true, subtree: true });
    
    return () => observer.disconnect();
  }, [ensureLandmarks]);

  return { ensureLandmarks };
}

// Hook for accessible tooltips
export function useTooltip() {
  const [isVisible, setIsVisible] = useState(false);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLElement>(null);

  const showTooltip = useCallback(() => {
    setIsVisible(true);
    if (tooltipRef.current && triggerRef.current) {
      triggerRef.current.setAttribute('aria-describedby', tooltipRef.current.id);
    }
  }, []);

  const hideTooltip = useCallback(() => {
    setIsVisible(false);
    if (triggerRef.current) {
      triggerRef.current.removeAttribute('aria-describedby');
    }
  }, []);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      hideTooltip();
    }
  }, [hideTooltip]);

  useEffect(() => {
    if (isVisible) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isVisible, handleKeyDown]);

  return {
    isVisible,
    showTooltip,
    hideTooltip,
    tooltipRef,
    triggerRef
  };
}