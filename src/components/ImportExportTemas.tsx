import { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Download,
  Upload,
  Share2,
  Copy,
  Check,
  X,
  XCircle,
  FileText,
  Image,
  Code,
  Globe,
  Cloud,
  HardDrive,
  Smartphone,
  Monitor,
  Tablet,
  Link,
  QrCode,
  Mail,
  MessageSquare,
  Twitter,
  Facebook,
  Instagram,
  Github,
  Figma,
  Palette,
  Package,
  Archive,
  FolderOpen,
  Save,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Info,
  ExternalLink,
  Zap,
  Star,
  Heart,
  Eye,
  Users,
  Calendar,
  Clock,
  Tag,
  Filter,
  Search,
  SortAsc,
  SortDesc,
  Grid,
  List,
  MoreHorizontal,
  Settings,
  Trash2,
  Edit3
} from 'lucide-react';
import { TemaAvancado, ConfiguracaoTemaAvancada } from '../types/temas';
import { AnimatedContainer, AnimatedItem } from './AnimatedContainer';
import { AnimatedButton } from './AnimatedButton';

interface ImportExportTemasProps {
  temas: TemaAvancado[];
  configuracao: ConfiguracaoTemaAvancada;
  onImportarTemas: (temas: TemaAvancado[]) => void;
  onImportarConfiguracao: (config: ConfiguracaoTemaAvancada) => void;
  onFechar: () => void;
}

interface FormatoExportacao {
  id: string;
  nome: string;
  descricao: string;
  extensao: string;
  icon: any;
  suportaMultiplos: boolean;
  suportaConfiguracao: boolean;
}

interface PlataformaCompartilhamento {
  id: string;
  nome: string;
  icon: any;
  cor: string;
  url: (dados: string) => string;
}

interface BackupInfo {
  id: string;
  nome: string;
  data: string;
  temas: number;
  tamanho: string;
  versao: string;
}

const formatosExportacao: FormatoExportacao[] = [
  {
    id: 'json',
    nome: 'JSON',
    descricao: 'Formato padrão do Jurus com todas as configurações',
    extensao: '.json',
    icon: FileText,
    suportaMultiplos: true,
    suportaConfiguracao: true
  },
  {
    id: 'css',
    nome: 'CSS Variables',
    descricao: 'Variáveis CSS para uso em outros projetos',
    extensao: '.css',
    icon: Code,
    suportaMultiplos: true,
    suportaConfiguracao: false
  },
  {
    id: 'scss',
    nome: 'SCSS Variables',
    descricao: 'Variáveis SCSS/Sass para preprocessadores',
    extensao: '.scss',
    icon: Code,
    suportaMultiplos: true,
    suportaConfiguracao: false
  },
  {
    id: 'js',
    nome: 'JavaScript Object',
    descricao: 'Objeto JavaScript para importação em código',
    extensao: '.js',
    icon: Code,
    suportaMultiplos: true,
    suportaConfiguracao: false
  },
  {
    id: 'figma',
    nome: 'Figma Tokens',
    descricao: 'Tokens de design para Figma',
    extensao: '.json',
    icon: Figma,
    suportaMultiplos: false,
    suportaConfiguracao: false
  },
  {
    id: 'tailwind',
    nome: 'Tailwind Config',
    descricao: 'Configuração para Tailwind CSS',
    extensao: '.js',
    icon: Code,
    suportaMultiplos: false,
    suportaConfiguracao: false
  }
];

const plataformasCompartilhamento: PlataformaCompartilhamento[] = [
  {
    id: 'link',
    nome: 'Link Direto',
    icon: Link,
    cor: 'blue',
    url: (dados) => `${window.location.origin}/tema/compartilhado?data=${encodeURIComponent(dados)}`
  },
  {
    id: 'qr',
    nome: 'QR Code',
    icon: QrCode,
    cor: 'gray',
    url: (dados) => `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(dados)}`
  },
  {
    id: 'email',
    nome: 'Email',
    icon: Mail,
    cor: 'red',
    url: (dados) => `mailto:?subject=Tema Jurus&body=Confira este tema: ${encodeURIComponent(dados)}`
  },
  {
    id: 'whatsapp',
    nome: 'WhatsApp',
    icon: MessageSquare,
    cor: 'green',
    url: (dados) => `https://wa.me/?text=Confira este tema: ${encodeURIComponent(dados)}`
  },
  {
    id: 'twitter',
    nome: 'Twitter',
    icon: Twitter,
    cor: 'blue',
    url: (dados) => `https://twitter.com/intent/tweet?text=Confira este tema incrível!&url=${encodeURIComponent(dados)}`
  },
  {
    id: 'github',
    nome: 'GitHub Gist',
    icon: Github,
    cor: 'gray',
    url: (dados) => `https://gist.github.com/new`
  }
];

export const ImportExportTemas: React.FC<ImportExportTemasProps> = ({
  temas,
  configuracao,
  onImportarTemas,
  onImportarConfiguracao,
  onFechar
}) => {
  const [abaSelecionada, setAbaSelecionada] = useState<'exportar' | 'importar' | 'compartilhar' | 'backup'>('exportar');
  const [formatoSelecionado, setFormatoSelecionado] = useState<string>('json');
  const [temasSelecionados, setTemasSelecionados] = useState<string[]>([]);
  const [incluirConfiguracao, setIncluirConfiguracao] = useState(true);
  const [linkCompartilhamento, setLinkCompartilhamento] = useState<string>('');
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [backups, setBackups] = useState<BackupInfo[]>([]);
  const [carregandoBackup, setCarregandoBackup] = useState(false);
  const [mensagemStatus, setMensagemStatus] = useState<{ tipo: 'success' | 'error' | 'info'; texto: string } | null>(null);
  
  const inputArquivoRef = useRef<HTMLInputElement>(null);

  // Carregar backups salvos
  useState(() => {
    carregarBackups();
  });

  const carregarBackups = useCallback(() => {
    try {
      const backupsSalvos = localStorage.getItem('jurus-backups');
      if (backupsSalvos) {
        setBackups(JSON.parse(backupsSalvos));
      }
    } catch (error) {
      console.error('Erro ao carregar backups:', error);
    }
  }, []);

  const salvarBackup = useCallback((nome: string) => {
    const backup: BackupInfo = {
      id: Date.now().toString(),
      nome,
      data: new Date().toISOString(),
      temas: temas.length,
      tamanho: calcularTamanho(temas, configuracao),
      versao: '1.0'
    };

    const dadosBackup = {
      backup,
      temas,
      configuracao,
      versao: '1.0',
      criadoEm: new Date().toISOString()
    };

    try {
      localStorage.setItem(`jurus-backup-${backup.id}`, JSON.stringify(dadosBackup));
      
      const novosBackups = [...backups, backup];
      setBackups(novosBackups);
      localStorage.setItem('jurus-backups', JSON.stringify(novosBackups));

      mostrarMensagem('success', 'Backup criado com sucesso!');
    } catch (error) {
      console.error('Erro ao salvar backup:', error);
      mostrarMensagem('error', 'Erro ao criar backup. Verifique o espaço disponível.');
    }
  }, [temas, configuracao, backups]);

  const restaurarBackup = useCallback(async (backupId: string) => {
    setCarregandoBackup(true);
    try {
      const dadosBackup = localStorage.getItem(`jurus-backup-${backupId}`);
      if (!dadosBackup) {
        throw new Error('Backup não encontrado');
      }

      const backup = JSON.parse(dadosBackup);
      
      if (backup.temas) {
        onImportarTemas(backup.temas);
      }
      
      if (backup.configuracao) {
        onImportarConfiguracao(backup.configuracao);
      }

      mostrarMensagem('success', 'Backup restaurado com sucesso!');
    } catch (error) {
      console.error('Erro ao restaurar backup:', error);
      mostrarMensagem('error', 'Erro ao restaurar backup.');
    } finally {
      setCarregandoBackup(false);
    }
  }, [onImportarTemas, onImportarConfiguracao]);

  const excluirBackup = useCallback((backupId: string) => {
    try {
      localStorage.removeItem(`jurus-backup-${backupId}`);
      
      const novosBackups = backups.filter(b => b.id !== backupId);
      setBackups(novosBackups);
      localStorage.setItem('jurus-backups', JSON.stringify(novosBackups));

      mostrarMensagem('success', 'Backup excluído com sucesso!');
    } catch (error) {
      console.error('Erro ao excluir backup:', error);
      mostrarMensagem('error', 'Erro ao excluir backup.');
    }
  }, [backups]);

  const calcularTamanho = useCallback((temas: TemaAvancado[], config: ConfiguracaoTemaAvancada) => {
    const dados = JSON.stringify({ temas, config });
    const bytes = new Blob([dados]).size;
    
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }, []);

  const mostrarMensagem = useCallback((tipo: 'success' | 'error' | 'info', texto: string) => {
    setMensagemStatus({ tipo, texto });
    setTimeout(() => setMensagemStatus(null), 5000);
  }, []);

  const exportarTemas = useCallback(() => {
    const formato = formatosExportacao.find(f => f.id === formatoSelecionado);
    if (!formato) return;

    const temasParaExportar = temasSelecionados.length > 0 
      ? temas.filter(t => temasSelecionados.includes(t.id))
      : temas;

    let conteudo = '';
    let nomeArquivo = '';

    switch (formato.id) {
      case 'json':
        const dadosJson = {
          temas: temasParaExportar,
          ...(incluirConfiguracao && formato.suportaConfiguracao ? { configuracao } : {}),
          versao: '1.0',
          exportadoEm: new Date().toISOString()
        };
        conteudo = JSON.stringify(dadosJson, null, 2);
        nomeArquivo = `temas-jurus-${new Date().toISOString().split('T')[0]}.json`;
        break;

      case 'css':
        conteudo = gerarCSS(temasParaExportar);
        nomeArquivo = `temas-jurus.css`;
        break;

      case 'scss':
        conteudo = gerarSCSS(temasParaExportar);
        nomeArquivo = `temas-jurus.scss`;
        break;

      case 'js':
        conteudo = gerarJavaScript(temasParaExportar);
        nomeArquivo = `temas-jurus.js`;
        break;

      case 'figma':
        conteudo = gerarFigmaTokens(temasParaExportar[0]); // Apenas um tema
        nomeArquivo = `figma-tokens.json`;
        break;

      case 'tailwind':
        conteudo = gerarTailwindConfig(temasParaExportar[0]); // Apenas um tema
        nomeArquivo = `tailwind.config.js`;
        break;

      default:
        mostrarMensagem('error', 'Formato não suportado');
        return;
    }

    // Download do arquivo
    const blob = new Blob([conteudo], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = nomeArquivo;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    mostrarMensagem('success', `Temas exportados como ${formato.nome}!`);
  }, [formatoSelecionado, temasSelecionados, temas, incluirConfiguracao, configuracao]);

  const importarTemas = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const arquivo = event.target.files?.[0];
    if (!arquivo) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const conteudo = e.target?.result as string;
        
        if (arquivo.name.endsWith('.json')) {
          const dados = JSON.parse(conteudo);
          
          if (dados.temas && Array.isArray(dados.temas)) {
            onImportarTemas(dados.temas);
            mostrarMensagem('success', `${dados.temas.length} tema(s) importado(s) com sucesso!`);
          }
          
          if (dados.configuracao) {
            onImportarConfiguracao(dados.configuracao);
            mostrarMensagem('success', 'Configuração importada com sucesso!');
          }
        } else {
          mostrarMensagem('error', 'Formato de arquivo não suportado para importação.');
        }
      } catch (error) {
        console.error('Erro ao importar:', error);
        mostrarMensagem('error', 'Erro ao processar arquivo. Verifique o formato.');
      }
    };
    
    reader.readAsText(arquivo);
    
    // Limpar input
    if (inputArquivoRef.current) {
      inputArquivoRef.current.value = '';
    }
  }, [onImportarTemas, onImportarConfiguracao]);

  const gerarLinkCompartilhamento = useCallback(() => {
    const temasParaCompartilhar = temasSelecionados.length > 0 
      ? temas.filter(t => temasSelecionados.includes(t.id))
      : temas;

    const dados = {
      temas: temasParaCompartilhar,
      versao: '1.0',
      compartilhadoEm: new Date().toISOString()
    };

    const dadosComprimidos = btoa(JSON.stringify(dados));
    const link = `${window.location.origin}/tema/compartilhado?data=${dadosComprimidos}`;
    
    setLinkCompartilhamento(link);
    
    // Gerar QR Code
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(link)}`;
    setQrCodeUrl(qrUrl);

    mostrarMensagem('success', 'Link de compartilhamento gerado!');
  }, [temas, temasSelecionados]);

  const copiarLink = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(linkCompartilhamento);
      mostrarMensagem('success', 'Link copiado para a área de transferência!');
    } catch (error) {
      console.error('Erro ao copiar link:', error);
      mostrarMensagem('error', 'Erro ao copiar link.');
    }
  }, [linkCompartilhamento]);

  const compartilharEm = useCallback((plataforma: PlataformaCompartilhamento) => {
    if (!linkCompartilhamento) {
      gerarLinkCompartilhamento();
      return;
    }

    const url = plataforma.url(linkCompartilhamento);
    window.open(url, '_blank');
  }, [linkCompartilhamento, gerarLinkCompartilhamento]);

  const toggleTema = useCallback((temaId: string) => {
    setTemasSelecionados(prev => 
      prev.includes(temaId)
        ? prev.filter(id => id !== temaId)
        : [...prev, temaId]
    );
  }, []);

  const selecionarTodos = useCallback(() => {
    setTemasSelecionados(temas.map(t => t.id));
  }, [temas]);

  const limparSelecao = useCallback(() => {
    setTemasSelecionados([]);
  }, []);

  // Funções de geração de código
  const gerarCSS = (temas: TemaAvancado[]) => {
    let css = '/* Temas Jurus - Variáveis CSS */\n\n';
    
    temas.forEach(tema => {
      css += `/* Tema: ${tema.nome} */\n`;
      css += `.tema-${tema.id.toLowerCase().replace(/\s+/g, '-')} {\n`;
      
      Object.entries(tema.cores).forEach(([propriedade, valor]) => {
        css += `  --cor-${propriedade}: ${valor};\n`;
      });
      
      css += `  --fonte-primaria: ${tema.tipografia.fontePrimaria};\n`;
      css += `  --fonte-secundaria: ${tema.tipografia.fonteSecundaria};\n`;
      css += `}\n\n`;
    });
    
    return css;
  };

  const gerarSCSS = (temas: TemaAvancado[]) => {
    let scss = '// Temas Jurus - Variáveis SCSS\n\n';
    
    temas.forEach(tema => {
      scss += `// Tema: ${tema.nome}\n`;
      scss += `$tema-${tema.id.toLowerCase().replace(/\s+/g, '-')}: (\n`;
      
      Object.entries(tema.cores).forEach(([propriedade, valor]) => {
        scss += `  ${propriedade}: ${valor},\n`;
      });
      
      scss += `);\n\n`;
    });
    
    return scss;
  };

  const gerarJavaScript = (temas: TemaAvancado[]) => {
    let js = '// Temas Jurus - Objeto JavaScript\n\n';
    js += 'export const temas = {\n';
    
    temas.forEach((tema, index) => {
      js += `  '${tema.id}': {\n`;
      js += `    nome: '${tema.nome}',\n`;
      js += `    cores: {\n`;
      
      Object.entries(tema.cores).forEach(([propriedade, valor]) => {
        js += `      ${propriedade}: '${valor}',\n`;
      });
      
      js += `    },\n`;
      js += `    tipografia: {\n`;
      js += `      primary: '${tema.tipografia.fontePrimaria}',\n`;
      js += `      secondary: '${tema.tipografia.fonteSecundaria}',\n`;
      js += `    }\n`;
      js += `  }${index < temas.length - 1 ? ',' : ''}\n`;
    });
    
    js += '};\n';
    return js;
  };

  const gerarFigmaTokens = (tema: TemaAvancado) => {
    const tokens = {
      global: {
        colors: {}
      }
    };

    Object.entries(tema.cores).forEach(([propriedade, valor]) => {
      (tokens.global.colors as any)[propriedade] = {
        value: valor,
        type: 'color'
      };
    });

    return JSON.stringify(tokens, null, 2);
  };

  const gerarTailwindConfig = (tema: TemaAvancado) => {
    let config = '// Configuração Tailwind CSS\n\n';
    config += 'module.exports = {\n';
    config += '  theme: {\n';
    config += '    extend: {\n';
    config += '      colors: {\n';
    
    Object.entries(tema.cores).forEach(([propriedade, valor]) => {
      config += `        '${propriedade}': '${valor}',\n`;
    });
    
    config += '      },\n';
    config += '      fontFamily: {\n';
    config += `        'primary': ['${tema.tipografia.fontePrimaria}'],\n`;
    config += `        'secondary': ['${tema.tipografia.fonteSecundaria}'],\n`;
    config += '      }\n';
    config += '    }\n';
    config += '  }\n';
    config += '};\n';
    
    return config;
  };

  const renderizarExportar = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900">Exportar Temas</h3>
        <div className="flex space-x-2">
          <AnimatedButton
            variant="ghost"
            size="sm"
            onClick={selecionarTodos}
          >
            Selecionar Todos
          </AnimatedButton>
          <AnimatedButton
            variant="ghost"
            size="sm"
            onClick={limparSelecao}
          >
            Limpar Seleção
          </AnimatedButton>
        </div>
      </div>

      {/* Seleção de temas */}
      <div className="space-y-4">
        <h4 className="font-medium text-gray-900">Temas para Exportar</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {temas.map(tema => (
            <label
              key={tema.id}
              className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${
                temasSelecionados.includes(tema.id)
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <input
                type="checkbox"
                checked={temasSelecionados.includes(tema.id)}
                onChange={() => toggleTema(tema.id)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <div className="ml-3 flex-1">
                <div className="font-medium text-sm text-gray-900">{tema.nome}</div>
                <div className="flex space-x-1 mt-1">
                  {Object.values(tema.cores).slice(0, 4).map((cor, index) => (
                    <div
                      key={index}
                      className="w-3 h-3 rounded-full border border-gray-200"
                      style={{ backgroundColor: cor }}
                    />
                  ))}
                </div>
              </div>
            </label>
          ))}
        </div>
        
        {temasSelecionados.length === 0 && (
          <p className="text-sm text-gray-600">
            Nenhum tema selecionado. Todos os temas serão exportados.
          </p>
        )}
      </div>

      {/* Formato de exportação */}
      <div className="space-y-4">
        <h4 className="font-medium text-gray-900">Formato de Exportação</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {formatosExportacao.map(formato => (
            <label
              key={formato.id}
              className={`flex items-start p-4 border rounded-lg cursor-pointer transition-colors ${
                formatoSelecionado === formato.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <input
                type="radio"
                name="formato"
                value={formato.id}
                checked={formatoSelecionado === formato.id}
                onChange={(e) => setFormatoSelecionado(e.target.value)}
                className="mt-1 border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <div className="ml-3 flex-1">
                <div className="flex items-center">
                  <formato.icon className="w-4 h-4 text-gray-600 mr-2" />
                  <span className="font-medium text-sm text-gray-900">{formato.nome}</span>
                </div>
                <p className="text-xs text-gray-600 mt-1">{formato.descricao}</p>
                <div className="flex space-x-2 mt-2">
                  {formato.suportaMultiplos && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                      Múltiplos temas
                    </span>
                  )}
                  {formato.suportaConfiguracao && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                      Configuração
                    </span>
                  )}
                </div>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Opções adicionais */}
      {formatosExportacao.find(f => f.id === formatoSelecionado)?.suportaConfiguracao && (
        <div className="space-y-4">
          <h4 className="font-medium text-gray-900">Opções Adicionais</h4>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={incluirConfiguracao}
              onChange={(e) => setIncluirConfiguracao(e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="ml-2 text-sm text-gray-700">
              Incluir configurações do sistema
            </span>
          </label>
        </div>
      )}

      {/* Botão de exportação */}
      <div className="flex justify-end">
        <AnimatedButton
          variant="primary"
          onClick={exportarTemas}
          disabled={temas.length === 0}
        >
          <Download className="w-4 h-4 mr-2" />
          Exportar Temas
        </AnimatedButton>
      </div>
    </div>
  );

  const renderizarImportar = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900">Importar Temas</h3>
      </div>

      {/* Área de upload */}
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
        <input
          ref={inputArquivoRef}
          type="file"
          accept=".json"
          onChange={importarTemas}
          className="hidden"
          id="upload-temas"
        />
        <label htmlFor="upload-temas" className="cursor-pointer">
          <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h4 className="text-lg font-medium text-gray-900 mb-2">
            Importar Arquivo de Temas
          </h4>
          <p className="text-gray-600 mb-4">
            Clique para selecionar um arquivo JSON com temas exportados do Jurus
          </p>
          <AnimatedButton variant="primary">
            Selecionar Arquivo
          </AnimatedButton>
        </label>
      </div>

      {/* Formatos suportados */}
      <div className="space-y-4">
        <h4 className="font-medium text-gray-900">Formatos Suportados</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex items-center p-3 bg-gray-50 rounded-lg">
            <FileText className="w-5 h-5 text-blue-600 mr-3" />
            <div>
              <div className="font-medium text-sm text-gray-900">JSON Jurus</div>
              <div className="text-xs text-gray-600">Formato nativo com todas as configurações</div>
            </div>
          </div>
          <div className="flex items-center p-3 bg-gray-50 rounded-lg">
            <Package className="w-5 h-5 text-green-600 mr-3" />
            <div>
              <div className="font-medium text-sm text-gray-900">Backup Jurus</div>
              <div className="text-xs text-gray-600">Backup completo do sistema</div>
            </div>
          </div>
        </div>
      </div>

      {/* Instruções */}
      <div className="p-4 bg-blue-50 rounded-lg">
        <h4 className="font-medium text-blue-900 mb-2 flex items-center">
          <Info className="w-4 h-4 mr-2" />
          Instruções de Importação
        </h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Apenas arquivos JSON são suportados para importação</li>
          <li>• Temas duplicados serão substituídos automaticamente</li>
          <li>• Configurações serão mescladas com as existentes</li>
          <li>• Faça um backup antes de importar temas de fontes desconhecidas</li>
        </ul>
      </div>
    </div>
  );

  const renderizarCompartilhar = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900">Compartilhar Temas</h3>
        <AnimatedButton
          variant="primary"
          onClick={gerarLinkCompartilhamento}
          disabled={temas.length === 0}
        >
          <Share2 className="w-4 h-4 mr-2" />
          Gerar Link
        </AnimatedButton>
      </div>

      {/* Seleção de temas para compartilhar */}
      <div className="space-y-4">
        <h4 className="font-medium text-gray-900">Temas para Compartilhar</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {temas.map(tema => (
            <label
              key={tema.id}
              className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${
                temasSelecionados.includes(tema.id)
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <input
                type="checkbox"
                checked={temasSelecionados.includes(tema.id)}
                onChange={() => toggleTema(tema.id)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <div className="ml-3 flex-1">
                <div className="font-medium text-sm text-gray-900">{tema.nome}</div>
                <div className="flex space-x-1 mt-1">
                  {Object.values(tema.cores).slice(0, 4).map((cor, index) => (
                    <div
                      key={index}
                      className="w-3 h-3 rounded-full border border-gray-200"
                      style={{ backgroundColor: cor }}
                    />
                  ))}
                </div>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Link de compartilhamento */}
      {linkCompartilhamento && (
        <div className="space-y-4">
          <h4 className="font-medium text-gray-900">Link de Compartilhamento</h4>
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={linkCompartilhamento}
              readOnly
              className="flex-1 p-2 border border-gray-300 rounded-lg bg-gray-50 text-sm"
            />
            <AnimatedButton
              variant="outline"
              size="sm"
              onClick={copiarLink}
            >
              <Copy className="w-4 h-4" />
            </AnimatedButton>
          </div>

          {/* QR Code */}
          {qrCodeUrl && (
            <div className="flex justify-center">
              <div className="text-center">
                <img
                  src={qrCodeUrl}
                  alt="QR Code"
                  className="w-32 h-32 border border-gray-200 rounded-lg"
                />
                <p className="text-xs text-gray-600 mt-2">QR Code para compartilhamento</p>
              </div>
            </div>
          )}

          {/* Plataformas de compartilhamento */}
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900">Compartilhar em</h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {plataformasCompartilhamento.map(plataforma => (
                <button
                  key={plataforma.id}
                  onClick={() => compartilharEm(plataforma)}
                  className={`flex items-center p-3 border rounded-lg hover:bg-gray-50 transition-colors text-${plataforma.cor}-600 border-${plataforma.cor}-200`}
                >
                  <plataforma.icon className="w-5 h-5 mr-3" />
                  <span className="font-medium text-sm">{plataforma.nome}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderizarBackup = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900">Backup e Restauração</h3>
        <AnimatedButton
          variant="primary"
          onClick={() => {
            const nome = prompt('Nome do backup:');
            if (nome) salvarBackup(nome);
          }}
        >
          <Save className="w-4 h-4 mr-2" />
          Criar Backup
        </AnimatedButton>
      </div>

      {/* Lista de backups */}
      <div className="space-y-4">
        <h4 className="font-medium text-gray-900">Backups Salvos</h4>
        
        {backups.length === 0 ? (
          <div className="text-center py-8">
            <Archive className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Nenhum backup encontrado
            </h3>
            <p className="text-gray-600 mb-4">
              Crie backups regulares para proteger seus temas e configurações.
            </p>
            <AnimatedButton
              variant="primary"
              onClick={() => {
                const nome = prompt('Nome do backup:');
                if (nome) salvarBackup(nome);
              }}
            >
              <Save className="w-4 h-4 mr-2" />
              Criar Primeiro Backup
            </AnimatedButton>
          </div>
        ) : (
          <div className="space-y-3">
            {backups.map(backup => (
              <div
                key={backup.id}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
              >
                <div className="flex-1">
                  <div className="flex items-center">
                    <Archive className="w-5 h-5 text-gray-600 mr-3" />
                    <div>
                      <div className="font-medium text-gray-900">{backup.nome}</div>
                      <div className="text-sm text-gray-600">
                        {new Date(backup.data).toLocaleString()} • {backup.temas} temas • {backup.tamanho}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <AnimatedButton
                    variant="outline"
                    size="sm"
                    onClick={() => restaurarBackup(backup.id)}
                    disabled={carregandoBackup}
                  >
                    {carregandoBackup ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <Upload className="w-4 h-4" />
                    )}
                  </AnimatedButton>
                  
                  <button
                    onClick={() => {
                      if (confirm('Tem certeza que deseja excluir este backup?')) {
                        excluirBackup(backup.id);
                      }
                    }}
                    className="p-2 text-red-600 hover:text-red-800 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Informações sobre backup */}
      <div className="p-4 bg-yellow-50 rounded-lg">
        <h4 className="font-medium text-yellow-900 mb-2 flex items-center">
          <AlertTriangle className="w-4 h-4 mr-2" />
          Importante sobre Backups
        </h4>
        <ul className="text-sm text-yellow-800 space-y-1">
          <li>• Backups são salvos localmente no navegador</li>
          <li>• Limpar dados do navegador removerá os backups</li>
          <li>• Exporte backups importantes como arquivos JSON</li>
          <li>• Backups incluem todos os temas e configurações</li>
        </ul>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-lg shadow-xl w-full max-w-4xl h-[80vh] flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            Importar & Exportar Temas
          </h2>
          <button
            onClick={onFechar}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Navegação por abas */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'exportar', nome: 'Exportar', icon: Download },
              { id: 'importar', nome: 'Importar', icon: Upload },
              { id: 'compartilhar', nome: 'Compartilhar', icon: Share2 },
              { id: 'backup', nome: 'Backup', icon: Archive }
            ].map(aba => (
              <button
                key={aba.id}
                onClick={() => setAbaSelecionada(aba.id as any)}
                className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  abaSelecionada === aba.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <aba.icon className="w-4 h-4 mr-2" />
                {aba.nome}
              </button>
            ))}
          </nav>
        </div>

        {/* Conteúdo */}
        <div className="flex-1 overflow-y-auto p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={abaSelecionada}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
            >
              {abaSelecionada === 'exportar' && renderizarExportar()}
              {abaSelecionada === 'importar' && renderizarImportar()}
              {abaSelecionada === 'compartilhar' && renderizarCompartilhar()}
              {abaSelecionada === 'backup' && renderizarBackup()}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Mensagem de status */}
        <AnimatePresence>
          {mensagemStatus && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              className={`fixed bottom-4 right-4 p-4 rounded-lg shadow-lg flex items-center ${
                mensagemStatus.tipo === 'success' ? 'bg-green-600 text-white' :
                mensagemStatus.tipo === 'error' ? 'bg-red-600 text-white' :
                'bg-blue-600 text-white'
              }`}
            >
              {mensagemStatus.tipo === 'success' && <CheckCircle className="w-5 h-5 mr-2" />}
              {mensagemStatus.tipo === 'error' && <XCircle className="w-5 h-5 mr-2" />}
              {mensagemStatus.tipo === 'info' && <Info className="w-5 h-5 mr-2" />}
              <span>{mensagemStatus.texto}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default ImportExportTemas;