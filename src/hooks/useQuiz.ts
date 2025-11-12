import { useState, useCallback } from 'react';
import {
  Quiz,
  Question,
  QuestionAnswer,
  QuizResult,
} from '../types/educacaoFinanceira';

interface UseQuizReturn {
  currentQuiz: Quiz | null;
  currentQuestionIndex: number;
  answers: Map<string, QuestionAnswer>;
  isCompleted: boolean;
  score: number;
  startQuiz: (quiz: Quiz) => void;
  answerQuestion: (questionId: string, answer: number) => void;
  nextQuestion: () => void;
  finishQuiz: () => QuizResult | null;
  resetQuiz: () => void;
}

export const useQuiz = (): UseQuizReturn => {
  const [currentQuiz, setCurrentQuiz] = useState<Quiz | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Map<string, QuestionAnswer>>(new Map());
  const [startTime, setStartTime] = useState<Date | null>(null);

  const startQuiz = useCallback((quiz: Quiz) => {
    setCurrentQuiz(quiz);
    setCurrentQuestionIndex(0);
    setAnswers(new Map());
    setStartTime(new Date());
  }, []);

  const answerQuestion = useCallback((questionId: string, selectedAnswer: number) => {
    const answer: QuestionAnswer = {
      questionId,
      selectedAnswer,
      isCorrect: false, // Would need to check against correct answer
      timeSpent: 0, // Would calculate based on start time
      answeredAt: new Date(),
    };

    setAnswers(prev => new Map(prev.set(questionId, answer)));
  }, []);

  const nextQuestion = useCallback(() => {
    if (currentQuiz && currentQuestionIndex < currentQuiz.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  }, [currentQuiz, currentQuestionIndex]);

  const finishQuiz = useCallback((): QuizResult | null => {
    if (!currentQuiz || !startTime) return null;

    const endTime = new Date();
    const timeSpent = Math.floor((endTime.getTime() - startTime.getTime()) / 1000);

    const correctAnswers = Array.from(answers.values()).filter(a => a.isCorrect).length;
    const score = (correctAnswers / currentQuiz.questions.length) * 100;

    const result: QuizResult = {
      id: 'quiz-result-' + Date.now(),
      quizId: currentQuiz.id,
      userId: 'user',
      score,
      totalQuestions: currentQuiz.questions.length,
      correctAnswers,
      timeSpent,
      answers: Array.from(answers.values()),
      completedAt: endTime,
      xpEarned: Math.floor(score / 10),
      passed: score >= (currentQuiz.passingScore || 60),
    };

    return result;
  }, [currentQuiz, startTime, answers]);

  const resetQuiz = useCallback(() => {
    setCurrentQuiz(null);
    setCurrentQuestionIndex(0);
    setAnswers(new Map());
    setStartTime(null);
  }, []);

  return {
    currentQuiz,
    currentQuestionIndex,
    answers,
    isCompleted: currentQuiz ? currentQuestionIndex >= currentQuiz.questions.length : false,
    score: 0, // Would calculate based on answers
    startQuiz,
    answerQuestion,
    nextQuestion,
    finishQuiz,
    resetQuiz,
  };
};
