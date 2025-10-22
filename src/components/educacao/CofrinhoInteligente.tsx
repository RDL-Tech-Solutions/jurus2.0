import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { PiggyBank, TrendingUp, Settings, RotateCcw, Save, Download, Trash2, Star, Target, DollarSign, Calendar, TrendingDown, AlertTriangle, CheckCircle, BarChart3, PieChart as PieChartIcon, Activity, Percent, Calculator, Lightbulb, HelpCircle, Loader2, Trophy, Award, Medal, Bell, Zap, Shield, Crown, Gift } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';
import { Slider } from '../ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Switch } from '../ui/switch';
import { Progress } from '../ui/progress';
import { useCofrinho } from '../../hooks/useCofrinho';
import { formatCurrency, formatPercentage } from '../../utils/educacaoFinanceiraCalculos';

// Componente de Tooltip personalizado
const InfoTooltip = ({ content, children }: { content: string; children: React.ReactNode }) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className="relative inline-block">
      <div
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        className="cursor-help"
      >
        {children}
      </div>
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute z-50 px-3 py-2 text-sm text-white bg-gray-900 rounded-lg shadow-lg -top-12 left-1/2 transform -translate-x-1/2 whitespace-nowrap max-w-xs"
          >
            {content}
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Componente de Loading
const LoadingSpinner = ({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8'
  };

  return (
    <div className="flex items-center justify-center">
      <Loader2 className={`${sizeClasses[size]} animate-spin text-blue-600`} />
    </div>
  );
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
        <p className="font-semibold text-gray-900 dark:text-white">Mês {label}</p>
        <p className="text-sm text-blue-600 dark:text-blue-400">
          Cofrinho: {formatCurrency(payload[0]?.value || 0)}
        </p>
        {payload[1] && (
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Poupança: {formatCurrency(payload[1].value)}
          </p>
        )}
      </div>
    );
  }
  return null;
};

const PRODUCT_FEATURES = [
  "Rendimento de 120% do CDI",
  "Liquidez diária",
  "Sem taxa de administração",
  "Proteção do FGC até R$ 250.000",
  "Aplicação mínima de R$ 1,00"
];

// Opções de investimento para comparação
const INVESTMENT_OPTIONS = [
  {
    id: 'poupanca',
    name: 'Poupança',
    rate: 0.005, // 0.5% ao mês
    color: '#8B5CF6',
    description: 'Tradicional e segura'
  },
  {
    id: 'cdi',
    name: 'CDI 100%',
    rate: 0.01, // 1% ao mês
    color: '#10B981',
    description: 'Renda fixa conservadora'
  },
  {
    id: 'cofrinho',
    name: 'Cofrinho (120% CDI)',
    rate: 0.012, // 1.2% ao mês
    color: '#3B82F6',
    description: 'Nosso produto'
  },
  {
    id: 'tesouro',
    name: 'Tesouro Direto',
    rate: 0.008, // 0.8% ao mês
    color: '#F59E0B',
    description: 'Governo federal'
  }
];

// Cenários de simulação
const SCENARIOS = [
  {
    id: 'pessimista',
    name: 'Pessimista',
    multiplier: 0.7,
    color: '#EF4444',
    description: 'Cenário conservador com rendimentos menores'
  },
  {
    id: 'realista',
    name: 'Realista',
    multiplier: 1.0,
    color: '#10B981',
    description: 'Cenário baseado nas condições atuais'
  },
  {
    id: 'otimista',
    name: 'Otimista',
    multiplier: 1.3,
    color: '#3B82F6',
    description: 'Cenário com melhores condições de mercado'
  }
];

// Metas financeiras predefinidas
const FINANCIAL_GOALS = [
  {
    id: 'emergency',
    name: 'Reserva de Emergência',
    description: '6 meses de gastos',
    icon: AlertTriangle,
    color: 'orange'
  },
  {
    id: 'vacation',
    name: 'Viagem dos Sonhos',
    description: 'Aquela viagem especial',
    icon: Calendar,
    color: 'blue'
  },
  {
    id: 'house',
    name: 'Casa Própria',
    description: 'Entrada para financiamento',
    icon: Target,
    color: 'green'
  },
  {
    id: 'retirement',
    name: 'Aposentadoria',
    description: 'Independência financeira',
    icon: TrendingUp,
    color: 'purple'
  }
];

// Sistema de Conquistas e Badges
const ACHIEVEMENTS = [
  {
    id: 'first_simulation',
    name: 'Primeiro Passo',
    description: 'Realizou sua primeira simulação',
    icon: Trophy,
    color: 'text-yellow-500',
    bgColor: 'bg-yellow-100',
    requirement: 'simulation_count >= 1'
  },
  {
    id: 'consistent_saver',
    name: 'Poupador Consistente',
    description: 'Configurou aportes mensais regulares',
    icon: Medal,
    color: 'text-blue-500',
    bgColor: 'bg-blue-100',
    requirement: 'monthly_contribution > 0'
  },
  {
    id: 'goal_setter',
    name: 'Planejador',
    description: 'Criou sua primeira meta financeira',
    icon: Target,
    color: 'text-green-500',
    bgColor: 'bg-green-100',
    requirement: 'goals_count >= 1'
  },
  {
    id: 'long_term_investor',
    name: 'Investidor de Longo Prazo',
    description: 'Simulou investimento por mais de 5 anos',
    icon: Crown,
    color: 'text-purple-500',
    bgColor: 'bg-purple-100',
    requirement: 'investment_months >= 60'
  },
  {
    id: 'high_saver',
    name: 'Grande Poupador',
    description: 'Configurou aportes acima de R$ 1.000',
    icon: Award,
    color: 'text-orange-500',
    bgColor: 'bg-orange-100',
    requirement: 'monthly_contribution >= 1000'
  },
  {
    id: 'scenario_explorer',
    name: 'Explorador de Cenários',
    description: 'Testou diferentes cenários de investimento',
    icon: Activity,
    color: 'text-indigo-500',
    bgColor: 'bg-indigo-100',
    requirement: 'scenarios_tested >= 3'
  }
];

// Calculadora de Aposentadoria
const RETIREMENT_SCENARIOS = [
  {
    id: 'conservative',
    name: 'Conservador',
    monthlyReturn: 0.008, // 0.8% ao mês
    returnRate: 0.06, // 6% ao ano
    description: 'Investimentos de baixo risco',
    icon: Shield
  },
  {
    id: 'moderate',
    name: 'Moderado',
    monthlyReturn: 0.012, // 1.2% ao mês
    returnRate: 0.08, // 8% ao ano
    description: 'Mix de renda fixa e variável',
    icon: TrendingUp
  },
  {
    id: 'aggressive',
    name: 'Agressivo',
    monthlyReturn: 0.015, // 1.5% ao mês
    returnRate: 0.12, // 12% ao ano
    description: 'Foco em renda variável',
    icon: Activity
  }
];

// Análise de Risco
const RISK_FACTORS = [
  {
    id: 'market_volatility',
    name: 'Volatilidade do Mercado',
    impact: 'medium',
    description: 'Oscilações podem afetar rendimentos',
    mitigation: 'Diversificação de investimentos'
  },
  {
    id: 'inflation',
    name: 'Inflação',
    impact: 'high',
    description: 'Pode corroer o poder de compra',
    mitigation: 'Investimentos que superam a inflação'
  },
  {
    id: 'liquidity',
    name: 'Liquidez',
    impact: 'low',
    description: 'Facilidade para resgatar o dinheiro',
    mitigation: 'Manter reserva de emergência'
  }
];

export const CofrinhoInteligente: React.FC = () => {
  const {
    // Estados
    valorInicial,
    tempoMeses,
    aporteMensal,

    
    // Funções
    setValorInicial,
    setTempoMeses,
    setAporteMensal,
    validateInputs,
    calculateSimulation,
    saveSimulation,
    removeSimulation,
    loadSimulation,
    updateCdiConfig,
    resetCdiConfig,
    clearAll,
    
    // Dados computados
    calculations,
    comparison,
    formattedData,
    historyStats,
    cdiConfig,
    history
  } = useCofrinho();

  const [showCdiConfig, setShowCdiConfig] = useState(false);
  const [tempCdiConfig, setTempCdiConfig] = useState(cdiConfig);
  const [showHistory, setShowHistory] = useState(false);
  
  // Novos estados para funcionalidades avançadas
  const [activeTab, setActiveTab] = useState('simulator');
  const [selectedInvestments, setSelectedInvestments] = useState(['cofrinho', 'poupanca']);
  const [selectedScenario, setSelectedScenario] = useState('realista');
  const [chartType, setChartType] = useState('line');
  const [showInflation, setShowInflation] = useState(false);
  const [inflationRate, setInflationRate] = useState('4.5');
  
  // Estados para metas financeiras
  const [financialGoals, setFinancialGoals] = useState<any[]>([]);
  const [newGoal, setNewGoal] = useState({
    name: '',
    description: '',
    targetAmount: '',
    currentAmount: '0',
    deadline: '',
    priority: 'media',
    progress: 0
  });
  const [goalCalculator, setGoalCalculator] = useState({
    targetAmount: '',
    months: '',
    initialAmount: ''
  });
  
  // Estados para UX
  const [isLoading, setIsLoading] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);
  
  // Estados para funcionalidades avançadas
  const [achievements, setAchievements] = useState<string[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [retirementCalculator, setRetirementCalculator] = useState({
    currentAge: '',
    retirementAge: '',
    monthlyExpenses: '',
    currentSavings: '',
    scenario: 'moderate',
    result: null as any
  });
  const [riskProfile, setRiskProfile] = useState({
    tolerance: 'medium',
    timeHorizon: 'medium',
    experience: 'beginner'
  });
  const [comparisonMode, setComparisonMode] = useState(false);
  const [scenariosTestedCount, setScenariosTestedCount] = useState(0);

  const handleSaveCdiConfig = () => {
    updateCdiConfig(tempCdiConfig);
    setShowCdiConfig(false);
  };

  // Função para verificar conquistas
  const checkAchievements = () => {
    const newAchievements: string[] = [];
    const monthlyContribution = parseFloat(aporteMensal.replace(',', '.')) || 0;
    const investmentMonths = parseInt(tempoMeses) || 0;
    
    // Verificar cada conquista
    if (calculations && !achievements.includes('first_simulation')) {
      newAchievements.push('first_simulation');
    }
    
    if (monthlyContribution > 0 && !achievements.includes('consistent_saver')) {
      newAchievements.push('consistent_saver');
    }
    
    if (financialGoals.length >= 1 && !achievements.includes('goal_setter')) {
      newAchievements.push('goal_setter');
    }
    
    if (investmentMonths >= 60 && !achievements.includes('long_term_investor')) {
      newAchievements.push('long_term_investor');
    }
    
    if (monthlyContribution >= 1000 && !achievements.includes('high_saver')) {
      newAchievements.push('high_saver');
    }
    
    if (scenariosTestedCount >= 3 && !achievements.includes('scenario_explorer')) {
      newAchievements.push('scenario_explorer');
    }
    
    if (newAchievements.length > 0) {
      setAchievements(prev => [...prev, ...newAchievements]);
      // Adicionar notificação de conquista
      newAchievements.forEach(achievementId => {
        const achievement = ACHIEVEMENTS.find(a => a.id === achievementId);
        if (achievement) {
          addNotification({
            type: 'achievement',
            title: `Conquista Desbloqueada: ${achievement.name}!`,
            message: achievement.description,
            icon: achievement.icon
          });
        }
      });
    }
  };

  // Função para adicionar notificação
  const addNotification = (notification: any) => {
    const newNotification = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      ...notification
    };
    setNotifications(prev => [newNotification, ...prev.slice(0, 4)]); // Manter apenas 5 notificações
  };

  // Função para calcular aposentadoria
  const calculateRetirement = () => {
    const currentAge = parseInt(retirementCalculator.currentAge) || 0;
    const retirementAge = parseInt(retirementCalculator.retirementAge) || 65;
    const monthlyExpenses = parseFloat(retirementCalculator.monthlyExpenses.replace(',', '.')) || 0;
    const currentSavings = parseFloat(retirementCalculator.currentSavings.replace(',', '.')) || 0;
    const scenario = RETIREMENT_SCENARIOS.find(s => s.id === retirementCalculator.scenario);
    
    const yearsToRetirement = retirementAge - currentAge;
    const monthsToRetirement = yearsToRetirement * 12;
    const monthlyReturn = scenario?.monthlyReturn || 0.01;
    
    // Calcular valor necessário para aposentadoria (25x gastos anuais)
    const targetAmount = monthlyExpenses * 12 * 25;
    
    // Calcular quanto precisa poupar mensalmente
    const futureValueCurrentSavings = currentSavings * Math.pow(1 + monthlyReturn, monthsToRetirement);
    const remainingAmount = targetAmount - futureValueCurrentSavings;
    
    const monthlyContributionNeeded = remainingAmount > 0 
      ? (remainingAmount * monthlyReturn) / (Math.pow(1 + monthlyReturn, monthsToRetirement) - 1)
      : 0;
    
    return {
      targetAmount,
      monthlyContributionNeeded,
      yearsToRetirement,
      futureValueCurrentSavings,
      scenario: scenario?.name || 'Moderado'
    };
  };

  // Função para análise de risco personalizada
  const calculatePersonalizedRisk = () => {
    const monthlyContribution = parseFloat(aporteMensal.replace(',', '.')) || 0;
    const investmentMonths = parseInt(tempoMeses) || 0;
    const initialAmount = parseFloat(valorInicial.replace(',', '.')) || 0;
    
    let riskScore = 0;
    const risks = [];
    
    // Análise baseada no perfil
    if (riskProfile.tolerance === 'low') riskScore += 1;
    else if (riskProfile.tolerance === 'high') riskScore += 3;
    else riskScore += 2;
    
    if (investmentMonths < 12) {
      risks.push({
        type: 'Prazo Curto',
        level: 'high',
        description: 'Investimentos de curto prazo têm maior volatilidade'
      });
    }
    
    if (monthlyContribution === 0) {
      risks.push({
        type: 'Sem Aportes Regulares',
        level: 'medium',
        description: 'Aportes regulares reduzem o risco de timing'
      });
    }
    
    if (initialAmount > monthlyContribution * 12) {
      risks.push({
        type: 'Concentração Inicial',
        level: 'low',
        description: 'Grande valor inicial pode ser afetado por volatilidade'
      });
    }
    
    return {
      riskScore,
      risks,
      recommendation: riskScore <= 2 ? 'Conservador' : riskScore <= 4 ? 'Moderado' : 'Agressivo'
    };
  };

  // Effect para verificar conquistas
  useEffect(() => {
    checkAchievements();
  }, [calculations, financialGoals, aporteMensal, tempoMeses, scenariosTestedCount]);

  // Effect para atualizar cenários testados
  useEffect(() => {
    if (selectedScenario !== 'realista') {
      setScenariosTestedCount(prev => prev + 1);
    }
  }, [selectedScenario]);

  // Função para calcular comparação entre investimentos
  const calculateInvestmentComparison = () => {
    const inicial = parseFloat(valorInicial.replace(',', '.')) || 0;
    const aporte = parseFloat(aporteMensal.replace(',', '.')) || 0;
    const meses = parseInt(tempoMeses) || 12;
    const scenario = SCENARIOS.find(s => s.id === selectedScenario);
    
    return selectedInvestments.map(investmentId => {
      const investment = INVESTMENT_OPTIONS.find(inv => inv.id === investmentId);
      if (!investment) return null;
      
      const adjustedRate = investment.rate * (scenario?.multiplier || 1);
      let total = inicial;
      const monthlyData = [];
      
      for (let month = 1; month <= meses; month++) {
        total = total * (1 + adjustedRate) + aporte;
        monthlyData.push({
          month,
          [investment.name]: total,
          investment: investment.name
        });
      }
      
      return {
        ...investment,
        finalAmount: total,
        totalContributed: inicial + (aporte * meses),
        totalReturn: total - (inicial + (aporte * meses)),
        monthlyData
      };
    }).filter(Boolean);
  };

  // Função para calcular projeção com inflação
  const calculateInflationAdjusted = (amount: number) => {
    const inflation = parseFloat(inflationRate) / 100 / 12; // Taxa mensal
    const meses = parseInt(tempoMeses) || 12;
    return amount / Math.pow(1 + inflation, meses);
  };

  // Função para gerar dados do gráfico com inflação
  const generateInflationChartData = () => {
    const meses = parseInt(tempoMeses) || 12;
    const inicial = parseFloat(valorInicial) || 0;
    const aporte = parseFloat(aporteMensal) || 0;
    
    return Array.from({ length: meses }, (_, index) => {
      const mes = index + 1;
      const totalSemInflacao = inicial + (aporte * mes);
      const totalComInflacao = calculateInflationAdjusted(totalSemInflacao);
      
      return {
        mes,
        semInflacao: totalSemInflacao,
        comInflacao: totalComInflacao
      };
    });
  };

  // Função para gerar dados de cenários
  const generateScenarioData = () => {
    const meses = parseInt(tempoMeses) || 12;
    const inicial = parseFloat(valorInicial) || 0;
    const aporte = parseFloat(aporteMensal) || 0;
    
    return Array.from({ length: meses }, (_, index) => {
      const mes = index + 1;
      const baseValue = inicial + (aporte * mes);
      
      return {
        mes,
        pessimista: baseValue * 0.7,
        realista: baseValue,
        otimista: baseValue * 1.3
      };
    });
  };

  // Função para calcular perfil de risco detalhado
  const calculateRiskProfile = () => {
    const { tolerance, timeHorizon, experience } = riskProfile;
    
    let level = 'medium';
    let description = '';
    let recommendations: string[] = [];
    
    if (tolerance === 'low' || timeHorizon === 'short' || experience === 'beginner') {
      level = 'low';
      description = 'Perfil conservador, priorizando segurança e preservação do capital.';
      recommendations = [
        'Foque em renda fixa',
        'Mantenha reserva de emergência',
        'Diversifique os investimentos'
      ];
    } else if (tolerance === 'high' && timeHorizon === 'long' && experience === 'advanced') {
      level = 'high';
      description = 'Perfil agressivo, buscando maiores retornos com tolerância a volatilidade.';
      recommendations = [
        'Considere renda variável',
        'Invista a longo prazo',
        'Monitore regularmente'
      ];
    } else {
      level = 'medium';
      description = 'Perfil moderado, equilibrando segurança e rentabilidade.';
      recommendations = [
        'Mix de renda fixa e variável',
        'Rebalanceie periodicamente',
        'Acompanhe o mercado'
      ];
    }
    
    return { level, description, recommendations };
  };

  // Função para adicionar meta financeira
  const addFinancialGoal = async () => {
    if (newGoal.name && newGoal.targetAmount && newGoal.deadline) {
      setIsLoading(true);
      
      // Simular delay de processamento
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const goal = {
        id: Date.now().toString(),
        ...newGoal,
        targetAmount: parseFloat(newGoal.targetAmount.replace(',', '.')) || 0,
        createdAt: new Date().toISOString()
      };
      setFinancialGoals(prev => [...prev, goal]);
      setNewGoal({
        name: '',
        targetAmount: '',
        deadline: '',
        description: '',
        currentAmount: '0',
        priority: 'medium',
        progress: 0
      });
      setIsLoading(false);
    }
  };

  // Função para remover meta financeira
  const removeFinancialGoal = (id: string) => {
    setFinancialGoals(prev => prev.filter(goal => goal.id !== id));
  };

  // Função para calcular tempo necessário para atingir meta
  const calculateTimeToGoal = (targetAmount: number) => {
    const inicial = parseFloat(valorInicial.replace(',', '.')) || 0;
    const aporte = parseFloat(aporteMensal.replace(',', '.')) || 0;
    const rate = 0.012; // 1.2% ao mês (120% CDI)
    
    if (aporte === 0) {
      return Math.log(targetAmount / inicial) / Math.log(1 + rate);
    }
    
    // Fórmula para anuidade com valor presente
    const months = Math.log((targetAmount * rate / aporte) + 1) / Math.log(1 + rate);
    return Math.ceil(months);
  };

  const handleExportData = () => {
    const exportData = {
      valorInicial,
      tempoMeses,
      aporteMensal,
      calculations,
      cdiConfig,
      history,
      financialGoals,
      selectedInvestments,
      selectedScenario,
      timestamp: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { 
      type: 'application/json' 
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cofrinho-inteligente-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Cofrinho Inteligente
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Simule o crescimento dos seus investimentos com rendimento de 120% do CDI. 
            Compare com outros investimentos e defina suas metas financeiras!
          </p>
        </motion.div>
      </div>

      {/* Características do Produto */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <Card className="bg-gradient-to-r from-blue-50 to-green-50 dark:from-blue-900/20 dark:to-green-900/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5 text-yellow-500" />
              Características do Cofrinho Inteligente
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {PRODUCT_FEATURES.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="flex items-center gap-2"
                >
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-gray-700 dark:text-gray-300">{feature}</span>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Interface com Abas */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 sm:grid-cols-6 gap-0.5 sm:gap-1 overflow-x-auto">
          <TabsTrigger value="simulator" className="flex items-center gap-1 text-xs sm:text-sm px-2 sm:px-3 py-2 min-w-0 min-h-[44px] touch-manipulation">
            <PiggyBank className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
            <span className="hidden xs:inline truncate">Simulador</span>
            <span className="xs:hidden">Sim</span>
          </TabsTrigger>
          <TabsTrigger value="comparison" className="flex items-center gap-1 text-xs sm:text-sm px-2 sm:px-3 py-2 min-w-0 min-h-[44px] touch-manipulation">
            <BarChart3 className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
            <span className="hidden xs:inline truncate">Comparação</span>
            <span className="xs:hidden">Comp</span>
          </TabsTrigger>
          <TabsTrigger value="scenarios" className="flex items-center gap-1 text-xs sm:text-sm px-2 sm:px-3 py-2 min-w-0 min-h-[44px] touch-manipulation">
            <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
            <span className="hidden xs:inline truncate">Cenários</span>
            <span className="xs:hidden">Cen</span>
          </TabsTrigger>
          <TabsTrigger value="goals" className="flex items-center gap-1 text-xs sm:text-sm px-2 sm:px-3 py-2 min-w-0 min-h-[44px] touch-manipulation">
            <Target className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
            <span className="hidden xs:inline truncate">Metas</span>
            <span className="xs:hidden">Met</span>
          </TabsTrigger>
          <TabsTrigger value="achievements" className="flex items-center gap-1 text-xs sm:text-sm px-2 sm:px-3 py-2 min-w-0 min-h-[44px] touch-manipulation">
            <Trophy className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
            <span className="hidden xs:inline truncate">Conquistas</span>
            <span className="xs:hidden">Conq</span>
          </TabsTrigger>
          <TabsTrigger value="retirement" className="flex items-center gap-1 text-xs sm:text-sm px-2 sm:px-3 py-2 min-w-0 min-h-[44px] touch-manipulation">
            <Shield className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
            <span className="hidden xs:inline truncate">Aposentadoria</span>
            <span className="xs:hidden">Apos</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="simulator" className="space-y-4 sm:space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Configuração */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PiggyBank className="h-5 w-5 text-blue-500" />
                Configuração da Simulação
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Inputs */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="valorInicial">Valor Inicial</Label>
                    <InfoTooltip content="Valor que você pretende investir inicialmente. Mínimo de R$ 1,00.">
                      <HelpCircle className="h-4 w-4 text-gray-400" />
                    </InfoTooltip>
                  </div>
                  <Input
                    id="valorInicial"
                    type="text"
                    value={valorInicial}
                    onChange={(e) => setValorInicial(e.target.value)}
                    placeholder="Digite o valor inicial (ex: 1000)"
                    className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="contribuicao">Contribuição Mensal (Opcional)</Label>
                    <InfoTooltip content="Valor que você pretende investir mensalmente. Pode ser alterado a qualquer momento.">
                      <HelpCircle className="h-4 w-4 text-gray-400" />
                    </InfoTooltip>
                  </div>
                  <Input
                    id="contribuicao"
                    type="text"
                    value={aporteMensal}
                    onChange={(e) => setAporteMensal(e.target.value)}
                    placeholder="Digite o aporte mensal (ex: 500)"
                    className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="tempo">Tempo de Investimento: {tempoMeses} meses</Label>
                    <InfoTooltip content="Período em que você pretende manter o investimento. Quanto maior o tempo, maior o efeito dos juros compostos.">
                      <HelpCircle className="h-4 w-4 text-gray-400" />
                    </InfoTooltip>
                  </div>
                  <Slider
                    value={[parseInt(tempoMeses) || 12]}
                    onValueChange={([value]) => setTempoMeses(value.toString())}
                    max={120}
                    min={1}
                    step={1}
                    className="mt-2"
                  />
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>1 mês</span>
                    <span>10 anos</span>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>1 mês</span>
                    <span>10 anos</span>
                  </div>
                </div>
              </div>

              {/* Configuração CDI */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Taxa CDI Atual</Label>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowCdiConfig(!showCdiConfig)}
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Configurar
                  </Button>
                </div>

                <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    CDI: {formatPercentage(cdiConfig.cdiAnual / 100)} a.a. | 
                    Cofrinho: {formatPercentage((cdiConfig.cdiAnual / 100) * cdiConfig.multiplicador)} a.a.
                  </div>
                </div>

                {showCdiConfig && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
                  >
                    <div>
                      <Label>Taxa CDI Anual: {formatPercentage(tempCdiConfig.cdiAnual / 100)}</Label>
                      <Slider
                        value={[tempCdiConfig.cdiAnual]}
                        onValueChange={([value]) => 
                            setTempCdiConfig(prev => ({ ...prev, cdiAnual: value }))
                        }
                        max={20}
                        min={5}
                        step={0.25}
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <Label>Multiplicador do CDI: {tempCdiConfig.multiplicador}x</Label>
                      <Slider
                        value={[tempCdiConfig.multiplicador * 100]}
                        onValueChange={([value]) => 
                            setTempCdiConfig(prev => ({ ...prev, multiplicador: value / 100 }))
                        }
                        max={130}
                        min={100}
                        step={5}
                        className="mt-2"
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={handleSaveCdiConfig}
                        className="flex-1"
                      >
                        Aplicar
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setTempCdiConfig(cdiConfig);
                          setShowCdiConfig(false);
                        }}
                        className="flex-1"
                      >
                        Cancelar
                      </Button>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Ações */}
              <div className="flex flex-col sm:flex-row gap-2">
                <InfoTooltip content="Salva a simulação atual no seu histórico para consulta posterior">
                  <Button
                    onClick={() => {
                      if (calculations.result) {
                        saveSimulation(calculations.result);
                      }
                    }}
                    disabled={!valorInicial || parseFloat(valorInicial.replace(',', '.')) <= 0}
                    className="flex-1"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    <span className="hidden sm:inline">Salvar</span>
                    <span className="sm:hidden">Salvar Simulação</span>
                  </Button>
                </InfoTooltip>
                <InfoTooltip content="Exporta os dados da simulação em formato CSV para análise externa">
                  <Button
                    variant="outline"
                    onClick={handleExportData}
                    disabled={!valorInicial || parseFloat(valorInicial.replace(',', '.')) <= 0}
                    className="sm:w-auto w-full"
                  >
                    <Download className="h-4 w-4 mr-2 sm:mr-0" />
                    <span className="sm:hidden">Exportar Dados</span>
                  </Button>
                </InfoTooltip>
              </div>

              {/* Histórico */}
              {history.simulations.length > 0 && (
                <div className="space-y-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowHistory(!showHistory)}
                    className="w-full"
                  >
                    {showHistory ? 'Ocultar' : 'Ver'} Histórico ({history.simulations.length})
                  </Button>
                  
                  {showHistory && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="space-y-2 max-h-40 overflow-y-auto"
                    >
                      {history.simulations.map((sim) => (
                        <div
                          key={sim.id}
                          className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded text-sm"
                        >
                          <div>
                            <div className="font-medium">
                              {formatCurrency(sim.valorInicial)} - {sim.tempoMeses}m
                            </div>
                            <div className="text-gray-500">
                              {new Date(sim.createdAt).toLocaleDateString()}
                            </div>
                          </div>
                          <div className="flex gap-1">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => loadSimulation(sim.id)}
                            >
                              Carregar
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => removeSimulation(sim.id)}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </motion.div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Resultados */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-500" />
                Resultados da Simulação
              </CardTitle>
            </CardHeader>
            <CardContent>
              {calculations ? (
                <div className="space-y-6">
                  {/* Estatísticas Principais */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="text-center p-3 md:p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <div className="text-xl md:text-2xl font-bold text-green-600 dark:text-green-400">
                        {calculations.result ? formatCurrency(calculations.result.valorFinal) : 'R$ 0,00'}
                      </div>
                      <div className="text-xs md:text-sm text-green-700 dark:text-green-300">
                        Valor Final
                      </div>
                    </div>
                    <div className="text-center p-3 md:p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <div className="text-xl md:text-2xl font-bold text-blue-600 dark:text-blue-400">
                        {calculations.result ? formatCurrency(calculations.result.ganhoTotal) : 'R$ 0,00'}
                      </div>
                      <div className="text-xs md:text-sm text-blue-700 dark:text-blue-300">
                        Ganho Total
                      </div>
                    </div>
                  </div>

                  {/* Comparação com Poupança */}
                  {comparison && (
                    <div className="p-4 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-lg">
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                        Comparação com a Poupança
                      </h4>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600 dark:text-gray-400">Poupança:</span>
                          <span className="ml-2 font-medium">{formatCurrency(comparison.poupanca)}</span>
                        </div>
                        <div>
                          <span className="text-gray-600 dark:text-gray-400">Diferença:</span>
                          <span className="ml-2 font-medium text-green-600 dark:text-green-400">
                            +{formatCurrency(comparison.diferenca)}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Detalhes do Investimento */}
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Valor Investido:</span>
                      <span className="font-medium">{calculations.result ? formatCurrency(calculations.result.totalInvestido) : 'R$ 0,00'}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Rendimento:</span>
                      <span className="font-medium text-green-600 dark:text-green-400">
                        {calculations.result ? formatCurrency(calculations.result.ganhoTotal) : 'R$ 0,00'}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Rentabilidade:</span>
                      <span className="font-medium text-blue-600 dark:text-blue-400">
                        {calculations.result ? formatPercentage(calculations.result.taxaEfetiva) : '0%'}
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="h-64 flex items-center justify-center text-gray-500 dark:text-gray-400">
                  <div className="text-center">
                    <PiggyBank className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Configure sua simulação para ver os resultados</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Gráfico de Crescimento */}
      {calculations && calculations.chartData && calculations.chartData.length > 0 && (
        <motion.div
          className="mt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Evolução do Investimento</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-48 sm:h-64 md:h-80 lg:h-96 w-full overflow-hidden">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={calculations.chartData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="mes" 
                      label={{ value: 'Mês', position: 'insideBottom', offset: -5 }}
                      fontSize={10}
                      className="text-xs"
                      tick={{ fontSize: 10 }}
                    />
                    <YAxis 
                      tickFormatter={(value) => formatCurrency(value)}
                      label={{ value: 'Valor', angle: -90, position: 'insideLeft' }}
                      fontSize={10}
                      className="text-xs"
                      tick={{ fontSize: 10 }}
                      width={60}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Area 
                      type="monotone" 
                      dataKey="valor" 
                      stackId="1"
                      stroke="#3B82F6" 
                      fill="#3B82F6"
                      fillOpacity={0.6}
                      name="Cofrinho Inteligente"
                    />
                    {comparison && (
                      <Area 
                        type="monotone" 
                        dataKey="poupanca" 
                        stackId="2"
                        stroke="#6B7280" 
                        fill="#6B7280"
                        fillOpacity={0.3}
                        name="Poupança"
                      />
                    )}
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Estatísticas Históricas */}
      {historyStats && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.0 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Estatísticas do Histórico</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div className="text-lg font-bold text-blue-600 dark:text-blue-400">
                    {historyStats.totalSimulations}
                  </div>
                  <div className="text-sm text-blue-700 dark:text-blue-300">
                    Simulações
                  </div>
                </div>
                <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <div className="text-lg font-bold text-green-600 dark:text-green-400">
                    {formatCurrency(historyStats.ganhoMedio)}
                  </div>
                  <div className="text-sm text-green-700 dark:text-green-300">
                      Ganho Médio
                    </div>
                </div>
                <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <div className="text-lg font-bold text-purple-600 dark:text-purple-400">
                    {historyStats.tempoMedio}
                  </div>
                  <div className="text-sm text-purple-700 dark:text-purple-300">
                    Tempo Médio (meses)
                  </div>
                </div>
                <div className="text-center p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                  <div className="text-lg font-bold text-yellow-600 dark:text-yellow-400">
                    {formatCurrency(historyStats.maiorGanho)}
                  </div>
                  <div className="text-sm text-yellow-700 dark:text-yellow-300">
                      Maior Ganho
                    </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
        </TabsContent>

        <TabsContent value="comparison" className="space-y-6">
          {/* Seleção de Investimentos */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Comparação de Investimentos</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {INVESTMENT_OPTIONS.map((investment) => (
                    <div
                      key={investment.id}
                      className={`p-4 border rounded-lg cursor-pointer transition-all ${
                        selectedInvestments.includes(investment.id)
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                      }`}
                      onClick={() => {
                        if (selectedInvestments.includes(investment.id)) {
                          setSelectedInvestments(selectedInvestments.filter(id => id !== investment.id));
                        } else {
                          setSelectedInvestments([...selectedInvestments, investment.id]);
                        }
                      }}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium">{investment.name}</h3>
                        <div
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: investment.color }}
                        />
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        {investment.description}
                      </p>
                      <p className="text-lg font-bold" style={{ color: investment.color }}>
                        {formatPercentage(investment.rate * 12)} a.a.
                      </p>
                      {selectedInvestments.includes(investment.id) && (
                        <div className="mt-2">
                          <CheckCircle className="h-4 w-4 text-blue-500" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Configurações de Comparação */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="space-y-2">
                    <Label>Tipo de Gráfico:</Label>
                    <Select value={chartType} onValueChange={setChartType}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="line">Linha</SelectItem>
                        <SelectItem value="bar">Barras</SelectItem>
                        <SelectItem value="area">Área</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label>Incluir Inflação:</Label>
                      <Switch
                        checked={showInflation}
                        onCheckedChange={setShowInflation}
                      />
                    </div>
                    {showInflation && (
                      <Input
                        type="text"
                        value={inflationRate}
                        onChange={(e) => setInflationRate(e.target.value)}
                        placeholder="Taxa anual (%)"
                        className="mt-2"
                      />
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label>Período de Análise:</Label>
                    <Select defaultValue="12">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="6">6 meses</SelectItem>
                        <SelectItem value="12">1 ano</SelectItem>
                        <SelectItem value="24">2 anos</SelectItem>
                        <SelectItem value="36">3 anos</SelectItem>
                        <SelectItem value="60">5 anos</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Resumo Comparativo */}
                {selectedInvestments.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                      <CardContent className="p-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                            {selectedInvestments.find(id => id === 'cofrinho') ? 'Cofrinho' : 
                             INVESTMENT_OPTIONS.find(inv => inv.id === selectedInvestments[0])?.name}
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            Melhor Rendimento
                          </div>
                          <div className="mt-2">
                            <Badge variant="secondary" className="bg-green-100 text-green-800">
                              +25% vs Poupança
                            </Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                            R$ 2.450
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            Diferença em 12 meses
                          </div>
                          <div className="mt-2">
                            <div className="text-xs text-gray-500">
                              Cofrinho vs Poupança
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                            14.4%
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            Rendimento Anual
                          </div>
                          <div className="mt-2">
                            <div className="text-xs text-gray-500">
                              120% do CDI
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Gráfico de Comparação */}
          {selectedInvestments.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Evolução Comparativa</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      {chartType === 'line' && (
                        <LineChart data={calculateInvestmentComparison()}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="mes" />
                          <YAxis tickFormatter={(value) => formatCurrency(value)} />
                          <Tooltip content={<CustomTooltip />} />
                          {selectedInvestments.map((investmentId) => {
                            const investment = INVESTMENT_OPTIONS.find(inv => inv.id === investmentId);
                            return (
                              <Line
                                key={investmentId}
                                type="monotone"
                                dataKey={investmentId}
                                stroke={investment?.color}
                                strokeWidth={2}
                                name={investment?.name}
                              />
                            );
                          })}
                        </LineChart>
                      )}
                      {chartType === 'bar' && (
                        <BarChart data={calculateInvestmentComparison()}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="mes" />
                          <YAxis tickFormatter={(value) => formatCurrency(value)} />
                          <Tooltip content={<CustomTooltip />} />
                          {selectedInvestments.map((investmentId) => {
                            const investment = INVESTMENT_OPTIONS.find(inv => inv.id === investmentId);
                            return (
                              <Bar
                                key={investmentId}
                                dataKey={investmentId}
                                fill={investment?.color}
                                name={investment?.name}
                              />
                            );
                          })}
                        </BarChart>
                      )}
                      {chartType === 'area' && (
                        <AreaChart data={calculateInvestmentComparison()}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="mes" />
                          <YAxis tickFormatter={(value) => formatCurrency(value)} />
                          <Tooltip content={<CustomTooltip />} />
                          {selectedInvestments.map((investmentId) => {
                            const investment = INVESTMENT_OPTIONS.find(inv => inv.id === investmentId);
                            return (
                              <Area
                                key={investmentId}
                                type="monotone"
                                dataKey={investmentId}
                                stackId="1"
                                stroke={investment?.color}
                                fill={investment?.color}
                                fillOpacity={0.6}
                                name={investment?.name}
                              />
                            );
                          })}
                        </AreaChart>
                      )}
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Tabela de Resultados */}
          {selectedInvestments.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Resultados Finais</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left p-2">Investimento</th>
                          <th className="text-right p-2">Valor Final</th>
                          <th className="text-right p-2">Ganho Total</th>
                          <th className="text-right p-2">Rentabilidade</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedInvestments.map((investmentId) => {
                          const investment = INVESTMENT_OPTIONS.find(inv => inv.id === investmentId);
                          const valorInicialNum = parseFloat(valorInicial.replace(',', '.')) || 0;
                          const aportesMensaisNum = parseFloat(aporteMensal.replace(',', '.')) || 0;
                          const tempoNum = parseInt(tempoMeses) || 0;
                          const finalValue = (valorInicialNum + (aportesMensaisNum * tempoNum)) * Math.pow(1 + investment!.rate, tempoNum);
                          const totalInvested = valorInicialNum + (aportesMensaisNum * tempoNum);
                          const totalGain = finalValue - totalInvested;
                          const effectiveRate = totalInvested > 0 ? ((finalValue / totalInvested) - 1) * 100 : 0;
                          
                          return (
                            <tr key={investmentId} className="border-b">
                              <td className="p-2">
                                <div className="flex items-center gap-2">
                                  <div
                                    className="w-3 h-3 rounded-full"
                                    style={{ backgroundColor: investment?.color }}
                                  />
                                  {investment?.name}
                                </div>
                              </td>
                              <td className="text-right p-2 font-medium">
                                {formatCurrency(finalValue)}
                              </td>
                              <td className="text-right p-2 text-green-600 dark:text-green-400">
                                {formatCurrency(totalGain)}
                              </td>
                              <td className="text-right p-2">
                                {formatPercentage(effectiveRate)}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </TabsContent>

        <TabsContent value="scenarios" className="space-y-6">
          {/* Seleção de Cenário */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Análise de Cenários Econômicos</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {SCENARIOS.map((scenario) => (
                    <div
                      key={scenario.id}
                      className={`p-4 border rounded-lg cursor-pointer transition-all ${
                        selectedScenario === scenario.id
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                      }`}
                      onClick={() => setSelectedScenario(scenario.id)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium">{scenario.name}</h3>
                        <div
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: scenario.color }}
                        />
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        {scenario.description}
                      </p>
                      <p className="text-lg font-bold" style={{ color: scenario.color }}>
                        {scenario.multiplier}x
                      </p>
                    </div>
                  ))}
                </div>

                {/* Configuração de Inflação */}
                <div className="space-y-4 p-4 border rounded-lg bg-gray-50 dark:bg-gray-800">
                  <div className="flex items-center justify-between">
                    <Label>Considerar Inflação</Label>
                    <Switch
                      checked={showInflation}
                      onCheckedChange={setShowInflation}
                    />
                  </div>
                  
                  {showInflation && (
                    <div className="space-y-2">
                      <Label>Taxa de Inflação Anual: {inflationRate}%</Label>
                      <Slider
                        value={[parseFloat(inflationRate)]}
                        onValueChange={(value) => setInflationRate(value[0].toString())}
                        max={15}
                        min={0}
                        step={0.1}
                        className="w-full"
                      />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Gráfico de Cenários */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Projeção por Cenários</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={generateInflationChartData()}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="mes" />
                      <YAxis tickFormatter={(value) => formatCurrency(value)} />
                      <Tooltip content={<CustomTooltip />} />
                      {SCENARIOS.map((scenario) => (
                        <Line
                          key={scenario.id}
                          type="monotone"
                          dataKey={scenario.id}
                          stroke={scenario.color}
                          strokeWidth={selectedScenario === scenario.id ? 3 : 2}
                          strokeDasharray={selectedScenario === scenario.id ? "0" : "5 5"}
                          name={scenario.name}
                        />
                      ))}
                      {showInflation && (
                        <Line
                          type="monotone"
                          dataKey="inflationAdjusted"
                          stroke="#9CA3AF"
                          strokeWidth={1}
                          strokeDasharray="2 2"
                          name="Valor Real (com inflação)"
                        />
                      )}
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Resumo dos Cenários */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Resumo dos Cenários</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {SCENARIOS.map((scenario) => {
                    const scenarioData = generateScenarioData();
                    const finalValue = scenarioData[scenarioData.length - 1]?.[scenario.id] || 0;
                    const valorInicialNum = parseFloat(valorInicial.replace(',', '.')) || 0;
                    const aportesMensaisNum = parseFloat(aporteMensal.replace(',', '.')) || 0;
                    const tempoNum = parseInt(tempoMeses) || 0;
                    const totalInvested = valorInicialNum + (aportesMensaisNum * tempoNum);
                    const totalGain = finalValue - totalInvested;
                    const profitability = totalInvested > 0 ? ((totalGain / totalInvested) * 100) : 0;
                    
                    return (
                      <div
                        key={scenario.id}
                        className={`p-4 border rounded-lg transition-all cursor-pointer ${
                          selectedScenario === scenario.id
                            ? 'border-2 shadow-lg'
                            : 'hover:shadow-md'
                        }`}
                        style={{ borderColor: scenario.color }}
                        onClick={() => setSelectedScenario(scenario.id)}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-medium" style={{ color: scenario.color }}>
                            {scenario.name}
                          </h3>
                          {selectedScenario === scenario.id && (
                            <CheckCircle className="h-5 w-5 text-green-500" />
                          )}
                        </div>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>Valor Final:</span>
                            <span className="font-medium">{formatCurrency(finalValue)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Ganho Total:</span>
                            <span className="font-medium text-green-600 dark:text-green-400">
                              {formatCurrency(totalGain)}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>Rentabilidade:</span>
                            <span className="font-medium">{formatPercentage(profitability)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Multiplicador:</span>
                            <span className="font-medium">{scenario.multiplier}x</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Análise de Risco e Probabilidade */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Análise de Risco e Probabilidade</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Distribuição de Probabilidade */}
                  <div className="space-y-4">
                    <h3 className="font-medium">Distribuição de Probabilidade</h3>
                    <div className="space-y-3">
                      {SCENARIOS.map((scenario) => {
                        const probability = scenario.id === 'realista' ? 50 : scenario.id === 'pessimista' ? 30 : 20;
                        return (
                          <div key={scenario.id} className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>{scenario.name}</span>
                              <span>{probability}%</span>
                            </div>
                            <Progress value={probability} className="h-2" />
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Fatores de Risco */}
                  <div className="space-y-4">
                    <h3 className="font-medium">Fatores de Risco</h3>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-sm">
                        <AlertTriangle className="h-4 w-4 text-red-500" />
                        <span>Volatilidade do mercado</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <TrendingDown className="h-4 w-4 text-orange-500" />
                        <span>Mudanças na taxa de juros</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Activity className="h-4 w-4 text-yellow-500" />
                        <span>Cenário econômico nacional</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Percent className="h-4 w-4 text-blue-500" />
                        <span>Inflação acumulada</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recomendações por Cenário */}
                <div className="space-y-4">
                  <h3 className="font-medium">Recomendações por Cenário</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {SCENARIOS.map((scenario) => (
                      <div key={scenario.id} className="p-4 border rounded-lg bg-gray-50 dark:bg-gray-800">
                        <h4 className="font-medium mb-2" style={{ color: scenario.color }}>
                          {scenario.name}
                        </h4>
                        <ul className="text-sm space-y-1 text-gray-600 dark:text-gray-400">
                          {scenario.id === 'pessimista' && (
                            <>
                              <li>• Diversifique investimentos</li>
                              <li>• Mantenha reserva maior</li>
                              <li>• Considere renda fixa</li>
                            </>
                          )}
                          {scenario.id === 'realista' && (
                            <>
                              <li>• Mantenha estratégia atual</li>
                              <li>• Monitore regularmente</li>
                              <li>• Ajuste conforme necessário</li>
                            </>
                          )}
                          {scenario.id === 'otimista' && (
                            <>
                              <li>• Considere aumentar aportes</li>
                              <li>• Explore novos produtos</li>
                              <li>• Antecipe metas</li>
                            </>
                          )}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        <TabsContent value="goals" className="space-y-6">
          {/* Metas Predefinidas */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Metas Financeiras</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {FINANCIAL_GOALS.map((goal) => {
                    const Icon = goal.icon;
                    return (
                      <div
                        key={goal.id}
                        className="p-4 border rounded-lg cursor-pointer hover:border-gray-300 dark:hover:border-gray-600 transition-all"
                        onClick={() => {
                          setNewGoal({
                            ...newGoal,
                            name: goal.name,
                            description: goal.description
                          });
                        }}
                      >
                        <div className="flex items-center gap-3 mb-2">
                          <Icon className={`h-6 w-6 text-${goal.color}-600`} />
                          <h3 className="font-medium">{goal.name}</h3>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {goal.description}
                        </p>
                      </div>
                    );
                  })}
                </div>

                {/* Adicionar Nova Meta */}
                <div className="space-y-4 p-4 border rounded-lg bg-gray-50 dark:bg-gray-800">
                  <h3 className="font-medium">Criar Nova Meta</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Nome da Meta</Label>
                      <Input
                        placeholder="Ex: Viagem para Europa"
                        value={newGoal.name}
                        onChange={(e) => setNewGoal({ ...newGoal, name: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Valor da Meta</Label>
                      <Input
                        placeholder="Ex: 15000"
                        value={newGoal.targetAmount}
                        onChange={(e) => setNewGoal({ ...newGoal, targetAmount: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Prazo (meses)</Label>
                      <Input
                        placeholder="Ex: 24"
                        value={newGoal.deadline}
                        onChange={(e) => setNewGoal({ ...newGoal, deadline: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Prioridade</Label>
                      <Select
                        value={newGoal.priority}
                        onValueChange={(value) => setNewGoal({ ...newGoal, priority: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione a prioridade" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="alta">Alta</SelectItem>
                          <SelectItem value="media">Média</SelectItem>
                          <SelectItem value="baixa">Baixa</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Descrição</Label>
                    <Input
                      placeholder="Descreva sua meta..."
                      value={newGoal.description}
                      onChange={(e) => setNewGoal({ ...newGoal, description: e.target.value })}
                    />
                  </div>
                  <Button
                    onClick={() => {
                      if (newGoal.name && newGoal.targetAmount) {
                        setFinancialGoals([...financialGoals, {
                          ...newGoal,
                          id: Date.now().toString(),
                          currentAmount: '0',
                          progress: 0
                        }]);
                        setNewGoal({
                          name: '',
                          description: '',
                          targetAmount: '',
                          currentAmount: '0',
                          deadline: '',
                          priority: 'media',
                          progress: 0
                        });
                      }
                    }}
                    className="w-full"
                  >
                    <Target className="h-4 w-4 mr-2" />
                    Adicionar Meta
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Metas Ativas */}
          {financialGoals.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Suas Metas Ativas</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {financialGoals.map((goal) => {
                    const targetAmount = parseFloat(goal.targetAmount.replace(',', '.')) || 0;
                    const currentAmount = parseFloat(goal.currentAmount.replace(',', '.')) || 0;
                    const progress = targetAmount > 0 ? (currentAmount / targetAmount) * 100 : 0;
                    const monthsLeft = parseInt(goal.deadline) || 0;
                    const monthlyNeeded = monthsLeft > 0 ? (targetAmount - currentAmount) / monthsLeft : 0;

                    return (
                      <div key={goal.id} className="p-4 border rounded-lg space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Target className="h-5 w-5 text-blue-600" />
                            <div>
                              <h3 className="font-medium">{goal.name}</h3>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                {goal.description}
                              </p>
                            </div>
                          </div>
                          <Badge variant={goal.priority === 'alta' ? 'destructive' : goal.priority === 'media' ? 'default' : 'secondary'}>
                            {goal.priority}
                          </Badge>
                        </div>

                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Progresso: {formatCurrency(currentAmount)} / {formatCurrency(targetAmount)}</span>
                            <span>{progress.toFixed(1)}%</span>
                          </div>
                          <Progress value={progress} className="h-2" />
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="text-gray-600 dark:text-gray-400">Faltam:</span>
                            <p className="font-medium">{formatCurrency(targetAmount - currentAmount)}</p>
                          </div>
                          <div>
                            <span className="text-gray-600 dark:text-gray-400">Prazo:</span>
                            <p className="font-medium">{monthsLeft} meses</p>
                          </div>
                          <div>
                            <span className="text-gray-600 dark:text-gray-400">Mensal necessário:</span>
                            <p className="font-medium">{formatCurrency(monthlyNeeded)}</p>
                          </div>
                          <div>
                            <span className="text-gray-600 dark:text-gray-400">Status:</span>
                            <p className={`font-medium ${progress >= 100 ? 'text-green-600' : progress >= 50 ? 'text-yellow-600' : 'text-red-600'}`}>
                              {progress >= 100 ? 'Concluída' : progress >= 50 ? 'Em andamento' : 'Iniciando'}
                            </p>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              const newAmount = prompt('Valor atual da meta:', goal.currentAmount);
                              if (newAmount !== null) {
                                setFinancialGoals(financialGoals.map(g => 
                                  g.id === goal.id ? { ...g, currentAmount: newAmount } : g
                                ));
                              }
                            }}
                          >
                            Atualizar Valor
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setFinancialGoals(financialGoals.filter(g => g.id !== goal.id));
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Calculadora de Metas */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Calculadora de Metas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Valor da Meta (R$)</Label>
                    <Input
                      placeholder="Ex: 50000"
                      value={goalCalculator.targetAmount}
                      onChange={(e) => setGoalCalculator({ ...goalCalculator, targetAmount: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Prazo (meses)</Label>
                    <Input
                      placeholder="Ex: 36"
                      value={goalCalculator.months}
                      onChange={(e) => setGoalCalculator({ ...goalCalculator, months: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Valor Inicial (R$)</Label>
                    <Input
                      placeholder="Ex: 5000"
                      value={goalCalculator.initialAmount}
                      onChange={(e) => setGoalCalculator({ ...goalCalculator, initialAmount: e.target.value })}
                    />
                  </div>
                </div>

                {goalCalculator.targetAmount && goalCalculator.months && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border rounded-lg bg-blue-50 dark:bg-blue-900/20">
                    <div className="text-center">
                      <p className="text-sm text-gray-600 dark:text-gray-400">Aporte Mensal Necessário</p>
                      <p className="text-2xl font-bold text-blue-600">
                        {formatCurrency(
                          (parseFloat(goalCalculator.targetAmount.replace(',', '.')) - parseFloat(goalCalculator.initialAmount.replace(',', '.') || '0')) / 
                          parseInt(goalCalculator.months)
                        )}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-gray-600 dark:text-gray-400">Total a Investir</p>
                      <p className="text-2xl font-bold text-green-600">
                        {formatCurrency(
                          parseFloat(goalCalculator.targetAmount.replace(',', '.')) - parseFloat(goalCalculator.initialAmount.replace(',', '.') || '0')
                        )}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-gray-600 dark:text-gray-400">Rendimento Esperado</p>
                      <p className="text-2xl font-bold text-purple-600">
                        {formatPercentage(12 * 1.2)} ao ano
                      </p>
                    </div>
                  </div>
                )}

                {/* Dicas para Alcançar Metas */}
                <div className="space-y-4">
                  <h3 className="font-medium">Dicas para Alcançar suas Metas</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-sm">
                        <Lightbulb className="h-4 w-4 text-yellow-500" />
                        <span>Automatize seus investimentos</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span>Revise suas metas mensalmente</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Target className="h-4 w-4 text-blue-500" />
                        <span>Mantenha metas específicas e realistas</span>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-sm">
                        <TrendingUp className="h-4 w-4 text-purple-500" />
                        <span>Aproveite o poder dos juros compostos</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="h-4 w-4 text-orange-500" />
                        <span>Comece o quanto antes</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <DollarSign className="h-4 w-4 text-green-500" />
                        <span>Aumente aportes quando possível</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Adicionar Nova Meta */}
                <div className="space-y-4 p-4 border rounded-lg bg-gray-50 dark:bg-gray-800">
                  <h3 className="font-medium">Criar Nova Meta</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Nome da Meta</Label>
                      <Input
                        value={newGoal.name}
                        onChange={(e) => setNewGoal({ ...newGoal, name: e.target.value })}
                        placeholder="Ex: Viagem para Europa"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Valor Necessário</Label>
                      <Input
                        type="number"
                        value={newGoal.targetAmount}
                        onChange={(e) => setNewGoal({ ...newGoal, targetAmount: e.target.value })}
                        placeholder="R$ 0,00"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Descrição</Label>
                    <Input
                      value={newGoal.description}
                      onChange={(e) => setNewGoal({ ...newGoal, description: e.target.value })}
                      placeholder="Descreva sua meta..."
                    />
                  </div>
                  <Button 
                    onClick={addFinancialGoal} 
                    className="w-full"
                    disabled={isLoading || !newGoal.name || !newGoal.targetAmount || !newGoal.deadline}
                  >
                    {isLoading ? (
                      <LoadingSpinner size="sm" />
                    ) : (
                      <Target className="h-4 w-4 mr-2" />
                    )}
                    {isLoading ? 'Adicionando...' : 'Adicionar Meta'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Lista de Metas */}
          {financialGoals.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Suas Metas</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {financialGoals.map((goal) => {
                      const timeToGoal = calculateTimeToGoal(goal.targetAmount);
                      const progress = calculations?.result ? 
                        (calculations.result.valorFinal / goal.targetAmount) * 100 : 0;
                      
                      return (
                        <div key={goal.id} className="p-4 border rounded-lg">
                          <div className="flex items-center justify-between mb-3">
                            <div>
                              <h3 className="font-medium">{goal.name}</h3>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                {goal.description}
                              </p>
                            </div>
                            <div className="text-right">
                              <div className="text-lg font-bold">
                                {formatCurrency(goal.targetAmount)}
                              </div>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => removeFinancialGoal(goal.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>Progresso</span>
                              <span>{Math.min(progress, 100).toFixed(1)}%</span>
                            </div>
                            <Progress value={Math.min(progress, 100)} className="h-2" />
                          </div>
                          
                          {timeToGoal && (
                            <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                              <div className="flex items-center gap-2 text-sm">
                                <Calendar className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                <span className="text-blue-700 dark:text-blue-300">
                                  Tempo estimado: <strong>{timeToGoal} meses</strong>
                                </span>
                              </div>
                              <div className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                                Com os aportes atuais de {formatCurrency(parseFloat(aporteMensal.replace(',', '.')) || 0)}/mês
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </TabsContent>

        {/* Aba de Conquistas */}
        <TabsContent value="achievements" className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-yellow-500" />
                  Sistema de Conquistas
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Notificações de Conquistas */}
                {notifications.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="font-medium flex items-center gap-2">
                      <Bell className="h-4 w-4 text-blue-500" />
                      Conquistas Recentes
                    </h3>
                    {notifications.map((notification) => (
                      <motion.div
                        key={notification.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg"
                      >
                        <div className="flex items-center gap-2">
                          <Trophy className="h-4 w-4 text-yellow-600" />
                          <span className="font-medium text-yellow-800 dark:text-yellow-200">
                            {notification.message}
                          </span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}

                {/* Grid de Conquistas */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {ACHIEVEMENTS.map((achievement) => {
                    const isUnlocked = achievements.includes(achievement.id);
                    const Icon = achievement.icon;
                    
                    return (
                      <motion.div
                        key={achievement.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.1 }}
                        className={`p-4 border rounded-lg transition-all duration-300 ${
                          isUnlocked 
                            ? 'bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border-yellow-300 dark:border-yellow-700' 
                            : 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 opacity-60'
                        }`}
                      >
                        <div className="flex items-center gap-3 mb-2">
                          <div className={`p-2 rounded-full ${
                            isUnlocked 
                              ? 'bg-yellow-100 dark:bg-yellow-800' 
                              : 'bg-gray-100 dark:bg-gray-700'
                          }`}>
                            <Icon className={`h-5 w-5 ${
                              isUnlocked 
                                ? 'text-yellow-600 dark:text-yellow-400' 
                                : 'text-gray-400'
                            }`} />
                          </div>
                          <div className="flex-1">
                            <h3 className={`font-medium ${
                              isUnlocked 
                                ? 'text-yellow-800 dark:text-yellow-200' 
                                : 'text-gray-500'
                            }`}>
                              {achievement.name}
                            </h3>
                            {isUnlocked && (
                              <Badge variant="secondary" className="text-xs">
                                Desbloqueada
                              </Badge>
                            )}
                          </div>
                        </div>
                        <p className={`text-sm ${
                          isUnlocked 
                            ? 'text-yellow-700 dark:text-yellow-300' 
                            : 'text-gray-400'
                        }`}>
                          {achievement.description}
                        </p>

                      </motion.div>
                    );
                  })}
                </div>

                {/* Estatísticas de Progresso */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {achievements.length}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Conquistas Desbloqueadas
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">
                      {scenariosTestedCount}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Cenários Testados
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {Math.round((achievements.length / ACHIEVEMENTS.length) * 100)}%
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Progresso Total
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        {/* Aba de Aposentadoria */}
        <TabsContent value="retirement" className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-blue-500" />
                  Calculadora de Aposentadoria
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Configuração da Aposentadoria */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Idade Atual</Label>
                      <Input
                        type="number"
                        value={retirementCalculator.currentAge}
                        onChange={(e) => setRetirementCalculator({
                          ...retirementCalculator,
                          currentAge: e.target.value
                        })}
                        placeholder="Ex: 30"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Idade Desejada para Aposentadoria</Label>
                      <Input
                        type="number"
                        value={retirementCalculator.retirementAge}
                        onChange={(e) => setRetirementCalculator({
                          ...retirementCalculator,
                          retirementAge: e.target.value
                        })}
                        placeholder="Ex: 60"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Despesas Mensais Desejadas na Aposentadoria</Label>
                      <Input
                        type="number"
                        value={retirementCalculator.monthlyExpenses}
                        onChange={(e) => setRetirementCalculator({
                          ...retirementCalculator,
                          monthlyExpenses: e.target.value
                        })}
                        placeholder="Ex: 5000"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Cenário de Aposentadoria</Label>
                      <Select
                        value={retirementCalculator.scenario}
                        onValueChange={(value) => setRetirementCalculator({
                          ...retirementCalculator,
                          scenario: value as 'conservative' | 'moderate' | 'aggressive'
                        })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione um cenário" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="conservative">Conservador (6% a.a.)</SelectItem>
                          <SelectItem value="moderate">Moderado (8% a.a.)</SelectItem>
                          <SelectItem value="aggressive">Agressivo (12% a.a.)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Análise de Risco */}
                    <div className="p-4 border rounded-lg bg-gray-50 dark:bg-gray-800">
                      <h3 className="font-medium mb-3 flex items-center gap-2">
                        <Shield className="h-4 w-4 text-blue-500" />
                        Análise de Risco Personalizada
                      </h3>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Perfil de Risco:</span>
                          <Badge variant={
                            calculateRiskProfile().level === 'low' ? 'secondary' :
                            calculateRiskProfile().level === 'medium' ? 'default' : 'destructive'
                          }>
                            {calculateRiskProfile().level === 'low' ? 'Conservador' :
                             calculateRiskProfile().level === 'medium' ? 'Moderado' : 'Agressivo'}
                          </Badge>
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">
                          {calculateRiskProfile().description}
                        </div>
                        <div className="space-y-1">
                          {calculateRiskProfile().recommendations.map((rec, index) => (
                            <div key={index} className="flex items-center gap-2 text-xs">
                              <CheckCircle className="h-3 w-3 text-green-500" />
                              <span>{rec}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Botão de Cálculo */}
                <Button
                  onClick={calculateRetirement}
                  disabled={isCalculating || !retirementCalculator.currentAge || !retirementCalculator.retirementAge || !retirementCalculator.monthlyExpenses}
                  className="w-full"
                >
                  {isCalculating ? (
                    <LoadingSpinner size="sm" />
                  ) : (
                    <Calculator className="h-4 w-4 mr-2" />
                  )}
                  {isCalculating ? 'Calculando...' : 'Calcular Aposentadoria'}
                </Button>

                {/* Resultados da Aposentadoria */}
                {retirementCalculator.result && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-4"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="p-4 border rounded-lg bg-blue-50 dark:bg-blue-900/20 text-center">
                        <div className="text-2xl font-bold text-blue-600">
                          {formatCurrency(retirementCalculator.result.totalNeeded)}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          Total Necessário
                        </div>
                      </div>
                      <div className="p-4 border rounded-lg bg-green-50 dark:bg-green-900/20 text-center">
                        <div className="text-2xl font-bold text-green-600">
                          {formatCurrency(retirementCalculator.result.monthlyContribution)}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          Aporte Mensal Necessário
                        </div>
                      </div>
                      <div className="p-4 border rounded-lg bg-purple-50 dark:bg-purple-900/20 text-center">
                        <div className="text-2xl font-bold text-purple-600">
                          {Number(retirementCalculator.retirementAge) - Number(retirementCalculator.currentAge)} anos
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          Tempo para Aposentadoria
                        </div>
                      </div>
                    </div>

                    {/* Cenários de Aposentadoria */}
                    <div className="space-y-4">
                      <h3 className="font-medium">Comparação de Cenários</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {RETIREMENT_SCENARIOS.map((scenario) => (
                          <div key={scenario.name} className="p-4 border rounded-lg">
                            <div className="flex items-center gap-2 mb-2">
                              <scenario.icon className="h-4 w-4 text-blue-500" />
                              <h4 className="font-medium">{scenario.name}</h4>
                            </div>
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span>Retorno:</span>
                                <span className="font-medium">{formatPercentage(scenario.returnRate)} a.a.</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Aporte Mensal:</span>
                                <span className="font-medium">
                                  {formatCurrency(
                                    (Number(retirementCalculator.monthlyExpenses) * 12 * 25) / 
                                    (((1 + scenario.returnRate) ** (Number(retirementCalculator.retirementAge) - Number(retirementCalculator.currentAge)) - 1) / scenario.returnRate)
                                  )}
                                </span>
                              </div>
                              <div className="text-xs text-gray-600 dark:text-gray-400">
                                {scenario.description}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Dicas de Aposentadoria */}
                    <div className="p-4 bg-gradient-to-r from-blue-50 to-green-50 dark:from-blue-900/20 dark:to-green-900/20 rounded-lg">
                      <h3 className="font-medium mb-3 flex items-center gap-2">
                        <Lightbulb className="h-4 w-4 text-yellow-500" />
                        Dicas para uma Aposentadoria Tranquila
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span>Comece a investir o quanto antes</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span>Diversifique seus investimentos</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span>Revise seu plano anualmente</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span>Considere a inflação nos cálculos</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>
      </Tabs>
    </div>
  );
};