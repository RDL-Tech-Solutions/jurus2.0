import { SimulacaoInput, ComparacaoInvestimento, Theme, CalculadoraAposentadoriaInput, ResultadoAposentadoria } from '../types';
import { localStorageKeys } from '../constants';
import { HistoricoItem } from '../types/historico';
import { MetaInput, ResultadoMeta } from '../hooks/useCalculadoraMeta';

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

// ===== HISTÓRICO DE SIMULAÇÕES =====

// Salvar histórico de simulações
export function salvarHistoricoSimulacoes(historico: HistoricoItem[]): void {
  try {
    localStorage.setItem(
      localStorageKeys.HISTORICO_SIMULACOES,
      JSON.stringify(historico)
    );
  } catch (error) {
    console.error('Erro ao salvar histórico:', error);
  }
}

// Carregar histórico de simulações
export function carregarHistoricoSimulacoes(): HistoricoItem[] {
  try {
    const historico = localStorage.getItem(localStorageKeys.HISTORICO_SIMULACOES);
    return historico ? JSON.parse(historico) : [];
  } catch (error) {
    console.error('Erro ao carregar histórico:', error);
    return [];
  }
}

// ===== METAS FINANCEIRAS =====

// Salvar metas financeiras
export function salvarMetasFinanceiras(metas: Array<MetaInput & { id: string; resultado?: ResultadoMeta; criadoEm: string }>): void {
  try {
    localStorage.setItem(
      localStorageKeys.METAS_FINANCEIRAS,
      JSON.stringify(metas)
    );
  } catch (error) {
    console.error('Erro ao salvar metas:', error);
  }
}

// Carregar metas financeiras
export function carregarMetasFinanceiras(): Array<MetaInput & { id: string; resultado?: ResultadoMeta; criadoEm: string }> {
  try {
    const metas = localStorage.getItem(localStorageKeys.METAS_FINANCEIRAS);
    return metas ? JSON.parse(metas) : [];
  } catch (error) {
    console.error('Erro ao carregar metas:', error);
    return [];
  }
}



// ===== ANÁLISE DE CENÁRIOS =====

// Salvar análises de cenários
export function salvarAnalisesCenarios(cenarios: Record<string, any>): void {
  try {
    localStorage.setItem(
      localStorageKeys.CENARIOS_ANALISE,
      JSON.stringify(cenarios)
    );
  } catch (error) {
    console.error('Erro ao salvar análises de cenários:', error);
  }
}

// Carregar análises de cenários
export function carregarAnalisesCenarios(): Record<string, any> {
  try {
    const cenarios = localStorage.getItem(localStorageKeys.CENARIOS_ANALISE);
    return cenarios ? JSON.parse(cenarios) : {};
  } catch (error) {
    console.error('Erro ao carregar análises de cenários:', error);
    return {};
  }
}



// ===== APOSENTADORIA =====

// Salvar dados de aposentadoria
export function salvarDadosAposentadoria(dados: { input: CalculadoraAposentadoriaInput; resultado: ResultadoAposentadoria; criadoEm: string }[]): void {
  try {
    localStorage.setItem(
      localStorageKeys.APOSENTADORIA_DADOS,
      JSON.stringify(dados)
    );
  } catch (error) {
    console.error('Erro ao salvar dados de aposentadoria:', error);
  }
}

// Carregar dados de aposentadoria
export function carregarDadosAposentadoria(): { input: CalculadoraAposentadoriaInput; resultado: ResultadoAposentadoria; criadoEm: string }[] {
  try {
    const dados = localStorage.getItem(localStorageKeys.APOSENTADORIA_DADOS);
    return dados ? JSON.parse(dados) : [];
  } catch (error) {
    console.error('Erro ao carregar dados de aposentadoria:', error);
    return [];
  }
}



// ===== UTILITÁRIOS GERAIS =====

// Limpar todos os dados do localStorage
export function limparTodosDados(): void {
  try {
    Object.values(localStorageKeys).forEach(key => {
      localStorage.removeItem(key);
    });
  } catch (error) {
    console.error('Erro ao limpar todos os dados:', error);
  }
}

// Exportar todos os dados
export function exportarTodosDados(): Record<string, any> {
  try {
    const dados: Record<string, any> = {};
    
    Object.entries(localStorageKeys).forEach(([key, storageKey]) => {
      const item = localStorage.getItem(storageKey);
      if (item) {
        dados[key] = JSON.parse(item);
      }
    });
    
    return dados;
  } catch (error) {
    console.error('Erro ao exportar dados:', error);
    return {};
  }
}

// Importar todos os dados
export function importarTodosDados(dados: Record<string, any>): void {
  try {
    Object.entries(dados).forEach(([key, value]) => {
      if (localStorageKeys[key as keyof typeof localStorageKeys]) {
        localStorage.setItem(localStorageKeys[key as keyof typeof localStorageKeys], JSON.stringify(value));
      }
    });
  } catch (error) {
    console.error('Erro ao importar dados:', error);
  }
}