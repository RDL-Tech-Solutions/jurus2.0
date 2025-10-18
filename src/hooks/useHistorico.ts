import { useState, useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { SimulacaoInput, ResultadoSimulacao } from '../types';

export interface HistoricoItem {
  id: string;
  nome: string;
  simulacao: SimulacaoInput;
  resultado: ResultadoSimulacao;
  dataSimulacao: string;
  isFavorito: boolean;
  tags: string[];
}

export function useHistorico() {
  const [historico, setHistorico] = useLocalStorage<HistoricoItem[]>('historico-simulacoes', []);
  const [filtroTags, setFiltroTags] = useState<string[]>([]);
  const [ordenacao, setOrdenacao] = useState<'data' | 'nome' | 'valor'>('data');

  // Adicionar simulação ao histórico
  const adicionarAoHistorico = useCallback((
    nome: string,
    simulacao: SimulacaoInput,
    resultado: ResultadoSimulacao,
    tags: string[] = []
  ) => {
    const novoItem: HistoricoItem = {
      id: Date.now().toString(),
      nome: nome || `Simulação ${new Date().toLocaleDateString()}`,
      simulacao,
      resultado,
      dataSimulacao: new Date().toISOString(),
      isFavorito: false,
      tags
    };

    setHistorico(prev => [novoItem, ...prev]);
    return novoItem.id;
  }, [setHistorico]);

  // Remover simulação do histórico
  const removerDoHistorico = useCallback((id: string) => {
    setHistorico(prev => prev.filter(item => item.id !== id));
  }, [setHistorico]);

  // Alternar favorito
  const alternarFavorito = useCallback((id: string) => {
    setHistorico((prev: HistoricoItem[]) => 
      prev.map(item => 
        item.id === id 
          ? { ...item, isFavorito: !item.isFavorito }
          : item
      )
    );
  }, [setHistorico]);

  // Atualizar nome da simulação
  const atualizarNome = useCallback((id: string, novoNome: string) => {
    setHistorico((prev: HistoricoItem[]) => 
      prev.map(item => 
        item.id === id 
          ? { ...item, nome: novoNome }
          : item
      )
    );
  }, [setHistorico]);

  // Atualizar tags
  const atualizarTags = useCallback((id: string, novasTags: string[]) => {
    setHistorico((prev: HistoricoItem[]) => 
      prev.map(item => 
        item.id === id 
          ? { ...item, tags: novasTags }
          : item
      )
    );
  }, [setHistorico]);

  // Limpar histórico
  const limparHistorico = useCallback(() => {
    setHistorico([]);
  }, [setHistorico]);

  // Obter histórico filtrado e ordenado
  const historicoFiltrado = useCallback(() => {
    let items = [...historico];

    // Filtrar por tags
    if (filtroTags.length > 0) {
      items = items.filter(item => 
        filtroTags.some(tag => item.tags.includes(tag))
      );
    }

    // Ordenar
    items.sort((a, b) => {
      switch (ordenacao) {
        case 'nome':
          return a.nome.localeCompare(b.nome);
        case 'valor':
          return b.resultado.saldoFinal - a.resultado.saldoFinal;
        case 'data':
        default:
          return new Date(b.dataSimulacao).getTime() - new Date(a.dataSimulacao).getTime();
      }
    });

    return items;
  }, [historico, filtroTags, ordenacao]);

  // Obter favoritos
  const favoritos = useCallback(() => {
    return historico.filter(item => item.isFavorito);
  }, [historico]);

  // Obter todas as tags únicas
  const todasAsTags = useCallback(() => {
    const tags = new Set<string>();
    historico.forEach(item => {
      item.tags.forEach(tag => tags.add(tag));
    });
    return Array.from(tags).sort();
  }, [historico]);

  // Obter estatísticas do histórico
  const estatisticas = useCallback(() => {
    if (historico.length === 0) {
      return {
        totalSimulacoes: 0,
        totalFavoritos: 0,
        maiorSaldo: 0,
        menorSaldo: 0,
        saldoMedio: 0,
        modalidadeMaisUsada: '',
        periodoMedio: 0
      };
    }

    const saldos = historico.map(item => item.resultado.saldoFinal);
    const modalidades = historico.map(item => item.simulacao.modalidade?.nome || '');
    const periodos = historico.map(item => item.simulacao.periodo);

    // Contar modalidades
    const contadorModalidades = modalidades.reduce((acc, modalidade) => {
      acc[modalidade] = (acc[modalidade] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const modalidadeMaisUsada = Object.entries(contadorModalidades)
      .sort(([,a], [,b]) => (b as number) - (a as number))[0]?.[0] || '';

    return {
      totalSimulacoes: historico.length,
      totalFavoritos: favoritos().length,
      maiorSaldo: Math.max(...saldos),
      menorSaldo: Math.min(...saldos),
      saldoMedio: saldos.reduce((a, b) => a + b, 0) / saldos.length,
      modalidadeMaisUsada,
      periodoMedio: periodos.reduce((a, b) => a + b, 0) / periodos.length
    };
  }, [historico, favoritos]);

  // Buscar simulação por ID
  const buscarPorId = useCallback((id: string) => {
    return historico.find(item => item.id === id);
  }, [historico]);

  // Duplicar simulação
  const duplicarSimulacao = useCallback((id: string, novoNome?: string) => {
    const item = buscarPorId(id);
    if (!item) return null;

    return adicionarAoHistorico(
      novoNome || `${item.nome} (Cópia)`,
      item.simulacao,
      item.resultado,
      item.tags
    );
  }, [buscarPorId, adicionarAoHistorico]);

  return {
    historico: historicoFiltrado(),
    favoritos: favoritos(),
    todasAsTags: todasAsTags(),
    estatisticas: estatisticas(),
    filtroTags,
    ordenacao,
    
    // Actions
    adicionarAoHistorico,
    removerDoHistorico,
    alternarFavorito,
    atualizarNome,
    atualizarTags,
    limparHistorico,
    duplicarSimulacao,
    buscarPorId,
    
    // Filters
    setFiltroTags,
    setOrdenacao
  };
}