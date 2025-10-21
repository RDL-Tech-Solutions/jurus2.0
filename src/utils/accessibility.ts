// Comprehensive accessibility utilities

// ARIA live region manager
export class LiveRegionManager {
  private regions: Map<string, HTMLElement> = new Map();

  constructor() {
    this.createDefaultRegions();
  }

  private createDefaultRegions() {
    // Create polite live region
    const politeRegion = document.createElement('div');
    politeRegion.setAttribute('aria-live', 'polite');
    politeRegion.setAttribute('aria-atomic', 'true');
    politeRegion.className = 'sr-only';
    politeRegion.id = 'live-region-polite';
    document.body.appendChild(politeRegion);
    this.regions.set('polite', politeRegion);

    // Create assertive live region
    const assertiveRegion = document.createElement('div');
    assertiveRegion.setAttribute('aria-live', 'assertive');
    assertiveRegion.setAttribute('aria-atomic', 'true');
    assertiveRegion.className = 'sr-only';
    assertiveRegion.id = 'live-region-assertive';
    document.body.appendChild(assertiveRegion);
    this.regions.set('assertive', assertiveRegion);

    // Create status region
    const statusRegion = document.createElement('div');
    statusRegion.setAttribute('role', 'status');
    statusRegion.setAttribute('aria-atomic', 'true');
    statusRegion.className = 'sr-only';
    statusRegion.id = 'live-region-status';
    document.body.appendChild(statusRegion);
    this.regions.set('status', statusRegion);
  }

  announce(message: string, priority: 'polite' | 'assertive' | 'status' = 'polite') {
    const region = this.regions.get(priority);
    if (region) {
      // Clear and set new message
      region.textContent = '';
      setTimeout(() => {
        region.textContent = message;
      }, 100);
    }
  }

  clear(priority?: 'polite' | 'assertive' | 'status') {
    if (priority) {
      const region = this.regions.get(priority);
      if (region) region.textContent = '';
    } else {
      this.regions.forEach(region => {
        region.textContent = '';
      });
    }
  }
}

// Global live region manager instance
export const liveRegionManager = new LiveRegionManager();

// Focus management utilities
export class FocusManager {
  private focusStack: HTMLElement[] = [];
  private trapStack: HTMLElement[] = [];

  // Save current focus and set new focus
  pushFocus(element: HTMLElement) {
    const currentFocus = document.activeElement as HTMLElement;
    if (currentFocus) {
      this.focusStack.push(currentFocus);
    }
    element.focus();
  }

  // Restore previous focus
  popFocus() {
    const previousFocus = this.focusStack.pop();
    if (previousFocus && document.contains(previousFocus)) {
      previousFocus.focus();
    }
  }

  // Trap focus within an element
  trapFocus(container: HTMLElement) {
    this.trapStack.push(container);
    
    const focusableElements = this.getFocusableElements(container);
    if (focusableElements.length === 0) return;

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

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
    };

    container.addEventListener('keydown', handleKeyDown);
    firstElement.focus();

    // Store cleanup function
    (container as any)._focusTrapCleanup = () => {
      container.removeEventListener('keydown', handleKeyDown);
    };
  }

  // Release focus trap
  releaseFocusTrap() {
    const container = this.trapStack.pop();
    if (container && (container as any)._focusTrapCleanup) {
      (container as any)._focusTrapCleanup();
      delete (container as any)._focusTrapCleanup;
    }
  }

  // Get all focusable elements within a container
  getFocusableElements(container: HTMLElement): HTMLElement[] {
    const focusableSelectors = [
      'a[href]',
      'button:not([disabled])',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      '[tabindex]:not([tabindex="-1"])',
      '[contenteditable="true"]'
    ].join(', ');

    return Array.from(container.querySelectorAll(focusableSelectors))
      .filter(element => {
        return this.isVisible(element as HTMLElement) && !this.isInert(element as HTMLElement);
      }) as HTMLElement[];
  }

  private isVisible(element: HTMLElement): boolean {
    const style = window.getComputedStyle(element);
    return style.display !== 'none' && 
           style.visibility !== 'hidden' && 
           style.opacity !== '0';
  }

  private isInert(element: HTMLElement): boolean {
    return element.hasAttribute('inert') || 
           element.closest('[inert]') !== null;
  }
}

// Global focus manager instance
export const focusManager = new FocusManager();

// Keyboard navigation utilities
export class KeyboardNavigationManager {
  private roving: Map<HTMLElement, HTMLElement[]> = new Map();

  // Set up roving tabindex for a group of elements
  setupRovingTabindex(container: HTMLElement, items: HTMLElement[], initialIndex = 0) {
    if (items.length === 0) return;

    // Set initial tabindex values
    items.forEach((item, index) => {
      item.setAttribute('tabindex', index === initialIndex ? '0' : '-1');
    });

    this.roving.set(container, items);

    const handleKeyDown = (e: KeyboardEvent) => {
      const currentIndex = items.findIndex(item => item === e.target);
      if (currentIndex === -1) return;

      let newIndex = currentIndex;

      switch (e.key) {
        case 'ArrowRight':
        case 'ArrowDown':
          e.preventDefault();
          newIndex = (currentIndex + 1) % items.length;
          break;
        case 'ArrowLeft':
        case 'ArrowUp':
          e.preventDefault();
          newIndex = currentIndex === 0 ? items.length - 1 : currentIndex - 1;
          break;
        case 'Home':
          e.preventDefault();
          newIndex = 0;
          break;
        case 'End':
          e.preventDefault();
          newIndex = items.length - 1;
          break;
        default:
          return;
      }

      // Update tabindex and focus
      items[currentIndex].setAttribute('tabindex', '-1');
      items[newIndex].setAttribute('tabindex', '0');
      items[newIndex].focus();
    };

    container.addEventListener('keydown', handleKeyDown);

    // Store cleanup function
    (container as any)._rovingCleanup = () => {
      container.removeEventListener('keydown', handleKeyDown);
      this.roving.delete(container);
    };
  }

  // Clean up roving tabindex
  cleanupRovingTabindex(container: HTMLElement) {
    if ((container as any)._rovingCleanup) {
      (container as any)._rovingCleanup();
      delete (container as any)._rovingCleanup;
    }
  }
}

// Global keyboard navigation manager
export const keyboardNavigationManager = new KeyboardNavigationManager();

// Screen reader utilities
export function announceToScreenReader(message: string, priority: 'polite' | 'assertive' = 'polite') {
  liveRegionManager.announce(message, priority);
}

export function setScreenReaderText(element: HTMLElement, text: string) {
  element.setAttribute('aria-label', text);
}

export function hideFromScreenReader(element: HTMLElement) {
  element.setAttribute('aria-hidden', 'true');
}

export function showToScreenReader(element: HTMLElement) {
  element.removeAttribute('aria-hidden');
}

// Color contrast utilities
export function getContrastRatio(color1: string, color2: string): number {
  const rgb1 = hexToRgb(color1);
  const rgb2 = hexToRgb(color2);
  
  if (!rgb1 || !rgb2) return 0;

  const l1 = getRelativeLuminance(rgb1);
  const l2 = getRelativeLuminance(rgb2);

  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);

  return (lighter + 0.05) / (darker + 0.05);
}

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

function getRelativeLuminance(rgb: { r: number; g: number; b: number }): number {
  const { r, g, b } = rgb;
  
  const [rs, gs, bs] = [r, g, b].map(c => {
    c = c / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });

  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

export function meetsWCAGContrast(color1: string, color2: string, level: 'AA' | 'AAA' = 'AA'): boolean {
  const ratio = getContrastRatio(color1, color2);
  return level === 'AA' ? ratio >= 4.5 : ratio >= 7;
}

// Motion preferences
export function respectsReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function setupMotionPreferences() {
  const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  
  const updateMotionPreference = () => {
    if (mediaQuery.matches) {
      document.documentElement.classList.add('reduce-motion');
    } else {
      document.documentElement.classList.remove('reduce-motion');
    }
  };

  updateMotionPreference();
  mediaQuery.addEventListener('change', updateMotionPreference);
}

// High contrast mode detection
export function detectHighContrastMode(): boolean {
  // Create a test element to detect high contrast mode
  const testElement = document.createElement('div');
  testElement.style.cssText = `
    position: absolute;
    top: -999px;
    left: -999px;
    width: 1px;
    height: 1px;
    background-color: rgb(31, 41, 59);
    border: 1px solid rgb(31, 41, 59);
  `;
  
  document.body.appendChild(testElement);
  
  const computedStyle = window.getComputedStyle(testElement);
  const isHighContrast = computedStyle.backgroundColor !== computedStyle.borderColor;
  
  document.body.removeChild(testElement);
  
  return isHighContrast;
}

// Skip links management
export function createSkipLink(target: string, text: string): HTMLAnchorElement {
  const skipLink = document.createElement('a');
  skipLink.href = `#${target}`;
  skipLink.textContent = text;
  skipLink.className = 'skip-link sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-blue-600 focus:text-white focus:rounded';
  
  skipLink.addEventListener('click', (e) => {
    e.preventDefault();
    const targetElement = document.getElementById(target);
    if (targetElement) {
      targetElement.focus();
      targetElement.scrollIntoView({ behavior: 'smooth' });
    }
  });

  return skipLink;
}

// Form accessibility helpers
export function associateLabel(input: HTMLInputElement, labelText: string): HTMLLabelElement {
  const label = document.createElement('label');
  label.textContent = labelText;
  
  if (input.id) {
    label.setAttribute('for', input.id);
  } else {
    const id = `input-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    input.id = id;
    label.setAttribute('for', id);
  }

  return label;
}

export function addErrorMessage(input: HTMLInputElement, message: string): HTMLElement {
  const errorId = `${input.id}-error`;
  let errorElement = document.getElementById(errorId);
  
  if (!errorElement) {
    errorElement = document.createElement('div');
    errorElement.id = errorId;
    errorElement.className = 'error-message text-red-600 text-sm mt-1';
    errorElement.setAttribute('role', 'alert');
    input.parentNode?.insertBefore(errorElement, input.nextSibling);
  }
  
  errorElement.textContent = message;
  input.setAttribute('aria-describedby', errorId);
  input.setAttribute('aria-invalid', 'true');
  
  return errorElement;
}

export function removeErrorMessage(input: HTMLInputElement): void {
  const errorId = `${input.id}-error`;
  const errorElement = document.getElementById(errorId);
  
  if (errorElement) {
    errorElement.remove();
  }
  
  input.removeAttribute('aria-describedby');
  input.removeAttribute('aria-invalid');
}

// Landmark management
export function ensureLandmarks() {
  // Ensure main landmark exists
  if (!document.querySelector('main')) {
    const main = document.createElement('main');
    main.setAttribute('role', 'main');
    main.id = 'main-content';
    
    const content = document.querySelector('#root > div') || document.body;
    if (content) {
      Array.from(content.children).forEach(child => {
        if (child.tagName !== 'HEADER' && child.tagName !== 'NAV' && child.tagName !== 'FOOTER') {
          main.appendChild(child);
        }
      });
      content.appendChild(main);
    }
  }

  // Ensure navigation landmarks have proper labels
  const navElements = document.querySelectorAll('nav');
  navElements.forEach((nav, index) => {
    if (!nav.getAttribute('aria-label') && !nav.getAttribute('aria-labelledby')) {
      nav.setAttribute('aria-label', `Navigation ${index + 1}`);
    }
  });
}

// Initialize all accessibility features
export function initializeAccessibility() {
  // Set up motion preferences
  setupMotionPreferences();
  
  // Ensure proper landmarks
  ensureLandmarks();
  
  // Add skip links
  const skipToMain = createSkipLink('main-content', 'Skip to main content');
  document.body.insertBefore(skipToMain, document.body.firstChild);
  
  // Detect high contrast mode
  if (detectHighContrastMode()) {
    document.documentElement.classList.add('high-contrast');
  }
  
  // Set up global keyboard shortcuts
  document.addEventListener('keydown', (e) => {
    // Alt + 1: Skip to main content
    if (e.altKey && e.key === '1') {
      e.preventDefault();
      const main = document.getElementById('main-content');
      if (main) {
        main.focus();
        main.scrollIntoView({ behavior: 'smooth' });
      }
    }
    
    // Alt + 2: Skip to navigation
    if (e.altKey && e.key === '2') {
      e.preventDefault();
      const nav = document.querySelector('nav');
      if (nav) {
        const firstLink = nav.querySelector('a, button');
        if (firstLink) {
          (firstLink as HTMLElement).focus();
        }
      }
    }
  });
}

// Accessibility testing utilities
export function runAccessibilityAudit(): {
  issues: string[];
  warnings: string[];
  passed: string[];
} {
  const issues: string[] = [];
  const warnings: string[] = [];
  const passed: string[] = [];

  // Check for alt text on images
  const images = document.querySelectorAll('img');
  images.forEach((img, index) => {
    if (!img.alt && !img.getAttribute('aria-label')) {
      issues.push(`Image ${index + 1} missing alt text`);
    } else {
      passed.push(`Image ${index + 1} has alt text`);
    }
  });

  // Check for form labels
  const inputs = document.querySelectorAll('input, select, textarea');
  inputs.forEach((input, index) => {
    const hasLabel = input.getAttribute('aria-label') || 
                    input.getAttribute('aria-labelledby') ||
                    document.querySelector(`label[for="${input.id}"]`);
    
    if (!hasLabel) {
      issues.push(`Form control ${index + 1} missing label`);
    } else {
      passed.push(`Form control ${index + 1} has label`);
    }
  });

  // Check for heading hierarchy
  const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
  let previousLevel = 0;
  headings.forEach((heading, index) => {
    const level = parseInt(heading.tagName.charAt(1));
    if (level > previousLevel + 1) {
      warnings.push(`Heading ${index + 1} skips levels (h${previousLevel} to h${level})`);
    } else {
      passed.push(`Heading ${index + 1} follows proper hierarchy`);
    }
    previousLevel = level;
  });

  // Check for main landmark
  const main = document.querySelector('main');
  if (!main) {
    issues.push('Missing main landmark');
  } else {
    passed.push('Main landmark present');
  }

  return { issues, warnings, passed };
}