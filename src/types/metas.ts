export interface MetaFinanceira {
  id: string;
  nome: string;
  descricao?: string;
  valorObjetivo: number;
  valorMeta: number; // Alias for valorObjetivo for compatibility
  valorAtual: number;
  dataInicio: Date;
  dataObjetivo: Date;
  dataLimite: Date; // Alias for dataObjetivo for compatibility
  categoria: 'aposentadoria' | 'casa' | 'carro' | 'viagem' | 'emergencia' | 'educacao' | 'outro';
  prioridade: 'baixa' | 'media' | 'alta';
  status: 'ativa' | 'pausada' | 'concluida' | 'cancelada';
  cor: string;
  icone?: string;
  contribuicaoMensal?: number;
  taxaJuros?: number;
  notificacoes: {
    marcos: boolean; // 25%, 50%, 75%, 90%
    prazo: boolean; // Quando próximo do prazo
    contribuicao: boolean; // Lembrete de contribuição
  };
  historico: Array<{
    data: Date;
    valor: number;
    tipo: 'deposito' | 'retirada' | 'rendimento';
    descricao?: string;
  }>;
  simulacao?: {
    valorInicial: number;
    valorMensal: number;
    taxaJuros: number;
    periodo: number;
  };
}

export interface ProgressoMeta {
  percentualConcluido: number;
  valorRestante: number;
  diasRestantes: number;
  valorNecessarioMensal: number;
  projecaoDataConclusao: Date;
  statusPrazo: 'no-prazo' | 'atrasado' | 'adiantado';
  marcos: Array<{
    percentual: number;
    atingido: boolean;
    data?: Date;
  }>;
}

export interface NotificacaoMeta {
  id: string;
  metaId: string;
  tipo: 'marco' | 'prazo' | 'contribuicao' | 'concluida';
  titulo: string;
  mensagem: string;
  data: Date;
  lida: boolean;
  prioridade: 'baixa' | 'media' | 'alta';
}

export interface EstatisticasMetas {
  totalMetas: number;
  metasAtivas: number;
  metasConcluidas: number;
  valorTotalObjetivos: number;
  valorTotalAtual: number;
  percentualGeralConcluido: number;
  metaProximaVencimento: MetaFinanceira | null;
  metaMaiorProgresso: MetaFinanceira | null;
}