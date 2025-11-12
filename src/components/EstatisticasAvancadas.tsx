import { TrendingUp, Clock, Target, Zap } from 'lucide-react';
import { useSimulacao } from '../store/useAppStore';
import { formatarMoeda } from '../utils/calculos';

export function EstatisticasAvancadas() {
  const { resultado, simulacao } = useSimulacao();

  if (!resultado) return null;

  // Cálculos avançados
  const taxaEfetivaAnual = ((1 + resultado.taxaEfetivaMensal / 100) ** 12 - 1) * 100;
  const tempoDobrar = 72 / taxaEfetivaAnual; // Regra de 72
  const rendimentoMedio = resultado.totalJuros / simulacao.periodo;
  const tempoAte1Milhao = resultado.valorFinal >= 1000000
    ? simulacao.periodo
    : Math.ceil((1000000 - simulacao.valorInicial) / (simulacao.valorMensal + rendimentoMedio));

  const estatisticas = [
    {
      icon: TrendingUp,
      label: 'Taxa Efetiva Anual',
      valor: `${taxaEfetivaAnual.toFixed(2)}%`,
      descricao: 'Rentabilidade real ao ano',
      cor: 'text-blue-600 dark:text-blue-400',
      bg: 'bg-blue-50 dark:bg-blue-900/20'
    },
    {
      icon: Clock,
      label: 'Tempo para Dobrar',
      valor: `${tempoDobrar.toFixed(1)} anos`,
      descricao: 'Regra de 72 aplicada',
      cor: 'text-purple-600 dark:text-purple-400',
      bg: 'bg-purple-50 dark:bg-purple-900/20'
    },
    {
      icon: Zap,
      label: 'Rendimento Médio',
      valor: formatarMoeda(rendimentoMedio),
      descricao: 'Por mês em juros',
      cor: 'text-amber-600 dark:text-amber-400',
      bg: 'bg-amber-50 dark:bg-amber-900/20'
    },
    {
      icon: Target,
      label: 'Tempo até R$ 1 Milhão',
      valor: resultado.valorFinal >= 1000000 ? 'Atingido!' : `${tempoAte1Milhao} meses`,
      descricao: resultado.valorFinal >= 1000000 ? 'Meta alcançada' : 'Projeção estimada',
      cor: 'text-green-600 dark:text-green-400',
      bg: 'bg-green-50 dark:bg-green-900/20'
    }
  ];

  return (
    <div className="card-mobile space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
        Estatísticas Avançadas
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {estatisticas.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className={`p-4 rounded-lg ${stat.bg} border border-gray-200 dark:border-gray-700`}
            >
              <div className="flex items-start space-x-3">
                <div className={`p-2 rounded-lg ${stat.bg}`}>
                  <Icon className={`w-5 h-5 ${stat.cor}`} />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</p>
                  <p className={`text-2xl font-bold ${stat.cor} mt-1`}>{stat.valor}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{stat.descricao}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Insights */}
      <div className="p-4 rounded-lg bg-gradient-to-r from-primary-50 to-purple-50 dark:from-primary-900/20 dark:to-purple-900/20 border border-primary-200 dark:border-primary-800">
        <h4 className="font-semibold text-gray-900 dark:text-white mb-2">💡 Insights</h4>
        <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
          <li>• Seu investimento cresce <strong>{taxaEfetivaAnual.toFixed(2)}%</strong> ao ano</li>
          <li>• Em <strong>{tempoDobrar.toFixed(1)} anos</strong>, seu capital dobrará</li>
          <li>• Você acumula em média <strong>{formatarMoeda(rendimentoMedio)}</strong> de juros por mês</li>
          {resultado.valorFinal >= 1000000 && (
            <li className="text-green-600 dark:text-green-400">
              🎉 Parabéns! Você atingirá R$ 1 milhão em {simulacao.periodo} meses!
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}
