// Utilitários de cálculo para a página de Educação Financeira

import {
  CofrinhoResult,
  DebtResult,
  CDI_CONFIG,
  DEBT_STRATEGIES,
  PieChartData,
  SimuladorConfig,
  CDIConfig
} from '../types/educacaoFinanceira';

// Formatação monetária brasileira
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value);
};

// Formatação de percentual
export const formatPercentage = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'percent',
    minimumFractionDigits: 1,
    maximumFractionDigits: 2
  }).format(value / 100);
};

// Formatação de números
export const formatNumber = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  }).format(value);
};

// Cálculo do rendimento do cofrinho (120% CDI)
export const calcularRendimentoCofrinho = (
  valorInicial: number, 
  meses: number
): CofrinhoResult => {
  const taxaMensal = CDI_CONFIG.taxaMensal; // Já está em decimal
  const valorFinal = valorInicial * Math.pow(1 + taxaMensal, meses);
  const ganhoTotal = valorFinal - valorInicial;
  
  const crescimentoMensal = [];
  for (let i = 1; i <= meses; i++) {
    crescimentoMensal.push({
      mes: i,
      valor: valorInicial * Math.pow(1 + taxaMensal, i)
    });
  }
  
  return { 
    valorFinal: Math.round(valorFinal * 100) / 100, 
    ganhoTotal: Math.round(ganhoTotal * 100) / 100, 
    rendimentoMensal: Math.round((ganhoTotal / meses) * 100) / 100,
    totalInvestido: valorInicial,
    taxaEfetiva: Math.round(((valorFinal / valorInicial) - 1) * 100 * 100) / 100,
    meses,
    crescimentoMensal 
  };
};

// Cálculo de tempo para quitação de dívidas
export const calcularTempoQuitacao = (
  valorDivida: number, 
  rendaMensal: number, 
  percentualPagamento: number
): DebtResult => {
  const valorMensal = (rendaMensal * percentualPagamento) / 100;
  
  if (valorMensal <= 0) {
    return {
      mesesParaQuitar: 0,
      valorMensalRecomendado: 0,
      estrategiaRecomendada: 'minimo',
      totalJuros: 0,
      percentualRenda: 0,
      progressoMensal: []
    };
  }
  
  const meses = Math.ceil(valorDivida / valorMensal);
  
  // Determinar estratégia recomendada baseada no percentual
  let estrategia = 'minimo';
  if (percentualPagamento >= 25) estrategia = 'avalanche';
  else if (percentualPagamento >= 20) estrategia = 'bola-de-neve';
  
  // Calcular progresso mensal
  const progressoMensal = [];
  let saldoRestante = valorDivida;
  
  for (let i = 1; i <= meses && saldoRestante > 0; i++) {
    const valorPago = Math.min(valorMensal, saldoRestante);
    saldoRestante -= valorPago;
    
    progressoMensal.push({
      mes: i,
      saldoRestante: Math.max(0, saldoRestante),
      valorPago
    });
  }
  
  // Calcular juros totais (simplificado - assumindo juros de 2% ao mês)
  const totalJuros = Math.max(0, (valorMensal * meses) - valorDivida);
  
  return {
    mesesParaQuitar: meses,
    valorMensalRecomendado: Math.round(valorMensal * 100) / 100,
    estrategiaRecomendada: estrategia,
    totalJuros: Math.round(totalJuros * 100) / 100,
    percentualRenda: Math.round(percentualPagamento * 100) / 100,
    progressoMensal
  };
};

// Calcular divisão orçamentária 50-30-20
export const calcularDivisaoOrcamentaria = (
  salario: number,
  config: SimuladorConfig
): {
  necessidades: number;
  desejos: number;
  poupanca: number;
  total: number;
} => {
  const necessidades = (salario * config.necessidades) / 100;
  const desejos = (salario * config.desejos) / 100;
  const poupanca = (salario * config.poupanca) / 100;
  
  return {
    necessidades: Math.round(necessidades * 100) / 100,
    desejos: Math.round(desejos * 100) / 100,
    poupanca: Math.round(poupanca * 100) / 100,
    total: salario
  };
};

// Gerar dados para gráfico de pizza do simulador 50-30-20
export const gerarDadosPieChart = (
  salario: number,
  config: SimuladorConfig
): PieChartData[] => {
  const divisao = calcularDivisaoOrcamentaria(salario, config);
  
  const dados: PieChartData[] = [
    {
      name: 'Necessidades',
      value: divisao.necessidades,
      color: '#3B82F6',
      percentage: config.necessidades
    },
    {
      name: 'Desejos',
      value: divisao.desejos,
      color: '#F59E0B',
      percentage: config.desejos
    },
    {
      name: 'Poupança',
      value: divisao.poupanca,
      color: '#10B981',
      percentage: config.poupanca
    }
  ];
  
  // Adicionar categorias customizadas se existirem
  if (config.customCategories && config.customCategories.length > 0) {
    config.customCategories.forEach(category => {
      const valor = (salario * category.percentage) / 100;
      dados.push({
        name: category.name,
        value: Math.round(valor * 100) / 100,
        color: category.color,
        percentage: category.percentage
      });
    });
  }
  
  return dados;
};

// Validar configuração do simulador 50-30-20
export const validarConfiguracao = (config: SimuladorConfig): {
  isValid: boolean;
  errors: string[];
} => {
  const errors: string[] = [];
  const total = config.necessidades + config.desejos + config.poupanca;
  
  // Verificar se os percentuais somam 100%
  if (Math.abs(total - 100) > 0.01) {
    errors.push('A soma dos percentuais deve ser igual a 100%');
  }
  
  // Verificar se todos os valores são positivos
  if (config.necessidades < 0 || config.desejos < 0 || config.poupanca < 0) {
    errors.push('Todos os percentuais devem ser positivos');
  }
  
  // Verificar limites mínimos recomendados
  if (config.necessidades < 30) {
    errors.push('Recomenda-se pelo menos 30% para necessidades');
  }
  
  if (config.poupanca < 10) {
    errors.push('Recomenda-se pelo menos 10% para poupança');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// Calcular economia anual baseada na poupança
export const calcularEconomiaAnual = (
  salarioMensal: number,
  percentualPoupanca: number
): {
  poupancaMensal: number;
  poupancaAnual: number;
  projecao5Anos: number;
  projecao10Anos: number;
} => {
  const poupancaMensal = (salarioMensal * percentualPoupanca) / 100;
  const poupancaAnual = poupancaMensal * 12;
  
  // Projeções considerando rendimento do CDI
  const taxaMensal = CDI_CONFIG.taxaMensal;
  const projecao5Anos = calcularRendimentoCofrinho(poupancaMensal, 60).valorFinal;
  const projecao10Anos = calcularRendimentoCofrinho(poupancaMensal, 120).valorFinal;
  
  return {
    poupancaMensal: Math.round(poupancaMensal * 100) / 100,
    poupancaAnual: Math.round(poupancaAnual * 100) / 100,
    projecao5Anos: Math.round(projecao5Anos * 100) / 100,
    projecao10Anos: Math.round(projecao10Anos * 100) / 100
  };
};

// Gerar recomendações baseadas no perfil financeiro
export const gerarRecomendacoes = (
  salario: number,
  config: SimuladorConfig,
  temDividas: boolean = false
): string[] => {
  const recomendacoes: string[] = [];
  
  // Recomendações baseadas na poupança
  if (config.poupanca < 15) {
    recomendacoes.push('💡 Tente aumentar sua poupança para pelo menos 15% da renda');
  } else if (config.poupanca >= 20) {
    recomendacoes.push('🎉 Excelente! Você está poupando mais de 20% da renda');
  }
  
  // Recomendações baseadas nas necessidades
  if (config.necessidades > 60) {
    recomendacoes.push('⚠️ Suas necessidades estão altas. Revise seus gastos essenciais');
  }
  
  // Recomendações baseadas nos desejos
  if (config.desejos > 40) {
    recomendacoes.push('🛍️ Considere reduzir gastos com desejos para aumentar a poupança');
  }
  
  // Recomendações baseadas no salário
  const poupancaMensal = (salario * config.poupanca) / 100;
  if (poupancaMensal < 500) {
    recomendacoes.push('📈 Mesmo pequenos valores poupados fazem diferença no longo prazo');
  }
  
  // Recomendações para quem tem dívidas
  if (temDividas) {
    recomendacoes.push('🎯 Priorize quitar dívidas antes de aumentar investimentos');
    recomendacoes.push('❄️ Use o método bola de neve: quite primeiro as menores dívidas');
  }
  
  return recomendacoes;
};

// Calcular impacto da inflação no poder de compra
export const calcularImpactoInflacao = (
  valor: number,
  meses: number,
  inflacaoAnual: number = 4.5
): {
  valorNominal: number;
  valorReal: number;
  perdaPoder: number;
  percentualPerda: number;
} => {
  const inflacaoMensal = Math.pow(1 + inflacaoAnual / 100, 1/12) - 1;
  const valorReal = valor / Math.pow(1 + inflacaoMensal, meses);
  const perdaPoder = valor - valorReal;
  const percentualPerda = (perdaPoder / valor) * 100;
  
  return {
    valorNominal: Math.round(valor * 100) / 100,
    valorReal: Math.round(valorReal * 100) / 100,
    perdaPoder: Math.round(perdaPoder * 100) / 100,
    percentualPerda: Math.round(percentualPerda * 100) / 100
  };
};

// Utilitário para cores dos gráficos
export const getCoresGrafico = (index: number): string => {
  const cores = [
    '#3B82F6', // Azul
    '#10B981', // Verde
    '#F59E0B', // Amarelo
    '#EF4444', // Vermelho
    '#8B5CF6', // Roxo
    '#F97316', // Laranja
    '#06B6D4', // Ciano
    '#84CC16'  // Lima
  ];
  
  return cores[index % cores.length];
};

// Gerar dados para gráfico de linha do cofrinho
export const gerarDadosGraficoCofrinho = (
  valorInicial: number,
  meses: number
): Array<{
  mes: number;
  valor: number;
  ganho: number;
  label: string;
}> => {
  const resultado = calcularRendimentoCofrinho(valorInicial, meses);
  
  return resultado.crescimentoMensal.map((item, index) => ({
    mes: item.mes,
    valor: Math.round(item.valor * 100) / 100,
    ganho: Math.round((item.valor - valorInicial) * 100) / 100,
    label: `Mês ${item.mes}`
  }));
};

// Gerar dados para gráfico de barras das dívidas
export const gerarDadosGraficoDividas = (
  valorDivida: number,
  rendaMensal: number,
  percentualPagamento: number
): Array<{
  mes: number;
  saldoRestante: number;
  valorPago: number;
  percentualQuitado: number;
  label: string;
}> => {
  const resultado = calcularTempoQuitacao(valorDivida, rendaMensal, percentualPagamento);
  
  return resultado.progressoMensal.map((item, index) => ({
    mes: item.mes,
    saldoRestante: Math.round(item.saldoRestante * 100) / 100,
    valorPago: Math.round(item.valorPago * 100) / 100,
    percentualQuitado: Math.round(((valorDivida - item.saldoRestante) / valorDivida) * 100),
    label: `Mês ${item.mes}`
  }));
};

// Gerar recomendações financeiras baseadas na situação de dívidas
export const gerarRecomendacoesFinanceiras = (
  valorDivida: number,
  rendaMensal: number,
  result: DebtResult
): string[] => {
  const recomendacoes: string[] = [];
  
  // Recomendações baseadas no tempo de quitação
  if (result.mesesParaQuitar > 24) {
    recomendacoes.push('⏰ Considere aumentar o valor mensal para quitar mais rapidamente');
  } else if (result.mesesParaQuitar <= 12) {
    recomendacoes.push('🎯 Excelente! Você conseguirá quitar em menos de um ano');
  }
  
  // Recomendações baseadas no percentual da renda
  if (result.percentualRenda > 30) {
    recomendacoes.push('⚠️ O valor mensal está alto. Considere renegociar as condições');
  } else if (result.percentualRenda < 15) {
    recomendacoes.push('💡 Você pode aumentar o valor mensal para quitar mais rápido');
  }
  
  // Recomendações baseadas nos juros
  if (result.totalJuros > valorDivida * 0.2) {
    recomendacoes.push('💰 Tente negociar uma taxa de juros menor');
  }
  
  // Recomendações gerais
  recomendacoes.push('📊 Mantenha o controle dos pagamentos para não atrasar');
  recomendacoes.push('🎯 Considere usar o método bola de neve para motivação extra');
  
  return recomendacoes;
};

// Função para formatar porcentagem
export const formatarPorcentagem = (value: number): string => {
  return `${value.toFixed(1)}%`;
};

// Função para calcular cofrinho inteligente
export const calcularCofrinhoInteligente = (
  valorInicial: number,
  meses: number,
  aporteMensal: number = 0,
  cdiConfig: CDIConfig
): CofrinhoResult => {
  const taxaMensal = cdiConfig.taxaMensal;
  let valorAtual = valorInicial;
  let totalInvestido = valorInicial;
  
  for (let i = 0; i < meses; i++) {
    valorAtual = valorAtual * (1 + taxaMensal) + aporteMensal;
    totalInvestido += aporteMensal;
  }
  
  const ganhoTotal = valorAtual - totalInvestido;
  const rendimentoMensal = ganhoTotal / meses;
  
  return {
    valorFinal: valorAtual,
    ganhoTotal,
    rendimentoMensal,
    totalInvestido,
    taxaEfetiva: ((valorAtual / valorInicial) - 1) * 100,
    meses,
    crescimentoMensal: []
  };
};

// Função para gerar dados do gráfico de crescimento
export const gerarDadosGraficoCrescimento = (result: CofrinhoResult): any[] => {
  const dados = [];
  const valorMensal = result.valorFinal / result.meses;
  
  for (let i = 0; i <= result.meses; i++) {
    dados.push({
      mes: i,
      valor: valorMensal * i,
      rendimento: (valorMensal * i) - (result.totalInvestido * (i / result.meses))
    });
  }
  
  return dados;
};

// Aliases para compatibilidade com componentes existentes
export const calcularDivisao5030 = calcularDivisaoOrcamentaria;
export const gerarDadosGraficoPizza = gerarDadosPieChart;
export const validarConfigSimulador = validarConfiguracao;
export const formatarMoeda = formatCurrency;