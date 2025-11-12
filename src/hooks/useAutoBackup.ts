import { useState, useEffect, useCallback } from 'react';
import { APP_VERSION } from '../constants/version';

interface BackupData {
  id: string;
  timestamp: string;
  version: string;
  data: {
    profiles: any[];
    settings: any;
    simulacoes: any[];
    portfolios: any[];
    accessibility: any;
    notifications: any[];
  };
  size: number;
  type: 'auto' | 'manual';
}

interface BackupSettings {
  enabled: boolean;
  frequency: number; // em minutos
  maxBackups: number;
  includeProfiles: boolean;
  includeSettings: boolean;
  includeSimulacoes: boolean;
  includePortfolios: boolean;
  autoCleanup: boolean;
}

const DEFAULT_BACKUP_SETTINGS: BackupSettings = {
  enabled: true,
  frequency: 30, // 30 minutos
  maxBackups: 10,
  includeProfiles: true,
  includeSettings: true,
  includeSimulacoes: true,
  includePortfolios: true,
  autoCleanup: true,
};

const BACKUP_STORAGE_KEY = 'jurus_backups';
const BACKUP_SETTINGS_KEY = 'jurus_backup_settings';

export const useAutoBackup = () => {
  const [backups, setBackups] = useState<BackupData[]>([]);
  const [settings, setSettings] = useState<BackupSettings>(DEFAULT_BACKUP_SETTINGS);
  const [isBackingUp, setIsBackingUp] = useState(false);
  const [lastBackup, setLastBackup] = useState<string | null>(null);

  // Carregar configurações e backups
  useEffect(() => {
    try {
      const savedSettings = localStorage.getItem(BACKUP_SETTINGS_KEY);
      if (savedSettings) {
        setSettings({ ...DEFAULT_BACKUP_SETTINGS, ...JSON.parse(savedSettings) });
      }

      const savedBackups = localStorage.getItem(BACKUP_STORAGE_KEY);
      if (savedBackups) {
        const parsedBackups = JSON.parse(savedBackups);
        setBackups(parsedBackups);
        if (parsedBackups.length > 0) {
          setLastBackup(parsedBackups[0].timestamp);
        }
      }
    } catch (error) {
      console.error('Erro ao carregar configurações de backup:', error);
    }
  }, []);

  // Salvar configurações
  const updateSettings = useCallback((newSettings: Partial<BackupSettings>) => {
    const updatedSettings = { ...settings, ...newSettings };
    setSettings(updatedSettings);
    localStorage.setItem(BACKUP_SETTINGS_KEY, JSON.stringify(updatedSettings));
  }, [settings]);

  // Coletar dados para backup
  const collectBackupData = useCallback(() => {
    const data: any = {};

    if (settings.includeProfiles) {
      data.profiles = JSON.parse(localStorage.getItem('jurus_profiles') || '[]');
    }

    if (settings.includeSettings) {
      data.settings = {
        theme: localStorage.getItem('theme'),
        language: localStorage.getItem('language'),
        currency: localStorage.getItem('currency'),
        notificationsEnabled: localStorage.getItem('notificationsEnabled'),
        autoSave: localStorage.getItem('autoSave'),
        soundEnabled: localStorage.getItem('soundEnabled'),
      };
    }

    if (settings.includeSimulacoes) {
      data.simulacoes = JSON.parse(localStorage.getItem('simulacoes') || '[]');
    }

    if (settings.includePortfolios) {
      data.portfolios = JSON.parse(localStorage.getItem('portfolios') || '[]');
    }

    // Sempre incluir dados críticos
    data.accessibility = JSON.parse(localStorage.getItem('accessibility_settings') || '{}');
    data.notifications = JSON.parse(localStorage.getItem('notifications') || '[]');

    return data;
  }, [settings]);

  // Criar backup
  const createBackup = useCallback(async (type: 'auto' | 'manual' = 'auto'): Promise<BackupData | null> => {
    if (isBackingUp) return null;

    setIsBackingUp(true);

    try {
      const data = collectBackupData();
      const dataString = JSON.stringify(data);
      
      const backup: BackupData = {
        id: `backup_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        timestamp: new Date().toISOString(),
        version: APP_VERSION,
        data,
        size: new Blob([dataString]).size,
        type,
      };

      const updatedBackups = [backup, ...backups];

      // Limitar número de backups se auto-cleanup estiver ativado
      if (settings.autoCleanup && updatedBackups.length > settings.maxBackups) {
        updatedBackups.splice(settings.maxBackups);
      }

      setBackups(updatedBackups);
      setLastBackup(backup.timestamp);
      localStorage.setItem(BACKUP_STORAGE_KEY, JSON.stringify(updatedBackups));

      return backup;
    } catch (error) {
      console.error('Erro ao criar backup:', error);
      return null;
    } finally {
      setIsBackingUp(false);
    }
  }, [isBackingUp, collectBackupData, backups, settings]);

  // Restaurar backup
  const restoreBackup = useCallback(async (backupId: string): Promise<boolean> => {
    try {
      const backup = backups.find(b => b.id === backupId);
      if (!backup) {
        throw new Error('Backup não encontrado');
      }

      const { data } = backup;

      // Restaurar dados
      if (data.profiles) {
        localStorage.setItem('jurus_profiles', JSON.stringify(data.profiles));
      }

      if (data.settings) {
        Object.entries(data.settings).forEach(([key, value]) => {
          if (value !== null && value !== undefined) {
            localStorage.setItem(key, value as string);
          }
        });
      }

      if (data.simulacoes) {
        localStorage.setItem('simulacoes', JSON.stringify(data.simulacoes));
      }

      if (data.portfolios) {
        localStorage.setItem('portfolios', JSON.stringify(data.portfolios));
      }

      if (data.accessibility) {
        localStorage.setItem('accessibility_settings', JSON.stringify(data.accessibility));
      }

      if (data.notifications) {
        localStorage.setItem('notifications', JSON.stringify(data.notifications));
      }

      // Recarregar página para aplicar mudanças
      setTimeout(() => window.location.reload(), 1000);

      return true;
    } catch (error) {
      console.error('Erro ao restaurar backup:', error);
      return false;
    }
  }, [backups]);

  // Deletar backup
  const deleteBackup = useCallback((backupId: string) => {
    const updatedBackups = backups.filter(b => b.id !== backupId);
    setBackups(updatedBackups);
    localStorage.setItem(BACKUP_STORAGE_KEY, JSON.stringify(updatedBackups));
  }, [backups]);

  // Exportar backup
  const exportBackup = useCallback((backupId: string) => {
    const backup = backups.find(b => b.id === backupId);
    if (!backup) return;

    const blob = new Blob([JSON.stringify(backup, null, 2)], { 
      type: 'application/json' 
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `jurus-backup-${new Date(backup.timestamp).toISOString().split('T')[0]}-${backup.id.split('_')[1]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [backups]);

  // Importar backup
  const importBackup = useCallback((file: File): Promise<BackupData> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const backupData = JSON.parse(e.target?.result as string);
          
          if (!backupData.id || !backupData.data) {
            throw new Error('Arquivo de backup inválido');
          }

          // Gerar novo ID para evitar conflitos
          const importedBackup: BackupData = {
            ...backupData,
            id: `backup_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            type: 'manual' as const,
          };

          const updatedBackups = [importedBackup, ...backups];
          setBackups(updatedBackups);
          localStorage.setItem(BACKUP_STORAGE_KEY, JSON.stringify(updatedBackups));

          resolve(importedBackup);
        } catch (error) {
          reject(new Error('Erro ao importar backup: ' + (error as Error).message));
        }
      };
      reader.readAsText(file);
    });
  }, [backups]);

  // Limpar todos os backups
  const clearAllBackups = useCallback(() => {
    setBackups([]);
    setLastBackup(null);
    localStorage.removeItem(BACKUP_STORAGE_KEY);
  }, []);

  // Verificar se é hora de fazer backup automático
  const shouldAutoBackup = useCallback(() => {
    if (!settings.enabled || !lastBackup) return true;

    const lastBackupTime = new Date(lastBackup).getTime();
    const now = Date.now();
    const timeDiff = now - lastBackupTime;
    const frequencyMs = settings.frequency * 60 * 1000; // converter minutos para ms

    return timeDiff >= frequencyMs;
  }, [settings.enabled, settings.frequency, lastBackup]);

  // Auto backup periódico
  useEffect(() => {
    if (!settings.enabled) return;

    const interval = setInterval(() => {
      if (shouldAutoBackup()) {
        createBackup('auto');
      }
    }, 60000); // Verificar a cada minuto

    return () => clearInterval(interval);
  }, [settings.enabled, shouldAutoBackup, createBackup]);

  // Backup ao sair da página
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (settings.enabled && shouldAutoBackup()) {
        // Backup síncrono para garantir que seja executado
        const data = collectBackupData();
        const backup: BackupData = {
          id: `backup_${Date.now()}_exit`,
          timestamp: new Date().toISOString(),
          version: APP_VERSION,
          data,
          size: new Blob([JSON.stringify(data)]).size,
          type: 'auto',
        };

        const updatedBackups = [backup, ...backups].slice(0, settings.maxBackups);
        localStorage.setItem(BACKUP_STORAGE_KEY, JSON.stringify(updatedBackups));
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [settings, shouldAutoBackup, collectBackupData, backups]);

  // Calcular estatísticas
  const stats = {
    totalBackups: backups.length,
    totalSize: backups.reduce((sum, backup) => sum + backup.size, 0),
    autoBackups: backups.filter(b => b.type === 'auto').length,
    manualBackups: backups.filter(b => b.type === 'manual').length,
    oldestBackup: backups.length > 0 ? backups[backups.length - 1].timestamp : null,
    newestBackup: backups.length > 0 ? backups[0].timestamp : null,
  };

  return {
    backups,
    settings,
    isBackingUp,
    lastBackup,
    stats,
    updateSettings,
    createBackup,
    restoreBackup,
    deleteBackup,
    exportBackup,
    importBackup,
    clearAllBackups,
    shouldAutoBackup,
  };
};