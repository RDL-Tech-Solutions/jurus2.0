// Utilitários para o Simulador de Cenários Econômicos

import { 
  CenarioEconomico, 
  ParametrosCenario, 
  EventoEconomico, 
  ResultadoCenario,
  EvolucaoMensalCenario,
  MetricasCenario,
  AnaliseRisco,
  StressTest,
  ParametrosStressTest,
  ChoqueEconomico,
  ResultadoStressTest,
  ComparacaoCenarios,
  AnaliseComparativa
} from '../types/cenarios';

// Cenários pré-definidos
export const cenariosPreDefinidos: Omit<CenarioEconomico, 'id' | 'criadoEm' | 'atualizadoEm'>[] = [
  {
    nome: 'Cenário Otimista',
    descricao: 'Crescimento econômico forte, inflação controlada, mercado em alta',
    tipo: 'otimista',
    cor: '#10B981',
    icone: '📈',
    ativo: true,
    parametros: {
      inflacao: { inicial: 3, final: 4, variacao: 'linear' },
      taxaJuros: { inicial: 10, final: 12, variacao: 'linear' },
      crescimentoEconomico: { pib: 3.5, emprego: 2, renda: 4 },
      volatilidade: { mercado: 15, cambio: 8, commodities: 12 },
      eventos: []
    }
  },
  {
    nome: 'Cenário Realista',
    descricao: 'Crescimento moderado, inflação na meta, volatilidade normal',
    tipo: 'realista',
    cor: '#3B82F6',
    icone: '📊',
    ativo: true,
    parametros: {
      inflacao: { inicial: 4, final: 4.5, variacao: 'linear' },
      taxaJuros: { inicial: 11, final: 11.5, variacao: 'linear' },
      crescimentoEconomico: { pib: 2, emprego: 1, renda: 2.5 },
      volatilidade: { mercado: 20, cambio: 12, commodities: 18 },
      eventos: []
    }
  },
  {
    nome: 'Cenário Pessimista',
    descricao: 'Recessão, alta inflação, mercado em baixa',
    tipo: 'pessimista',
    cor: '#EF4444',
    icone: '📉',
    ativo: true,
    parametros: {
      inflacao: { inicial: 6, final: 8, variacao: 'exponencial' },
      taxaJuros: { inicial: 13, final: 16, variacao: 'exponencial' },
      crescimentoEconomico: { pib: -1, emprego: -2, renda: -1.5 },
      volatilidade: { mercado: 35, cambio: 25, commodities: 30 },
      eventos: [
        {
          id: 'crise-1',
          nome: 'Crise Financeira',
          descricao: 'Crise no sistema financeiro',
          tipo: 'crise',
          impacto: { inflacao: 2, taxaJuros: 3, mercado: -20, duracao: 6 },
          probabilidade: 30,
          mesInicio: 12,
          mesFim: 18
        }
      ]
    }
  }
];

// Gerar ID único
export const gerarIdCenario = (): string => {
  return `cenario_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// Criar cenário personalizado
export const criarCenarioPersonalizado = (
  nome: string,
  descricao: string,
  parametros: ParametrosCenario
): CenarioEconomico => {
  return {
    id: gerarIdCenario(),
    nome,
    descricao,
    tipo: 'personalizado',
    parametros,
    cor: '#8B5CF6',
    icone: '⚙️',
    ativo: true,
    criadoEm: new Date(),
    atualizadoEm: new Date()
  };
};

// Simular cenário econômico
export const simularCenario = (
  cenario: CenarioEconomico,
  simulacao: any
): ResultadoCenario => {
  const evolucaoMensal: EvolucaoMensalCenario[] = [];
  let saldoAtual = simulacao.valorInicial;
  let totalInvestido = simulacao.valorInicial;
  
  for (let mes = 1; mes <= simulacao.periodo; mes++) {
    // Calcular inflação e taxa de juros para o mês
    const inflacaoMes = calcularParametroMensal(
      cenario.parametros.inflacao,
      mes,
      simulacao.periodo
    );
    
    const taxaJurosMes = calcularParametroMensal(
      cenario.parametros.taxaJuros,
      mes,
      simulacao.periodo
    );
    
    // Aplicar eventos econômicos
    const eventosAtivos = cenario.parametros.eventos.filter(
      evento => mes >= evento.mesInicio && mes <= evento.mesFim
    );
    
    let inflacaoAjustada = inflacaoMes;
    let taxaJurosAjustada = taxaJurosMes;
    
    eventosAtivos.forEach(evento => {
      inflacaoAjustada += evento.impacto.inflacao;
      taxaJurosAjustada += evento.impacto.taxaJuros;
    });
    
    // Calcular volatilidade
    const volatilidade = calcularVolatilidadeMensal(
      cenario.parametros.volatilidade.mercado,
      mes
    );
    
    // Aplicar aporte mensal
    if (mes > 1) {
      saldoAtual += simulacao.valorMensal;
      totalInvestido += simulacao.valorMensal;
    }
    
    // Calcular juros com volatilidade
    const jurosMes = saldoAtual * (taxaJurosAjustada / 100 / 12);
    const jurosComVolatilidade = jurosMes * (1 + (Math.random() - 0.5) * volatilidade / 100);
    
    saldoAtual += jurosComVolatilidade;
    
    // Calcular saldo real (ajustado pela inflação)
    const saldoReal = saldoAtual / Math.pow(1 + inflacaoAjustada / 100 / 12, mes);
    const poderCompra = (saldoReal / simulacao.valorInicial) * 100;
    
    evolucaoMensal.push({
      mes,
      saldo: saldoAtual,
      aporte: mes === 1 ? simulacao.valorInicial : simulacao.valorMensal,
      juros: jurosComVolatilidade,
      inflacao: inflacaoAjustada,
      taxaJuros: taxaJurosAjustada,
      saldoReal,
      poder_compra: poderCompra,
      volatilidade
    });
  }
  
  const saldoFinal = saldoAtual;
  const totalJuros = saldoFinal - totalInvestido;
  const rentabilidadeTotal = ((saldoFinal / totalInvestido) - 1) * 100;
  const rentabilidadeAnual = Math.pow(saldoFinal / totalInvestido, 12 / simulacao.periodo) - 1;
  
  const metricas = calcularMetricasCenario(evolucaoMensal);
  const riscos = analisarRiscos(evolucaoMensal, cenario);
  
  return {
    cenarioId: cenario.id,
    simulacao,
    resultados: {
      saldoFinal,
      totalInvestido,
      totalJuros,
      rentabilidadeTotal,
      rentabilidadeAnual: rentabilidadeAnual * 100,
      evolucaoMensal
    },
    metricas,
    riscos
  };
};

// Calcular parâmetro mensal baseado na variação
const calcularParametroMensal = (
  parametro: { inicial: number; final: number; variacao: string },
  mes: number,
  periodoTotal: number
): number => {
  const progresso = mes / periodoTotal;
  
  switch (parametro.variacao) {
    case 'linear':
      return parametro.inicial + (parametro.final - parametro.inicial) * progresso;
    
    case 'exponencial':
      return parametro.inicial * Math.pow(parametro.final / parametro.inicial, progresso);
    
    case 'volatil':
      const base = parametro.inicial + (parametro.final - parametro.inicial) * progresso;
      const volatilidade = Math.abs(parametro.final - parametro.inicial) * 0.2;
      return base + (Math.random() - 0.5) * volatilidade;
    
    case 'constante':
    default:
      return parametro.inicial;
  }
};

// Calcular volatilidade mensal
const calcularVolatilidadeMensal = (volatilidade: number, mes: number): number => {
  // Adicionar sazonalidade à volatilidade
  const sazonalidade = Math.sin((mes * 2 * Math.PI) / 12) * 0.3;
  return volatilidade * (1 + sazonalidade);
};

// Calcular métricas do cenário
const calcularMetricasCenario = (evolucao: EvolucaoMensalCenario[]): MetricasCenario => {
  const retornos = evolucao.slice(1).map((mes, i) => 
    (mes.saldo - evolucao[i].saldo) / evolucao[i].saldo
  );
  
  const retornoMedio = retornos.reduce((a, b) => a + b, 0) / retornos.length;
  const volatilidade = Math.sqrt(
    retornos.reduce((sum, ret) => sum + Math.pow(ret - retornoMedio, 2), 0) / retornos.length
  ) * Math.sqrt(12) * 100;
  
  // Calcular VaR (95% de confiança)
  const retornosOrdenados = [...retornos].sort((a, b) => a - b);
  const var95 = retornosOrdenados[Math.floor(retornosOrdenados.length * 0.05)] * 100;
  
  // Calcular CVaR
  const cvar = retornosOrdenados
    .slice(0, Math.floor(retornosOrdenados.length * 0.05))
    .reduce((a, b) => a + b, 0) / Math.floor(retornosOrdenados.length * 0.05) * 100;
  
  // Calcular Max Drawdown
  let maxDrawdown = 0;
  let peak = evolucao[0].saldo;
  
  evolucao.forEach(mes => {
    if (mes.saldo > peak) peak = mes.saldo;
    const drawdown = (peak - mes.saldo) / peak;
    if (drawdown > maxDrawdown) maxDrawdown = drawdown;
  });
  
  // Índice Sharpe (assumindo taxa livre de risco de 5%)
  const taxaLivreRisco = 0.05 / 12;
  const excessoRetorno = retornoMedio - taxaLivreRisco;
  const sharpe = excessoRetorno / (volatilidade / 100 / Math.sqrt(12));
  
  // Índice Sortino (apenas volatilidade negativa)
  const retornosNegativos = retornos.filter(ret => ret < retornoMedio);
  const volatilidadeNegativa = retornosNegativos.length > 0 
    ? Math.sqrt(retornosNegativos.reduce((sum, ret) => sum + Math.pow(ret - retornoMedio, 2), 0) / retornosNegativos.length)
    : 0;
  const sortino = volatilidadeNegativa > 0 ? excessoRetorno / volatilidadeNegativa : 0;
  
  return {
    var: var95,
    cvar,
    sharpe,
    sortino,
    maxDrawdown: maxDrawdown * 100,
    volatilidade,
    beta: 1, // Simplificado
    alpha: (retornoMedio * 12 - 0.1) * 100, // Alpha em relação ao benchmark de 10%
    correlacao: 0.8 // Simplificado
  };
};

// Analisar riscos
const analisarRiscos = (
  evolucao: EvolucaoMensalCenario[],
  cenario: CenarioEconomico
): AnaliseRisco => {
  const volatilidade = evolucao.reduce((sum, mes) => sum + mes.volatilidade, 0) / evolucao.length;
  const inflacaoMedia = evolucao.reduce((sum, mes) => sum + mes.inflacao, 0) / evolucao.length;
  
  let pontuacao = 0;
  const fatores = [];
  
  // Fator inflação
  if (inflacaoMedia > 6) {
    pontuacao += 30;
    fatores.push({
      nome: 'Inflação Elevada',
      impacto: 30,
      probabilidade: 70,
      descricao: 'Inflação acima de 6% pode corroer o poder de compra',
      mitigacao: ['Investir em ativos indexados à inflação', 'Diversificar internacionalmente']
    });
  }
  
  // Fator volatilidade
  if (volatilidade > 25) {
    pontuacao += 25;
    fatores.push({
      nome: 'Alta Volatilidade',
      impacto: 25,
      probabilidade: 60,
      descricao: 'Mercado muito volátil pode causar perdas significativas',
      mitigacao: ['Reduzir exposição a risco', 'Aumentar reserva de emergência']
    });
  }
  
  // Fator eventos
  if (cenario.parametros.eventos.length > 0) {
    pontuacao += 20;
    fatores.push({
      nome: 'Eventos Econômicos',
      impacto: 20,
      probabilidade: 40,
      descricao: 'Eventos econômicos podem impactar negativamente os investimentos',
      mitigacao: ['Manter diversificação', 'Ter estratégia de saída']
    });
  }
  
  const nivel = pontuacao < 25 ? 'baixo' : pontuacao < 50 ? 'medio' : pontuacao < 75 ? 'alto' : 'extremo';
  
  const probabilidadePerda = Math.min(pontuacao, 80);
  const perdaMaximaEsperada = evolucao[evolucao.length - 1].saldo * (pontuacao / 100) * 0.3;
  
  const recomendacoes = [
    'Mantenha uma reserva de emergência',
    'Diversifique seus investimentos',
    'Revise periodicamente sua estratégia',
    'Considere proteção contra inflação'
  ];
  
  return {
    nivel,
    pontuacao,
    fatores,
    recomendacoes,
    probabilidadePerda,
    perdaMaximaEsperada
  };
};

// Executar stress test
export const executarStressTest = (
  simulacao: any,
  parametros: ParametrosStressTest
): ResultadoStressTest => {
  let perdaMaxima = 0;
  let tempoRecuperacao = 0;
  let probabilidadeSobrevivencia = 100;
  
  // Simular choques
  parametros.choques.forEach(choque => {
    const impacto = calcularImpactoChoque(choque, simulacao);
    if (impacto.perda > perdaMaxima) {
      perdaMaxima = impacto.perda;
      tempoRecuperacao = impacto.recuperacao;
    }
    
    probabilidadeSobrevivencia *= (1 - impacto.probabilidadeFalencia / 100);
  });
  
  const impactoPatrimonio = (perdaMaxima / simulacao.valorInicial) * 100;
  
  const cenariosCriticos = parametros.choques
    .filter(choque => choque.magnitude > 50)
    .map(choque => `${choque.tipo} (${choque.magnitude}%)`);
  
  const recomendacoes = [
    'Mantenha reserva de emergência equivalente a 6-12 meses de gastos',
    'Diversifique entre diferentes classes de ativos',
    'Considere seguros para proteção patrimonial',
    'Tenha um plano de contingência financeira'
  ];
  
  return {
    perdaMaxima,
    tempoRecuperacao,
    probabilidadeSobrevivencia,
    impactoPatrimonio,
    cenariosCriticos,
    recomendacoes
  };
};

// Calcular impacto do choque
const calcularImpactoChoque = (choque: ChoqueEconomico, simulacao: any) => {
  const intensidade = choque.magnitude / 100;
  const perda = simulacao.valorInicial * intensidade * 0.5; // Simplificado
  const recuperacao = choque.duracao * 2; // Tempo de recuperação em meses
  const probabilidadeFalencia = Math.min(intensidade * 30, 90); // Máximo 90%
  
  return { perda, recuperacao, probabilidadeFalencia };
};

// Comparar cenários
export const compararCenarios = (
  resultados: ResultadoCenario[]
): AnaliseComparativa => {
  if (resultados.length < 2) {
    throw new Error('É necessário pelo menos 2 cenários para comparação');
  }
  
  // Encontrar melhor e pior cenário
  const melhorCenario = resultados.reduce((melhor, atual) => 
    atual.resultados.saldoFinal > melhor.resultados.saldoFinal ? atual : melhor
  ).cenarioId;
  
  const piorCenario = resultados.reduce((pior, atual) => 
    atual.resultados.saldoFinal < pior.resultados.saldoFinal ? atual : pior
  ).cenarioId;
  
  // Calcular diferenças
  const saldos = resultados.map(r => r.resultados.saldoFinal);
  const diferencaMaxima = Math.max(...saldos) - Math.min(...saldos);
  const diferencaMedia = saldos.reduce((a, b) => a + b, 0) / saldos.length;
  
  // Calcular correlações (simplificado)
  const correlacoes: { [key: string]: number } = {};
  resultados.forEach((resultado, i) => {
    resultados.forEach((outro, j) => {
      if (i !== j) {
        const key = `${resultado.cenarioId}-${outro.cenarioId}`;
        correlacoes[key] = 0.7; // Simplificado
      }
    });
  });
  
  // Cenário mais provável (realista se existir)
  const cenarioMaisProvavel = resultados.find(r => 
    r.cenarioId.includes('realista')
  )?.cenarioId || resultados[0].cenarioId;
  
  const recomendacao = gerarRecomendacaoComparativa(resultados);
  const confianca = 75; // Simplificado
  
  return {
    melhorCenario,
    piorCenario,
    cenarioMaisProvavel,
    diferencaMaxima,
    diferencaMedia,
    correlacoes,
    recomendacao,
    confianca
  };
};

// Gerar recomendação comparativa
const gerarRecomendacaoComparativa = (resultados: ResultadoCenario[]): string => {
  const diferencaPercentual = ((Math.max(...resultados.map(r => r.resultados.saldoFinal)) - 
                               Math.min(...resultados.map(r => r.resultados.saldoFinal))) / 
                               Math.min(...resultados.map(r => r.resultados.saldoFinal))) * 100;
  
  if (diferencaPercentual > 50) {
    return 'Alta variabilidade entre cenários. Considere estratégias de proteção e diversificação.';
  } else if (diferencaPercentual > 25) {
    return 'Variabilidade moderada. Mantenha flexibilidade na estratégia de investimento.';
  } else {
    return 'Baixa variabilidade entre cenários. Estratégia atual parece robusta.';
  }
};

// Formatar valores monetários
export const formatarMoeda = (valor: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(valor);
};

// Formatar percentuais
export const formatarPercentual = (valor: number, decimais: number = 2): string => {
  return `${valor.toFixed(decimais)}%`;
};

// Gerar cores para gráficos
export const gerarCoresCenarios = (quantidade: number): string[] => {
  const cores = [
    '#10B981', '#3B82F6', '#EF4444', '#8B5CF6', '#F59E0B',
    '#06B6D4', '#84CC16', '#F97316', '#EC4899', '#6366F1'
  ];
  
  return cores.slice(0, quantidade);
};