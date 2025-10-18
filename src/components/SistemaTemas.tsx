// Sistema de Temas Personalizáveis

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Palette,
  Sun,
  Moon,
  Monitor,
  Eye,
  EyeOff,
  Download,
  Upload,
  Save,
  RotateCcw,
  Brush,
  Droplet,
  Zap,
  Sparkles,
  Settings,
  Check,
  X,
  Plus,
  Trash2,
  Edit3,
  Copy,
  Share2,
  Heart,
  Star,
  Contrast,
  Type,
  Layout,
  Grid,
  Sliders,
  Palette as Wheel,
  Paintbrush,
  Pipette,
  Layers,
  Filter,
  Maximize,
  Minimize
} from 'lucide-react';
import { AnimatedContainer, StaggeredContainer, AnimatedItem } from './AnimatedContainer';
import { AnimatedButton } from './AnimatedButton';

interface Tema {
  id: string;
  nome: string;
  descricao: string;
  autor?: string;
  categoria: 'claro' | 'escuro' | 'colorido' | 'minimalista' | 'profissional' | 'personalizado';
  cores: {
    primaria: string;
    secundaria: string;
    acento: string;
    fundo: string;
    superficie: string;
    texto: string;
    textoSecundario: string;
    borda: string;
    sucesso: string;
    aviso: string;
    erro: string;
    info: string;
  };
  tipografia: {
    fontePrimaria: string;
    fonteSecundaria: string;
    tamanhoBase: number;
    espacamento: number;
    alturaLinha: number;
  };
  espacamento: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
  bordas: {
    raio: string;
    largura: string;
  };
  sombras: {
    pequena: string;
    media: string;
    grande: string;
  };
  animacoes: {
    duracao: string;
    easing: string;
    habilitadas: boolean;
  };
  personalizado?: boolean;
  favorito?: boolean;
  dataCreacao?: string;
  ultimaModificacao?: string;
}

interface ConfiguracaoTema {
  temaAtivo: string;
  modoEscuroAutomatico: boolean;
  horarioModoEscuro: { inicio: string; fim: string };
  transicaoSuave: boolean;
  salvarPreferencia: boolean;
  sincronizarSistema: boolean;
}

const SistemaTemas: React.FC<{
  onFechar: () => void;
}> = ({ onFechar }) => {
  // Estados
  const [temas, setTemas] = useState<Tema[]>([]);
  const [temaAtivo, setTemaAtivo] = useState<string>('padrao');
  const [configuracao, setConfiguracao] = useState<ConfiguracaoTema>({
    temaAtivo: 'padrao',
    modoEscuroAutomatico: false,
    horarioModoEscuro: { inicio: '18:00', fim: '06:00' },
    transicaoSuave: true,
    salvarPreferencia: true,
    sincronizarSistema: true
  });
  const [abaSelecionada, setAbaSelecionada] = useState<'galeria' | 'editor' | 'configuracoes' | 'importar'>('galeria');
  const [temaEditando, setTemaEditando] = useState<Tema | null>(null);
  const [modoPreview, setModoPreview] = useState(false);
  const [filtroCategoria, setFiltroCategoria] = useState<string>('todos');
  const [busca, setBusca] = useState('');

  // Temas predefinidos
  const temasPredefinidos: Tema[] = [
    {
      id: 'padrao',
      nome: 'Padrão',
      descricao: 'Tema padrão do sistema com cores equilibradas',
      categoria: 'profissional',
      cores: {
        primaria: '#3B82F6',
        secundaria: '#6366F1',
        acento: '#8B5CF6',
        fundo: '#FFFFFF',
        superficie: '#F8FAFC',
        texto: '#1F2937',
        textoSecundario: '#6B7280',
        borda: '#E5E7EB',
        sucesso: '#10B981',
        aviso: '#F59E0B',
        erro: '#EF4444',
        info: '#3B82F6'
      },
      tipografia: {
        fontePrimaria: 'Inter, system-ui, sans-serif',
        fonteSecundaria: 'JetBrains Mono, monospace',
        tamanhoBase: 16,
        espacamento: 0,
        alturaLinha: 1.5
      },
      espacamento: {
        xs: '0.25rem',
        sm: '0.5rem',
        md: '1rem',
        lg: '1.5rem',
        xl: '2rem'
      },
      bordas: {
        raio: '0.5rem',
        largura: '1px'
      },
      sombras: {
        pequena: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        media: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        grande: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
      },
      animacoes: {
        duracao: '200ms',
        easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
        habilitadas: true
      }
    },
    {
      id: 'escuro',
      nome: 'Modo Escuro',
      descricao: 'Tema escuro elegante para reduzir o cansaço visual',
      categoria: 'escuro',
      cores: {
        primaria: '#60A5FA',
        secundaria: '#818CF8',
        acento: '#A78BFA',
        fundo: '#111827',
        superficie: '#1F2937',
        texto: '#F9FAFB',
        textoSecundario: '#D1D5DB',
        borda: '#374151',
        sucesso: '#34D399',
        aviso: '#FBBF24',
        erro: '#F87171',
        info: '#60A5FA'
      },
      tipografia: {
        fontePrimaria: 'Inter, system-ui, sans-serif',
        fonteSecundaria: 'JetBrains Mono, monospace',
        tamanhoBase: 16,
        espacamento: 0,
        alturaLinha: 1.5
      },
      espacamento: {
        xs: '0.25rem',
        sm: '0.5rem',
        md: '1rem',
        lg: '1.5rem',
        xl: '2rem'
      },
      bordas: {
        raio: '0.5rem',
        largura: '1px'
      },
      sombras: {
        pequena: '0 1px 2px 0 rgba(0, 0, 0, 0.3)',
        media: '0 4px 6px -1px rgba(0, 0, 0, 0.4)',
        grande: '0 20px 25px -5px rgba(0, 0, 0, 0.5)'
      },
      animacoes: {
        duracao: '200ms',
        easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
        habilitadas: true
      }
    },
    {
      id: 'oceano',
      nome: 'Oceano',
      descricao: 'Inspirado nas cores do mar e do céu',
      categoria: 'colorido',
      cores: {
        primaria: '#0EA5E9',
        secundaria: '#06B6D4',
        acento: '#8B5CF6',
        fundo: '#F0F9FF',
        superficie: '#E0F2FE',
        texto: '#0C4A6E',
        textoSecundario: '#0369A1',
        borda: '#BAE6FD',
        sucesso: '#059669',
        aviso: '#D97706',
        erro: '#DC2626',
        info: '#0EA5E9'
      },
      tipografia: {
        fontePrimaria: 'Inter, system-ui, sans-serif',
        fonteSecundaria: 'JetBrains Mono, monospace',
        tamanhoBase: 16,
        espacamento: 0,
        alturaLinha: 1.5
      },
      espacamento: {
        xs: '0.25rem',
        sm: '0.5rem',
        md: '1rem',
        lg: '1.5rem',
        xl: '2rem'
      },
      bordas: {
        raio: '0.75rem',
        largura: '1px'
      },
      sombras: {
        pequena: '0 1px 2px 0 rgba(14, 165, 233, 0.1)',
        media: '0 4px 6px -1px rgba(14, 165, 233, 0.2)',
        grande: '0 20px 25px -5px rgba(14, 165, 233, 0.3)'
      },
      animacoes: {
        duracao: '300ms',
        easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
        habilitadas: true
      }
    },
    {
      id: 'floresta',
      nome: 'Floresta',
      descricao: 'Tons verdes naturais e relaxantes',
      categoria: 'colorido',
      cores: {
        primaria: '#059669',
        secundaria: '#10B981',
        acento: '#84CC16',
        fundo: '#F0FDF4',
        superficie: '#DCFCE7',
        texto: '#14532D',
        textoSecundario: '#166534',
        borda: '#BBF7D0',
        sucesso: '#22C55E',
        aviso: '#EAB308',
        erro: '#EF4444',
        info: '#3B82F6'
      },
      tipografia: {
        fontePrimaria: 'Inter, system-ui, sans-serif',
        fonteSecundaria: 'JetBrains Mono, monospace',
        tamanhoBase: 16,
        espacamento: 0,
        alturaLinha: 1.5
      },
      espacamento: {
        xs: '0.25rem',
        sm: '0.5rem',
        md: '1rem',
        lg: '1.5rem',
        xl: '2rem'
      },
      bordas: {
        raio: '0.5rem',
        largura: '1px'
      },
      sombras: {
        pequena: '0 1px 2px 0 rgba(5, 150, 105, 0.1)',
        media: '0 4px 6px -1px rgba(5, 150, 105, 0.2)',
        grande: '0 20px 25px -5px rgba(5, 150, 105, 0.3)'
      },
      animacoes: {
        duracao: '250ms',
        easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
        habilitadas: true
      }
    },
    {
      id: 'minimalista',
      nome: 'Minimalista',
      descricao: 'Design limpo e minimalista com foco no conteúdo',
      categoria: 'minimalista',
      cores: {
        primaria: '#000000',
        secundaria: '#404040',
        acento: '#666666',
        fundo: '#FFFFFF',
        superficie: '#FAFAFA',
        texto: '#000000',
        textoSecundario: '#666666',
        borda: '#E0E0E0',
        sucesso: '#4CAF50',
        aviso: '#FF9800',
        erro: '#F44336',
        info: '#2196F3'
      },
      tipografia: {
        fontePrimaria: 'system-ui, -apple-system, sans-serif',
        fonteSecundaria: 'Monaco, monospace',
        tamanhoBase: 15,
        espacamento: 0.5,
        alturaLinha: 1.6
      },
      espacamento: {
        xs: '0.125rem',
        sm: '0.25rem',
        md: '0.5rem',
        lg: '1rem',
        xl: '1.5rem'
      },
      bordas: {
        raio: '0.125rem',
        largura: '1px'
      },
      sombras: {
        pequena: 'none',
        media: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
        grande: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
      },
      animacoes: {
        duracao: '150ms',
        easing: 'ease-out',
        habilitadas: false
      }
    }
  ];

  // Inicializar temas
  useEffect(() => {
    const temasPersonalizados = JSON.parse(localStorage.getItem('temas-personalizados') || '[]');
    setTemas([...temasPredefinidos, ...temasPersonalizados]);
    
    const configSalva = JSON.parse(localStorage.getItem('configuracao-tema') || '{}');
    setConfiguracao(prev => ({ ...prev, ...configSalva }));
    
    const temaSalvo = localStorage.getItem('tema-ativo') || 'padrao';
    setTemaAtivo(temaSalvo);
  }, []);

  // Aplicar tema
  const aplicarTema = useCallback((tema: Tema) => {
    const root = document.documentElement;
    
    // Aplicar cores CSS
    Object.entries(tema.cores).forEach(([chave, valor]) => {
      root.style.setProperty(`--cor-${chave}`, valor);
    });
    
    // Aplicar tipografia
    root.style.setProperty('--fonte-primaria', tema.tipografia.fontePrimaria);
    root.style.setProperty('--fonte-secundaria', tema.tipografia.fonteSecundaria);
    root.style.setProperty('--tamanho-base', `${tema.tipografia.tamanhoBase}px`);
    root.style.setProperty('--espacamento-letra', `${tema.tipografia.espacamento}px`);
    root.style.setProperty('--altura-linha', tema.tipografia.alturaLinha.toString());
    
    // Aplicar espacamentos
    Object.entries(tema.espacamento).forEach(([chave, valor]) => {
      root.style.setProperty(`--espacamento-${chave}`, valor);
    });
    
    // Aplicar bordas
    root.style.setProperty('--raio-borda', tema.bordas.raio);
    root.style.setProperty('--largura-borda', tema.bordas.largura);
    
    // Aplicar sombras
    Object.entries(tema.sombras).forEach(([chave, valor]) => {
      root.style.setProperty(`--sombra-${chave}`, valor);
    });
    
    // Aplicar animações
    root.style.setProperty('--duracao-animacao', tema.animacoes.duracao);
    root.style.setProperty('--easing-animacao', tema.animacoes.easing);
    
    if (configuracao.salvarPreferencia) {
      localStorage.setItem('tema-ativo', tema.id);
    }
    
    setTemaAtivo(tema.id);
  }, [configuracao.salvarPreferencia]);

  // Criar novo tema
  const criarNovoTema = useCallback(() => {
    const novoTema: Tema = {
      id: `tema-${Date.now()}`,
      nome: 'Novo Tema',
      descricao: 'Tema personalizado',
      categoria: 'personalizado',
      cores: { ...temasPredefinidos[0].cores },
      tipografia: { ...temasPredefinidos[0].tipografia },
      espacamento: { ...temasPredefinidos[0].espacamento },
      bordas: { ...temasPredefinidos[0].bordas },
      sombras: { ...temasPredefinidos[0].sombras },
      animacoes: { ...temasPredefinidos[0].animacoes },
      personalizado: true,
      dataCreacao: new Date().toISOString()
    };
    
    setTemaEditando(novoTema);
    setAbaSelecionada('editor');
  }, []);

  // Salvar tema personalizado
  const salvarTema = useCallback((tema: Tema) => {
    const temasAtualizados = temas.filter(t => t.id !== tema.id);
    temasAtualizados.push({ ...tema, ultimaModificacao: new Date().toISOString() });
    
    setTemas(temasAtualizados);
    
    const temasPersonalizados = temasAtualizados.filter(t => t.personalizado);
    localStorage.setItem('temas-personalizados', JSON.stringify(temasPersonalizados));
    
    setTemaEditando(null);
    setAbaSelecionada('galeria');
  }, [temas]);

  // Excluir tema
  const excluirTema = useCallback((temaId: string) => {
    const temasAtualizados = temas.filter(t => t.id !== temaId);
    setTemas(temasAtualizados);
    
    const temasPersonalizados = temasAtualizados.filter(t => t.personalizado);
    localStorage.setItem('temas-personalizados', JSON.stringify(temasPersonalizados));
    
    if (temaAtivo === temaId) {
      aplicarTema(temasPredefinidos[0]);
    }
  }, [temas, temaAtivo, aplicarTema]);

  // Duplicar tema
  const duplicarTema = useCallback((tema: Tema) => {
    const temaDuplicado: Tema = {
      ...tema,
      id: `tema-${Date.now()}`,
      nome: `${tema.nome} (Cópia)`,
      personalizado: true,
      dataCreacao: new Date().toISOString()
    };
    
    setTemaEditando(temaDuplicado);
    setAbaSelecionada('editor');
  }, []);

  // Exportar tema
  const exportarTema = useCallback((tema: Tema) => {
    const dataStr = JSON.stringify(tema, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `tema-${tema.nome.toLowerCase().replace(/\s+/g, '-')}.json`;
    link.click();
    
    URL.revokeObjectURL(url);
  }, []);

  // Importar tema
  const importarTema = useCallback((arquivo: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const tema = JSON.parse(e.target?.result as string);
        tema.id = `tema-${Date.now()}`;
        tema.personalizado = true;
        tema.dataCreacao = new Date().toISOString();
        
        setTemas(prev => [...prev, tema]);
        
        const temasPersonalizados = [...temas.filter(t => t.personalizado), tema];
        localStorage.setItem('temas-personalizados', JSON.stringify(temasPersonalizados));
      } catch (error) {
        console.error('Erro ao importar tema:', error);
      }
    };
    reader.readAsText(arquivo);
  }, [temas]);

  // Filtrar temas
  const temasFiltrados = temas.filter(tema => {
    const matchCategoria = filtroCategoria === 'todos' || tema.categoria === filtroCategoria;
    const matchBusca = tema.nome.toLowerCase().includes(busca.toLowerCase()) ||
                      tema.descricao.toLowerCase().includes(busca.toLowerCase());
    return matchCategoria && matchBusca;
  });

  const categorias = [
    { id: 'todos', label: 'Todos', icon: Grid },
    { id: 'claro', label: 'Claro', icon: Sun },
    { id: 'escuro', label: 'Escuro', icon: Moon },
    { id: 'colorido', label: 'Colorido', icon: Palette },
    { id: 'minimalista', label: 'Minimalista', icon: Minimize },
    { id: 'profissional', label: 'Profissional', icon: Layers },
    { id: 'personalizado', label: 'Personalizado', icon: Brush }
  ];

  const abas = [
    { id: 'galeria', label: 'Galeria', icon: Grid },
    { id: 'editor', label: 'Editor', icon: Edit3 },
    { id: 'configuracoes', label: 'Configurações', icon: Settings },
    { id: 'importar', label: 'Importar/Exportar', icon: Upload }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-6xl h-[90vh] flex flex-col overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Palette className="w-8 h-8" />
              <div>
                <h2 className="text-2xl font-bold">Sistema de Temas</h2>
                <p className="text-purple-100">Personalize a aparência da sua calculadora</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <AnimatedButton
                onClick={() => setModoPreview(!modoPreview)}
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10"
              >
                {modoPreview ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
                {modoPreview ? 'Sair do Preview' : 'Preview'}
              </AnimatedButton>
              
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
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
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
            {abaSelecionada === 'galeria' && (
              <motion.div
                key="galeria"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="h-full flex flex-col"
              >
                {/* Filtros e Busca */}
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <input
                        type="text"
                        placeholder="Buscar temas..."
                        value={busca}
                        onChange={(e) => setBusca(e.target.value)}
                        className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg w-64"
                      />
                      
                      <select
                        value={filtroCategoria}
                        onChange={(e) => setFiltroCategoria(e.target.value)}
                        className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg"
                      >
                        {categorias.map(categoria => (
                          <option key={categoria.id} value={categoria.id}>
                            {categoria.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    <AnimatedButton
                      onClick={criarNovoTema}
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Novo Tema
                    </AnimatedButton>
                  </div>
                  
                  {/* Categorias */}
                  <div className="flex items-center space-x-2">
                    {categorias.map(categoria => (
                      <button
                        key={categoria.id}
                        onClick={() => setFiltroCategoria(categoria.id)}
                        className={`flex items-center px-3 py-1 rounded-full text-sm transition-colors ${
                          filtroCategoria === categoria.id
                            ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-400 dark:hover:bg-gray-600'
                        }`}
                      >
                        <categoria.icon className="w-3 h-3 mr-1" />
                        {categoria.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Grid de Temas */}
                <div className="flex-1 overflow-y-auto p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {temasFiltrados.map(tema => (
                      <TemaCard
                        key={tema.id}
                        tema={tema}
                        ativo={tema.id === temaAtivo}
                        onAplicar={() => aplicarTema(tema)}
                        onEditar={() => {
                          setTemaEditando(tema);
                          setAbaSelecionada('editor');
                        }}
                        onDuplicar={() => duplicarTema(tema)}
                        onExcluir={() => excluirTema(tema.id)}
                        onExportar={() => exportarTema(tema)}
                        onToggleFavorito={() => {
                          // Implementar toggle favorito
                        }}
                      />
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {abaSelecionada === 'editor' && (
              <motion.div
                key="editor"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="h-full"
              >
                {temaEditando ? (
                  <EditorTema
                    tema={temaEditando}
                    onSalvar={salvarTema}
                    onCancelar={() => {
                      setTemaEditando(null);
                      setAbaSelecionada('galeria');
                    }}
                    onChange={setTemaEditando}
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <Brush className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        Nenhum tema selecionado
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 mb-4">
                        Selecione um tema para editar ou crie um novo
                      </p>
                      <AnimatedButton
                        onClick={criarNovoTema}
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Criar Novo Tema
                      </AnimatedButton>
                    </div>
                  </div>
                )}
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
                <ConfiguracoesTema
                  configuracao={configuracao}
                  onChange={setConfiguracao}
                />
              </motion.div>
            )}

            {abaSelecionada === 'importar' && (
              <motion.div
                key="importar"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="h-full overflow-y-auto p-6"
              >
                <ImportarExportar
                  temas={temas}
                  onImportar={importarTema}
                  onExportar={exportarTema}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

// Componente do Card de Tema
const TemaCard: React.FC<{
  tema: Tema;
  ativo: boolean;
  onAplicar: () => void;
  onEditar: () => void;
  onDuplicar: () => void;
  onExcluir: () => void;
  onExportar: () => void;
  onToggleFavorito: () => void;
}> = ({ tema, ativo, onAplicar, onEditar, onDuplicar, onExcluir, onExportar, onToggleFavorito }) => (
  <div className={`border-2 rounded-xl p-4 transition-all ${
    ativo ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-200 dark:border-gray-700'
  }`}>
    {/* Preview das Cores */}
    <div className="mb-4">
      <div className="flex space-x-1 mb-2">
        <div 
          className="w-8 h-8 rounded-lg border border-gray-200"
          style={{ backgroundColor: tema.cores.primaria }}
        />
        <div 
          className="w-8 h-8 rounded-lg border border-gray-200"
          style={{ backgroundColor: tema.cores.secundaria }}
        />
        <div 
          className="w-8 h-8 rounded-lg border border-gray-200"
          style={{ backgroundColor: tema.cores.acento }}
        />
        <div 
          className="w-8 h-8 rounded-lg border border-gray-200"
          style={{ backgroundColor: tema.cores.fundo }}
        />
      </div>
      
      <div className="text-xs text-gray-500 dark:text-gray-400">
        {tema.categoria} • {tema.autor || 'Sistema'}
      </div>
    </div>

    {/* Informações */}
    <div className="mb-4">
      <div className="flex items-center justify-between mb-1">
        <h3 className="font-semibold text-gray-900 dark:text-white">{tema.nome}</h3>
        <div className="flex items-center space-x-1">
          {tema.favorito && <Heart className="w-4 h-4 text-red-500 fill-current" />}
          {ativo && <Check className="w-4 h-4 text-green-500" />}
        </div>
      </div>
      <p className="text-sm text-gray-600 dark:text-gray-400">{tema.descricao}</p>
    </div>

    {/* Ações */}
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-2">
        <button
          onClick={onToggleFavorito}
          className="p-1 text-gray-400 hover:text-red-500"
        >
          <Heart className={`w-4 h-4 ${tema.favorito ? 'fill-current text-red-500' : ''}`} />
        </button>
        
        {tema.personalizado && (
          <>
            <button
              onClick={onEditar}
              className="p-1 text-gray-400 hover:text-blue-600"
            >
              <Edit3 className="w-4 h-4" />
            </button>
            <button
              onClick={onExcluir}
              className="p-1 text-gray-400 hover:text-red-600"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </>
        )}
        
        <button
          onClick={onDuplicar}
          className="p-1 text-gray-400 hover:text-green-600"
        >
          <Copy className="w-4 h-4" />
        </button>
        
        <button
          onClick={onExportar}
          className="p-1 text-gray-400 hover:text-purple-600"
        >
          <Download className="w-4 h-4" />
        </button>
      </div>
      
      <AnimatedButton
        onClick={onAplicar}
        size="sm"
        className={ativo ? 'bg-green-600 hover:bg-green-700 text-white' : 'bg-blue-600 hover:bg-blue-700 text-white'}
      >
        {ativo ? 'Ativo' : 'Aplicar'}
      </AnimatedButton>
    </div>
  </div>
);

// Componente Editor de Tema (implementação simplificada)
const EditorTema: React.FC<{
  tema: Tema;
  onSalvar: (tema: Tema) => void;
  onCancelar: () => void;
  onChange: (tema: Tema) => void;
}> = ({ tema, onSalvar, onCancelar, onChange }) => (
  <div className="h-full overflow-y-auto p-6">
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Editando: {tema.nome}
        </h3>
        <div className="flex items-center space-x-3">
          <AnimatedButton onClick={onCancelar} variant="outline">
            Cancelar
          </AnimatedButton>
          <AnimatedButton
            onClick={() => onSalvar(tema)}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            Salvar Tema
          </AnimatedButton>
        </div>
      </div>

      {/* Informações Básicas */}
      <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6">
        <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Informações Básicas</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Nome do Tema
            </label>
            <input
              type="text"
              value={tema.nome}
              onChange={(e) => onChange({ ...tema, nome: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Categoria
            </label>
            <select
              value={tema.categoria}
              onChange={(e) => onChange({ ...tema, categoria: e.target.value as any })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg"
            >
              <option value="claro">Claro</option>
              <option value="escuro">Escuro</option>
              <option value="colorido">Colorido</option>
              <option value="minimalista">Minimalista</option>
              <option value="profissional">Profissional</option>
              <option value="personalizado">Personalizado</option>
            </select>
          </div>
        </div>
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Descrição
          </label>
          <textarea
            value={tema.descricao}
            onChange={(e) => onChange({ ...tema, descricao: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg"
            rows={3}
          />
        </div>
      </div>

      {/* Cores */}
      <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6">
        <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Cores</h4>
        <div className="grid grid-cols-3 gap-4">
          {Object.entries(tema.cores).map(([chave, valor]) => (
            <div key={chave}>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 capitalize">
                {chave.replace(/([A-Z])/g, ' $1').toLowerCase()}
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="color"
                  value={valor}
                  onChange={(e) => onChange({
                    ...tema,
                    cores: { ...tema.cores, [chave]: e.target.value }
                  })}
                  className="w-12 h-10 border border-gray-300 dark:border-gray-600 rounded-lg"
                />
                <input
                  type="text"
                  value={valor}
                  onChange={(e) => onChange({
                    ...tema,
                    cores: { ...tema.cores, [chave]: e.target.value }
                  })}
                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-mono"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Preview */}
      <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6">
        <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Preview</h4>
        <div 
          className="border rounded-lg p-4"
          style={{
            backgroundColor: tema.cores.fundo,
            color: tema.cores.texto,
            borderColor: tema.cores.borda
          }}
        >
          <div className="space-y-4">
            <h5 style={{ color: tema.cores.primaria }} className="text-lg font-semibold">
              Título Principal
            </h5>
            <p style={{ color: tema.cores.textoSecundario }}>
              Este é um exemplo de texto secundário para visualizar como o tema ficará.
            </p>
            <div className="flex space-x-2">
              <button
                style={{ backgroundColor: tema.cores.primaria, color: tema.cores.fundo }}
                className="px-4 py-2 rounded-lg"
              >
                Botão Primário
              </button>
              <button
                style={{ backgroundColor: tema.cores.secundaria, color: tema.cores.fundo }}
                className="px-4 py-2 rounded-lg"
              >
                Botão Secundário
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// Componente de Configurações (implementação simplificada)
const ConfiguracoesTema: React.FC<{
  configuracao: ConfiguracaoTema;
  onChange: (config: ConfiguracaoTema) => void;
}> = ({ configuracao, onChange }) => (
  <div className="max-w-2xl mx-auto space-y-6">
    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
      Configurações de Tema
    </h3>
    
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="font-medium text-gray-900 dark:text-white">Modo Escuro Automático</h4>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Alternar automaticamente entre temas claro e escuro
          </p>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={configuracao.modoEscuroAutomatico}
            onChange={(e) => onChange({ ...configuracao, modoEscuroAutomatico: e.target.checked })}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
        </label>
      </div>
      
      <div className="flex items-center justify-between">
        <div>
          <h4 className="font-medium text-gray-900 dark:text-white">Transição Suave</h4>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Animar mudanças de tema
          </p>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={configuracao.transicaoSuave}
            onChange={(e) => onChange({ ...configuracao, transicaoSuave: e.target.checked })}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
        </label>
      </div>
      
      <div className="flex items-center justify-between">
        <div>
          <h4 className="font-medium text-gray-900 dark:text-white">Salvar Preferência</h4>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Lembrar tema selecionado
          </p>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={configuracao.salvarPreferencia}
            onChange={(e) => onChange({ ...configuracao, salvarPreferencia: e.target.checked })}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
        </label>
      </div>
    </div>
  </div>
);

// Componente de Importar/Exportar (implementação simplificada)
const ImportarExportar: React.FC<{
  temas: Tema[];
  onImportar: (arquivo: File) => void;
  onExportar: (tema: Tema) => void;
}> = ({ temas, onImportar, onExportar }) => (
  <div className="max-w-2xl mx-auto space-y-6">
    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
      Importar e Exportar Temas
    </h3>
    
    <div className="grid grid-cols-2 gap-6">
      <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6">
        <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Importar Tema</h4>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          Importe um arquivo de tema (.json) para adicionar à sua coleção
        </p>
        <input
          type="file"
          accept=".json"
          onChange={(e) => {
            const arquivo = e.target.files?.[0];
            if (arquivo) onImportar(arquivo);
          }}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg"
        />
      </div>
      
      <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6">
        <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Exportar Temas</h4>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          Exporte seus temas personalizados para compartilhar ou fazer backup
        </p>
        <div className="space-y-2">
          {temas.filter(t => t.personalizado).map(tema => (
            <button
              key={tema.id}
              onClick={() => onExportar(tema)}
              className="w-full text-left px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              {tema.nome}
            </button>
          ))}
        </div>
      </div>
    </div>
  </div>
);

export default SistemaTemas;