// Utilitários para cálculos de dashboard

import { 
  MetricasBasicas, 
  KPIsGerenciais, 
  GraficoEvolucao, 
  DadosComparativos, 
  AlertaRisco,
  SimulacaoResumo 
} from '../types/dashboard';

// Constantes para cálculos
const TAXA_SELIC = 0.1175; // 11.75% ao ano
const TAXA_CDI = 0.1150; // 11.50% ao ano
const INFLACAO_ANUAL = 0.045; // 4.5% ao ano

// Função para calcular métricas básicas
export const calcularMetricasBasicas = (
  valorInvestido: number,
  periodo: number,
  taxa: number = TAXA_CDI
): MetricasBasicas => {
  const valorFinal = valorInvestido * Math.pow(1 + taxa, periodo / 12);
  const rendimento = valorFinal - valorInvestido;
  const rendimentoPercentual = (rendimento / valorInvestido) * 100;
  const rendimentoMensal = rendimento / periodo;

  return {
    valorTotal: valorFinal,
    rendimento,
    percentualGanho: rendimentoPercentual,
    tempoInvestido: periodo,
    ultimaAtualizacao: new Date()
  };
};

// Função para calcular KPIs gerenciais
export const calcularKPIsGerenciais = (
  carteira: any[],
  periodo: number = 12
): KPIsGerenciais => {
  const totalInvestido = carteira.reduce((acc, item) => acc + item.valor, 0);
  const totalAtual = carteira.reduce((acc, item) => acc + item.valorAtual, 0);
  const rendimentoTotal = totalAtual - totalInvestido;
  
  // Calcular diversificação
  const tiposAtivos = Array.from(new Set(carteira.map(item => item.tipo)));
  const indiceDiversificacao = Math.min(tiposAtivos.length / 5, 1) * 100;
  
  // Calcular volatilidade (simulada)
  const volatilidade = carteira.reduce((acc, item) => {
    const peso = item.valorAtual / totalAtual;
    return acc + (peso * (item.volatilidade || 0.15));
  }, 0) * 100;

  // Calcular Sharpe Ratio
  const retornoAnual = (totalAtual / totalInvestido - 1) * (12 / periodo);
  const sharpeRatio = (retornoAnual - TAXA_SELIC) / (volatilidade / 100);

  return {
    roi: (rendimentoTotal / totalInvestido) * 100,
    volatilidade,
    sharpeRatio,
    maxDrawdown: calcularDrawdownMaximo(carteira),
    benchmarkComparison: retornoAnual * 100 - TAXA_CDI * 100,
    alfa: calcularAlfa(carteira, retornoAnual),
    beta: calcularBeta(carteira),
    informationRatio: sharpeRatio * 0.8 // Aproximação do Information Ratio
  };
};

// Função para gerar dados de evolução
export const gerarDadosEvolucao = (
  valorInicial: number,
  taxa: number,
  periodo: number
): GraficoEvolucao[] => {
  const dados: GraficoEvolucao[] = [];
  const dataInicial = new Date();
  
  for (let i = 0; i <= periodo; i++) {
    const data = new Date(dataInicial);
    data.setMonth(data.getMonth() + i);
    
    const valor = valorInicial * Math.pow(1 + taxa / 12, i);
    const rendimento = valor - valorInicial;
    
    dados.push({
      data: data,
      valor,
      rendimento
    });
  }
  
  return dados;
};

// Função para calcular dados comparativos
export const calcularDadosComparativos = (
  valorAtual: number,
  valorAnterior: number,
  periodo: 'mensal' | 'trimestral' | 'anual' = 'mensal'
): DadosComparativos => {
  const variacao = valorAtual - valorAnterior;
  const variacaoPercentual = valorAnterior > 0 ? (variacao / valorAnterior) * 100 : 0;
  
  let tendencia: 'alta' | 'baixa' | 'estavel';
  if (variacaoPercentual > 1) {
    tendencia = 'alta';
  } else if (variacaoPercentual < -1) {
    tendencia = 'baixa';
  } else {
    tendencia = 'estavel';
  }

  return {
    periodo,
    valorAtual,
    valorAnterior,
    variacao,
    variacaoPercentual,
    tendencia
  };
};

// Função para detectar alertas de risco
export const detectarAlertasRisco = (
  carteira: any[],
  kpis: KPIsGerenciais
): AlertaRisco[] => {
  const alertas: AlertaRisco[] = [];

  // Calcular diversificação para o alerta
  const tiposAtivos = Array.from(new Set(carteira.map(item => item.tipo)));
  const indiceDiversificacao = Math.min(tiposAtivos.length / 5, 1) * 100;

  // Alerta de concentração
  if (indiceDiversificacao < 40) {
    alertas.push({
      id: 'concentracao',
      tipo: 'medio',
      titulo: 'Baixa Diversificação',
      descricao: 'Sua carteira está muito concentrada em poucos ativos',
      dataDeteccao: new Date(),
      ativo: true,
      acaoRecomendada: 'Considere diversificar em diferentes classes de ativos'
    });
  }

  // Alerta de volatilidade alta
  if (kpis.volatilidade > 25) {
    alertas.push({
      id: 'volatilidade',
      tipo: 'alto',
      titulo: 'Alta Volatilidade',
      descricao: 'Sua carteira apresenta volatilidade acima do recomendado',
      dataDeteccao: new Date(),
      ativo: true,
      acaoRecomendada: 'Considere reduzir exposição a ativos de maior risco'
    });
  }

  // Alerta de performance
  if (kpis.roi < TAXA_CDI * 100) {
    alertas.push({
      id: 'performance',
      tipo: 'medio',
      titulo: 'Performance Abaixo do CDI',
      descricao: 'Seus investimentos estão rendendo menos que o CDI',
      dataDeteccao: new Date(),
      ativo: true,
      acaoRecomendada: 'Revise sua estratégia de investimentos'
    });
  }

  return alertas;
};

// Função para gerar simulação de cenários
export const gerarSimulacaoResumo = (
  valorInvestido: number,
  aportesMensais: number,
  periodo: number
): SimulacaoResumo => {
  const cenarios = {
    conservador: 0.08,
    moderado: 0.12,
    arrojado: 0.18
  };

  const resultados = Object.entries(cenarios).map(([nome, taxa]) => {
    let valor = valorInvestido;
    
    for (let i = 1; i <= periodo; i++) {
      valor = (valor + aportesMensais) * (1 + taxa / 12);
    }
    
    const totalAportado = valorInvestido + (aportesMensais * periodo);
    const rendimento = valor - totalAportado;
    
    return {
      cenario: nome,
      valorFinal: valor,
      rendimento,
      percentual: (rendimento / totalAportado) * 100
    };
  });

  const melhorCenario = resultados.reduce((prev, curr) => 
    curr.valorFinal > prev.valorFinal ? curr : prev
  );

  return {
    id: `simulacao-${Date.now()}`,
    nome: `Simulação ${melhorCenario.cenario}`,
    valorInicial: valorInvestido,
    valorFinal: melhorCenario.valorFinal,
    rendimento: melhorCenario.rendimento,
    dataSimulacao: new Date(),
    status: 'concluida' as const
  };
};

// Funções auxiliares
const calcularDrawdownMaximo = (carteira: any[]): number => {
  // Simulação de drawdown máximo
  return Math.random() * 15 + 5; // Entre 5% e 20%
};

const calcularBeta = (carteira: any[]): number => {
  // Simulação de beta (correlação com mercado)
  return 0.8 + Math.random() * 0.4; // Entre 0.8 e 1.2
};

const calcularAlfa = (carteira: any[], retorno: number): number => {
  // Alfa = Retorno da carteira - (Beta * Retorno do mercado)
  const retornoMercado = 0.12; // 12% ao ano
  const beta = calcularBeta(carteira);
  return retorno - (beta * retornoMercado);
};

const calcularIndiceLiquidez = (carteira: any[]): number => {
  // Índice de liquidez baseado nos tipos de ativos
  const pesos = {
    'renda-fixa': 0.9,
    'acoes': 0.8,
    'fundos': 0.7,
    'imoveis': 0.3,
    'cripto': 0.6
  };
  
  const totalValor = carteira.reduce((acc, item) => acc + item.valorAtual, 0);
  
  return carteira.reduce((acc, item) => {
    const peso = item.valorAtual / totalValor;
    const liquidezAtivo = pesos[item.tipo as keyof typeof pesos] || 0.5;
    return acc + (peso * liquidezAtivo);
  }, 0) * 100;
};

// Função para formatar valores monetários
export const formatarMoeda = (valor: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(valor);
};

// Função para formatar percentuais
export const formatarPercentual = (valor: number, decimais: number = 2): string => {
  return `${valor.toFixed(decimais)}%`;
};

// Função para calcular taxa de crescimento
export const calcularTaxaCrescimento = (valorInicial: number, valorFinal: number, periodo: number): number => {
  return Math.pow(valorFinal / valorInicial, 1 / periodo) - 1;
};

// Função auxiliar para calcular dados comparativos com benchmarks (para compatibilidade)
export const calcularComparativosBenchmarks = (
  valorInvestido: number,
  periodo: number
) => {
  const cdi = calcularMetricasBasicas(valorInvestido, periodo, TAXA_CDI);
  const selic = calcularMetricasBasicas(valorInvestido, periodo, TAXA_SELIC);
  const poupanca = calcularMetricasBasicas(valorInvestido, periodo, 0.07);
  const inflacao = calcularMetricasBasicas(valorInvestido, periodo, INFLACAO_ANUAL);

  return {
    cdi: {
      nome: 'CDI',
      valor: cdi.valorTotal,
      rendimento: cdi.rendimento,
      percentual: cdi.percentualGanho
    },
    selic: {
      nome: 'SELIC',
      valor: selic.valorTotal,
      rendimento: selic.rendimento,
      percentual: selic.percentualGanho
    },
    poupanca: {
      nome: 'Poupança',
      valor: poupanca.valorTotal,
      rendimento: poupanca.rendimento,
      percentual: poupanca.percentualGanho
    },
    inflacao: {
      nome: 'Inflação',
      valor: inflacao.valorTotal,
      rendimento: inflacao.rendimento,
      percentual: inflacao.percentualGanho
    }
  };
};