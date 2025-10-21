import { lazy } from 'react';

// Lazy loading dos componentes mais pesados
export const LazyAnaliseCenarios = lazy(() => import('./AnaliseCenarios'));
export const LazyAnaliseAvancada = lazy(() => import('./AnaliseAvancada'));
export const LazyExportacaoAvancada = lazy(() => import('./ExportacaoAvancada'));
export const LazyComparadorInvestimentos = lazy(() => import('./ComparadorInvestimentos'));
export const LazyCalculadoraAposentadoria = lazy(() => import('./CalculadoraAposentadoria'));
export const LazyRetiradasProgramadas = lazy(() => import('./RetiradasProgramadas'));
export const LazyGraficoInterativo = lazy(() => import('./GraficoInterativo'));
export const LazySimulacaoInflacao = lazy(() => import('./SimulacaoInflacao'));

// Componentes de análise e relatórios
export const LazyTemplatesRelatorio = lazy(() => import('./TemplatesRelatorio'));

// Componentes de configuração e histórico
export const LazyHistoricoSimulacoes = lazy(() => import('./HistoricoSimulacoes'));
export const LazyCalculadoraMeta = lazy(() => import('./CalculadoraMeta'));

// Re-export dos componentes com nomes mais descritivos
export {
  LazyAnaliseCenarios as AnaliseCenariosLazy,
  LazyAnaliseAvancada as AnaliseAvancadaLazy,
  LazyExportacaoAvancada as ExportacaoAvancadaLazy,
  LazyComparadorInvestimentos as ComparadorInvestimentosLazy,
  LazyCalculadoraAposentadoria as CalculadoraAposentadoriaLazy,
  LazyRetiradasProgramadas as RetiradasProgramadasLazy,
  LazyGraficoInterativo as GraficoInterativoLazy,
  LazySimulacaoInflacao as SimulacaoInflacaoLazy,
  LazyTemplatesRelatorio as TemplatesRelatorioLazy,
  LazyHistoricoSimulacoes as HistoricoSimulacoesLazy,
  LazyCalculadoraMeta as CalculadoraMetaLazy,
};