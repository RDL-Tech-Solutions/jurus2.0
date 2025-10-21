import React, { memo, useState, useMemo } from 'react';
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
  Download,
  FileText,
  FileSpreadsheet,
  Bell,
  BellOff,
  Calendar,
  DollarSign,
  Percent,
  PieChart,
  LineChart as LineChartIcon,
  Filter,
  Zap
} from 'lucide-react';
import { usePerformanceDashboard } from '../hooks/usePerformanceDashboard';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, BarChart, Bar, PieChart as RechartsPieChart, Pie, Cell, ComposedChart } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';

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
  const [graficoSelecionado, setGraficoSelecionado] = useState<'evolucao' | 'comparacao' | 'metricas' | 'analise'>('evolucao');
  const [periodoFiltro, setPeriodoFiltro] = useState<'1m' | '3m' | '6m' | '1a' | 'tudo'>('6m');
  const [alertasAtivos, setAlertasAtivos] = useState(true);
  const [modoAnalise, setModoAnalise] = useState<'basico' | 'avancado'>('basico');

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

  // Dados filtrados por período
  const dadosFiltrados = useMemo(() => {
    const agora = new Date();
    let dataLimite = new Date();
    
    switch (periodoFiltro) {
      case '1m':
        dataLimite.setMonth(agora.getMonth() - 1);
        break;
      case '3m':
        dataLimite.setMonth(agora.getMonth() - 3);
        break;
      case '6m':
        dataLimite.setMonth(agora.getMonth() - 6);
        break;
      case '1a':
        dataLimite.setFullYear(agora.getFullYear() - 1);
        break;
      default:
        dataLimite = new Date(0);
    }
    
    return dashboard.historico.filter(item => new Date(item.data) >= dataLimite);
  }, [dashboard.historico, periodoFiltro]);

  // Análises avançadas
  const analiseAvancada = useMemo(() => {
    if (dadosFiltrados.length < 2) return null;

    const valores = dadosFiltrados.map(d => d.valor);
    const retornos = valores.slice(1).map((valor, i) => (valor - valores[i]) / valores[i] * 100);
    
    const retornoMedio = retornos.reduce((acc, ret) => acc + ret, 0) / retornos.length;
    const volatilidade = Math.sqrt(retornos.reduce((acc, ret) => acc + Math.pow(ret - retornoMedio, 2), 0) / retornos.length);
    const maxDrawdown = Math.max(...valores.map((_, i) => {
      const peak = Math.max(...valores.slice(0, i + 1));
      return (peak - valores[i]) / peak * 100;
    }));

    const sharpeRatio = retornoMedio / volatilidade;
    const valorInicial = valores[0];
    const valorFinal = valores[valores.length - 1];
    const retornoTotal = (valorFinal - valorInicial) / valorInicial * 100;

    return {
      retornoTotal,
      retornoMedio,
      volatilidade,
      maxDrawdown,
      sharpeRatio,
      melhorMes: Math.max(...retornos),
      piorMes: Math.min(...retornos),
      mesesPositivos: retornos.filter(r => r > 0).length,
      mesesNegativos: retornos.filter(r => r < 0).length
    };
  }, [dadosFiltrados]);

  // Alertas inteligentes
  const alertas = useMemo(() => {
    if (!analiseAvancada) return [];

    const alertasList = [];

    if (analiseAvancada.volatilidade > 15) {
      alertasList.push({
        tipo: 'warning',
        titulo: 'Alta Volatilidade',
        descricao: `Volatilidade de ${analiseAvancada.volatilidade.toFixed(2)}% está acima do recomendado`,
        acao: 'Considere diversificar mais sua carteira'
      });
    }

    if (analiseAvancada.maxDrawdown > 20) {
      alertasList.push({
        tipo: 'danger',
        titulo: 'Drawdown Elevado',
        descricao: `Perda máxima de ${analiseAvancada.maxDrawdown.toFixed(2)}%`,
        acao: 'Revise sua estratégia de gestão de risco'
      });
    }

    if (analiseAvancada.sharpeRatio < 1) {
      alertasList.push({
        tipo: 'info',
        titulo: 'Índice Sharpe Baixo',
        descricao: `Sharpe de ${analiseAvancada.sharpeRatio.toFixed(2)} indica baixa eficiência`,
        acao: 'Busque investimentos com melhor relação risco-retorno'
      });
    }

    if (dashboard.comparacaoIndices.vsCDI < 0) {
      alertasList.push({
        tipo: 'warning',
        titulo: 'Performance Abaixo do CDI',
        descricao: `Rendimento ${dashboard.comparacaoIndices.vsCDI.toFixed(2)}% abaixo do CDI`,
        acao: 'Considere rebalancear sua carteira'
      });
    }

    return alertasList;
  }, [analiseAvancada, dashboard.comparacaoIndices]);

  // Exportar dados
  const exportarDados = (formato: 'json' | 'csv') => {
    const dados = {
      dashboard: dashboard,
      analise: analiseAvancada,
      periodo: periodoFiltro,
      dataExportacao: new Date().toISOString().split('T')[0]
    };

    if (formato === 'json') {
      const blob = new Blob([JSON.stringify(dados, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `dashboard-performance-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } else {
      const csvData = [
        ['Data', 'Valor', 'CDI', 'IPCA', 'SELIC'],
        ...dadosFiltrados.map(item => [
          item.data,
          item.valor.toString(),
          item.cdi.toString(),
          item.ipca.toString(),
          item.selic.toString()
        ])
      ];
      
      const csvContent = csvData.map(row => row.join(',')).join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `dashboard-performance-${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  // Dados para gráfico de pizza (alocação)
  const dadosAlocacao = [
    { nome: 'Renda Fixa', valor: 60, cor: '#3B82F6' },
    { nome: 'Renda Variável', valor: 30, cor: '#10B981' },
    { nome: 'Fundos', valor: 10, cor: '#F59E0B' }
  ];

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
          <Select value={periodoFiltro} onValueChange={(value: any) => setPeriodoFiltro(value)}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1m">1 Mês</SelectItem>
              <SelectItem value="3m">3 Meses</SelectItem>
              <SelectItem value="6m">6 Meses</SelectItem>
              <SelectItem value="1a">1 Ano</SelectItem>
              <SelectItem value="tudo">Tudo</SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setAlertasAtivos(!alertasAtivos)}
          >
            {alertasAtivos ? <Bell className="w-4 h-4" /> : <BellOff className="w-4 h-4" />}
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setModoAnalise(modoAnalise === 'basico' ? 'avancado' : 'basico')}
          >
            {modoAnalise === 'avancado' ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => setMostrarConfiguracoes(!mostrarConfiguracoes)}
          >
            <Settings className="w-4 h-4" />
          </Button>
          
          <Button
            onClick={handleAtualizarDashboard}
            disabled={dashboard.isLoading}
            size="sm"
          >
            <RefreshCw className={`w-4 h-4 ${dashboard.isLoading ? 'animate-spin' : ''}`} />
            Atualizar
          </Button>
        </div>
      </div>

      {/* Alertas */}
      {alertasAtivos && alertas.length > 0 && (
        <div className="space-y-2">
          {alertas.map((alerta, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className={`p-4 rounded-lg border-l-4 ${
                alerta.tipo === 'danger' ? 'bg-red-50 border-red-500' :
                alerta.tipo === 'warning' ? 'bg-yellow-50 border-yellow-500' :
                'bg-blue-50 border-blue-500'
              }`}
            >
              <div className="flex items-start gap-3">
                <AlertTriangle className={`w-5 h-5 mt-0.5 ${
                  alerta.tipo === 'danger' ? 'text-red-600' :
                  alerta.tipo === 'warning' ? 'text-yellow-600' :
                  'text-blue-600'
                }`} />
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900">{alerta.titulo}</h4>
                  <p className="text-sm text-gray-600 mt-1">{alerta.descricao}</p>
                  <p className="text-sm font-medium text-gray-800 mt-2">{alerta.acao}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Configurações */}
      <AnimatePresence>
        {mostrarConfiguracoes && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 space-y-4"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-900 dark:text-white">Configurações do Dashboard</h3>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => exportarDados('json')}>
                  <FileText className="w-4 h-4 mr-2" />
                  JSON
                </Button>
                <Button variant="outline" size="sm" onClick={() => exportarDados('csv')}>
                  <FileSpreadsheet className="w-4 h-4 mr-2" />
                  CSV
                </Button>
              </div>
            </div>
            
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
                  Mostrar comparação com índices
                </span>
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={configuracoes.mostrarTendencias}
                  onChange={(e) => setConfiguracoes(prev => ({
                    ...prev,
                    mostrarTendencias: e.target.checked
                  }))}
                  className="rounded"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  Mostrar tendências
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



      {/* Análise Avançada */}
      {modoAnalise === 'avancado' && analiseAvancada && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Análise Avançada de Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-600">Retorno Total</p>
                <p className="text-xl font-bold text-blue-800">
                  {formatarPorcentagem(analiseAvancada.retornoTotal)}
                </p>
              </div>
              
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <p className="text-sm text-green-600">Volatilidade</p>
                <p className="text-xl font-bold text-green-800">
                  {formatarPorcentagem(analiseAvancada.volatilidade)}
                </p>
              </div>
              
              <div className="text-center p-3 bg-purple-50 rounded-lg">
                <p className="text-sm text-purple-600">Sharpe Ratio</p>
                <p className="text-xl font-bold text-purple-800">
                  {analiseAvancada.sharpeRatio.toFixed(2)}
                </p>
              </div>
              
              <div className="text-center p-3 bg-red-50 rounded-lg">
                <p className="text-sm text-red-600">Max Drawdown</p>
                <p className="text-xl font-bold text-red-800">
                  {formatarPorcentagem(analiseAvancada.maxDrawdown)}
                </p>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <p className="text-gray-600">Melhor Mês</p>
                <p className="font-semibold text-green-600">
                  {formatarPorcentagem(analiseAvancada.melhorMes)}
                </p>
              </div>
              <div>
                <p className="text-gray-600">Pior Mês</p>
                <p className="font-semibold text-red-600">
                  {formatarPorcentagem(analiseAvancada.piorMes)}
                </p>
              </div>
              <div>
                <p className="text-gray-600">Meses Positivos</p>
                <p className="font-semibold text-blue-600">
                  {analiseAvancada.mesesPositivos}
                </p>
              </div>
              <div>
                <p className="text-gray-600">Meses Negativos</p>
                <p className="font-semibold text-orange-600">
                  {analiseAvancada.mesesNegativos}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

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