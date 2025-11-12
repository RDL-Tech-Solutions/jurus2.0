import { TrendingUp } from 'lucide-react';
import { useSimulacao } from '../store/useAppStore';
import { gerarCenariosInvestimento } from '../utils/calculations';
import { formatarMoeda } from '../utils/calculos';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

export function Comparacao() {
  const { simulacao } = useSimulacao();
  const cenarios = gerarCenariosInvestimento(simulacao);
  const data = cenarios.map(c => ({
    nome: c.nome,
    Investido: c.resultado.totalInvestido,
    Juros: c.resultado.totalJuros,
    Total: c.resultado.valorFinal,
  }));

  return (
    <div className="page-container space-y-6">
      <div className="card-mobile flex items-center space-x-2">
        <TrendingUp className="w-6 h-6 text-primary-600 dark:text-primary-400" />
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Comparação de Investimentos
        </h1>
      </div>

      <div className="card-mobile">
        <div className="w-full h-[320px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 30 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.2} />
              <XAxis dataKey="nome" stroke="#9ca3af" angle={-20} textAnchor="end" interval={0} height={60} />
              <YAxis stroke="#9ca3af" tickFormatter={(v) => `R$ ${(v / 1000).toFixed(0)}k`} />
              <Tooltip formatter={(value: number) => formatarMoeda(value)} />
              <Legend />
              <Bar dataKey="Investido" stackId="a" fill="#3b82f6" />
              <Bar dataKey="Juros" stackId="a" fill="#f59e0b" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="card-mobile overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700">
              <th className="text-left py-3 px-2 font-semibold text-gray-900 dark:text-white">Cenário</th>
              <th className="text-right py-3 px-2 font-semibold text-gray-900 dark:text-white">Investido</th>
              <th className="text-right py-3 px-2 font-semibold text-gray-900 dark:text-white">Juros</th>
              <th className="text-right py-3 px-2 font-semibold text-gray-900 dark:text-white">Total</th>
            </tr>
          </thead>
          <tbody>
            {cenarios.map((c, i) => (
              <tr key={i} className="border-b border-gray-100 dark:border-gray-800">
                <td className="py-3 px-2 text-gray-900 dark:text-white">{c.nome}</td>
                <td className="py-3 px-2 text-right text-blue-600 dark:text-blue-400">{formatarMoeda(c.resultado.totalInvestido)}</td>
                <td className="py-3 px-2 text-right text-amber-600 dark:text-amber-400">{formatarMoeda(c.resultado.totalJuros)}</td>
                <td className="py-3 px-2 text-right font-semibold text-green-600 dark:text-green-400">{formatarMoeda(c.resultado.valorFinal)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
