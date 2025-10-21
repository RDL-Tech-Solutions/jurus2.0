// Hook para Sistema de Educação Financeira

import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  TermoGlossario,
  DicaFinanceira,
  TutorialInterativo,
  ArtigoEducativo,
  ConquistaEducativa,
  PerfilEducativo,
  SessaoEstudo,
  AtividadeEstudo,
  ConfiguracaoEducacao,
  HistoricoEducacao,
  RecomendacaoEducativa,
  PesquisaEducativa,
  ResultadoPesquisa,
  ProgressoTutorial,
  AvaliacaoTutorial
} from '../types/educacao';
import {
  glossarioCompleto,
  dicasCompletas,
  tutoriaisCompletos,
  artigosCompletos,
  conquistasCompletas,
  calcularProgressoAprendizado,
  gerarRecomendacoesPersonalizadas,
  calcularEstatisticasAvancadas,
  verificarConquistasAvancadas,
  gerarPlanoEstudos
} from '../utils/educacao';

const useEducacao = () => {
  // Estados principais
  const [glossario, setGlossario] = useState<TermoGlossario[]>([]);
  const [dicas, setDicas] = useState<DicaFinanceira[]>([]);
  const [tutoriais, setTutoriais] = useState<TutorialInterativo[]>([]);
  const [artigos, setArtigos] = useState<ArtigoEducativo[]>([]);
  const [conquistas, setConquistas] = useState<ConquistaEducativa[]>([]);
  const [perfil, setPerfil] = useState<PerfilEducativo | null>(null);
  const [sessaoAtual, setSessaoAtual] = useState<SessaoEstudo | null>(null);
  const [configuracao, setConfiguracao] = useState<ConfiguracaoEducacao>({
    dicasContextuais: true,
    explicacoesDetalhadas: true,
    exemplosVisuais: true,
    tutoriaisInterativos: true,
    notificacoes: true,
    gamificacao: true,
    nivelDificuldade: 'automatico',
    idioma: 'pt-BR',
    tema: 'auto'
  });
  const [historico, setHistorico] = useState<HistoricoEducacao>({
    sessoes: [],
    conquistas: [],
    marcos: []
  });

  // Estados de interface
  const [loading, setLoading] = useState(false);
  const [pesquisa, setPesquisa] = useState<PesquisaEducativa | null>(null);
  const [tutorialAtivo, setTutorialAtivo] = useState<string | null>(null);
  const [ultimaAtualizacao, setUltimaAtualizacao] = useState<number>(Date.now());

  // Carregar dados iniciais
  const carregarDados = useCallback(() => {
    try {
      setLoading(true);

      // Carregar configuração
      const configSalva = localStorage.getItem('educacao-config');
      if (configSalva) {
        setConfiguracao(JSON.parse(configSalva));
      }

      // Carregar ou criar perfil
      const perfilSalvo = localStorage.getItem('educacao-perfil');
      if (perfilSalvo) {
        setPerfil(JSON.parse(perfilSalvo));
      } else {
        const novoPerfil: PerfilEducativo = {
          id: 'user-' + Date.now(),
          nivel: 1,
          experiencia: 0,
          proximoNivel: 100,
          conquistas: [],
          tutoriaisCompletos: [],
          artigosLidos: [],
          tempoTotalEstudo: 0,
          pontuacaoTotal: 0,
          areas: {
            'conceitos': { nivel: 1, experiencia: 0, tutoriais: 0, artigos: 0 },
            'estrategias': { nivel: 1, experiencia: 0, tutoriais: 0, artigos: 0 },
            'mercado': { nivel: 1, experiencia: 0, tutoriais: 0, artigos: 0 },
            'impostos': { nivel: 1, experiencia: 0, tutoriais: 0, artigos: 0 },
            'planejamento': { nivel: 1, experiencia: 0, tutoriais: 0, artigos: 0 }
          },
          preferencias: {
            nivelPreferido: 'iniciante',
            categoriasInteresse: ['conceitos', 'planejamento'],
            formatoPreferido: 'interativo',
            tempoSessao: 30,
            lembretes: true,
            notificacoes: {
              novosConteudos: true,
              conquistasDesbloqueadas: true,
              lembreteEstudo: true
            }
          },
          estatisticas: {
            diasConsecutivos: 0,
            maiorSequencia: 0,
            mediaTempoSessao: 0,
            progressoSemanal: []
          }
        };
        setPerfil(novoPerfil);
        localStorage.setItem('educacao-perfil', JSON.stringify(novoPerfil));
      }

      // Carregar histórico
      const historicoSalvo = localStorage.getItem('educacao-historico');
      if (historicoSalvo) {
        setHistorico(JSON.parse(historicoSalvo));
      }

      // Carregar dados de conteúdo expandidos
      setGlossario(glossarioCompleto);
      setDicas(dicasCompletas);
      setTutoriais(tutoriaisCompletos);
      setArtigos(artigosCompletos);
      setConquistas(conquistasCompletas);

    } catch (error) {
      console.error('Erro ao carregar dados de educação:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Carregar dados na inicialização
  useEffect(() => {
    carregarDados();
  }, [carregarDados]);

  // Salvar dados
  const salvarDados = useCallback(() => {
    try {
      localStorage.setItem('educacao-config', JSON.stringify(configuracao));
      if (perfil) {
        localStorage.setItem('educacao-perfil', JSON.stringify(perfil));
      }
      localStorage.setItem('educacao-historico', JSON.stringify(historico));
      setUltimaAtualizacao(Date.now());
    } catch (error) {
      console.error('Erro ao salvar dados de educação:', error);
    }
  }, [configuracao, perfil, historico]);

  // Salvar automaticamente quando dados mudarem
  useEffect(() => {
    salvarDados();
  }, [configuracao, perfil, historico, salvarDados]);

  // Buscar termo no glossário
  const buscarTermo = useCallback((termo: string): TermoGlossario | undefined => {
    return glossario.find(t => 
      t.termo.toLowerCase().includes(termo.toLowerCase()) ||
      t.tags.some(tag => tag.toLowerCase().includes(termo.toLowerCase()))
    );
  }, [glossario]);

  // Obter dicas contextuais
  const obterDicasContextuais = useCallback((contexto: string, nivel?: string): DicaFinanceira[] => {
    if (!configuracao.dicasContextuais) return [];

    return dicas
      .filter(dica => 
        (!dica.contexto || dica.contexto === contexto) &&
        (!nivel || dica.nivel === nivel)
      )
      .sort((a, b) => b.relevancia - a.relevancia)
      .slice(0, 3);
  }, [dicas, configuracao.dicasContextuais]);

  // Iniciar sessão de estudo
  const iniciarSessao = useCallback(() => {
    const novaSessao: SessaoEstudo = {
      id: 'sessao-' + Date.now(),
      inicio: Date.now(),
      atividades: [],
      pontuacaoGanha: 0,
      experienciaGanha: 0,
      conquistasDesbloqueadas: []
    };

    setSessaoAtual(novaSessao);
    return novaSessao.id;
  }, []);

  // Finalizar sessão de estudo
  const finalizarSessao = useCallback(() => {
    if (!sessaoAtual || !perfil) return;

    const sessaoFinalizada = {
      ...sessaoAtual,
      fim: Date.now()
    };

    // Atualizar perfil com experiência e pontuação
    const novoPerfilData = {
      ...perfil,
      experiencia: perfil.experiencia + sessaoAtual.experienciaGanha,
      pontuacaoTotal: perfil.pontuacaoTotal + sessaoAtual.pontuacaoGanha,
      tempoTotalEstudo: perfil.tempoTotalEstudo + (Date.now() - sessaoAtual.inicio) / 1000 / 60
    };

    // Verificar se subiu de nível
    while (novoPerfilData.experiencia >= novoPerfilData.proximoNivel) {
      novoPerfilData.nivel += 1;
      novoPerfilData.experiencia -= novoPerfilData.proximoNivel;
      novoPerfilData.proximoNivel = novoPerfilData.nivel * 100;
    }

    // Atualizar estatísticas
    novoPerfilData.estatisticas = calcularEstatisticasAvancadas(novoPerfilData, historico);

    setPerfil(novoPerfilData);

    // Atualizar histórico
    setHistorico(prev => ({
      ...prev,
      sessoes: [...prev.sessoes, sessaoFinalizada]
    }));

    // Verificar novas conquistas
    verificarConquistas();

    setSessaoAtual(null);
  }, [sessaoAtual, perfil, historico]);

  // Registrar atividade na sessão
  const registrarAtividade = useCallback((atividade: Omit<AtividadeEstudo, 'id'>) => {
    if (!sessaoAtual) return;

    const novaAtividade: AtividadeEstudo = {
      ...atividade,
      id: 'atividade-' + Date.now()
    };

    setSessaoAtual(prev => prev ? {
      ...prev,
      atividades: [...prev.atividades, novaAtividade],
      experienciaGanha: prev.experienciaGanha + (atividade.pontuacao || 0),
      pontuacaoGanha: prev.pontuacaoGanha + (atividade.pontuacao || 0)
    } : null);
  }, [sessaoAtual]);

  // Completar tutorial
  const completarTutorial = useCallback((tutorialId: string, avaliacao?: AvaliacaoTutorial) => {
    if (!perfil) return;

    const tutorial = tutoriais.find(t => t.id === tutorialId);
    if (!tutorial) return;

    // Atualizar perfil
    const novoPerfilData = {
      ...perfil,
      tutoriaisCompletos: [...perfil.tutoriaisCompletos, tutorialId]
    };

    // Atualizar área específica
    if (novoPerfilData.areas[tutorial.categoria]) {
      novoPerfilData.areas[tutorial.categoria].tutoriais += 1;
      novoPerfilData.areas[tutorial.categoria].experiencia += 50;
    }

    setPerfil(novoPerfilData);

    // Registrar atividade
    registrarAtividade({
      tipo: 'tutorial',
      conteudoId: tutorial.id,
      titulo: tutorial.titulo,
      tempoGasto: tutorial.duracao,
      concluida: true,
      pontuacao: 50,
      timestamp: Date.now()
    });

    // Verificar conquistas
    verificarConquistas();

    setTutorialAtivo(null);
  }, [perfil, tutoriais, registrarAtividade]);

  // Ler artigo
  const lerArtigo = useCallback((artigoId: string) => {
    if (!perfil) return;

    const artigo = artigos.find(a => a.id === artigoId);
    if (!artigo) return;

    // Atualizar perfil
    const novoPerfilData = {
      ...perfil,
      artigosLidos: [...perfil.artigosLidos, artigoId]
    };

    // Atualizar área específica
    if (novoPerfilData.areas[artigo.categoria]) {
      novoPerfilData.areas[artigo.categoria].artigos += 1;
      novoPerfilData.areas[artigo.categoria].experiencia += 20;
    }

    setPerfil(novoPerfilData);

    // Registrar atividade
    registrarAtividade({
      tipo: 'artigo',
      conteudoId: artigo.id,
      titulo: artigo.titulo,
      tempoGasto: artigo.tempoLeitura,
      concluida: true,
      pontuacao: 20,
      timestamp: Date.now()
    });

    // Atualizar visualizações do artigo
    setArtigos(prev => prev.map(a => 
      a.id === artigoId 
        ? { ...a, visualizacoes: a.visualizacoes + 1 }
        : a
    ));

    // Verificar conquistas
    verificarConquistas();
  }, [perfil, artigos, registrarAtividade]);

  // Verificar conquistas usando função avançada
  const verificarConquistas = useCallback(() => {
    if (!perfil) return;

    const novasConquistas = verificarConquistasAvancadas(perfil, conquistas);

    if (novasConquistas.length > 0) {
      setPerfil(prev => prev ? {
        ...prev,
        conquistas: [...prev.conquistas, ...novasConquistas]
      } : null);

      // Atualizar histórico
      setHistorico(prev => ({
        ...prev,
        conquistas: [
          ...prev.conquistas,
          ...novasConquistas.map(id => ({
            conquistaId: id,
            dataDesbloqueio: Date.now(),
            contexto: 'Conquista desbloqueada automaticamente'
          }))
        ]
      }));

      // Atualizar sessão atual
      if (sessaoAtual) {
        setSessaoAtual(prev => prev ? {
          ...prev,
          conquistasDesbloqueadas: [...prev.conquistasDesbloqueadas, ...novasConquistas]
        } : null);
      }
    }
  }, [perfil, conquistas, sessaoAtual]);

  // Pesquisar conteúdo
  const pesquisar = useCallback((termo: string, filtros?: any): ResultadoPesquisa[] => {
    const resultados: ResultadoPesquisa[] = [];

    // Buscar no glossário
    glossario.forEach(item => {
      if (item.termo.toLowerCase().includes(termo.toLowerCase()) ||
          item.definicao.toLowerCase().includes(termo.toLowerCase()) ||
          item.tags.some(tag => tag.toLowerCase().includes(termo.toLowerCase()))) {
        resultados.push({
          id: item.id,
          tipo: 'termo',
          titulo: item.termo,
          descricao: item.definicao.slice(0, 100) + '...',
          relevancia: 0.9,
          categoria: item.categoria,
          nivel: item.categoria
        });
      }
    });

    // Buscar nas dicas
    dicas.forEach(item => {
      if (item.titulo.toLowerCase().includes(termo.toLowerCase()) ||
          item.conteudo.toLowerCase().includes(termo.toLowerCase()) ||
          item.tags.some(tag => tag.toLowerCase().includes(termo.toLowerCase()))) {
        resultados.push({
          id: item.id,
          tipo: 'dica',
          titulo: item.titulo,
          descricao: item.conteudo.slice(0, 100) + '...',
          relevancia: 0.8,
          categoria: item.categoria,
          nivel: item.nivel
        });
      }
    });

    // Buscar nos tutoriais
    tutoriais.forEach(item => {
      if (item.titulo.toLowerCase().includes(termo.toLowerCase()) ||
          item.descricao.toLowerCase().includes(termo.toLowerCase())) {
        resultados.push({
          id: item.id,
          tipo: 'tutorial',
          titulo: item.titulo,
          descricao: item.descricao,
          relevancia: 1.0,
          categoria: item.categoria,
          nivel: item.nivel
        });
      }
    });

    // Buscar nos artigos
    artigos.forEach(item => {
      if (item.titulo.toLowerCase().includes(termo.toLowerCase()) ||
          item.resumo.toLowerCase().includes(termo.toLowerCase()) ||
          item.tags.some(tag => tag.toLowerCase().includes(termo.toLowerCase()))) {
        resultados.push({
          id: item.id,
          tipo: 'artigo',
          titulo: item.titulo,
          descricao: item.resumo,
          relevancia: 0.7,
          categoria: item.categoria,
          nivel: item.nivel
        });
      }
    });

    return resultados.sort((a, b) => b.relevancia - a.relevancia);
  }, [glossario, dicas, tutoriais, artigos]);

  // Obter recomendações usando função avançada
  const obterRecomendacoes = useCallback((): RecomendacaoEducativa[] => {
    if (!perfil) return [];
    return gerarRecomendacoesPersonalizadas(perfil, tutoriais, artigos);
  }, [perfil, tutoriais, artigos]);

  // Obter plano de estudos
  const obterPlanoEstudos = useCallback(() => {
    if (!perfil) return null;
    return gerarPlanoEstudos(perfil, tutoriais, artigos);
  }, [perfil, tutoriais, artigos]);

  // Obter progresso de aprendizado
  const obterProgressoAprendizado = useCallback(() => {
    if (!perfil) return null;
    return calcularProgressoAprendizado(perfil);
  }, [perfil]);

  // Memoized selectors
  const estatisticas = useMemo(() => {
    if (!perfil) return null;

    return {
      nivel: perfil.nivel,
      experiencia: perfil.experiencia,
      proximoNivel: perfil.proximoNivel,
      progressoNivel: (perfil.experiencia / perfil.proximoNivel) * 100,
      tutoriaisCompletos: perfil.tutoriaisCompletos.length,
      artigosLidos: perfil.artigosLidos.length,
      tempoTotalEstudo: perfil.tempoTotalEstudo,
      conquistasDesbloqueadas: perfil.conquistas.length,
      pontuacaoTotal: perfil.pontuacaoTotal
    };
  }, [perfil]);

  const conquistasDesbloqueadas = useMemo(() => {
    if (!perfil) return [];
    return conquistas.filter(c => perfil.conquistas.includes(c.id));
  }, [conquistas, perfil]);

  const proximasConquistas = useMemo(() => {
    if (!perfil) return [];
    return conquistas.filter(c => !perfil.conquistas.includes(c.id)).slice(0, 3);
  }, [conquistas, perfil]);

  return {
    // Estados
    glossario,
    dicas,
    tutoriais,
    artigos,
    conquistas,
    perfil,
    sessaoAtual,
    configuracao,
    historico,
    loading,
    pesquisa,
    tutorialAtivo,
    ultimaAtualizacao,

    // Seletores
    estatisticas,
    conquistasDesbloqueadas,
    proximasConquistas,

    // Ações
    setConfiguracao,
    buscarTermo,
    obterDicasContextuais,
    iniciarSessao,
    finalizarSessao,
    registrarAtividade,
    completarTutorial,
    lerArtigo,
    verificarConquistas,
    pesquisar,
    obterRecomendacoes,
    setTutorialAtivo,
    setPesquisa,

    // Novas funcionalidades avançadas
    obterPlanoEstudos,
    obterProgressoAprendizado,

    // Utilitários
    carregarDados,
    salvarDados
  };
};

export default useEducacao;