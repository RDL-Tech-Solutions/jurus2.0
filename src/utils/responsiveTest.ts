import { useState, useEffect } from 'react';

// Utilitário para testar responsividade
export const BREAKPOINTS = {
  mobile: 320,
  mobileLarge: 425,
  tablet: 768,
  laptop: 1024,
  laptopLarge: 1440,
  desktop: 2560
} as const;

export const RESPONSIVE_TESTS = [
  {
    name: 'Mobile Portrait',
    width: 375,
    height: 667,
    description: 'iPhone SE/8 portrait'
  },
  {
    name: 'Mobile Landscape',
    width: 667,
    height: 375,
    description: 'iPhone SE/8 landscape'
  },
  {
    name: 'Tablet Portrait',
    width: 768,
    height: 1024,
    description: 'iPad portrait'
  },
  {
    name: 'Tablet Landscape',
    width: 1024,
    height: 768,
    description: 'iPad landscape'
  },
  {
    name: 'Desktop Small',
    width: 1280,
    height: 720,
    description: 'Small desktop'
  },
  {
    name: 'Desktop Large',
    width: 1920,
    height: 1080,
    description: 'Full HD desktop'
  }
];

// Função para detectar o breakpoint atual
export const getCurrentBreakpoint = (): keyof typeof BREAKPOINTS => {
  const width = window.innerWidth;
  
  if (width < BREAKPOINTS.mobileLarge) return 'mobile';
  if (width < BREAKPOINTS.tablet) return 'mobileLarge';
  if (width < BREAKPOINTS.laptop) return 'tablet';
  if (width < BREAKPOINTS.laptopLarge) return 'laptop';
  if (width < BREAKPOINTS.desktop) return 'laptopLarge';
  return 'desktop';
};

// Hook para monitorar mudanças de breakpoint
export const useBreakpoint = () => {
  const [breakpoint, setBreakpoint] = useState(getCurrentBreakpoint());
  
  useEffect(() => {
    const handleResize = () => {
      setBreakpoint(getCurrentBreakpoint());
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  return breakpoint;
};

// Função para verificar se um elemento está visível na viewport
export const isElementInViewport = (element: HTMLElement): boolean => {
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
};

// Função para verificar overflow horizontal
export const hasHorizontalOverflow = (element: HTMLElement): boolean => {
  return element.scrollWidth > element.clientWidth;
};

// Função para verificar se o layout está quebrado
export const checkLayoutIntegrity = (): {
  hasOverflow: boolean;
  hasFixedHeaderOverlap: boolean;
  hasBrokenNavigation: boolean;
  issues: string[];
} => {
  const issues: string[] = [];
  let hasOverflow = false;
  let hasFixedHeaderOverlap = false;
  let hasBrokenNavigation = false;
  
  // Verificar overflow horizontal no body
  if (hasHorizontalOverflow(document.body)) {
    hasOverflow = true;
    issues.push('Overflow horizontal detectado no body');
  }
  
  // Verificar header fixo
  const header = document.querySelector('header, [role="banner"]');
  if (header) {
    const headerRect = header.getBoundingClientRect();
    const mainContent = document.querySelector('main, [role="main"]');
    
    if (mainContent) {
      const mainRect = mainContent.getBoundingClientRect();
      if (mainRect.top < headerRect.bottom) {
        hasFixedHeaderOverlap = true;
        issues.push('Sobreposição do header fixo detectada');
      }
    }
  }
  
  // Verificar navegação
  const navigation = document.querySelector('nav, [role="navigation"]') as HTMLElement;
  if (navigation && hasHorizontalOverflow(navigation)) {
    hasBrokenNavigation = true;
    issues.push('Overflow na navegação detectado');
  }
  
  return {
    hasOverflow,
    hasFixedHeaderOverlap,
    hasBrokenNavigation,
    issues
  };
};

// Função para gerar relatório de responsividade
export const generateResponsiveReport = (): {
  breakpoint: keyof typeof BREAKPOINTS;
  viewport: { width: number; height: number };
  layoutIntegrity: ReturnType<typeof checkLayoutIntegrity>;
  timestamp: string;
} => {
  return {
    breakpoint: getCurrentBreakpoint(),
    viewport: {
      width: window.innerWidth,
      height: window.innerHeight
    },
    layoutIntegrity: checkLayoutIntegrity(),
    timestamp: new Date().toISOString()
  };
};