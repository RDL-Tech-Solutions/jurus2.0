import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, RotateCcw, FastForward, Info, X } from 'lucide-react';
import { SimulacaoInput, TaxaType } from '../types';
import { modalidadesPadrao } from '../constants';

interface ModoDemoProps {
  onSimulacaoChange: (simulacao: SimulacaoInput) => void;
  onCalcular: () => void;
  onFechar: () => void;
}

interface DemoStep {
  id: number;
  titulo: string;
  descricao: string;
  simulacao: SimulacaoInput;
  duracao: number; // em segundos
  destaque?: string;
}

const demoSteps: DemoStep[] = [
  {
    id: 1,
    titulo: "Investimento Conservador",
    descricao: "Vamos começar com um investimento conservador de R$ 1.000 inicial e R$ 500 mensais por 2 anos.",
    simulacao: {
      valorInicial: 1000,
      valorMensal: 500,
      periodo: 24,
      unidadePeriodo: 'meses',
      taxaType: 'banco' as TaxaType,
      modalidade: modalidadesPadrao[0], // Poupança
      percentualCdi: 100,
      taxaPersonalizada: 0,
      considerarInflacao: false,
      taxaInflacao: 0
    },
    duracao: 4,
    destaque: "Baixo risco, baixo retorno"
  },
  {
    id: 2,
    titulo: "Investimento Moderado",
    descricao: "Agora vamos ver um investimento moderado com CDB a 120% do CDI.",
    simulacao: {
      valorInicial: 1000,
      valorMensal: 500,
      periodo: 24,
      unidadePeriodo: 'meses',
      taxaType: 'cdi' as TaxaType,
      modalidade: modalidadesPadrao[1],
      percentualCdi: 120,
      taxaPersonalizada: 0,
      considerarInflacao: false,
      taxaInflacao: 0
    },
    duracao: 4,
    destaque: "Melhor rentabilidade com segurança"
  },
  {
    id: 3,
    titulo: "Investimento Agressivo",
    descricao: "Para quem busca maior rentabilidade, vamos simular um investimento em ações com 15% ao ano.",
    simulacao: {
      valorInicial: 1000,
      valorMensal: 500,
      periodo: 24,
      unidadePeriodo: 'meses',
      taxaType: 'personalizada' as TaxaType,
      modalidade: modalidadesPadrao[4], // Ações
      percentualCdi: 100,
      taxaPersonalizada: 15,
      considerarInflacao: false,
      taxaInflacao: 0
    },
    duracao: 4,
    destaque: "Alto risco, alto retorno"
  },
  {
    id: 4,
    titulo: "Longo Prazo",
    descricao: "Vamos ver o poder dos juros compostos em 10 anos com o mesmo investimento.",
    simulacao: {
      valorInicial: 1000,
      valorMensal: 500,
      periodo: 120,
      unidadePeriodo: 'meses',
      taxaType: 'personalizada' as TaxaType,
      modalidade: modalidadesPadrao[4],
      percentualCdi: 100,
      taxaPersonalizada: 15,
      considerarInflacao: false,
      taxaInflacao: 0
    },
    duracao: 4,
    destaque: "O tempo é seu melhor aliado"
  },
  {
    id: 5,
    titulo: "Impacto da Inflação",
    descricao: "Agora vamos considerar a inflação para ver o valor real do investimento.",
    simulacao: {
      valorInicial: 1000,
      valorMensal: 500,
      periodo: 120,
      unidadePeriodo: 'meses',
      taxaType: 'personalizada' as TaxaType,
      modalidade: modalidadesPadrao[4],
      percentualCdi: 100,
      taxaPersonalizada: 15,
      considerarInflacao: true,
      taxaInflacao: 4
    },
    duracao: 4,
    destaque: "Sempre considere a inflação"
  }
];

export function ModoDemo({ onSimulacaoChange, onCalcular, onFechar }: ModoDemoProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [timeLeft, setTimeLeft] = useState(demoSteps[0]?.duracao || 0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isPlaying && currentStep < demoSteps.length) {
      interval = setInterval(() => {
        setProgress(prev => {
          const newProgress = prev + (100 / (demoSteps[currentStep].duracao * 10));
          
          if (newProgress >= 100) {
            // Avançar para o próximo step
            if (currentStep < demoSteps.length - 1) {
              setCurrentStep(prev => prev + 1);
              setProgress(0);
              setTimeLeft(demoSteps[currentStep + 1]?.duracao || 0);
            } else {
              // Demo finalizada
              setIsPlaying(false);
              setProgress(100);
            }
            return 0;
          }
          
          setTimeLeft(Math.ceil((100 - newProgress) / 100 * demoSteps[currentStep].duracao));
          return newProgress;
        });
      }, 100);
    }

    return () => clearInterval(interval);
  }, [isPlaying, currentStep]);

  useEffect(() => {
    // Aplicar a simulação do step atual apenas quando o step muda
    if (demoSteps[currentStep]) {
      onSimulacaoChange(demoSteps[currentStep].simulacao);
      onCalcular();
    }
  }, [currentStep]); // Removemos as funções das dependências para evitar loop infinito

  const handlePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const handleReset = () => {
    setCurrentStep(0);
    setIsPlaying(false);
    setProgress(0);
    setTimeLeft(demoSteps[0]?.duracao || 0);
  };

  const handleNext = () => {
    if (currentStep < demoSteps.length - 1) {
      setCurrentStep(prev => prev + 1);
      setProgress(0);
      setTimeLeft(demoSteps[currentStep + 1]?.duracao || 0);
    }
  };

  const handleStepClick = (stepIndex: number) => {
    setCurrentStep(stepIndex);
    setProgress(0);
    setTimeLeft(demoSteps[stepIndex]?.duracao || 0);
    setIsPlaying(false);
  };

  const currentStepData = demoSteps[currentStep];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-10 h-10 bg-white/20 rounded-lg">
                <Play className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Modo Demonstração</h2>
                <p className="text-blue-100 text-sm">
                  Aprenda sobre investimentos com exemplos práticos
                </p>
              </div>
            </div>
            <button
              onClick={onFechar}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="px-6 py-4 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Etapa {currentStep + 1} de {demoSteps.length}
            </span>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {timeLeft}s restantes
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <motion.div
              className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.1 }}
            />
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <AnimatePresence mode="wait">
            {currentStepData && (
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold">
                    {currentStep + 1}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                      {currentStepData.titulo}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      {currentStepData.descricao}
                    </p>
                    {currentStepData.destaque && (
                      <div className="inline-flex items-center space-x-2 px-3 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400 rounded-full text-sm font-medium">
                        <Info className="w-4 h-4" />
                        <span>{currentStepData.destaque}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Simulação Details */}
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                    Parâmetros da Simulação:
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">Valor Inicial:</span>
                      <div className="font-medium">
                        R$ {currentStepData.simulacao.valorInicial.toLocaleString('pt-BR')}
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">Aporte Mensal:</span>
                      <div className="font-medium">
                        R$ {currentStepData.simulacao.valorMensal.toLocaleString('pt-BR')}
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">Período:</span>
                      <div className="font-medium">
                        {currentStepData.simulacao.periodo} meses
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">Investimento:</span>
                      <div className="font-medium">
                        {currentStepData.simulacao.modalidade?.nome || 'Personalizado'}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Steps Navigation */}
        <div className="px-6 py-4 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-center space-x-2 mb-4">
            {demoSteps.map((_, index) => (
              <button
                key={index}
                onClick={() => handleStepClick(index)}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === currentStep
                    ? 'bg-blue-500'
                    : index < currentStep
                    ? 'bg-green-500'
                    : 'bg-gray-300 dark:bg-gray-600'
                }`}
              />
            ))}
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center space-x-4">
            <button
              onClick={handleReset}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reiniciar</span>
            </button>

            <button
              onClick={handlePlay}
              className="flex items-center space-x-2 px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-colors"
            >
              {isPlaying ? (
                <>
                  <Pause className="w-4 h-4" />
                  <span>Pausar</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" />
                  <span>Reproduzir</span>
                </>
              )}
            </button>

            <button
              onClick={handleNext}
              disabled={currentStep >= demoSteps.length - 1}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FastForward className="w-4 h-4" />
              <span>Próximo</span>
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}