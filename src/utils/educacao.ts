// Utilitários para Sistema de Educação Financeira

import {
  TermoGlossario,
  DicaFinanceira,
  TutorialInterativo,
  ArtigoEducativo,
  ConquistaEducativa,
  PerfilEducativo,
  SessaoEstudo,
  AtividadeEstudo,
  RecomendacaoEducativa,
  ProgressoTutorial,
  EstatisticasEducativas
} from '../types/educacao';

// Dados iniciais expandidos do glossário
export const glossarioCompleto: TermoGlossario[] = [
  {
    id: 'juros-compostos',
    termo: 'Juros Compostos',
    definicao: 'Sistema de capitalização onde os juros são calculados sobre o capital inicial acrescido dos juros acumulados dos períodos anteriores.',
    categoria: 'basico',
    tags: ['investimento', 'capitalização', 'rendimento'],
    exemplos: [
      'R$ 1.000 a 10% ao ano por 2 anos = R$ 1.210',
      'Reinvestimento de dividendos em ações'
    ],
    termosRelacionados: ['capitalização', 'rendimento', 'investimento'],
    dataAtualizacao: Date.now()
  },
  {
    id: 'taxa-selic',
    termo: 'Taxa Selic',
    definicao: 'Taxa básica de juros da economia brasileira, definida pelo Comitê de Política Monetária (Copom) do Banco Central.',
    categoria: 'intermediario',
    tags: ['economia', 'juros', 'política monetária'],
    exemplos: [
      'Referência para CDI e poupança',
      'Influencia todos os juros da economia'
    ],
    termosRelacionados: ['cdi', 'copom', 'banco-central'],
    dataAtualizacao: Date.now()
  },
  {
    id: 'diversificacao',
    termo: 'Diversificação',
    definicao: 'Estratégia de investimento que consiste em distribuir recursos entre diferentes ativos para reduzir riscos.',
    categoria: 'intermediario',
    tags: ['estratégia', 'risco', 'portfólio'],
    exemplos: [
      'Investir em ações, renda fixa e fundos imobiliários',
      'Distribuir investimentos entre setores diferentes'
    ],
    termosRelacionados: ['risco', 'portfolio', 'alocacao'],
    dataAtualizacao: Date.now()
  },
  {
    id: 'cdi',
    termo: 'CDI',
    definicao: 'Certificado de Depósito Interbancário. Taxa de juros que os bancos usam para emprestar dinheiro entre si.',
    categoria: 'basico',
    tags: ['renda fixa', 'benchmark', 'juros'],
    exemplos: [
      'CDB que paga 100% do CDI',
      'Referência para investimentos de renda fixa'
    ],
    termosRelacionados: ['selic', 'renda-fixa', 'benchmark'],
    dataAtualizacao: Date.now()
  },
  {
    id: 'inflacao',
    termo: 'Inflação',
    definicao: 'Aumento generalizado e contínuo dos preços de bens e serviços em uma economia.',
    categoria: 'basico',
    tags: ['economia', 'preços', 'poder de compra'],
    exemplos: [
      'IPCA é o índice oficial de inflação no Brasil',
      'Reduz o poder de compra do dinheiro'
    ],
    termosRelacionados: ['ipca', 'poder-compra', 'economia'],
    dataAtualizacao: Date.now()
  },
  {
    id: 'renda-fixa',
    termo: 'Renda Fixa',
    definicao: 'Investimentos com rentabilidade previsível, onde você empresta dinheiro e recebe juros.',
    categoria: 'basico',
    tags: ['investimento', 'segurança', 'previsibilidade'],
    exemplos: [
      'CDB, LCI, LCA, Tesouro Direto',
      'Poupança é um tipo de renda fixa'
    ],
    termosRelacionados: ['cdb', 'tesouro-direto', 'seguranca'],
    dataAtualizacao: Date.now()
  },
  {
    id: 'renda-variavel',
    termo: 'Renda Variável',
    definicao: 'Investimentos cuja rentabilidade não pode ser determinada no momento da aplicação.',
    categoria: 'intermediario',
    tags: ['investimento', 'risco', 'volatilidade'],
    exemplos: [
      'Ações, fundos de ações, ETFs',
      'Criptomoedas e commodities'
    ],
    termosRelacionados: ['acoes', 'volatilidade', 'risco'],
    dataAtualizacao: Date.now()
  },
  {
    id: 'liquidez',
    termo: 'Liquidez',
    definicao: 'Facilidade de converter um investimento em dinheiro sem perda significativa de valor.',
    categoria: 'basico',
    tags: ['conversibilidade', 'disponibilidade', 'prazo'],
    exemplos: [
      'Poupança tem liquidez diária',
      'CDB com carência tem baixa liquidez'
    ],
    termosRelacionados: ['disponibilidade', 'carencia', 'resgate'],
    dataAtualizacao: Date.now()
  }
];

// Dicas financeiras expandidas
export const dicasCompletas: DicaFinanceira[] = [
  {
    id: 'regra-72',
    titulo: 'Regra dos 72',
    conteudo: 'Para descobrir em quantos anos seu dinheiro dobrará, divida 72 pela taxa de juros anual. Por exemplo: 72 ÷ 8% = 9 anos.',
    categoria: 'investimento',
    nivel: 'iniciante',
    tags: ['cálculo', 'tempo', 'duplicação'],
    contexto: 'calculadora',
    relevancia: 9,
    visualizacoes: 0,
    curtidas: 0,
    dataPublicacao: Date.now()
  },
  {
    id: 'emergencia-primeiro',
    titulo: 'Reserva de Emergência Primeiro',
    conteudo: 'Antes de investir, tenha uma reserva de emergência equivalente a 6-12 meses de gastos em aplicações líquidas e seguras.',
    categoria: 'planejamento',
    nivel: 'iniciante',
    tags: ['emergência', 'planejamento', 'segurança'],
    relevancia: 10,
    visualizacoes: 0,
    curtidas: 0,
    dataPublicacao: Date.now()
  },
  {
    id: 'tempo-aliado',
    titulo: 'Tempo é seu Maior Aliado',
    conteudo: 'Quanto mais cedo começar a investir, maior será o poder dos juros compostos. Mesmo pequenos valores podem se tornar grandes fortunas.',
    categoria: 'investimento',
    nivel: 'iniciante',
    tags: ['tempo', 'juros compostos', 'início'],
    relevancia: 9,
    visualizacoes: 0,
    curtidas: 0,
    dataPublicacao: Date.now()
  },
  {
    id: 'diversificacao-importante',
    titulo: 'Não Coloque Todos os Ovos na Mesma Cesta',
    conteudo: 'Diversifique seus investimentos entre diferentes tipos de ativos e setores para reduzir riscos e otimizar retornos.',
    categoria: 'investimento',
    nivel: 'intermediario',
    tags: ['diversificação', 'risco', 'estratégia'],
    relevancia: 8,
    visualizacoes: 0,
    curtidas: 0,
    dataPublicacao: Date.now()
  },
  {
    id: 'inflacao-inimiga',
    titulo: 'A Inflação é Inimiga do seu Dinheiro',
    conteudo: 'Deixar dinheiro parado na conta corrente ou em investimentos que rendem menos que a inflação faz você perder poder de compra.',
    categoria: 'economia',
    nivel: 'iniciante',
    tags: ['inflação', 'poder de compra', 'rentabilidade'],
    relevancia: 8,
    visualizacoes: 0,
    curtidas: 0,
    dataPublicacao: Date.now()
  },
  {
    id: 'conheca-perfil',
    titulo: 'Conheça seu Perfil de Investidor',
    conteudo: 'Antes de investir, entenda sua tolerância ao risco, objetivos financeiros e prazo de investimento.',
    categoria: 'planejamento',
    nivel: 'iniciante',
    tags: ['perfil', 'risco', 'objetivos'],
    relevancia: 9,
    visualizacoes: 0,
    curtidas: 0,
    dataPublicacao: Date.now()
  }
];

// Tutoriais interativos expandidos
export const tutoriaisCompletos: TutorialInterativo[] = [
  {
    id: 'introducao-juros-compostos',
    titulo: 'Introdução aos Juros Compostos',
    descricao: 'Aprenda o conceito fundamental dos juros compostos e como eles podem multiplicar seus investimentos.',
    categoria: 'calculadora',
    nivel: 'iniciante',
    duracao: 15,
    passos: [
      {
        id: 'conceito',
        titulo: 'O que são Juros Compostos?',
        conteudo: 'Juros compostos são juros calculados sobre o capital inicial acrescido dos juros acumulados dos períodos anteriores. É o famoso "juros sobre juros". Entenda a diferença entre juros simples e compostos.',
        tipo: 'texto',
        ordem: 1,
        tempoEstimado: 3
      },
      {
        id: 'calculo-pratico',
        titulo: 'Calculando na Prática',
        conteudo: 'Use a calculadora para ver os juros compostos em ação. Vamos inserir R$ 1.000 e ver como cresce ao longo do tempo.',
        tipo: 'interativo',
        ordem: 2,
        tempoEstimado: 5
      },
      {
        id: 'quiz-final',
        titulo: 'Teste seus Conhecimentos',
        conteudo: 'Quiz sobre juros compostos: Qual a principal vantagem dos juros compostos? Os juros compostos proporcionam crescimento exponencial porque os juros rendem juros.',
        tipo: 'quiz',
        ordem: 3,
        tempoEstimado: 2
      }
    ],
    prerequisitos: [],
    objetivos: [
      'Entender o conceito de juros compostos',
      'Calcular juros compostos na prática',
      'Reconhecer a importância do tempo nos investimentos'
    ],
    tags: ['juros compostos', 'calculadora', 'investimento'],
    visualizacoes: 0,
    avaliacaoMedia: 0,
    dataPublicacao: Date.now()
  },
  {
    id: 'primeiros-passos-investimento',
    titulo: 'Primeiros Passos no Investimento',
    descricao: 'Guia completo para quem está começando a investir.',
    categoria: 'investimentos',
    nivel: 'iniciante',
    duracao: 25,
    passos: [
      {
        id: 'reserva-emergencia',
        titulo: 'Reserva de Emergência',
        conteudo: 'A reserva de emergência é fundamental para sua segurança financeira. Deve equivaler a 6-12 meses dos seus gastos mensais. Por que ter uma reserva antes de investir?',
        tipo: 'texto',
        ordem: 1,
        tempoEstimado: 5
      },
      {
        id: 'perfil-investidor',
        titulo: 'Descobrindo seu Perfil',
        conteudo: 'Questionário para identificar seu perfil de investidor: Como você reagiria se seus investimentos perdessem 20% do valor em um mês? A reação equilibrada mostra maturidade para investir.',
        tipo: 'quiz',
        ordem: 2,
        tempoEstimado: 3
      }
    ],
    prerequisitos: [],
    objetivos: [
      'Entender a importância da reserva de emergência',
      'Descobrir seu perfil de investidor',
      'Conhecer os primeiros investimentos recomendados'
    ],
    tags: ['investimento', 'iniciante', 'reserva emergência'],
    visualizacoes: 0,
    avaliacaoMedia: 0,
    dataPublicacao: Date.now()
  }
];

// Artigos educativos expandidos
export const artigosCompletos: ArtigoEducativo[] = [
  {
    id: 'guia-tesouro-direto',
    titulo: 'Guia Completo do Tesouro Direto',
    resumo: 'Tudo que você precisa saber sobre o Tesouro Direto, desde o básico até estratégias avançadas.',
    conteudo: `
# Guia Completo do Tesouro Direto

## O que é o Tesouro Direto?

O Tesouro Direto é um programa do Tesouro Nacional desenvolvido em parceria com a B3 para venda de títulos públicos federais para pessoas físicas, de forma 100% online.

## Tipos de Títulos

### Tesouro Selic (LFT)
- Rentabilidade: Taxa Selic
- Liquidez: Diária
- Ideal para: Reserva de emergência

### Tesouro Prefixado (LTN)
- Rentabilidade: Taxa fixa
- Risco: Marcação a mercado
- Ideal para: Objetivos de prazo definido

### Tesouro IPCA+ (NTN-B)
- Rentabilidade: IPCA + taxa fixa
- Proteção: Contra inflação
- Ideal para: Aposentadoria e objetivos de longo prazo

## Como Investir

1. Abra conta em uma corretora
2. Acesse a plataforma do Tesouro Direto
3. Escolha o título adequado ao seu perfil
4. Defina o valor do investimento
5. Confirme a operação

## Custos

- Taxa de custódia: 0,25% ao ano
- Taxa da corretora: Varia (muitas são gratuitas)
- IOF: Apenas para resgates em menos de 30 dias

## Estratégias

### Para Iniciantes
- Comece com Tesouro Selic
- Invista mensalmente
- Mantenha até o vencimento

### Para Intermediários
- Diversifique entre tipos de títulos
- Use marcação a mercado a seu favor
- Considere títulos com juros semestrais

## Conclusão

O Tesouro Direto é uma excelente porta de entrada para o mundo dos investimentos, oferecendo segurança, liquidez e rentabilidade superior à poupança.
    `,
    categoria: 'conceitos',
    nivel: 'iniciante',
    tags: ['tesouro direto', 'renda fixa', 'títulos públicos'],
    autor: 'Equipe Jurus',
    dataPublicacao: Date.now(),
    ultimaAtualizacao: Date.now(),
    tempoLeitura: 8,
    visualizacoes: 0,
    avaliacaoMedia: 0
  },
  {
    id: 'diversificacao-portfolio',
    titulo: 'Como Diversificar seu Portfólio',
    resumo: 'Estratégias práticas para diversificar investimentos e reduzir riscos.',
    conteudo: `
# Como Diversificar seu Portfólio

## Por que Diversificar?

A diversificação é a única "refeição grátis" do mercado financeiro. Ela permite reduzir riscos sem necessariamente reduzir retornos.

## Tipos de Diversificação

### Por Classe de Ativos
- Renda Fixa (40-60%)
- Renda Variável (20-40%)
- Fundos Imobiliários (5-15%)
- Commodities (0-10%)

### Por Prazo
- Curto prazo: Liquidez diária
- Médio prazo: 1-5 anos
- Longo prazo: +5 anos

### Por Geografia
- Mercado doméstico
- Mercados desenvolvidos
- Mercados emergentes

## Estratégias Práticas

### Para Iniciantes (até R$ 10.000)
1. 70% Tesouro Direto
2. 20% Fundos de Índice
3. 10% Fundos Imobiliários

### Para Intermediários (R$ 10.000 - R$ 100.000)
1. 50% Renda Fixa diversificada
2. 30% Ações individuais e ETFs
3. 15% Fundos Imobiliários
4. 5% Investimentos alternativos

## Rebalanceamento

- Revise a carteira trimestralmente
- Rebalanceie quando houver desvio >5%
- Considere custos de transação

## Erros Comuns

- Diversificação excessiva
- Concentração em um setor
- Ignorar correlações
- Não rebalancear

## Conclusão

A diversificação adequada é fundamental para o sucesso nos investimentos. Comece simples e evolua gradualmente.
    `,
    categoria: 'estrategias',
    nivel: 'intermediario',
    tags: ['diversificação', 'portfólio', 'estratégia'],
    autor: 'Equipe Jurus',
    dataPublicacao: Date.now(),
    ultimaAtualizacao: Date.now(),
    tempoLeitura: 12,
    visualizacoes: 0,
    avaliacaoMedia: 0
  }
];

// Conquistas educativas expandidas
export const conquistasCompletas: ConquistaEducativa[] = [
  {
    id: 'primeiro-tutorial',
    nome: 'Primeiro Passo',
    descricao: 'Complete seu primeiro tutorial',
    icone: '🎯',
    categoria: 'progresso',
    criterios: [
      {
        tipo: 'tutoriais_completos',
        valor: 1,
        descricao: 'Complete 1 tutorial'
      }
    ],
    pontuacao: 50,
    raridade: 'comum'
  },
  {
    id: 'leitor-iniciante',
    nome: 'Leitor Iniciante',
    descricao: 'Leia 3 artigos educativos',
    icone: '📚',
    categoria: 'conhecimento',
    criterios: [
      {
        tipo: 'artigos_lidos',
        valor: 3,
        descricao: 'Leia 3 artigos'
      }
    ],
    pontuacao: 75,
    raridade: 'comum'
  },
  {
    id: 'estudioso',
    nome: 'Estudioso',
    descricao: 'Acumule 60 minutos de estudo',
    icone: '⏰',
    categoria: 'dedicacao',
    criterios: [
      {
        tipo: 'tempo_estudo',
        valor: 60,
        descricao: 'Estude por 60 minutos'
      }
    ],
    pontuacao: 100,
    raridade: 'raro'
  },
  {
    id: 'expert-juros',
    nome: 'Expert em Juros Compostos',
    descricao: 'Complete todos os tutoriais sobre juros compostos',
    icone: '🧮',
    categoria: 'conhecimento',
    criterios: [
      {
        tipo: 'tutoriais_completos',
        valor: 3,
        descricao: 'Complete 3 tutoriais'
      },
      {
        tipo: 'pontuacao_total',
        valor: 200,
        descricao: 'Alcance 200 pontos'
      }
    ],
    pontuacao: 200,
    raridade: 'epico'
  },
  {
    id: 'mestre-educacao',
    nome: 'Mestre da Educação',
    descricao: 'Complete todos os tutoriais e leia todos os artigos',
    icone: '🎓',
    categoria: 'conhecimento',
    criterios: [
      {
        tipo: 'tutoriais_completos',
        valor: 5,
        descricao: 'Complete 5 tutoriais'
      },
      {
        tipo: 'artigos_lidos',
        valor: 10,
        descricao: 'Leia 10 artigos'
      },
      {
        tipo: 'tempo_estudo',
        valor: 300,
        descricao: 'Estude por 300 minutos'
      }
    ],
    pontuacao: 500,
    raridade: 'lendario'
  }
];

// Função para calcular progresso de aprendizado
export const calcularProgressoAprendizado = (perfil: PerfilEducativo): {
  progressoGeral: number;
  areasFortes: string[];
  areasMelhoria: string[];
  proximoObjetivo: string;
  totalTutoriais: number;
  totalArtigos: number;
  totalConquistas: number;
  tempoTotal: number;
  progressoPorArea: Record<string, number>;
} => {
  if (!perfil) {
    return {
      progressoGeral: 0,
      areasFortes: [],
      areasMelhoria: [],
      proximoObjetivo: 'Comece completando seu primeiro tutorial',
      totalTutoriais: 0,
      totalArtigos: 0,
      totalConquistas: 0,
      tempoTotal: 0,
      progressoPorArea: {}
    };
  }

  // Calcular progresso geral baseado em múltiplos fatores
  const fatores = {
    tutoriais: Math.min(perfil.tutoriaisCompletos.length / 5, 1) * 30,
    artigos: Math.min(perfil.artigosLidos.length / 10, 1) * 25,
    tempo: Math.min(perfil.tempoTotalEstudo / 300, 1) * 25,
    conquistas: Math.min(perfil.conquistas.length / 5, 1) * 20
  };

  const progressoGeral = Object.values(fatores).reduce((sum, valor) => sum + valor, 0);

  // Identificar áreas fortes e de melhoria
  const areas = Object.entries(perfil.areas);
  const areasOrdenadas = areas.sort((a, b) => b[1].experiencia - a[1].experiencia);
  
  const areasFortes = areasOrdenadas.slice(0, 2).map(([area]) => area);
  const areasMelhoria = areasOrdenadas.slice(-2).map(([area]) => area);

  // Determinar próximo objetivo
  let proximoObjetivo = 'Continue estudando!';
  
  if (perfil.tutoriaisCompletos.length === 0) {
    proximoObjetivo = 'Complete seu primeiro tutorial';
  } else if (perfil.artigosLidos.length < 3) {
    proximoObjetivo = 'Leia mais artigos educativos';
  } else if (perfil.tempoTotalEstudo < 60) {
    proximoObjetivo = 'Acumule 60 minutos de estudo';
  } else if (perfil.conquistas.length < 3) {
    proximoObjetivo = 'Desbloqueie mais conquistas';
  }

  // Calcular progresso por área
  const progressoPorArea: Record<string, number> = {};
  Object.entries(perfil.areas).forEach(([area, dados]) => {
    progressoPorArea[area] = Math.min((dados.experiencia / 100) * 100, 100);
  });

  return {
    progressoGeral: Math.round(progressoGeral),
    areasFortes,
    areasMelhoria,
    proximoObjetivo,
    totalTutoriais: perfil.tutoriaisCompletos.length,
    totalArtigos: perfil.artigosLidos.length,
    totalConquistas: perfil.conquistas.length,
    tempoTotal: perfil.tempoTotalEstudo,
    progressoPorArea
  };
};

// Função para gerar recomendações personalizadas
export const gerarRecomendacoesPersonalizadas = (
  perfil: PerfilEducativo,
  tutoriais: TutorialInterativo[],
  artigos: ArtigoEducativo[]
): RecomendacaoEducativa[] => {
  if (!perfil) return [];

  const recomendacoes: RecomendacaoEducativa[] = [];

  // Recomendar baseado no nível
  const nivelUsuario = perfil.nivel;
  let nivelRecomendado: 'iniciante' | 'intermediario' | 'avancado' = 'iniciante';
  
  if (nivelUsuario >= 5) nivelRecomendado = 'intermediario';
  if (nivelUsuario >= 10) nivelRecomendado = 'avancado';

  // Tutoriais não completados do nível apropriado
  const tutoriaisRecomendados = tutoriais
    .filter(t => !perfil.tutoriaisCompletos.includes(t.id))
    .filter(t => t.nivel === nivelRecomendado)
    .slice(0, 2);

  tutoriaisRecomendados.forEach(tutorial => {
    recomendacoes.push({
      id: tutorial.id,
      tipo: 'tutorial',
      titulo: tutorial.titulo,
      motivo: `Recomendado para seu nível (${nivelRecomendado})`,
      relevancia: 0.9,
      categoria: tutorial.categoria,
      nivel: tutorial.nivel,
      tempoEstimado: tutorial.duracao,
      prioridade: Math.round(0.9 * 10)
    });
  });

  // Artigos baseados em áreas de interesse
  const areasInteresse = Object.keys(perfil.areas)
    .sort((a, b) => perfil.areas[b].experiencia - perfil.areas[a].experiencia)
    .slice(0, 2);

  const artigosRecomendados = artigos
    .filter(a => !perfil.artigosLidos.includes(a.id))
    .filter(a => areasInteresse.includes(a.categoria))
    .slice(0, 2);

  artigosRecomendados.forEach(artigo => {
    recomendacoes.push({
      id: artigo.id,
      tipo: 'artigo',
      titulo: artigo.titulo,
      motivo: 'Baseado em suas áreas de interesse',
      relevancia: 0.8,
      categoria: artigo.categoria,
      nivel: artigo.nivel,
      tempoEstimado: artigo.tempoLeitura,
      prioridade: Math.round(0.8 * 10)
    });
  });

  // Se não há recomendações específicas, recomendar conteúdo básico
  if (recomendacoes.length === 0) {
    const tutorialBasico = tutoriais.find(t => t.nivel === 'iniciante');
    if (tutorialBasico) {
      recomendacoes.push({
        id: tutorialBasico.id,
        tipo: 'tutorial',
        titulo: tutorialBasico.titulo,
        motivo: 'Tutorial básico recomendado para iniciantes',
        relevancia: 0.9,
        categoria: tutorialBasico.categoria,
        nivel: tutorialBasico.nivel,
        tempoEstimado: tutorialBasico.duracao,
        prioridade: Math.round(0.9 * 10)
      });
    }
  }

  return recomendacoes.sort((a, b) => b.relevancia - a.relevancia);
};

// Função para calcular estatísticas avançadas
export const calcularEstatisticasAvancadas = (
  perfil: PerfilEducativo,
  historico: any
): EstatisticasEducativas => {
  if (!perfil) {
    return {
      diasConsecutivos: 0,
      maiorSequencia: 0,
      mediaTempoSessao: 0,
      progressoSemanal: []
    };
  }

  // Calcular dias consecutivos de estudo
  const hoje = new Date();
  let diasConsecutivos = 0;
  let maiorSequencia = 0;
  let sequenciaAtual = 0;

  // Simular dados de estudo (em uma implementação real, viria do histórico)
  const ultimasSessoes = historico?.sessoes || [];
  
  // Calcular média de tempo por sessão
  const tempoTotal = ultimasSessoes.reduce((total: number, sessao: any) => {
    return total + (sessao.fim ? (sessao.fim - sessao.inicio) / 1000 / 60 : 0);
  }, 0);
  
  const mediaTempoSessao = ultimasSessoes.length > 0 ? tempoTotal / ultimasSessoes.length : 0;

  // Gerar progresso semanal (últimas 4 semanas)
  const progressoSemanal = [];
  for (let i = 3; i >= 0; i--) {
    const inicioSemana = new Date(hoje);
    inicioSemana.setDate(hoje.getDate() - (i * 7));
    
    progressoSemanal.push({
      semana: `Semana ${4 - i}`,
      tutoriais: Math.floor(Math.random() * 3), // Simular dados
      artigos: Math.floor(Math.random() * 5),
      tempo: Math.floor(Math.random() * 120)
    });
  }

  return {
    diasConsecutivos,
    maiorSequencia,
    mediaTempoSessao: Math.round(mediaTempoSessao),
    progressoSemanal
  };
};

// Função para verificar conquistas avançadas
export const verificarConquistasAvancadas = (
  perfil: PerfilEducativo,
  conquistas: ConquistaEducativa[]
): string[] => {
  if (!perfil) return [];

  const novasConquistas: string[] = [];

  conquistas.forEach(conquista => {
    if (perfil.conquistas.includes(conquista.id)) return;

    let criteriosAtendidos = 0;

    conquista.criterios.forEach(criterio => {
      switch (criterio.tipo) {
        case 'tutoriais_completos':
          if (perfil.tutoriaisCompletos.length >= criterio.valor) {
            criteriosAtendidos++;
          }
          break;
        case 'artigos_lidos':
          if (perfil.artigosLidos.length >= criterio.valor) {
            criteriosAtendidos++;
          }
          break;
        case 'tempo_estudo':
          if (perfil.tempoTotalEstudo >= criterio.valor) {
            criteriosAtendidos++;
          }
          break;
        case 'pontuacao':
          if (perfil.pontuacaoTotal >= criterio.valor) {
            criteriosAtendidos++;
          }
          break;
        case 'sequencia':
          // Implementar lógica de sequência de dias
          break;
      }
    });

    if (criteriosAtendidos === conquista.criterios.length) {
      novasConquistas.push(conquista.id);
    }
  });

  return novasConquistas;
};

// Função para gerar plano de estudos personalizado
export const gerarPlanoEstudos = (
  perfil: PerfilEducativo,
  tutoriais: TutorialInterativo[],
  artigos: ArtigoEducativo[]
): {
  semana1: RecomendacaoEducativa[];
  semana2: RecomendacaoEducativa[];
  semana3: RecomendacaoEducativa[];
  semana4: RecomendacaoEducativa[];
  proximosTutoriais: RecomendacaoEducativa[];
  artigosRecomendados: RecomendacaoEducativa[];
  metaSemanal: {
    tempoRecomendado: number;
    objetivos: string[];
  };
} => {
  const recomendacoes = gerarRecomendacoesPersonalizadas(perfil, tutoriais, artigos);
  
  // Separar tutoriais e artigos
  const proximosTutoriais = recomendacoes.filter(r => r.tipo === 'tutorial').slice(0, 3);
  const artigosRecomendados = recomendacoes.filter(r => r.tipo === 'artigo').slice(0, 3);
  
  // Distribuir recomendações ao longo de 4 semanas
  const plano = {
    semana1: recomendacoes.slice(0, 2),
    semana2: recomendacoes.slice(2, 4),
    semana3: recomendacoes.slice(4, 6),
    semana4: recomendacoes.slice(6, 8),
    proximosTutoriais,
    artigosRecomendados,
    metaSemanal: {
      tempoRecomendado: 60, // 60 minutos por semana
      objetivos: [
        'Completar pelo menos 1 tutorial',
        'Ler 2 artigos educativos',
        'Praticar conceitos aprendidos',
        'Revisar conteúdo anterior'
      ]
    }
  };

  return plano;
};