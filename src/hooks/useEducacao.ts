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
  ConfiguracaoEducacao,
  HistoricoEducacao,
  RecomendacaoEducativa,
  PesquisaEducativa,
  ResultadoPesquisa,
  ProgressoTutorial,
  AvaliacaoTutorial
} from '../types/educacao';

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

  // Dados iniciais do glossário
  const glossarioInicial: TermoGlossario[] = [
    {
      id: 'juros-compostos',
      termo: 'Juros Compostos',
      definicao: 'Sistema de capitalização onde os juros são calculados sobre o capital inicial acrescido dos juros acumulados dos períodos anteriores.',
      categoria: 'basico',
      tags: ['investimento', 'capitalização', 'rendimento'],
      exemplos: [
        'R$ 1.000 a 10% ao ano por 2 anos = R$ 1.210',
        'Reinvestimento de dividendos em ações'
      ],
      termosRelacionados: ['capitalização', 'rendimento', 'investimento'],
      dataAtualizacao: Date.now()
    },
    {
      id: 'taxa-selic',
      termo: 'Taxa Selic',
      definicao: 'Taxa básica de juros da economia brasileira, definida pelo Comitê de Política Monetária (Copom) do Banco Central.',
      categoria: 'intermediario',
      tags: ['economia', 'juros', 'política monetária'],
      exemplos: [
        'Referência para CDI e poupança',
        'Influencia todos os juros da economia'
      ],
      termosRelacionados: ['cdi', 'copom', 'banco-central'],
      dataAtualizacao: Date.now()
    },
    {
      id: 'diversificacao',
      termo: 'Diversificação',
      definicao: 'Estratégia de investimento que consiste em distribuir recursos entre diferentes ativos para reduzir riscos.',
      categoria: 'intermediario',
      tags: ['estratégia', 'risco', 'portfólio'],
      exemplos: [
        'Investir em ações, renda fixa e fundos imobiliários',
        'Distribuir investimentos entre setores diferentes'
      ],
      termosRelacionados: ['risco', 'portfolio', 'alocacao'],
      dataAtualizacao: Date.now()
    }
  ];

  // Dados iniciais de dicas
  const dicasIniciais: DicaFinanceira[] = [
    {
      id: 'regra-72',
      titulo: 'Regra dos 72',
      conteudo: 'Para descobrir em quantos anos seu dinheiro dobrará, divida 72 pela taxa de juros anual. Por exemplo: 72 ÷ 8% = 9 anos.',
      categoria: 'investimento',
      nivel: 'iniciante',
      tags: ['cálculo', 'tempo', 'duplicação'],
      contexto: 'calculadora',
      relevancia: 9,
      visualizacoes: 0,
      curtidas: 0,
      dataPublicacao: Date.now()
    },
    {
      id: 'emergencia-primeiro',
      titulo: 'Reserva de Emergência Primeiro',
      conteudo: 'Antes de investir, tenha uma reserva de emergência equivalente a 6-12 meses de gastos em aplicações líquidas e seguras.',
      categoria: 'planejamento',
      nivel: 'iniciante',
      tags: ['emergência', 'planejamento', 'segurança'],
      relevancia: 10,
      visualizacoes: 0,
      curtidas: 0,
      dataPublicacao: Date.now()
    },
    {
      id: 'tempo-aliado',
      titulo: 'Tempo é seu Maior Aliado',
      conteudo: 'Quanto mais cedo começar a investir, maior será o poder dos juros compostos. Mesmo pequenos valores podem se tornar grandes fortunas.',
      categoria: 'investimento',
      nivel: 'iniciante',
      tags: ['tempo', 'juros compostos', 'início'],
      relevancia: 9,
      visualizacoes: 0,
      curtidas: 0,
      dataPublicacao: Date.now()
    }
  ];

  // Dados iniciais de tutoriais
  const tutoriaisIniciais: TutorialInterativo[] = [
    {
      id: 'introducao-juros-compostos',
      titulo: 'Introdução aos Juros Compostos',
      descricao: 'Aprenda o conceito fundamental dos juros compostos e como eles podem multiplicar seus investimentos.',
      categoria: 'calculadora',
      nivel: 'iniciante',
      duracao: 15,
      etapas: [
        {
          id: 'conceito',
          titulo: 'O que são Juros Compostos?',
          descricao: 'Entenda a diferença entre juros simples e compostos',
          tipo: 'explicacao',
          conteudo: {
            texto: 'Juros compostos são juros calculados sobre o capital inicial acrescido dos juros acumulados dos períodos anteriores. É o famoso "juros sobre juros".'
          },
          tempoEstimado: 3,
          obrigatoria: true
        },
        {
          id: 'calculo-pratico',
          titulo: 'Calculando na Prática',
          descricao: 'Use a calculadora para ver os juros compostos em ação',
          tipo: 'interacao',
          conteudo: {
            interacao: {
              tipo: 'calculadora',
              elemento: '#valor-inicial',
              acao: 'inserir-valor',
              valorEsperado: 1000,
              feedback: 'Ótimo! Agora vamos ver como R$ 1.000 cresce ao longo do tempo.'
            }
          },
          tempoEstimado: 5,
          obrigatoria: true
        },
        {
          id: 'quiz-final',
          titulo: 'Teste seus Conhecimentos',
          descricao: 'Quiz sobre juros compostos',
          tipo: 'quiz',
          conteudo: {
            quiz: {
              pergunta: 'Qual a principal vantagem dos juros compostos?',
              opcoes: [
                { id: 'a', texto: 'Rendimento linear', correta: false },
                { id: 'b', texto: 'Crescimento exponencial', correta: true },
                { id: 'c', texto: 'Menor risco', correta: false }
              ],
              respostaCorreta: 1,
              explicacao: 'Os juros compostos proporcionam crescimento exponencial porque os juros rendem juros.',
              tentativasPermitidas: 3
            }
          },
          tempoEstimado: 2,
          obrigatoria: true
        }
      ],
      prerequisitos: [],
      objetivos: [
        'Entender o conceito de juros compostos',
        'Saber calcular juros compostos',
        'Reconhecer a importância do tempo nos investimentos'
      ],
      recursos: [
        {
          tipo: 'calculadora',
          titulo: 'Calculadora de Juros Compostos',
          descricao: 'Use nossa calculadora para experimentar'
        }
      ]
    }
  ];

  // Dados iniciais de conquistas
  const conquistasIniciais: ConquistaEducativa[] = [
    {
      id: 'primeiro-tutorial',
      nome: 'Primeiro Passo',
      descricao: 'Complete seu primeiro tutorial',
      icone: '🎯',
      categoria: 'tutorial',
      criterios: [
        {
          tipo: 'tutoriais_completos',
          valor: 1,
          descricao: 'Completar 1 tutorial'
        }
      ],
      recompensa: {
        tipo: 'badge',
        valor: 'primeiro-tutorial',
        descricao: 'Badge de Primeiro Tutorial'
      },
      raridade: 'comum'
    },
    {
      id: 'estudioso',
      nome: 'Estudioso',
      descricao: 'Estude por 1 hora total',
      icone: '📚',
      categoria: 'pratica',
      criterios: [
        {
          tipo: 'tempo_estudo',
          valor: 60,
          descricao: 'Estudar por 60 minutos'
        }
      ],
      recompensa: {
        tipo: 'titulo',
        valor: 'Estudioso',
        descricao: 'Título de Estudioso'
      },
      raridade: 'raro'
    }
  ];

  // Inicialização
  useEffect(() => {
    carregarDados();
  }, []);

  // Carregar dados salvos
  const carregarDados = useCallback(() => {
    try {
      // Carregar configuração
      const configSalva = localStorage.getItem('educacao-config');
      if (configSalva) {
        setConfiguracao(JSON.parse(configSalva));
      }

      // Carregar perfil
      const perfilSalvo = localStorage.getItem('educacao-perfil');
      if (perfilSalvo) {
        setPerfil(JSON.parse(perfilSalvo));
      } else {
        // Criar perfil inicial
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
          areas: {},
          preferencias: {
            nivelPreferido: 'iniciante',
            categoriasInteresse: [],
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

      // Carregar dados de conteúdo
      setGlossario(glossarioInicial);
      setDicas(dicasIniciais);
      setTutoriais(tutoriaisIniciais);
      setConquistas(conquistasIniciais);

    } catch (error) {
      console.error('Erro ao carregar dados de educação:', error);
    }
  }, []);

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

    // Atualizar perfil
    const novoPerfilData = {
      ...perfil,
      experiencia: perfil.experiencia + sessaoAtual.experienciaGanha,
      pontuacaoTotal: perfil.pontuacaoTotal + sessaoAtual.pontuacaoGanha,
      tempoTotalEstudo: perfil.tempoTotalEstudo + (Date.now() - sessaoAtual.inicio) / 1000 / 60
    };

    // Verificar se subiu de nível
    if (novoPerfilData.experiencia >= novoPerfilData.proximoNivel) {
      novoPerfilData.nivel += 1;
      novoPerfilData.proximoNivel = novoPerfilData.nivel * 100;
    }

    setPerfil(novoPerfilData);

    // Atualizar histórico
    setHistorico(prev => ({
      ...prev,
      sessoes: [...prev.sessoes, sessaoFinalizada]
    }));

    setSessaoAtual(null);
  }, [sessaoAtual, perfil]);

  // Registrar atividade na sessão
  const registrarAtividade = useCallback((atividade: Omit<any, 'id'>) => {
    if (!sessaoAtual) return;

    const novaAtividade = {
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

    setPerfil(novoPerfilData);

    // Registrar atividade
    registrarAtividade({
      tipo: 'tutorial',
      titulo: tutorial.titulo,
      tempoGasto: tutorial.duracao,
      concluida: true,
      pontuacao: 50
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

    setPerfil(novoPerfilData);

    // Registrar atividade
    registrarAtividade({
      tipo: 'artigo',
      titulo: artigo.titulo,
      tempoGasto: artigo.tempoLeitura,
      concluida: true,
      pontuacao: 20
    });

    // Atualizar visualizações do artigo
    setArtigos(prev => prev.map(a => 
      a.id === artigoId 
        ? { ...a, visualizacoes: a.visualizacoes + 1 }
        : a
    ));
  }, [perfil, artigos, registrarAtividade]);

  // Verificar conquistas
  const verificarConquistas = useCallback(() => {
    if (!perfil) return;

    const novasConquistas: string[] = [];

    conquistas.forEach(conquista => {
      if (perfil.conquistas.includes(conquista.id)) return;

      let criteriosAtendidos = 0;

      conquista.criterios.forEach(criterio => {
        switch (criterio.tipo) {
          case 'tutoriais_completos':
            if (perfil.tutoriaisCompletos.length >= criterio.valor) {
              criteriosAtendidos++;
            }
            break;
          case 'artigos_lidos':
            if (perfil.artigosLidos.length >= criterio.valor) {
              criteriosAtendidos++;
            }
            break;
          case 'tempo_estudo':
            if (perfil.tempoTotalEstudo >= criterio.valor) {
              criteriosAtendidos++;
            }
            break;
          case 'pontuacao':
            if (perfil.pontuacaoTotal >= criterio.valor) {
              criteriosAtendidos++;
            }
            break;
        }
      });

      if (criteriosAtendidos === conquista.criterios.length) {
        novasConquistas.push(conquista.id);
      }
    });

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
            id,
            desbloqueadaEm: Date.now()
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

  // Obter recomendações
  const obterRecomendacoes = useCallback((): RecomendacaoEducativa[] => {
    if (!perfil) return [];

    const recomendacoes: RecomendacaoEducativa[] = [];

    // Recomendar tutoriais não completados
    tutoriais
      .filter(t => !perfil.tutoriaisCompletos.includes(t.id))
      .slice(0, 3)
      .forEach(tutorial => {
        recomendacoes.push({
          id: tutorial.id,
          tipo: 'tutorial',
          titulo: tutorial.titulo,
          motivo: 'Tutorial recomendado para seu nível',
          relevancia: 0.9,
          categoria: tutorial.categoria,
          nivel: tutorial.nivel,
          tempoEstimado: tutorial.duracao
        });
      });

    // Recomendar artigos não lidos
    artigos
      .filter(a => !perfil.artigosLidos.includes(a.id))
      .slice(0, 2)
      .forEach(artigo => {
        recomendacoes.push({
          id: artigo.id,
          tipo: 'artigo',
          titulo: artigo.titulo,
          motivo: 'Artigo popular em sua área de interesse',
          relevancia: 0.7,
          categoria: artigo.categoria,
          nivel: artigo.nivel,
          tempoEstimado: artigo.tempoLeitura
        });
      });

    return recomendacoes.sort((a, b) => b.relevancia - a.relevancia);
  }, [perfil, tutoriais, artigos]);

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

    // Utilitários
    carregarDados,
    salvarDados
  };
};

export default useEducacao;