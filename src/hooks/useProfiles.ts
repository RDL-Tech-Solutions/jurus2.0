import { useState, useEffect, useCallback } from 'react';
import { APP_VERSION } from '../constants/version';

export interface UserProfile {
  id: string;
  name: string;
  avatar?: string;
  createdAt: string;
  lastAccessed: string;
  settings: {
    theme: string;
    language: string;
    currency: string;
    notifications: boolean;
    autoSave: boolean;
  };
  data: {
    simulacoes: any[];
    portfolios: any[];
    favoritos: string[];
    historico: any[];
  };
  stats: {
    totalSimulacoes: number;
    totalPortfolios: number;
    tempoUso: number;
    ultimaAtividade: string;
  };
}

export interface ProfilesState {
  profiles: UserProfile[];
  currentProfile: UserProfile | null;
  isLoading: boolean;
}

const PROFILES_STORAGE_KEY = 'jurus_profiles';
const CURRENT_PROFILE_KEY = 'jurus_current_profile';

const createDefaultProfile = (name: string): UserProfile => ({
  id: `profile_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
  name,
  createdAt: new Date().toISOString(),
  lastAccessed: new Date().toISOString(),
  settings: {
    theme: 'system',
    language: 'pt-BR',
    currency: 'BRL',
    notifications: true,
    autoSave: true,
  },
  data: {
    simulacoes: [],
    portfolios: [],
    favoritos: [],
    historico: [],
  },
  stats: {
    totalSimulacoes: 0,
    totalPortfolios: 0,
    tempoUso: 0,
    ultimaAtividade: new Date().toISOString(),
  },
});

export const useProfiles = () => {
  const [state, setState] = useState<ProfilesState>({
    profiles: [],
    currentProfile: null,
    isLoading: true,
  });

  // Carregar perfis do localStorage
  const loadProfiles = useCallback(() => {
    try {
      const savedProfiles = localStorage.getItem(PROFILES_STORAGE_KEY);
      const currentProfileId = localStorage.getItem(CURRENT_PROFILE_KEY);
      
      let profiles: UserProfile[] = [];
      
      if (savedProfiles) {
        profiles = JSON.parse(savedProfiles);
      }
      
      // Se não há perfis, criar um perfil padrão
      if (profiles.length === 0) {
        const defaultProfile = createDefaultProfile('Perfil Principal');
        profiles = [defaultProfile];
        localStorage.setItem(PROFILES_STORAGE_KEY, JSON.stringify(profiles));
        localStorage.setItem(CURRENT_PROFILE_KEY, defaultProfile.id);
      }
      
      // Encontrar perfil atual
      let currentProfile = profiles.find(p => p.id === currentProfileId) || profiles[0];
      
      // Migrar dados existentes para o perfil atual se necessário
      if (currentProfile && currentProfile.data.simulacoes.length === 0) {
        const existingSimulacoes = localStorage.getItem('simulacoes');
        const existingPortfolios = localStorage.getItem('portfolios');
        
        if (existingSimulacoes) {
          currentProfile.data.simulacoes = JSON.parse(existingSimulacoes);
        }
        if (existingPortfolios) {
          currentProfile.data.portfolios = JSON.parse(existingPortfolios);
        }
        
        // Atualizar estatísticas
        currentProfile.stats.totalSimulacoes = currentProfile.data.simulacoes.length;
        currentProfile.stats.totalPortfolios = currentProfile.data.portfolios.length;
        
        // Salvar perfil atualizado
        const updatedProfiles = profiles.map(p => 
          p.id === currentProfile!.id ? currentProfile! : p
        );
        localStorage.setItem(PROFILES_STORAGE_KEY, JSON.stringify(updatedProfiles));
      }
      
      setState({
        profiles,
        currentProfile,
        isLoading: false,
      });
      
      // Aplicar configurações do perfil atual
      if (currentProfile) {
        applyProfileSettings(currentProfile);
      }
      
    } catch (error) {
      console.error('Erro ao carregar perfis:', error);
      setState(prev => ({ ...prev, isLoading: false }));
    }
  }, []);

  // Aplicar configurações do perfil
  const applyProfileSettings = useCallback((profile: UserProfile) => {
    const { settings } = profile;
    
    // Aplicar tema
    const root = document.documentElement;
    if (settings.theme === 'dark') {
      root.classList.add('dark');
    } else if (settings.theme === 'light') {
      root.classList.remove('dark');
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (prefersDark) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    }
    
    // Aplicar outras configurações
    localStorage.setItem('theme', settings.theme);
    localStorage.setItem('language', settings.language);
    localStorage.setItem('currency', settings.currency);
    localStorage.setItem('notificationsEnabled', settings.notifications.toString());
    localStorage.setItem('autoSave', settings.autoSave.toString());
    
    // Aplicar dados do perfil
    localStorage.setItem('simulacoes', JSON.stringify(profile.data.simulacoes));
    localStorage.setItem('portfolios', JSON.stringify(profile.data.portfolios));
  }, []);

  // Criar novo perfil
  const createProfile = useCallback((name: string, avatar?: string) => {
    const newProfile = createDefaultProfile(name);
    if (avatar) {
      newProfile.avatar = avatar;
    }
    
    const updatedProfiles = [...state.profiles, newProfile];
    
    setState(prev => ({
      ...prev,
      profiles: updatedProfiles,
    }));
    
    localStorage.setItem(PROFILES_STORAGE_KEY, JSON.stringify(updatedProfiles));
    
    return newProfile;
  }, [state.profiles]);

  // Alternar para um perfil
  const switchProfile = useCallback((profileId: string) => {
    const profile = state.profiles.find(p => p.id === profileId);
    if (!profile) return false;
    
    // Salvar dados do perfil atual antes de trocar
    if (state.currentProfile) {
      saveCurrentProfileData();
    }
    
    // Atualizar último acesso
    const updatedProfile = {
      ...profile,
      lastAccessed: new Date().toISOString(),
    };
    
    const updatedProfiles = state.profiles.map(p => 
      p.id === profileId ? updatedProfile : p
    );
    
    setState(prev => ({
      ...prev,
      profiles: updatedProfiles,
      currentProfile: updatedProfile,
    }));
    
    localStorage.setItem(PROFILES_STORAGE_KEY, JSON.stringify(updatedProfiles));
    localStorage.setItem(CURRENT_PROFILE_KEY, profileId);
    
    // Aplicar configurações do novo perfil
    applyProfileSettings(updatedProfile);
    
    return true;
  }, [state.profiles, state.currentProfile]);

  // Salvar dados do perfil atual
  const saveCurrentProfileData = useCallback(() => {
    if (!state.currentProfile) return;
    
    try {
      const simulacoes = JSON.parse(localStorage.getItem('simulacoes') || '[]');
      const portfolios = JSON.parse(localStorage.getItem('portfolios') || '[]');
      
      const updatedProfile = {
        ...state.currentProfile,
        data: {
          ...state.currentProfile.data,
          simulacoes,
          portfolios,
        },
        stats: {
          ...state.currentProfile.stats,
          totalSimulacoes: simulacoes.length,
          totalPortfolios: portfolios.length,
          ultimaAtividade: new Date().toISOString(),
        },
      };
      
      const updatedProfiles = state.profiles.map(p => 
        p.id === state.currentProfile!.id ? updatedProfile : p
      );
      
      setState(prev => ({
        ...prev,
        profiles: updatedProfiles,
        currentProfile: updatedProfile,
      }));
      
      localStorage.setItem(PROFILES_STORAGE_KEY, JSON.stringify(updatedProfiles));
    } catch (error) {
      console.error('Erro ao salvar dados do perfil:', error);
    }
  }, [state.currentProfile, state.profiles]);

  // Atualizar perfil
  const updateProfile = useCallback((profileId: string, updates: Partial<UserProfile>) => {
    const updatedProfiles = state.profiles.map(profile => 
      profile.id === profileId 
        ? { ...profile, ...updates }
        : profile
    );
    
    setState(prev => ({
      ...prev,
      profiles: updatedProfiles,
      currentProfile: prev.currentProfile?.id === profileId 
        ? { ...prev.currentProfile, ...updates }
        : prev.currentProfile,
    }));
    
    localStorage.setItem(PROFILES_STORAGE_KEY, JSON.stringify(updatedProfiles));
    
    // Se atualizou o perfil atual, aplicar configurações
    if (state.currentProfile?.id === profileId && updates.settings) {
      applyProfileSettings({ ...state.currentProfile, ...updates } as UserProfile);
    }
  }, [state.profiles, state.currentProfile, applyProfileSettings]);

  // Deletar perfil
  const deleteProfile = useCallback((profileId: string) => {
    if (state.profiles.length <= 1) {
      throw new Error('Não é possível deletar o último perfil');
    }
    
    const updatedProfiles = state.profiles.filter(p => p.id !== profileId);
    
    // Se deletou o perfil atual, trocar para o primeiro disponível
    let newCurrentProfile = state.currentProfile;
    if (state.currentProfile?.id === profileId) {
      newCurrentProfile = updatedProfiles[0];
      localStorage.setItem(CURRENT_PROFILE_KEY, newCurrentProfile.id);
      applyProfileSettings(newCurrentProfile);
    }
    
    setState(prev => ({
      ...prev,
      profiles: updatedProfiles,
      currentProfile: newCurrentProfile,
    }));
    
    localStorage.setItem(PROFILES_STORAGE_KEY, JSON.stringify(updatedProfiles));
  }, [state.profiles, state.currentProfile, applyProfileSettings]);

  // Duplicar perfil
  const duplicateProfile = useCallback((profileId: string, newName: string) => {
    const originalProfile = state.profiles.find(p => p.id === profileId);
    if (!originalProfile) return null;
    
    const duplicatedProfile: UserProfile = {
      ...originalProfile,
      id: `profile_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: newName,
      createdAt: new Date().toISOString(),
      lastAccessed: new Date().toISOString(),
    };
    
    const updatedProfiles = [...state.profiles, duplicatedProfile];
    
    setState(prev => ({
      ...prev,
      profiles: updatedProfiles,
    }));
    
    localStorage.setItem(PROFILES_STORAGE_KEY, JSON.stringify(updatedProfiles));
    
    return duplicatedProfile;
  }, [state.profiles]);

  // Exportar perfil
  const exportProfile = useCallback((profileId: string) => {
    const profile = state.profiles.find(p => p.id === profileId);
    if (!profile) return;
    
    const exportData = {
      profile,
      exportedAt: new Date().toISOString(),
      version: APP_VERSION,
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { 
      type: 'application/json' 
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `jurus-profile-${profile.name.toLowerCase().replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [state.profiles]);

  // Importar perfil
  const importProfile = useCallback((file: File): Promise<UserProfile> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target?.result as string);
          
          if (!data.profile || !data.profile.name) {
            throw new Error('Arquivo de perfil inválido');
          }
          
          // Gerar novo ID para evitar conflitos
          const importedProfile: UserProfile = {
            ...data.profile,
            id: `profile_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            createdAt: new Date().toISOString(),
            lastAccessed: new Date().toISOString(),
          };
          
          const updatedProfiles = [...state.profiles, importedProfile];
          
          setState(prev => ({
            ...prev,
            profiles: updatedProfiles,
          }));
          
          localStorage.setItem(PROFILES_STORAGE_KEY, JSON.stringify(updatedProfiles));
          
          resolve(importedProfile);
        } catch (error) {
          reject(new Error('Erro ao importar perfil: ' + (error as Error).message));
        }
      };
      reader.readAsText(file);
    });
  }, [state.profiles]);

  // Atualizar estatísticas de uso
  const updateUsageStats = useCallback((timeSpent: number) => {
    if (!state.currentProfile) return;
    
    const updatedProfile = {
      ...state.currentProfile,
      stats: {
        ...state.currentProfile.stats,
        tempoUso: state.currentProfile.stats.tempoUso + timeSpent,
        ultimaAtividade: new Date().toISOString(),
      },
    };
    
    updateProfile(state.currentProfile.id, updatedProfile);
  }, [state.currentProfile, updateProfile]);

  // Inicializar
  useEffect(() => {
    loadProfiles();
  }, [loadProfiles]);

  // Auto-save periódico
  useEffect(() => {
    const interval = setInterval(() => {
      if (state.currentProfile) {
        saveCurrentProfileData();
      }
    }, 30000); // Salvar a cada 30 segundos

    return () => clearInterval(interval);
  }, [state.currentProfile, saveCurrentProfileData]);

  // Salvar ao sair da página
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (state.currentProfile) {
        saveCurrentProfileData();
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [state.currentProfile, saveCurrentProfileData]);

  return {
    ...state,
    createProfile,
    switchProfile,
    updateProfile,
    deleteProfile,
    duplicateProfile,
    exportProfile,
    importProfile,
    saveCurrentProfileData,
    updateUsageStats,
    loadProfiles,
  };
};