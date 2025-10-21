// Hook para o Simulador 50-30-20

import { useState, useCallback, useMemo, useEffect } from 'react';
import { useLocalStorage } from './useLocalStorage';
import {
  SimuladorConfig,
  PieChartData,
  EDUCATION_STORAGE_KEYS,
  DEFAULT_SIMULADOR_CONFIG
} from '../types/educacaoFinanceira';
import {
  calcularDivisao5030,
  gerarDadosGraficoPizza,
  validarConfigSimulador,
  formatarMoeda
} from '../utils/educacaoFinanceiraCalculos';

export const useSimulador5030 = () => {
  // Estados locais
  const [rendaMensal, setRendaMensal] = useState<string>('');
  const [isEditing, setIsEditing] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Configuração persistida
  const [config, setConfig] = useLocalStorage<SimuladorConfig>(
    EDUCATION_STORAGE_KEYS.SIMULADOR_CONFIG,
    DEFAULT_SIMULADOR_CONFIG
  );

  // Função para atualizar renda mensal
  const updateRendaMensal = useCallback((value: string) => {
    // Remove caracteres não numéricos exceto vírgula e ponto
    const cleanValue = value.replace(/[^\d.,]/g, '');
    setRendaMensal(cleanValue);
    
    // Limpa erro se existir
    if (errors.rendaMensal) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.rendaMensal;
        return newErrors;
      });
    }
  }, [errors.rendaMensal]);

  // Função para atualizar configuração
  const updateConfig = useCallback((newConfig: Partial<SimuladorConfig>) => {
    const updatedConfig = { ...config, ...newConfig };
    
    // Validar configuração
    const validation = validarConfigSimulador(updatedConfig);
    if (!validation.isValid) {
      setErrors({ config: validation.errors[0] || 'Configuração inválida' });
      return;
    }
    
    setConfig(updatedConfig);
    setErrors({});
  }, [config, setConfig]);

  // Função para resetar para configuração padrão
  const resetToDefault = useCallback(() => {
    setConfig(DEFAULT_SIMULADOR_CONFIG);
    setErrors({});
  }, [setConfig]);

  // Função para aplicar configuração personalizada
  const applyCustomConfig = useCallback((necessidades: number, desejos: number, poupanca: number) => {
    const total = necessidades + desejos + poupanca;
    
    if (Math.abs(total - 100) > 0.01) {
      setErrors({ config: 'A soma das porcentagens deve ser 100%' });
      return false;
    }
    
    updateConfig({
      necessidades,
      desejos,
      poupanca,
      isCustom: true
    });
    
    return true;
  }, [updateConfig]);

  // Função para salvar simulação
  const saveSimulation = useCallback(() => {
    const rendaNumeric = parseFloat(rendaMensal.replace(',', '.'));
    
    if (!rendaNumeric || rendaNumeric <= 0) {
      setErrors({ rendaMensal: 'Informe uma renda válida' });
      return false;
    }
    
    const divisao = calcularDivisao5030(rendaNumeric, config);
    
    // Aqui você pode salvar no histórico se necessário
    console.log('Simulação salva:', { rendaNumeric, config, divisao });
    
    return true;
  }, [rendaMensal, config]);

  // Cálculos computados
  const calculations = useMemo(() => {
    const rendaNumeric = parseFloat(rendaMensal.replace(',', '.')) || 0;
    
    if (rendaNumeric <= 0) {
      return {
        divisao: { necessidades: 0, desejos: 0, poupanca: 0 },
        pieData: [],
        isValid: false,
        total: 0
      };
    }
    
    const divisao = calcularDivisao5030(rendaNumeric, config);
    const pieData = gerarDadosGraficoPizza(rendaNumeric, config);
    
    return {
      divisao,
      pieData,
      isValid: true,
      total: rendaNumeric
    };
  }, [rendaMensal, config]);

  // Dados formatados para exibição
  const formattedData = useMemo(() => {
    const { divisao } = calculations;
    
    return {
      renda: formatarMoeda(calculations.total),
      necessidades: formatarMoeda(divisao.necessidades),
      desejos: formatarMoeda(divisao.desejos),
      poupanca: formatarMoeda(divisao.poupanca)
    };
  }, [calculations]);

  // Recomendações baseadas na configuração
  const recommendations = useMemo(() => {
    const { divisao } = calculations;
    const recommendations: string[] = [];
    
    if (config.necessidades > 60) {
      recommendations.push('Considere revisar seus gastos essenciais para liberar mais recursos para poupança.');
    }
    
    if (config.desejos > 40) {
      recommendations.push('Tente reduzir gastos com desejos para aumentar sua capacidade de poupança.');
    }
    
    if (config.poupanca < 15) {
      recommendations.push('Recomendamos poupar pelo menos 20% da renda para garantir segurança financeira.');
    }
    
    if (divisao.poupanca >= 1000) {
      recommendations.push('Excelente! Com essa poupança, considere diversificar em investimentos.');
    }
    
    return recommendations;
  }, [calculations, config]);

  // Validação em tempo real
  useEffect(() => {
    const rendaNumeric = parseFloat(rendaMensal.replace(',', '.'));
    
    if (rendaMensal && (!rendaNumeric || rendaNumeric <= 0)) {
      setErrors(prev => ({ ...prev, rendaMensal: 'Informe um valor válido' }));
    } else if (errors.rendaMensal) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.rendaMensal;
        return newErrors;
      });
    }
  }, [rendaMensal, errors.rendaMensal]);

  // Função para limpar todos os dados
  const clearAll = useCallback(() => {
    setRendaMensal('');
    setConfig(DEFAULT_SIMULADOR_CONFIG);
    setErrors({});
    setIsEditing(false);
  }, [setConfig]);

  return {
    // Estados
    rendaMensal,
    config,
    isEditing,
    errors,
    
    // Setters
    setRendaMensal: updateRendaMensal,
    setIsEditing,
    
    // Funções de configuração
    updateConfig,
    resetToDefault,
    applyCustomConfig,
    
    // Funções de ação
    saveSimulation,
    clearAll,
    
    // Dados computados
    calculations,
    formattedData,
    recommendations,
    
    // Validações
    isValid: calculations.isValid && Object.keys(errors).length === 0,
    hasErrors: Object.keys(errors).length > 0
  };
};