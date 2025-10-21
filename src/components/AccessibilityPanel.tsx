import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Settings, 
  Eye, 
  Type, 
  MousePointer, 
  Volume2, 
  Palette, 
  Monitor,
  Sun,
  Moon,
  RotateCcw,
  Check,
  X,
  Accessibility,
  Keyboard,
  Focus
} from 'lucide-react';
import useAcessibilidade from '../hooks/useAcessibilidade';
import { useMicroInteractions } from '../hooks/useMicroInteractions';
import { Z_INDEX } from '../constants/zIndex';

interface AccessibilityPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AccessibilityPanel: React.FC<AccessibilityPanelProps> = ({
  isOpen,
  onClose
}) => {
  const {
    configuracao: settings,
    setConfiguracao: updateSetting,
    anunciar: announce
  } = useAcessibilidade();

  const { playSound, triggerHaptic } = useMicroInteractions();

  const [activeSection, setActiveSection] = useState<string>('visual');

  const sections = [
    { id: 'visual', label: 'Visual', icon: Eye },
    { id: 'text', label: 'Texto', icon: Type },
    { id: 'interaction', label: 'Interação', icon: MousePointer },
    { id: 'audio', label: 'Áudio', icon: Volume2 }
  ];

  const handleSettingChange = (key: string, value: any) => {
    updateSetting({ ...settings, [key]: value });
    playSound(800);
    triggerHaptic();
    announce(`${key} alterado para ${value}`, 'baixa');
  };

  const handleValidate = () => {
    const issues = [];
    if (!settings.altoContraste && settings.tamanhoFonte === 'pequeno') issues.push('Considere ativar alto contraste ou aumentar o tamanho da fonte');
    if (!settings.destacarFoco) issues.push('Indicador de foco desabilitado');
    if (!settings.navegacaoTeclado) issues.push('Navegação por teclado desabilitada');
    
    if (issues.length === 0) {
      announce('Configurações de acessibilidade validadas com sucesso', 'alta');
    } else {
      announce(`Problemas encontrados: ${issues.join(', ')}`, 'alta');
    }
  };

  const handleReset = () => {
    updateSetting({
      ...settings,
      altoContraste: false,
      tamanhoFonte: 'normal',
      reducaoMovimento: false,
      espacamentoLinhas: 'normal',
      leitorTela: false,
      navegacaoTeclado: true,
      destacarFoco: true
    });
    announce('Configurações redefinidas', 'media');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            style={{ zIndex: Z_INDEX.ACCESSIBILITY_OVERLAY }}
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white dark:bg-gray-900 shadow-2xl overflow-hidden"
            style={{ zIndex: Z_INDEX.ACCESSIBILITY_OVERLAY }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <Accessibility className="w-6 h-6 text-blue-600" />
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Acessibilidade
                </h2>
              </div>
              <motion.button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Fechar painel de acessibilidade"
              >
                <X className="w-5 h-5" />
              </motion.button>
            </div>

            {/* Section Tabs */}
            <div className="flex border-b border-gray-200 dark:border-gray-700">
              {sections.map((section) => (
                <motion.button
                  key={section.id}
                  onClick={() => {
                    setActiveSection(section.id);
                    playSound(600);
                  }}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 text-sm font-medium transition-colors ${
                    activeSection === section.id
                      ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50 dark:bg-blue-900/20'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  aria-pressed={activeSection === section.id}
                >
                  <section.icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{section.label}</span>
                </motion.button>
              ))}
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeSection}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-6"
                >
                  {/* Visual Section */}
                  {activeSection === 'visual' && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                        Configurações Visuais
                      </h3>

                      {/* High Contrast */}
                      <div className="flex items-center justify-between">
                        <div>
                          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Alto Contraste
                          </label>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            Aumenta o contraste para melhor visibilidade
                          </p>
                        </div>
                        <motion.button
                          onClick={() => handleSettingChange('altoContraste', !settings.altoContraste)}
                          className={`relative w-12 h-6 rounded-full transition-colors ${
                            settings.altoContraste ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
                          }`}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <motion.div
                            className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-md"
                            animate={{ x: settings.altoContraste ? 24 : 0 }}
                            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                          />
                        </motion.button>
                      </div>

                      {/* Focus Highlight */}
                      <div className="flex items-center justify-between">
                        <div>
                          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Destacar Foco
                          </label>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            Destaca elementos em foco
                          </p>
                        </div>
                        <motion.button
                          onClick={() => handleSettingChange('destacarFoco', !settings.destacarFoco)}
                          className={`relative w-12 h-6 rounded-full transition-colors ${
                            settings.destacarFoco ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
                          }`}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <motion.div
                            className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-md"
                            animate={{ x: settings.destacarFoco ? 24 : 0 }}
                            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                          />
                        </motion.button>
                      </div>

                      {/* Reduced Motion */}
                      <div className="flex items-center justify-between">
                        <div>
                          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Reduzir Movimento
                          </label>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            Reduz animações e transições
                          </p>
                        </div>
                        <motion.button
                          onClick={() => handleSettingChange('reducaoMovimento', !settings.reducaoMovimento)}
                          className={`relative w-12 h-6 rounded-full transition-colors ${
                            settings.reducaoMovimento ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
                          }`}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <motion.div
                            className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-md"
                            animate={{ x: settings.reducaoMovimento ? 24 : 0 }}
                            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                          />
                        </motion.button>
                      </div>
                    </div>
                  )}

                  {/* Text Section */}
                  {activeSection === 'text' && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                        Configurações de Texto
                      </h3>

                      {/* Font Size */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Tamanho da Fonte
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                          {[
                            { value: 'pequeno', label: 'Pequeno' },
                            { value: 'normal', label: 'Normal' },
                            { value: 'grande', label: 'Grande' },
                            { value: 'extra-grande', label: 'Extra Grande' }
                          ].map((option) => (
                            <motion.button
                              key={option.value}
                              onClick={() => handleSettingChange('tamanhoFonte', option.value)}
                              className={`p-2 text-xs rounded-lg border transition-colors ${
                                settings.tamanhoFonte === option.value
                                  ? 'bg-blue-100 border-blue-300 text-blue-700 dark:bg-blue-900 dark:border-blue-600 dark:text-blue-300'
                                  : 'bg-gray-50 border-gray-200 text-gray-700 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300'
                              }`}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              {option.label}
                            </motion.button>
                          ))}
                        </div>
                      </div>

                      {/* Line Spacing */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Espaçamento de Linhas
                        </label>
                        <div className="grid grid-cols-3 gap-2">
                          {[
                            { value: 'compacto', label: 'Compacto' },
                            { value: 'normal', label: 'Normal' },
                            { value: 'expandido', label: 'Expandido' }
                          ].map((option) => (
                            <motion.button
                              key={option.value}
                              onClick={() => handleSettingChange('espacamentoLinhas', option.value)}
                              className={`p-2 text-xs rounded-lg border transition-colors ${
                                settings.espacamentoLinhas === option.value
                                  ? 'bg-blue-100 border-blue-300 text-blue-700 dark:bg-blue-900 dark:border-blue-600 dark:text-blue-300'
                                  : 'bg-gray-50 border-gray-200 text-gray-700 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300'
                              }`}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              {option.label}
                            </motion.button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Interaction Section */}
                  {activeSection === 'interaction' && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                        Configurações de Interação
                      </h3>

                      {/* Keyboard Navigation */}
                      <div className="flex items-center justify-between">
                        <div>
                          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Navegação por Teclado
                          </label>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            Habilita navegação completa por teclado
                          </p>
                        </div>
                        <motion.button
                          onClick={() => handleSettingChange('navegacaoTeclado', !settings.navegacaoTeclado)}
                          className={`relative w-12 h-6 rounded-full transition-colors ${
                            settings.navegacaoTeclado ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
                          }`}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <motion.div
                            className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-md"
                            animate={{ x: settings.navegacaoTeclado ? 24 : 0 }}
                            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                          />
                        </motion.button>
                      </div>

                      {/* Simplify Interface */}
                      <div className="flex items-center justify-between">
                        <div>
                          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Simplificar Interface
                          </label>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            Remove elementos desnecessários
                          </p>
                        </div>
                        <motion.button
                          onClick={() => handleSettingChange('simplificarInterface', !settings.simplificarInterface)}
                          className={`relative w-12 h-6 rounded-full transition-colors ${
                            settings.simplificarInterface ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
                          }`}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <motion.div
                            className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-md"
                            animate={{ x: settings.simplificarInterface ? 24 : 0 }}
                            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                          />
                        </motion.button>
                      </div>
                    </div>
                  )}

                  {/* Audio Section */}
                  {activeSection === 'audio' && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                        Configurações de Áudio
                      </h3>

                      {/* Screen Reader */}
                      <div className="flex items-center justify-between">
                        <div>
                          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Leitor de Tela
                          </label>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            Anuncia mudanças na interface
                          </p>
                        </div>
                        <motion.button
                          onClick={() => handleSettingChange('leitorTela', !settings.leitorTela)}
                          className={`relative w-12 h-6 rounded-full transition-colors ${
                            settings.leitorTela ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
                          }`}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <motion.div
                            className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-md"
                            animate={{ x: settings.leitorTela ? 24 : 0 }}
                            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                          />
                        </motion.button>
                      </div>

                      {/* Sound Feedback */}
                      <div className="flex items-center justify-between">
                        <div>
                          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Feedback Sonoro
                          </label>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            Sons de confirmação para ações
                          </p>
                        </div>
                        <motion.button
                          onClick={() => handleSettingChange('feedbackSonoro', !settings.feedbackSonoro)}
                          className={`relative w-12 h-6 rounded-full transition-colors ${
                            settings.feedbackSonoro ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
                          }`}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <motion.div
                            className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-md"
                            animate={{ x: settings.feedbackSonoro ? 24 : 0 }}
                            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                          />
                        </motion.button>
                      </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-gray-200 dark:border-gray-700 space-y-3">
              <motion.button
                onClick={handleValidate}
                className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Check className="w-4 h-4" />
                Validar Acessibilidade
              </motion.button>

              <motion.button
                onClick={handleReset}
                className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <RotateCcw className="w-4 h-4" />
                Redefinir Configurações
              </motion.button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default AccessibilityPanel;