import { useEffect, useState } from 'react';
import useAcessibilidade from './useAcessibilidade';

export interface GlobalSettings {
  theme: string;
  language: string;
  soundEnabled: boolean;
  notificationsEnabled: boolean;
  autoSave: boolean;
  dataRetention: number;
}

const defaultGlobalSettings: GlobalSettings = {
  theme: 'system',
  language: 'pt-BR',
  soundEnabled: true,
  notificationsEnabled: true,
  autoSave: true,
  dataRetention: 30
};

/**
 * Hook para gerenciar configurações globais da aplicação
 * Garante que todas as configurações sejam carregadas e aplicadas no início
 */
export const useGlobalSettings = () => {
  const [settings, setSettings] = useState<GlobalSettings>(() => {
    if (typeof window === 'undefined') return defaultGlobalSettings;
    
    return {
      theme: localStorage.getItem('theme') || defaultGlobalSettings.theme,
      language: localStorage.getItem('language') || defaultGlobalSettings.language,
      soundEnabled: localStorage.getItem('soundEnabled') !== 'false',
      notificationsEnabled: localStorage.getItem('notificationsEnabled') !== 'false',
      autoSave: localStorage.getItem('autoSave') !== 'false',
      dataRetention: parseInt(localStorage.getItem('dataRetention') || '30')
    };
  });

  const [isInitialized, setIsInitialized] = useState(false);
  const { configuracao: accessibilitySettings } = useAcessibilidade();

  // Aplicar tema no DOM
  const applyTheme = (theme: string) => {
    const root = document.documentElement;
    
    // Verificar se o sistema de temas avançado está disponível
    const configuracaoTemas = localStorage.getItem('configuracao-temas');
    
    if (configuracaoTemas) {
      // Sistema de temas avançado disponível - mapear tema básico para tema avançado
      try {
        const config = JSON.parse(configuracaoTemas);
        let temaAvancado = config.temaAtivo;
        
        if (theme === 'dark' && config.temaAtivo === 'padrao') {
          temaAvancado = 'escuro';
        } else if (theme === 'light' && config.temaAtivo === 'escuro') {
          temaAvancado = 'padrao';
        } else if (theme === 'system') {
          const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
          temaAvancado = prefersDark ? 'escuro' : 'padrao';
        }
        
        // Atualizar configuração do sistema avançado se necessário
        if (temaAvancado !== config.temaAtivo) {
          const novaConfig = { ...config, temaAtivo: temaAvancado };
          localStorage.setItem('configuracao-temas', JSON.stringify(novaConfig));
          
          // Disparar evento personalizado para notificar mudança
          window.dispatchEvent(new CustomEvent('themeChange', { 
            detail: { temaId: temaAvancado } 
          }));
        }
      } catch (error) {
        console.warn('Erro ao sincronizar com sistema de temas avançado:', error);
        // Fallback para sistema básico
        applyBasicTheme(theme);
      }
    } else {
      // Sistema básico apenas
      applyBasicTheme(theme);
    }
  };

  // Aplicar tema básico (fallback)
  const applyBasicTheme = (theme: string) => {
    const root = document.documentElement;
    
    if (theme === 'dark') {
      root.classList.add('dark');
    } else if (theme === 'light') {
      root.classList.remove('dark');
    } else {
      // Sistema - detectar preferência
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (prefersDark) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    }
  };

  // Inicialização das configurações
  useEffect(() => {
    if (typeof window === 'undefined') return;

    try {
      // Aplicar tema
      applyTheme(settings.theme);
      
      // Marcar como inicializado
      setIsInitialized(true);
      
      console.log('Configurações globais inicializadas:', settings);
    } catch (error) {
      console.error('Erro ao inicializar configurações globais:', error);
      setIsInitialized(true); // Marcar como inicializado mesmo com erro
    }
  }, [settings.theme]);

  // Atualizar configuração específica
  const updateSetting = <K extends keyof GlobalSettings>(
    key: K,
    value: GlobalSettings[K]
  ) => {
    setSettings(prev => {
      const newSettings = { ...prev, [key]: value };
      
      // Salvar no localStorage
      localStorage.setItem(key, value.toString());
      
      // Aplicar mudanças específicas
      if (key === 'theme') {
        applyTheme(value as string);
      }
      
      return newSettings;
    });
  };

  // Resetar todas as configurações
  const resetSettings = () => {
    setSettings(defaultGlobalSettings);
    
    // Limpar localStorage
    Object.keys(defaultGlobalSettings).forEach(key => {
      localStorage.setItem(key, (defaultGlobalSettings as any)[key].toString());
    });
    
    // Aplicar configurações padrão
    applyTheme(defaultGlobalSettings.theme);
  };

  // Exportar configurações
  const exportSettings = () => {
    const data = {
      globalSettings: settings,
      accessibilitySettings,
      timestamp: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `jurus-settings-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Importar configurações
  const importSettings = (file: File): Promise<void> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target?.result as string);
          
          if (data.globalSettings) {
            // Aplicar configurações globais
            Object.entries(data.globalSettings).forEach(([key, value]) => {
              updateSetting(key as keyof GlobalSettings, value as any);
            });
          }
          
          resolve();
        } catch (error) {
          reject(new Error('Arquivo de configurações inválido'));
        }
      };
      
      reader.onerror = () => {
        reject(new Error('Erro ao ler arquivo'));
      };
      
      reader.readAsText(file);
    });
  };

  // Verificar se as configurações estão sendo persistidas corretamente
  const validatePersistence = () => {
    const issues: string[] = [];
    
    Object.entries(settings).forEach(([key, value]) => {
      const stored = localStorage.getItem(key);
      const expectedValue = value.toString();
      
      if (stored !== expectedValue) {
        issues.push(`${key}: esperado "${expectedValue}", encontrado "${stored}"`);
      }
    });
    
    return {
      isValid: issues.length === 0,
      issues
    };
  };

  return {
    settings,
    isInitialized,
    updateSetting,
    resetSettings,
    exportSettings,
    importSettings,
    validatePersistence,
    applyTheme
  };
};

/**
 * Hook para monitorar mudanças nas configurações
 */
export const useSettingsWatcher = () => {
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key && ['theme', 'language', 'soundEnabled', 'notificationsEnabled', 'autoSave', 'dataRetention'].includes(e.key)) {
        console.log(`Configuração alterada: ${e.key} = ${e.newValue}`);
        
        // Recarregar página se necessário para aplicar mudanças
        if (e.key === 'theme' || e.key === 'language') {
          window.location.reload();
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);
};