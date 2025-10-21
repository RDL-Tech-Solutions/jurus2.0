// Hook para gerenciamento de dívidas

import { useState, useCallback, useMemo, useEffect } from 'react';
import { useLocalStorage } from './useLocalStorage';
import {
  DebtProgress,
  DebtResult,
  DebtStrategy,
  EDUCATION_STORAGE_KEYS,
  DEBT_STRATEGIES
} from '../types/educacaoFinanceira';
import {
  calcularTempoQuitacao,
  gerarRecomendacoesFinanceiras,
  formatarMoeda,
  formatarPorcentagem
} from '../utils/educacaoFinanceiraCalculos';

export const useDividas = () => {
  // Estados locais
  const [valorDivida, setValorDivida] = useState<string>('');
  const [rendaMensal, setRendaMensal] = useState<string>('');
  const [estrategiaSelecionada, setEstrategiaSelecionada] = useState<DebtStrategy>(DEBT_STRATEGIES[0]);
  const [isCalculating, setIsCalculating] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Dados persistidos
  const [debtProgress, setDebtProgress] = useLocalStorage<DebtProgress[]>(
    EDUCATION_STORAGE_KEYS.DEBT_PROGRESS,
    []
  );

  // Função para atualizar valor da dívida
  const updateValorDivida = useCallback((value: string) => {
    const cleanValue = value.replace(/[^\d.,]/g, '');
    setValorDivida(cleanValue);
    
    if (errors.valorDivida) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.valorDivida;
        return newErrors;
      });
    }
  }, [errors.valorDivida]);

  // Função para atualizar renda mensal
  const updateRendaMensal = useCallback((value: string) => {
    const cleanValue = value.replace(/[^\d.,]/g, '');
    setRendaMensal(cleanValue);
    
    if (errors.rendaMensal) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.rendaMensal;
        return newErrors;
      });
    }
  }, [errors.rendaMensal]);

  // Função para validar inputs
  const validateInputs = useCallback(() => {
    const newErrors: Record<string, string> = {};
    
    const divida = parseFloat(valorDivida.replace(',', '.'));
    const renda = parseFloat(rendaMensal.replace(',', '.'));
    
    if (!valorDivida || !divida || divida <= 0) {
      newErrors.valorDivida = 'Informe um valor de dívida válido';
    }
    
    if (!rendaMensal || !renda || renda <= 0) {
      newErrors.rendaMensal = 'Informe uma renda mensal válida';
    }
    
    if (divida && renda && divida > renda * 100) {
      newErrors.valorDivida = 'Valor da dívida muito alto em relação à renda';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [valorDivida, rendaMensal]);

  // Função para calcular estratégia de pagamento
  const calculateDebtStrategy = useCallback(async () => {
    if (!validateInputs()) return null;
    
    setIsCalculating(true);
    
    try {
      const divida = parseFloat(valorDivida.replace(',', '.'));
      const renda = parseFloat(rendaMensal.replace(',', '.'));
      
      // Simular delay para mostrar loading
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const result = calcularTempoQuitacao(divida, renda, estrategiaSelecionada.recommendedPercentage);
      
      return result;
    } catch (error) {
      setErrors({ calculation: 'Erro ao calcular estratégia de pagamento' });
      return null;
    } finally {
      setIsCalculating(false);
    }
  }, [valorDivida, rendaMensal, estrategiaSelecionada, validateInputs]);

  // Função para salvar progresso da dívida
  const saveDebtProgress = useCallback((result: DebtResult) => {
    const newProgress: DebtProgress = {
      id: Date.now().toString(),
      valorInicial: parseFloat(valorDivida.replace(',', '.')),
      valorAtual: parseFloat(valorDivida.replace(',', '.')),
      dataInicio: new Date().toISOString(),
      tempoEstimado: result.mesesParaQuitar,
      valorMensal: result.valorMensalRecomendado,
      estrategia: estrategiaSelecionada,
      createdAt: new Date().toISOString()
    };
    
    setDebtProgress(prev => [...prev, newProgress]);
    return newProgress.id;
  }, [valorDivida, rendaMensal, estrategiaSelecionada, setDebtProgress]);

  // Função para atualizar progresso de uma dívida
  const updateDebtProgress = useCallback((id: string, pagamento: number) => {
    setDebtProgress(prev => prev.map(debt => {
      if (debt.id === id) {
        const novoValorAtual = Math.max(0, debt.valorAtual - pagamento);
        
        return {
          ...debt,
          valorAtual: novoValorAtual,
          ultimoPagamento: new Date().toISOString()
        };
      }
      return debt;
    }));
  }, [setDebtProgress]);

  // Função para remover dívida
  const removeDebt = useCallback((id: string) => {
    setDebtProgress(prev => prev.filter(debt => debt.id !== id));
  }, [setDebtProgress]);

  // Função para marcar dívida como quitada
  const markDebtAsPaid = useCallback((id: string) => {
    setDebtProgress(prev => prev.map(debt => {
      if (debt.id === id) {
        return {
          ...debt,
          valorAtual: 0,
          dataQuitacao: new Date().toISOString()
        };
      }
      return debt;
    }));
  }, [setDebtProgress]);

  // Cálculos computados
  const calculations = useMemo(() => {
    const divida = parseFloat(valorDivida.replace(',', '.')) || 0;
    const renda = parseFloat(rendaMensal.replace(',', '.')) || 0;
    
    if (divida <= 0 || renda <= 0) {
      return {
        result: null,
        isValid: false,
        canCalculate: false
      };
    }
    
    const result = calcularTempoQuitacao(divida, renda, estrategiaSelecionada.recommendedPercentage);
    
    return {
      result,
      isValid: true,
      canCalculate: true
    };
  }, [valorDivida, rendaMensal, estrategiaSelecionada]);

  // Recomendações baseadas na situação
  const recommendations = useMemo(() => {
    if (!calculations.result) return [];
    
    const { result } = calculations;
    const divida = parseFloat(valorDivida.replace(',', '.'));
    const renda = parseFloat(rendaMensal.replace(',', '.'));
    
    return gerarRecomendacoesFinanceiras(divida, renda, result);
  }, [calculations, valorDivida, rendaMensal]);

  // Estatísticas das dívidas
  const statistics = useMemo(() => {
    const totalDividas = debtProgress.length;
    const dividasQuitadas = debtProgress.filter(debt => debt.valorAtual <= 0).length;
    const dividasAtivas = totalDividas - dividasQuitadas;
    const valorTotalInicial = debtProgress.reduce((sum, debt) => sum + debt.valorInicial, 0);
    const valorTotalAtual = debtProgress.reduce((sum, debt) => sum + debt.valorAtual, 0);
    const progressoMedio = totalDividas > 0 
      ? debtProgress.reduce((sum, debt) => {
          const progresso = ((debt.valorInicial - debt.valorAtual) / debt.valorInicial) * 100;
          return sum + progresso;
        }, 0) / totalDividas 
      : 0;
    
    return {
      totalDividas,
      dividasQuitadas,
      dividasAtivas,
      valorTotalInicial,
      valorTotalAtual,
      progressoMedio: Math.round(progressoMedio),
      valorEconomizado: valorTotalInicial - valorTotalAtual
    };
  }, [debtProgress]);

  // Dados formatados
  const formattedData = useMemo(() => {
    const { result } = calculations;
    
    return {
      valorDivida: formatarMoeda(parseFloat(valorDivida.replace(',', '.')) || 0),
      rendaMensal: formatarMoeda(parseFloat(rendaMensal.replace(',', '.')) || 0),
      valorMensal: result ? formatarMoeda(result.valorMensalRecomendado) : 'R$ 0,00',
      totalJuros: result ? formatarMoeda(result.totalJuros) : 'R$ 0,00',
      percentualRenda: result ? formatarPorcentagem(result.percentualRenda) : '0%'
    };
  }, [calculations, valorDivida, rendaMensal]);

  // Validação em tempo real
  useEffect(() => {
    validateInputs();
  }, [validateInputs]);

  // Função para limpar todos os dados
  const clearAll = useCallback(() => {
    setValorDivida('');
    setRendaMensal('');
    setEstrategiaSelecionada(DEBT_STRATEGIES[0]);
    setErrors({});
  }, []);

  return {
    // Estados
    valorDivida,
    rendaMensal,
    estrategiaSelecionada,
    isCalculating,
    errors,
    debtProgress,
    
    // Setters
    setValorDivida: updateValorDivida,
    setRendaMensal: updateRendaMensal,
    setEstrategiaSelecionada,
    
    // Funções de cálculo
    calculateDebtStrategy,
    validateInputs,
    
    // Funções de gerenciamento
    saveDebtProgress,
    updateDebtProgress,
    removeDebt,
    markDebtAsPaid,
    clearAll,
    
    // Dados computados
    calculations,
    recommendations,
    statistics,
    formattedData,
    
    // Constantes
    strategies: DEBT_STRATEGIES,
    
    // Validações
    isValid: calculations.isValid && Object.keys(errors).length === 0,
    hasErrors: Object.keys(errors).length > 0,
    canCalculate: calculations.canCalculate
  };
};