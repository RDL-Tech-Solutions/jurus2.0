// Componente Gerenciador de Atalhos de Teclado

import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Keyboard,
  Settings,
  Plus,
  Edit3,
  Trash2,
  Download,
  Upload,
  RotateCcw,
  Search,
  Filter,
  Eye,
  EyeOff,
  Play,
  Pause,
  Square,
  AlertTriangle,
  CheckCircle,
  Clock,
  BarChart3,
  Zap,
  Command,
  X,
  Save,
  Copy,
  Share2,
  HelpCircle,
  BookOpen,
  Target,
  Activity,
  TrendingUp,
  Users,
  Globe,
  Layers,
  Sliders,
  Monitor,
  Smartphone,
  Tablet
} from 'lucide-react';
import { AnimatedContainer, StaggeredContainer, AnimatedItem } from './AnimatedContainer';
import { AnimatedButton } from './AnimatedButton';
import useAtalhosTeclado, { AtalhoTeclado, ConfiguracaoAtalhos } from '../hooks/useAtalhosTeclado';

interface GerenciadorAtalhosProps {
  onFechar: () => void;
}

const GerenciadorAtalhos: React.FC<GerenciadorAtalhosProps> = ({ onFechar }) => {
  const {
    atalhos,
    configuracao,
    historico,
    teclasPressionadas,
    sequenciaTeclas,
    modoGravacao,
    atalhoEditando,
    tooltipVisivel,
    estatisticas,
    adicionarAtalho,
    removerAtalho,
    editarAtalho,
    alternarAtalho,
    definirContexto,
    limparHistorico,
    exportarAtalhos,
    importarAtalhos,
    resetarAtalhos,
    setConfiguracao,
    setModoGravacao,
    setAtalhoEditando
  } = useAtalhosTeclado();

  // Estados locais
  const [abaSelecionada, setAbaSelecionada] = useState<'atalhos' | 'configuracoes' | 'historico' | 'estatisticas'>('atalhos');
  const [filtroCategoria, setFiltroCategoria] = useState<string>('todos');
  const [busca, setBusca] = useState('');
  const [mostrarApenasPadrao, setMostrarApenasPadrao] = useState(false);
  const [mostrarApenasHabilitados, setMostrarApenasHabilitados] = useState(false);
  const [atalhoNovo, setAtalhoNovo] = useState<Partial<AtalhoTeclado>>({
    nome: '',
    descricao: '',
    teclas: [],
    categoria: 'personalizado',
    habilitado: true,
    prioridade: 1
  });
  const [modoEdicao, setModoEdicao] = useState(false);

  // Filtrar atalhos
  const atalhosFiltrados = atalhos.filter(atalho => {
    const matchCategoria = filtroCategoria === 'todos' || atalho.categoria === filtroCategoria;
    const matchBusca = atalho.nome.toLowerCase().includes(busca.toLowerCase()) ||
                      atalho.descricao.toLowerCase().includes(busca.toLowerCase()) ||
                      atalho.teclas.some(t => t.toLowerCase().includes(busca.toLowerCase()));
    const matchPadrao = !mostrarApenasPadrao || atalho.categoria !== 'personalizado';
    const matchHabilitado = !mostrarApenasHabilitados || atalho.habilitado;
    
    return matchCategoria && matchBusca && matchPadrao && matchHabilitado;
  });

  // Categorias disponíveis
  const categorias = [
    { id: 'todos', label: 'Todos', icon: Globe, count: atalhos.length },
    { id: 'navegacao', label: 'Navegação', icon: Target, count: atalhos.filter(a => a.categoria === 'navegacao').length },
    { id: 'calculo', label: 'Cálculo', icon: Activity, count: atalhos.filter(a => a.categoria === 'calculo').length },
    { id: 'edicao', label: 'Edição', icon: Edit3, count: atalhos.filter(a => a.categoria === 'edicao').length },
    { id: 'visualizacao', label: 'Visualização', icon: Eye, count: atalhos.filter(a => a.categoria === 'visualizacao').length },
    { id: 'sistema', label: 'Sistema', icon: Settings, count: atalhos.filter(a => a.categoria === 'sistema').length },
    { id: 'personalizado', label: 'Personalizado', icon: Users, count: atalhos.filter(a => a.categoria === 'personalizado').length }
  ];

  // Abas disponíveis
  const abas = [
    { id: 'atalhos', label: 'Atalhos', icon: Keyboard },
    { id: 'configuracoes', label: 'Configurações', icon: Settings },
    { id: 'historico', label: 'Histórico', icon: Clock },
    { id: 'estatisticas', label: 'Estatísticas', icon: BarChart3 }
  ];

  // Salvar atalho
  const salvarAtalho = useCallback(() => {
    if (atalhoNovo.nome && atalhoNovo.teclas && atalhoNovo.teclas.length > 0) {
      adicionarAtalho({
        nome: atalhoNovo.nome!,
        descricao: atalhoNovo.descricao || '',
        teclas: atalhoNovo.teclas!,
        categoria: atalhoNovo.categoria || 'personalizado',
        acao: () => console.log(`Executando atalho: ${atalhoNovo.nome}`),
        habilitado: atalhoNovo.habilitado || true,
        prioridade: atalhoNovo.prioridade || 1
      });
      
      setAtalhoNovo({
        nome: '',
        descricao: '',
        teclas: [],
        categoria: 'personalizado',
        habilitado: true,
        prioridade: 1
      });
      setModoEdicao(false);
    }
  }, [atalhoNovo, adicionarAtalho]);

  // Iniciar gravação de teclas
  const iniciarGravacao = useCallback(() => {
    setModoGravacao(true);
    setAtalhoNovo(prev => ({ ...prev, teclas: [] }));
  }, [setModoGravacao]);

  // Parar gravação de teclas
  const pararGravacao = useCallback(() => {
    setModoGravacao(false);
    if (sequenciaTeclas.length > 0) {
      setAtalhoNovo(prev => ({ ...prev, teclas: [...sequenciaTeclas] }));
    }
  }, [setModoGravacao, sequenciaTeclas]);

  // Importar arquivo de atalhos
  const handleImportar = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const arquivo = event.target.files?.[0];
    if (arquivo) {
      importarAtalhos(arquivo);
    }
  }, [importarAtalhos]);

  // Formatar teclas para exibição
  const formatarTeclas = useCallback((teclas: string[]): string => {
    const mapeamento: { [key: string]: string } = {
      'ctrl': 'Ctrl',
      'alt': 'Alt',
      'shift': 'Shift',
      'meta': 'Cmd',
      'enter': 'Enter',
      'space': 'Space',
      'esc': 'Esc',
      'tab': 'Tab',
      'backspace': 'Backspace',
      'delete': 'Delete',
      'up': '↑',
      'down': '↓',
      'left': '←',
      'right': '→'
    };
    
    return teclas.map(t => mapeamento[t.toLowerCase()] || t.toUpperCase()).join(' + ');
  }, []);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-7xl h-[90vh] flex flex-col overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Keyboard className="w-8 h-8" />
              <div>
                <h2 className="text-2xl font-bold">Gerenciador de Atalhos</h2>
                <p className="text-indigo-100">Configure e personalize atalhos de teclado</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              {/* Status de Gravação */}
              {modoGravacao && (
                <div className="flex items-center space-x-2 bg-red-500 bg-opacity-20 px-3 py-1 rounded-full">
                  <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse" />
                  <span className="text-sm">Gravando...</span>
                </div>
              )}
              
              {/* Teclas Pressionadas */}
              {teclasPressionadas.size > 0 && (
                <div className="flex items-center space-x-1 bg-white bg-opacity-20 px-3 py-1 rounded-full">
                  <Command className="w-4 h-4" />
                  <span className="text-sm">{formatarTeclas(Array.from(teclasPressionadas))}</span>
                </div>
              )}
              
              <AnimatedButton
                onClick={onFechar}
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10"
              >
                <X className="w-4 h-4" />
              </AnimatedButton>
            </div>
          </div>
        </div>

        {/* Navegação por Abas */}
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex space-x-8 px-6">
            {abas.map(aba => (
              <button
                key={aba.id}
                onClick={() => setAbaSelecionada(aba.id as any)}
                className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                  abaSelecionada === aba.id
                    ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                <div className="flex items-center">
                  <aba.icon className="w-4 h-4 mr-2" />
                  {aba.label}
                </div>
              </button>
            ))}
          </nav>
        </div>

        {/* Conteúdo */}
        <div className="flex-1 overflow-hidden">
          <AnimatePresence mode="wait">
            {abaSelecionada === 'atalhos' && (
              <motion.div
                key="atalhos"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="h-full flex"
              >
                {/* Sidebar com Filtros */}
                <div className="w-80 border-r border-gray-200 dark:border-gray-700 p-6 overflow-y-auto">
                  <div className="space-y-6">
                    {/* Busca */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Buscar Atalhos
                      </label>
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                          type="text"
                          placeholder="Nome, descrição ou teclas..."
                          value={busca}
                          onChange={(e) => setBusca(e.target.value)}
                          className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg"
                        />
                      </div>
                    </div>

                    {/* Filtros */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Filtros
                      </label>
                      <div className="space-y-2">
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={mostrarApenasPadrao}
                            onChange={(e) => setMostrarApenasPadrao(e.target.checked)}
                            className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                          />
                          <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                            Apenas padrão
                          </span>
                        </label>
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={mostrarApenasHabilitados}
                            onChange={(e) => setMostrarApenasHabilitados(e.target.checked)}
                            className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                          />
                          <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                            Apenas habilitados
                          </span>
                        </label>
                      </div>
                    </div>

                    {/* Categorias */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Categorias
                      </label>
                      <div className="space-y-1">
                        {categorias.map(categoria => (
                          <button
                            key={categoria.id}
                            onClick={() => setFiltroCategoria(categoria.id)}
                            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${
                              filtroCategoria === categoria.id
                                ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300'
                                : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700'
                            }`}
                          >
                            <div className="flex items-center">
                              <categoria.icon className="w-4 h-4 mr-2" />
                              {categoria.label}
                            </div>
                            <span className="text-xs bg-gray-200 dark:bg-gray-600 px-2 py-1 rounded-full">
                              {categoria.count}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Ações Rápidas */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Ações Rápidas
                      </label>
                      <div className="space-y-2">
                        <AnimatedButton
                          onClick={() => setModoEdicao(true)}
                          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
                          size="sm"
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Novo Atalho
                        </AnimatedButton>
                        
                        <AnimatedButton
                          onClick={exportarAtalhos}
                          variant="outline"
                          className="w-full"
                          size="sm"
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Exportar
                        </AnimatedButton>
                        
                        <label className="block">
                          <input
                            type="file"
                            accept=".json"
                            onChange={handleImportar}
                            className="hidden"
                          />
                          <AnimatedButton
                            variant="outline"
                            className="w-full cursor-pointer"
                            size="sm"
                          >
                            <Upload className="w-4 h-4 mr-2" />
                            Importar
                          </AnimatedButton>
                        </label>
                        
                        <AnimatedButton
                          onClick={resetarAtalhos}
                          variant="outline"
                          className="w-full text-red-600 border-red-300 hover:bg-red-50"
                          size="sm"
                        >
                          <RotateCcw className="w-4 h-4 mr-2" />
                          Resetar
                        </AnimatedButton>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Lista de Atalhos */}
                <div className="flex-1 overflow-y-auto p-6">
                  <div className="space-y-4">
                    {atalhosFiltrados.map(atalho => (
                      <AtalhoCard
                        key={atalho.id}
                        atalho={atalho}
                        onToggle={() => alternarAtalho(atalho.id)}
                        onEdit={() => {
                          setAtalhoEditando(atalho.id);
                          setModoEdicao(true);
                        }}
                        onDelete={() => removerAtalho(atalho.id)}
                        formatarTeclas={formatarTeclas}
                      />
                    ))}
                    
                    {atalhosFiltrados.length === 0 && (
                      <div className="text-center py-12">
                        <Keyboard className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                          Nenhum atalho encontrado
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400">
                          Tente ajustar os filtros ou criar um novo atalho
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {abaSelecionada === 'configuracoes' && (
              <motion.div
                key="configuracoes"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="h-full overflow-y-auto p-6"
              >
                <ConfiguracoesAtalhos
                  configuracao={configuracao}
                  onChange={setConfiguracao}
                />
              </motion.div>
            )}

            {abaSelecionada === 'historico' && (
              <motion.div
                key="historico"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="h-full overflow-y-auto p-6"
              >
                <HistoricoAtalhos
                  historico={historico}
                  atalhos={atalhos}
                  onLimpar={limparHistorico}
                  formatarTeclas={formatarTeclas}
                />
              </motion.div>
            )}

            {abaSelecionada === 'estatisticas' && (
              <motion.div
                key="estatisticas"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="h-full overflow-y-auto p-6"
              >
                <EstatisticasAtalhos
                  estatisticas={estatisticas}
                  atalhos={atalhos}
                  historico={historico}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Modal de Edição */}
        <AnimatePresence>
          {modoEdicao && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md"
              >
                <EditorAtalho
                  atalho={atalhoNovo}
                  modoGravacao={modoGravacao}
                  onSalvar={salvarAtalho}
                  onCancelar={() => {
                    setModoEdicao(false);
                    setAtalhoNovo({
                      nome: '',
                      descricao: '',
                      teclas: [],
                      categoria: 'personalizado',
                      habilitado: true,
                      prioridade: 1
                    });
                  }}
                  onChange={setAtalhoNovo}
                  onIniciarGravacao={iniciarGravacao}
                  onPararGravacao={pararGravacao}
                  formatarTeclas={formatarTeclas}
                />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tooltip de Atalho */}
        <AnimatePresence>
          {tooltipVisivel && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-4 py-2 rounded-lg shadow-lg z-50"
            >
              <div className="flex items-center space-x-2">
                <Zap className="w-4 h-4 text-yellow-400" />
                <span className="font-medium">{tooltipVisivel.atalho.nome}</span>
                <span className="text-gray-300">
                  {formatarTeclas(tooltipVisivel.atalho.teclas)}
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

// Componente Card de Atalho
const AtalhoCard: React.FC<{
  atalho: AtalhoTeclado;
  onToggle: () => void;
  onEdit: () => void;
  onDelete: () => void;
  formatarTeclas: (teclas: string[]) => string;
}> = ({ atalho, onToggle, onEdit, onDelete, formatarTeclas }) => {
  const getCategoriaIcon = (categoria: string) => {
    const icons = {
      navegacao: Target,
      calculo: Activity,
      edicao: Edit3,
      visualizacao: Eye,
      sistema: Settings,
      personalizado: Users
    };
    return icons[categoria as keyof typeof icons] || Globe;
  };

  const Icon = getCategoriaIcon(atalho.categoria);

  return (
    <div className={`border rounded-xl p-4 transition-all ${
      atalho.habilitado 
        ? 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800' 
        : 'border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 opacity-60'
    }`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            <Icon className="w-5 h-5 text-gray-500" />
            <h3 className="font-semibold text-gray-900 dark:text-white">{atalho.nome}</h3>
            <span className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">
              {atalho.categoria}
            </span>
            {atalho.contexto && (
              <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-2 py-1 rounded-full">
                {atalho.contexto}
              </span>
            )}
          </div>
          
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
            {atalho.descricao}
          </p>
          
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1 bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-lg">
              <Keyboard className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-mono">{formatarTeclas(atalho.teclas)}</span>
            </div>
            
            <span className="text-xs text-gray-500">
              Prioridade: {atalho.prioridade}
            </span>
          </div>
        </div>
        
        <div className="flex items-center space-x-2 ml-4">
          <button
            onClick={onToggle}
            className={`p-2 rounded-lg transition-colors ${
              atalho.habilitado
                ? 'text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20'
                : 'text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
          >
            {atalho.habilitado ? <CheckCircle className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
          </button>
          
          {atalho.categoria === 'personalizado' && (
            <>
              <button
                onClick={onEdit}
                className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
              >
                <Edit3 className="w-4 h-4" />
              </button>
              
              <button
                onClick={onDelete}
                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

// Componente Editor de Atalho (implementação simplificada)
const EditorAtalho: React.FC<{
  atalho: Partial<AtalhoTeclado>;
  modoGravacao: boolean;
  onSalvar: () => void;
  onCancelar: () => void;
  onChange: (atalho: Partial<AtalhoTeclado>) => void;
  onIniciarGravacao: () => void;
  onPararGravacao: () => void;
  formatarTeclas: (teclas: string[]) => string;
}> = ({ atalho, modoGravacao, onSalvar, onCancelar, onChange, onIniciarGravacao, onPararGravacao, formatarTeclas }) => (
  <div className="space-y-4">
    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
      {atalho.nome ? 'Editar Atalho' : 'Novo Atalho'}
    </h3>
    
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        Nome
      </label>
      <input
        type="text"
        value={atalho.nome || ''}
        onChange={(e) => onChange({ ...atalho, nome: e.target.value })}
        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg"
        placeholder="Nome do atalho"
      />
    </div>
    
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        Descrição
      </label>
      <textarea
        value={atalho.descricao || ''}
        onChange={(e) => onChange({ ...atalho, descricao: e.target.value })}
        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg"
        rows={2}
        placeholder="Descrição do atalho"
      />
    </div>
    
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        Teclas
      </label>
      <div className="flex items-center space-x-2">
        <div className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700">
          {atalho.teclas && atalho.teclas.length > 0 ? (
            <span className="font-mono">{formatarTeclas(atalho.teclas)}</span>
          ) : (
            <span className="text-gray-500">Nenhuma tecla definida</span>
          )}
        </div>
        
        <AnimatedButton
          onClick={modoGravacao ? onPararGravacao : onIniciarGravacao}
          variant={modoGravacao ? "outline" : "primary"}
          className={modoGravacao ? "border-red-300 text-red-600" : "bg-blue-600 hover:bg-blue-700 text-white"}
        >
          {modoGravacao ? <Square className="w-4 h-4" /> : <Play className="w-4 h-4" />}
        </AnimatedButton>
      </div>
      {modoGravacao && (
        <p className="text-xs text-red-600 mt-1">
          Pressione as teclas que deseja usar para este atalho
        </p>
      )}
    </div>
    
    <div className="flex items-center justify-end space-x-3 pt-4">
      <AnimatedButton onClick={onCancelar} variant="outline">
        Cancelar
      </AnimatedButton>
      <AnimatedButton
        onClick={onSalvar}
        className="bg-blue-600 hover:bg-blue-700 text-white"
        disabled={!atalho.nome || !atalho.teclas || atalho.teclas.length === 0}
      >
        Salvar
      </AnimatedButton>
    </div>
  </div>
);

// Componente de Configurações (implementação simplificada)
const ConfiguracoesAtalhos: React.FC<{
  configuracao: ConfiguracaoAtalhos;
  onChange: (config: ConfiguracaoAtalhos) => void;
}> = ({ configuracao, onChange }) => (
  <div className="max-w-2xl mx-auto space-y-6">
    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
      Configurações de Atalhos
    </h3>
    
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="font-medium text-gray-900 dark:text-white">Atalhos Habilitados</h4>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Ativar ou desativar todos os atalhos
          </p>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={configuracao.habilitados}
            onChange={(e) => onChange({ ...configuracao, habilitados: e.target.checked })}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
        </label>
      </div>
      
      <div className="flex items-center justify-between">
        <div>
          <h4 className="font-medium text-gray-900 dark:text-white">Mostrar Tooltips</h4>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Exibir notificações quando atalhos são executados
          </p>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={configuracao.mostrarTooltips}
            onChange={(e) => onChange({ ...configuracao, mostrarTooltips: e.target.checked })}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
        </label>
      </div>
    </div>
  </div>
);

// Componente de Histórico (implementação simplificada)
const HistoricoAtalhos: React.FC<{
  historico: any[];
  atalhos: AtalhoTeclado[];
  onLimpar: () => void;
  formatarTeclas: (teclas: string[]) => string;
}> = ({ historico, atalhos, onLimpar, formatarTeclas }) => (
  <div className="max-w-4xl mx-auto space-y-6">
    <div className="flex items-center justify-between">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
        Histórico de Atalhos
      </h3>
      <AnimatedButton onClick={onLimpar} variant="outline" className="text-red-600 border-red-300">
        <Trash2 className="w-4 h-4 mr-2" />
        Limpar Histórico
      </AnimatedButton>
    </div>
    
    <div className="space-y-2">
      {historico.slice(-20).reverse().map((item, index) => {
        const atalho = atalhos.find(a => a.id === item.id);
        return (
          <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className={`w-2 h-2 rounded-full ${item.sucesso ? 'bg-green-500' : 'bg-red-500'}`} />
              <span className="font-medium">{atalho?.nome || 'Atalho removido'}</span>
              <span className="text-sm text-gray-500 font-mono">
                {formatarTeclas(item.teclas)}
              </span>
            </div>
            <span className="text-xs text-gray-500">
              {new Date(item.timestamp).toLocaleTimeString()}
            </span>
          </div>
        );
      })}
    </div>
  </div>
);

// Componente de Estatísticas (implementação simplificada)
const EstatisticasAtalhos: React.FC<{
  estatisticas: any;
  atalhos: AtalhoTeclado[];
  historico: any[];
}> = ({ estatisticas, atalhos, historico }) => (
  <div className="max-w-4xl mx-auto space-y-6">
    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
      Estatísticas de Uso
    </h3>
    
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl">
        <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
          {estatisticas.totalAtalhos}
        </div>
        <div className="text-sm text-blue-600 dark:text-blue-400">Total de Atalhos</div>
      </div>
      
      <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-xl">
        <div className="text-2xl font-bold text-green-600 dark:text-green-400">
          {estatisticas.atalhosHabilitados}
        </div>
        <div className="text-sm text-green-600 dark:text-green-400">Habilitados</div>
      </div>
      
      <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-xl">
        <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
          {estatisticas.atalhosPersonalizados}
        </div>
        <div className="text-sm text-purple-600 dark:text-purple-400">Personalizados</div>
      </div>
      
      <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-xl">
        <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
          {estatisticas.usoRecente}
        </div>
        <div className="text-sm text-orange-600 dark:text-orange-400">Usados Hoje</div>
      </div>
    </div>
  </div>
);

export default GerenciadorAtalhos;