// Hook para Sistema de Atalhos de Teclado Avançados

import { useEffect, useCallback, useRef, useState } from 'react';

export interface AtalhoTeclado {
  id: string;
  nome: string;
  descricao: string;
  teclas: string[];
  categoria: 'navegacao' | 'calculo' | 'edicao' | 'visualizacao' | 'sistema' | 'personalizado';
  acao: () => void;
  habilitado: boolean;
  contexto?: string; // Em qual contexto o atalho está ativo
  prioridade: number; // Para resolver conflitos
  modificadores?: {
    ctrl?: boolean;
    alt?: boolean;
    shift?: boolean;
    meta?: boolean; // Cmd no Mac, Win no Windows
  };
}

export interface ConfiguracaoAtalhos {
  habilitados: boolean;
  mostrarTooltips: boolean;
  tempoTooltip: number;
  permitirPersonalizacao: boolean;
  contextoAtivo: string;
  atalhosPadrao: boolean;
  atalhosPersonalizados: AtalhoTeclado[];
  conflitosDetectados: string[];
}

export interface HistoricoAtalho {
  id: string;
  timestamp: number;
  teclas: string[];
  sucesso: boolean;
  contexto: string;
}

const useAtalhosTeclado = () => {
  // Estados
  const [atalhos, setAtalhos] = useState<AtalhoTeclado[]>([]);
  const [configuracao, setConfiguracao] = useState<ConfiguracaoAtalhos>({
    habilitados: true,
    mostrarTooltips: true,
    tempoTooltip: 2000,
    permitirPersonalizacao: true,
    contextoAtivo: 'global',
    atalhosPadrao: true,
    atalhosPersonalizados: [],
    conflitosDetectados: []
  });
  const [historico, setHistorico] = useState<HistoricoAtalho[]>([]);
  const [teclasPressionadas, setTeclasPressionadas] = useState<Set<string>>(new Set());
  const [sequenciaTeclas, setSequenciaTeclas] = useState<string[]>([]);
  const [modoGravacao, setModoGravacao] = useState(false);
  const [atalhoEditando, setAtalhoEditando] = useState<string | null>(null);
  const [tooltipVisivel, setTooltipVisivel] = useState<{
    atalho: AtalhoTeclado;
    posicao: { x: number; y: number };
  } | null>(null);

  // Refs
  const timeoutTooltip = useRef<NodeJS.Timeout>();
  const timeoutSequencia = useRef<NodeJS.Timeout>();
  const ultimaExecucao = useRef<{ [key: string]: number }>({});

  // Atalhos padrão do sistema
  const atalhosPadrao: AtalhoTeclado[] = [
    // Navegação
    {
      id: 'nav-home',
      nome: 'Ir para Início',
      descricao: 'Navegar para a página inicial',
      teclas: ['ctrl', 'h'],
      categoria: 'navegacao',
      acao: () => {
        // Implementar navegação para home
        console.log('Navegando para home');
      },
      habilitado: true,
      prioridade: 1,
      modificadores: { ctrl: true }
    },
    {
      id: 'nav-calculadora',
      nome: 'Abrir Calculadora',
      descricao: 'Abrir a calculadora de juros compostos',
      teclas: ['ctrl', 'c'],
      categoria: 'navegacao',
      acao: () => {
        console.log('Abrindo calculadora');
      },
      habilitado: true,
      prioridade: 1,
      modificadores: { ctrl: true }
    },
    {
      id: 'nav-historico',
      nome: 'Ver Histórico',
      descricao: 'Abrir o histórico de cálculos',
      teclas: ['ctrl', 'shift', 'h'],
      categoria: 'navegacao',
      acao: () => {
        console.log('Abrindo histórico');
      },
      habilitado: true,
      prioridade: 1,
      modificadores: { ctrl: true, shift: true }
    },
    {
      id: 'nav-favoritos',
      nome: 'Ver Favoritos',
      descricao: 'Abrir simulações favoritas',
      teclas: ['ctrl', 'f'],
      categoria: 'navegacao',
      acao: () => {
        console.log('Abrindo favoritos');
      },
      habilitado: true,
      prioridade: 1,
      modificadores: { ctrl: true }
    },
    {
      id: 'nav-insights',
      nome: 'Dashboard Insights',
      descricao: 'Abrir dashboard de insights financeiros',
      teclas: ['ctrl', 'i'],
      categoria: 'navegacao',
      acao: () => {
        console.log('Abrindo insights');
      },
      habilitado: true,
      prioridade: 1,
      modificadores: { ctrl: true }
    },
    {
      id: 'nav-cenarios',
      nome: 'Simulador Cenários',
      descricao: 'Abrir simulador de cenários econômicos',
      teclas: ['ctrl', 's'],
      categoria: 'navegacao',
      acao: () => {
        console.log('Abrindo cenários');
      },
      habilitado: true,
      prioridade: 1,
      modificadores: { ctrl: true }
    },

    // Cálculo
    {
      id: 'calc-executar',
      nome: 'Executar Cálculo',
      descricao: 'Executar o cálculo atual',
      teclas: ['enter'],
      categoria: 'calculo',
      acao: () => {
        console.log('Executando cálculo');
      },
      habilitado: true,
      contexto: 'calculadora',
      prioridade: 1
    },
    {
      id: 'calc-limpar',
      nome: 'Limpar Campos',
      descricao: 'Limpar todos os campos da calculadora',
      teclas: ['ctrl', 'l'],
      categoria: 'calculo',
      acao: () => {
        console.log('Limpando campos');
      },
      habilitado: true,
      contexto: 'calculadora',
      prioridade: 1,
      modificadores: { ctrl: true }
    },
    {
      id: 'calc-salvar',
      nome: 'Salvar Simulação',
      descricao: 'Salvar a simulação atual',
      teclas: ['ctrl', 's'],
      categoria: 'calculo',
      acao: () => {
        console.log('Salvando simulação');
      },
      habilitado: true,
      contexto: 'calculadora',
      prioridade: 2,
      modificadores: { ctrl: true }
    },
    {
      id: 'calc-favoritar',
      nome: 'Adicionar aos Favoritos',
      descricao: 'Adicionar simulação aos favoritos',
      teclas: ['ctrl', 'shift', 'f'],
      categoria: 'calculo',
      acao: () => {
        console.log('Adicionando aos favoritos');
      },
      habilitado: true,
      contexto: 'calculadora',
      prioridade: 1,
      modificadores: { ctrl: true, shift: true }
    },

    // Edição
    {
      id: 'edit-desfazer',
      nome: 'Desfazer',
      descricao: 'Desfazer última ação',
      teclas: ['ctrl', 'z'],
      categoria: 'edicao',
      acao: () => {
        console.log('Desfazendo ação');
      },
      habilitado: true,
      prioridade: 1,
      modificadores: { ctrl: true }
    },
    {
      id: 'edit-refazer',
      nome: 'Refazer',
      descricao: 'Refazer última ação desfeita',
      teclas: ['ctrl', 'y'],
      categoria: 'edicao',
      acao: () => {
        console.log('Refazendo ação');
      },
      habilitado: true,
      prioridade: 1,
      modificadores: { ctrl: true }
    },
    {
      id: 'edit-copiar',
      nome: 'Copiar Resultado',
      descricao: 'Copiar resultado para área de transferência',
      teclas: ['ctrl', 'c'],
      categoria: 'edicao',
      acao: () => {
        console.log('Copiando resultado');
      },
      habilitado: true,
      contexto: 'resultado',
      prioridade: 2,
      modificadores: { ctrl: true }
    },

    // Visualização
    {
      id: 'view-fullscreen',
      nome: 'Tela Cheia',
      descricao: 'Alternar modo tela cheia',
      teclas: ['f11'],
      categoria: 'visualizacao',
      acao: () => {
        if (document.fullscreenElement) {
          document.exitFullscreen();
        } else {
          document.documentElement.requestFullscreen();
        }
      },
      habilitado: true,
      prioridade: 1
    },
    {
      id: 'view-zoom-in',
      nome: 'Aumentar Zoom',
      descricao: 'Aumentar o zoom da página',
      teclas: ['ctrl', '+'],
      categoria: 'visualizacao',
      acao: () => {
        console.log('Aumentando zoom');
      },
      habilitado: true,
      prioridade: 1,
      modificadores: { ctrl: true }
    },
    {
      id: 'view-zoom-out',
      nome: 'Diminuir Zoom',
      descricao: 'Diminuir o zoom da página',
      teclas: ['ctrl', '-'],
      categoria: 'visualizacao',
      acao: () => {
        console.log('Diminuindo zoom');
      },
      habilitado: true,
      prioridade: 1,
      modificadores: { ctrl: true }
    },
    {
      id: 'view-reset-zoom',
      nome: 'Resetar Zoom',
      descricao: 'Resetar zoom para 100%',
      teclas: ['ctrl', '0'],
      categoria: 'visualizacao',
      acao: () => {
        console.log('Resetando zoom');
      },
      habilitado: true,
      prioridade: 1,
      modificadores: { ctrl: true }
    },
    {
      id: 'view-tema',
      nome: 'Alternar Tema',
      descricao: 'Alternar entre tema claro e escuro',
      teclas: ['ctrl', 't'],
      categoria: 'visualizacao',
      acao: () => {
        console.log('Alternando tema');
      },
      habilitado: true,
      prioridade: 1,
      modificadores: { ctrl: true }
    },

    // Sistema
    {
      id: 'sys-ajuda',
      nome: 'Ajuda',
      descricao: 'Abrir ajuda e atalhos',
      teclas: ['f1'],
      categoria: 'sistema',
      acao: () => {
        console.log('Abrindo ajuda');
      },
      habilitado: true,
      prioridade: 1
    },
    {
      id: 'sys-buscar',
      nome: 'Buscar',
      descricao: 'Abrir busca global',
      teclas: ['ctrl', 'k'],
      categoria: 'sistema',
      acao: () => {
        console.log('Abrindo busca');
      },
      habilitado: true,
      prioridade: 1,
      modificadores: { ctrl: true }
    },
    {
      id: 'sys-configuracoes',
      nome: 'Configurações',
      descricao: 'Abrir configurações do sistema',
      teclas: ['ctrl', ','],
      categoria: 'sistema',
      acao: () => {
        console.log('Abrindo configurações');
      },
      habilitado: true,
      prioridade: 1,
      modificadores: { ctrl: true }
    },
    {
      id: 'sys-apresentacao',
      nome: 'Modo Apresentação',
      descricao: 'Ativar modo apresentação',
      teclas: ['f5'],
      categoria: 'sistema',
      acao: () => {
        console.log('Ativando apresentação');
      },
      habilitado: true,
      prioridade: 1
    }
  ];

  // Inicializar atalhos
  useEffect(() => {
    const configSalva = JSON.parse(localStorage.getItem('configuracao-atalhos') || '{}');
    setConfiguracao(prev => ({ ...prev, ...configSalva }));

    const atalhosPersonalizados = JSON.parse(localStorage.getItem('atalhos-personalizados') || '[]');
    setAtalhos([...atalhosPadrao, ...atalhosPersonalizados]);

    const historicoSalvo = JSON.parse(localStorage.getItem('historico-atalhos') || '[]');
    setHistorico(historicoSalvo.slice(-100)); // Manter apenas os últimos 100
  }, []);

  // Salvar configurações
  useEffect(() => {
    localStorage.setItem('configuracao-atalhos', JSON.stringify(configuracao));
  }, [configuracao]);

  // Salvar atalhos personalizados
  useEffect(() => {
    const atalhosPersonalizados = atalhos.filter(a => a.categoria === 'personalizado');
    localStorage.setItem('atalhos-personalizados', JSON.stringify(atalhosPersonalizados));
  }, [atalhos]);

  // Salvar histórico
  useEffect(() => {
    localStorage.setItem('historico-atalhos', JSON.stringify(historico));
  }, [historico]);

  // Normalizar tecla
  const normalizarTecla = useCallback((tecla: string): string => {
    const mapeamento: { [key: string]: string } = {
      'Control': 'ctrl',
      'Alt': 'alt',
      'Shift': 'shift',
      'Meta': 'meta',
      'Escape': 'esc',
      'Enter': 'enter',
      'Space': 'space',
      'Tab': 'tab',
      'Backspace': 'backspace',
      'Delete': 'delete',
      'ArrowUp': 'up',
      'ArrowDown': 'down',
      'ArrowLeft': 'left',
      'ArrowRight': 'right',
      'Home': 'home',
      'End': 'end',
      'PageUp': 'pageup',
      'PageDown': 'pagedown'
    };

    return mapeamento[tecla] || tecla.toLowerCase();
  }, []);

  // Verificar se atalho corresponde às teclas pressionadas
  const verificarCorrespondencia = useCallback((atalho: AtalhoTeclado, teclas: Set<string>): boolean => {
    const teclasAtalho = new Set(atalho.teclas.map(t => t.toLowerCase()));
    
    // Verificar se todas as teclas do atalho estão pressionadas
    for (const tecla of teclasAtalho) {
      if (!teclas.has(tecla)) {
        return false;
      }
    }
    
    // Verificar se não há teclas extras (exceto modificadores permitidos)
    const modificadoresPermitidos = new Set(['ctrl', 'alt', 'shift', 'meta']);
    for (const tecla of teclas) {
      if (!teclasAtalho.has(tecla) && !modificadoresPermitidos.has(tecla)) {
        return false;
      }
    }
    
    return true;
  }, []);

  // Executar atalho
  const executarAtalho = useCallback((atalho: AtalhoTeclado): boolean => {
    if (!atalho.habilitado || !configuracao.habilitados) {
      return false;
    }

    // Verificar contexto
    if (atalho.contexto && atalho.contexto !== configuracao.contextoAtivo && atalho.contexto !== 'global') {
      return false;
    }

    // Verificar throttling (evitar execução muito frequente)
    const agora = Date.now();
    const ultimaExec = ultimaExecucao.current[atalho.id] || 0;
    if (agora - ultimaExec < 100) { // 100ms de throttling
      return false;
    }

    try {
      atalho.acao();
      ultimaExecucao.current[atalho.id] = agora;
      
      // Adicionar ao histórico
      const novoHistorico: HistoricoAtalho = {
        id: atalho.id,
        timestamp: agora,
        teclas: atalho.teclas,
        sucesso: true,
        contexto: configuracao.contextoAtivo
      };
      
      setHistorico(prev => [...prev.slice(-99), novoHistorico]);
      
      // Mostrar tooltip se habilitado
      if (configuracao.mostrarTooltips) {
        mostrarTooltip(atalho);
      }
      
      return true;
    } catch (error) {
      console.error('Erro ao executar atalho:', error);
      
      const novoHistorico: HistoricoAtalho = {
        id: atalho.id,
        timestamp: agora,
        teclas: atalho.teclas,
        sucesso: false,
        contexto: configuracao.contextoAtivo
      };
      
      setHistorico(prev => [...prev.slice(-99), novoHistorico]);
      return false;
    }
  }, [configuracao]);

  // Mostrar tooltip
  const mostrarTooltip = useCallback((atalho: AtalhoTeclado) => {
    if (timeoutTooltip.current) {
      clearTimeout(timeoutTooltip.current);
    }

    setTooltipVisivel({
      atalho,
      posicao: { x: window.innerWidth / 2, y: 50 }
    });

    timeoutTooltip.current = setTimeout(() => {
      setTooltipVisivel(null);
    }, configuracao.tempoTooltip);
  }, [configuracao.tempoTooltip]);

  // Handler de keydown
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (!configuracao.habilitados) return;

    const tecla = normalizarTecla(event.key);
    
    // Atualizar teclas pressionadas
    setTeclasPressionadas(prev => {
      const novas = new Set(prev);
      novas.add(tecla);
      
      // Adicionar modificadores
      if (event.ctrlKey) novas.add('ctrl');
      if (event.altKey) novas.add('alt');
      if (event.shiftKey) novas.add('shift');
      if (event.metaKey) novas.add('meta');
      
      return novas;
    });

    // Atualizar sequência de teclas
    setSequenciaTeclas(prev => {
      const nova = [...prev, tecla].slice(-5); // Manter apenas as últimas 5 teclas
      
      // Reset timeout da sequência
      if (timeoutSequencia.current) {
        clearTimeout(timeoutSequencia.current);
      }
      
      timeoutSequencia.current = setTimeout(() => {
        setSequenciaTeclas([]);
      }, 2000);
      
      return nova;
    });

    // Procurar atalhos correspondentes
    const atalhosCorrespondentes = atalhos
      .filter(atalho => {
        const teclasAtuais = new Set([tecla]);
        if (event.ctrlKey) teclasAtuais.add('ctrl');
        if (event.altKey) teclasAtuais.add('alt');
        if (event.shiftKey) teclasAtuais.add('shift');
        if (event.metaKey) teclasAtuais.add('meta');
        
        return verificarCorrespondencia(atalho, teclasAtuais);
      })
      .sort((a, b) => b.prioridade - a.prioridade); // Ordenar por prioridade

    // Executar o primeiro atalho correspondente
    if (atalhosCorrespondentes.length > 0) {
      const atalhoExecutado = executarAtalho(atalhosCorrespondentes[0]);
      if (atalhoExecutado) {
        event.preventDefault();
        event.stopPropagation();
      }
    }
  }, [configuracao.habilitados, atalhos, normalizarTecla, verificarCorrespondencia, executarAtalho]);

  // Handler de keyup
  const handleKeyUp = useCallback((event: KeyboardEvent) => {
    const tecla = normalizarTecla(event.key);
    
    setTeclasPressionadas(prev => {
      const novas = new Set(prev);
      novas.delete(tecla);
      
      // Remover modificadores se não estão mais pressionados
      if (!event.ctrlKey) novas.delete('ctrl');
      if (!event.altKey) novas.delete('alt');
      if (!event.shiftKey) novas.delete('shift');
      if (!event.metaKey) novas.delete('meta');
      
      return novas;
    });
  }, [normalizarTecla]);

  // Registrar event listeners
  useEffect(() => {
    if (configuracao.habilitados) {
      document.addEventListener('keydown', handleKeyDown);
      document.addEventListener('keyup', handleKeyUp);
      
      return () => {
        document.removeEventListener('keydown', handleKeyDown);
        document.removeEventListener('keyup', handleKeyUp);
      };
    }
  }, [configuracao.habilitados, handleKeyDown, handleKeyUp]);

  // Detectar conflitos
  const detectarConflitos = useCallback(() => {
    const conflitos: string[] = [];
    const grupos: { [key: string]: AtalhoTeclado[] } = {};
    
    // Agrupar atalhos por combinação de teclas
    atalhos.forEach(atalho => {
      const chave = atalho.teclas.sort().join('+');
      if (!grupos[chave]) grupos[chave] = [];
      grupos[chave].push(atalho);
    });
    
    // Identificar conflitos
    Object.entries(grupos).forEach(([chave, atalhosGrupo]) => {
      if (atalhosGrupo.length > 1) {
        const contextos = atalhosGrupo.map(a => a.contexto || 'global');
        const contextosUnicos = new Set(contextos);
        
        // Conflito se há sobreposição de contextos
        if (contextosUnicos.has('global') || contextosUnicos.size < contextos.length) {
          conflitos.push(`Conflito em ${chave}: ${atalhosGrupo.map(a => a.nome).join(', ')}`);
        }
      }
    });
    
    setConfiguracao(prev => ({ ...prev, conflitosDetectados: conflitos }));
  }, [atalhos]);

  // Executar detecção de conflitos quando atalhos mudarem
  useEffect(() => {
    detectarConflitos();
  }, [detectarConflitos]);

  // Funções públicas
  const adicionarAtalho = useCallback((atalho: Omit<AtalhoTeclado, 'id'>) => {
    const novoAtalho: AtalhoTeclado = {
      ...atalho,
      id: `custom-${Date.now()}`,
      categoria: 'personalizado'
    };
    
    setAtalhos(prev => [...prev, novoAtalho]);
  }, []);

  const removerAtalho = useCallback((id: string) => {
    setAtalhos(prev => prev.filter(a => a.id !== id));
  }, []);

  const editarAtalho = useCallback((id: string, atalho: Partial<AtalhoTeclado>) => {
    setAtalhos(prev => prev.map(a => a.id === id ? { ...a, ...atalho } : a));
  }, []);

  const alternarAtalho = useCallback((id: string) => {
    setAtalhos(prev => prev.map(a => a.id === id ? { ...a, habilitado: !a.habilitado } : a));
  }, []);

  const definirContexto = useCallback((contexto: string) => {
    setConfiguracao(prev => ({ ...prev, contextoAtivo: contexto }));
  }, []);

  const limparHistorico = useCallback(() => {
    setHistorico([]);
    localStorage.removeItem('historico-atalhos');
  }, []);

  const exportarAtalhos = useCallback(() => {
    const dados = {
      atalhos: atalhos.filter(a => a.categoria === 'personalizado'),
      configuracao,
      timestamp: Date.now()
    };
    
    const dataStr = JSON.stringify(dados, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `atalhos-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    URL.revokeObjectURL(url);
  }, [atalhos, configuracao]);

  const importarAtalhos = useCallback((arquivo: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const dados = JSON.parse(e.target?.result as string);
        
        if (dados.atalhos) {
          const novosAtalhos = dados.atalhos.map((a: any) => ({
            ...a,
            id: `imported-${Date.now()}-${Math.random()}`,
            categoria: 'personalizado'
          }));
          
          setAtalhos(prev => [...prev.filter(a => a.categoria !== 'personalizado'), ...novosAtalhos]);
        }
        
        if (dados.configuracao) {
          setConfiguracao(prev => ({ ...prev, ...dados.configuracao }));
        }
      } catch (error) {
        console.error('Erro ao importar atalhos:', error);
      }
    };
    reader.readAsText(arquivo);
  }, []);

  const resetarAtalhos = useCallback(() => {
    setAtalhos(atalhosPadrao);
    setConfiguracao({
      habilitados: true,
      mostrarTooltips: true,
      tempoTooltip: 2000,
      permitirPersonalizacao: true,
      contextoAtivo: 'global',
      atalhosPadrao: true,
      atalhosPersonalizados: [],
      conflitosDetectados: []
    });
    limparHistorico();
  }, [limparHistorico]);

  // Estatísticas
  const estatisticas = {
    totalAtalhos: atalhos.length,
    atalhosHabilitados: atalhos.filter(a => a.habilitado).length,
    atalhosPersonalizados: atalhos.filter(a => a.categoria === 'personalizado').length,
    conflitos: configuracao.conflitosDetectados.length,
    usoRecente: historico.filter(h => Date.now() - h.timestamp < 24 * 60 * 60 * 1000).length,
    atalhoMaisUsado: historico.reduce((acc, h) => {
      acc[h.id] = (acc[h.id] || 0) + 1;
      return acc;
    }, {} as { [key: string]: number })
  };

  return {
    // Estados
    atalhos,
    configuracao,
    historico,
    teclasPressionadas,
    sequenciaTeclas,
    modoGravacao,
    atalhoEditando,
    tooltipVisivel,
    estatisticas,

    // Ações
    adicionarAtalho,
    removerAtalho,
    editarAtalho,
    alternarAtalho,
    definirContexto,
    limparHistorico,
    exportarAtalhos,
    importarAtalhos,
    resetarAtalhos,
    setConfiguracao,
    setModoGravacao,
    setAtalhoEditando,

    // Utilitários
    normalizarTecla,
    verificarCorrespondencia,
    executarAtalho,
    detectarConflitos
  };
};

export default useAtalhosTeclado;