/**
 * Types for history functionality
 */

export interface HistoricoItem {
  id: string;
  tipo: 'calculo' | 'simulacao' | 'meta' | 'favorito' | 'insight';
  titulo: string;
  descricao?: string;
  dados: any;
  dataCreacao: Date;
  dataAtualizacao?: Date;
  tags?: string[];
  favorito?: boolean;
}

export interface FiltroHistorico {
  tipo?: HistoricoItem['tipo'];
  dataInicio?: Date;
  dataFim?: Date;
  termo?: string;
  tags?: string[];
  favoritos?: boolean;
}

export interface HistoricoCalculo extends HistoricoItem {
  tipo: 'calculo';
  dados: {
    tipoCalculo: string;
    parametros: Record<string, any>;
    resultado: any;
  };
}

export interface HistoricoSimulacao extends HistoricoItem {
  tipo: 'simulacao';
  dados: {
    simulacao: any;
    cenarios?: any[];
  };
}

export interface HistoricoMeta extends HistoricoItem {
  tipo: 'meta';
  dados: {
    meta: any;
    progresso: number;
    status: string;
  };
}

export interface HistoricoFavorito extends HistoricoItem {
  tipo: 'favorito';
  dados: {
    itemOriginal: any;
    categoria: string;
  };
}

export interface HistoricoInsight extends HistoricoItem {
  tipo: 'insight';
  dados: {
    insight: any;
    relevancia: number;
    categoria: string;
  };
}