// Tipos para o sistema de educação financeira

export interface UserProgress {
  id: string;
  userId: string;
  totalXP: number;
  level: number;
  badges: string[];
  achievements: string[];
  completedLessons: string[];
  quizScores: Record<string, number>;
  streakDays: number;
  lastActivity: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'beginner' | 'intermediate' | 'advanced' | 'special';
  xpReward: number;
  criteria: Record<string, any>;
  unlockedAt?: Date;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  xpReward: number;
  criteria: Record<string, any>;
  progress: number;
  maxProgress: number;
  unlockedAt?: Date;
  isCompleted: boolean;
}

export const XP_SYSTEM = {
  LESSON_COMPLETED: 10,
  QUIZ_PASSED: 25,
  STREAK_BONUS: 5,
  BADGE_UNLOCKED: 50,
  ACHIEVEMENT_COMPLETED: 100,
  PERFECT_QUIZ: 50,
} as const;

export const DEFAULT_BADGES: Badge[] = [
  {
    id: 'first-lesson',
    name: 'Primeira Lição',
    description: 'Complete sua primeira lição de educação financeira',
    icon: '🎓',
    category: 'beginner',
    xpReward: 10,
    criteria: { lessonsCompleted: 1 },
  },
  {
    id: 'quiz-master',
    name: 'Mestre do Quiz',
    description: 'Acerte 100% em um quiz',
    icon: '🧠',
    category: 'intermediate',
    xpReward: 50,
    criteria: { perfectQuiz: true },
  },
];

export const EDUCATION_STORAGE_KEYS = {
  USER_PROGRESS: 'education_user_progress',
  QUIZ_RESULTS: 'education_quiz_results',
  LESSON_PROGRESS: 'education_lesson_progress',
  BADGES_EARNED: 'education_badges_earned',
  SIMULADOR_CONFIG: 'education_simulador_5030_config',
} as const;

export type DifficultyLevel = 'easy' | 'medium' | 'hard';

export interface Quiz {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: DifficultyLevel;
  questions: Question[];
  timeLimit?: number; // in minutes
  passingScore: number;
  xpReward: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Question {
  id: string;
  quizId: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  category: string;
  difficulty: DifficultyLevel;
  points: number;
}

export interface QuestionAnswer {
  questionId: string;
  selectedAnswer: number;
  isCorrect: boolean;
  timeSpent: number; // in seconds
  answeredAt: Date;
}

export interface QuizResult {
  id: string;
  quizId: string;
  userId: string;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  timeSpent: number;
  answers: QuestionAnswer[];
  completedAt: Date;
  xpEarned: number;
  passed: boolean;
}

export interface QuestionResult {
  question: Question;
  answer: QuestionAnswer;
  isCorrect: boolean;
  timeSpent: number;
}

export type MetodoPlanejamento = '503020' | '603010' | '702010' | '802000' | 'pay_yourself_first' | 'personalizado';

export interface ConfiguracaoPlanejamento {
  metodo: MetodoPlanejamento;
  necessidades: number;
  desejos: number;
  poupanca: number;
  isCustom?: boolean;
}

export const METODOS_PLANEJAMENTO = {
  '503020': {
    nome: '50/30/20',
    descricao: 'Clássico: 50% necessidades, 30% desejos, 20% poupança',
    necessidades: 50,
    desejos: 30,
    poupanca: 20,
  },
  '603010': {
    nome: '60/30/10',
    descricao: 'Conservador: 60% necessidades, 30% desejos, 10% poupança',
    necessidades: 60,
    desejos: 30,
    poupanca: 10,
  },
  '702010': {
    nome: '70/20/10',
    descricao: 'Equilibrado: 70% necessidades, 20% desejos, 10% poupança',
    necessidades: 70,
    desejos: 20,
    poupanca: 10,
  },
  '802000': {
    nome: '80/20/0',
    descricao: 'Agressivo: 80% necessidades, 20% desejos, sem poupança',
    necessidades: 80,
    desejos: 20,
    poupanca: 0,
  },
  'pay_yourself_first': {
    nome: 'Pague-se Primeiro',
    descricao: 'Priorize poupança: 20% poupança, depois divida o resto',
    necessidades: 64,
    desejos: 16,
    poupanca: 20,
  },
  'personalizado': {
    nome: 'Personalizado',
    descricao: 'Configure suas próprias porcentagens',
    necessidades: 50,
    desejos: 30,
    poupanca: 20,
  },
} as const;

// Tipos para o Simulador 50-30-20 (mantido para compatibilidade)
export interface SimuladorConfig {
  necessidades: number;
  desejos: number;
  poupanca: number;
  isCustom?: boolean;
}

export interface PieChartData {
  name: string;
  value: number;
  percentage: number;
  color: string;
}

export const DEFAULT_SIMULADOR_CONFIG: SimuladorConfig = {
  necessidades: 50,
  desejos: 30,
  poupanca: 20,
  isCustom: false,
};
