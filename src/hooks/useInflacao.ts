import { useMemo } from 'react';

export interface DadosInflacao {
  valorNominal: number;
  valorReal: number;
  perda: number;
  percentualPerda: number;
  mes: number;
}

export interface ResultadoInflacao {
  valorFinalNominal: number;
  valorFinalReal: number;
  perdaInflacao: number;
  percentualPerdaTotal: number;
  evolucaoMensal: DadosInflacao[];
  poderCompraInicial: number;
  poderCompraFinal: number;
}

export interface ParametrosInflacao {
  valorInicial: number;
  valorMensal: number;
  periodo: number;
  taxaJuros: number;
  taxaInflacao: number;
}

export const useInflacao = (parametros: ParametrosInflacao): ResultadoInflacao => {
  return useMemo(() => {
    const { valorInicial, valorMensal, periodo, taxaJuros, taxaInflacao } = parametros;
    
    if (!valorInicial || !periodo || taxaJuros < 0 || taxaInflacao < 0) {
      return {
        valorFinalNominal: 0,
        valorFinalReal: 0,
        perdaInflacao: 0,
        percentualPerdaTotal: 0,
        evolucaoMensal: [],
        poderCompraInicial: valorInicial,
        poderCompraFinal: 0
      };
    }

    const taxaJurosMensal = taxaJuros / 100 / 12;
    const taxaInflacaoMensal = taxaInflacao / 100 / 12;
    const taxaRealMensal = ((1 + taxaJurosMensal) / (1 + taxaInflacaoMensal)) - 1;
    
    let saldoNominal = valorInicial;
    let saldoReal = valorInicial;
    let inflacaoAcumulada = 1;
    
    const evolucaoMensal: DadosInflacao[] = [];
    
    // Mês 0 (inicial)
    evolucaoMensal.push({
      valorNominal: saldoNominal,
      valorReal: saldoReal,
      perda: 0,
      percentualPerda: 0,
      mes: 0
    });
    
    for (let mes = 1; mes <= periodo; mes++) {
      // Aplicar juros compostos no valor nominal
      saldoNominal = saldoNominal * (1 + taxaJurosMensal) + valorMensal;
      
      // Aplicar taxa real no valor real
      saldoReal = saldoReal * (1 + taxaRealMensal) + valorMensal;
      
      // Calcular inflação acumulada
      inflacaoAcumulada *= (1 + taxaInflacaoMensal);
      
      // Calcular valor real baseado na inflação
      const valorRealPorInflacao = saldoNominal / inflacaoAcumulada;
      
      // Calcular perda por inflação
      const perda = saldoNominal - valorRealPorInflacao;
      const percentualPerda = (perda / saldoNominal) * 100;
      
      evolucaoMensal.push({
        valorNominal: saldoNominal,
        valorReal: valorRealPorInflacao,
        perda,
        percentualPerda,
        mes
      });
    }
    
    const valorFinalNominal = saldoNominal;
    const valorFinalReal = saldoNominal / inflacaoAcumulada;
    const perdaInflacao = valorFinalNominal - valorFinalReal;
    const percentualPerdaTotal = (perdaInflacao / valorFinalNominal) * 100;
    
    // Calcular poder de compra
    const poderCompraInicial = valorInicial;
    const poderCompraFinal = valorFinalReal;
    
    return {
      valorFinalNominal,
      valorFinalReal,
      perdaInflacao,
      percentualPerdaTotal,
      evolucaoMensal,
      poderCompraInicial,
      poderCompraFinal
    };
  }, [parametros.valorInicial, parametros.valorMensal, parametros.periodo, parametros.taxaJuros, parametros.taxaInflacao]);
};

// Hook para comparar cenários com e sem inflação
export const useComparacaoInflacao = (parametros: ParametrosInflacao) => {
  const comInflacao = useInflacao(parametros);
  const semInflacao = useInflacao({ ...parametros, taxaInflacao: 0 });
  
  return useMemo(() => ({
    comInflacao,
    semInflacao,
    diferencaAbsoluta: semInflacao.valorFinalNominal - comInflacao.valorFinalReal,
    diferencaPercentual: ((semInflacao.valorFinalNominal - comInflacao.valorFinalReal) / semInflacao.valorFinalNominal) * 100,
    impactoInflacao: {
      valorPerdido: comInflacao.perdaInflacao,
      percentualImpacto: comInflacao.percentualPerdaTotal,
      mesesParaRecuperar: Math.ceil(comInflacao.perdaInflacao / (parametros.valorMensal || 1))
    }
  }), [comInflacao, semInflacao, parametros.valorMensal]);
};