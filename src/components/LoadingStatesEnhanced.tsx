import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, TrendingUp, Calculator, BarChart3, Target, Zap } from 'lucide-react';

interface LoadingStatesEnhancedProps {
  isLoading: boolean;
  type?: 'calculation' | 'chart' | 'data' | 'analysis' | 'general';
  message?: string;
  progress?: number;
  showProgress?: boolean;
  size?: 'sm' | 'md' | 'lg';
  overlay?: boolean;
}

const loadingMessages = {
  calculation: [
    'Calculando juros compostos...',
    'Processando simulação...',
    'Analisando cenários...',
    'Otimizando resultados...'
  ],
  chart: [
    'Gerando gráficos...',
    'Processando dados visuais...',
    'Criando visualizações...',
    'Renderizando charts...'
  ],
  data: [
    'Carregando dados...',
    'Sincronizando informações...',
    'Atualizando base de dados...',
    'Processando requisição...'
  ],
  analysis: [
    'Analisando performance...',
    'Calculando métricas...',
    'Gerando insights...',
    'Processando análise...'
  ],
  general: [
    'Carregando...',
    'Processando...',
    'Aguarde...',
    'Finalizando...'
  ]
};

const loadingIcons = {
  calculation: Calculator,
  chart: BarChart3,
  data: TrendingUp,
  analysis: Target,
  general: Zap
};

export function LoadingStatesEnhanced({
  isLoading,
  type = 'general',
  message,
  progress,
  showProgress = false,
  size = 'md',
  overlay = false
}: LoadingStatesEnhancedProps) {
  const [currentMessageIndex, setCurrentMessageIndex] = React.useState(0);
  const [displayMessage, setDisplayMessage] = React.useState(message || loadingMessages[type][0]);

  const IconComponent = loadingIcons[type];

  // Rotacionar mensagens automaticamente
  React.useEffect(() => {
    if (!message && isLoading) {
      const interval = setInterval(() => {
        setCurrentMessageIndex((prev) => (prev + 1) % loadingMessages[type].length);
      }, 2000);

      return () => clearInterval(interval);
    }
  }, [isLoading, message, type]);

  React.useEffect(() => {
    if (!message) {
      setDisplayMessage(loadingMessages[type][currentMessageIndex]);
    }
  }, [currentMessageIndex, message, type]);

  const sizeClasses = {
    sm: {
      container: 'p-4',
      icon: 'w-6 h-6',
      text: 'text-sm',
      spinner: 'w-5 h-5'
    },
    md: {
      container: 'p-6',
      icon: 'w-8 h-8',
      text: 'text-base',
      spinner: 'w-6 h-6'
    },
    lg: {
      container: 'p-8',
      icon: 'w-12 h-12',
      text: 'text-lg',
      spinner: 'w-8 h-8'
    }
  };

  const currentSize = sizeClasses[size];

  const LoadingContent = () => (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.3 }}
      className={`
        flex flex-col items-center justify-center space-y-4 text-center
        ${currentSize.container}
        ${overlay ? 'bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-lg' : ''}
      `}
    >
      {/* Ícone animado */}
      <div className="relative">
        <motion.div
          animate={{ 
            rotate: 360,
            scale: [1, 1.1, 1]
          }}
          transition={{ 
            rotate: { duration: 2, repeat: Infinity, ease: "linear" },
            scale: { duration: 1, repeat: Infinity, ease: "easeInOut" }
          }}
          className={`
            ${currentSize.icon} text-blue-500 dark:text-blue-400
          `}
        >
          <IconComponent />
        </motion.div>

        {/* Spinner overlay */}
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          className={`
            absolute inset-0 ${currentSize.spinner} text-blue-300 dark:text-blue-600
          `}
        >
          <Loader2 />
        </motion.div>
      </div>

      {/* Mensagem animada */}
      <AnimatePresence mode="wait">
        <motion.div
          key={displayMessage}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className={`${currentSize.text} font-medium text-gray-700 dark:text-gray-300`}
        >
          {message || displayMessage}
        </motion.div>
      </AnimatePresence>

      {/* Barra de progresso */}
      {showProgress && typeof progress === 'number' && (
        <div className="w-full max-w-xs">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs text-gray-500 dark:text-gray-400">
              Progresso
            </span>
            <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
              {Math.round(progress)}%
            </span>
          </div>
          
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full relative"
            >
              {/* Efeito shimmer */}
              <motion.div
                animate={{ x: ['-100%', '100%'] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
              />
            </motion.div>
          </div>
        </div>
      )}

      {/* Pontos de loading */}
      <div className="flex space-x-1">
        {[0, 1, 2].map((index) => (
          <motion.div
            key={index}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.5, 1, 0.5]
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              delay: index * 0.2,
              ease: "easeInOut"
            }}
            className="w-2 h-2 bg-blue-500 dark:bg-blue-400 rounded-full"
          />
        ))}
      </div>
    </motion.div>
  );

  if (!isLoading) return null;

  if (overlay) {
    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm"
        >
          <LoadingContent />
        </motion.div>
      </AnimatePresence>
    );
  }

  return (
    <AnimatePresence>
      <LoadingContent />
    </AnimatePresence>
  );
}

// Componente específico para loading de cálculos
export function CalculationLoading({ 
  isLoading, 
  progress 
}: { 
  isLoading: boolean; 
  progress?: number; 
}) {
  return (
    <LoadingStatesEnhanced
      isLoading={isLoading}
      type="calculation"
      progress={progress}
      showProgress={typeof progress === 'number'}
      size="md"
      overlay={true}
    />
  );
}

// Componente específico para loading de gráficos
export function ChartLoading({ 
  isLoading 
}: { 
  isLoading: boolean; 
}) {
  return (
    <LoadingStatesEnhanced
      isLoading={isLoading}
      type="chart"
      size="lg"
    />
  );
}

// Componente específico para loading de dados
export function DataLoading({ 
  isLoading,
  message 
}: { 
  isLoading: boolean;
  message?: string;
}) {
  return (
    <LoadingStatesEnhanced
      isLoading={isLoading}
      type="data"
      message={message}
      size="sm"
    />
  );
}

export default LoadingStatesEnhanced;