export interface PadraoInvestimento {
  id: string;
  tipo: 'valor_inicial' | 'valor_mensal' | 'periodo' | 'taxa' | 'modalidade';
  tendencia: 'crescente' | 'decrescente' | 'estavel';
  variacao: number; // Percentual de variação
  frequencia: number; // Quantas vezes o padrão foi observado
  ultimaOcorrencia: Date;
  confianca: number; // 0-100, nível de confiança no padrão
}

export interface SugestaoPersonalizada {
  id: string;
  tipo: 'otimizacao' | 'diversificacao' | 'meta' | 'risco' | 'oportunidade';
  titulo: string;
  descricao: string;
  impacto: 'baixo' | 'medio' | 'alto';
  prioridade: 'baixa' | 'media' | 'alta';
  categoria: string;
  acoes: AcaoSugerida[];
  baseadoEm: string[]; // IDs das simulações que geraram a sugestão
  dataCriacao: Date;
  visualizada: boolean;
  aplicada: boolean;
}

export interface AcaoSugerida {
  id: string;
  descricao: string;
  tipo: 'ajuste_valor' | 'mudanca_periodo' | 'nova_modalidade' | 'diversificacao';
  parametros: Record<string, any>;
  impactoEstimado: {
    rendimentoAdicional?: number;
    reducaoRisco?: number;
    tempoEconomizado?: number; // em meses
  };
}

export interface MetricaPerformance {
  id: string;
  nome: string;
  valor: number;
  unidade: string;
  tendencia: 'positiva' | 'negativa' | 'neutra';
  variacao: number; // Variação em relação ao período anterior
  benchmark?: number; // Valor de referência
  categoria: 'rentabilidade' | 'risco' | 'liquidez' | 'diversificacao';
  descricao: string;
}

export interface AlertaOportunidade {
  id: string;
  tipo: 'taxa_atrativa' | 'meta_proxima' | 'rebalanceamento' | 'novo_produto';
  titulo: string;
  descricao: string;
  urgencia: 'baixa' | 'media' | 'alta';
  categoria: string;
  dataExpiracao?: Date;
  acaoRecomendada: string;
  parametros: Record<string, any>;
  visualizado: boolean;
  descartado: boolean;
}

export interface AnaliseComportamental {
  id: string;
  perfil: 'conservador' | 'moderado' | 'arrojado';
  caracteristicas: {
    frequenciaSimulacoes: number; // Simulações por mês
    valorMedioInvestido: number;
    periodoMedioInvestimento: number;
    diversificacao: number; // 0-100
    consistencia: number; // 0-100
    toleranciaRisco: number; // 0-100
  };
  tendencias: {
    aumentoAportes: boolean;
    extensaoPrazos: boolean;
    diversificacaoModalidades: boolean;
    buscaMaiorRentabilidade: boolean;
  };
  recomendacoes: string[];
}

export interface DashboardInsights {
  padroes: PadraoInvestimento[];
  sugestoes: SugestaoPersonalizada[];
  metricas: MetricaPerformance[];
  alertas: AlertaOportunidade[];
  analiseComportamental: AnaliseComportamental;
  resumoExecutivo: {
    totalSimulacoes: number;
    rendimentoMedioProjetado: number;
    metasProximas: number;
    oportunidadesIdentificadas: number;
    pontuacaoGeral: number; // 0-100
  };
}

export interface ConfiguracaoInsights {
  alertasAtivos: boolean;
  frequenciaAnalise: 'diaria' | 'semanal' | 'mensal';
  tiposAlerta: string[];
  limitesSugestoes: {
    maxSugestoesPorTipo: number;
    minimoConfianca: number;
  };
  personalizacao: {
    focoRentabilidade: number; // 0-100
    focoSeguranca: number; // 0-100
    focoLiquidez: number; // 0-100
  };
}

export interface HistoricoInsights {
  id: string;
  data: Date;
  insights: DashboardInsights;
  acoesTomadas: {
    sugestoesAplicadas: string[];
    alertasDescartados: string[];
    metricasMonitoradas: string[];
  };
}

// Tipos para análise de padrões
export interface PadraoTemporal {
  periodo: 'diario' | 'semanal' | 'mensal' | 'trimestral';
  tendencia: number[]; // Valores ao longo do tempo
  sazonalidade: boolean;
  ciclos: number[]; // Duração dos ciclos identificados
}

export interface CorrelacaoVariaveis {
  variavel1: string;
  variavel2: string;
  correlacao: number; // -1 a 1
  significancia: number; // 0-100
  interpretacao: string;
}

export interface PrevisaoTendencia {
  variavel: string;
  valorAtual: number;
  previsao30dias: number;
  previsao90dias: number;
  confianca: number; // 0-100
  fatoresInfluencia: string[];
}

// Tipos para gamificação e engajamento
export interface ConquistaInsights {
  id: string;
  nome: string;
  descricao: string;
  icone: string;
  categoria: 'simulacoes' | 'metas' | 'consistencia' | 'otimizacao';
  criterio: Record<string, any>;
  recompensa: {
    pontos: number;
    beneficio?: string;
  };
  desbloqueada: boolean;
  dataDesbloqueio?: Date;
}

export interface PontuacaoUsuario {
  total: number;
  categorias: {
    planejamento: number;
    consistencia: number;
    otimizacao: number;
    diversificacao: number;
  };
  nivel: number;
  proximoNivel: {
    pontosNecessarios: number;
    beneficios: string[];
  };
  conquistas: ConquistaInsights[];
}