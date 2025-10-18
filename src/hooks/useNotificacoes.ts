import { useState, useEffect, useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';

export interface Notificacao {
  id: string;
  tipo: 'meta' | 'oportunidade' | 'aporte' | 'alerta' | 'sucesso';
  titulo: string;
  mensagem: string;
  timestamp: number;
  lida: boolean;
  prioridade: 'baixa' | 'media' | 'alta';
  acao?: {
    texto: string;
    callback: () => void;
  };
  icone?: string;
  duracao?: number; // em ms, undefined = permanente
}

export interface PreferenciasNotificacao {
  metas: boolean;
  oportunidades: boolean;
  aportes: boolean;
  alertas: boolean;
  som: boolean;
  desktop: boolean;
  frequenciaAportes: 'diaria' | 'semanal' | 'mensal';
}

const PREFERENCIAS_PADRAO: PreferenciasNotificacao = {
  metas: true,
  oportunidades: true,
  aportes: true,
  alertas: true,
  som: false,
  desktop: false,
  frequenciaAportes: 'mensal'
};

export const useNotificacoes = () => {
  const [notificacoes, setNotificacoes] = useState<Notificacao[]>([]);
  const [preferencias, setPreferencias] = useLocalStorage<PreferenciasNotificacao>(
    'notificacoes-preferencias',
    PREFERENCIAS_PADRAO
  );
  const [notificacoesNaoLidas, setNotificacoesNaoLidas] = useState(0);

  // Atualizar contador de não lidas
  useEffect(() => {
    const naoLidas = notificacoes.filter(n => !n.lida).length;
    setNotificacoesNaoLidas(naoLidas);
  }, [notificacoes]);

  // Reproduzir som simples
  const reproduzirSomNotificacao = useCallback((tipo: Notificacao['tipo']) => {
    if (!preferencias.som) return;
    
    try {
      // Usar Web Audio API para gerar som simples
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      // Diferentes frequências para diferentes tipos
      switch (tipo) {
        case 'sucesso':
          oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
          break;
        case 'alerta':
          oscillator.frequency.setValueAtTime(400, audioContext.currentTime);
          break;
        case 'meta':
          oscillator.frequency.setValueAtTime(600, audioContext.currentTime);
          break;
        default:
          oscillator.frequency.setValueAtTime(500, audioContext.currentTime);
      }
      
      oscillator.type = 'sine';
      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.3);
    } catch (error) {
      console.warn('Erro ao reproduzir som de notificação:', error);
    }
  }, [preferencias.som]);

  // Solicitar permissão para notificações desktop
  const solicitarPermissaoDesktop = useCallback(async () => {
    if ('Notification' in window && Notification.permission === 'default') {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }
    return Notification.permission === 'granted';
  }, []);

  // Mostrar notificação desktop
  const mostrarNotificacaoDesktop = useCallback((notificacao: Notificacao) => {
    if (!preferencias.desktop || !('Notification' in window) || Notification.permission !== 'granted') {
      return;
    }

    const notification = new Notification(notificacao.titulo, {
      body: notificacao.mensagem,
      icon: '/favicon.ico',
      tag: notificacao.id,
      requireInteraction: notificacao.prioridade === 'alta'
    });

    notification.onclick = () => {
      window.focus();
      notification.close();
      if (notificacao.acao) {
        notificacao.acao.callback();
      }
    };

    // Auto-fechar após 5 segundos se não for de alta prioridade
    if (notificacao.prioridade !== 'alta') {
      setTimeout(() => notification.close(), 5000);
    }
  }, [preferencias.desktop]);

  // Adicionar nova notificação
  const adicionarNotificacao = useCallback((notificacao: Omit<Notificacao, 'id' | 'timestamp' | 'lida'>) => {
    const novaNotificacao: Notificacao = {
      ...notificacao,
      id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
      lida: false
    };

    setNotificacoes(prev => [novaNotificacao, ...prev]);

    // Reproduzir som
    reproduzirSomNotificacao(notificacao.tipo);

    // Mostrar notificação desktop
    mostrarNotificacaoDesktop(novaNotificacao);

    // Auto-remover se tiver duração definida
    if (notificacao.duracao) {
      setTimeout(() => {
        removerNotificacao(novaNotificacao.id);
      }, notificacao.duracao);
    }

    return novaNotificacao.id;
  }, [reproduzirSomNotificacao, mostrarNotificacaoDesktop]);

  // Marcar notificação como lida
  const marcarComoLida = useCallback((id: string) => {
    setNotificacoes(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, lida: true } : notif
      )
    );
  }, []);

  // Marcar todas como lidas
  const marcarTodasComoLidas = useCallback(() => {
    setNotificacoes(prev => 
      prev.map(notif => ({ ...notif, lida: true }))
    );
  }, []);

  // Remover notificação
  const removerNotificacao = useCallback((id: string) => {
    setNotificacoes(prev => prev.filter(notif => notif.id !== id));
  }, []);

  // Limpar todas as notificações
  const limparNotificacoes = useCallback(() => {
    setNotificacoes([]);
  }, []);

  // Atualizar preferências
  const atualizarPreferencias = useCallback((novasPreferencias: Partial<PreferenciasNotificacao>) => {
    setPreferencias(prev => ({ ...prev, ...novasPreferencias }));
  }, [setPreferencias]);

  // Notificações inteligentes baseadas em contexto
  const notificarMetaAlcancada = useCallback((valor: number, meta: number) => {
    adicionarNotificacao({
      tipo: 'sucesso',
      titulo: '🎉 Meta Alcançada!',
      mensagem: `Parabéns! Você alcançou sua meta de R$ ${meta.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
      prioridade: 'alta',
      duracao: 10000
    });
  }, [adicionarNotificacao]);

  const notificarOportunidadeInvestimento = useCallback((taxa: number, produto: string) => {
    adicionarNotificacao({
      tipo: 'oportunidade',
      titulo: '💰 Oportunidade de Investimento',
      mensagem: `${produto} está oferecendo ${taxa}% a.a. - Uma boa oportunidade!`,
      prioridade: 'media',
      duracao: 15000
    });
  }, [adicionarNotificacao]);

  const notificarLembreteAporte = useCallback((valor: number) => {
    adicionarNotificacao({
      tipo: 'aporte',
      titulo: '📅 Lembrete de Aporte',
      mensagem: `Que tal fazer um aporte de R$ ${valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} hoje?`,
      prioridade: 'media',
      duracao: 20000
    });
  }, [adicionarNotificacao]);

  const verificarPerformance = useCallback((valorAtual: number, valorEsperado: number) => {
    const diferenca = ((valorAtual - valorEsperado) / valorEsperado) * 100;
    
    if (diferenca > 10) {
      adicionarNotificacao({
        tipo: 'sucesso',
        titulo: '📈 Performance Excelente!',
        mensagem: `Seu investimento está ${diferenca.toFixed(1)}% acima do esperado!`,
        prioridade: 'alta',
        duracao: 15000
      });
    } else if (diferenca < -10) {
      adicionarNotificacao({
        tipo: 'alerta',
        titulo: '📉 Performance Abaixo do Esperado',
        mensagem: `Considere revisar sua estratégia de investimento`,
        prioridade: 'media',
        duracao: 20000
      });
    }
  }, [adicionarNotificacao]);

  const verificarOportunidadesMercado = useCallback((taxaAtual: number, taxaMedia: number) => {
    if (taxaAtual < taxaMedia - 2) {
      adicionarNotificacao({
        tipo: 'oportunidade',
        titulo: '🎯 Oportunidade de Mercado',
        mensagem: `Existem opções com taxas até ${taxaMedia}% a.a. disponíveis`,
        prioridade: 'media',
        duracao: 25000
      });
    }
  }, [adicionarNotificacao]);

  const criarLembreteAporte = useCallback((valorSugerido: number) => {
    adicionarNotificacao({
      tipo: 'aporte',
      titulo: '💡 Sugestão de Aporte',
      mensagem: `Aumentar para R$ ${valorSugerido.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} pode acelerar seus resultados`,
      prioridade: 'baixa',
      duracao: 30000
    });
  }, [adicionarNotificacao]);

  const verificarMetasProximas = useCallback((valorAtual: number, meta: number, mesesRestantes: number) => {
    const progressoAtual = (valorAtual / meta) * 100;
    
    if (progressoAtual >= 80 && progressoAtual < 100) {
      adicionarNotificacao({
        tipo: 'meta',
        titulo: '🎯 Quase Lá!',
        mensagem: `Você está a ${(100 - progressoAtual).toFixed(1)}% da sua meta!`,
        prioridade: 'media',
        duracao: 15000
      });
    }
  }, [adicionarNotificacao]);

  return {
    notificacoes,
    naoLidas: notificacoesNaoLidas,
    preferencias,
    adicionarNotificacao,
    marcarComoLida,
    marcarTodasComoLidas,
    removerNotificacao,
    limparNotificacoes,
    atualizarPreferencias,
    solicitarPermissaoDesktop,
    // Notificações inteligentes
    notificarMetaAlcancada,
    notificarOportunidadeInvestimento,
    notificarLembreteAporte,
    verificarPerformance,
    verificarOportunidadesMercado,
    criarLembreteAporte,
    verificarMetasProximas
  };
};