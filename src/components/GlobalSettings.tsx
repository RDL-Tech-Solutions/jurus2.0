import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Settings, 
  X, 
  Monitor, 
  Moon, 
  Sun, 
  Globe, 
  Bell, 
  Shield, 
  Download, 
  Upload,
  RotateCcw,
  Save,
  Trash2,
  User,
  Database,
  Palette,
  Accessibility,
  Volume2,
  VolumeX
} from 'lucide-react';
import useAcessibilidade from '../hooks/useAcessibilidade';
import { useMicroInteractions } from '../hooks/useMicroInteractions';
import { Z_INDEX } from '../constants/zIndex';

interface GlobalSettingsProps {
  isOpen: boolean;
  onClose: () => void;
}

interface SettingsSection {
  id: string;
  title: string;
  icon: React.ReactNode;
  description: string;
}

export const GlobalSettings: React.FC<GlobalSettingsProps> = ({ isOpen, onClose }) => {
  const [activeSection, setActiveSection] = useState('appearance');
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'system');
  const [language, setLanguage] = useState(localStorage.getItem('language') || 'pt-BR');
  const [soundEnabled, setSoundEnabled] = useState(localStorage.getItem('soundEnabled') !== 'false');
  const [notificationsEnabled, setNotificationsEnabled] = useState(
    localStorage.getItem('notificationsEnabled') !== 'false'
  );
  const [autoSave, setAutoSave] = useState(localStorage.getItem('autoSave') !== 'false');
  const [dataRetention, setDataRetention] = useState(
    parseInt(localStorage.getItem('dataRetention') || '30')
  );

  const { configuracao: accessibility, setConfiguracao: updateAccessibility } = useAcessibilidade();
  const { playSound, triggerHaptic } = useMicroInteractions();

  const resetAccessibility = () => {
    const defaultAccessibility = {
      ...accessibility,
      altoContraste: false,
      tamanhoFonte: 'normal' as const,
      reducaoMovimento: false,
      leitorTela: false,
      navegacaoTeclado: true,
      destacarFoco: true,
      espacamentoLinhas: 'normal' as const,
      feedbackSonoro: false,
      simplificarInterface: false
    };
    updateAccessibility(defaultAccessibility);
  };

  const sections: SettingsSection[] = [
    {
      id: 'appearance',
      title: 'Aparência',
      icon: <Palette size={20} />,
      description: 'Tema, cores e personalização visual'
    },
    {
      id: 'accessibility',
      title: 'Acessibilidade',
      icon: <Accessibility size={20} />,
      description: 'Configurações de acessibilidade e usabilidade'
    },
    {
      id: 'notifications',
      title: 'Notificações',
      icon: <Bell size={20} />,
      description: 'Alertas, sons e notificações do sistema'
    },
    {
      id: 'data',
      title: 'Dados',
      icon: <Database size={20} />,
      description: 'Backup, importação e exportação de dados'
    },
    {
      id: 'privacy',
      title: 'Privacidade',
      icon: <Shield size={20} />,
      description: 'Configurações de privacidade e segurança'
    },
    {
      id: 'advanced',
      title: 'Avançado',
      icon: <Settings size={20} />,
      description: 'Configurações técnicas e experimentais'
    }
  ];

  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    
    // Aplicar tema imediatamente
    const root = document.documentElement;
    if (newTheme === 'dark') {
      root.classList.add('dark');
    } else if (newTheme === 'light') {
      root.classList.remove('dark');
    } else {
      // Sistema
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (prefersDark) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    }
    
    playSound(600, 100);
    triggerHaptic('light');
  };

  const handleLanguageChange = (newLanguage: string) => {
    setLanguage(newLanguage);
    localStorage.setItem('language', newLanguage);
    playSound(600, 100);
    triggerHaptic('light');
  };

  const handleSoundToggle = () => {
    const newValue = !soundEnabled;
    setSoundEnabled(newValue);
    localStorage.setItem('soundEnabled', newValue.toString());
    if (newValue) {
      playSound(800, 200);
    }
    triggerHaptic('light');
  };

  const handleNotificationsToggle = () => {
    const newValue = !notificationsEnabled;
    setNotificationsEnabled(newValue);
    localStorage.setItem('notificationsEnabled', newValue.toString());
    playSound(600, 100);
    triggerHaptic('light');
  };

  const handleAutoSaveToggle = () => {
    const newValue = !autoSave;
    setAutoSave(newValue);
    localStorage.setItem('autoSave', newValue.toString());
    playSound(600, 100);
    triggerHaptic('light');
  };

  const handleDataRetentionChange = (days: number) => {
    setDataRetention(days);
    localStorage.setItem('dataRetention', days.toString());
    playSound(600, 100);
    triggerHaptic('light');
  };

  const exportData = () => {
    try {
      const data = {
        settings: {
          theme,
          language,
          soundEnabled,
          notificationsEnabled,
          autoSave,
          dataRetention,
          accessibility
        },
        simulacoes: JSON.parse(localStorage.getItem('simulacoes') || '[]'),
        portfolios: JSON.parse(localStorage.getItem('portfolios') || '[]'),
        timestamp: new Date().toISOString()
      };

      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `jurus-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      playSound(800, 200);
      triggerHaptic('medium');
    } catch (error) {
      console.error('Erro ao exportar dados:', error);
      playSound(400, 300);
      triggerHaptic('heavy');
    }
  };

  const importData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        
        if (data.settings) {
          // Restaurar configurações
          if (data.settings.theme) handleThemeChange(data.settings.theme);
          if (data.settings.language) handleLanguageChange(data.settings.language);
          if (typeof data.settings.soundEnabled === 'boolean') {
            setSoundEnabled(data.settings.soundEnabled);
            localStorage.setItem('soundEnabled', data.settings.soundEnabled.toString());
          }
          if (typeof data.settings.notificationsEnabled === 'boolean') {
            setNotificationsEnabled(data.settings.notificationsEnabled);
            localStorage.setItem('notificationsEnabled', data.settings.notificationsEnabled.toString());
          }
          if (typeof data.settings.autoSave === 'boolean') {
            setAutoSave(data.settings.autoSave);
            localStorage.setItem('autoSave', data.settings.autoSave.toString());
          }
          if (data.settings.dataRetention) {
            setDataRetention(data.settings.dataRetention);
            localStorage.setItem('dataRetention', data.settings.dataRetention.toString());
          }
          if (data.settings.accessibility) {
            updateAccessibility({ ...accessibility, ...data.settings.accessibility });
          }
        }

        // Restaurar dados da aplicação
        if (data.simulacoes) {
          localStorage.setItem('simulacoes', JSON.stringify(data.simulacoes));
        }
        if (data.portfolios) {
          localStorage.setItem('portfolios', JSON.stringify(data.portfolios));
        }

        playSound(800, 200);
        triggerHaptic('medium');
        
        // Recarregar página para aplicar todas as mudanças
        setTimeout(() => window.location.reload(), 1000);
      } catch (error) {
        console.error('Erro ao importar dados:', error);
        playSound(400, 300);
        triggerHaptic('heavy');
      }
    };
    reader.readAsText(file);
  };

  const clearAllData = () => {
    if (confirm('Tem certeza que deseja limpar todos os dados? Esta ação não pode ser desfeita.')) {
      localStorage.clear();
      playSound(800, 200);
      triggerHaptic('heavy');
      setTimeout(() => window.location.reload(), 500);
    }
  };

  const resetToDefaults = () => {
    if (confirm('Tem certeza que deseja restaurar todas as configurações padrão?')) {
      // Reset configurações
      handleThemeChange('system');
      handleLanguageChange('pt-BR');
      setSoundEnabled(true);
      setNotificationsEnabled(true);
      setAutoSave(true);
      setDataRetention(30);
      
      // Reset acessibilidade
      resetAccessibility();
      
      playSound(800, 200);
      triggerHaptic('medium');
    }
  };

  const renderAppearanceSection = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          Tema
        </label>
        <div className="grid grid-cols-3 gap-3">
          {[
            { value: 'light', label: 'Claro', icon: <Sun size={16} /> },
            { value: 'dark', label: 'Escuro', icon: <Moon size={16} /> },
            { value: 'system', label: 'Sistema', icon: <Monitor size={16} /> }
          ].map((option) => (
            <button
              key={option.value}
              onClick={() => handleThemeChange(option.value)}
              className={`p-3 rounded-lg border-2 transition-all flex flex-col items-center gap-2 ${
                theme === option.value
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
              }`}
            >
              {option.icon}
              <span className="text-sm font-medium">{option.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          Idioma
        </label>
        <select
          value={language}
          onChange={(e) => handleLanguageChange(e.target.value)}
          className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
        >
          <option value="pt-BR">Português (Brasil)</option>
          <option value="en-US">English (US)</option>
          <option value="es-ES">Español</option>
        </select>
      </div>
    </div>
  );

  const renderAccessibilitySection = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <label className="flex items-center space-x-3 cursor-pointer">
          <input
            type="checkbox"
            checked={accessibility.altoContraste}
            onChange={(e) => updateAccessibility({ ...accessibility, altoContraste: e.target.checked })}
            className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
          />
          <span className="text-sm font-medium">Alto Contraste</span>
        </label>

        <label className="flex items-center space-x-3 cursor-pointer">
          <input
            type="checkbox"
            checked={accessibility.destacarFoco}
            onChange={(e) => updateAccessibility({ ...accessibility, destacarFoco: e.target.checked })}
            className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
          />
          <span className="text-sm font-medium">Destacar Foco</span>
        </label>

        <label className="flex items-center space-x-3 cursor-pointer">
          <input
            type="checkbox"
            checked={accessibility.reducaoMovimento}
            onChange={(e) => updateAccessibility({ ...accessibility, reducaoMovimento: e.target.checked })}
            className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
          />
          <span className="text-sm font-medium">Movimento Reduzido</span>
        </label>

        <label className="flex items-center space-x-3 cursor-pointer">
          <input
            type="checkbox"
            checked={accessibility.navegacaoTeclado}
            onChange={(e) => updateAccessibility({ ...accessibility, navegacaoTeclado: e.target.checked })}
            className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
          />
          <span className="text-sm font-medium">Navegação por Teclado</span>
        </label>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          Tamanho da Fonte: {accessibility.tamanhoFonte}
        </label>
        <select
          value={accessibility.tamanhoFonte}
          onChange={(e) => updateAccessibility({ ...accessibility, tamanhoFonte: e.target.value as 'pequeno' | 'normal' | 'grande' | 'extra-grande' })}
          className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800"
        >
          <option value="pequeno">Pequeno</option>
          <option value="normal">Normal</option>
          <option value="grande">Grande</option>
          <option value="extra-grande">Extra Grande</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          Espaçamento de Linhas
        </label>
        <select
          value={accessibility.espacamentoLinhas}
          onChange={(e) => updateAccessibility({ ...accessibility, espacamentoLinhas: e.target.value as 'compacto' | 'normal' | 'expandido' })}
          className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800"
        >
          <option value="compacto">Compacto</option>
          <option value="normal">Normal</option>
          <option value="expandido">Expandido</option>
        </select>
      </div>

      <button
        onClick={resetAccessibility}
        className="w-full p-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors flex items-center justify-center gap-2"
      >
        <RotateCcw size={16} />
        Restaurar Padrões de Acessibilidade
      </button>
    </div>
  );

  const renderNotificationsSection = () => (
    <div className="space-y-6">
      <label className="flex items-center justify-between cursor-pointer">
        <div className="flex items-center space-x-3">
          <Bell size={20} />
          <div>
            <span className="text-sm font-medium">Notificações</span>
            <p className="text-xs text-gray-500">Receber alertas e notificações</p>
          </div>
        </div>
        <input
          type="checkbox"
          checked={notificationsEnabled}
          onChange={handleNotificationsToggle}
          className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
        />
      </label>

      <label className="flex items-center justify-between cursor-pointer">
        <div className="flex items-center space-x-3">
          {soundEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
          <div>
            <span className="text-sm font-medium">Sons</span>
            <p className="text-xs text-gray-500">Efeitos sonoros da interface</p>
          </div>
        </div>
        <input
          type="checkbox"
          checked={soundEnabled}
          onChange={handleSoundToggle}
          className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
        />
      </label>
    </div>
  );

  const renderDataSection = () => (
    <div className="space-y-6">
      <label className="flex items-center justify-between cursor-pointer">
        <div className="flex items-center space-x-3">
          <Save size={20} />
          <div>
            <span className="text-sm font-medium">Salvamento Automático</span>
            <p className="text-xs text-gray-500">Salvar dados automaticamente</p>
          </div>
        </div>
        <input
          type="checkbox"
          checked={autoSave}
          onChange={handleAutoSaveToggle}
          className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
        />
      </label>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          Retenção de Dados: {dataRetention} dias
        </label>
        <input
          type="range"
          min="7"
          max="365"
          step="7"
          value={dataRetention}
          onChange={(e) => handleDataRetentionChange(parseInt(e.target.value))}
          className="w-full"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={exportData}
          className="p-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center gap-2"
        >
          <Download size={16} />
          Exportar Dados
        </button>

        <label className="p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center gap-2 cursor-pointer">
          <Upload size={16} />
          Importar Dados
          <input
            type="file"
            accept=".json"
            onChange={importData}
            className="hidden"
          />
        </label>
      </div>

      <button
        onClick={clearAllData}
        className="w-full p-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center justify-center gap-2"
      >
        <Trash2 size={16} />
        Limpar Todos os Dados
      </button>
    </div>
  );

  const renderPrivacySection = () => (
    <div className="space-y-6">
      <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
        <h3 className="font-medium text-green-800 dark:text-green-200 mb-2">
          🔒 Privacidade Total
        </h3>
        <p className="text-sm text-green-700 dark:text-green-300">
          Todos os seus dados são armazenados localmente no seu dispositivo. 
          Nenhuma informação é enviada para servidores externos.
        </p>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Dados Locais</span>
          <span className="text-xs text-green-600 bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded">
            ✓ Seguro
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Cookies de Terceiros</span>
          <span className="text-xs text-green-600 bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded">
            ✓ Bloqueados
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Rastreamento</span>
          <span className="text-xs text-green-600 bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded">
            ✓ Desabilitado
          </span>
        </div>
      </div>
    </div>
  );

  const renderAdvancedSection = () => (
    <div className="space-y-6">
      <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
        <h3 className="font-medium text-yellow-800 dark:text-yellow-200 mb-2">
          ⚠️ Configurações Avançadas
        </h3>
        <p className="text-sm text-yellow-700 dark:text-yellow-300">
          Estas configurações são para usuários experientes. 
          Altere apenas se souber o que está fazendo.
        </p>
      </div>

      <button
        onClick={resetToDefaults}
        className="w-full p-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors flex items-center justify-center gap-2"
      >
        <RotateCcw size={16} />
        Restaurar Todas as Configurações Padrão
      </button>

      <div className="text-xs text-gray-500 space-y-1">
        <p>Versão: 4.0.0</p>
        <p>Build: {new Date().toISOString().split('T')[0]}</p>
        <p>Navegador: {navigator.userAgent.split(' ')[0]}</p>
      </div>
    </div>
  );

  const renderSectionContent = () => {
    switch (activeSection) {
      case 'appearance':
        return renderAppearanceSection();
      case 'accessibility':
        return renderAccessibilitySection();
      case 'notifications':
        return renderNotificationsSection();
      case 'data':
        return renderDataSection();
      case 'privacy':
        return renderPrivacySection();
      case 'advanced':
        return renderAdvancedSection();
      default:
        return null;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
          style={{ zIndex: Z_INDEX.SETTINGS_PANEL }}
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <Settings className="w-6 h-6 text-blue-600" />
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                  Configurações Globais
                </h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex h-[calc(90vh-80px)]">
              {/* Sidebar */}
              <div className="w-64 bg-gray-50 dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 p-4">
                <nav className="space-y-2">
                  {sections.map((section) => (
                    <button
                      key={section.id}
                      onClick={() => setActiveSection(section.id)}
                      className={`w-full text-left p-3 rounded-lg transition-colors ${
                        activeSection === section.id
                          ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                          : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      <div className="flex items-center gap-3 mb-1">
                        {section.icon}
                        <span className="font-medium">{section.title}</span>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {section.description}
                      </p>
                    </button>
                  ))}
                </nav>
              </div>

              {/* Content */}
              <div className="flex-1 p-6 overflow-y-auto">
                <motion.div
                  key={activeSection}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {renderSectionContent()}
                </motion.div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default GlobalSettings;