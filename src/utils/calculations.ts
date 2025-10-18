import { SimulacaoInput, ResultadoSimulacao, ResultadoMensal } from '../types';
import { CDI_ATUAL_PADRAO, INFLACAO_PADRAO } from '../constants';
import { buscarModalidadePorId } from '../constants/bancosDigitais';

// Conversão de taxa anual para mensal
export function taxaAnualParaMensal(taxaAnual: number): number {
  return Math.pow(1 + taxaAnual / 100, 1 / 12) - 1;
}

// Conversão de taxa anual para diária
export function taxaAnualParaDiaria(taxaAnual: number): number {
  return Math.pow(1 + taxaAnual / 100, 1 / 365) - 1;
}

// Obter taxa efetiva baseada no tipo selecionado
export function obterTaxaEfetiva(input: SimulacaoInput): number {
  switch (input.taxaType) {
    case 'banco':
      return input.modalidade?.taxaAnual || 0;
    case 'banco_digital':
      if (input.bancoDigitalId && input.modalidadeBancoId) {
        const modalidade = buscarModalidadePorId(input.bancoDigitalId, input.modalidadeBancoId);
        return modalidade?.taxaAnual || 0;
      }
      return 0;
    case 'cdi':
      const cdiAtual = input.cdiAtual || CDI_ATUAL_PADRAO;
      const percentualCdi = input.percentualCdi || 100;
      return (cdiAtual * percentualCdi) / 100;
    case 'personalizada':
      return input.taxaPersonalizada || 0;
    default:
      return 0;
  }
}

// Calcular taxa real (descontando inflação)
export function calcularTaxaReal(taxaNominal: number, taxaInflacao: number): number {
  return ((1 + taxaNominal / 100) / (1 + taxaInflacao / 100) - 1) * 100;
}

// Função principal de cálculo de juros compostos
export function calcularJurosCompostos(input: SimulacaoInput): ResultadoSimulacao {
  const taxaAnual = obterTaxaEfetiva(input);
  const taxaMensal = taxaAnualParaMensal(taxaAnual);
  const taxaDiaria = taxaAnualParaDiaria(taxaAnual);
  
  // Configurações de inflação
  const considerarInflacao = input.considerarInflacao || false;
  const taxaInflacaoAnual = input.taxaInflacao || INFLACAO_PADRAO;
  const taxaInflacaoMensal = considerarInflacao ? taxaAnualParaMensal(taxaInflacaoAnual) : 0;
  
  // Converter período para meses
  const periodoMeses = input.unidadePeriodo === 'anos' 
    ? input.periodo * 12 
    : input.periodo;
  
  let saldoAtual = input.valorInicial;
  const evolucaoMensal: ResultadoMensal[] = [];
  let totalContribuicoes = input.valorInicial;
  let perdaTotalInflacao = 0;
  
  // Calcular evolução mês a mês
  for (let mes = 1; mes <= periodoMeses; mes++) {
    // Aplicar juros sobre o saldo atual
    const jurosDoMes = saldoAtual * taxaMensal;
    
    // Adicionar contribuição mensal (exceto no primeiro mês se já tiver valor inicial)
    const contribuicaoDoMes = mes === 1 && input.valorInicial > 0 
      ? input.valorInicial 
      : input.valorMensal;
    
    if (mes > 1) {
      totalContribuicoes += input.valorMensal;
    }
    
    // Atualizar saldo
    saldoAtual = saldoAtual + jurosDoMes + (mes === 1 ? 0 : input.valorMensal);
    
    // Cálculos de inflação
    let saldoReal = saldoAtual;
    let perdaInflacao = 0;
    let ganhoRealMensal = jurosDoMes;
    
    if (considerarInflacao) {
      // Calcular o valor real descontando a inflação acumulada
      const fatorInflacaoAcumulada = Math.pow(1 + taxaInflacaoMensal, mes);
      saldoReal = saldoAtual / fatorInflacaoAcumulada;
      
      // Perda mensal por inflação
      perdaInflacao = saldoAtual * taxaInflacaoMensal;
      perdaTotalInflacao += perdaInflacao;
      
      // Ganho real mensal (juros - inflação)
      ganhoRealMensal = jurosDoMes - perdaInflacao;
    }
    
    evolucaoMensal.push({
      mes,
      contribuicao: contribuicaoDoMes,
      juros: jurosDoMes,
      saldoAcumulado: saldoAtual,
      saldoReal: considerarInflacao ? saldoReal : undefined,
      perdaInflacao: considerarInflacao ? perdaInflacao : undefined,
      ganhoRealMensal: considerarInflacao ? ganhoRealMensal : undefined
    });
  }
  
  // Calcular totais finais
  const totalInvestido = input.valorInicial + (input.valorMensal * (periodoMeses - 1));
  const saldoFinal = saldoAtual;
  const totalJuros = saldoFinal - totalInvestido;
  
  // Calcular ganhos estimados
  const ganhoMensal = saldoFinal * taxaMensal;
  const ganhoDiario = saldoFinal * taxaDiaria;
  const ganhoAnual = saldoFinal * (taxaAnual / 100);
  
  // Calcular rentabilidade total (percentual de retorno sobre o investimento)
  const rentabilidadeTotal = totalInvestido > 0 ? (totalJuros / totalInvestido) * 100 : 0;
  
  // Cálculos específicos de inflação
  let saldoFinalReal: number | undefined;
  let totalJurosReais: number | undefined;
  let rentabilidadeReal: number | undefined;
  let taxaRealAnual: number | undefined;
  
  if (considerarInflacao) {
    const fatorInflacaoTotal = Math.pow(1 + taxaInflacaoMensal, periodoMeses);
    saldoFinalReal = saldoFinal / fatorInflacaoTotal;
    totalJurosReais = saldoFinalReal - totalInvestido;
    rentabilidadeReal = totalInvestido > 0 ? (totalJurosReais / totalInvestido) * 100 : 0;
    taxaRealAnual = calcularTaxaReal(taxaAnual, taxaInflacaoAnual);
  }
  
  return {
    totalInvestido,
    totalJuros,
    saldoFinal,
    ganhoDiario,
    ganhoMensal,
    ganhoAnual,
    evolucaoMensal,
    taxaEfetivaMensal: taxaMensal * 100,
    taxaEfetivaDiaria: taxaDiaria * 100,
    rentabilidadeTotal,
    // Campos de inflação
    saldoFinalReal,
    totalJurosReais,
    rentabilidadeReal,
    taxaRealAnual,
    perdaTotalInflacao: considerarInflacao ? perdaTotalInflacao : undefined
  };
}

// Formatação de valores monetários
export function formatarMoeda(valor: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(valor);
}

// Formatação de percentual
export function formatarPercentual(valor: number, casasDecimais: number = 2): string {
  // Validação para valores undefined, null ou NaN
  if (valor === undefined || valor === null || isNaN(valor)) {
    return '0.00%';
  }
  
  return `${valor.toFixed(casasDecimais)}%`;
}

// Formatação de números grandes
export function formatarNumero(valor: number): string {
  return new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(valor);
}

// Formatação de números grandes com abreviações
export function formatarNumeroGrande(valor: number): string {
  if (valor >= 1000000000) {
    return `${(valor / 1000000000).toFixed(1)}B`;
  } else if (valor >= 1000000) {
    return `${(valor / 1000000).toFixed(1)}M`;
  } else if (valor >= 1000) {
    return `${(valor / 1000).toFixed(1)}K`;
  }
  return formatarNumero(valor);
}