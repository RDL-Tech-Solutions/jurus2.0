import React, { useState, useEffect, memo } from 'react';
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
  CheckCircle,
  DollarSign,
  Percent,
  Calendar,
  Clock,
  Zap,
  Shield
} from 'lucide-react';
import { 
  LineChart, 
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
  PieChart,
  Pie,
  Cell,
  RadialBarChart,
  RadialBar
} from 'recharts';
import { usePerformanceDashboard } from '../hooks/usePerformanceDashboard';
import { useNotificacoes } from '../hooks/useNotificacoes';

interface DashboardMelhoradoProps {
  valorAtual?: number;
  valorInicial?: number;
  className?: string;
}

interface MetricaAvancada {
  id: string;
  nome: string;
  valor: number;
  valorAnterior: number;
  meta: number;
  unidade: string;
  icone: React.ComponentType<any>;
  cor: string;
  descricao: string;
  tendencia: 'alta' | 'baixa' | 'estavel';
  alerta?: boolean;
}

const DashboardMelhorado: React.FC<DashboardMelhoradoProps> = ({
  valorAtual = 15000,
  valorInicial = 10000,
  className = ''
}) => {
  const { dashboard, configuracoes, atualizarDashboard, setConfiguracoes } = usePerformanceDashboard();
  const { adicionarNotificacao } = useNotificacoes();
  const [mostrarConfiguracoes, setMostrarConfiguracoes] = useState(false);
  const [abaSelecionada, setAbaSelecionada] = useState<'visao-geral' | 'metricas' | 'comparacao' | 'historico'>('visao-geral');
  const [tempoReal, setTempoReal] = useState(true);

  // Métricas avançadas calculadas
  const metricasAvancadas: MetricaAvancada[] = [
    {
      id: 'roi',
      nome: 'ROI',
      valor: ((valorAtual - valorInicial) / valorInicial) * 100,
      valorAnterior: 12.5,
      meta: 15,
      unidade: '%',
      icone: TrendingUp,
      cor: '#10B981',
      descricao: 'Retorno sobre investimento',
      tendencia: 'alta'
    },
    {
      id: 'cagr',
      nome: 'CAGR',
      valor: 14.2,
      valorAnterior: 13.8,
      meta: 12,
      unidade: '%',
      icone: BarChart3,
      cor: '#3B82F6',
      descricao: 'Taxa de crescimento anual composta',
      tendencia: 'alta'
    },
    {
      id: 'volatilidade',
      nome: 'Volatilidade',
      valor: 8.5,
      valorAnterior: 9.2,
      meta: 10,
      unidade: '%',
      icone: Activity,
      cor: '#F59E0B',
      descricao: 'Desvio padrão dos retornos',
      tendencia: 'baixa'
    },
    {
      id: 'sharpe',
      nome: 'Índice Sharpe',
      valor: 1.85,
      valorAnterior: 1.72,
      meta: 1.5,
      unidade: '',
      icone: Target,
      cor: '#8B5CF6',
      descricao: 'Retorno ajustado ao risco',
      tendencia: 'alta'
    },
    {
      id: 'drawdown',
      nome: 'Max Drawdown',
      valor: -3.2,
      valorAnterior: -4.1,
      meta: -5,
      unidade: '%',
      icone: Shield,
      cor: '#EF4444',
      descricao: 'Maior perda acumulada',
      tendencia: 'alta',
      alerta: Math.abs(-3.2) > 5
    },
    {
      id: 'tempo-recuperacao',
      nome: 'Tempo Recuperação',
      valor: 2.3,
      valorAnterior: 3.1,
      meta: 3,
      unidade: 'meses',
      icone: Clock,
      cor: '#06B6D4',
      descricao: 'Tempo para recuperar perdas',
      tendencia: 'baixa'
    }
  ];

  // Dados para gráfico de comparação
  const dadosComparacao = [
    { nome: 'Seu Investimento', valor: ((valorAtual - valorInicial) / valorInicial) * 100, cor: '#10B981' },
    { nome: 'CDI', valor: 13.75, cor: '#3B82F6' },
    { nome: 'IPCA', valor: 4.62, cor: '#F59E0B' },
    { nome: 'SELIC', valor: 13.75, cor: '#8B5CF6' },
    { nome: 'Poupança', valor: 6.17, cor: '#EF4444' }
  ];

  // Dados para gráfico de distribuição de risco
  const dadosRisco = [
    { nome: 'Conservador', valor: 25, cor: '#10B981' },
    { nome: 'Moderado', valor: 45, cor: '#F59E0B' },
    { nome: 'Agressivo', valor: 30, cor: '#EF4444' }
  ];

  // Atualização em tempo real
  useEffect(() => {
    if (tempoReal) {
      const interval = setInterval(() => {
        atualizarDashboard(valorAtual, valorInicial);
      }, 30000); // Atualiza a cada 30 segundos

      return () => clearInterval(interval);
    }
  }, [tempoReal, valorAtual, valorInicial, atualizarDashboard]);

  // Verificar alertas
  useEffect(() => {
    metricasAvancadas.forEach(metrica => {
      if (metrica.alerta) {
        adicionarNotificacao({
          tipo: 'alerta',
          titulo: `Alerta: ${metrica.nome}`,
          mensagem: `${metrica.nome} está fora da meta estabelecida (${metrica.valor}${metrica.unidade})`,
          prioridade: 'alta',
          duracao: 10000
        });
      }
    });
  }, [metricasAvancadas, adicionarNotificacao]);

  const formatarMoeda = (valor: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor);
  };

  const formatarPorcentagem = (valor: number) => {
    return `${valor >= 0 ? '+' : ''}${valor.toFixed(2)}%`;
  };

  const obterCorTendencia = (tendencia: 'alta' | 'baixa' | 'estavel') => {
    switch (tendencia) {
      case 'alta': return 'text-green-600 dark:text-green-400';
      case 'baixa': return 'text-red-600 dark:text-red-400';
      default: return 'text-yellow-600 dark:text-yellow-400';
    }
  };

  const obterIconeTendencia = (tendencia: 'alta' | 'baixa' | 'estavel') => {
    switch (tendencia) {
      case 'alta': return <TrendingUp className="w-4 h-4" />;
      case 'baixa': return <TrendingDown className="w-4 h-4" />;
      default: return <Activity className="w-4 h-4" />;
    }
  };

  const renderizarVisaoGeral = () => (
    <div className="space-y-6">
      {/* Resumo Principal */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white"
        >
          <div className="flex items-center justify-between mb-4">
            <DollarSign className="w-8 h-8" />
            <span className="text-blue-100 text-sm">Valor Atual</span>
          </div>
          <div className="space-y-2">
            <p className="text-3xl font-bold">{formatarMoeda(valorAtual)}</p>
            <p className="text-blue-100">
              {formatarPorcentagem(((valorAtual - valorInicial) / valorInicial) * 100)} vs inicial
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white"
        >
          <div className="flex items-center justify-between mb-4">
            <TrendingUp className="w-8 h-8" />
            <span className="text-green-100 text-sm">Rendimento</span>
          </div>
          <div className="space-y-2">
            <p className="text-3xl font-bold">{formatarMoeda(valorAtual - valorInicial)}</p>
            <p className="text-green-100">Lucro acumulado</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white"
        >
          <div className="flex items-center justify-between mb-4">
            <Target className="w-8 h-8" />
            <span className="text-purple-100 text-sm">Performance</span>
          </div>
          <div className="space-y-2">
            <p className="text-3xl font-bold">Excelente</p>
            <p className="text-purple-100">Acima da meta</p>
          </div>
        </motion.div>
      </div>

      {/* Gráfico de Evolução */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
      >
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Evolução do Investimento
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={dashboard.historico}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="data" />
            <YAxis />
            <Tooltip 
              formatter={(value: number) => [formatarMoeda(value), 'Valor']}
              labelFormatter={(label) => `Data: ${label}`}
            />
            <Area 
              type="monotone" 
              dataKey="valor" 
              stroke="#3B82F6" 
              fill="url(#gradientBlue)" 
            />
            <defs>
              <linearGradient id="gradientBlue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.1}/>
              </linearGradient>
            </defs>
          </AreaChart>
        </ResponsiveContainer>
      </motion.div>
    </div>
  );

  const renderizarMetricas = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {metricasAvancadas.map((metrica, index) => (
        <motion.div
          key={metrica.id}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.1 }}
          className={`bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border ${
            metrica.alerta 
              ? 'border-red-300 dark:border-red-700' 
              : 'border-gray-200 dark:border-gray-700'
          }`}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div 
                className="p-2 rounded-lg"
                style={{ backgroundColor: `${metrica.cor}20` }}
              >
                <metrica.icone 
                  className="w-5 h-5" 
                  style={{ color: metrica.cor }}
                />
              </div>
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">
                  {metrica.nome}
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {metrica.descricao}
                </p>
              </div>
            </div>
            {metrica.alerta && (
              <AlertTriangle className="w-5 h-5 text-red-500" />
            )}
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold text-gray-900 dark:text-white">
                {metrica.valor}{metrica.unidade}
              </span>
              <div className={`flex items-center gap-1 ${obterCorTendencia(metrica.tendencia)}`}>
                {obterIconeTendencia(metrica.tendencia)}
                <span className="text-sm">
                  {formatarPorcentagem(((metrica.valor - metrica.valorAnterior) / metrica.valorAnterior) * 100)}
                </span>
              </div>
            </div>

            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className="h-2 rounded-full transition-all duration-300"
                style={{ 
                  backgroundColor: metrica.cor,
                  width: `${Math.min((Math.abs(metrica.valor) / Math.abs(metrica.meta)) * 100, 100)}%`
                }}
              />
            </div>

            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
              <span>Meta: {metrica.meta}{metrica.unidade}</span>
              <span>
                {metrica.valor >= metrica.meta ? 'Atingida' : 'Em progresso'}
              </span>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );

  const renderizarComparacao = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico de Barras - Comparação */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Comparação com Índices
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dadosComparacao}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="nome" />
              <YAxis />
              <Tooltip 
                formatter={(value: number) => [`${value.toFixed(2)}%`, 'Rendimento']}
              />
              <Bar dataKey="valor" fill="#3B82F6" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Gráfico de Pizza - Distribuição de Risco */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Perfil de Risco
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={dadosRisco}
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                dataKey="valor"
                label={({ nome, valor }) => `${nome}: ${valor}%`}
              >
                {dadosRisco.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.cor} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>
      </div>
    </div>
  );

  const renderizarHistorico = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
    >
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Histórico Detalhado
      </h3>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={dashboard.historico}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="data" />
          <YAxis />
          <Tooltip />
          <Line 
            type="monotone" 
            dataKey="valor" 
            stroke="#3B82F6" 
            strokeWidth={2}
            name="Seu Investimento"
          />
          <Line 
            type="monotone" 
            dataKey="cdi" 
            stroke="#10B981" 
            strokeWidth={2}
            strokeDasharray="5 5"
            name="CDI"
          />
          <Line 
            type="monotone" 
            dataKey="ipca" 
            stroke="#F59E0B" 
            strokeWidth={2}
            strokeDasharray="5 5"
            name="IPCA"
          />
        </LineChart>
      </ResponsiveContainer>
    </motion.div>
  );

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Dashboard de Performance Avançado
          </h2>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Última atualização: {dashboard.ultimaAtualizacao.toLocaleTimeString('pt-BR')}
            {tempoReal && (
              <span className="ml-2 inline-flex items-center gap-1 text-green-600">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                Tempo real
              </span>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => setTempoReal(!tempoReal)}
            className={`p-2 rounded-lg transition-colors ${
              tempoReal 
                ? 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-400' 
                : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
            }`}
            title={tempoReal ? 'Desativar tempo real' : 'Ativar tempo real'}
          >
            <Zap className="w-5 h-5" />
          </button>
          
          <button
            onClick={() => setMostrarConfiguracoes(!mostrarConfiguracoes)}
            className="p-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
            title="Configurações"
          >
            <Settings className="w-5 h-5" />
          </button>
          
          <button
            onClick={() => atualizarDashboard(valorAtual, valorInicial)}
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
            <h3 className="font-semibold text-gray-900 dark:text-white">Configurações Avançadas</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                  Mostrar comparação
                </span>
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={tempoReal}
                  onChange={(e) => setTempoReal(e.target.checked)}
                  className="rounded"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  Modo tempo real
                </span>
              </label>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navegação por Abas */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="flex space-x-8">
          {[
            { id: 'visao-geral', nome: 'Visão Geral', icone: Eye },
            { id: 'metricas', nome: 'Métricas', icone: BarChart3 },
            { id: 'comparacao', nome: 'Comparação', icone: TrendingUp },
            { id: 'historico', nome: 'Histórico', icone: Calendar }
          ].map((aba) => (
            <button
              key={aba.id}
              onClick={() => setAbaSelecionada(aba.id as any)}
              className={`flex items-center gap-2 py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                abaSelecionada === aba.id
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              <aba.icone className="w-4 h-4" />
              {aba.nome}
            </button>
          ))}
        </nav>
      </div>

      {/* Conteúdo das Abas */}
      <AnimatePresence mode="wait">
        <motion.div
          key={abaSelecionada}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.2 }}
        >
          {abaSelecionada === 'visao-geral' && renderizarVisaoGeral()}
          {abaSelecionada === 'metricas' && renderizarMetricas()}
          {abaSelecionada === 'comparacao' && renderizarComparacao()}
          {abaSelecionada === 'historico' && renderizarHistorico()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default memo(DashboardMelhorado);