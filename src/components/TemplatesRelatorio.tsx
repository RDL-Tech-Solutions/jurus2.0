import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, 
  Briefcase, 
  TrendingUp, 
  PieChart, 
  BarChart3, 
  Settings,
  Check,
  Eye,
  Download,
  Palette,
  Layout,
  FileImage
} from 'lucide-react';
import { SimulacaoInput, ResultadoSimulacao } from '../types';
import { formatarMoeda, formatarPercentual } from '../utils/calculations';
import { InteractiveButton } from './InteractiveButton';
import { AnimatedContainer, StaggeredContainer, AnimatedItem } from './AnimatedContainer';

interface TemplatesRelatorioProps {
  simulacao: SimulacaoInput;
  resultado: ResultadoSimulacao;
  onSelectTemplate: (template: TemplateConfig) => void;
  onClose: () => void;
}

export interface TemplateConfig {
  id: string;
  nome: string;
  descricao: string;
  icone: React.ReactNode;
  cores: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
  };
  layout: {
    incluirCapa: boolean;
    incluirResumoExecutivo: boolean;
    incluirGraficos: boolean;
    incluirTabelaDetalhada: boolean;
    incluirAnaliseRisco: boolean;
    incluirComparacao: boolean;
    incluirProjecoes: boolean;
    incluirRodape: boolean;
  };
  estilo: {
    fonte: string;
    tamanhoTitulo: number;
    tamanhoTexto: number;
    espacamento: 'compacto' | 'normal' | 'amplo';
    bordas: boolean;
    sombras: boolean;
  };
  formato: {
    orientacao: 'portrait' | 'landscape';
    tamanho: 'A4' | 'A3' | 'Letter';
    margens: number;
  };
}

const templates: TemplateConfig[] = [
  {
    id: 'executivo',
    nome: 'Executivo',
    descricao: 'Relatório conciso para apresentações executivas',
    icone: <Briefcase className="w-6 h-6" />,
    cores: {
      primary: '#1e40af',
      secondary: '#64748b',
      accent: '#3b82f6',
      background: '#ffffff'
    },
    layout: {
      incluirCapa: true,
      incluirResumoExecutivo: true,
      incluirGraficos: true,
      incluirTabelaDetalhada: false,
      incluirAnaliseRisco: true,
      incluirComparacao: false,
      incluirProjecoes: true,
      incluirRodape: true
    },
    estilo: {
      fonte: 'Arial',
      tamanhoTitulo: 18,
      tamanhoTexto: 11,
      espacamento: 'normal',
      bordas: true,
      sombras: false
    },
    formato: {
      orientacao: 'portrait',
      tamanho: 'A4',
      margens: 20
    }
  },
  {
    id: 'detalhado',
    nome: 'Detalhado',
    descricao: 'Relatório completo com todas as informações',
    icone: <FileText className="w-6 h-6" />,
    cores: {
      primary: '#059669',
      secondary: '#6b7280',
      accent: '#10b981',
      background: '#f9fafb'
    },
    layout: {
      incluirCapa: true,
      incluirResumoExecutivo: true,
      incluirGraficos: true,
      incluirTabelaDetalhada: true,
      incluirAnaliseRisco: true,
      incluirComparacao: true,
      incluirProjecoes: true,
      incluirRodape: true
    },
    estilo: {
      fonte: 'Times New Roman',
      tamanhoTitulo: 16,
      tamanhoTexto: 10,
      espacamento: 'compacto',
      bordas: true,
      sombras: true
    },
    formato: {
      orientacao: 'portrait',
      tamanho: 'A4',
      margens: 15
    }
  },
  {
    id: 'visual',
    nome: 'Visual',
    descricao: 'Foco em gráficos e visualizações',
    icone: <PieChart className="w-6 h-6" />,
    cores: {
      primary: '#7c3aed',
      secondary: '#a78bfa',
      accent: '#8b5cf6',
      background: '#faf5ff'
    },
    layout: {
      incluirCapa: true,
      incluirResumoExecutivo: true,
      incluirGraficos: true,
      incluirTabelaDetalhada: false,
      incluirAnaliseRisco: false,
      incluirComparacao: true,
      incluirProjecoes: true,
      incluirRodape: false
    },
    estilo: {
      fonte: 'Helvetica',
      tamanhoTitulo: 20,
      tamanhoTexto: 12,
      espacamento: 'amplo',
      bordas: false,
      sombras: true
    },
    formato: {
      orientacao: 'landscape',
      tamanho: 'A4',
      margens: 25
    }
  },
  {
    id: 'moderno',
    nome: 'Moderno',
    descricao: 'Design contemporâneo e minimalista',
    icone: <TrendingUp className="w-6 h-6" />,
    cores: {
      primary: '#0f172a',
      secondary: '#475569',
      accent: '#06b6d4',
      background: '#ffffff'
    },
    layout: {
      incluirCapa: false,
      incluirResumoExecutivo: true,
      incluirGraficos: true,
      incluirTabelaDetalhada: true,
      incluirAnaliseRisco: true,
      incluirComparacao: false,
      incluirProjecoes: false,
      incluirRodape: false
    },
    estilo: {
      fonte: 'Roboto',
      tamanhoTitulo: 22,
      tamanhoTexto: 11,
      espacamento: 'normal',
      bordas: false,
      sombras: false
    },
    formato: {
      orientacao: 'portrait',
      tamanho: 'A4',
      margens: 30
    }
  },
  {
    id: 'corporativo',
    nome: 'Corporativo',
    descricao: 'Padrão empresarial formal',
    icone: <BarChart3 className="w-6 h-6" />,
    cores: {
      primary: '#dc2626',
      secondary: '#991b1b',
      accent: '#ef4444',
      background: '#fefefe'
    },
    layout: {
      incluirCapa: true,
      incluirResumoExecutivo: true,
      incluirGraficos: true,
      incluirTabelaDetalhada: true,
      incluirAnaliseRisco: true,
      incluirComparacao: true,
      incluirProjecoes: true,
      incluirRodape: true
    },
    estilo: {
      fonte: 'Calibri',
      tamanhoTitulo: 16,
      tamanhoTexto: 10,
      espacamento: 'normal',
      bordas: true,
      sombras: false
    },
    formato: {
      orientacao: 'portrait',
      tamanho: 'A4',
      margens: 20
    }
  },
  {
    id: 'personalizado',
    nome: 'Personalizado',
    descricao: 'Crie seu próprio template',
    icone: <Settings className="w-6 h-6" />,
    cores: {
      primary: '#6366f1',
      secondary: '#8b5cf6',
      accent: '#a855f7',
      background: '#ffffff'
    },
    layout: {
      incluirCapa: true,
      incluirResumoExecutivo: true,
      incluirGraficos: true,
      incluirTabelaDetalhada: true,
      incluirAnaliseRisco: true,
      incluirComparacao: true,
      incluirProjecoes: true,
      incluirRodape: true
    },
    estilo: {
      fonte: 'Arial',
      tamanhoTitulo: 18,
      tamanhoTexto: 11,
      espacamento: 'normal',
      bordas: true,
      sombras: true
    },
    formato: {
      orientacao: 'portrait',
      tamanho: 'A4',
      margens: 20
    }
  }
];

const TemplatesRelatorio: React.FC<TemplatesRelatorioProps> = ({
  simulacao,
  resultado,
  onSelectTemplate,
  onClose
}) => {
  const [selectedTemplate, setSelectedTemplate] = useState<string>('executivo');
  const [showPreview, setShowPreview] = useState(false);
  const [customTemplate, setCustomTemplate] = useState<TemplateConfig>(templates[5]);

  const handleSelectTemplate = (template: TemplateConfig) => {
    setSelectedTemplate(template.id);
    if (template.id === 'personalizado') {
      // Abrir editor de template personalizado
      return;
    }
    onSelectTemplate(template);
  };

  const renderTemplateCard = (template: TemplateConfig) => (
    <AnimatedItem key={template.id}>
      <motion.div
        className={`relative p-6 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
          selectedTemplate === template.id
            ? 'border-blue-500 bg-blue-50 shadow-lg'
            : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-md'
        }`}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setSelectedTemplate(template.id)}
      >
        {selectedTemplate === template.id && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-2 -right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center"
          >
            <Check className="w-4 h-4 text-white" />
          </motion.div>
        )}

        <div className="flex items-center gap-3 mb-4">
          <div 
            className="p-3 rounded-lg"
            style={{ backgroundColor: template.cores.primary + '20', color: template.cores.primary }}
          >
            {template.icone}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{template.nome}</h3>
            <p className="text-sm text-gray-600">{template.descricao}</p>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Layout className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-600">
              {template.formato.orientacao === 'portrait' ? 'Retrato' : 'Paisagem'} - {template.formato.tamanho}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Palette className="w-4 h-4 text-gray-400" />
            <div className="flex gap-1">
              <div 
                className="w-4 h-4 rounded-full border"
                style={{ backgroundColor: template.cores.primary }}
              />
              <div 
                className="w-4 h-4 rounded-full border"
                style={{ backgroundColor: template.cores.secondary }}
              />
              <div 
                className="w-4 h-4 rounded-full border"
                style={{ backgroundColor: template.cores.accent }}
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-1">
            {template.layout.incluirGraficos && (
              <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded">Gráficos</span>
            )}
            {template.layout.incluirTabelaDetalhada && (
              <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">Tabelas</span>
            )}
            {template.layout.incluirAnaliseRisco && (
              <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded">Análise</span>
            )}
          </div>
        </div>

        <div className="flex gap-2 mt-4">
          <InteractiveButton
            variant="outline"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              setShowPreview(true);
            }}
            className="flex-1"
          >
            <Eye className="w-4 h-4 mr-1" />
            Visualizar
          </InteractiveButton>
          
          <InteractiveButton
            variant="primary"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              handleSelectTemplate(template);
            }}
            className="flex-1"
          >
            <Download className="w-4 h-4 mr-1" />
            Usar
          </InteractiveButton>
        </div>
      </motion.div>
    </AnimatedItem>
  );

  return (
    <AnimatedContainer>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">Templates de Relatório</h2>
                <p className="text-blue-100 mt-1">Escolha o template ideal para seu relatório</p>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <FileImage className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
            <StaggeredContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {templates.map(renderTemplateCard)}
            </StaggeredContainer>

            {/* Preview Modal */}
            <AnimatePresence>
              {showPreview && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-black/70 flex items-center justify-center z-60"
                  onClick={() => setShowPreview(false)}
                >
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    className="bg-white rounded-xl p-6 max-w-4xl w-full mx-4 max-h-[80vh] overflow-y-auto"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-bold">Preview do Template</h3>
                      <button
                        onClick={() => setShowPreview(false)}
                        className="p-2 hover:bg-gray-100 rounded-lg"
                      >
                        ×
                      </button>
                    </div>
                    
                    <div className="bg-gray-100 p-8 rounded-lg">
                      <div className="bg-white p-6 rounded shadow-lg max-w-2xl mx-auto">
                        <h4 className="text-lg font-bold mb-4">Relatório de Investimento</h4>
                        <div className="space-y-3 text-sm">
                          <div className="flex justify-between">
                            <span>Valor Final:</span>
                            <span className="font-semibold">{formatarMoeda(resultado.valorFinal)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Rentabilidade:</span>
                            <span className="font-semibold text-green-600">
                              {formatarPercentual(resultado.rentabilidadeTotal)}
                            </span>
                          </div>
                          <div className="h-32 bg-gradient-to-r from-blue-100 to-purple-100 rounded flex items-center justify-center">
                            <span className="text-gray-600">Gráfico de Evolução</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </motion.div>
    </AnimatedContainer>
  );
};

export default TemplatesRelatorio;