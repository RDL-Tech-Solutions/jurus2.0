import { useState, useCallback } from 'react';
import { 
  CalculadoraAposentadoriaInput, 
  ResultadoAposentadoria, 
  ResultadoMensal,
  RetiradasProgramadasInput,
  ResultadoRetiradas
} from '../types';

export const useCalculadoraAposentadoria = () => {
  const [loading, setLoading] = useState(false);
  const [resultado, setResultado] = useState<ResultadoAposentadoria | null>(null);
  const [resultadoRetiradas, setResultadoRetiradas] = useState<ResultadoRetiradas | null>(null);

  const calcularAposentadoria = useCallback(async (input: CalculadoraAposentadoriaInput) => {
    setLoading(true);
    
    try {
      // Simular delay para mostrar loading
      await new Promise(resolve => setTimeout(resolve, 1000));

      const {
        idadeAtual,
        idadeAposentadoria,
        valorMensalDesejado,
        patrimonioAtual,
        contribuicaoMensal,
        taxaJuros,
        inflacao,
        expectativaVida
      } = input;

      const anosContribuicao = idadeAposentadoria - idadeAtual;
      const anosAposentadoria = expectativaVida - idadeAposentadoria;
      const mesesContribuicao = anosContribuicao * 12;
      const mesesAposentadoria = anosAposentadoria * 12;

      // Taxa mensal
      const taxaMensal = taxaJuros / 100 / 12;
      const inflacaoMensal = inflacao / 100 / 12;

      // Valor mensal desejado ajustado pela inflação
      const valorMensalAjustado = valorMensalDesejado * Math.pow(1 + inflacao / 100, anosContribuicao);

      // Calcular valor necessário na aposentadoria (considerando retiradas durante a aposentadoria)
      const valorNecessario = valorMensalAjustado * (
        (1 - Math.pow(1 + taxaMensal - inflacaoMensal, -mesesAposentadoria)) / 
        (taxaMensal - inflacaoMensal)
      );

      // Calcular valor acumulado com contribuições atuais
      const valorFuturoPatrimonio = patrimonioAtual * Math.pow(1 + taxaMensal, mesesContribuicao);
      const valorFuturoContribuicoes = contribuicaoMensal * (
        (Math.pow(1 + taxaMensal, mesesContribuicao) - 1) / taxaMensal
      );
      const valorAcumulado = valorFuturoPatrimonio + valorFuturoContribuicoes;

      // Calcular déficit e contribuição sugerida
      const deficit = Math.max(0, valorNecessario - valorAcumulado);
      const contribuicaoSugerida = deficit > 0 ? 
        deficit / ((Math.pow(1 + taxaMensal, mesesContribuicao) - 1) / taxaMensal) : 0;

      // Evolução durante acumulação
      const evolucaoAcumulacao: ResultadoMensal[] = [];
      let saldoAtual = patrimonioAtual;

      for (let mes = 1; mes <= mesesContribuicao; mes++) {
        const juros = saldoAtual * taxaMensal;
        saldoAtual += juros + contribuicaoMensal;
        
        evolucaoAcumulacao.push({
          mes,
          contribuicao: contribuicaoMensal,
          juros,
          saldoAcumulado: saldoAtual,
          saldoReal: saldoAtual / Math.pow(1 + inflacaoMensal, mes)
        });
      }

      // Evolução durante aposentadoria
      const evolucaoRetirada: ResultadoMensal[] = [];
      let saldoAposentadoria = valorAcumulado;

      for (let mes = 1; mes <= Math.min(mesesAposentadoria, 360); mes++) {
        const juros = saldoAposentadoria * taxaMensal;
        saldoAposentadoria = saldoAposentadoria + juros - valorMensalAjustado;
        
        evolucaoRetirada.push({
          mes,
          contribuicao: -valorMensalAjustado, // Retirada
          juros,
          saldoAcumulado: Math.max(0, saldoAposentadoria),
          saldoReal: Math.max(0, saldoAposentadoria) / Math.pow(1 + inflacaoMensal, mesesContribuicao + mes)
        });

        if (saldoAposentadoria <= 0) break;
      }

      const resultadoFinal: ResultadoAposentadoria = {
        valorNecessario,
        valorAcumulado,
        deficit,
        contribuicaoSugerida,
        anosContribuicao,
        anosAposentadoria,
        evolucaoAcumulacao,
        evolucaoRetirada
      };

      setResultado(resultadoFinal);
      return resultadoFinal;

    } catch (error) {
      console.error('Erro ao calcular aposentadoria:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const calcularRetiradas = useCallback(async (input: RetiradasProgramadasInput) => {
    setLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 800));

      const {
        patrimonioInicial,
        valorRetiradaMensal,
        taxaJuros,
        inflacao,
        periodoRetiradas,
        ajustarInflacao
      } = input;

      const taxaMensal = taxaJuros / 100 / 12;
      const inflacaoMensal = inflacao / 100 / 12;
      const mesesRetiradas = periodoRetiradas * 12;

      const evolucaoMensal: ResultadoMensal[] = [];
      let saldoAtual = patrimonioInicial;
      let totalRetirado = 0;
      let duracaoPatrimonio = 0;

      for (let mes = 1; mes <= mesesRetiradas; mes++) {
        const juros = saldoAtual * taxaMensal;
        const retiradaAjustada = ajustarInflacao ? 
          valorRetiradaMensal * Math.pow(1 + inflacaoMensal, mes - 1) : 
          valorRetiradaMensal;

        saldoAtual = saldoAtual + juros - retiradaAjustada;
        totalRetirado += retiradaAjustada;

        evolucaoMensal.push({
          mes,
          contribuicao: -retiradaAjustada,
          juros,
          saldoAcumulado: Math.max(0, saldoAtual),
          saldoReal: Math.max(0, saldoAtual) / Math.pow(1 + inflacaoMensal, mes)
        });

        if (saldoAtual > 0) {
          duracaoPatrimonio = mes;
        }

        if (saldoAtual <= 0) break;
      }

      const sustentavel = saldoAtual > 0;

      const resultadoFinal: ResultadoRetiradas = {
        duracaoPatrimonio,
        valorFinalPatrimonio: Math.max(0, saldoAtual),
        totalRetirado,
        evolucaoMensal,
        sustentavel
      };

      setResultadoRetiradas(resultadoFinal);
      return resultadoFinal;

    } catch (error) {
      console.error('Erro ao calcular retiradas:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const limparResultados = useCallback(() => {
    setResultado(null);
    setResultadoRetiradas(null);
  }, []);

  return {
    loading,
    resultado,
    resultadoRetiradas,
    calcularAposentadoria,
    calcularRetiradas,
    limparResultados
  };
};