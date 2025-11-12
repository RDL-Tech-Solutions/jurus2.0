import { useState, useEffect, useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { APP_VERSION } from '../constants/version';

export interface UserProfile {
  id: string;
  name: string;
  email?: string;
  avatar?: string;
  createdAt: string;
  lastAccess: string;
  preferences: {
    theme: 'light' | 'dark' | 'system';
    currency: string;
    language: string;
    notifications: boolean;
  };
}

export interface InvestmentData {
  portfolios: any[];
  transactions: any[];
  goals: any[];
  simulations: any[];
  favorites: any[];
  settings: any;
}

export interface BackupData {
  id: string;
  profileId: string;
  timestamp: string;
  data: InvestmentData;
  version: string;
  checksum: string;
}

interface DataManagerState {
  profiles: UserProfile[];
  currentProfile: UserProfile | null;
  backups: BackupData[];
  isLoading: boolean;
  lastSync: string | null;
}

const STORAGE_KEYS = {
  PROFILES: 'jurus_profiles',
  CURRENT_PROFILE: 'jurus_current_profile',
  BACKUPS: 'jurus_backups',
  DATA_PREFIX: 'jurus_data_',
  SETTINGS: 'jurus_settings'
};

export const useDataManager = () => {
  const [state, setState] = useState<DataManagerState>({
    profiles: [],
    currentProfile: null,
    backups: [],
    isLoading: true,
    lastSync: null
  });

  const [profiles, setProfiles] = useLocalStorage<UserProfile[]>(STORAGE_KEYS.PROFILES, []);
  const [currentProfileId, setCurrentProfileId] = useLocalStorage<string | null>(STORAGE_KEYS.CURRENT_PROFILE, null);
  const [backups, setBackups] = useLocalStorage<BackupData[]>(STORAGE_KEYS.BACKUPS, []);

  // Gerar checksum para validação de dados
  const generateChecksum = useCallback((data: any): string => {
    const str = JSON.stringify(data);
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash).toString(16);
  }, []);

  // Criar novo perfil
  const createProfile = useCallback((name: string, email?: string): UserProfile => {
    const newProfile: UserProfile = {
      id: `profile_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name,
      email,
      createdAt: new Date().toISOString(),
      lastAccess: new Date().toISOString(),
      preferences: {
        theme: 'system',
        currency: 'BRL',
        language: 'pt-BR',
        notifications: true
      }
    };

    const updatedProfiles = [...profiles, newProfile];
    setProfiles(updatedProfiles);
    
    // Criar dados iniciais vazios para o perfil
    const initialData: InvestmentData = {
      portfolios: [],
      transactions: [],
      goals: [],
      simulations: [],
      favorites: [],
      settings: {}
    };
    
    localStorage.setItem(`${STORAGE_KEYS.DATA_PREFIX}${newProfile.id}`, JSON.stringify(initialData));
    
    return newProfile;
  }, [profiles, setProfiles]);

  // Alternar entre perfis
  const switchProfile = useCallback((profileId: string) => {
    const profile = profiles.find(p => p.id === profileId);
    if (profile) {
      // Atualizar último acesso
      const updatedProfile = {
        ...profile,
        lastAccess: new Date().toISOString()
      };
      
      const updatedProfiles = profiles.map(p => 
        p.id === profileId ? updatedProfile : p
      );
      
      setProfiles(updatedProfiles);
      setCurrentProfileId(profileId);
      
      setState(prev => ({
        ...prev,
        currentProfile: updatedProfile
      }));
    }
  }, [profiles, setProfiles, setCurrentProfileId]);

  // Obter dados do perfil atual
  const getCurrentProfileData = useCallback((): InvestmentData | null => {
    if (!state.currentProfile) return null;
    
    const dataKey = `${STORAGE_KEYS.DATA_PREFIX}${state.currentProfile.id}`;
    const storedData = localStorage.getItem(dataKey);
    
    if (storedData) {
      try {
        return JSON.parse(storedData);
      } catch (error) {
        console.error('Erro ao carregar dados do perfil:', error);
        return null;
      }
    }
    
    return null;
  }, [state.currentProfile]);

  // Salvar dados do perfil atual
  const saveCurrentProfileData = useCallback((data: Partial<InvestmentData>) => {
    if (!state.currentProfile) return false;
    
    const currentData = getCurrentProfileData() || {
      portfolios: [],
      transactions: [],
      goals: [],
      simulations: [],
      favorites: [],
      settings: {}
    };
    
    const updatedData = { ...currentData, ...data };
    const dataKey = `${STORAGE_KEYS.DATA_PREFIX}${state.currentProfile.id}`;
    
    try {
      localStorage.setItem(dataKey, JSON.stringify(updatedData));
      return true;
    } catch (error) {
      console.error('Erro ao salvar dados do perfil:', error);
      return false;
    }
  }, [state.currentProfile, getCurrentProfileData]);

  // Criar backup automático
  const createBackup = useCallback((manual: boolean = false) => {
    if (!state.currentProfile) return null;
    
    const profileData = getCurrentProfileData();
    if (!profileData) return null;
    
    const backup: BackupData = {
      id: `backup_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      profileId: state.currentProfile.id,
      timestamp: new Date().toISOString(),
      data: profileData,
      version: APP_VERSION,
      checksum: generateChecksum(profileData)
    };
    
    const updatedBackups = [...backups, backup];
    
    // Manter apenas os últimos 10 backups automáticos por perfil
    if (!manual) {
      const profileBackups = updatedBackups
        .filter(b => b.profileId === state.currentProfile!.id)
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
        .slice(0, 10);
      
      const otherBackups = updatedBackups.filter(b => b.profileId !== state.currentProfile!.id);
      setBackups([...otherBackups, ...profileBackups]);
    } else {
      setBackups(updatedBackups);
    }
    
    return backup;
  }, [state.currentProfile, getCurrentProfileData, backups, setBackups, generateChecksum]);

  // Restaurar backup
  const restoreBackup = useCallback((backupId: string): boolean => {
    const backup = backups.find(b => b.id === backupId);
    if (!backup || !state.currentProfile) return false;
    
    // Verificar checksum
    const calculatedChecksum = generateChecksum(backup.data);
    if (calculatedChecksum !== backup.checksum) {
      console.error('Backup corrompido - checksum inválido');
      return false;
    }
    
    const dataKey = `${STORAGE_KEYS.DATA_PREFIX}${state.currentProfile.id}`;
    
    try {
      localStorage.setItem(dataKey, JSON.stringify(backup.data));
      return true;
    } catch (error) {
      console.error('Erro ao restaurar backup:', error);
      return false;
    }
  }, [backups, state.currentProfile, generateChecksum]);

  // Exportar dados
  const exportData = useCallback((includeBackups: boolean = false) => {
    if (!state.currentProfile) return null;
    
    const profileData = getCurrentProfileData();
    if (!profileData) return null;
    
    const exportData = {
      profile: state.currentProfile,
      data: profileData,
      backups: includeBackups ? backups.filter(b => b.profileId === state.currentProfile!.id) : [],
      exportedAt: new Date().toISOString(),
      version: APP_VERSION
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json'
    });
    
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `jurus_export_${state.currentProfile.name}_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    return exportData;
  }, [state.currentProfile, getCurrentProfileData, backups]);

  // Importar dados
  const importData = useCallback((file: File): Promise<boolean> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const importedData = JSON.parse(e.target?.result as string);
          
          // Validar estrutura dos dados
          if (!importedData.profile || !importedData.data) {
            console.error('Formato de arquivo inválido');
            resolve(false);
            return;
          }
          
          // Verificar se o perfil já existe
          const existingProfile = profiles.find(p => p.id === importedData.profile.id);
          
          if (existingProfile) {
            // Atualizar perfil existente
            const dataKey = `${STORAGE_KEYS.DATA_PREFIX}${existingProfile.id}`;
            localStorage.setItem(dataKey, JSON.stringify(importedData.data));
          } else {
            // Criar novo perfil
            const newProfile = { ...importedData.profile };
            const updatedProfiles = [...profiles, newProfile];
            setProfiles(updatedProfiles);
            
            const dataKey = `${STORAGE_KEYS.DATA_PREFIX}${newProfile.id}`;
            localStorage.setItem(dataKey, JSON.stringify(importedData.data));
          }
          
          // Importar backups se existirem
          if (importedData.backups && importedData.backups.length > 0) {
            const updatedBackups = [...backups, ...importedData.backups];
            setBackups(updatedBackups);
          }
          
          resolve(true);
        } catch (error) {
          console.error('Erro ao importar dados:', error);
          resolve(false);
        }
      };
      
      reader.onerror = () => {
        console.error('Erro ao ler arquivo');
        resolve(false);
      };
      
      reader.readAsText(file);
    });
  }, [profiles, setProfiles, backups, setBackups]);

  // Deletar perfil
  const deleteProfile = useCallback((profileId: string) => {
    const updatedProfiles = profiles.filter(p => p.id !== profileId);
    setProfiles(updatedProfiles);
    
    // Remover dados do perfil
    const dataKey = `${STORAGE_KEYS.DATA_PREFIX}${profileId}`;
    localStorage.removeItem(dataKey);
    
    // Remover backups do perfil
    const updatedBackups = backups.filter(b => b.profileId !== profileId);
    setBackups(updatedBackups);
    
    // Se era o perfil atual, limpar
    if (state.currentProfile?.id === profileId) {
      setCurrentProfileId(null);
      setState(prev => ({ ...prev, currentProfile: null }));
    }
  }, [profiles, setProfiles, backups, setBackups, state.currentProfile, setCurrentProfileId]);

  // Backup automático a cada 5 minutos
  useEffect(() => {
    if (!state.currentProfile) return;
    
    const interval = setInterval(() => {
      createBackup(false);
    }, 5 * 60 * 1000); // 5 minutos
    
    return () => clearInterval(interval);
  }, [state.currentProfile, createBackup]);

  // Carregar estado inicial
  useEffect(() => {
    setState(prev => ({
      ...prev,
      profiles,
      backups,
      isLoading: false
    }));
    
    // Carregar perfil atual
    if (currentProfileId) {
      const currentProfile = profiles.find(p => p.id === currentProfileId);
      if (currentProfile) {
        setState(prev => ({
          ...prev,
          currentProfile
        }));
      }
    }
  }, [profiles, backups, currentProfileId]);

  return {
    // Estado
    profiles: state.profiles,
    currentProfile: state.currentProfile,
    backups: state.backups.filter(b => b.profileId === state.currentProfile?.id),
    isLoading: state.isLoading,
    
    // Ações
    createProfile,
    switchProfile,
    deleteProfile,
    getCurrentProfileData,
    saveCurrentProfileData,
    createBackup,
    restoreBackup,
    exportData,
    importData
  };
};