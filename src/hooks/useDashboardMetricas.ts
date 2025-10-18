import { useMemo } from 'react';
import { SimulacaoInput, ResultadoSimulacao } from '../types';

export interface BenchmarkData {
  nome: string;
  taxa: number;
  cor: string;
  icone: string;
}

export interface MetricasPerformance {
  sharpeRatio: number;
  volatilidade: number;
  retornoAnualizado: number;
  drawdownMaximo: number;
  tempoRecuperacao: number;
  consistencia: number;
  eficienciaFiscal: number;
  liquidez: number;
}

export interface ComparacaoBenchmark {
  benchmark: BenchmarkData;
  diferenca: number;
  superioridade: number;
  correlacao: number;
}

export interface DashboardData {
  metricas: MetricasPerformance;
  benchmarks: ComparacaoBenchmark[];
  evolucaoRisco: Array<{
    mes: number;
    risco: number;
    retorno: number;
  }>;
  distribuicaoRetornos: Array<{
    faixa: string;
    frequencia: number;
    probabilidade: number;
  }>;
  indicadoresRisco: {
    var95: number;
    var99: number;
    cvar95: number;
    probabilidadePerdas: number;
  };
}

const benchmarksPadrao: BenchmarkData[] = [
  { nome: 'CDI', taxa: 13.75, cor: '#10B981', icone: '💰' },
  { nome: 'IPCA', taxa: 4.62, cor: '#F59E0B', icone: '📈' },
  { nome: 'Poupança', taxa: 6.17, cor: '#6B7280', icone: '🏦' },
  { nome: 'IBOVESPA', taxa: 15.2, cor: '#EF4444', icone: '📊' },
  { nome: 'IFIX', taxa: 8.9, cor: '#8B5CF6', icone: '🏢' }
];

export function useDashboardMetricas(
  simulacao: SimulacaoInput,
  resultado: ResultadoSimulacao
): DashboardData {
  return useMemo(() => {
    const taxaAnual = simulacao.modalidade?.taxaAnual || 0;
    const periodo = simulacao.periodo;
    const valorTotal = resultado.saldoFinal;
    const valorInvestido = resultado.totalInvestido;

    // Calcular métricas de performance
    const retornoAnualizado = ((valorTotal / valorInvestido) ** (12 / periodo) - 1) * 100;
    
    // Simular volatilidade baseada no tipo de investimento
    const volatilidade = calcularVolatilidadeSimulada(simulacao.modalidade?.tipo || 'renda_fixa');
    
    // Sharpe Ratio (retorno em excesso / volatilidade)
    const taxaLivreRisco = 13.75; // CDI atual
    const sharpeRatio = (retornoAnualizado - taxaLivreRisco) / volatilidade;
    
    // Outras métricas simuladas
    const drawdownMaximo = Math.min(volatilidade * 2, 25);
    const tempoRecuperacao = Math.max(1, Math.floor(drawdownMaximo / 2));
    const consistencia = Math.max(0, 100 - volatilidade * 2);
    const eficienciaFiscal = calcularEficienciaFiscal(simulacao.modalidade?.tipo || 'renda_fixa');
    const liquidez = calcularLiquidez(simulacao.modalidade?.tipo || 'renda_fixa');

    const metricas: MetricasPerformance = {
      sharpeRatio,
      volatilidade,
      retornoAnualizado,
      drawdownMaximo,
      tempoRecuperacao,
      consistencia,
      eficienciaFiscal,
      liquidez
    };

    // Comparação com benchmarks
    const benchmarks: ComparacaoBenchmark[] = benchmarksPadrao.map(benchmark => {
      const diferenca = retornoAnualizado - benchmark.taxa;
      const superioridade = (diferenca / benchmark.taxa) * 100;
      const correlacao = calcularCorrelacaoSimulada(simulacao.modalidade?.tipo || 'renda_fixa', benchmark.nome);
      
      return {
        benchmark,
        diferenca,
        superioridade,
        correlacao
      };
    });

    // Evolução de risco ao longo do tempo
    const evolucaoRisco = Array.from({ length: Math.min(periodo, 24) }, (_, i) => {
      const mes = i + 1;
      const risco = volatilidade * (1 + Math.sin(mes / 6) * 0.2);
      const retorno = retornoAnualizado * (mes / periodo) + (Math.random() - 0.5) * volatilidade;
      
      return { mes, risco, retorno };
    });

    // Distribuição de retornos
    const distribuicaoRetornos = [
      { faixa: '< 0%', frequencia: Math.max(0, 15 - consistencia / 5), probabilidade: 0 },
      { faixa: '0-5%', frequencia: 20, probabilidade: 0 },
      { faixa: '5-10%', frequencia: 25, probabilidade: 0 },
      { faixa: '10-15%', frequencia: 20, probabilidade: 0 },
      { faixa: '15-20%', frequencia: 15, probabilidade: 0 },
      { faixa: '> 20%', frequencia: 5, probabilidade: 0 }
    ].map(item => ({
      ...item,
      probabilidade: item.frequencia / 100
    }));

    // Indicadores de risco
    const indicadoresRisco = {
      var95: retornoAnualizado - 1.645 * volatilidade,
      var99: retornoAnualizado - 2.326 * volatilidade,
      cvar95: retornoAnualizado - 2.5 * volatilidade,
      probabilidadePerdas: Math.max(0, (15 - consistencia) / 100)
    };

    return {
      metricas,
      benchmarks,
      evolucaoRisco,
      distribuicaoRetornos,
      indicadoresRisco
    };
  }, [simulacao, resultado]);
}

function calcularVolatilidadeSimulada(tipo: string): number {
  const volatilidades: Record<string, number> = {
    'renda_fixa': 2.5,
    'cdb': 1.8,
    'lci_lca': 1.5,
    'tesouro_direto': 3.2,
    'fundos_renda_fixa': 4.1,
    'fundos_multimercado': 8.5,
    'acoes': 25.0,
    'fiis': 15.2,
    'criptomoedas': 45.0
  };
  
  return volatilidades[tipo] || 5.0;
}

function calcularEficienciaFiscal(tipo: string): number {
  const eficiencias: Record<string, number> = {
    'renda_fixa': 75,
    'cdb': 70,
    'lci_lca': 100, // Isentos
    'tesouro_direto': 75,
    'fundos_renda_fixa': 65,
    'fundos_multimercado': 60,
    'acoes': 85, // 15% sobre ganhos
    'fiis': 100, // Isentos até R$ 20k
    'criptomoedas': 70
  };
  
  return eficiencias[tipo] || 75;
}

function calcularLiquidez(tipo: string): number {
  const liquidez: Record<string, number> = {
    'renda_fixa': 85,
    'cdb': 60, // Depende do prazo
    'lci_lca': 50, // Carência
    'tesouro_direto': 95,
    'fundos_renda_fixa': 90,
    'fundos_multimercado': 85,
    'acoes': 95,
    'fiis': 90,
    'criptomoedas': 80
  };
  
  return liquidez[tipo] || 75;
}

function calcularCorrelacaoSimulada(tipoInvestimento: string, benchmark: string): number {
  const correlacoes: Record<string, Record<string, number>> = {
    'renda_fixa': { 'CDI': 0.95, 'IPCA': 0.3, 'Poupança': 0.8, 'IBOVESPA': -0.1, 'IFIX': 0.2 },
    'cdb': { 'CDI': 0.98, 'IPCA': 0.25, 'Poupança': 0.85, 'IBOVESPA': -0.05, 'IFIX': 0.15 },
    'acoes': { 'CDI': -0.1, 'IPCA': 0.1, 'Poupança': -0.2, 'IBOVESPA': 0.95, 'IFIX': 0.6 },
    'fiis': { 'CDI': 0.2, 'IPCA': 0.4, 'Poupança': 0.1, 'IBOVESPA': 0.6, 'IFIX': 0.98 }
  };
  
  return correlacoes[tipoInvestimento]?.[benchmark] || 0.1;
}