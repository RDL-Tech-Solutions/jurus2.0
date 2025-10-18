import { useState, useCallback, useRef } from 'react';

export interface LoadingState {
  isLoading: boolean;
  error: string | null;
  progress?: number;
  message?: string;
}

interface UseLoadingStatesReturn {
  loadingStates: Record<string, LoadingState>;
  setLoading: (key: string, loading: boolean, progress?: number) => void;
  setError: (key: string, error: string | null) => void;
  setProgress: (key: string, progress: number) => void;
  isAnyLoading: boolean;
  clearAll: () => void;
  withLoading: <T>(key: string, asyncFn: () => Promise<T>) => Promise<T>;
}

export const useLoadingStates = (): UseLoadingStatesReturn => {
  const [loadingStates, setLoadingStates] = useState<Record<string, LoadingState>>({});
  const timeoutsRef = useRef<Record<string, NodeJS.Timeout>>({});

  const setLoading = useCallback((key: string, loading: boolean, progress?: number) => {
    // Limpar timeout anterior se existir
    if (timeoutsRef.current[key]) {
      clearTimeout(timeoutsRef.current[key]);
      delete timeoutsRef.current[key];
    }

    setLoadingStates(prev => ({
      ...prev,
      [key]: {
        ...prev[key],
        isLoading: loading,
        progress: progress ?? prev[key]?.progress,
        error: loading ? null : prev[key]?.error || null
      }
    }));

    // Se está parando o loading, limpar após um delay para animações
    if (!loading) {
      timeoutsRef.current[key] = setTimeout(() => {
        setLoadingStates(prev => {
          const newState = { ...prev };
          delete newState[key];
          return newState;
        });
        delete timeoutsRef.current[key];
      }, 500);
    }
  }, []);

  const setError = useCallback((key: string, error: string | null) => {
    setLoadingStates(prev => ({
      ...prev,
      [key]: {
        ...prev[key],
        isLoading: false,
        error
      }
    }));
  }, []);

  const setProgress = useCallback((key: string, progress: number) => {
    setLoadingStates(prev => ({
      ...prev,
      [key]: {
        ...prev[key],
        progress: Math.max(0, Math.min(100, progress))
      }
    }));
  }, []);

  const isAnyLoading = Object.values(loadingStates).some(state => state.isLoading);

  const clearAll = useCallback(() => {
    // Limpar todos os timeouts
    Object.values(timeoutsRef.current).forEach(timeout => clearTimeout(timeout));
    timeoutsRef.current = {};
    setLoadingStates({});
  }, []);

  const withLoading = useCallback(async <T>(key: string, asyncFn: () => Promise<T>): Promise<T> => {
    try {
      setLoading(key, true);
      const result = await asyncFn();
      setLoading(key, false);
      return result;
    } catch (error) {
      setError(key, error instanceof Error ? error.message : 'Erro desconhecido');
      setLoading(key, false);
      throw error;
    }
  }, [setLoading, setError]);

  return {
    loadingStates,
    setLoading,
    setError,
    setProgress,
    isAnyLoading,
    clearAll,
    withLoading
  };
};

// Hook específico para componentes que precisam de loading com skeleton
export const useSkeletonLoading = (initialDelay: number = 300) => {
  const [showSkeleton, setShowSkeleton] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout>();

  const startLoading = useCallback(() => {
    setIsLoading(true);
    
    // Mostrar skeleton apenas após um delay para evitar flicker
    timeoutRef.current = setTimeout(() => {
      setShowSkeleton(true);
    }, initialDelay);
  }, [initialDelay]);

  const stopLoading = useCallback(() => {
    setIsLoading(false);
    
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    // Delay para animação de saída do skeleton
    setTimeout(() => {
      setShowSkeleton(false);
    }, 150);
  }, []);

  return {
    isLoading,
    showSkeleton,
    startLoading,
    stopLoading
  };
};

// Hook específico para simulações
export const useSimulationLoading = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({});

  const startSimulation = useCallback((simulationType: string = 'default') => {
    setIsLoading(true);
    setLoadingStates(prev => ({ ...prev, [simulationType]: true }));
  }, []);

  const stopSimulation = useCallback((simulationType: string = 'default') => {
    setIsLoading(false);
    setLoadingStates(prev => ({ ...prev, [simulationType]: false }));
  }, []);

  const getLoadingState = useCallback((simulationType: string = 'default') => {
    return loadingStates[simulationType] || false;
  }, [loadingStates]);

  return {
    isLoading,
    startSimulation,
    stopSimulation,
    getLoadingState
  };
};

export default useLoadingStates;