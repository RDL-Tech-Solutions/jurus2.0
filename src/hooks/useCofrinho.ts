// Hook para o Cofrinho Inteligente (simulação CDI)

import { useState, useCallback, useMemo, useEffect } from 'react';
import { useLocalStorage } from './useLocalStorage';
import {
  CofrinhoHistory,
  CofrinhoResult,
  CDIConfig,
  EDUCATION_STORAGE_KEYS,
  CDI_CONFIG
} from '../types/educacaoFinanceira';
import {
  calcularCofrinhoInteligente,
  gerarDadosGraficoCrescimento,
  calcularEconomiaAnual,
  formatarMoeda
} from '../utils/educacaoFinanceiraCalculos';

export const useCofrinho = () => {
  // Estados locais
  const [valorInicial, setValorInicial] = useState<string>('');
  const [tempoMeses, setTempoMeses] = useState<string>('12');
  const [aporteMensal, setAporteMensal] = useState<string>('');
  const [isCalculating, setIsCalculating] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Configuração CDI personalizada (opcional)
  const [cdiConfig, setCdiConfig] = useLocalStorage<CDIConfig>(
    'cofrinho_cdi_config',
    CDI_CONFIG
  );

  // Histórico de simulações
  const [history, setHistory] = useLocalStorage<CofrinhoHistory>(
    EDUCATION_STORAGE_KEYS.COFRINHO_HISTORY,
    { simulations: [] }
  );

  // Função para atualizar valor inicial
  const updateValorInicial = useCallback((value: string) => {
    const cleanValue = value.replace(/[^\d.,]/g, '');
    setValorInicial(cleanValue);
    
    if (errors.valorInicial) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.valorInicial;
        return newErrors;
      });
    }
  }, [errors.valorInicial]);

  // Função para atualizar tempo em meses
  const updateTempoMeses = useCallback((value: string) => {
    const cleanValue = value.replace(/[^\d]/g, '');
    setTempoMeses(cleanValue);
    
    if (errors.tempoMeses) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.tempoMeses;
        return newErrors;
      });
    }
  }, [errors.tempoMeses]);

  // Função para atualizar aporte mensal
  const updateAporteMensal = useCallback((value: string) => {
    const cleanValue = value.replace(/[^\d.,]/g, '');
    setAporteMensal(cleanValue);
    
    if (errors.aporteMensal) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.aporteMensal;
        return newErrors;
      });
    }
  }, [errors.aporteMensal]);

  // Função para validar inputs
  const validateInputs = useCallback(() => {
    const newErrors: Record<string, string> = {};
    
    const inicial = parseFloat(valorInicial.replace(',', '.'));
    const meses = parseInt(tempoMeses);
    const aporte = parseFloat(aporteMensal.replace(',', '.')) || 0;
    
    if (!valorInicial || !inicial || inicial <= 0) {
      newErrors.valorInicial = 'Informe um valor inicial válido';
    } else if (inicial < 1) {
      newErrors.valorInicial = 'Valor mínimo: R$ 1,00';
    } else if (inicial > 1000000) {
      newErrors.valorInicial = 'Valor máximo: R$ 1.000.000,00';
    }
    
    if (!tempoMeses || !meses || meses <= 0) {
      newErrors.tempoMeses = 'Informe um período válido';
    } else if (meses < 1) {
      newErrors.tempoMeses = 'Período mínimo: 1 mês';
    } else if (meses > 360) {
      newErrors.tempoMeses = 'Período máximo: 30 anos (360 meses)';
    }
    
    if (aporte < 0) {
      newErrors.aporteMensal = 'Aporte não pode ser negativo';
    } else if (aporte > 100000) {
      newErrors.aporteMensal = 'Aporte máximo: R$ 100.000,00';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [valorInicial, tempoMeses, aporteMensal]);

  // Função para calcular simulação
  const calculateSimulation = useCallback(async () => {
    if (!validateInputs()) return null;
    
    setIsCalculating(true);
    
    try {
      const inicial = parseFloat(valorInicial.replace(',', '.'));
      const meses = parseInt(tempoMeses);
      const aporte = parseFloat(aporteMensal.replace(',', '.')) || 0;
      
      // Simular delay para mostrar loading
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const result = calcularCofrinhoInteligente(inicial, meses, aporte, cdiConfig);
      
      return result;
    } catch (error) {
      setErrors({ calculation: 'Erro ao calcular simulação' });
      return null;
    } finally {
      setIsCalculating(false);
    }
  }, [valorInicial, tempoMeses, aporteMensal, cdiConfig, validateInputs]);

  // Função para salvar simulação no histórico
  const saveSimulation = useCallback((result: CofrinhoResult) => {
    const simulation = {
      id: Date.now().toString(),
      valorInicial: parseFloat(valorInicial.replace(',', '.')),
      meses: parseInt(tempoMeses),
      tempoMeses: parseInt(tempoMeses),
      aporteMensal: parseFloat(aporteMensal.replace(',', '.')) || 0,
      valorFinal: result.valorFinal,
      ganhoTotal: result.ganhoTotal,
      cdiConfig,
      resultado: result,
      createdAt: new Date().toISOString()
    };
    
    setHistory(prev => ({
      simulations: [simulation, ...prev.simulations.slice(0, 9)] // Manter apenas 10 simulações
    }));
    
    return simulation.id;
  }, [valorInicial, tempoMeses, aporteMensal, cdiConfig, setHistory]);

  // Função para remover simulação do histórico
  const removeSimulation = useCallback((id: string) => {
    setHistory(prev => ({
      simulations: prev.simulations.filter(sim => sim.id !== id)
    }));
  }, [setHistory]);

  // Função para carregar simulação do histórico
  const loadSimulation = useCallback((id: string) => {
    const simulation = history.simulations.find(sim => sim.id === id);
    if (simulation) {
      setValorInicial(simulation.valorInicial.toString().replace('.', ','));
      setTempoMeses(simulation.tempoMeses.toString());
      setAporteMensal(simulation.aporteMensal.toString().replace('.', ','));
      setCdiConfig(simulation.cdiConfig);
    }
  }, [history.simulations, setCdiConfig]);

  // Função para atualizar configuração CDI
  const updateCdiConfig = useCallback((newConfig: Partial<CDIConfig>) => {
    setCdiConfig(prev => ({ ...prev, ...newConfig }));
  }, [setCdiConfig]);

  // Função para resetar configuração CDI
  const resetCdiConfig = useCallback(() => {
    setCdiConfig(CDI_CONFIG);
  }, [setCdiConfig]);

  // Cálculos computados
  const calculations = useMemo(() => {
    const inicial = parseFloat(valorInicial.replace(',', '.')) || 0;
    const meses = parseInt(tempoMeses) || 0;
    const aporte = parseFloat(aporteMensal.replace(',', '.')) || 0;
    
    if (inicial <= 0 || meses <= 0) {
      return {
        result: null,
        chartData: [],
        isValid: false,
        canCalculate: false
      };
    }
    
    const result = calcularCofrinhoInteligente(inicial, meses, aporte, cdiConfig);
    const chartData = gerarDadosGraficoCrescimento(result);
    
    return {
      result,
      chartData,
      isValid: true,
      canCalculate: true
    };
  }, [valorInicial, tempoMeses, aporteMensal, cdiConfig]);

  // Comparação com poupança tradicional
  const comparison = useMemo(() => {
    if (!calculations.result) return null;
    
    const { result } = calculations;
    const inicial = parseFloat(valorInicial.replace(',', '.'));
    const meses = parseInt(tempoMeses);
    const aporte = parseFloat(aporteMensal.replace(',', '.')) || 0;
    
    // Simular poupança tradicional (0.5% ao mês)
    const poupancaConfig = { ...cdiConfig, taxaMensal: 0.005 };
    const poupancaResult = calcularCofrinhoInteligente(inicial, meses, aporte, poupancaConfig);
    
    const diferenca = result.valorFinal - poupancaResult.valorFinal;
    const percentualMelhor = ((diferenca / poupancaResult.valorFinal) * 100);
    
    return {
      cdi: result.valorFinal,
      poupanca: poupancaResult.valorFinal,
      diferenca,
      percentualMelhor,
      tempoParaIgualar: diferenca > 0 ? Math.ceil(meses * 0.7) : meses
    };
  }, [calculations, valorInicial, tempoMeses, aporteMensal, cdiConfig]);

  // Dados formatados
  const formattedData = useMemo(() => {
    const { result } = calculations;
    const inicial = parseFloat(valorInicial.replace(',', '.')) || 0;
    const aporte = parseFloat(aporteMensal.replace(',', '.')) || 0;
    
    return {
      valorInicial: formatarMoeda(inicial),
      aporteMensal: formatarMoeda(aporte),
      valorFinal: result ? formatarMoeda(result.valorFinal) : 'R$ 0,00',
      ganhoTotal: result ? formatarMoeda(result.ganhoTotal) : 'R$ 0,00',
      rendimentoMensal: result ? formatarMoeda(result.rendimentoMensal) : 'R$ 0,00',
      totalInvestido: result ? formatarMoeda(result.totalInvestido) : 'R$ 0,00'
    };
  }, [calculations, valorInicial, aporteMensal]);

  // Estatísticas do histórico
  const historyStats = useMemo(() => {
    const simulations = history.simulations;
    const totalSimulations = simulations.length;
    
    if (totalSimulations === 0) {
      return {
        totalSimulations: 0,
        maiorGanho: 0,
        menorGanho: 0,
        ganhoMedio: 0,
        tempoMedio: 0
      };
    }
    
    const ganhos = simulations.map(sim => sim.resultado.ganhoTotal);
    const tempos = simulations.map(sim => sim.tempoMeses);
    
    return {
      totalSimulations,
      maiorGanho: Math.max(...ganhos),
      menorGanho: Math.min(...ganhos),
      ganhoMedio: ganhos.reduce((sum, ganho) => sum + ganho, 0) / totalSimulations,
      tempoMedio: Math.round(tempos.reduce((sum, tempo) => sum + tempo, 0) / totalSimulations)
    };
  }, [history.simulations]);

  // Validação em tempo real
  useEffect(() => {
    validateInputs();
  }, [validateInputs]);

  // Função para limpar todos os dados
  const clearAll = useCallback(() => {
    setValorInicial('');
    setTempoMeses('12');
    setAporteMensal('');
    setErrors({});
    setShowAdvanced(false);
  }, []);

  return {
    // Estados
    valorInicial,
    tempoMeses,
    aporteMensal,
    isCalculating,
    errors,
    showAdvanced,
    cdiConfig,
    history,
    
    // Setters
    setValorInicial: updateValorInicial,
    setTempoMeses: updateTempoMeses,
    setAporteMensal: updateAporteMensal,
    setShowAdvanced,
    
    // Funções de cálculo
    calculateSimulation,
    validateInputs,
    
    // Funções de histórico
    saveSimulation,
    removeSimulation,
    loadSimulation,
    
    // Funções de configuração
    updateCdiConfig,
    resetCdiConfig,
    clearAll,
    
    // Dados computados
    calculations,
    comparison,
    formattedData,
    historyStats,
    
    // Validações
    isValid: calculations.isValid && Object.keys(errors).length === 0,
    hasErrors: Object.keys(errors).length > 0,
    canCalculate: calculations.canCalculate
  };
};