import { SimulacaoFavorita, ComparacaoSimulacoes, Tag, FiltrosFavoritos, EstatisticasFavoritos } from '../types/favoritos';
import { Simulacao, ResultadoSimulacao } from '../types/simulacao';

// Cores predefinidas para tags
export const CORES_TAGS = [
  '#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6',
  '#EC4899', '#06B6D4', '#84CC16', '#F97316', '#6366F1'
];

// Categorias predefinidas
export const CATEGORIAS_SIMULACAO = [
  { id: 'pessoal', nome: 'Pessoal', cor: '#3B82F6' },
  { id: 'profissional', nome: 'Profissional', cor: '#10B981' },
  { id: 'investimento', nome: 'Investimento', cor: '#F59E0B' },
  { id: 'aposentadoria', nome: 'Aposentadoria', cor: '#8B5CF6' },
  { id: 'meta', nome: 'Meta', cor: '#EC4899' },
  { id: 'outro', nome: 'Outro', cor: '#6B7280' }
];

// Gerar ID único
export const gerarId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// Criar simulação favorita
export const criarSimulacaoFavorita = (
  nome: string,
  simulacao: Simulacao,
  resultado?: ResultadoSimulacao,
  opcoes?: Partial<SimulacaoFavorita>
): SimulacaoFavorita => {
  return {
    id: gerarId(),
    nome,
    simulacao,
    resultado,
    tags: [],
    dataCriacao: new Date(),
    dataUltimaAtualizacao: new Date(),
    isFavorita: true,
    categoria: 'pessoal',
    visibilidade: 'privada',
    estatisticas: {
      visualizacoes: 0,
      copias: 0,
      compartilhamentos: 0
    },
    ...opcoes
  };
};

// Criar tag
export const criarTag = (
  nome: string,
  opcoes?: Partial<Tag>
): Tag => {
  return {
    id: gerarId(),
    nome,
    cor: CORES_TAGS[Math.floor(Math.random() * CORES_TAGS.length)],
    ...opcoes
  };
};

// Filtrar simulações favoritas
export const filtrarSimulacoes = (
  simulacoes: SimulacaoFavorita[],
  filtros: FiltrosFavoritos
): SimulacaoFavorita[] => {
  let resultado = [...simulacoes];

  // Filtro por busca
  if (filtros.busca) {
    const busca = filtros.busca.toLowerCase();
    resultado = resultado.filter(sim => 
      sim.nome.toLowerCase().includes(busca) ||
      sim.descricao?.toLowerCase().includes(busca)
    );
  }

  // Filtro por tags
  if (filtros.tags.length > 0) {
    resultado = resultado.filter(sim =>
      filtros.tags.some(tag => sim.tags.includes(tag))
    );
  }

  // Filtro por categoria
  if (filtros.categoria.length > 0) {
    resultado = resultado.filter(sim =>
      filtros.categoria.includes(sim.categoria)
    );
  }

  // Filtro por período
  if (filtros.periodo.inicio || filtros.periodo.fim) {
    resultado = resultado.filter(sim => {
      const data = sim.dataCriacao;
      if (filtros.periodo.inicio && data < filtros.periodo.inicio) return false;
      if (filtros.periodo.fim && data > filtros.periodo.fim) return false;
      return true;
    });
  }

  // Filtro apenas com resultado
  if (filtros.apenasComResultado) {
    resultado = resultado.filter(sim => sim.resultado);
  }

  // Filtro apenas favoritas
  if (filtros.apenasFavoritas) {
    resultado = resultado.filter(sim => sim.isFavorita);
  }

  // Ordenação
  resultado.sort((a, b) => {
    let valorA: any, valorB: any;

    switch (filtros.ordenarPor) {
      case 'nome':
        valorA = a.nome.toLowerCase();
        valorB = b.nome.toLowerCase();
        break;
      case 'data':
        valorA = a.dataCriacao.getTime();
        valorB = b.dataCriacao.getTime();
        break;
      case 'categoria':
        valorA = a.categoria;
        valorB = b.categoria;
        break;
      case 'rendimento':
        valorA = a.resultado?.valorFinal || 0;
        valorB = b.resultado?.valorFinal || 0;
        break;
      default:
        return 0;
    }

    if (valorA < valorB) return filtros.ordemCrescente ? -1 : 1;
    if (valorA > valorB) return filtros.ordemCrescente ? 1 : -1;
    return 0;
  });

  return resultado;
};

// Comparar simulações
export const compararSimulacoes = (
  simulacoes: SimulacaoFavorita[]
): ComparacaoSimulacoes => {
  const comparacao: ComparacaoSimulacoes = {
    id: gerarId(),
    nome: `Comparação ${new Date().toLocaleDateString()}`,
    simulacoes,
    criterios: {
      saldoFinal: true,
      rendimentoTotal: true,
      rendimentoMensal: true,
      tempoParaMeta: true,
      risco: true,
      liquidez: true,
      impostos: true,
      inflacao: true
    },
    configuracao: {
      mostrarGraficos: true,
      mostrarTabela: true,
      mostrarResumo: true,
      ordenarPor: 'saldoFinal',
      ordemCrescente: false
    },
    dataCriacao: new Date(),
    dataUltimaAtualizacao: new Date(),
    tags: [],
    categoria: 'comparacao'
  };

  // Análise automática
  if (simulacoes.length > 1) {
    const comResultado = simulacoes.filter(s => s.resultado);
    if (comResultado.length > 1) {
      const saldos = comResultado.map(s => s.resultado!.valorFinal);
      const maxSaldo = Math.max(...saldos);
      const minSaldo = Math.min(...saldos);
      
      const melhor = comResultado.find(s => s.resultado!.valorFinal === maxSaldo);
      const pior = comResultado.find(s => s.resultado!.valorFinal === minSaldo);

      comparacao.resultadoAnalise = {
        melhorOpcao: melhor?.nome || '',
        piorOpcao: pior?.nome || '',
        recomendacao: `A simulação "${melhor?.nome}" apresenta o melhor resultado com saldo final de ${formatarMoeda(maxSaldo)}.`,
        observacoes: [
          `Diferença entre melhor e pior opção: ${formatarMoeda(maxSaldo - minSaldo)}`,
          `Rendimento médio: ${formatarMoeda(saldos.reduce((a, b) => a + b, 0) / saldos.length)}`
        ],
        pontuacao: comResultado.map(s => ({
          simulacaoId: s.id,
          pontos: calcularPontuacao(s),
          criterios: {}
        }))
      };
    }
  }

  return comparacao;
};

// Calcular pontuação de uma simulação
const calcularPontuacao = (simulacao: SimulacaoFavorita): number => {
  if (!simulacao.resultado) return 0;
  
  const { valorFinal, totalJuros } = simulacao.resultado;
  const { valorInicial, periodo } = simulacao.simulacao.parametros;
  
  // Pontuação baseada em rendimento, tempo e valor inicial
  const rendimentoScore = (totalJuros / valorInicial) * 100;
  const tempoScore = Math.max(0, 100 - periodo);
  const valorScore = Math.min(100, valorInicial / 1000);
  
  return Math.round((rendimentoScore * 0.5 + tempoScore * 0.3 + valorScore * 0.2));
};

// Gerar estatísticas
export const gerarEstatisticas = (
  simulacoes: SimulacaoFavorita[],
  tags: Tag[]
): EstatisticasFavoritos => {
  const totalSimulacoes = simulacoes.length;
  const totalFavoritas = simulacoes.filter(s => s.isFavorita).length;
  const comResultado = simulacoes.filter(s => s.resultado);

  // Estatísticas por categoria
  const categorias: Record<string, number> = {};
  simulacoes.forEach(s => {
    categorias[s.categoria] = (categorias[s.categoria] || 0) + 1;
  });

  // Tags populares
  const usoTags: Record<string, number> = {};
  simulacoes.forEach(s => {
    s.tags.forEach(tagId => {
      usoTags[tagId] = (usoTags[tagId] || 0) + 1;
    });
  });

  const tagsPopulares = Object.entries(usoTags)
    .map(([tagId, uso]) => {
      const tag = tags.find(t => t.id === tagId);
      return { tag: tag?.nome || 'Tag removida', uso };
    })
    .sort((a, b) => b.uso - a.uso)
    .slice(0, 10);

  // Médias
  const rendimentoMedio = comResultado.length > 0
    ? comResultado.reduce((acc, s) => acc + s.resultado!.totalJuros, 0) / comResultado.length
    : 0;

  const periodoMedio = simulacoes.length > 0
    ? simulacoes.reduce((acc, s) => acc + s.simulacao.parametros.periodo, 0) / simulacoes.length
    : 0;

  const valorMedioInvestido = simulacoes.length > 0
    ? simulacoes.reduce((acc, s) => acc + s.simulacao.parametros.valorInicial, 0) / simulacoes.length
    : 0;

  // Crescimento mensal (últimos 12 meses)
  const crescimentoMensal = gerarCrescimentoMensal(simulacoes);

  // Top simulações
  const topSimulacoes = {
    maisVisualizadas: simulacoes
      .sort((a, b) => (b.estatisticas?.visualizacoes || 0) - (a.estatisticas?.visualizacoes || 0))
      .slice(0, 5),
    maisCopiadas: simulacoes
      .sort((a, b) => (b.estatisticas?.copias || 0) - (a.estatisticas?.copias || 0))
      .slice(0, 5),
    melhorAvaliadas: simulacoes
      .filter(s => s.avaliacoes && s.avaliacoes.length > 0)
      .sort((a, b) => {
        const mediaA = a.avaliacoes!.reduce((acc, av) => acc + av.nota, 0) / a.avaliacoes!.length;
        const mediaB = b.avaliacoes!.reduce((acc, av) => acc + av.nota, 0) / b.avaliacoes!.length;
        return mediaB - mediaA;
      })
      .slice(0, 5)
  };

  return {
    totalSimulacoes,
    totalFavoritas,
    totalComparacoes: 0, // Será calculado separadamente
    totalTags: tags.length,
    categorias,
    tagsPopulares,
    rendimentoMedio,
    periodoMedio,
    valorMedioInvestido,
    crescimentoMensal,
    topSimulacoes
  };
};

// Gerar dados de crescimento mensal
const gerarCrescimentoMensal = (simulacoes: SimulacaoFavorita[]) => {
  const meses = [];
  const agora = new Date();
  
  for (let i = 11; i >= 0; i--) {
    const data = new Date(agora.getFullYear(), agora.getMonth() - i, 1);
    const proximoMes = new Date(agora.getFullYear(), agora.getMonth() - i + 1, 1);
    
    const simulacoesMes = simulacoes.filter(s => 
      s.dataCriacao >= data && s.dataCriacao < proximoMes
    );
    
    const favoritasMes = simulacoesMes.filter(s => s.isFavorita);
    
    meses.push({
      mes: data.toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' }),
      simulacoes: simulacoesMes.length,
      favoritas: favoritasMes.length
    });
  }
  
  return meses;
};

// Exportar simulações
export const exportarSimulacoes = async (
  simulacoes: SimulacaoFavorita[],
  formato: 'json' | 'csv' | 'excel'
): Promise<string> => {
  switch (formato) {
    case 'json':
      return JSON.stringify(simulacoes, null, 2);
    
    case 'csv':
      return exportarCSV(simulacoes);
    
    case 'excel':
      // Implementação futura com biblioteca específica
      throw new Error('Exportação para Excel não implementada ainda');
    
    default:
      throw new Error('Formato não suportado');
  }
};

// Exportar para CSV
const exportarCSV = (simulacoes: SimulacaoFavorita[]): string => {
  const headers = [
    'Nome',
    'Categoria',
    'Valor Inicial',
    'Valor Mensal',
    'Período (meses)',
    'Taxa Anual (%)',
    'Saldo Final',
    'Rendimento Total',
    'Data Criação',
    'Favorita'
  ];

  const linhas = simulacoes.map(s => [
    s.nome,
    s.categoria,
    s.simulacao.parametros.valorInicial,
    s.simulacao.parametros.valorMensal || 0,
    s.simulacao.parametros.periodo,
    s.simulacao.parametros.taxa || 0,
    s.resultado?.valorFinal || 0,
    s.resultado?.totalJuros || 0,
    s.dataCriacao.toLocaleDateString('pt-BR'),
    s.isFavorita ? 'Sim' : 'Não'
  ]);

  return [headers, ...linhas]
    .map(linha => linha.map(campo => `"${campo}"`).join(','))
    .join('\n');
};

// Formatação de moeda
export const formatarMoeda = (valor: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(valor);
};

// Formatação de porcentagem
export const formatarPorcentagem = (valor: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'percent',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(valor / 100);
};

// Validar simulação favorita
export const validarSimulacaoFavorita = (simulacao: Partial<SimulacaoFavorita>): string[] => {
  const erros: string[] = [];

  if (!simulacao.nome || simulacao.nome.trim().length === 0) {
    erros.push('Nome é obrigatório');
  }

  if (simulacao.nome && simulacao.nome.length > 100) {
    erros.push('Nome deve ter no máximo 100 caracteres');
  }

  if (simulacao.descricao && simulacao.descricao.length > 500) {
    erros.push('Descrição deve ter no máximo 500 caracteres');
  }

  if (!simulacao.simulacao) {
    erros.push('Dados da simulação são obrigatórios');
  }

  if (simulacao.tags && simulacao.tags.length > 10) {
    erros.push('Máximo de 10 tags por simulação');
  }

  return erros;
};