import { ResultadoSimulacao, ResultadoMensal } from '../types';
// Define PeriodoVisualizacao locally since the component doesn't exist
type PeriodoVisualizacao = 'mensal' | 'anual';

/**
 * Converte valores de resultado de simulação entre períodos mensal e anual
 */
export class PeriodoConversor {
  /**
   * Converte um valor numérico entre períodos
   */
  static converterValor(
    valor: number, 
    de: PeriodoVisualizacao, 
    para: PeriodoVisualizacao
  ): number {
    if (de === para) return valor;
    
    if (de === 'anual' && para === 'mensal') {
      return valor / 12;
    }
    
    if (de === 'mensal' && para === 'anual') {
      return valor * 12;
    }
    
    return valor;
  }

  /**
   * Converte resultado de simulação para o período especificado
   */
  static converterResultadoSimulacao(
    resultado: ResultadoSimulacao,
    periodo: PeriodoVisualizacao
  ): ResultadoSimulacao {
    if (periodo === 'anual') {
      // Valores já estão em base anual, retorna como está
      return resultado;
    }

    // Converte para mensal
    return {
      ...resultado,
      // Valores que devem ser convertidos para mensal
      ganhoDiario: resultado.ganhoDiario, // Mantém diário
      ganhoMensal: resultado.ganhoMensal, // Mantém mensal
      ganhoAnual: resultado.ganhoAnual / 12, // Converte anual para "mensal equivalente"
      
      // Valores totais permanecem iguais (são acumulados)
      totalInvestido: resultado.totalInvestido,
      totalJuros: resultado.totalJuros,
      valorFinal: resultado.valorFinal,
      saldoFinal: resultado.saldoFinal,
      rendimentoTotal: resultado.rendimentoTotal,
      jurosGanhos: resultado.jurosGanhos,
      
      // Taxas e percentuais permanecem iguais
      taxaEfetivaMensal: resultado.taxaEfetivaMensal,
      taxaEfetivaDiaria: resultado.taxaEfetivaDiaria,
      rentabilidadeTotal: resultado.rentabilidadeTotal,
      
      // Evolução mensal permanece igual
      evolucaoMensal: resultado.evolucaoMensal,
      
      // Campos de inflação (se existirem)
      saldoFinalReal: resultado.saldoFinalReal,
      totalJurosReais: resultado.totalJurosReais,
      rentabilidadeReal: resultado.rentabilidadeReal,
      taxaRealAnual: resultado.taxaRealAnual ? resultado.taxaRealAnual / 12 : undefined,
      perdaTotalInflacao: resultado.perdaTotalInflacao
    };
  }

  /**
   * Converte dados de evolução mensal para visualização por período
   */
  static converterEvolucaoMensal(
    evolucao: ResultadoMensal[],
    periodo: PeriodoVisualizacao
  ): ResultadoMensal[] {
    if (periodo === 'mensal') {
      return evolucao;
    }

    // Para visualização anual, agrupa por ano
    const dadosAnuais: ResultadoMensal[] = [];
    
    for (let ano = 0; ano < Math.ceil(evolucao.length / 12); ano++) {
      const inicioAno = ano * 12;
      const fimAno = Math.min((ano + 1) * 12, evolucao.length);
      const mesesDoAno = evolucao.slice(inicioAno, fimAno);
      
      if (mesesDoAno.length === 0) continue;
      
      // Último mês do ano (ou último disponível)
      const ultimoMes = mesesDoAno[mesesDoAno.length - 1];
      
      // Soma das contribuições do ano
      const contribuicaoAnual = mesesDoAno.reduce((acc, mes) => acc + mes.contribuicao, 0);
      
      // Soma dos juros do ano
      const jurosAnual = mesesDoAno.reduce((acc, mes) => acc + mes.juros, 0);
      
      dadosAnuais.push({
        mes: ano + 1, // Representa o ano
        contribuicao: contribuicaoAnual,
        juros: jurosAnual,
        saldoAcumulado: ultimoMes.saldoAcumulado,
        // Campos de inflação (se existirem)
        saldoReal: ultimoMes.saldoReal,
        perdaInflacao: mesesDoAno.reduce((acc, mes) => acc + (mes.perdaInflacao || 0), 0),
        ganhoRealMensal: mesesDoAno.reduce((acc, mes) => acc + (mes.ganhoRealMensal || 0), 0)
      });
    }
    
    return dadosAnuais;
  }

  /**
   * Obtém o label correto para o eixo X do gráfico
   */
  static obterLabelEixoX(periodo: PeriodoVisualizacao): string {
    return periodo === 'mensal' ? 'Mês' : 'Ano';
  }

  /**
   * Obtém o sufixo para valores monetários
   */
  static obterSufixoMonetario(periodo: PeriodoVisualizacao): string {
    return periodo === 'mensal' ? '/mês' : '/ano';
  }

  /**
   * Formata o tooltip do gráfico com o período correto
   */
  static formatarTooltipPeriodo(label: number, periodo: PeriodoVisualizacao): string {
    if (periodo === 'mensal') {
      return `Mês ${label}`;
    } else {
      return `Ano ${label}`;
    }
  }

  /**
   * Calcula valores de ganho baseados no período selecionado
   */
  static calcularGanhosPorPeriodo(
    resultado: ResultadoSimulacao,
    periodo: PeriodoVisualizacao
  ): {
    ganhoPrincipal: number;
    labelGanho: string;
    ganhoSecundario?: number;
    labelSecundario?: string;
  } {
    if (periodo === 'mensal') {
      return {
        ganhoPrincipal: resultado.ganhoMensal,
        labelGanho: 'Ganho Mensal',
        ganhoSecundario: resultado.ganhoAnual,
        labelSecundario: 'Ganho Anual'
      };
    } else {
      return {
        ganhoPrincipal: resultado.ganhoAnual,
        labelGanho: 'Ganho Anual',
        ganhoSecundario: resultado.ganhoMensal,
        labelSecundario: 'Ganho Mensal'
      };
    }
  }
}

/**
 * Hook personalizado para gerenciar conversões de período
 */
export const useConversaoPeriodo = () => {
  return {
    converterValor: PeriodoConversor.converterValor,
    converterResultado: PeriodoConversor.converterResultadoSimulacao,
    converterEvolucao: PeriodoConversor.converterEvolucaoMensal,
    obterLabelEixoX: PeriodoConversor.obterLabelEixoX,
    obterSufixo: PeriodoConversor.obterSufixoMonetario,
    formatarTooltip: PeriodoConversor.formatarTooltipPeriodo,
    calcularGanhos: PeriodoConversor.calcularGanhosPorPeriodo
  };
};