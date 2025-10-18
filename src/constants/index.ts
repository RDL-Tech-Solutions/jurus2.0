import { ModalidadeInvestimento, LocalStorageKeys, InflacaoPreset } from '../types';

// Estrutura do localStorage
export const localStorageKeys: LocalStorageKeys = {
  TEMA_PREFERIDO: 'calculadora_tema',
  SIMULACOES_SALVAS: 'calculadora_simulacoes',
  COMPARACOES_ATIVAS: 'calculadora_comparacoes',
  CONFIGURACOES: 'calculadora_config'
};

// Modalidades pré-cadastradas (dados estáticos)
export const modalidadesPadrao: ModalidadeInvestimento[] = [
  // Poupança
  {
    id: 'poupanca',
    nome: 'Poupança',
    taxaAnual: 6.17,
    tipo: 'poupanca'
  },
  
  // CDBs
  {
    id: 'cdb_85',
    nome: 'CDB 85% CDI',
    taxaAnual: 11.69,
    tipo: 'cdb'
  },
  {
    id: 'cdb_90',
    nome: 'CDB 90% CDI',
    taxaAnual: 12.38,
    tipo: 'cdb'
  },
  {
    id: 'cdb_95',
    nome: 'CDB 95% CDI',
    taxaAnual: 13.06,
    tipo: 'cdb'
  },
  {
    id: 'cdb_100',
    nome: 'CDB 100% CDI',
    taxaAnual: 13.75,
    tipo: 'cdb'
  },
  {
    id: 'cdb_105',
    nome: 'CDB 105% CDI',
    taxaAnual: 14.44,
    tipo: 'cdb'
  },
  {
    id: 'cdb_110',
    nome: 'CDB 110% CDI',
    taxaAnual: 15.13,
    tipo: 'cdb'
  },
  {
    id: 'cdb_115',
    nome: 'CDB 115% CDI',
    taxaAnual: 15.81,
    tipo: 'cdb'
  },
  {
    id: 'cdb_120',
    nome: 'CDB 120% CDI',
    taxaAnual: 16.50,
    tipo: 'cdb'
  },
  {
    id: 'cdb_125',
    nome: 'CDB 125% CDI',
    taxaAnual: 17.19,
    tipo: 'cdb'
  },
  {
    id: 'cdb_130',
    nome: 'CDB 130% CDI',
    taxaAnual: 17.88,
    tipo: 'cdb'
  },
  
  // LCI/LCA
  {
    id: 'lci_80',
    nome: 'LCI 80% CDI',
    taxaAnual: 11.00,
    tipo: 'lci_lca'
  },
  {
    id: 'lci_85',
    nome: 'LCI 85% CDI',
    taxaAnual: 11.69,
    tipo: 'lci_lca'
  },
  {
    id: 'lci_90',
    nome: 'LCI 90% CDI',
    taxaAnual: 12.38,
    tipo: 'lci_lca'
  },
  {
    id: 'lca_85',
    nome: 'LCA 85% CDI',
    taxaAnual: 11.69,
    tipo: 'lci_lca'
  },
  {
    id: 'lca_90',
    nome: 'LCA 90% CDI',
    taxaAnual: 12.38,
    tipo: 'lci_lca'
  },
  {
    id: 'lca_95',
    nome: 'LCA 95% CDI',
    taxaAnual: 13.06,
    tipo: 'lci_lca'
  },
  {
    id: 'lca_100',
    nome: 'LCA 100% CDI',
    taxaAnual: 13.75,
    tipo: 'lci_lca'
  },
  
  // Tesouro Direto
  {
    id: 'tesouro_selic',
    nome: 'Tesouro Selic 2029',
    taxaAnual: 13.75,
    tipo: 'tesouro'
  },
  {
    id: 'tesouro_prefixado_2027',
    nome: 'Tesouro Prefixado 2027',
    taxaAnual: 12.50,
    tipo: 'tesouro'
  },
  {
    id: 'tesouro_prefixado_2031',
    nome: 'Tesouro Prefixado 2031',
    taxaAnual: 13.20,
    tipo: 'tesouro'
  },
  {
    id: 'tesouro_ipca_2029',
    nome: 'Tesouro IPCA+ 2029',
    taxaAnual: 6.50,
    tipo: 'tesouro'
  },
  {
    id: 'tesouro_ipca_2035',
    nome: 'Tesouro IPCA+ 2035',
    taxaAnual: 6.75,
    tipo: 'tesouro'
  },
  {
    id: 'tesouro_ipca_2045',
    nome: 'Tesouro IPCA+ 2045',
    taxaAnual: 7.00,
    tipo: 'tesouro'
  },
  {
    id: 'tesouro_ipca_juros_2029',
    nome: 'Tesouro IPCA+ com Juros Semestrais 2029',
    taxaAnual: 6.40,
    tipo: 'tesouro'
  },
  {
    id: 'tesouro_ipca_juros_2035',
    nome: 'Tesouro IPCA+ com Juros Semestrais 2035',
    taxaAnual: 6.65,
    tipo: 'tesouro'
  },
  {
    id: 'tesouro_ipca_juros_2055',
    nome: 'Tesouro IPCA+ com Juros Semestrais 2055',
    taxaAnual: 6.90,
    tipo: 'tesouro'
  }
];

// Cores para comparação de investimentos
export const coresComparacao = [
  '#10B981', // Verde
  '#3B82F6', // Azul
  '#EF4444', // Vermelho
  '#F59E0B', // Amarelo
  '#8B5CF6', // Roxo
  '#EC4899', // Rosa
  '#06B6D4', // Ciano
  '#84CC16', // Lima
];

// CDI atual padrão (pode ser atualizado pelo usuário)
export const CDI_ATUAL_PADRAO = 13.75;

// Configurações de formatação
export const FORMATO_MOEDA = {
  locale: 'pt-BR',
  currency: 'BRL',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2
};

// Configurações de animação
export const ANIMATION_CONFIG = {
  duration: 0.3,
  ease: 'easeInOut'
};


// Presets de inflação
export const inflacaoPresets: InflacaoPreset[] = [
  {
    id: 'meta_bc',
    nome: 'Meta do Banco Central',
    taxaAnual: 3.25,
    descricao: 'Meta de inflação definida pelo Banco Central para 2024'
  },
  {
    id: 'ipca_historico',
    nome: 'IPCA Histórico (10 anos)',
    taxaAnual: 6.2,
    descricao: 'Média histórica do IPCA dos últimos 10 anos'
  },
  {
    id: 'ipca_2023',
    nome: 'IPCA 2023',
    taxaAnual: 4.62,
    descricao: 'IPCA acumulado em 2023'
  },
  {
    id: 'ipca_2022',
    nome: 'IPCA 2022',
    taxaAnual: 5.79,
    descricao: 'IPCA acumulado em 2022'
  },
  {
    id: 'conservador',
    nome: 'Cenário Conservador',
    taxaAnual: 4.0,
    descricao: 'Projeção conservadora para inflação'
  },
  {
    id: 'moderado',
    nome: 'Cenário Moderado',
    taxaAnual: 5.0,
    descricao: 'Projeção moderada para inflação'
  },
  {
    id: 'pessimista',
    nome: 'Cenário Pessimista',
    taxaAnual: 7.0,
    descricao: 'Projeção pessimista para inflação'
  }
];

// Taxa de inflação padrão
export const INFLACAO_PADRAO = 3.25;