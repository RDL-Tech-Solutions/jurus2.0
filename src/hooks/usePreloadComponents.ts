import { useEffect } from 'react';

// Hook para preload de componentes críticos
export const usePreloadComponents = () => {
  useEffect(() => {
    // Preload de componentes secundários após 5 segundos
    const secondaryPreloadTimer = setTimeout(() => {
      // import('../components/SistemaEducacao').catch(() => {});
    }, 5000);

    return () => {
      clearTimeout(secondaryPreloadTimer);
    };
  }, []);
};

// Hook para preload baseado em hover
export const useHoverPreload = () => {
  const preloadComponent = (componentPath: string) => {
    return () => {
      import(componentPath).catch(() => {});
    };
  };

  return {
    preloadTemas: preloadComponent('../components/SistemaTemas'),
    // preloadEducacao: preloadComponent('../components/SistemaEducacao'),
    preloadNotificacoes: preloadComponent('../components/CentroNotificacoes'),
    preloadAcessibilidade: preloadComponent('../components/ConfiguracoesAcessibilidade'),
    // Missing functions that were causing errors
    preloadComparador: preloadComponent('../components/ComparadorInvestimentos'),
    preloadHistorico: preloadComponent('../components/HistoricoSimulacoes'),
    preloadMetas: preloadComponent('../components/MetasFinanceiras'),
    preloadRelatorios: preloadComponent('../components/TemplatesRelatorio'),
    preloadSimulador: preloadComponent('../components/FormularioEntrada'),
  };
};

// Hook para preload inteligente baseado no histórico de navegação
export const useIntelligentPreload = () => {
  useEffect(() => {
    // Verificar histórico de navegação no localStorage
    const navigationHistory = JSON.parse(localStorage.getItem('navigation-history') || '[]');
    
    // Preload dos componentes mais visitados
    const mostVisited = navigationHistory
      .reduce((acc: Record<string, number>, path: string) => {
        acc[path] = (acc[path] || 0) + 1;
        return acc;
      }, {});

    const sortedPaths = Object.entries(mostVisited)
      .sort(([,a], [,b]) => (b as number) - (a as number))
      .slice(0, 3)
      .map(([path]) => path);

    // Preload baseado no histórico
    setTimeout(() => {
      sortedPaths.forEach(path => {
        switch (path) {
          case '/educacao':
            // import('../components/SistemaEducacao').catch(() => {});
            break;
        }
      });
    }, 1000);
  }, []);

  // Função para registrar navegação
  const registerNavigation = (path: string) => {
    const history = JSON.parse(localStorage.getItem('navigation-history') || '[]');
    history.push(path);
    
    // Manter apenas os últimos 50 registros
    if (history.length > 50) {
      history.splice(0, history.length - 50);
    }
    
    localStorage.setItem('navigation-history', JSON.stringify(history));
  };

  return { registerNavigation };
};