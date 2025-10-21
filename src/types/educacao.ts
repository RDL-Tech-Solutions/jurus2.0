// Tipos para Sistema de Educação
export interface ConteudoEducacional {
  id: string;
  titulo: string;
  descricao: string;
  tipo: 'artigo' | 'video' | 'curso' | 'quiz' | 'simulacao' | 'podcast';
  nivel: 'iniciante' | 'intermediario' | 'avancado' | 'especialista';
  categoria: string;
  subcategoria?: string;
  duracao: number; // em minutos
  pontuacao: number; // pontos ganhos ao completar
  tags: string[];
  autor: string;
  dataPublicacao: Date;
  ultimaAtualizacao: Date;
  visualizacoes: number;
  avaliacaoMedia: number; // 1-5
  numeroAvaliacoes: number;
  conteudo: string | ConteudoEstruturado;
  prerequisitos: string[];
  objetivosAprendizado: string[];
  recursos: RecursoEducacional[];
  status: 'publicado' | 'rascunho' | 'arquivado';
}

export interface ConteudoEstruturado {
  introducao: string;
  secoes: SecaoConteudo[];
  conclusao: string;
  exercicios?: Exercicio[];
  referencias?: string[];
}

export interface SecaoConteudo {
  id: string;
  titulo: string;
  conteudo: string;
  ordem: number;
  tipo: 'texto' | 'video' | 'imagem' | 'grafico' | 'quiz';
  recursos?: RecursoEducacional[];
}

export interface RecursoEducacional {
  id: string;
  nome: string;
  tipo: 'link' | 'arquivo' | 'video' | 'imagem' | 'documento';
  url: string;
  descricao?: string;
  tamanho?: number;
}

export interface Exercicio {
  id: string;
  pergunta: string;
  tipo: 'multipla_escolha' | 'verdadeiro_falso' | 'dissertativa' | 'numerica';
  opcoes?: string[];
  respostaCorreta: string | number;
  explicacao: string;
  pontuacao: number;
  dificuldade: 'facil' | 'medio' | 'dificil';
}

export interface ProgressoEducacao {
  usuarioId: string;
  pontosTotal: number;
  nivel: number;
  experiencia: number;
  experienciaProximoNivel: number;
  badges: Badge[];
  cursosCompletos: string[];
  cursosEmAndamento: CursoProgresso[];
  tempoEstudoTotal: number; // em minutos
  tempoEstudoSemana: number;
  metaSemanal: number;
  sequenciaEstudo: number; // dias consecutivos
  melhorSequencia: number;
  estatisticas: EstatisticasAprendizado;
  ultimaAtividade: Date;
}

export interface Badge {
  id: string;
  nome: string;
  descricao: string;
  icone: string;
  categoria: 'progresso' | 'conhecimento' | 'dedicacao' | 'conquista';
  raridade: 'comum' | 'raro' | 'epico' | 'lendario';
  dataConquista: Date;
  criterios: string[];
  pontuacao: number;
}

export interface CursoProgresso {
  cursoId: string;
  progresso: number; // 0-100
  tempoGasto: number; // em minutos
  ultimaSecao: string;
  dataInicio: Date;
  dataUltimaAtividade: Date;
  notaMedia: number;
  exerciciosCompletos: number;
  exerciciosTotal: number;
}

export interface EstatisticasAprendizado {
  topicosEstudados: string[];
  tempoMedioPorTopico: { [topico: string]: number };
  performancePorCategoria: { [categoria: string]: number };
  melhorHorarioEstudo: string;
  diasMaisAtivos: string[];
  tendenciaProgresso: 'crescente' | 'estavel' | 'decrescente';
}

export interface SistemaGamificacao {
  pontuacaoTotal: number;
  multiplicador: number;
  bonusAtivos: BonusAtivo[];
  desafios: Desafio[];
  ranking: RankingUsuario;
  recompensas: Recompensa[];
}

export interface BonusAtivo {
  id: string;
  nome: string;
  multiplicador: number;
  duracao: number; // em horas
  dataInicio: Date;
  dataExpiracao: Date;
  tipo: 'tempo' | 'sequencia' | 'performance' | 'especial';
}

export interface Desafio {
  id: string;
  nome: string;
  descricao: string;
  tipo: 'diario' | 'semanal' | 'mensal' | 'especial';
  objetivo: string;
  progresso: number;
  meta: number;
  recompensa: number; // pontos
  dataInicio: Date;
  dataLimite: Date;
  status: 'ativo' | 'completo' | 'expirado';
  dificuldade: 'facil' | 'medio' | 'dificil';
}

export interface RankingUsuario {
  posicao: number;
  pontuacao: number;
  categoria: string;
  periodo: 'semanal' | 'mensal' | 'anual' | 'geral';
  proximaPosicao?: {
    posicao: number;
    pontosNecessarios: number;
  };
}

export interface Recompensa {
  id: string;
  nome: string;
  descricao: string;
  tipo: 'badge' | 'pontos' | 'bonus' | 'conteudo_exclusivo';
  valor: number;
  requisitos: string[];
  disponivel: boolean;
  dataLiberacao?: Date;
}

export interface AvaliacaoProgresso {
  id: string;
  usuarioId: string;
  conteudoId: string;
  nota: number; // 1-5
  comentario?: string;
  tempoGasto: number;
  dataAvaliacao: Date;
  dificuldadePercebida: number; // 1-5
  utilidadePercebida: number; // 1-5
  recomendaria: boolean;
}

// Additional types for the education system
export interface TermoGlossario {
  id: string;
  termo: string;
  definicao: string;
  categoria: string;
  tags: string[];
  exemplos?: string[];
  termosRelacionados?: string[];
  dataAtualizacao: number;
}

export interface DicaFinanceira {
  id: string;
  titulo: string;
  conteudo: string;
  categoria: string;
  nivel: 'iniciante' | 'intermediario' | 'avancado';
  tags: string[];
  relevancia: number;
  visualizacoes: number;
  curtidas: number;
  dataPublicacao: number;
  contexto?: string;
}

export interface TutorialInterativo {
  id: string;
  titulo: string;
  descricao: string;
  categoria: string;
  nivel: 'iniciante' | 'intermediario' | 'avancado';
  duracao: number;
  passos: PassoTutorial[];
  objetivos: string[];
  prerequisitos: string[];
  tags: string[];
  visualizacoes: number;
  avaliacaoMedia: number;
  dataPublicacao: number;
}

export interface PassoTutorial {
  id: string;
  titulo: string;
  conteudo: string;
  tipo: 'texto' | 'video' | 'interativo' | 'quiz';
  ordem: number;
  tempoEstimado: number;
  recursos?: RecursoEducacional[];
}

export interface ArtigoEducativo {
  id: string;
  titulo: string;
  resumo: string;
  conteudo: string;
  categoria: string;
  nivel: 'iniciante' | 'intermediario' | 'avancado';
  tempoLeitura: number;
  tags: string[];
  autor: string;
  visualizacoes: number;
  avaliacaoMedia: number;
  dataPublicacao: number;
  ultimaAtualizacao: number;
}

export interface ConquistaEducativa {
  id: string;
  nome: string;
  descricao: string;
  icone: string;
  categoria: 'progresso' | 'conhecimento' | 'dedicacao' | 'conquista';
  raridade: 'comum' | 'raro' | 'epico' | 'lendario';
  criterios: CriterioConquista[];
  pontuacao: number;
  desbloqueada?: boolean;
  dataDesbloqueio?: number;
}

export interface CriterioConquista {
  tipo: 'tempo_estudo' | 'tutoriais_completos' | 'artigos_lidos' | 'sequencia_dias' | 'pontuacao_total' | 'pontuacao' | 'sequencia';
  valor: number;
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
    [area: string]: {
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
  tempoSessao: number;
  lembretes: boolean;
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
  progressoSemanal: ProgressoSemanal[];
}

export interface ProgressoSemanal {
  semana: string;
  tempoEstudo: number;
  tutoriaisCompletos: number;
  artigosLidos: number;
  pontuacaoGanha: number;
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
  id: string;
  tipo: 'tutorial' | 'artigo' | 'glossario' | 'quiz';
  conteudoId: string;
  titulo: string;
  tempoGasto: number;
  concluida: boolean;
  pontuacao: number;
  timestamp: number;
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
  conquistas: ConquistaHistorico[];
  marcos: MarcoEducativo[];
}

export interface ConquistaHistorico {
  conquistaId: string;
  dataDesbloqueio: number;
  contexto: string;
}

export interface MarcoEducativo {
  id: string;
  tipo: 'nivel_alcancado' | 'tempo_estudo' | 'sequencia_dias' | 'categoria_dominada';
  descricao: string;
  data: number;
  valor: number;
}

export interface RecomendacaoEducativa {
  id: string;
  tipo: 'tutorial' | 'artigo' | 'glossario';
  titulo: string;
  motivo: string;
  nivel: 'iniciante' | 'intermediario' | 'avancado';
  tempoEstimado: number;
  prioridade: number;
  relevancia: number;
  categoria: string;
}

export interface PesquisaEducativa {
  termo: string;
  filtros: {
    categoria?: string;
    nivel?: string;
    tipo?: string;
  };
  resultados: ResultadoPesquisa[];
  timestamp: number;
}

export interface ResultadoPesquisa {
  id: string;
  tipo: 'tutorial' | 'artigo' | 'termo' | 'dica';
  titulo: string;
  descricao: string;
  relevancia: number;
  categoria: string;
  nivel: string;
}

export interface ProgressoTutorial {
  tutorialId: string;
  passoAtual: number;
  passosCompletos: number[];
  tempoGasto: number;
  iniciado: number;
  ultimaAtividade: number;
  concluido: boolean;
}

export interface AvaliacaoTutorial {
  nota: number;
  comentario?: string;
  dificuldade: number;
  utilidade: number;
  recomendaria: boolean;
}