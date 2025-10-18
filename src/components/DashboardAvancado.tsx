import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  TrendingDown, 
  Target, 
  Shield, 
  Clock, 
  Zap,
  DollarSign,
  BarChart3,
  PieChart,
  Activity,
  AlertTriangle,
  CheckCircle,
  X
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Cell
} from 'recharts';
import { SimulacaoInput, ResultadoSimulacao } from '../types';
import { useDashboardMetricas, MetricasPerformance, ComparacaoBenchmark } from '../hooks/useDashboardMetricas';

interface DashboardAvancadoProps {
  simulacao: SimulacaoInput;
  resultado: ResultadoSimulacao;
  onClose: () => void;
}

export function DashboardAvancado({ simulacao, resultado, onClose }: DashboardAvancadoProps) {
  const dashboardData = useDashboardMetricas(simulacao, resultado);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-7xl w-full max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Dashboard Avançado
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Análise detalhada de performance e risco
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            >
              <X className="w-6 h-6 text-gray-500" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-8">
          {/* Métricas Principais */}
          <MetricasPrincipais metricas={dashboardData.metricas} />

          {/* Comparação com Benchmarks */}
          <ComparacaoBenchmarks benchmarks={dashboardData.benchmarks} />

          {/* Gráficos de Análise */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <EvolucaoRisco dados={dashboardData.evolucaoRisco} />
            <DistribuicaoRetornos dados={dashboardData.distribuicaoRetornos} />
          </div>

          {/* Indicadores de Risco */}
          <IndicadoresRisco indicadores={dashboardData.indicadoresRisco} />
        </div>
      </motion.div>
    </motion.div>
  );
}

function MetricasPrincipais({ metricas }: { metricas: MetricasPerformance }) {
  const cards = [
    {
      titulo: 'Sharpe Ratio',
      valor: metricas.sharpeRatio.toFixed(2),
      descricao: 'Retorno ajustado ao risco',
      icone: Target,
      cor: metricas.sharpeRatio > 1 ? 'green' : metricas.sharpeRatio > 0.5 ? 'yellow' : 'red',
      tendencia: metricas.sharpeRatio > 1 ? 'up' : 'down'
    },
    {
      titulo: 'Volatilidade',
      valor: `${metricas.volatilidade.toFixed(1)}%`,
      descricao: 'Risco do investimento',
      icone: Activity,
      cor: metricas.volatilidade < 5 ? 'green' : metricas.volatilidade < 15 ? 'yellow' : 'red',
      tendencia: metricas.volatilidade < 10 ? 'up' : 'down'
    },
    {
      titulo: 'Retorno Anualizado',
      valor: `${metricas.retornoAnualizado.toFixed(1)}%`,
      descricao: 'Performance anual esperada',
      icone: TrendingUp,
      cor: metricas.retornoAnualizado > 15 ? 'green' : metricas.retornoAnualizado > 10 ? 'yellow' : 'red',
      tendencia: 'up'
    },
    {
      titulo: 'Drawdown Máximo',
      valor: `${metricas.drawdownMaximo.toFixed(1)}%`,
      descricao: 'Maior perda potencial',
      icone: TrendingDown,
      cor: metricas.drawdownMaximo < 10 ? 'green' : metricas.drawdownMaximo < 20 ? 'yellow' : 'red',
      tendencia: 'down'
    },
    {
      titulo: 'Consistência',
      valor: `${metricas.consistencia.toFixed(0)}%`,
      descricao: 'Estabilidade dos retornos',
      icone: Shield,
      cor: metricas.consistencia > 80 ? 'green' : metricas.consistencia > 60 ? 'yellow' : 'red',
      tendencia: metricas.consistencia > 70 ? 'up' : 'down'
    },
    {
      titulo: 'Liquidez',
      valor: `${metricas.liquidez.toFixed(0)}%`,
      descricao: 'Facilidade de resgate',
      icone: Zap,
      cor: metricas.liquidez > 80 ? 'green' : metricas.liquidez > 60 ? 'yellow' : 'red',
      tendencia: metricas.liquidez > 70 ? 'up' : 'down'
    }
  ];

  const corClasses = {
    green: 'from-green-500 to-emerald-500',
    yellow: 'from-yellow-500 to-orange-500',
    red: 'from-red-500 to-pink-500'
  };

  return (
    <div>
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
        Métricas de Performance
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {cards.map((card, index) => (
          <motion.div
            key={card.titulo}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-lg bg-gradient-to-r ${corClasses[card.cor]}`}>
                <card.icone className="w-6 h-6 text-white" />
              </div>
              {card.tendencia === 'up' ? (
                <TrendingUp className="w-5 h-5 text-green-500" />
              ) : (
                <TrendingDown className="w-5 h-5 text-red-500" />
              )}
            </div>
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {card.titulo}
              </h4>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {card.valor}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {card.descricao}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default DashboardAvancado;

function ComparacaoBenchmarks({ benchmarks }: { benchmarks: ComparacaoBenchmark[] }) {
  return (
    <div>
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
        Comparação com Benchmarks
      </h3>
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Benchmark
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Taxa
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Diferença
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Performance
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Correlação
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
              {benchmarks.map((item, index) => (
                <motion.tr
                  key={item.benchmark.nome}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <span className="text-2xl mr-3">{item.benchmark.icone}</span>
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {item.benchmark.nome}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {item.benchmark.taxa.toFixed(2)}%
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      item.diferenca > 0 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                    }`}>
                      {item.diferenca > 0 ? '+' : ''}{item.diferenca.toFixed(2)}%
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {item.superioridade > 0 ? (
                        <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                      ) : (
                        <AlertTriangle className="w-5 h-5 text-red-500 mr-2" />
                      )}
                      <span className="text-sm text-gray-900 dark:text-white">
                        {Math.abs(item.superioridade).toFixed(1)}%
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full"
                        style={{ width: `${Math.abs(item.correlacao) * 100}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {item.correlacao.toFixed(2)}
                    </span>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function EvolucaoRisco({ dados }: { dados: Array<{ mes: number; risco: number; retorno: number }> }) {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
      <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Evolução Risco vs Retorno
      </h4>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={dados}>
          <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
          <XAxis 
            dataKey="mes" 
            className="text-gray-600 dark:text-gray-400"
          />
          <YAxis className="text-gray-600 dark:text-gray-400" />
          <Tooltip 
            contentStyle={{
              backgroundColor: 'rgb(31 41 55)',
              border: 'none',
              borderRadius: '8px',
              color: 'white'
            }}
          />
          <Line 
            type="monotone" 
            dataKey="retorno" 
            stroke="#3B82F6" 
            strokeWidth={2}
            name="Retorno (%)"
          />
          <Line 
            type="monotone" 
            dataKey="risco" 
            stroke="#EF4444" 
            strokeWidth={2}
            name="Risco (%)"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

function DistribuicaoRetornos({ dados }: { dados: Array<{ faixa: string; frequencia: number; probabilidade: number }> }) {
  const cores = ['#EF4444', '#F59E0B', '#10B981', '#3B82F6', '#8B5CF6', '#EC4899'];

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
      <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Distribuição de Retornos
      </h4>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={dados}>
          <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
          <XAxis 
            dataKey="faixa" 
            className="text-gray-600 dark:text-gray-400"
          />
          <YAxis className="text-gray-600 dark:text-gray-400" />
          <Tooltip 
            contentStyle={{
              backgroundColor: 'rgb(31 41 55)',
              border: 'none',
              borderRadius: '8px',
              color: 'white'
            }}
          />
          <Bar dataKey="frequencia" name="Frequência (%)">
            {dados.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={cores[index % cores.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

function IndicadoresRisco({ indicadores }: { indicadores: any }) {
  const items = [
    {
      titulo: 'VaR 95%',
      valor: `${indicadores.var95.toFixed(2)}%`,
      descricao: 'Perda máxima esperada (95% confiança)',
      cor: 'blue'
    },
    {
      titulo: 'VaR 99%',
      valor: `${indicadores.var99.toFixed(2)}%`,
      descricao: 'Perda máxima esperada (99% confiança)',
      cor: 'purple'
    },
    {
      titulo: 'CVaR 95%',
      valor: `${indicadores.cvar95.toFixed(2)}%`,
      descricao: 'Perda esperada condicional',
      cor: 'red'
    },
    {
      titulo: 'Prob. Perdas',
      valor: `${(indicadores.probabilidadePerdas * 100).toFixed(1)}%`,
      descricao: 'Probabilidade de perdas',
      cor: 'orange'
    }
  ];

  return (
    <div>
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
        Indicadores de Risco
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {items.map((item, index) => (
          <motion.div
            key={item.titulo}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700"
          >
            <div className="text-center">
              <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                {item.titulo}
              </h4>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                {item.valor}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {item.descricao}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}