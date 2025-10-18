import { TabelaIR, ConfiguracaoIR, CalculoIR, AnaliseIR } from '../types/impostoRenda';

// Configuração atual do IR (2024)
export const configuracaoIRAtual: ConfiguracaoIR = {
  modalidade: 'progressiva',
  isencaoMensal: 1903.98,
  tabelaProgressiva: [
    { faixa: 1903.98, aliquota: 0, parcelaDeduzir: 0 },
    { faixa: 2826.65, aliquota: 7.5, parcelaDeduzir: 142.80 },
    { faixa: 3751.05, aliquota: 15, parcelaDeduzir: 354.80 },
    { faixa: 4664.68, aliquota: 22.5, parcelaDeduzir: 636.13 },
    { faixa: Infinity, aliquota: 27.5, parcelaDeduzir: 869.36 }
  ],
  tabelaRegressiva: [
    { prazo: 180, aliquota: 22.5 },
    { prazo: 360, aliquota: 20 },
    { prazo: 720, aliquota: 17.5 },
    { prazo: 1440, aliquota: 15 },
    { prazo: Infinity, aliquota: 10 }
  ]
};

/**
 * Calcula o IR pela tabela progressiva
 */
export function calcularIRProgressivo(rendimento: number): CalculoIR {
  const { tabelaProgressiva } = configuracaoIRAtual;
  
  let valorIR = 0;
  let aliquotaEfetiva = 0;
  
  if (rendimento <= 0) {
    return {
      valorBruto: rendimento,
      valorIR: 0,
      valorLiquido: rendimento,
      aliquotaEfetiva: 0,
      modalidade: 'progressiva'
    };
  }
  
  // Encontrar a faixa correta
  for (let i = 0; i < tabelaProgressiva.length; i++) {
    const faixa = tabelaProgressiva[i];
    if (rendimento <= faixa.faixa || i === tabelaProgressiva.length - 1) {
      valorIR = (rendimento * faixa.aliquota / 100) - faixa.parcelaDeduzir;
      aliquotaEfetiva = faixa.aliquota;
      break;
    }
  }
  
  valorIR = Math.max(0, valorIR);
  const aliquotaEfetivaReal = rendimento > 0 ? (valorIR / rendimento) * 100 : 0;
  
  return {
    valorBruto: rendimento,
    valorIR,
    valorLiquido: rendimento - valorIR,
    aliquotaEfetiva: aliquotaEfetivaReal,
    modalidade: 'progressiva'
  };
}

/**
 * Calcula o IR pela tabela regressiva
 */
export function calcularIRRegressivo(rendimento: number, prazoMeses: number): CalculoIR {
  const { tabelaRegressiva } = configuracaoIRAtual;
  
  if (rendimento <= 0) {
    return {
      valorBruto: rendimento,
      valorIR: 0,
      valorLiquido: rendimento,
      aliquotaEfetiva: 0,
      modalidade: 'regressiva',
      prazoInvestimento: prazoMeses
    };
  }
  
  // Converter meses para dias (aproximadamente)
  const prazoDias = prazoMeses * 30;
  
  // Encontrar a alíquota correta
  let aliquota = 22.5; // Padrão para menos de 180 dias
  
  for (const faixa of tabelaRegressiva) {
    if (prazoDias >= faixa.prazo) {
      aliquota = faixa.aliquota;
      break;
    }
  }
  
  const valorIR = (rendimento * aliquota) / 100;
  
  return {
    valorBruto: rendimento,
    valorIR,
    valorLiquido: rendimento - valorIR,
    aliquotaEfetiva: aliquota,
    modalidade: 'regressiva',
    prazoInvestimento: prazoMeses
  };
}

/**
 * Compara as duas modalidades de tributação
 */
export function compararModalidadesIR(rendimento: number, prazoMeses: number): {
  progressiva: CalculoIR;
  regressiva: CalculoIR;
  melhorOpcao: 'progressiva' | 'regressiva';
  economia: number;
  economiaPercentual: number;
} {
  const progressiva = calcularIRProgressivo(rendimento);
  const regressiva = calcularIRRegressivo(rendimento, prazoMeses);
  
  const melhorOpcao = progressiva.valorLiquido >= regressiva.valorLiquido ? 'progressiva' : 'regressiva';
  const economia = Math.abs(progressiva.valorLiquido - regressiva.valorLiquido);
  const economiaPercentual = rendimento > 0 ? (economia / rendimento) * 100 : 0;
  
  return {
    progressiva,
    regressiva,
    melhorOpcao,
    economia,
    economiaPercentual
  };
}

/**
 * Calcula o IR sobre juros compostos
 */
export function calcularIRJurosCompostos(
  valorInicial: number,
  valorMensal: number,
  taxaJuros: number,
  prazoMeses: number,
  modalidade: 'progressiva' | 'regressiva'
): CalculoIR {
  // Calcular o valor final com juros compostos
  const taxaMensal = taxaJuros / 100 / 12;
  const totalInvestido = valorInicial + (valorMensal * prazoMeses);
  
  // Fórmula de juros compostos com aportes mensais
  const valorFinal = valorInicial * Math.pow(1 + taxaMensal, prazoMeses) +
    valorMensal * ((Math.pow(1 + taxaMensal, prazoMeses) - 1) / taxaMensal);
  
  const rendimento = valorFinal - totalInvestido;
  
  if (modalidade === 'progressiva') {
    return calcularIRProgressivo(rendimento);
  } else {
    return calcularIRRegressivo(rendimento, prazoMeses);
  }
}

/**
 * Analisa qual modalidade é mais vantajosa
 */
export function analisarMelhorModalidade(
  valorInicial: number,
  valorMensal: number,
  taxaJuros: number,
  prazoMeses: number
): AnaliseIR {
  const totalInvestido = valorInicial + (valorMensal * prazoMeses);
  
  const irProgressivo = calcularIRJurosCompostos(valorInicial, valorMensal, taxaJuros, prazoMeses, 'progressiva');
  const irRegressivo = calcularIRJurosCompostos(valorInicial, valorMensal, taxaJuros, prazoMeses, 'regressiva');
  
  const rendimentoBruto = irProgressivo.valorBruto;
  const melhorOpcao = irProgressivo.valorLiquido >= irRegressivo.valorLiquido ? 'progressiva' : 'regressiva';
  const economia = Math.abs(irProgressivo.valorLiquido - irRegressivo.valorLiquido);
  
  let recomendacao: 'progressiva' | 'regressiva' | 'indiferente';
  let justificativa: string;
  
  if (economia < rendimentoBruto * 0.01) { // Diferença menor que 1%
    recomendacao = 'indiferente';
    justificativa = 'A diferença entre as modalidades é mínima (menos de 1% do rendimento).';
  } else if (melhorOpcao === 'progressiva') {
    recomendacao = 'progressiva';
    justificativa = `A tabela progressiva é mais vantajosa, resultando em uma economia de ${((economia / rendimentoBruto) * 100).toFixed(2)}% sobre o rendimento.`;
  } else {
    recomendacao = 'regressiva';
    justificativa = `A tabela regressiva é mais vantajosa para este prazo (${prazoMeses} meses), resultando em uma economia de ${((economia / rendimentoBruto) * 100).toFixed(2)}% sobre o rendimento.`;
  }
  
  return {
    valorInvestido: totalInvestido,
    rendimentoBruto,
    rendimentoLiquido: melhorOpcao === 'progressiva' ? irProgressivo.valorLiquido : irRegressivo.valorLiquido,
    impostoTotal: melhorOpcao === 'progressiva' ? irProgressivo.valorIR : irRegressivo.valorIR,
    aliquotaMedia: melhorOpcao === 'progressiva' ? irProgressivo.aliquotaEfetiva : irRegressivo.aliquotaEfetiva,
    economiaRegressiva: melhorOpcao === 'regressiva' ? economia : undefined,
    recomendacao,
    justificativa
  };
}

/**
 * Calcula o ponto de equilíbrio entre as modalidades
 */
export function calcularPontoEquilibrio(
  valorInicial: number,
  valorMensal: number,
  taxaJuros: number
): { prazoMeses: number; rendimento: number } | null {
  // Busca binária para encontrar o ponto de equilíbrio
  let prazoMin = 1;
  let prazoMax = 240; // 20 anos
  let melhorPrazo = prazoMax;
  
  for (let i = 0; i < 50; i++) { // Máximo 50 iterações
    const prazoMedio = Math.floor((prazoMin + prazoMax) / 2);
    
    const irProgressivo = calcularIRJurosCompostos(valorInicial, valorMensal, taxaJuros, prazoMedio, 'progressiva');
    const irRegressivo = calcularIRJurosCompostos(valorInicial, valorMensal, taxaJuros, prazoMedio, 'regressiva');
    
    const diferenca = irProgressivo.valorLiquido - irRegressivo.valorLiquido;
    
    if (Math.abs(diferenca) < 1) { // Diferença menor que R$ 1
      melhorPrazo = prazoMedio;
      break;
    }
    
    if (diferenca > 0) {
      prazoMax = prazoMedio - 1;
    } else {
      prazoMin = prazoMedio + 1;
    }
    
    if (prazoMin > prazoMax) {
      melhorPrazo = prazoMedio;
      break;
    }
  }
  
  const irFinal = calcularIRJurosCompostos(valorInicial, valorMensal, taxaJuros, melhorPrazo, 'progressiva');
  
  return {
    prazoMeses: melhorPrazo,
    rendimento: irFinal.valorBruto
  };
}

/**
 * Formata valores monetários
 */
export function formatarMoeda(valor: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(valor);
}

/**
 * Formata percentuais
 */
export function formatarPercentual(valor: number, decimais: number = 2): string {
  return `${valor.toFixed(decimais)}%`;
}