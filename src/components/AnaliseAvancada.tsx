import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  TrendingUp, 
  TrendingDown, 
  BarChart3, 
  PieChart, 
  AlertTriangle, 
  Info,
  Settings,
  Target,
  Activity,
  Zap,
  Brain,
  LineChart,
  Sliders,
  Calculator
} from 'lucide-react';
import { 
  LineChart as RechartsLineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  ResponsiveContainer,
  BarChart as RechartsBarChart,
  Bar,
  ScatterChart,
  Scatter,
  Cell
} from 'recharts';
import { SimulacaoInput } from '../types';
import { Tooltip } from './Tooltip';
import { AnimatedContainer, StaggeredContainer, AnimatedItem } from './AnimatedContainer';

interface AnaliseAvancadaProps {
  simulacao: SimulacaoInput;
  onClose?: () => void;
}

interface ResultadoMonteCarlo {
  cenario: number;
  valorFinal: number;
  rentabilidade: number;
  categoria: 'pessimista' | 'realista' | 'otimista';
}

interface AnaliseStress {
  nome: string;
  descricao: string;
  impacto: number;
  probabilidade: number;
  valorFinal: number;
  cor: string;
}

interface AnaliseCorrelacao {
  variavel: string;
  correlacao: number;
  impacto: string;
  cor: string;
}

export const AnaliseAvancada: React.FC<AnaliseAvancadaProps> = ({
  simulacao,
  onClose
}) => {
  const [abaSelecionada, setAbaSelecionada] = useState<'cenarios' | 'montecarlo' | 'sensibilidade' | 'stress'>('cenarios');
  const [parametrosMonteCarlo, setParametrosMonteCarlo] = useState({
    numeroSimulacoes: 10000,
    volatilidade: 0.15,
    correlacaoInflacao: 0.3,
    tendencia: 0.02 // 2% de tendência anual
  });

  // Simulação Monte Carlo Avançada
  const resultadosMonteCarlo = useMemo(() => {
    const resultados: ResultadoMonteCarlo[] = [];
    const taxaBase = simulacao.modalidade?.taxaAnual || 0;
    const inflacaoBase = simulacao.taxaInflacao || 4.5;

    for (let i = 0; i < parametrosMonteCarlo.numeroSimulacoes; i++) {
      // Gerar variações correlacionadas
      const shockMercado = (Math.random() - 0.5) * 2; // -1 a 1
      const shockInflacao = shockMercado * parametrosMonteCarlo.correlacaoInflacao + 
                           (Math.random() - 0.5) * 2 * (1 - parametrosMonteCarlo.correlacaoInflacao);

      // Aplicar volatilidade e tendência
      const variacaoTaxa = shockMercado * parametrosMonteCarlo.volatilidade + parametrosMonteCarlo.tendencia;
      const variacaoInflacao = shockInflacao * 0.1; // 10% de volatilidade na inflação

      const taxaSimulacao = Math.max(0.1, taxaBase * (1 + variacaoTaxa));
      const inflacaoSimulacao = Math.max(0, inflacaoBase * (1 + variacaoInflacao));

      // Calcular resultado
      const taxaMensal = taxaSimulacao / 100 / 12;
      const inflacaoMensal = inflacaoSimulacao / 100 / 12;
      let saldo = simulacao.valorInicial;
      
      for (let mes = 1; mes <= simulacao.periodo; mes++) {
        saldo = saldo * (1 + taxaMensal) + simulacao.valorMensal;
      }

      // Ajustar pela inflação
      const saldoReal = saldo / Math.pow(1 + inflacaoMensal, simulacao.periodo);
      const totalInvestido = simulacao.valorInicial + (simulacao.valorMensal * simulacao.periodo);
      const rentabilidade = ((saldoReal - totalInvestido) / totalInvestido) * 100;

      // Categorizar resultado
      let categoria: 'pessimista' | 'realista' | 'otimista';
      if (rentabilidade < 0) categoria = 'pessimista';
      else if (rentabilidade < 50) categoria = 'realista';
      else categoria = 'otimista';

      resultados.push({
        cenario: i + 1,
        valorFinal: saldoReal,
        rentabilidade,
        categoria
      });
    }

    return resultados.sort((a, b) => a.valorFinal - b.valorFinal);
  }, [simulacao, parametrosMonteCarlo]);

  // Estatísticas Monte Carlo
  const estatisticasMonteCarlo = useMemo(() => {
    const valores = resultadosMonteCarlo.map(r => r.valorFinal);
    const rentabilidades = resultadosMonteCarlo.map(r => r.rentabilidade);

    const percentil = (arr: number[], p: number) => {
      const index = Math.floor((p / 100) * arr.length);
      return arr[index];
    };

    const totalInvestido = simulacao.valorInicial + (simulacao.valorMensal * simulacao.periodo);

    return {
      media: valores.reduce((acc, val) => acc + val, 0) / valores.length,
      mediana: percentil(valores, 50),
      percentil5: percentil(valores, 5),
      percentil25: percentil(valores, 25),
      percentil75: percentil(valores, 75),
      percentil95: percentil(valores, 95),
      var: percentil(valores, 5), // Value at Risk (5%)
      cvar: valores.slice(0, Math.floor(valores.length * 0.05)).reduce((acc, val) => acc + val, 0) / Math.floor(valores.length * 0.05), // Conditional VaR
      probabilidadePerda: (valores.filter(v => v < totalInvestido).length / valores.length) * 100,
      sharpeRatio: rentabilidades.reduce((acc, val) => acc + val, 0) / valores.length / (Math.sqrt(rentabilidades.reduce((acc, val) => acc + Math.pow(val - rentabilidades.reduce((a, v) => a + v, 0) / rentabilidades.length, 2), 0) / rentabilidades.length)),
      maxDrawdown: Math.min(...rentabilidades),
      distribuicao: {
        pessimista: (resultadosMonteCarlo.filter(r => r.categoria === 'pessimista').length / resultadosMonteCarlo.length) * 100,
        realista: (resultadosMonteCarlo.filter(r => r.categoria === 'realista').length / resultadosMonteCarlo.length) * 100,
        otimista: (resultadosMonteCarlo.filter(r => r.categoria === 'otimista').length / resultadosMonteCarlo.length) * 100
      }
    };
  }, [resultadosMonteCarlo, simulacao]);

  // Análise de Sensibilidade
  const analiseSensibilidade = useMemo(() => {
    const variaveis = [
      { nome: 'Taxa de Juros', variacao: [-50, -25, -10, 0, 10, 25, 50] },
      { nome: 'Inflação', variacao: [-30, -15, -5, 0, 5, 15, 30] },
      { nome: 'Aportes Mensais', variacao: [-40, -20, -10, 0, 10, 20, 40] },
      { nome: 'Período', variacao: [-30, -15, -5, 0, 5, 15, 30] }
    ];

    return variaveis.map(variavel => {
      const resultados = variavel.variacao.map(var_pct => {
        let simModificada = { ...simulacao };
        
        switch (variavel.nome) {
          case 'Taxa de Juros':
            if (simModificada.modalidade) {
              simModificada.modalidade.taxaAnual = Math.max(0.1, 
                (simulacao.modalidade?.taxaAnual || 0) * (1 + var_pct / 100)
              );
            }
            break;
          case 'Inflação':
            simModificada.taxaInflacao = Math.max(0, 
              (simulacao.taxaInflacao || 4.5) * (1 + var_pct / 100)
            );
            break;
          case 'Aportes Mensais':
            simModificada.valorMensal = Math.max(0, 
              simulacao.valorMensal * (1 + var_pct / 100)
            );
            break;
          case 'Período':
            simModificada.periodo = Math.max(1, 
              Math.round(simulacao.periodo * (1 + var_pct / 100))
            );
            break;
        }

        // Calcular resultado simplificado
        const taxaMensal = (simModificada.modalidade?.taxaAnual || 0) / 100 / 12;
        let saldo = simModificada.valorInicial;
        
        for (let mes = 1; mes <= simModificada.periodo; mes++) {
          saldo = saldo * (1 + taxaMensal) + simModificada.valorMensal;
        }

        return {
          variacao: var_pct,
          valorFinal: saldo,
          impacto: var_pct === 0 ? 0 : ((saldo / (simulacao.valorInicial + simulacao.valorMensal * simulacao.periodo)) - 1) * 100
        };
      });

      return {
        variavel: variavel.nome,
        resultados,
        elasticidade: Math.abs(resultados[6].impacto - resultados[0].impacto) / (variavel.variacao[6] - variavel.variacao[0])
      };
    });
  }, [simulacao]);

  // Stress Testing
  const stressTesting = useMemo((): AnaliseStress[] => {
    const cenarios = [
      {
        nome: 'Crise Financeira',
        descricao: 'Taxa cai 60%, inflação sobe 100%',
        ajustes: { taxa: -60, inflacao: 100, aportes: -20 },
        probabilidade: 5,
        cor: '#dc2626'
      },
      {
        nome: 'Recessão Moderada',
        descricao: 'Taxa cai 30%, inflação sobe 50%',
        ajustes: { taxa: -30, inflacao: 50, aportes: -10 },
        probabilidade: 15,
        cor: '#ea580c'
      },
      {
        nome: 'Instabilidade Política',
        descricao: 'Taxa cai 40%, inflação sobe 80%',
        ajustes: { taxa: -40, inflacao: 80, aportes: -15 },
        probabilidade: 10,
        cor: '#d97706'
      },
      {
        nome: 'Boom Econômico',
        descricao: 'Taxa sobe 40%, inflação controlada',
        ajustes: { taxa: 40, inflacao: -20, aportes: 20 },
        probabilidade: 20,
        cor: '#059669'
      }
    ];

    return cenarios.map(cenario => {
      const simStress = { ...simulacao };
      
      if (simStress.modalidade) {
        simStress.modalidade.taxaAnual = Math.max(0.1, 
          (simulacao.modalidade?.taxaAnual || 0) * (1 + cenario.ajustes.taxa / 100)
        );
      }
      
      simStress.taxaInflacao = Math.max(0, 
        (simulacao.taxaInflacao || 4.5) * (1 + cenario.ajustes.inflacao / 100)
      );
      
      simStress.valorMensal = Math.max(0, 
        simulacao.valorMensal * (1 + cenario.ajustes.aportes / 100)
      );

      // Calcular resultado
      const taxaMensal = (simStress.modalidade?.taxaAnual || 0) / 100 / 12;
      let saldo = simStress.valorInicial;
      
      for (let mes = 1; mes <= simStress.periodo; mes++) {
        saldo = saldo * (1 + taxaMensal) + simStress.valorMensal;
      }

      const totalInvestido = simulacao.valorInicial + (simulacao.valorMensal * simulacao.periodo);
      const impacto = ((saldo - totalInvestido) / totalInvestido) * 100;

      return {
        nome: cenario.nome,
        descricao: cenario.descricao,
        impacto,
        probabilidade: cenario.probabilidade,
        valorFinal: saldo,
        cor: cenario.cor
      };
    });
  }, [simulacao]);

  const formatarMoeda = (valor: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor);
  };

  const formatarPercentual = (valor: number) => {
    return `${valor.toFixed(1)}%`;
  };

  const abas = [
    { id: 'cenarios', nome: 'Cenários', icone: BarChart3 },
    { id: 'montecarlo', nome: 'Monte Carlo', icone: Target },
    { id: 'sensibilidade', nome: 'Sensibilidade', icone: Sliders },
    { id: 'stress', nome: 'Stress Test', icone: Zap }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
    >
      <motion.div
        initial={{ y: 20 }}
        animate={{ y: 0 }}
        className="bg-white rounded-2xl shadow-2xl max-w-7xl w-full max-h-[95vh] overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-purple-100 to-blue-100 rounded-lg">
                <Brain className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Análise Avançada</h2>
                <p className="text-gray-600">Simulações estatísticas e análise de risco</p>
              </div>
            </div>
            {onClose && (
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <span className="sr-only">Fechar</span>
                ✕
              </button>
            )}
          </div>

          {/* Navegação */}
          <div className="flex gap-2 mt-6">
            {abas.map((aba) => {
              const Icone = aba.icone;
              return (
                <button
                  key={aba.id}
                  onClick={() => setAbaSelecionada(aba.id as any)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                    abaSelecionada === aba.id
                      ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <Icone className="w-4 h-4" />
                  {aba.nome}
                </button>
              );
            })}
          </div>
        </div>

        {/* Conteúdo */}
        <div className="flex-1 overflow-y-auto p-6">
          <AnimatePresence mode="wait">
            {abaSelecionada === 'montecarlo' && (
              <motion.div
                key="montecarlo"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <AnimatedContainer variant="fadeIn">
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <Target className="w-5 h-5 text-blue-600" />
                      <h3 className="text-lg font-semibold text-blue-900">Simulação Monte Carlo</h3>
                      <Tooltip content="Análise estatística com 10.000 cenários aleatórios considerando correlações entre variáveis">
                        <Info className="w-4 h-4 text-blue-400" />
                      </Tooltip>
                    </div>

                    <StaggeredContainer>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                        <AnimatedItem>
                          <div className="text-center">
                            <p className="text-sm text-blue-700">Valor Esperado</p>
                            <p className="text-lg font-bold text-blue-800">
                              {formatarMoeda(estatisticasMonteCarlo.media)}
                            </p>
                          </div>
                        </AnimatedItem>
                        <AnimatedItem>
                          <div className="text-center">
                            <p className="text-sm text-blue-700">VaR (5%)</p>
                            <p className="text-lg font-bold text-red-600">
                              {formatarMoeda(estatisticasMonteCarlo.var)}
                            </p>
                          </div>
                        </AnimatedItem>
                        <AnimatedItem>
                          <div className="text-center">
                            <p className="text-sm text-blue-700">Sharpe Ratio</p>
                            <p className="text-lg font-bold text-purple-600">
                              {estatisticasMonteCarlo.sharpeRatio.toFixed(2)}
                            </p>
                          </div>
                        </AnimatedItem>
                        <AnimatedItem>
                          <div className="text-center">
                            <p className="text-sm text-blue-700">Prob. Perda</p>
                            <p className="text-lg font-bold text-orange-600">
                              {formatarPercentual(estatisticasMonteCarlo.probabilidadePerda)}
                            </p>
                          </div>
                        </AnimatedItem>
                      </div>
                    </StaggeredContainer>

                    {/* Distribuição de Resultados */}
                    <div className="bg-white rounded-lg p-4">
                      <h4 className="font-medium text-gray-700 mb-3">Distribuição de Resultados</h4>
                      <ResponsiveContainer width="100%" height={300}>
                        <RechartsBarChart data={[
                          { categoria: 'Pessimista', probabilidade: estatisticasMonteCarlo.distribuicao.pessimista, cor: '#ef4444' },
                          { categoria: 'Realista', probabilidade: estatisticasMonteCarlo.distribuicao.realista, cor: '#3b82f6' },
                          { categoria: 'Otimista', probabilidade: estatisticasMonteCarlo.distribuicao.otimista, cor: '#10b981' }
                        ]}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="categoria" />
                          <YAxis />
                          <RechartsTooltip formatter={(value) => [`${typeof value === 'number' ? value.toFixed(1) : value}%`, 'Probabilidade']} />
                          <Bar dataKey="probabilidade" radius={[4, 4, 0, 0]}>
                            {[
                              { categoria: 'Pessimista', probabilidade: estatisticasMonteCarlo.distribuicao.pessimista, cor: '#ef4444' },
                              { categoria: 'Realista', probabilidade: estatisticasMonteCarlo.distribuicao.realista, cor: '#3b82f6' },
                              { categoria: 'Otimista', probabilidade: estatisticasMonteCarlo.distribuicao.otimista, cor: '#10b981' }
                            ].map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.cor} />
                            ))}
                          </Bar>
                        </RechartsBarChart>
                      </ResponsiveContainer>
                    </div>

                    {/* Configurações Monte Carlo */}
                    <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-medium text-gray-700 mb-3">Parâmetros da Simulação</h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                          <label className="block text-sm text-gray-600 mb-1">Simulações</label>
                          <input
                            type="number"
                            value={parametrosMonteCarlo.numeroSimulacoes}
                            onChange={(e) => setParametrosMonteCarlo(prev => ({
                              ...prev,
                              numeroSimulacoes: Number(e.target.value)
                            }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                            min="1000"
                            max="50000"
                            step="1000"
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-gray-600 mb-1">Volatilidade</label>
                          <input
                            type="number"
                            value={parametrosMonteCarlo.volatilidade}
                            onChange={(e) => setParametrosMonteCarlo(prev => ({
                              ...prev,
                              volatilidade: Number(e.target.value)
                            }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                            min="0.05"
                            max="0.5"
                            step="0.05"
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-gray-600 mb-1">Correlação Inflação</label>
                          <input
                            type="number"
                            value={parametrosMonteCarlo.correlacaoInflacao}
                            onChange={(e) => setParametrosMonteCarlo(prev => ({
                              ...prev,
                              correlacaoInflacao: Number(e.target.value)
                            }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                            min="-1"
                            max="1"
                            step="0.1"
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-gray-600 mb-1">Tendência Anual</label>
                          <input
                            type="number"
                            value={parametrosMonteCarlo.tendencia}
                            onChange={(e) => setParametrosMonteCarlo(prev => ({
                              ...prev,
                              tendencia: Number(e.target.value)
                            }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                            min="-0.1"
                            max="0.1"
                            step="0.01"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </AnimatedContainer>
              </motion.div>
            )}

            {abaSelecionada === 'sensibilidade' && (
              <motion.div
                key="sensibilidade"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <AnimatedContainer variant="fadeIn">
                  <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <Sliders className="w-5 h-5 text-green-600" />
                      <h3 className="text-lg font-semibold text-green-900">Análise de Sensibilidade</h3>
                      <Tooltip content="Avalia como mudanças em cada variável afetam o resultado final">
                        <Info className="w-4 h-4 text-green-400" />
                      </Tooltip>
                    </div>

                    <StaggeredContainer>
                      {analiseSensibilidade.map((analise, index) => (
                        <AnimatedItem key={analise.variavel}>
                          <div className="bg-white rounded-lg p-4 mb-4">
                            <div className="flex items-center justify-between mb-3">
                              <h4 className="font-medium text-gray-700">{analise.variavel}</h4>
                              <span className="text-sm text-gray-500">
                                Elasticidade: {analise.elasticidade.toFixed(2)}
                              </span>
                            </div>
                            <ResponsiveContainer width="100%" height={200}>
                              <RechartsLineChart data={analise.resultados}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis 
                                  dataKey="variacao" 
                                  tickFormatter={(value) => `${value}%`}
                                />
                                <YAxis 
                                  tickFormatter={(value) => formatarMoeda(value)}
                                />
                                <RechartsTooltip 
                                  formatter={(value, name) => [
                                    name === 'valorFinal' ? formatarMoeda(value as number) : `${(value as number).toFixed(1)}%`,
                                    name === 'valorFinal' ? 'Valor Final' : 'Impacto'
                                  ]}
                                  labelFormatter={(value) => `Variação: ${value}%`}
                                />
                                <Line 
                                  type="monotone" 
                                  dataKey="valorFinal" 
                                  stroke="#3b82f6" 
                                  strokeWidth={2}
                                  dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                                />
                              </RechartsLineChart>
                            </ResponsiveContainer>
                          </div>
                        </AnimatedItem>
                      ))}
                    </StaggeredContainer>
                  </div>
                </AnimatedContainer>
              </motion.div>
            )}

            {abaSelecionada === 'stress' && (
              <motion.div
                key="stress"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <AnimatedContainer variant="fadeIn">
                  <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-xl p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <Zap className="w-5 h-5 text-red-600" />
                      <h3 className="text-lg font-semibold text-red-900">Stress Testing</h3>
                      <Tooltip content="Testa o comportamento do investimento em cenários extremos">
                        <Info className="w-4 h-4 text-red-400" />
                      </Tooltip>
                    </div>

                    <StaggeredContainer>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {stressTesting.map((teste, index) => (
                          <AnimatedItem key={teste.nome}>
                            <div className="bg-white rounded-lg p-6 border-l-4" style={{ borderLeftColor: teste.cor }}>
                              <div className="flex items-center justify-between mb-3">
                                <h4 className="font-semibold text-gray-800">{teste.nome}</h4>
                                <span className="text-sm text-gray-500">
                                  {teste.probabilidade}% prob.
                                </span>
                              </div>
                              
                              <p className="text-sm text-gray-600 mb-4">{teste.descricao}</p>
                              
                              <div className="space-y-2">
                                <div className="flex justify-between">
                                  <span className="text-sm text-gray-600">Valor Final:</span>
                                  <span className="font-medium" style={{ color: teste.cor }}>
                                    {formatarMoeda(teste.valorFinal)}
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-sm text-gray-600">Impacto:</span>
                                  <span className="font-medium" style={{ color: teste.cor }}>
                                    {teste.impacto > 0 ? '+' : ''}{formatarPercentual(teste.impacto)}
                                  </span>
                                </div>
                              </div>

                              <div className="mt-4 w-full bg-gray-200 rounded-full h-2">
                                <div 
                                  className="h-2 rounded-full transition-all duration-500"
                                  style={{ 
                                    width: `${Math.min(100, Math.abs(teste.impacto))}%`,
                                    backgroundColor: teste.cor
                                  }}
                                ></div>
                              </div>
                            </div>
                          </AnimatedItem>
                        ))}
                      </div>
                    </StaggeredContainer>

                    {/* Resumo dos Stress Tests */}
                    <div className="mt-6 bg-white rounded-lg p-4">
                      <h4 className="font-medium text-gray-700 mb-3">Resumo dos Cenários de Stress</h4>
                      <ResponsiveContainer width="100%" height={300}>
                        <ScatterChart data={stressTesting}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis 
                            dataKey="probabilidade" 
                            name="Probabilidade"
                            tickFormatter={(value) => `${value}%`}
                          />
                          <YAxis 
                            dataKey="impacto" 
                            name="Impacto"
                            tickFormatter={(value) => `${value.toFixed(0)}%`}
                          />
                          <RechartsTooltip 
                            formatter={(value, name) => [
                              name === 'impacto' ? `${(value as number).toFixed(1)}%` : `${value}%`,
                              name === 'impacto' ? 'Impacto' : 'Probabilidade'
                            ]}
                            labelFormatter={(label, payload) => payload?.[0]?.payload?.nome || ''}
                          />
                          <Scatter dataKey="impacto" fill="#8884d8">
                            {stressTesting.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.cor} />
                            ))}
                          </Scatter>
                        </ScatterChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </AnimatedContainer>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default AnaliseAvancada;