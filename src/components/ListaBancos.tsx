import { useState } from 'react';
import { Building2, TrendingUp, Info, ChevronDown, ChevronUp } from 'lucide-react';
import { bancosDigitais, getTipoLabel } from '../data/bancosDigitais';
import { formatarMoeda } from '../utils/calculos';

export function ListaBancos() {
  const [expandidos, setExpandidos] = useState<string[]>([]);

  const toggleBanco = (bancoId: string) => {
    setExpandidos(prev =>
      prev.includes(bancoId)
        ? prev.filter(id => id !== bancoId)
        : [...prev, bancoId]
    );
  };

  const totalBancos = bancosDigitais.length;
  const totalModalidades = bancosDigitais.reduce((acc, banco) => acc + banco.modalidades.length, 0);

  return (
    <div className="card-mobile space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Building2 className="w-5 h-5 text-primary-600 dark:text-primary-400" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Bancos e Modalidades
          </h3>
        </div>
        <div className="text-sm text-gray-600 dark:text-gray-400">
          {totalBancos} bancos • {totalModalidades} opções
        </div>
      </div>

      <div className="space-y-3">
        {bancosDigitais.map((banco) => {
          const isExpanded = expandidos.includes(banco.id);

          return (
            <div
              key={banco.id}
              className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden"
            >
              {/* Header do Banco */}
              <button
                onClick={() => toggleBanco(banco.id)}
                className="w-full p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <Building2 className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                  <div className="text-left">
                    <h4 className="font-semibold text-gray-900 dark:text-white">{banco.nome}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {banco.modalidades.length} {banco.modalidades.length === 1 ? 'modalidade' : 'modalidades'}
                    </p>
                  </div>
                </div>
                {isExpanded ? (
                  <ChevronUp className="w-5 h-5 text-gray-400" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                )}
              </button>

              {/* Modalidades */}
              {isExpanded && (
                <div className="border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                  {banco.modalidades.map((modalidade) => (
                    <div
                      key={modalidade.id}
                      className="p-4 border-b border-gray-200 dark:border-gray-700 last:border-0"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h5 className="font-semibold text-gray-900 dark:text-white">
                            {modalidade.nome}
                          </h5>
                          <span className="inline-block px-2 py-1 text-xs rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 mt-1">
                            {getTipoLabel(modalidade.tipo)}
                          </span>
                        </div>
                        <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400" />
                      </div>

                      <div className="grid grid-cols-2 gap-3 mt-3">
                        <div>
                          <p className="text-xs text-gray-600 dark:text-gray-400">Rentabilidade</p>
                          <p className="font-semibold text-green-600 dark:text-green-400">
                            {modalidade.taxaAnual}% a.a.
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600 dark:text-gray-400">Liquidez</p>
                          <p className="font-semibold text-gray-900 dark:text-white capitalize">
                            {modalidade.liquidez}
                          </p>
                        </div>
                        <div className="col-span-2">
                          <p className="text-xs text-gray-600 dark:text-gray-400">Investimento Mínimo</p>
                          <p className="font-semibold text-gray-900 dark:text-white">
                            {formatarMoeda(modalidade.valorMinimo)}
                          </p>
                        </div>
                      </div>

                      {modalidade.descricao && (
                        <div className="mt-3 p-2 rounded bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                          <div className="flex items-start space-x-2">
                            <Info className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                            <p className="text-xs text-gray-700 dark:text-gray-300">
                              {modalidade.descricao}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
