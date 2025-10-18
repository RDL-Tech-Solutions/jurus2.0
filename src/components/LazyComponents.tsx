import { lazy } from 'react';

// Lazy loading dos componentes mais pesados
export const LazyDashboardAvancado = lazy(() => import('./DashboardAvancado'));
export const LazyDashboardPerformance = lazy(() => import('./DashboardPerformance'));
export const LazyAnaliseCenarios = lazy(() => import('./AnaliseCenarios'));
export const LazyAnaliseAvancada = lazy(() => import('./AnaliseAvancada'));
export const LazyExportacaoAvancada = lazy(() => import('./ExportacaoAvancada'));
export const LazyComparadorInvestimentos = lazy(() => import('./ComparadorInvestimentos'));
export const LazyRecomendacoesIA = lazy(() => import('./RecomendacoesIA'));
export const LazyCalculadoraAposentadoria = lazy(() => import('./CalculadoraAposentadoria'));
export const LazyRetiradasProgramadas = lazy(() => import('./RetiradasProgramadas'));
export const LazyGraficoInterativo = lazy(() => import('./GraficoInterativo'));
export const LazySimulacaoInflacao = lazy(() => import('./SimulacaoInflacao'));

// Componentes de dashboard e análise
export const LazyDashboardMelhorado = lazy(() => import('./DashboardMelhorado'));
export const LazyTemplatesRelatorio = lazy(() => import('./TemplatesRelatorio'));

// Componentes de configuração e histórico
export const LazyHistoricoSimulacoes = lazy(() => import('./HistoricoSimulacoes'));
export const LazyCalculadoraMeta = lazy(() => import('./CalculadoraMeta'));

// Re-export dos componentes com nomes mais descritivos
export {
  LazyDashboardAvancado as DashboardAvancadoLazy,
  LazyDashboardPerformance as DashboardPerformanceLazy,
  LazyAnaliseCenarios as AnaliseCenariosLazy,
  LazyAnaliseAvancada as AnaliseAvancadaLazy,
  LazyExportacaoAvancada as ExportacaoAvancadaLazy,
  LazyComparadorInvestimentos as ComparadorInvestimentosLazy,
  LazyRecomendacoesIA as RecomendacoesIALazy,
  LazyCalculadoraAposentadoria as CalculadoraAposentadoriaLazy,
  LazyRetiradasProgramadas as RetiradasProgramadasLazy,
  LazyGraficoInterativo as GraficoInterativoLazy,
  LazySimulacaoInflacao as SimulacaoInflacaoLazy,
  LazyDashboardMelhorado as DashboardMelhoradoLazy,
  LazyTemplatesRelatorio as TemplatesRelatorioLazy,
  LazyHistoricoSimulacoes as HistoricoSimulacoesLazy,
  LazyCalculadoraMeta as CalculadoraMetaLazy,
};