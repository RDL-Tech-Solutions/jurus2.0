import { useState, useEffect, useMemo } from 'react';
import { useLocalStorage } from './useLocalStorage';

export interface PerfilInvestidor {
  idade: number;
  rendaMensal: number;
  objetivos: string[];
  toleranciaRisco: 'conservador' | 'moderado' | 'agressivo';
  prazoInvestimento: number; // em anos
  experiencia: 'iniciante' | 'intermediario' | 'avancado';
  situacaoFinanceira: 'estavel' | 'crescimento' | 'aposentadoria';
}

export interface RecomendacaoInvestimento {
  id: string;
  tipo: 'renda_fixa' | 'renda_variavel' | 'fundos' | 'criptomoedas' | 'imoveis';
  nome: string;
  descricao: string;
  rentabilidadeEsperada: number;
  risco: 'baixo' | 'medio' | 'alto';
  liquidez: 'alta' | 'media' | 'baixa';
  valorMinimo: number;
  percentualSugerido: number;
  motivo: string;
  vantagens: string[];
  desvantagens: string[];
  prazoRecomendado: string;
}

export interface AlertaRebalanceamento {
  id: string;
  tipo: 'desvio_alocacao' | 'oportunidade_mercado' | 'mudanca_perfil';
  titulo: string;
  descricao: string;
  acaoSugerida: string;
  urgencia: 'baixa' | 'media' | 'alta';
  impactoEstimado: number;
  dataDeteccao: Date;
}

export interface OtimizacaoCarteira {
  alocacaoAtual: { [key: string]: number };
  alocacaoSugerida: { [key: string]: number };
  beneficiosEsperados: {
    aumentoRentabilidade: number;
    reducaoRisco: number;
    melhorDiversificacao: boolean;
  };
  acoes: string[];
}

interface UseRecomendacoesIAReturn {
  perfil: PerfilInvestidor | null;
  recomendacoes: RecomendacaoInvestimento[];
  alertas: AlertaRebalanceamento[];
  otimizacao: OtimizacaoCarteira | null;
  isLoading: boolean;
  atualizarPerfil: (novoPerfil: PerfilInvestidor) => void;
  gerarRecomendacoes: () => void;
  verificarRebalanceamento: (carteira: any) => void;
  otimizarCarteira: (carteiraAtual: any) => void;
  marcarAlertaComoLido: (alertaId: string) => void;
}

const investimentosBase: Omit<RecomendacaoInvestimento, 'percentualSugerido' | 'motivo'>[] = [
  {
    id: 'tesouro_selic',
    tipo: 'renda_fixa',
    nome: 'Tesouro Selic',
    descricao: 'Título público indexado à taxa Selic, ideal para reserva de emergência',
    rentabilidadeEsperada: 12.5,
    risco: 'baixo',
    liquidez: 'alta',
    valorMinimo: 30,
    vantagens: ['Liquidez diária', 'Baixo risco', 'Garantia do governo'],
    desvantagens: ['Rentabilidade limitada', 'Tributação regressiva'],
    prazoRecomendado: 'Curto prazo (até 2 anos)'
  },
  {
    id: 'cdb_di',
    tipo: 'renda_fixa',
    nome: 'CDB 100% CDI',
    descricao: 'Certificado de Depósito Bancário com rentabilidade atrelada ao CDI',
    rentabilidadeEsperada: 13.2,
    risco: 'baixo',
    liquidez: 'media',
    valorMinimo: 1000,
    vantagens: ['Garantia do FGC', 'Rentabilidade previsível', 'Diversas opções'],
    desvantagens: ['Tributação IR', 'Liquidez limitada'],
    prazoRecomendado: 'Médio prazo (2-5 anos)'
  },
  {
    id: 'lci_lca',
    tipo: 'renda_fixa',
    nome: 'LCI/LCA',
    descricao: 'Letras de Crédito Imobiliário/Agronegócio isentas de IR',
    rentabilidadeEsperada: 11.8,
    risco: 'baixo',
    liquidez: 'baixa',
    valorMinimo: 5000,
    vantagens: ['Isenção de IR', 'Garantia do FGC', 'Boa rentabilidade'],
    desvantagens: ['Baixa liquidez', 'Valor mínimo alto'],
    prazoRecomendado: 'Médio prazo (2-5 anos)'
  },
  {
    id: 'fundos_di',
    tipo: 'fundos',
    nome: 'Fundos DI',
    descricao: 'Fundos de investimento que aplicam em títulos de renda fixa',
    rentabilidadeEsperada: 12.0,
    risco: 'baixo',
    liquidez: 'alta',
    valorMinimo: 100,
    vantagens: ['Liquidez diária', 'Gestão profissional', 'Diversificação'],
    desvantagens: ['Taxa de administração', 'Come-cotas'],
    prazoRecomendado: 'Curto a médio prazo'
  },
  {
    id: 'acoes_dividendos',
    tipo: 'renda_variavel',
    nome: 'Ações de Dividendos',
    descricao: 'Ações de empresas com histórico consistente de pagamento de dividendos',
    rentabilidadeEsperada: 15.5,
    risco: 'medio',
    liquidez: 'alta',
    valorMinimo: 100,
    vantagens: ['Renda passiva', 'Crescimento do capital', 'Liquidez'],
    desvantagens: ['Volatilidade', 'Risco de mercado', 'Análise complexa'],
    prazoRecomendado: 'Longo prazo (5+ anos)'
  },
  {
    id: 'etf_ibovespa',
    tipo: 'renda_variavel',
    nome: 'ETF Ibovespa',
    descricao: 'Fundo que replica o índice Ibovespa',
    rentabilidadeEsperada: 14.2,
    risco: 'medio',
    liquidez: 'alta',
    valorMinimo: 50,
    vantagens: ['Diversificação automática', 'Baixo custo', 'Liquidez'],
    desvantagens: ['Volatilidade do mercado', 'Sem proteção de baixa'],
    prazoRecomendado: 'Longo prazo (5+ anos)'
  },
  {
    id: 'fiis',
    tipo: 'imoveis',
    nome: 'Fundos Imobiliários',
    descricao: 'Fundos que investem em imóveis e recebíveis imobiliários',
    rentabilidadeEsperada: 13.8,
    risco: 'medio',
    liquidez: 'media',
    valorMinimo: 100,
    vantagens: ['Renda mensal', 'Diversificação', 'Isenção IR dividendos'],
    desvantagens: ['Volatilidade', 'Risco setorial', 'Vacância'],
    prazoRecomendado: 'Médio a longo prazo'
  }
];

export function useRecomendacoesIA(): UseRecomendacoesIAReturn {
  const [perfil, setPerfil] = useLocalStorage<PerfilInvestidor | null>('perfil_investidor', null);
  const [recomendacoes, setRecomendacoes] = useState<RecomendacaoInvestimento[]>([]);
  const [alertas, setAlertas] = useLocalStorage<AlertaRebalanceamento[]>('alertas_rebalanceamento', []);
  const [otimizacao, setOtimizacao] = useState<OtimizacaoCarteira | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const atualizarPerfil = (novoPerfil: PerfilInvestidor) => {
    setPerfil(novoPerfil);
    gerarRecomendacoes();
  };

  const calcularAlocacao = (perfil: PerfilInvestidor): { [key: string]: number } => {
    const { toleranciaRisco, idade, prazoInvestimento } = perfil;
    
    // Regra básica: 100 - idade = % em renda variável
    let percentualRendaVariavel = Math.max(10, Math.min(80, 100 - idade));
    
    // Ajustar baseado na tolerância ao risco
    if (toleranciaRisco === 'conservador') {
      percentualRendaVariavel *= 0.6;
    } else if (toleranciaRisco === 'agressivo') {
      percentualRendaVariavel *= 1.3;
    }
    
    // Ajustar baseado no prazo
    if (prazoInvestimento < 2) {
      percentualRendaVariavel *= 0.5;
    } else if (prazoInvestimento > 10) {
      percentualRendaVariavel *= 1.2;
    }
    
    percentualRendaVariavel = Math.max(5, Math.min(85, percentualRendaVariavel));
    
    return {
      renda_fixa: 100 - percentualRendaVariavel,
      renda_variavel: percentualRendaVariavel * 0.7,
      fundos: percentualRendaVariavel * 0.2,
      imoveis: percentualRendaVariavel * 0.1
    };
  };

  const gerarRecomendacoes = () => {
    if (!perfil) return;
    
    setIsLoading(true);
    
    // Simular processamento IA
    setTimeout(() => {
      const alocacao = calcularAlocacao(perfil);
      const novasRecomendacoes: RecomendacaoInvestimento[] = [];
      
      // Renda Fixa
      if (alocacao.renda_fixa > 0) {
        if (perfil.toleranciaRisco === 'conservador' || perfil.prazoInvestimento < 2) {
          novasRecomendacoes.push({
            ...investimentosBase.find(i => i.id === 'tesouro_selic')!,
            percentualSugerido: alocacao.renda_fixa * 0.4,
            motivo: 'Ideal para reserva de emergência e perfil conservador'
          });
          novasRecomendacoes.push({
            ...investimentosBase.find(i => i.id === 'cdb_di')!,
            percentualSugerido: alocacao.renda_fixa * 0.6,
            motivo: 'Melhor rentabilidade que a poupança com segurança'
          });
        } else {
          novasRecomendacoes.push({
            ...investimentosBase.find(i => i.id === 'lci_lca')!,
            percentualSugerido: alocacao.renda_fixa * 0.7,
            motivo: 'Isenção de IR aumenta rentabilidade líquida'
          });
          novasRecomendacoes.push({
            ...investimentosBase.find(i => i.id === 'fundos_di')!,
            percentualSugerido: alocacao.renda_fixa * 0.3,
            motivo: 'Liquidez para oportunidades de mercado'
          });
        }
      }
      
      // Renda Variável
      if (alocacao.renda_variavel > 0) {
        if (perfil.experiencia === 'iniciante') {
          novasRecomendacoes.push({
            ...investimentosBase.find(i => i.id === 'etf_ibovespa')!,
            percentualSugerido: alocacao.renda_variavel,
            motivo: 'Diversificação automática ideal para iniciantes'
          });
        } else {
          novasRecomendacoes.push({
            ...investimentosBase.find(i => i.id === 'acoes_dividendos')!,
            percentualSugerido: alocacao.renda_variavel * 0.6,
            motivo: 'Renda passiva alinhada com seus objetivos'
          });
          novasRecomendacoes.push({
            ...investimentosBase.find(i => i.id === 'etf_ibovespa')!,
            percentualSugerido: alocacao.renda_variavel * 0.4,
            motivo: 'Exposição ao mercado com baixo custo'
          });
        }
      }
      
      // Fundos Imobiliários
      if (alocacao.imoveis > 0 && perfil.toleranciaRisco !== 'conservador') {
        novasRecomendacoes.push({
          ...investimentosBase.find(i => i.id === 'fiis')!,
          percentualSugerido: alocacao.imoveis,
          motivo: 'Diversificação e renda mensal complementar'
        });
      }
      
      setRecomendacoes(novasRecomendacoes);
      setIsLoading(false);
    }, 1500);
  };

  const verificarRebalanceamento = (carteira: any) => {
    if (!perfil || !carteira) return;
    
    const novosAlertas: AlertaRebalanceamento[] = [];
    const alocacaoIdeal = calcularAlocacao(perfil);
    
    // Verificar desvios significativos (>10%)
    Object.entries(alocacaoIdeal).forEach(([tipo, percentualIdeal]) => {
      const percentualAtual = carteira[tipo] || 0;
      const desvio = Math.abs(percentualAtual - percentualIdeal);
      
      if (desvio > 10) {
        novosAlertas.push({
          id: `desvio_${tipo}_${Date.now()}`,
          tipo: 'desvio_alocacao',
          titulo: `Desvio na alocação de ${tipo.replace('_', ' ')}`,
          descricao: `Sua alocação atual (${percentualAtual.toFixed(1)}%) está ${desvio.toFixed(1)}% distante do ideal (${percentualIdeal.toFixed(1)}%)`,
          acaoSugerida: percentualAtual > percentualIdeal ? 
            `Reduzir exposição em ${tipo.replace('_', ' ')}` : 
            `Aumentar investimento em ${tipo.replace('_', ' ')}`,
          urgencia: desvio > 20 ? 'alta' : 'media',
          impactoEstimado: desvio * 0.1,
          dataDeteccao: new Date()
        });
      }
    });
    
    // Simular detecção de oportunidades
    if (Math.random() > 0.7) {
      novosAlertas.push({
        id: `oportunidade_${Date.now()}`,
        tipo: 'oportunidade_mercado',
        titulo: 'Oportunidade de mercado detectada',
        descricao: 'Ações de dividendos estão com yield atrativo acima de 8%',
        acaoSugerida: 'Considere aumentar posição em ações de dividendos',
        urgencia: 'media',
        impactoEstimado: 2.5,
        dataDeteccao: new Date()
      });
    }
    
    setAlertas(prev => [...prev, ...novosAlertas]);
  };

  const otimizarCarteira = (carteiraAtual: any) => {
    if (!perfil) return;
    
    setIsLoading(true);
    
    setTimeout(() => {
      const alocacaoIdeal = calcularAlocacao(perfil);
      
      const otimizacaoResult: OtimizacaoCarteira = {
        alocacaoAtual: carteiraAtual,
        alocacaoSugerida: alocacaoIdeal,
        beneficiosEsperados: {
          aumentoRentabilidade: 1.8,
          reducaoRisco: 0.5,
          melhorDiversificacao: true
        },
        acoes: [
          'Rebalancear para alocação ideal',
          'Diversificar entre diferentes classes de ativos',
          'Considerar isenção de IR em LCI/LCA',
          'Manter reserva de emergência em alta liquidez'
        ]
      };
      
      setOtimizacao(otimizacaoResult);
      setIsLoading(false);
    }, 1000);
  };

  const marcarAlertaComoLido = (alertaId: string) => {
    setAlertas(prev => prev.filter(alerta => alerta.id !== alertaId));
  };

  // Gerar recomendações automaticamente quando o perfil mudar
  useEffect(() => {
    if (perfil) {
      gerarRecomendacoes();
    }
  }, [perfil]);

  return {
    perfil,
    recomendacoes,
    alertas,
    otimizacao,
    isLoading,
    atualizarPerfil,
    gerarRecomendacoes,
    verificarRebalanceamento,
    otimizarCarteira,
    marcarAlertaComoLido
  };
}