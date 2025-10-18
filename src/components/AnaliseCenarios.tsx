import React, { useState } from 'react';
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
  Activity
} from 'lucide-react';
import { useAnalisesCenarios, useMonteCarloSimples, ParametrosCenarios } from '../hooks/useAnalisesCenarios';
import { SimulacaoInput } from '../types';
import { Tooltip } from './Tooltip';

interface AnaliseCenariosProps {
  simulacao: SimulacaoInput;
  onClose?: () => void;
}

export const AnaliseCenarios: React.FC<AnaliseCenariosProps> = ({
  simulacao,
  onClose
}) => {
  const [parametros, setParametros] = useState<ParametrosCenarios>({
    simulacaoBase: simulacao,
    variacaoTaxa: {
      otimista: 25, // +25%
      pessimista: -30 // -30%
    },
    variacaoInflacao: {
      otimista: -20, // inflação menor
      pessimista: 50 // inflação maior
    },
    variacaoAportes: {
      otimista: 15, // +15% nos aportes
      pessimista: -25 // -25% nos aportes
    }
  });

  const [mostrarMonteCarlo, setMostrarMonteCarlo] = useState(false);
  const [mostrarConfiguracoes, setMostrarConfiguracoes] = useState(false);

  const { cenarios, estatisticas, analiseRisco, melhorCenario, piorCenario } = useAnalisesCenarios(parametros);
  const monteCarlo = useMonteCarloSimples(simulacao, 1000, 0.15);

  const formatarMoeda = (valor: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor);
  };

  const formatarPercentual = (valor: number) => {
    return `${valor.toFixed(1)}%`;
  };

  const atualizarParametro = (tipo: 'taxa' | 'inflacao' | 'aportes', cenario: 'otimista' | 'pessimista', valor: number) => {
    setParametros(prev => ({
      ...prev,
      [`variacao${tipo.charAt(0).toUpperCase() + tipo.slice(1)}`]: {
        ...prev[`variacao${tipo.charAt(0).toUpperCase() + tipo.slice(1)}` as keyof typeof prev],
        [cenario]: valor
      }
    }));
  };

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
        className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <BarChart3 className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Análise de Cenários</h2>
                <p className="text-gray-600">Avalie diferentes possibilidades para seu investimento</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setMostrarConfiguracoes(!mostrarConfiguracoes)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Settings className="w-5 h-5 text-gray-600" />
              </button>
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
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Configurações */}
          <AnimatePresence>
            {mostrarConfiguracoes && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-gray-50 rounded-xl p-6"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Configurações dos Cenários</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <h4 className="font-medium text-gray-700 mb-3">Variação da Taxa (%)</h4>
                    <div className="space-y-2">
                      <div>
                        <label className="block text-sm text-gray-600">Otimista</label>
                        <input
                          type="number"
                          value={parametros.variacaoTaxa.otimista}
                          onChange={(e) => atualizarParametro('taxa', 'otimista', Number(e.target.value))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-600">Pessimista</label>
                        <input
                          type="number"
                          value={parametros.variacaoTaxa.pessimista}
                          onChange={(e) => atualizarParametro('taxa', 'pessimista', Number(e.target.value))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-700 mb-3">Variação da Inflação (%)</h4>
                    <div className="space-y-2">
                      <div>
                        <label className="block text-sm text-gray-600">Otimista</label>
                        <input
                          type="number"
                          value={parametros.variacaoInflacao?.otimista || 0}
                          onChange={(e) => atualizarParametro('inflacao', 'otimista', Number(e.target.value))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-600">Pessimista</label>
                        <input
                          type="number"
                          value={parametros.variacaoInflacao?.pessimista || 0}
                          onChange={(e) => atualizarParametro('inflacao', 'pessimista', Number(e.target.value))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-700 mb-3">Variação dos Aportes (%)</h4>
                    <div className="space-y-2">
                      <div>
                        <label className="block text-sm text-gray-600">Otimista</label>
                        <input
                          type="number"
                          value={parametros.variacaoAportes?.otimista || 0}
                          onChange={(e) => atualizarParametro('aportes', 'otimista', Number(e.target.value))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-600">Pessimista</label>
                        <input
                          type="number"
                          value={parametros.variacaoAportes?.pessimista || 0}
                          onChange={(e) => atualizarParametro('aportes', 'pessimista', Number(e.target.value))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Cenários */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {cenarios.map((cenario, index) => (
              <motion.div
                key={cenario.nome}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white border-2 rounded-xl p-6 shadow-lg"
                style={{ borderColor: cenario.cor }}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold" style={{ color: cenario.cor }}>
                    {cenario.nome}
                  </h3>
                  <div className="text-sm text-gray-500">
                    {cenario.probabilidade}%
                  </div>
                </div>

                <p className="text-sm text-gray-600 mb-4">{cenario.descricao}</p>

                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-700">Valor Final</p>
                    <p className="text-xl font-bold" style={{ color: cenario.cor }}>
                      {formatarMoeda(cenario.resultado.saldoFinal)}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-700">Rentabilidade Total</p>
                    <p className="text-lg font-semibold" style={{ color: cenario.cor }}>
                      {formatarPercentual(cenario.resultado.rentabilidadeTotal)}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-gray-200">
                    <p className="text-xs text-gray-500 mb-2">Variações aplicadas:</p>
                    <div className="text-xs space-y-1">
                      <div>Taxa: {cenario.variacao.taxa > 0 ? '+' : ''}{formatarPercentual(cenario.variacao.taxa)}</div>
                      {cenario.variacao.inflacao !== undefined && (
                        <div>Inflação: {cenario.variacao.inflacao > 0 ? '+' : ''}{formatarPercentual(cenario.variacao.inflacao)}</div>
                      )}
                      {cenario.variacao.aportes !== undefined && (
                        <div>Aportes: {cenario.variacao.aportes > 0 ? '+' : ''}{formatarPercentual(cenario.variacao.aportes)}</div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Estatísticas Resumidas */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <PieChart className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900">Estatísticas dos Cenários</h3>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <p className="text-sm text-gray-600">Valor Esperado</p>
                <p className="text-lg font-bold text-blue-600">
                  {formatarMoeda(estatisticas.valorEsperado)}
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600">Amplitude</p>
                <p className="text-lg font-bold text-purple-600">
                  {formatarMoeda(estatisticas.amplitude)}
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600">Melhor Caso</p>
                <p className="text-lg font-bold text-green-600">
                  {formatarMoeda(estatisticas.valorMaximo)}
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600">Pior Caso</p>
                <p className="text-lg font-bold text-red-600">
                  {formatarMoeda(estatisticas.valorMinimo)}
                </p>
              </div>
            </div>
          </div>

          {/* Análise de Risco */}
          <div className="bg-white border rounded-xl p-6 shadow-lg">
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle className="w-5 h-5" style={{ color: analiseRisco.cor }} />
              <h3 className="text-lg font-semibold text-gray-900">Análise de Risco</h3>
              <Tooltip content="Baseada no coeficiente de variação e amplitude dos resultados">
                <Info className="w-4 h-4 text-gray-400" />
              </Tooltip>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: analiseRisco.cor }}
                  ></div>
                  <span className="font-semibold" style={{ color: analiseRisco.cor }}>
                    Risco {analiseRisco.nivel}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-4">{analiseRisco.descricao}</p>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Coeficiente de Variação:</span>
                    <span className="text-sm font-medium">{formatarPercentual(analiseRisco.coeficienteVariacao)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Amplitude Percentual:</span>
                    <span className="text-sm font-medium">{formatarPercentual(analiseRisco.amplitudePercentual)}</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-700 mb-3">Comparação de Cenários</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-2 bg-green-50 rounded-lg">
                    <span className="text-sm text-green-700">Melhor: {melhorCenario.nome}</span>
                    <span className="text-sm font-medium text-green-800">
                      {formatarMoeda(melhorCenario.resultado.saldoFinal)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-red-50 rounded-lg">
                    <span className="text-sm text-red-700">Pior: {piorCenario.nome}</span>
                    <span className="text-sm font-medium text-red-800">
                      {formatarMoeda(piorCenario.resultado.saldoFinal)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Monte Carlo */}
          <div className="text-center">
            <button
              onClick={() => setMostrarMonteCarlo(!mostrarMonteCarlo)}
              className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg hover:from-indigo-600 hover:to-purple-600 transition-all duration-200 font-medium"
            >
              <div className="flex items-center gap-2">
                <Activity className="w-5 h-5" />
                {mostrarMonteCarlo ? 'Ocultar' : 'Mostrar'} Simulação Monte Carlo
              </div>
            </button>
          </div>

          {/* Resultados Monte Carlo */}
          <AnimatePresence>
            {mostrarMonteCarlo && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-indigo-50 rounded-xl p-6"
              >
                <div className="flex items-center gap-2 mb-4">
                  <Target className="w-5 h-5 text-indigo-600" />
                  <h3 className="text-lg font-semibold text-indigo-900">Simulação Monte Carlo (1.000 cenários)</h3>
                  <Tooltip content="Simulação estatística que considera múltiplas variações aleatórias para estimar a distribuição de resultados possíveis">
                    <Info className="w-4 h-4 text-indigo-400" />
                  </Tooltip>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <p className="text-sm text-indigo-700">Valor Médio</p>
                    <p className="text-lg font-bold text-indigo-800">
                      {formatarMoeda(monteCarlo.media)}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-indigo-700">Mediana</p>
                    <p className="text-lg font-bold text-indigo-800">
                      {formatarMoeda(monteCarlo.mediana)}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-indigo-700">95% dos casos</p>
                    <p className="text-lg font-bold text-indigo-800">
                      &gt; {formatarMoeda(monteCarlo.percentil5)}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-indigo-700">Prob. de Perda</p>
                    <p className="text-lg font-bold text-indigo-800">
                      {formatarPercentual(monteCarlo.probabilidadePerda)}
                    </p>
                  </div>
                </div>

                <div className="mt-4 p-4 bg-indigo-100 rounded-lg">
                  <p className="text-sm text-indigo-800">
                    <strong>Interpretação:</strong> Em 95% dos cenários simulados, seu investimento resultará em pelo menos {formatarMoeda(monteCarlo.percentil5)}. 
                    A probabilidade de ter um resultado inferior ao total investido é de {formatarPercentual(monteCarlo.probabilidadePerda)}.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default AnaliseCenarios;