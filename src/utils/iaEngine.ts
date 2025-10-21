// Engine de Inteligência Artificial para Recomendações Financeiras

import {
  Recomendacao,
  AcaoRecomendada,
  PerfilInvestidor,
  ObjetivoFinanceiro,
  CarteiraAtual,
  AlocacaoAtivo,
  EngineRecomendacoes,
  ParametrosEngine,
  ScoreConfianca,
  FatorConfianca
} from '../types/recomendacoes';

// Constantes do engine
const PESOS_PERFIL = {
  conservador: { rendaFixa: 0.7, acoes: 0.2, alternativos: 0.1 },
  moderado: { rendaFixa: 0.5, acoes: 0.4, alternativos: 0.1 },
  arrojado: { rendaFixa: 0.2, acoes: 0.6, alternativos: 0.2 }
};

const FATORES_RISCO = {
  baixo: 0.05,
  medio: 0.15,
  alto: 0.25,
  muito_alto: 0.35
};

// Classe principal do Engine de IA
export class IAEngine {
  private parametros: ParametrosEngine;
  private historico: Recomendacao[] = [];

  constructor(parametros?: Partial<ParametrosEngine>) {
    this.parametros = {
      pesoRisco: 0.25,
      pesoRetorno: 0.2,
      pesoDiversificacao: 0.15,
      pesoLiquidez: 0.15,
      janelaTemporal: 30, // em dias
      limiteConfianca: 0.7, // mínimo para exibir recomendação
      ...parametros
    };
  }

  // Gerar recomendações principais
  public gerarRecomendacoes(
    perfil: PerfilInvestidor,
    carteira: CarteiraAtual,
    objetivos: ObjetivoFinanceiro[]
  ): Recomendacao[] {
    const recomendacoes: Recomendacao[] = [];

    // Análise de diversificação
    const recDiversificacao = this.analisarDiversificacao(carteira, perfil);
    if (recDiversificacao) recomendacoes.push(recDiversificacao);

    // Análise de alocação
    const recAlocacao = this.analisarAlocacao(carteira, perfil);
    if (recAlocacao) recomendacoes.push(recAlocacao);

    // Análise de objetivos
    objetivos.forEach(objetivo => {
      const recObjetivo = this.analisarObjetivo(objetivo, carteira, perfil);
      if (recObjetivo) recomendacoes.push(recObjetivo);
    });

    // Análise de mercado
    const recMercado = this.analisarMercado(carteira, perfil);
    if (recMercado) recomendacoes.push(recMercado);

    // Ordenar por prioridade e confiança
    return recomendacoes
      .sort((a, b) => {
        if (a.prioridade !== b.prioridade) {
          const prioridadeOrder = { alta: 3, media: 2, baixa: 1 };
          return prioridadeOrder[b.prioridade] - prioridadeOrder[a.prioridade];
        }
        return b.confianca - a.confianca;
      })
      .slice(0, 5); // Limite fixo de 5 recomendações
  }

  // Analisar diversificação da carteira
  private analisarDiversificacao(carteira: CarteiraAtual, perfil: PerfilInvestidor): Recomendacao | null {
    const alocacaoAtual = this.calcularAlocacaoAtual(carteira);
    const alocacaoIdeal = this.calcularAlocacaoIdeal(perfil);
    
    const diferencas = this.calcularDiferencasAlocacao(alocacaoAtual, alocacaoIdeal);
    const necessitaDiversificacao = Object.values(diferencas).some(diff => Math.abs(diff) > 0.15);

    if (!necessitaDiversificacao) return null;

    const acoes: AcaoRecomendada[] = [];
    
    Object.entries(diferencas).forEach(([classe, diferenca]) => {
      if (Math.abs(diferenca) > 0.1) {
        const acao = diferenca > 0 ? 'reduzir' : 'aumentar';
        acoes.push({
          id: `acao-${classe}-${Date.now()}`,
          descricao: `${acao === 'aumentar' ? 'Aumentar' : 'Reduzir'} exposição em ${classe} para melhor diversificação`,
          tipo: acao === 'aumentar' ? 'compra' : 'venda',
          prioridade: 'alta',
          valorEstimado: Math.abs(diferenca) * carteira.valorTotal,
          executada: false
        });
      }
    });

    const scoreConfianca = this.calcularConfianca([
      { nome: 'analise_alocacao', peso: 0.4, valor: 0.9, impacto: 'positivo', descricao: 'Análise da alocação atual vs ideal' },
      { nome: 'perfil_risco', peso: 0.3, valor: 0.8, impacto: 'positivo', descricao: 'Compatibilidade com perfil de risco' },
      { nome: 'dados_mercado', peso: 0.3, valor: 0.7, impacto: 'positivo', descricao: 'Condições atuais do mercado' }
    ]);

    return {
      id: `diversificacao-${Date.now()}`,
      tipo: 'rebalanceamento',
      titulo: 'Rebalanceamento de Carteira',
      descricao: 'Sua carteira está desbalanceada. Recomendamos ajustar a alocação para melhor diversificação.',
      confianca: scoreConfianca.valor,
      impactoEstimado: 0.02,
      prazoImplementacao: '1-3 meses',
      prioridade: 'alta',
      categoria: 'gestao_risco',
      acoes: acoes,
      dataGeracao: new Date(),
      status: 'pendente' as const,
      fundamentacao: [
        'Análise de alocação atual vs ideal',
        'Compatibilidade com perfil de risco',
        'Condições atuais do mercado'
      ]
    };
  }

  // Analisar alocação atual vs ideal
  private analisarAlocacao(carteira: CarteiraAtual, perfil: PerfilInvestidor): Recomendacao | null {
    const alocacaoAtual = this.calcularAlocacaoAtual(carteira);
    const tipoRisco = perfil.toleranciaRisco <= 3 ? 'conservador' : 
                     perfil.toleranciaRisco <= 6 ? 'moderado' : 'arrojado';
    const pesoIdeal = PESOS_PERFIL[tipoRisco];
    
    // Verificar se renda fixa está muito baixa para perfil conservador
    if (perfil.toleranciaRisco <= 3 && alocacaoAtual.rendaFixa < 0.6) {
      const scoreConfianca = this.calcularConfianca([
        { nome: 'perfil_risco', peso: 0.5, valor: 0.95, impacto: 'positivo', descricao: 'Compatibilidade com perfil de risco conservador' },
        { nome: 'analise_alocacao', peso: 0.5, valor: 0.9, impacto: 'positivo', descricao: 'Análise da alocação atual' }
      ]);

      return {
        id: `alocacao-conservador-${Date.now()}`,
        tipo: 'investimento',
        titulo: 'Aumentar Renda Fixa',
        descricao: 'Para seu perfil conservador, recomendamos aumentar a alocação em renda fixa.',
        confianca: scoreConfianca.valor,
        impactoEstimado: 0.01,
        prazoImplementacao: '1 mês',
        prioridade: 'media',
        categoria: 'alocacao_ativos',
        acoes: [{
          id: 'acao-1',
          descricao: 'Investimento seguro com proteção contra inflação',
          tipo: 'compra',
          prioridade: 'media',
          valorEstimado: carteira.valorTotal * 0.2,
          executada: false
        }],
        dataGeracao: new Date(),
        status: 'pendente' as const,
        fundamentacao: [
          'Compatibilidade com perfil de risco conservador',
          'Análise da alocação atual'
        ]
      };
    }

    return null;
  }

  // Analisar objetivo específico
  private analisarObjetivo(
    objetivo: ObjetivoFinanceiro,
    carteira: CarteiraAtual,
    perfil: PerfilInvestidor
  ): Recomendacao | null {
    const mesesRestantes = this.calcularMesesRestantes(objetivo.prazo);
    const valorNecessario = objetivo.valorMeta - carteira.valorTotal;
    
    if (valorNecessario <= 0) return null; // Objetivo já atingido

    const aporteNecessario = valorNecessario / mesesRestantes;
    
    const scoreConfianca = this.calcularConfianca([
      { nome: 'calculo_objetivo', peso: 0.4, valor: 0.9, impacto: 'positivo', descricao: 'Precisão do cálculo para atingir objetivo' },
      { nome: 'prazo_objetivo', peso: 0.3, valor: mesesRestantes > 12 ? 0.9 : 0.7, impacto: 'positivo', descricao: 'Adequação do prazo para o objetivo' },
      { nome: 'perfil_risco', peso: 0.3, valor: 0.8, impacto: 'positivo', descricao: 'Compatibilidade com perfil de risco' }
    ]);

    return {
      id: `objetivo-${objetivo.id}-${Date.now()}`,
      tipo: 'otimizacao',
      titulo: `Estratégia para ${objetivo.nome}`,
      descricao: `Para atingir seu objetivo, recomendamos aportes mensais de R$ ${aporteNecessario.toFixed(2)}.`,
      confianca: scoreConfianca.valor,
      impactoEstimado: 0.12,
      prazoImplementacao: `${mesesRestantes} meses`,
      prioridade: objetivo.prioridade === 1 ? 'alta' : objetivo.prioridade <= 3 ? 'media' : 'baixa',
      categoria: 'planejamento',
      acoes: [{
        id: 'acao-1',
        descricao: `Aporte mensal necessário para atingir o objetivo em ${mesesRestantes} meses`,
        tipo: 'configuracao',
        prioridade: 'alta',
        valorEstimado: aporteNecessario,
        executada: false
      }],
      dataGeracao: new Date(),
      status: 'pendente' as const,
      fundamentacao: [
        'Precisão do cálculo para atingir objetivo',
        'Adequação do prazo para o objetivo',
        'Compatibilidade com perfil de risco'
      ]
    };
  }

  // Analisar condições de mercado
  private analisarMercado(carteira: CarteiraAtual, perfil: PerfilInvestidor): Recomendacao | null {
    // Simulação de análise de mercado
    const condicoesMercado = this.obterCondicoesMercado();
    
    if (condicoesMercado.volatilidade > 0.25 && perfil.toleranciaRisco <= 3) {
      const scoreConfianca = this.calcularConfianca([
        { nome: 'analise_mercado', peso: 0.6, valor: 0.8, impacto: 'positivo', descricao: 'Análise das condições de mercado' },
        { nome: 'perfil_risco', peso: 0.4, valor: 0.9, impacto: 'positivo', descricao: 'Compatibilidade com perfil de risco' }
      ]);

      return {
        id: `mercado-volatil-${Date.now()}`,
        tipo: 'risco',
        titulo: 'Mercado Volátil - Cautela Recomendada',
        descricao: 'O mercado está apresentando alta volatilidade. Recomendamos cautela com novos investimentos.',
        confianca: scoreConfianca.valor,
        impactoEstimado: -0.05,
        prazoImplementacao: '2 semanas',
        prioridade: 'media',
        categoria: 'gestao_risco',
        acoes: [{
          id: 'acao-1',
          descricao: 'Aguardar estabilização do mercado antes de novos aportes',
          tipo: 'configuracao',
          prioridade: 'media',
          executada: false
        }],
        dataGeracao: new Date(),
        status: 'pendente' as const,
        fundamentacao: [
          'Análise das condições de mercado',
          'Compatibilidade com perfil de risco'
        ]
      };
    }

    return null;
  }

  // Funções auxiliares
  private calcularAlocacaoAtual(carteira: CarteiraAtual): Record<string, number> {
    const total = carteira.valorTotal;
    const alocacao: Record<string, number> = {
      rendaFixa: 0,
      acoes: 0,
      fundos: 0,
      alternativos: 0
    };

    carteira.alocacoes.forEach(ativo => {
      const peso = ativo.valor / total;
      if (ativo.tipo === 'renda_fixa') {
        alocacao.rendaFixa += peso;
      } else if (ativo.tipo === 'acao') {
        alocacao.acoes += peso;
      } else if (ativo.tipo === 'fii') {
        alocacao.fundos += peso;
      } else {
        alocacao.alternativos += peso;
      }
    });

    return alocacao;
  }

  private calcularAlocacaoIdeal(perfil: PerfilInvestidor): Record<string, number> {
    // Map toleranciaRisco (1-10) to profile types
    if (perfil.toleranciaRisco <= 3) {
      return PESOS_PERFIL.conservador;
    } else if (perfil.toleranciaRisco <= 7) {
      return PESOS_PERFIL.moderado;
    } else {
      return PESOS_PERFIL.arrojado;
    }
  }

  private calcularDiferencasAlocacao(atual: Record<string, number>, ideal: Record<string, number>): Record<string, number> {
    const diferencas: Record<string, number> = {};
    
    Object.keys(ideal).forEach(classe => {
      diferencas[classe] = (atual[classe] || 0) - ideal[classe];
    });

    return diferencas;
  }

  private calcularConfianca(fatores: FatorConfianca[]): ScoreConfianca {
    const scoreTotal = fatores.reduce((acc, fator) => acc + (fator.peso * fator.valor), 0);
    const valorFinal = Math.min(scoreTotal * 100, 100); // Convert to 0-100 scale
    
    return {
      valor: valorFinal,
      fatores,
      explicacao: `Score calculado baseado em ${fatores.length} fatores de análise`,
      nivelCerteza: valorFinal > 80 ? 'alto' : valorFinal > 60 ? 'medio' : 'baixo'
    };
  }

  private calcularMesesRestantes(prazo: Date): number {
    const dataAlvo = prazo;
    const agora = new Date();
    const diffTime = dataAlvo.getTime() - agora.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 30));
  }

  private recomendarAtivoParaObjetivo(objetivo: ObjetivoFinanceiro, perfil: PerfilInvestidor): string {
    const meses = this.calcularMesesRestantes(objetivo.prazo);
    
    if (meses < 12) return 'Tesouro Selic';
    if (meses < 36) return 'CDB';
    if (perfil.toleranciaRisco <= 3) return 'Tesouro IPCA+';
    if (perfil.toleranciaRisco <= 7) return 'Fundo Multimercado';
    return 'Fundo de Ações';
  }

  private obterCondicoesMercado() {
    // Simulação de dados de mercado
    return {
      volatilidade: 0.15 + Math.random() * 0.2,
      tendencia: Math.random() > 0.5 ? 'alta' : 'baixa',
      liquidez: 0.8 + Math.random() * 0.2
    };
  }

  // Métodos públicos para controle do engine
  public atualizarParametros(novosParametros: Partial<ParametrosEngine>): void {
    this.parametros = { ...this.parametros, ...novosParametros };
  }

  public obterHistorico(): Recomendacao[] {
    return [...this.historico];
  }

  public adicionarAoHistorico(recomendacao: Recomendacao): void {
    this.historico.push(recomendacao);
    
    // Manter apenas últimas 100 recomendações
    if (this.historico.length > 100) {
      this.historico = this.historico.slice(-100);
    }
  }

  public avaliarEfetividade(recomendacaoId: string, resultado: 'positivo' | 'neutro' | 'negativo'): void {
    // Implementar sistema de aprendizado baseado em feedback
    const recomendacao = this.historico.find(r => r.id === recomendacaoId);
    if (recomendacao) {
      // Ajustar pesos do modelo baseado no resultado
      this.ajustarPesos(recomendacao, resultado);
    }
  }

  private ajustarPesos(recomendacao: Recomendacao, resultado: 'positivo' | 'neutro' | 'negativo'): void {
    // Implementar lógica de ajuste de pesos baseado no feedback
    const fatorAjuste = resultado === 'positivo' ? 1.05 : resultado === 'negativo' ? 0.95 : 1;
    
    // Ajustar pesos dos parâmetros baseado no resultado
    if (resultado === 'positivo') {
      this.parametros.pesoRisco *= fatorAjuste;
      this.parametros.pesoRetorno *= fatorAjuste;
    } else if (resultado === 'negativo') {
      this.parametros.pesoRisco *= fatorAjuste;
      this.parametros.pesoRetorno *= fatorAjuste;
    }

    // Normalizar pesos para manter a soma consistente
    const somaPesos = this.parametros.pesoRisco + this.parametros.pesoRetorno + 
                     this.parametros.pesoDiversificacao + this.parametros.pesoLiquidez;
    
    this.parametros.pesoRisco /= somaPesos;
    this.parametros.pesoRetorno /= somaPesos;
    this.parametros.pesoDiversificacao /= somaPesos;
    this.parametros.pesoLiquidez /= somaPesos;
  }
}

// Instância singleton do engine
export const engineIA = new IAEngine();

// Funções utilitárias exportadas
export const gerarRecomendacoesIA = (
  perfil: PerfilInvestidor,
  carteira: CarteiraAtual,
  objetivos: ObjetivoFinanceiro[]
): Recomendacao[] => {
  return engineIA.gerarRecomendacoes(perfil, carteira, objetivos);
};

export const avaliarRecomendacao = (recomendacaoId: string, resultado: 'positivo' | 'neutro' | 'negativo'): void => {
  engineIA.avaliarEfetividade(recomendacaoId, resultado);
};

export const obterHistoricoRecomendacoes = (): Recomendacao[] => {
  return engineIA.obterHistorico();
};