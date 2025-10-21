import { useState, useCallback, useEffect } from 'react';
import { 
  Recomendacao, 
  PerfilInvestidor, 
  CarteiraAtual, 
  ScoreConfianca,
  EngineRecomendacoes,
  RecomendacaoIA,
  AlertaInteligente,
  AnaliseRiscoIA,
  ConfiguracaoIA
} from '../types/recomendacoes';

// Re-export types for external use
export type { 
  RecomendacaoIA, 
  AlertaInteligente, 
  AnaliseRiscoIA, 
  ConfiguracaoIA,
  PerfilInvestidor 
};

export function useRecomendacoesIA() {
  const [recomendacoes, setRecomendacoes] = useState<Recomendacao[]>([]);
  const [alertas, setAlertas] = useState<AlertaInteligente[]>([]);
  const [analiseRisco, setAnaliseRisco] = useState<AnaliseRiscoIA | null>(null);
  const [configuracao, setConfiguracao] = useState<ConfiguracaoIA | null>(null);
  const [perfilUsuario, setPerfilUsuario] = useState<PerfilInvestidor | null>(null);
  const [carteiraAtual, setCarteiraAtual] = useState<CarteiraAtual | null>(null);
  const [scoreConfianca, setScoreConfianca] = useState<ScoreConfianca | null>(null);
  const [engineStatus, setEngineStatus] = useState<EngineRecomendacoes | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Inicializar perfil do usuário
  const inicializarPerfil = useCallback(() => {
    const perfil: PerfilInvestidor = {
      id: 'user-1',
      nome: 'Investidor Exemplo',
      idade: 35,
      experiencia: 'intermediario',
      toleranciaRisco: 6,
      objetivos: [
        {
          id: 'obj-1',
          nome: 'Aposentadoria',
          valorMeta: 1000000,
          prazo: new Date(2054, 11, 31),
          prioridade: 5,
          categoria: 'aposentadoria',
          progresso: 25
        },
        {
          id: 'obj-2',
          nome: 'Casa Própria',
          valorMeta: 500000,
          prazo: new Date(2029, 6, 30),
          prioridade: 4,
          categoria: 'casa',
          progresso: 60
        }
      ],
      horizonteTemporal: 20,
      rendaAtual: 8000,
      patrimonioLiquido: 250000,
      preferenciasInvestimento: ['acoes', 'fii', 'renda_fixa'],
      restricoes: ['cripto', 'commodities']
    };

    setPerfilUsuario(perfil);
  }, []);

  // Carregar carteira atual
  const carregarCarteira = useCallback(() => {
    const carteira: CarteiraAtual = {
      id: 'carteira-1',
      valorTotal: 125000,
      alocacoes: [
        {
          id: 'acao-1',
          nome: 'Ações Brasileiras',
          tipo: 'acao',
          valor: 50000,
          percentual: 40,
          rendimento: 12.5,
          risco: 7,
          liquidez: 'alta'
        },
        {
          id: 'fii-1',
          nome: 'Fundos Imobiliários',
          tipo: 'fii',
          valor: 37500,
          percentual: 30,
          rendimento: 8.2,
          risco: 5,
          liquidez: 'media'
        },
        {
          id: 'rf-1',
          nome: 'Renda Fixa',
          tipo: 'renda_fixa',
          valor: 37500,
          percentual: 30,
          rendimento: 6.5,
          risco: 2,
          liquidez: 'alta'
        }
      ],
      diversificacao: {
        score: 75,
        concentracaoSetorial: 65,
        concentracaoGeografica: 85,
        correlacaoAtivos: 70,
        recomendacaoMelhoria: [
          'Adicionar exposição internacional',
          'Diversificar setores dentro de ações',
          'Considerar REITs internacionais'
        ]
      },
      performance: {
        rendimentoTotal: 8750,
        rendimentoAnualizado: 9.2,
        volatilidade: 15.2,
        sharpeRatio: 0.82,
        maxDrawdown: -8.5,
        comparacaoBenchmark: 3.2
      },
      ultimaAtualizacao: new Date()
    };

    setCarteiraAtual(carteira);
  }, []);

  // Gerar recomendações usando IA
  const gerarRecomendacoes = useCallback(() => {
    if (!perfilUsuario || !carteiraAtual) return;

    setLoading(true);
    setError(null);

    try {
      setTimeout(() => {
        const novasRecomendacoes: Recomendacao[] = [
          {
            id: 'rec-1',
            tipo: 'otimizacao',
            titulo: 'Otimização de Carteira',
            descricao: 'Rebalanceamento para melhorar relação risco-retorno',
            confianca: 87,
            impactoEstimado: 2.3,
            prazoImplementacao: '1-2 semanas',
            prioridade: 'alta',
            categoria: 'Otimização',
            acoes: [
              {
                id: 'acao-1',
                descricao: 'Reduzir exposição em ações para 35%',
                tipo: 'rebalanceamento',
                prioridade: 'alta',
                percentualCarteira: -5,
                executada: false
              },
              {
                id: 'acao-2',
                descricao: 'Aumentar alocação em FIIs para 35%',
                tipo: 'rebalanceamento',
                prioridade: 'alta',
                percentualCarteira: 5,
                executada: false
              }
            ],
            dataGeracao: new Date(),
            status: 'pendente',
            fundamentacao: [
              'Análise de correlação indica sobreposição de risco',
              'FIIs oferecem melhor diversificação no momento',
              'Volatilidade da carteira pode ser reduzida em 12%'
            ]
          },
          {
            id: 'rec-2',
            tipo: 'investimento',
            titulo: 'Diversificação Internacional',
            descricao: 'Adicionar exposição a mercados internacionais',
            confianca: 92,
            impactoEstimado: 3.8,
            prazoImplementacao: '2-4 semanas',
            prioridade: 'alta',
            categoria: 'Diversificação',
            acoes: [
              {
                id: 'acao-3',
                descricao: 'Investir em ETF de ações americanas',
                tipo: 'compra',
                prioridade: 'alta',
                valorEstimado: 12500,
                percentualCarteira: 10,
                executada: false
              }
            ],
            dataGeracao: new Date(),
            status: 'pendente',
            fundamentacao: [
              'Baixa correlação com mercado brasileiro',
              'Proteção cambial natural',
              'Acesso a empresas de tecnologia globais'
            ]
          },
          {
            id: 'rec-3',
            tipo: 'risco',
            titulo: 'Gestão de Risco',
            descricao: 'Implementar estratégia de proteção contra volatilidade',
            confianca: 78,
            impactoEstimado: 1.5,
            prazoImplementacao: '1 semana',
            prioridade: 'media',
            categoria: 'Proteção',
            acoes: [
              {
                id: 'acao-4',
                descricao: 'Configurar stop-loss automático',
                tipo: 'configuracao',
                prioridade: 'media',
                executada: false
              }
            ],
            dataGeracao: new Date(),
            status: 'pendente',
            fundamentacao: [
              'Volatilidade acima da média histórica',
              'Proteção contra grandes perdas',
              'Manutenção da disciplina de investimento'
            ]
          }
        ];

        setRecomendacoes(novasRecomendacoes);
        
        // Calcular score de confiança geral
        const scoreGeral: ScoreConfianca = {
          valor: 85,
          fatores: [
            {
              nome: 'Qualidade dos Dados',
              peso: 0.3,
              valor: 90,
              impacto: 'positivo',
              descricao: 'Dados históricos completos e atualizados'
            },
            {
              nome: 'Perfil de Risco',
              peso: 0.25,
              valor: 85,
              impacto: 'positivo',
              descricao: 'Perfil bem definido e consistente'
            },
            {
              nome: 'Condições de Mercado',
              peso: 0.25,
              valor: 80,
              impacto: 'neutro',
              descricao: 'Mercado em condições normais'
            },
            {
              nome: 'Diversificação Atual',
              peso: 0.2,
              valor: 75,
              impacto: 'positivo',
              descricao: 'Carteira moderadamente diversificada'
            }
          ],
          explicacao: 'Alta confiança baseada em dados robustos e perfil bem definido',
          nivelCerteza: 'alto'
        };

        setScoreConfianca(scoreGeral);

        // Gerar alertas inteligentes
        const novosAlertas: AlertaInteligente[] = [
          {
            id: 'alerta-1',
            tipo: 'risco',
            titulo: 'Concentração de Risco Detectada',
            descricao: 'Sua carteira apresenta alta concentração em ações brasileiras (40%). Considere diversificar.',
            severidade: 'media',
            dataDeteccao: new Date(),
            ativo: true,
            visualizado: false,
            acaoRecomendada: 'Reduzir exposição em ações brasileiras para 30% e aumentar diversificação internacional',
            parametros: {
              concentracaoAtual: 40,
              concentracaoRecomendada: 30,
              tipoAtivo: 'acoes_brasileiras'
            }
          },
          {
            id: 'alerta-2',
            tipo: 'oportunidade',
            titulo: 'Oportunidade de Rebalanceamento',
            descricao: 'Condições favoráveis para rebalanceamento da carteira com potencial de melhoria de 2.3%.',
            severidade: 'alta',
            dataDeteccao: new Date(),
            ativo: true,
            visualizado: false,
            acaoRecomendada: 'Executar rebalanceamento sugerido nas próximas 2 semanas',
            parametros: {
              melhoriaEstimada: 2.3,
              prazoRecomendado: '2 semanas'
            }
          }
        ];

        setAlertas(novosAlertas);

        // Gerar análise de risco
        const novaAnaliseRisco: AnaliseRiscoIA = {
          id: 'analise-1',
          portfolioId: 'carteira-1',
          nivelRisco: 65,
          categoria: 'moderado',
          fatoresRisco: {
            concentracao: 70,
            volatilidade: 60,
            liquidez: 80,
            credito: 50,
            mercado: 65
          },
          recomendacoes: [
            'Diversificar geograficamente',
            'Reduzir concentração setorial',
            'Considerar ativos de menor volatilidade'
          ],
          dataAnalise: new Date(),
          confianca: 85
        };

        setAnaliseRisco(novaAnaliseRisco);

        // Configuração inicial da IA
        const configIA: ConfiguracaoIA = {
          algoritmoRecomendacao: 'avancado',
          frequenciaAnalise: 'diaria',
          limiteConfianca: 70,
          tiposAlerta: ['risco', 'oportunidade', 'mercado'],
          personalizacao: {
            focoRentabilidade: 60,
            focoSeguranca: 30,
            focoLiquidez: 10
          },
          ativo: true
        };

        setConfiguracao(configIA);
        setLoading(false);
      }, 1500);
    } catch (err) {
      setError('Erro ao gerar recomendações');
      setLoading(false);
    }
  }, [perfilUsuario, carteiraAtual]);

  // Executar ação recomendada
  const executarAcao = useCallback((recomendacaoId: string, acaoId: string) => {
    setRecomendacoes(prev => 
      prev.map(rec => {
        if (rec.id === recomendacaoId) {
          return {
            ...rec,
            acoes: rec.acoes.map(acao => 
              acao.id === acaoId 
                ? { ...acao, executada: true, dataExecucao: new Date() }
                : acao
            )
          };
        }
        return rec;
      })
    );
  }, []);

  // Rejeitar recomendação
  const rejeitarRecomendacao = useCallback((recomendacaoId: string, motivo?: string) => {
    setRecomendacoes(prev =>
      prev.map(rec =>
        rec.id === recomendacaoId
          ? { ...rec, status: 'rejeitada' as const }
          : rec
      )
    );
  }, []);

  // Atualizar engine de IA
  const atualizarEngine = useCallback(() => {
    const engine: EngineRecomendacoes = {
      versao: '2.1.0',
      algoritmos: ['Random Forest', 'Neural Networks', 'Genetic Algorithm'],
      ultimaAtualizacao: new Date(),
      parametros: {
        pesoRisco: 0.3,
        pesoRetorno: 0.4,
        pesoDiversificacao: 0.2,
        pesoLiquidez: 0.1,
        janelaTemporal: 252, // 1 ano útil
        limiteConfianca: 70
      }
    };

    setEngineStatus(engine);
  }, []);

  // Inicializar dados
  useEffect(() => {
    inicializarPerfil();
    carregarCarteira();
    atualizarEngine();
  }, [inicializarPerfil, carregarCarteira, atualizarEngine]);

  // Gerar recomendações quando perfil e carteira estiverem prontos
  useEffect(() => {
    if (perfilUsuario && carteiraAtual) {
      gerarRecomendacoes();
    }
  }, [perfilUsuario, carteiraAtual, gerarRecomendacoes]);

  // Criar perfil
  const criarPerfil = useCallback((dadosPerfil: Partial<PerfilInvestidor>) => {
    const novoPerfil: PerfilInvestidor = {
      id: dadosPerfil.id || `perfil-${Date.now()}`,
      nome: dadosPerfil.nome || 'Novo Investidor',
      idade: dadosPerfil.idade || 30,
      experiencia: dadosPerfil.experiencia || 'iniciante',
      toleranciaRisco: dadosPerfil.toleranciaRisco || 5,
      objetivos: dadosPerfil.objetivos || [],
      horizonteTemporal: dadosPerfil.horizonteTemporal || 10,
      rendaAtual: dadosPerfil.rendaAtual || 0,
      patrimonioLiquido: dadosPerfil.patrimonioLiquido || 0,
      preferenciasInvestimento: dadosPerfil.preferenciasInvestimento || [],
      restricoes: dadosPerfil.restricoes || []
    };
    setPerfilUsuario(novoPerfil);
  }, []);

  // Atualizar perfil
  const atualizarPerfil = useCallback((dadosAtualizacao: Partial<PerfilInvestidor>) => {
    setPerfilUsuario(prev => prev ? { ...prev, ...dadosAtualizacao } : null);
  }, []);

  // Aceitar recomendação
  const aceitarRecomendacao = useCallback((recomendacaoId: string) => {
    setRecomendacoes(prev =>
      prev.map(rec =>
        rec.id === recomendacaoId
          ? { ...rec, status: 'implementada' as const }
          : rec
      )
    );
  }, []);

  // Marcar alerta como visualizado
  const marcarAlertaVisualizado = useCallback((alertaId: string) => {
    setAlertas(prev =>
      prev.map(alerta =>
        alerta.id === alertaId
          ? { ...alerta, visualizado: true }
          : alerta
      )
    );
  }, []);

  // Desativar alerta
  const desativarAlerta = useCallback((alertaId: string) => {
    setAlertas(prev =>
      prev.map(alerta =>
        alerta.id === alertaId
          ? { ...alerta, ativo: false }
          : alerta
      )
    );
  }, []);

  // Analisar perfil
  const analisarPerfil = useCallback(() => {
    if (!perfilUsuario) return null;
    
    // Análise básica do perfil
    const analise = {
      consistencia: perfilUsuario.toleranciaRisco >= 1 && perfilUsuario.toleranciaRisco <= 10,
      completude: perfilUsuario.objetivos.length > 0 && perfilUsuario.rendaAtual > 0,
      recomendacoes: [] as string[]
    };

    if (!analise.consistencia) {
      analise.recomendacoes.push('Revisar tolerância ao risco');
    }
    if (!analise.completude) {
      analise.recomendacoes.push('Completar informações do perfil');
    }

    return analise;
  }, [perfilUsuario]);

  // Atualizar configuração
  const atualizarConfiguracao = useCallback((novaConfiguracao: Partial<EngineRecomendacoes>) => {
    setEngineStatus(prev => prev ? { ...prev, ...novaConfiguracao } : null);
  }, []);

  // Resetar IA
  const resetarIA = useCallback(() => {
    setRecomendacoes([]);
    setAlertas([]);
    setAnaliseRisco(null);
    setScoreConfianca(null);
    setError(null);
    atualizarEngine();
  }, [atualizarEngine]);

  return {
    // Estado
    perfil: perfilUsuario,
    recomendacoes,
    alertas,
    analiseRisco,
    configuracao,
    isLoading: loading,
    
    // Dados adicionais
    carteiraAtual,
    scoreConfianca,
    engineStatus,
    error,
    
    // Funções de perfil
    criarPerfil,
    atualizarPerfil,
    
    // Funções de recomendações
    gerarRecomendacoes,
    aceitarRecomendacao,
    rejeitarRecomendacao,
    
    // Funções de alertas
    marcarAlertaVisualizado,
    desativarAlerta,
    
    // Funções de análise
    analisarPerfil,
    
    // Funções de configuração
    atualizarConfiguracao,
    resetarIA,
    
    // Funções legadas (para compatibilidade)
    executarAcao,
    inicializarPerfil,
    carregarCarteira,
    atualizarEngine
  };
}