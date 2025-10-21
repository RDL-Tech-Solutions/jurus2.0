import { useState, useCallback, useEffect } from 'react';
import { MetricasBasicas, GraficoEvolucao, SimulacaoResumo, AlertaRisco } from '../types/dashboard';

export function useDashboard() {
  const [metricas, setMetricas] = useState<MetricasBasicas | null>(null);
  const [evolucao, setEvolucao] = useState<GraficoEvolucao[]>([]);
  const [simulacoes, setSimulacoes] = useState<SimulacaoResumo[]>([]);
  const [alertas, setAlertas] = useState<AlertaRisco[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Simular dados de métricas básicas
  const calcularMetricas = useCallback(() => {
    setLoading(true);
    setError(null);

    try {
      // Simular cálculo de métricas
      setTimeout(() => {
        const novasMetricas: MetricasBasicas = {
          valorTotal: 125000.50,
          rendimento: 8750.25,
          percentualGanho: 7.52,
          tempoInvestido: 18, // meses
          ultimaAtualizacao: new Date()
        };

        setMetricas(novasMetricas);
        setLoading(false);
      }, 1000);
    } catch (err) {
      setError('Erro ao calcular métricas');
      setLoading(false);
    }
  }, []);

  // Gerar dados de evolução
  const gerarDadosEvolucao = useCallback(() => {
    const dados: GraficoEvolucao[] = [];
    const hoje = new Date();
    
    for (let i = 30; i >= 0; i--) {
      const data = new Date(hoje);
      data.setDate(data.getDate() - i);
      
      const valorBase = 100000;
      const variacao = Math.random() * 0.1 - 0.05; // -5% a +5%
      const valor = valorBase * (1 + (variacao * (30 - i) / 30));
      
      dados.push({
        data,
        valor: valor + (Math.random() * 5000 - 2500),
        rendimento: (valor - valorBase) / valorBase * 100,
        benchmark: valorBase * (1 + 0.05 * (30 - i) / 30) // 5% benchmark anual
      });
    }
    
    setEvolucao(dados);
  }, []);

  // Carregar simulações recentes
  const carregarSimulacoes = useCallback(() => {
    const simulacoesExemplo: SimulacaoResumo[] = [
      {
        id: '1',
        nome: 'Carteira Conservadora',
        valorInicial: 50000,
        valorFinal: 53250,
        rendimento: 6.5,
        dataSimulacao: new Date(Date.now() - 86400000 * 2),
        status: 'concluida'
      },
      {
        id: '2',
        nome: 'Carteira Agressiva',
        valorInicial: 75000,
        valorFinal: 82500,
        rendimento: 10.0,
        dataSimulacao: new Date(Date.now() - 86400000 * 5),
        status: 'concluida'
      },
      {
        id: '3',
        nome: 'Carteira Balanceada',
        valorInicial: 100000,
        valorFinal: 0,
        rendimento: 0,
        dataSimulacao: new Date(),
        status: 'em_andamento'
      }
    ];

    setSimulacoes(simulacoesExemplo);
  }, []);

  // Verificar alertas
  const verificarAlertas = useCallback(() => {
    const alertasExemplo: AlertaRisco[] = [
      {
        id: '1',
        tipo: 'medio',
        titulo: 'Concentração de Risco',
        descricao: 'Sua carteira está muito concentrada em ações de tecnologia',
        dataDeteccao: new Date(Date.now() - 86400000),
        ativo: true,
        acaoRecomendada: 'Diversificar para outros setores'
      },
      {
        id: '2',
        tipo: 'baixo',
        titulo: 'Rebalanceamento Sugerido',
        descricao: 'É recomendado rebalancear a carteira para manter a alocação alvo',
        dataDeteccao: new Date(Date.now() - 86400000 * 3),
        ativo: true,
        acaoRecomendada: 'Executar rebalanceamento automático'
      }
    ];

    setAlertas(alertasExemplo);
  }, []);

  // Atualizar todos os dados
  const atualizarDados = useCallback(() => {
    calcularMetricas();
    gerarDadosEvolucao();
    carregarSimulacoes();
    verificarAlertas();
  }, [calcularMetricas, gerarDadosEvolucao, carregarSimulacoes, verificarAlertas]);

  // Carregar dados iniciais
  useEffect(() => {
    atualizarDados();
  }, [atualizarDados]);

  return {
    metricas,
    evolucao,
    simulacoes,
    alertas,
    loading,
    error,
    calcularMetricas,
    atualizarDados,
    gerarDadosEvolucao,
    carregarSimulacoes,
    verificarAlertas
  };
}