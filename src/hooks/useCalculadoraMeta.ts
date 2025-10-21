import { useState, useCallback, useMemo, useEffect } from 'react';
import { TaxaType } from '../types';
import { salvarMetasFinanceiras, carregarMetasFinanceiras } from '../utils/localStorage';

// Modalidades de investimento disponíveis
export const modalidadesInvestimento = [
  'Poupança',
  'CDB',
  'LCI/LCA',
  'Tesouro Direto',
  'Fundos DI',
  'Fundos Multimercado',
  'Ações',
  'Fundos Imobiliários',
  'Criptomoedas'
];

// Função para obter taxa baseada no tipo e modalidade
const obterTaxaJuros = (tipo: TaxaType, modalidade: string): number => {
  const taxas: Record<string, Record<string, number>> = {
    'Poupança': { banco: 6.17, conservador: 6.17, moderado: 6.17 },
    'CDB': { banco: 9.5, conservador: 10.5, moderado: 11.5 },
    'LCI/LCA': { banco: 8.5, conservador: 9.5, moderado: 10.5 },
    'Tesouro Direto': { banco: 10.5, conservador: 11.5, moderado: 12.5 },
    'Fundos DI': { banco: 9.0, conservador: 10.0, moderado: 11.0 },
    'Fundos Multimercado': { banco: 12.0, conservador: 14.0, moderado: 16.0 },
    'Ações': { banco: 10.0, conservador: 12.0, moderado: 15.0 },
    'Fundos Imobiliários': { banco: 10.0, conservador: 12.0, moderado: 14.0 },
    'Criptomoedas': { banco: 20.0, conservador: 25.0, moderado: 35.0 }
  };

  return taxas[modalidade]?.[tipo] || 10.0;
};

export interface MetaInput {
  valorMeta: number;
  periodo: number;
  taxaType: TaxaType;
  modalidade: string;
  valorInicialDisponivel: number;
}

export interface ResultadoMeta {
  aporteNecessario: number;
  valorInicialNecessario: number;
  totalInvestido: number;
  jurosGerados: number;
  viabilidade: 'viavel' | 'dificil' | 'inviavel';
  sugestoes: string[];
  cenarios: {
    conservador: { aporte: number; valorInicial: number };
    moderado: { aporte: number; valorInicial: number };
    agressivo: { aporte: number; valorInicial: number };
  };
}

export interface MetaSalva extends MetaInput {
  id: string;
  nome: string;
  dataCriacao: Date;
  dataAlvo: Date;
  status: 'ativa' | 'pausada' | 'concluida';
  progresso: number; // 0-100
  valorAtual: number;
  tags: string[];
  observacoes?: string;
  resultado?: ResultadoMeta;
  criadoEm: string;
}

export function useCalculadoraMeta() {
  const [meta, setMeta] = useState<MetaInput>({
    valorMeta: 0,
    periodo: 0,
    taxaType: 'cdi',
    modalidade: 'cdb',
    valorInicialDisponivel: 0
  });

  const [metas, setMetas] = useState<MetaSalva[]>([]);

  // Carregar metas salvas ao inicializar
  useEffect(() => {
    const metasSalvas = carregarMetasFinanceiras();
    // Adaptar dados para o formato MetaSalva se necessário
    const metasAdaptadas = metasSalvas.map((meta: any) => {
      if (!('nome' in meta)) {
        return {
          ...meta,
          nome: `Meta ${new Date(meta.criadoEm).toLocaleDateString()}`,
          dataCriacao: new Date(meta.criadoEm),
          dataAlvo: new Date(Date.now() + meta.periodo * 30 * 24 * 60 * 60 * 1000),
          status: 'ativa' as const,
          progresso: 0,
          valorAtual: meta.valorInicialDisponivel || 0,
          tags: []
        };
      }
      return meta;
    }) as MetaSalva[];
    setMetas(metasAdaptadas);
  }, []);

  // Salvar metas sempre que houver mudanças
  useEffect(() => {
    if (metas.length > 0) {
      salvarMetasFinanceiras(metas);
    }
  }, [metas]);

  // Calcular aporte necessário para atingir a meta
  const calcularAporteMeta = useCallback((
    valorMeta: number,
    periodoMeses: number,
    taxaJuros: number,
    valorInicial: number = 0
  ): number => {
    if (periodoMeses <= 0 || taxaJuros <= 0) return 0;

    const taxaMensal = taxaJuros / 100 / 12;
    
    // Valor futuro do valor inicial
    const valorFuturoInicial = valorInicial * Math.pow(1 + taxaMensal, periodoMeses);
    
    // Valor que ainda precisa ser atingido com aportes
    const valorRestante = valorMeta - valorFuturoInicial;
    
    if (valorRestante <= 0) return 0;
    
    // Fórmula para calcular aporte necessário
    // FV = PMT * [((1 + i)^n - 1) / i]
    // PMT = FV / [((1 + i)^n - 1) / i]
    const fatorAporte = (Math.pow(1 + taxaMensal, periodoMeses) - 1) / taxaMensal;
    
    return valorRestante / fatorAporte;
  }, []);

  // Calcular valor inicial necessário (sem aportes mensais)
  const calcularValorInicialMeta = useCallback((
    valorMeta: number,
    periodoMeses: number,
    taxaJuros: number
  ): number => {
    if (periodoMeses <= 0 || taxaJuros <= 0) return valorMeta;

    const taxaMensal = taxaJuros / 100 / 12;
    
    // PV = FV / (1 + i)^n
    return valorMeta / Math.pow(1 + taxaMensal, periodoMeses);
  }, []);

  // Calcular resultado da meta
  const resultado = useMemo((): ResultadoMeta | null => {
    if (!meta.valorMeta || !meta.periodo) return null;

    const taxaJuros = obterTaxaJuros(meta.taxaType, meta.modalidade);
    
    const aporteNecessario = calcularAporteMeta(
      meta.valorMeta,
      meta.periodo,
      taxaJuros,
      meta.valorInicialDisponivel
    );

    const valorInicialNecessario = calcularValorInicialMeta(
      meta.valorMeta,
      meta.periodo,
      taxaJuros
    );

    const totalInvestido = meta.valorInicialDisponivel + (aporteNecessario * meta.periodo);
    const jurosGerados = meta.valorMeta - totalInvestido;

    // Determinar viabilidade
    let viabilidade: 'viavel' | 'dificil' | 'inviavel' = 'viavel';
    const sugestoes: string[] = [];

    // Critérios de viabilidade
    const aporteAlto = aporteNecessario > 5000;
    const valorInicialAlto = valorInicialNecessario > 50000;
    const periodoMuitoCurto = meta.periodo < 12;
    const metaMuitoAlta = meta.valorMeta > 1000000;

    if (aporteAlto || valorInicialAlto || periodoMuitoCurto) {
      viabilidade = 'dificil';
    }

    if (aporteNecessario > 10000 || valorInicialNecessario > 100000 || metaMuitoAlta) {
      viabilidade = 'inviavel';
    }

    // Gerar sugestões
    if (aporteAlto) {
      sugestoes.push('Considere aumentar o prazo para reduzir o aporte mensal necessário');
      sugestoes.push('Avalie investimentos com maior rentabilidade');
    }

    if (valorInicialAlto) {
      sugestoes.push('Considere fazer aportes mensais para reduzir o valor inicial necessário');
    }

    if (periodoMuitoCurto) {
      sugestoes.push('Um prazo maior permitirá maior crescimento dos juros compostos');
    }

    if (taxaJuros < 10) {
      sugestoes.push('Investimentos de maior risco podem oferecer retornos superiores');
    }

    if (sugestoes.length === 0) {
      sugestoes.push('Meta bem estruturada! Continue com disciplina nos aportes');
    }

    // Calcular cenários alternativos
    const cenarios = {
      conservador: {
        aporte: calcularAporteMeta(meta.valorMeta, meta.periodo, 8, meta.valorInicialDisponivel),
        valorInicial: calcularValorInicialMeta(meta.valorMeta, meta.periodo, 8)
      },
      moderado: {
        aporte: calcularAporteMeta(meta.valorMeta, meta.periodo, 12, meta.valorInicialDisponivel),
        valorInicial: calcularValorInicialMeta(meta.valorMeta, meta.periodo, 12)
      },
      agressivo: {
        aporte: calcularAporteMeta(meta.valorMeta, meta.periodo, 18, meta.valorInicialDisponivel),
        valorInicial: calcularValorInicialMeta(meta.valorMeta, meta.periodo, 18)
      }
    };

    return {
      aporteNecessario,
      valorInicialNecessario,
      totalInvestido,
      jurosGerados,
      viabilidade,
      sugestoes,
      cenarios
    };
  }, [meta, calcularAporteMeta, calcularValorInicialMeta]);

  // Calcular diferentes cenários de prazo
  const calcularCenariosPrazo = useCallback(() => {
    if (!meta.valorMeta) return [];

    const taxaJuros = obterTaxaJuros(meta.taxaType, meta.modalidade);
    const prazos = [12, 24, 36, 48, 60, 72, 84, 96, 120];

    return prazos.map(prazo => {
      const aporte = calcularAporteMeta(
        meta.valorMeta,
        prazo,
        taxaJuros,
        meta.valorInicialDisponivel
      );

      const totalInvestido = meta.valorInicialDisponivel + (aporte * prazo);
      const jurosGerados = meta.valorMeta - totalInvestido;

      return {
        prazoMeses: prazo,
        prazoAnos: prazo / 12,
        aporteNecessario: aporte,
        totalInvestido,
        jurosGerados,
        percentualJuros: (jurosGerados / totalInvestido) * 100
      };
    });
  }, [meta, calcularAporteMeta]);

  // Calcular impacto de diferentes valores iniciais
  const calcularCenariosValorInicial = useCallback(() => {
    if (!meta.valorMeta || !meta.periodo) return [];

    const taxaJuros = obterTaxaJuros(meta.taxaType, meta.modalidade);
    const valoresIniciais = [0, 5000, 10000, 20000, 30000, 50000];

    return valoresIniciais.map(valorInicial => {
      const aporte = calcularAporteMeta(
        meta.valorMeta,
        meta.periodo,
        taxaJuros,
        valorInicial
      );

      const totalInvestido = valorInicial + (aporte * meta.periodo);
      const jurosGerados = meta.valorMeta - totalInvestido;

      return {
        valorInicial,
        aporteNecessario: aporte,
        totalInvestido,
        jurosGerados,
        reducaoAporte: valorInicial > 0 ? 
          calcularAporteMeta(meta.valorMeta, meta.periodo, taxaJuros, 0) - aporte : 0
      };
    });
  }, [meta, calcularAporteMeta]);

  // Funções de gerenciamento de metas
  const salvarMeta = useCallback((nome: string, observacoes?: string) => {
    const novaMeta: MetaSalva = {
      ...meta,
      id: Date.now().toString(),
      nome,
      dataCriacao: new Date(),
      dataAlvo: new Date(Date.now() + meta.periodo * 30 * 24 * 60 * 60 * 1000),
      status: 'ativa',
      progresso: 0,
      valorAtual: meta.valorInicialDisponivel,
      tags: [],
      observacoes,
      resultado,
      criadoEm: new Date().toISOString()
    };

    setMetas(prev => [...prev, novaMeta]);
    return novaMeta.id;
  }, [meta]);

  const atualizarMeta = useCallback((id: string, updates: Partial<MetaSalva>) => {
    setMetas(prev => prev.map(m => m.id === id ? { ...m, ...updates } : m));
  }, []);

  const removerMeta = useCallback((id: string) => {
    setMetas(prev => prev.filter(m => m.id !== id));
  }, []);

  const atualizarProgressoMeta = useCallback((id: string, valorAtual: number) => {
    setMetas(prev => prev.map(m => {
      if (m.id === id) {
        const progresso = Math.min((valorAtual / m.valorMeta) * 100, 100);
        const status = progresso >= 100 ? 'concluida' : m.status;
        return { ...m, valorAtual, progresso, status };
      }
      return m;
    }));
  }, []);

  const obterMetasPorStatus = useCallback((status: MetaSalva['status']) => {
    return metas.filter(m => m.status === status);
  }, [metas]);

  const obterEstatisticasMetas = useCallback(() => {
    const total = metas.length;
    const ativas = metas.filter(m => m.status === 'ativa').length;
    const concluidas = metas.filter(m => m.status === 'concluida').length;
    const pausadas = metas.filter(m => m.status === 'pausada').length;
    
    const valorTotalMetas = metas.reduce((acc, m) => acc + m.valorMeta, 0);
    const valorAtualTotal = metas.reduce((acc, m) => acc + m.valorAtual, 0);
    const progressoMedio = total > 0 ? metas.reduce((acc, m) => acc + m.progresso, 0) / total : 0;

    return {
      total,
      ativas,
      concluidas,
      pausadas,
      valorTotalMetas,
      valorAtualTotal,
      progressoMedio
    };
  }, [metas]);

  return {
    // Estado atual
    meta,
    resultado,
    metas,
    
    // Funções básicas
    setMeta,
    calcularCenariosPrazo,
    calcularCenariosValorInicial,
    
    // Gerenciamento de metas
    salvarMeta,
    atualizarMeta,
    removerMeta,
    atualizarProgressoMeta,
    obterMetasPorStatus,
    obterEstatisticasMetas,
    
    // Helpers
    atualizarMetaAtual: useCallback((campo: keyof MetaInput, valor: any) => {
      setMeta(prev => ({ ...prev, [campo]: valor }));
    }, [])
  };
}