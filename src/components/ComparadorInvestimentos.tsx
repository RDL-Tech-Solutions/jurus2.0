import React, { memo, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  GitCompare, 
  Plus, 
  X, 
  Trophy, 
  TrendingDown, 
  TrendingUp,
  Download, 
  BarChart3,
  Target,
  Clock,
  DollarSign,
  Percent,
  Info,
  Eye,
  EyeOff
} from 'lucide-react';
import { ComparacaoInvestimento, SimulacaoInput } from '../types';
import { formatarMoeda, formatarPercentual } from '../utils/calculations';
import { buscarBancoPorId, buscarModalidadePorId } from '../constants/bancosDigitais';

interface ComparadorInvestimentosProps {
  comparacoes: ComparacaoInvestimento[];
  simulacaoAtual: SimulacaoInput;
  onAdicionarComparacao: (simulacao: SimulacaoInput, nome: string) => void;
  onRemoverComparacao: (id: string) => void;
  onLimparComparacoes: () => void;
  onExportarComparacao?: () => void;
  melhorInvestimento?: ComparacaoInvestimento | null;
}

type VisualizacaoTipo = 'lista' | 'tabela' | 'metricas';

const ComparadorInvestimentos = memo(function ComparadorInvestimentos({
  comparacoes,
  simulacaoAtual,
  onAdicionarComparacao,
  onRemoverComparacao,
  onLimparComparacoes,
  onExportarComparacao,
  melhorInvestimento
}: ComparadorInvestimentosProps) {
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [nomeComparacao, setNomeComparacao] = useState('');
  const [visualizacao, setVisualizacao] = useState<VisualizacaoTipo>('lista');
  const [mostrarDetalhes, setMostrarDetalhes] = useState<string[]>([]);

  // Função para obter o nome da modalidade baseado no tipo de taxa
  const obterNomeModalidade = (simulacao: SimulacaoInput): string => {
    switch (simulacao.taxaType) {
      case 'banco':
        return simulacao.modalidade?.nome || 'Não especificada';
      case 'banco_digital':
        if (simulacao.bancoDigitalId && simulacao.modalidadeBancoId) {
          const banco = buscarBancoPorId(simulacao.bancoDigitalId);
          const modalidade = buscarModalidadePorId(simulacao.bancoDigitalId, simulacao.modalidadeBancoId);
          return modalidade ? `${banco?.nome} - ${modalidade.nome}` : 'Não especificada';
        }
        return 'Não especificada';
      case 'cdi':
        return `${simulacao.percentualCdi || 100}% do CDI`;
      case 'personalizada':
        return `${simulacao.taxaPersonalizada || 0}% a.a.`;
      default:
        return 'Não especificada';
    }
  };

  // Função para obter o tipo de taxa formatado
  const obterTipoTaxaFormatado = (taxaType: string): string => {
    switch (taxaType) {
      case 'banco':
        return 'Banco/Modalidade';
      case 'banco_digital':
        return 'Banco Digital';
      case 'cdi':
        return 'CDI';
      case 'personalizada':
        return 'Personalizada';
      default:
        return taxaType;
    }
  };

  const handleAdicionarComparacao = () => {
    if (nomeComparacao.trim() && comparacoes.length < 3) {
      onAdicionarComparacao(simulacaoAtual, nomeComparacao.trim());
      setNomeComparacao('');
      setMostrarFormulario(false);
    }
  };

  const toggleDetalhes = (id: string) => {
    setMostrarDetalhes(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  const obterDiferenca = (comparacao: ComparacaoInvestimento) => {
    if (!melhorInvestimento) return { valor: 0, percentual: 0 };
    
    const diferenca = comparacao.resultado.saldoFinal - melhorInvestimento.resultado.saldoFinal;
    const percentual = melhorInvestimento.resultado.saldoFinal > 0 
      ? (diferenca / melhorInvestimento.resultado.saldoFinal) * 100 
      : 0;
    
    return { valor: diferenca, percentual };
  };

  const obterMetricasComparativas = () => {
    if (comparacoes.length === 0) return null;

    const saldosFinais = comparacoes.map(c => c.resultado.saldoFinal);
    const rentabilidades = comparacoes.map(c => c.resultado.rentabilidadeTotal);
    const jurosGanhos = comparacoes.map(c => c.resultado.totalJuros);

    return {
      maiorSaldo: Math.max(...saldosFinais),
      menorSaldo: Math.min(...saldosFinais),
      diferencaMaxima: Math.max(...saldosFinais) - Math.min(...saldosFinais),
      rentabilidadeMedia: rentabilidades.reduce((a, b) => a + b, 0) / rentabilidades.length,
      maiorRentabilidade: Math.max(...rentabilidades),
      menorRentabilidade: Math.min(...rentabilidades),
      totalJurosComparacoes: jurosGanhos.reduce((a, b) => a + b, 0),
      melhorROI: comparacoes.find(c => c.resultado.saldoFinal === Math.max(...saldosFinais))
    };
  };

  const metricas = obterMetricasComparativas();

  const renderizarTooltip = (texto: string) => (
    <div className="group relative inline-block">
      <Info className="w-4 h-4 text-gray-400 hover:text-gray-600 cursor-help" />
      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
        {texto}
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
      </div>
    </div>
  );

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.5 }}
      className="bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700"
    >
      {/* Cabeçalho */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-orange-500 to-red-600 rounded-lg">
            <GitCompare className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              Comparador de Investimentos
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Compare até 3 simulações diferentes com análise detalhada
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {/* Seletor de Visualização */}
          {comparacoes.length > 0 && (
            <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
              <button
                onClick={() => setVisualizacao('lista')}
                className={`px-3 py-1 text-xs rounded-md transition-colors ${
                  visualizacao === 'lista'
                    ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                    : 'text-gray-600 dark:text-gray-400'
                }`}
              >
                Lista
              </button>
              <button
                onClick={() => setVisualizacao('tabela')}
                className={`px-3 py-1 text-xs rounded-md transition-colors ${
                  visualizacao === 'tabela'
                    ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                    : 'text-gray-600 dark:text-gray-400'
                }`}
              >
                Tabela
              </button>
              <button
                onClick={() => setVisualizacao('metricas')}
                className={`px-3 py-1 text-xs rounded-md transition-colors ${
                  visualizacao === 'metricas'
                    ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                    : 'text-gray-600 dark:text-gray-400'
                }`}
              >
                Métricas
              </button>
            </div>
          )}

          {/* Botão de Exportar */}
          {comparacoes.length > 0 && onExportarComparacao && (
            <button
              onClick={onExportarComparacao}
              className="flex items-center space-x-2 px-3 py-2 text-sm bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-800 rounded-lg transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Exportar</span>
            </button>
          )}

          {/* Botão de Adicionar */}
          {comparacoes.length < 3 && (
            <button
              onClick={() => setMostrarFormulario(!mostrarFormulario)}
              className="flex items-center space-x-2 px-3 py-2 text-sm bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-800 rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Adicionar</span>
            </button>
          )}

          {/* Botão de Limpar */}
          {comparacoes.length > 0 && (
            <button
              onClick={onLimparComparacoes}
              className="flex items-center space-x-2 px-3 py-2 text-sm bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-800 rounded-lg transition-colors"
            >
              <X className="w-4 h-4" />
              <span>Limpar</span>
            </button>
          )}
        </div>
      </div>

      {/* Formulário para adicionar comparação */}
      {mostrarFormulario && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="p-6 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800"
        >
          <div className="flex items-center space-x-3">
            <input
              type="text"
              value={nomeComparacao}
              onChange={(e) => setNomeComparacao(e.target.value)}
              placeholder="Nome da simulação (ex: Tesouro Direto)"
              className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              onKeyPress={(e) => e.key === 'Enter' && handleAdicionarComparacao()}
            />
            <button
              onClick={handleAdicionarComparacao}
              disabled={!nomeComparacao.trim()}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg transition-colors"
            >
              Adicionar
            </button>
            <button
              onClick={() => setMostrarFormulario(false)}
              className="px-4 py-2 bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-300 rounded-lg transition-colors"
            >
              Cancelar
            </button>
          </div>
        </motion.div>
      )}

      {/* Conteúdo Principal */}
      <div className="p-6">
        {comparacoes.length === 0 ? (
          <div className="text-center py-8">
            <GitCompare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400 mb-2">
              Nenhuma comparação adicionada
            </p>
            <p className="text-sm text-gray-400 dark:text-gray-500">
              Adicione simulações para comparar diferentes investimentos
            </p>
          </div>
        ) : (
          <>
            {/* Visualização em Lista */}
            {visualizacao === 'lista' && (
              <div className="space-y-4">
                {comparacoes.map((comparacao, index) => {
                  const diferenca = obterDiferenca(comparacao);
                  const ehMelhor = melhorInvestimento?.id === comparacao.id;
                  const mostrarDetalhe = mostrarDetalhes.includes(comparacao.id);
                  
                  return (
                    <motion.div
                      key={comparacao.id}
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        ehMelhor 
                          ? 'border-yellow-400 bg-yellow-50 dark:bg-yellow-900/20' 
                          : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          {ehMelhor && (
                            <Trophy className="w-5 h-5 text-yellow-500" />
                          )}
                          <div
                            className="w-4 h-4 rounded-full"
                            style={{ backgroundColor: comparacao.cor }}
                          />
                          <h4 className="font-semibold text-gray-900 dark:text-white">
                            {comparacao.nome}
                            {ehMelhor && (
                              <span className="ml-2 text-xs bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 px-2 py-1 rounded-full">
                                Melhor
                              </span>
                            )}
                          </h4>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => toggleDetalhes(comparacao.id)}
                            className="p-1 text-gray-400 hover:text-blue-500 transition-colors"
                            title={mostrarDetalhe ? "Ocultar detalhes" : "Mostrar detalhes"}
                          >
                            {mostrarDetalhe ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                          <button
                            onClick={() => onRemoverComparacao(comparacao.id)}
                            className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <div className="flex items-center space-x-1">
                            <p className="text-gray-500 dark:text-gray-400">Saldo Final</p>
                            {renderizarTooltip("Valor total acumulado ao final do período")}
                          </div>
                          <p className="font-semibold text-gray-900 dark:text-white">
                            {formatarMoeda(comparacao.resultado.saldoFinal)}
                          </p>
                        </div>
                        
                        <div>
                          <div className="flex items-center space-x-1">
                            <p className="text-gray-500 dark:text-gray-400">Total Investido</p>
                            {renderizarTooltip("Soma de todos os aportes realizados")}
                          </div>
                          <p className="font-semibold text-gray-900 dark:text-white">
                            {formatarMoeda(comparacao.resultado.totalInvestido)}
                          </p>
                        </div>
                        
                        <div>
                          <div className="flex items-center space-x-1">
                            <p className="text-gray-500 dark:text-gray-400">Juros Ganhos</p>
                            {renderizarTooltip("Valor total gerado pelos juros compostos")}
                          </div>
                          <p className="font-semibold text-green-600 dark:text-green-400">
                            {formatarMoeda(comparacao.resultado.totalJuros)}
                          </p>
                        </div>
                        
                        <div>
                          <div className="flex items-center space-x-1">
                            <p className="text-gray-500 dark:text-gray-400">Rentabilidade</p>
                            {renderizarTooltip("Percentual de retorno sobre o investimento")}
                          </div>
                          <p className="font-semibold text-blue-600 dark:text-blue-400">
                            {formatarPercentual(comparacao.resultado.rentabilidadeTotal)}
                          </p>
                        </div>
                      </div>

                      {/* Detalhes Expandidos */}
                      {mostrarDetalhe && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600"
                        >
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                            <div>
                              <p className="text-gray-500 dark:text-gray-400">Valor Inicial</p>
                              <p className="font-medium text-gray-900 dark:text-white">
                                {formatarMoeda(comparacao.simulacao.valorInicial)}
                              </p>
                            </div>
                            <div>
                              <p className="text-gray-500 dark:text-gray-400">Aporte Mensal</p>
                              <p className="font-medium text-gray-900 dark:text-white">
                                {formatarMoeda(comparacao.simulacao.valorMensal)}
                              </p>
                            </div>
                            <div>
                              <p className="text-gray-500 dark:text-gray-400">Período</p>
                              <p className="font-medium text-gray-900 dark:text-white">
                                {comparacao.simulacao.periodo} meses
                              </p>
                            </div>
                            <div>
                              <p className="text-gray-500 dark:text-gray-400">Tipo de Taxa</p>
                              <p className="font-medium text-gray-900 dark:text-white">
                                {obterTipoTaxaFormatado(comparacao.simulacao.taxaType)}
                              </p>
                            </div>
                            <div>
                              <p className="text-gray-500 dark:text-gray-400">Modalidade</p>
                              <p className="font-medium text-gray-900 dark:text-white">
                                {obterNomeModalidade(comparacao.simulacao)}
                              </p>
                            </div>
                            <div>
                              <p className="text-gray-500 dark:text-gray-400">ROI</p>
                              <p className="font-medium text-purple-600 dark:text-purple-400">
                                {((comparacao.resultado.saldoFinal / comparacao.resultado.totalInvestido - 1) * 100).toFixed(2)}%
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      )}

                      {/* Diferença em relação ao melhor */}
                      {melhorInvestimento && !ehMelhor && (
                        <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
                          <div className="flex items-center space-x-2 text-sm">
                            <TrendingDown className="w-4 h-4 text-red-500" />
                            <span className="text-gray-500 dark:text-gray-400">
                              Diferença para o melhor:
                            </span>
                            <span className="font-semibold text-red-600 dark:text-red-400">
                              {formatarMoeda(Math.abs(diferenca.valor))} 
                              ({formatarPercentual(Math.abs(diferenca.percentual))})
                            </span>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            )}

            {/* Visualização em Tabela */}
            {visualizacao === 'tabela' && (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <th className="text-left py-3 px-2 font-semibold text-gray-900 dark:text-white">Investimento</th>
                      <th className="text-right py-3 px-2 font-semibold text-gray-900 dark:text-white">Saldo Final</th>
                      <th className="text-right py-3 px-2 font-semibold text-gray-900 dark:text-white">Juros Ganhos</th>
                      <th className="text-right py-3 px-2 font-semibold text-gray-900 dark:text-white">Rentabilidade</th>
                      <th className="text-right py-3 px-2 font-semibold text-gray-900 dark:text-white">ROI</th>
                      <th className="text-center py-3 px-2 font-semibold text-gray-900 dark:text-white">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {comparacoes.map((comparacao, index) => {
                      const ehMelhor = melhorInvestimento?.id === comparacao.id;
                      const roi = ((comparacao.resultado.saldoFinal / comparacao.resultado.totalInvestido - 1) * 100);
                      
                      return (
                        <motion.tr
                          key={comparacao.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.1 }}
                          className={`border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 ${
                            ehMelhor ? 'bg-yellow-50 dark:bg-yellow-900/10' : ''
                          }`}
                        >
                          <td className="py-3 px-2">
                            <div className="flex items-center space-x-3">
                              {ehMelhor && <Trophy className="w-4 h-4 text-yellow-500" />}
                              <div
                                className="w-3 h-3 rounded-full"
                                style={{ backgroundColor: comparacao.cor }}
                              />
                              <span className="font-medium text-gray-900 dark:text-white">
                                {comparacao.nome}
                              </span>
                            </div>
                          </td>
                          <td className="py-3 px-2 text-right font-semibold text-gray-900 dark:text-white">
                            {formatarMoeda(comparacao.resultado.saldoFinal)}
                          </td>
                          <td className="py-3 px-2 text-right font-semibold text-green-600 dark:text-green-400">
                            {formatarMoeda(comparacao.resultado.totalJuros)}
                          </td>
                          <td className="py-3 px-2 text-right font-semibold text-blue-600 dark:text-blue-400">
                            {formatarPercentual(comparacao.resultado.rentabilidadeTotal)}
                          </td>
                          <td className="py-3 px-2 text-right font-semibold text-purple-600 dark:text-purple-400">
                            {roi.toFixed(2)}%
                          </td>
                          <td className="py-3 px-2 text-center">
                            <button
                              onClick={() => onRemoverComparacao(comparacao.id)}
                              className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </td>
                        </motion.tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

            {/* Visualização de Métricas */}
            {visualizacao === 'metricas' && metricas && (
              <div className="space-y-6">
                {/* Métricas Principais */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
                    <div className="flex items-center space-x-2 mb-2">
                      <TrendingUp className="w-5 h-5 text-green-600" />
                      <span className="text-sm font-medium text-green-800 dark:text-green-200">Maior Saldo</span>
                    </div>
                    <p className="text-lg font-bold text-green-900 dark:text-green-100">
                      {formatarMoeda(metricas.maiorSaldo)}
                    </p>
                  </div>

                  <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                    <div className="flex items-center space-x-2 mb-2">
                      <Percent className="w-5 h-5 text-blue-600" />
                      <span className="text-sm font-medium text-blue-800 dark:text-blue-200">Rent. Média</span>
                    </div>
                    <p className="text-lg font-bold text-blue-900 dark:text-blue-100">
                      {formatarPercentual(metricas.rentabilidadeMedia)}
                    </p>
                  </div>

                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 p-4 rounded-lg border border-purple-200 dark:border-purple-800">
                    <div className="flex items-center space-x-2 mb-2">
                      <DollarSign className="w-5 h-5 text-purple-600" />
                      <span className="text-sm font-medium text-purple-800 dark:text-purple-200">Diferença Máx.</span>
                    </div>
                    <p className="text-lg font-bold text-purple-900 dark:text-purple-100">
                      {formatarMoeda(metricas.diferencaMaxima)}
                    </p>
                  </div>

                  <div className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 p-4 rounded-lg border border-orange-200 dark:border-orange-800">
                    <div className="flex items-center space-x-2 mb-2">
                      <Target className="w-5 h-5 text-orange-600" />
                      <span className="text-sm font-medium text-orange-800 dark:text-orange-200">Total Juros</span>
                    </div>
                    <p className="text-lg font-bold text-orange-900 dark:text-orange-100">
                      {formatarMoeda(metricas.totalJurosComparacoes)}
                    </p>
                  </div>
                </div>

                {/* Análise Comparativa */}
                <div className="bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20 p-6 rounded-lg border border-indigo-200 dark:border-indigo-800">
                  <h4 className="font-semibold text-indigo-900 dark:text-indigo-100 mb-4 flex items-center space-x-2">
                    <BarChart3 className="w-5 h-5" />
                    <span>Análise Comparativa Detalhada</span>
                  </h4>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h5 className="font-medium text-indigo-800 dark:text-indigo-200 mb-3">Performance</h5>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-indigo-700 dark:text-indigo-300">Melhor investimento:</span>
                          <span className="font-semibold text-indigo-900 dark:text-indigo-100">
                            {metricas.melhorROI?.nome}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-indigo-700 dark:text-indigo-300">Maior rentabilidade:</span>
                          <span className="font-semibold text-indigo-900 dark:text-indigo-100">
                            {formatarPercentual(metricas.maiorRentabilidade)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-indigo-700 dark:text-indigo-300">Menor rentabilidade:</span>
                          <span className="font-semibold text-indigo-900 dark:text-indigo-100">
                            {formatarPercentual(metricas.menorRentabilidade)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h5 className="font-medium text-indigo-800 dark:text-indigo-200 mb-3">Valores</h5>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-indigo-700 dark:text-indigo-300">Maior saldo final:</span>
                          <span className="font-semibold text-indigo-900 dark:text-indigo-100">
                            {formatarMoeda(metricas.maiorSaldo)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-indigo-700 dark:text-indigo-300">Menor saldo final:</span>
                          <span className="font-semibold text-indigo-900 dark:text-indigo-100">
                            {formatarMoeda(metricas.menorSaldo)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-indigo-700 dark:text-indigo-300">Diferença absoluta:</span>
                          <span className="font-semibold text-indigo-900 dark:text-indigo-100">
                            {formatarMoeda(metricas.diferencaMaxima)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Ranking de Performance */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
                    <Trophy className="w-5 h-5 text-yellow-500" />
                    <span>Ranking de Performance</span>
                  </h4>
                  
                  <div className="space-y-3">
                    {comparacoes
                      .sort((a, b) => b.resultado.saldoFinal - a.resultado.saldoFinal)
                      .map((comparacao, index) => (
                        <div key={comparacao.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                              index === 0 ? 'bg-yellow-100 text-yellow-800' :
                              index === 1 ? 'bg-gray-100 text-gray-800' :
                              'bg-orange-100 text-orange-800'
                            }`}>
                              {index + 1}
                            </div>
                            <div
                              className="w-3 h-3 rounded-full"
                              style={{ backgroundColor: comparacao.cor }}
                            />
                            <span className="font-medium text-gray-900 dark:text-white">
                              {comparacao.nome}
                            </span>
                          </div>
                          <div className="text-right">
                            <div className="font-semibold text-gray-900 dark:text-white">
                              {formatarMoeda(comparacao.resultado.saldoFinal)}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {formatarPercentual(comparacao.resultado.rentabilidadeTotal)}
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            )}

            {/* Resumo da Comparação */}
            {comparacoes.length > 1 && melhorInvestimento && (
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800"
              >
                <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2 flex items-center space-x-2">
                  <Trophy className="w-5 h-5 text-yellow-500" />
                  <span>Resumo da Comparação</span>
                </h4>
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  O investimento <strong>{melhorInvestimento.nome}</strong> apresenta o melhor resultado 
                  com saldo final de <strong>{formatarMoeda(melhorInvestimento.resultado.saldoFinal)}</strong> 
                  e rentabilidade de <strong>{formatarPercentual(melhorInvestimento.resultado.rentabilidadeTotal)}</strong>.
                  {metricas && (
                    <span className="block mt-2">
                      A diferença entre o melhor e pior investimento é de <strong>{formatarMoeda(metricas.diferencaMaxima)}</strong>, 
                      representando uma variação significativa na performance dos investimentos comparados.
                    </span>
                  )}
                </p>
              </motion.div>
            )}
          </>
        )}
      </div>
    </motion.div>
  );
});

export { ComparadorInvestimentos };
export default ComparadorInvestimentos;