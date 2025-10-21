import React from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Brain,
  Target,
  Shield,
  Activity,
  Zap,
  Star,
  BarChart3,
  PieChart,
  LineChart
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
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts';
import { formatarMoeda, formatarPercentual } from '../utils/formatters';

interface DashboardIAProps {
  perfil: any;
  recomendacoes: any[];
  alertas: any[];
  analiseRisco: any;
  dadosPreditivos: any;
  insightsML: any;
  metricsPerformance: any;
}

const DashboardIA: React.FC<DashboardIAProps> = ({
  perfil,
  recomendacoes,
  alertas,
  analiseRisco,
  dadosPreditivos,
  insightsML,
  metricsPerformance
}) => {
  const cores = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#00ff00'];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Métricas Principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Score IA</p>
              <p className="text-2xl font-bold">{metricsPerformance.scoreIA}/100</p>
            </div>
            <Brain className="w-8 h-8 text-blue-200" />
          </div>
          <div className="mt-4">
            <div className="bg-blue-400 rounded-full h-2">
              <div 
                className="bg-white rounded-full h-2 transition-all duration-500"
                style={{ width: `${metricsPerformance.scoreIA}%` }}
              />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Retorno Previsto</p>
              <p className="text-2xl font-bold">{formatarPercentual(metricsPerformance.retornoPrevisto)}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-green-200" />
          </div>
          <div className="mt-2">
            <p className="text-green-100 text-xs">Próximos 12 meses</p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm">Confiança Média</p>
              <p className="text-2xl font-bold">{metricsPerformance.confiancaMedia}%</p>
            </div>
            <Star className="w-8 h-8 text-purple-200" />
          </div>
          <div className="mt-2">
            <p className="text-purple-100 text-xs">Baseado em {recomendacoes.length} recomendações</p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm">Risco Calculado</p>
              <p className="text-2xl font-bold">{analiseRisco?.scoreRisco || '--'}</p>
            </div>
            <Shield className="w-8 h-8 text-orange-200" />
          </div>
          <div className="mt-2">
            <p className="text-orange-100 text-xs">
              {analiseRisco?.nivelRisco || 'Não calculado'}
            </p>
          </div>
        </div>
      </div>

      {/* Gráficos Principais */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Evolução da Performance */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <LineChart className="w-5 h-5 mr-2" />
            Evolução da Performance IA
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <RechartsLineChart data={dadosPreditivos.evolucaoPerformance}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="data" />
              <YAxis />
              <Tooltip 
                formatter={(value: any) => [formatarPercentual(value), 'Performance']}
                labelFormatter={(label) => `Data: ${label}`}
              />
              <Line 
                type="monotone" 
                dataKey="performance" 
                stroke="#8884d8" 
                strokeWidth={2}
                dot={{ fill: '#8884d8' }}
              />
              <Line 
                type="monotone" 
                dataKey="benchmark" 
                stroke="#82ca9d" 
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={{ fill: '#82ca9d' }}
              />
            </RechartsLineChart>
          </ResponsiveContainer>
        </div>

        {/* Distribuição de Recomendações */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <PieChart className="w-5 h-5 mr-2" />
            Distribuição de Recomendações
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <RechartsPieChart>
              <Pie
                data={dadosPreditivos.distribuicaoRecomendacoes}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={(props: any) => `${props.name || ''} ${(typeof props.percent === 'number' ? (props.percent * 100).toFixed(0) : '0')}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="valor"
              >
                {dadosPreditivos.distribuicaoRecomendacoes.map((entry: any, index: number) => (
                  <Cell key={`cell-${index}`} fill={cores[index % cores.length]} />
                ))}
              </Pie>
              <Tooltip />
            </RechartsPieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Insights ML */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
          <Zap className="w-5 h-5 mr-2" />
          Insights de Machine Learning
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {insightsML.map((insight: any, index: number) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className={`p-4 rounded-lg border-l-4 ${
                insight.tipo === 'oportunidade' 
                  ? 'bg-green-50 border-green-500 dark:bg-green-900/20' 
                  : insight.tipo === 'risco'
                  ? 'bg-red-50 border-red-500 dark:bg-red-900/20'
                  : 'bg-blue-50 border-blue-500 dark:bg-blue-900/20'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className={`font-medium ${
                    insight.tipo === 'oportunidade' 
                      ? 'text-green-900 dark:text-green-100' 
                      : insight.tipo === 'risco'
                      ? 'text-red-900 dark:text-red-100'
                      : 'text-blue-900 dark:text-blue-100'
                  }`}>
                    {insight.titulo}
                  </h4>
                  <p className={`text-sm mt-1 ${
                    insight.tipo === 'oportunidade' 
                      ? 'text-green-700 dark:text-green-200' 
                      : insight.tipo === 'risco'
                      ? 'text-red-700 dark:text-red-200'
                      : 'text-blue-700 dark:text-blue-200'
                  }`}>
                    {insight.descricao}
                  </p>
                  <div className="flex items-center mt-2">
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      Confiança: {insight.confianca}%
                    </span>
                  </div>
                </div>
                {insight.tipo === 'oportunidade' && <TrendingUp className="w-5 h-5 text-green-500" />}
                {insight.tipo === 'risco' && <AlertTriangle className="w-5 h-5 text-red-500" />}
                {insight.tipo === 'neutro' && <Activity className="w-5 h-5 text-blue-500" />}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Análise de Risco Radar */}
      {analiseRisco && (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <Shield className="w-5 h-5 mr-2" />
            Análise de Risco Multidimensional
          </h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={analiseRisco.dimensoes}>
                <PolarGrid />
                <PolarAngleAxis dataKey="dimensao" />
                <PolarRadiusAxis angle={90} domain={[0, 100]} />
                <Radar
                  name="Risco Atual"
                  dataKey="valor"
                  stroke="#8884d8"
                  fill="#8884d8"
                  fillOpacity={0.3}
                />
                <Radar
                  name="Risco Ideal"
                  dataKey="ideal"
                  stroke="#82ca9d"
                  fill="#82ca9d"
                  fillOpacity={0.3}
                />
              </RadarChart>
            </ResponsiveContainer>
            
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900 dark:text-white">
                Resumo da Análise
              </h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Score Geral:</span>
                  <span className="font-medium">{analiseRisco.scoreRisco}/100</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Nível de Risco:</span>
                  <span className={`font-medium ${
                    analiseRisco.nivelRisco === 'Baixo' ? 'text-green-600' :
                    analiseRisco.nivelRisco === 'Médio' ? 'text-yellow-600' :
                    'text-red-600'
                  }`}>
                    {analiseRisco.nivelRisco}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Diversificação:</span>
                  <span className="font-medium">{analiseRisco.diversificacao}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Volatilidade:</span>
                  <span className="font-medium">{formatarPercentual(analiseRisco.volatilidade)}</span>
                </div>
              </div>
              
              <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  <strong>Recomendação:</strong> {analiseRisco.recomendacao}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Alertas Recentes */}
      {alertas.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <AlertTriangle className="w-5 h-5 mr-2" />
            Alertas Recentes
          </h3>
          <div className="space-y-3">
            {alertas.slice(0, 3).map((alerta, index) => (
              <div
                key={index}
                className={`p-3 rounded-lg border-l-4 ${
                  alerta.severidade === 'alta' 
                    ? 'bg-red-50 border-red-500 dark:bg-red-900/20' 
                    : alerta.severidade === 'media'
                    ? 'bg-yellow-50 border-yellow-500 dark:bg-yellow-900/20'
                    : 'bg-blue-50 border-blue-500 dark:bg-blue-900/20'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      {alerta.titulo}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {alerta.descricao}
                    </p>
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {new Date(alerta.dataGeracao).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default DashboardIA;