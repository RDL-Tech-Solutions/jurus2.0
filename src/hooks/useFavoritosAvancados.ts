import { useMemo, useCallback } from 'react';
import { useFavoritos } from '../store/useAppStore';
import { 
  filtrarSimulacoes, 
  gerarEstatisticas, 
  exportarSimulacoes,
  criarSimulacaoFavorita,
  criarTag,
  compararSimulacoes,
  formatarMoeda,
  formatarPorcentagem,
  validarSimulacaoFavorita
} from '../utils/favoritos';
import { SimulacaoInput } from '../types';
import { Simulacao, ResultadoSimulacao } from '../types/simulacao';
import { SimulacaoFavorita, ComparacaoSimulacoes, Tag } from '../types/favoritos';

export const useFavoritosAvancados = () => {
  const {
    simulacoesFavoritas,
    comparacoesSimulacoes,
    tags,
    filtrosFavoritos,
    adicionarSimulacaoFavorita,
    atualizarSimulacaoFavorita,
    removerSimulacaoFavorita,
    toggleFavorita,
    duplicarSimulacaoFavorita,
    adicionarComparacaoSimulacoes,
    atualizarComparacaoSimulacoes,
    removerComparacaoSimulacoes,
    adicionarTag,
    atualizarTag,
    removerTag,
    setFiltrosFavoritos,
    limparFavoritos
  } = useFavoritos();

  // Simulações filtradas
  const simulacoesFiltradas = useMemo(() => {
    return filtrarSimulacoes(simulacoesFavoritas, filtrosFavoritos);
  }, [simulacoesFavoritas, filtrosFavoritos]);

  // Estatísticas computadas
  const estatisticas = useMemo(() => {
    return gerarEstatisticas(simulacoesFavoritas, tags);
  }, [simulacoesFavoritas, tags]);

  // Simulações agrupadas por categoria
  const simulacoesPorCategoria = useMemo(() => {
    const grupos: Record<string, SimulacaoFavorita[]> = {};
    simulacoesFiltradas.forEach(sim => {
      if (!grupos[sim.categoria]) {
        grupos[sim.categoria] = [];
      }
      grupos[sim.categoria].push(sim);
    });
    return grupos;
  }, [simulacoesFiltradas]);

  // Tags mais usadas
  const tagsPopulares = useMemo(() => {
    const usoTags: Record<string, number> = {};
    simulacoesFavoritas.forEach(sim => {
      sim.tags.forEach(tagId => {
        usoTags[tagId] = (usoTags[tagId] || 0) + 1;
      });
    });

    return tags
      .map(tag => ({
        ...tag,
        uso: usoTags[tag.id] || 0
      }))
      .sort((a, b) => b.uso - a.uso)
      .slice(0, 10);
  }, [simulacoesFavoritas, tags]);

  // Simulações recentes
  const simulacoesRecentes = useMemo(() => {
    return [...simulacoesFavoritas]
      .sort((a, b) => b.dataCriacao.getTime() - a.dataCriacao.getTime())
      .slice(0, 5);
  }, [simulacoesFavoritas]);

  // Melhores simulações (por rendimento)
  const melhoresSimulacoes = useMemo(() => {
    return simulacoesFavoritas
      .filter(sim => sim.resultado)
      .sort((a, b) => (b.resultado?.valorFinal || 0) - (a.resultado?.valorFinal || 0))
      .slice(0, 5);
  }, [simulacoesFavoritas]);

  // Função auxiliar para converter SimulacaoInput para Simulacao
  const converterSimulacaoInput = (simulacaoInput: SimulacaoInput): Simulacao => {
    return {
      id: Date.now().toString(),
      nome: 'Simulação',
      tipo: 'juros_compostos',
      parametros: {
        valorInicial: simulacaoInput.valorInicial,
        valorMensal: simulacaoInput.valorMensal,
        taxa: simulacaoInput.taxaPersonalizada || simulacaoInput.modalidade?.taxaAnual || 0,
        periodo: simulacaoInput.periodo,
        tipoTaxa: simulacaoInput.unidadePeriodo === 'anos' ? 'anual' : 'mensal',
        tipoCalculo: 'juros_compostos'
      },
      dataCreacao: new Date()
    };
  };

  // Função para salvar como favorita
  const salvarComoFavorita = useCallback((
    nome: string,
    simulacao: SimulacaoInput,
    resultado?: ResultadoSimulacao,
    opcoes?: Partial<SimulacaoFavorita>
  ) => {
    const simulacaoConvertida = converterSimulacaoInput(simulacao);
    const erros = validarSimulacaoFavorita({ nome, simulacao: simulacaoConvertida, ...opcoes });
    if (erros.length > 0) {
      throw new Error(erros.join(', '));
    }

    const simulacaoFavorita = criarSimulacaoFavorita(nome, simulacaoConvertida, resultado, opcoes);
    adicionarSimulacaoFavorita(simulacaoFavorita);
    return simulacaoFavorita.id;
  }, [adicionarSimulacaoFavorita]);

  // Função para criar nova tag
  const criarNovaTag = useCallback((
    nome: string,
    opcoes?: Partial<Tag>
  ) => {
    const tag = criarTag(nome, opcoes);
    adicionarTag(tag);
    return tag.id;
  }, [adicionarTag]);

  // Função para comparar múltiplas simulações
  const criarComparacao = useCallback((
    simulacoes: SimulacaoFavorita[],
    nome?: string
  ) => {
    if (simulacoes.length < 2) {
      throw new Error('É necessário pelo menos 2 simulações para comparar');
    }

    const comparacao = compararSimulacoes(simulacoes);
    if (nome) {
      comparacao.nome = nome;
    }

    adicionarComparacaoSimulacoes(comparacao);
    return comparacao.id;
  }, [adicionarComparacaoSimulacoes]);

  // Função para exportar simulações
  const exportar = useCallback(async (
    formato: 'json' | 'csv' | 'excel',
    simulacoesSelecionadas?: SimulacaoFavorita[]
  ) => {
    const simulacoesParaExportar = simulacoesSelecionadas || simulacoesFiltradas;
    return await exportarSimulacoes(simulacoesParaExportar, formato);
  }, [simulacoesFiltradas]);

  // Função para buscar simulações
  const buscarSimulacoes = useCallback((termo: string) => {
    setFiltrosFavoritos({ busca: termo });
  }, [setFiltrosFavoritos]);

  // Função para filtrar por tags
  const filtrarPorTags = useCallback((tagIds: string[]) => {
    setFiltrosFavoritos({ tags: tagIds });
  }, [setFiltrosFavoritos]);

  // Função para filtrar por categoria
  const filtrarPorCategoria = useCallback((categorias: string[]) => {
    setFiltrosFavoritos({ categoria: categorias });
  }, [setFiltrosFavoritos]);

  // Função para ordenar simulações
  const ordenarSimulacoes = useCallback((
    criterio: 'nome' | 'data' | 'categoria' | 'rendimento',
    crescente: boolean = true
  ) => {
    setFiltrosFavoritos({ 
      ordenarPor: criterio, 
      ordemCrescente: crescente 
    });
  }, [setFiltrosFavoritos]);

  // Função para limpar filtros
  const limparFiltros = useCallback(() => {
    setFiltrosFavoritos({
      busca: '',
      tags: [],
      categoria: [],
      periodo: {},
      ordenarPor: 'data',
      ordemCrescente: false,
      apenasComResultado: false,
      apenasFavoritas: false
    });
  }, [setFiltrosFavoritos]);

  // Função para incrementar visualizações
  const incrementarVisualizacoes = useCallback((id: string) => {
    const simulacao = simulacoesFavoritas.find(sim => sim.id === id);
    if (simulacao && simulacao.estatisticas) {
      atualizarSimulacaoFavorita(id, {
        estatisticas: {
          ...simulacao.estatisticas,
          visualizacoes: simulacao.estatisticas.visualizacoes + 1
        }
      });
    }
  }, [simulacoesFavoritas, atualizarSimulacaoFavorita]);

  // Função para adicionar tag a uma simulação
  const adicionarTagASimulacao = useCallback((simulacaoId: string, tagId: string) => {
    const simulacao = simulacoesFavoritas.find(sim => sim.id === simulacaoId);
    if (simulacao && !simulacao.tags.includes(tagId)) {
      atualizarSimulacaoFavorita(simulacaoId, {
        tags: [...simulacao.tags, tagId]
      });
    }
  }, [simulacoesFavoritas, atualizarSimulacaoFavorita]);

  // Função para remover tag de uma simulação
  const removerTagDeSimulacao = useCallback((simulacaoId: string, tagId: string) => {
    const simulacao = simulacoesFavoritas.find(sim => sim.id === simulacaoId);
    if (simulacao) {
      atualizarSimulacaoFavorita(simulacaoId, {
        tags: simulacao.tags.filter(id => id !== tagId)
      });
    }
  }, [simulacoesFavoritas, atualizarSimulacaoFavorita]);

  // Função para obter simulações similares
  const obterSimulacoesSimilares = useCallback((simulacaoId: string, limite: number = 5) => {
    const simulacao = simulacoesFavoritas.find(sim => sim.id === simulacaoId);
    if (!simulacao) return [];

    const { valorInicial, periodo } = simulacao.simulacao.parametros;
    
    return simulacoesFavoritas
      .filter(sim => sim.id !== simulacaoId)
      .map(sim => {
        let pontuacao = 0;
        
        // Similaridade por valor inicial (±20%)
        const diffValor = Math.abs(sim.simulacao.parametros.valorInicial - valorInicial) / valorInicial;
        if (diffValor <= 0.2) pontuacao += 3;
        else if (diffValor <= 0.5) pontuacao += 1;
        
        // Similaridade por período (±6 meses)
        const diffPeriodo = Math.abs(sim.simulacao.parametros.periodo - periodo);
        if (diffPeriodo <= 6) pontuacao += 2;
        else if (diffPeriodo <= 12) pontuacao += 1;
        
        // Mesmo tipo de simulação
        if (sim.simulacao.tipo === simulacao.simulacao.tipo) pontuacao += 2;
        
        // Mesma categoria
        if (sim.categoria === simulacao.categoria) pontuacao += 1;
        
        // Tags em comum
        const tagsComuns = sim.tags.filter(tag => simulacao.tags.includes(tag));
        pontuacao += tagsComuns.length * 0.5;
        
        return { simulacao: sim, pontuacao };
      })
      .sort((a, b) => b.pontuacao - a.pontuacao)
      .slice(0, limite)
      .map(item => item.simulacao);
  }, [simulacoesFavoritas]);

  return {
    // Estados
    simulacoesFavoritas,
    simulacoesFiltradas,
    comparacoesSimulacoes,
    tags,
    tagsPopulares,
    filtrosFavoritos,
    estatisticas,
    simulacoesPorCategoria,
    simulacoesRecentes,
    melhoresSimulacoes,

    // Actions básicas
    adicionarSimulacaoFavorita,
    atualizarSimulacaoFavorita,
    removerSimulacaoFavorita,
    toggleFavorita,
    duplicarSimulacaoFavorita,
    adicionarComparacaoSimulacoes,
    atualizarComparacaoSimulacoes,
    removerComparacaoSimulacoes,
    adicionarTag,
    atualizarTag,
    removerTag,
    limparFavoritos,

    // Actions avançadas
    salvarComoFavorita,
    criarNovaTag,
    criarComparacao,
    exportar,
    buscarSimulacoes,
    filtrarPorTags,
    filtrarPorCategoria,
    ordenarSimulacoes,
    limparFiltros,
    incrementarVisualizacoes,
    adicionarTagASimulacao,
    removerTagDeSimulacao,
    obterSimulacoesSimilares,

    // Utilitários
    formatarMoeda,
    formatarPorcentagem
  };
};