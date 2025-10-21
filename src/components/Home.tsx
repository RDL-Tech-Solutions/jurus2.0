import { useEffect, useState, useCallback, memo } from 'react';
import { motion } from 'framer-motion';
import { Calculator, TrendingUp, Target, BarChart3, Settings, Download, Zap, Heart, Brain, GraduationCap, HelpCircle, Bell, Accessibility, Users, Shield, Smartphone, Menu } from 'lucide-react';
import { Z_INDEX } from '../constants/zIndex';
import { Breadcrumbs } from './Breadcrumbs';
import type { BreadcrumbItem } from './Breadcrumbs';
import { Home as HomeIcon } from 'lucide-react';
import { useSimulacao, useUI } from '../store/useAppStore';
import { useToast } from '../hooks/useToast';
import { useNotificacoes } from '../hooks/useNotificacoes';
import { usePreloadComponents, useIntelligentPreload, useHoverPreload } from '../hooks/usePreloadComponents';
import { useOnboarding } from '../hooks/useOnboarding';
import { useContextualTutorials } from './ContextualTutorial';
import { useContextualHelp } from './ContextualHelp';
import { useNotificationSystem } from './NotificationSystem';
import { OnboardingTour } from './OnboardingTour';
import { ContextualTutorial } from './ContextualTutorial';
import { ContextualHelp } from './ContextualHelp';
import { NotificationSystem } from './NotificationSystem';
import { AccessibilityPanel } from './AccessibilityPanel';
import GlobalSettings from './GlobalSettings';
import ProfileManager from './ProfileManager';
import BackupManager from './BackupManager';
import PWAManager from './PWAManager';
import { useProfiles } from '../hooks/useProfiles';
import { FormularioEntrada } from './FormularioEntrada';
import { ResultadoSimulacao } from './ResultadoSimulacao';
import { GraficoInterativo } from './GraficoInterativo';
import { PeriodoVisualizacao } from './PeriodoSwitch';
import { NavigationEnhanced } from './NavigationEnhanced';
import { SkeletonLoader, SkeletonCard, SkeletonChart } from './SkeletonLoader';
import { LazyWrapper, LazyViewport } from './LazyWrapper';
import { LoadingOverlay } from './LoadingProgress';
import { AnimatedContainer, StaggeredContainer, AnimatedItem } from './AnimatedContainer';
import { AnimatedButton } from './AnimatedButton';
import { useJurosCompostos } from '../hooks/useJurosCompostos';
import { useComparacao } from '../hooks/useComparacao';
import { useHistorico } from '../hooks/useHistorico';
import { testLocalStoragePersistence, checkLocalStorageStatus } from '../utils/testLocalStorage';
import { runCompleteHomeTest } from '../utils/testHomeSections';
import { executeFinalTest } from '../utils/finalTest';
import {
  LazyComparadorInvestimentos,
  LazyHistoricoSimulacoes,
  LazyCalculadoraMeta,
  LazyCalculadoraAposentadoria,
  LazyRetiradasProgramadas,
  LazySimulacaoInflacao,
  LazyAnaliseCenarios,
  LazyAnaliseAvancada,
  LazyExportacaoAvancada
} from './LazyComponents';
import MetasFinanceiras from './MetasFinanceiras';
import TimelineMetas from './TimelineMetas';
import CalculadoraImpostoRenda from './CalculadoraImpostoRenda';
import SistemaFavoritos from './SistemaFavoritos';
// SimuladorCenarios replaced with LazyAnaliseCenarios
import SistemaEducacao from './SistemaEducacao';
import Sidebar from './Sidebar';

// Performance and accessibility hooks
import { usePerformanceMonitor, useDebounce, useIntersectionObserver } from '../hooks/usePerformance';
import { useBreakpoint, useResponsiveValue, useDeviceCapabilities } from '../hooks/useResponsive';
import { useFocusManagement, useScreenReader, useReducedMotion } from '../hooks/useAccessibility';
import { ComponentErrorBoundary } from './ErrorBoundary';

export const Home = memo(() => {
  const { success, error, info } = useToast();
  const [isNavigating, setIsNavigating] = useState(false);
  const { 
    verificarMetasProximas, 
    verificarOportunidadesMercado, 
    criarLembreteAporte, 
    verificarPerformance 
  } = useNotificacoes();
  
  // Hooks de preload para melhorar performance
  usePreloadComponents();
  const { registerNavigation } = useIntelligentPreload();
  const hoverPreload = useHoverPreload();

  // Performance and accessibility hooks
  const metrics = usePerformanceMonitor();
  const { isMobile, isTablet, isDesktop } = useBreakpoint();
  const { isTouch, prefersReducedMotion, prefersDark } = useDeviceCapabilities();
  const { announce } = useScreenReader();
  const shouldReduceMotion = useReducedMotion();
  
  // Responsive values
  const headerHeight = useResponsiveValue({ sm: '56px', md: '64px', lg: '72px' }, '64px');
  const sidebarWidth = useResponsiveValue({ sm: '85vw', md: '300px', lg: '320px' }, '300px');
  
  // Hook de onboarding
  const {
    isActive: isOnboardingActive,
    currentTour,
    startTour,
    completeTour,
    skipTour,
    hasCompletedTour
  } = useOnboarding();

  // Hooks dos novos sistemas
  const {
    activeTutorial,
    startTutorial,
    completeTutorial,
    skipTutorial,
    closeTutorial,
    isCompleted: isTutorialCompleted,
    refreshCompletedTutorials
  } = useContextualTutorials();

  const {
    isHelpOpen,
    helpContext,
    openHelp,
    closeHelp
  } = useContextualHelp();

  const {
    notifications,
    settings: notificationSettings,
    addNotification,
    markAsRead,
    markAllAsRead,
    archiveNotification,
    deleteNotification,
    updateSettings: updateNotificationSettings
  } = useNotificationSystem();

  const { currentProfile } = useProfiles();

  // Estado para controlar painéis
  const [showSidebar, setShowSidebar] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showAccessibility, setShowAccessibility] = useState(false);
  const [showGlobalSettings, setShowGlobalSettings] = useState(false);
  const [showProfileManager, setShowProfileManager] = useState(false);
  const [showBackupManager, setShowBackupManager] = useState(false);
  const [showPWAManager, setShowPWAManager] = useState(false);
  
  // Estado para período de visualização
  const [periodoVisualizacao, setPeriodoVisualizacao] = useState<PeriodoVisualizacao>('anual');
  
  // Estado global do Zustand
  const {
    simulacao,
    setSimulacao,
    resultado,
    setResultado,
    isLoading,
    setLoading
  } = useSimulacao();
  
  const {
    activeTab,
    setActiveTab
  } = useUI();

  // Estado local para controlar modais
  const [modals, setModals] = useState({
    showInflacao: false,
    showCenarios: false,
    showAnaliseAvancada: false,
    showExportacao: false,
    showModalidadesBancos: false
  });

  // Estado derivado para verificar se há resultado calculado
  const calculado = Boolean(resultado && resultado.saldoFinal > 0);
  
  const resultadoCalculado = useJurosCompostos(simulacao);
  
  // Hook para comparação de investimentos
  const {
    comparacoes,
    adicionarComparacao,
    removerComparacao,
    limparComparacoes,
    melhorInvestimento,
    podeAdicionarMais,
    quantidadeComparacoes
  } = useComparacao();

  // Hook para histórico de simulações
  const { adicionarAoHistorico } = useHistorico();

  // Dados de modalidades e bancos para comparação
  const modalidadesBancos = [
    {
      categoria: 'Renda Fixa',
      opcoes: [
        { nome: 'CDI 100%', taxa: 13.75, banco: 'Média do Mercado', risco: 'Baixo' },
        { nome: 'CDB Nubank', taxa: 13.5, banco: 'Nubank', risco: 'Baixo' },
        { nome: 'CDB Inter', taxa: 13.8, banco: 'Inter', risco: 'Baixo' },
        { nome: 'LCI/LCA', taxa: 12.5, banco: 'Bradesco', risco: 'Baixo' },
        { nome: 'Tesouro Selic', taxa: 13.75, banco: 'Tesouro Nacional', risco: 'Muito Baixo' },
        { nome: 'Tesouro IPCA+', taxa: 6.5, banco: 'Tesouro Nacional', risco: 'Baixo' }
      ]
    },
    {
      categoria: 'Fundos',
      opcoes: [
        { nome: 'Fundo DI', taxa: 12.8, banco: 'XP Investimentos', risco: 'Baixo' },
        { nome: 'Fundo Multimercado', taxa: 15.2, banco: 'BTG Pactual', risco: 'Médio' },
        { nome: 'Fundo Imobiliário', taxa: 8.5, banco: 'Diversos', risco: 'Médio' }
      ]
    },
    {
      categoria: 'Renda Variável',
      opcoes: [
        { nome: 'Ibovespa (Histórico)', taxa: 15.0, banco: 'B3', risco: 'Alto' },
        { nome: 'S&P 500 (Histórico)', taxa: 18.5, banco: 'NYSE', risco: 'Alto' },
        { nome: 'ETF IVVB11', taxa: 16.2, banco: 'iShares', risco: 'Alto' }
      ]
    }
  ];

  // Função para verificar se há simulação válida
  const temSimulacaoValida = useCallback(() => {
    return Boolean(
      simulacao && 
      (simulacao.valorInicial > 0 || simulacao.valorMensal > 0) &&
      simulacao.periodo > 0 &&
      (simulacao.taxaPersonalizada > 0 || simulacao.modalidade?.taxaAnual > 0)
    );
  }, [simulacao]);

  // Função para capturar automaticamente a simulação atual
  const capturarSimulacaoAtual = useCallback(() => {
    if (!temSimulacaoValida()) {
      error('Realize uma simulação primeiro para poder comparar investimentos');
      setActiveTab('simulacao');
      return;
    }

    if (!podeAdicionarMais) {
      error('Máximo de 3 comparações permitidas. Remova uma comparação para adicionar outra.');
      return;
    }

    const nomeSimulacao = `Simulação ${new Date().toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })}`;

    try {
      adicionarComparacao(simulacao, nomeSimulacao);
      success(`Simulação "${nomeSimulacao}" adicionada ao comparador!`);
    } catch (err) {
      error('Erro ao adicionar simulação ao comparador');
    }
  }, [simulacao, temSimulacaoValida, podeAdicionarMais, adicionarComparacao, error, success, setActiveTab]);

  // Função para adicionar modalidade/banco selecionado
  const adicionarModalidadeBanco = useCallback((opcao: any) => {
    if (!podeAdicionarMais) {
      error('Máximo de 3 comparações permitidas. Remova uma comparação para adicionar outra.');
      return;
    }

    // Criar simulação baseada na modalidade/banco selecionado
    const simulacaoModalidade = {
      ...simulacao,
      taxaJuros: opcao.taxa,
      taxaType: 'personalizada' as const
    };

    const nomeComparacao = `${opcao.nome} - ${opcao.banco}`;

    try {
      adicionarComparacao(simulacaoModalidade, nomeComparacao);
      success(`"${nomeComparacao}" adicionado ao comparador!`);
      setModals(prev => ({ ...prev, showModalidadesBancos: false }));
    } catch (err) {
      error('Erro ao adicionar modalidade ao comparador');
    }
  }, [simulacao, podeAdicionarMais, adicionarComparacao, error, success, setModals]);

  // Efeito para capturar automaticamente a simulação quando acessar o comparador
  useEffect(() => {
    if (activeTab === 'comparador' && temSimulacaoValida() && quantidadeComparacoes === 0) {
      // Pequeno delay para melhor UX
      const timer = setTimeout(() => {
        capturarSimulacaoAtual();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [activeTab, temSimulacaoValida, quantidadeComparacoes, capturarSimulacaoAtual]);

  // Efeito para sincronizar estados de tutorial na inicialização
  useEffect(() => {
    const timer = setTimeout(() => {
      refreshCompletedTutorials();
    }, 100);
    return () => clearTimeout(timer);
  }, [refreshCompletedTutorials]);

  // Teste de persistência do localStorage na inicialização
  useEffect(() => {
    const testPersistence = async () => {
      try {
        console.log('🔍 Iniciando teste de persistência do localStorage...');
        
        // Verificar status do localStorage
        const status = checkLocalStorageStatus();
        console.log('📊 Status do localStorage:', status);
        
        if (status.available) {
          // Executar teste de persistência
          const testResult = testLocalStoragePersistence();
          
          if (testResult.success) {
            console.log('✅ Persistência do localStorage funcionando corretamente');
            info('Sistema de persistência verificado com sucesso');
          } else {
            console.warn('⚠️ Problema na persistência:', testResult.message);
            error('Problema detectado na persistência de dados');
          }
        } else {
          console.error('❌ localStorage não disponível:', status.message);
          error('Sistema de armazenamento não disponível');
        }
      } catch (err) {
        console.error('💥 Erro crítico no teste de persistência:', err);
        error('Erro crítico no sistema de persistência');
      }
    };

    // Executar teste após um pequeno delay para não interferir na inicialização
    const timer = setTimeout(testPersistence, 500);
    return () => clearTimeout(timer);
  }, [info, error]);

  // Teste simplificado das seções da Home
  useEffect(() => {
    const testHomeSections = () => {
      console.log('🏠 Verificando seções da Home...');
      
      // Lista das seções principais
      const sections = [
        'simulacao', 'comparador', 'historico', 'meta', 'performance', 
        'cenarios', 'recomendacoes', 'aposentadoria'
      ];
      
      let sectionsWorking = 0;
      
      sections.forEach(section => {
        // Verificar se a seção está sendo renderizada corretamente
        const hasSection = activeTab === section || section === 'simulacao';
        
        if (hasSection) {
          console.log(`✅ Seção ${section} disponível`);
          sectionsWorking++;
        } else {
          console.log(`📋 Seção ${section} aguardando ativação`);
        }
      });
      
      console.log(`📊 Status: ${sectionsWorking}/${sections.length} seções verificadas`);
      
      if (sectionsWorking > 0) {
        info(`${sectionsWorking} seções verificadas com sucesso`);
      }
    };

    // Executar teste após a inicialização
    const timer = setTimeout(testHomeSections, 1500);
    return () => clearTimeout(timer);
  }, [activeTab, info]);

  // Teste final das funcionalidades
  useEffect(() => {
    const runFinalTests = () => {
      console.log('🧪 Executando teste final das funcionalidades...');
      executeFinalTest();
      success('Aplicação totalmente carregada e funcional! 🎉');
    };

    // Executar teste final após todos os outros testes
    const timer = setTimeout(runFinalTests, 2000);
    return () => clearTimeout(timer);
  }, [success]);

  // Definição das abas disponíveis
  const tabs = [
    { id: 'simulacao', label: 'Simulação', icon: Calculator },
    { id: 'comparador', label: 'Comparador', icon: BarChart3 },
    { id: 'historico', label: 'Histórico', icon: TrendingUp },
    { id: 'meta', label: 'Calculadora de Meta', icon: Target },
    { id: 'metas-financeiras', label: 'Metas Financeiras', icon: Target },
    { id: 'imposto-renda', label: 'Imposto de Renda', icon: Calculator },
    { id: 'favoritos', label: 'Favoritos', icon: Heart },
    { id: 'cenarios', label: 'Cenários', icon: Settings },
    { id: 'educacao', label: 'Educação', icon: GraduationCap },
    { id: 'aposentadoria', label: 'Aposentadoria', icon: Target }
  ];

  // Função para abrir/fechar modais
  const toggleModal = useCallback((modalName: keyof typeof modals) => {
    setModals(prev => ({
      ...prev,
      [modalName]: !prev[modalName]
    }));
  }, []);

  // Função melhorada para mudança de aba com preload e feedback visual
  const handleTabChange = useCallback((tabId: string) => {
    setIsNavigating(true);
    
    // Mostrar indicador de carregamento
    info(`Carregando ${tabs.find(t => t.id === tabId)?.label || tabId}...`);
    
    setActiveTab(tabId);
    registerNavigation(`/${tabId}`);
    
    // Preload baseado na aba selecionada
    switch (tabId) {
      case 'comparador':
        hoverPreload.preloadRelatorios();
        break;
      case 'historico':
        hoverPreload.preloadHistorico();
        break;
      case 'meta':
        hoverPreload.preloadMetas();
        break;
      case 'cenarios':
        hoverPreload.preloadSimulador();
        break;
      case 'educacao':
        hoverPreload.preloadEducacao();
        break;
    }
    
    // Feedback de sucesso após um pequeno delay
    setTimeout(() => {
      setIsNavigating(false);
      success(`${tabs.find(t => t.id === tabId)?.label || tabId} carregado com sucesso!`);
    }, 500);
  }, [setActiveTab, registerNavigation, hoverPreload, info, success, tabs]);

  const handleCalcular = async () => {
    setLoading(true);
    info('Calculando...', 'Processando sua simulação de juros compostos');
    
    try {
      // Simular um pequeno delay para mostrar o loading
      await new Promise(resolve => setTimeout(resolve, 500));
      setResultado(resultadoCalculado);
      
      // Adicionar simulação ao histórico
      const nomeSimulacao = `Simulação ${new Date().toLocaleString('pt-BR')}`;
      adicionarAoHistorico(nomeSimulacao, simulacao, resultadoCalculado);
      
      success('Cálculo concluído!', 'Sua simulação foi processada com sucesso');
      
      // Adicionar notificação de sucesso
      addNotification({
        title: 'Simulação Concluída',
        message: `Seu investimento pode render R$ ${resultadoCalculado.saldoFinal.toLocaleString('pt-BR')} em ${simulacao.periodo} meses`,
        type: 'success',
        priority: 'medium',
        category: 'simulacao',
        actionLabel: 'Ver Detalhes',
        actionUrl: '#resultado'
      });
    } catch (err) {
      error('Erro no cálculo', 'Ocorreu um erro ao processar sua simulação');
      
      // Adicionar notificação de erro
      addNotification({
        title: 'Erro na Simulação',
        message: 'Não foi possível processar sua simulação. Tente novamente.',
        type: 'error',
        priority: 'high',
        category: 'sistema'
      });
    } finally {
      setLoading(false);
    }
  };

  // Função para iniciar tutorial contextual
  const startContextualTutorial = (tutorialType: string) => {
    const tutorials = {
      'simulacao-basica': {
        id: 'simulacao-basica',
        title: 'Tutorial: Simulação Básica',
        description: 'Aprenda a fazer sua primeira simulação',
        category: 'beginner' as const,
        estimatedTime: 5,
        steps: [
          {
            id: 'step-1',
            title: 'Valor Inicial',
            content: 'Digite o valor que você tem para investir inicialmente',
            target: '[data-tutorial="valor-inicial"]',
            position: 'bottom' as const,
            highlight: true,
            tips: ['Use valores realistas', 'Considere sua reserva de emergência']
          },
          {
            id: 'step-2',
            title: 'Aporte Mensal',
            content: 'Defina quanto você pode investir mensalmente',
            target: '[data-tutorial="aporte-mensal"]',
            position: 'bottom' as const,
            highlight: true,
            tips: ['Seja consistente', 'Comece com valores menores se necessário']
          },
          {
            id: 'step-3',
            title: 'Taxa de Juros',
            content: 'Escolha uma taxa de juros realista para seu investimento',
            target: '[data-tutorial="taxa-juros"]',
            position: 'bottom' as const,
            highlight: true,
            tips: ['CDI atual: ~13% ao ano', 'Renda fixa: 10-14% ao ano', 'Renda variável: histórico de 15% ao ano']
          },
          {
            id: 'step-4',
            title: 'Período',
            content: 'Defina por quanto tempo você vai investir',
            target: '[data-tutorial="periodo"]',
            position: 'bottom' as const,
            highlight: true,
            tips: ['Quanto mais tempo, maior o efeito dos juros compostos']
          },
          {
            id: 'step-5',
            title: 'Calcular',
            content: 'Clique em calcular para ver os resultados',
            target: '[data-tutorial="calcular"]',
            position: 'top' as const,
            highlight: true,
            action: 'click' as const
          }
        ]
      }
    };

    const tutorial = tutorials[tutorialType as keyof typeof tutorials];
    if (tutorial) {
      startTutorial(tutorial);
    }
  };

  // Função para abrir ajuda contextual
  const openContextualHelp = (context?: string) => {
    openHelp(context || activeTab);
  };

  // Função para lidar com ações de notificação
  const handleNotificationAction = (notification: any) => {
    if (notification.actionUrl === '#resultado') {
      // Scroll para o resultado
      const resultElement = document.getElementById('resultado-simulacao');
      if (resultElement) {
        resultElement.scrollIntoView({ behavior: 'smooth' });
      }
    }
    markAsRead(notification.id);
  };

  // Efeito para gerar notificações inteligentes baseadas nos resultados
  useEffect(() => {
    if (resultado && resultado.saldoFinal) {
      // Verificar oportunidades de mercado (comparar com taxa média de 10% ao ano)
      const taxaMedia = 10;
      const taxaAtual = 10; // Usar uma taxa padrão por enquanto
      verificarOportunidadesMercado(taxaAtual, taxaMedia);

      // Verificar performance (comparar rendimento real vs esperado)
      const rendimentoEsperado = simulacao.valorInicial * Math.pow(1 + taxaMedia/100, simulacao.periodo/12);
      verificarPerformance(resultado.saldoFinal, rendimentoEsperado);

      // Criar lembrete de aporte se o valor mensal for baixo
      if (simulacao.valorMensal < 1000) {
        const valorSugerido = Math.min(simulacao.valorMensal * 1.5, 2000);
        criarLembreteAporte(valorSugerido);
        
        // Adicionar notificação de sugestão
        addNotification({
          title: 'Sugestão de Aporte',
          message: `Considere aumentar seu aporte para R$ ${valorSugerido.toLocaleString('pt-BR')} para acelerar seus resultados`,
          type: 'info',
          priority: 'medium',
          category: 'sugestao',
          actionLabel: 'Ver Tutorial',
          actionUrl: '#tutorial-aporte'
        });
      }

      // Verificar metas próximas (simular uma meta de R$ 100.000)
      const metaSimulada = 100000;
      const mesesRestantes = Math.max(0, 60 - simulacao.periodo); // Meta de 5 anos
      verificarMetasProximas(resultado.saldoFinal, metaSimulada, mesesRestantes);

      // Notificação de conquista se atingir meta
      if (resultado.saldoFinal >= metaSimulada) {
        addNotification({
          title: 'Meta Atingida! 🎉',
          message: 'Parabéns! Sua simulação atingiu a meta de R$ 100.000',
          type: 'success',
          priority: 'high',
          category: 'conquista',
          sound: true,
          vibration: true
        });
      }
    }
  }, [resultado, simulacao, verificarMetasProximas, verificarOportunidadesMercado, criarLembreteAporte, verificarPerformance, addNotification]);

  // Efeito para mostrar tutorial para novos usuários
  useEffect(() => {
    if (!hasCompletedTour('welcome') && !isOnboardingActive && !isTutorialCompleted('simulacao-basica')) {
      // Mostrar tutorial após 2 segundos para novos usuários
      const timer = setTimeout(() => {
        if (activeTab === 'simulacao') {
          startContextualTutorial('simulacao-basica');
        }
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [activeTab, hasCompletedTour, isOnboardingActive, isTutorialCompleted]);

  // Atalhos de teclado
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey || event.metaKey) {
        switch (event.key) {
          case '1':
            event.preventDefault();
            setActiveTab('simulacao');
            break;
          case '2':
            event.preventDefault();
            setActiveTab('comparador');
            break;
          case '3':
            event.preventDefault();
            setActiveTab('historico');
            break;
          case '4':
            event.preventDefault();
            setActiveTab('meta');
            break;
          case 'h':
            event.preventDefault();
            openContextualHelp();
            break;
          case 'n':
             event.preventDefault();
             setShowNotifications(!showNotifications);
             break;
           case 'a':
             event.preventDefault();
             setShowAccessibility(!showAccessibility);
             break;
           case 's':
             if (event.ctrlKey) {
               event.preventDefault();
               setShowGlobalSettings(!showGlobalSettings);
             }
             break;
           case 'p':
             if (event.ctrlKey) {
               event.preventDefault();
               setShowProfileManager(!showProfileManager);
             }
             break;
          case 'b':
            if (event.ctrlKey) {
              event.preventDefault();
              setShowBackupManager(!showBackupManager);
            }
            break;
          case 'Enter':
            if (activeTab === 'simulacao' && !isLoading) {
              event.preventDefault();
              handleCalcular();
            }
            break;
        }
      }
      
      // Tecla F1 para ajuda
      if (event.key === 'F1') {
        event.preventDefault();
        openContextualHelp();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
       return () => window.removeEventListener('keydown', handleKeyDown);
     }, [activeTab, isLoading, setActiveTab, showNotifications, showAccessibility, showGlobalSettings, showProfileManager, showBackupManager, openContextualHelp]);

  const quickActions = [
    {
      title: 'Simulação Rápida',
      description: 'Calcule seus juros compostos em segundos',
      icon: Calculator,
      action: () => setActiveTab('simulacao'),
      color: 'from-blue-500 to-blue-600',
      shortcut: 'Ctrl+1'
    },
    {
      title: 'Comparar Investimentos',
      description: 'Compare diferentes opções de investimento',
      icon: BarChart3,
      action: () => setActiveTab('comparador'),
      color: 'from-green-500 to-green-600',
      shortcut: 'Ctrl+2'
    },
    {
      title: 'Análise de Cenários',
      description: 'Simule diferentes cenários econômicos',
      icon: Settings,
      action: () => setActiveTab('cenarios'),
      color: 'from-purple-500 to-purple-600',
      shortcut: 'Ctrl+3'
    },
    {
      title: 'Educação Financeira',
      description: 'Aprenda sobre investimentos e finanças',
      icon: GraduationCap,
      action: () => setActiveTab('educacao'),
      color: 'from-orange-500 to-orange-600',
      shortcut: 'Ctrl+4'
    }
  ];

  // Breadcrumbs melhorados
  const getBreadcrumbs = (): BreadcrumbItem[] => {
    const breadcrumbs: BreadcrumbItem[] = [{ 
      label: 'Início', 
      path: 'home',
      icon: <HomeIcon className="w-4 h-4" />
    }];
    
    const tabLabels: Record<string, { label: string; icon: React.ReactNode }> = {
      simulacao: { label: 'Simulação', icon: <Calculator className="w-4 h-4" /> },
      comparador: { label: 'Comparador', icon: <BarChart3 className="w-4 h-4" /> },
      historico: { label: 'Histórico', icon: <TrendingUp className="w-4 h-4" /> },
      meta: { label: 'Calculadora de Meta', icon: <Target className="w-4 h-4" /> },
      'metas-financeiras': { label: 'Metas Financeiras', icon: <Target className="w-4 h-4" /> },
      'imposto-renda': { label: 'Imposto de Renda', icon: <Calculator className="w-4 h-4" /> },
      favoritos: { label: 'Favoritos', icon: <Heart className="w-4 h-4" /> },
      cenarios: { label: 'Cenários', icon: <Settings className="w-4 h-4" /> },
      educacao: { label: 'Educação Financeira', icon: <GraduationCap className="w-4 h-4" /> },
      aposentadoria: { label: 'Aposentadoria', icon: <Target className="w-4 h-4" /> }
    };

    if (activeTab && tabLabels[activeTab]) {
      breadcrumbs.push({ 
        label: tabLabels[activeTab].label, 
        path: activeTab,
        icon: tabLabels[activeTab].icon
      });
    }

    return breadcrumbs;
  };

  // Handler para navegação dos breadcrumbs
  const handleBreadcrumbClick = (item: BreadcrumbItem) => {
    if (item.path === 'home') {
      setActiveTab('simulacao');
    } else {
      setActiveTab(item.path as any);
    }
  };

  // Performance monitoring
  useEffect(() => {
    if (metrics.lcp > 2500) {
      console.warn('LCP is slow:', metrics.lcp);
    }
    if (metrics.fid > 100) {
      console.warn('FID is slow:', metrics.fid);
    }
  }, [metrics]);

  // Announce navigation changes to screen readers
  useEffect(() => {
    const tabLabel = tabs.find(t => t.id === activeTab)?.label || 'Simulação';
    announce(`Navegou para ${tabLabel}`);
  }, [activeTab, announce]);

  return (
    <ComponentErrorBoundary>
      <div 
        className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300"
        style={{ 
          '--header-height': headerHeight,
          '--sidebar-width': sidebarWidth 
        } as React.CSSProperties}
      >
      {/* Barra de Progresso de Navegação */}
      {isNavigating && (
        <motion.div
          className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-purple-600 z-50"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          exit={{ scaleX: 0 }}
          transition={{ duration: 0.5 }}
          style={{ transformOrigin: 'left' }}
        />
      )}
      
      {/* Header Responsivo e Fixo - Melhorado */}
      <header 
        className="fixed top-0 left-0 right-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 px-2 sm:px-4 lg:px-6 py-2 sm:py-3 z-50 shadow-sm"
        style={{ zIndex: Z_INDEX.STICKY_HEADER }}
      >
        <div className="flex items-center justify-between max-w-7xl mx-auto h-12 sm:h-14">
          {/* Lado Esquerdo - Logo e Menu */}
          <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
            {/* Botão Menu Sidebar */}
            <motion.button
              onClick={() => setShowSidebar(!showSidebar)}
              className="p-1.5 sm:p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors flex-shrink-0"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              title="Menu (Ctrl+B)"
              aria-label="Abrir menu lateral"
            >
              <Menu className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700 dark:text-gray-300" />
            </motion.button>

            {/* Logo/Título */}
            <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <Calculator className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
              </div>
              <h1 className="text-sm sm:text-lg font-bold text-gray-900 dark:text-white truncate">
                <span className="hidden sm:inline">Jurus</span>
                <span className="sm:hidden">J</span>
              </h1>
            </div>
          </div>

          {/* Lado Direito - Perfil e Notificações */}
          <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
            {/* Botão de Notificações */}
            <motion.button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-1.5 sm:p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              title="Notificações (Ctrl+N)"
              aria-label="Abrir notificações"
            >
              <Bell className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700 dark:text-gray-300" />
              {notifications.filter(n => !n.read && !n.archived).length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-3 h-3 sm:w-4 sm:h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-medium">
                  {notifications.filter(n => !n.read && !n.archived).length}
                </span>
              )}
            </motion.button>

            {/* Perfil do Usuário */}
            {currentProfile && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowProfileManager(!showProfileManager)}
                className="flex items-center gap-1 sm:gap-2 p-1 sm:p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors min-w-0"
                title={`Perfil: ${currentProfile.name} (Ctrl+P)`}
                aria-label={`Perfil de ${currentProfile.name}`}
              >
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xs sm:text-sm font-semibold flex-shrink-0">
                  {currentProfile.avatar || currentProfile.name.charAt(0).toUpperCase()}
                </div>
                <span className="hidden md:block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 max-w-16 lg:max-w-20 truncate">
                  {currentProfile.name}
                </span>
              </motion.button>
            )}
          </div>
        </div>
      </header>

      {/* Sidebar */}
      <Sidebar
        isOpen={showSidebar}
        onToggle={() => setShowSidebar(!showSidebar)}
        onAccessibilityClick={() => {
          setShowAccessibility(!showAccessibility);
          setShowSidebar(false);
        }}
        onGlobalSettingsClick={() => {
          setShowGlobalSettings(!showGlobalSettings);
          setShowSidebar(false);
        }}
        onBackupClick={() => {
          setShowBackupManager(!showBackupManager);
          setShowSidebar(false);
        }}
        onTutorialClick={() => {
          startContextualTutorial('simulacao-basica');
          setShowSidebar(false);
        }}
        onHelpClick={() => {
          openContextualHelp();
          setShowSidebar(false);
        }}
      />

      {/* Navigation Tabs - Completamente Responsivo */}
      <nav 
        className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 sticky top-14 sm:top-16 w-full z-10"
        style={{ zIndex: Z_INDEX.NAVIGATION }}
      >
        <div className="w-full max-w-7xl mx-auto">
          <div className="px-3 sm:px-4 lg:px-6 xl:px-8">
            {/* Breadcrumbs Melhorados com Contexto */}
            <div className="py-2 sm:py-3 border-b border-gray-100 dark:border-gray-800">
              <div className="flex items-center justify-between">
                <Breadcrumbs
                  items={getBreadcrumbs()}
                  maxItems={3}
                  onItemClick={handleBreadcrumbClick}
                  className="flex-1"
                />
                {/* Indicador de seção ativa */}
                <div className="hidden sm:flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                  <span>Seção:</span>
                  <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full font-medium">
                    {tabs.find(t => t.id === activeTab)?.label || 'Simulação'}
                  </span>
                </div>
              </div>
            </div>

            {/* Enhanced Navigation - Container Totalmente Responsivo */}
            <div className="py-2 sm:py-3 lg:py-4">
              <div className="w-full overflow-hidden">
                <MemoizedNavigationEnhanced 
                  activeTab={activeTab}
                  onTabChange={(tab) => {
                    setActiveTab(tab as any);
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content - Adicionado padding-top para compensar header fixo */}
      <main className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 xl:px-8 py-4 sm:py-6 lg:py-8 pt-28 sm:pt-32 lg:pt-36">
        {/* Welcome Section - Melhorada com mais informações */}
        {activeTab === 'simulacao' && !resultado && (
          <AnimatedContainer variant="fadeIn" className="mb-8">
            <div className="text-center mb-12">
              <motion.h1 
                className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                Calculadora de Juros Compostos
              </motion.h1>
              <motion.p 
                className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                Descubra o poder dos juros compostos e planeje seu futuro financeiro com nossa plataforma completa de simulações e análises.
              </motion.p>
            </div>

            {/* Quick Actions */}
            <StaggeredContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8 sm:mb-12">
              {quickActions.map((action, index) => (
                <AnimatedItem key={action.title}>
                  <motion.div
                    className={`relative p-4 sm:p-6 rounded-2xl bg-gradient-to-br ${action.color} text-white cursor-pointer group overflow-hidden`}
                    whileHover={{ scale: 1.05, y: -5 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={action.action}
                    title={`${action.title} (${action.shortcut})`}
                  >
                    <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <action.icon className="w-6 h-6 sm:w-8 sm:h-8 mb-3 sm:mb-4 relative z-10" />
                    <h3 className="text-base sm:text-lg font-semibold mb-1 sm:mb-2 relative z-10">{action.title}</h3>
                    <p className="text-xs sm:text-sm opacity-90 relative z-10">{action.description}</p>
                    <div className="text-xs opacity-75 mt-1 sm:mt-2 relative z-10 hidden sm:block">{action.shortcut}</div>
                  </motion.div>
                </AnimatedItem>
              ))}
            </StaggeredContainer>
          </AnimatedContainer>
        )}

        {/* Tab Content */}
        <AnimatedContainer
          key={activeTab}
          variant="fadeIn"
          duration={0.4}
        >
          {activeTab === 'simulacao' && (
            <StaggeredContainer 
              className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8"
              staggerDelay={0.15}
              initialDelay={0.1}
            >
              <AnimatedItem className="space-y-4 sm:space-y-6">
                <MemoizedFormularioEntrada
                  simulacao={simulacao}
                  onSimulacaoChange={setSimulacao}
                  onCalcular={handleCalcular}
                  isLoading={isLoading}
                />
              </AnimatedItem>
              
              <AnimatedItem className="space-y-4 sm:space-y-6">
                {isLoading ? (
                  <StaggeredContainer staggerDelay={0.1}>
                    <AnimatedItem>
                      <SkeletonCard />
                    </AnimatedItem>
                    <AnimatedItem>
                      <SkeletonChart />
                    </AnimatedItem>
                  </StaggeredContainer>
                ) : resultado ? (
                  <LoadingOverlay loadingState={{ isLoading: false, error: null }}>
                    <StaggeredContainer staggerDelay={0.2}>
                      <AnimatedItem>
                        <MemoizedResultadoSimulacao 
                          resultado={resultado} 
                          simulacao={simulacao}
                          periodoVisualizacao={periodoVisualizacao}
                          onPeriodoChange={setPeriodoVisualizacao}
                        />
                      </AnimatedItem>
                      <AnimatedItem>
                        <MemoizedGraficoInterativo 
                          dados={resultado.evolucaoMensal} 
                          periodoVisualizacao={periodoVisualizacao}
                        />
                      </AnimatedItem>
                    </StaggeredContainer>
                  </LoadingOverlay>
                ) : null}
              </AnimatedItem>
            </StaggeredContainer>
          )}

          {activeTab === 'comparador' && (
            <AnimatedContainer variant="slideUp" delay={0.1}>
              <LazyWrapper fallback={<SkeletonChart />}>
                {!temSimulacaoValida() ? (
                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 text-center">
                    <div className="mb-6">
                      <TrendingUp className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                        Nenhuma Simulação Encontrada
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 mb-6">
                        Para usar o comparador de investimentos, você precisa realizar uma simulação primeiro.
                      </p>
                      <AnimatedButton
                        onClick={() => setActiveTab('simulacao')}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                      >
                        <Calculator className="w-5 h-5 mr-2" />
                        Fazer Simulação
                      </AnimatedButton>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Botões de ação para o comparador */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4">
                      <div className="flex flex-wrap gap-3 items-center justify-between">
                        <div className="flex flex-wrap gap-3">
                          <AnimatedButton
                            onClick={capturarSimulacaoAtual}
                            disabled={!podeAdicionarMais}
                            className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                          >
                            <TrendingUp className="w-4 h-4 mr-2" />
                            Adicionar Simulação Atual
                          </AnimatedButton>
                          
                          <AnimatedButton
                            onClick={() => setModals(prev => ({ ...prev, showModalidadesBancos: true }))}
                            disabled={!podeAdicionarMais}
                            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                          >
                            <BarChart3 className="w-4 h-4 mr-2" />
                            Selecionar Modalidade/Banco
                          </AnimatedButton>
                        </div>
                        
                        {quantidadeComparacoes > 0 && (
                          <AnimatedButton
                            onClick={limparComparacoes}
                            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                          >
                            Limpar Comparações
                          </AnimatedButton>
                        )}
                      </div>
                      
                      {quantidadeComparacoes > 0 && (
                        <div className="mt-3 text-sm text-gray-600 dark:text-gray-400">
                          {quantidadeComparacoes} de 3 comparações utilizadas
                        </div>
                      )}
                    </div>

                    <LazyComparadorInvestimentos 
                      comparacoes={comparacoes}
                      simulacaoAtual={simulacao}
                      onAdicionarComparacao={adicionarComparacao}
                      onRemoverComparacao={removerComparacao}
                      onLimparComparacoes={limparComparacoes}
                      melhorInvestimento={melhorInvestimento}
                    />
                  </div>
                )}
              </LazyWrapper>
            </AnimatedContainer>
          )}

          {activeTab === 'historico' && (
            <AnimatedContainer variant="slideLeft" delay={0.1}>
              <LazyWrapper fallback={<SkeletonCard />}>
                <LazyHistoricoSimulacoes 
                  onCarregarSimulacao={(item) => setSimulacao(item.simulacao)}
                  onFechar={() => setActiveTab('simulacao')}
                />
              </LazyWrapper>
            </AnimatedContainer>
          )}

          {activeTab === 'meta' && (
            <AnimatedContainer variant="scale" delay={0.1}>
              <LazyWrapper fallback={<SkeletonCard />}>
                <LazyCalculadoraMeta 
                  onFechar={() => setActiveTab('simulacao')}
                />
              </LazyWrapper>
            </AnimatedContainer>
          )}

          {activeTab === 'cenarios' && (
            <AnimatedContainer variant="slideUp" delay={0.1}>
              <LazyWrapper fallback={<SkeletonCard />}>
                <LazyAnaliseCenarios
                  simulacao={simulacao}
                  onClose={() => setActiveTab('simulacao')}
                />
              </LazyWrapper>
            </AnimatedContainer>
          )}

          {activeTab === 'aposentadoria' && (
            <AnimatedContainer variant="slideRight" delay={0.1}>
              <LazyWrapper fallback={<SkeletonCard />}>
                <LazyCalculadoraAposentadoria />
              </LazyWrapper>
            </AnimatedContainer>
          )}

          {activeTab === 'metas-financeiras' && (
            <AnimatedContainer variant="slideUp" delay={0.1}>
              <MetasFinanceiras />
            </AnimatedContainer>
          )}

          {activeTab === 'imposto-renda' && (
            <AnimatedContainer variant="slideUp" delay={0.1}>
              <CalculadoraImpostoRenda />
            </AnimatedContainer>
          )}

          {activeTab === 'favoritos' && (
            <AnimatedContainer variant="slideUp" delay={0.1}>
              <SistemaFavoritos />
            </AnimatedContainer>
          )}



          {activeTab === 'educacao' && (
            <AnimatedContainer variant="slideUp" delay={0.1}>
              <SistemaEducacao />
            </AnimatedContainer>
          )}
        </AnimatedContainer>
      </main>

      {/* PWA Manager */}
      <PWAManager
        isOpen={showPWAManager}
        onClose={() => setShowPWAManager(false)}
      />

      {/* Modals */}
      {modals.showInflacao && calculado && (
        <LazyWrapper fallback={<SkeletonCard />}>
          <LazySimulacaoInflacao
            valorInicial={simulacao.valorInicial}
            valorMensal={simulacao.valorMensal}
            periodo={simulacao.periodo}
            taxaJuros={simulacao.modalidade?.taxaAnual || 0}
            onClose={() => toggleModal('showInflacao')}
          />
        </LazyWrapper>
      )}

      {modals.showCenarios && calculado && (
        <LazyWrapper fallback={<SkeletonChart />}>
          <LazyAnaliseCenarios
            simulacao={simulacao}
            onClose={() => toggleModal('showCenarios')}
          />
        </LazyWrapper>
      )}

      {modals.showAnaliseAvancada && calculado && (
        <LazyWrapper fallback={<SkeletonChart />}>
          <LazyAnaliseAvancada
            simulacao={simulacao}
            onClose={() => toggleModal('showAnaliseAvancada')}
          />
        </LazyWrapper>
      )}



      {modals.showExportacao && calculado && (
        <LazyWrapper fallback={<SkeletonCard />}>
          <LazyExportacaoAvancada
            simulacao={simulacao}
            resultado={resultado}
            onClose={() => toggleModal('showExportacao')}
          />
        </LazyWrapper>
      )}

      {/* Modal de Seleção de Modalidades/Bancos */}
      {modals.showModalidadesBancos && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Selecionar Modalidade/Banco para Comparação
                </h2>
                <button
                  onClick={() => setModals(prev => ({ ...prev, showModalidadesBancos: false }))}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-6">
                {modalidadesBancos.map((categoria, categoriaIndex) => (
                  <div key={categoriaIndex} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      {categoria.categoria}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {categoria.opcoes.map((opcao, opcaoIndex) => (
                        <div
                          key={opcaoIndex}
                          className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 hover:border-blue-500 dark:hover:border-blue-400 transition-colors cursor-pointer"
                          onClick={() => adicionarModalidadeBanco(opcao)}
                        >
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-medium text-gray-900 dark:text-white">
                              {opcao.nome}
                            </h4>
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              opcao.risco === 'Muito Baixo' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                              opcao.risco === 'Baixo' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                              opcao.risco === 'Médio' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                              'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                            }`}>
                              {opcao.risco}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                            {opcao.banco}
                          </p>
                          <div className="flex justify-between items-center">
                            <span className="text-lg font-bold text-green-600 dark:text-green-400">
                              {opcao.taxa}% a.a.
                            </span>
                            <button className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium">
                              Adicionar
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setModals(prev => ({ ...prev, showModalidadesBancos: false }))}
                  className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                >
                  Fechar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sistemas de Tutorial, Ajuda e Notificações */}
       <ContextualTutorial
         tutorial={activeTutorial}
         isActive={!!activeTutorial}
         onComplete={() => {
           if (activeTutorial) {
             // Garantir que o tutorial seja marcado como completado
             completeTutorial(activeTutorial.id);
             
             // Forçar uma atualização do estado para garantir persistência
             setTimeout(() => {
               refreshCompletedTutorials();
             }, 50);
             
             addNotification({
               title: 'Tutorial Concluído! 🎓',
               message: `Você completou o tutorial "${activeTutorial.title}"`,
               type: 'success',
               priority: 'medium',
               category: 'educacao'
             });
           }
         }}
         onSkip={() => {
           skipTutorial();
           addNotification({
             title: 'Tutorial Ignorado',
             message: 'Você pode acessar tutoriais a qualquer momento na central de ajuda',
             type: 'info',
             priority: 'low',
             category: 'educacao'
           });
         }}
         onClose={closeTutorial}
         autoPlay={false}
         showProgress={true}
       />

       <ContextualHelp
         isOpen={isHelpOpen}
         onClose={closeHelp}
         context={helpContext}
       />

       <NotificationSystem
         isOpen={showNotifications}
         onClose={() => setShowNotifications(false)}
         notifications={notifications}
         onMarkAsRead={markAsRead}
         onMarkAllAsRead={markAllAsRead}
         onArchive={archiveNotification}
         onDelete={deleteNotification}
         onAction={handleNotificationAction}
         settings={notificationSettings}
         onUpdateSettings={updateNotificationSettings}
       />

       <AccessibilityPanel
         isOpen={showAccessibility}
         onClose={() => setShowAccessibility(false)}
       />

       <GlobalSettings
          isOpen={showGlobalSettings}
          onClose={() => setShowGlobalSettings(false)}
        />

         <ProfileManager
           isOpen={showProfileManager}
           onClose={() => setShowProfileManager(false)}
         />

         <BackupManager
           isOpen={showBackupManager}
           onClose={() => setShowBackupManager(false)}
         />

        {/* Onboarding Tour (mantido para compatibilidade) */}
       {isOnboardingActive && currentTour && (
         <OnboardingTour
           steps={currentTour.steps}
           isActive={isOnboardingActive}
           onComplete={() => {
             completeTour();
             addNotification({
               title: 'Bem-vindo ao Jurus! 🚀',
               message: 'Você completou o tour de boas-vindas. Explore todas as funcionalidades!',
               type: 'success',
               priority: 'medium',
               category: 'onboarding'
             });
           }}
           onSkip={() => {
             skipTour();
             addNotification({
               title: 'Tour Ignorado',
               message: 'Você pode refazer o tour a qualquer momento nas configurações',
               type: 'info',
               priority: 'low',
               category: 'onboarding'
             });
           }}
         />
       )}
       </div>
     </ComponentErrorBoundary>
   );
 });

// Memoizar componentes para otimizar performance
const MemoizedFormularioEntrada = memo(FormularioEntrada);
const MemoizedResultadoSimulacao = memo(ResultadoSimulacao);
const MemoizedGraficoInterativo = memo(GraficoInterativo);
const MemoizedNavigationEnhanced = memo(NavigationEnhanced);

export default Home;