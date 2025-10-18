import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, TrendingDown, AlertTriangle, Info, BarChart3, DollarSign } from 'lucide-react';
import { useComparacaoInflacao, ParametrosInflacao } from '../hooks/useInflacao';
import { Tooltip } from './Tooltip';

interface SimulacaoInflacaoProps {
  valorInicial: number;
  valorMensal: number;
  periodo: number;
  taxaJuros: number;
  onClose?: () => void;
}

export const SimulacaoInflacao: React.FC<SimulacaoInflacaoProps> = ({
  valorInicial,
  valorMensal,
  periodo,
  taxaJuros,
  onClose
}) => {
  const [taxaInflacao, setTaxaInflacao] = useState(4.5); // IPCA médio histórico
  const [mostrarDetalhes, setMostrarDetalhes] = useState(false);

  const parametros: ParametrosInflacao = {
    valorInicial,
    valorMensal,
    periodo,
    taxaJuros,
    taxaInflacao
  };

  const { comInflacao, semInflacao, diferencaAbsoluta, diferencaPercentual, impactoInflacao } = useComparacaoInflacao(parametros);

  const formatarMoeda = (valor: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor);
  };

  const formatarPercentual = (valor: number) => {
    return `${valor.toFixed(2)}%`;
  };

  const taxasInflacaoPresets = [
    { nome: 'Meta do BC', valor: 3.0, descricao: 'Meta oficial do Banco Central' },
    { nome: 'IPCA Médio', valor: 4.5, descricao: 'Média histórica do IPCA' },
    { nome: 'Cenário Alto', valor: 6.0, descricao: 'Cenário de inflação elevada' },
    { nome: 'Hiperinflação', valor: 12.0, descricao: 'Cenário extremo (referência)' }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
    >
      <motion.div
        initial={{ y: 20 }}
        animate={{ y: 0 }}
        className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <TrendingDown className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Simulação com Inflação</h2>
                <p className="text-gray-600">Análise do impacto da inflação no seu investimento</p>
              </div>
            </div>
            {onClose && (
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <span className="sr-only">Fechar</span>
                ✕
              </button>
            )}
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Configuração da Taxa de Inflação */}
          <div className="bg-gray-50 rounded-xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle className="w-5 h-5 text-orange-500" />
              <h3 className="text-lg font-semibold text-gray-900">Taxa de Inflação Anual</h3>
              <Tooltip content="A inflação reduz o poder de compra do dinheiro ao longo do tempo. Uma taxa de 4% ao ano significa que R$ 100 hoje valerão R$ 96 em poder de compra no próximo ano.">
                <Info className="w-4 h-4 text-gray-400" />
              </Tooltip>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Taxa Personalizada (% ao ano)
                </label>
                <input
                  type="number"
                  value={taxaInflacao}
                  onChange={(e) => setTaxaInflacao(Number(e.target.value))}
                  step="0.1"
                  min="0"
                  max="50"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Presets Comuns
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {taxasInflacaoPresets.map((preset) => (
                    <Tooltip key={preset.nome} content={preset.descricao}>
                      <button
                        onClick={() => setTaxaInflacao(preset.valor)}
                        className={`p-2 text-xs rounded-lg border transition-colors ${
                          taxaInflacao === preset.valor
                            ? 'bg-blue-100 border-blue-300 text-blue-700'
                            : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <div className="font-medium">{preset.nome}</div>
                        <div className="text-gray-500">{preset.valor}%</div>
                      </button>
                    </Tooltip>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Comparação de Resultados */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Sem Inflação */}
            <div className="bg-green-50 rounded-xl p-6 border border-green-200">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-5 h-5 text-green-600" />
                <h3 className="text-lg font-semibold text-green-800">Sem Inflação</h3>
              </div>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-green-700">Valor Final</p>
                  <p className="text-2xl font-bold text-green-800">
                    {formatarMoeda(semInflacao.valorFinalNominal)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-green-700">Poder de Compra</p>
                  <p className="text-lg font-semibold text-green-800">100%</p>
                </div>
              </div>
            </div>

            {/* Com Inflação */}
            <div className="bg-red-50 rounded-xl p-6 border border-red-200">
              <div className="flex items-center gap-2 mb-4">
                <TrendingDown className="w-5 h-5 text-red-600" />
                <h3 className="text-lg font-semibold text-red-800">Com Inflação ({formatarPercentual(taxaInflacao)})</h3>
              </div>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-red-700">Valor Nominal</p>
                  <p className="text-2xl font-bold text-red-800">
                    {formatarMoeda(comInflacao.valorFinalNominal)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-red-700">Valor Real (Poder de Compra)</p>
                  <p className="text-lg font-semibold text-red-800">
                    {formatarMoeda(comInflacao.valorFinalReal)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-red-700">Perda por Inflação</p>
                  <p className="text-lg font-semibold text-red-800">
                    -{formatarMoeda(comInflacao.perdaInflacao)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Impacto da Inflação */}
          <div className="bg-orange-50 rounded-xl p-6 border border-orange-200">
            <div className="flex items-center gap-2 mb-4">
              <BarChart3 className="w-5 h-5 text-orange-600" />
              <h3 className="text-lg font-semibold text-orange-800">Impacto da Inflação</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-sm text-orange-700 mb-1">Diferença Absoluta</p>
                <p className="text-xl font-bold text-orange-800">
                  -{formatarMoeda(diferencaAbsoluta)}
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-orange-700 mb-1">Diferença Percentual</p>
                <p className="text-xl font-bold text-orange-800">
                  -{formatarPercentual(diferencaPercentual)}
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-orange-700 mb-1">Perda de Poder de Compra</p>
                <p className="text-xl font-bold text-orange-800">
                  -{formatarPercentual(comInflacao.percentualPerdaTotal)}
                </p>
              </div>
            </div>

            <div className="mt-4 p-4 bg-orange-100 rounded-lg">
              <div className="flex items-start gap-2">
                <DollarSign className="w-5 h-5 text-orange-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-orange-800">
                    Para recuperar a perda por inflação:
                  </p>
                  <p className="text-sm text-orange-700">
                    Seriam necessários aproximadamente <strong>{impactoInflacao.mesesParaRecuperar} meses</strong> de aportes adicionais de {formatarMoeda(valorMensal)}.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Botão para mostrar detalhes */}
          <div className="text-center">
            <button
              onClick={() => setMostrarDetalhes(!mostrarDetalhes)}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              {mostrarDetalhes ? 'Ocultar' : 'Mostrar'} Evolução Mensal
            </button>
          </div>

          {/* Evolução Mensal */}
          <AnimatePresence>
            {mostrarDetalhes && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-gray-50 rounded-xl p-6"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Evolução Mensal</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-2 px-3">Mês</th>
                        <th className="text-right py-2 px-3">Valor Nominal</th>
                        <th className="text-right py-2 px-3">Valor Real</th>
                        <th className="text-right py-2 px-3">Perda</th>
                        <th className="text-right py-2 px-3">% Perda</th>
                      </tr>
                    </thead>
                    <tbody>
                      {comInflacao.evolucaoMensal.slice(0, 12).map((dados) => (
                        <tr key={dados.mes} className="border-b border-gray-100">
                          <td className="py-2 px-3 font-medium">{dados.mes}</td>
                          <td className="py-2 px-3 text-right">{formatarMoeda(dados.valorNominal)}</td>
                          <td className="py-2 px-3 text-right">{formatarMoeda(dados.valorReal)}</td>
                          <td className="py-2 px-3 text-right text-red-600">
                            -{formatarMoeda(dados.perda)}
                          </td>
                          <td className="py-2 px-3 text-right text-red-600">
                            -{formatarPercentual(dados.percentualPerda)}
                          </td>
                        </tr>
                      ))}
                      {comInflacao.evolucaoMensal.length > 12 && (
                        <tr>
                          <td colSpan={5} className="py-2 px-3 text-center text-gray-500">
                            ... e mais {comInflacao.evolucaoMensal.length - 12} meses
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default SimulacaoInflacao;