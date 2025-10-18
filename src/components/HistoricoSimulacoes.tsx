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
  X
} from 'lucide-react';
import { useState } from 'react';
import { useHistorico, HistoricoItem } from '../hooks/useHistorico';
import { formatarMoeda } from '../utils/calculations';

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

  const [visualizacao, setVisualizacao] = useState<'lista' | 'favoritos' | 'estatisticas'>('lista');
  const [filtroTexto, setFiltroTexto] = useState('');
  const [itemEditando, setItemEditando] = useState<string | null>(null);
  const [novoNome, setNovoNome] = useState('');
  const [showFiltros, setShowFiltros] = useState(false);

  // Filtrar histórico por texto
  const historicoFiltrado = historico.filter(item =>
    item.nome.toLowerCase().includes(filtroTexto.toLowerCase()) ||
    item.simulacao.modalidade?.nome.toLowerCase().includes(filtroTexto.toLowerCase()) ||
    item.tags.some(tag => tag.toLowerCase().includes(filtroTexto.toLowerCase()))
  );

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
      className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
    >
      <div className="flex items-start justify-between mb-3">
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
        className="bg-white dark:bg-gray-900 rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <History className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Histórico de Simulações
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

          {visualizacao !== 'estatisticas' && (
            <div className="flex items-center space-x-2">
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
            </div>
          )}
        </div>

        {/* Filtros */}
        <AnimatePresence>
          {showFiltros && visualizacao !== 'estatisticas' && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="border-b border-gray-200 dark:border-gray-700 p-4 space-y-3"
            >
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
            </motion.div>
          )}
        </AnimatePresence>

        {/* Conteúdo */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {visualizacao === 'estatisticas' ? (
            renderizarEstatisticas()
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
        {historico.length > 0 && visualizacao !== 'estatisticas' && (
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