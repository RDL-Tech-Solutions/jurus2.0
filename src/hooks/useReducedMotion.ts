import { useState, useEffect } from 'react';

/**
 * Hook para detectar preferência de movimento reduzido do usuário
 * Respeita a configuração de acessibilidade do sistema operacional
 */
export function useReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    // Verificar se o navegador suporta a media query
    if (typeof window === 'undefined' || !window.matchMedia) {
      return;
    }

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    // Definir estado inicial
    setPrefersReducedMotion(mediaQuery.matches);

    // Listener para mudanças na preferência
    const handleChange = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };

    // Adicionar listener
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
    } else {
      // Fallback para navegadores mais antigos
      mediaQuery.addListener(handleChange);
    }

    // Cleanup
    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handleChange);
      } else {
        mediaQuery.removeListener(handleChange);
      }
    };
  }, []);

  return prefersReducedMotion;
}

/**
 * Hook para obter configurações de animação otimizadas
 * Retorna configurações reduzidas se o usuário preferir movimento reduzido
 */
export function useAnimationConfig() {
  const prefersReducedMotion = useReducedMotion();

  return {
    prefersReducedMotion,
    // Durações reduzidas para usuários que preferem menos movimento
    duration: prefersReducedMotion ? 0.1 : 0.3,
    staggerDelay: prefersReducedMotion ? 0.02 : 0.1,
    // Desabilitar animações complexas
    enableComplexAnimations: !prefersReducedMotion,
    // Configurações de spring mais suaves
    spring: prefersReducedMotion 
      ? { type: "tween" as const, duration: 0.1 }
      : { type: "spring" as const, stiffness: 400, damping: 25 },
    // Configurações de hover reduzidas
    hoverScale: prefersReducedMotion ? 1 : 1.02,
    tapScale: prefersReducedMotion ? 1 : 0.98
  };
}