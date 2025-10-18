// Tipos para Sistema de Educação Financeira

export interface TermoGlossario {
  id: string;
  termo: string;
  definicao: string;
  categoria: 'basico' | 'intermediario' | 'avancado';
  tags: string[];
  exemplos: string[];
  termosRelacionados: string[];
  fontes?: string[];
  dataAtualizacao: number;
}

export interface DicaFinanceira {
  id: string;
  titulo: string;
  conteudo: string;
  categoria: 'investimento' | 'economia' | 'planejamento' | 'impostos' | 'geral';
  nivel: 'iniciante' | 'intermediario' | 'avancado';
  tags: string[];
  contexto?: string; // Contexto onde a dica aparece
  relevancia: number; // 1-10
  visualizacoes: number;
  curtidas: number;
  dataPublicacao: number;
}

export interface TutorialInterativo {
  id: string;
  titulo: string;
  descricao: string;
  categoria: 'calculadora' | 'investimentos' | 'planejamento' | 'analise';
  nivel: 'iniciante' | 'intermediario' | 'avancado';
  duracao: number; // em minutos
  etapas: EtapaTutorial[];
  prerequisitos: string[];
  objetivos: string[];
  recursos: RecursoTutorial[];
  progresso?: ProgressoTutorial;
  avaliacao?: AvaliacaoTutorial;
}

export interface EtapaTutorial {
  id: string;
  titulo: string;
  descricao: string;
  tipo: 'explicacao' | 'interacao' | 'exercicio' | 'quiz';
  conteudo: ConteudoEtapa;
  validacao?: ValidacaoEtapa;
  dicas?: string[];
  tempoEstimado: number;
  obrigatoria: boolean;
}

export interface ConteudoEtapa {
  texto?: string;
  imagem?: string;
  video?: string;
  interacao?: InteracaoEtapa;
  quiz?: QuizEtapa;
  exercicio?: ExercicioEtapa;
}

export interface InteracaoEtapa {
  tipo: 'input' | 'slider' | 'select' | 'calculadora';
  elemento: string; // Seletor do elemento
  acao: string; // Ação a ser realizada
  valorEsperado?: any;
  feedback: string;
}

export interface QuizEtapa {
  pergunta: string;
  opcoes: OpcaoQuiz[];
  respostaCorreta: number;
  explicacao: string;
  tentativasPermitidas: number;
}

export interface OpcaoQuiz {
  id: string;
  texto: string;
  correta: boolean;
  explicacao?: string;
}

export interface ExercicioEtapa {
  enunciado: string;
  tipo: 'calculo' | 'simulacao' | 'analise';
  parametros: { [key: string]: any };
  solucao: any;
  criteriosAvaliacao: string[];
}

export interface ValidacaoEtapa {
  tipo: 'automatica' | 'manual';
  criterios: string[];
  pontuacao: number;
}

export interface RecursoTutorial {
  tipo: 'artigo' | 'video' | 'calculadora' | 'planilha' | 'link';
  titulo: string;
  url?: string;
  descricao: string;
}

export interface ProgressoTutorial {
  etapaAtual: number;
  etapasCompletas: string[];
  pontuacaoTotal: number;
  tempoGasto: number;
  iniciadoEm: number;
  ultimaAtualizacao: number;
  concluido: boolean;
}

export interface AvaliacaoTutorial {
  nota: number; // 1-5
  comentario?: string;
  aspectos: {
    clareza: number;
    utilidade: number;
    dificuldade: number;
    organizacao: number;
  };
  recomendaria: boolean;
  dataAvaliacao: number;
}

export interface ArtigoEducativo {
  id: string;
  titulo: string;
  resumo: string;
  conteudo: string;
  categoria: 'conceitos' | 'estrategias' | 'mercado' | 'impostos' | 'planejamento';
  nivel: 'iniciante' | 'intermediario' | 'avancado';
  tags: string[];
  autor: string;
  dataPublicacao: number;
  tempoLeitura: number; // em minutos
  visualizacoes: number;
  curtidas: number;
  compartilhamentos: number;
  recursos: RecursoArtigo[];
  relacionados: string[];
}

export interface RecursoArtigo {
  tipo: 'imagem' | 'grafico' | 'calculadora' | 'exemplo' | 'link';
  titulo: string;
  conteudo: any;
  posicao: number;
}

export interface ConquistaEducativa {
  id: string;
  nome: string;
  descricao: string;
  icone: string;
  categoria: 'tutorial' | 'leitura' | 'pratica' | 'conhecimento';
  criterios: CriterioConquista[];
  recompensa: RecompensaConquista;
  raridade: 'comum' | 'raro' | 'epico' | 'lendario';
  desbloqueadaEm?: number;
}

export interface CriterioConquista {
  tipo: 'tutoriais_completos' | 'artigos_lidos' | 'tempo_estudo' | 'pontuacao' | 'sequencia';
  valor: number;
  descricao: string;
}

export interface RecompensaConquista {
  tipo: 'badge' | 'titulo' | 'recurso' | 'desconto';
  valor: any;
  descricao: string;
}

export interface PerfilEducativo {
  id: string;
  nivel: number;
  experiencia: number;
  proximoNivel: number;
  conquistas: string[];
  tutoriaisCompletos: string[];
  artigosLidos: string[];
  tempoTotalEstudo: number;
  pontuacaoTotal: number;
  areas: {
    [categoria: string]: {
      nivel: number;
      experiencia: number;
      tutoriais: number;
      artigos: number;
    };
  };
  preferencias: PreferenciasEducativas;
  estatisticas: EstatisticasEducativas;
}

export interface PreferenciasEducativas {
  nivelPreferido: 'iniciante' | 'intermediario' | 'avancado';
  categoriasInteresse: string[];
  formatoPreferido: 'texto' | 'video' | 'interativo';
  tempoSessao: number; // em minutos
  lembretes: boolean;
  horarioLembretes?: string;
  notificacoes: {
    novosConteudos: boolean;
    conquistasDesbloqueadas: boolean;
    lembreteEstudo: boolean;
  };
}

export interface EstatisticasEducativas {
  diasConsecutivos: number;
  maiorSequencia: number;
  mediaTempoSessao: number;
  tutorialFavorito?: string;
  categoriaFavorita?: string;
  horaPreferida?: number;
  progressoSemanal: {
    semana: string;
    tutoriais: number;
    artigos: number;
    tempo: number;
  }[];
}

export interface SessaoEstudo {
  id: string;
  inicio: number;
  fim?: number;
  atividades: AtividadeEstudo[];
  pontuacaoGanha: number;
  experienciaGanha: number;
  conquistasDesbloqueadas: string[];
}

export interface AtividadeEstudo {
  tipo: 'tutorial' | 'artigo' | 'quiz' | 'exercicio';
  id: string;
  titulo: string;
  tempoGasto: number;
  concluida: boolean;
  pontuacao?: number;
}

export interface ConfiguracaoEducacao {
  dicasContextuais: boolean;
  explicacoesDetalhadas: boolean;
  exemplosVisuais: boolean;
  tutoriaisInterativos: boolean;
  notificacoes: boolean;
  gamificacao: boolean;
  nivelDificuldade: 'automatico' | 'iniciante' | 'intermediario' | 'avancado';
  idioma: string;
  tema: 'claro' | 'escuro' | 'auto';
}

export interface HistoricoEducacao {
  sessoes: SessaoEstudo[];
  conquistas: {
    id: string;
    desbloqueadaEm: number;
  }[];
  marcos: {
    tipo: string;
    descricao: string;
    data: number;
  }[];
}

export interface RecomendacaoEducativa {
  id: string;
  tipo: 'tutorial' | 'artigo' | 'conceito';
  titulo: string;
  motivo: string;
  relevancia: number;
  categoria: string;
  nivel: string;
  tempoEstimado: number;
}

export interface PesquisaEducativa {
  termo: string;
  resultados: ResultadoPesquisa[];
  filtros: FiltrosPesquisa;
  ordenacao: 'relevancia' | 'data' | 'popularidade' | 'nivel';
}

export interface ResultadoPesquisa {
  id: string;
  tipo: 'termo' | 'dica' | 'tutorial' | 'artigo';
  titulo: string;
  descricao: string;
  relevancia: number;
  categoria: string;
  nivel: string;
}

export interface FiltrosPesquisa {
  categoria?: string[];
  nivel?: string[];
  tipo?: string[];
  duracao?: {
    min: number;
    max: number;
  };
}