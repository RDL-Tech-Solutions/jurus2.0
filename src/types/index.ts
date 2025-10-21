// Tipos de taxa de juros
export type TaxaType = 'banco' | 'banco_digital' | 'cdi' | 'personalizada';

// Modalidades de investimento pré-cadastradas
export interface ModalidadeInvestimento {
  id: string;
  nome: string;
  taxaAnual: number;
  tipo: 'poupanca' | 'cdb' | 'lci_lca' | 'tesouro';
}

// Dados de entrada da simulação
export interface SimulacaoInput {
  valorInicial: number;
  valorMensal: number;
  taxaType: TaxaType;
  modalidade?: ModalidadeInvestimento;
  // Novos campos para bancos digitais
  bancoDigitalId?: string;
  modalidadeBancoId?: string;
  cdiAtual?: number;
  percentualCdi?: number;
  taxaPersonalizada?: number;
  periodo: number;
  unidadePeriodo: 'meses' | 'anos';
  // Novos campos para inflação
  considerarInflacao?: boolean;
  taxaInflacao?: number;
  tipoInflacao?: 'anual' | 'mensal';
}

// Resultado de um mês específico
export interface ResultadoMensal {
  mes: number;
  contribuicao: number;
  juros: number;
  saldoAcumulado: number;
  // Novos campos para inflação
  saldoReal?: number;
  perdaInflacao?: number;
  ganhoRealMensal?: number;
}

// Resultado completo da simulação
export interface ResultadoSimulacao {
  totalInvestido: number;
  totalJuros: number;
  valorFinal: number;
  saldoFinal: number; // Alias para valorFinal - sempre presente
  rendimentoTotal: number; // Alias para totalJuros - sempre presente
  jurosGanhos: number; // Alias para totalJuros - sempre presente
  ganhoDiario: number;
  ganhoMensal: number;
  ganhoAnual: number;
  evolucaoMensal: ResultadoMensal[];
  taxaEfetivaMensal: number;
  taxaEfetivaDiaria: number;
  rentabilidadeTotal: number;
  // Novos campos para inflação
  saldoFinalReal?: number;
  totalJurosReais?: number;
  rentabilidadeReal?: number;
  taxaRealAnual?: number;
  perdaTotalInflacao?: number;
}

// Alias para compatibilidade
export type SimulacaoResultado = ResultadoSimulacao;

// Dados para comparação
export interface ComparacaoInvestimento {
  id: string;
  nome: string;
  simulacao: SimulacaoInput;
  resultado: ResultadoSimulacao;
  cor: string;
}

export interface CalculadoraAposentadoriaInput {
  idadeAtual: number;
  idadeAposentadoria: number;
  valorMensalDesejado: number;
  patrimonioAtual: number;
  contribuicaoMensal: number;
  taxaJuros: number;
  inflacao: number;
  expectativaVida: number;
}

export interface ResultadoAposentadoria {
  valorNecessario: number;
  valorAcumulado: number;
  deficit: number;
  contribuicaoSugerida: number;
  anosContribuicao: number;
  anosAposentadoria: number;
  evolucaoAcumulacao: ResultadoMensal[];
  evolucaoRetirada: ResultadoMensal[];
}

export interface RetiradasProgramadasInput {
  patrimonioInicial: number;
  valorRetiradaMensal: number;
  taxaJuros: number;
  inflacao: number;
  periodoRetiradas: number; // em anos
  ajustarInflacao: boolean;
}

export interface ResultadoRetiradas {
  duracaoPatrimonio: number; // em meses
  valorFinalPatrimonio: number;
  totalRetirado: number;
  evolucaoMensal: ResultadoMensal[];
  sustentavel: boolean;
}

// Configurações do localStorage
export interface LocalStorageKeys {
  TEMA_PREFERIDO: string;
  SIMULACOES_SALVAS: string;
  COMPARACOES_ATIVAS: string;
  CONFIGURACOES: string;
  HISTORICO_SIMULACOES: string;
  METAS_FINANCEIRAS: string;
  PERFORMANCE_DASHBOARD: string;
  CENARIOS_ANALISE: string;
  RECOMENDACOES_IA: string;
  APOSENTADORIA_DADOS: string;
  PERFIL_INVESTIDOR: string;
  ALERTAS_INTELIGENTES: string;
}

// Tema da aplicação
export type Theme = 'light' | 'dark';

// Props para componentes de exportação
export interface ExportData {
  simulacoes: ResultadoSimulacao[];
  nomes: string[];
  dadosTabela: ResultadoMensal[];
}

// Interface para configurações de inflação
export interface ConfiguracaoInflacao {
  taxaAnual: number;
  nome: string;
  descricao: string;
}

// Presets de inflação comuns
export interface InflacaoPreset {
  id: string;
  nome: string;
  taxaAnual: number;
  descricao: string;
}

// Exportar tipos de educação financeira
export * from './educacaoFinanceira';