import { useCallback, useMemo } from 'react';
import { useMetas } from '../store/useAppStore';
import { MetaFinanceira, ProgressoMeta, NotificacaoMeta } from '../types/metas';
import { useToast } from './useToast';

export const useMetasFinanceiras = () => {
  const { success: toast } = useToast();
  const {
    metas,
    notificacoesMetas,
    adicionarMeta,
    atualizarMeta,
    removerMeta,
    adicionarContribuicaoMeta,
    calcularProgressoMeta,
    adicionarNotificacaoMeta,
    marcarNotificacaoLida,
    limparNotificacoesMetas
  } = useMetas();

  // Calcular estatísticas das metas
  const estatisticas = useMemo(() => {
    const total = metas.length;
    const concluidas = metas.filter(meta => meta.status === 'concluida').length;
    const emAndamento = metas.filter(meta => meta.status === 'ativa').length;
    const pausadas = metas.filter(meta => meta.status === 'pausada').length;
    const atrasadas = metas.filter(meta => {
      const hoje = new Date();
      return meta.status === 'ativa' && 
             meta.dataLimite && 
             new Date(meta.dataLimite) < hoje &&
             meta.valorAtual < meta.valorMeta;
    }).length;

    const valorTotalMetas = metas.reduce((acc, meta) => acc + meta.valorMeta, 0);
    const valorTotalAtual = metas.reduce((acc, meta) => acc + meta.valorAtual, 0);
    const progressoGeral = valorTotalMetas > 0 ? (valorTotalAtual / valorTotalMetas) * 100 : 0;

    return {
      total,
      concluidas,
      emAndamento,
      pausadas,
      atrasadas,
      valorTotalMetas,
      valorTotalAtual,
      progressoGeral
    };
  }, [metas]);

  // Metas por categoria
  const metasPorCategoria = useMemo(() => {
    return metas.reduce((acc, meta) => {
      if (!acc[meta.categoria]) {
        acc[meta.categoria] = [];
      }
      acc[meta.categoria].push(meta);
      return acc;
    }, {} as Record<string, MetaFinanceira[]>);
  }, [metas]);

  // Metas próximas do vencimento
  const metasProximasVencimento = useMemo(() => {
    const hoje = new Date();
    const proximoMes = new Date(hoje.getFullYear(), hoje.getMonth() + 1, hoje.getDate());
    
    return metas.filter(meta => {
      if (!meta.dataLimite || meta.status === 'concluida') return false;
      const dataLimite = new Date(meta.dataLimite);
      return dataLimite <= proximoMes && dataLimite >= hoje;
    });
  }, [metas]);

  // Criar nova meta
  const criarMeta = useCallback((dadosMeta: Omit<MetaFinanceira, 'id' | 'valorAtual' | 'status' | 'historico'>) => {
    const novaMeta: MetaFinanceira = {
      ...dadosMeta,
      id: crypto.randomUUID(),
      valorAtual: 0,
      status: 'ativa',
      historico: []
    };

    adicionarMeta(novaMeta);
    toast(`Meta "${novaMeta.nome}" criada com sucesso!`);
    
    return novaMeta;
  }, [adicionarMeta]);

  // Atualizar meta existente
  const editarMeta = useCallback((id: string, dadosAtualizados: Partial<MetaFinanceira>) => {
    atualizarMeta(id, dadosAtualizados);
    toast('Meta atualizada com sucesso!');
  }, [atualizarMeta]);

  // Excluir meta
  const excluirMeta = useCallback((id: string) => {
    const meta = metas.find(m => m.id === id);
    if (meta) {
      removerMeta(id);
      toast(`Meta "${meta.nome}" removida com sucesso!`);
    }
  }, [metas, removerMeta]);

  // Adicionar contribuição
  const adicionarContribuicao = useCallback((id: string, valor: number, descricao?: string) => {
    const meta = metas.find(m => m.id === id);
    if (!meta) return;

    adicionarContribuicaoMeta(id, valor, descricao);
    
    const novoValorAtual = meta.valorAtual + valor;
    const progresso = (novoValorAtual / meta.valorMeta) * 100;
    
    toast(`Contribuição de R$ ${valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} adicionada!`);
    
    // Verificar se a meta foi concluída
    if (novoValorAtual >= meta.valorMeta && meta.status !== 'concluida') {
      atualizarMeta(id, { status: 'concluida' });
      toast(`🎉 Parabéns! Meta "${meta.nome}" foi concluída!`);
      
      // Adicionar notificação de conclusão
      const notificacao: NotificacaoMeta = {
        id: crypto.randomUUID(),
        metaId: id,
        tipo: 'concluida',
        titulo: 'Meta Concluída!',
        mensagem: `Parabéns! Você atingiu a meta "${meta.nome}"`,
        data: new Date(),
        lida: false,
        prioridade: 'alta'
      };
      adicionarNotificacaoMeta(notificacao);
    }
    // Verificar marcos importantes
    else if (progresso >= 25 && progresso < 50 && meta.valorAtual < meta.valorMeta * 0.25) {
      const notificacao: NotificacaoMeta = {
        id: crypto.randomUUID(),
        metaId: id,
        tipo: 'marco',
        titulo: 'Marco Atingido!',
        mensagem: `Você atingiu 25% da meta "${meta.nome}"`,
        data: new Date(),
        lida: false,
        prioridade: 'baixa'
      };
      adicionarNotificacaoMeta(notificacao);
    }
    else if (progresso >= 50 && progresso < 75 && meta.valorAtual < meta.valorMeta * 0.5) {
      const notificacao: NotificacaoMeta = {
        id: crypto.randomUUID(),
        metaId: id,
        tipo: 'marco',
        titulo: 'Marco Atingido!',
        mensagem: `Você atingiu 50% da meta "${meta.nome}"`,
        data: new Date(),
        lida: false,
        prioridade: 'media'
      };
      adicionarNotificacaoMeta(notificacao);
    }
    else if (progresso >= 75 && progresso < 100 && meta.valorAtual < meta.valorMeta * 0.75) {
      const notificacao: NotificacaoMeta = {
        id: crypto.randomUUID(),
        metaId: id,
        tipo: 'marco',
        titulo: 'Marco Atingido!',
        mensagem: `Você atingiu 75% da meta "${meta.nome}"`,
        data: new Date(),
        lida: false,
        prioridade: 'media'
      };
      adicionarNotificacaoMeta(notificacao);
    }
  }, [metas, adicionarContribuicaoMeta, atualizarMeta, adicionarNotificacaoMeta]);

  // Pausar/retomar meta
  const alternarStatusMeta = useCallback((id: string) => {
    const meta = metas.find(m => m.id === id);
    if (!meta) return;

    const novoStatus = meta.status === 'pausada' ? 'ativa' : 'pausada';
    atualizarMeta(id, { status: novoStatus });
    
    const acao = novoStatus === 'pausada' ? 'pausada' : 'retomada';
    toast(`Meta "${meta.nome}" ${acao} com sucesso!`);
  }, [metas, atualizarMeta]);

  // Calcular tempo restante para meta
  const calcularTempoRestante = useCallback((meta: MetaFinanceira) => {
    if (!meta.dataLimite) return null;
    
    const hoje = new Date();
    const dataLimite = new Date(meta.dataLimite);
    const diferenca = dataLimite.getTime() - hoje.getTime();
    
    if (diferenca <= 0) return { dias: 0, meses: 0, anos: 0, vencida: true };
    
    const dias = Math.floor(diferenca / (1000 * 60 * 60 * 24));
    const meses = Math.floor(dias / 30);
    const anos = Math.floor(meses / 12);
    
    return { dias, meses, anos, vencida: false };
  }, []);

  // Calcular valor necessário por mês
  const calcularValorMensalNecessario = useCallback((meta: MetaFinanceira) => {
    if (!meta.dataLimite || meta.status === 'concluida') return 0;
    
    const hoje = new Date();
    const dataLimite = new Date(meta.dataLimite);
    const mesesRestantes = Math.max(1, Math.ceil((dataLimite.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24 * 30)));
    const valorRestante = meta.valorMeta - meta.valorAtual;
    
    return valorRestante / mesesRestantes;
  }, []);

  return {
    // Dados
    metas,
    notificacoesMetas,
    estatisticas,
    metasPorCategoria,
    metasProximasVencimento,
    
    // Ações
    criarMeta,
    editarMeta,
    excluirMeta,
    adicionarContribuicao,
    alternarStatusMeta,
    calcularProgressoMeta,
    marcarNotificacaoLida,
    limparNotificacoesMetas,
    
    // Utilitários
    calcularTempoRestante,
    calcularValorMensalNecessario
  };
};