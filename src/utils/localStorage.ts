import { SimulacaoInput, ComparacaoInvestimento, Theme } from '../types';
import { localStorageKeys } from '../constants';

// Função genérica para localStorage
export function useLocalStorageValue<T>(key: string, defaultValue: T): [T, (value: T) => void] {
  const getValue = (): T => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error(`Erro ao ler localStorage para chave ${key}:`, error);
      return defaultValue;
    }
  };

  const setValue = (value: T): void => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Erro ao salvar no localStorage para chave ${key}:`, error);
    }
  };

  return [getValue(), setValue];
}

// Salvar simulação no localStorage
export function salvarSimulacao(simulacao: SimulacaoInput): void {
  try {
    const simulacoesSalvas = JSON.parse(
      localStorage.getItem(localStorageKeys.SIMULACOES_SALVAS) || '[]'
    );
    
    simulacoesSalvas.push({
      ...simulacao,
      id: Date.now().toString(),
      criadoEm: new Date().toISOString()
    });
    
    localStorage.setItem(
      localStorageKeys.SIMULACOES_SALVAS, 
      JSON.stringify(simulacoesSalvas)
    );
  } catch (error) {
    console.error('Erro ao salvar simulação:', error);
  }
}

// Carregar simulações salvas
export function carregarSimulacoesSalvas(): SimulacaoInput[] {
  try {
    const simulacoes = localStorage.getItem(localStorageKeys.SIMULACOES_SALVAS);
    return simulacoes ? JSON.parse(simulacoes) : [];
  } catch (error) {
    console.error('Erro ao carregar simulações:', error);
    return [];
  }
}

// Carregar tema preferido
export function carregarTemaPreferido(): Theme {
  try {
    const tema = localStorage.getItem(localStorageKeys.TEMA_PREFERIDO);
    return (tema as Theme) || 'light';
  } catch (error) {
    console.error('Erro ao carregar tema:', error);
    return 'light';
  }
}

// Salvar tema preferido
export function salvarTemaPreferido(tema: Theme): void {
  try {
    localStorage.setItem(localStorageKeys.TEMA_PREFERIDO, tema);
  } catch (error) {
    console.error('Erro ao salvar tema:', error);
  }
}

// Salvar comparações ativas
export function salvarComparacoes(comparacoes: ComparacaoInvestimento[]): void {
  try {
    localStorage.setItem(
      localStorageKeys.COMPARACOES_ATIVAS,
      JSON.stringify(comparacoes)
    );
  } catch (error) {
    console.error('Erro ao salvar comparações:', error);
  }
}

// Carregar comparações ativas
export function carregarComparacoes(): ComparacaoInvestimento[] {
  try {
    const comparacoes = localStorage.getItem(localStorageKeys.COMPARACOES_ATIVAS);
    return comparacoes ? JSON.parse(comparacoes) : [];
  } catch (error) {
    console.error('Erro ao carregar comparações:', error);
    return [];
  }
}

// Limpar todas as comparações
export function limparComparacoes(): void {
  try {
    localStorage.removeItem(localStorageKeys.COMPARACOES_ATIVAS);
  } catch (error) {
    console.error('Erro ao limpar comparações:', error);
  }
}

// Salvar configurações gerais
export function salvarConfiguracoes(config: Record<string, any>): void {
  try {
    localStorage.setItem(
      localStorageKeys.CONFIGURACOES,
      JSON.stringify(config)
    );
  } catch (error) {
    console.error('Erro ao salvar configurações:', error);
  }
}

// Carregar configurações gerais
export function carregarConfiguracoes(): Record<string, any> {
  try {
    const config = localStorage.getItem(localStorageKeys.CONFIGURACOES);
    return config ? JSON.parse(config) : {};
  } catch (error) {
    console.error('Erro ao carregar configurações:', error);
    return {};
  }
}