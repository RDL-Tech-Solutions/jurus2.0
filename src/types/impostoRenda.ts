export interface TabelaIR {
  faixa: number;
  aliquota: number;
  parcelaDeduzir: number;
}

export interface ConfiguracaoIR {
  modalidade: 'progressiva' | 'regressiva';
  tabelaProgressiva: TabelaIR[];
  tabelaRegressiva: { prazo: number; aliquota: number }[];
  isencaoMensal: number;
}

export interface CalculoIR {
  valorBruto: number;
  valorIR: number;
  valorLiquido: number;
  aliquotaEfetiva: number;
  modalidade: 'progressiva' | 'regressiva';
  prazoInvestimento?: number;
}

export interface SimulacaoIR {
  id: string;
  nome: string;
  valorInicial: number;
  valorMensal: number;
  taxaJuros: number;
  prazoMeses: number;
  modalidadeIR: 'progressiva' | 'regressiva';
  resultadoBruto: number;
  resultadoLiquido: number;
  totalIR: number;
  aliquotaEfetiva: number;
  dataCriacao: string;
}

export interface ComparacaoIR {
  id: string;
  nome: string;
  simulacoes: SimulacaoIR[];
  melhorOpcao: string;
  diferencaValor: number;
  diferencaPercentual: number;
  dataCriacao: string;
}

export interface AnaliseIR {
  valorInvestido: number;
  rendimentoBruto: number;
  rendimentoLiquido: number;
  impostoTotal: number;
  aliquotaMedia: number;
  economiaRegressiva?: number;
  recomendacao: 'progressiva' | 'regressiva' | 'indiferente';
  justificativa: string;
}