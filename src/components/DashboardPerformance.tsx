import React, { memo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  Target, 
  BarChart3, 
  RefreshCw,
  Settings,
  Eye,
  EyeOff,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import { usePerformanceDashboard } from '../hooks/usePerformanceDashboard';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, BarChart, Bar } from 'recharts';

interface DashboardPerformanceProps {
  valorAtual?: number;
  valorInicial?: number;
  className?: string;
}

const DashboardPerformance: React.FC<DashboardPerformanceProps> = memo(({
  valorAtual,
  valorInicial,
  className = ''
}) => {
  const { dashboard, configuracoes, metricas, atualizarDashboard, setConfiguracoes } = usePerformanceDashboard();
  const [mostrarConfiguracoes, setMostrarConfiguracoes] = useState(false);
  const [graficoSelecionado, setGraficoSelecionado] = useState<'evolucao' | 'comparacao' | 'metricas'>('evolucao');

  const handleAtualizarDashboard = () => {
    atualizarDashboard(valorAtual, valorInicial);
  };

  const formatarMoeda = (valor: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor);
  };

  const formatarPorcentagem = (valor: number) => {
    return `${valor.toFixed(2)}%`;
  };

  const obterCorTendencia = (tendencia: 'alta' | 'baixa' | 'estavel') => {
    switch (tendencia) {
      case 'alta': return 'text-green-600';
      case 'baixa': return 'text-red-600';
      default: return 'text-yellow-600';
    }
  };

  const obterIconeTendencia = (tendencia: 'alta' | 'baixa' | 'estavel') => {
    switch (tendencia) {
      case 'alta': return <TrendingUp className="w-4 h-4" />;
      case 'baixa': return <TrendingDown className="w-4 h-4" />;
      default: return <Activity className="w-4 h-4" />;
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header do Dashboard */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Dashboard de Performance
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Última atualização: {dashboard.ultimaAtualizacao.toLocaleTimeString('pt-BR')}
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => setMostrarConfiguracoes(!mostrarConfiguracoes)}
            className="p-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
            title="Configurações"
          >
            <Settings className="w-5 h-5" />
          </button>
          
          <button
            onClick={handleAtualizarDashboard}
            disabled={dashboard.isLoading}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${dashboard.isLoading ? 'animate-spin' : ''}`} />
            Atualizar
          </button>
        </div>
      </div>

      {/* Configurações */}
      <AnimatePresence>
        {mostrarConfiguracoes && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 space-y-4"
          >
            <h3 className="font-semibold text-gray-900 dark:text-white">Configurações do Dashboard</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={configuracoes.atualizacaoAutomatica}
                  onChange={(e) => setConfiguracoes(prev => ({
                    ...prev,
                    atualizacaoAutomatica: e.target.checked
                  }))}
                  className="rounded"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  Atualização automática
                </span>
              </label>
              
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={configuracoes.mostrarComparacao}
                  onChange={(e) => setConfiguracoes(prev => ({
                    ...prev,
                    mostrarComparacao: e.target.checked
                  }))}
                  className="rounded"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  Mostrar comparação com índices
                </span>
              </label>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Indicadores Econômicos */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {dashboard.indicadores.map((indicador, index) => (
          <motion.div
            key={indicador.nome}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {indicador.nome}
              </h3>
              {indicador.variacao >= 0 ? (
                <TrendingUp className="w-4 h-4 text-green-600" />
              ) : (
                <TrendingDown className="w-4 h-4 text-red-600" />
              )}
            </div>
            
            <div className="space-y-1">
              <p className="text-lg font-bold text-gray-900 dark:text-white">
                {indicador.nome === 'IBOVESPA' 
                  ? indicador.valor.toLocaleString('pt-BR')
                  : formatarPorcentagem(indicador.valor)
                }
              </p>
              <p className={`text-sm ${indicador.variacao >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {indicador.variacao >= 0 ? '+' : ''}{formatarPorcentagem(indicador.variacao)}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Métricas de Performance */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {dashboard.metricas.map((metrica, index) => (
          <motion.div
            key={metrica.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {metrica.nome}
              </h3>
              <div className={obterCorTendencia(metrica.tendencia)}>
                {obterIconeTendencia(metrica.tendencia)}
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-gray-900 dark:text-white">
                  {formatarPorcentagem(metrica.valor)}
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Meta: {formatarPorcentagem(metrica.meta)}
                </span>
              </div>
              
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="h-2 rounded-full transition-all duration-300"
                  style={{
                    width: `${Math.min((metrica.valor / metrica.meta) * 100, 100)}%`,
                    backgroundColor: metrica.cor
                  }}
                />
              </div>
              
              <p className={`text-sm ${metrica.variacao >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {metrica.variacao >= 0 ? '+' : ''}{formatarPorcentagem(metrica.variacao)} este mês
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Seletor de Gráficos */}
      <div className="flex items-center gap-2 border-b border-gray-200 dark:border-gray-700">
        {[
          { id: 'evolucao', label: 'Evolução Patrimonial', icon: TrendingUp },
          { id: 'comparacao', label: 'Comparação com Índices', icon: BarChart3 },
          { id: 'metricas', label: 'Métricas Detalhadas', icon: Target }
        ].map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setGraficoSelecionado(id as any)}
            className={`flex items-center gap-2 px-4 py-2 border-b-2 transition-colors ${
              graficoSelecionado === id
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <Icon className="w-4 h-4" />
            {label}
          </button>
        ))}
      </div>

      {/* Gráficos */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <AnimatePresence mode="wait">
          {graficoSelecionado === 'evolucao' && (
            <motion.div
              key="evolucao"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="h-80"
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Evolução Patrimonial
              </h3>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={dashboard.historico}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="data" 
                    tickFormatter={(value) => new Date(value).toLocaleDateString('pt-BR', { month: 'short' })}
                  />
                  <YAxis tickFormatter={(value) => formatarMoeda(value)} />
                  <Tooltip 
                    formatter={(value: number) => [formatarMoeda(value), 'Valor']}
                    labelFormatter={(value) => new Date(value).toLocaleDateString('pt-BR')}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="valor" 
                    stroke="#3B82F6" 
                    fill="#3B82F6" 
                    fillOpacity={0.3}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </motion.div>
          )}

          {graficoSelecionado === 'comparacao' && (
            <motion.div
              key="comparacao"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="h-80"
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Comparação com Índices de Mercado
              </h3>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={dashboard.historico}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="data" 
                    tickFormatter={(value) => new Date(value).toLocaleDateString('pt-BR', { month: 'short' })}
                  />
                  <YAxis tickFormatter={(value) => `${value}%`} />
                  <Tooltip 
                    formatter={(value: number, name: string) => [`${value.toFixed(2)}%`, name]}
                    labelFormatter={(value) => new Date(value).toLocaleDateString('pt-BR')}
                  />
                  <Line type="monotone" dataKey="cdi" stroke="#10B981" name="CDI" strokeWidth={2} />
                  <Line type="monotone" dataKey="ipca" stroke="#F59E0B" name="IPCA" strokeWidth={2} />
                  <Line type="monotone" dataKey="selic" stroke="#8B5CF6" name="SELIC" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </motion.div>
          )}

          {graficoSelecionado === 'metricas' && (
            <motion.div
              key="metricas"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="h-80"
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Métricas de Performance
              </h3>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dashboard.metricas}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="nome" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value: number) => [`${value.toFixed(2)}%`, 'Valor']}
                  />
                  <Bar dataKey="valor" fill="#3B82F6" />
                  <Bar dataKey="meta" fill="#E5E7EB" />
                </BarChart>
              </ResponsiveContainer>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Resumo de Performance */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Performance Geral</p>
              <p className="font-semibold text-gray-900 dark:text-white">{metricas.performanceGeral}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <TrendingUp className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">vs. Mercado</p>
              <p className="font-semibold text-gray-900 dark:text-white">{metricas.melhorIndicador}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Nível de Risco</p>
              <p className="font-semibold text-gray-900 dark:text-white">
                {metricas.risco < 10 ? 'Baixo' : metricas.risco < 15 ? 'Médio' : 'Alto'}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
              <Target className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Consistência</p>
              <p className="font-semibold text-gray-900 dark:text-white">
                {metricas.consistencia > 1.5 ? 'Excelente' : metricas.consistencia > 1 ? 'Boa' : 'Regular'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

export default DashboardPerformance;