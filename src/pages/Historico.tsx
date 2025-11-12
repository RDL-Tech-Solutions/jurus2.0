import { useHistorico } from '../store/useAppStore';
import { formatarMoeda } from '../utils/calculos';

export function Historico() {
  const { historico, removerHistorico, limparHistorico } = useHistorico();

  return (
    <div className="page-container space-y-4">
      <div className="card-mobile">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Histórico de Simulações
          </h1>
          {historico.length > 0 && (
            <button onClick={limparHistorico} className="btn">
              Limpar
            </button>
          )}
        </div>
      </div>

      {historico.length === 0 ? (
        <div className="card-mobile text-center py-10">
          <p className="text-gray-600 dark:text-gray-400">Sem simulações ainda</p>
        </div>
      ) : (
        <div className="space-y-3">
          {historico.map((item) => (
            <div key={item.id} className="card-mobile">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {new Date(item.data).toLocaleString('pt-BR')}
                  </p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    {formatarMoeda(item.resultado.valorFinal)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-600 dark:text-gray-400">Total Investido</p>
                  <p className="font-semibold text-blue-600 dark:text-blue-400">
                    {formatarMoeda(item.resultado.totalInvestido)}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
                <div>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Aporte Mensal</p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {formatarMoeda(item.simulacao.valorMensal)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Período</p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {item.simulacao.periodo} {item.simulacao.unidadePeriodo}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Juros</p>
                  <p className="font-medium text-amber-600 dark:text-amber-400">
                    {formatarMoeda(item.resultado.totalJuros)}
                  </p>
                </div>
                <div className="text-right md:text-left">
                  <button
                    onClick={() => removerHistorico(item.id)}
                    className="btn"
                  >
                    Remover
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
