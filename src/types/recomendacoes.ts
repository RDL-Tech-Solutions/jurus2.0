// Tipos para Sistema de Recomendações IA
export interface Recomendacao {
  id: string;
  tipo: 'investimento' | 'rebalanceamento' | 'otimizacao' | 'risco';
  titulo: string;
  descricao: string;
  confianca: number; // 0-100
  impactoEstimado: number;
  prazoImplementacao: string;
  prioridade: 'alta' | 'media' | 'baixa';
  categoria: string;
  acoes: AcaoRecomendada[];
  dataGeracao: Date;
  status: 'pendente' | 'implementada' | 'rejeitada' | 'expirada';
  fundamentacao: string[];
}

export interface AcaoRecomendada {
  id: string;
  descricao: string;
  tipo: 'compra' | 'venda' | 'rebalanceamento' | 'configuracao';
  prioridade: 'alta' | 'media' | 'baixa';
  valorEstimado?: number;
  percentualCarteira?: number;
  executada: boolean;
  dataExecucao?: Date;
  observacoes?: string;
}

export interface PerfilInvestidor {
  id: string;
  nome: string;
  idade: number;
  experiencia: 'iniciante' | 'intermediario' | 'avancado' | 'especialista';
  toleranciaRisco: number; // 1-10
  objetivos: ObjetivoFinanceiro[];
  horizonteTemporal: number; // em anos
  rendaAtual: number;
  patrimonioLiquido: number;
  preferenciasInvestimento: string[];
  restricoes: string[];
}

export interface ObjetivoFinanceiro {
  id: string;
  nome: string;
  valorMeta: number;
  prazo: Date;
  prioridade: number; // 1-5
  categoria: 'aposentadoria' | 'casa' | 'educacao' | 'emergencia' | 'outros';
  progresso: number; // 0-100
}

export interface CarteiraAtual {
  id: string;
  valorTotal: number;
  alocacoes: AlocacaoAtivo[];
  diversificacao: IndiceDiversificacao;
  performance: PerformanceCarteira;
  ultimaAtualizacao: Date;
}

export interface AlocacaoAtivo {
  id: string;
  nome: string;
  tipo: 'acao' | 'fii' | 'renda_fixa' | 'cripto' | 'commodities' | 'internacional';
  valor: number;
  percentual: number;
  rendimento: number;
  risco: number; // 1-10
  liquidez: 'alta' | 'media' | 'baixa';
}

export interface IndiceDiversificacao {
  score: number; // 0-100
  concentracaoSetorial: number;
  concentracaoGeografica: number;
  correlacaoAtivos: number;
  recomendacaoMelhoria: string[];
}

export interface PerformanceCarteira {
  rendimentoTotal: number;
  rendimentoAnualizado: number;
  volatilidade: number;
  sharpeRatio: number;
  maxDrawdown: number;
  comparacaoBenchmark: number;
}

export interface EngineRecomendacoes {
  versao: string;
  algoritmos: string[];
  ultimaAtualizacao: Date;
  parametros: ParametrosEngine;
}

export interface ParametrosEngine {
  pesoRisco: number;
  pesoRetorno: number;
  pesoDiversificacao: number;
  pesoLiquidez: number;
  janelaTemporal: number; // em dias
  limiteConfianca: number; // mínimo para exibir recomendação
}

export interface ScoreConfianca {
  valor: number; // 0-100
  fatores: FatorConfianca[];
  explicacao: string;
  nivelCerteza: 'muito_baixo' | 'baixo' | 'medio' | 'alto' | 'muito_alto';
}

export interface FatorConfianca {
  nome: string;
  peso: number;
  valor: number;
  impacto: 'positivo' | 'negativo' | 'neutro';
  descricao: string;
}

// Tipos adicionais para IA
export interface RecomendacaoIA extends Recomendacao {
  algoritmo: string;
  versaoModelo: string;
  confiancaIA: number;
  explicabilidade: string[];
}

export interface AlertaInteligente {
  id: string;
  tipo: 'risco' | 'oportunidade' | 'mercado' | 'portfolio';
  titulo: string;
  descricao: string;
  severidade: 'baixa' | 'media' | 'alta' | 'critica';
  dataDeteccao: Date;
  dataExpiracao?: Date;
  ativo: boolean;
  visualizado: boolean;
  acaoRecomendada: string;
  parametros: Record<string, any>;
}

export interface AnaliseRiscoIA {
  id: string;
  portfolioId: string;
  nivelRisco: number; // 0-100
  categoria: 'conservador' | 'moderado' | 'agressivo';
  fatoresRisco: {
    concentracao: number;
    volatilidade: number;
    liquidez: number;
    credito: number;
    mercado: number;
  };
  recomendacoes: string[];
  dataAnalise: Date;
  confianca: number;
}

export interface ConfiguracaoIA {
  algoritmoRecomendacao: 'basico' | 'avancado' | 'ml';
  frequenciaAnalise: 'tempo_real' | 'diaria' | 'semanal';
  limiteConfianca: number;
  tiposAlerta: string[];
  personalizacao: {
    focoRentabilidade: number;
    focoSeguranca: number;
    focoLiquidez: number;
  };
  ativo: boolean;
}