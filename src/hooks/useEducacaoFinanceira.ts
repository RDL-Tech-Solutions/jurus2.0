// Hook principal para a página de Educação Financeira

import { useState, useCallback, useMemo } from 'react';
import { useLocalStorage } from './useLocalStorage';
import {
  SimuladorConfig,
  CofrinhoHistory,
  DebtProgress,
  EducationProgress,
  EducationPreferences,
  EDUCATION_STORAGE_KEYS,
  DEFAULT_SIMULADOR_CONFIG,
  EDUCATION_SECTIONS
} from '../types/educacaoFinanceira';

export const useEducacaoFinanceira = () => {
  // Estados locais para controle da UI
  const [activeSection, setActiveSection] = useState<string>('educacao');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Configurações persistidas no localStorage
  const [simuladorConfig, setSimuladorConfig] = useLocalStorage<SimuladorConfig>(
    EDUCATION_STORAGE_KEYS.SIMULADOR_CONFIG,
    DEFAULT_SIMULADOR_CONFIG
  );

  const [cofrinhoHistory, setCofrinhoHistory] = useLocalStorage<CofrinhoHistory>(
    EDUCATION_STORAGE_KEYS.COFRINHO_HISTORY,
    { simulations: [] }
  );

  const [debtProgress, setDebtProgress] = useLocalStorage<DebtProgress[]>(
    EDUCATION_STORAGE_KEYS.DEBT_PROGRESS,
    []
  );

  const [educationProgress, setEducationProgress] = useLocalStorage<EducationProgress>(
    EDUCATION_STORAGE_KEYS.EDUCATION_PROGRESS,
    {
      completedSections: [],
      totalTimeSpent: 0,
      lastAccessed: new Date().toISOString()
    }
  );

  const [preferences, setPreferences] = useLocalStorage<EducationPreferences>(
    EDUCATION_STORAGE_KEYS.EDUCATION_PREFERENCES,
    {
      theme: 'light',
      animations: true,
      notifications: true,
      autoSave: true
    }
  );

  // Função para navegar entre seções
  const navigateToSection = useCallback((sectionId: string) => {
    setActiveSection(sectionId);
    
    // Atualizar progresso educacional
    setEducationProgress(prev => ({
      ...prev,
      lastAccessed: new Date().toISOString(),
      completedSections: prev.completedSections.includes(sectionId) 
        ? prev.completedSections 
        : [...prev.completedSections, sectionId]
    }));

    // Scroll suave para a seção
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }, [setEducationProgress]);

  // Função para marcar seção como completada
  const markSectionCompleted = useCallback((sectionId: string) => {
    setEducationProgress(prev => ({
      ...prev,
      completedSections: prev.completedSections.includes(sectionId)
        ? prev.completedSections
        : [...prev.completedSections, sectionId]
    }));
  }, [setEducationProgress]);

  // Função para adicionar tempo de estudo
  const addStudyTime = useCallback((minutes: number) => {
    setEducationProgress(prev => ({
      ...prev,
      totalTimeSpent: prev.totalTimeSpent + minutes
    }));
  }, [setEducationProgress]);

  // Função para limpar erros
  const clearError = useCallback((field: string) => {
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
  }, []);

  // Função para definir erro
  const setError = useCallback((field: string, message: string) => {
    setErrors(prev => ({
      ...prev,
      [field]: message
    }));
  }, []);

  // Função para limpar todos os dados
  const clearAllData = useCallback(() => {
    setSimuladorConfig(DEFAULT_SIMULADOR_CONFIG);
    setCofrinhoHistory({ simulations: [] });
    setDebtProgress([]);
    setEducationProgress({
      completedSections: [],
      totalTimeSpent: 0,
      lastAccessed: new Date().toISOString()
    });
    setErrors({});
  }, [setSimuladorConfig, setCofrinhoHistory, setDebtProgress, setEducationProgress]);

  // Função para exportar dados
  const exportData = useCallback(() => {
    const data = {
      simuladorConfig,
      cofrinhoHistory,
      debtProgress,
      educationProgress,
      preferences,
      exportedAt: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `educacao-financeira-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [simuladorConfig, cofrinhoHistory, debtProgress, educationProgress, preferences]);

  // Função para importar dados
  const importData = useCallback((file: File) => {
    return new Promise<void>((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target?.result as string);
          
          if (data.simuladorConfig) setSimuladorConfig(data.simuladorConfig);
          if (data.cofrinhoHistory) setCofrinhoHistory(data.cofrinhoHistory);
          if (data.debtProgress) setDebtProgress(data.debtProgress);
          if (data.educationProgress) setEducationProgress(data.educationProgress);
          if (data.preferences) setPreferences(data.preferences);
          
          resolve();
        } catch (error) {
          reject(new Error('Arquivo inválido ou corrompido'));
        }
      };
      
      reader.onerror = () => reject(new Error('Erro ao ler o arquivo'));
      reader.readAsText(file);
    });
  }, [setSimuladorConfig, setCofrinhoHistory, setDebtProgress, setEducationProgress, setPreferences]);

  // Estatísticas computadas
  const statistics = useMemo(() => {
    const totalSimulations = cofrinhoHistory.simulations.length;
    const totalDebts = debtProgress.length;
    const completedSections = educationProgress.completedSections.length;
    const totalSections = EDUCATION_SECTIONS.length;
    const progressPercentage = (completedSections / totalSections) * 100;
    
    return {
      totalSimulations,
      totalDebts,
      completedSections,
      totalSections,
      progressPercentage: Math.round(progressPercentage),
      totalStudyTime: educationProgress.totalTimeSpent,
      lastAccessed: educationProgress.lastAccessed
    };
  }, [cofrinhoHistory.simulations.length, debtProgress.length, educationProgress]);

  // Seção ativa computada
  const currentSection = useMemo(() => {
    return EDUCATION_SECTIONS.find(section => section.id === activeSection) || EDUCATION_SECTIONS[0];
  }, [activeSection]);

  return {
    // Estados
    activeSection,
    isLoading,
    errors,
    
    // Dados persistidos
    simuladorConfig,
    cofrinhoHistory,
    debtProgress,
    educationProgress,
    preferences,
    
    // Setters
    setActiveSection,
    setIsLoading,
    setSimuladorConfig,
    setCofrinhoHistory,
    setDebtProgress,
    setEducationProgress,
    setPreferences,
    
    // Funções de navegação
    navigateToSection,
    markSectionCompleted,
    addStudyTime,
    
    // Funções de erro
    setError,
    clearError,
    
    // Funções de dados
    clearAllData,
    exportData,
    importData,
    
    // Dados computados
    statistics,
    currentSection,
    
    // Constantes
    sections: EDUCATION_SECTIONS
  };
};