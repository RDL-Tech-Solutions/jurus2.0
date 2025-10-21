import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Settings,
  Zap,
  Eye,
  Accessibility,
  Palette,
  Monitor,
  Smartphone,
  Tablet,
  Code,
  TestTube,
  BarChart3,
  Shield,
  Clock,
  Cpu,
  HardDrive,
  Wifi,
  Battery,
  Sun,
  Moon,
  Contrast,
  Type,
  Volume2,
  VolumeX,
  MousePointer,
  Keyboard,
  Save,
  RotateCcw,
  Download,
  Upload,
  Check,
  X,
  AlertTriangle,
  Info,
  CheckCircle,
  XCircle,
  Play,
  Pause,
  RefreshCw,
  Sliders,
  Filter,
  Search,
  Grid,
  List,
  MoreHorizontal,
  ChevronDown,
  ChevronRight,
  Plus,
  Minus,
  Edit3,
  Trash2,
  Copy,
  Share2,
  Star,
  Heart,
  Bookmark,
  Tag,
  Calendar,
  Users,
  Globe,
  Lock,
  Unlock,
  Database,
  Cloud,
  Server,
  Terminal,
  Bug,
  Lightbulb,
  Target,
  TrendingUp,
  Award,
  Gauge,
  Package
} from 'lucide-react';
import { TemaAvancado, ConfiguracaoTemaAvancada } from '../types/temas';
import { AnimatedContainer, AnimatedItem } from './AnimatedContainer';
import { AnimatedButton } from './AnimatedButton';

interface ConfiguracoesAvancadasProps {
  configuracao: ConfiguracaoTemaAvancada;
  onAtualizarConfiguracao: (config: ConfiguracaoTemaAvancada) => void;
  temas: TemaAvancado[];
  onFechar: () => void;
}

interface ConfiguracaoPerformance {
  animacoesHabilitadas: boolean;
  transicoesSuaves: boolean;
  preloadTemas: boolean;
  cacheLocal: boolean;
  otimizacaoMemoria: boolean;
  compressaoAssets: boolean;
  lazyLoading: boolean;
  debounceMs: number;
  maxHistorico: number;
  intervaloCacheMs: number;
}

interface ConfiguracaoAcessibilidade {
  altoContraste: boolean;
  reducaoMovimento: boolean;
  tamanhoFonteBase: number;
  espacamentoLinhas: number;
  indicadoresFoco: boolean;
  navegacaoTeclado: boolean;
  leituraAutomatica: boolean;
  alertasSonoros: boolean;
  tempoSessaoEstendido: boolean;
  simplificarInterface: boolean;
  modoEscuroAutomatico: boolean;
  contrasteMinimoWCAG: 'AA' | 'AAA';
  suporteLeitoresTela: boolean;
  atalhosTeclado: boolean;
}

interface ConfiguracaoValidacao {
  validarContraste: boolean;
  validarTipografia: boolean;
  validarEspacamento: boolean;
  validarCores: boolean;
  validarAnimacoes: boolean;
  nivelValidacao: 'basico' | 'intermediario' | 'avancado';
  alertasTempoReal: boolean;
  relatoriosAutomaticos: boolean;
  integracaoFerramentasExternas: boolean;
}

interface ConfiguracaoCSS {
  injecaoCSS: boolean;
  cssPersonalizado: string;
  variaveisCSS: boolean;
  prefixosVendor: boolean;
  minificacao: boolean;
  sourceMaps: boolean;
  compatibilidadeNavegadores: string[];
  unidadesPadrao: 'px' | 'rem' | 'em' | '%';
}

interface ConfiguracaoExportacao {
  formatosPadrao: string[];
  incluirMetadados: boolean;
  compressaoArquivos: boolean;
  versionamento: boolean;
  backupAutomatico: boolean;
  sincronizacaoNuvem: boolean;
  compartilhamentoPublico: boolean;
  licencaUso: string;
}

interface ResultadoValidacao {
  tipo: 'contraste' | 'tipografia' | 'espacamento' | 'cores' | 'animacoes';
  nivel: 'sucesso' | 'aviso' | 'erro';
  mensagem: string;
  detalhes?: string;
  sugestao?: string;
}

export const ConfiguracoesAvancadas: React.FC<ConfiguracoesAvancadasProps> = ({
  configuracao,
  onAtualizarConfiguracao,
  temas,
  onFechar
}) => {
  const [abaSelecionada, setAbaSelecionada] = useState<'performance' | 'acessibilidade' | 'validacao' | 'css' | 'exportacao'>('performance');
  const [configPerformance, setConfigPerformance] = useState<ConfiguracaoPerformance>({
    animacoesHabilitadas: true,
    transicoesSuaves: true,
    preloadTemas: true,
    cacheLocal: true,
    otimizacaoMemoria: true,
    compressaoAssets: false,
    lazyLoading: true,
    debounceMs: 300,
    maxHistorico: 50,
    intervaloCacheMs: 300000
  });
  
  const [configAcessibilidade, setConfigAcessibilidade] = useState<ConfiguracaoAcessibilidade>({
    altoContraste: false,
    reducaoMovimento: false,
    tamanhoFonteBase: 16,
    espacamentoLinhas: 1.5,
    indicadoresFoco: true,
    navegacaoTeclado: true,
    leituraAutomatica: false,
    alertasSonoros: false,
    tempoSessaoEstendido: false,
    simplificarInterface: false,
    modoEscuroAutomatico: false,
    contrasteMinimoWCAG: 'AA',
    suporteLeitoresTela: true,
    atalhosTeclado: true
  });
  
  const [configValidacao, setConfigValidacao] = useState<ConfiguracaoValidacao>({
    validarContraste: true,
    validarTipografia: true,
    validarEspacamento: true,
    validarCores: true,
    validarAnimacoes: true,
    nivelValidacao: 'intermediario',
    alertasTempoReal: true,
    relatoriosAutomaticos: false,
    integracaoFerramentasExternas: false
  });
  
  const [configCSS, setConfigCSS] = useState<ConfiguracaoCSS>({
    injecaoCSS: false,
    cssPersonalizado: '',
    variaveisCSS: true,
    prefixosVendor: true,
    minificacao: false,
    sourceMaps: false,
    compatibilidadeNavegadores: ['Chrome', 'Firefox', 'Safari', 'Edge'],
    unidadesPadrao: 'rem'
  });
  
  const [configExportacao, setConfigExportacao] = useState<ConfiguracaoExportacao>({
    formatosPadrao: ['json', 'css'],
    incluirMetadados: true,
    compressaoArquivos: false,
    versionamento: true,
    backupAutomatico: true,
    sincronizacaoNuvem: false,
    compartilhamentoPublico: false,
    licencaUso: 'MIT'
  });
  
  const [validandoTemas, setValidandoTemas] = useState(false);
  const [resultadosValidacao, setResultadosValidacao] = useState<ResultadoValidacao[]>([]);
  const [estatisticasPerformance, setEstatisticasPerformance] = useState({
    tempoCarregamento: 0,
    usoMemoria: 0,
    temasCache: 0,
    operacoesPorSegundo: 0
  });

  // Carregar configurações salvas
  useEffect(() => {
    carregarConfiguracoes();
    monitorarPerformance();
  }, []);

  const carregarConfiguracoes = useCallback(() => {
    try {
      const configSalva = localStorage.getItem('jurus-configuracoes-avancadas');
      if (configSalva) {
        const config = JSON.parse(configSalva);
        if (config.performance) setConfigPerformance(config.performance);
        if (config.acessibilidade) setConfigAcessibilidade(config.acessibilidade);
        if (config.validacao) setConfigValidacao(config.validacao);
        if (config.css) setConfigCSS(config.css);
        if (config.exportacao) setConfigExportacao(config.exportacao);
      }
    } catch (error) {
      console.error('Erro ao carregar configurações:', error);
    }
  }, []);

  const salvarConfiguracoes = useCallback(() => {
    try {
      const config = {
        performance: configPerformance,
        acessibilidade: configAcessibilidade,
        validacao: configValidacao,
        css: configCSS,
        exportacao: configExportacao,
        versao: '1.0',
        atualizadoEm: new Date().toISOString()
      };
      
      localStorage.setItem('jurus-configuracoes-avancadas', JSON.stringify(config));
      
      // Aplicar configurações ao sistema
      aplicarConfiguracoes();
      
      mostrarNotificacao('Configurações salvas com sucesso!', 'sucesso');
    } catch (error) {
      console.error('Erro ao salvar configurações:', error);
      mostrarNotificacao('Erro ao salvar configurações.', 'erro');
    }
  }, [configPerformance, configAcessibilidade, configValidacao, configCSS, configExportacao]);

  const aplicarConfiguracoes = useCallback(() => {
    // Aplicar configurações de performance
    if (configPerformance.animacoesHabilitadas) {
      document.documentElement.style.setProperty('--animation-duration', '300ms');
    } else {
      document.documentElement.style.setProperty('--animation-duration', '0ms');
    }

    // Aplicar configurações de acessibilidade
    if (configAcessibilidade.altoContraste) {
      document.documentElement.classList.add('high-contrast');
    } else {
      document.documentElement.classList.remove('high-contrast');
    }

    if (configAcessibilidade.reducaoMovimento) {
      document.documentElement.style.setProperty('--animation-duration', '0ms');
      document.documentElement.style.setProperty('--transition-duration', '0ms');
    }

    document.documentElement.style.setProperty('--font-size-base', `${configAcessibilidade.tamanhoFonteBase}px`);
    document.documentElement.style.setProperty('--line-height-base', configAcessibilidade.espacamentoLinhas.toString());

    // Aplicar CSS personalizado
    if (configCSS.injecaoCSS && configCSS.cssPersonalizado) {
      let styleElement = document.getElementById('jurus-custom-css');
      if (!styleElement) {
        styleElement = document.createElement('style');
        styleElement.id = 'jurus-custom-css';
        document.head.appendChild(styleElement);
      }
      styleElement.textContent = configCSS.cssPersonalizado;
    }
  }, [configPerformance, configAcessibilidade, configCSS]);

  const monitorarPerformance = useCallback(() => {
    const startTime = performance.now();
    
    // Simular monitoramento de performance
    const interval = setInterval(() => {
      setEstatisticasPerformance({
        tempoCarregamento: Math.round(performance.now() - startTime),
        usoMemoria: Math.round((performance as any).memory?.usedJSHeapSize / 1024 / 1024 || 0),
        temasCache: temas.length,
        operacoesPorSegundo: Math.round(Math.random() * 100 + 50)
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [temas.length]);

  const validarTemas = useCallback(async () => {
    setValidandoTemas(true);
    setResultadosValidacao([]);

    try {
      const resultados: ResultadoValidacao[] = [];

      for (const tema of temas) {
        // Validação de contraste
        if (configValidacao.validarContraste) {
          const contrasteTexto = calcularContraste(tema.cores.fundo, tema.cores.texto);
          const contrasteMinimoAA = 4.5;
          const contrasteMinimoAAA = 7;
          const minimoRequerido = configAcessibilidade.contrasteMinimoWCAG === 'AAA' ? contrasteMinimoAAA : contrasteMinimoAA;

          if (contrasteTexto < minimoRequerido) {
            resultados.push({
              tipo: 'contraste',
              nivel: 'erro',
              mensagem: `Tema "${tema.nome}": Contraste insuficiente entre fundo e texto`,
              detalhes: `Contraste atual: ${contrasteTexto.toFixed(2)}, Mínimo: ${minimoRequerido}`,
              sugestao: 'Ajuste as cores de fundo ou texto para melhorar o contraste'
            });
          } else {
            resultados.push({
              tipo: 'contraste',
              nivel: 'sucesso',
              mensagem: `Tema "${tema.nome}": Contraste adequado`,
              detalhes: `Contraste: ${contrasteTexto.toFixed(2)}`
            });
          }
        }

        // Validação de tipografia
        if (configValidacao.validarTipografia) {
          const tamanhoBase = parseInt(tema.tipografia.tamanhoBase || '16');
          if (tamanhoBase < 14) {
            resultados.push({
              tipo: 'tipografia',
              nivel: 'aviso',
              mensagem: `Tema "${tema.nome}": Tamanho de fonte muito pequeno`,
              detalhes: `Tamanho atual: ${tamanhoBase}px`,
              sugestao: 'Use pelo menos 14px para melhor legibilidade'
            });
          }
        }

        // Validação de cores
        if (configValidacao.validarCores) {
          const coresUnicas = new Set(Object.values(tema.cores));
          if (coresUnicas.size < Object.keys(tema.cores).length * 0.7) {
            resultados.push({
              tipo: 'cores',
              nivel: 'aviso',
              mensagem: `Tema "${tema.nome}": Muitas cores similares`,
              sugestao: 'Considere usar uma paleta mais diversificada'
            });
          }
        }
      }

      setResultadosValidacao(resultados);
    } catch (error) {
      console.error('Erro na validação:', error);
      mostrarNotificacao('Erro durante a validação dos temas.', 'erro');
    } finally {
      setValidandoTemas(false);
    }
  }, [temas, configValidacao, configAcessibilidade]);

  const calcularContraste = (cor1: string, cor2: string): number => {
    // Implementação simplificada do cálculo de contraste WCAG
    const getLuminance = (cor: string) => {
      const rgb = cor.match(/\w\w/g);
      if (!rgb) return 0;
      
      const [r, g, b] = rgb.map(x => {
        const val = parseInt(x, 16) / 255;
        return val <= 0.03928 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4);
      });
      
      return 0.2126 * r + 0.7152 * g + 0.0722 * b;
    };

    const lum1 = getLuminance(cor1);
    const lum2 = getLuminance(cor2);
    const brightest = Math.max(lum1, lum2);
    const darkest = Math.min(lum1, lum2);
    
    return (brightest + 0.05) / (darkest + 0.05);
  };

  const resetarConfiguracoes = useCallback(() => {
    if (confirm('Tem certeza que deseja resetar todas as configurações para os valores padrão?')) {
      localStorage.removeItem('jurus-configuracoes-avancadas');
      carregarConfiguracoes();
      mostrarNotificacao('Configurações resetadas com sucesso!', 'sucesso');
    }
  }, [carregarConfiguracoes]);

  const exportarConfiguracoes = useCallback(() => {
    const config = {
      performance: configPerformance,
      acessibilidade: configAcessibilidade,
      validacao: configValidacao,
      css: configCSS,
      exportacao: configExportacao,
      versao: '1.0',
      exportadoEm: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(config, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `jurus-configuracoes-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    mostrarNotificacao('Configurações exportadas com sucesso!', 'sucesso');
  }, [configPerformance, configAcessibilidade, configValidacao, configCSS, configExportacao]);

  const importarConfiguracoes = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const arquivo = event.target.files?.[0];
    if (!arquivo) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const config = JSON.parse(e.target?.result as string);
        
        if (config.performance) setConfigPerformance(config.performance);
        if (config.acessibilidade) setConfigAcessibilidade(config.acessibilidade);
        if (config.validacao) setConfigValidacao(config.validacao);
        if (config.css) setConfigCSS(config.css);
        if (config.exportacao) setConfigExportacao(config.exportacao);

        mostrarNotificacao('Configurações importadas com sucesso!', 'sucesso');
      } catch (error) {
        console.error('Erro ao importar configurações:', error);
        mostrarNotificacao('Erro ao processar arquivo de configurações.', 'erro');
      }
    };
    
    reader.readAsText(arquivo);
  }, []);

  const mostrarNotificacao = useCallback((mensagem: string, tipo: 'sucesso' | 'erro' | 'info') => {
    // Implementação da notificação (pode usar um sistema de toast)
    console.log(`${tipo.toUpperCase()}: ${mensagem}`);
  }, []);

  const renderizarPerformance = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900">Configurações de Performance</h3>
        <div className="flex items-center space-x-2">
          <Cpu className="w-5 h-5 text-blue-600" />
          <span className="text-sm text-gray-600">
            {estatisticasPerformance.operacoesPorSegundo} ops/s
          </span>
        </div>
      </div>

      {/* Estatísticas de Performance */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex items-center">
            <Clock className="w-5 h-5 text-blue-600 mr-2" />
            <div>
              <div className="text-sm text-blue-600">Tempo de Carregamento</div>
              <div className="text-lg font-semibold text-blue-900">
                {estatisticasPerformance.tempoCarregamento}ms
              </div>
            </div>
          </div>
        </div>

        <div className="bg-green-50 p-4 rounded-lg">
          <div className="flex items-center">
            <HardDrive className="w-5 h-5 text-green-600 mr-2" />
            <div>
              <div className="text-sm text-green-600">Uso de Memória</div>
              <div className="text-lg font-semibold text-green-900">
                {estatisticasPerformance.usoMemoria}MB
              </div>
            </div>
          </div>
        </div>

        <div className="bg-purple-50 p-4 rounded-lg">
          <div className="flex items-center">
            <Database className="w-5 h-5 text-purple-600 mr-2" />
            <div>
              <div className="text-sm text-purple-600">Temas em Cache</div>
              <div className="text-lg font-semibold text-purple-900">
                {estatisticasPerformance.temasCache}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-orange-50 p-4 rounded-lg">
          <div className="flex items-center">
            <Gauge className="w-5 h-5 text-orange-600 mr-2" />
            <div>
              <div className="text-sm text-orange-600">Performance</div>
              <div className="text-lg font-semibold text-orange-900">
                {estatisticasPerformance.operacoesPorSegundo} ops/s
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Configurações de Animação */}
      <div className="space-y-4">
        <h4 className="font-medium text-gray-900">Animações e Transições</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className="flex items-center justify-between p-3 border rounded-lg">
            <div>
              <span className="font-medium text-sm text-gray-900">Animações Habilitadas</span>
              <p className="text-xs text-gray-600">Ativar animações na interface</p>
            </div>
            <input
              type="checkbox"
              checked={configPerformance.animacoesHabilitadas}
              onChange={(e) => setConfigPerformance(prev => ({ ...prev, animacoesHabilitadas: e.target.checked }))}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
          </label>

          <label className="flex items-center justify-between p-3 border rounded-lg">
            <div>
              <span className="font-medium text-sm text-gray-900">Transições Suaves</span>
              <p className="text-xs text-gray-600">Transições mais fluidas entre temas</p>
            </div>
            <input
              type="checkbox"
              checked={configPerformance.transicoesSuaves}
              onChange={(e) => setConfigPerformance(prev => ({ ...prev, transicoesSuaves: e.target.checked }))}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
          </label>
        </div>
      </div>

      {/* Configurações de Cache */}
      <div className="space-y-4">
        <h4 className="font-medium text-gray-900">Cache e Otimização</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className="flex items-center justify-between p-3 border rounded-lg">
            <div>
              <span className="font-medium text-sm text-gray-900">Preload de Temas</span>
              <p className="text-xs text-gray-600">Carregar temas antecipadamente</p>
            </div>
            <input
              type="checkbox"
              checked={configPerformance.preloadTemas}
              onChange={(e) => setConfigPerformance(prev => ({ ...prev, preloadTemas: e.target.checked }))}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
          </label>

          <label className="flex items-center justify-between p-3 border rounded-lg">
            <div>
              <span className="font-medium text-sm text-gray-900">Cache Local</span>
              <p className="text-xs text-gray-600">Salvar temas no navegador</p>
            </div>
            <input
              type="checkbox"
              checked={configPerformance.cacheLocal}
              onChange={(e) => setConfigPerformance(prev => ({ ...prev, cacheLocal: e.target.checked }))}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
          </label>

          <label className="flex items-center justify-between p-3 border rounded-lg">
            <div>
              <span className="font-medium text-sm text-gray-900">Otimização de Memória</span>
              <p className="text-xs text-gray-600">Liberar recursos não utilizados</p>
            </div>
            <input
              type="checkbox"
              checked={configPerformance.otimizacaoMemoria}
              onChange={(e) => setConfigPerformance(prev => ({ ...prev, otimizacaoMemoria: e.target.checked }))}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
          </label>

          <label className="flex items-center justify-between p-3 border rounded-lg">
            <div>
              <span className="font-medium text-sm text-gray-900">Lazy Loading</span>
              <p className="text-xs text-gray-600">Carregar componentes sob demanda</p>
            </div>
            <input
              type="checkbox"
              checked={configPerformance.lazyLoading}
              onChange={(e) => setConfigPerformance(prev => ({ ...prev, lazyLoading: e.target.checked }))}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
          </label>
        </div>
      </div>

      {/* Configurações Avançadas */}
      <div className="space-y-4">
        <h4 className="font-medium text-gray-900">Configurações Avançadas</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Debounce (ms)
            </label>
            <input
              type="number"
              min="0"
              max="1000"
              value={configPerformance.debounceMs}
              onChange={(e) => setConfigPerformance(prev => ({ ...prev, debounceMs: parseInt(e.target.value) }))}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            />
            <p className="text-xs text-gray-600 mt-1">Atraso para otimizar operações frequentes</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Máximo de Histórico
            </label>
            <input
              type="number"
              min="10"
              max="200"
              value={configPerformance.maxHistorico}
              onChange={(e) => setConfigPerformance(prev => ({ ...prev, maxHistorico: parseInt(e.target.value) }))}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            />
            <p className="text-xs text-gray-600 mt-1">Número máximo de ações no histórico</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderizarAcessibilidade = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900">Configurações de Acessibilidade</h3>
        <div className="flex items-center space-x-2">
          <Accessibility className="w-5 h-5 text-green-600" />
          <span className="text-sm text-gray-600">WCAG {configAcessibilidade.contrasteMinimoWCAG}</span>
        </div>
      </div>

      {/* Configurações Visuais */}
      <div className="space-y-4">
        <h4 className="font-medium text-gray-900">Configurações Visuais</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className="flex items-center justify-between p-3 border rounded-lg">
            <div>
              <span className="font-medium text-sm text-gray-900">Alto Contraste</span>
              <p className="text-xs text-gray-600">Aumentar contraste para melhor visibilidade</p>
            </div>
            <input
              type="checkbox"
              checked={configAcessibilidade.altoContraste}
              onChange={(e) => setConfigAcessibilidade(prev => ({ ...prev, altoContraste: e.target.checked }))}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
          </label>

          <label className="flex items-center justify-between p-3 border rounded-lg">
            <div>
              <span className="font-medium text-sm text-gray-900">Redução de Movimento</span>
              <p className="text-xs text-gray-600">Reduzir animações e transições</p>
            </div>
            <input
              type="checkbox"
              checked={configAcessibilidade.reducaoMovimento}
              onChange={(e) => setConfigAcessibilidade(prev => ({ ...prev, reducaoMovimento: e.target.checked }))}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
          </label>

          <label className="flex items-center justify-between p-3 border rounded-lg">
            <div>
              <span className="font-medium text-sm text-gray-900">Indicadores de Foco</span>
              <p className="text-xs text-gray-600">Destacar elementos em foco</p>
            </div>
            <input
              type="checkbox"
              checked={configAcessibilidade.indicadoresFoco}
              onChange={(e) => setConfigAcessibilidade(prev => ({ ...prev, indicadoresFoco: e.target.checked }))}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
          </label>

          <label className="flex items-center justify-between p-3 border rounded-lg">
            <div>
              <span className="font-medium text-sm text-gray-900">Modo Escuro Automático</span>
              <p className="text-xs text-gray-600">Seguir preferência do sistema</p>
            </div>
            <input
              type="checkbox"
              checked={configAcessibilidade.modoEscuroAutomatico}
              onChange={(e) => setConfigAcessibilidade(prev => ({ ...prev, modoEscuroAutomatico: e.target.checked }))}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
          </label>
        </div>
      </div>

      {/* Configurações de Tipografia */}
      <div className="space-y-4">
        <h4 className="font-medium text-gray-900">Tipografia</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tamanho da Fonte Base (px)
            </label>
            <input
              type="range"
              min="12"
              max="24"
              value={configAcessibilidade.tamanhoFonteBase}
              onChange={(e) => setConfigAcessibilidade(prev => ({ ...prev, tamanhoFonteBase: parseInt(e.target.value) }))}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-600">
              <span>12px</span>
              <span className="font-medium">{configAcessibilidade.tamanhoFonteBase}px</span>
              <span>24px</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Espaçamento entre Linhas
            </label>
            <input
              type="range"
              min="1.2"
              max="2.0"
              step="0.1"
              value={configAcessibilidade.espacamentoLinhas}
              onChange={(e) => setConfigAcessibilidade(prev => ({ ...prev, espacamentoLinhas: parseFloat(e.target.value) }))}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-600">
              <span>1.2</span>
              <span className="font-medium">{configAcessibilidade.espacamentoLinhas}</span>
              <span>2.0</span>
            </div>
          </div>
        </div>
      </div>

      {/* Configurações de Navegação */}
      <div className="space-y-4">
        <h4 className="font-medium text-gray-900">Navegação e Interação</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className="flex items-center justify-between p-3 border rounded-lg">
            <div>
              <span className="font-medium text-sm text-gray-900">Navegação por Teclado</span>
              <p className="text-xs text-gray-600">Permitir navegação apenas com teclado</p>
            </div>
            <input
              type="checkbox"
              checked={configAcessibilidade.navegacaoTeclado}
              onChange={(e) => setConfigAcessibilidade(prev => ({ ...prev, navegacaoTeclado: e.target.checked }))}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
          </label>

          <label className="flex items-center justify-between p-3 border rounded-lg">
            <div>
              <span className="font-medium text-sm text-gray-900">Atalhos de Teclado</span>
              <p className="text-xs text-gray-600">Habilitar atalhos personalizados</p>
            </div>
            <input
              type="checkbox"
              checked={configAcessibilidade.atalhosTeclado}
              onChange={(e) => setConfigAcessibilidade(prev => ({ ...prev, atalhosTeclado: e.target.checked }))}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
          </label>

          <label className="flex items-center justify-between p-3 border rounded-lg">
            <div>
              <span className="font-medium text-sm text-gray-900">Suporte a Leitores de Tela</span>
              <p className="text-xs text-gray-600">Otimizar para tecnologias assistivas</p>
            </div>
            <input
              type="checkbox"
              checked={configAcessibilidade.suporteLeitoresTela}
              onChange={(e) => setConfigAcessibilidade(prev => ({ ...prev, suporteLeitoresTela: e.target.checked }))}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
          </label>

          <label className="flex items-center justify-between p-3 border rounded-lg">
            <div>
              <span className="font-medium text-sm text-gray-900">Tempo de Sessão Estendido</span>
              <p className="text-xs text-gray-600">Mais tempo para interações</p>
            </div>
            <input
              type="checkbox"
              checked={configAcessibilidade.tempoSessaoEstendido}
              onChange={(e) => setConfigAcessibilidade(prev => ({ ...prev, tempoSessaoEstendido: e.target.checked }))}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
          </label>
        </div>
      </div>

      {/* Padrão WCAG */}
      <div className="space-y-4">
        <h4 className="font-medium text-gray-900">Padrões de Acessibilidade</h4>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nível de Conformidade WCAG
          </label>
          <select
            value={configAcessibilidade.contrasteMinimoWCAG}
            onChange={(e) => setConfigAcessibilidade(prev => ({ ...prev, contrasteMinimoWCAG: e.target.value as 'AA' | 'AAA' }))}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="AA">WCAG AA (Contraste 4.5:1)</option>
            <option value="AAA">WCAG AAA (Contraste 7:1)</option>
          </select>
          <p className="text-xs text-gray-600 mt-1">
            Nível de conformidade para validação de contraste
          </p>
        </div>
      </div>
    </div>
  );

  const renderizarValidacao = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900">Validação e Testes</h3>
        <AnimatedButton
          variant="primary"
          onClick={validarTemas}
          disabled={validandoTemas}
        >
          {validandoTemas ? (
            <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <TestTube className="w-4 h-4 mr-2" />
          )}
          Validar Temas
        </AnimatedButton>
      </div>

      {/* Configurações de Validação */}
      <div className="space-y-4">
        <h4 className="font-medium text-gray-900">Tipos de Validação</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className="flex items-center justify-between p-3 border rounded-lg">
            <div>
              <span className="font-medium text-sm text-gray-900">Validar Contraste</span>
              <p className="text-xs text-gray-600">Verificar conformidade WCAG</p>
            </div>
            <input
              type="checkbox"
              checked={configValidacao.validarContraste}
              onChange={(e) => setConfigValidacao(prev => ({ ...prev, validarContraste: e.target.checked }))}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
          </label>

          <label className="flex items-center justify-between p-3 border rounded-lg">
            <div>
              <span className="font-medium text-sm text-gray-900">Validar Tipografia</span>
              <p className="text-xs text-gray-600">Verificar tamanhos e legibilidade</p>
            </div>
            <input
              type="checkbox"
              checked={configValidacao.validarTipografia}
              onChange={(e) => setConfigValidacao(prev => ({ ...prev, validarTipografia: e.target.checked }))}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
          </label>

          <label className="flex items-center justify-between p-3 border rounded-lg">
            <div>
              <span className="font-medium text-sm text-gray-900">Validar Cores</span>
              <p className="text-xs text-gray-600">Verificar harmonia e diversidade</p>
            </div>
            <input
              type="checkbox"
              checked={configValidacao.validarCores}
              onChange={(e) => setConfigValidacao(prev => ({ ...prev, validarCores: e.target.checked }))}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
          </label>

          <label className="flex items-center justify-between p-3 border rounded-lg">
            <div>
              <span className="font-medium text-sm text-gray-900">Alertas em Tempo Real</span>
              <p className="text-xs text-gray-600">Mostrar problemas durante edição</p>
            </div>
            <input
              type="checkbox"
              checked={configValidacao.alertasTempoReal}
              onChange={(e) => setConfigValidacao(prev => ({ ...prev, alertasTempoReal: e.target.checked }))}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
          </label>
        </div>
      </div>

      {/* Nível de Validação */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Nível de Validação
        </label>
        <select
          value={configValidacao.nivelValidacao}
          onChange={(e) => setConfigValidacao(prev => ({ ...prev, nivelValidacao: e.target.value as any }))}
          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="basico">Básico - Verificações essenciais</option>
          <option value="intermediario">Intermediário - Verificações recomendadas</option>
          <option value="avancado">Avançado - Verificações completas</option>
        </select>
      </div>

      {/* Resultados da Validação */}
      {resultadosValidacao.length > 0 && (
        <div className="space-y-4">
          <h4 className="font-medium text-gray-900">Resultados da Validação</h4>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {resultadosValidacao.map((resultado, index) => (
              <div
                key={index}
                className={`p-3 rounded-lg border-l-4 ${
                  resultado.nivel === 'sucesso' ? 'bg-green-50 border-green-500' :
                  resultado.nivel === 'aviso' ? 'bg-yellow-50 border-yellow-500' :
                  'bg-red-50 border-red-500'
                }`}
              >
                <div className="flex items-start">
                  {resultado.nivel === 'sucesso' && <CheckCircle className="w-5 h-5 text-green-600 mr-2 mt-0.5" />}
                  {resultado.nivel === 'aviso' && <AlertTriangle className="w-5 h-5 text-yellow-600 mr-2 mt-0.5" />}
                  {resultado.nivel === 'erro' && <XCircle className="w-5 h-5 text-red-600 mr-2 mt-0.5" />}
                  <div className="flex-1">
                    <div className={`font-medium text-sm ${
                      resultado.nivel === 'sucesso' ? 'text-green-900' :
                      resultado.nivel === 'aviso' ? 'text-yellow-900' :
                      'text-red-900'
                    }`}>
                      {resultado.mensagem}
                    </div>
                    {resultado.detalhes && (
                      <div className={`text-xs mt-1 ${
                        resultado.nivel === 'sucesso' ? 'text-green-700' :
                        resultado.nivel === 'aviso' ? 'text-yellow-700' :
                        'text-red-700'
                      }`}>
                        {resultado.detalhes}
                      </div>
                    )}
                    {resultado.sugestao && (
                      <div className={`text-xs mt-1 italic ${
                        resultado.nivel === 'sucesso' ? 'text-green-600' :
                        resultado.nivel === 'aviso' ? 'text-yellow-600' :
                        'text-red-600'
                      }`}>
                        💡 {resultado.sugestao}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const renderizarCSS = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900">Configurações CSS</h3>
        <Code className="w-5 h-5 text-purple-600" />
      </div>

      {/* CSS Personalizado */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="font-medium text-gray-900">CSS Personalizado</h4>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={configCSS.injecaoCSS}
              onChange={(e) => setConfigCSS(prev => ({ ...prev, injecaoCSS: e.target.checked }))}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-2"
            />
            <span className="text-sm text-gray-700">Habilitar injeção de CSS</span>
          </label>
        </div>

        <div>
          <textarea
            value={configCSS.cssPersonalizado}
            onChange={(e) => setConfigCSS(prev => ({ ...prev, cssPersonalizado: e.target.value }))}
            placeholder="/* Adicione seu CSS personalizado aqui */
.tema-personalizado {
  --cor-primaria: #your-color;
  --fonte-personalizada: 'Your Font', sans-serif;
}"
            className="w-full h-32 p-3 border border-gray-300 rounded-lg font-mono text-sm focus:ring-blue-500 focus:border-blue-500"
            disabled={!configCSS.injecaoCSS}
          />
          <p className="text-xs text-gray-600 mt-1">
            CSS será injetado automaticamente quando habilitado
          </p>
        </div>
      </div>

      {/* Configurações de Geração */}
      <div className="space-y-4">
        <h4 className="font-medium text-gray-900">Geração de CSS</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className="flex items-center justify-between p-3 border rounded-lg">
            <div>
              <span className="font-medium text-sm text-gray-900">Variáveis CSS</span>
              <p className="text-xs text-gray-600">Gerar custom properties</p>
            </div>
            <input
              type="checkbox"
              checked={configCSS.variaveisCSS}
              onChange={(e) => setConfigCSS(prev => ({ ...prev, variaveisCSS: e.target.checked }))}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
          </label>

          <label className="flex items-center justify-between p-3 border rounded-lg">
            <div>
              <span className="font-medium text-sm text-gray-900">Prefixos de Vendor</span>
              <p className="text-xs text-gray-600">Adicionar prefixos para compatibilidade</p>
            </div>
            <input
              type="checkbox"
              checked={configCSS.prefixosVendor}
              onChange={(e) => setConfigCSS(prev => ({ ...prev, prefixosVendor: e.target.checked }))}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
          </label>

          <label className="flex items-center justify-between p-3 border rounded-lg">
            <div>
              <span className="font-medium text-sm text-gray-900">Minificação</span>
              <p className="text-xs text-gray-600">Comprimir CSS gerado</p>
            </div>
            <input
              type="checkbox"
              checked={configCSS.minificacao}
              onChange={(e) => setConfigCSS(prev => ({ ...prev, minificacao: e.target.checked }))}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
          </label>

          <label className="flex items-center justify-between p-3 border rounded-lg">
            <div>
              <span className="font-medium text-sm text-gray-900">Source Maps</span>
              <p className="text-xs text-gray-600">Gerar mapas de origem</p>
            </div>
            <input
              type="checkbox"
              checked={configCSS.sourceMaps}
              onChange={(e) => setConfigCSS(prev => ({ ...prev, sourceMaps: e.target.checked }))}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
          </label>
        </div>
      </div>

      {/* Unidades e Compatibilidade */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Unidade Padrão
          </label>
          <select
            value={configCSS.unidadesPadrao}
            onChange={(e) => setConfigCSS(prev => ({ ...prev, unidadesPadrao: e.target.value as any }))}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="px">Pixels (px)</option>
            <option value="rem">Root EM (rem)</option>
            <option value="em">EM (em)</option>
            <option value="%">Porcentagem (%)</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Navegadores Suportados
          </label>
          <div className="space-y-2">
            {['Chrome', 'Firefox', 'Safari', 'Edge', 'Opera'].map(navegador => (
              <label key={navegador} className="flex items-center">
                <input
                  type="checkbox"
                  checked={configCSS.compatibilidadeNavegadores.includes(navegador)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setConfigCSS(prev => ({
                        ...prev,
                        compatibilidadeNavegadores: [...prev.compatibilidadeNavegadores, navegador]
                      }));
                    } else {
                      setConfigCSS(prev => ({
                        ...prev,
                        compatibilidadeNavegadores: prev.compatibilidadeNavegadores.filter(n => n !== navegador)
                      }));
                    }
                  }}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-2"
                />
                <span className="text-sm text-gray-700">{navegador}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderizarExportacao = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900">Configurações de Exportação</h3>
        <Package className="w-5 h-5 text-indigo-600" />
      </div>

      {/* Formatos Padrão */}
      <div className="space-y-4">
        <h4 className="font-medium text-gray-900">Formatos de Exportação Padrão</h4>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {['json', 'css', 'scss', 'js', 'figma', 'tailwind'].map(formato => (
            <label key={formato} className="flex items-center p-3 border rounded-lg">
              <input
                type="checkbox"
                checked={configExportacao.formatosPadrao.includes(formato)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setConfigExportacao(prev => ({
                      ...prev,
                      formatosPadrao: [...prev.formatosPadrao, formato]
                    }));
                  } else {
                    setConfigExportacao(prev => ({
                      ...prev,
                      formatosPadrao: prev.formatosPadrao.filter(f => f !== formato)
                    }));
                  }
                }}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-2"
              />
              <span className="text-sm text-gray-700 uppercase">{formato}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Opções de Exportação */}
      <div className="space-y-4">
        <h4 className="font-medium text-gray-900">Opções de Exportação</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className="flex items-center justify-between p-3 border rounded-lg">
            <div>
              <span className="font-medium text-sm text-gray-900">Incluir Metadados</span>
              <p className="text-xs text-gray-600">Autor, data, versão, etc.</p>
            </div>
            <input
              type="checkbox"
              checked={configExportacao.incluirMetadados}
              onChange={(e) => setConfigExportacao(prev => ({ ...prev, incluirMetadados: e.target.checked }))}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
          </label>

          <label className="flex items-center justify-between p-3 border rounded-lg">
            <div>
              <span className="font-medium text-sm text-gray-900">Compressão de Arquivos</span>
              <p className="text-xs text-gray-600">Reduzir tamanho dos arquivos</p>
            </div>
            <input
              type="checkbox"
              checked={configExportacao.compressaoArquivos}
              onChange={(e) => setConfigExportacao(prev => ({ ...prev, compressaoArquivos: e.target.checked }))}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
          </label>

          <label className="flex items-center justify-between p-3 border rounded-lg">
            <div>
              <span className="font-medium text-sm text-gray-900">Versionamento</span>
              <p className="text-xs text-gray-600">Controle de versões automático</p>
            </div>
            <input
              type="checkbox"
              checked={configExportacao.versionamento}
              onChange={(e) => setConfigExportacao(prev => ({ ...prev, versionamento: e.target.checked }))}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
          </label>

          <label className="flex items-center justify-between p-3 border rounded-lg">
            <div>
              <span className="font-medium text-sm text-gray-900">Backup Automático</span>
              <p className="text-xs text-gray-600">Criar backups antes da exportação</p>
            </div>
            <input
              type="checkbox"
              checked={configExportacao.backupAutomatico}
              onChange={(e) => setConfigExportacao(prev => ({ ...prev, backupAutomatico: e.target.checked }))}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
          </label>
        </div>
      </div>

      {/* Licença de Uso */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Licença de Uso Padrão
        </label>
        <select
          value={configExportacao.licencaUso}
          onChange={(e) => setConfigExportacao(prev => ({ ...prev, licencaUso: e.target.value }))}
          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="MIT">MIT License</option>
          <option value="Apache-2.0">Apache License 2.0</option>
          <option value="GPL-3.0">GNU General Public License v3.0</option>
          <option value="BSD-3-Clause">BSD 3-Clause License</option>
          <option value="CC-BY-4.0">Creative Commons Attribution 4.0</option>
          <option value="Proprietary">Proprietária</option>
        </select>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-lg shadow-xl w-full max-w-6xl h-[85vh] flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center">
            <Settings className="w-6 h-6 mr-2" />
            Configurações Avançadas
          </h2>
          <div className="flex items-center space-x-2">
            <input
              type="file"
              accept=".json"
              onChange={importarConfiguracoes}
              className="hidden"
              id="import-config"
            />
            <label htmlFor="import-config">
              <AnimatedButton variant="ghost" size="sm">
                <Upload className="w-4 h-4 mr-2" />
                Importar
              </AnimatedButton>
            </label>
            <AnimatedButton
              variant="ghost"
              size="sm"
              onClick={exportarConfiguracoes}
            >
              <Download className="w-4 h-4 mr-2" />
              Exportar
            </AnimatedButton>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden">
          <div className="h-full flex">
            {/* Sidebar */}
            <div className="w-64 bg-gray-50 border-r border-gray-200 p-4">
              <nav className="space-y-2">
                {[
                  { id: 'performance', label: 'Performance', icon: Zap },
                  { id: 'acessibilidade', label: 'Acessibilidade', icon: Accessibility },
                  { id: 'validacao', label: 'Validação', icon: Shield },
                  { id: 'css', label: 'CSS', icon: Code },
                  { id: 'exportacao', label: 'Exportação', icon: Download }
                ].map(({ id, label, icon: Icon }) => (
                  <button
                    key={id}
                    onClick={() => setAbaSelecionada(id as any)}
                    className={`w-full flex items-center px-3 py-2 text-left rounded-lg transition-colors ${
                      abaSelecionada === id
                        ? 'bg-blue-100 text-blue-700 border border-blue-200'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="w-4 h-4 mr-3" />
                    {label}
                  </button>
                ))}
              </nav>
            </div>

            {/* Main Content */}
            <div className="flex-1 p-6 overflow-y-auto">
              {abaSelecionada === 'performance' && renderizarPerformance()}
              {abaSelecionada === 'acessibilidade' && renderizarAcessibilidade()}
              {abaSelecionada === 'validacao' && renderizarValidacao()}
              {abaSelecionada === 'css' && renderizarCSS()}
              {abaSelecionada === 'exportacao' && renderizarExportacao()}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center space-x-4">
            <AnimatedButton
              variant="ghost"
              onClick={resetarConfiguracoes}
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Resetar
            </AnimatedButton>
            <AnimatedButton
              variant="ghost"
              onClick={monitorarPerformance}
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Atualizar Métricas
            </AnimatedButton>
          </div>
          <div className="flex items-center space-x-3">
            <AnimatedButton
              variant="ghost"
              onClick={onFechar}
            >
              Cancelar
            </AnimatedButton>
            <AnimatedButton
              onClick={salvarConfiguracoes}
            >
              <Save className="w-4 h-4 mr-2" />
              Salvar Configurações
            </AnimatedButton>
          </div>
        </div>
      </motion.div>
    </div>
  );
};