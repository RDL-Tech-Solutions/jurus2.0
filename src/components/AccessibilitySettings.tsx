import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Settings, 
  Eye, 
  Type, 
  MousePointer, 
  Volume2, 
  Contrast, 
  Zap,
  X,
  Check,
  Info,
  Palette,
  Monitor,
  Keyboard
} from 'lucide-react';
import useAcessibilidade, { ConfiguracaoAcessibilidade } from '../hooks/useAcessibilidade';
import { useMicroInteractions } from '../hooks/useMicroInteractions';
import { getZIndexClass } from '../constants/zIndex';

interface AccessibilitySettingsProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AccessibilitySettings: React.FC<AccessibilitySettingsProps> = ({
  isOpen,
  onClose
}) => {
  const { configuracao: settings, setConfiguracao: updateSetting, anunciar: announce } = useAcessibilidade();
  const { playSound, triggerHaptic } = useMicroInteractions();
  
  const [activeSection, setActiveSection] = useState<string>('visual');

  const sections = [
    {
      id: 'visual',
      label: 'Visual',
      icon: Eye,
      description: 'Configurações de aparência e contraste'
    },
    {
      id: 'text',
      label: 'Texto',
      icon: Type,
      description: 'Tamanho e espaçamento do texto'
    },
    {
      id: 'interaction',
      label: 'Interação',
      icon: MousePointer,
      description: 'Navegação e controles'
    },
    {
      id: 'audio',
      label: 'Áudio',
      icon: Volume2,
      description: 'Feedback sonoro e leitores de tela'
    }
  ];

  const handleSettingChange = (key: string, value: any) => {
    updateSetting({ ...settings, [key]: value });
    announce(`Configuração ${key} alterada para ${value}`, 'media');
    playSound(800);
    triggerHaptic();
  };

  const resetSettings = () => {
    const defaultSettings: Partial<ConfiguracaoAcessibilidade> = {
      altoContraste: false,
      tamanhoFonte: 'normal' as const,
      reducaoMovimento: false,
      leitorTela: false,
      navegacaoTeclado: true,
      destacarFoco: true,
      espacamentoLinhas: 'normal' as const,
      feedbackSonoro: true,
      simplificarInterface: false
    };

    updateSetting({ ...settings, ...defaultSettings });
    announce('Configurações de acessibilidade redefinidas para o padrão', 'alta');
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm ${getZIndexClass('MODAL')} flex items-center justify-center p-4`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <Settings className="w-6 h-6 text-blue-600" />
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Configurações de Acessibilidade
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Personalize sua experiência de navegação
                </p>
              </div>
            </div>
            <motion.button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Fechar configurações"
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
                className={`flex-1 flex flex-col items-center gap-1 py-4 px-2 text-sm font-medium transition-colors ${
                  activeSection === section.id
                    ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50 dark:bg-blue-900/20'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                aria-pressed={activeSection === section.id}
                title={section.description}
              >
                <section.icon className="w-5 h-5" />
                <span>{section.label}</span>
              </motion.button>
            ))}
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-96">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSection}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                {/* Visual Section */}
                {activeSection === 'visual' && (
                  <div className="space-y-6">
                    <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                      <Eye className="w-5 h-5" />
                      Configurações Visuais
                    </h3>

                    {/* Alto Contraste */}
                    <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <label htmlFor="high-contrast" className="font-medium flex items-center gap-2">
                          <Contrast className="w-4 h-4" />
                          Alto Contraste
                        </label>
                        <motion.button
                          className={`relative w-12 h-6 rounded-full transition-colors ${
                            settings.altoContraste ? 'bg-blue-600' : 'bg-gray-300'
                          }`}
                          onClick={() => handleSettingChange('altoContraste', !settings.altoContraste)}
                          whileTap={{ scale: 0.95 }}
                          role="switch"
                          aria-checked={settings.altoContraste}
                          aria-labelledby="high-contrast"
                        >
                          <motion.div
                            className="absolute top-1 w-4 h-4 bg-white rounded-full shadow"
                            animate={{ x: settings.altoContraste ? 24 : 2 }}
                            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                          />
                        </motion.button>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Aumenta o contraste entre texto e fundo para melhor legibilidade
                      </p>
                    </div>

                    {/* Movimento Reduzido */}
                    <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <label htmlFor="reduced-motion" className="font-medium flex items-center gap-2">
                          <Zap className="w-4 h-4" />
                          Reduzir Movimento
                        </label>
                        <motion.button
                          className={`relative w-12 h-6 rounded-full transition-colors ${
                            settings.reducaoMovimento ? 'bg-blue-600' : 'bg-gray-300'
                          }`}
                          onClick={() => handleSettingChange('reducaoMovimento', !settings.reducaoMovimento)}
                          whileTap={{ scale: 0.95 }}
                          role="switch"
                          aria-checked={settings.reducaoMovimento}
                          aria-labelledby="reduced-motion"
                        >
                          <motion.div
                            className="absolute top-1 w-4 h-4 bg-white rounded-full shadow"
                            animate={{ x: settings.reducaoMovimento ? 24 : 2 }}
                            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                          />
                        </motion.button>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Reduz animações e transições para usuários sensíveis ao movimento
                      </p>
                    </div>

                    {/* Destacar Foco */}
                    <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <label htmlFor="focus-highlight" className="font-medium flex items-center gap-2">
                          <Monitor className="w-4 h-4" />
                          Destacar Foco
                        </label>
                        <motion.button
                          className={`relative w-12 h-6 rounded-full transition-colors ${
                            settings.destacarFoco ? 'bg-blue-600' : 'bg-gray-300'
                          }`}
                          onClick={() => handleSettingChange('destacarFoco', !settings.destacarFoco)}
                          whileTap={{ scale: 0.95 }}
                          role="switch"
                          aria-checked={settings.destacarFoco}
                          aria-labelledby="focus-highlight"
                        >
                          <motion.div
                            className="absolute top-1 w-4 h-4 bg-white rounded-full shadow"
                            animate={{ x: settings.destacarFoco ? 24 : 2 }}
                            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                          />
                        </motion.button>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Destaca elementos em foco para melhor navegação por teclado
                      </p>
                    </div>
                  </div>
                )}

                {/* Text Section */}
                {activeSection === 'text' && (
                  <div className="space-y-6">
                    <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                      <Type className="w-5 h-5" />
                      Configurações de Texto
                    </h3>

                    {/* Tamanho da Fonte */}
                    <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                      <label className="font-medium flex items-center gap-2 mb-3">
                        <Type className="w-4 h-4" />
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
                            className={`p-3 rounded border-2 transition-colors ${
                              settings.tamanhoFonte === option.value
                                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                                : 'border-gray-300 hover:border-gray-400 bg-white dark:bg-gray-700'
                            }`}
                            onClick={() => handleSettingChange('tamanhoFonte', option.value)}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            {option.label}
                            {settings.tamanhoFonte === option.value && (
                              <Check className="w-4 h-4 ml-2 inline" />
                            )}
                          </motion.button>
                        ))}
                      </div>
                    </div>

                    {/* Espaçamento de Linhas */}
                    <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                      <label className="font-medium flex items-center gap-2 mb-3">
                        <Type className="w-4 h-4" />
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
                            className={`p-3 rounded border-2 transition-colors ${
                              settings.espacamentoLinhas === option.value
                                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                                : 'border-gray-300 hover:border-gray-400 bg-white dark:bg-gray-700'
                            }`}
                            onClick={() => handleSettingChange('espacamentoLinhas', option.value)}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            {option.label}
                            {settings.espacamentoLinhas === option.value && (
                              <Check className="w-4 h-4 ml-2 inline" />
                            )}
                          </motion.button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Interaction Section */}
                {activeSection === 'interaction' && (
                  <div className="space-y-6">
                    <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                      <MousePointer className="w-5 h-5" />
                      Configurações de Interação
                    </h3>

                    {/* Navegação por Teclado */}
                    <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <label htmlFor="keyboard-nav" className="font-medium flex items-center gap-2">
                          <Keyboard className="w-4 h-4" />
                          Navegação por Teclado
                        </label>
                        <motion.button
                          className={`relative w-12 h-6 rounded-full transition-colors ${
                            settings.navegacaoTeclado ? 'bg-blue-600' : 'bg-gray-300'
                          }`}
                          onClick={() => handleSettingChange('navegacaoTeclado', !settings.navegacaoTeclado)}
                          whileTap={{ scale: 0.95 }}
                          role="switch"
                          aria-checked={settings.navegacaoTeclado}
                          aria-labelledby="keyboard-nav"
                        >
                          <motion.div
                            className="absolute top-1 w-4 h-4 bg-white rounded-full shadow"
                            animate={{ x: settings.navegacaoTeclado ? 24 : 2 }}
                            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                          />
                        </motion.button>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Habilita navegação completa usando apenas o teclado
                      </p>
                    </div>

                    {/* Simplificar Interface */}
                    <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <label htmlFor="simplify-ui" className="font-medium flex items-center gap-2">
                          <Monitor className="w-4 h-4" />
                          Simplificar Interface
                        </label>
                        <motion.button
                          className={`relative w-12 h-6 rounded-full transition-colors ${
                            settings.simplificarInterface ? 'bg-blue-600' : 'bg-gray-300'
                          }`}
                          onClick={() => handleSettingChange('simplificarInterface', !settings.simplificarInterface)}
                          whileTap={{ scale: 0.95 }}
                          role="switch"
                          aria-checked={settings.simplificarInterface}
                          aria-labelledby="simplify-ui"
                        >
                          <motion.div
                            className="absolute top-1 w-4 h-4 bg-white rounded-full shadow"
                            animate={{ x: settings.simplificarInterface ? 24 : 2 }}
                            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                          />
                        </motion.button>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Remove elementos visuais desnecessários para reduzir distrações
                      </p>
                    </div>
                  </div>
                )}

                {/* Audio Section */}
                {activeSection === 'audio' && (
                  <div className="space-y-6">
                    <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                      <Volume2 className="w-5 h-5" />
                      Configurações de Áudio
                    </h3>

                    {/* Leitor de Tela */}
                    <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <label htmlFor="screen-reader" className="font-medium flex items-center gap-2">
                          <Volume2 className="w-4 h-4" />
                          Leitor de Tela
                        </label>
                        <motion.button
                          className={`relative w-12 h-6 rounded-full transition-colors ${
                            settings.leitorTela ? 'bg-blue-600' : 'bg-gray-300'
                          }`}
                          onClick={() => handleSettingChange('leitorTela', !settings.leitorTela)}
                          whileTap={{ scale: 0.95 }}
                          role="switch"
                          aria-checked={settings.leitorTela}
                          aria-labelledby="screen-reader"
                        >
                          <motion.div
                            className="absolute top-1 w-4 h-4 bg-white rounded-full shadow"
                            animate={{ x: settings.leitorTela ? 24 : 2 }}
                            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                          />
                        </motion.button>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Anuncia mudanças e informações importantes na interface
                      </p>
                    </div>

                    {/* Feedback Sonoro */}
                    <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <label htmlFor="sound-feedback" className="font-medium flex items-center gap-2">
                          <Volume2 className="w-4 h-4" />
                          Feedback Sonoro
                        </label>
                        <motion.button
                          className={`relative w-12 h-6 rounded-full transition-colors ${
                            settings.feedbackSonoro ? 'bg-blue-600' : 'bg-gray-300'
                          }`}
                          onClick={() => handleSettingChange('feedbackSonoro', !settings.feedbackSonoro)}
                          whileTap={{ scale: 0.95 }}
                          role="switch"
                          aria-checked={settings.feedbackSonoro}
                          aria-labelledby="sound-feedback"
                        >
                          <motion.div
                            className="absolute top-1 w-4 h-4 bg-white rounded-full shadow"
                            animate={{ x: settings.feedbackSonoro ? 24 : 2 }}
                            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                          />
                        </motion.button>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Reproduz sons de confirmação para ações e interações
                      </p>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between p-6 border-t border-gray-200 dark:border-gray-700">
            <motion.button
              onClick={resetSettings}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Settings className="w-4 h-4" />
              Redefinir
            </motion.button>

            <div className="flex items-center gap-3">
              <motion.button
                onClick={onClose}
                className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Cancelar
              </motion.button>
              <motion.button
                onClick={onClose}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Check className="w-4 h-4" />
                Salvar
              </motion.button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AccessibilitySettings;