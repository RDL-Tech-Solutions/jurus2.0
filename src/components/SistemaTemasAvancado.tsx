import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Palette,
  Settings,
  Download,
  Upload,
  Sparkles,
  Grid,
  Edit3,
  X,
  Eye,
  Save,
  RotateCcw,
  Zap,
  Monitor,
  Smartphone,
  Tablet
} from 'lucide-react';
import { TemaAvancado, ConfiguracaoTemaAvancada } from '../types/temas';
import { AnimatedContainer, AnimatedItem } from './AnimatedContainer';
import { AnimatedButton } from './AnimatedButton';
import { GaleriaTemas } from './GaleriaTemas';
import { EditorTemas } from './EditorTemas';
import { ConfiguracoesAvancadas } from './ConfiguracoesAvancadas';
import { ImportExportTemas } from './ImportExportTemas';
import { FuncionalidadesInteligentes } from './FuncionalidadesInteligentes';

interface SistemaTemasAvancadoProps {
  onFechar: () => void;
}

interface HistoricoAcao {
  id: string;
  tipo: 'criar' | 'editar' | 'deletar' | 'importar';
  tema: TemaAvancado;
  timestamp: number;
  descricao: string;
}

export const SistemaTemasAvancado: React.FC<SistemaTemasAvancadoProps> = ({ onFechar }) => {
  // Estados principais
  const [temas, setTemas] = useState<TemaAvancado[]>([]);
  const [temaAtivo, setTemaAtivo] = useState<string>('padrao');
  const [configuracao, setConfiguracao] = useState<ConfiguracaoTemaAvancada>({
    temaAtivo: 'padrao',
    modoEscuroAutomatico: false,
    horarioModoEscuro: { inicio: '18:00', fim: '06:00' },
    sincronizarSistema: false,
    transicaoSuave: true,
    velocidadeTransicao: 200,
    animacoesHabilitadas: true,
    reducedMotion: false,
    salvarPreferencia: true,
    backupAutomatico: true,
    validacaoContraste: true,
    sugestoesCores: true,
    alertasAcessibilidade: true,
    previewTempoReal: true,
    modoDesenvolvedor: false,
    otimizacaoPerformance: true,
    carregamentoLazy: true,
    atualizacoesAutomaticas: false,
    notificacoesNovosTemas: true
  });

  // Estados da interface
  const [abaAtiva, setAbaAtiva] = useState<'galeria' | 'editor' | 'configuracoes' | 'importar' | 'inteligentes'>('galeria');
  const [temaEditando, setTemaEditando] = useState<TemaAvancado | null>(null);
  const [modoPreview, setModoPreview] = useState(false);
  const [dispositivoPreview, setDispositivoPreview] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [historico, setHistorico] = useState<HistoricoAcao[]>([]);
  const [indiceHistorico, setIndiceHistorico] = useState(-1);

  // Temas predefinidos
  const temasPredefinidos: TemaAvancado[] = [
    {
      id: 'padrao',
      nome: 'Padrão',
      descricao: 'Tema padrão do sistema com cores equilibradas',
      categoria: 'Business',
      autor: 'Sistema',
      personalizado: false,
      favorito: false,
      rating: 4.5,
      popularidade: 95,
      versao: '1.0.0',
      dataCreacao: new Date().toISOString(),
      ultimaModificacao: new Date().toISOString(),
      cores: {
        primaria: '#3B82F6',
        secundaria: '#6366F1',
        terciaria: '#8B5CF6',
        acento: '#F59E0B',
        fundo: '#FFFFFF',
        fundoSecundario: '#F8FAFC',
        superficie: '#FFFFFF',
        texto: '#1F2937',
        textoSecundario: '#6B7280',
        borda: '#E5E7EB',
        sucesso: '#10B981',
        aviso: '#F59E0B',
        erro: '#EF4444',
        info: '#3B82F6',
        destaque: '#8B5CF6',
        sombra: 'rgba(0, 0, 0, 0.1)',
        overlay: 'rgba(0, 0, 0, 0.5)',
        gradiente: {
          inicio: '#3B82F6',
          fim: '#6366F1',
          direcao: '135deg'
        }
      },
      tipografia: {
        fontePrimaria: 'Inter, system-ui, sans-serif',
        fonteSecundaria: 'JetBrains Mono, monospace',
        fonteTitulos: 'Inter, system-ui, sans-serif',
        fonteMonospace: 'JetBrains Mono, monospace',
        tamanhoBase: '16px',
        escalaTipografica: {
          xs: '0.75rem',
          sm: '0.875rem',
          base: '1rem',
          lg: '1.125rem',
          xl: '1.25rem',
          '2xl': '1.5rem',
          '3xl': '1.875rem',
          '4xl': '2.25rem'
        },
        pesos: {
          light: '300',
          normal: '400',
          medium: '500',
          semibold: '600',
          bold: '700',
          extrabold: '800'
        },
        espacamento: '0',
        alturaLinha: {
          tight: '1.25',
          normal: '1.5',
          relaxed: '1.625',
          loose: '2'
        }
      },
      espacamento: {
        xs: '0.25rem',
        sm: '0.5rem',
        md: '1rem',
        lg: '1.5rem',
        xl: '2rem',
        '2xl': '3rem',
        '3xl': '4rem',
        '4xl': '5rem',
        '5xl': '6rem',
        '6xl': '8rem'
      },
      bordas: {
        raio: {
          none: '0',
          sm: '0.125rem',
          md: '0.375rem',
          lg: '0.5rem',
          xl: '0.75rem',
          '2xl': '1rem',
          '3xl': '1.5rem',
          full: '9999px'
        },
        largura: {
          none: '0',
          thin: '1px',
          normal: '2px',
          thick: '4px',
          extra: '8px'
        },
        estilo: 'solid'
      },
      sombras: {
        none: 'none',
        xs: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        sm: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
        md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
        xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
        '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)'
      },
      animacoes: {
        duracao: {
          instant: '0ms',
          fast: '150ms',
          normal: '200ms',
          slow: '300ms',
          slower: '500ms'
        },
        easing: {
          linear: 'linear',
          ease: 'ease',
          easeIn: 'ease-in',
          easeOut: 'ease-out',
          easeInOut: 'ease-in-out',
          bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
          elastic: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)'
        },
        habilitadas: true,
        reducedMotion: false,
        transicoes: {
          all: 'all 200ms ease-in-out',
          colors: 'color 200ms ease-in-out, background-color 200ms ease-in-out, border-color 200ms ease-in-out',
          opacity: 'opacity 200ms ease-in-out',
          shadow: 'box-shadow 200ms ease-in-out',
          transform: 'transform 200ms ease-in-out'
        }
      },
      responsivo: true,
      acessibilidade: {
        altoContraste: false,
        validacaoContraste: {},
        suporteScreenReader: true,
        reducedMotion: false
      },
      exportavel: true,
      compartilhavel: true
    }
  ];

  // Carregar dados iniciais
  useEffect(() => {
    carregarTemas();
    carregarConfiguracao();
  }, []);

  const carregarTemas = useCallback(() => {
    const temasLocal = localStorage.getItem('jurus-temas');
    if (temasLocal) {
      try {
        const temasCarregados = JSON.parse(temasLocal);
        setTemas([...temasPredefinidos, ...temasCarregados]);
      } catch (error) {
        console.error('Erro ao carregar temas:', error);
        setTemas(temasPredefinidos);
      }
    } else {
      setTemas(temasPredefinidos);
    }
  }, []);

  const carregarConfiguracao = useCallback(() => {
    const configLocal = localStorage.getItem('jurus-config-temas');
    if (configLocal) {
      try {
        const configCarregada = JSON.parse(configLocal);
        setConfiguracao(prev => ({ ...prev, ...configCarregada }));
        setTemaAtivo(configCarregada.temaAtivo || 'padrao');
      } catch (error) {
        console.error('Erro ao carregar configuração:', error);
      }
    }
  }, []);

  const salvarTemas = useCallback((novosTemas: TemaAvancado[]) => {
    const temasPersonalizados = novosTemas.filter(tema => tema.personalizado);
    localStorage.setItem('jurus-temas', JSON.stringify(temasPersonalizados));
    setTemas(novosTemas);
  }, []);

  const salvarConfiguracao = useCallback((novaConfig: ConfiguracaoTemaAvancada) => {
    localStorage.setItem('jurus-config-temas', JSON.stringify(novaConfig));
    setConfiguracao(novaConfig);
  }, []);

  // Handlers dos componentes
  const handleSelecionarTema = useCallback((temaId: string) => {
    setTemaAtivo(temaId);
    const novaConfig = { ...configuracao, temaAtivo: temaId };
    salvarConfiguracao(novaConfig);
    aplicarTema(temaId);
  }, [configuracao, salvarConfiguracao]);

  const handleEditarTema = useCallback((tema: TemaAvancado) => {
    setTemaEditando(tema);
    setAbaAtiva('editor');
  }, []);

  const handleSalvarTema = useCallback((tema: TemaAvancado) => {
    const temasAtualizados = temas.map(t => t.id === tema.id ? tema : t);
    if (!temas.find(t => t.id === tema.id)) {
      temasAtualizados.push(tema);
    }
    
    salvarTemas(temasAtualizados);
    
    // Adicionar ao histórico
    const novaAcao: HistoricoAcao = {
      id: Date.now().toString(),
      tipo: temas.find(t => t.id === tema.id) ? 'editar' : 'criar',
      tema,
      timestamp: Date.now(),
      descricao: `${temas.find(t => t.id === tema.id) ? 'Editou' : 'Criou'} o tema "${tema.nome}"`
    };
    
    setHistorico(prev => [novaAcao, ...prev.slice(0, 49)]);
    setTemaEditando(null);
    setAbaAtiva('galeria');
  }, [temas, salvarTemas]);

  const handleDeletarTema = useCallback((temaId: string) => {
    const tema = temas.find(t => t.id === temaId);
    if (!tema || !tema.personalizado) return;
    
    const temasAtualizados = temas.filter(t => t.id !== temaId);
    salvarTemas(temasAtualizados);
    
    // Adicionar ao histórico
    const novaAcao: HistoricoAcao = {
      id: Date.now().toString(),
      tipo: 'deletar',
      tema,
      timestamp: Date.now(),
      descricao: `Deletou o tema "${tema.nome}"`
    };
    
    setHistorico(prev => [novaAcao, ...prev.slice(0, 49)]);
    
    // Se o tema ativo foi deletado, voltar ao padrão
    if (temaAtivo === temaId) {
      handleSelecionarTema('padrao');
    }
  }, [temas, temaAtivo, salvarTemas, handleSelecionarTema]);

  const handleFavoritarTema = useCallback((temaId: string) => {
    const temasAtualizados = temas.map(tema => 
      tema.id === temaId ? { ...tema, favorito: !tema.favorito } : tema
    );
    salvarTemas(temasAtualizados);
  }, [temas, salvarTemas]);

  const handleCompartilharTema = useCallback((tema: TemaAvancado) => {
    const dadosTema = JSON.stringify(tema, null, 2);
    const blob = new Blob([dadosTema], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `tema-${tema.nome.toLowerCase().replace(/\s+/g, '-')}.json`;
    link.click();
    URL.revokeObjectURL(url);
  }, []);

  const handleDuplicarTema = useCallback((tema: TemaAvancado) => {
    const novoTema: TemaAvancado = {
      ...tema,
      id: `${tema.id}-copia-${Date.now()}`,
      nome: `${tema.nome} (Cópia)`,
      personalizado: true,
      dataCreacao: new Date().toISOString(),
      ultimaModificacao: new Date().toISOString()
    };
    
    const temasAtualizados = [...temas, novoTema];
    salvarTemas(temasAtualizados);
  }, [temas, salvarTemas]);

  const handleImportarTemas = useCallback((novosTemasImportados: TemaAvancado[]) => {
    const temasAtualizados = [...temas];
    
    novosTemasImportados.forEach(tema => {
      const temaExistente = temasAtualizados.find(t => t.id === tema.id);
      if (temaExistente) {
        // Atualizar tema existente
        const index = temasAtualizados.findIndex(t => t.id === tema.id);
        temasAtualizados[index] = { ...tema, ultimaModificacao: new Date().toISOString() };
      } else {
        // Adicionar novo tema
        temasAtualizados.push({ ...tema, personalizado: true, dataCreacao: new Date().toISOString() });
      }
    });
    
    salvarTemas(temasAtualizados);
    
    // Adicionar ao histórico
    const novaAcao: HistoricoAcao = {
      id: Date.now().toString(),
      tipo: 'importar',
      tema: novosTemasImportados[0], // Usar o primeiro tema como referência
      timestamp: Date.now(),
      descricao: `Importou ${novosTemasImportados.length} tema(s)`
    };
    
    setHistorico(prev => [novaAcao, ...prev.slice(0, 49)]);
  }, [temas, salvarTemas]);

  const aplicarTema = useCallback((temaId: string) => {
    const tema = temas.find(t => t.id === temaId);
    if (!tema) return;

    // Aplicar variáveis CSS do tema
    const root = document.documentElement;
    
    // Cores
    Object.entries(tema.cores).forEach(([chave, valor]) => {
      if (typeof valor === 'string') {
        root.style.setProperty(`--cor-${chave}`, valor);
      }
    });

    // Gradiente
    if (tema.cores.gradiente) {
      const { inicio, fim, direcao } = tema.cores.gradiente;
      root.style.setProperty('--gradiente-primario', `linear-gradient(${direcao}, ${inicio}, ${fim})`);
    }

    // Tipografia
    root.style.setProperty('--fonte-primaria', tema.tipografia.fontePrimaria);
    root.style.setProperty('--fonte-secundaria', tema.tipografia.fonteSecundaria);
    root.style.setProperty('--tamanho-base', tema.tipografia.tamanhoBase);
    root.style.setProperty('--altura-linha', tema.tipografia.alturaLinha.normal);

    // Espaçamento
    Object.entries(tema.espacamento).forEach(([chave, valor]) => {
      root.style.setProperty(`--espacamento-${chave}`, valor);
    });

    // Bordas
    Object.entries(tema.bordas.raio).forEach(([chave, valor]) => {
      root.style.setProperty(`--borda-raio-${chave}`, valor);
    });
    Object.entries(tema.bordas.largura).forEach(([chave, valor]) => {
      root.style.setProperty(`--borda-largura-${chave}`, valor);
    });

    // Sombras
    Object.entries(tema.sombras).forEach(([chave, valor]) => {
      root.style.setProperty(`--sombra-${chave}`, valor);
    });

    // Animações
    root.style.setProperty('--duracao-animacao', tema.animacoes.duracao.normal);
    root.style.setProperty('--easing-animacao', tema.animacoes.easing.easeInOut);
  }, [temas]);

  const renderizarConteudo = () => {
    switch (abaAtiva) {
      case 'galeria':
        return (
          <GaleriaTemas
            temas={temas}
            temaAtivo={temaAtivo}
            onSelecionarTema={handleSelecionarTema}
            onEditarTema={handleEditarTema}
            onDeletarTema={handleDeletarTema}
            onFavoritarTema={handleFavoritarTema}
            onCompartilharTema={handleCompartilharTema}
            onDuplicarTema={handleDuplicarTema}
          />
        );
      
      case 'editor':
        return temaEditando ? (
          <EditorTemas
            tema={temaEditando}
            onSalvarTema={handleSalvarTema}
            onCancelar={() => {
              setTemaEditando(null);
              setAbaAtiva('galeria');
            }}
            onPreview={(tema) => {
              // Implementar preview temporário
              aplicarTema(tema.id);
            }}
            historico={[]}
            indiceHistorico={-1}
            onUndo={() => {}}
            onRedo={() => {}}
            podeUndo={false}
            podeRedo={false}
          />
        ) : (
          <div className="flex items-center justify-center h-64">
            <p className="text-gray-500">Selecione um tema para editar</p>
          </div>
        );
      
      case 'configuracoes':
        return (
          <ConfiguracoesAvancadas
            configuracao={configuracao}
            onAtualizarConfiguracao={salvarConfiguracao}
            temas={temas}
            onFechar={() => setAbaAtiva('galeria')}
          />
        );
      
      case 'importar':
        return (
          <ImportExportTemas
            temas={temas}
            configuracao={configuracao}
            onImportarTemas={handleImportarTemas}
            onImportarConfiguracao={salvarConfiguracao}
            onFechar={() => setAbaAtiva('galeria')}
          />
        );
      
      case 'inteligentes':
        return (
          <FuncionalidadesInteligentes
            configuracao={configuracao}
            onAtualizarConfiguracao={salvarConfiguracao}
            temas={temas}
            temaAtivo={temaAtivo}
            onMudarTema={handleSelecionarTema}
          />
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-lg shadow-xl w-full max-w-7xl h-[90vh] flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-4">
            <Palette className="w-8 h-8 text-blue-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Sistema de Temas Avançado</h1>
              <p className="text-sm text-gray-600">
                Personalize completamente a aparência da aplicação
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {/* Preview Controls */}
            {modoPreview && (
              <div className="flex items-center space-x-2 mr-4">
                <AnimatedButton
                  variant={dispositivoPreview === 'desktop' ? 'primary' : 'ghost'}
                  size="sm"
                  onClick={() => setDispositivoPreview('desktop')}
                >
                  <Monitor className="w-4 h-4" />
                </AnimatedButton>
                <AnimatedButton
                  variant={dispositivoPreview === 'tablet' ? 'primary' : 'ghost'}
                  size="sm"
                  onClick={() => setDispositivoPreview('tablet')}
                >
                  <Tablet className="w-4 h-4" />
                </AnimatedButton>
                <AnimatedButton
                  variant={dispositivoPreview === 'mobile' ? 'primary' : 'ghost'}
                  size="sm"
                  onClick={() => setDispositivoPreview('mobile')}
                >
                  <Smartphone className="w-4 h-4" />
                </AnimatedButton>
              </div>
            )}
            
            <AnimatedButton
              variant={modoPreview ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => setModoPreview(!modoPreview)}
            >
              <Eye className="w-4 h-4 mr-2" />
              Preview
            </AnimatedButton>
            
            <AnimatedButton
              variant="ghost"
              size="sm"
              onClick={onFechar}
            >
              <X className="w-4 h-4" />
            </AnimatedButton>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-gray-200">
          {[
            { id: 'galeria', label: 'Galeria', icon: Grid },
            { id: 'editor', label: 'Editor', icon: Edit3 },
            { id: 'inteligentes', label: 'Inteligentes', icon: Sparkles },
            { id: 'importar', label: 'Importar/Exportar', icon: Download },
            { id: 'configuracoes', label: 'Configurações', icon: Settings }
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setAbaAtiva(id as any)}
              className={`flex items-center px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                abaAtiva === id
                  ? 'border-blue-500 text-blue-600 bg-blue-50'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Icon className="w-4 h-4 mr-2" />
              {label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={abaAtiva}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
              className="h-full"
            >
              {renderizarConteudo()}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-4 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <span>Tema ativo: <strong>{temas.find(t => t.id === temaAtivo)?.nome || 'Padrão'}</strong></span>
            <span>•</span>
            <span>{temas.length} temas disponíveis</span>
            <span>•</span>
            <span>{temas.filter(t => t.personalizado).length} personalizados</span>
          </div>
          
          <div className="flex items-center space-x-2">
            <AnimatedButton
              variant="ghost"
              size="sm"
              onClick={() => {
                setTemas(temasPredefinidos);
                setTemaAtivo('padrao');
                localStorage.removeItem('jurus-temas');
                localStorage.removeItem('jurus-config-temas');
              }}
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Resetar
            </AnimatedButton>
            
            <AnimatedButton
              variant="primary"
              size="sm"
              onClick={() => {
                // Salvar configurações atuais
                salvarConfiguracao(configuracao);
                onFechar();
              }}
            >
              <Save className="w-4 h-4 mr-2" />
              Salvar e Fechar
            </AnimatedButton>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default SistemaTemasAvancado;