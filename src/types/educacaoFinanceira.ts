// Tipos para a página de Educação Financeira

// Configuração do Simulador 50-30-20
export interface SimuladorConfig {
  necessidades: number; // Percentual para necessidades
  desejos: number; // Percentual para desejos  
  poupanca: number; // Percentual para poupança
  isCustom?: boolean; // Se está usando configuração personalizada
  customCategories?: Array<{
    name: string;
    percentage: number;
    color: string;
  }>;
  lastSalary?: number; // Último salário informado
  updatedAt?: string;
}

// Histórico de simulações do Cofrinho
export interface CofrinhoHistory {
  simulations: Array<{
    id: string;
    valorInicial: number;
    meses: number;
    tempoMeses: number;
    aporteMensal: number;
    valorFinal: number;
    ganhoTotal: number;
    cdiConfig: CDIConfig;
    resultado: CofrinhoResult;
    createdAt: string;
  }>;
}

// Progresso de quitação de dívidas
export interface DebtProgress {
  id: string;
  valorInicial: number;
  valorAtual: number;
  dataInicio: string;
  dataQuitacao?: string;
  tempoEstimado: number;
  valorMensal: number;
  ultimoPagamento?: string;
  estrategia: DebtStrategy;
  createdAt: string;
}

// Progresso educacional do usuário
export interface EducationProgress {
  userId?: string;
  completedSections: string[];
  totalTimeSpent: number;
  lastAccessed: string;
}

// Configurações de tema e preferências
export interface EducationPreferences {
  theme: 'light' | 'dark';
  animations: boolean;
  notifications: boolean;
  autoSave: boolean;
}

// Resultado do cálculo do cofrinho
export interface CofrinhoResult {
  valorFinal: number;
  ganhoTotal: number;
  rendimentoMensal: number;
  totalInvestido: number;
  taxaEfetiva: number;
  meses: number;
  crescimentoMensal: Array<{
    mes: number;
    valor: number;
  }>;
}

// Resultado do cálculo de dívidas
export interface DebtResult {
  mesesParaQuitar: number;
  valorMensalRecomendado: number;
  estrategiaRecomendada: string;
  totalJuros: number;
  percentualRenda: number;
  progressoMensal: Array<{
    mes: number;
    saldoRestante: number;
    valorPago: number;
  }>;
}

// Dados para o gráfico de pizza do simulador 50-30-20
export interface PieChartData {
  name: string;
  value: number;
  color: string;
  percentage: number;
}

// Configuração padrão do CDI para cálculos
export interface CDIConfig {
  cdiAnual: number; // 10.65% ao ano
  multiplicador: number; // 120% do CDI
  taxaMensal: number; // ~1.01% ao mês
}

// Estratégias de pagamento de dívidas
export interface DebtStrategy {
  id: 'bola-de-neve' | 'avalanche' | 'minimo';
  name: string;
  description: string;
  recommendedPercentage: number;
  icon: string;
  color: string;
}

// Card de educação financeira
export interface EducationCard {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  gradient: string;
  tips: string[];
  animation?: string;
}

// Seção da página de educação
export interface EducationSection {
  id: string;
  title: string;
  description: string;
  icon: string;
  component: string;
  anchor: string;
}

// LocalStorage Keys para Educação Financeira
export const EDUCATION_STORAGE_KEYS = {
  SIMULADOR_CONFIG: 'jurus:educacao:simulador-config',
  COFRINHO_HISTORY: 'jurus:educacao:cofrinho-history',
  DEBT_PROGRESS: 'jurus:educacao:debt-progress',
  EDUCATION_PROGRESS: 'jurus:educacao:progress',
  EDUCATION_PREFERENCES: 'jurus:educacao:preferences'
} as const;

// Configuração padrão do simulador 50-30-20
export const DEFAULT_SIMULADOR_CONFIG: SimuladorConfig = {
  necessidades: 50,
  desejos: 30,
  poupanca: 20,
  customCategories: [],
  lastSalary: 0
};

// Configuração padrão do CDI
export const CDI_CONFIG: CDIConfig = {
  cdiAnual: 10.65, // 10.65% ao ano
  multiplicador: 1.20, // 120% do CDI
  taxaMensal: 0.0101 // ~1.01% ao mês
};

// Estratégias de pagamento de dívidas
export const DEBT_STRATEGIES: Record<string, DebtStrategy> = {
  'bola-de-neve': {
    id: 'bola-de-neve',
    name: 'Método Bola de Neve',
    description: 'Quite primeiro as menores dívidas',
    recommendedPercentage: 20,
    icon: 'Snowflake',
    color: '#3B82F6'
  },
  'avalanche': {
    id: 'avalanche',
    name: 'Método Avalanche', 
    description: 'Quite primeiro as dívidas com maiores juros',
    recommendedPercentage: 25,
    icon: 'Mountain',
    color: '#EF4444'
  },
  'minimo': {
    id: 'minimo',
    name: 'Pagamento Mínimo',
    description: 'Pague o mínimo e negocie condições',
    recommendedPercentage: 15,
    icon: 'DollarSign',
    color: '#10B981'
  }
};

// Cards de educação financeira
export const EDUCATION_CARDS: EducationCard[] = [
  {
    id: 'controle-gastos',
    title: 'Controle seus Gastos',
    description: 'Aprenda a monitorar e controlar seus gastos mensais para ter uma vida financeira mais saudável.',
    icon: 'TrendingDown',
    color: '#3B82F6',
    gradient: 'from-blue-400 to-blue-600',
    tips: [
      'Anote todos os gastos diários',
      'Use aplicativos de controle financeiro',
      'Revise seus gastos semanalmente',
      'Identifique gastos desnecessários'
    ]
  },
  {
    id: 'poupar-investir',
    title: 'Poupar vs Investir',
    description: 'Entenda a diferença entre poupar e investir, e como cada um pode ajudar seus objetivos financeiros.',
    icon: 'PiggyBank',
    color: '#10B981',
    gradient: 'from-green-400 to-green-600',
    tips: [
      'Poupança é para emergências',
      'Investimentos fazem o dinheiro crescer',
      'Diversifique seus investimentos',
      'Comece com pequenos valores'
    ]
  },
  {
    id: 'metas-financeiras',
    title: 'Defina suas Metas',
    description: 'Estabeleça objetivos financeiros claros e alcançáveis para manter o foco e a motivação.',
    icon: 'Target',
    color: '#F59E0B',
    gradient: 'from-yellow-400 to-orange-500',
    tips: [
      'Defina metas específicas e mensuráveis',
      'Estabeleça prazos realistas',
      'Divida metas grandes em pequenas',
      'Celebre cada conquista'
    ]
  }
];

// Seções da página de educação
export const EDUCATION_SECTIONS: EducationSection[] = [
  {
    id: 'educacao',
    title: 'Educação Financeira',
    description: 'Aprenda conceitos básicos de educação financeira',
    icon: 'GraduationCap',
    component: 'EducacaoAnimada',
    anchor: 'educacao'
  },
  {
    id: 'simulador',
    title: 'Simulador 50-30-20',
    description: 'Planeje seu orçamento com a regra 50-30-20',
    icon: 'PieChart',
    component: 'Simulador5030',
    anchor: 'simulador'
  },
  {
    id: 'dividas',
    title: 'Soluções para Dívidas',
    description: 'Estratégias para quitar suas dívidas',
    icon: 'CreditCard',
    component: 'SolucoesDividas',
    anchor: 'dividas'
  },
  {
    id: 'cofrinho',
    title: 'Cofrinho Inteligente',
    description: 'Simule investimentos com rendimento CDI',
    icon: 'Coins',
    component: 'CofrinhoInteligente',
    anchor: 'cofrinho'
  }
];