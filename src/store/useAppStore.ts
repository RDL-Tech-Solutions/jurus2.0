import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { SimulacaoInput, SimulacaoResultado } from '../types';
import { MetaFinanceira, NotificacaoMeta, ProgressoMeta } from '../types/metas';
import { SimulacaoIR, ComparacaoIR } from '../types/impostoRenda';
import { SimulacaoFavorita, ComparacaoSimulacoes, Tag, FiltrosFavoritos } from '../types/favoritos';

interface AppState {
  // Estado da simulação principal
  simulacao: SimulacaoInput;
  resultado: SimulacaoResultado | null;
  isLoading: boolean;
  
  // Estado da interface
  activeTab: string;
  sidebarOpen: boolean;
  theme: 'light' | 'dark';
  
  // Dados compartilhados
  historico: Array<{
    id: string;
    data: Date;
    simulacao: SimulacaoInput;
    resultado: SimulacaoResultado;
  }>;
  
  // Sistema de Metas Financeiras
  metas: MetaFinanceira[];
  notificacoesMetas: NotificacaoMeta[];
  
  // Sistema de Imposto de Renda
  simulacoesIR: SimulacaoIR[];
  comparacoesIR: ComparacaoIR[];
  
  // Sistema de Favoritos e Comparações
  simulacoesFavoritas: SimulacaoFavorita[];
  comparacoesSimulacoes: ComparacaoSimulacoes[];
  tags: Tag[];
  filtrosFavoritos: FiltrosFavoritos;
  
  // Configurações do usuário
  configuracoes: {
    autoSave: boolean;
    notificacoes: boolean;
    atualizacaoAutomatica: boolean;
    formatoMoeda: 'BRL' | 'USD';
    precisaoDecimal: number;
    tema: 'light' | 'dark';
  };
  
  // Actions
  setSimulacao: (simulacao: SimulacaoInput) => void;
  setResultado: (resultado: SimulacaoResultado | null) => void;
  setLoading: (loading: boolean) => void;
  setActiveTab: (tab: string) => void;
  setSidebarOpen: (open: boolean) => void;
  setTheme: (theme: 'light' | 'dark') => void;
  adicionarHistorico: (simulacao: SimulacaoInput, resultado: SimulacaoResultado) => void;
  removerHistorico: (id: string) => void;
  limparHistorico: () => void;
  updateConfiguracoes: (configuracoes: Partial<AppState['configuracoes']>) => void;
  resetApp: () => void;
  
  // Actions para Metas
  adicionarMeta: (meta: Omit<MetaFinanceira, 'id'>) => void;
  atualizarMeta: (id: string, meta: Partial<MetaFinanceira>) => void;
  removerMeta: (id: string) => void;
  adicionarContribuicaoMeta: (metaId: string, valor: number, descricao?: string) => void;
  calcularProgressoMeta: (metaId: string) => ProgressoMeta | null;
  adicionarNotificacaoMeta: (notificacao: Omit<NotificacaoMeta, 'id'>) => void;
  marcarNotificacaoLida: (id: string) => void;
  limparNotificacoesMetas: () => void;
  
  // Actions para IR
  adicionarSimulacaoIR: (simulacao: Omit<SimulacaoIR, 'id' | 'dataCriacao'>) => void;
  atualizarSimulacaoIR: (id: string, simulacao: Partial<SimulacaoIR>) => void;
  removerSimulacaoIR: (id: string) => void;
  adicionarComparacaoIR: (comparacao: Omit<ComparacaoIR, 'id' | 'dataCriacao'>) => void;
  removerComparacaoIR: (id: string) => void;
  limparSimulacoesIR: () => void;
  
  // Actions para Favoritos
  adicionarSimulacaoFavorita: (simulacao: Omit<SimulacaoFavorita, 'id' | 'dataCriacao' | 'dataUltimaAtualizacao'>) => void;
  atualizarSimulacaoFavorita: (id: string, simulacao: Partial<SimulacaoFavorita>) => void;
  removerSimulacaoFavorita: (id: string) => void;
  toggleFavorita: (id: string) => void;
  duplicarSimulacaoFavorita: (id: string, novoNome?: string) => void;
  adicionarComparacaoSimulacoes: (comparacao: Omit<ComparacaoSimulacoes, 'id' | 'dataCriacao' | 'dataUltimaAtualizacao'>) => void;
  atualizarComparacaoSimulacoes: (id: string, comparacao: Partial<ComparacaoSimulacoes>) => void;
  removerComparacaoSimulacoes: (id: string) => void;
  adicionarTag: (tag: Omit<Tag, 'id'>) => void;
  atualizarTag: (id: string, tag: Partial<Tag>) => void;
  removerTag: (id: string) => void;
  setFiltrosFavoritos: (filtros: Partial<FiltrosFavoritos>) => void;
  limparFavoritos: () => void;
}

const initialSimulacao: SimulacaoInput = {
  valorInicial: 1000,
  valorMensal: 500,
  periodo: 12,
  unidadePeriodo: 'meses',
  taxaType: 'cdi',
  percentualCdi: 100,
  taxaPersonalizada: 10,
  modalidade: undefined,
  bancoDigitalId: '',
  modalidadeBancoId: ''
};

const initialConfiguracoes = {
  autoSave: true,
  notificacoes: true,
  atualizacaoAutomatica: false,
  formatoMoeda: 'BRL' as const,
  precisaoDecimal: 2,
  tema: 'light' as const
};

const initialFiltrosFavoritos: FiltrosFavoritos = {
  busca: '',
  tags: [],
  categoria: [],
  periodo: {},
  ordenarPor: 'data',
  ordemCrescente: false,
  apenasComResultado: false,
  apenasFavoritas: false
};

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Estado inicial
      simulacao: initialSimulacao,
      resultado: null,
      isLoading: false,
      activeTab: 'simulacao',
      sidebarOpen: false,
      theme: 'light',
      historico: [],
      metas: [],
      notificacoesMetas: [],
      simulacoesIR: [],
      comparacoesIR: [],
      simulacoesFavoritas: [],
      comparacoesSimulacoes: [],
      tags: [],
      filtrosFavoritos: initialFiltrosFavoritos,
      configuracoes: initialConfiguracoes,
      
      // Actions
      setSimulacao: (simulacao) => {
        set({ simulacao });
        
        // Auto-save se habilitado
        const { configuracoes } = get();
        if (configuracoes.autoSave) {
          // Implementar auto-save aqui se necessário
        }
      },
      
      setResultado: (resultado) => set({ resultado }),
      
      setLoading: (isLoading) => set({ isLoading }),
      
      setActiveTab: (activeTab) => set({ activeTab }),
      
      setSidebarOpen: (sidebarOpen) => set({ sidebarOpen }),
      
      setTheme: (theme) => {
        set({ theme });
        // Aplicar tema ao documento
        if (typeof document !== 'undefined') {
          if (theme === 'dark') {
            document.documentElement.classList.add('dark');
          } else {
            document.documentElement.classList.remove('dark');
          }
        }
      },
      
      adicionarHistorico: (simulacao, resultado) => {
        const novoItem = {
          id: Date.now().toString(),
          data: new Date(),
          simulacao: { ...simulacao },
          resultado: { ...resultado }
        };
        
        set((state) => ({
          historico: [novoItem, ...state.historico].slice(0, 50) // Manter apenas os últimos 50
        }));
      },
      
      removerHistorico: (id) => {
        set((state) => ({
          historico: state.historico.filter(item => item.id !== id)
        }));
      },
      
      limparHistorico: () => set({ historico: [] }),
      
      updateConfiguracoes: (novasConfiguracoes) => {
        set((state) => ({
          configuracoes: { ...state.configuracoes, ...novasConfiguracoes }
        }));
      },
      
      resetApp: () => {
        set({
          simulacao: initialSimulacao,
          resultado: null,
          isLoading: false,
          activeTab: 'calculadora',
          historico: [],
          metas: [],
          notificacoesMetas: [],
          simulacoesIR: [],
          comparacoesIR: [],
          simulacoesFavoritas: [],
          comparacoesSimulacoes: [],
          tags: [],
          filtrosFavoritos: initialFiltrosFavoritos,
          configuracoes: initialConfiguracoes
        });
      },
      
      // Implementação das actions para metas
      adicionarMeta: (meta) => {
        const novaMeta: MetaFinanceira = {
          ...meta,
          id: Date.now().toString(),
          valorAtual: meta.valorAtual || 0,
          historico: meta.historico || []
        };
        
        set((state) => ({
          metas: [...state.metas, novaMeta]
        }));
      },
      
      atualizarMeta: (id, metaAtualizada) => {
        set((state) => ({
          metas: state.metas.map(meta => 
            meta.id === id ? { ...meta, ...metaAtualizada } : meta
          )
        }));
      },
      
      removerMeta: (id) => {
        set((state) => ({
          metas: state.metas.filter(meta => meta.id !== id),
          notificacoesMetas: state.notificacoesMetas.filter(notif => notif.metaId !== id)
        }));
      },
      
      adicionarContribuicaoMeta: (metaId, valor, descricao) => {
        set((state) => {
          const metaIndex = state.metas.findIndex(meta => meta.id === metaId);
          if (metaIndex === -1) return state;
          
          const meta = state.metas[metaIndex];
          const novoHistorico = {
            data: new Date(),
            valor,
            tipo: 'deposito' as const,
            descricao
          };
          
          const metaAtualizada = {
            ...meta,
            valorAtual: meta.valorAtual + valor,
            historico: [...meta.historico, novoHistorico]
          };
          
          const novasMetas = [...state.metas];
          novasMetas[metaIndex] = metaAtualizada;
          
          return { metas: novasMetas };
        });
      },
      
      calcularProgressoMeta: (metaId) => {
        const { metas } = get();
        const meta = metas.find(m => m.id === metaId);
        
        if (!meta) return null;
        
        const percentualConcluido = Math.min((meta.valorAtual / meta.valorObjetivo) * 100, 100);
        const valorRestante = Math.max(meta.valorObjetivo - meta.valorAtual, 0);
        
        const hoje = new Date();
        const dataObjetivo = new Date(meta.dataObjetivo);
        const diasRestantes = Math.max(Math.ceil((dataObjetivo.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24)), 0);
        
        const valorNecessarioMensal = diasRestantes > 0 ? (valorRestante / (diasRestantes / 30)) : 0;
        
        // Calcular projeção baseada na contribuição mensal atual
        let projecaoDataConclusao = dataObjetivo;
        if (meta.contribuicaoMensal && meta.contribuicaoMensal > 0 && valorRestante > 0) {
          const mesesNecessarios = valorRestante / meta.contribuicaoMensal;
          projecaoDataConclusao = new Date(hoje.getTime() + (mesesNecessarios * 30 * 24 * 60 * 60 * 1000));
        }
        
        const statusPrazo: 'no-prazo' | 'atrasado' | 'adiantado' = 
          projecaoDataConclusao <= dataObjetivo ? 'no-prazo' :
          projecaoDataConclusao > dataObjetivo ? 'atrasado' : 'adiantado';
        
        const marcos = [25, 50, 75, 90].map(percentual => ({
          percentual,
          atingido: percentualConcluido >= percentual,
          data: percentualConcluido >= percentual ? new Date() : undefined
        }));
        
        return {
          percentualConcluido,
          valorRestante,
          diasRestantes,
          valorNecessarioMensal,
          projecaoDataConclusao,
          statusPrazo,
          marcos
        };
      },
      
      adicionarNotificacaoMeta: (notificacao) => {
        const novaNotificacao: NotificacaoMeta = {
          ...notificacao,
          id: Date.now().toString(),
          data: new Date(),
          lida: false
        };
        
        set((state) => ({
          notificacoesMetas: [novaNotificacao, ...state.notificacoesMetas].slice(0, 100)
        }));
      },
      
      marcarNotificacaoLida: (id) => {
        set((state) => ({
          notificacoesMetas: state.notificacoesMetas.map(notif =>
            notif.id === id ? { ...notif, lida: true } : notif
          )
        }));
      },
      
      limparNotificacoesMetas: () => {
        set({ notificacoesMetas: [] });
      },
      
      // Implementação das actions para IR
      adicionarSimulacaoIR: (simulacao) => {
        const novaSimulacao: SimulacaoIR = {
          ...simulacao,
          id: Date.now().toString(),
          dataCriacao: new Date().toISOString()
        };
        
        set((state) => ({
          simulacoesIR: [...state.simulacoesIR, novaSimulacao]
        }));
      },
      
      atualizarSimulacaoIR: (id, simulacaoAtualizada) => {
        set((state) => ({
          simulacoesIR: state.simulacoesIR.map(sim => 
            sim.id === id ? { ...sim, ...simulacaoAtualizada } : sim
          )
        }));
      },
      
      removerSimulacaoIR: (id) => {
        set((state) => ({
          simulacoesIR: state.simulacoesIR.filter(sim => sim.id !== id)
        }));
      },
      
      adicionarComparacaoIR: (comparacao) => {
        const novaComparacao: ComparacaoIR = {
          ...comparacao,
          id: Date.now().toString(),
          dataCriacao: new Date().toISOString()
        };
        
        set((state) => ({
          comparacoesIR: [...state.comparacoesIR, novaComparacao]
        }));
      },
      
      removerComparacaoIR: (id) => {
        set((state) => ({
          comparacoesIR: state.comparacoesIR.filter(comp => comp.id !== id)
        }));
      },
      
      limparSimulacoesIR: () => {
        set({ simulacoesIR: [], comparacoesIR: [] });
      },
      
      // Implementação das actions para Favoritos
      adicionarSimulacaoFavorita: (simulacao) => {
        const novaSimulacao: SimulacaoFavorita = {
          ...simulacao,
          id: Date.now().toString(),
          dataCriacao: new Date(),
          dataUltimaAtualizacao: new Date()
        };
        
        set((state) => ({
          simulacoesFavoritas: [...state.simulacoesFavoritas, novaSimulacao]
        }));
      },
      
      atualizarSimulacaoFavorita: (id, simulacaoAtualizada) => {
        set((state) => ({
          simulacoesFavoritas: state.simulacoesFavoritas.map(sim => 
            sim.id === id ? { ...sim, ...simulacaoAtualizada, dataUltimaAtualizacao: new Date() } : sim
          )
        }));
      },
      
      removerSimulacaoFavorita: (id) => {
        set((state) => ({
          simulacoesFavoritas: state.simulacoesFavoritas.filter(sim => sim.id !== id)
        }));
      },
      
      toggleFavorita: (id) => {
        set((state) => ({
          simulacoesFavoritas: state.simulacoesFavoritas.map(sim => 
            sim.id === id ? { ...sim, isFavorita: !sim.isFavorita, dataUltimaAtualizacao: new Date() } : sim
          )
        }));
      },
      
      duplicarSimulacaoFavorita: (id, novoNome) => {
        set((state) => {
          const simulacaoOriginal = state.simulacoesFavoritas.find(sim => sim.id === id);
          if (!simulacaoOriginal) return state;
          
          const simulacaoDuplicada: SimulacaoFavorita = {
            ...simulacaoOriginal,
            id: Date.now().toString(),
            nome: novoNome || `${simulacaoOriginal.nome} (Cópia)`,
            dataCriacao: new Date(),
            dataUltimaAtualizacao: new Date(),
            estatisticas: {
              visualizacoes: 0,
              copias: 0,
              compartilhamentos: 0
            }
          };
          
          // Incrementar contador de cópias da simulação original
          const simulacoesAtualizadas = state.simulacoesFavoritas.map(sim => 
            sim.id === id && sim.estatisticas ? 
              { ...sim, estatisticas: { ...sim.estatisticas, copias: sim.estatisticas.copias + 1 } } : 
              sim
          );
          
          return {
            simulacoesFavoritas: [...simulacoesAtualizadas, simulacaoDuplicada]
          };
        });
      },
      
      adicionarComparacaoSimulacoes: (comparacao) => {
        const novaComparacao: ComparacaoSimulacoes = {
          ...comparacao,
          id: Date.now().toString(),
          dataCriacao: new Date(),
          dataUltimaAtualizacao: new Date()
        };
        
        set((state) => ({
          comparacoesSimulacoes: [...state.comparacoesSimulacoes, novaComparacao]
        }));
      },
      
      atualizarComparacaoSimulacoes: (id, comparacaoAtualizada) => {
        set((state) => ({
          comparacoesSimulacoes: state.comparacoesSimulacoes.map(comp => 
            comp.id === id ? { ...comp, ...comparacaoAtualizada, dataUltimaAtualizacao: new Date() } : comp
          )
        }));
      },
      
      removerComparacaoSimulacoes: (id) => {
        set((state) => ({
          comparacoesSimulacoes: state.comparacoesSimulacoes.filter(comp => comp.id !== id)
        }));
      },
      
      adicionarTag: (tag) => {
        const novaTag: Tag = {
          ...tag,
          id: Date.now().toString()
        };
        
        set((state) => ({
          tags: [...state.tags, novaTag]
        }));
      },
      
      atualizarTag: (id, tagAtualizada) => {
        set((state) => ({
          tags: state.tags.map(tag => 
            tag.id === id ? { ...tag, ...tagAtualizada } : tag
          )
        }));
      },
      
      removerTag: (id) => {
        set((state) => ({
          tags: state.tags.filter(tag => tag.id !== id),
          // Remover a tag de todas as simulações favoritas
          simulacoesFavoritas: state.simulacoesFavoritas.map(sim => ({
            ...sim,
            tags: sim.tags.filter(tagId => tagId !== id),
            dataUltimaAtualizacao: new Date()
          })),
          // Remover a tag de todas as comparações
          comparacoesSimulacoes: state.comparacoesSimulacoes.map(comp => ({
            ...comp,
            tags: comp.tags.filter(tagId => tagId !== id),
            dataUltimaAtualizacao: new Date()
          }))
        }));
      },
      
      setFiltrosFavoritos: (filtros) => {
        set((state) => ({
          filtrosFavoritos: { ...state.filtrosFavoritos, ...filtros }
        }));
      },
      
      limparFavoritos: () => {
        set({ 
          simulacoesFavoritas: [], 
          comparacoesSimulacoes: [], 
          tags: [],
          filtrosFavoritos: initialFiltrosFavoritos
        });
      }
    }),
    {
      name: 'jurus-app-storage',
      partialize: (state) => ({
        simulacao: state.simulacao,
        theme: state.theme,
        configuracoes: state.configuracoes,
        historico: state.historico.slice(0, 10), // Persistir apenas os últimos 10 do histórico
        metas: state.metas,
        notificacoesMetas: state.notificacoesMetas.slice(0, 50), // Persistir apenas as últimas 50 notificações
        simulacoesIR: state.simulacoesIR.slice(0, 20), // Persistir apenas as últimas 20 simulações de IR
        comparacoesIR: state.comparacoesIR.slice(0, 10), // Persistir apenas as últimas 10 comparações
        simulacoesFavoritas: state.simulacoesFavoritas.slice(0, 100), // Persistir apenas as últimas 100 simulações favoritas
        comparacoesSimulacoes: state.comparacoesSimulacoes.slice(0, 20), // Persistir apenas as últimas 20 comparações
        tags: state.tags,
        filtrosFavoritos: state.filtrosFavoritos
      })
    }
  )
);

// Hooks especializados para diferentes partes do estado
export const useSimulacao = () => {
  const simulacao = useAppStore(state => state.simulacao);
  const setSimulacao = useAppStore(state => state.setSimulacao);
  const resultado = useAppStore(state => state.resultado);
  const setResultado = useAppStore(state => state.setResultado);
  const isLoading = useAppStore(state => state.isLoading);
  const setLoading = useAppStore(state => state.setLoading);
  
  return {
    simulacao,
    setSimulacao,
    resultado,
    setResultado,
    isLoading,
    setLoading
  };
};

export const useUI = () => {
  const activeTab = useAppStore(state => state.activeTab);
  const setActiveTab = useAppStore(state => state.setActiveTab);
  const sidebarOpen = useAppStore(state => state.sidebarOpen);
  const setSidebarOpen = useAppStore(state => state.setSidebarOpen);
  const theme = useAppStore(state => state.theme);
  const setTheme = useAppStore(state => state.setTheme);
  
  return {
    activeTab,
    setActiveTab,
    sidebarOpen,
    setSidebarOpen,
    theme,
    setTheme
  };
};

export const useHistorico = () => {
  const historico = useAppStore(state => state.historico);
  const adicionarHistorico = useAppStore(state => state.adicionarHistorico);
  const removerHistorico = useAppStore(state => state.removerHistorico);
  const limparHistorico = useAppStore(state => state.limparHistorico);
  
  return {
    historico,
    adicionarHistorico,
    removerHistorico,
    limparHistorico
  };
};

export const useConfiguracoes = () => {
  const configuracoes = useAppStore(state => state.configuracoes);
  const updateConfiguracoes = useAppStore(state => state.updateConfiguracoes);
  
  return {
    configuracoes,
    updateConfiguracoes
  };
};

export const useMetas = () => {
  const metas = useAppStore(state => state.metas);
  const notificacoesMetas = useAppStore(state => state.notificacoesMetas);
  const adicionarMeta = useAppStore(state => state.adicionarMeta);
  const atualizarMeta = useAppStore(state => state.atualizarMeta);
  const removerMeta = useAppStore(state => state.removerMeta);
  const adicionarContribuicaoMeta = useAppStore(state => state.adicionarContribuicaoMeta);
  const calcularProgressoMeta = useAppStore(state => state.calcularProgressoMeta);
  const adicionarNotificacaoMeta = useAppStore(state => state.adicionarNotificacaoMeta);
  const marcarNotificacaoLida = useAppStore(state => state.marcarNotificacaoLida);
  const limparNotificacoesMetas = useAppStore(state => state.limparNotificacoesMetas);
  
  return {
    metas,
    notificacoesMetas,
    adicionarMeta,
    atualizarMeta,
    removerMeta,
    adicionarContribuicaoMeta,
    calcularProgressoMeta,
    adicionarNotificacaoMeta,
    marcarNotificacaoLida,
    limparNotificacoesMetas
  };
};

export const useImpostoRenda = () => {
  const simulacoesIR = useAppStore(state => state.simulacoesIR);
  const comparacoesIR = useAppStore(state => state.comparacoesIR);
  const adicionarSimulacaoIR = useAppStore(state => state.adicionarSimulacaoIR);
  const atualizarSimulacaoIR = useAppStore(state => state.atualizarSimulacaoIR);
  const removerSimulacaoIR = useAppStore(state => state.removerSimulacaoIR);
  const adicionarComparacaoIR = useAppStore(state => state.adicionarComparacaoIR);
  const removerComparacaoIR = useAppStore(state => state.removerComparacaoIR);
  const limparSimulacoesIR = useAppStore(state => state.limparSimulacoesIR);
  
  return {
    simulacoesIR,
    comparacoesIR,
    adicionarSimulacaoIR,
    atualizarSimulacaoIR,
    removerSimulacaoIR,
    adicionarComparacaoIR,
    removerComparacaoIR,
    limparSimulacoesIR
  };
};

export const useFavoritos = () => {
  const simulacoesFavoritas = useAppStore(state => state.simulacoesFavoritas);
  const comparacoesSimulacoes = useAppStore(state => state.comparacoesSimulacoes);
  const tags = useAppStore(state => state.tags);
  const filtrosFavoritos = useAppStore(state => state.filtrosFavoritos);
  const adicionarSimulacaoFavorita = useAppStore(state => state.adicionarSimulacaoFavorita);
  const atualizarSimulacaoFavorita = useAppStore(state => state.atualizarSimulacaoFavorita);
  const removerSimulacaoFavorita = useAppStore(state => state.removerSimulacaoFavorita);
  const toggleFavorita = useAppStore(state => state.toggleFavorita);
  const duplicarSimulacaoFavorita = useAppStore(state => state.duplicarSimulacaoFavorita);
  const adicionarComparacaoSimulacoes = useAppStore(state => state.adicionarComparacaoSimulacoes);
  const atualizarComparacaoSimulacoes = useAppStore(state => state.atualizarComparacaoSimulacoes);
  const removerComparacaoSimulacoes = useAppStore(state => state.removerComparacaoSimulacoes);
  const adicionarTag = useAppStore(state => state.adicionarTag);
  const atualizarTag = useAppStore(state => state.atualizarTag);
  const removerTag = useAppStore(state => state.removerTag);
  const setFiltrosFavoritos = useAppStore(state => state.setFiltrosFavoritos);
  const limparFavoritos = useAppStore(state => state.limparFavoritos);
  
  return {
    simulacoesFavoritas,
    comparacoesSimulacoes,
    tags,
    filtrosFavoritos,
    adicionarSimulacaoFavorita,
    atualizarSimulacaoFavorita,
    removerSimulacaoFavorita,
    toggleFavorita,
    duplicarSimulacaoFavorita,
    adicionarComparacaoSimulacoes,
    atualizarComparacaoSimulacoes,
    removerComparacaoSimulacoes,
    adicionarTag,
    atualizarTag,
    removerTag,
    setFiltrosFavoritos,
    limparFavoritos
  };
};