import { Simulacao, ResultadoSimulacao } from './simulacao';

export interface Tag {
  id: string;
  nome: string;
  cor: string;
  icone?: string;
  descricao?: string;
}

export interface SimulacaoFavorita {
  id: string;
  nome: string;
  descricao?: string;
  simulacao: Simulacao;
  resultado?: ResultadoSimulacao;
  tags: string[]; // IDs das tags
  dataCriacao: Date;
  dataUltimaAtualizacao: Date;
  isFavorita: boolean;
  categoria: 'pessoal' | 'profissional' | 'investimento' | 'aposentadoria' | 'meta' | 'outro';
  visibilidade: 'privada' | 'publica' | 'compartilhada';
  compartilhadoCom?: string[]; // IDs dos usuários
  avaliacoes?: {
    usuario: string;
    nota: number;
    comentario?: string;
    data: Date;
  }[];
  estatisticas?: {
    visualizacoes: number;
    copias: number;
    compartilhamentos: number;
  };
}

export interface ComparacaoSimulacoes {
  id: string;
  nome: string;
  descricao?: string;
  simulacoes: SimulacaoFavorita[];
  criterios: {
    valorFinal: boolean;
    rendimentoTotal: boolean;
    rendimentoMensal: boolean;
    tempoParaMeta: boolean;
    risco: boolean;
    liquidez: boolean;
    impostos: boolean;
    inflacao: boolean;
  };
  configuracao: {
    mostrarGraficos: boolean;
    mostrarTabela: boolean;
    mostrarResumo: boolean;
    ordenarPor: 'valorFinal' | 'rendimento' | 'tempo' | 'risco';
    ordemCrescente: boolean;
  };
  dataCriacao: Date;
  dataUltimaAtualizacao: Date;
  tags: string[];
  categoria: string;
  resultadoAnalise?: {
    melhorOpcao: string;
    piorOpcao: string;
    recomendacao: string;
    observacoes: string[];
    pontuacao: {
      simulacaoId: string;
      pontos: number;
      criterios: Record<string, number>;
    }[];
  };
}

export interface FiltrosFavoritos {
  busca: string;
  tags: string[];
  categoria: string[];
  periodo: {
    inicio?: Date;
    fim?: Date;
  };
  ordenarPor: 'nome' | 'data' | 'categoria' | 'rendimento';
  ordemCrescente: boolean;
  apenasComResultado: boolean;
  apenasFavoritas: boolean;
}

export interface ConfiguracaoExportacao {
  formato: 'pdf' | 'excel' | 'csv' | 'json';
  incluir: {
    simulacoes: boolean;
    resultados: boolean;
    graficos: boolean;
    comparacoes: boolean;
    tags: boolean;
    estatisticas: boolean;
  };
  configuracao: {
    idioma: 'pt' | 'en' | 'es';
    moeda: 'BRL' | 'USD' | 'EUR';
    formatoData: 'dd/mm/yyyy' | 'mm/dd/yyyy' | 'yyyy-mm-dd';
    incluirLogotipo: boolean;
    incluirAssinatura: boolean;
    tema: 'claro' | 'escuro' | 'auto';
  };
}

export interface EstatisticasFavoritos {
  totalSimulacoes: number;
  totalFavoritas: number;
  totalComparacoes: number;
  totalTags: number;
  categorias: Record<string, number>;
  tagsPopulares: { tag: string; uso: number }[];
  rendimentoMedio: number;
  periodoMedio: number;
  valorMedioInvestido: number;
  crescimentoMensal: {
    mes: string;
    simulacoes: number;
    favoritas: number;
  }[];
  topSimulacoes: {
    maisVisualizadas: SimulacaoFavorita[];
    maisCopiadas: SimulacaoFavorita[];
    melhorAvaliadas: SimulacaoFavorita[];
  };
}