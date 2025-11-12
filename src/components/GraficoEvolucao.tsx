import { useState } from 'react';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp } from 'lucide-react';
import { useSimulacao } from '../store/useAppStore';
import { formatarMoeda } from '../utils/calculos';
import { cn } from '../utils/cn';

type VisualizacaoType = 'linha' | 'area';
type PeriodoType = 'mensal' | 'anual';

export function GraficoEvolucao() {
  const { resultado } = useSimulacao();
  const [visualizacao, setVisualizacao] = useState<VisualizacaoType>('area');
  const [periodo, setPeriodo] = useState<PeriodoType>('mensal');

  if (!resultado) return null;

  const dados = periodo === 'anual'
    ? resultado.evolucaoMensal.filter((_, index) => index % 12 === 11 || index === resultado.evolucaoMensal.length - 1)
    : resultado.evolucaoMensal;

  const dadosGrafico = dados.map((item) => ({
    periodo: periodo === 'anual' ? `Ano ${Math.ceil(item.mes / 12)}` : `Mês ${item.mes}`,
    investido: item.contribuicao,
    juros: item.juros,
    total: item.saldoAcumulado
  }));

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
          <p className="font-semibold text-gray-900 dark:text-white mb-2">{payload[0].payload.periodo}</p>
          <div className="space-y-1">
            <p className="text-sm text-blue-600 dark:text-blue-400">
              Investido: {formatarMoeda(payload[0].payload.investido)}
            </p>
            <p className="text-sm text-amber-600 dark:text-amber-400">
              Juros: {formatarMoeda(payload[0].payload.juros)}
            </p>
            <p className="text-sm font-bold text-green-600 dark:text-green-400">
              Total: {formatarMoeda(payload[0].payload.total)}
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="card-mobile space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center space-x-2">
          <TrendingUp className="w-5 h-5 text-primary-600 dark:text-primary-400" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Evolução do Investimento
          </h3>
        </div>

        {/* Controles */}
        <div className="flex items-center space-x-2">
          {/* Tipo de Visualização */}
          <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
            <button
              onClick={() => setVisualizacao('area')}
              className={cn(
                'px-3 py-1.5 rounded text-sm font-medium transition-colors',
                visualizacao === 'area'
                  ? 'bg-white dark:bg-gray-700 text-primary-600 dark:text-primary-400 shadow-sm'
                  : 'text-gray-600 dark:text-gray-400'
              )}
            >
              Área
            </button>
            <button
              onClick={() => setVisualizacao('linha')}
              className={cn(
                'px-3 py-1.5 rounded text-sm font-medium transition-colors',
                visualizacao === 'linha'
                  ? 'bg-white dark:bg-gray-700 text-primary-600 dark:text-primary-400 shadow-sm'
                  : 'text-gray-600 dark:text-gray-400'
              )}
            >
              Linha
            </button>
          </div>

          {/* Período */}
          <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
            <button
              onClick={() => setPeriodo('mensal')}
              className={cn(
                'px-3 py-1.5 rounded text-sm font-medium transition-colors',
                periodo === 'mensal'
                  ? 'bg-white dark:bg-gray-700 text-primary-600 dark:text-primary-400 shadow-sm'
                  : 'text-gray-600 dark:text-gray-400'
              )}
            >
              Mensal
            </button>
            <button
              onClick={() => setPeriodo('anual')}
              className={cn(
                'px-3 py-1.5 rounded text-sm font-medium transition-colors',
                periodo === 'anual'
                  ? 'bg-white dark:bg-gray-700 text-primary-600 dark:text-primary-400 shadow-sm'
                  : 'text-gray-600 dark:text-gray-400'
              )}
            >
              Anual
            </button>
          </div>
        </div>
      </div>

      {/* Gráfico */}
      <div className="w-full h-[300px] sm:h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          {visualizacao === 'area' ? (
            <AreaChart data={dadosGrafico} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
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
                height={60}
              />
              <YAxis 
                stroke="#9ca3af"
                style={{ fontSize: '12px' }}
                tickFormatter={(value) => `R$ ${(value / 1000).toFixed(0)}k`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Area
                type="monotone"
                dataKey="investido"
                stroke="#3b82f6"
                fill="url(#colorInvestido)"
                name="Investido"
              />
              <Area
                type="monotone"
                dataKey="juros"
                stroke="#f59e0b"
                fill="url(#colorJuros)"
                name="Juros"
              />
              <Area
                type="monotone"
                dataKey="total"
                stroke="#10b981"
                fill="url(#colorTotal)"
                name="Total"
              />
            </AreaChart>
          ) : (
            <LineChart data={dadosGrafico} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.2} />
              <XAxis 
                dataKey="periodo" 
                stroke="#9ca3af"
                style={{ fontSize: '12px' }}
                angle={-45}
                textAnchor="end"
                height={60}
              />
              <YAxis 
                stroke="#9ca3af"
                style={{ fontSize: '12px' }}
                tickFormatter={(value) => `R$ ${(value / 1000).toFixed(0)}k`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line
                type="monotone"
                dataKey="investido"
                stroke="#3b82f6"
                strokeWidth={2}
                name="Investido"
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="juros"
                stroke="#f59e0b"
                strokeWidth={2}
                name="Juros"
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="total"
                stroke="#10b981"
                strokeWidth={2}
                name="Total"
                dot={false}
              />
            </LineChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
}
