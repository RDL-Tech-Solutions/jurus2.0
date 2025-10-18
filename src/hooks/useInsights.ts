import { useState, useEffect, useMemo, useCallback } from 'react';
import { useHistorico } from '../store/useAppStore';
import {
  DashboardInsights,
  SugestaoPersonalizada,
  AlertaOportunidade,
  MetricaPerformance,
  ConfiguracaoInsights,
  ConquistaInsights,
  PontuacaoUsuario
} from '../types/insights';
import {
  gerarDashboardInsights,
  verificarConquistas,
  calcularPontuacaoUsuario,
  formatarMoeda,
  formatarPorcentagem
} from '../utils/insights';

export const useInsights = () => {
  const { historico } = useHistorico();
  
  // Estados locais
  const [insights, setInsights] = useState<DashboardInsights | null>(null);
  const [configuracao, setConfiguracao] = useState<ConfiguracaoInsights>({
    alertasAtivos: true,
    frequenciaAnalise: 'semanal',
    tiposAlerta: ['meta_proxima', 'taxa_atrativa', 'rebalanceamento'],
    limitesSugestoes: {
      maxSugestoesPorTipo: 3,
      minimoConfianca: 70
    },
    personalizacao: {
      focoRentabilidade: 70,
      focoSeguranca: 50,
      focoLiquidez: 30
    }
  });
  
  const [conquistasDesbloqueadas, setConquistasDesbloqueadas] = useState<ConquistaInsights[]>([]);
  const [pontuacaoUsuario, setPontuacaoUsuario] = useState<PontuacaoUsuario | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [ultimaAtualizacao, setUltimaAtualizacao] = useState<Date | null>(null);

  // Gerar insights automaticamente quando o histórico muda
  useEffect(() => {
    const gerarInsights = async () => {
      if (historico.length === 0) {
        setInsights(null);
        return;
      }

      setIsLoading(true);
      
      try {
        // Simular um pequeno delay para mostrar loading
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const novosInsights = gerarDashboardInsights(historico);
        setInsights(novosInsights);
        setUltimaAtualizacao(new Date());
        
        // Verificar novas conquistas
        const novasConquistas = verificarConquistas(historico, conquistasDesbloqueadas);
        if (novasConquistas.length > 0) {
          setConquistasDesbloqueadas(prev => [...prev, ...novasConquistas]);
        }
        
        // Atualizar pontuação
        const novaPontuacao = calcularPontuacaoUsuario(historico, [...conquistasDesbloqueadas, ...novasConquistas]);
        setPontuacaoUsuario(novaPontuacao);
        
      } catch (error) {
        console.error('Erro ao gerar insights:', error);
      } finally {
        setIsLoading(false);
      }
    };

    gerarInsights();
  }, [historico, conquistasDesbloqueadas]);

  // Filtrar sugestões baseado na configuração
  const sugestoesFiltradas = useMemo(() => {
    if (!insights) return [];
    
    return insights.sugestoes
      .filter(s => !s.visualizada || s.prioridade === 'alta')
      .slice(0, configuracao.limitesSugestoes.maxSugestoesPorTipo * 3);
  }, [insights, configuracao]);

  // Filtrar alertas baseado na configuração
  const alertasFiltrados = useMemo(() => {
    if (!insights) return [];
    
    return insights.alertas
      .filter(a => configuracao.alertasAtivos && configuracao.tiposAlerta.includes(a.tipo))
      .filter(a => !a.descartado);
  }, [insights, configuracao]);

  // Métricas principais
  const metricasPrincipais = useMemo(() => {
    if (!insights) return [];
    
    return insights.metricas.filter(m => 
      ['rendimento_medio', 'valor_medio_investido', 'consistencia'].includes(m.id)
    );
  }, [insights]);

  // Estatísticas resumidas
  const estatisticasResumo = useMemo(() => {
    if (!insights) return null;
    
    const { resumoExecutivo } = insights;
    
    return {
      totalSimulacoes: resumoExecutivo.totalSimulacoes,
      rendimentoMedio: resumoExecutivo.rendimentoMedioProjetado,
      metasProximas: resumoExecutivo.metasProximas,
      oportunidades: resumoExecutivo.oportunidadesIdentificadas,
      pontuacao: resumoExecutivo.pontuacaoGeral,
      nivel: pontuacaoUsuario?.nivel || 1,
      proximoNivel: pontuacaoUsuario?.proximoNivel.pontosNecessarios || 0
    };
  }, [insights, pontuacaoUsuario]);

  // Funções de ação
  const marcarSugestaoComoVisualizada = useCallback((sugestaoId: string) => {
    setInsights(prev => {
      if (!prev) return prev;
      
      return {
        ...prev,
        sugestoes: prev.sugestoes.map(s => 
          s.id === sugestaoId ? { ...s, visualizada: true } : s
        )
      };
    });
  }, []);

  const aplicarSugestao = useCallback((sugestaoId: string) => {
    setInsights(prev => {
      if (!prev) return prev;
      
      return {
        ...prev,
        sugestoes: prev.sugestoes.map(s => 
          s.id === sugestaoId ? { ...s, aplicada: true, visualizada: true } : s
        )
      };
    });
  }, []);

  const descartarAlerta = useCallback((alertaId: string) => {
    setInsights(prev => {
      if (!prev) return prev;
      
      return {
        ...prev,
        alertas: prev.alertas.map(a => 
          a.id === alertaId ? { ...a, descartado: true } : a
        )
      };
    });
  }, []);

  const marcarAlertaComoVisualizado = useCallback((alertaId: string) => {
    setInsights(prev => {
      if (!prev) return prev;
      
      return {
        ...prev,
        alertas: prev.alertas.map(a => 
          a.id === alertaId ? { ...a, visualizado: true } : a
        )
      };
    });
  }, []);

  const atualizarConfiguracao = useCallback((novaConfiguracao: Partial<ConfiguracaoInsights>) => {
    setConfiguracao(prev => ({ ...prev, ...novaConfiguracao }));
  }, []);

  const forcarAtualizacao = useCallback(async () => {
    if (historico.length === 0) return;
    
    setIsLoading(true);
    
    try {
      const novosInsights = gerarDashboardInsights(historico);
      setInsights(novosInsights);
      setUltimaAtualizacao(new Date());
    } catch (error) {
      console.error('Erro ao atualizar insights:', error);
    } finally {
      setIsLoading(false);
    }
  }, [historico]);

  // Obter sugestões por categoria
  const obterSugestoesPorCategoria = useCallback((categoria: string) => {
    if (!insights) return [];
    
    return insights.sugestoes.filter(s => s.categoria === categoria);
  }, [insights]);

  // Obter métricas por categoria
  const obterMetricasPorCategoria = useCallback((categoria: string) => {
    if (!insights) return [];
    
    return insights.metricas.filter(m => m.categoria === categoria);
  }, [insights]);

  // Verificar se há novos insights disponíveis
  const temNovosInsights = useMemo(() => {
    if (!insights || !ultimaAtualizacao) return false;
    
    const agora = new Date();
    const diferencaHoras = (agora.getTime() - ultimaAtualizacao.getTime()) / (1000 * 60 * 60);
    
    // Considerar novos insights se passou mais de 1 hora desde a última atualização
    return diferencaHoras > 1;
  }, [ultimaAtualizacao]);

  // Obter insights de tendências
  const tendenciasIdentificadas = useMemo(() => {
    if (!insights) return [];
    
    return insights.padroes.filter(p => p.confianca > 70);
  }, [insights]);

  // Calcular score de saúde financeira
  const scoreFinanceiro = useMemo(() => {
    if (!insights || !pontuacaoUsuario) return 0;
    
    const baseScore = Math.min(100, pontuacaoUsuario.total / 10);
    const consistenciaBonus = insights.analiseComportamental.caracteristicas.consistencia * 0.2;
    const diversificacaoBonus = insights.analiseComportamental.caracteristicas.diversificacao * 0.1;
    
    return Math.min(100, baseScore + consistenciaBonus + diversificacaoBonus);
  }, [insights, pontuacaoUsuario]);

  // Obter recomendações prioritárias
  const recomendacoesPrioritarias = useMemo(() => {
    if (!insights) return [];
    
    const sugestoesPrioritarias = insights.sugestoes
      .filter(s => s.prioridade === 'alta' && !s.aplicada)
      .slice(0, 3);
    
    const alertasUrgentes = insights.alertas
      .filter(a => a.urgencia === 'alta' && !a.descartado)
      .slice(0, 2);
    
    return {
      sugestoes: sugestoesPrioritarias,
      alertas: alertasUrgentes,
      total: sugestoesPrioritarias.length + alertasUrgentes.length
    };
  }, [insights]);

  return {
    // Estados
    insights,
    isLoading,
    ultimaAtualizacao,
    configuracao,
    conquistasDesbloqueadas,
    pontuacaoUsuario,
    
    // Dados processados
    sugestoesFiltradas,
    alertasFiltrados,
    metricasPrincipais,
    estatisticasResumo,
    tendenciasIdentificadas,
    scoreFinanceiro,
    recomendacoesPrioritarias,
    temNovosInsights,
    
    // Ações
    marcarSugestaoComoVisualizada,
    aplicarSugestao,
    descartarAlerta,
    marcarAlertaComoVisualizado,
    atualizarConfiguracao,
    forcarAtualizacao,
    
    // Utilitários
    obterSugestoesPorCategoria,
    obterMetricasPorCategoria,
    formatarMoeda,
    formatarPorcentagem
  };
};