import { 
  PadraoInvestimento, 
  SugestaoPersonalizada, 
  MetricaPerformance, 
  AlertaOportunidade,
  AnaliseComportamental,
  DashboardInsights,
  PrevisaoTendencia,
  CorrelacaoVariaveis,
  ConquistaInsights,
  PontuacaoUsuario
} from '../types/insights';
import { SimulacaoJuros, ResultadoSimulacao } from '../types/simulacao';
import { HistoricoItem } from '../types/historico';

// Análise de padrões de investimento
export const analisarPadroes = (historico: HistoricoItem[]): PadraoInvestimento[] => {
  const padroes: PadraoInvestimento[] = [];
  
  if (historico.length < 3) return padroes;

  // Analisar tendência de valor inicial
  const valoresIniciais = historico.map(item => item.simulacao.valorInicial);
  const tendenciaValorInicial = calcularTendencia(valoresIniciais);
  
  if (Math.abs(tendenciaValorInicial.variacao) > 5) {
    padroes.push({
      id: 'valor_inicial_trend',
      tipo: 'valor_inicial',
      tendencia: tendenciaValorInicial.variacao > 0 ? 'crescente' : 'decrescente',
      variacao: Math.abs(tendenciaValorInicial.variacao),
      frequencia: historico.length,
      ultimaOcorrencia: new Date(Math.max(...historico.map(h => h.data.getTime()))),
      confianca: Math.min(95, tendenciaValorInicial.confianca * 100)
    });
  }

  // Analisar tendência de aportes mensais
  const valoresMensais = historico.map(item => item.simulacao.valorMensal);
  const tendenciaValorMensal = calcularTendencia(valoresMensais);
  
  if (Math.abs(tendenciaValorMensal.variacao) > 10) {
    padroes.push({
      id: 'valor_mensal_trend',
      tipo: 'valor_mensal',
      tendencia: tendenciaValorMensal.variacao > 0 ? 'crescente' : 'decrescente',
      variacao: Math.abs(tendenciaValorMensal.variacao),
      frequencia: historico.length,
      ultimaOcorrencia: new Date(Math.max(...historico.map(h => h.data.getTime()))),
      confianca: Math.min(95, tendenciaValorMensal.confianca * 100)
    });
  }

  // Analisar tendência de períodos
  const periodos = historico.map(item => item.simulacao.periodo);
  const tendenciaPeriodo = calcularTendencia(periodos);
  
  if (Math.abs(tendenciaPeriodo.variacao) > 15) {
    padroes.push({
      id: 'periodo_trend',
      tipo: 'periodo',
      tendencia: tendenciaPeriodo.variacao > 0 ? 'crescente' : 'decrescente',
      variacao: Math.abs(tendenciaPeriodo.variacao),
      frequencia: historico.length,
      ultimaOcorrencia: new Date(Math.max(...historico.map(h => h.data.getTime()))),
      confianca: Math.min(95, tendenciaPeriodo.confianca * 100)
    });
  }

  return padroes;
};

// Calcular tendência de uma série de valores
const calcularTendencia = (valores: number[]) => {
  if (valores.length < 2) return { variacao: 0, confianca: 0 };
  
  const n = valores.length;
  const x = Array.from({ length: n }, (_, i) => i);
  const y = valores;
  
  // Regressão linear simples
  const sumX = x.reduce((a, b) => a + b, 0);
  const sumY = y.reduce((a, b) => a + b, 0);
  const sumXY = x.reduce((sum, xi, i) => sum + xi * y[i], 0);
  const sumXX = x.reduce((sum, xi) => sum + xi * xi, 0);
  
  const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;
  
  // Calcular R²
  const yMean = sumY / n;
  const ssTotal = y.reduce((sum, yi) => sum + Math.pow(yi - yMean, 2), 0);
  const ssRes = y.reduce((sum, yi, i) => {
    const predicted = slope * x[i] + intercept;
    return sum + Math.pow(yi - predicted, 2);
  }, 0);
  
  const rSquared = 1 - (ssRes / ssTotal);
  
  // Variação percentual
  const valorInicial = valores[0];
  const valorFinal = slope * (n - 1) + intercept;
  const variacao = valorInicial !== 0 ? ((valorFinal - valorInicial) / valorInicial) * 100 : 0;
  
  return {
    variacao,
    confianca: Math.max(0, rSquared)
  };
};

// Gerar sugestões personalizadas
export const gerarSugestoes = (
  historico: HistoricoItem[],
  padroes: PadraoInvestimento[]
): SugestaoPersonalizada[] => {
  const sugestoes: SugestaoPersonalizada[] = [];
  
  if (historico.length === 0) return sugestoes;

  const ultimaSimulacao = historico[historico.length - 1];
  const simulacao = ultimaSimulacao.dados as SimulacaoJuros;
  const resultado = ultimaSimulacao.dados.resultado;

  // Sugestão de otimização de aportes
  if ((simulacao.parametros.valorMensal || 0) < 1000 && resultado) {
    const valorMensalAtual = simulacao.parametros.valorMensal || 0;
    const novoValorMensal = Math.min(valorMensalAtual * 1.5, 2000);
    const impactoEstimado = calcularImpactoAumento(simulacao, novoValorMensal);
    
    sugestoes.push({
      id: 'otimizar_aportes',
      tipo: 'otimizacao',
      titulo: 'Aumente seus aportes mensais',
      descricao: `Aumentar seu aporte de ${formatarMoeda(valorMensalAtual)} para ${formatarMoeda(novoValorMensal)} pode gerar ${formatarMoeda(impactoEstimado)} a mais no final do período.`,
      impacto: 'alto',
      prioridade: 'alta',
      categoria: 'Otimização de Aportes',
      acoes: [{
        id: 'aumentar_aporte',
        descricao: `Aumentar aporte mensal para ${formatarMoeda(novoValorMensal)}`,
        tipo: 'ajuste_valor',
        parametros: { valorMensal: novoValorMensal },
        impactoEstimado: { rendimentoAdicional: impactoEstimado }
      }],
      baseadoEm: [ultimaSimulacao.id],
      dataCriacao: new Date(),
      visualizada: false,
      aplicada: false
    });
  }

  // Sugestão de extensão de prazo
  if (simulacao.periodo < 60 && resultado) {
    const novoPeriodo = Math.min(simulacao.periodo + 24, 120);
    const impactoEstimado = calcularImpactoExtensao(simulacao, novoPeriodo);
    
    sugestoes.push({
      id: 'estender_prazo',
      tipo: 'otimizacao',
      titulo: 'Considere estender o prazo do investimento',
      descricao: `Estender o prazo de ${simulacao.periodo} para ${novoPeriodo} meses pode gerar ${formatarMoeda(impactoEstimado)} adicional devido aos juros compostos.`,
      impacto: 'medio',
      prioridade: 'media',
      categoria: 'Otimização de Prazo',
      acoes: [{
        id: 'estender_periodo',
        descricao: `Estender período para ${novoPeriodo} meses`,
        tipo: 'mudanca_periodo',
        parametros: { periodo: novoPeriodo },
        impactoEstimado: { rendimentoAdicional: impactoEstimado }
      }],
      baseadoEm: [ultimaSimulacao.id],
      dataCriacao: new Date(),
      visualizada: false,
      aplicada: false
    });
  }

  // Sugestão baseada em padrões
  const padraoAportes = padroes.find(p => p.tipo === 'valor_mensal' && p.tendencia === 'crescente');
  if (padraoAportes && padraoAportes.confianca > 70) {
    sugestoes.push({
      id: 'manter_crescimento_aportes',
      tipo: 'meta',
      titulo: 'Continue aumentando seus aportes',
      descricao: `Você tem mantido uma tendência crescente nos aportes (${padraoAportes.variacao.toFixed(1)}% de aumento). Continue assim para maximizar seus resultados!`,
      impacto: 'alto',
      prioridade: 'media',
      categoria: 'Reconhecimento de Padrão',
      acoes: [{
        id: 'manter_tendencia',
        descricao: 'Manter tendência de crescimento nos aportes',
        tipo: 'ajuste_valor',
        parametros: { tendencia: 'crescente' },
        impactoEstimado: { rendimentoAdicional: 0 }
      }],
      baseadoEm: historico.slice(-3).map(h => h.id),
      dataCriacao: new Date(),
      visualizada: false,
      aplicada: false
    });
  }

  return sugestoes;
};

// Calcular métricas de performance
export const calcularMetricas = (historico: HistoricoItem[]): MetricaPerformance[] => {
  const metricas: MetricaPerformance[] = [];
  
  if (historico.length === 0) return metricas;

  const simulacoesComResultado = historico.filter(h => h.dados?.resultado);
  
  if (simulacoesComResultado.length === 0) return metricas;

  // Rendimento médio
  const rendimentoMedio = simulacoesComResultado.reduce((sum, h) => {
    const simulacao = h.dados as SimulacaoJuros;
    const resultado = simulacao.resultado!;
    const rendimento = resultado.totalJuros; // Using totalJuros instead of rendimentoTotal
    const investido = simulacao.parametros.valorInicial + ((simulacao.parametros.valorMensal || 0) * simulacao.parametros.periodo);
    return sum + (rendimento / investido) * 100;
  }, 0) / simulacoesComResultado.length;

  metricas.push({
    id: 'rendimento_medio',
    nome: 'Rendimento Médio',
    valor: rendimentoMedio,
    unidade: '%',
    tendencia: 'positiva',
    variacao: 0,
    benchmark: 10, // CDI médio
    categoria: 'rentabilidade',
    descricao: 'Rendimento médio das suas simulações em relação ao valor investido'
  });

  // Valor médio investido
  const valorMedioInvestido = simulacoesComResultado.reduce((sum, h) => {
    const simulacao = h.dados as SimulacaoJuros;
    return sum + simulacao.parametros.valorInicial + ((simulacao.parametros.valorMensal || 0) * simulacao.parametros.periodo);
  }, 0) / simulacoesComResultado.length;

  metricas.push({
    id: 'valor_medio_investido',
    nome: 'Valor Médio Investido',
    valor: valorMedioInvestido,
    unidade: 'R$',
    tendencia: 'neutra',
    variacao: 0,
    categoria: 'liquidez',
    descricao: 'Valor médio total investido nas suas simulações'
  });

  // Período médio
  const periodoMedio = simulacoesComResultado.reduce((sum, h) => sum + h.simulacao.periodo, 0) / simulacoesComResultado.length;

  metricas.push({
    id: 'periodo_medio',
    nome: 'Período Médio',
    valor: periodoMedio,
    unidade: 'meses',
    tendencia: 'neutra',
    variacao: 0,
    categoria: 'liquidez',
    descricao: 'Período médio de investimento das suas simulações'
  });

  // Consistência (desvio padrão dos rendimentos)
  const rendimentos = simulacoesComResultado.map(h => {
    const rendimento = h.resultado!.rendimentoTotal;
    const investido = h.simulacao.valorInicial + (h.simulacao.valorMensal * h.simulacao.periodo);
    return (rendimento / investido) * 100;
  });

  const desvioPadrao = calcularDesvioPadrao(rendimentos);
  const consistencia = Math.max(0, 100 - (desvioPadrao * 10)); // Normalizar para 0-100

  metricas.push({
    id: 'consistencia',
    nome: 'Consistência',
    valor: consistencia,
    unidade: 'pontos',
    tendencia: consistencia > 70 ? 'positiva' : 'negativa',
    variacao: 0,
    categoria: 'risco',
    descricao: 'Medida de consistência dos seus investimentos (menor variação = maior consistência)'
  });

  return metricas;
};

// Gerar alertas de oportunidades
export const gerarAlertas = (
  historico: HistoricoItem[],
  metricas: MetricaPerformance[]
): AlertaOportunidade[] => {
  const alertas: AlertaOportunidade[] = [];
  
  if (historico.length === 0) return alertas;

  const ultimaSimulacao = historico[historico.length - 1];
  
  // Alerta de meta próxima (simulação)
  if (ultimaSimulacao.resultado) {
    const metaSimulada = 100000; // Meta de R$ 100.000
    const progresso = (ultimaSimulacao.resultado.saldoFinal / metaSimulada) * 100;
    
    if (progresso > 80 && progresso < 100) {
      alertas.push({
        id: 'meta_proxima',
        tipo: 'meta_proxima',
        titulo: 'Meta quase alcançada!',
        descricao: `Você está a ${(100 - progresso).toFixed(1)}% de alcançar sua meta de ${formatarMoeda(metaSimulada)}.`,
        urgencia: 'alta',
        categoria: 'Metas',
        acaoRecomendada: 'Considere um pequeno aumento no aporte para acelerar o alcance da meta',
        parametros: { metaAtual: metaSimulada, progresso },
        visualizado: false,
        descartado: false
      });
    }
  }

  // Alerta de baixa diversificação
  const modalidadesUnicas = new Set(historico.map(h => h.simulacao.modalidade?.nome || 'Padrão'));
  if (modalidadesUnicas.size === 1 && historico.length > 5) {
    alertas.push({
      id: 'baixa_diversificacao',
      tipo: 'rebalanceamento',
      titulo: 'Considere diversificar seus investimentos',
      descricao: 'Você tem usado apenas uma modalidade de investimento. Diversificar pode reduzir riscos.',
      urgencia: 'media',
      categoria: 'Diversificação',
      acaoRecomendada: 'Explore diferentes modalidades de investimento disponíveis',
      parametros: { modalidadesUsadas: modalidadesUnicas.size },
      visualizado: false,
      descartado: false
    });
  }

  // Alerta de oportunidade de aumento de aporte
  const rendimentoMedio = metricas.find(m => m.id === 'rendimento_medio');
  if (rendimentoMedio && rendimentoMedio.valor > 12) {
    alertas.push({
      id: 'oportunidade_aumento',
      tipo: 'taxa_atrativa',
      titulo: 'Rendimento acima da média!',
      descricao: `Seu rendimento médio de ${rendimentoMedio.valor.toFixed(1)}% está acima da média do mercado. Considere aumentar seus aportes.`,
      urgencia: 'media',
      categoria: 'Oportunidades',
      acaoRecomendada: 'Aumente seus aportes para aproveitar o bom momento',
      parametros: { rendimentoAtual: rendimentoMedio.valor },
      visualizado: false,
      descartado: false
    });
  }

  return alertas;
};

// Análise comportamental
export const analisarComportamento = (historico: HistoricoItem[]): AnaliseComportamental => {
  if (historico.length === 0) {
    return {
      id: 'analise_inicial',
      perfil: 'conservador',
      caracteristicas: {
        frequenciaSimulacoes: 0,
        valorMedioInvestido: 0,
        periodoMedioInvestimento: 0,
        diversificacao: 0,
        consistencia: 0,
        toleranciaRisco: 0
      },
      tendencias: {
        aumentoAportes: false,
        extensaoPrazos: false,
        diversificacaoModalidades: false,
        buscaMaiorRentabilidade: false
      },
      recomendacoes: ['Comece criando suas primeiras simulações para entender melhor seus objetivos financeiros.']
    };
  }

  // Calcular características
  const valorMedioInvestido = historico.reduce((sum, h) => {
    const simulacao = h.dados as SimulacaoJuros;
    return sum + simulacao.parametros.valorInicial + ((simulacao.parametros.valorMensal || 0) * simulacao.parametros.periodo);
  }, 0) / historico.length;

  const periodoMedioInvestimento = historico.reduce((sum, h) => {
    const simulacao = h.dados as SimulacaoJuros;
    return sum + simulacao.parametros.periodo;
  }, 0) / historico.length;

  const modalidadesUnicas = new Set(historico.map(h => {
    const simulacao = h.dados as SimulacaoJuros;
    return simulacao.tipo || 'Padrão';
  }));
  const diversificacao = Math.min(100, (modalidadesUnicas.size / 5) * 100); // Assumindo 5 modalidades máximas

  // Calcular tendências
  const valoresMensais = historico.map(h => {
    const simulacao = h.dados as SimulacaoJuros;
    return simulacao.parametros.valorMensal || 0;
  });
  const periodos = historico.map(h => {
    const simulacao = h.dados as SimulacaoJuros;
    return simulacao.parametros.periodo;
  });
  
  const tendenciaAportes = calcularTendencia(valoresMensais);
  const tendenciaPrazos = calcularTendencia(periodos);

  const aumentoAportes = tendenciaAportes.variacao > 5;
  const extensaoPrazos = tendenciaPrazos.variacao > 10;

  // Determinar perfil
  let perfil: 'conservador' | 'moderado' | 'arrojado' = 'conservador';
  
  if (periodoMedioInvestimento > 60 && valorMedioInvestido > 50000) {
    perfil = 'arrojado';
  } else if (periodoMedioInvestimento > 36 && valorMedioInvestido > 20000) {
    perfil = 'moderado';
  }

  // Gerar recomendações
  const recomendacoes: string[] = [];
  
  if (diversificacao < 40) {
    recomendacoes.push('Considere diversificar em diferentes modalidades de investimento para reduzir riscos.');
  }
  
  if (aumentoAportes) {
    recomendacoes.push('Parabéns! Você tem aumentado consistentemente seus aportes. Continue assim!');
  } else {
    recomendacoes.push('Tente aumentar gradualmente seus aportes mensais para acelerar seus resultados.');
  }
  
  if (periodoMedioInvestimento < 24) {
    recomendacoes.push('Considere prazos mais longos para aproveitar melhor o poder dos juros compostos.');
  }

  return {
    id: 'analise_comportamental',
    perfil,
    caracteristicas: {
      frequenciaSimulacoes: historico.length,
      valorMedioInvestido,
      periodoMedioInvestimento,
      diversificacao,
      consistencia: 75, // Placeholder
      toleranciaRisco: perfil === 'conservador' ? 30 : perfil === 'moderado' ? 60 : 90
    },
    tendencias: {
      aumentoAportes,
      extensaoPrazos,
      diversificacaoModalidades: modalidadesUnicas.size > 1,
      buscaMaiorRentabilidade: false // Placeholder
    },
    recomendacoes
  };
};

// Funções auxiliares
const calcularImpactoAumento = (simulacao: SimulacaoJuros, novoValorMensal: number): number => {
  const taxaMensal = simulacao.parametros.taxa / 100 / (simulacao.parametros.tipoTaxa === 'anual' ? 12 : 1);
  
  // Cálculo original
  const montanteOriginal = simulacao.parametros.valorInicial * Math.pow(1 + taxaMensal, simulacao.parametros.periodo) +
    (simulacao.parametros.valorMensal || 0) * ((Math.pow(1 + taxaMensal, simulacao.parametros.periodo) - 1) / taxaMensal);
  
  // Cálculo com novo valor
  const montanteNovo = simulacao.parametros.valorInicial * Math.pow(1 + taxaMensal, simulacao.parametros.periodo) +
    novoValorMensal * ((Math.pow(1 + taxaMensal, simulacao.parametros.periodo) - 1) / taxaMensal);
  
  return montanteNovo - montanteOriginal;
};

const calcularImpactoExtensao = (simulacao: SimulacaoJuros, novoPeriodo: number): number => {
  const taxaMensal = simulacao.parametros.taxa / 100 / (simulacao.parametros.tipoTaxa === 'anual' ? 12 : 1);
  
  // Cálculo original
  const montanteOriginal = simulacao.parametros.valorInicial * Math.pow(1 + taxaMensal, simulacao.parametros.periodo) +
    (simulacao.parametros.valorMensal || 0) * ((Math.pow(1 + taxaMensal, simulacao.parametros.periodo) - 1) / taxaMensal);
  
  // Cálculo com novo período
  const montanteNovo = simulacao.parametros.valorInicial * Math.pow(1 + taxaMensal, novoPeriodo) +
    (simulacao.parametros.valorMensal || 0) * ((Math.pow(1 + taxaMensal, novoPeriodo) - 1) / taxaMensal);
  
  return montanteNovo - montanteOriginal;
};

const calcularDesvioPadrao = (valores: number[]): number => {
  const media = valores.reduce((sum, val) => sum + val, 0) / valores.length;
  const variancia = valores.reduce((sum, val) => sum + Math.pow(val - media, 2), 0) / valores.length;
  return Math.sqrt(variancia);
};

export const formatarMoeda = (valor: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(valor);
};

export const formatarPorcentagem = (valor: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'percent',
    minimumFractionDigits: 1,
    maximumFractionDigits: 2
  }).format(valor / 100);
};

// Gerar dashboard completo
export const gerarDashboardInsights = (historico: HistoricoItem[]): DashboardInsights => {
  const padroes = analisarPadroes(historico);
  const sugestoes = gerarSugestoes(historico, padroes);
  const metricas = calcularMetricas(historico);
  const alertas = gerarAlertas(historico, metricas);
  const analiseComportamental = analisarComportamento(historico);

  const simulacoesComResultado = historico.filter(h => h.dados?.resultado);
  const rendimentoMedioProjetado = simulacoesComResultado.length > 0
    ? simulacoesComResultado.reduce((sum, h) => sum + h.dados.resultado.saldoFinal, 0) / simulacoesComResultado.length
    : 0;

  return {
    padroes,
    sugestoes,
    metricas,
    alertas,
    analiseComportamental,
    resumoExecutivo: {
      totalSimulacoes: historico.length,
      rendimentoMedioProjetado,
      metasProximas: alertas.filter(a => a.tipo === 'meta_proxima').length,
      oportunidadesIdentificadas: alertas.length,
      pontuacaoGeral: Math.min(100, (historico.length * 10) + (sugestoes.filter(s => s.aplicada).length * 20))
    }
  };
};

// Sistema de conquistas
export const verificarConquistas = (
  historico: HistoricoItem[],
  conquistasAtuais: ConquistaInsights[]
): ConquistaInsights[] => {
  const novasConquistas: ConquistaInsights[] = [];
  
  // Conquista: Primeira simulação
  if (historico.length >= 1 && !conquistasAtuais.find(c => c.id === 'primeira_simulacao')) {
    novasConquistas.push({
      id: 'primeira_simulacao',
      nome: 'Primeiro Passo',
      descricao: 'Criou sua primeira simulação',
      icone: '🎯',
      categoria: 'simulacoes',
      criterio: { minSimulacoes: 1 },
      recompensa: { pontos: 10 },
      desbloqueada: true,
      dataDesbloqueio: new Date()
    });
  }

  // Conquista: 10 simulações
  if (historico.length >= 10 && !conquistasAtuais.find(c => c.id === 'dez_simulacoes')) {
    novasConquistas.push({
      id: 'dez_simulacoes',
      nome: 'Explorador',
      descricao: 'Criou 10 simulações',
      icone: '🔍',
      categoria: 'simulacoes',
      criterio: { minSimulacoes: 10 },
      recompensa: { pontos: 50 },
      desbloqueada: true,
      dataDesbloqueio: new Date()
    });
  }

  // Conquista: Consistência (5 simulações em 5 dias consecutivos)
  const ultimasSemana = historico.filter(h => {
    const agora = new Date();
    const setesDiasAtras = new Date(agora.getTime() - 7 * 24 * 60 * 60 * 1000);
    return h.dataCreacao >= setesDiasAtras;
  });

  if (ultimasSemana.length >= 5 && !conquistasAtuais.find(c => c.id === 'consistencia_semanal')) {
    novasConquistas.push({
      id: 'consistencia_semanal',
      nome: 'Consistente',
      descricao: 'Criou simulações por 5 dias na última semana',
      icone: '📈',
      categoria: 'consistencia',
      criterio: { simulacoesPorSemana: 5 },
      recompensa: { pontos: 100 },
      desbloqueada: true,
      dataDesbloqueio: new Date()
    });
  }

  return novasConquistas;
};

// Calcular pontuação do usuário
export const calcularPontuacaoUsuario = (
  historico: HistoricoItem[],
  conquistas: ConquistaInsights[]
): PontuacaoUsuario => {
  const pontosConquistas = conquistas
    .filter(c => c.desbloqueada)
    .reduce((sum, c) => sum + c.recompensa.pontos, 0);

  const pontosSimulacoes = historico.length * 5;
  const pontosConsistencia = Math.min(100, historico.length * 2);
  
  const total = pontosConquistas + pontosSimulacoes + pontosConsistencia;
  const nivel = Math.floor(total / 100) + 1;

  return {
    total,
    categorias: {
      planejamento: pontosSimulacoes,
      consistencia: pontosConsistencia,
      otimizacao: pontosConquistas,
      diversificacao: 0 // Placeholder
    },
    nivel,
    proximoNivel: {
      pontosNecessarios: (nivel * 100) - total,
      beneficios: ['Novas funcionalidades desbloqueadas', 'Análises mais detalhadas']
    },
    conquistas
  };
};