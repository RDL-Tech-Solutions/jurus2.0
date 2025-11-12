import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { TrendingUp } from 'lucide-react';
import { useSimulacao } from '../store/useAppStore';
import { formatarMoeda } from '../utils/calculos';

const CORES = ['#3b82f6', '#10b981', '#f59e0b'];

export function GraficoResumoHome() {
  const { resultado, simulacao } = useSimulacao();

  if (!resultado || !simulacao) {
    return (
      <div className="card-mobile text-center py-12">
        <TrendingUp className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
        <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-400 mb-2">
          Gráfico de Resumo
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-500">
          Realize uma simulação para ver o gráfico
        </p>
      </div>
    );
  }

  // Dados para o gráfico de pizza - composição do valor final
  const dadosGrafico = [
    {
      nome: 'Valor Inicial',
      valor: simulacao.valorInicial,
      percentual: ((simulacao.valorInicial / resultado.valorFinal) * 100).toFixed(1),
      cor: CORES[0]
    },
    {
      nome: 'Aportes Mensais',
      valor: resultado.totalInvestido - simulacao.valorInicial,
      percentual: (((resultado.totalInvestido - simulacao.valorInicial) / resultado.valorFinal) * 100).toFixed(1),
      cor: CORES[1]
    },
    {
      nome: 'Juros Gerados',
      valor: resultado.totalJuros,
      percentual: ((resultado.totalJuros / resultado.valorFinal) * 100).toFixed(1),
      cor: CORES[2]
    }
  ];

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
          <p className="font-semibold text-gray-900 dark:text-white mb-2">{data.nome}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Valor: {formatarMoeda(data.valor)}
          </p>
          <p className="text-sm font-medium text-gray-900 dark:text-white">
            {data.percentual}% do total
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="card-mobile">
      <div className="flex items-center space-x-2 mb-4">
        <TrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-400" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Composição do Investimento
        </h3>
      </div>

      <div className="w-full h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={dadosGrafico}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={2}
              dataKey="valor"
            >
              {dadosGrafico.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.cor} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend
              verticalAlign="bottom"
              height={36}
              formatter={(value, entry: any) => (
                <span style={{ color: entry.color }}>
                  {value} ({entry.payload.percentual}%)
                </span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Resumo textual */}
      <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3 text-center">
        <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20">
          <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">Valor Inicial</p>
          <p className="text-lg font-bold text-blue-700 dark:text-blue-300">
            {formatarMoeda(simulacao.valorInicial)}
          </p>
          <p className="text-xs text-blue-500 dark:text-blue-500">
            {dadosGrafico[0].percentual}%
          </p>
        </div>
        <div className="p-3 rounded-lg bg-green-50 dark:bg-green-900/20">
          <p className="text-xs text-green-600 dark:text-green-400 font-medium">Aportes Mensais</p>
          <p className="text-lg font-bold text-green-700 dark:text-green-300">
            {formatarMoeda(resultado.totalInvestido - simulacao.valorInicial)}
          </p>
          <p className="text-xs text-green-500 dark:text-green-500">
            {dadosGrafico[1].percentual}%
          </p>
        </div>
        <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-900/20">
          <p className="text-xs text-amber-600 dark:text-amber-400 font-medium">Juros Gerados</p>
          <p className="text-lg font-bold text-amber-700 dark:text-amber-300">
            {formatarMoeda(resultado.totalJuros)}
          </p>
          <p className="text-xs text-amber-500 dark:text-amber-500">
            {dadosGrafico[2].percentual}%
          </p>
        </div>
      </div>
    </div>
  );
}
