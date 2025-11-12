import { Calculator, Info } from 'lucide-react';
import { useSimulacao } from '../store/useAppStore';
import { formatarMoeda } from '../utils/calculos';

export function CalculadoraIR() {
  const { resultado, simulacao } = useSimulacao();

  if (!resultado) return null;

  // Verificar se é isento de IR
  const tiposIsentos = ['lci', 'lca', 'poupanca'];
  const modalidade = simulacao.modalidadeBancoId;
  const isento = modalidade && tiposIsentos.some(tipo => modalidade.includes(tipo));

  if (isento) {
    return (
      <div className="card-mobile">
        <div className="flex items-center space-x-2 mb-4">
          <Calculator className="w-5 h-5 text-green-600 dark:text-green-400" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Imposto de Renda
          </h3>
        </div>

        <div className="p-4 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
          <div className="flex items-start space-x-3">
            <Info className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-green-900 dark:text-green-100 mb-1">
                Investimento Isento de IR
              </p>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                LCI, LCA e Poupança são isentos de Imposto de Renda. Você não pagará impostos sobre os rendimentos!
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Tabela regressiva de IR
  const calcularIR = (prazo: number) => {
    if (prazo <= 180) return 22.5;
    if (prazo <= 360) return 20;
    if (prazo <= 720) return 17.5;
    return 15;
  };

  const prazoEmDias = simulacao.periodo * 30;
  const aliquota = calcularIR(prazoEmDias);
  const valorIR = resultado.totalJuros * (aliquota / 100);
  const valorLiquido = resultado.valorFinal - valorIR;
  const rentabilidadeLiquida = ((valorLiquido - resultado.totalInvestido) / resultado.totalInvestido) * 100;

  return (
    <div className="card-mobile space-y-4">
      <div className="flex items-center space-x-2">
        <Calculator className="w-5 h-5 text-primary-600 dark:text-primary-400" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Calculadora de Imposto de Renda
        </h3>
      </div>

      {/* Tabela Regressiva */}
      <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
        <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-3">
          📋 Tabela Regressiva de IR
        </h4>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-700 dark:text-gray-300">Até 180 dias:</span>
            <span className="font-semibold text-gray-900 dark:text-white">22,5%</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-700 dark:text-gray-300">181 a 360 dias:</span>
            <span className="font-semibold text-gray-900 dark:text-white">20%</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-700 dark:text-gray-300">361 a 720 dias:</span>
            <span className="font-semibold text-gray-900 dark:text-white">17,5%</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-700 dark:text-gray-300">Acima de 720 dias:</span>
            <span className="font-semibold text-gray-900 dark:text-white">15%</span>
          </div>
        </div>
      </div>

      {/* Cálculo do IR */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Prazo do Investimento</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {simulacao.periodo} meses
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            ({prazoEmDias} dias)
          </p>
        </div>

        <div className="p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Alíquota de IR</p>
          <p className="text-2xl font-bold text-red-600 dark:text-red-400">
            {aliquota}%
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Sobre os rendimentos
          </p>
        </div>
      </div>

      {/* Valores */}
      <div className="space-y-3">
        <div className="flex justify-between items-center p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
          <span className="text-gray-700 dark:text-gray-300">Valor Bruto:</span>
          <span className="font-bold text-gray-900 dark:text-white">
            {formatarMoeda(resultado.valorFinal)}
          </span>
        </div>

        <div className="flex justify-between items-center p-3 rounded-lg bg-red-50 dark:bg-red-900/20">
          <span className="text-gray-700 dark:text-gray-300">Imposto de Renda:</span>
          <span className="font-bold text-red-600 dark:text-red-400">
            - {formatarMoeda(valorIR)}
          </span>
        </div>

        <div className="flex justify-between items-center p-3 rounded-lg bg-green-50 dark:bg-green-900/20 border-2 border-green-500">
          <span className="text-gray-700 dark:text-gray-300 font-semibold">Valor Líquido:</span>
          <span className="font-bold text-green-600 dark:text-green-400 text-xl">
            {formatarMoeda(valorLiquido)}
          </span>
        </div>
      </div>

      {/* Rentabilidade */}
      <div className="p-4 rounded-lg bg-gradient-to-r from-primary-50 to-purple-50 dark:from-primary-900/20 dark:to-purple-900/20 border border-primary-200 dark:border-primary-800">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Rentabilidade Líquida</p>
            <p className="text-2xl font-bold text-primary-600 dark:text-primary-400">
              {rentabilidadeLiquida.toFixed(2)}%
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600 dark:text-gray-400">Ganho Líquido</p>
            <p className="text-xl font-bold text-green-600 dark:text-green-400">
              {formatarMoeda(valorLiquido - resultado.totalInvestido)}
            </p>
          </div>
        </div>
      </div>

      {/* Dica */}
      <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
        <p className="text-sm text-gray-700 dark:text-gray-300">
          💡 <strong>Dica:</strong> Quanto maior o prazo, menor a alíquota de IR. 
          Investimentos acima de 2 anos (720 dias) têm a menor alíquota de 15%.
        </p>
      </div>
    </div>
  );
}
