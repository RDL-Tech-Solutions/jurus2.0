import { useMemo } from 'react';
import { SimulacaoInput, ResultadoSimulacao } from '../types';
import { useJurosCompostos } from './useJurosCompostos';

export interface CenarioAnalise {
  nome: string;
  descricao: string;
  cor: string;
  simulacao: SimulacaoInput;
  resultado: ResultadoSimulacao;
  probabilidade: number; // 0-100
  variacao: {
    taxa: number; // variação percentual da taxa
    inflacao?: number; // variação da inflação
    aportes?: number; // variação dos aportes
  };
}

export interface ParametrosCenarios {
  simulacaoBase: SimulacaoInput;
  variacaoTaxa: {
    otimista: number; // +20% por exemplo
    pessimista: number; // -30% por exemplo
  };
  variacaoInflacao?: {
    otimista: number;
    pessimista: number;
  };
  variacaoAportes?: {
    otimista: number;
    pessimista: number;
  };
}

export const useAnalisesCenarios = (parametros: ParametrosCenarios) => {
  const { simulacaoBase, variacaoTaxa, variacaoInflacao, variacaoAportes } = parametros;

  // Cenário Realista (base)
  const cenarioRealista = useJurosCompostos(simulacaoBase);

  // Cenário Otimista
  const simulacaoOtimista: SimulacaoInput = useMemo(() => {
    const taxaBase = simulacaoBase.modalidade?.taxaAnual || 0;
    const novaModalidade = simulacaoBase.modalidade ? {
      ...simulacaoBase.modalidade,
      taxaAnual: taxaBase * (1 + variacaoTaxa.otimista / 100)
    } : undefined;

    return {
      ...simulacaoBase,
      modalidade: novaModalidade,
      valorMensal: variacaoAportes 
        ? simulacaoBase.valorMensal * (1 + variacaoAportes.otimista / 100)
        : simulacaoBase.valorMensal,
      taxaInflacao: variacaoInflacao
        ? (simulacaoBase.taxaInflacao || 4.5) * (1 + variacaoInflacao.otimista / 100)
        : simulacaoBase.taxaInflacao
    };
  }, [simulacaoBase, variacaoTaxa.otimista, variacaoInflacao, variacaoAportes]);

  const cenarioOtimista = useJurosCompostos(simulacaoOtimista);

  // Cenário Pessimista
  const simulacaoPessimista: SimulacaoInput = useMemo(() => {
    const taxaBase = simulacaoBase.modalidade?.taxaAnual || 0;
    const novaModalidade = simulacaoBase.modalidade ? {
      ...simulacaoBase.modalidade,
      taxaAnual: Math.max(0.1, taxaBase * (1 + variacaoTaxa.pessimista / 100))
    } : undefined;

    return {
      ...simulacaoBase,
      modalidade: novaModalidade,
      valorMensal: variacaoAportes 
        ? Math.max(0, simulacaoBase.valorMensal * (1 + variacaoAportes.pessimista / 100))
        : simulacaoBase.valorMensal,
      taxaInflacao: variacaoInflacao
        ? Math.max(0, (simulacaoBase.taxaInflacao || 4.5) * (1 + variacaoInflacao.pessimista / 100))
        : simulacaoBase.taxaInflacao
    };
  }, [simulacaoBase, variacaoTaxa.pessimista, variacaoInflacao, variacaoAportes]);

  const cenarioPessimista = useJurosCompostos(simulacaoPessimista);

  // Cenários organizados
  const cenarios: CenarioAnalise[] = useMemo(() => [
    {
      nome: 'Pessimista',
      descricao: 'Cenário com condições desfavoráveis de mercado',
      cor: '#ef4444', // red-500
      simulacao: simulacaoPessimista,
      resultado: cenarioPessimista,
      probabilidade: 20,
      variacao: {
        taxa: variacaoTaxa.pessimista,
        inflacao: variacaoInflacao?.pessimista,
        aportes: variacaoAportes?.pessimista
      }
    },
    {
      nome: 'Realista',
      descricao: 'Cenário baseado nas condições atuais do mercado',
      cor: '#3b82f6', // blue-500
      simulacao: simulacaoBase,
      resultado: cenarioRealista,
      probabilidade: 60,
      variacao: {
        taxa: 0,
        inflacao: 0,
        aportes: 0
      }
    },
    {
      nome: 'Otimista',
      descricao: 'Cenário com condições favoráveis de mercado',
      cor: '#10b981', // emerald-500
      simulacao: simulacaoOtimista,
      resultado: cenarioOtimista,
      probabilidade: 20,
      variacao: {
        taxa: variacaoTaxa.otimista,
        inflacao: variacaoInflacao?.otimista,
        aportes: variacaoAportes?.otimista
      }
    }
  ], [
    simulacaoBase, simulacaoOtimista, simulacaoPessimista,
    cenarioRealista, cenarioOtimista, cenarioPessimista,
    variacaoTaxa, variacaoInflacao, variacaoAportes
  ]);

  // Estatísticas dos cenários
  const estatisticas = useMemo(() => {
    const valores = cenarios.map(c => c.resultado.saldoFinal);
    const valorMinimo = Math.min(...valores);
    const valorMaximo = Math.max(...valores);
    const valorMedio = valores.reduce((acc, val) => acc + val, 0) / valores.length;
    
    // Valor esperado ponderado pela probabilidade
    const valorEsperado = cenarios.reduce((acc, cenario) => 
      acc + (cenario.resultado.saldoFinal * cenario.probabilidade / 100), 0
    );

    // Desvio padrão
    const variancia = cenarios.reduce((acc, cenario) => 
      acc + Math.pow(cenario.resultado.saldoFinal - valorMedio, 2) * (cenario.probabilidade / 100), 0
    );
    const desvioPadrao = Math.sqrt(variancia);

    // Coeficiente de variação (risco relativo)
    const coeficienteVariacao = (desvioPadrao / valorEsperado) * 100;

    return {
      valorMinimo,
      valorMaximo,
      valorMedio,
      valorEsperado,
      desvioPadrao,
      coeficienteVariacao,
      amplitude: valorMaximo - valorMinimo,
      amplitudePercentual: ((valorMaximo - valorMinimo) / valorMedio) * 100
    };
  }, [cenarios]);

  // Análise de risco
  const analiseRisco = useMemo(() => {
    const { coeficienteVariacao, amplitudePercentual } = estatisticas;
    
    let nivelRisco: 'Baixo' | 'Moderado' | 'Alto' | 'Muito Alto';
    let corRisco: string;
    let descricaoRisco: string;

    if (coeficienteVariacao < 10) {
      nivelRisco = 'Baixo';
      corRisco = '#10b981'; // green
      descricaoRisco = 'Investimento com baixa volatilidade e resultados previsíveis';
    } else if (coeficienteVariacao < 25) {
      nivelRisco = 'Moderado';
      corRisco = '#f59e0b'; // yellow
      descricaoRisco = 'Investimento com volatilidade moderada';
    } else if (coeficienteVariacao < 50) {
      nivelRisco = 'Alto';
      corRisco = '#f97316'; // orange
      descricaoRisco = 'Investimento com alta volatilidade';
    } else {
      nivelRisco = 'Muito Alto';
      corRisco = '#ef4444'; // red
      descricaoRisco = 'Investimento com volatilidade muito alta e resultados imprevisíveis';
    }

    return {
      nivel: nivelRisco,
      cor: corRisco,
      descricao: descricaoRisco,
      coeficienteVariacao,
      amplitudePercentual
    };
  }, [estatisticas]);

  return {
    cenarios,
    estatisticas,
    analiseRisco,
    melhorCenario: cenarios.reduce((melhor, atual) => 
      atual.resultado.saldoFinal > melhor.resultado.saldoFinal ? atual : melhor
    ),
    piorCenario: cenarios.reduce((pior, atual) => 
      atual.resultado.saldoFinal < pior.resultado.saldoFinal ? atual : pior
    )
  };
};

// Hook para simulação Monte Carlo simplificada
export const useMonteCarloSimples = (
  simulacaoBase: SimulacaoInput, 
  numeroSimulacoes: number = 1000,
  volatilidade: number = 0.15 // 15% de volatilidade padrão
) => {
  return useMemo(() => {
    const resultados: number[] = [];
    const taxaBase = simulacaoBase.modalidade?.taxaAnual || 0;

    for (let i = 0; i < numeroSimulacoes; i++) {
      // Gerar variação aleatória baseada na distribuição normal
      const variacao = (Math.random() - 0.5) * 2 * volatilidade;
      const taxaSimulacao = Math.max(0.1, taxaBase * (1 + variacao));
      
      // Simular resultado com a taxa variada
      const simulacaoVariada: SimulacaoInput = {
        ...simulacaoBase,
        modalidade: simulacaoBase.modalidade ? {
          ...simulacaoBase.modalidade,
          taxaAnual: taxaSimulacao
        } : undefined
      };

      // Calcular resultado simplificado
      const taxaMensal = taxaSimulacao / 100 / 12;
      let saldo = simulacaoBase.valorInicial;
      
      for (let mes = 1; mes <= simulacaoBase.periodo; mes++) {
        saldo = saldo * (1 + taxaMensal) + simulacaoBase.valorMensal;
      }
      
      resultados.push(saldo);
    }

    resultados.sort((a, b) => a - b);

    const percentil = (p: number) => {
      const index = Math.floor((p / 100) * resultados.length);
      return resultados[index];
    };

    return {
      resultados,
      media: resultados.reduce((acc, val) => acc + val, 0) / resultados.length,
      mediana: percentil(50),
      percentil5: percentil(5),
      percentil25: percentil(25),
      percentil75: percentil(75),
      percentil95: percentil(95),
      minimo: resultados[0],
      maximo: resultados[resultados.length - 1],
      probabilidadePerda: (resultados.filter(r => r < simulacaoBase.valorInicial + (simulacaoBase.valorMensal * simulacaoBase.periodo)).length / resultados.length) * 100
    };
  }, [simulacaoBase, numeroSimulacoes, volatilidade]);
};