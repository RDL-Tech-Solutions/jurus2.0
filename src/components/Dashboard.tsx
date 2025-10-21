import React, { useState, useEffect, memo } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  PieChart,
  BarChart3,
  Target,
  AlertTriangle,
  Calendar,
  Wallet,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  Eye,
  EyeOff
} from 'lucide-react';
import { useDashboard } from '../hooks/useDashboard';
import { formatarMoeda, formatarPercentual } from '../utils/dashboardCalculations';

// Performance and accessibility hooks
import { 
  usePerformanceMonitor, 
  useDebounce, 
  useIntersectionObserver 
} from '../hooks/usePerformance';
import { 
  useBreakpoint, 
  useResponsiveValue, 
  useDeviceCapabilities 
} from '../hooks/useResponsive';
import { 
  useFocusManagement, 
  useScreenReader, 
  useReducedMotion 
} from '../hooks/useAccessibility';
import { ComponentErrorBoundary } from './ErrorBoundary';

const Dashboard: React.FC = memo(() => {
  const {
    metricas,
    evolucao,
    simulacoes,
    alertas,
    loading,
    error,
    calcularMetricas,
    atualizarDados
  } = useDashboard();

  const [mostrarValores, setMostrarValores] = useState(true);
  const [periodoSelecionado, setPeriodoSelecionado] = useState('12');

  // Performance and accessibility hooks
  const metrics = usePerformanceMonitor();
  const breakpoint = useBreakpoint();
  const { isTouch, prefersReducedMotion } = useDeviceCapabilities();
  const { announce } = useScreenReader();
  const shouldReduceMotion = useReducedMotion();

  // Responsive values
  const gridCols = useResponsiveValue({
    sm: 1,
    md: 2,
    lg: 4
  }, 1);

  const chartHeight = useResponsiveValue({
    sm: '200px',
    md: '250px',
    lg: '300px'
  }, '200px');

  // Debounced period selection
  const debouncedPeriodo = useDebounce(periodoSelecionado, 300);

  useEffect(() => {
    calcularMetricas();
  }, [calcularMetricas]);

  // Performance monitoring
  useEffect(() => {
    if (metrics.lcp > 2500) {
      console.warn('Dashboard LCP is slow:', metrics.lcp);
    }
  }, [metrics]);

  // Announce data updates to screen readers
  useEffect(() => {
    if (!loading && metricas) {
      announce('Dados do dashboard atualizados');
    }
  }, [loading, metricas, announce]);

  // Announce period changes
  useEffect(() => {
    if (debouncedPeriodo !== '12') {
      announce(`Período alterado para ${debouncedPeriodo} meses`);
    }
  }, [debouncedPeriodo, announce]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  const MetricCard: React.FC<{
    title: string;
    value: string;
    change: number;
    icon: React.ReactNode;
    color: string;
  }> = ({ title, value, change, icon, color }) => (
    <motion.div
      variants={itemVariants}
      className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg ${color}`}>
          {icon}
        </div>
        <div className={`flex items-center text-sm ${
          change >= 0 ? 'text-green-600' : 'text-red-600'
        }`}>
          {change >= 0 ? <ArrowUpRight className="w-4 h-4 mr-1" /> : <ArrowDownRight className="w-4 h-4 mr-1" />}
          {formatarPercentual(Math.abs(change))}
        </div>
      </div>
      <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
        {title}
      </h3>
      <p className="text-2xl font-bold text-gray-900 dark:text-white">
        {mostrarValores ? value : '••••••'}
      </p>
    </motion.div>
  );

  const EvolutionChart: React.FC = () => (
    <motion.div
      variants={itemVariants}
      className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Evolução do Patrimônio
        </h3>
        <select
          value={periodoSelecionado}
          onChange={(e) => setPeriodoSelecionado(e.target.value)}
          className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        >
          <option value="6">6 meses</option>
          <option value="12">12 meses</option>
          <option value="24">24 meses</option>
        </select>
      </div>
      
      <div className="h-64 flex items-end justify-between space-x-2">
        {evolucao.slice(0, parseInt(periodoSelecionado)).map((ponto, index) => {
          const altura = (ponto.valor / Math.max(...evolucao.map(p => p.valor))) * 100;
          return (
            <motion.div
              key={index}
              initial={{ height: 0 }}
              animate={{ height: `${altura}%` }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="bg-gradient-to-t from-blue-500 to-blue-400 rounded-t-sm flex-1 min-h-[20px] relative group"
            >
              <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                {formatarMoeda(ponto.valor)}
              </div>
            </motion.div>
          );
        })}
      </div>
      
      <div className="flex justify-between mt-4 text-xs text-gray-500">
        {evolucao.slice(0, parseInt(periodoSelecionado)).map((ponto, index) => (
          <span key={index} className="transform -rotate-45">
            {new Date(ponto.data).toLocaleDateString('pt-BR', { month: 'short' })}
          </span>
        ))}
      </div>
    </motion.div>
  );

  const SimulationCard: React.FC = () => (
    <motion.div
      variants={itemVariants}
      className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
    >
      <div className="flex items-center mb-4">
        <Target className="w-5 h-5 text-purple-600 mr-2" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Simulação de Cenários
        </h3>
      </div>
      
      <div className="space-y-4">
        {simulacoes?.map((simulacao, index) => (
          <div key={simulacao.id || index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="flex items-center">
              <div className={`w-3 h-3 rounded-full mr-3 ${
                simulacao.status === 'concluida' ? 'bg-green-500' :
                simulacao.status === 'em_andamento' ? 'bg-yellow-500' : 'bg-red-500'
              }`} />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">
                {simulacao.nome}
              </span>
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold text-gray-900 dark:text-white">
                {mostrarValores ? formatarMoeda(simulacao.valorFinal) : '••••••'}
              </p>
              <p className="text-xs text-gray-500">
                {formatarPercentual(simulacao.rendimento)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );

  const AlertsCard: React.FC = () => (
    <motion.div
      variants={itemVariants}
      className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
    >
      <div className="flex items-center mb-4">
        <AlertTriangle className="w-5 h-5 text-orange-600 mr-2" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Alertas e Recomendações
        </h3>
      </div>
      
      <div className="space-y-3">
        {alertas.length > 0 ? (
          alertas.slice(0, 3).map((alerta, index) => (
            <div
              key={index}
              className={`p-3 rounded-lg border-l-4 ${
                alerta.tipo === 'alto' ? 'border-red-500 bg-red-50 dark:bg-red-900/20' :
                alerta.tipo === 'medio' ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20' :
                'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
              }`}
            >
              <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                {alerta.titulo}
              </h4>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                {alerta.descricao}
              </p>
            </div>
          ))
        ) : (
          <div className="text-center py-4">
            <Activity className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-500">Nenhum alerta no momento</p>
          </div>
        )}
      </div>
    </motion.div>
  );

  if (loading) {
    return (
      <ComponentErrorBoundary>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-1/4"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-300 dark:bg-gray-700 rounded-xl"></div>
              ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="h-80 bg-gray-300 dark:bg-gray-700 rounded-xl"></div>
              <div className="h-80 bg-gray-300 dark:bg-gray-700 rounded-xl"></div>
            </div>
          </div>
          </div>
        </div>
      </ComponentErrorBoundary>
    );
  }

  return (
    <ComponentErrorBoundary>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Dashboard Financeiro
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Visão geral dos seus investimentos e métricas principais
            </p>
          </div>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setMostrarValores(!mostrarValores)}
              className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              {mostrarValores ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
              {mostrarValores ? 'Ocultar' : 'Mostrar'} Valores
            </button>
            
            <button
              onClick={atualizarDados}
              className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Atualizar
            </button>
          </div>
        </motion.div>

        {/* Métricas Principais */}
        <motion.div
          variants={shouldReduceMotion ? {} : containerVariants}
          initial={shouldReduceMotion ? false : "hidden"}
          animate={shouldReduceMotion ? false : "visible"}
          className={`grid gap-6 mb-8`}
          style={{
            gridTemplateColumns: `repeat(${gridCols}, minmax(0, 1fr))`
          }}
        >
          <MetricCard
            title="Valor Total"
            value={formatarMoeda(metricas?.valorTotal || 0)}
            change={5.2}
            icon={<DollarSign className="w-6 h-6 text-white" />}
            color="bg-blue-500"
          />
          
          <MetricCard
            title="Rendimento"
            value={formatarMoeda(metricas?.rendimento || 0)}
            change={8.7}
            icon={<Wallet className="w-6 h-6 text-white" />}
            color="bg-green-500"
          />
          
          <MetricCard
            title="Percentual de Ganho"
            value={formatarPercentual(metricas?.percentualGanho || 0)}
            change={metricas?.percentualGanho || 0}
            icon={<TrendingUp className="w-6 h-6 text-white" />}
            color="bg-purple-500"
          />
          
          <MetricCard
            title="Tempo Investido"
            value={`${metricas?.tempoInvestido || 0} meses`}
            change={3.4}
            icon={<Calendar className="w-6 h-6 text-white" />}
            color="bg-orange-500"
          />
        </motion.div>

        {/* Gráficos e Análises */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8"
        >
          <EvolutionChart />
          <SimulationCard />
        </motion.div>

        {/* Alertas e Informações Adicionais */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 lg:grid-cols-3 gap-6"
        >
          <AlertsCard />
          
          <motion.div
            variants={itemVariants}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center mb-4">
              <PieChart className="w-5 h-5 text-indigo-600 mr-2" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Distribuição de Ativos
              </h3>
            </div>
            
            <div className="space-y-3">
              {[
                { nome: 'Renda Fixa', percentual: 45, cor: 'bg-blue-500' },
                { nome: 'Ações', percentual: 35, cor: 'bg-green-500' },
                { nome: 'Fundos', percentual: 15, cor: 'bg-purple-500' },
                { nome: 'Outros', percentual: 5, cor: 'bg-gray-500' }
              ].map((item, index) => (
                <div key={index} className="flex items-center">
                  <div className={`w-3 h-3 rounded-full ${item.cor} mr-3`} />
                  <div className="flex-1 flex items-center justify-between">
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      {item.nome}
                    </span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {item.percentual}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
          
          <motion.div
            variants={itemVariants}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center mb-4">
              <BarChart3 className="w-5 h-5 text-teal-600 mr-2" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Performance vs Benchmarks
              </h3>
            </div>
            
            <div className="space-y-4">
              {[
                { nome: 'CDI', valor: 11.5, sua: 12.8 },
                { nome: 'IPCA', valor: 4.5, sua: 12.8 },
                { nome: 'Poupança', valor: 7.2, sua: 12.8 }
              ].map((benchmark, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-700 dark:text-gray-300">{benchmark.nome}</span>
                    <span className="text-gray-900 dark:text-white font-medium">
                      +{(benchmark.sua - benchmark.valor).toFixed(1)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-green-500 to-green-400 h-2 rounded-full"
                      style={{ width: `${Math.min((benchmark.sua / 15) * 100, 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>
        </div>
      </div>
    </ComponentErrorBoundary>
  );
});

Dashboard.displayName = 'Dashboard';

export default Dashboard;