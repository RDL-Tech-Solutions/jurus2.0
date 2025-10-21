// Tipos para Dashboard
export interface MetricasBasicas {
  valorTotal: number;
  rendimento: number;
  percentualGanho: number;
  tempoInvestido: number;
  ultimaAtualizacao: Date;
}

export interface KPIsGerenciais {
  roi: number;
  volatilidade: number;
  sharpeRatio: number;
  maxDrawdown: number;
  benchmarkComparison: number;
  alfa: number;
  beta: number;
  informationRatio: number;
}

export interface ConfiguracaoAvancada {
  algoritmoIA: 'conservador' | 'moderado' | 'agressivo';
  horizonteTemporal: number;
  toleranciaRisco: number;
  objetivoFinanceiro: string;
  rebalanceamentoAutomatico: boolean;
  notificacoesPrioritarias: boolean;
}

export interface DadosComparativos {
  periodo: 'mensal' | 'trimestral' | 'anual';
  valorAtual: number;
  valorAnterior: number;
  variacao: number;
  variacaoPercentual: number;
  tendencia: 'alta' | 'baixa' | 'estavel';
}

export interface AlertaRisco {
  id: string;
  tipo: 'alto' | 'medio' | 'baixo';
  titulo: string;
  descricao: string;
  dataDeteccao: Date;
  ativo: boolean;
  acaoRecomendada?: string;
}

export interface DashboardData {
  metricas: MetricasBasicas;
  kpis?: KPIsGerenciais;
  alertas: AlertaRisco[];
  configuracao: ConfiguracaoAvancada;
  ultimaAtualizacao: Date;
}

export interface GraficoEvolucao {
  data: Date;
  valor: number;
  rendimento: number;
  benchmark?: number;
}

export interface SimulacaoResumo {
  id: string;
  nome: string;
  valorInicial: number;
  valorFinal: number;
  rendimento: number;
  dataSimulacao: Date;
  status: 'concluida' | 'em_andamento' | 'pausada';
}