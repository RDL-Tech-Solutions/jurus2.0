import { useState, useCallback, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Palette,
  Type,
  Layout,
  Sliders,
  Eye,
  Save,
  Undo,
  Redo,
  Copy,
  Download,
  Upload,
  RefreshCw,
  Zap,
  Sun,
  Moon,
  Contrast,
  Accessibility,
  Sparkles,
  Image,
  Code,
  Settings,
  ChevronDown,
  ChevronRight,
  Plus,
  Minus,
  RotateCcw,
  Check,
  X,
  AlertTriangle,
  Info
} from 'lucide-react';
import { TemaAvancado, PaletaCores, TipoHarmoniaCor, ValidacaoContraste } from '../types/temas';
import { AnimatedContainer, AnimatedItem } from './AnimatedContainer';
import { AnimatedButton } from './AnimatedButton';

interface EditorTemasProps {
  tema: TemaAvancado;
  onSalvarTema: (tema: TemaAvancado) => void;
  onCancelar: () => void;
  onPreview: (tema: TemaAvancado) => void;
  historico: TemaAvancado[];
  indiceHistorico: number;
  onUndo: () => void;
  onRedo: () => void;
  podeUndo: boolean;
  podeRedo: boolean;
}

interface SecaoEditor {
  id: string;
  titulo: string;
  icon: any;
  expandida: boolean;
}

const harmoniasCores: { tipo: TipoHarmoniaCor; nome: string; descricao: string }[] = [
  { tipo: 'complementary', nome: 'Complementar', descricao: 'Cores opostas no círculo cromático' },
  { tipo: 'triadic', nome: 'Triádica', descricao: 'Três cores equidistantes' },
  { tipo: 'analogous', nome: 'Análoga', descricao: 'Cores adjacentes no círculo' },
  { tipo: 'monochromatic', nome: 'Monocromática', descricao: 'Variações de uma cor' },
  { tipo: 'split-complementary', nome: 'Complementar Dividida', descricao: 'Uma cor e duas adjacentes à complementar' },
  { tipo: 'tetradic', nome: 'Tetrádica', descricao: 'Quatro cores em retângulo' }
];

const fontesDisponiveis = [
  { familia: 'Inter', categoria: 'Sans-serif', peso: 'Variable' },
  { familia: 'Roboto', categoria: 'Sans-serif', peso: '300,400,500,700' },
  { familia: 'Open Sans', categoria: 'Sans-serif', peso: '300,400,600,700' },
  { familia: 'Lato', categoria: 'Sans-serif', peso: '300,400,700' },
  { familia: 'Poppins', categoria: 'Sans-serif', peso: '300,400,500,600,700' },
  { familia: 'Montserrat', categoria: 'Sans-serif', peso: '300,400,500,600,700' },
  { familia: 'Source Sans Pro', categoria: 'Sans-serif', peso: '300,400,600,700' },
  { familia: 'Nunito', categoria: 'Sans-serif', peso: '300,400,600,700' },
  { familia: 'Playfair Display', categoria: 'Serif', peso: '400,700' },
  { familia: 'Merriweather', categoria: 'Serif', peso: '300,400,700' },
  { familia: 'Lora', categoria: 'Serif', peso: '400,500,600,700' },
  { familia: 'Crimson Text', categoria: 'Serif', peso: '400,600' },
  { familia: 'Fira Code', categoria: 'Monospace', peso: '300,400,500,600,700' },
  { familia: 'Source Code Pro', categoria: 'Monospace', peso: '300,400,500,600,700' },
  { familia: 'JetBrains Mono', categoria: 'Monospace', peso: '300,400,500,600,700' }
];

export const EditorTemas: React.FC<EditorTemasProps> = ({
  tema,
  onSalvarTema,
  onCancelar,
  onPreview,
  historico,
  indiceHistorico,
  onUndo,
  onRedo,
  podeUndo,
  podeRedo
}) => {
  const [temaEditando, setTemaEditando] = useState<TemaAvancado>(tema);
  const [secoes, setSecoes] = useState<SecaoEditor[]>([
    { id: 'cores', titulo: 'Cores', icon: Palette, expandida: true },
    { id: 'tipografia', titulo: 'Tipografia', icon: Type, expandida: false },
    { id: 'espacamento', titulo: 'Espaçamento', icon: Layout, expandida: false },
    { id: 'bordas', titulo: 'Bordas e Sombras', icon: Sliders, expandida: false },
    { id: 'animacoes', titulo: 'Animações', icon: Zap, expandida: false },
    { id: 'acessibilidade', titulo: 'Acessibilidade', icon: Accessibility, expandida: false }
  ]);
  
  const [corSelecionada, setCorSelecionada] = useState<keyof PaletaCores>('primaria');
  const [harmoniaAtiva, setHarmoniaAtiva] = useState<TipoHarmoniaCor>('complementary');
  const [validacaoContraste, setValidacaoContraste] = useState<ValidacaoContraste | null>(null);
  const [modoPreview, setModoPreview] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [mostrarCodigo, setMostrarCodigo] = useState(false);
  const [imagemPaleta, setImagemPaleta] = useState<File | null>(null);

  // Atualizar tema quando props mudam
  useEffect(() => {
    setTemaEditando(tema);
  }, [tema]);

  // Preview em tempo real
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      onPreview(temaEditando);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [temaEditando, onPreview]);

  const toggleSecao = useCallback((secaoId: string) => {
    setSecoes(prev => prev.map(secao => 
      secao.id === secaoId 
        ? { ...secao, expandida: !secao.expandida }
        : secao
    ));
  }, []);

  const atualizarCor = useCallback((propriedade: keyof PaletaCores, valor: string) => {
    setTemaEditando(prev => ({
      ...prev,
      cores: {
        ...prev.cores,
        [propriedade]: valor
      }
    }));
  }, []);

  const gerarHarmoniaCores = useCallback((corBase: string, tipo: TipoHarmoniaCor) => {
    // Implementação simplificada - em produção usaria uma biblioteca de cores
    const hsl = hexToHsl(corBase);
    const harmonias: Record<TipoHarmoniaCor, string[]> = {
      'complementary': [
        corBase,
        hslToHex((hsl.h + 180) % 360, hsl.s, hsl.l)
      ],
      'triadic': [
        corBase,
        hslToHex((hsl.h + 120) % 360, hsl.s, hsl.l),
        hslToHex((hsl.h + 240) % 360, hsl.s, hsl.l)
      ],
      'analogous': [
        hslToHex((hsl.h - 30) % 360, hsl.s, hsl.l),
        corBase,
        hslToHex((hsl.h + 30) % 360, hsl.s, hsl.l)
      ],
      'monochromatic': [
        hslToHex(hsl.h, hsl.s, Math.max(hsl.l - 20, 0)),
        corBase,
        hslToHex(hsl.h, hsl.s, Math.min(hsl.l + 20, 100))
      ],
      'split-complementary': [
        corBase,
        hslToHex((hsl.h + 150) % 360, hsl.s, hsl.l),
        hslToHex((hsl.h + 210) % 360, hsl.s, hsl.l)
      ],
      'tetradic': [
        corBase,
        hslToHex((hsl.h + 90) % 360, hsl.s, hsl.l),
        hslToHex((hsl.h + 180) % 360, hsl.s, hsl.l),
        hslToHex((hsl.h + 270) % 360, hsl.s, hsl.l)
      ]
    };

    return harmonias[tipo] || [corBase];
  }, []);

  const aplicarHarmonia = useCallback((cores: string[]) => {
    const novasCores = { ...temaEditando.cores };
    
    if (cores[0]) novasCores.primaria = cores[0];
    if (cores[1]) novasCores.secundaria = cores[1];
    if (cores[2]) novasCores.acento = cores[2];
    if (cores[3] && novasCores.destaque !== undefined) novasCores.destaque = cores[3];

    setTemaEditando(prev => ({
      ...prev,
      cores: novasCores
    }));
  }, [temaEditando.cores]);

  const validarContraste = useCallback((corTexto: string, corFundo: string) => {
    const luminanciaTexto = getLuminancia(corTexto);
    const luminanciaFundo = getLuminancia(corFundo);
    
    const contraste = (Math.max(luminanciaTexto, luminanciaFundo) + 0.05) / 
                     (Math.min(luminanciaTexto, luminanciaFundo) + 0.05);
    
    return {
      ratio: contraste,
      aa: contraste >= 4.5,
      aaa: contraste >= 7,
      nivel: contraste >= 7 ? 'AAA' : contraste >= 4.5 ? 'AA' : 'Falha'
    };
  }, []);

  const exportarTema = useCallback(() => {
    const dadosExportacao = {
      tema: temaEditando,
      versao: '1.0',
      exportadoEm: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(dadosExportacao, null, 2)], {
      type: 'application/json'
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `tema-${temaEditando.nome.toLowerCase().replace(/\s+/g, '-')}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, [temaEditando]);

  const importarTema = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const arquivo = event.target.files?.[0];
    if (!arquivo) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const dados = JSON.parse(e.target?.result as string);
        if (dados.tema) {
          setTemaEditando(dados.tema);
        }
      } catch (error) {
        console.error('Erro ao importar tema:', error);
      }
    };
    reader.readAsText(arquivo);
  }, []);

  const gerarPaletaDeImagem = useCallback((arquivo: File) => {
    // Implementação simplificada - em produção usaria uma biblioteca de extração de cores
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = document.createElement('img');
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);

        // Extrair cores dominantes (implementação simplificada)
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const cores = extrairCoresDominantes(imageData);
        
        aplicarHarmonia(cores);
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(arquivo);
  }, [aplicarHarmonia]);

  const renderizarSeletorCores = () => (
    <div className="space-y-6">
      {/* Paleta principal */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {Object.entries(temaEditando.cores).slice(0, 8).map(([propriedade, cor]) => (
          <div key={propriedade} className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 capitalize">
              {propriedade}
            </label>
            <div className="relative">
              <input
                type="color"
                value={cor}
                onChange={(e) => atualizarCor(propriedade as keyof PaletaCores, e.target.value)}
                className="w-full h-12 rounded-lg border-2 border-gray-200 cursor-pointer"
              />
              <div 
                className="absolute inset-0 rounded-lg border-2 border-gray-200 pointer-events-none"
                style={{ backgroundColor: cor }}
              />
            </div>
            <div className="text-xs text-gray-500 font-mono">
              {cor.toUpperCase()}
            </div>
          </div>
        ))}
      </div>

      {/* Harmonia de cores */}
      <div className="space-y-4">
        <h4 className="font-medium text-gray-900">Harmonia de Cores</h4>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {harmoniasCores.map(({ tipo, nome, descricao }) => (
            <button
              key={tipo}
              onClick={() => {
                setHarmoniaAtiva(tipo);
                const cores = gerarHarmoniaCores(temaEditando.cores.primaria, tipo);
                aplicarHarmonia(cores);
              }}
              className={`p-3 rounded-lg border text-left transition-colors ${
                harmoniaAtiva === tipo
                  ? 'border-blue-500 bg-blue-50 text-blue-900'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="font-medium text-sm">{nome}</div>
              <div className="text-xs text-gray-600 mt-1">{descricao}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Geração de paleta por imagem */}
      <div className="space-y-4">
        <h4 className="font-medium text-gray-900">Gerar Paleta de Imagem</h4>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const arquivo = e.target.files?.[0];
              if (arquivo) {
                setImagemPaleta(arquivo);
                gerarPaletaDeImagem(arquivo);
              }
            }}
            className="hidden"
            id="upload-imagem"
          />
          <label htmlFor="upload-imagem" className="cursor-pointer">
            <Image className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-600">
              Clique para enviar uma imagem e gerar paleta de cores
            </p>
          </label>
        </div>
      </div>

      {/* Validação de contraste */}
      <div className="space-y-4">
        <h4 className="font-medium text-gray-900">Validação de Contraste</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { texto: temaEditando.cores.texto, fundo: temaEditando.cores.fundo, nome: 'Texto/Fundo' },
            { texto: temaEditando.cores.textoSecundario, fundo: temaEditando.cores.fundo, nome: 'Texto Secundário/Fundo' },
            { texto: '#ffffff', fundo: temaEditando.cores.primaria, nome: 'Branco/Primária' },
            { texto: '#ffffff', fundo: temaEditando.cores.secundaria, nome: 'Branco/Secundária' }
          ].map(({ texto, fundo, nome }) => {
            const validacao = validarContraste(texto, fundo);
            return (
              <div key={nome} className="p-3 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">{nome}</span>
                  <span className={`text-xs px-2 py-1 rounded ${
                    validacao.nivel === 'AAA' ? 'bg-green-100 text-green-800' :
                    validacao.nivel === 'AA' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {validacao.nivel}
                  </span>
                </div>
                <div 
                  className="h-8 rounded flex items-center justify-center text-sm"
                  style={{ backgroundColor: fundo, color: texto }}
                >
                  Exemplo de texto
                </div>
                <div className="text-xs text-gray-600 mt-1">
                  Contraste: {validacao.ratio.toFixed(2)}:1
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  const renderizarTipografia = () => (
    <div className="space-y-6">
      {/* Família de fontes */}
      <div className="space-y-4">
        <h4 className="font-medium text-gray-900">Família de Fontes</h4>
        <div className="grid grid-cols-1 gap-4">
          {[
            { key: 'fontePrimaria', label: 'Primary' },
            { key: 'fonteSecundaria', label: 'Secondary' },
            { key: 'fonteMonospace', label: 'Monospace' }
          ].map(({ key, label }) => (
            <div key={key} className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                {label}
              </label>
              <select
                value={typeof temaEditando.tipografia[key as keyof typeof temaEditando.tipografia] === 'string' ? temaEditando.tipografia[key as keyof typeof temaEditando.tipografia] as string : ''}
                onChange={(e) => setTemaEditando(prev => ({
                  ...prev,
                  tipografia: {
                    ...prev.tipografia,
                    [key]: e.target.value
                  }
                }))}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {fontesDisponiveis
                  .filter(fonte => 
                    key === 'fonteMonospace' ? fonte.categoria === 'Monospace' : 
                    fonte.categoria !== 'Monospace'
                  )
                  .map(fonte => (
                    <option key={fonte.familia} value={fonte.familia}>
                      {fonte.familia} ({fonte.categoria})
                    </option>
                  ))
                }
              </select>
            </div>
          ))}
        </div>
      </div>

      {/* Tamanhos de fonte */}
      <div className="space-y-4">
        <h4 className="font-medium text-gray-900">Tamanhos de Fonte</h4>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {Object.entries(temaEditando.tipografia.escalaTipografica).map(([tamanho, valor]) => (
            <div key={tamanho} className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                {tamanho}
              </label>
              <input
                type="range"
                min="8"
                max="72"
                value={parseInt(valor as string)}
                onChange={(e) => setTemaEditando(prev => ({
                  ...prev,
                  tipografia: {
                    ...prev.tipografia,
                    escalaTipografica: {
                      ...prev.tipografia.escalaTipografica,
                      [tamanho]: `${e.target.value}px`
                    }
                  }
                }))}
                className="w-full"
              />
              <div className="text-xs text-gray-600 text-center">{valor as string}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Pesos de fonte */}
      <div className="space-y-4">
        <h4 className="font-medium text-gray-900">Pesos de Fonte</h4>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {Object.entries(temaEditando.tipografia.pesos).map(([peso, valor]) => (
            <div key={peso} className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                {peso}
              </label>
              <select
                value={valor}
                onChange={(e) => setTemaEditando(prev => ({
                  ...prev,
                  tipografia: {
                    ...prev.tipografia,
                    pesos: {
                      ...prev.tipografia.pesos,
                      [peso]: e.target.value
                    }
                  }
                }))}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="100">100 - Thin</option>
                <option value="200">200 - Extra Light</option>
                <option value="300">300 - Light</option>
                <option value="400">400 - Normal</option>
                <option value="500">500 - Medium</option>
                <option value="600">600 - Semi Bold</option>
                <option value="700">700 - Bold</option>
                <option value="800">800 - Extra Bold</option>
                <option value="900">900 - Black</option>
              </select>
            </div>
          ))}
        </div>
      </div>

      {/* Altura de linha */}
      <div className="space-y-4">
        <h4 className="font-medium text-gray-900">Altura de Linha</h4>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {Object.entries(temaEditando.tipografia.alturaLinha).map(([altura, valor]) => (
            <div key={altura} className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                {altura}
              </label>
              <input
                type="range"
                min="1"
                max="3"
                step="0.1"
                value={parseFloat(valor)}
                onChange={(e) => setTemaEditando(prev => ({
                  ...prev,
                  tipografia: {
                    ...prev.tipografia,
                    alturaLinha: {
                      ...prev.tipografia.alturaLinha,
                      [altura]: e.target.value
                    }
                  }
                }))}
                className="w-full"
              />
              <div className="text-xs text-gray-600 text-center">{valor}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200">
        <div className="flex items-center space-x-4">
          <h2 className="text-xl font-semibold text-gray-900">
            Editor de Tema: {temaEditando.nome}
          </h2>
          <div className="flex items-center space-x-2">
            <AnimatedButton
              variant="ghost"
              size="sm"
              onClick={onUndo}
              disabled={!podeUndo}
            >
              <Undo className="w-4 h-4" />
            </AnimatedButton>
            <AnimatedButton
              variant="ghost"
              size="sm"
              onClick={onRedo}
              disabled={!podeRedo}
            >
              <Redo className="w-4 h-4" />
            </AnimatedButton>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <AnimatedButton
            variant="ghost"
            size="sm"
            onClick={exportarTema}
          >
            <Download className="w-4 h-4 mr-2" />
            Exportar
          </AnimatedButton>
          
          <label className="cursor-pointer">
            <input
              type="file"
              accept=".json"
              onChange={importarTema}
              className="hidden"
            />
            <AnimatedButton
              variant="ghost"
              size="sm"
            >
              <Upload className="w-4 h-4 mr-2" />
              Importar
            </AnimatedButton>
          </label>

          <AnimatedButton
            variant="outline"
            onClick={onCancelar}
          >
            Cancelar
          </AnimatedButton>
          
          <AnimatedButton
            variant="primary"
            onClick={() => onSalvarTema(temaEditando)}
          >
            <Save className="w-4 h-4 mr-2" />
            Salvar
          </AnimatedButton>
        </div>
      </div>

      {/* Conteúdo */}
      <div className="flex-1 flex overflow-hidden">
        {/* Painel de edição */}
        <div className="w-1/2 border-r border-gray-200 overflow-y-auto">
          <div className="p-6 space-y-6">
            {secoes.map((secao) => (
              <div key={secao.id} className="border border-gray-200 rounded-lg">
                <button
                  onClick={() => toggleSecao(secao.id)}
                  className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <secao.icon className="w-5 h-5 text-gray-600" />
                    <span className="font-medium text-gray-900">{secao.titulo}</span>
                  </div>
                  {secao.expandida ? (
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  ) : (
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  )}
                </button>
                
                <AnimatePresence>
                  {secao.expandida && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="p-4 border-t border-gray-200">
                        {secao.id === 'cores' && renderizarSeletorCores()}
                        {secao.id === 'tipografia' && renderizarTipografia()}
                        {/* Outras seções serão implementadas */}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>

        {/* Painel de preview */}
        <div className="w-1/2 bg-gray-50 overflow-y-auto">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-medium text-gray-900">Preview</h3>
              <div className="flex items-center space-x-2">
                {['desktop', 'tablet', 'mobile'].map((modo) => (
                  <button
                    key={modo}
                    onClick={() => setModoPreview(modo as any)}
                    className={`px-3 py-1 rounded text-sm transition-colors ${
                      modoPreview === modo
                        ? 'bg-blue-600 text-white'
                        : 'bg-white text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {modo}
                  </button>
                ))}
              </div>
            </div>

            {/* Preview do tema */}
            <div 
              className={`mx-auto bg-white rounded-lg shadow-lg overflow-hidden ${
                modoPreview === 'desktop' ? 'max-w-full' :
                modoPreview === 'tablet' ? 'max-w-md' :
                'max-w-sm'
              }`}
              style={{
                backgroundColor: temaEditando.cores.fundo,
                color: temaEditando.cores.texto,
                fontFamily: temaEditando.tipografia.fontePrimaria
              }}
            >
              <div 
                className="p-4"
                style={{ backgroundColor: temaEditando.cores.primaria }}
              >
                <h4 className="text-lg font-semibold text-white">
                  Preview do Tema
                </h4>
              </div>
              
              <div className="p-4 space-y-4">
                <div>
                  <h5 
                    className="font-medium mb-2"
                    style={{ color: temaEditando.cores.texto }}
                  >
                    Título Principal
                  </h5>
                  <p 
                    className="text-sm"
                    style={{ color: temaEditando.cores.textoSecundario }}
                  >
                    Este é um exemplo de texto secundário para demonstrar como o tema ficará na aplicação.
                  </p>
                </div>

                <div className="flex space-x-2">
                  <button
                    className="px-4 py-2 rounded text-sm font-medium text-white"
                    style={{ backgroundColor: temaEditando.cores.primaria }}
                  >
                    Botão Primário
                  </button>
                  <button
                    className="px-4 py-2 rounded text-sm font-medium border"
                    style={{ 
                      color: temaEditando.cores.primaria,
                      borderColor: temaEditando.cores.primaria
                    }}
                  >
                    Botão Secundário
                  </button>
                </div>

                <div 
                  className="p-3 rounded"
                  style={{ backgroundColor: temaEditando.cores.superficie }}
                >
                  <p className="text-sm">
                    Exemplo de superfície com cor de fundo alternativa.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Funções auxiliares para manipulação de cores
function hexToHsl(hex: string): { h: number; s: number; l: number } {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }

  return { h: h * 360, s: s * 100, l: l * 100 };
}

function hslToHex(h: number, s: number, l: number): string {
  h = h % 360;
  s = s / 100;
  l = l / 100;

  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs((h / 60) % 2 - 1));
  const m = l - c / 2;
  let r = 0, g = 0, b = 0;

  if (0 <= h && h < 60) {
    r = c; g = x; b = 0;
  } else if (60 <= h && h < 120) {
    r = x; g = c; b = 0;
  } else if (120 <= h && h < 180) {
    r = 0; g = c; b = x;
  } else if (180 <= h && h < 240) {
    r = 0; g = x; b = c;
  } else if (240 <= h && h < 300) {
    r = x; g = 0; b = c;
  } else if (300 <= h && h < 360) {
    r = c; g = 0; b = x;
  }

  r = Math.round((r + m) * 255);
  g = Math.round((g + m) * 255);
  b = Math.round((b + m) * 255);

  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

function getLuminancia(hex: string): number {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;

  const sRGB = [r, g, b].map(c => {
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });

  return 0.2126 * sRGB[0] + 0.7152 * sRGB[1] + 0.0722 * sRGB[2];
}

function extrairCoresDominantes(imageData: ImageData): string[] {
  // Implementação simplificada - em produção usaria algoritmos mais sofisticados
  const cores: string[] = [];
  const data = imageData.data;
  const amostras = 100; // Reduzir para performance
  
  for (let i = 0; i < amostras; i++) {
    const index = Math.floor(Math.random() * (data.length / 4)) * 4;
    const r = data[index];
    const g = data[index + 1];
    const b = data[index + 2];
    
    const hex = `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
    cores.push(hex);
  }
  
  return cores.slice(0, 4); // Retornar apenas as primeiras 4 cores
}

export default EditorTemas;