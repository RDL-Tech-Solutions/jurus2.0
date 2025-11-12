// Funções utilitárias para educação financeira

import { SimuladorConfig, PieChartData, MetodoPlanejamento, METODOS_PLANEJAMENTO } from '../types/educacaoFinanceira';

// Função para calcular divisão baseada no método selecionado
export function calcularDivisaoPorMetodo(
  rendaMensal: number,
  metodo: MetodoPlanejamento,
  configPersonalizada?: Partial<SimuladorConfig>
): {
  necessidades: number;
  desejos: number;
  poupanca: number;
  metodoInfo: typeof METODOS_PLANEJAMENTO[MetodoPlanejamento];
} {
  const metodoInfo = METODOS_PLANEJAMENTO[metodo];

  let necessidades: number;
  let desejos: number;
  let poupanca: number;

  if (metodo === 'personalizado' && configPersonalizada) {
    necessidades = configPersonalizada.necessidades || metodoInfo.necessidades;
    desejos = configPersonalizada.desejos || metodoInfo.desejos;
    poupanca = configPersonalizada.poupanca || metodoInfo.poupanca;
  } else {
    necessidades = metodoInfo.necessidades;
    desejos = metodoInfo.desejos;
    poupanca = metodoInfo.poupanca;
  }

  return {
    necessidades: rendaMensal * (necessidades / 100),
    desejos: rendaMensal * (desejos / 100),
    poupanca: rendaMensal * (poupanca / 100),
    metodoInfo,
  };
}

// Função para gerar dados do gráfico de pizza para qualquer método
export function gerarDadosGraficoPizzaPorMetodo(
  rendaMensal: number,
  metodo: MetodoPlanejamento,
  configPersonalizada?: Partial<SimuladorConfig>
): PieChartData[] {
  const divisao = calcularDivisaoPorMetodo(rendaMensal, metodo, configPersonalizada);
  const total = divisao.necessidades + divisao.desejos + divisao.poupanca;

  const dados: PieChartData[] = [];

  if (divisao.necessidades > 0) {
    dados.push({
      name: 'Necessidades',
      value: divisao.necessidades,
      percentage: (divisao.necessidades / total) * 100,
      color: '#ef4444', // red-500
    });
  }

  if (divisao.desejos > 0) {
    dados.push({
      name: 'Desejos',
      value: divisao.desejos,
      percentage: (divisao.desejos / total) * 100,
      color: '#f59e0b', // amber-500
    });
  }

  if (divisao.poupanca > 0) {
    dados.push({
      name: 'Poupança/Investimentos',
      value: divisao.poupanca,
      percentage: (divisao.poupanca / total) * 100,
      color: '#10b981', // emerald-500
    });
  }

  return dados;
}

// Função para validar configuração de planejamento
export function validarConfiguracaoPlanejamento(config: {
  metodo: MetodoPlanejamento;
  necessidades: number;
  desejos: number;
  poupanca: number;
}): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  const total = config.necessidades + config.desejos + config.poupanca;

  if (Math.abs(total - 100) > 0.01) {
    errors.push('A soma das porcentagens deve ser igual a 100%');
  }

  if (config.necessidades < 0 || config.necessidades > 100) {
    errors.push('Necessidades deve estar entre 0% e 100%');
  }

  if (config.desejos < 0 || config.desejos > 100) {
    errors.push('Desejos deve estar entre 0% e 100%');
  }

  if (config.poupanca < 0 || config.poupanca > 100) {
    errors.push('Poupança deve estar entre 0% e 100%');
  }

  // Validações específicas por método
  if (config.metodo !== 'personalizado') {
    const metodoInfo = METODOS_PLANEJAMENTO[config.metodo];
    if (config.necessidades !== metodoInfo.necessidades ||
        config.desejos !== metodoInfo.desejos ||
        config.poupanca !== metodoInfo.poupanca) {
      errors.push(`Para o método ${metodoInfo.nome}, use as porcentagens padrão ou selecione "Personalizado"`);
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

// Função para obter recomendações baseada no método selecionado
export function obterRecomendacoesPorMetodo(metodo: MetodoPlanejamento): string[] {
  const recomendacoes: Record<MetodoPlanejamento, string[]> = {
    '503020': [
      'Excelente escolha para começar! Este é o método mais recomendado.',
      'Priorize pagar dívidas com juros altos antes de aumentar a poupança.',
      'Aumente gradualmente a poupança conforme sua renda cresce.'
    ],
    '603010': [
      'Método conservador, ideal se você tem muitas despesas fixas.',
      'Considere reduzir gastos desnecessários para aumentar a poupança.',
      'Use a poupança para emergências e não para gastos impulsivos.'
    ],
    '702010': [
      'Equilibra necessidades básicas com qualidade de vida.',
      'A poupança reduzida pode ser compensada com investimentos.',
      'Mantenha controle rigoroso dos gastos para não ultrapassar limites.'
    ],
    '802000': [
      'Método para quem prioriza viver bem no presente.',
      'Considere aumentar a poupança gradualmente.',
      'Invista em ativos de renda variável para compensar a baixa poupança.'
    ],
    'pay_yourself_first': [
      'Excelente mentalidade! A poupança vem antes dos gastos.',
      'Use a poupança para investir e gerar renda passiva.',
      'Automatize suas transferências de poupança no início do mês.'
    ],
    'personalizado': [
      'Adapte às suas necessidades específicas.',
      'Certifique-se de que a soma seja 100%.',
      'Reavalie periodicamente se as porcentagens ainda fazem sentido.'
    ]
  };

  return recomendacoes[metodo] || [];
}

// Função para calcular a divisão 50-30-20 (mantida para compatibilidade)
export function calcularDivisao5030(rendaMensal: number, config: SimuladorConfig) {
  const { necessidades, desejos, poupanca } = config;

  const necessidadesValor = rendaMensal * (necessidades / 100);
  const desejosValor = rendaMensal * (desejos / 100);
  const poupancaValor = rendaMensal * (poupanca / 100);

  return {
    necessidades: necessidadesValor,
    desejos: desejosValor,
    poupanca: poupancaValor,
  };
}

// Função para gerar dados do gráfico de pizza (mantida para compatibilidade)
export function gerarDadosGraficoPizza(rendaMensal: number, config: SimuladorConfig): PieChartData[] {
  const divisao = calcularDivisao5030(rendaMensal, config);
  const total = divisao.necessidades + divisao.desejos + divisao.poupanca;

  return [
    {
      name: 'Necessidades',
      value: divisao.necessidades,
      percentage: (divisao.necessidades / total) * 100,
      color: '#ef4444', // red-500
    },
    {
      name: 'Desejos',
      value: divisao.desejos,
      percentage: (divisao.desejos / total) * 100,
      color: '#f59e0b', // amber-500
    },
    {
      name: 'Poupança',
      value: divisao.poupanca,
      percentage: (divisao.poupanca / total) * 100,
      color: '#10b981', // emerald-500
    },
  ];
}

// Função para validar configuração do simulador (mantida para compatibilidade)
export function validarConfigSimulador(config: SimuladorConfig): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  const total = config.necessidades + config.desejos + config.poupanca;

  if (Math.abs(total - 100) > 0.01) {
    errors.push('A soma das porcentagens deve ser igual a 100%');
  }

  if (config.necessidades < 0 || config.necessidades > 100) {
    errors.push('Necessidades deve estar entre 0% e 100%');
  }

  if (config.desejos < 0 || config.desejos > 100) {
    errors.push('Desejos deve estar entre 0% e 100%');
  }

  if (config.poupanca < 0 || config.poupanca > 100) {
    errors.push('Poupança deve estar entre 0% e 100%');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

// Função para formatar moeda (simples)
export function formatarMoeda(valor: number, moeda: string = 'BRL'): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: moeda,
  }).format(valor);
}

// Função para calcular pontuação de quiz
export function calcularPontuacaoQuiz(
  respostasCorretas: number,
  totalPerguntas: number,
  tempoGasto: number,
  tempoLimite?: number
): number {
  const acertosPercentual = (respostasCorretas / totalPerguntas) * 100;

  // Bônus por velocidade se concluiu dentro do tempo limite
  let bonusVelocidade = 0;
  if (tempoLimite && tempoGasto <= tempoLimite * 60) { // tempoLimite em minutos
    const eficienciaTempo = 1 - (tempoGasto / (tempoLimite * 60));
    bonusVelocidade = eficienciaTempo * 10; // até 10 pontos bônus
  }

  return Math.min(acertosPercentual + bonusVelocidade, 100);
}

// Função para calcular XP ganho em uma atividade
export function calcularXPGanho(
  tipoAtividade: string,
  multiplicador: number = 1
): number {
  const XP_SYSTEM = {
    LESSON_COMPLETED: 10,
    QUIZ_PASSED: 25,
    STREAK_BONUS: 5,
    BADGE_UNLOCKED: 50,
    ACHIEVEMENT_COMPLETED: 100,
    PERFECT_QUIZ: 50,
  };
  return (XP_SYSTEM as any)[tipoAtividade] * multiplicador || 0;
}

// Função para determinar nível baseado no XP total
export function determinarNivel(xpTotal: number): number {
  // Sistema de níveis exponencial
  return Math.floor(Math.sqrt(xpTotal / 100)) + 1;
}

// Função para calcular progresso para próximo nível
export function calcularProgressoNivel(xpTotal: number): {
  nivelAtual: number;
  xpParaProximoNivel: number;
  progressoPercentual: number;
} {
  const nivelAtual = determinarNivel(xpTotal);
  const xpNivelAtual = Math.pow(nivelAtual - 1, 2) * 100;
  const xpProximoNivel = Math.pow(nivelAtual, 2) * 100;
  const xpParaProximoNivel = xpProximoNivel - xpTotal;
  const progressoPercentual = ((xpTotal - xpNivelAtual) / (xpProximoNivel - xpNivelAtual)) * 100;

  return {
    nivelAtual,
    xpParaProximoNivel,
    progressoPercentual,
  };
}
