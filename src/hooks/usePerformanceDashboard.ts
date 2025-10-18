import { useState, useEffect, useMemo } from 'react';
import { useLocalStorage } from './useLocalStorage';

export interface IndicadorEconomico {
  nome: string;
  valor: number;
  variacao: number;
  ultimaAtualizacao: Date;
}

export interface MetricaPerformance {
  id: string;
  nome: string;
  valor: number;
  meta: number;
  variacao: number;
  tendencia: 'alta' | 'baixa' | 'estavel';
  cor: string;
}

export interface DadosHistoricos {
  data: string;
  valor: number;
  cdi: number;
  ipca: number;
  selic: number;
}

export interface PerformanceDashboard {
  indicadores: IndicadorEconomico[];
  metricas: MetricaPerformance[];
  historico: DadosHistoricos[];
  rendimentoAcumulado: number;
  comparacaoIndices: {
    vsCDI: number;
    vsIPCA: number;
    vsSelic: number;
  };
  isLoading: boolean;
  ultimaAtualizacao: Date;
}

export const usePerformanceDashboard = () => {
  const [dashboard, setDashboard] = useState<PerformanceDashboard>({
    indicadores: [],
    metricas: [],
    historico: [],
    rendimentoAcumulado: 0,
    comparacaoIndices: { vsCDI: 0, vsIPCA: 0, vsSelic: 0 },
    isLoading: true,
    ultimaAtualizacao: new Date()
  });

  const [configuracoes, setConfiguracoes] = useLocalStorage('dashboard-config', {
    atualizacaoAutomatica: true,
    intervaloAtualizacao: 300000, // 5 minutos
    mostrarComparacao: true,
    mostrarTendencias: true
  });

  // Simular dados de indicadores econômicos
  const gerarIndicadores = (): IndicadorEconomico[] => [
    {
      nome: 'CDI',
      valor: 13.75,
      variacao: 0.25,
      ultimaAtualizacao: new Date()
    },
    {
      nome: 'IPCA',
      valor: 4.62,
      variacao: -0.18,
      ultimaAtualizacao: new Date()
    },
    {
      nome: 'SELIC',
      valor: 13.75,
      variacao: 0.00,
      ultimaAtualizacao: new Date()
    },
    {
      nome: 'IBOVESPA',
      valor: 126543,
      variacao: 1.23,
      ultimaAtualizacao: new Date()
    }
  ];

  // Gerar métricas de performance
  const gerarMetricas = (valorAtual: number, valorInicial: number): MetricaPerformance[] => {
    const rendimento = ((valorAtual - valorInicial) / valorInicial) * 100;
    
    return [
      {
        id: 'rendimento-total',
        nome: 'Rendimento Total',
        valor: rendimento,
        meta: 15,
        variacao: 2.3,
        tendencia: rendimento > 15 ? 'alta' : rendimento < 10 ? 'baixa' : 'estavel',
        cor: '#10B981'
      },
      {
        id: 'rendimento-mensal',
        nome: 'Rendimento Mensal',
        valor: rendimento / 12,
        meta: 1.2,
        variacao: 0.15,
        tendencia: 'alta',
        cor: '#3B82F6'
      },
      {
        id: 'volatilidade',
        nome: 'Volatilidade',
        valor: 8.5,
        meta: 10,
        variacao: -0.5,
        tendencia: 'baixa',
        cor: '#F59E0B'
      },
      {
        id: 'sharpe-ratio',
        nome: 'Índice Sharpe',
        valor: 1.85,
        meta: 1.5,
        variacao: 0.12,
        tendencia: 'alta',
        cor: '#8B5CF6'
      }
    ];
  };

  // Gerar dados históricos
  const gerarHistorico = (): DadosHistoricos[] => {
    const dados: DadosHistoricos[] = [];
    const hoje = new Date();
    
    for (let i = 11; i >= 0; i--) {
      const data = new Date(hoje);
      data.setMonth(data.getMonth() - i);
      
      dados.push({
        data: data.toISOString().split('T')[0],
        valor: 10000 + (i * 850) + Math.random() * 500,
        cdi: 13.5 + Math.random() * 0.5,
        ipca: 4.5 + Math.random() * 0.3,
        selic: 13.5 + Math.random() * 0.5
      });
    }
    
    return dados;
  };

  // Calcular comparação com índices
  const calcularComparacaoIndices = (rendimentoAtual: number): { vsCDI: number; vsIPCA: number; vsSelic: number } => {
    const cdiAnual = 13.75;
    const ipcaAnual = 4.62;
    const selicAnual = 13.75;
    
    return {
      vsCDI: rendimentoAtual - cdiAnual,
      vsIPCA: rendimentoAtual - ipcaAnual,
      vsSelic: rendimentoAtual - selicAnual
    };
  };

  // Atualizar dashboard
  const atualizarDashboard = async (valorAtual?: number, valorInicial?: number) => {
    setDashboard(prev => ({ ...prev, isLoading: true }));
    
    try {
      // Simular delay de API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const indicadores = gerarIndicadores();
      const valor = valorAtual || 15000;
      const inicial = valorInicial || 10000;
      const metricas = gerarMetricas(valor, inicial);
      const historico = gerarHistorico();
      const rendimentoAcumulado = ((valor - inicial) / inicial) * 100;
      const comparacaoIndices = calcularComparacaoIndices(rendimentoAcumulado);
      
      setDashboard({
        indicadores,
        metricas,
        historico,
        rendimentoAcumulado,
        comparacaoIndices,
        isLoading: false,
        ultimaAtualizacao: new Date()
      });
    } catch (error) {
      console.error('Erro ao atualizar dashboard:', error);
      setDashboard(prev => ({ ...prev, isLoading: false }));
    }
  };

  // Configurar atualização automática
  useEffect(() => {
    if (configuracoes.atualizacaoAutomatica) {
      const interval = setInterval(() => {
        atualizarDashboard();
      }, configuracoes.intervaloAtualizacao);
      
      return () => clearInterval(interval);
    }
  }, [configuracoes.atualizacaoAutomatica, configuracoes.intervaloAtualizacao]);

  // Carregar dados iniciais
  useEffect(() => {
    atualizarDashboard();
  }, []);

  // Métricas calculadas
  const metricas = useMemo(() => {
    const { indicadores, rendimentoAcumulado, comparacaoIndices } = dashboard;
    
    return {
      performanceGeral: rendimentoAcumulado > 15 ? 'Excelente' : rendimentoAcumulado > 10 ? 'Boa' : 'Regular',
      melhorIndicador: comparacaoIndices.vsCDI > 0 ? 'Superando CDI' : 'Abaixo do CDI',
      risco: dashboard.metricas.find(m => m.id === 'volatilidade')?.valor || 0,
      consistencia: dashboard.metricas.find(m => m.id === 'sharpe-ratio')?.valor || 0
    };
  }, [dashboard]);

  return {
    dashboard,
    configuracoes,
    metricas,
    atualizarDashboard,
    setConfiguracoes
  };
};