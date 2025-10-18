import { useState, useEffect, useCallback } from 'react';
import { ComparacaoInvestimento, SimulacaoInput } from '../types';
import { calcularJurosCompostos } from '../utils/calculations';
import { salvarComparacoes, carregarComparacoes, limparComparacoes } from '../utils/localStorage';
import { coresComparacao } from '../constants';

export function useComparacao() {
  const [comparacoes, setComparacoes] = useState<ComparacaoInvestimento[]>([]);

  // Carregar comparações salvas ao inicializar
  useEffect(() => {
    const comparacoesSalvas = carregarComparacoes();
    setComparacoes(comparacoesSalvas);
  }, []);

  // Salvar comparações sempre que houver mudanças
  useEffect(() => {
    salvarComparacoes(comparacoes);
  }, [comparacoes]);

  // Adicionar nova comparação
  const adicionarComparacao = useCallback((simulacao: SimulacaoInput, nome: string) => {
    if (comparacoes.length >= 3) {
      console.warn('Máximo de 3 comparações permitidas');
      return;
    }

    const resultado = calcularJurosCompostos(simulacao);
    const cor = coresComparacao[comparacoes.length] || coresComparacao[0];
    
    const novaComparacao: ComparacaoInvestimento = {
      id: Date.now().toString(),
      nome,
      simulacao,
      resultado,
      cor
    };

    setComparacoes(prev => [...prev, novaComparacao]);
  }, [comparacoes.length]);

  // Remover comparação específica
  const removerComparacao = useCallback((id: string) => {
    setComparacoes(prev => prev.filter(comp => comp.id !== id));
  }, []);

  // Limpar todas as comparações
  const limparTodasComparacoes = useCallback(() => {
    setComparacoes([]);
    limparComparacoes();
  }, []);

  // Atualizar comparação existente
  const atualizarComparacao = useCallback((id: string, simulacao: SimulacaoInput, nome?: string) => {
    setComparacoes(prev => prev.map(comp => {
      if (comp.id === id) {
        const resultado = calcularJurosCompostos(simulacao);
        return {
          ...comp,
          nome: nome || comp.nome,
          simulacao,
          resultado
        };
      }
      return comp;
    }));
  }, []);

  // Obter melhor investimento
  const melhorInvestimento = useCallback(() => {
    if (comparacoes.length === 0) return null;
    
    return comparacoes.reduce((melhor, atual) => {
      return atual.resultado.saldoFinal > melhor.resultado.saldoFinal ? atual : melhor;
    });
  }, [comparacoes]);

  // Obter diferença entre investimentos
  const obterDiferencas = useCallback(() => {
    if (comparacoes.length < 2) return [];
    
    const melhor = melhorInvestimento();
    if (!melhor) return [];

    return comparacoes.map(comp => ({
      id: comp.id,
      nome: comp.nome,
      diferenca: comp.resultado.saldoFinal - melhor.resultado.saldoFinal,
      percentualDiferenca: ((comp.resultado.saldoFinal / melhor.resultado.saldoFinal) - 1) * 100
    }));
  }, [comparacoes, melhorInvestimento]);

  return {
    comparacoes,
    adicionarComparacao,
    removerComparacao,
    limparComparacoes: limparTodasComparacoes,
    atualizarComparacao,
    melhorInvestimento: melhorInvestimento(),
    diferencas: obterDiferencas(),
    podeAdicionarMais: comparacoes.length < 3,
    quantidadeComparacoes: comparacoes.length
  };
}