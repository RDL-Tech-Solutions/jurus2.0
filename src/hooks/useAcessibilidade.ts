// Hook para Sistema de Acessibilidade Avançado

import { useState, useEffect, useCallback, useRef } from 'react';

export interface ConfiguracaoAcessibilidade {
  // Configurações Visuais
  altoContraste: boolean;
  tamanhoFonte: 'pequeno' | 'normal' | 'grande' | 'extra-grande';
  espacamentoLinhas: 'compacto' | 'normal' | 'expandido';
  reducaoMovimento: boolean;
  modoEscuroForcado: boolean;
  destacarFoco: boolean;
  
  // Configurações de Navegação
  navegacaoTeclado: boolean;
  indicadorFoco: 'padrao' | 'destacado' | 'colorido';
  pularLinks: boolean;
  ordemTabulacao: boolean;
  
  // Configurações de Áudio
  audioHabilitado: boolean;
  volumeAudio: number;
  feedbackSonoro: boolean;
  leituraAutomatica: boolean;
  
  // Configurações de Leitura de Tela
  leitorTela: boolean;
  descricaoDetalhada: boolean;
  anuncioMudancas: boolean;
  rotulos: boolean;
  
  // Configurações de Interação
  tempoResposta: 'rapido' | 'normal' | 'lento' | 'muito-lento';
  confirmarAcoes: boolean;
  simplificarInterface: boolean;
  ajudaContextual: boolean;
  
  // Configurações de Conteúdo
  linguagemSimples: boolean;
  explicacoesTecnicas: boolean;
  exemplosVisuais: boolean;
  resumoConteudo: boolean;
}

export interface PerfilAcessibilidade {
  id: string;
  nome: string;
  descricao: string;
  configuracao: ConfiguracaoAcessibilidade;
  ativo: boolean;
  predefinido: boolean;
}

export interface LogAcessibilidade {
  timestamp: number;
  acao: string;
  elemento: string;
  metodo: 'teclado' | 'mouse' | 'touch' | 'voz' | 'leitor-tela';
  sucesso: boolean;
  tempoResposta?: number;
}

const useAcessibilidade = () => {
  // Estados
  const [configuracao, setConfiguracao] = useState<ConfiguracaoAcessibilidade>({
    // Visuais
    altoContraste: false,
    tamanhoFonte: 'normal',
    espacamentoLinhas: 'normal',
    reducaoMovimento: false,
    modoEscuroForcado: false,
    destacarFoco: true,
    
    // Navegação
    navegacaoTeclado: true,
    indicadorFoco: 'padrao',
    pularLinks: true,
    ordemTabulacao: true,
    
    // Áudio
    audioHabilitado: true,
    volumeAudio: 0.5,
    feedbackSonoro: false,
    leituraAutomatica: false,
    
    // Leitura de Tela
    leitorTela: false,
    descricaoDetalhada: false,
    anuncioMudancas: false,
    rotulos: true,
    
    // Interação
    tempoResposta: 'normal',
    confirmarAcoes: false,
    simplificarInterface: false,
    ajudaContextual: true,
    
    // Conteúdo
    linguagemSimples: false,
    explicacoesTecnicas: true,
    exemplosVisuais: true,
    resumoConteudo: false
  });

  const [perfis, setPerfis] = useState<PerfilAcessibilidade[]>([]);
  const [perfilAtivo, setPerfilAtivo] = useState<string>('personalizado');
  const [logs, setLogs] = useState<LogAcessibilidade[]>([]);
  const [elementoFocado, setElementoFocado] = useState<Element | null>(null);
  const [anuncioAtivo, setAnuncioAtivo] = useState<string>('');
  const [ajudaVisivel, setAjudaVisivel] = useState(false);

  // Refs
  const audioContext = useRef<AudioContext | null>(null);
  const synth = useRef<SpeechSynthesis | null>(null);
  const ultimoAnuncio = useRef<number>(0);

  // Perfis predefinidos
  const perfisPredefinidos: PerfilAcessibilidade[] = [
    {
      id: 'deficiencia-visual',
      nome: 'Deficiência Visual',
      descricao: 'Configurações otimizadas para usuários com deficiência visual',
      ativo: false,
      predefinido: true,
      configuracao: {
        ...configuracao,
        altoContraste: true,
        tamanhoFonte: 'grande',
        espacamentoLinhas: 'expandido',
        destacarFoco: true,
        leitorTela: true,
        descricaoDetalhada: true,
        anuncioMudancas: true,
        feedbackSonoro: true,
        navegacaoTeclado: true,
        indicadorFoco: 'destacado'
      }
    },
    {
      id: 'deficiencia-motora',
      nome: 'Deficiência Motora',
      descricao: 'Configurações para usuários com limitações motoras',
      ativo: false,
      predefinido: true,
      configuracao: {
        ...configuracao,
        tempoResposta: 'lento',
        confirmarAcoes: true,
        navegacaoTeclado: true,
        pularLinks: true,
        tamanhoFonte: 'grande',
        simplificarInterface: true
      }
    },
    {
      id: 'deficiencia-cognitiva',
      nome: 'Deficiência Cognitiva',
      descricao: 'Interface simplificada e linguagem clara',
      ativo: false,
      predefinido: true,
      configuracao: {
        ...configuracao,
        simplificarInterface: true,
        linguagemSimples: true,
        ajudaContextual: true,
        confirmarAcoes: true,
        reducaoMovimento: true,
        resumoConteudo: true,
        exemplosVisuais: true,
        tempoResposta: 'muito-lento'
      }
    },
    {
      id: 'baixa-visao',
      nome: 'Baixa Visão',
      descricao: 'Configurações para usuários com baixa visão',
      ativo: false,
      predefinido: true,
      configuracao: {
        ...configuracao,
        altoContraste: true,
        tamanhoFonte: 'extra-grande',
        espacamentoLinhas: 'expandido',
        destacarFoco: true,
        indicadorFoco: 'colorido',
        modoEscuroForcado: true
      }
    },
    {
      id: 'idoso',
      nome: 'Usuário Idoso',
      descricao: 'Interface adaptada para usuários idosos',
      ativo: false,
      predefinido: true,
      configuracao: {
        ...configuracao,
        tamanhoFonte: 'grande',
        espacamentoLinhas: 'expandido',
        tempoResposta: 'lento',
        confirmarAcoes: true,
        simplificarInterface: true,
        ajudaContextual: true,
        linguagemSimples: true
      }
    }
  ];

  // Inicializar
  useEffect(() => {
    // Carregar configurações salvas
    const configSalva = localStorage.getItem('acessibilidade-config');
    if (configSalva) {
      setConfiguracao(JSON.parse(configSalva));
    }

    // Carregar perfis personalizados
    const perfisPersonalizados = JSON.parse(localStorage.getItem('acessibilidade-perfis') || '[]');
    setPerfis([...perfisPredefinidos, ...perfisPersonalizados]);

    // Carregar perfil ativo
    const perfilSalvo = localStorage.getItem('acessibilidade-perfil-ativo') || 'personalizado';
    setPerfilAtivo(perfilSalvo);

    // Detectar preferências do sistema
    detectarPreferenciasSystem();

    // Inicializar APIs de acessibilidade
    inicializarAPIs();
  }, []);

  // Detectar preferências do sistema
  const detectarPreferenciasSystem = useCallback(() => {
    // Detectar preferência por modo escuro
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setConfiguracao(prev => ({ ...prev, modoEscuroForcado: true }));
    }

    // Detectar preferência por movimento reduzido
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setConfiguracao(prev => ({ ...prev, reducaoMovimento: true }));
    }

    // Detectar preferência por alto contraste
    if (window.matchMedia('(prefers-contrast: high)').matches) {
      setConfiguracao(prev => ({ ...prev, altoContraste: true }));
    }
  }, []);

  // Inicializar APIs
  const inicializarAPIs = useCallback(() => {
    // Inicializar Web Audio API
    try {
      audioContext.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    } catch (error) {
      console.warn('Web Audio API não disponível:', error);
    }

    // Inicializar Speech Synthesis API
    if ('speechSynthesis' in window) {
      synth.current = window.speechSynthesis;
    }
  }, []);

  // Aplicar configurações de acessibilidade
  const aplicarConfiguracoes = useCallback(() => {
    const root = document.documentElement;

    // Aplicar tamanho da fonte
    const tamanhosFonte = {
      'pequeno': '14px',
      'normal': '16px',
      'grande': '18px',
      'extra-grande': '22px'
    };
    root.style.setProperty('--tamanho-fonte-base', tamanhosFonte[configuracao.tamanhoFonte]);

    // Aplicar espaçamento de linhas
    const espacamentos = {
      'compacto': '1.2',
      'normal': '1.5',
      'expandido': '1.8'
    };
    root.style.setProperty('--altura-linha-base', espacamentos[configuracao.espacamentoLinhas]);

    // Aplicar alto contraste
    if (configuracao.altoContraste) {
      root.classList.add('alto-contraste');
    } else {
      root.classList.remove('alto-contraste');
    }

    // Aplicar redução de movimento
    if (configuracao.reducaoMovimento) {
      root.classList.add('reducao-movimento');
    } else {
      root.classList.remove('reducao-movimento');
    }

    // Aplicar modo escuro forçado
    if (configuracao.modoEscuroForcado) {
      root.classList.add('modo-escuro-forcado');
    } else {
      root.classList.remove('modo-escuro-forcado');
    }

    // Aplicar destaque de foco
    if (configuracao.destacarFoco) {
      root.classList.add('destaque-foco');
    } else {
      root.classList.remove('destaque-foco');
    }

    // Aplicar indicador de foco
    root.setAttribute('data-indicador-foco', configuracao.indicadorFoco);

    // Aplicar interface simplificada
    if (configuracao.simplificarInterface) {
      root.classList.add('interface-simplificada');
    } else {
      root.classList.remove('interface-simplificada');
    }
  }, [configuracao]);

  // Aplicar configurações quando mudarem
  useEffect(() => {
    aplicarConfiguracoes();
    localStorage.setItem('acessibilidade-config', JSON.stringify(configuracao));
  }, [configuracao, aplicarConfiguracoes]);

  // Reproduzir som de feedback
  const reproduzirFeedback = useCallback((tipo: 'sucesso' | 'erro' | 'navegacao' | 'foco') => {
    if (!configuracao.feedbackSonoro || !audioContext.current) return;

    const ctx = audioContext.current;
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    // Configurar frequências para diferentes tipos
    const frequencias = {
      sucesso: [523, 659, 784], // C5, E5, G5
      erro: [392, 311, 247], // G4, Eb4, B3
      navegacao: [440], // A4
      foco: [523] // C5
    };

    const freq = frequencias[tipo];
    oscillator.frequency.setValueAtTime(freq[0], ctx.currentTime);

    // Configurar volume
    gainNode.gain.setValueAtTime(0, ctx.currentTime);
    gainNode.gain.linearRampToValueAtTime(configuracao.volumeAudio * 0.1, ctx.currentTime + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.3);
  }, [configuracao.feedbackSonoro, configuracao.volumeAudio]);

  // Anunciar texto para leitores de tela
  const anunciar = useCallback((texto: string, prioridade: 'baixa' | 'media' | 'alta' = 'media') => {
    if (!configuracao.anuncioMudancas && !configuracao.leitorTela) return;

    const agora = Date.now();
    
    // Evitar anúncios muito frequentes
    if (prioridade === 'baixa' && agora - ultimoAnuncio.current < 1000) return;
    if (prioridade === 'media' && agora - ultimoAnuncio.current < 500) return;

    ultimoAnuncio.current = agora;

    // Usar Speech Synthesis se disponível
    if (synth.current && configuracao.leituraAutomatica) {
      const utterance = new SpeechSynthesisUtterance(texto);
      utterance.volume = configuracao.volumeAudio;
      utterance.rate = configuracao.tempoResposta === 'rapido' ? 1.2 : 
                      configuracao.tempoResposta === 'lento' ? 0.8 : 1.0;
      synth.current.speak(utterance);
    }

    // Atualizar região de anúncio para leitores de tela
    setAnuncioAtivo(texto);
    setTimeout(() => setAnuncioAtivo(''), 100);
  }, [configuracao, synth]);

  // Gerenciar foco
  const gerenciarFoco = useCallback((elemento: Element) => {
    setElementoFocado(elemento);
    
    if (configuracao.feedbackSonoro) {
      reproduzirFeedback('foco');
    }

    // Anunciar elemento focado se necessário
    if (configuracao.leitorTela) {
      const label = elemento.getAttribute('aria-label') || 
                   elemento.getAttribute('title') || 
                   (elemento as HTMLElement).innerText?.slice(0, 50);
      
      if (label) {
        anunciar(`Focado em: ${label}`, 'baixa');
      }
    }

    // Log da interação
    registrarLog('foco', elemento.tagName, 'teclado', true);
  }, [configuracao, reproduzirFeedback, anunciar]);

  // Registrar log de acessibilidade
  const registrarLog = useCallback((
    acao: string, 
    elemento: string, 
    metodo: LogAcessibilidade['metodo'], 
    sucesso: boolean,
    tempoResposta?: number
  ) => {
    const novoLog: LogAcessibilidade = {
      timestamp: Date.now(),
      acao,
      elemento,
      metodo,
      sucesso,
      tempoResposta
    };

    setLogs(prev => [...prev.slice(-99), novoLog]); // Manter apenas os últimos 100 logs
  }, []);

  // Navegação por teclado
  const navegarTeclado = useCallback((direcao: 'proximo' | 'anterior' | 'primeiro' | 'ultimo') => {
    if (!configuracao.navegacaoTeclado) return;

    const elementos = Array.from(document.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )).filter(el => {
      const style = window.getComputedStyle(el as Element);
      return style.display !== 'none' && style.visibility !== 'hidden';
    });

    if (elementos.length === 0) return;

    const atual = document.activeElement;
    const indiceAtual = elementos.indexOf(atual as Element);

    let novoIndice: number;
    switch (direcao) {
      case 'proximo':
        novoIndice = (indiceAtual + 1) % elementos.length;
        break;
      case 'anterior':
        novoIndice = indiceAtual <= 0 ? elementos.length - 1 : indiceAtual - 1;
        break;
      case 'primeiro':
        novoIndice = 0;
        break;
      case 'ultimo':
        novoIndice = elementos.length - 1;
        break;
      default:
        return;
    }

    const novoElemento = elementos[novoIndice] as HTMLElement;
    novoElemento.focus();
    gerenciarFoco(novoElemento);
  }, [configuracao.navegacaoTeclado, gerenciarFoco]);

  // Aplicar perfil
  const aplicarPerfil = useCallback((perfilId: string) => {
    const perfil = perfis.find(p => p.id === perfilId);
    if (perfil) {
      setConfiguracao(perfil.configuracao);
      setPerfilAtivo(perfilId);
      localStorage.setItem('acessibilidade-perfil-ativo', perfilId);
      anunciar(`Perfil ${perfil.nome} aplicado`, 'media');
    }
  }, [perfis, anunciar]);

  // Criar perfil personalizado
  const criarPerfil = useCallback((nome: string, descricao: string) => {
    const novoPerfil: PerfilAcessibilidade = {
      id: `custom-${Date.now()}`,
      nome,
      descricao,
      configuracao: { ...configuracao },
      ativo: false,
      predefinido: false
    };

    const novosPerfisPers = [...perfis.filter(p => !p.predefinido), novoPerfil];
    localStorage.setItem('acessibilidade-perfis', JSON.stringify(novosPerfisPers));
    setPerfis([...perfisPredefinidos, ...novosPerfisPers]);
    
    return novoPerfil.id;
  }, [configuracao, perfis]);

  // Excluir perfil
  const excluirPerfil = useCallback((perfilId: string) => {
    const perfil = perfis.find(p => p.id === perfilId);
    if (perfil && !perfil.predefinido) {
      const novosPerfisPers = perfis.filter(p => p.id !== perfilId && !p.predefinido);
      localStorage.setItem('acessibilidade-perfis', JSON.stringify(novosPerfisPers));
      setPerfis([...perfisPredefinidos, ...novosPerfisPers]);
      
      if (perfilAtivo === perfilId) {
        setPerfilAtivo('personalizado');
      }
    }
  }, [perfis, perfilAtivo]);

  // Obter descrição de elemento
  const obterDescricao = useCallback((elemento: Element): string => {
    if (!configuracao.descricaoDetalhada) return '';

    const tag = elemento.tagName.toLowerCase();
    const tipo = elemento.getAttribute('type');
    const role = elemento.getAttribute('role');
    const label = elemento.getAttribute('aria-label') || 
                 elemento.getAttribute('title') ||
                 (elemento as HTMLElement).innerText?.slice(0, 100);

    let descricao = '';

    // Descrição baseada no tipo de elemento
    switch (tag) {
      case 'button':
        descricao = 'Botão';
        break;
      case 'input':
        descricao = tipo === 'text' ? 'Campo de texto' :
                   tipo === 'number' ? 'Campo numérico' :
                   tipo === 'email' ? 'Campo de email' :
                   tipo === 'password' ? 'Campo de senha' :
                   tipo === 'checkbox' ? 'Caixa de seleção' :
                   tipo === 'radio' ? 'Botão de opção' :
                   'Campo de entrada';
        break;
      case 'select':
        descricao = 'Lista de seleção';
        break;
      case 'textarea':
        descricao = 'Área de texto';
        break;
      case 'a':
        descricao = 'Link';
        break;
      default:
        descricao = role || tag;
    }

    if (label) {
      descricao += `: ${label}`;
    }

    return descricao;
  }, [configuracao.descricaoDetalhada]);

  // Verificar compatibilidade
  const verificarCompatibilidade = useCallback(() => {
    const suporte = {
      speechSynthesis: 'speechSynthesis' in window,
      webAudio: !!(window.AudioContext || (window as any).webkitAudioContext),
      ariaLive: true, // Sempre suportado
      focusVisible: CSS.supports('selector(:focus-visible)'),
      prefersReducedMotion: window.matchMedia('(prefers-reduced-motion)').matches !== undefined,
      prefersColorScheme: window.matchMedia('(prefers-color-scheme)').matches !== undefined,
      prefersContrast: window.matchMedia('(prefers-contrast)').matches !== undefined
    };

    return suporte;
  }, []);

  // Estatísticas de uso
  const estatisticas = {
    totalInteracoes: logs.length,
    interacoesTeclado: logs.filter(l => l.metodo === 'teclado').length,
    interacoesMouse: logs.filter(l => l.metodo === 'mouse').length,
    sucessos: logs.filter(l => l.sucesso).length,
    tempoMedioResposta: logs.reduce((acc, l) => acc + (l.tempoResposta || 0), 0) / logs.length || 0,
    elementosMaisFocados: logs.reduce((acc, l) => {
      acc[l.elemento] = (acc[l.elemento] || 0) + 1;
      return acc;
    }, {} as { [key: string]: number })
  };

  return {
    // Estados
    configuracao,
    perfis,
    perfilAtivo,
    logs,
    elementoFocado,
    anuncioAtivo,
    ajudaVisivel,
    estatisticas,

    // Ações
    setConfiguracao,
    aplicarPerfil,
    criarPerfil,
    excluirPerfil,
    anunciar,
    reproduzirFeedback,
    navegarTeclado,
    gerenciarFoco,
    registrarLog,
    setAjudaVisivel,

    // Utilitários
    obterDescricao,
    verificarCompatibilidade,
    aplicarConfiguracoes
  };
};

export default useAcessibilidade;