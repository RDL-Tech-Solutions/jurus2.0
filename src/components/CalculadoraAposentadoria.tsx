import React, { useState, memo } from 'react';
import { motion } from 'framer-motion';
import { Calculator, TrendingUp, DollarSign, Calendar, Target, AlertTriangle, CheckCircle } from 'lucide-react';
import { useCalculadoraAposentadoria } from '../hooks/useCalculadoraAposentadoria';
import { CalculadoraAposentadoriaInput } from '../types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';

export const CalculadoraAposentadoria: React.FC = () => {
  const { loading, resultado, calcularAposentadoria, limparResultados } = useCalculadoraAposentadoria();
  
  const [input, setInput] = useState<CalculadoraAposentadoriaInput>({
    idadeAtual: 30,
    idadeAposentadoria: 65,
    valorMensalDesejado: 5000,
    patrimonioAtual: 50000,
    contribuicaoMensal: 1000,
    taxaJuros: 10,
    inflacao: 4,
    expectativaVida: 85
  });

  const handleInputChange = (field: keyof CalculadoraAposentadoriaInput, value: number) => {
    setInput(prev => ({ ...prev, [field]: value }));
  };

  const handleCalcular = () => {
    calcularAposentadoria(input);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const chartData = resultado?.evolucaoAcumulacao.map((item, index) => ({
    ano: Math.floor(index / 12) + 1,
    saldo: item.saldoAcumulado,
    saldoReal: item.saldoReal
  })).filter((_, index) => index % 12 === 11) || [];

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center justify-center gap-3">
          <Calculator className="text-blue-600" />
          Calculadora de Aposentadoria
        </h1>
        <p className="text-gray-600">
          Planeje sua aposentadoria e descubra quanto precisa investir para alcançar seus objetivos
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
            <Target className="text-blue-600" />
            Dados para Simulação
          </h2>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Idade Atual
                </label>
                <input
                  type="number"
                  value={input.idadeAtual}
                  onChange={(e) => handleInputChange('idadeAtual', Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  min="18"
                  max="80"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Idade de Aposentadoria
                </label>
                <input
                  type="number"
                  value={input.idadeAposentadoria}
                  onChange={(e) => handleInputChange('idadeAposentadoria', Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  min="50"
                  max="90"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Renda Mensal Desejada (R$)
              </label>
              <input
                type="number"
                value={input.valorMensalDesejado}
                onChange={(e) => handleInputChange('valorMensalDesejado', Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min="1000"
                step="500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Patrimônio Atual (R$)
              </label>
              <input
                type="number"
                value={input.patrimonioAtual}
                onChange={(e) => handleInputChange('patrimonioAtual', Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min="0"
                step="1000"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Contribuição Mensal Atual (R$)
              </label>
              <input
                type="number"
                value={input.contribuicaoMensal}
                onChange={(e) => handleInputChange('contribuicaoMensal', Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min="0"
                step="100"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  min="0"
                  max="15"
                  step="0.5"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Expectativa de Vida
              </label>
              <input
                type="number"
                value={input.expectativaVida}
                onChange={(e) => handleInputChange('expectativaVida', Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min="70"
                max="100"
              />
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <button
              onClick={handleCalcular}
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-lg font-medium hover:from-blue-700 hover:to-blue-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                <>
                  <Calculator size={20} />
                  Calcular
                </>
              )}
            </button>
            {resultado && (
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
        {resultado && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            {/* Cards de Resultado */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center gap-3 mb-2">
                  <Target className="text-green-600" />
                  <h3 className="font-semibold text-gray-900">Valor Necessário</h3>
                </div>
                <p className="text-2xl font-bold text-green-600">
                  {formatCurrency(resultado.valorNecessario)}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  Para sustentar a renda desejada
                </p>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center gap-3 mb-2">
                  <TrendingUp className="text-blue-600" />
                  <h3 className="font-semibold text-gray-900">Valor Acumulado</h3>
                </div>
                <p className="text-2xl font-bold text-blue-600">
                  {formatCurrency(resultado.valorAcumulado)}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  Com contribuição atual
                </p>
              </div>

              <div className={`bg-white rounded-xl shadow-lg p-6 ${resultado.deficit > 0 ? 'border-l-4 border-red-500' : 'border-l-4 border-green-500'}`}>
                <div className="flex items-center gap-3 mb-2">
                  {resultado.deficit > 0 ? (
                    <AlertTriangle className="text-red-600" />
                  ) : (
                    <CheckCircle className="text-green-600" />
                  )}
                  <h3 className="font-semibold text-gray-900">
                    {resultado.deficit > 0 ? 'Déficit' : 'Superávit'}
                  </h3>
                </div>
                <p className={`text-2xl font-bold ${resultado.deficit > 0 ? 'text-red-600' : 'text-green-600'}`}>
                  {formatCurrency(Math.abs(resultado.deficit))}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  {resultado.deficit > 0 ? 'Valor em falta' : 'Valor excedente'}
                </p>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center gap-3 mb-2">
                  <DollarSign className="text-purple-600" />
                  <h3 className="font-semibold text-gray-900">Contribuição Sugerida</h3>
                </div>
                <p className="text-2xl font-bold text-purple-600">
                  {formatCurrency(resultado.contribuicaoSugerida)}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  Mensal para atingir a meta
                </p>
              </div>
            </div>

            {/* Informações Adicionais */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Calendar className="text-blue-600" />
                Cronograma
              </h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Anos de contribuição:</span>
                  <span className="font-semibold ml-2">{resultado.anosContribuicao} anos</span>
                </div>
                <div>
                  <span className="text-gray-600">Anos de aposentadoria:</span>
                  <span className="font-semibold ml-2">{resultado.anosAposentadoria} anos</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Gráfico de Evolução */}
      {resultado && chartData.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-lg p-6"
        >
          <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
            <TrendingUp className="text-blue-600" />
            Evolução do Patrimônio
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
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
                    name === 'saldo' ? 'Valor Nominal' : 'Valor Real'
                  ]}
                  labelFormatter={(label) => `Ano ${label}`}
                />
                <Area
                  type="monotone"
                  dataKey="saldo"
                  stackId="1"
                  stroke="#3B82F6"
                  fill="#3B82F6"
                  fillOpacity={0.6}
                />
                <Area
                  type="monotone"
                  dataKey="saldoReal"
                  stackId="2"
                  stroke="#10B981"
                  fill="#10B981"
                  fillOpacity={0.6}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-6 mt-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded"></div>
              <span>Valor Nominal</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded"></div>
              <span>Valor Real (descontada inflação)</span>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default memo(CalculadoraAposentadoria);