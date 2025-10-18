import React, { memo, useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, LineChart as LineChartIcon } from 'lucide-react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { ResultadoMensal, ComparacaoInvestimento } from '../types';
import { formatarMoeda, formatarNumeroGrande } from '../utils/calculations';

interface GraficoInterativoProps {
  dados: ResultadoMensal[];
  comparacoes?: ComparacaoInvestimento[];
  titulo?: string;
}

type TipoGrafico = 'linha' | 'area';

export function GraficoInterativo({ 
  dados, 
  comparacoes = [], 
  titulo = "Evolução do Investimento" 
}: GraficoInterativoProps) {
  const [tipoGrafico, setTipoGrafico] = useState<TipoGrafico>('area');

  // Verificações de segurança
  if (!dados || dados.length === 0) {
    return (
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
      >
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400">
              Faça uma simulação para ver o gráfico
            </p>
          </div>
        </div>
      </motion.div>
    );
  }

  // Verificar se os dados têm a estrutura correta
  const dadosValidos = dados.every(item => 
    typeof item.mes === 'number' && 
    typeof item.saldoAcumulado === 'number' && 
    typeof item.contribuicao === 'number' &&
    !isNaN(item.mes) && 
    !isNaN(item.saldoAcumulado) && 
    !isNaN(item.contribuicao)
  );

  if (!dadosValidos) {
    return (
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
      >
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <BarChart3 className="w-12 h-12 text-red-400 mx-auto mb-4" />
            <p className="text-red-500 dark:text-red-400">
              Erro nos dados do gráfico. Verifique os parâmetros da simulação.
            </p>
          </div>
        </div>
      </motion.div>
    );
  }

  // Preparar dados para comparação
  const dadosComparacao = comparacoes.length > 0 ? 
    dados.map((item, index) => {
      // Calcular total investido acumulado até este mês
      const totalInvestidoAcumulado = dados.slice(0, index + 1).reduce((acc, curr) => acc + (curr.contribuicao || 0), 0);
      const jurosAcumulados = Math.max(0, item.saldoAcumulado - totalInvestidoAcumulado);
      
      const dadosItem: any = {
        mes: item.mes,
        saldo: item.saldoAcumulado || 0,
        totalInvestido: totalInvestidoAcumulado || 0,
        jurosAcumulados: jurosAcumulados || 0
      };

      // Adicionar dados de cada comparação
      comparacoes.forEach((comp, compIndex) => {
        if (comp.resultado?.evolucaoMensal?.[index]) {
          dadosItem[`saldo_${compIndex}`] = comp.resultado.evolucaoMensal[index].saldoAcumulado || 0;
        }
      });

      return dadosItem;
    }) : dados.map((item, index) => {
      // Calcular total investido acumulado até este mês
      const totalInvestidoAcumulado = dados.slice(0, index + 1).reduce((acc, curr) => acc + (curr.contribuicao || 0), 0);
      const jurosAcumulados = Math.max(0, item.saldoAcumulado - totalInvestidoAcumulado);
      
      return {
        mes: item.mes,
        saldo: item.saldoAcumulado || 0,
        totalInvestido: totalInvestidoAcumulado || 0,
        jurosAcumulados: jurosAcumulados || 0
      };
    });

  // Debug: Log dos dados preparados (apenas em desenvolvimento)
  if (process.env.NODE_ENV === 'development' && dadosComparacao.length > 0) {
    console.log('GraficoInterativo - Dados preparados:', {
      totalItems: dadosComparacao.length,
      primeiroItem: dadosComparacao[0],
      ultimoItem: dadosComparacao[dadosComparacao.length - 1]
    });
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length > 0) {
      return (
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg border border-gray-200 dark:border-gray-600 z-50">
          <p className="font-semibold text-gray-900 dark:text-white mb-2">
            Mês {label}
          </p>
          {payload.map((entry: any, index: number) => (
            <p key={`tooltip-${index}`} className="text-sm mb-1" style={{ color: entry.color }}>
              <span className="font-medium">{entry.name}:</span> {formatarMoeda(entry.value || 0)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const formatarEixoY = (value: number) => {
    return formatarNumeroGrande(value);
  };

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
    >
      {/* Cabeçalho do Gráfico */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg">
            <BarChart3 className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            {titulo}
          </h3>
        </div>

        {/* Controles do Gráfico */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setTipoGrafico('area')}
            className={`p-2 rounded-lg transition-colors ${
              tipoGrafico === 'area'
                ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
            title="Gráfico de Área"
          >
            <BarChart3 className="w-4 h-4" />
          </button>
          <button
            onClick={() => setTipoGrafico('linha')}
            className={`p-2 rounded-lg transition-colors ${
              tipoGrafico === 'linha'
                ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
            title="Gráfico de Linha"
          >
            <LineChartIcon className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Gráfico */}
      <div className="w-full" style={{ height: '320px', minHeight: '320px' }}>
        {dadosComparacao.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%" minWidth={300} minHeight={300}>
          {tipoGrafico === 'area' ? (
            <AreaChart data={dadosComparacao} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              {/* Gradientes */}
              <defs>
                <linearGradient id="gradientSaldo" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.1}/>
                </linearGradient>
                <linearGradient id="gradientInvestido" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis 
                dataKey="mes" 
                className="text-gray-600 dark:text-gray-400"
                tick={{ fontSize: 12 }}
              />
              <YAxis 
                className="text-gray-600 dark:text-gray-400"
                tick={{ fontSize: 12 }}
                tickFormatter={formatarEixoY}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              
              {/* Área principal */}
              <Area
                type="monotone"
                dataKey="saldo"
                stackId="1"
                stroke="#3B82F6"
                fill="url(#gradientSaldo)"
                name="Saldo Total"
              />
              <Area
                type="monotone"
                dataKey="totalInvestido"
                stackId="2"
                stroke="#10B981"
                fill="url(#gradientInvestido)"
                name="Total Investido"
              />

              {/* Áreas de comparação */}
              {comparacoes.map((comp, index) => (
                <Area
                  key={comp.id}
                  type="monotone"
                  dataKey={`saldo_${index}`}
                  stroke={comp.cor}
                  fill={`${comp.cor}20`}
                  name={comp.nome}
                />
              ))}
            </AreaChart>
          ) : (
            <LineChart data={dadosComparacao} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis 
                dataKey="mes" 
                className="text-gray-600 dark:text-gray-400"
                tick={{ fontSize: 12 }}
              />
              <YAxis 
                className="text-gray-600 dark:text-gray-400"
                tick={{ fontSize: 12 }}
                tickFormatter={formatarEixoY}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              
              {/* Linha principal */}
              <Line
                type="monotone"
                dataKey="saldo"
                stroke="#3B82F6"
                strokeWidth={3}
                dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                name="Saldo Total"
              />
              <Line
                type="monotone"
                dataKey="totalInvestido"
                stroke="#10B981"
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={{ fill: '#10B981', strokeWidth: 2, r: 3 }}
                name="Total Investido"
              />

              {/* Linhas de comparação */}
              {comparacoes.map((comp, index) => (
                <Line
                  key={comp.id}
                  type="monotone"
                  dataKey={`saldo_${index}`}
                  stroke={comp.cor}
                  strokeWidth={2}
                  dot={{ fill: comp.cor, strokeWidth: 2, r: 3 }}
                  name={comp.nome}
                />
              ))}
            </LineChart>
          )}
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400">
                Dados insuficientes para exibir o gráfico
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Legenda adicional para comparações */}
      {comparacoes.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
            Comparando {comparacoes.length + 1} investimento{comparacoes.length > 0 ? 's' : ''}:
          </p>
          <div className="flex flex-wrap gap-2">
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
              Simulação Principal
            </span>
            {comparacoes.map((comp) => (
              <span
                key={comp.id}
                className="inline-flex items-center px-2 py-1 rounded-full text-xs"
                style={{ 
                  backgroundColor: `${comp.cor}20`, 
                  color: comp.cor 
                }}
              >
                {comp.nome}
              </span>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}

export default memo(GraficoInterativo);