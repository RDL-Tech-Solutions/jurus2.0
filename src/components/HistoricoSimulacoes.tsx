import { motion, AnimatePresence } from 'framer-motion';
import { 
  History, 
  Star, 
  StarOff, 
  Trash2, 
  Copy, 
  Edit3, 
  Filter, 
  SortAsc, 
  Calendar,
  DollarSign,
  Tag,
  BarChart3,
  Search,
  X,
  Download,
  FileText,
  FileSpreadsheet,
  CheckSquare,
  Square,
  TrendingUp,
  LineChart as LineChartIcon
} from 'lucide-react';
import { useState } from 'react';
import { useHistorico, HistoricoItem } from '../hooks/useHistorico';
import { formatarMoeda } from '../utils/calculations';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';

interface HistoricoSimulacoesProps {
  onCarregarSimulacao: (item: HistoricoItem) => void;
  onFechar: () => void;
}

export function HistoricoSimulacoes({ onCarregarSimulacao, onFechar }: HistoricoSimulacoesProps) {
  const {
    historico,
    favoritos,
    todasAsTags,
    estatisticas,
    filtroTags,
    ordenacao,
    adicionarAoHistorico,
    removerDoHistorico,
    alternarFavorito,
    atualizarNome,
    atualizarTags,
    limparHistorico,
    duplicarSimulacao,
    setFiltroTags,
    setOrdenacao
  } = useHistorico();

  const [visualizacao, setVisualizacao] = useState<'lista' | 'favoritos' | 'estatisticas' | 'grafico' | 'comparacao'>('lista');
  const [filtroTexto, setFiltroTexto] = useState('');
  const [itemEditando, setItemEditando] = useState<string | null>(null);
  const [novoNome, setNovoNome] = useState('');
  const [showFiltros, setShowFiltros] = useState(false);
  const [showExportacao, setShowExportacao] = useState(false);
  
  // Novos filtros
  const [filtroDataInicio, setFiltroDataInicio] = useState('');
  const [filtroDataFim, setFiltroDataFim] = useState('');
  const [filtroModalidade, setFiltroModalidade] = useState('todas');
  const [filtroValorMin, setFiltroValorMin] = useState('');
  const [filtroValorMax, setFiltroValorMax] = useState('');
  
  // Comparação
  const [simulacoesSelecionadas, setSimulacoesSelecionadas] = useState<string[]>([]);
  const [modoSelecao, setModoSelecao] = useState(false);

  // Obter modalidades únicas
  const modalidadesUnicas = Array.from(new Set(historico.map(item => item.simulacao.modalidade?.nome).filter(Boolean)));

  // Filtrar histórico com todos os filtros
  const historicoFiltrado = historico.filter(item => {
    // Filtro de texto
    const textoMatch = item.nome.toLowerCase().includes(filtroTexto.toLowerCase()) ||
      item.simulacao.modalidade?.nome.toLowerCase().includes(filtroTexto.toLowerCase()) ||
      item.tags.some(tag => tag.toLowerCase().includes(filtroTexto.toLowerCase()));
    
    // Filtro de data
    const dataItem = new Date(item.dataSimulacao);
    const dataInicioMatch = !filtroDataInicio || dataItem >= new Date(filtroDataInicio);
    const dataFimMatch = !filtroDataFim || dataItem <= new Date(filtroDataFim);
    
    // Filtro de modalidade
    const modalidadeMatch = filtroModalidade === 'todas' || item.simulacao.modalidade?.nome === filtroModalidade;
    
    // Filtro de valor
    const valorFinal = item.resultado.saldoFinal;
    const valorMinMatch = !filtroValorMin || valorFinal >= parseFloat(filtroValorMin);
    const valorMaxMatch = !filtroValorMax || valorFinal <= parseFloat(filtroValorMax);
    
    // Filtro de tags
    const tagsMatch = filtroTags.length === 0 || filtroTags.some(tag => item.tags.includes(tag));
    
    return textoMatch && dataInicioMatch && dataFimMatch && modalidadeMatch && valorMinMatch && valorMaxMatch && tagsMatch;
  });

  // Função de exportação
  const exportarDados = (formato: 'json' | 'csv') => {
    const dadosParaExportar = historicoFiltrado.map(item => ({
      nome: item.nome,
      data: new Date(item.dataSimulacao).toLocaleDateString(),
      modalidade: item.simulacao.modalidade?.nome || '',
      valorInicial: item.simulacao.valorInicial,
      valorMensal: item.simulacao.valorMensal,
      periodo: item.simulacao.periodo,
      taxa: item.simulacao.taxaPersonalizada || item.simulacao.modalidade?.taxaAnual || 0,
      saldoFinal: item.resultado.saldoFinal,
      totalInvestido: item.resultado.totalInvestido,
      totalJuros: item.resultado.totalJuros,
      rentabilidade: item.resultado.rentabilidadeTotal,
      tags: item.tags.join(', '),
      favorito: item.isFavorito
    }));

    if (formato === 'json') {
      const dataStr = JSON.stringify(dadosParaExportar, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `historico_simulacoes_${new Date().toISOString().split('T')[0]}.json`;
      link.click();
      URL.revokeObjectURL(url);
    } else if (formato === 'csv') {
      const headers = Object.keys(dadosParaExportar[0] || {});
      const csvContent = [
        headers.join(','),
        ...dadosParaExportar.map(row => 
          headers.map(header => `"${row[header as keyof typeof row]}"`).join(',')
        )
      ].join('\n');
      
      const dataBlob = new Blob([csvContent], { type: 'text/csv' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `historico_simulacoes_${new Date().toISOString().split('T')[0]}.csv`;
      link.click();
      URL.revokeObjectURL(url);
    }
    
    setShowExportacao(false);
  };

  // Dados para gráfico
  const dadosGrafico = historicoFiltrado
    .sort((a, b) => new Date(a.dataSimulacao).getTime() - new Date(b.dataSimulacao).getTime())
    .map((item, index) => ({
      nome: `Sim ${index + 1}`,
      saldoFinal: item.resultado.saldoFinal,
      totalInvestido: item.resultado.totalInvestido,
      juros: item.resultado.totalJuros,
      rentabilidade: item.resultado.rentabilidadeTotal,
      data: new Date(item.dataSimulacao).toLocaleDateString()
    }));

  // Funções de seleção para comparação
  const toggleSelecao = (id: string) => {
    setSimulacoesSelecionadas(prev => 
      prev.includes(id) 
        ? prev.filter(simId => simId !== id)
        : [...prev, id]
    );
  };

  const limparSelecao = () => {
    setSimulacoesSelecionadas([]);
    setModoSelecao(false);
  };

  const handleEditarNome = (item: HistoricoItem) => {
    setItemEditando(item.id);
    setNovoNome(item.nome);
  };

  const handleSalvarNome = () => {
    if (itemEditando && novoNome.trim()) {
      atualizarNome(itemEditando, novoNome.trim());
      setItemEditando(null);
      setNovoNome('');
    }
  };

  const handleCancelarEdicao = () => {
    setItemEditando(null);
    setNovoNome('');
  };

  const handleDuplicar = (item: HistoricoItem) => {
    duplicarSimulacao(item.id);
  };

  const limparFiltros = () => {
    setFiltroTexto('');
    setFiltroDataInicio('');
    setFiltroDataFim('');
    setFiltroModalidade('todas');
    setFiltroValorMin('');
    setFiltroValorMax('');
    setFiltroTags([]);
  };

  const renderizarComparacao = () => {
    const simulacoesComparacao = historico.filter(item => simulacoesSelecionadas.includes(item.id));
    
    if (simulacoesComparacao.length === 0) {
      return (
        <div className="text-center py-12">
          <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            Selecione simulações para comparar
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Ative o modo de seleção e escolha as simulações que deseja comparar
          </p>
        </div>
      );
    }

    const dadosComparacao = simulacoesComparacao.map((item, index) => ({
      nome: item.nome,
      saldoFinal: item.resultado.saldoFinal,
      totalInvestido: item.resultado.totalInvestido,
      juros: item.resultado.totalJuros,
      rentabilidade: item.resultado.rentabilidadeTotal,
      periodo: item.simulacao.periodo,
      valorMensal: item.simulacao.valorMensal
    }));

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Comparação de Simulações ({simulacoesComparacao.length})
          </h3>
          <button
            onClick={limparSelecao}
            className="text-red-600 hover:text-red-700 text-sm font-medium"
          >
            Limpar Seleção
          </button>
        </div>

        {/* Gráfico de comparação */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <h4 className="font-medium text-gray-900 dark:text-white mb-4">Comparação de Resultados</h4>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dadosComparacao}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="nome" />
              <YAxis />
              <Tooltip formatter={(value: number) => formatarMoeda(value)} />
              <Legend />
              <Bar dataKey="saldoFinal" fill="#3B82F6" name="Saldo Final" />
              <Bar dataKey="totalInvestido" fill="#10B981" name="Total Investido" />
              <Bar dataKey="juros" fill="#F59E0B" name="Juros" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Tabela de comparação */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Simulação
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Saldo Final
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Total Investido
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Juros
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Rentabilidade
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Período
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                {dadosComparacao.map((item, index) => (
                  <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">
                      {item.nome}
                    </td>
                    <td className="px-4 py-3 text-sm text-green-600 dark:text-green-400 font-semibold">
                      {formatarMoeda(item.saldoFinal)}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                      {formatarMoeda(item.totalInvestido)}
                    </td>
                    <td className="px-4 py-3 text-sm text-blue-600 dark:text-blue-400">
                      {formatarMoeda(item.juros)}
                    </td>
                    <td className="px-4 py-3 text-sm text-purple-600 dark:text-purple-400">
                      {item.rentabilidade.toFixed(2)}%
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                      {item.periodo} meses
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  const renderizarGrafico = () => (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
        <h4 className="font-medium text-gray-900 dark:text-white mb-4">Evolução dos Resultados</h4>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={dadosGrafico}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="nome" />
            <YAxis />
            <Tooltip 
              formatter={(value: number, name: string) => [formatarMoeda(value), name]}
              labelFormatter={(label) => `Simulação: ${label}`}
            />
            <Legend />
            <Line type="monotone" dataKey="saldoFinal" stroke="#3B82F6" name="Saldo Final" strokeWidth={2} />
            <Line type="monotone" dataKey="totalInvestido" stroke="#10B981" name="Total Investido" strokeWidth={2} />
            <Line type="monotone" dataKey="juros" stroke="#F59E0B" name="Juros" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
        <h4 className="font-medium text-gray-900 dark:text-white mb-4">Rentabilidade por Simulação</h4>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={dadosGrafico}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="nome" />
            <YAxis />
            <Tooltip formatter={(value: number) => `${value.toFixed(2)}%`} />
            <Bar dataKey="rentabilidade" fill="#8B5CF6" name="Rentabilidade %" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );

  const renderizarEstatisticas = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {estatisticas.totalSimulacoes}
          </div>
          <div className="text-sm text-blue-600 dark:text-blue-400">
            Total de Simulações
          </div>
        </div>

        <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
          <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
            {estatisticas.totalFavoritos}
          </div>
          <div className="text-sm text-yellow-600 dark:text-yellow-400">
            Favoritos
          </div>
        </div>

        <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">
            {formatarMoeda(estatisticas.maiorSaldo)}
          </div>
          <div className="text-sm text-green-600 dark:text-green-400">
            Maior Saldo
          </div>
        </div>

        <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
          <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
            {Math.round(estatisticas.periodoMedio)}m
          </div>
          <div className="text-sm text-purple-600 dark:text-purple-400">
            Período Médio
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
        <h4 className="font-semibold text-gray-900 dark:text-white mb-4">
          Análise Detalhada
        </h4>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">Saldo Médio:</span>
            <span className="font-medium">{formatarMoeda(estatisticas.saldoMedio)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">Menor Saldo:</span>
            <span className="font-medium">{formatarMoeda(estatisticas.menorSaldo)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">Modalidade Preferida:</span>
            <span className="font-medium">{estatisticas.modalidadeMaisUsada}</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderizarItem = (item: HistoricoItem) => (
    <motion.div
      key={item.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`bg-white dark:bg-gray-800 p-4 rounded-lg border transition-all ${
        simulacoesSelecionadas.includes(item.id)
          ? 'border-blue-500 ring-2 ring-blue-200 dark:ring-blue-800'
          : 'border-gray-200 dark:border-gray-700 hover:shadow-md'
      }`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-3 flex-1">
          {modoSelecao && (
            <button
              onClick={() => toggleSelecao(item.id)}
              className="text-blue-600 hover:text-blue-700"
            >
              {simulacoesSelecionadas.includes(item.id) ? (
                <CheckSquare className="w-5 h-5" />
              ) : (
                <Square className="w-5 h-5" />
              )}
            </button>
          )}
          
          <div className="flex-1">
            {itemEditando === item.id ? (
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={novoNome}
                  onChange={(e) => setNovoNome(e.target.value)}
                  className="flex-1 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm bg-white dark:bg-gray-700"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSalvarNome();
                    if (e.key === 'Escape') handleCancelarEdicao();
                  }}
                  autoFocus
                />
                <button
                  onClick={handleSalvarNome}
                  className="text-green-600 hover:text-green-700 p-1"
                >
                  ✓
                </button>
                <button
                  onClick={handleCancelarEdicao}
                  className="text-red-600 hover:text-red-700 p-1"
                >
                  ✕
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <h4 className="font-medium text-gray-900 dark:text-white">
                  {item.nome}
                </h4>
                <button
                  onClick={() => handleEditarNome(item)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <Edit3 className="w-3 h-3" />
                </button>
              </div>
            )}
            
            <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {new Date(item.dataSimulacao).toLocaleDateString()} • {item.simulacao.modalidade?.nome}
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => alternarFavorito(item.id)}
            className={`p-1 rounded ${
              item.isFavorito 
                ? 'text-yellow-500 hover:text-yellow-600' 
                : 'text-gray-400 hover:text-yellow-500'
            }`}
          >
            {item.isFavorito ? <Star className="w-4 h-4 fill-current" /> : <StarOff className="w-4 h-4" />}
          </button>
          
          <button
            onClick={() => handleDuplicar(item)}
            className="text-gray-400 hover:text-blue-600 p-1"
            title="Duplicar simulação"
          >
            <Copy className="w-4 h-4" />
          </button>
          
          <button
            onClick={() => removerDoHistorico(item.id)}
            className="text-gray-400 hover:text-red-600 p-1"
            title="Remover do histórico"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-3 text-sm">
        <div>
          <span className="text-gray-600 dark:text-gray-400">Saldo Final:</span>
          <div className="font-semibold text-green-600 dark:text-green-400">
            {formatarMoeda(item.resultado.saldoFinal)}
          </div>
        </div>
        <div>
          <span className="text-gray-600 dark:text-gray-400">Período:</span>
          <div className="font-medium">
            {item.simulacao.periodo} meses
          </div>
        </div>
        <div>
          <span className="text-gray-600 dark:text-gray-400">Aporte:</span>
          <div className="font-medium">
            {formatarMoeda(item.simulacao.valorMensal)}
          </div>
        </div>
        <div>
          <span className="text-gray-600 dark:text-gray-400">Rentabilidade:</span>
          <div className="font-medium text-blue-600 dark:text-blue-400">
            {item.resultado.rentabilidadeTotal.toFixed(2)}%
          </div>
        </div>
      </div>

      {item.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {item.tags.map(tag => (
            <span
              key={tag}
              className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      <button
        onClick={() => onCarregarSimulacao(item)}
        className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors"
      >
        Carregar Simulação
      </button>
    </motion.div>
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
            <History className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Histórico de Simulações
            </h2>
          </div>
          <div className="flex items-center space-x-2">
            {/* Botão de exportação */}
            <div className="relative">
              <button
                onClick={() => setShowExportacao(!showExportacao)}
                className="flex items-center space-x-2 px-3 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm font-medium transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>Exportar</span>
              </button>
              
              {showExportacao && (
                <div className="absolute right-0 top-full mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-10 min-w-[150px]">
                  <button
                    onClick={() => exportarDados('json')}
                    className="flex items-center space-x-2 w-full px-4 py-2 text-left hover:bg-gray-50 dark:hover:bg-gray-700 text-sm"
                  >
                    <FileText className="w-4 h-4" />
                    <span>JSON</span>
                  </button>
                  <button
                    onClick={() => exportarDados('csv')}
                    className="flex items-center space-x-2 w-full px-4 py-2 text-left hover:bg-gray-50 dark:hover:bg-gray-700 text-sm"
                  >
                    <FileSpreadsheet className="w-4 h-4" />
                    <span>CSV</span>
                  </button>
                </div>
              )}
            </div>
            
            <button
              onClick={onFechar}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Navegação */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex space-x-1">
            <button
              onClick={() => setVisualizacao('lista')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                visualizacao === 'lista'
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              Lista ({historico.length})
            </button>
            <button
              onClick={() => setVisualizacao('favoritos')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                visualizacao === 'favoritos'
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              Favoritos ({favoritos.length})
            </button>
            <button
              onClick={() => setVisualizacao('grafico')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                visualizacao === 'grafico'
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              <LineChartIcon className="w-4 h-4 inline mr-1" />
              Gráfico
            </button>
            <button
              onClick={() => setVisualizacao('comparacao')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                visualizacao === 'comparacao'
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              <TrendingUp className="w-4 h-4 inline mr-1" />
              Comparar
            </button>
            <button
              onClick={() => setVisualizacao('estatisticas')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                visualizacao === 'estatisticas'
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              <BarChart3 className="w-4 h-4 inline mr-1" />
              Estatísticas
            </button>
          </div>

          <div className="flex items-center space-x-2">
            {(visualizacao === 'lista' || visualizacao === 'favoritos') && (
              <>
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Buscar simulações..."
                    value={filtroTexto}
                    onChange={(e) => setFiltroTexto(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-800"
                  />
                </div>
                
                <button
                  onClick={() => setShowFiltros(!showFiltros)}
                  className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <Filter className="w-4 h-4" />
                </button>
              </>
            )}

            {visualizacao === 'comparacao' && (
              <button
                onClick={() => setModoSelecao(!modoSelecao)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  modoSelecao
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                }`}
              >
                {modoSelecao ? 'Cancelar Seleção' : 'Selecionar'}
              </button>
            )}
          </div>
        </div>

        {/* Filtros Avançados */}
        <AnimatePresence>
          {showFiltros && (visualizacao === 'lista' || visualizacao === 'favoritos') && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="border-b border-gray-200 dark:border-gray-700 p-4 space-y-4"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {/* Filtro de data */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Data Início
                  </label>
                  <input
                    type="date"
                    value={filtroDataInicio}
                    onChange={(e) => setFiltroDataInicio(e.target.value)}
                    className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-1 text-sm bg-white dark:bg-gray-800"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Data Fim
                  </label>
                  <input
                    type="date"
                    value={filtroDataFim}
                    onChange={(e) => setFiltroDataFim(e.target.value)}
                    className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-1 text-sm bg-white dark:bg-gray-800"
                  />
                </div>

                {/* Filtro de modalidade */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Modalidade
                  </label>
                  <select
                    value={filtroModalidade}
                    onChange={(e) => setFiltroModalidade(e.target.value)}
                    className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-1 text-sm bg-white dark:bg-gray-800"
                  >
                    <option value="todas">Todas</option>
                    {modalidadesUnicas.map(modalidade => (
                      <option key={modalidade} value={modalidade}>{modalidade}</option>
                    ))}
                  </select>
                </div>

                {/* Filtro de valor */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Valor Mín.
                  </label>
                  <input
                    type="number"
                    placeholder="0"
                    value={filtroValorMin}
                    onChange={(e) => setFiltroValorMin(e.target.value)}
                    className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-1 text-sm bg-white dark:bg-gray-800"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Valor Máx.
                  </label>
                  <input
                    type="number"
                    placeholder="∞"
                    value={filtroValorMax}
                    onChange={(e) => setFiltroValorMax(e.target.value)}
                    className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-1 text-sm bg-white dark:bg-gray-800"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <SortAsc className="w-4 h-4 text-gray-400" />
                    <select
                      value={ordenacao}
                      onChange={(e) => setOrdenacao(e.target.value as any)}
                      className="border border-gray-300 dark:border-gray-600 rounded px-3 py-1 text-sm bg-white dark:bg-gray-800"
                    >
                      <option value="data">Data</option>
                      <option value="nome">Nome</option>
                      <option value="valor">Valor</option>
                    </select>
                  </div>

                  {todasAsTags.length > 0 && (
                    <div className="flex items-center space-x-2">
                      <Tag className="w-4 h-4 text-gray-400" />
                      <select
                        multiple
                        value={filtroTags}
                        onChange={(e) => setFiltroTags(Array.from(e.target.selectedOptions, option => option.value))}
                        className="border border-gray-300 dark:border-gray-600 rounded px-3 py-1 text-sm bg-white dark:bg-gray-800"
                      >
                        {todasAsTags.map(tag => (
                          <option key={tag} value={tag}>{tag}</option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>

                <button
                  onClick={limparFiltros}
                  className="text-red-600 hover:text-red-700 text-sm font-medium"
                >
                  Limpar Filtros
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Modo de seleção para comparação */}
        {visualizacao === 'comparacao' && (
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setModoSelecao(!modoSelecao)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  modoSelecao
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                }`}
              >
                {modoSelecao ? 'Cancelar Seleção' : 'Selecionar Simulações'}
              </button>
              
              {simulacoesSelecionadas.length > 0 && (
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {simulacoesSelecionadas.length} simulação(ões) selecionada(s)
                </div>
              )}
            </div>
          </div>
        )}

        {/* Conteúdo */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {visualizacao === 'estatisticas' ? (
            renderizarEstatisticas()
          ) : visualizacao === 'grafico' ? (
            renderizarGrafico()
          ) : visualizacao === 'comparacao' ? (
            renderizarComparacao()
          ) : (
            <div className="space-y-4">
              {visualizacao === 'lista' && (
                <AnimatePresence>
                  {historicoFiltrado.length > 0 ? (
                    historicoFiltrado.map(renderizarItem)
                  ) : (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-center py-12"
                    >
                      <History className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                        Nenhuma simulação encontrada
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        {filtroTexto ? 'Tente ajustar os filtros de busca' : 'Faça sua primeira simulação para começar o histórico'}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              )}

              {visualizacao === 'favoritos' && (
                <AnimatePresence>
                  {favoritos.length > 0 ? (
                    favoritos.map(renderizarItem)
                  ) : (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-center py-12"
                    >
                      <Star className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                        Nenhum favorito ainda
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        Marque simulações como favoritas para acesso rápido
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        {historico.length > 0 && visualizacao !== 'estatisticas' && visualizacao !== 'grafico' && visualizacao !== 'comparacao' && (
          <div className="flex items-center justify-between p-4 border-t border-gray-200 dark:border-gray-700">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {historicoFiltrado.length} de {historico.length} simulações
            </div>
            <button
              onClick={limparHistorico}
              className="text-red-600 hover:text-red-700 text-sm font-medium"
            >
              Limpar Histórico
            </button>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}

export default HistoricoSimulacoes;