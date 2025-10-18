// Componente para Modo de Apresentação

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Presentation,
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Square,
  Maximize,
  Minimize,
  Settings,
  Volume2,
  VolumeX,
  Clock,
  Eye,
  EyeOff,
  MousePointer,
  Keyboard,
  Monitor,
  Smartphone,
  Tablet,
  Lightbulb,
  Target,
  TrendingUp,
  BarChart3,
  PieChart,
  Calculator,
  DollarSign,
  Percent,
  Calendar,
  ArrowRight,
  ArrowLeft,
  Home,
  X
} from 'lucide-react';
import { useSimulacao } from '../store/useAppStore';
import { AnimatedContainer, StaggeredContainer, AnimatedItem } from './AnimatedContainer';
import { AnimatedButton } from './AnimatedButton';

interface Slide {
  id: string;
  titulo: string;
  subtitulo?: string;
  conteudo: React.ReactNode;
  duracao?: number; // em segundos
  animacao?: 'fadeIn' | 'slideUp' | 'slideLeft' | 'slideRight' | 'scale' | 'flip';
  notas?: string;
  interativo?: boolean;
}

interface ConfiguracaoApresentacao {
  autoPlay: boolean;
  duracaoSlide: number;
  mostrarNotas: boolean;
  mostrarControles: boolean;
  mostrarProgresso: boolean;
  tema: 'claro' | 'escuro' | 'auto';
  tamanhoFonte: 'pequeno' | 'medio' | 'grande';
  animacoes: boolean;
  som: boolean;
  telaPadrao: 'desktop' | 'tablet' | 'mobile';
}

const ModoApresentacao: React.FC<{
  onFechar: () => void;
  simulacao?: any;
  resultado?: any;
}> = ({ onFechar, simulacao, resultado }) => {
  // Estados
  const [slideAtual, setSlideAtual] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [mostrarConfiguracoes, setMostrarConfiguracoes] = useState(false);
  const [configuracao, setConfiguracao] = useState<ConfiguracaoApresentacao>({
    autoPlay: false,
    duracaoSlide: 10,
    mostrarNotas: true,
    mostrarControles: true,
    mostrarProgresso: true,
    tema: 'auto',
    tamanhoFonte: 'medio',
    animacoes: true,
    som: false,
    telaPadrao: 'desktop'
  });

  // Slides da apresentação
  const slides: Slide[] = [
    {
      id: 'intro',
      titulo: 'Calculadora de Juros Compostos',
      subtitulo: 'Descubra o poder dos juros compostos',
      conteudo: (
        <div className="text-center space-y-8">
          <div className="text-6xl mb-8">💰</div>
          <div className="space-y-4">
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Uma ferramenta completa para simular e analisar investimentos
            </p>
            <div className="grid grid-cols-3 gap-6 mt-8">
              <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-xl">
                <Calculator className="w-8 h-8 text-blue-600 mx-auto mb-3" />
                <h3 className="font-semibold text-blue-900 dark:text-blue-100">Simulações</h3>
                <p className="text-sm text-blue-700 dark:text-blue-300">Cálculos precisos</p>
              </div>
              <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-xl">
                <BarChart3 className="w-8 h-8 text-green-600 mx-auto mb-3" />
                <h3 className="font-semibold text-green-900 dark:text-green-100">Análises</h3>
                <p className="text-sm text-green-700 dark:text-green-300">Insights detalhados</p>
              </div>
              <div className="bg-purple-50 dark:bg-purple-900/20 p-6 rounded-xl">
                <Target className="w-8 h-8 text-purple-600 mx-auto mb-3" />
                <h3 className="font-semibold text-purple-900 dark:text-purple-100">Metas</h3>
                <p className="text-sm text-purple-700 dark:text-purple-300">Planejamento</p>
              </div>
            </div>
          </div>
        </div>
      ),
      duracao: 15,
      animacao: 'fadeIn',
      notas: 'Slide de introdução apresentando a calculadora e suas principais funcionalidades.'
    },
    {
      id: 'conceito',
      titulo: 'O que são Juros Compostos?',
      subtitulo: 'Einstein chamou de "a oitava maravilha do mundo"',
      conteudo: (
        <div className="space-y-8">
          <div className="text-center">
            <div className="text-4xl mb-6">📈</div>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
              "Juros compostos são a força mais poderosa do universo" - Albert Einstein
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Juros Simples</h3>
              <div className="bg-red-50 dark:bg-red-900/20 p-6 rounded-xl">
                <div className="text-center">
                  <div className="text-3xl font-bold text-red-600 mb-2">R$ 1.500</div>
                  <p className="text-sm text-red-700 dark:text-red-300">Após 10 anos</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                    R$ 1.000 + (R$ 50 × 10 anos)
                  </p>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Juros Compostos</h3>
              <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-xl">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">R$ 1.629</div>
                  <p className="text-sm text-green-700 dark:text-green-300">Após 10 anos</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                    Juros sobre juros
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="text-center">
            <div className="inline-flex items-center bg-blue-50 dark:bg-blue-900/20 px-6 py-3 rounded-full">
              <Lightbulb className="w-5 h-5 text-blue-600 mr-2" />
              <span className="text-blue-800 dark:text-blue-200 font-medium">
                Diferença de R$ 129 em apenas 10 anos!
              </span>
            </div>
          </div>
        </div>
      ),
      duracao: 20,
      animacao: 'slideUp',
      notas: 'Explicação conceitual dos juros compostos com exemplo prático comparativo.'
    },
    {
      id: 'simulacao',
      titulo: 'Simulação Prática',
      subtitulo: simulacao ? 'Baseada nos seus dados' : 'Exemplo demonstrativo',
      conteudo: (
        <div className="space-y-8">
          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Parâmetros</h3>
              <div className="space-y-4">
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Valor Inicial</span>
                    <span className="font-semibold">
                      {simulacao ? `R$ ${simulacao.valorInicial.toLocaleString('pt-BR')}` : 'R$ 10.000'}
                    </span>
                  </div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Aporte Mensal</span>
                    <span className="font-semibold">
                      {simulacao ? `R$ ${simulacao.valorMensal.toLocaleString('pt-BR')}` : 'R$ 500'}
                    </span>
                  </div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Taxa de Juros</span>
                    <span className="font-semibold">
                      {simulacao?.modalidade?.taxaAnual ? `${simulacao.modalidade.taxaAnual}% a.a.` : '10% a.a.'}
                    </span>
                  </div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Período</span>
                    <span className="font-semibold">
                      {simulacao ? `${simulacao.periodo} meses` : '120 meses (10 anos)'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Resultados</h3>
              <div className="bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 p-6 rounded-xl">
                <div className="text-center space-y-4">
                  <div>
                    <div className="text-3xl font-bold text-green-600 mb-1">
                      {resultado ? `R$ ${resultado.saldoFinal.toLocaleString('pt-BR')}` : 'R$ 136.307'}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Valor Final</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="font-semibold text-blue-600">
                        {resultado ? `R$ ${resultado.totalInvestido?.toLocaleString('pt-BR')}` : 'R$ 70.000'}
                      </div>
                      <p className="text-gray-600 dark:text-gray-400">Total Investido</p>
                    </div>
                    <div>
                      <div className="font-semibold text-purple-600">
                        {resultado ? `R$ ${(resultado.saldoFinal - (resultado.totalInvestido || 0)).toLocaleString('pt-BR')}` : 'R$ 66.307'}
                      </div>
                      <p className="text-gray-600 dark:text-gray-400">Juros Ganhos</p>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t border-gray-200 dark:border-gray-600">
                    <div className="text-lg font-semibold text-orange-600">
                      {resultado ? `${((resultado.saldoFinal / (resultado.totalInvestido || 1) - 1) * 100).toFixed(1)}%` : '94.7%'}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Rentabilidade Total</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
      duracao: 25,
      animacao: 'slideLeft',
      notas: 'Demonstração prática com os dados da simulação atual ou exemplo padrão.',
      interativo: true
    },
    {
      id: 'grafico',
      titulo: 'Evolução do Investimento',
      subtitulo: 'Visualização da evolução ao longo do tempo',
      conteudo: (
        <div className="space-y-8">
          <div className="text-center mb-8">
            <PieChart className="w-16 h-16 text-blue-600 mx-auto mb-4" />
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Veja como seu dinheiro cresce exponencialmente
            </p>
          </div>
          
          {/* Simulação de gráfico */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
            <div className="h-64 flex items-end justify-between space-x-2">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((ano, index) => (
                <div key={ano} className="flex-1 flex flex-col items-center">
                  <div 
                    className="w-full bg-gradient-to-t from-blue-500 to-blue-300 rounded-t"
                    style={{ height: `${20 + (index * 8) + (index * index * 2)}px` }}
                  />
                  <span className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                    {ano}
                  </span>
                </div>
              ))}
            </div>
            <div className="text-center mt-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">Anos</p>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">5 anos</div>
              <p className="text-sm text-gray-600 dark:text-gray-400">R$ 77.641</p>
            </div>
            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
              <div className="text-2xl font-bold text-green-600">10 anos</div>
              <p className="text-sm text-gray-600 dark:text-gray-400">R$ 136.307</p>
            </div>
            <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">15 anos</div>
              <p className="text-sm text-gray-600 dark:text-gray-400">R$ 234.685</p>
            </div>
          </div>
        </div>
      ),
      duracao: 20,
      animacao: 'scale',
      notas: 'Visualização gráfica mostrando o crescimento exponencial do investimento.'
    },
    {
      id: 'dicas',
      titulo: 'Dicas para Maximizar seus Ganhos',
      subtitulo: 'Estratégias comprovadas para otimizar seus investimentos',
      conteudo: (
        <div className="space-y-8">
          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-xl">
                <div className="flex items-start space-x-4">
                  <div className="bg-green-100 dark:bg-green-800 p-2 rounded-lg">
                    <Clock className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-green-900 dark:text-green-100 mb-2">
                      Comece Cedo
                    </h3>
                    <p className="text-sm text-green-700 dark:text-green-300">
                      O tempo é seu maior aliado. Quanto mais cedo começar, maior será o impacto dos juros compostos.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-xl">
                <div className="flex items-start space-x-4">
                  <div className="bg-blue-100 dark:bg-blue-800 p-2 rounded-lg">
                    <Calendar className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                      Seja Consistente
                    </h3>
                    <p className="text-sm text-blue-700 dark:text-blue-300">
                      Aportes regulares, mesmo que pequenos, fazem uma grande diferença no longo prazo.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="bg-purple-50 dark:bg-purple-900/20 p-6 rounded-xl">
                <div className="flex items-start space-x-4">
                  <div className="bg-purple-100 dark:bg-purple-800 p-2 rounded-lg">
                    <TrendingUp className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-purple-900 dark:text-purple-100 mb-2">
                      Reinvista os Ganhos
                    </h3>
                    <p className="text-sm text-purple-700 dark:text-purple-300">
                      Não retire os rendimentos. Deixe-os trabalhando para você através dos juros compostos.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-orange-50 dark:bg-orange-900/20 p-6 rounded-xl">
                <div className="flex items-start space-x-4">
                  <div className="bg-orange-100 dark:bg-orange-800 p-2 rounded-lg">
                    <Target className="w-6 h-6 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-orange-900 dark:text-orange-100 mb-2">
                      Tenha Metas Claras
                    </h3>
                    <p className="text-sm text-orange-700 dark:text-orange-300">
                      Defina objetivos específicos e prazos. Isso ajuda a manter a disciplina e o foco.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="text-center">
            <div className="inline-flex items-center bg-yellow-50 dark:bg-yellow-900/20 px-6 py-3 rounded-full">
              <Lightbulb className="w-5 h-5 text-yellow-600 mr-2" />
              <span className="text-yellow-800 dark:text-yellow-200 font-medium">
                Lembre-se: Paciência e disciplina são as chaves do sucesso!
              </span>
            </div>
          </div>
        </div>
      ),
      duracao: 25,
      animacao: 'slideRight',
      notas: 'Dicas práticas e estratégias para maximizar os ganhos com investimentos.'
    },
    {
      id: 'conclusao',
      titulo: 'Comece Hoje Mesmo!',
      subtitulo: 'Sua jornada financeira começa agora',
      conteudo: (
        <div className="text-center space-y-8">
          <div className="text-6xl mb-8">🚀</div>
          
          <div className="space-y-6">
            <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">
              O melhor momento para investir foi há 20 anos.
            </h3>
            <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">
              O segundo melhor momento é agora!
            </h3>
          </div>
          
          <div className="grid grid-cols-3 gap-6 mt-12">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 p-6 rounded-xl">
              <Calculator className="w-8 h-8 text-blue-600 mx-auto mb-3" />
              <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">Simule</h4>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                Use nossa calculadora para planejar seus investimentos
              </p>
            </div>
            
            <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 p-6 rounded-xl">
              <Target className="w-8 h-8 text-green-600 mx-auto mb-3" />
              <h4 className="font-semibold text-green-900 dark:text-green-100 mb-2">Planeje</h4>
              <p className="text-sm text-green-700 dark:text-green-300">
                Defina metas claras e alcançáveis
              </p>
            </div>
            
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 p-6 rounded-xl">
              <TrendingUp className="w-8 h-8 text-purple-600 mx-auto mb-3" />
              <h4 className="font-semibold text-purple-900 dark:text-purple-100 mb-2">Execute</h4>
              <p className="text-sm text-purple-700 dark:text-purple-300">
                Coloque seu plano em ação hoje mesmo
              </p>
            </div>
          </div>
          
          <div className="mt-12">
            <AnimatedButton
              onClick={onFechar}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg"
            >
              <Calculator className="w-5 h-5 mr-2" />
              Começar a Calcular
            </AnimatedButton>
          </div>
        </div>
      ),
      duracao: 20,
      animacao: 'fadeIn',
      notas: 'Slide de conclusão motivacional incentivando o usuário a começar a investir.'
    }
  ];

  // Timer para auto-play
  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (isPlaying && configuracao.autoPlay) {
      const duracao = slides[slideAtual]?.duracao || configuracao.duracaoSlide;
      timer = setTimeout(() => {
        if (slideAtual < slides.length - 1) {
          setSlideAtual(prev => prev + 1);
        } else {
          setIsPlaying(false);
        }
      }, duracao * 1000);
    }
    
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isPlaying, slideAtual, configuracao.autoPlay, configuracao.duracaoSlide, slides]);

  // Controles de teclado
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case 'ArrowRight':
        case ' ':
          event.preventDefault();
          proximoSlide();
          break;
        case 'ArrowLeft':
          event.preventDefault();
          slideAnterior();
          break;
        case 'Escape':
          event.preventDefault();
          if (isFullscreen) {
            toggleFullscreen();
          } else {
            onFechar();
          }
          break;
        case 'f':
        case 'F':
          event.preventDefault();
          toggleFullscreen();
          break;
        case 'p':
        case 'P':
          event.preventDefault();
          togglePlay();
          break;
        case 'Home':
          event.preventDefault();
          setSlideAtual(0);
          break;
        case 'End':
          event.preventDefault();
          setSlideAtual(slides.length - 1);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen, onFechar]);

  // Funções de controle
  const proximoSlide = useCallback(() => {
    if (slideAtual < slides.length - 1) {
      setSlideAtual(prev => prev + 1);
    }
  }, [slideAtual, slides.length]);

  const slideAnterior = useCallback(() => {
    if (slideAtual > 0) {
      setSlideAtual(prev => prev - 1);
    }
  }, [slideAtual]);

  const togglePlay = useCallback(() => {
    setIsPlaying(prev => !prev);
  }, []);

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  }, []);

  const irParaSlide = useCallback((index: number) => {
    setSlideAtual(index);
    setIsPlaying(false);
  }, []);

  const slideAtualData = slides[slideAtual];
  const progresso = ((slideAtual + 1) / slides.length) * 100;

  return (
    <div className={`fixed inset-0 z-50 bg-white dark:bg-gray-900 ${
      configuracao.tema === 'escuro' ? 'dark' : configuracao.tema === 'claro' ? '' : ''
    }`}>
      {/* Barra de Progresso */}
      {configuracao.mostrarProgresso && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-gray-200 dark:bg-gray-700 z-10">
          <motion.div
            className="h-full bg-blue-600"
            initial={{ width: 0 }}
            animate={{ width: `${progresso}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      )}

      {/* Controles */}
      {configuracao.mostrarControles && (
        <div className="absolute top-4 right-4 z-10 flex items-center space-x-2">
          <AnimatedButton
            onClick={() => setMostrarConfiguracoes(!mostrarConfiguracoes)}
            variant="outline"
            size="sm"
            className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm"
          >
            <Settings className="w-4 h-4" />
          </AnimatedButton>
          
          <AnimatedButton
            onClick={toggleFullscreen}
            variant="outline"
            size="sm"
            className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm"
          >
            {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
          </AnimatedButton>
          
          <AnimatedButton
            onClick={onFechar}
            variant="outline"
            size="sm"
            className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm text-red-600 hover:bg-red-50"
          >
            <X className="w-4 h-4" />
          </AnimatedButton>
        </div>
      )}

      {/* Painel de Configurações */}
      <AnimatePresence>
        {mostrarConfiguracoes && (
          <motion.div
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 300 }}
            className="absolute top-16 right-4 w-80 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 p-6 z-20"
          >
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
              Configurações da Apresentação
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={configuracao.autoPlay}
                    onChange={(e) => setConfiguracao(prev => ({ ...prev, autoPlay: e.target.checked }))}
                    className="mr-2"
                  />
                  <span className="text-sm">Auto-play</span>
                </label>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Duração do Slide (segundos)</label>
                <input
                  type="range"
                  min="5"
                  max="30"
                  value={configuracao.duracaoSlide}
                  onChange={(e) => setConfiguracao(prev => ({ ...prev, duracaoSlide: Number(e.target.value) }))}
                  className="w-full"
                />
                <span className="text-xs text-gray-600 dark:text-gray-400">{configuracao.duracaoSlide}s</span>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Tamanho da Fonte</label>
                <select
                  value={configuracao.tamanhoFonte}
                  onChange={(e) => setConfiguracao(prev => ({ ...prev, tamanhoFonte: e.target.value as any }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm"
                >
                  <option value="pequeno">Pequeno</option>
                  <option value="medio">Médio</option>
                  <option value="grande">Grande</option>
                </select>
              </div>
              
              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={configuracao.mostrarNotas}
                    onChange={(e) => setConfiguracao(prev => ({ ...prev, mostrarNotas: e.target.checked }))}
                    className="mr-2"
                  />
                  <span className="text-sm">Mostrar notas</span>
                </label>
              </div>
              
              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={configuracao.animacoes}
                    onChange={(e) => setConfiguracao(prev => ({ ...prev, animacoes: e.target.checked }))}
                    className="mr-2"
                  />
                  <span className="text-sm">Animações</span>
                </label>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Conteúdo Principal */}
      <div className={`h-full flex flex-col ${
        configuracao.tamanhoFonte === 'pequeno' ? 'text-sm' :
        configuracao.tamanhoFonte === 'grande' ? 'text-lg' : 'text-base'
      }`}>
        {/* Slide */}
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="max-w-6xl w-full">
            <AnimatePresence mode="wait">
              <motion.div
                key={slideAtual}
                initial={configuracao.animacoes ? {
                  opacity: 0,
                  x: slideAtualData?.animacao === 'slideLeft' ? -100 : 
                     slideAtualData?.animacao === 'slideRight' ? 100 : 0,
                  y: slideAtualData?.animacao === 'slideUp' ? 100 : 0,
                  scale: slideAtualData?.animacao === 'scale' ? 0.8 : 1
                } : {}}
                animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
                exit={configuracao.animacoes ? {
                  opacity: 0,
                  x: slideAtualData?.animacao === 'slideLeft' ? 100 : 
                     slideAtualData?.animacao === 'slideRight' ? -100 : 0,
                  y: slideAtualData?.animacao === 'slideUp' ? -100 : 0,
                  scale: slideAtualData?.animacao === 'scale' ? 1.2 : 1
                } : {}}
                transition={{ duration: configuracao.animacoes ? 0.5 : 0 }}
                className="text-center"
              >
                <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-4">
                  {slideAtualData?.titulo}
                </h1>
                {slideAtualData?.subtitulo && (
                  <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-12">
                    {slideAtualData.subtitulo}
                  </p>
                )}
                <div className="mt-8">
                  {slideAtualData?.conteudo}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Controles de Navegação */}
        <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-t border-gray-200 dark:border-gray-700 p-4">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            {/* Navegação por Slides */}
            <div className="flex items-center space-x-2">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => irParaSlide(index)}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    index === slideAtual
                      ? 'bg-blue-600'
                      : 'bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500'
                  }`}
                />
              ))}
            </div>

            {/* Controles Centrais */}
            <div className="flex items-center space-x-4">
              <AnimatedButton
                onClick={slideAnterior}
                disabled={slideAtual === 0}
                variant="outline"
                size="sm"
              >
                <SkipBack className="w-4 h-4" />
              </AnimatedButton>
              
              <AnimatedButton
                onClick={togglePlay}
                variant="outline"
                size="sm"
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </AnimatedButton>
              
              <AnimatedButton
                onClick={proximoSlide}
                disabled={slideAtual === slides.length - 1}
                variant="outline"
                size="sm"
              >
                <SkipForward className="w-4 h-4" />
              </AnimatedButton>
            </div>

            {/* Informações */}
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {slideAtual + 1} / {slides.length}
            </div>
          </div>
        </div>

        {/* Notas do Apresentador */}
        {configuracao.mostrarNotas && slideAtualData?.notas && (
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border-t border-yellow-200 dark:border-yellow-800 p-4">
            <div className="max-w-6xl mx-auto">
              <div className="flex items-start space-x-2">
                <Eye className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-yellow-800 dark:text-yellow-200">
                  <strong>Nota:</strong> {slideAtualData.notas}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Atalhos de Teclado (Help) */}
      <div className="absolute bottom-4 left-4 text-xs text-gray-500 dark:text-gray-400">
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg p-2">
          <div className="flex items-center space-x-4">
            <span>← → Navegar</span>
            <span>Espaço Play/Pause</span>
            <span>F Tela Cheia</span>
            <span>Esc Sair</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModoApresentacao;