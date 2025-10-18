import { motion } from 'framer-motion';
import { Table, Download, Eye, EyeOff } from 'lucide-react';
import { ResultadoMensal } from '../types';
import { formatarMoeda, formatarPercentual } from '../utils/calculations';
import { useState } from 'react';
import { AnimatedContainer } from './AnimatedContainer';
import { AnimatedButton } from './AnimatedButton';
import { StaggeredContainer, useStaggeredAnimation } from './AnimatedContainer';

interface TabelaDetalhadaProps {
  dados: ResultadoMensal[];
  onExportarCSV?: () => void;
}

export function TabelaDetalhada({ dados, onExportarCSV }: TabelaDetalhadaProps) {
  const [mostrarTodos, setMostrarTodos] = useState(false);
  const [colunaOrdenacao, setColunaOrdenacao] = useState<keyof ResultadoMensal | null>(null);
  const [direcaoOrdenacao, setDirecaoOrdenacao] = useState<'asc' | 'desc'>('asc');

  if (!dados || dados.length === 0) {
    return (
      <AnimatedContainer
        variant="slideUp"
        delay={0.4}
        className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
      >
        <div className="flex items-center justify-center h-32">
          <div className="text-center">
            <motion.div
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <Table className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            </motion.div>
            <p className="text-gray-500 dark:text-gray-400">
              Faça uma simulação para ver a tabela detalhada
            </p>
          </div>
        </div>
      </AnimatedContainer>
    );
  }

  // Ordenar dados se necessário
  const dadosOrdenados = [...dados].sort((a, b) => {
    if (!colunaOrdenacao) return 0;
    
    const valorA = a[colunaOrdenacao];
    const valorB = b[colunaOrdenacao];
    
    if (typeof valorA === 'number' && typeof valorB === 'number') {
      return direcaoOrdenacao === 'asc' ? valorA - valorB : valorB - valorA;
    }
    
    return 0;
  });

  // Mostrar apenas os primeiros 12 meses por padrão
  const dadosExibidos = mostrarTodos ? dadosOrdenados : dadosOrdenados.slice(0, 12);

  const handleOrdenar = (coluna: keyof ResultadoMensal) => {
    if (colunaOrdenacao === coluna) {
      setDirecaoOrdenacao(direcaoOrdenacao === 'asc' ? 'desc' : 'asc');
    } else {
      setColunaOrdenacao(coluna);
      setDirecaoOrdenacao('asc');
    }
  };

  const obterIconeOrdenacao = (coluna: keyof ResultadoMensal) => {
    if (colunaOrdenacao !== coluna) return null;
    return direcaoOrdenacao === 'asc' ? '↑' : '↓';
  };

  return (
    <AnimatedContainer
      variant="slideUp"
      delay={0.4}
      className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
    >
      <StaggeredContainer>
      {/* Cabeçalho da Tabela */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 pb-6">
          <div className="flex items-center space-x-3">
            <motion.div
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-lg">
                <Table className="w-5 h-5 text-white" />
              </div>
            </motion.div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Evolução Mensal
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {dados.length} meses de simulação
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {/* Botão para mostrar/ocultar todos os dados */}
            <AnimatedButton
              onClick={() => setMostrarTodos(!mostrarTodos)}
              variant="secondary"
              size="sm"
              className="bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              {mostrarTodos ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              <span>{mostrarTodos ? 'Mostrar Menos' : 'Mostrar Todos'}</span>
            </AnimatedButton>

            {/* Botão de Exportar */}
            {onExportarCSV && (
              <AnimatedButton
                onClick={onExportarCSV}
                variant="secondary"
                size="sm"
                className="bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-800"
              >
                <Download className="w-4 h-4" />
                <span>Exportar CSV</span>
              </AnimatedButton>
            )}
          </div>
        </div>
      </motion.div>

      {/* Tabela */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                  onClick={() => handleOrdenar('mes')}
                >
                  Mês {obterIconeOrdenacao('mes')}
                </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                onClick={() => handleOrdenar('contribuicao')}
              >
                Aporte {obterIconeOrdenacao('contribuicao')}
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                onClick={() => handleOrdenar('saldoAcumulado')}
              >
                Total Investido {obterIconeOrdenacao('saldoAcumulado')}
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                onClick={() => handleOrdenar('juros')}
              >
                Juros do Mês {obterIconeOrdenacao('juros')}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Juros Acumulados
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                onClick={() => handleOrdenar('saldoAcumulado')}
              >
                Saldo Total {obterIconeOrdenacao('saldoAcumulado')}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Rentabilidade
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
            {dadosExibidos.map((linha, index) => (
              <motion.tr
                key={linha.mes}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05, duration: 0.3 }}
                whileHover={{ 
                  scale: 1.01,
                  backgroundColor: "rgba(59, 130, 246, 0.05)",
                  transition: { duration: 0.2 }
                }}
                className={`border-b border-gray-200 dark:border-gray-700 ${
                  index % 2 === 0 ? 'bg-white dark:bg-gray-900' : 'bg-gray-50 dark:bg-gray-800'
                } cursor-pointer`}
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                  {linha.mes}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 text-right">
                  <motion.span
                    whileHover={{ scale: 1.05 }}
                    className="font-medium"
                  >
                    {formatarMoeda(linha.contribuicao)}
                  </motion.span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 text-right">
                  <motion.span
                    whileHover={{ scale: 1.05 }}
                    className="font-medium"
                  >
                    {formatarMoeda(linha.saldoAcumulado)}
                  </motion.span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                  <motion.span
                    whileHover={{ scale: 1.05 }}
                    className="font-medium text-green-600 dark:text-green-400"
                  >
                    {formatarMoeda(linha.juros)}
                  </motion.span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 dark:text-green-400">
                  {formatarMoeda(linha.saldoAcumulado - linha.contribuicao * linha.mes)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900 dark:text-white">
                  {formatarMoeda(linha.saldoAcumulado)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 dark:text-blue-400">
                  {formatarPercentual(((linha.saldoAcumulado / (linha.contribuicao * linha.mes)) - 1) * 100)}
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
        </div>
      </motion.div>

      {/* Footer com resumo */}
      {!mostrarTodos && dados.length > 12 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <motion.div 
            className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700"
            whileHover={{ scale: 1.01 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Mostrando 12 de {dados.length} meses
              </p>
              <AnimatedButton
                onClick={() => setMostrarTodos(true)}
                variant="secondary"
                size="sm"
                className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
              >
                Ver todos os meses
              </AnimatedButton>
            </div>
          </motion.div>
        </motion.div>
      )}
      </StaggeredContainer>
    </AnimatedContainer>
  );
}