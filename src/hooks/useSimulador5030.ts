// Hook para o Simulador de Planejamento Financeiro

import { useState, useCallback, useMemo, useEffect } from 'react';
import { useLocalStorage } from './useLocalStorage';
import {
  SimuladorConfig,
  PieChartData,
  MetodoPlanejamento,
  ConfiguracaoPlanejamento,
  EDUCATION_STORAGE_KEYS,
  METODOS_PLANEJAMENTO
} from '../types/educacaoFinanceira';
import {
  calcularDivisaoPorMetodo,
  gerarDadosGraficoPizzaPorMetodo,
  validarConfiguracaoPlanejamento,
  obterRecomendacoesPorMetodo,
  formatarMoeda
} from '../utils/educacaoFinanceiraCalculos';

interface CustomCategory {
  id: string;
  name: string;
  estimatedValue: number;
}

interface ComparisonScenario {
  name: string;
  renda: number;
  config: ConfiguracaoPlanejamento;
}

interface UseSimuladorPlanejamentoReturn {
  // Estados
  rendaMensal: string;
  metodoSelecionado: MetodoPlanejamento;
  config: ConfiguracaoPlanejamento;
  isEditing: boolean;
  errors: Record<string, string>;
  customCategories: {
    necessidades: CustomCategory[];
    desejos: CustomCategory[];
    poupanca: CustomCategory[];
  };
  comparisonScenarios: ComparisonScenario[];

  // Setters
  setRendaMensal: (value: string) => void;
  setIsEditing: (editing: boolean) => void;
  setCustomCategories: React.Dispatch<React.SetStateAction<{
    necessidades: CustomCategory[];
    desejos: CustomCategory[];
    poupanca: CustomCategory[];
  }>>;
  setComparisonScenarios: React.Dispatch<React.SetStateAction<ComparisonScenario[]>>;

  // Funções de configuração
  selecionarMetodo: (metodo: MetodoPlanejamento) => void;
  updateConfig: (newConfig: Partial<ConfiguracaoPlanejamento>) => void;
  resetToDefault: () => void;
  applyCustomConfig: (necessidades: number, desejos: number, poupanca: number) => boolean;

  // Funções de categorias
  addCustomCategory: (type: 'necessidades' | 'desejos' | 'poupanca') => void;
  updateCustomCategory: (
    type: 'necessidades' | 'desejos' | 'poupanca',
    id: string,
    field: keyof CustomCategory,
    value: string | number
  ) => void;
  removeCustomCategory: (type: 'necessidades' | 'desejos' | 'poupanca', id: string) => void;

  // Funções de cenários
  addComparisonScenario: (name: string) => void;

  // Funções de ação
  saveSimulation: () => boolean;
  clearAll: () => void;

  // Dados computados
  calculations: {
    divisao: { necessidades: number; desejos: number; poupanca: number };
    pieData: PieChartData[];
    isValid: boolean;
    total: number;
    metodoInfo: typeof METODOS_PLANEJAMENTO[MetodoPlanejamento];
  };
  formattedData: {
    renda: string;
    necessidades: string;
    desejos: string;
    poupanca: string;
  };
  recommendations: string[];

  // Validações
  isValid: boolean;
  hasErrors: boolean;
}

const DEFAULT_CONFIGURACAO: ConfiguracaoPlanejamento = {
  metodo: '503020',
  necessidades: 50,
  desejos: 30,
  poupanca: 20,
  isCustom: false,
};

export const useSimuladorPlanejamento = (): UseSimuladorPlanejamentoReturn => {
  // Estados locais
  const [rendaMensal, setRendaMensal] = useState<string>('');
  const [metodoSelecionado, setMetodoSelecionado] = useState<MetodoPlanejamento>('503020');
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [customCategories, setCustomCategories] = useState<{
    necessidades: CustomCategory[];
    desejos: CustomCategory[];
    poupanca: CustomCategory[];
  }>({
    necessidades: [],
    desejos: [],
    poupanca: []
  });
  const [comparisonScenarios, setComparisonScenarios] = useState<ComparisonScenario[]>([]);

  // Configuração persistida
  const [config, setConfig] = useLocalStorage<ConfiguracaoPlanejamento>(
    EDUCATION_STORAGE_KEYS.SIMULADOR_CONFIG,
    DEFAULT_CONFIGURACAO
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
  const updateConfig = useCallback((newConfig: Partial<ConfiguracaoPlanejamento>) => {
    const updatedConfig = { ...config, ...newConfig };

    // Validar configuração
    const validation = validarConfiguracaoPlanejamento(updatedConfig);
    if (!validation.isValid) {
      setErrors({ config: validation.errors[0] || 'Configuração inválida' });
      return;
    }

    setConfig(updatedConfig);
    setErrors({});
  }, [config, setConfig]);

  // Função para selecionar método
  const selecionarMetodo = useCallback((metodo: MetodoPlanejamento) => {
    setMetodoSelecionado(metodo);

    // Atualiza configuração com valores padrão do método
    const metodoInfo = METODOS_PLANEJAMENTO[metodo];
    updateConfig({
      metodo,
      necessidades: metodoInfo.necessidades,
      desejos: metodoInfo.desejos,
      poupanca: metodoInfo.poupanca,
      isCustom: metodo === 'personalizado'
    });
  }, [updateConfig]);

  // Função para resetar para configuração padrão
  const resetToDefault = useCallback(() => {
    setConfig(DEFAULT_CONFIGURACAO);
    setMetodoSelecionado('503020');
    setErrors({});
  }, [setConfig]);

  // Função para aplicar configuração personalizada
  const applyCustomConfig = useCallback((necessidades: number, desejos: number, poupanca: number) => {
    const total = necessidades + desejos + poupanca;

    if (Math.abs(total - 100) > 0.01) {
      setErrors({ config: 'A soma das porcentagens deve ser igual a 100%' });
      return false;
    }

    updateConfig({
      metodo: 'personalizado',
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

    const divisao = calcularDivisaoPorMetodo(rendaNumeric, config.metodo, config);

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
        total: 0,
        metodoInfo: METODOS_PLANEJAMENTO[metodoSelecionado]
      };
    }

    const divisao = calcularDivisaoPorMetodo(rendaNumeric, config.metodo, config);
    const pieData = gerarDadosGraficoPizzaPorMetodo(rendaNumeric, config.metodo, config);

    return {
      divisao,
      pieData,
      isValid: true,
      total: rendaNumeric,
      metodoInfo: divisao.metodoInfo
    };
  }, [rendaMensal, config, metodoSelecionado]);

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

  // Recomendações baseadas no método selecionado
  const recommendations = useMemo(() => {
    return obterRecomendacoesPorMetodo(config.metodo);
  }, [config.metodo]);

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

  // Funções para categorias customizadas
  const addCustomCategory = useCallback((type: 'necessidades' | 'desejos' | 'poupanca') => {
    const newCategory: CustomCategory = {
      id: Date.now().toString(),
      name: '',
      estimatedValue: 0
    };
    setCustomCategories(prev => ({
      ...prev,
      [type]: [...prev[type], newCategory]
    }));
  }, []);

  const updateCustomCategory = useCallback((
    type: 'necessidades' | 'desejos' | 'poupanca',
    id: string,
    field: keyof CustomCategory,
    value: string | number
  ) => {
    setCustomCategories(prev => ({
      ...prev,
      [type]: prev[type].map(cat =>
        cat.id === id ? { ...cat, [field]: value } : cat
      )
    }));
  }, []);

  const removeCustomCategory = useCallback((type: 'necessidades' | 'desejos' | 'poupanca', id: string) => {
    setCustomCategories(prev => ({
      ...prev,
      [type]: prev[type].filter(cat => cat.id !== id)
    }));
  }, []);

  // Funções para cenários de comparação
  const addComparisonScenario = useCallback((name: string) => {
    const rendaNumeric = parseFloat(rendaMensal.replace(',', '.')) || 0;
    if (rendaNumeric > 0) {
      const newScenario: ComparisonScenario = {
        name,
        renda: rendaNumeric,
        config: { ...config }
      };
      setComparisonScenarios(prev => [...prev, newScenario]);
    }
  }, [rendaMensal, config]);

  // Função para limpar todos os dados
  const clearAll = useCallback(() => {
    setRendaMensal('');
    setConfig(DEFAULT_CONFIGURACAO);
    setMetodoSelecionado('503020');
    setErrors({});
    setIsEditing(false);
    setCustomCategories({
      necessidades: [],
      desejos: [],
      poupanca: []
    });
    setComparisonScenarios([]);
  }, [setConfig]);

  return {
    // Estados
    rendaMensal,
    metodoSelecionado,
    config,
    isEditing,
    errors,
    customCategories,
    comparisonScenarios,

    // Setters
    setRendaMensal: updateRendaMensal,
    setIsEditing,
    setCustomCategories,
    setComparisonScenarios,

    // Funções de configuração
    selecionarMetodo,
    updateConfig,
    resetToDefault,
    applyCustomConfig,

    // Funções de categorias
    addCustomCategory,
    updateCustomCategory,
    removeCustomCategory,

    // Funções de cenários
    addComparisonScenario,

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

// Mantém compatibilidade com o hook antigo
export const useSimulador5030 = useSimuladorPlanejamento;
