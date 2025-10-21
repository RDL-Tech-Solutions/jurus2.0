import React from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  TrendingDown,
  Activity,
  Target,
  Brain,
  BarChart3,
  PieChart,
  LineChart,
  Zap,
  Shield,
  AlertTriangle,
  CheckCircle,
  Info,
  Percent,
  DollarSign,
  GitCompare
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart as RechartsLineChart,
  Line,
  BarChart as RechartsBarChart,
  Bar,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend
} from 'recharts';
import { formatarMoeda, formatarPercentual } from '../utils/formatters';

interface AbaAnaliseProps {
  resultados: any[];
  cenarios: any[];
  analiseAvancada: any;
  modoAnalise: 'basico' | 'avancado' | 'profissional';
}

const AbaAnalise: React.FC<AbaAnaliseProps> = ({
  resultados,
  cenarios,
  analiseAvancada,
  modoAnalise
}) => {
  // Dados para gráficos
  const dadosDistribuicao = resultados.map(r => ({
    nome: cenarios.find(c => c.id === r.cenarioId)?.nome || 'N/A',
    retorno: r.rendimentoReal,
    risco: r.risco || 0,
    valor: r.valorFinal
  }));

  const dadosCorrelacao = [
    { metrica: 'Retorno', A: 1, B: 0.7, C: 0.5, D: 0.3 },
    { metrica: 'Risco', A: 0.7, B: 1, C: 0.8, D: 0.6 },
    { metrica: 'Volatilidade', A: 0.5, B: 0.8, C: 1, D: 0.4 },
    { metrica: 'Sharpe', A: 0.3, B: 0.6, C: 0.4, D: 1 }
  ];

  const dadosRadar = analiseAvancada ? [
    {
      metrica: 'Retorno',
      valor: Math.min(analiseAvancada.retornoMedio * 10, 100),
      maximo: 100
    },
    {
      metrica: 'Estabilidade',
      valor: Math.max(100 - analiseAvancada.volatilidade, 0),
      maximo: 100
    },
    {
      metrica: 'Eficiência',
      valor: Math.min(analiseAvancada.sharpeRatio * 20, 100),
      maximo: 100
    },
    {
      metrica: 'Consistência',
      valor: analiseAvancada.probabilidadePositiva,
      maximo: 100
    },
    {
      metrica: 'Proteção',
      valor: Math.max(100 - (analiseAvancada.maxDrawdown || 0), 0),
      maximo: 100
    }
  ] : [];

  const cores = ['#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899'];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Análise Avançada de Performance
        </h3>
        <div className="flex items-center space-x-2">
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
            modoAnalise === 'basico' ? 'bg-blue-100 text-blue-800' :
            modoAnalise === 'avancado' ? 'bg-green-100 text-green-800' :
            'bg-purple-100 text-purple-800'
          }`}>
            Modo {modoAnalise.charAt(0).toUpperCase() + modoAnalise.slice(1)}
          </span>
        </div>
      </div>

      {!analiseAvancada ? (
        <div className="text-center py-12">
          <Brain className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">
            Execute uma simulação para ver a análise avançada
          </p>
        </div>
      ) : (
        <>
          {/* Métricas Principais */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <MetricaCard
              titulo="Retorno Médio"
              valor={formatarPercentual(analiseAvancada.retornoMedio)}
              icone={TrendingUp}
              cor="text-green-600"
              descricao="Retorno médio dos cenários"
            />
            <MetricaCard
              titulo="Volatilidade"
              valor={formatarPercentual(analiseAvancada.volatilidade)}
              icone={Activity}
              cor="text-orange-600"
              descricao="Medida de risco e variabilidade"
            />
            <MetricaCard
              titulo="Índice Sharpe"
              valor={analiseAvancada.sharpeRatio.toFixed(2)}
              icone={Target}
              cor="text-blue-600"
              descricao="Relação risco-retorno"
            />
            <MetricaCard
              titulo="Prob. Positiva"
              valor={formatarPercentual(analiseAvancada.probabilidadePositiva)}
              icone={CheckCircle}
              cor="text-purple-600"
              descricao="Probabilidade de retorno positivo"
            />
          </div>

          {/* Gráficos de Análise */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Distribuição de Retornos */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Distribuição de Retornos
              </h4>
              <ResponsiveContainer width="100%" height={300}>
                <RechartsBarChart data={dadosDistribuicao}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="nome" />
                  <YAxis />
                  <Tooltip
                    formatter={(value, name) => [
                      name === 'retorno' ? formatarPercentual(value as number) : formatarMoeda(value as number),
                      name === 'retorno' ? 'Retorno' : 'Valor Final'
                    ]}
                  />
                  <Bar dataKey="retorno" fill="#3B82F6" />
                </RechartsBarChart>
              </ResponsiveContainer>
            </div>

            {/* Análise de Risco-Retorno */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Risco vs Retorno
              </h4>
              <ResponsiveContainer width="100%" height={300}>
                <RechartsLineChart data={dadosDistribuicao}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="risco" />
                  <YAxis />
                  <Tooltip
                    formatter={(value, name) => [
                      formatarPercentual(value as number),
                      name === 'retorno' ? 'Retorno' : 'Risco'
                    ]}
                  />
                  <Line type="monotone" dataKey="retorno" stroke="#10B981" strokeWidth={2} />
                </RechartsLineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {modoAnalise !== 'basico' && (
            <>
              {/* Análise Radar */}
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Análise Multidimensional
                </h4>
                <ResponsiveContainer width="100%" height={400}>
                  <RadarChart data={dadosRadar}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="metrica" />
                    <PolarRadiusAxis angle={90} domain={[0, 100]} />
                    <Radar
                      name="Performance"
                      dataKey="valor"
                      stroke="#3B82F6"
                      fill="#3B82F6"
                      fillOpacity={0.3}
                    />
                    <Legend />
                  </RadarChart>
                </ResponsiveContainer>
              </div>

              {/* Análise Detalhada */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Estatísticas Avançadas */}
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Estatísticas Avançadas
                  </h4>
                  <div className="space-y-4">
                    <EstatisticaDetalhada
                      label="Melhor Cenário"
                      valor={formatarPercentual(analiseAvancada.melhorCenario)}
                      cor="text-green-600"
                    />
                    <EstatisticaDetalhada
                      label="Pior Cenário"
                      valor={formatarPercentual(analiseAvancada.piorCenario)}
                      cor="text-red-600"
                    />
                    <EstatisticaDetalhada
                      label="Amplitude"
                      valor={formatarPercentual(analiseAvancada.melhorCenario - analiseAvancada.piorCenario)}
                      cor="text-gray-600"
                    />
                    <EstatisticaDetalhada
                      label="Max Drawdown"
                      valor={formatarPercentual(analiseAvancada.maxDrawdown)}
                      cor="text-orange-600"
                    />
                  </div>
                </div>

                {/* Recomendações */}
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Recomendações Inteligentes
                  </h4>
                  <div className="space-y-3">
                    {gerarRecomendacoes(analiseAvancada).map((rec, index) => (
                      <RecomendacaoCard key={index} recomendacao={rec} />
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}

          {modoAnalise === 'profissional' && (
            <>
              {/* Análise de Correlação */}
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Matriz de Correlação
                </h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr>
                        <th className="text-left p-2">Métrica</th>
                        <th className="text-center p-2">A</th>
                        <th className="text-center p-2">B</th>
                        <th className="text-center p-2">C</th>
                        <th className="text-center p-2">D</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dadosCorrelacao.map((linha, index) => (
                        <tr key={index} className="border-t border-gray-200 dark:border-gray-700">
                          <td className="p-2 font-medium">{linha.metrica}</td>
                          <td className="text-center p-2">
                            <span className={`px-2 py-1 rounded text-xs ${getCorrelationColor(linha.A)}`}>
                              {linha.A.toFixed(2)}
                            </span>
                          </td>
                          <td className="text-center p-2">
                            <span className={`px-2 py-1 rounded text-xs ${getCorrelationColor(linha.B)}`}>
                              {linha.B.toFixed(2)}
                            </span>
                          </td>
                          <td className="text-center p-2">
                            <span className={`px-2 py-1 rounded text-xs ${getCorrelationColor(linha.C)}`}>
                              {linha.C.toFixed(2)}
                            </span>
                          </td>
                          <td className="text-center p-2">
                            <span className={`px-2 py-1 rounded text-xs ${getCorrelationColor(linha.D)}`}>
                              {linha.D.toFixed(2)}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Análise de Sensibilidade */}
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Análise de Sensibilidade
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <SensibilidadeCard
                    parametro="Taxa de Juros"
                    impacto="Alto"
                    variacao="+/- 2%"
                    efeito="-15% / +12%"
                    cor="text-red-600"
                  />
                  <SensibilidadeCard
                    parametro="Inflação"
                    impacto="Médio"
                    variacao="+/- 1%"
                    efeito="-8% / +6%"
                    cor="text-yellow-600"
                  />
                  <SensibilidadeCard
                    parametro="PIB"
                    impacto="Baixo"
                    variacao="+/- 0.5%"
                    efeito="-3% / +4%"
                    cor="text-green-600"
                  />
                </div>
              </div>
            </>
          )}
        </>
      )}
    </motion.div>
  );
};

// Componentes auxiliares
const MetricaCard: React.FC<{
  titulo: string;
  valor: string;
  icone: React.ComponentType<any>;
  cor: string;
  descricao: string;
}> = ({ titulo, valor, icone: Icone, cor, descricao }) => (
  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
    <div className="flex items-center justify-between mb-2">
      <Icone className={`w-5 h-5 ${cor}`} />
      <Info className="w-4 h-4 text-gray-400" />
    </div>
    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
      {titulo}
    </p>
    <p className={`text-xl font-bold ${cor}`}>
      {valor}
    </p>
  </div>
);

const EstatisticaDetalhada: React.FC<{
  label: string;
  valor: string;
  cor: string;
}> = ({ label, valor, cor }) => (
  <div className="flex items-center justify-between">
    <span className="text-sm text-gray-600 dark:text-gray-400">{label}</span>
    <span className={`font-semibold ${cor}`}>{valor}</span>
  </div>
);

const RecomendacaoCard: React.FC<{
  recomendacao: {
    tipo: string;
    titulo: string;
    descricao: string;
    prioridade: 'alta' | 'media' | 'baixa';
  };
}> = ({ recomendacao }) => (
  <div className={`border-l-4 rounded-lg p-3 ${
    recomendacao.prioridade === 'alta' ? 'border-red-500 bg-red-50 dark:bg-red-900/20' :
    recomendacao.prioridade === 'media' ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20' :
    'border-green-500 bg-green-50 dark:bg-green-900/20'
  }`}>
    <div className="flex items-start">
      {recomendacao.tipo === 'risco' && <AlertTriangle className="w-4 h-4 mr-2 mt-0.5 text-red-600" />}
      {recomendacao.tipo === 'oportunidade' && <TrendingUp className="w-4 h-4 mr-2 mt-0.5 text-green-600" />}
      {recomendacao.tipo === 'otimizacao' && <Target className="w-4 h-4 mr-2 mt-0.5 text-blue-600" />}
      <div>
        <p className="font-medium text-sm text-gray-900 dark:text-white">
          {recomendacao.titulo}
        </p>
        <p className="text-xs text-gray-600 dark:text-gray-400">
          {recomendacao.descricao}
        </p>
      </div>
    </div>
  </div>
);

const SensibilidadeCard: React.FC<{
  parametro: string;
  impacto: string;
  variacao: string;
  efeito: string;
  cor: string;
}> = ({ parametro, impacto, variacao, efeito, cor }) => (
  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
    <h5 className="font-medium text-gray-900 dark:text-white mb-2">{parametro}</h5>
    <div className="space-y-1 text-sm">
      <div className="flex justify-between">
        <span className="text-gray-600 dark:text-gray-400">Impacto:</span>
        <span className={`font-medium ${cor}`}>{impacto}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-gray-600 dark:text-gray-400">Variação:</span>
        <span>{variacao}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-gray-600 dark:text-gray-400">Efeito:</span>
        <span className="font-medium">{efeito}</span>
      </div>
    </div>
  </div>
);

// Funções auxiliares
const gerarRecomendacoes = (analise: any) => {
  const recomendacoes = [];

  if (analise.volatilidade > 20) {
    recomendacoes.push({
      tipo: 'risco',
      titulo: 'Reduzir Exposição ao Risco',
      descricao: 'Alta volatilidade detectada. Considere diversificar mais a carteira.',
      prioridade: 'alta' as const
    });
  }

  if (analise.sharpeRatio < 0.5) {
    recomendacoes.push({
      tipo: 'otimizacao',
      titulo: 'Melhorar Eficiência',
      descricao: 'Baixo índice Sharpe. Revise a estratégia de alocação de ativos.',
      prioridade: 'media' as const
    });
  }

  if (analise.probabilidadePositiva > 80) {
    recomendacoes.push({
      tipo: 'oportunidade',
      titulo: 'Cenário Favorável',
      descricao: 'Alta probabilidade de sucesso. Considere aumentar a exposição.',
      prioridade: 'baixa' as const
    });
  }

  return recomendacoes;
};

const getCorrelationColor = (valor: number) => {
  if (valor >= 0.8) return 'bg-red-100 text-red-800';
  if (valor >= 0.5) return 'bg-yellow-100 text-yellow-800';
  if (valor >= 0.2) return 'bg-blue-100 text-blue-800';
  return 'bg-gray-100 text-gray-800';
};

export default AbaAnalise;