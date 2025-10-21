import { SimulacaoInput, ComparacaoInvestimento, Theme, CalculadoraAposentadoriaInput, ResultadoAposentadoria } from '../types';
import { localStorageKeys } from '../constants';
import { HistoricoItem } from '../hooks/useHistorico';
import { MetaInput, ResultadoMeta } from '../hooks/useCalculadoraMeta';
import { PerfilInvestidor, RecomendacaoIA, AlertaInteligente, AnaliseRiscoIA, ConfiguracaoIA } from '../hooks/useRecomendacoesIA';

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

// ===== PERFORMANCE DASHBOARD =====

// Salvar dados do dashboard de performance
export function salvarPerformanceDashboard(dados: Record<string, any>): void {
  try {
    localStorage.setItem(
      localStorageKeys.PERFORMANCE_DASHBOARD,
      JSON.stringify(dados)
    );
  } catch (error) {
    console.error('Erro ao salvar performance dashboard:', error);
  }
}

// Carregar dados do dashboard de performance
export function carregarPerformanceDashboard(): Record<string, any> {
  try {
    const dados = localStorage.getItem(localStorageKeys.PERFORMANCE_DASHBOARD);
    return dados ? JSON.parse(dados) : {};
  } catch (error) {
    console.error('Erro ao carregar performance dashboard:', error);
    return {};
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

// ===== RECOMENDAÇÕES IA =====

// Salvar recomendações IA
export function salvarRecomendacoesIA(recomendacoes: RecomendacaoIA[]): void {
  try {
    localStorage.setItem(
      localStorageKeys.RECOMENDACOES_IA,
      JSON.stringify(recomendacoes)
    );
  } catch (error) {
    console.error('Erro ao salvar recomendações IA:', error);
  }
}

// Carregar recomendações IA
export function carregarRecomendacoesIA(): RecomendacaoIA[] {
  try {
    const recomendacoes = localStorage.getItem(localStorageKeys.RECOMENDACOES_IA);
    return recomendacoes ? JSON.parse(recomendacoes) : [];
  } catch (error) {
    console.error('Erro ao carregar recomendações IA:', error);
    return [];
  }
}

// ===== PERFIL INVESTIDOR =====

// Salvar perfil do investidor
export function salvarPerfilInvestidor(perfil: PerfilInvestidor): void {
  try {
    localStorage.setItem(
      localStorageKeys.PERFIL_INVESTIDOR,
      JSON.stringify(perfil)
    );
  } catch (error) {
    console.error('Erro ao salvar perfil investidor:', error);
  }
}

// Carregar perfil do investidor
export function carregarPerfilInvestidor(): PerfilInvestidor | null {
  try {
    const perfil = localStorage.getItem(localStorageKeys.PERFIL_INVESTIDOR);
    return perfil ? JSON.parse(perfil) : null;
  } catch (error) {
    console.error('Erro ao carregar perfil investidor:', error);
    return null;
  }
}

// ===== ALERTAS INTELIGENTES =====

// Salvar alertas inteligentes
export function salvarAlertasInteligentes(alertas: AlertaInteligente[]): void {
  try {
    localStorage.setItem(
      localStorageKeys.ALERTAS_INTELIGENTES,
      JSON.stringify(alertas)
    );
  } catch (error) {
    console.error('Erro ao salvar alertas inteligentes:', error);
  }
}

// Carregar alertas inteligentes
export function carregarAlertasInteligentes(): AlertaInteligente[] {
  try {
    const alertas = localStorage.getItem(localStorageKeys.ALERTAS_INTELIGENTES);
    return alertas ? JSON.parse(alertas) : [];
  } catch (error) {
    console.error('Erro ao carregar alertas inteligentes:', error);
    return [];
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

// ===== CONFIGURAÇÕES IA =====

// Salvar configurações IA
export function salvarConfiguracaoIA(config: ConfiguracaoIA): void {
  try {
    localStorage.setItem(
      'jurus_configuracao_ia',
      JSON.stringify(config)
    );
  } catch (error) {
    console.error('Erro ao salvar configuração IA:', error);
  }
}

// Carregar configurações IA
export function carregarConfiguracaoIA(): ConfiguracaoIA | null {
  try {
    const config = localStorage.getItem('jurus_configuracao_ia');
    return config ? JSON.parse(config) : null;
  } catch (error) {
    console.error('Erro ao carregar configuração IA:', error);
    return null;
  }
}

// ===== ANÁLISE DE RISCO =====

// Salvar análise de risco
export function salvarAnaliseRisco(analise: AnaliseRiscoIA): void {
  try {
    localStorage.setItem(
      'jurus_analise_risco',
      JSON.stringify(analise)
    );
  } catch (error) {
    console.error('Erro ao salvar análise de risco:', error);
  }
}

// Carregar análise de risco
export function carregarAnaliseRisco(): AnaliseRiscoIA | null {
  try {
    const analise = localStorage.getItem('jurus_analise_risco');
    return analise ? JSON.parse(analise) : null;
  } catch (error) {
    console.error('Erro ao carregar análise de risco:', error);
    return null;
  }
}

// ===== UTILITÁRIOS GERAIS =====

// Limpar todos os dados do localStorage
export function limparTodosDados(): void {
  try {
    Object.values(localStorageKeys).forEach(key => {
      localStorage.removeItem(key);
    });
    // Limpar também as chaves adicionais
    localStorage.removeItem('jurus_configuracao_ia');
    localStorage.removeItem('jurus_analise_risco');
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
    
    // Incluir dados adicionais
    const configIA = localStorage.getItem('jurus_configuracao_ia');
    if (configIA) dados.CONFIGURACAO_IA = JSON.parse(configIA);
    
    const analiseRisco = localStorage.getItem('jurus_analise_risco');
    if (analiseRisco) dados.ANALISE_RISCO = JSON.parse(analiseRisco);
    
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
      if (key === 'CONFIGURACAO_IA') {
        localStorage.setItem('jurus_configuracao_ia', JSON.stringify(value));
      } else if (key === 'ANALISE_RISCO') {
        localStorage.setItem('jurus_analise_risco', JSON.stringify(value));
      } else if (localStorageKeys[key as keyof typeof localStorageKeys]) {
        localStorage.setItem(localStorageKeys[key as keyof typeof localStorageKeys], JSON.stringify(value));
      }
    });
  } catch (error) {
    console.error('Erro ao importar dados:', error);
  }
}