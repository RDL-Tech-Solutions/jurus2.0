import { useMemo, useState, useEffect } from 'react';
import { SimulacaoInput, ResultadoSimulacao } from '../types';
import { calcularJurosCompostos } from '../utils/calculations';
import { useSimulationLoading } from './useLoadingStates';

// Hook para cálculos de juros compostos
export function useJurosCompostos(input: SimulacaoInput): ResultadoSimulacao & { isCalculating: boolean } {
  const { startSimulation, stopSimulation, isLoading, getLoadingState } = useSimulationLoading();
  const [resultado, setResultado] = useState<ResultadoSimulacao | null>(null);
  const calculatedResult = useMemo(() => {
    // Validar se os dados de entrada são válidos
    if (!input.valorInicial && !input.valorMensal) {
      return {
        totalInvestido: 0,
        totalJuros: 0,
        valorFinal: 0,
        ganhoDiario: 0,
        ganhoMensal: 0,
        ganhoAnual: 0,
        evolucaoMensal: [],
        taxaEfetivaMensal: 0,
        taxaEfetivaDiaria: 0,
        rentabilidadeTotal: 0,
        // Campos de inflação
        saldoFinalReal: undefined,
        totalJurosReais: undefined,
        rentabilidadeReal: undefined,
        taxaRealAnual: undefined,
        perdaTotalInflacao: undefined
      };
    }

    if (input.periodo <= 0) {
      return {
        totalInvestido: input.valorInicial,
        totalJuros: 0,
        valorFinal: input.valorInicial,
        ganhoDiario: 0,
        ganhoMensal: 0,
        ganhoAnual: 0,
        evolucaoMensal: [],
        taxaEfetivaMensal: 0,
        taxaEfetivaDiaria: 0,
        rentabilidadeTotal: 0,
        // Campos de inflação
        saldoFinalReal: undefined,
        totalJurosReais: undefined,
        rentabilidadeReal: undefined,
        taxaRealAnual: undefined,
        perdaTotalInflacao: undefined
      };
    }

    return calcularJurosCompostos(input);
  }, [
    input.valorInicial,
    input.valorMensal,
    input.taxaType,
    input.modalidade?.id,
    input.cdiAtual,
    input.percentualCdi,
    input.taxaPersonalizada,
    input.periodo,
    input.unidadePeriodo,
    // Novos campos de inflação
    input.considerarInflacao,
    input.taxaInflacao,
    input.tipoInflacao,
    // Campos de bancos digitais
    input.bancoDigitalId,
    input.modalidadeBancoId
  ]);

  // Simular loading para cálculos complexos
  useEffect(() => {
    const shouldShowLoading = input.periodo > 120 || (input.valorInicial + input.valorMensal * input.periodo) > 1000000;
    
    if (shouldShowLoading) {
      startSimulation('calculo-principal');
      
      // Simular processamento assíncrono
      setTimeout(() => {
        setResultado(calculatedResult);
        stopSimulation('calculo-principal');
      }, 500);
    } else {
      setResultado(calculatedResult);
    }
  }, [calculatedResult, input.periodo, input.valorInicial, input.valorMensal, startSimulation, stopSimulation]);

  const isCalculating = getLoadingState('calculo-principal');
  
  return {
    ...(resultado || calculatedResult),
    isCalculating
  };
}