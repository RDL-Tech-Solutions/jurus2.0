import { useState, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DollarSign, TrendingUp, Percent, Target, Info, Sparkles } from 'lucide-react';
import { ResultadoSimulacao } from '../types';
import { formatarMoeda, formatarPercentual } from '../utils/calculations';
import { Tooltip } from './Tooltip';
import { useSkeletonLoading } from '../hooks/useLoadingStates';
import { SkeletonCard } from './SkeletonLoader';
import { StaggerContainer, StaggerItem } from './AnimatedWrapper';
import { cardHoverVariants, transitions } from '../utils/animations';

interface CardsResumoProps {
  resultado: ResultadoSimulacao | null;
  isLoading?: boolean;
  showSkeleton?: boolean;
}

const CardsResumoComponent = ({ resultado, isLoading = false, showSkeleton = false }: CardsResumoProps) => {
  const { showSkeleton: internalSkeleton } = useSkeletonLoading(150);
  const shouldShowSkeleton = showSkeleton || internalSkeleton;

  if (isLoading || !resultado || shouldShowSkeleton) {
    return <SkeletonCard />;
  }

  const cards = [
    {
      titulo: 'Saldo Final',
      valor: formatarMoeda(resultado.saldoFinal),
      icone: Target,
      cor: 'from-green-500 to-emerald-600',
      corHover: 'from-green-600 to-emerald-700',
      descricao: 'Valor total acumulado',
      tooltip: 'Este é o valor total que você terá ao final do período, incluindo o capital inicial, aportes mensais e todos os juros compostos.',
      destaque: true
    },
    {
      titulo: 'Total Investido',
      valor: formatarMoeda(resultado.totalInvestido),
      icone: DollarSign,
      cor: 'from-blue-500 to-cyan-600',
      corHover: 'from-blue-600 to-cyan-700',
      descricao: 'Capital + aportes mensais',
      tooltip: 'Soma do valor inicial investido mais todos os aportes mensais realizados durante o período.',
      destaque: false
    },
    {
      titulo: 'Juros Ganhos',
      valor: formatarMoeda(resultado.totalJuros),
      icone: TrendingUp,
      cor: 'from-purple-500 to-pink-600',
      corHover: 'from-purple-600 to-pink-700',
      descricao: 'Rendimento dos juros compostos',
      tooltip: 'Valor total ganho apenas com os juros compostos. Este é o "dinheiro extra" que seu investimento gerou.',
      destaque: false
    },
    {
      titulo: 'Rentabilidade',
      valor: formatarPercentual(resultado.rentabilidadeTotal),
      icone: Percent,
      cor: 'from-orange-500 to-red-600',
      corHover: 'from-orange-600 to-red-700',
      descricao: 'Retorno sobre investimento',
      tooltip: 'Percentual de retorno total sobre o valor investido. Mostra o quanto seu dinheiro rendeu em relação ao que foi aplicado.',
      destaque: false
    }
  ];

  return (
    <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, index) => (
        <StaggerItem key={card.titulo}>
          <motion.div
            variants={cardHoverVariants}
            initial="rest"
            whileHover="hover"
            className={`bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-700 transition-all duration-300 relative overflow-hidden group cursor-pointer ${
              card.destaque ? 'ring-2 ring-green-500/20' : ''
            }`}
          >
            {/* Efeito de brilho no hover */}
            <motion.div 
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12"
              initial={{ x: '-100%' }}
              whileHover={{ x: '100%' }}
              transition={{ duration: 0.8, ease: 'easeInOut' }}
            />
            
            {/* Destaque especial para o saldo final */}
            {card.destaque && (
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8, type: 'spring', stiffness: 200 }}
                className="absolute top-2 right-2"
              >
                <motion.div
                  animate={{ 
                    rotate: [0, 10, -10, 0],
                    scale: [1, 1.1, 1]
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    repeatDelay: 3
                  }}
                >
                  <Sparkles className="w-4 h-4 text-yellow-500" />
                </motion.div>
              </motion.div>
            )}
            
            <div className="flex items-center justify-between mb-4 relative z-10">
              <motion.div 
                className={`flex items-center justify-center w-12 h-12 bg-gradient-to-r ${card.cor} rounded-lg transition-all duration-300`}
                whileHover={{ 
                  rotate: [0, -5, 5, 0],
                  scale: 1.1,
                  backgroundImage: `linear-gradient(to right, ${card.corHover})`
                }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <card.icone className="w-6 h-6 text-white" />
              </motion.div>
              
              <Tooltip content={card.tooltip}>
                <motion.div
                  whileHover={{ scale: 1.2, rotate: 15 }}
                  transition={transitions.fast}
                >
                  <Info className="w-4 h-4 text-gray-400 hover:text-blue-500 transition-colors cursor-help" />
                </motion.div>
              </Tooltip>
            </div>
            
            <div className="space-y-2 relative z-10">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                {card.titulo}
              </h3>
              <motion.p 
                className="text-2xl font-bold text-gray-900 dark:text-white"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 + 0.3 }}
                whileHover={{ scale: 1.05 }}
              >
                {card.valor}
              </motion.p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {card.descricao}
              </p>
            </div>

            {/* Indicador de crescimento para valores positivos */}
            {(card.titulo === 'Juros Ganhos' || card.titulo === 'Rentabilidade') && resultado.totalJuros > 0 && (
              <motion.div
                initial={{ opacity: 0, x: 10, scale: 0 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                transition={{ delay: index * 0.1 + 0.5, type: 'spring' }}
                whileHover={{ scale: 1.2, y: -2 }}
                className="absolute bottom-2 right-2 flex items-center space-x-1 text-green-500"
              >
                <motion.div
                  animate={{ y: [0, -2, 0] }}
                  transition={{ 
                    duration: 1.5,
                    repeat: Infinity,
                    ease: 'easeInOut'
                  }}
                >
                  <TrendingUp className="w-3 h-3" />
                </motion.div>
                <span className="text-xs font-medium">+</span>
              </motion.div>
            )}

            {/* Pulse effect para o card em destaque */}
            {card.destaque && (
              <motion.div
                className="absolute inset-0 rounded-xl border-2 border-green-400/30"
                animate={{ 
                  scale: [1, 1.02, 1],
                  opacity: [0.3, 0.6, 0.3]
                }}
                transition={{ 
                  duration: 3,
                  repeat: Infinity,
                  ease: 'easeInOut'
                }}
              />
            )}
          </motion.div>
        </StaggerItem>
      ))}
    </StaggerContainer>
  );
};

export const CardsResumo = memo(CardsResumoComponent);