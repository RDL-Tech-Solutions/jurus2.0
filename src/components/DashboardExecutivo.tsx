import React, { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  PieChart,
  BarChart3,
  Target,
  AlertTriangle,
  CheckCircle,
  Clock,
  Users,
  Building,
  Globe,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  Filter,
  Download,
  RefreshCw,
  Shield,
  Award,
  Activity
} from 'lucide-react';
import { useDashboardExecutivo } from '../hooks/useDashboardExecutivo';
import { formatarMoeda, formatarPercentual } from '../utils/dashboardCalculations';

interface DashboardExecutivoProps {
  simulacao?: any;
}

interface MetricaExecutiva {
  id: string;
  titulo: string;
  valor: string | number;
  variacao: number;
  periodo: string;
  tipo: 'valor' | 'percentual' | 'quantidade';
  tendencia: 'alta' | 'baixa' | 'estavel';
  meta?: number;
  icon: React.ComponentType<any>;
  cor: string;
}

interface AnaliseSetorial {
  setor: string;
  alocacao: number;
  performance: number;
  risco: 'baixo' | 'medio' | 'alto';
  recomendacao: 'comprar' | 'manter' | 'vender';
  outlook: string;
}

interface BenchmarkComparativo {
  nome: string;
  rentabilidade: number;
  risco: number;
  sharpe: number;
  maxDrawdown: number;
  correlacao: number;
}

const DashboardExecutivo: React.FC<DashboardExecutivoProps> = ({ simulacao }) => {
  const {
    kpis,
    comparativos: dadosComparativos,
    alertasExecutivos,
    loading,
    atualizarDadosExecutivos: carregarDados,
    exportarDados: exportarRelatorio,
    gerarRelatorioPerformance: analisarPerformance
  } = useDashboardExecutivo();
  
  const [periodoSelecionado, setPeriodoSelecionado] = useState('12m');
  const [filtroAtivo, setFiltroAtivo] = useState('todos');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    carregarDados();
  }, [carregarDados]);

  // Métricas executivas calculadas
  const metricas: MetricaExecutiva[] = useMemo(() => {
    if (!kpis) return [];
    
    const valorTotal = 1250000; // Valor exemplo
    const valorInicial = 1000000; // Valor exemplo
    const rentabilidade = kpis.roi || 0;
    
    return [
        {
          id: 'patrimonio',
          titulo: 'Patrimônio Total',
          valor: formatarMoeda(valorTotal),
          variacao: 12.5,
          periodo: '12 meses',
          tipo: 'valor',
          tendencia: 'alta',
          meta: 120000,
          icon: DollarSign,
          cor: 'green'
        },
        {
          id: 'rentabilidade',
          titulo: 'Rentabilidade Acumulada',
          valor: formatarPercentual(rentabilidade),
          variacao: 3.2,
          periodo: '12 meses',
          tipo: 'percentual',
          tendencia: rentabilidade > 0 ? 'alta' : 'baixa',
          meta: 15,
          icon: TrendingUp,
          cor: 'blue'
        },
        {
          id: 'risco',
          titulo: 'Volatilidade da Carteira',
          valor: `${kpis.volatilidade?.toFixed(1) || '0.0'}%`,
          variacao: -2.1,
          periodo: '12 meses',
          tipo: 'percentual',
          tendencia: 'baixa',
          meta: 20,
          icon: Shield,
          cor: 'orange'
        },
        {
          id: 'sharpe',
          titulo: 'Índice Sharpe',
          valor: kpis.sharpeRatio?.toFixed(2) || '0.00',
          variacao: 0.15,
          periodo: '12 meses',
          tipo: 'quantidade',
          tendencia: (kpis.sharpeRatio || 0) > 1 ? 'alta' : 'baixa',
          meta: 1.5,
          icon: Award,
          cor: 'purple'
        },
        {
          id: 'diversificacao',
          titulo: 'Max Drawdown',
          valor: `${kpis.maxDrawdown?.toFixed(1) || '0.0'}%`,
          variacao: 5.2,
          periodo: '12 meses',
          tipo: 'percentual',
          tendencia: 'baixa',
          meta: 10,
          icon: PieChart,
          cor: 'indigo'
        },
        {
          id: 'liquidez',
          titulo: 'Information Ratio',
          valor: kpis.informationRatio?.toFixed(2) || '0.00',
          variacao: -1.8,
          periodo: '12 meses',
          tipo: 'quantidade',
          tendencia: 'alta',
          meta: 1.0,
          icon: Activity,
          cor: 'teal'
        }
      ];
   }, [kpis]);

  // Análise setorial
  const analiseSetorial: AnaliseSetorial[] = [
    {
      setor: 'Tecnologia',
      alocacao: 25,
      performance: 15.8,
      risco: 'alto',
      recomendacao: 'manter',
      outlook: 'Crescimento sustentado com inovação em IA'
    },
    {
      setor: 'Financeiro',
      alocacao: 20,
      performance: 12.3,
      risco: 'medio',
      recomendacao: 'comprar',
      outlook: 'Beneficiado pela alta da Selic'
    },
    {
      setor: 'Saúde',
      alocacao: 15,
      performance: 8.7,
      risco: 'baixo',
      recomendacao: 'manter',
      outlook: 'Setor defensivo com crescimento estável'
    },
    {
      setor: 'Energia',
      alocacao: 12,
      performance: 22.1,
      risco: 'alto',
      recomendacao: 'vender',
      outlook: 'Volatilidade alta por fatores geopolíticos'
    },
    {
      setor: 'Consumo',
      alocacao: 18,
      performance: 6.2,
      risco: 'medio',
      recomendacao: 'comprar',
      outlook: 'Recuperação gradual do consumo interno'
    },
    {
      setor: 'Utilities',
      alocacao: 10,
      performance: 9.4,
      risco: 'baixo',
      recomendacao: 'manter',
      outlook: 'Dividendos atrativos e estabilidade'
    }
  ];

  // Benchmarks comparativos
  const benchmarks: BenchmarkComparativo[] = [
    {
      nome: 'Sua Carteira',
      rentabilidade: 14.2,
      risco: 18.5,
      sharpe: 1.42,
      maxDrawdown: 12.3,
      correlacao: 1.0
    },
    {
      nome: 'Ibovespa',
      rentabilidade: 11.8,
      risco: 22.1,
      sharpe: 0.98,
      maxDrawdown: 18.7,
      correlacao: 0.85
    },
    {
      nome: 'CDI',
      rentabilidade: 12.5,
      risco: 0.5,
      sharpe: 2.1,
      maxDrawdown: 0.1,
      correlacao: 0.12
    },
    {
      nome: 'S&P 500',
      rentabilidade: 16.3,
      risco: 19.2,
      sharpe: 1.55,
      maxDrawdown: 15.2,
      correlacao: 0.72
    },
    {
      nome: 'Carteira Modelo',
      rentabilidade: 13.9,
      risco: 17.8,
      sharpe: 1.38,
      maxDrawdown: 11.8,
      correlacao: 0.92
    }
  ];

  const handleExportarRelatorio = async () => {
    setIsLoading(true);
    try {
      await exportarRelatorio('pdf');
      alert('Relatório exportado com sucesso!');
    } catch (error) {
      alert('Erro ao exportar relatório');
    } finally {
      setIsLoading(false);
    }
  };

  const MetricaCard: React.FC<{ metrica: MetricaExecutiva }> = ({ metrica }) => {
    const Icon = metrica.icon;
    const progressoMeta = metrica.meta ? (Number(metrica.valor.toString().replace(/[^\d.-]/g, '')) / metrica.meta) * 100 : 0;
    
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
      >
        <div className="flex items-center justify-between mb-4">
          <div className={`p-3 rounded-lg bg-${metrica.cor}-100 dark:bg-${metrica.cor}-900/20`}>
            <Icon className={`w-6 h-6 text-${metrica.cor}-600`} />
          </div>
          <div className={`flex items-center gap-1 text-sm ${
            metrica.tendencia === 'alta' ? 'text-green-600' :
            metrica.tendencia === 'baixa' ? 'text-red-600' : 'text-gray-600'
          }`}>
            {metrica.tendencia === 'alta' ? <TrendingUp className="w-4 h-4" /> :
             metrica.tendencia === 'baixa' ? <TrendingDown className="w-4 h-4" /> :
             <Activity className="w-4 h-4" />}
            {Math.abs(metrica.variacao)}%
          </div>
        </div>
        
        <div className="mb-2">
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">{metrica.titulo}</h3>
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {metrica.tipo === 'valor' ? metrica.valor :
             metrica.tipo === 'percentual' ? `${metrica.valor}%` :
             metrica.valor}
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400">{metrica.periodo}</p>
        </div>
        
        {metrica.meta && (
          <div className="mt-4">
            <div className="flex justify-between text-xs mb-1">
              <span className="text-gray-600 dark:text-gray-400">Meta: {metrica.meta}{metrica.tipo === 'percentual' ? '%' : ''}</span>
              <span className="text-gray-600 dark:text-gray-400">{progressoMeta.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className={`h-2 rounded-full bg-${metrica.cor}-500 transition-all`}
                style={{ width: `${Math.min(100, progressoMeta)}%` }}
              />
            </div>
          </div>
        )}
      </motion.div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <BarChart3 className="w-8 h-8 text-blue-500" />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard Executivo</h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            Visão estratégica completa dos seus investimentos
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <select
            value={periodoSelecionado}
            onChange={(e) => setPeriodoSelecionado(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          >
            <option value="1m">1 Mês</option>
            <option value="3m">3 Meses</option>
            <option value="6m">6 Meses</option>
            <option value="12m">12 Meses</option>
            <option value="24m">24 Meses</option>
          </select>
          
          <button
            onClick={handleExportarRelatorio}
            disabled={isLoading}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            {isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
            {isLoading ? 'Gerando...' : 'Exportar'}
          </button>
        </div>
      </div>

      {/* Métricas Principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {metricas.map((metrica) => (
          <MetricaCard key={metrica.id} metrica={metrica} />
        ))}
      </div>

      {/* Análise Setorial */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
        <div className="flex items-center gap-3 mb-6">
          <Building className="w-6 h-6 text-blue-500" />
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Análise Setorial</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-400">Setor</th>
                <th className="text-right py-3 px-4 font-medium text-gray-600 dark:text-gray-400">Alocação</th>
                <th className="text-right py-3 px-4 font-medium text-gray-600 dark:text-gray-400">Performance</th>
                <th className="text-center py-3 px-4 font-medium text-gray-600 dark:text-gray-400">Risco</th>
                <th className="text-center py-3 px-4 font-medium text-gray-600 dark:text-gray-400">Recomendação</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-400">Outlook</th>
              </tr>
            </thead>
            <tbody>
              {analiseSetorial.map((setor, index) => (
                <tr key={index} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <td className="py-3 px-4 font-medium text-gray-900 dark:text-white">{setor.setor}</td>
                  <td className="py-3 px-4 text-right text-gray-900 dark:text-white">{setor.alocacao}%</td>
                  <td className={`py-3 px-4 text-right font-medium ${
                    setor.performance > 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {setor.performance > 0 ? '+' : ''}{setor.performance}%
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      setor.risco === 'baixo' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' :
                      setor.risco === 'medio' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400' :
                      'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                    }`}>
                      {setor.risco.charAt(0).toUpperCase() + setor.risco.slice(1)}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      setor.recomendacao === 'comprar' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' :
                      setor.recomendacao === 'manter' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400' :
                      'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                    }`}>
                      {setor.recomendacao.charAt(0).toUpperCase() + setor.recomendacao.slice(1)}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400 max-w-xs truncate">
                    {setor.outlook}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Benchmark Comparativo */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
        <div className="flex items-center gap-3 mb-6">
          <Target className="w-6 h-6 text-purple-500" />
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Benchmark Comparativo</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-400">Benchmark</th>
                <th className="text-right py-3 px-4 font-medium text-gray-600 dark:text-gray-400">Rentabilidade</th>
                <th className="text-right py-3 px-4 font-medium text-gray-600 dark:text-gray-400">Risco</th>
                <th className="text-right py-3 px-4 font-medium text-gray-600 dark:text-gray-400">Sharpe</th>
                <th className="text-right py-3 px-4 font-medium text-gray-600 dark:text-gray-400">Max DD</th>
                <th className="text-right py-3 px-4 font-medium text-gray-600 dark:text-gray-400">Correlação</th>
              </tr>
            </thead>
            <tbody>
              {benchmarks.map((benchmark, index) => (
                <tr key={index} className={`border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 ${
                  benchmark.nome === 'Sua Carteira' ? 'bg-blue-50 dark:bg-blue-900/10' : ''
                }`}>
                  <td className={`py-3 px-4 font-medium ${
                    benchmark.nome === 'Sua Carteira' ? 'text-blue-600 dark:text-blue-400' : 'text-gray-900 dark:text-white'
                  }`}>
                    {benchmark.nome}
                  </td>
                  <td className={`py-3 px-4 text-right font-medium ${
                    benchmark.rentabilidade > 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {benchmark.rentabilidade > 0 ? '+' : ''}{benchmark.rentabilidade}%
                  </td>
                  <td className="py-3 px-4 text-right text-gray-900 dark:text-white">{benchmark.risco}%</td>
                  <td className="py-3 px-4 text-right text-gray-900 dark:text-white">{benchmark.sharpe}</td>
                  <td className="py-3 px-4 text-right text-red-600">{benchmark.maxDrawdown}%</td>
                  <td className="py-3 px-4 text-right text-gray-900 dark:text-white">{benchmark.correlacao}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Insights Executivos */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
          <div className="flex items-center gap-3 mb-4">
            <AlertTriangle className="w-6 h-6 text-orange-500" />
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Alertas de Risco</h3>
          </div>
          <div className="space-y-3">
            <div className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg border-l-4 border-orange-500">
              <p className="text-sm font-medium text-orange-800 dark:text-orange-400">
                Concentração Alta em Tecnologia
              </p>
              <p className="text-xs text-orange-600 dark:text-orange-300 mt-1">
                25% da carteira concentrada em um único setor
              </p>
            </div>
            <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border-l-4 border-yellow-500">
              <p className="text-sm font-medium text-yellow-800 dark:text-yellow-400">
                Volatilidade Acima da Meta
              </p>
              <p className="text-xs text-yellow-600 dark:text-yellow-300 mt-1">
                Risco atual: 18.5% | Meta: 15%
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
          <div className="flex items-center gap-3 mb-4">
            <CheckCircle className="w-6 h-6 text-green-500" />
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Recomendações</h3>
          </div>
          <div className="space-y-3">
            <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border-l-4 border-green-500">
              <p className="text-sm font-medium text-green-800 dark:text-green-400">
                Rebalanceamento Setorial
              </p>
              <p className="text-xs text-green-600 dark:text-green-300 mt-1">
                Considere reduzir exposição em tecnologia
              </p>
            </div>
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border-l-4 border-blue-500">
              <p className="text-sm font-medium text-blue-800 dark:text-blue-400">
                Oportunidade em Financeiro
              </p>
              <p className="text-xs text-blue-600 dark:text-blue-300 mt-1">
                Setor subvalorizado com potencial de alta
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardExecutivo;