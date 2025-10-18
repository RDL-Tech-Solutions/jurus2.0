import { useState, useEffect, useMemo } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { SimulacaoInput } from '../types';

export interface CenarioEconomico {
  id: string;
  nome: string;
  descricao: string;
  parametros: {
    inflacao: number;
    cdi: number;
    selic: number;
    crescimentoPIB: number;
    volatilidade: number;
  };
  probabilidade: number;
  impacto: 'positivo' | 'negativo' | 'neutro';
  cor: string;
}

export interface ResultadoCenario {
  cenario: CenarioEconomico;
  valorFinal: number;
  rendimentoReal: number;
  perdaPoder: number;
  risco: number;
  recomendacao: string;
}

export interface StressTesting {
  cenarioOtimista: ResultadoCenario;
  cenarioRealista: ResultadoCenario;
  cenarioPessimista: ResultadoCenario;
  worstCase: ResultadoCenario;
  bestCase: ResultadoCenario;
}

export const useSimuladorCenarios = (simulacao: SimulacaoInput) => {
  const [cenarios, setCenarios] = useState<CenarioEconomico[]>([]);
  const [resultados, setResultados] = useState<ResultadoCenario[]>([]);
  const [stressTesting, setStressTesting] = useState<StressTesting | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [cenarioSelecionado, setCenarioSelecionado] = useState<string>('');

  const [configuracoes, setConfiguracoes] = useLocalStorage('cenarios-config', {
    incluirInflacao: true,
    incluirVolatilidade: true,
    periodoAnalise: 12,
    nivelConfianca: 95
  });

  // Cenários pré-definidos
  const cenariosBase: CenarioEconomico[] = [
    {
      id: 'otimista',
      nome: 'Cenário Otimista',
      descricao: 'Economia em crescimento, inflação controlada',
      parametros: {
        inflacao: 3.5,
        cdi: 12.0,
        selic: 12.0,
        crescimentoPIB: 3.0,
        volatilidade: 8.0
      },
      probabilidade: 25,
      impacto: 'positivo',
      cor: '#10B981'
    },
    {
      id: 'realista',
      nome: 'Cenário Realista',
      descricao: 'Condições econômicas atuais mantidas',
      parametros: {
        inflacao: 4.5,
        cdi: 13.75,
        selic: 13.75,
        crescimentoPIB: 1.5,
        volatilidade: 12.0
      },
      probabilidade: 50,
      impacto: 'neutro',
      cor: '#3B82F6'
    },
    {
      id: 'pessimista',
      nome: 'Cenário Pessimista',
      descricao: 'Recessão econômica, alta inflação',
      parametros: {
        inflacao: 7.0,
        cdi: 15.0,
        selic: 15.0,
        crescimentoPIB: -1.0,
        volatilidade: 18.0
      },
      probabilidade: 20,
      impacto: 'negativo',
      cor: '#F59E0B'
    },
    {
      id: 'crise',
      nome: 'Crise Severa',
      descricao: 'Crise econômica profunda, hiperinflação',
      parametros: {
        inflacao: 12.0,
        cdi: 20.0,
        selic: 20.0,
        crescimentoPIB: -3.0,
        volatilidade: 25.0
      },
      probabilidade: 5,
      impacto: 'negativo',
      cor: '#EF4444'
    },
    {
      id: 'boom',
      nome: 'Boom Econômico',
      descricao: 'Crescimento acelerado, mercado aquecido',
      parametros: {
        inflacao: 2.5,
        cdi: 10.0,
        selic: 10.0,
        crescimentoPIB: 5.0,
        volatilidade: 15.0
      },
      probabilidade: 10,
      impacto: 'positivo',
      cor: '#8B5CF6'
    }
  ];

  // Calcular resultado para um cenário específico
  const calcularResultadoCenario = (cenario: CenarioEconomico): ResultadoCenario => {
    const { valorInicial, valorMensal, periodo } = simulacao;
    const { inflacao, cdi, volatilidade } = cenario.parametros;
    
    // Taxa real ajustada pela inflação
    const taxaReal = ((1 + cdi/100) / (1 + inflacao/100) - 1) * 100;
    
    // Calcular valor final com volatilidade
    let valorFinal = valorInicial;
    let totalAportes = 0;
    
    for (let mes = 1; mes <= periodo; mes++) {
      // Adicionar aporte mensal
      valorFinal += valorMensal;
      totalAportes += valorMensal;
      
      // Aplicar rendimento com volatilidade
      const rendimentoMes = (cdi/100) / 12;
      const volatilidade_mes = (volatilidade/100) / Math.sqrt(12);
      const fatorVolatilidade = 1 + (Math.random() - 0.5) * volatilidade_mes;
      
      valorFinal *= (1 + rendimentoMes * fatorVolatilidade);
    }
    
    const totalInvestido = valorInicial + totalAportes;
    const rendimentoReal = ((valorFinal - totalInvestido) / totalInvestido) * 100;
    
    // Calcular perda de poder de compra
    const valorFinalReal = valorFinal / Math.pow(1 + inflacao/100, periodo/12);
    const perdaPoder = ((valorFinal - valorFinalReal) / valorFinal) * 100;
    
    // Calcular risco (baseado na volatilidade e cenário)
    const risco = volatilidade * (cenario.impacto === 'negativo' ? 1.5 : cenario.impacto === 'positivo' ? 0.8 : 1);
    
    // Gerar recomendação
    let recomendacao = '';
    if (rendimentoReal > 10) {
      recomendacao = 'Excelente oportunidade de investimento';
    } else if (rendimentoReal > 5) {
      recomendacao = 'Boa rentabilidade esperada';
    } else if (rendimentoReal > 0) {
      recomendacao = 'Rentabilidade moderada, considere diversificar';
    } else {
      recomendacao = 'Alto risco, considere investimentos mais conservadores';
    }
    
    return {
      cenario,
      valorFinal,
      rendimentoReal,
      perdaPoder,
      risco,
      recomendacao
    };
  };

  // Executar stress testing
  const executarStressTesting = (): StressTesting => {
    const resultados = cenariosBase.map(calcularResultadoCenario);
    
    const otimista = resultados.find(r => r.cenario.id === 'otimista')!;
    const realista = resultados.find(r => r.cenario.id === 'realista')!;
    const pessimista = resultados.find(r => r.cenario.id === 'pessimista')!;
    
    // Worst case: cenário mais extremo negativo
    const worstCase = resultados.reduce((worst, current) => 
      current.valorFinal < worst.valorFinal ? current : worst
    );
    
    // Best case: cenário mais extremo positivo
    const bestCase = resultados.reduce((best, current) => 
      current.valorFinal > best.valorFinal ? current : best
    );
    
    return {
      cenarioOtimista: otimista,
      cenarioRealista: realista,
      cenarioPessimista: pessimista,
      worstCase,
      bestCase
    };
  };

  // Simular todos os cenários
  const simularCenarios = async () => {
    setIsLoading(true);
    
    try {
      // Simular delay de processamento
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const resultadosCalculados = cenariosBase.map(calcularResultadoCenario);
      const stressTest = executarStressTesting();
      
      setResultados(resultadosCalculados);
      setStressTesting(stressTest);
      setCenarios(cenariosBase);
      
      if (!cenarioSelecionado && resultadosCalculados.length > 0) {
        setCenarioSelecionado(resultadosCalculados[1].cenario.id); // Cenário realista como padrão
      }
    } catch (error) {
      console.error('Erro ao simular cenários:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Criar cenário personalizado
  const criarCenarioPersonalizado = (
    nome: string,
    parametros: CenarioEconomico['parametros']
  ) => {
    const novoCenario: CenarioEconomico = {
      id: `custom-${Date.now()}`,
      nome,
      descricao: 'Cenário personalizado',
      parametros,
      probabilidade: 0,
      impacto: 'neutro',
      cor: '#6B7280'
    };
    
    const resultado = calcularResultadoCenario(novoCenario);
    
    setCenarios(prev => [...prev, novoCenario]);
    setResultados(prev => [...prev, resultado]);
    
    return resultado;
  };

  // Métricas calculadas
  const metricas = useMemo(() => {
    if (resultados.length === 0) return null;
    
    const valores = resultados.map(r => r.valorFinal);
    const rendimentos = resultados.map(r => r.rendimentoReal);
    
    const valorMedio = valores.reduce((a, b) => a + b, 0) / valores.length;
    const rendimentoMedio = rendimentos.reduce((a, b) => a + b, 0) / rendimentos.length;
    
    const valorMinimo = Math.min(...valores);
    const valorMaximo = Math.max(...valores);
    
    const desvio = Math.sqrt(
      valores.reduce((acc, val) => acc + Math.pow(val - valorMedio, 2), 0) / valores.length
    );
    
    const probabilidadePerda = resultados.filter(r => r.rendimentoReal < 0).length / resultados.length * 100;
    
    return {
      valorMedio,
      rendimentoMedio,
      valorMinimo,
      valorMaximo,
      desvio,
      probabilidadePerda,
      melhorCenario: resultados.find(r => r.valorFinal === valorMaximo)?.cenario.nome || '',
      piorCenario: resultados.find(r => r.valorFinal === valorMinimo)?.cenario.nome || ''
    };
  }, [resultados]);

  // Carregar cenários iniciais
  useEffect(() => {
    simularCenarios();
  }, [simulacao.valorInicial, simulacao.valorMensal, simulacao.periodo]);

  return {
    cenarios,
    resultados,
    stressTesting,
    metricas,
    isLoading,
    cenarioSelecionado,
    configuracoes,
    setCenarioSelecionado,
    setConfiguracoes,
    simularCenarios,
    criarCenarioPersonalizado
  };
};