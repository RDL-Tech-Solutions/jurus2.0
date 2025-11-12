import { useState, useMemo } from 'react';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ComposedChart } from 'recharts';
import { TrendingUp, BarChart3, Activity, Eye, EyeOff } from 'lucide-react';
import { useSimulacao } from '../store/useAppStore';
import { formatarMoeda, formatarPercentual } from '../utils/calculos';
import { cn } from '../utils/cn';

type VisualizacaoType = 'area' | 'linha' | 'barras' | 'composto';
type PeriodoType = 'mensal' | 'anual' | 'trimestral';
type MetricaType = 'investido' | 'juros' | 'total' | 'rentabilidade';

const METRICAS_CONFIG = {
  investido: { cor: '#3b82f6', nome: 'Valor Investido', ativo: true },
  juros: { cor: '#f59e0b', nome: 'Juros Gerados', ativo: true },
  total: { cor: '#10b981', nome: 'Patrimônio Total', ativo: true },
  rentabilidade: { cor: '#8b5cf6', nome: 'Rentabilidade (%)', ativo: false }
};

export function GraficoEvolucao() {
  const { resultado, simulacao } = useSimulacao();
  const [visualizacao, setVisualizacao] = useState<VisualizacaoType>('area');
  const [periodo, setPeriodo] = useState<PeriodoType>('mensal');
  const [metricasVisiveis, setMetricasVisiveis] = useState<Record<MetricaType, boolean>>({
    investido: true,
    juros: true,
    total: true,
    rentabilidade: false
  });

  if (!resultado || !simulacao) {
    return (
      <div className="card-mobile text-center py-12">
        <TrendingUp className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
        <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-400 mb-2">
          Gráfico de Evolução
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-500">
          Realize uma simulação para visualizar a evolução do investimento
        </p>
      </div>
    );
  }

  // Filtrar dados por período
  const dadosFiltrados = useMemo(() => {
    let dadosBase = resultado.evolucaoMensal;

    switch (periodo) {
      case 'anual':
        dadosBase = dadosBase.filter((_, index) => index % 12 === 11 || index === dadosBase.length - 1);
        break;
      case 'trimestral':
        dadosBase = dadosBase.filter((_, index) => index % 3 === 2 || index === dadosBase.length - 1);
        break;
      default:
        // mensal - mantém todos
        break;
    }

    return dadosBase.map((item, index) => {
      const periodoLabel = periodo === 'anual'
        ? `Ano ${Math.ceil(item.mes / 12)}`
        : periodo === 'trimestral'
        ? `Trim ${Math.ceil(item.mes / 3)}`
        : `Mês ${item.mes}`;

      // Calcular rentabilidade acumulada
      const rentabilidadeAcumulada = item.saldoAcumulado > 0
        ? ((item.saldoAcumulado - item.contribuicao) / item.contribuicao) * 100
        : 0;

      return {
        periodo: periodoLabel,
        mes: item.mes,
        index,
        investido: item.contribuicao,
        juros: item.juros,
        total: item.saldoAcumulado,
        rentabilidade: rentabilidadeAcumulada,
        saldoReal: item.saldoReal,
        perdaInflacao: item.perdaInflacao,
        ganhoRealMensal: item.ganhoRealMensal
      };
    });
  }, [resultado.evolucaoMensal, periodo]);

  // Estatísticas do período
  const estatisticas = useMemo(() => {
    if (dadosFiltrados.length === 0) return null;

    const primeiro = dadosFiltrados[0];
    const ultimo = dadosFiltrados[dadosFiltrados.length - 1];

    const crescimentoTotal = ((ultimo.total - primeiro.investido) / primeiro.investido) * 100;
    const crescimentoAnual = periodo === 'anual' ? crescimentoTotal / (ultimo.mes / 12) : crescimentoTotal / (ultimo.mes / 12);

    return {
      crescimentoTotal: crescimentoTotal.toFixed(2),
      crescimentoAnual: crescimentoAnual.toFixed(2),
      valorFinal: ultimo.total,
      jurosTotais: ultimo.juros,
      periodoTotal: ultimo.mes
    };
  }, [dadosFiltrados, periodo]);

  const toggleMetrica = (metrica: MetricaType) => {
    setMetricasVisiveis(prev => ({
      ...prev,
      [metrica]: !prev[metrica]
    }));
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0]?.payload;
      return (
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 max-w-sm">
          <p className="font-bold text-gray-900 dark:text-white mb-3 text-center">{label}</p>

          <div className="space-y-2">
            {payload.map((entry: any, index: number) => {
              if (!metricasVisiveis[entry.dataKey as MetricaType]) return null;

              const config = METRICAS_CONFIG[entry.dataKey as MetricaType];
              const valor = entry.value;
              const formatado = entry.dataKey === 'rentabilidade'
                ? formatarPercentual(valor)
                : formatarMoeda(valor);

              return (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: entry.color }}
                    />
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {config.nome}:
                    </span>
                  </div>
                  <span className="text-sm font-semibold" style={{ color: entry.color }}>
                    {formatado}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Informações adicionais */}
          {data && (
            <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
              <div className="grid grid-cols-2 gap-2 text-xs text-gray-500 dark:text-gray-400">
                <span>Mês: {data.mes}</span>
                <span>Período: {data.periodo}</span>
                {data.saldoReal && (
                  <>
                    <span>Saldo Real: {formatarMoeda(data.saldoReal)}</span>
                    <span>Perda Inflação: {formatarMoeda(data.perdaInflacao || 0)}</span>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  const renderizarGrafico = () => {
    const propsComuns = {
      data: dadosFiltrados,
      margin: { top: 20, right: 30, left: 20, bottom: 60 }
    };

    switch (visualizacao) {
      case 'area':
        return (
          <AreaChart {...propsComuns}>
            <defs>
              <linearGradient id="colorInvestido" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorJuros" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.2} />
            <XAxis
              dataKey="periodo"
              stroke="#9ca3af"
              style={{ fontSize: '12px' }}
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis
              stroke="#9ca3af"
              style={{ fontSize: '12px' }}
              tickFormatter={(value) => `R$ ${(value / 1000).toFixed(0)}k`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            {metricasVisiveis.investido && (
              <Area
                type="monotone"
                dataKey="investido"
                stroke="#3b82f6"
                fill="url(#colorInvestido)"
                name="Valor Investido"
                strokeWidth={2}
              />
            )}
            {metricasVisiveis.juros && (
              <Area
                type="monotone"
                dataKey="juros"
                stroke="#f59e0b"
                fill="url(#colorJuros)"
                name="Juros Gerados"
                strokeWidth={2}
              />
            )}
            {metricasVisiveis.total && (
              <Area
                type="monotone"
                dataKey="total"
                stroke="#10b981"
                fill="url(#colorTotal)"
                name="Patrimônio Total"
                strokeWidth={2}
              />
            )}
          </AreaChart>
        );

      case 'linha':
        return (
          <LineChart {...propsComuns}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.2} />
            <XAxis
              dataKey="periodo"
              stroke="#9ca3af"
              style={{ fontSize: '12px' }}
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis
              stroke="#9ca3af"
              style={{ fontSize: '12px' }}
              tickFormatter={(value) => `R$ ${(value / 1000).toFixed(0)}k`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            {metricasVisiveis.investido && (
              <Line
                type="monotone"
                dataKey="investido"
                stroke="#3b82f6"
                strokeWidth={3}
                name="Valor Investido"
                dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: '#3b82f6', strokeWidth: 2 }}
              />
            )}
            {metricasVisiveis.juros && (
              <Line
                type="monotone"
                dataKey="juros"
                stroke="#f59e0b"
                strokeWidth={3}
                name="Juros Gerados"
                dot={{ fill: '#f59e0b', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: '#f59e0b', strokeWidth: 2 }}
              />
            )}
            {metricasVisiveis.total && (
              <Line
                type="monotone"
                dataKey="total"
                stroke="#10b981"
                strokeWidth={3}
                name="Patrimônio Total"
                dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: '#10b981', strokeWidth: 2 }}
              />
            )}
          </LineChart>
        );

      case 'barras':
        return (
          <BarChart {...propsComuns}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.2} />
            <XAxis
              dataKey="periodo"
              stroke="#9ca3af"
              style={{ fontSize: '12px' }}
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis
              stroke="#9ca3af"
              style={{ fontSize: '12px' }}
              tickFormatter={(value) => `R$ ${(value / 1000).toFixed(0)}k`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            {metricasVisiveis.investido && (
              <Bar dataKey="investido" fill="#3b82f6" name="Valor Investido" />
            )}
            {metricasVisiveis.juros && (
              <Bar dataKey="juros" fill="#f59e0b" name="Juros Gerados" />
            )}
            {metricasVisiveis.total && (
              <Bar dataKey="total" fill="#10b981" name="Patrimônio Total" />
            )}
          </BarChart>
        );

      case 'composto':
        return (
          <ComposedChart {...propsComuns}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.2} />
            <XAxis
              dataKey="periodo"
              stroke="#9ca3af"
              style={{ fontSize: '12px' }}
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis
              yAxisId="valor"
              orientation="left"
              stroke="#9ca3af"
              style={{ fontSize: '12px' }}
              tickFormatter={(value) => `R$ ${(value / 1000).toFixed(0)}k`}
            />
            <YAxis
              yAxisId="percentual"
              orientation="right"
              stroke="#8b5cf6"
              style={{ fontSize: '12px' }}
              tickFormatter={(value) => `${value.toFixed(1)}%`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            {metricasVisiveis.investido && (
              <Bar yAxisId="valor" dataKey="investido" fill="#3b82f6" name="Valor Investido" />
            )}
            {metricasVisiveis.total && (
              <Line
                yAxisId="valor"
                type="monotone"
                dataKey="total"
                stroke="#10b981"
                strokeWidth={3}
                name="Patrimônio Total"
                dot={false}
              />
            )}
            {metricasVisiveis.rentabilidade && (
              <Line
                yAxisId="percentual"
                type="monotone"
                dataKey="rentabilidade"
                stroke="#8b5cf6"
                strokeWidth={2}
                name="Rentabilidade (%)"
                dot={false}
                strokeDasharray="5 5"
              />
            )}
          </ComposedChart>
        );

      default:
        return null;
    }
  };

  return (
    <div className="card-mobile space-y-4">
      {/* Header com Estatísticas */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center space-x-2">
          <TrendingUp className="w-5 h-5 text-primary-600 dark:text-primary-400" />
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Evolução do Investimento
            </h3>
            {estatisticas && (
              <div className="flex items-center space-x-4 mt-1 text-sm text-gray-600 dark:text-gray-400">
                <span>Crescimento Total: <strong className="text-green-600">{estatisticas.crescimentoTotal}%</strong></span>
                <span>Crescimento Anual: <strong className="text-blue-600">{estatisticas.crescimentoAnual}%</strong></span>
                <span>Valor Final: <strong className="text-purple-600">{formatarMoeda(estatisticas.valorFinal)}</strong></span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Controles de Métricas */}
      <div className="flex flex-wrap gap-2">
        {Object.entries(METRICAS_CONFIG).map(([key, config]) => (
          <button
            key={key}
            onClick={() => toggleMetrica(key as MetricaType)}
            className={cn(
              'flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all',
              metricasVisiveis[key as MetricaType]
                ? 'bg-opacity-20 text-gray-900 dark:text-white shadow-sm'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
            )}
            style={{
              backgroundColor: metricasVisiveis[key as MetricaType] ? `${config.cor}20` : undefined,
              border: metricasVisiveis[key as MetricaType] ? `2px solid ${config.cor}` : undefined
            }}
          >
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: config.cor }}
            />
            <span>{config.nome}</span>
            {metricasVisiveis[key as MetricaType] ? (
              <Eye className="w-4 h-4" />
            ) : (
              <EyeOff className="w-4 h-4" />
            )}
          </button>
        ))}
      </div>

      {/* Controles de Visualização e Período */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        {/* Tipo de Visualização */}
        <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
          {[
            { key: 'area', label: 'Área', icon: TrendingUp },
            { key: 'linha', label: 'Linha', icon: Activity },
            { key: 'barras', label: 'Barras', icon: BarChart3 },
            { key: 'composto', label: 'Composto', icon: TrendingUp }
          ].map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setVisualizacao(key as VisualizacaoType)}
              className={cn(
                'flex items-center space-x-2 px-3 py-2 rounded text-sm font-medium transition-colors',
                visualizacao === key
                  ? 'bg-white dark:bg-gray-700 text-primary-600 dark:text-primary-400 shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              )}
            >
              <Icon className="w-4 h-4" />
              <span className="hidden sm:inline">{label}</span>
            </button>
          ))}
        </div>

        {/* Período */}
        <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
          {[
            { key: 'mensal', label: 'Mensal' },
            { key: 'trimestral', label: 'Trimestral' },
            { key: 'anual', label: 'Anual' }
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setPeriodo(key as PeriodoType)}
              className={cn(
                'px-3 py-2 rounded text-sm font-medium transition-colors',
                periodo === key
                  ? 'bg-white dark:bg-gray-700 text-primary-600 dark:text-primary-400 shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Gráfico */}
      <div className="w-full h-[400px] sm:h-[500px]">
        <ResponsiveContainer width="100%" height="100%">
          {renderizarGrafico()}
        </ResponsiveContainer>
      </div>

      {/* Informações adicionais */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <p className="text-blue-800 dark:text-blue-200 font-medium">Valor Inicial</p>
          <p className="text-lg font-bold text-blue-900 dark:text-blue-100">
            {formatarMoeda(simulacao.valorInicial)}
          </p>
        </div>
        <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
          <p className="text-green-800 dark:text-green-200 font-medium">Aporte Mensal</p>
          <p className="text-lg font-bold text-green-900 dark:text-green-100">
            {formatarMoeda(simulacao.valorMensal)}
          </p>
        </div>
        <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
          <p className="text-purple-800 dark:text-purple-200 font-medium">Taxa Efetiva</p>
          <p className="text-lg font-bold text-purple-900 dark:text-purple-100">
            {resultado.taxaEfetivaMensal?.toFixed(2)}% a.m.
          </p>
        </div>
      </div>
    </div>
  );
}
