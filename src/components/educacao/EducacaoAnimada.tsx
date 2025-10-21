// Seção de Educação Financeira Animada

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  TrendingUp,
  PiggyBank,
  Target,
  DollarSign,
  CreditCard,
  Wallet,
  TrendingDown,
  Shield,
  BookOpen,
  Lightbulb,
  CheckCircle,
  ArrowRight
} from 'lucide-react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { EDUCATION_CARDS } from '../../types/educacaoFinanceira';

interface EducationCardProps {
  card: typeof EDUCATION_CARDS[0];
  index: number;
  isActive: boolean;
  onClick: () => void;
}

const EducationCard: React.FC<EducationCardProps> = ({ card, index, isActive, onClick }) => {
  const IconComponent = {
    TrendingUp,
    PiggyBank,
    Target,
    DollarSign,
    CreditCard,
    Wallet,
    TrendingDown,
    Shield,
    BookOpen,
    Lightbulb
  }[card.icon] || BookOpen;

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      whileHover={{ scale: 1.02, y: -5 }}
      className="h-full"
    >
      <Card 
        className={`
          h-full p-6 cursor-pointer transition-all duration-300 border-2
          ${isActive 
            ? `border-${card.color}-500 bg-${card.color}-50 dark:bg-${card.color}-900/20 shadow-lg` 
            : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
          }
        `}
        onClick={onClick}
      >
        {/* Ícone Animado */}
        <motion.div
          className={`
            w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center
            bg-gradient-to-br from-${card.color}-400 to-${card.color}-600
          `}
          animate={isActive ? { 
            scale: [1, 1.1, 1],
            rotate: [0, 5, -5, 0]
          } : {}}
          transition={{ 
            duration: 2, 
            repeat: isActive ? Infinity : 0,
            repeatType: "reverse"
          }}
        >
          <IconComponent className="w-8 h-8 text-white" />
        </motion.div>

        {/* Título */}
        <h3 className={`
          text-xl font-bold text-center mb-3
          ${isActive ? `text-${card.color}-700 dark:text-${card.color}-300` : 'text-gray-900 dark:text-white'}
        `}>
          {card.title}
        </h3>

        {/* Descrição */}
        <p className="text-gray-600 dark:text-gray-400 text-center mb-4 leading-relaxed">
          {card.description}
        </p>

        {/* Badge de Categoria */}
        <div className="flex justify-center mb-4">
          <Badge 
            variant="secondary"
            className={`bg-${card.color}-100 text-${card.color}-700 dark:bg-${card.color}-900/30 dark:text-${card.color}-300`}
          >
            Educação Financeira
          </Badge>
        </div>

        {/* Indicador de Ativo */}
        <AnimatePresence>
          {isActive && (
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              className="flex justify-center"
            >
              <CheckCircle className={`w-6 h-6 text-${card.color}-600`} />
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </motion.div>
  );
};

interface EducationDetailProps {
  card: typeof EDUCATION_CARDS[0];
}

const EducationDetail: React.FC<EducationDetailProps> = ({ card }) => {
  const IconComponent = {
    TrendingUp,
    PiggyBank,
    Target,
    DollarSign,
    CreditCard,
    Wallet,
    TrendingDown,
    Shield,
    BookOpen,
    Lightbulb
  }[card.icon] || BookOpen;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.5 }}
      className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg border border-gray-200 dark:border-gray-700"
    >
      {/* Header */}
      <div className="flex items-center space-x-4 mb-6">
        <div className={`
          w-12 h-12 rounded-full flex items-center justify-center
          bg-gradient-to-br from-${card.color}-400 to-${card.color}-600
        `}>
          <IconComponent className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className={`text-2xl font-bold text-${card.color}-700 dark:text-${card.color}-300`}>
            {card.title}
          </h3>
          <Badge variant="outline" className="mt-1">
            Educação Financeira
          </Badge>
        </div>
      </div>

      {/* Descrição Detalhada */}
      <div className="mb-6">
        <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed">
          {card.description}
        </p>
      </div>

      {/* Dicas Práticas */}
      <div className="mb-6">
        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
          <Lightbulb className="w-5 h-5 mr-2 text-yellow-500" />
          Dicas Práticas
        </h4>
        <ul className="space-y-2">
          {card.tips.map((tip, index) => (
            <motion.li
              key={index}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-start space-x-3"
            >
              <CheckCircle className={`w-5 h-5 mt-0.5 text-${card.color}-500 flex-shrink-0`} />
              <span className="text-gray-600 dark:text-gray-400">{tip}</span>
            </motion.li>
          ))}
        </ul>
      </div>


    </motion.div>
  );
};

export const EducacaoAnimada: React.FC = () => {
  const [activeCard, setActiveCard] = useState<number>(0);
  const [completedCards, setCompletedCards] = useState<Set<number>>(new Set());

  const handleCardClick = (index: number) => {
    setActiveCard(index);
    setCompletedCards(prev => new Set([...prev, index]));
  };

  const handleNext = () => {
    if (activeCard < EDUCATION_CARDS.length - 1) {
      handleCardClick(activeCard + 1);
    }
  };

  const handlePrevious = () => {
    if (activeCard > 0) {
      handleCardClick(activeCard - 1);
    }
  };

  const progressPercentage = (completedCards.size / EDUCATION_CARDS.length) * 100;

  return (
    <div className="space-y-8">
      {/* Header com Progresso */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Educação Financeira Animada
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-400 mb-6 max-w-2xl mx-auto">
          Aprenda conceitos fundamentais através de explicações visuais e interativas
        </p>
        
        {/* Barra de Progresso */}
        <div className="max-w-md mx-auto">
          <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
            <span>Progresso</span>
            <span>{Math.round(progressPercentage)}%</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <motion.div
              className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>
      </motion.div>

      {/* Grid de Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {EDUCATION_CARDS.map((card, index) => (
          <EducationCard
            key={index}
            card={card}
            index={index}
            isActive={activeCard === index}
            onClick={() => handleCardClick(index)}
          />
        ))}
      </div>

      {/* Detalhes do Card Ativo */}
      <AnimatePresence mode="wait">
        <EducationDetail
          key={activeCard}
          card={EDUCATION_CARDS[activeCard]}
        />
      </AnimatePresence>

      {/* Navegação */}
      <div className="flex justify-between items-center">
        <Button
          onClick={handlePrevious}
          disabled={activeCard === 0}
          variant="outline"
          className="flex items-center space-x-2"
        >
          <ArrowRight className="w-4 h-4 rotate-180" />
          <span>Anterior</span>
        </Button>

        <div className="flex space-x-2">
          {EDUCATION_CARDS.map((_, index) => (
            <button
              key={index}
              onClick={() => handleCardClick(index)}
              className={`
                w-3 h-3 rounded-full transition-all duration-200
                ${activeCard === index
                  ? 'bg-blue-600 scale-125'
                  : completedCards.has(index)
                  ? 'bg-green-500'
                  : 'bg-gray-300 dark:bg-gray-600'
                }
              `}
              aria-label={`Ir para conceito ${index + 1}`}
            />
          ))}
        </div>

        <Button
          onClick={handleNext}
          disabled={activeCard === EDUCATION_CARDS.length - 1}
          className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700"
        >
          <span>Próximo</span>
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>

      {/* Estatísticas */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8"
      >
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {completedCards.size}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Conceitos Aprendidos
          </div>
        </Card>
        
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">
            {EDUCATION_CARDS.length}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Total de Conceitos
          </div>
        </Card>
        
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
            {Math.round(progressPercentage)}%
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Progresso Completo
          </div>
        </Card>
      </motion.div>
    </div>
  );
};