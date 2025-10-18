import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Download, 
  FileText, 
  FileSpreadsheet, 
  Share2, 
  X, 
  Settings, 
  CheckCircle,
  Loader2,
  Link,
  Globe,
  Palette,
  Layout,
  Calendar,
  DollarSign
} from 'lucide-react';
import { SimulacaoInput, ResultadoSimulacao } from '../types';
import { useExportacao, ConfiguracaoRelatorio, DadosRelatorio } from '../hooks/useExportacao';
import { useToast } from '../hooks/useToast';

interface ExportacaoAvancadaProps {
  simulacao: SimulacaoInput;
  resultado: ResultadoSimulacao;
  historico?: any[];
  metas?: any[];
  performance?: any;
  cenarios?: any[];
  recomendacoes?: any[];
  onClose: () => void;
}

const ExportacaoAvancada: React.FC<ExportacaoAvancadaProps> = ({
  simulacao,
  resultado,
  historico,
  metas,
  performance,
  cenarios,
  recomendacoes,
  onClose
}) => {
  const { addToast } = useToast();
  const {
    isExporting,
    exportarPDF,
    exportarExcel,
    exportarJSON,
    compartilharSimulacao,
    gerarRelatorioCompleto
  } = useExportacao();

  const [activeTab, setActiveTab] = useState<'configuracao' | 'formatos' | 'compartilhar'>('configuracao');
  const [config, setConfig] = useState<ConfiguracaoRelatorio>({
    incluirGraficos: true,
    incluirHistorico: true,
    incluirMetas: true,
    incluirPerformance: true,
    incluirCenarios: true,
    incluirRecomendacoes: true,
    formatoData: 'dd/mm/yyyy',
    moeda: 'BRL',
    idioma: 'pt-BR'
  });

  const dadosRelatorio: DadosRelatorio = {
    simulacao,
    resultado,
    historico,
    metas,
    performance,
    cenarios,
    recomendacoes
  };

  const handleExportPDF = async () => {
    try {
      await exportarPDF(dadosRelatorio, config);
      addToast({
        type: 'success',
        title: 'PDF Gerado',
        message: 'Relatório PDF foi gerado com sucesso!'
      });
    } catch (error) {
      addToast({
        type: 'error',
        title: 'Erro na Exportação',
        message: 'Falha ao gerar relatório PDF'
      });
    }
  };

  const handleExportExcel = async () => {
    try {
      await exportarExcel(dadosRelatorio, config);
      addToast({
        type: 'success',
        title: 'Excel Gerado',
        message: 'Planilha Excel foi gerada com sucesso!'
      });
    } catch (error) {
      addToast({
        type: 'error',
        title: 'Erro na Exportação',
        message: 'Falha ao gerar planilha Excel'
      });
    }
  };

  const handleExportJSON = () => {
    try {
      exportarJSON(dadosRelatorio);
      addToast({
        type: 'success',
        title: 'JSON Exportado',
        message: 'Dados exportados em formato JSON!'
      });
    } catch (error) {
      addToast({
        type: 'error',
        title: 'Erro na Exportação',
        message: 'Falha ao exportar dados JSON'
      });
    }
  };

  const handleCompartilhar = async () => {
    try {
      const link = await compartilharSimulacao(dadosRelatorio);
      addToast({
        type: 'success',
        title: 'Link Copiado',
        message: 'Link de compartilhamento copiado para a área de transferência!'
      });
    } catch (error) {
      addToast({
        type: 'error',
        title: 'Erro no Compartilhamento',
        message: 'Falha ao gerar link de compartilhamento'
      });
    }
  };

  const handleRelatorioCompleto = async () => {
    try {
      await gerarRelatorioCompleto(dadosRelatorio, config);
      addToast({
        type: 'success',
        title: 'Relatório Completo',
        message: 'PDF e Excel gerados com sucesso!'
      });
    } catch (error) {
      addToast({
        type: 'error',
        title: 'Erro na Exportação',
        message: 'Falha ao gerar relatório completo'
      });
    }
  };

  const tabs = [
    { id: 'configuracao', label: 'Configuração', icon: Settings },
    { id: 'formatos', label: 'Formatos', icon: Download },
    { id: 'compartilhar', label: 'Compartilhar', icon: Share2 }
  ];

  return (
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
        className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Exportação Avançada</h2>
              <p className="opacity-90">Gere relatórios profissionais e compartilhe suas simulações</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex-1 py-4 px-6 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-b-2 border-blue-500 text-blue-600 bg-blue-50 dark:bg-blue-900/20'
                      : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          <AnimatePresence mode="wait">
            {activeTab === 'configuracao' && (
              <motion.div
                key="configuracao"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-6"
              >
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Configurações do Relatório
                  </h3>
                  
                  {/* Seções a incluir */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="space-y-3">
                      <h4 className="font-medium text-gray-700 dark:text-gray-300">Seções a Incluir</h4>
                      {[
                        { key: 'incluirGraficos', label: 'Gráficos e Visualizações' },
                        { key: 'incluirHistorico', label: 'Histórico de Simulações' },
                        { key: 'incluirMetas', label: 'Metas e Objetivos' }
                      ].map(({ key, label }) => (
                        <label key={key} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={config[key as keyof ConfiguracaoRelatorio] as boolean}
                            onChange={(e) => setConfig(prev => ({ ...prev, [key]: e.target.checked }))}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="text-sm text-gray-700 dark:text-gray-300">{label}</span>
                        </label>
                      ))}
                    </div>

                    <div className="space-y-3">
                      <h4 className="font-medium text-gray-700 dark:text-gray-300">Análises Avançadas</h4>
                      {[
                        { key: 'incluirPerformance', label: 'Dashboard de Performance' },
                        { key: 'incluirCenarios', label: 'Simulação de Cenários' },
                        { key: 'incluirRecomendacoes', label: 'Recomendações IA' }
                      ].map(({ key, label }) => (
                        <label key={key} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={config[key as keyof ConfiguracaoRelatorio] as boolean}
                            onChange={(e) => setConfig(prev => ({ ...prev, [key]: e.target.checked }))}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="text-sm text-gray-700 dark:text-gray-300">{label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Configurações de formato */}
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        <Calendar className="w-4 h-4 inline mr-1" />
                        Formato de Data
                      </label>
                      <select
                        value={config.formatoData}
                        onChange={(e) => setConfig(prev => ({ ...prev, formatoData: e.target.value as any }))}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                      >
                        <option value="dd/mm/yyyy">DD/MM/AAAA</option>
                        <option value="mm/dd/yyyy">MM/DD/AAAA</option>
                        <option value="yyyy-mm-dd">AAAA-MM-DD</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        <DollarSign className="w-4 h-4 inline mr-1" />
                        Moeda
                      </label>
                      <select
                        value={config.moeda}
                        onChange={(e) => setConfig(prev => ({ ...prev, moeda: e.target.value as any }))}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                      >
                        <option value="BRL">Real (R$)</option>
                        <option value="USD">Dólar ($)</option>
                        <option value="EUR">Euro (€)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        <Globe className="w-4 h-4 inline mr-1" />
                        Idioma
                      </label>
                      <select
                        value={config.idioma}
                        onChange={(e) => setConfig(prev => ({ ...prev, idioma: e.target.value as any }))}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                      >
                        <option value="pt-BR">Português (BR)</option>
                        <option value="en-US">English (US)</option>
                        <option value="es-ES">Español (ES)</option>
                      </select>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'formatos' && (
              <motion.div
                key="formatos"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-6"
              >
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Formatos de Exportação
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* PDF */}
                    <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-red-100 dark:bg-red-900/20 rounded-lg">
                          <FileText className="w-6 h-6 text-red-600" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900 dark:text-white">Relatório PDF</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Relatório profissional com gráficos
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={handleExportPDF}
                        disabled={isExporting}
                        className="w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                      >
                        {isExporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                        Gerar PDF
                      </button>
                    </div>

                    {/* Excel */}
                    <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                          <FileSpreadsheet className="w-6 h-6 text-green-600" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900 dark:text-white">Planilha Excel</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Dados detalhados em múltiplas abas
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={handleExportExcel}
                        disabled={isExporting}
                        className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                      >
                        {isExporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                        Gerar Excel
                      </button>
                    </div>

                    {/* JSON */}
                    <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                          <Layout className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900 dark:text-white">Dados JSON</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Dados estruturados para desenvolvedores
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={handleExportJSON}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                      >
                        <Download className="w-4 h-4" />
                        Exportar JSON
                      </button>
                    </div>

                    {/* Relatório Completo */}
                    <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                          <Palette className="w-6 h-6 text-purple-600" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900 dark:text-white">Relatório Completo</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            PDF + Excel com todos os dados
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={handleRelatorioCompleto}
                        disabled={isExporting}
                        className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                      >
                        {isExporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                        Gerar Completo
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'compartilhar' && (
              <motion.div
                key="compartilhar"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-6"
              >
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Compartilhamento
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                          <Link className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900 dark:text-white">Link de Compartilhamento</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Gere um link para compartilhar sua simulação
                          </p>
                        </div>
                      </div>
                      
                      <button
                        onClick={handleCompartilhar}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                      >
                        <Share2 className="w-4 h-4" />
                        Gerar Link de Compartilhamento
                      </button>
                    </div>

                    <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                      <div className="flex items-start gap-2">
                        <CheckCircle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <h5 className="font-medium text-yellow-800 dark:text-yellow-200">Dica</h5>
                          <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                            O link de compartilhamento contém todos os dados da sua simulação e pode ser aberto por qualquer pessoa.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Loading Overlay */}
        {isExporting && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-white/80 dark:bg-gray-800/80 flex items-center justify-center"
          >
            <div className="text-center">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-2" />
              <p className="text-gray-600 dark:text-gray-400">Gerando relatório...</p>
            </div>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default ExportacaoAvancada;