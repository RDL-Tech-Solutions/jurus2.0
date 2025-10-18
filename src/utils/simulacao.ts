/**
 * Simulation utilities for financial calculations
 */

export interface SimulacaoParametros {
  valorInicial: number;
  valorMensal: number;
  taxa: number;
  periodo: number;
  tipoTaxa: 'mensal' | 'anual';
}

export interface ResultadoSimulacao {
  valorFinal: number;
  totalInvestido: number;
  totalJuros: number;
  evolucaoMensal: Array<{
    mes: number;
    valorInvestido: number;
    valorAcumulado: number;
    juros: number;
  }>;
}

export const simularInvestimento = (parametros: SimulacaoParametros): ResultadoSimulacao => {
  const { valorInicial, valorMensal, taxa, periodo, tipoTaxa } = parametros;
  
  // Convert annual rate to monthly if needed
  const taxaMensal = tipoTaxa === 'anual' ? taxa / 12 / 100 : taxa / 100;
  
  let valorAcumulado = valorInicial;
  let totalInvestido = valorInicial;
  const evolucaoMensal = [];
  
  for (let mes = 1; mes <= periodo; mes++) {
    // Add monthly contribution
    valorAcumulado += valorMensal;
    totalInvestido += valorMensal;
    
    // Apply interest
    valorAcumulado *= (1 + taxaMensal);
    
    const juros = valorAcumulado - totalInvestido;
    
    evolucaoMensal.push({
      mes,
      valorInvestido: totalInvestido,
      valorAcumulado,
      juros
    });
  }
  
  return {
    valorFinal: valorAcumulado,
    totalInvestido,
    totalJuros: valorAcumulado - totalInvestido,
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