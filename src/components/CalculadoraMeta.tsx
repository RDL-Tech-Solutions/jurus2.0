import { motion } from 'framer-motion';
import { 
  Target, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  XCircle,
  Calendar,
  DollarSign,
  BarChart3,
  Lightbulb,
  X
} from 'lucide-react';
import { useState } from 'react';
import { useCalculadoraMeta } from '../hooks/useCalculadoraMeta';
import { formatarMoeda } from '../utils/calculations';
import { TaxaType } from '../types';
import { modalidadesInvestimento } from '../hooks/useCalculadoraMeta';

interface CalculadoraMetaProps {
  onFechar: () => void;
}

export function CalculadoraMeta({ onFechar }: CalculadoraMetaProps) {
  const { meta, resultado, atualizarMetaAtual, calcularCenariosPrazo, calcularCenariosValorInicial } = useCalculadoraMeta();
  const [visualizacao, setVisualizacao] = useState<'calculadora' | 'cenarios' | 'analise'>('calculadora');

  const cenariosPrazo = calcularCenariosPrazo();
  const cenariosValorInicial = calcularCenariosValorInicial();

  const getViabilidadeIcon = (viabilidade: string) => {
    switch (viabilidade) {
      case 'viavel':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'dificil':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case 'inviavel':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return null;
    }
  };

  const getViabilidadeColor = (viabilidade: string) => {
    switch (viabilidade) {
      case 'viavel':
        return 'text-green-600 dark:text-green-400';
      case 'dificil':
        return 'text-yellow-600 dark:text-yellow-400';
      case 'inviavel':
        return 'text-red-600 dark:text-red-400';
      default:
        return 'text-gray-600 dark:text-gray-400';
    }
  };

  const renderizarCalculadora = () => (
    <div className="space-y-6">
      {/* Formulário */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Valor da Meta
          </label>
          <div className="relative">
            <DollarSign className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="number"
              value={meta.valorMeta}
              onChange={(e) => atualizarMetaAtual('valorMeta', Number(e.target.value))}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              placeholder="100000"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Prazo (meses)
          </label>
          <div className="relative">
            <Calendar className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="number"
              value={meta.periodo}
              onChange={(e) => atualizarMetaAtual('periodo', Number(e.target.value))}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              placeholder="60"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Valor Inicial Disponível
          </label>
          <div className="relative">
            <DollarSign className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="number"
              value={meta.valorInicialDisponivel}
              onChange={(e) => atualizarMetaAtual('valorInicialDisponivel', Number(e.target.value))}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              placeholder="0"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Modalidade de Investimento
          </label>
          <select
            value={meta.modalidade}
            onChange={(e) => atualizarMetaAtual('modalidade', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          >
            {modalidadesInvestimento.map(modalidade => (
              <option key={modalidade} value={modalidade}>
                {modalidade}
              </option>
            ))}
          </select>
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Tipo de Taxa
          </label>
          <div className="grid grid-cols-3 gap-3">
            {(['banco', 'conservador', 'moderado'] as TaxaType[]).map(tipo => (
              <button
                key={tipo}
                onClick={() => atualizarMetaAtual('taxaType', tipo)}
                className={`py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                  meta.taxaType === tipo
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {tipo.charAt(0).toUpperCase() + tipo.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Resultado */}
      {resultado && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center space-x-3 mb-4">
            {getViabilidadeIcon(resultado.viabilidade)}
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Resultado da Meta
            </h3>
            <span className={`text-sm font-medium ${getViabilidadeColor(resultado.viabilidade)}`}>
              {resultado.viabilidade === 'viavel' && 'Viável'}
              {resultado.viabilidade === 'dificil' && 'Desafiador'}
              {resultado.viabilidade === 'inviavel' && 'Inviável'}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
              <div className="text-sm text-blue-600 dark:text-blue-400 mb-1">
                Aporte Mensal Necessário
              </div>
              <div className="text-xl font-bold text-blue-700 dark:text-blue-300">
                {formatarMoeda(resultado.aporteNecessario)}
              </div>
            </div>

            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
              <div className="text-sm text-green-600 dark:text-green-400 mb-1">
                Valor Inicial Necessário
              </div>
              <div className="text-xl font-bold text-green-700 dark:text-green-300">
                {formatarMoeda(resultado.valorInicialNecessario)}
              </div>
            </div>

            <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
              <div className="text-sm text-purple-600 dark:text-purple-400 mb-1">
                Total Investido
              </div>
              <div className="text-xl font-bold text-purple-700 dark:text-purple-300">
                {formatarMoeda(resultado.totalInvestido)}
              </div>
            </div>

            <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg">
              <div className="text-sm text-orange-600 dark:text-orange-400 mb-1">
                Juros Gerados
              </div>
              <div className="text-xl font-bold text-orange-700 dark:text-orange-300">
                {formatarMoeda(resultado.jurosGerados)}
              </div>
            </div>
          </div>

          {/* Sugestões */}
          {resultado.sugestoes.length > 0 && (
            <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
              <div className="flex items-center space-x-2 mb-3">
                <Lightbulb className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                <h4 className="font-medium text-yellow-800 dark:text-yellow-200">
                  Sugestões
                </h4>
              </div>
              <ul className="space-y-1 text-sm text-yellow-700 dark:text-yellow-300">
                {resultado.sugestoes.map((sugestao, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <span className="text-yellow-500 mt-1">•</span>
                    <span>{sugestao}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Cenários Alternativos */}
          <div className="mt-6">
            <h4 className="font-medium text-gray-900 dark:text-white mb-4">
              Cenários de Rentabilidade
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {Object.entries(resultado.cenarios).map(([tipo, cenario]) => (
                <div key={tipo} className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {tipo.charAt(0).toUpperCase() + tipo.slice(1)}
                  </div>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Aporte:</span>
                      <span className="font-medium">{formatarMoeda(cenario.aporte)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Inicial:</span>
                      <span className="font-medium">{formatarMoeda(cenario.valorInicial)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );

  const renderizarCenarios = () => (
    <div className="space-y-6">
      {/* Cenários por Prazo */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Impacto do Prazo no Aporte Necessário
        </h3>
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">
                    Prazo
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">
                    Aporte Mensal
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">
                    Total Investido
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">
                    Juros Gerados
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">
                    % Juros
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                {cenariosPrazo.map((cenario, index) => (
                  <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                      {cenario.prazoAnos.toFixed(1)} anos ({cenario.prazoMeses}m)
                    </td>
                    <td className="px-4 py-3 text-sm font-medium text-blue-600 dark:text-blue-400">
                      {formatarMoeda(cenario.aporteNecessario)}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                      {formatarMoeda(cenario.totalInvestido)}
                    </td>
                    <td className="px-4 py-3 text-sm text-green-600 dark:text-green-400">
                      {formatarMoeda(cenario.jurosGerados)}
                    </td>
                    <td className="px-4 py-3 text-sm font-medium text-purple-600 dark:text-purple-400">
                      {cenario.percentualJuros.toFixed(1)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Cenários por Valor Inicial */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Impacto do Valor Inicial no Aporte Necessário
        </h3>
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">
                    Valor Inicial
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">
                    Aporte Mensal
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">
                    Redução no Aporte
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">
                    Total Investido
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">
                    Juros Gerados
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                {cenariosValorInicial.map((cenario, index) => (
                  <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                      {formatarMoeda(cenario.valorInicial)}
                    </td>
                    <td className="px-4 py-3 text-sm font-medium text-blue-600 dark:text-blue-400">
                      {formatarMoeda(cenario.aporteNecessario)}
                    </td>
                    <td className="px-4 py-3 text-sm text-green-600 dark:text-green-400">
                      {cenario.reducaoAporte > 0 ? `-${formatarMoeda(cenario.reducaoAporte)}` : '-'}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                      {formatarMoeda(cenario.totalInvestido)}
                    </td>
                    <td className="px-4 py-3 text-sm text-purple-600 dark:text-purple-400">
                      {formatarMoeda(cenario.jurosGerados)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white dark:bg-gray-900 rounded-xl shadow-xl max-w-6xl w-full max-h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <Target className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Calculadora de Meta
            </h2>
          </div>
          <button
            onClick={onFechar}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Navegação */}
        <div className="flex border-b border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setVisualizacao('calculadora')}
            className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${
              visualizacao === 'calculadora'
                ? 'bg-blue-500 text-white'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
          >
            <Target className="w-4 h-4 inline mr-2" />
            Calculadora
          </button>
          <button
            onClick={() => setVisualizacao('cenarios')}
            className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${
              visualizacao === 'cenarios'
                ? 'bg-blue-500 text-white'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
          >
            <BarChart3 className="w-4 h-4 inline mr-2" />
            Cenários
          </button>
        </div>

        {/* Conteúdo */}
        <div className="p-6 overflow-y-auto max-h-[70vh]">
          {visualizacao === 'calculadora' && renderizarCalculadora()}
          {visualizacao === 'cenarios' && renderizarCenarios()}
        </div>
      </motion.div>
    </motion.div>
  );
}

export default CalculadoraMeta;