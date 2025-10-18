/**
 * History management utilities
 */

export interface HistoricoItem {
  id: string;
  tipo: 'calculo' | 'simulacao' | 'meta' | 'favorito';
  titulo: string;
  descricao?: string;
  dados: any;
  dataCreacao: Date;
  dataAtualizacao?: Date;
}

export interface FiltroHistorico {
  tipo?: HistoricoItem['tipo'];
  dataInicio?: Date;
  dataFim?: Date;
  termo?: string;
}

class HistoricoManager {
  private storageKey = 'jurus_historico';
  
  private getHistorico(): HistoricoItem[] {
    try {
      const stored = localStorage.getItem(this.storageKey);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }
  
  private saveHistorico(historico: HistoricoItem[]): void {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(historico));
    } catch (error) {
      console.error('Erro ao salvar histórico:', error);
    }
  }
  
  adicionarItem(item: Omit<HistoricoItem, 'id' | 'dataCreacao'>): string {
    const novoItem: HistoricoItem = {
      ...item,
      id: crypto.randomUUID(),
      dataCreacao: new Date()
    };
    
    const historico = this.getHistorico();
    historico.unshift(novoItem); // Add to beginning
    
    // Keep only last 100 items
    if (historico.length > 100) {
      historico.splice(100);
    }
    
    this.saveHistorico(historico);
    return novoItem.id;
  }
  
  obterHistorico(filtro?: FiltroHistorico): HistoricoItem[] {
    let historico = this.getHistorico();
    
    if (!filtro) return historico;
    
    if (filtro.tipo) {
      historico = historico.filter(item => item.tipo === filtro.tipo);
    }
    
    if (filtro.dataInicio) {
      historico = historico.filter(item => 
        new Date(item.dataCreacao) >= filtro.dataInicio!
      );
    }
    
    if (filtro.dataFim) {
      historico = historico.filter(item => 
        new Date(item.dataCreacao) <= filtro.dataFim!
      );
    }
    
    if (filtro.termo) {
      const termo = filtro.termo.toLowerCase();
      historico = historico.filter(item => 
        item.titulo.toLowerCase().includes(termo) ||
        (item.descricao && item.descricao.toLowerCase().includes(termo))
      );
    }
    
    return historico;
  }
  
  obterItem(id: string): HistoricoItem | null {
    const historico = this.getHistorico();
    return historico.find(item => item.id === id) || null;
  }
  
  atualizarItem(id: string, dados: Partial<Omit<HistoricoItem, 'id' | 'dataCreacao'>>): boolean {
    const historico = this.getHistorico();
    const index = historico.findIndex(item => item.id === id);
    
    if (index === -1) return false;
    
    historico[index] = {
      ...historico[index],
      ...dados,
      dataAtualizacao: new Date()
    };
    
    this.saveHistorico(historico);
    return true;
  }
  
  removerItem(id: string): boolean {
    const historico = this.getHistorico();
    const index = historico.findIndex(item => item.id === id);
    
    if (index === -1) return false;
    
    historico.splice(index, 1);
    this.saveHistorico(historico);
    return true;
  }
  
  limparHistorico(): void {
    this.saveHistorico([]);
  }
  
  exportarHistorico(): string {
    const historico = this.getHistorico();
    return JSON.stringify(historico, null, 2);
  }
  
  importarHistorico(dados: string): boolean {
    try {
      const historico = JSON.parse(dados);
      if (Array.isArray(historico)) {
        this.saveHistorico(historico);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }
}

export const historicoManager = new HistoricoManager();

// Convenience functions
export const adicionarAoHistorico = (item: Omit<HistoricoItem, 'id' | 'dataCreacao'>) => 
  historicoManager.adicionarItem(item);

export const obterHistorico = (filtro?: FiltroHistorico) => 
  historicoManager.obterHistorico(filtro);

export const obterItemHistorico = (id: string) => 
  historicoManager.obterItem(id);

export const removerDoHistorico = (id: string) => 
  historicoManager.removerItem(id);

export const limparHistorico = () => 
  historicoManager.limparHistorico();