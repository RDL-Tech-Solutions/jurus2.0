// Tipos para o Simulador de Cenários Econômicos

export interface CenarioEconomico {
  id: string;
  nome: string;
  descricao: string;
  tipo: 'otimista' | 'realista' | 'pessimista' | 'personalizado';
  parametros: ParametrosCenario;
  cor: string;
  icone: string;
  ativo: boolean;
  criadoEm: Date;
  atualizadoEm: Date;
}

export interface ParametrosCenario {
  inflacao: {
    inicial: number;
    final: number;
    variacao: 'linear' | 'exponencial' | 'volatil' | 'constante';
  };
  taxaJuros: {
    inicial: number;
    final: number;
    variacao: 'linear' | 'exponencial' | 'volatil' | 'constante';
  };
  crescimentoEconomico: {
    pib: number;
    emprego: number;
    renda: number;
  };
  volatilidade: {
    mercado: number;
    cambio: number;
    commodities: number;
  };
  eventos: EventoEconomico[];
}

export interface EventoEconomico {
  id: string;
  nome: string;
  descricao: string;
  tipo: 'crise' | 'boom' | 'recessao' | 'recuperacao' | 'neutro';
  impacto: {
    inflacao: number;
    taxaJuros: number;
    mercado: number;
    duracao: number; // em meses
  };
  probabilidade: number; // 0-100%
  mesInicio: number;
  mesFim: number;
}

export interface ResultadoCenario {
  cenarioId: string;
  simulacao: any; // Tipo da simulação original
  resultados: {
    saldoFinal: number;
    totalInvestido: number;
    totalJuros: number;
    rentabilidadeTotal: number;
    rentabilidadeAnual: number;
    evolucaoMensal: EvolucaoMensalCenario[];
  };
  metricas: MetricasCenario;
  riscos: AnaliseRisco;
}

export interface EvolucaoMensalCenario {
  mes: number;
  saldo: number;
  aporte: number;
  juros: number;
  inflacao: number;
  taxaJuros: number;
  saldoReal: number; // Ajustado pela inflação
  poder_compra: number;
  volatilidade: number;
}

export interface MetricasCenario {
  var: number; // Value at Risk
  cvar: number; // Conditional Value at Risk
  sharpe: number; // Índice Sharpe
  sortino: number; // Índice Sortino
  maxDrawdown: number; // Máxima perda
  volatilidade: number;
  beta: number;
  alpha: number;
  correlacao: number;
}

export interface AnaliseRisco {
  nivel: 'baixo' | 'medio' | 'alto' | 'extremo';
  pontuacao: number; // 0-100
  fatores: FatorRisco[];
  recomendacoes: string[];
  probabilidadePerda: number;
  perdaMaximaEsperada: number;
}

export interface FatorRisco {
  nome: string;
  impacto: number; // 0-100
  probabilidade: number; // 0-100
  descricao: string;
  mitigacao: string[];
}

export interface ComparacaoCenarios {
  id: string;
  nome: string;
  cenarios: string[]; // IDs dos cenários
  resultados: ResultadoCenario[];
  analiseComparativa: AnaliseComparativa;
  criadaEm: Date;
}

export interface AnaliseComparativa {
  melhorCenario: string;
  piorCenario: string;
  cenarioMaisProvavel: string;
  diferencaMaxima: number;
  diferencaMedia: number;
  correlacoes: { [key: string]: number };
  recomendacao: string;
  confianca: number; // 0-100%
}

export interface StressTest {
  id: string;
  nome: string;
  descricao: string;
  parametros: ParametrosStressTest;
  resultados: ResultadoStressTest;
  criadoEm: Date;
}

export interface ParametrosStressTest {
  choques: ChoqueEconomico[];
  duracao: number; // em meses
  intensidade: 'leve' | 'moderado' | 'severo' | 'extremo';
  recuperacao: {
    tempo: number; // em meses
    intensidade: number; // 0-100%
  };
}

export interface ChoqueEconomico {
  tipo: 'inflacao' | 'juros' | 'mercado' | 'cambio' | 'pib';
  magnitude: number; // percentual do choque
  duracao: number; // em meses
  formato: 'instantaneo' | 'gradual' | 'volatil';
}

export interface ResultadoStressTest {
  perdaMaxima: number;
  tempoRecuperacao: number;
  probabilidadeSobrevivencia: number;
  impactoPatrimonio: number;
  cenariosCriticos: string[];
  recomendacoes: string[];
}

export interface ConfiguracaoCenarios {
  cenariosAtivos: string[];
  parametrosPadrao: ParametrosCenario;
  alertas: {
    perdaMaxima: number;
    volatilidade: number;
    inflacao: number;
  };
  historico: {
    manterDias: number;
    autoSalvar: boolean;
  };
  visualizacao: {
    mostrarInflacao: boolean;
    mostrarVolatilidade: boolean;
    mostrarEventos: boolean;
    intervaloAtualizacao: number;
  };
}

export interface HistoricoCenarios {
  id: string;
  data: Date;
  cenarios: CenarioEconomico[];
  resultados: ResultadoCenario[];
  comparacoes: ComparacaoCenarios[];
  stressTests: StressTest[];
  observacoes: string;
}

export interface ProjecaoEconomica {
  periodo: number; // em anos
  dados: DadosEconomicos[];
  fontes: string[];
  confiabilidade: number; // 0-100%
  ultimaAtualizacao: Date;
}

export interface DadosEconomicos {
  ano: number;
  inflacao: number;
  pib: number;
  selic: number;
  cambio: number;
  desemprego: number;
  fonte: string;
}

export interface AlertaCenario {
  id: string;
  tipo: 'risco' | 'oportunidade' | 'evento' | 'meta';
  titulo: string;
  descricao: string;
  cenarioId: string;
  severidade: 'baixa' | 'media' | 'alta' | 'critica';
  acao: string;
  criadoEm: Date;
  visualizado: boolean;
  resolvido: boolean;
}