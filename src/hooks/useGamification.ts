import { useState, useCallback } from 'react';
import {
  UserProgress,
  Badge,
  Achievement,
} from '../types/educacaoFinanceira';

interface UseGamificationReturn {
  userProgress: UserProgress;
  badges: Badge[];
  achievements: Achievement[];
  addXP: (amount: number, reason: string) => void;
  unlockBadge: (badgeId: string) => void;
  completeAchievement: (achievementId: string) => void;
  resetProgress: () => void;
}

const DEFAULT_USER_PROGRESS: UserProgress = {
  id: 'default',
  userId: 'user',
  totalXP: 0,
  level: 1,
  badges: [],
  achievements: [],
  completedLessons: [],
  quizScores: {},
  streakDays: 0,
  lastActivity: new Date(),
  createdAt: new Date(),
  updatedAt: new Date(),
};

const DEFAULT_BADGES: Badge[] = [
  {
    id: 'first-lesson',
    name: 'Primeira Lição',
    description: 'Complete sua primeira lição de educação financeira',
    icon: '🎓',
    category: 'beginner',
    xpReward: 10,
    criteria: { lessonsCompleted: 1 },
  },
];

const DEFAULT_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first-steps',
    name: 'Primeiros Passos',
    description: 'Complete sua primeira lição',
    icon: '🎯',
    category: 'beginner',
    xpReward: 10,
    criteria: { lessonsCompleted: 1 },
    progress: 0,
    maxProgress: 1,
    isCompleted: false,
  },
];

export const useGamification = (): UseGamificationReturn => {
  const [userProgress, setUserProgress] = useState<UserProgress>(DEFAULT_USER_PROGRESS);
  const [badges] = useState<Badge[]>(DEFAULT_BADGES);
  const [achievements] = useState<Achievement[]>(DEFAULT_ACHIEVEMENTS);

  const addXP = useCallback((amount: number, reason: string) => {
    setUserProgress(prev => ({
      ...prev,
      totalXP: prev.totalXP + amount,
      updatedAt: new Date(),
    }));
  }, []);

  const unlockBadge = useCallback((badgeId: string) => {
    setUserProgress(prev => ({
      ...prev,
      badges: [...prev.badges, badgeId],
      updatedAt: new Date(),
    }));
  }, []);

  const completeAchievement = useCallback((achievementId: string) => {
    setUserProgress(prev => ({
      ...prev,
      achievements: [...prev.achievements, achievementId],
      updatedAt: new Date(),
    }));
  }, []);

  const resetProgress = useCallback(() => {
    setUserProgress(DEFAULT_USER_PROGRESS);
  }, []);

  return {
    userProgress,
    badges,
    achievements,
    addXP,
    unlockBadge,
    completeAchievement,
    resetProgress,
  };
};
