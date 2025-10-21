import { useState, useEffect, useCallback } from 'react';

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  target: string;
  position: 'top' | 'bottom' | 'left' | 'right' | 'center';
  action?: 'click' | 'hover' | 'input' | 'scroll';
  actionText?: string;
  tip?: string;
  highlight?: boolean;
  autoAdvance?: boolean;
  delay?: number;
}

interface OnboardingConfig {
  id: string;
  name: string;
  steps: OnboardingStep[];
  autoStart?: boolean;
  showOnFirstVisit?: boolean;
  version?: string;
}

interface UseOnboardingReturn {
  isActive: boolean;
  currentTour: OnboardingConfig | null;
  availableTours: OnboardingConfig[];
  startTour: (tourId: string) => void;
  completeTour: () => void;
  skipTour: () => void;
  resetTour: (tourId: string) => void;
  hasCompletedTour: (tourId: string) => boolean;
  shouldShowTour: (tourId: string) => boolean;
}

const STORAGE_KEY = 'jurus_onboarding_state';

// Tours predefinidos
const defaultTours: OnboardingConfig[] = [
  {
    id: 'welcome',
    name: 'Bem-vindo ao Jurus',
    autoStart: true,
    showOnFirstVisit: true,
    version: '1.0',
    steps: [
      {
        id: 'welcome-intro',
        title: 'Bem-vindo ao Jurus! 🎉',
        description: 'Sua plataforma completa para gestão de investimentos. Vamos fazer um tour rápido pelas principais funcionalidades.',
        target: 'body',
        position: 'center',
        autoAdvance: true,
        delay: 4000,
        tip: 'Este tour levará apenas 2 minutos e te ajudará a aproveitar ao máximo a plataforma.'
      },
      {
        id: 'navigation',
        title: 'Navegação Principal',
        description: 'Use esta barra de navegação para acessar todas as funcionalidades da plataforma.',
        target: '[data-testid="navigation-tabs"]',
        position: 'bottom',
        highlight: true,
        tip: 'Você pode usar as teclas de seta ou clicar diretamente nas abas.'
      },
      {
        id: 'dashboard',
        title: 'Dashboard Executivo',
        description: 'Aqui você encontra um resumo completo dos seus investimentos e performance.',
        target: '[data-testid="tab-dashboard"]',
        position: 'bottom',
        action: 'click',
        actionText: 'Clique para acessar o Dashboard',
        highlight: true
      },
      {
        id: 'portfolio',
        title: 'Gestão de Portfólio',
        description: 'Gerencie seus investimentos, adicione novos ativos e acompanhe a performance.',
        target: '[data-testid="portfolio-section"]',
        position: 'top',
        highlight: true,
        tip: 'Você pode criar múltiplos portfólios para diferentes estratégias.'
      },
      {
        id: 'reports',
        title: 'Relatórios Avançados',
        description: 'Acesse relatórios detalhados e análises avançadas dos seus investimentos.',
        target: '[data-testid="tab-relatorios"]',
        position: 'bottom',
        highlight: true
      },

      {
        id: 'simulator',
        title: 'Simulador de Cenários',
        description: 'Simule diferentes cenários de mercado e veja como seus investimentos se comportariam.',
        target: '[data-testid="tab-simulador"]',
        position: 'bottom',
        highlight: true
      },
      {
        id: 'data-management',
        title: 'Gerenciamento de Dados',
        description: 'Gerencie seus perfis, faça backup dos dados e configure a plataforma.',
        target: '[data-testid="data-manager-button"]',
        position: 'left',
        highlight: true,
        tip: 'Seus dados são salvos localmente no seu navegador para máxima privacidade.'
      },
      {
        id: 'complete',
        title: 'Tour Concluído! ✅',
        description: 'Parabéns! Agora você conhece as principais funcionalidades. Comece criando seu primeiro portfólio.',
        target: 'body',
        position: 'center',
        tip: 'Você pode acessar este tour novamente através do menu de ajuda.'
      }
    ]
  },
  {
    id: 'portfolio-creation',
    name: 'Criando seu Primeiro Portfólio',
    showOnFirstVisit: false,
    steps: [
      {
        id: 'create-portfolio-intro',
        title: 'Vamos Criar seu Primeiro Portfólio',
        description: 'Um portfólio é onde você organiza seus investimentos por estratégia ou objetivo.',
        target: 'body',
        position: 'center'
      },
      {
        id: 'portfolio-form',
        title: 'Formulário de Portfólio',
        description: 'Preencha as informações básicas do seu portfólio.',
        target: '[data-testid="portfolio-form"]',
        position: 'right',
        highlight: true,
        action: 'input',
        actionText: 'Preencha o nome do portfólio'
      },
      {
        id: 'add-investment',
        title: 'Adicionar Investimentos',
        description: 'Agora adicione seus primeiros investimentos ao portfólio.',
        target: '[data-testid="add-investment-button"]',
        position: 'top',
        highlight: true,
        action: 'click',
        actionText: 'Clique para adicionar um investimento'
      }
    ]
  },
  {
    id: 'advanced-features',
    name: 'Funcionalidades Avançadas',
    showOnFirstVisit: false,
    steps: [
      {
        id: 'themes',
        title: 'Sistema de Temas',
        description: 'Personalize a aparência da plataforma com diferentes temas.',
        target: '[data-testid="tab-temas"]',
        position: 'bottom',
        highlight: true
      },
      {
        id: 'education',
        title: 'Centro Educacional',
        description: 'Aprenda sobre investimentos com nosso conteúdo educacional.',
        target: '[data-testid="tab-educacao"]',
        position: 'bottom',
        highlight: true
      },
      {
        id: 'notifications',
        title: 'Central de Notificações',
        description: 'Receba alertas importantes sobre seus investimentos.',
        target: '[data-testid="tab-notificacoes"]',
        position: 'bottom',
        highlight: true
      },
      {
        id: 'accessibility',
        title: 'Configurações de Acessibilidade',
        description: 'Ajuste a plataforma para suas necessidades de acessibilidade.',
        target: '[data-testid="tab-acessibilidade"]',
        position: 'bottom',
        highlight: true
      }
    ]
  }
];

export const useOnboarding = (): UseOnboardingReturn => {
  const [isActive, setIsActive] = useState(false);
  const [currentTour, setCurrentTour] = useState<OnboardingConfig | null>(null);
  const [completedTours, setCompletedTours] = useState<Set<string>>(new Set());
  const [skippedTours, setSkippedTours] = useState<Set<string>>(new Set());

  // Carregar estado do localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const state = JSON.parse(saved);
        // Verificar se o estado é válido
        if (state && typeof state === 'object') {
          setCompletedTours(new Set(Array.isArray(state.completed) ? state.completed : []));
          setSkippedTours(new Set(Array.isArray(state.skipped) ? state.skipped : []));
        }
      }
    } catch (error) {
      console.warn('Erro ao carregar estado do onboarding:', error);
      // Limpar localStorage corrompido
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  // Salvar estado no localStorage
  const saveState = useCallback((completed: Set<string>, skipped: Set<string>) => {
    try {
      const state = {
        completed: Array.from(completed),
        skipped: Array.from(skipped),
        lastUpdated: Date.now(),
        version: '1.0' // Versão para futuras migrações
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      
      // Verificar se foi salvo corretamente
      const verification = localStorage.getItem(STORAGE_KEY);
      if (!verification) {
        throw new Error('Falha ao verificar salvamento no localStorage');
      }
    } catch (error) {
      console.warn('Erro ao salvar estado do onboarding:', error);
      // Tentar novamente após um pequeno delay
      setTimeout(() => {
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify({
            completed: Array.from(completed),
            skipped: Array.from(skipped),
            lastUpdated: Date.now(),
            version: '1.0'
          }));
        } catch (retryError) {
          console.error('Falha crítica ao salvar estado do onboarding:', retryError);
        }
      }, 100);
    }
  }, []);

  const startTour = useCallback((tourId: string) => {
    const tour = defaultTours.find(t => t.id === tourId);
    if (tour) {
      setCurrentTour(tour);
      setIsActive(true);
    }
  }, []);

  const completeTour = useCallback(() => {
    if (currentTour) {
      const newCompleted = new Set([...completedTours, currentTour.id]);
      setCompletedTours(newCompleted);
      saveState(newCompleted, skippedTours);
    }
    setIsActive(false);
    setCurrentTour(null);
  }, [currentTour, completedTours, skippedTours, saveState]);

  const skipTour = useCallback(() => {
    if (currentTour) {
      const newSkipped = new Set([...skippedTours, currentTour.id]);
      setSkippedTours(newSkipped);
      saveState(completedTours, newSkipped);
    }
    setIsActive(false);
    setCurrentTour(null);
  }, [currentTour, completedTours, skippedTours, saveState]);

  const resetTour = useCallback((tourId: string) => {
    const newCompleted = new Set(completedTours);
    const newSkipped = new Set(skippedTours);
    newCompleted.delete(tourId);
    newSkipped.delete(tourId);
    setCompletedTours(newCompleted);
    setSkippedTours(newSkipped);
    saveState(newCompleted, newSkipped);
  }, [completedTours, skippedTours, saveState]);

  const hasCompletedTour = useCallback((tourId: string): boolean => {
    return completedTours.has(tourId);
  }, [completedTours]);

  const shouldShowTour = useCallback((tourId: string): boolean => {
    const tour = defaultTours.find(t => t.id === tourId);
    if (!tour) return false;

    // Se já foi completado ou pulado, não mostrar
    if (completedTours.has(tourId) || skippedTours.has(tourId)) {
      return false;
    }

    // Se é para mostrar na primeira visita
    if (tour.showOnFirstVisit) {
      return true;
    }

    return false;
  }, [completedTours, skippedTours]);

  // Verificar se deve mostrar tour na primeira visita
  useEffect(() => {
    const welcomeTour = defaultTours.find(tour => tour.id === 'welcome');
    if (welcomeTour && shouldShowTour('welcome') && !isActive) {
      // Delay para garantir que a página carregou completamente e evitar condições de corrida
      const timer = setTimeout(() => {
        // Verificar novamente se deve mostrar o tour (pode ter mudado durante o delay)
        if (shouldShowTour('welcome') && !isActive) {
          startTour('welcome');
        }
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [isActive, shouldShowTour, startTour]);

  return {
    isActive,
    currentTour,
    availableTours: defaultTours,
    startTour,
    completeTour,
    skipTour,
    resetTour,
    hasCompletedTour,
    shouldShowTour
  };
};

export default useOnboarding;