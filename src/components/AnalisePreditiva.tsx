import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Cpu,
  Brain,
  TrendingUp,
  TrendingDown,
  Target,
  Zap,
  Activity,
  BarChart3,
  LineChart,
  PieChart,
  Settings,
  Download,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Clock,
  Gauge,
  Database,
  Sparkles
} from 'lucide-react';
import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  ScatterChart,
  Scatter,
  ComposedChart,
  ReferenceLine,
  Legend
} from 'recharts';
import { formatarMoeda, formatarPercentual } from '../utils/formatters';

interface AnalisePreditivaProps {
  dadosPreditivos: any;
  insightsML: any[];
  modeloML: 'linear' | 'neural' | 'ensemble';
  horizontePreditivo: string;
  confiancaMinima: number;
  onAtualizarModelo: (modelo: 'linear' | 'neural' | 'ensemble') => void;
}

const AnalisePreditiva: React.FC<AnalisePreditivaProps> = ({
  dadosPreditivos,
  insightsML,
  modeloML,
  horizontePreditivo,
  confiancaMinima,
  onAtualizarModelo
}) => {
  const [tipoAnalise, setTipoAnalise] = useState<'tendencias' | 'correlacoes' | 'cenarios' | 'monte-carlo'>('tendencias');
  const [isProcessing, setIsProcessing] = useState(false);

  const processarAnalise = async () => {
    setIsProcessing(true);
    // Simular processamento
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsProcessing(false);
  };

  const exportarAnalise = () => {
    const analise = {
      timestamp: new Date().toISOString(),
      modelo: modeloML,
      horizonte: horizontePreditivo,
      confianca: confiancaMinima,
      tipo: tipoAnalise,
      dados: dadosPreditivos,
      insights: insightsML
    };

    const blob = new Blob([JSON.stringify(analise, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `analise-preditiva-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header da Análise Preditiva */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-bold mb-2 flex items-center">
              <Cpu className="w-8 h-8 mr-3" />
              Análise Preditiva Avançada
            </h3>
            <p className="text-indigo-100">
              Machine Learning aplicado a previsões financeiras
            </p>
          </div>
          <div className="text-right">
            <div className="text-sm text-indigo-100">Modelo Ativo</div>
            <div className="text-xl font-bold">{modeloML.toUpperCase()}</div>
            <div className="text-xs text-indigo-200">
              Horizonte: {horizontePreditivo} | Confiança: {confiancaMinima}%
            </div>
          </div>
        </div>

        {/* Métricas do Modelo */}
        <div className="grid grid-cols-4 gap-4 mt-6">
          <div className="bg-white/10 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-indigo-100">Acurácia</span>
              <Gauge className="w-4 h-4" />
            </div>
            <div className="text-xl font-bold">
              {dadosPreditivos.metricas?.acuracia || '87.3'}%
            </div>
          </div>
          <div className="bg-white/10 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-indigo-100">Precisão</span>
              <Target className="w-4 h-4" />
            </div>
            <div className="text-xl font-bold">
              {dadosPreditivos.metricas?.precisao || '92.1'}%
            </div>
          </div>
          <div className="bg-white/10 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-indigo-100">Recall</span>
              <Activity className="w-4 h-4" />
            </div>
            <div className="text-xl font-bold">
              {dadosPreditivos.metricas?.recall || '89.7'}%
            </div>
          </div>
          <div className="bg-white/10 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-indigo-100">F1-Score</span>
              <Sparkles className="w-4 h-4" />
            </div>
            <div className="text-xl font-bold">
              {dadosPreditivos.metricas?.f1Score || '90.8'}%
            </div>
          </div>
        </div>
      </div>

      {/* Controles da Análise */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
            Configurações da Análise
          </h4>
          <div className="flex items-center gap-3">
            <button
              onClick={processarAnalise}
              disabled={isProcessing}
              className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isProcessing ? 'animate-spin' : ''}`} />
              {isProcessing ? 'Processando...' : 'Reprocessar'}
            </button>
            <button
              onClick={exportarAnalise}
              className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              <Download className="w-4 h-4 mr-2" />
              Exportar
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Tipo de Análise
            </label>
            <select
              value={tipoAnalise}
              onChange={(e) => setTipoAnalise(e.target.value as any)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
            >
              <option value="tendencias">Análise de Tendências</option>
              <option value="correlacoes">Correlações</option>
              <option value="cenarios">Cenários Futuros</option>
              <option value="monte-carlo">Monte Carlo</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Modelo ML
            </label>
            <select
              value={modeloML}
              onChange={(e) => onAtualizarModelo(e.target.value as any)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
            >
              <option value="linear">Regressão Linear</option>
              <option value="neural">Rede Neural</option>
              <option value="ensemble">Ensemble (Recomendado)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Janela de Dados
            </label>
            <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700">
              <option value="30d">30 dias</option>
              <option value="90d">90 dias</option>
              <option value="180d">180 dias</option>
              <option value="365d">1 ano</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Frequência
            </label>
            <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700">
              <option value="diario">Diário</option>
              <option value="semanal">Semanal</option>
              <option value="mensal">Mensal</option>
            </select>
          </div>
        </div>
      </div>

      {/* Conteúdo da Análise */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Previsões de Tendência */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <LineChart className="w-5 h-5 mr-2" />
            Previsões de Tendência
          </h4>
          <ResponsiveContainer width="100%" height={300}>
            <ComposedChart data={dadosPreditivos.previsoes}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="data" />
              <YAxis />
              <Tooltip 
                formatter={(value: any, name: string) => [
                  name === 'previsao' ? formatarPercentual(value) : formatarMoeda(value),
                  name === 'previsao' ? 'Previsão' : 'Histórico'
                ]}
              />
              <Area
                type="monotone"
                dataKey="historico"
                fill="#8884d8"
                fillOpacity={0.3}
                stroke="#8884d8"
              />
              <Line
                type="monotone"
                dataKey="previsao"
                stroke="#ff7300"
                strokeWidth={3}
                strokeDasharray="5 5"
                dot={{ fill: '#ff7300' }}
              />
              <Line
                type="monotone"
                dataKey="confiancaSuperior"
                stroke="#82ca9d"
                strokeWidth={1}
                strokeDasharray="2 2"
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="confiancaInferior"
                stroke="#82ca9d"
                strokeWidth={1}
                strokeDasharray="2 2"
                dot={false}
              />
              <ReferenceLine y={0} stroke="#666" strokeDasharray="3 3" />
              <Legend />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        {/* Distribuição de Probabilidades */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <BarChart3 className="w-5 h-5 mr-2" />
            Distribuição de Probabilidades
          </h4>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dadosPreditivos.distribuicaoProbabilidades}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="cenario" />
              <YAxis />
              <Tooltip 
                formatter={(value: any) => [`${value}%`, 'Probabilidade']}
              />
              <Bar dataKey="probabilidade" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Análise de Correlações */}
      {tipoAnalise === 'correlacoes' && (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <Activity className="w-5 h-5 mr-2" />
            Matriz de Correlações
          </h4>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ResponsiveContainer width="100%" height={300}>
              <ScatterChart data={dadosPreditivos.correlacoes}>
                <CartesianGrid />
                <XAxis dataKey="x" name="Ativo 1" />
                <YAxis dataKey="y" name="Ativo 2" />
                <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                <Scatter name="Correlação" data={dadosPreditivos.correlacoes} fill="#8884d8" />
              </ScatterChart>
            </ResponsiveContainer>
            
            <div className="space-y-4">
              <h5 className="font-medium text-gray-900 dark:text-white">
                Correlações Mais Significativas
              </h5>
              {dadosPreditivos.correlacoesSig?.map((corr: any, index: number) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div>
                    <div className="font-medium text-sm">{corr.par}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {corr.significancia}
                    </div>
                  </div>
                  <div className={`font-bold ${
                    corr.valor > 0.7 ? 'text-green-600' :
                    corr.valor > 0.3 ? 'text-yellow-600' :
                    'text-red-600'
                  }`}>
                    {(corr.valor * 100).toFixed(1)}%
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Simulação Monte Carlo */}
      {tipoAnalise === 'monte-carlo' && (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <Zap className="w-5 h-5 mr-2" />
            Simulação Monte Carlo
          </h4>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={dadosPreditivos.monteCarlo}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="simulacao" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value: any) => [formatarPercentual(value), 'Retorno']}
                  />
                  <Area
                    type="monotone"
                    dataKey="p95"
                    stackId="1"
                    stroke="#82ca9d"
                    fill="#82ca9d"
                    fillOpacity={0.2}
                  />
                  <Area
                    type="monotone"
                    dataKey="p75"
                    stackId="1"
                    stroke="#8884d8"
                    fill="#8884d8"
                    fillOpacity={0.4}
                  />
                  <Area
                    type="monotone"
                    dataKey="p50"
                    stackId="1"
                    stroke="#ffc658"
                    fill="#ffc658"
                    fillOpacity={0.6}
                  />
                  <Area
                    type="monotone"
                    dataKey="p25"
                    stackId="1"
                    stroke="#ff7300"
                    fill="#ff7300"
                    fillOpacity={0.4}
                  />
                  <Area
                    type="monotone"
                    dataKey="p5"
                    stackId="1"
                    stroke="#ff0000"
                    fill="#ff0000"
                    fillOpacity={0.2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            
            <div className="space-y-4">
              <h5 className="font-medium text-gray-900 dark:text-white">
                Estatísticas da Simulação
              </h5>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Simulações:</span>
                  <span className="font-medium">10,000</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Retorno Médio:</span>
                  <span className="font-medium text-green-600">
                    {formatarPercentual(dadosPreditivos.estatisticasMC?.retornoMedio || 0.08)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Volatilidade:</span>
                  <span className="font-medium">
                    {formatarPercentual(dadosPreditivos.estatisticasMC?.volatilidade || 0.15)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">VaR (95%):</span>
                  <span className="font-medium text-red-600">
                    {formatarPercentual(dadosPreditivos.estatisticasMC?.var95 || -0.12)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Prob. Positiva:</span>
                  <span className="font-medium text-green-600">
                    {dadosPreditivos.estatisticasMC?.probPositiva || 73}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Insights Avançados */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
          <Brain className="w-5 h-5 mr-2" />
          Insights Avançados de IA
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {insightsML.filter(insight => insight.confianca >= confiancaMinima).map((insight, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`p-4 rounded-lg border-l-4 ${
                insight.impacto === 'alto' 
                  ? 'bg-red-50 border-red-500 dark:bg-red-900/20' 
                  : insight.impacto === 'medio'
                  ? 'bg-yellow-50 border-yellow-500 dark:bg-yellow-900/20'
                  : 'bg-green-50 border-green-500 dark:bg-green-900/20'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h5 className="font-medium text-gray-900 dark:text-white">
                    {insight.titulo}
                  </h5>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {insight.descricao}
                  </p>
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      Confiança: {insight.confianca}%
                    </span>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      insight.impacto === 'alto' 
                        ? 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100' 
                        : insight.impacto === 'medio'
                        ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100'
                        : 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100'
                    }`}>
                      Impacto {insight.impacto}
                    </span>
                  </div>
                </div>
                {insight.tipo === 'oportunidade' && <TrendingUp className="w-5 h-5 text-green-500" />}
                {insight.tipo === 'risco' && <AlertTriangle className="w-5 h-5 text-red-500" />}
                {insight.tipo === 'neutro' && <CheckCircle className="w-5 h-5 text-blue-500" />}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default AnalisePreditiva;