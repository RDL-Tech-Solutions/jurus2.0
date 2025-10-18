import { useEffect, useState, useCallback, memo } from 'react';
import { motion } from 'framer-motion';
import { Play, Calculator, TrendingUp, Target, BarChart3, Settings, Download, Zap, Heart, Brain, GraduationCap, Crown } from 'lucide-react';
import { useSimulacao, useUI } from '../store/useAppStore';
import { useToast } from '../hooks/useToast';
import { useNotificacoes } from '../hooks/useNotificacoes';
import { FormularioEntrada } from './FormularioEntrada';
import { ResultadoSimulacao } from './ResultadoSimulacao';
import { GraficoInterativo } from './GraficoInterativo';
import { NavigationEnhanced } from './NavigationEnhanced';
import { SkeletonLoader, SkeletonCard, SkeletonChart, SkeletonDashboard } from './SkeletonLoader';
import { LazyWrapper, LazyViewport } from './LazyWrapper';
import { LoadingOverlay } from './LoadingProgress';
import { AnimatedContainer, StaggeredContainer, AnimatedItem } from './AnimatedContainer';
import { AnimatedButton } from './AnimatedButton';
import { useJurosCompostos } from '../hooks/useJurosCompostos';
import {
  LazyComparadorInvestimentos,
  LazyHistoricoSimulacoes,
  LazyCalculadoraMeta,
  LazyDashboardMelhorado,
  LazyRecomendacoesIA,
  LazyCalculadoraAposentadoria,
  LazyRetiradasProgramadas,
  LazySimulacaoInflacao,
  LazyAnaliseCenarios,
  LazyAnaliseAvancada,
  LazyDashboardAvancado,
  LazyDashboardPerformance,
  LazyExportacaoAvancada
} from './LazyComponents';
import MetasFinanceiras from './MetasFinanceiras';
import TimelineMetas from './TimelineMetas';
import CalculadoraImpostoRenda from './CalculadoraImpostoRenda';
import SistemaFavoritos from './SistemaFavoritos';
import DashboardInsights from './DashboardInsights';
import SimuladorCenarios from './SimuladorCenarios';
import SistemaEducacao from './SistemaEducacao';
import FuncionalidadesPremium from './FuncionalidadesPremium';

export const Home = memo(() => {
  const { success, error, info } = useToast();
  const { 
    verificarMetasProximas, 
    verificarOportunidadesMercado, 
    criarLembreteAporte, 
    verificarPerformance 
  } = useNotificacoes();
  
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
    showDashboard: false,
    showPerformance: false,
    showExportacao: false
  });

  // Estado derivado para verificar se há resultado calculado
  const calculado = Boolean(resultado && resultado.saldoFinal > 0);
  
  const resultadoCalculado = useJurosCompostos(simulacao);

  // Função para abrir/fechar modais
  const toggleModal = useCallback((modalName: keyof typeof modals) => {
    setModals(prev => ({
      ...prev,
      [modalName]: !prev[modalName]
    }));
  }, []);

  const handleCalcular = async () => {
    setLoading(true);
    info('Calculando...', 'Processando sua simulação de juros compostos');
    
    try {
      // Simular um pequeno delay para mostrar o loading
      await new Promise(resolve => setTimeout(resolve, 500));
      setResultado(resultadoCalculado);
      success('Cálculo concluído!', 'Sua simulação foi processada com sucesso');
    } catch (err) {
      error('Erro no cálculo', 'Ocorreu um erro ao processar sua simulação');
    } finally {
      setLoading(false);
    }
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
      }

      // Verificar metas próximas (simular uma meta de R$ 100.000)
      const metaSimulada = 100000;
      const mesesRestantes = Math.max(0, 60 - simulacao.periodo); // Meta de 5 anos
      verificarMetasProximas(resultado.saldoFinal, metaSimulada, mesesRestantes);
    }
  }, [resultado, simulacao, verificarMetasProximas, verificarOportunidadesMercado, criarLembreteAporte, verificarPerformance]);

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
          case 'Enter':
            if (activeTab === 'simulacao' && !isLoading) {
              event.preventDefault();
              handleCalcular();
            }
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeTab, isLoading, setActiveTab]);

  const tabs = [
    { id: 'simulacao', label: 'Simulação', icon: Calculator },
    { id: 'comparador', label: 'Comparador', icon: BarChart3 },
    { id: 'historico', label: 'Histórico', icon: TrendingUp },
    { id: 'meta', label: 'Calculadora de Meta', icon: Target },
    { id: 'metas-financeiras', label: 'Metas Financeiras', icon: Target },
    { id: 'imposto-renda', label: 'Imposto de Renda', icon: Calculator },
    { id: 'favoritos', label: 'Favoritos', icon: Heart },
    { id: 'insights', label: 'Insights', icon: Brain },
    { id: 'performance', label: 'Performance', icon: TrendingUp },
    { id: 'cenarios', label: 'Cenários', icon: Settings },
    { id: 'educacao', label: 'Educação', icon: GraduationCap },
    { id: 'premium', label: 'Premium', icon: Crown },
    { id: 'recomendacoes', label: 'IA Recomendações', icon: Zap },
    { id: 'aposentadoria', label: 'Aposentadoria', icon: Target }
  ];

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
      title: 'Recomendações IA',
      description: 'Receba sugestões personalizadas',
      icon: Zap,
      action: () => setActiveTab('recomendacoes'),
      color: 'from-orange-500 to-orange-600',
      shortcut: 'Ctrl+4'
    }
  ];

  // Breadcrumbs
  const getBreadcrumbs = () => {
    const breadcrumbs = [{ label: 'Início', path: 'home' }];
    
    const tabLabels: Record<string, string> = {
      simulacao: 'Simulação',
      comparador: 'Comparador',
      historico: 'Histórico',
      meta: 'Calculadora de Meta',
      'metas-financeiras': 'Metas Financeiras',
      'imposto-renda': 'Imposto de Renda',
      favoritos: 'Favoritos',
      insights: 'Insights',
      performance: 'Performance',
      cenarios: 'Cenários',
      educacao: 'Educação Financeira',
      premium: 'Funcionalidades Premium',
      recomendacoes: 'IA Recomendações',
      aposentadoria: 'Aposentadoria'
    };

    if (activeTab && tabLabels[activeTab]) {
      breadcrumbs.push({ label: tabLabels[activeTab], path: activeTab });
    }

    return breadcrumbs;
  };

  return (
    <div className="min-h-screen">
      {/* Navigation Tabs */}
      <nav className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 sticky top-16 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            {/* Breadcrumbs */}
            <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400 mb-2">
              {getBreadcrumbs().map((crumb, index) => (
                <div key={crumb.path} className="flex items-center">
                  {index > 0 && <span className="mx-2">/</span>}
                  <span className={index === getBreadcrumbs().length - 1 ? 'text-blue-600 dark:text-blue-400 font-medium' : ''}>
                    {crumb.label}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex items-center space-x-4">
              {/* Enhanced Navigation */}
              <div className="flex-1">
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

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section - Only show when no tab is active or on simulacao */}
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
                className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                Descubra o poder dos juros compostos e planeje seu futuro financeiro com nossa plataforma completa de simulações e análises.
              </motion.p>
            </div>

            {/* Quick Actions */}
            <StaggeredContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {quickActions.map((action, index) => (
                <AnimatedItem key={action.title}>
                  <motion.div
                    className={`relative p-6 rounded-2xl bg-gradient-to-br ${action.color} text-white cursor-pointer group overflow-hidden`}
                    whileHover={{ scale: 1.05, y: -5 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={action.action}
                    title={`${action.title} (${action.shortcut})`}
                  >
                    <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <action.icon className="w-8 h-8 mb-4 relative z-10" />
                    <h3 className="text-lg font-semibold mb-2 relative z-10">{action.title}</h3>
                    <p className="text-sm opacity-90 relative z-10">{action.description}</p>
                    <div className="text-xs opacity-75 mt-2 relative z-10">{action.shortcut}</div>
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
              className="grid grid-cols-1 lg:grid-cols-2 gap-8"
              staggerDelay={0.15}
              initialDelay={0.1}
            >
              <AnimatedItem className="space-y-6">
                <MemoizedFormularioEntrada
                  simulacao={simulacao}
                  onSimulacaoChange={setSimulacao}
                  onCalcular={handleCalcular}
                  isLoading={isLoading}
                />
              </AnimatedItem>
              
              <AnimatedItem className="space-y-6">
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
                        />
                      </AnimatedItem>
                      <AnimatedItem>
                        <MemoizedGraficoInterativo dados={resultado.evolucaoMensal} />
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
                <LazyComparadorInvestimentos 
                  comparacoes={[]}
                  simulacaoAtual={simulacao}
                  onAdicionarComparacao={() => {}}
                  onRemoverComparacao={() => {}}
                  onLimparComparacoes={() => {}}
                />
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

          {activeTab === 'performance' && (
            <AnimatedContainer variant="fadeIn" delay={0.1}>
              <LazyWrapper fallback={<SkeletonChart />}>
                <LazyDashboardMelhorado 
                  valorAtual={resultado?.saldoFinal || 0}
                  valorInicial={simulacao.valorInicial}
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

          {activeTab === 'recomendacoes' && (
            <AnimatedContainer variant="fadeIn" delay={0.1}>
              <LazyWrapper fallback={<SkeletonCard />}>
                <LazyRecomendacoesIA 
                  simulacao={simulacao}
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

          {activeTab === 'insights' && (
            <AnimatedContainer variant="slideUp" delay={0.1}>
              <DashboardInsights />
            </AnimatedContainer>
          )}

          {activeTab === 'educacao' && (
            <AnimatedContainer variant="slideUp" delay={0.1}>
              <SistemaEducacao />
            </AnimatedContainer>
          )}

          {activeTab === 'premium' && (
            <AnimatedContainer variant="slideUp" delay={0.1}>
              <FuncionalidadesPremium />
            </AnimatedContainer>
          )}
        </AnimatedContainer>
      </main>

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
        <LazyWrapper fallback={<SkeletonCard />}>
          <LazyAnaliseCenarios
            simulacao={simulacao}
            onClose={() => toggleModal('showCenarios')}
          />
        </LazyWrapper>
      )}

      {modals.showAnaliseAvancada && calculado && (
        <LazyWrapper fallback={<SkeletonCard />}>
          <LazyAnaliseAvancada
            simulacao={simulacao}
            onClose={() => toggleModal('showAnaliseAvancada')}
          />
        </LazyWrapper>
      )}

      {modals.showDashboard && calculado && (
        <LazyWrapper fallback={<SkeletonChart />}>
          <LazyDashboardAvancado
            simulacao={simulacao}
            resultado={resultado}
            onClose={() => toggleModal('showDashboard')}
          />
        </LazyWrapper>
      )}

      {modals.showPerformance && calculado && (
        <LazyWrapper fallback={<SkeletonChart />}>
          <LazyDashboardPerformance
            valorAtual={resultado?.saldoFinal || 0}
            valorInicial={simulacao.valorInicial}
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
    </div>
  );
});

// Memoizar componentes para otimizar performance
const MemoizedFormularioEntrada = memo(FormularioEntrada);
const MemoizedResultadoSimulacao = memo(ResultadoSimulacao);
const MemoizedGraficoInterativo = memo(GraficoInterativo);
const MemoizedNavigationEnhanced = memo(NavigationEnhanced);