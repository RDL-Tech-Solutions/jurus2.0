// Hook personalizado para gerenciar cenários econômicos

import { useState, useEffect, useMemo, useCallback } from 'react';
import {
  CenarioEconomico,
  ResultadoCenario,
  ComparacaoCenarios,
  StressTest,
  ParametrosStressTest,
  ConfiguracaoCenarios,
  HistoricoCenarios,
  AlertaCenario
} from '../types/cenarios';
import {
  cenariosPreDefinidos,
  gerarIdCenario,
  criarCenarioPersonalizado,
  simularCenario,
  executarStressTest,
  compararCenarios,
  formatarMoeda,
  formatarPercentual
} from '../utils/cenarios';
import { useSimulacao } from '../store/useAppStore';

export const useCenarios = () => {
  // Estados
  const [cenarios, setCenarios] = useState<CenarioEconomico[]>([]);
  const [resultados, setResultados] = useState<ResultadoCenario[]>([]);
  const [comparacoes, setComparacoes] = useState<ComparacaoCenarios[]>([]);
  const [stressTests, setStressTests] = useState<StressTest[]>([]);
  const [configuracao, setConfiguracao] = useState<ConfiguracaoCenarios>({
    cenariosAtivos: [],
    parametrosPadrao: cenariosPreDefinidos[1].parametros, // Cenário realista
    alertas: {
      perdaMaxima: 20,
      volatilidade: 30,
      inflacao: 8
    },
    historico: {
      manterDias: 30,
      autoSalvar: true
    },
    visualizacao: {
      mostrarInflacao: true,
      mostrarVolatilidade: true,
      mostrarEventos: true,
      intervaloAtualizacao: 5000
    }
  });
  const [historico, setHistorico] = useState<HistoricoCenarios[]>([]);
  const [alertas, setAlertas] = useState<AlertaCenario[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [ultimaAtualizacao, setUltimaAtualizacao] = useState<Date>(new Date());

  // Hook da simulação
  const { simulacao } = useSimulacao();

  // Inicializar cenários pré-definidos
  useEffect(() => {
    const cenariosIniciais = cenariosPreDefinidos.map(cenario => ({
      ...cenario,
      id: gerarIdCenario(),
      criadoEm: new Date(),
      atualizadoEm: new Date()
    }));
    
    setCenarios(cenariosIniciais);
    setConfiguracao(prev => ({
      ...prev,
      cenariosAtivos: cenariosIniciais.filter(c => c.ativo).map(c => c.id)
    }));
  }, []);

  // Seletores memoizados
  const cenariosAtivos = useMemo(() => 
    cenarios.filter(cenario => configuracao.cenariosAtivos.includes(cenario.id)),
    [cenarios, configuracao.cenariosAtivos]
  );

  const resultadosAtivos = useMemo(() => 
    resultados.filter(resultado => 
      configuracao.cenariosAtivos.includes(resultado.cenarioId)
    ),
    [resultados, configuracao.cenariosAtivos]
  );

  const alertasAtivos = useMemo(() => 
    alertas.filter(alerta => !alerta.resolvido),
    [alertas]
  );

  const estatisticasGerais = useMemo(() => {
    if (resultadosAtivos.length === 0) return null;

    const saldos = resultadosAtivos.map(r => r.resultados.saldoFinal);
    const rentabilidades = resultadosAtivos.map(r => r.resultados.rentabilidadeTotal);
    
    return {
      melhorCenario: Math.max(...saldos),
      piorCenario: Math.min(...saldos),
      mediaRentabilidade: rentabilidades.reduce((a, b) => a + b, 0) / rentabilidades.length,
      volatilidade: Math.sqrt(
        rentabilidades.reduce((sum, rent) => {
          const media = rentabilidades.reduce((a, b) => a + b, 0) / rentabilidades.length;
          return sum + Math.pow(rent - media, 2);
        }, 0) / rentabilidades.length
      ),
      cenarioMaisSeguro: resultadosAtivos.reduce((mais, atual) => 
        atual.riscos.pontuacao < mais.riscos.pontuacao ? atual : mais
      ).cenarioId,
      cenarioMaisRentavel: resultadosAtivos.reduce((mais, atual) => 
        atual.resultados.rentabilidadeTotal > mais.resultados.rentabilidadeTotal ? atual : mais
      ).cenarioId
    };
  }, [resultadosAtivos]);

  // Ações
  const adicionarCenario = useCallback((cenario: Omit<CenarioEconomico, 'id' | 'criadoEm' | 'atualizadoEm'>) => {
    const novoCenario: CenarioEconomico = {
      ...cenario,
      id: gerarIdCenario(),
      criadoEm: new Date(),
      atualizadoEm: new Date()
    };
    
    setCenarios(prev => [...prev, novoCenario]);
    
    if (novoCenario.ativo) {
      setConfiguracao(prev => ({
        ...prev,
        cenariosAtivos: [...prev.cenariosAtivos, novoCenario.id]
      }));
    }
    
    return novoCenario.id;
  }, []);

  const atualizarCenario = useCallback((id: string, atualizacoes: Partial<CenarioEconomico>) => {
    setCenarios(prev => prev.map(cenario => 
      cenario.id === id 
        ? { ...cenario, ...atualizacoes, atualizadoEm: new Date() }
        : cenario
    ));
  }, []);

  const removerCenario = useCallback((id: string) => {
    setCenarios(prev => prev.filter(cenario => cenario.id !== id));
    setResultados(prev => prev.filter(resultado => resultado.cenarioId !== id));
    setConfiguracao(prev => ({
      ...prev,
      cenariosAtivos: prev.cenariosAtivos.filter(cenarioId => cenarioId !== id)
    }));
  }, []);

  const alternarCenario = useCallback((id: string) => {
    setConfiguracao(prev => ({
      ...prev,
      cenariosAtivos: prev.cenariosAtivos.includes(id)
        ? prev.cenariosAtivos.filter(cenarioId => cenarioId !== id)
        : [...prev.cenariosAtivos, id]
    }));
  }, []);

  const simularCenarios = useCallback(async () => {
    if (!simulacao || cenariosAtivos.length === 0) return;

    setIsLoading(true);
    
    try {
      const novosResultados: ResultadoCenario[] = [];
      
      for (const cenario of cenariosAtivos) {
        const resultado = simularCenario(cenario, simulacao);
        novosResultados.push(resultado);
        
        // Verificar alertas
        verificarAlertas(resultado, cenario);
      }
      
      setResultados(novosResultados);
      setUltimaAtualizacao(new Date());
      
      // Salvar no histórico se configurado
      if (configuracao.historico.autoSalvar) {
        salvarHistorico(novosResultados);
      }
      
    } catch (error) {
      console.error('Erro ao simular cenários:', error);
    } finally {
      setIsLoading(false);
    }
  }, [simulacao, cenariosAtivos, configuracao]);

  const criarComparacao = useCallback((nome: string, cenarioIds: string[]) => {
    const resultadosComparacao = resultados.filter(r => 
      cenarioIds.includes(r.cenarioId)
    );
    
    if (resultadosComparacao.length < 2) {
      throw new Error('É necessário pelo menos 2 cenários para comparação');
    }
    
    const analiseComparativa = compararCenarios(resultadosComparacao);
    
    const novaComparacao: ComparacaoCenarios = {
      id: gerarIdCenario(),
      nome,
      cenarios: cenarioIds,
      resultados: resultadosComparacao,
      analiseComparativa,
      criadaEm: new Date()
    };
    
    setComparacoes(prev => [...prev, novaComparacao]);
    return novaComparacao.id;
  }, [resultados]);

  const executarStressTestPersonalizado = useCallback(async (
    nome: string,
    parametros: ParametrosStressTest
  ) => {
    if (!simulacao) return;

    setIsLoading(true);
    
    try {
      const resultado = executarStressTest(simulacao, parametros);
      
      const novoStressTest: StressTest = {
        id: gerarIdCenario(),
        nome,
        descricao: `Stress test com ${parametros.choques.length} choques`,
        parametros,
        resultados: resultado,
        criadoEm: new Date()
      };
      
      setStressTests(prev => [...prev, novoStressTest]);
      
      // Criar alerta se perda for significativa
      if (resultado.perdaMaxima > simulacao.valorInicial * 0.2) {
        criarAlerta({
          tipo: 'risco',
          titulo: 'Stress Test: Alta Perda Detectada',
          descricao: `O stress test "${nome}" indica perda potencial de ${formatarMoeda(resultado.perdaMaxima)}`,
          cenarioId: 'stress-test',
          severidade: 'alta',
          acao: 'Revisar estratégia de investimento'
        });
      }
      
      return novoStressTest.id;
    } catch (error) {
      console.error('Erro ao executar stress test:', error);
    } finally {
      setIsLoading(false);
    }
  }, [simulacao]);

  const verificarAlertas = useCallback((resultado: ResultadoCenario, cenario: CenarioEconomico) => {
    const novosAlertas: Omit<AlertaCenario, 'id' | 'criadoEm' | 'visualizado' | 'resolvido'>[] = [];
    
    // Alerta de perda máxima
    if (resultado.riscos.pontuacao > configuracao.alertas.perdaMaxima) {
      novosAlertas.push({
        tipo: 'risco',
        titulo: 'Risco Elevado Detectado',
        descricao: `O cenário "${cenario.nome}" apresenta risco de ${resultado.riscos.pontuacao}%`,
        cenarioId: cenario.id,
        severidade: resultado.riscos.pontuacao > 70 ? 'critica' : 'alta',
        acao: 'Revisar parâmetros do cenário'
      });
    }
    
    // Alerta de volatilidade
    if (resultado.metricas.volatilidade > configuracao.alertas.volatilidade) {
      novosAlertas.push({
        tipo: 'risco',
        titulo: 'Alta Volatilidade',
        descricao: `Volatilidade de ${formatarPercentual(resultado.metricas.volatilidade)} no cenário "${cenario.nome}"`,
        cenarioId: cenario.id,
        severidade: 'media',
        acao: 'Considerar diversificação'
      });
    }
    
    // Alerta de inflação
    const inflacaoMedia = resultado.resultados.evolucaoMensal.reduce(
      (sum, mes) => sum + mes.inflacao, 0
    ) / resultado.resultados.evolucaoMensal.length;
    
    if (inflacaoMedia > configuracao.alertas.inflacao) {
      novosAlertas.push({
        tipo: 'risco',
        titulo: 'Inflação Elevada',
        descricao: `Inflação média de ${formatarPercentual(inflacaoMedia)} no cenário "${cenario.nome}"`,
        cenarioId: cenario.id,
        severidade: 'media',
        acao: 'Considerar proteção contra inflação'
      });
    }
    
    // Adicionar alertas
    novosAlertas.forEach(alerta => criarAlerta(alerta));
  }, [configuracao]);

  const criarAlerta = useCallback((alerta: Omit<AlertaCenario, 'id' | 'criadoEm' | 'visualizado' | 'resolvido'>) => {
    const novoAlerta: AlertaCenario = {
      ...alerta,
      id: gerarIdCenario(),
      criadoEm: new Date(),
      visualizado: false,
      resolvido: false
    };
    
    setAlertas(prev => [...prev, novoAlerta]);
  }, []);

  const marcarAlertaComoVisualizado = useCallback((id: string) => {
    setAlertas(prev => prev.map(alerta => 
      alerta.id === id ? { ...alerta, visualizado: true } : alerta
    ));
  }, []);

  const resolverAlerta = useCallback((id: string) => {
    setAlertas(prev => prev.map(alerta => 
      alerta.id === id ? { ...alerta, resolvido: true } : alerta
    ));
  }, []);

  const salvarHistorico = useCallback((resultadosAtual: ResultadoCenario[]) => {
    const novoHistorico: HistoricoCenarios = {
      id: gerarIdCenario(),
      data: new Date(),
      cenarios: [...cenarios],
      resultados: resultadosAtual,
      comparacoes: [...comparacoes],
      stressTests: [...stressTests],
      observacoes: ''
    };
    
    setHistorico(prev => {
      const novoHistoricoArray = [novoHistorico, ...prev];
      
      // Manter apenas os registros dos últimos X dias
      const diasManter = configuracao.historico.manterDias;
      const dataLimite = new Date();
      dataLimite.setDate(dataLimite.getDate() - diasManter);
      
      return novoHistoricoArray.filter(h => h.data >= dataLimite);
    });
  }, [cenarios, comparacoes, stressTests, configuracao.historico.manterDias]);

  const exportarDados = useCallback((formato: 'json' | 'csv') => {
    const dados = {
      cenarios: cenariosAtivos,
      resultados: resultadosAtivos,
      comparacoes,
      stressTests,
      configuracao,
      estatisticas: estatisticasGerais,
      ultimaAtualizacao
    };
    
    if (formato === 'json') {
      const blob = new Blob([JSON.stringify(dados, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `cenarios-economicos-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } else {
      // Implementar exportação CSV
      const csvData = resultadosAtivos.map(resultado => ({
        cenario: cenarios.find(c => c.id === resultado.cenarioId)?.nome || '',
        saldoFinal: resultado.resultados.saldoFinal,
        rentabilidade: resultado.resultados.rentabilidadeTotal,
        risco: resultado.riscos.pontuacao,
        volatilidade: resultado.metricas.volatilidade
      }));
      
      const csvContent = [
        'Cenário,Saldo Final,Rentabilidade (%),Risco (%),Volatilidade (%)',
        ...csvData.map(row => 
          `${row.cenario},${row.saldoFinal},${row.rentabilidade},${row.risco},${row.volatilidade}`
        )
      ].join('\n');
      
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `cenarios-economicos-${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    }
  }, [cenariosAtivos, resultadosAtivos, comparacoes, stressTests, configuracao, estatisticasGerais, ultimaAtualizacao, cenarios]);

  const limparDados = useCallback(() => {
    setResultados([]);
    setComparacoes([]);
    setStressTests([]);
    setAlertas([]);
    setHistorico([]);
  }, []);

  return {
    // Estados
    cenarios,
    resultados,
    comparacoes,
    stressTests,
    configuracao,
    historico,
    alertas,
    isLoading,
    ultimaAtualizacao,
    
    // Seletores
    cenariosAtivos,
    resultadosAtivos,
    alertasAtivos,
    estatisticasGerais,
    
    // Ações
    adicionarCenario,
    atualizarCenario,
    removerCenario,
    alternarCenario,
    simularCenarios,
    criarComparacao,
    executarStressTestPersonalizado,
    criarAlerta,
    marcarAlertaComoVisualizado,
    resolverAlerta,
    salvarHistorico,
    exportarDados,
    limparDados,
    setConfiguracao,
    
    // Utilitários
    formatarMoeda,
    formatarPercentual
  };
};