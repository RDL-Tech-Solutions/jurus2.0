import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingDown, DollarSign, Calendar, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { useCalculadoraAposentadoria } from '../hooks/useCalculadoraAposentadoria';
import { RetiradasProgramadasInput } from '../types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';

export const RetiradasProgramadas: React.FC = () => {
  const { loading, resultadoRetiradas, calcularRetiradas, limparResultados } = useCalculadoraAposentadoria();
  
  const [input, setInput] = useState<RetiradasProgramadasInput>({
    patrimonioInicial: 1000000,
    valorRetiradaMensal: 8000,
    taxaJuros: 8,
    inflacao: 4,
    periodoRetiradas: 30,
    ajustarInflacao: true
  });

  const handleInputChange = (field: keyof RetiradasProgramadasInput, value: number | boolean) => {
    setInput(prev => ({ ...prev, [field]: value }));
  };

  const handleCalcular = () => {
    calcularRetiradas(input);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const chartData = resultadoRetiradas?.evolucaoMensal.map((item, index) => ({
    mes: index + 1,
    ano: Math.floor(index / 12) + 1,
    saldo: item.saldoAcumulado,
    saldoReal: item.saldoReal,
    retirada: Math.abs(item.contribuicao)
  })).filter((_, index) => index % 6 === 5) || []; // Mostrar a cada 6 meses

  const duracaoAnos = resultadoRetiradas ? Math.floor(resultadoRetiradas.duracaoPatrimonio / 12) : 0;
  const duracaoMeses = resultadoRetiradas ? resultadoRetiradas.duracaoPatrimonio % 12 : 0;

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center justify-center gap-3">
          <TrendingDown className="text-red-600" />
          Retiradas Programadas
        </h1>
        <p className="text-gray-600">
          Simule quanto tempo seu patrimônio durará com retiradas mensais
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Formulário */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-xl shadow-lg p-6"
        >
          <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
            <DollarSign className="text-red-600" />
            Configuração das Retiradas
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Patrimônio Inicial (R$)
              </label>
              <input
                type="number"
                value={input.patrimonioInicial}
                onChange={(e) => handleInputChange('patrimonioInicial', Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                min="10000"
                step="10000"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Valor da Retirada Mensal (R$)
              </label>
              <input
                type="number"
                value={input.valorRetiradaMensal}
                onChange={(e) => handleInputChange('valorRetiradaMensal', Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                min="500"
                step="500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Taxa de Juros (% a.a.)
                </label>
                <input
                  type="number"
                  value={input.taxaJuros}
                  onChange={(e) => handleInputChange('taxaJuros', Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  min="0"
                  max="30"
                  step="0.5"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Inflação (% a.a.)
                </label>
                <input
                  type="number"
                  value={input.inflacao}
                  onChange={(e) => handleInputChange('inflacao', Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  min="0"
                  max="15"
                  step="0.5"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Período de Retiradas (anos)
              </label>
              <input
                type="number"
                value={input.periodoRetiradas}
                onChange={(e) => handleInputChange('periodoRetiradas', Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                min="1"
                max="50"
              />
            </div>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="ajustarInflacao"
                checked={input.ajustarInflacao}
                onChange={(e) => handleInputChange('ajustarInflacao', e.target.checked)}
                className="w-4 h-4 text-red-600 bg-gray-100 border-gray-300 rounded focus:ring-red-500"
              />
              <label htmlFor="ajustarInflacao" className="text-sm font-medium text-gray-700">
                Ajustar retiradas pela inflação
              </label>
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <button
              onClick={handleCalcular}
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-red-600 to-red-700 text-white px-6 py-3 rounded-lg font-medium hover:from-red-700 hover:to-red-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                <>
                  <TrendingDown size={20} />
                  Simular
                </>
              )}
            </button>
            {resultadoRetiradas && (
              <button
                onClick={limparResultados}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Limpar
              </button>
            )}
          </div>
        </motion.div>

        {/* Resultados */}
        {resultadoRetiradas && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            {/* Status da Sustentabilidade */}
            <div className={`bg-white rounded-xl shadow-lg p-6 border-l-4 ${
              resultadoRetiradas.sustentavel ? 'border-green-500' : 'border-red-500'
            }`}>
              <div className="flex items-center gap-3 mb-3">
                {resultadoRetiradas.sustentavel ? (
                  <CheckCircle className="text-green-600" size={24} />
                ) : (
                  <AlertTriangle className="text-red-600" size={24} />
                )}
                <h3 className="text-lg font-semibold text-gray-900">
                  {resultadoRetiradas.sustentavel ? 'Sustentável' : 'Insustentável'}
                </h3>
              </div>
              <p className={`text-sm ${
                resultadoRetiradas.sustentavel ? 'text-green-700' : 'text-red-700'
              }`}>
                {resultadoRetiradas.sustentavel 
                  ? 'Seu patrimônio consegue sustentar as retiradas pelo período desejado'
                  : 'Seu patrimônio não consegue sustentar as retiradas pelo período desejado'
                }
              </p>
            </div>

            {/* Cards de Resultado */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center gap-3 mb-2">
                  <Clock className="text-blue-600" />
                  <h3 className="font-semibold text-gray-900">Duração</h3>
                </div>
                <p className="text-2xl font-bold text-blue-600">
                  {duracaoAnos > 0 && `${duracaoAnos} anos`}
                  {duracaoMeses > 0 && ` ${duracaoMeses} meses`}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  Tempo que o patrimônio durará
                </p>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center gap-3 mb-2">
                  <DollarSign className="text-green-600" />
                  <h3 className="font-semibold text-gray-900">Total Retirado</h3>
                </div>
                <p className="text-2xl font-bold text-green-600">
                  {formatCurrency(resultadoRetiradas.totalRetirado)}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  Valor total das retiradas
                </p>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center gap-3 mb-2">
                  <TrendingDown className="text-purple-600" />
                  <h3 className="font-semibold text-gray-900">Saldo Final</h3>
                </div>
                <p className="text-2xl font-bold text-purple-600">
                  {formatCurrency(resultadoRetiradas.valorFinalPatrimonio)}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  Patrimônio restante
                </p>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center gap-3 mb-2">
                  <Calendar className="text-orange-600" />
                  <h3 className="font-semibold text-gray-900">Taxa de Retirada</h3>
                </div>
                <p className="text-2xl font-bold text-orange-600">
                  {((input.valorRetiradaMensal * 12 / input.patrimonioInicial) * 100).toFixed(1)}%
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  Percentual anual do patrimônio
                </p>
              </div>
            </div>

            {/* Recomendações */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="font-semibold text-gray-900 mb-4">💡 Recomendações</h3>
              <div className="space-y-2 text-sm text-gray-700">
                {((input.valorRetiradaMensal * 12 / input.patrimonioInicial) * 100) > 4 && (
                  <p className="flex items-start gap-2">
                    <span className="text-red-500">⚠️</span>
                    Taxa de retirada alta (&gt; 4% a.a.). Considere reduzir o valor mensal.
                  </p>
                )}
                {!resultadoRetiradas.sustentavel && (
                  <p className="flex items-start gap-2">
                    <span className="text-red-500">⚠️</span>
                    Patrimônio insuficiente. Considere aumentar o patrimônio inicial ou reduzir as retiradas.
                  </p>
                )}
                {resultadoRetiradas.sustentavel && (
                  <p className="flex items-start gap-2">
                    <span className="text-green-500">✅</span>
                    Estratégia sustentável. Seu patrimônio pode durar o período desejado.
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Gráfico de Evolução */}
      {resultadoRetiradas && chartData.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-lg p-6"
        >
          <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
            <TrendingDown className="text-red-600" />
            Evolução do Patrimônio com Retiradas
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="ano" 
                  label={{ value: 'Anos', position: 'insideBottom', offset: -5 }}
                />
                <YAxis 
                  tickFormatter={(value) => `R$ ${(value / 1000).toFixed(0)}k`}
                />
                <Tooltip 
                  formatter={(value: number, name: string) => [
                    formatCurrency(value),
                    name === 'saldo' ? 'Saldo Nominal' : 
                    name === 'saldoReal' ? 'Saldo Real' : 'Retirada Mensal'
                  ]}
                  labelFormatter={(label) => `Ano ${label}`}
                />
                <Line
                  type="monotone"
                  dataKey="saldo"
                  stroke="#EF4444"
                  strokeWidth={3}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="saldoReal"
                  stroke="#10B981"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-6 mt-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded"></div>
              <span>Saldo Nominal</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded"></div>
              <span>Saldo Real (descontada inflação)</span>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default RetiradasProgramadas;