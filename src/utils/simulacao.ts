/**
 * Simulation utilities for financial calculations
 */

import { SimulacaoParametros, ResultadoSimulacao } from '../types/simulacao';

export const simularInvestimento = (parametros: SimulacaoParametros): ResultadoSimulacao => {
  const { valorInicial, valorMensal, taxa, periodo, tipoTaxa } = parametros;
  
  // Convert annual rate to monthly if needed
  const taxaMensal = tipoTaxa === 'anual' ? taxa / 12 / 100 : taxa / 100;
  
  let valorAcumulado = valorInicial;
  let totalInvestido = valorInicial;
  const evolucaoMensal = [];
  
  for (let mes = 1; mes <= periodo; mes++) {
    // Add monthly contribution
    valorAcumulado += valorMensal || 0;
    totalInvestido += valorMensal || 0;
    
    // Apply interest
    valorAcumulado *= (1 + taxaMensal);
    
    const juros = valorAcumulado - totalInvestido;
    
    evolucaoMensal.push({
      mes,
      contribuicao: valorMensal || 0,
      juros: juros - (evolucaoMensal[mes - 2]?.juros || 0),
      saldoAcumulado: valorAcumulado,
      valorInvestido: totalInvestido,
      valorAcumulado
    });
  }
  
  const totalJuros = valorAcumulado - totalInvestido;
  
  return {
    valorFinal: valorAcumulado,
    saldoFinal: valorAcumulado, // Alias para valorFinal
    totalInvestido,
    totalJuros,
    rendimentoTotal: totalJuros, // Alias para totalJuros
    jurosGanhos: totalJuros, // Alias para totalJuros
    evolucaoMensal
  };
};

export const calcularTaxaNecessaria = (
  valorInicial: number,
  valorMensal: number,
  valorMeta: number,
  periodo: number
): number => {
  // Binary search to find the required rate
  let taxaMin = 0;
  let taxaMax = 1; // 100% monthly
  let taxa = 0.1; // Start with 10%
  
  for (let i = 0; i < 100; i++) {
    const resultado = simularInvestimento({
      valorInicial,
      valorMensal,
      taxa: taxa * 100,
      periodo,
      tipoTaxa: 'mensal'
    });
    
    if (Math.abs(resultado.valorFinal - valorMeta) < 1) {
      break;
    }
    
    if (resultado.valorFinal < valorMeta) {
      taxaMin = taxa;
    } else {
      taxaMax = taxa;
    }
    
    taxa = (taxaMin + taxaMax) / 2;
  }
  
  return taxa * 100; // Return as percentage
};

export const calcularTempoNecessario = (
  valorInicial: number,
  valorMensal: number,
  valorMeta: number,
  taxa: number,
  tipoTaxa: 'mensal' | 'anual' = 'anual'
): number => {
  const taxaMensal = tipoTaxa === 'anual' ? taxa / 12 / 100 : taxa / 100;
  
  let valorAcumulado = valorInicial;
  let mes = 0;
  
  while (valorAcumulado < valorMeta && mes < 1200) { // Max 100 years
    mes++;
    valorAcumulado += valorMensal;
    valorAcumulado *= (1 + taxaMensal);
  }
  
  return mes;
};