import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Target,
  TrendingUp,
  Shield,
  Zap,
  Brain,
  Star,
  Clock,
  DollarSign,
  BarChart3,
  PieChart,
  Activity,
  AlertTriangle,
  CheckCircle,
  Info,
  Play,
  Pause,
  RotateCcw,
  Settings,
  Download,
  Upload,
  Plus,
  Edit,
  Trash2,
  Copy
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
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  ComposedChart,
  Legend
} from 'recharts';
import { formatarMoeda, formatarPercentual } from '../utils/formatters';

interface EstrategiaInvestimento {
  id: string;
  nome: string;
  tipo: 'conservadora' | 'moderada' | 'agressiva' | 'personalizada';
  descricao: string;
  alocacao: {
    rendaFixa: number;
    acoes: number;
    fundosImobiliarios: number;
    internacional: number;
    commodities: number;
  };
  retornoEsperado: number;
  risco: number;
  prazoRecomendado: number;
  valorMinimo: number;
  status: 'ativa' | 'pausada' | 'finalizada';
  performance: {
    retornoAcumulado: number;
    volatilidade: number;
    sharpeRatio: number;
    maxDrawdown: number;
  };
  historico: Array<{
    data: string;
    valor: number;
    retorno: number;
  }>;
}

interface AbaEstrategiasProps {
  resultados: any[];
  cenarios: any[];
  onSimularEstrategia: (estrategia: EstrategiaInvestimento) => void;
}

const AbaEstrategias: React.FC<AbaEstrategiasProps> = ({
  resultados,
  cenarios,
  onSimularEstrategia
}) => {
  const [estrategiaSelecionada, setEstrategiaSelecionada] = useState<string | null>(null);
  const [modoVisualizacao, setModoVisualizacao] = useState<'lista' | 'comparacao' | 'detalhes'>('lista');
  const [filtroTipo, setFiltroTipo] = useState<string>('todos');
  const [modalEstrategia, setModalEstrategia] = useState(false);
  const [estrategiaEditando, setEstrategiaEditando] = useState<EstrategiaInvestimento | null>(null);

  // Estratégias predefinidas
  const estrategiasPredefinidas: EstrategiaInvestimento[] = [
    {
      id: '1',
      nome: 'Conservadora Plus',
      tipo: 'conservadora',
      descricao: 'Estratégia focada em preservação de capital com baixo risco',
      alocacao: {
        rendaFixa: 70,
        acoes: 15,
        fundosImobiliarios: 10,
        internacional: 3,
        commodities: 2
      },
      retornoEsperado: 8.5,
      risco: 5.2,
      prazoRecomendado: 12,
      valorMinimo: 1000,
      status: 'ativa',
      performance: {
        retornoAcumulado: 12.3,
        volatilidade: 4.8,
        sharpeRatio: 1.2,
        maxDrawdown: 2.1
      },
      historico: gerarHistoricoPerformance(12.3, 4.8)
    },
    {
      id: '2',
      nome: 'Crescimento Equilibrado',
      tipo: 'moderada',
      descricao: 'Balanceamento entre crescimento e segurança',
      alocacao: {
        rendaFixa: 45,
        acoes: 35,
        fundosImobiliarios: 12,
        internacional: 5,
        commodities: 3
      },
      retornoEsperado: 12.8,
      risco: 8.7,
      prazoRecomendado: 24,
      valorMinimo: 5000,
      status: 'ativa',
      performance: {
        retornoAcumulado: 18.7,
        volatilidade: 8.2,
        sharpeRatio: 1.5,
        maxDrawdown: 5.4
      },
      historico: gerarHistoricoPerformance(18.7, 8.2)
    },
    {
      id: '3',
      nome: 'Máximo Crescimento',
      tipo: 'agressiva',
      descricao: 'Foco em máximo crescimento com maior tolerância ao risco',
      alocacao: {
        rendaFixa: 20,
        acoes: 50,
        fundosImobiliarios: 15,
        internacional: 10,
        commodities: 5
      },
      retornoEsperado: 18.5,
      risco: 15.3,
      prazoRecomendado: 60,
      valorMinimo: 10000,
      status: 'ativa',
      performance: {
        retornoAcumulado: 28.9,
        volatilidade: 14.7,
        sharpeRatio: 1.8,
        maxDrawdown: 12.3
      },
      historico: gerarHistoricoPerformance(28.9, 14.7)
    }
  ];

  const [estrategias, setEstrategias] = useState<EstrategiaInvestimento[]>(estrategiasPredefinidas);

  const estrategiasFiltradas = estrategias.filter(e => 
    filtroTipo === 'todos' || e.tipo === filtroTipo
  );

  const cores = ['#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6'];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Estratégias de Investimento
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Gerencie e compare diferentes estratégias de alocação
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <select
            value={filtroTipo}
            onChange={(e) => setFiltroTipo(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-700"
          >
            <option value="todos">Todas</option>
            <option value="conservadora">Conservadora</option>
            <option value="moderada">Moderada</option>
            <option value="agressiva">Agressiva</option>
            <option value="personalizada">Personalizada</option>
          </select>
          <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
            <button
              onClick={() => setModoVisualizacao('lista')}
              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                modoVisualizacao === 'lista'
                  ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-400'
              }`}
            >
              Lista
            </button>
            <button
              onClick={() => setModoVisualizacao('comparacao')}
              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                modoVisualizacao === 'comparacao'
                  ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-400'
              }`}
            >
              Comparação
            </button>
            <button
              onClick={() => setModoVisualizacao('detalhes')}
              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                modoVisualizacao === 'detalhes'
                  ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-400'
              }`}
            >
              Detalhes
            </button>
          </div>
          <button
            onClick={() => setModalEstrategia(true)}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            Nova Estratégia
          </button>
        </div>
      </div>

      {/* Conteúdo baseado no modo de visualização */}
      {modoVisualizacao === 'lista' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {estrategiasFiltradas.map((estrategia) => (
            <EstrategiaCard
              key={estrategia.id}
              estrategia={estrategia}
              onSelecionar={() => setEstrategiaSelecionada(estrategia.id)}
              onSimular={() => onSimularEstrategia(estrategia)}
              onEditar={() => {
                setEstrategiaEditando(estrategia);
                setModalEstrategia(true);
              }}
              selecionada={estrategiaSelecionada === estrategia.id}
            />
          ))}
        </div>
      )}

      {modoVisualizacao === 'comparacao' && (
        <ComparacaoEstrategias estrategias={estrategiasFiltradas} />
      )}

      {modoVisualizacao === 'detalhes' && estrategiaSelecionada && (
        <DetalhesEstrategia
          estrategia={estrategias.find(e => e.id === estrategiaSelecionada)!}
          onSimular={onSimularEstrategia}
        />
      )}

      {/* Recomendações Inteligentes */}
      <RecomendacoesEstrategias
        estrategias={estrategias}
        resultados={resultados}
      />
    </motion.div>
  );
};

// Componente do Card de Estratégia
const EstrategiaCard: React.FC<{
  estrategia: EstrategiaInvestimento;
  onSelecionar: () => void;
  onSimular: () => void;
  onEditar: () => void;
  selecionada: boolean;
}> = ({ estrategia, onSelecionar, onSimular, onEditar, selecionada }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ativa': return 'text-green-600 bg-green-100';
      case 'pausada': return 'text-yellow-600 bg-yellow-100';
      case 'finalizada': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getTipoIcon = (tipo: string) => {
    switch (tipo) {
      case 'conservadora': return Shield;
      case 'moderada': return Target;
      case 'agressiva': return Zap;
      case 'personalizada': return Brain;
      default: return Target;
    }
  };

  const TipoIcon = getTipoIcon(estrategia.tipo);

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`bg-white dark:bg-gray-800 rounded-xl p-6 border-2 transition-all cursor-pointer ${
        selecionada
          ? 'border-blue-500 shadow-lg'
          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
      }`}
      onClick={onSelecionar}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center">
          <TipoIcon className="w-6 h-6 text-blue-600 mr-3" />
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white">
              {estrategia.nome}
            </h4>
            <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(estrategia.status)}`}>
              {estrategia.status}
            </span>
          </div>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onEditar();
          }}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <Edit className="w-4 h-4" />
        </button>
      </div>

      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
        {estrategia.descricao}
      </p>

      {/* Métricas principais */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-xs text-gray-500">Retorno Esperado</p>
          <p className="font-semibold text-green-600">
            {formatarPercentual(estrategia.retornoEsperado)}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Risco</p>
          <p className="font-semibold text-orange-600">
            {formatarPercentual(estrategia.risco)}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Sharpe Ratio</p>
          <p className="font-semibold text-blue-600">
            {estrategia.performance.sharpeRatio.toFixed(2)}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Prazo (meses)</p>
          <p className="font-semibold text-gray-700 dark:text-gray-300">
            {estrategia.prazoRecomendado}
          </p>
        </div>
      </div>

      {/* Alocação visual */}
      <div className="mb-4">
        <p className="text-xs text-gray-500 mb-2">Alocação</p>
        <div className="flex h-2 rounded-full overflow-hidden">
          <div
            className="bg-blue-500"
            style={{ width: `${estrategia.alocacao.rendaFixa}%` }}
            title={`Renda Fixa: ${estrategia.alocacao.rendaFixa}%`}
          />
          <div
            className="bg-green-500"
            style={{ width: `${estrategia.alocacao.acoes}%` }}
            title={`Ações: ${estrategia.alocacao.acoes}%`}
          />
          <div
            className="bg-yellow-500"
            style={{ width: `${estrategia.alocacao.fundosImobiliarios}%` }}
            title={`FIIs: ${estrategia.alocacao.fundosImobiliarios}%`}
          />
          <div
            className="bg-purple-500"
            style={{ width: `${estrategia.alocacao.internacional}%` }}
            title={`Internacional: ${estrategia.alocacao.internacional}%`}
          />
          <div
            className="bg-red-500"
            style={{ width: `${estrategia.alocacao.commodities}%` }}
            title={`Commodities: ${estrategia.alocacao.commodities}%`}
          />
        </div>
      </div>

      {/* Botão de simular */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onSimular();
        }}
        className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        <Play className="w-4 h-4 mr-2" />
        Simular Estratégia
      </button>
    </motion.div>
  );
};

// Componente de Comparação
const ComparacaoEstrategias: React.FC<{
  estrategias: EstrategiaInvestimento[];
}> = ({ estrategias }) => {
  const dadosComparacao = estrategias.map(e => ({
    nome: e.nome,
    retorno: e.retornoEsperado,
    risco: e.risco,
    sharpe: e.performance.sharpeRatio,
    drawdown: e.performance.maxDrawdown
  }));

  return (
    <div className="space-y-6">
      {/* Gráfico de Comparação */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Comparação de Performance
        </h4>
        <ResponsiveContainer width="100%" height={400}>
          <ComposedChart data={dadosComparacao}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="nome" />
            <YAxis yAxisId="left" />
            <YAxis yAxisId="right" orientation="right" />
            <Tooltip />
            <Legend />
            <Bar yAxisId="left" dataKey="retorno" fill="#3B82F6" name="Retorno %" />
            <Bar yAxisId="left" dataKey="risco" fill="#EF4444" name="Risco %" />
            <Line yAxisId="right" type="monotone" dataKey="sharpe" stroke="#10B981" name="Sharpe Ratio" />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Tabela de Comparação */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Comparação Detalhada
        </h4>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left p-3">Estratégia</th>
                <th className="text-center p-3">Retorno</th>
                <th className="text-center p-3">Risco</th>
                <th className="text-center p-3">Sharpe</th>
                <th className="text-center p-3">Max Drawdown</th>
                <th className="text-center p-3">Prazo</th>
              </tr>
            </thead>
            <tbody>
              {estrategias.map((estrategia, index) => (
                <tr key={estrategia.id} className="border-b border-gray-100 dark:border-gray-700">
                  <td className="p-3 font-medium">{estrategia.nome}</td>
                  <td className="text-center p-3 text-green-600">
                    {formatarPercentual(estrategia.retornoEsperado)}
                  </td>
                  <td className="text-center p-3 text-orange-600">
                    {formatarPercentual(estrategia.risco)}
                  </td>
                  <td className="text-center p-3 text-blue-600">
                    {estrategia.performance.sharpeRatio.toFixed(2)}
                  </td>
                  <td className="text-center p-3 text-red-600">
                    {formatarPercentual(estrategia.performance.maxDrawdown)}
                  </td>
                  <td className="text-center p-3">
                    {estrategia.prazoRecomendado}m
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// Componente de Detalhes
const DetalhesEstrategia: React.FC<{
  estrategia: EstrategiaInvestimento;
  onSimular: (estrategia: EstrategiaInvestimento) => void;
}> = ({ estrategia, onSimular }) => {
  const dadosAlocacao = [
    { nome: 'Renda Fixa', valor: estrategia.alocacao.rendaFixa, cor: '#3B82F6' },
    { nome: 'Ações', valor: estrategia.alocacao.acoes, cor: '#10B981' },
    { nome: 'FIIs', valor: estrategia.alocacao.fundosImobiliarios, cor: '#F59E0B' },
    { nome: 'Internacional', valor: estrategia.alocacao.internacional, cor: '#8B5CF6' },
    { nome: 'Commodities', valor: estrategia.alocacao.commodities, cor: '#EF4444' }
  ].filter(item => item.valor > 0);

  return (
    <div className="space-y-6">
      {/* Header da estratégia */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h4 className="text-xl font-bold text-gray-900 dark:text-white">
              {estrategia.nome}
            </h4>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              {estrategia.descricao}
            </p>
          </div>
          <button
            onClick={() => onSimular(estrategia)}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Play className="w-4 h-4 mr-2" />
            Simular
          </button>
        </div>

        {/* Métricas principais */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <MetricaDetalhada
            titulo="Retorno Esperado"
            valor={formatarPercentual(estrategia.retornoEsperado)}
            cor="text-green-600"
            icone={TrendingUp}
          />
          <MetricaDetalhada
            titulo="Risco"
            valor={formatarPercentual(estrategia.risco)}
            cor="text-orange-600"
            icone={AlertTriangle}
          />
          <MetricaDetalhada
            titulo="Sharpe Ratio"
            valor={estrategia.performance.sharpeRatio.toFixed(2)}
            cor="text-blue-600"
            icone={Target}
          />
          <MetricaDetalhada
            titulo="Prazo Recomendado"
            valor={`${estrategia.prazoRecomendado} meses`}
            cor="text-purple-600"
            icone={Clock}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico de Alocação */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <h5 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Alocação de Ativos
          </h5>
          <ResponsiveContainer width="100%" height={300}>
            <RechartsPieChart>
              <Pie
                data={dadosAlocacao}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ nome, valor }) => `${nome}: ${valor}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="valor"
              >
                {dadosAlocacao.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.cor} />
                ))}
              </Pie>
              <Tooltip />
            </RechartsPieChart>
          </ResponsiveContainer>
        </div>

        {/* Histórico de Performance */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <h5 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Histórico de Performance
          </h5>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={estrategia.historico}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="data" />
              <YAxis />
              <Tooltip
                formatter={(value, name) => [
                  name === 'valor' ? formatarMoeda(value as number) : formatarPercentual(value as number),
                  name === 'valor' ? 'Valor' : 'Retorno'
                ]}
              />
              <Line type="monotone" dataKey="valor" stroke="#3B82F6" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

// Componente de Recomendações
const RecomendacoesEstrategias: React.FC<{
  estrategias: EstrategiaInvestimento[];
  resultados: any[];
}> = ({ estrategias, resultados }) => {
  const recomendacoes = gerarRecomendacoesEstrategias(estrategias, resultados);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
      <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Recomendações Inteligentes
      </h4>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {recomendacoes.map((rec, index) => (
          <RecomendacaoCard key={index} recomendacao={rec} />
        ))}
      </div>
    </div>
  );
};

// Componentes auxiliares
const MetricaDetalhada: React.FC<{
  titulo: string;
  valor: string;
  cor: string;
  icone: React.ComponentType<any>;
}> = ({ titulo, valor, cor, icone: Icone }) => (
  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
    <div className="flex items-center mb-2">
      <Icone className={`w-5 h-5 ${cor} mr-2`} />
      <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
        {titulo}
      </span>
    </div>
    <p className={`text-xl font-bold ${cor}`}>
      {valor}
    </p>
  </div>
);

const RecomendacaoCard: React.FC<{
  recomendacao: {
    tipo: string;
    titulo: string;
    descricao: string;
    prioridade: 'alta' | 'media' | 'baixa';
    estrategiaId?: string;
  };
}> = ({ recomendacao }) => (
  <div className={`border-l-4 rounded-lg p-4 ${
    recomendacao.prioridade === 'alta' ? 'border-red-500 bg-red-50 dark:bg-red-900/20' :
    recomendacao.prioridade === 'media' ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20' :
    'border-green-500 bg-green-50 dark:bg-green-900/20'
  }`}>
    <div className="flex items-start">
      {recomendacao.tipo === 'otimizacao' && <Target className="w-5 h-5 mr-2 mt-0.5 text-blue-600" />}
      {recomendacao.tipo === 'rebalanceamento' && <RotateCcw className="w-5 h-5 mr-2 mt-0.5 text-orange-600" />}
      {recomendacao.tipo === 'oportunidade' && <Star className="w-5 h-5 mr-2 mt-0.5 text-green-600" />}
      <div>
        <p className="font-medium text-sm text-gray-900 dark:text-white">
          {recomendacao.titulo}
        </p>
        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
          {recomendacao.descricao}
        </p>
      </div>
    </div>
  </div>
);

// Funções auxiliares
function gerarHistoricoPerformance(retornoTotal: number, volatilidade: number) {
  const meses = 12;
  const historico = [];
  let valorAtual = 10000;
  
  for (let i = 0; i < meses; i++) {
    const retornoMensal = (retornoTotal / 12) + (Math.random() - 0.5) * volatilidade;
    valorAtual *= (1 + retornoMensal / 100);
    
    historico.push({
      data: new Date(2024, i, 1).toLocaleDateString('pt-BR', { month: 'short' }),
      valor: valorAtual,
      retorno: retornoMensal
    });
  }
  
  return historico;
}

function gerarRecomendacoesEstrategias(estrategias: EstrategiaInvestimento[], resultados: any[]) {
  const recomendacoes = [];

  // Análise de performance
  const melhorEstrategia = estrategias.reduce((prev, current) => 
    prev.performance.sharpeRatio > current.performance.sharpeRatio ? prev : current
  );

  recomendacoes.push({
    tipo: 'oportunidade',
    titulo: 'Estratégia Recomendada',
    descricao: `${melhorEstrategia.nome} apresenta o melhor índice Sharpe (${melhorEstrategia.performance.sharpeRatio.toFixed(2)})`,
    prioridade: 'alta' as const,
    estrategiaId: melhorEstrategia.id
  });

  // Análise de diversificação
  const estrategiaConcentrada = estrategias.find(e => 
    Math.max(...Object.values(e.alocacao)) > 60
  );

  if (estrategiaConcentrada) {
    recomendacoes.push({
      tipo: 'rebalanceamento',
      titulo: 'Diversificação Necessária',
      descricao: `${estrategiaConcentrada.nome} tem alta concentração em um ativo. Considere diversificar.`,
      prioridade: 'media' as const,
      estrategiaId: estrategiaConcentrada.id
    });
  }

  // Análise de risco
  const estrategiaAltaVolatilidade = estrategias.find(e => 
    e.performance.volatilidade > 15
  );

  if (estrategiaAltaVolatilidade) {
    recomendacoes.push({
      tipo: 'otimizacao',
      titulo: 'Reduzir Volatilidade',
      descricao: `${estrategiaAltaVolatilidade.nome} apresenta alta volatilidade. Considere ajustar a alocação.`,
      prioridade: 'media' as const,
      estrategiaId: estrategiaAltaVolatilidade.id
    });
  }

  return recomendacoes;
}

export default AbaEstrategias;