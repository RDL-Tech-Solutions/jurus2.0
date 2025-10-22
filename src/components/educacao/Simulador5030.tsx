import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid, LineChart, Line, Area, AreaChart } from 'recharts';
import { 
  DollarSign, 
  Settings, 
  RotateCcw, 
  Save, 
  Download, 
  Plus, 
  Trash2, 
  TrendingUp, 
  AlertCircle,
  AlertTriangle,
  Lightbulb,
  Target,
  Calculator,
  PieChart as PieChartIcon,
  BarChart3,
  TrendingUp as LineChartIcon,
  Activity,
  Trophy,
  Award,
  Medal,
  Bell,
  Zap,
  Shield,
  Crown,
  Gift,
  Calendar,
  CheckCircle,
  Users,
  Gamepad2,
  Star,
  Flame,
  Brain,
  Eye
} from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Slider } from '../ui/slider';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Textarea } from '../ui/textarea';
import { useSimulador5030 } from '../../hooks/useSimulador5030';
import { formatCurrency } from '../../utils/educacaoFinanceiraCalculos';

const COLORS = {
  necessidades: '#10B981', // green-500
  desejos: '#F59E0B',      // amber-500
  poupanca: '#3B82F6'      // blue-500
};

const PRESET_SCENARIOS = [
  { 
    name: 'Conservador', 
    necessidades: 60, 
    desejos: 20, 
    poupanca: 20,
    description: 'Foco na segurança financeira com gastos controlados'
  },
  { 
    name: 'Equilibrado', 
    necessidades: 50, 
    desejos: 30, 
    poupanca: 20,
    description: 'Balanceamento entre necessidades, desejos e poupança'
  },
  { 
    name: 'Agressivo', 
    necessidades: 45, 
    desejos: 25, 
    poupanca: 30,
    description: 'Maximização da poupança para objetivos de longo prazo'
  },
  { 
    name: 'Jovem Profissional', 
    necessidades: 55, 
    desejos: 35, 
    poupanca: 10,
    description: 'Maior flexibilidade para experiências e networking'
  },
  { 
    name: 'Família', 
    necessidades: 65, 
    desejos: 20, 
    poupanca: 15,
    description: 'Priorização das necessidades familiares'
  },
  { 
    name: 'Aposentadoria', 
    necessidades: 40, 
    desejos: 20, 
    poupanca: 40,
    description: 'Foco máximo na construção de patrimônio para aposentadoria'
  },
  { 
    name: 'Estudante', 
    necessidades: 70, 
    desejos: 20, 
    poupanca: 10,
    description: 'Adaptado para renda limitada de estudantes'
  },
  { 
    name: 'Empreendedor', 
    necessidades: 50, 
    desejos: 20, 
    poupanca: 30,
    description: 'Reserva para investimentos no negócio próprio'
  }
];

const DEFAULT_CATEGORIES = {
  necessidades: [
    'Moradia (aluguel/financiamento)',
    'Alimentação básica',
    'Transporte',
    'Saúde e medicamentos',
    'Educação básica',
    'Seguros obrigatórios'
  ],
  desejos: [
    'Entretenimento',
    'Restaurantes',
    'Compras não essenciais',
    'Hobbies',
    'Viagens',
    'Assinaturas e streaming'
  ],
  poupanca: [
    'Reserva de emergência',
    'Investimentos de longo prazo',
    'Previdência privada',
    'Fundos de investimento',
    'Ações',
    'Tesouro Direto'
  ]
};

interface CustomCategory {
  id: string;
  name: string;
  estimatedValue: number;
}

// Novas constantes para funcionalidades avançadas
const ACHIEVEMENTS = [
  {
    id: 'first_simulation',
    title: 'Primeiro Passo',
    description: 'Realizou sua primeira simulação 50-30-20',
    icon: Star,
    reward: 'Desbloqueou dicas personalizadas',
    points: 10
  },
  {
    id: 'balanced_budget',
    title: 'Orçamento Equilibrado',
    description: 'Criou um orçamento seguindo a regra 50-30-20',
    icon: Trophy,
    reward: 'Acesso a cenários avançados',
    points: 25
  },
  {
    id: 'savings_master',
    title: 'Mestre da Poupança',
    description: 'Configurou poupança acima de 25%',
    icon: Crown,
    reward: 'Calculadora de metas desbloqueada',
    points: 50
  },
  {
    id: 'scenario_explorer',
    title: 'Explorador de Cenários',
    description: 'Testou 5 cenários diferentes',
    icon: Brain,
    reward: 'Análise de tendências desbloqueada',
    points: 30
  },
  {
    id: 'category_master',
    title: 'Organizador Expert',
    description: 'Criou categorias personalizadas',
    icon: Medal,
    reward: 'Dashboard avançado desbloqueado',
    points: 40
  }
];

const DEMOGRAPHIC_DATA = {
  'jovem_profissional': {
    name: 'Jovem Profissional (22-30 anos)',
    necessidades: 55,
    desejos: 30,
    poupanca: 15,
    description: 'Dados baseados em pesquisas com jovens profissionais brasileiros'
  },
  'adulto_estabelecido': {
    name: 'Adulto Estabelecido (31-45 anos)',
    necessidades: 60,
    desejos: 25,
    poupanca: 15,
    description: 'Perfil de adultos com carreira consolidada'
  },
  'pre_aposentadoria': {
    name: 'Pré-aposentadoria (46-60 anos)',
    necessidades: 50,
    desejos: 20,
    poupanca: 30,
    description: 'Foco na preparação para aposentadoria'
  }
};

const FINANCIAL_GOALS = [
  {
    id: 'emergency_fund',
    name: 'Reserva de Emergência',
    description: 'Construir reserva de 6 meses de gastos',
    category: 'poupanca' as const,
    priority: 'high',
    timeframe: '6-12 meses',
    targetAmount: 30000,
    deadline: '2024-12-31'
  },
  {
    id: 'vacation',
    name: 'Viagem dos Sonhos',
    description: 'Economizar para uma viagem especial',
    category: 'desejos' as const,
    priority: 'medium',
    timeframe: '12-24 meses',
    targetAmount: 15000,
    deadline: '2025-06-30'
  },
  {
    id: 'house_down_payment',
    name: 'Entrada da Casa',
    description: 'Juntar dinheiro para entrada do imóvel',
    category: 'poupanca' as const,
    priority: 'high',
    timeframe: '24-60 meses',
    targetAmount: 100000,
    deadline: '2027-12-31'
  },
  {
    id: 'education',
    name: 'Educação/Curso',
    description: 'Investir em qualificação profissional',
    category: 'necessidades' as const,
    priority: 'high',
    timeframe: '6-18 meses',
    targetAmount: 8000,
    deadline: '2025-03-31'
  }
];

const SMART_ALERTS = [
  {
    id: 'high_expenses',
    title: 'Gastos Altos',
    condition: (config: any) => config.necessidades > 65,
    message: '⚠️ Suas necessidades estão muito altas. Considere revisar gastos essenciais.',
    type: 'warning',
    action: 'Revisar gastos essenciais'
  },
  {
    id: 'low_savings',
    title: 'Poupança Baixa',
    condition: (config: any) => config.poupanca < 10,
    message: '📈 Sua poupança está baixa. Tente aumentar gradualmente.',
    type: 'info',
    action: 'Aumentar poupança'
  },
  {
    id: 'high_desires',
    title: 'Muitos Desejos',
    condition: (config: any) => config.desejos > 40,
    message: '🎯 Muitos gastos com desejos. Que tal reduzir um pouco?',
    type: 'suggestion',
    action: 'Reduzir desejos'
  },
  {
    id: 'perfect_balance',
    title: 'Orçamento Perfeito',
    condition: (config: any) => config.necessidades <= 50 && config.desejos <= 30 && config.poupanca >= 20,
    message: '🎉 Parabéns! Seu orçamento está perfeitamente equilibrado!',
    type: 'success',
    action: 'Manter disciplina'
  }
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0];
    const getTooltipDescription = (name: string) => {
      switch (name.toLowerCase()) {
        case 'necessidades':
          return 'Gastos essenciais como moradia, alimentação, transporte e saúde';
        case 'desejos':
          return 'Gastos com entretenimento, hobbies, restaurantes e compras não essenciais';
        case 'poupança':
          return 'Valores destinados à reserva de emergência e investimentos';
        default:
          return '';
      }
    };

    return (
      <div className="bg-white dark:bg-gray-800 p-4 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg max-w-xs">
        <p className="font-medium text-lg mb-2">{data.name}</p>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
          <strong>Valor:</strong> {formatCurrency(data.value)}
        </p>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
          <strong>Percentual:</strong> {data.payload.percentage}%
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-500 italic">
          {getTooltipDescription(data.name)}
        </p>
      </div>
    );
  }
  return null;
};

export const Simulador5030: React.FC = () => {
  const {
    // Estados
    rendaMensal,
    errors,
    config,
    
    // Funções
    setRendaMensal: updateRendaMensal,
    updateConfig,
    resetToDefault,
    applyCustomConfig,
    saveSimulation,
    clearAll,
    
    // Dados computados
    calculations,
    recommendations,
    formattedData
  } = useSimulador5030();

  const [showCustomConfig, setShowCustomConfig] = useState(false);
  const [tempConfig, setTempConfig] = useState(config);
  const [activeTab, setActiveTab] = useState('overview');
  const [chartType, setChartType] = useState<'pie' | 'bar' | 'line' | 'area'>('pie');
  const [selectedScenario, setSelectedScenario] = useState('');
  const [customCategories, setCustomCategories] = useState<{
    necessidades: CustomCategory[];
    desejos: CustomCategory[];
    poupanca: CustomCategory[];
  }>({
    necessidades: [],
    desejos: [],
    poupanca: []
  });

  const [comparisonScenarios, setComparisonScenarios] = useState<Array<{
    name: string;
    config: typeof config;
    renda: number;
  }>>([]);

  // Novos estados para funcionalidades avançadas
  const [achievements, setAchievements] = useState<string[]>([]);
  const [notifications, setNotifications] = useState<Array<{
    id: string;
    message: string;
    type: 'success' | 'warning' | 'info';
  }>>([]);
  const [selectedDemographic, setSelectedDemographic] = useState<string>('');
  const [financialGoals, setFinancialGoals] = useState<Array<{
    id: string;
    name: string;
    targetAmount: number;
    currentAmount: number;
    deadline: string;
    category: 'necessidades' | 'desejos' | 'poupanca';
  }>>([]);
  const [scenariosTestedCount, setScenariosTestedCount] = useState(0);
  const [trendData, setTrendData] = useState<Array<{
    month: string;
    necessidades: number;
    desejos: number;
    poupanca: number;
  }>>([]);
  const [gamificationLevel, setGamificationLevel] = useState(1);
  const [experiencePoints, setExperiencePoints] = useState(0);

  const handleSaveCustomConfig = () => {
    applyCustomConfig(tempConfig.necessidades, tempConfig.desejos, tempConfig.poupanca);
    setShowCustomConfig(false);
  };

  const handleApplyScenario = (scenario: typeof PRESET_SCENARIOS[0]) => {
    setTempConfig({
      necessidades: scenario.necessidades,
      desejos: scenario.desejos,
      poupanca: scenario.poupanca,
      isCustom: true
    });
    setSelectedScenario(scenario.name);
  };

  const addCustomCategory = (type: keyof typeof customCategories) => {
    const newCategory: CustomCategory = {
      id: Date.now().toString(),
      name: '',
      estimatedValue: 0
    };
    setCustomCategories(prev => ({
      ...prev,
      [type]: [...prev[type], newCategory]
    }));
  };

  const updateCustomCategory = (type: keyof typeof customCategories, id: string, field: keyof CustomCategory, value: string | number) => {
    setCustomCategories(prev => ({
      ...prev,
      [type]: prev[type].map(cat => 
        cat.id === id ? { ...cat, [field]: value } : cat
      )
    }));
  };

  const removeCustomCategory = (type: keyof typeof customCategories, id: string) => {
    setCustomCategories(prev => ({
      ...prev,
      [type]: prev[type].filter(cat => cat.id !== id)
    }));
  };

  const addToComparison = () => {
    const rendaNumeric = parseFloat(rendaMensal.replace(',', '.'));
    if (rendaNumeric > 0) {
      const newComparison = {
        name: `Cenário ${comparisonScenarios.length + 1}`,
        config: { ...config },
        renda: rendaNumeric
      };
      setComparisonScenarios(prev => [...prev, newComparison]);
    }
  };

  const getPersonalizedTips = () => {
    const rendaNumeric = parseFloat(rendaMensal.replace(',', '.'));
    const tips = [];

    if (rendaNumeric > 0) {
      const { necessidades, desejos, poupanca } = calculations.divisao;
      
      // Dicas baseadas na renda
      if (rendaNumeric < 2000) {
        tips.push('💡 Com renda mais baixa, foque primeiro em construir uma reserva de emergência de pelo menos 3 meses de gastos.');
      } else if (rendaNumeric > 10000) {
        tips.push('💡 Com sua renda elevada, considere aumentar o percentual de poupança para 25-30% para acelerar seus objetivos financeiros.');
      }

      // Dicas baseadas na configuração
      if (config.necessidades > 60) {
        tips.push('⚠️ Suas necessidades estão acima de 60%. Revise seus gastos essenciais para encontrar oportunidades de economia.');
      }

      if (config.desejos > 35) {
        tips.push('⚠️ O percentual para desejos está alto. Considere reduzir para aumentar sua capacidade de poupança.');
      }

      if (config.poupanca < 15) {
        tips.push('📈 Tente aumentar gradualmente sua poupança. Mesmo 1% a mais por mês faz diferença no longo prazo.');
      }

      // Dicas específicas por valor
      if (poupanca < 500) {
        tips.push('🎯 Comece com pequenos valores na poupança. R$ 50-100 por mês já é um excelente início!');
      } else if (poupanca > 2000) {
        tips.push('🚀 Com essa capacidade de poupança, considere diversificar em diferentes tipos de investimento.');
      }

      // Dicas de categorias customizadas
      const totalCustomExpenses = Object.values(customCategories).flat().reduce((sum, cat) => sum + cat.estimatedValue, 0);
      if (totalCustomExpenses > rendaNumeric * 0.1) {
        tips.push('📊 Suas categorias customizadas representam mais de 10% da renda. Monitore esses gastos de perto.');
      }
    }

    return tips;
  };

  const handleExportData = () => {
    const exportData = {
      rendaMensal,
      config,
      calculations,
      customCategories,
      comparisonScenarios,
      timestamp: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `simulador-5030-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Novas funções avançadas
  const checkAchievements = () => {
    const newAchievements: string[] = [];
    
    // Primeira simulação
    if (rendaMensal && parseFloat(rendaMensal.replace(',', '.')) > 0 && !achievements.includes('first_simulation')) {
      newAchievements.push('first_simulation');
    }
    
    // Orçamento equilibrado
    if (config.necessidades <= 50 && config.desejos <= 30 && config.poupanca >= 20 && !achievements.includes('balanced_budget')) {
      newAchievements.push('balanced_budget');
    }
    
    // Mestre da poupança
    if (config.poupanca >= 25 && !achievements.includes('savings_master')) {
      newAchievements.push('savings_master');
    }
    
    // Explorador de cenários
    if (scenariosTestedCount >= 5 && !achievements.includes('scenario_explorer')) {
      newAchievements.push('scenario_explorer');
    }
    
    // Organizador expert
    if (Object.values(customCategories).some(cats => cats.length > 0) && !achievements.includes('category_master')) {
      newAchievements.push('category_master');
    }
    
    if (newAchievements.length > 0) {
      setAchievements(prev => [...prev, ...newAchievements]);
      newAchievements.forEach(achievementId => {
        const achievement = ACHIEVEMENTS.find(a => a.id === achievementId);
        if (achievement) {
          addNotification(`🏆 Conquista desbloqueada: ${achievement.title}!`, 'success');
          setExperiencePoints(prev => prev + 100);
        }
      });
    }
  };

  const addNotification = (message: string, type: 'success' | 'warning' | 'info') => {
    const notification = {
      id: Date.now().toString(),
      message,
      type
    };
    setNotifications(prev => [...prev, notification]);
    
    // Remove notification after 5 seconds
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== notification.id));
    }, 5000);
  };

  const getSmartAlerts = () => {
    return SMART_ALERTS.filter(alert => alert.condition(config));
  };

  const addFinancialGoal = (goal: Omit<typeof financialGoals[0], 'id' | 'currentAmount'>) => {
    const newGoal = {
      ...goal,
      id: Date.now().toString(),
      currentAmount: 0
    };
    setFinancialGoals(prev => [...prev, newGoal]);
    addNotification(`Meta "${goal.name}" adicionada com sucesso!`, 'success');
  };

  const updateGoalProgress = (goalId: string, amount: number) => {
    setFinancialGoals(prev => prev.map(goal => 
      goal.id === goalId ? { ...goal, currentAmount: amount } : goal
    ));
  };

  const calculateTrendAnalysis = () => {
    // Simula dados de tendência baseados no histórico
    const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'];
    const trendData = months.map((month, index) => {
      const variation = (Math.random() - 0.5) * 10; // Variação de -5% a +5%
      return {
        month,
        necessidades: Math.max(30, Math.min(70, config.necessidades + variation)),
        desejos: Math.max(10, Math.min(50, config.desejos + variation)),
        poupanca: Math.max(5, Math.min(40, config.poupanca + variation))
      };
    });
    setTrendData(trendData);
  };

  const simulateWhatIf = (scenario: string) => {
    setScenariosTestedCount(prev => prev + 1);
    
    const scenarios = {
      'salary_increase': {
        name: 'Aumento de 20% no salário',
        effect: 'Você poderia aumentar sua poupança para 25% mantendo o mesmo padrão de vida'
      },
      'expense_reduction': {
        name: 'Redução de 10% nos gastos',
        effect: 'Liberaria mais R$ 200-500 para investimentos mensais'
      },
      'emergency_expense': {
        name: 'Gasto emergencial de R$ 5.000',
        effect: 'Impactaria sua reserva de emergência por 3-6 meses'
      }
    };
    
    const selectedScenario = scenarios[scenario as keyof typeof scenarios];
    if (selectedScenario) {
      addNotification(`Cenário "${selectedScenario.name}": ${selectedScenario.effect}`, 'info');
    }
  };

  const updateGamificationLevel = () => {
    const newLevel = Math.floor(experiencePoints / 500) + 1;
    if (newLevel > gamificationLevel) {
      setGamificationLevel(newLevel);
      addNotification(`🎉 Parabéns! Você subiu para o nível ${newLevel}!`, 'success');
    }
  };

  // useEffect para verificar conquistas e atualizar gamificação
  useEffect(() => {
    checkAchievements();
    updateGamificationLevel();
  }, [config, rendaMensal, customCategories, scenariosTestedCount, experiencePoints]);

  useEffect(() => {
    if (rendaMensal && parseFloat(rendaMensal.replace(',', '.')) > 0) {
      calculateTrendAnalysis();
    }
  }, [config]);

  const barChartData = calculations.pieData?.map(item => ({
    name: item.name,
    value: item.value,
    percentage: item.percentage
  })) || [];

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
            Simulador 50-30-20 Avançado
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Organize suas finanças com categorias personalizadas, compare cenários e receba dicas inteligentes
          </p>
        </motion.div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-0.5 sm:gap-1 overflow-x-auto">
          <TabsTrigger value="overview" className="flex items-center gap-1 text-xs sm:text-sm px-2 sm:px-3 py-2 min-w-0 min-h-[44px] touch-manipulation">
            <Eye className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
            <span className="hidden xs:inline truncate">Visão Geral</span>
            <span className="xs:hidden">Visão</span>
          </TabsTrigger>
          <TabsTrigger value="categories" className="flex items-center gap-1 text-xs sm:text-sm px-2 sm:px-3 py-2 min-w-0 min-h-[44px] touch-manipulation">
            <PieChartIcon className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
            <span className="hidden xs:inline truncate">Categorias</span>
            <span className="xs:hidden">Cat</span>
          </TabsTrigger>
          <TabsTrigger value="scenarios" className="flex items-center gap-1 text-xs sm:text-sm px-2 sm:px-3 py-2 min-w-0 min-h-[44px] touch-manipulation">
            <Activity className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
            <span className="hidden xs:inline truncate">Cenários</span>
            <span className="xs:hidden">Cen</span>
          </TabsTrigger>
          <TabsTrigger value="tips" className="flex items-center gap-1 text-xs sm:text-sm px-2 sm:px-3 py-2 min-w-0 min-h-[44px] touch-manipulation">
            <Lightbulb className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
            <span className="hidden xs:inline truncate">Dicas</span>
            <span className="xs:hidden">Dic</span>
          </TabsTrigger>
          <TabsTrigger value="goals" className="flex items-center gap-1 text-xs sm:text-sm px-2 sm:px-3 py-2 min-w-0 min-h-[44px] touch-manipulation">
            <Trophy className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
            <span className="hidden xs:inline truncate">Metas</span>
            <span className="xs:hidden">Met</span>
          </TabsTrigger>
          <TabsTrigger value="trends" className="flex items-center gap-1 text-xs sm:text-sm px-2 sm:px-3 py-2 min-w-0 min-h-[44px] touch-manipulation">
            <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
            <span className="hidden xs:inline truncate">Tendências</span>
            <span className="xs:hidden">Tend</span>
          </TabsTrigger>
          <TabsTrigger value="achievements" className="flex items-center gap-1 text-xs sm:text-sm px-2 sm:px-3 py-2 min-w-0 min-h-[44px] touch-manipulation">
            <Award className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
            <span className="hidden xs:inline truncate">Conquistas</span>
            <span className="xs:hidden">Conq</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4 sm:space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            {/* Configuração */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calculator className="h-5 w-5 text-green-500" />
                    Configuração
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Input de Renda */}
                  <div className="space-y-2">
                    <Label htmlFor="renda">Renda Mensal Líquida</Label>
                    <Input
                      id="renda"
                      type="text"
                      value={rendaMensal}
                      onChange={(e) => updateRendaMensal(e.target.value)}
                      placeholder="Digite sua renda mensal (ex: 5000)"
                      className={errors.rendaMensal ? 'border-red-500' : ''}
                    />
                    {errors.rendaMensal && (
                      <p className="text-sm text-red-500">{errors.rendaMensal}</p>
                    )}
                  </div>

                  {/* Cenários Pré-definidos */}
                  <div className="space-y-3">
                    <Label>Cenários Pré-definidos</Label>
                    <div className="grid grid-cols-1 gap-2 max-h-60 overflow-y-auto">
                      {PRESET_SCENARIOS.map((scenario) => (
                        <div
                          key={scenario.name}
                          className={`p-3 border rounded-lg cursor-pointer transition-all hover:border-blue-300 dark:hover:border-blue-600 ${
                            selectedScenario === scenario.name
                              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                              : 'border-gray-200 dark:border-gray-700'
                          }`}
                          onClick={() => handleApplyScenario(scenario)}
                        >
                          <div className="flex justify-between items-start mb-1">
                            <h4 className="font-medium text-sm">{scenario.name}</h4>
                            <Badge variant="outline" className="text-xs">
                              {scenario.necessidades}/{scenario.desejos}/{scenario.poupanca}
                            </Badge>
                          </div>
                          <p className="text-xs text-gray-600 dark:text-gray-400">
                            {scenario.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Configuração Personalizada */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label>Configuração Atual</Label>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowCustomConfig(!showCustomConfig)}
                      >
                        <Settings className="h-4 w-4 mr-2" />
                        Personalizar
                      </Button>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-sm">
                      <Badge variant="secondary" className="justify-center">
                        Necessidades: {config.necessidades}%
                      </Badge>
                      <Badge variant="secondary" className="justify-center">
                        Desejos: {config.desejos}%
                      </Badge>
                      <Badge variant="secondary" className="justify-center">
                        Poupança: {config.poupanca}%
                      </Badge>
                    </div>

                    <AnimatePresence>
                      {showCustomConfig && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="space-y-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
                        >
                          <div className="space-y-3">
                            <div>
                              <Label>Necessidades: {tempConfig.necessidades}%</Label>
                              <Slider
                                value={[tempConfig.necessidades]}
                                onValueChange={([value]) => 
                                  setTempConfig(prev => ({ ...prev, necessidades: value }))
                                }
                                max={80}
                                min={30}
                                step={5}
                                className="mt-2"
                              />
                            </div>
                            <div>
                              <Label>Desejos: {tempConfig.desejos}%</Label>
                              <Slider
                                value={[tempConfig.desejos]}
                                onValueChange={([value]) => 
                                  setTempConfig(prev => ({ ...prev, desejos: value }))
                                }
                                max={50}
                                min={10}
                                step={5}
                                className="mt-2"
                              />
                            </div>
                            <div>
                              <Label>Poupança: {tempConfig.poupanca}%</Label>
                              <Slider
                                value={[tempConfig.poupanca]}
                                onValueChange={([value]) => 
                                  setTempConfig(prev => ({ ...prev, poupanca: value }))
                                }
                                max={40}
                                min={10}
                                step={5}
                                className="mt-2"
                              />
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                              Total: {tempConfig.necessidades + tempConfig.desejos + tempConfig.poupanca}%
                            </div>
                          </div>

                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              onClick={handleSaveCustomConfig}
                              className="flex-1"
                              disabled={tempConfig.necessidades + tempConfig.desejos + tempConfig.poupanca !== 100}
                            >
                              Aplicar
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setTempConfig(config);
                                setShowCustomConfig(false);
                              }}
                              className="flex-1"
                            >
                              Cancelar
                            </Button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Ações */}
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={resetToDefault}
                      className="flex-1"
                    >
                      <RotateCcw className="h-4 w-4 mr-2" />
                      Resetar
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={addToComparison}
                      disabled={!rendaMensal || parseFloat(rendaMensal.replace(',', '.')) <= 0}
                      className="flex-1"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Comparar
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleExportData}
                      disabled={!rendaMensal || parseFloat(rendaMensal.replace(',', '.')) <= 0}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Gráfico */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Distribuição da Renda</CardTitle>
                    <div className="flex gap-1">
                      <Button
                        variant={chartType === 'pie' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setChartType('pie')}
                        className="px-2"
                      >
                        <PieChartIcon className="h-4 w-4" />
                      </Button>
                      <Button
                        variant={chartType === 'bar' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setChartType('bar')}
                        className="px-2"
                      >
                        <BarChart3 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant={chartType === 'line' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setChartType('line')}
                        className="px-2"
                      >
                        <LineChartIcon className="h-4 w-4" />
                      </Button>
                      <Button
                        variant={chartType === 'area' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setChartType('area')}
                        className="px-2"
                      >
                        <Activity className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {parseFloat(rendaMensal.replace(',', '.')) > 0 ? (
                    <div className="h-48 sm:h-64 md:h-80 w-full overflow-hidden">
                      <ResponsiveContainer width="100%" height="100%">
                        {chartType === 'pie' ? (
                          <PieChart>
                            <Pie
                              data={calculations.pieData as any}
                              cx="50%"
                              cy="50%"
                              innerRadius={60}
                              outerRadius={120}
                              paddingAngle={2}
                              dataKey="value"
                              animationBegin={0}
                              animationDuration={800}
                            >
                              {calculations.pieData.map((entry, index) => (
                                <Cell 
                                  key={`cell-${index}`} 
                                  fill={COLORS[entry.key as keyof typeof COLORS]} 
                                />
                              ))}
                            </Pie>
                            <Tooltip content={<CustomTooltip />} />
                            <Legend />
                          </PieChart>
                        ) : chartType === 'bar' ? (
                          <BarChart data={barChartData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" fontSize={10} tick={{ fontSize: 10 }} />
                            <YAxis fontSize={10} tick={{ fontSize: 10 }} width={50} />
                            <Tooltip content={<CustomTooltip />} />
                            <Bar dataKey="value" fill="#8884d8" animationDuration={800}>
                              {barChartData.map((entry, index) => (
                                <Cell 
                                  key={`cell-${index}`} 
                                  fill={COLORS[calculations.pieData[index]?.key as keyof typeof COLORS]} 
                                />
                              ))}
                            </Bar>
                          </BarChart>
                        ) : chartType === 'line' ? (
                          <LineChart data={barChartData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip content={<CustomTooltip />} />
                            <Line 
                              type="monotone" 
                              dataKey="value" 
                              stroke="#3B82F6" 
                              strokeWidth={3}
                              dot={{ fill: '#3B82F6', strokeWidth: 2, r: 6 }}
                              activeDot={{ r: 8, stroke: '#3B82F6', strokeWidth: 2 }}
                              animationDuration={800}
                            />
                          </LineChart>
                        ) : (
                          <AreaChart data={barChartData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip content={<CustomTooltip />} />
                            <Area 
                              type="monotone" 
                              dataKey="value" 
                              stroke="#3B82F6" 
                              fill="url(#colorGradient)"
                              strokeWidth={2}
                              animationDuration={800}
                            />
                            <defs>
                              <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.1}/>
                              </linearGradient>
                            </defs>
                          </AreaChart>
                        )}
                      </ResponsiveContainer>
                    </div>
                  ) : (
                    <div className="h-80 flex items-center justify-center text-gray-500 dark:text-gray-400">
                      <div className="text-center">
                        <DollarSign className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>Insira sua renda mensal para ver a distribuição</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Resultados Detalhados */}
          {parseFloat(rendaMensal.replace(',', '.')) > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Valores Detalhados</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Necessidades */}
                    <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                        {formatCurrency(calculations.divisao.necessidades)}
                      </div>
                      <div className="text-sm text-green-700 dark:text-green-300 mt-1">
                        Necessidades ({config.necessidades}%)
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                        Moradia, alimentação, transporte, saúde
                      </div>
                    </div>

                    {/* Desejos */}
                    <div className="text-center p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                      <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                        {formatCurrency(calculations.divisao.desejos)}
                      </div>
                      <div className="text-sm text-amber-700 dark:text-amber-300 mt-1">
                        Desejos ({config.desejos}%)
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                        Entretenimento, hobbies, compras extras
                      </div>
                    </div>

                    {/* Poupança */}
                    <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                        {formatCurrency(calculations.divisao.poupanca)}
                      </div>
                      <div className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                        Poupança ({config.poupanca}%)
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                        Reserva de emergência, investimentos
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </TabsContent>

        <TabsContent value="categories" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-blue-500" />
                Categorias Personalizadas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {Object.entries(DEFAULT_CATEGORIES).map(([type, defaultCats]) => (
                  <div key={type} className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold capitalize text-lg">
                        {type === 'necessidades' ? 'Necessidades' : 
                         type === 'desejos' ? 'Desejos' : 'Poupança'}
                      </h3>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => addCustomCategory(type as keyof typeof customCategories)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>

                    {/* Categorias padrão */}
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Categorias Sugeridas:</p>
                      {defaultCats.map((cat, index) => (
                        <div key={index} className="text-sm text-gray-500 dark:text-gray-400 pl-2">
                          • {cat}
                        </div>
                      ))}
                    </div>

                    {/* Categorias customizadas */}
                    {customCategories[type as keyof typeof customCategories].length > 0 && (
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Suas Categorias:</p>
                        {customCategories[type as keyof typeof customCategories].map((category) => (
                          <div key={category.id} className="flex gap-2 items-center">
                            <Input
                              placeholder="Nome da categoria"
                              value={category.name}
                              onChange={(e) => updateCustomCategory(
                                type as keyof typeof customCategories, 
                                category.id, 
                                'name', 
                                e.target.value
                              )}
                              className="flex-1"
                            />
                            <Input
                              type="number"
                              placeholder="Valor"
                              value={category.estimatedValue}
                              onChange={(e) => updateCustomCategory(
                                type as keyof typeof customCategories, 
                                category.id, 
                                'estimatedValue', 
                                parseFloat(e.target.value) || 0
                              )}
                              className="w-24"
                            />
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => removeCustomCategory(type as keyof typeof customCategories, category.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="scenarios" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-purple-500" />
                Comparação de Cenários
              </CardTitle>
            </CardHeader>
            <CardContent>
              {comparisonScenarios.length > 0 ? (
                <div className="space-y-6">
                  {/* Gráfico Comparativo */}
                  <div className="h-48 sm:h-64 md:h-80 w-full overflow-hidden">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart 
                        data={comparisonScenarios.map(scenario => ({
                          name: scenario.name,
                          necessidades: scenario.renda * scenario.config.necessidades / 100,
                          desejos: scenario.renda * scenario.config.desejos / 100,
                          poupanca: scenario.renda * scenario.config.poupanca / 100
                        }))}
                        margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" fontSize={10} tick={{ fontSize: 10 }} />
                        <YAxis fontSize={10} tick={{ fontSize: 10 }} width={50} />
                        <Tooltip formatter={(value: number) => formatCurrency(value)} />
                        <Legend />
                        <Bar dataKey="necessidades" stackId="a" fill={COLORS.necessidades} name="Necessidades" />
                        <Bar dataKey="desejos" stackId="a" fill={COLORS.desejos} name="Desejos" />
                        <Bar dataKey="poupanca" stackId="a" fill={COLORS.poupanca} name="Poupança" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Lista de Cenários */}
                  <div className="space-y-4">
                    {comparisonScenarios.map((scenario, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: index * 0.1 }}
                        className="p-4 border rounded-lg"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-semibold">{scenario.name}</h4>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setComparisonScenarios(prev => prev.filter((_, i) => i !== index))}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="text-gray-600 dark:text-gray-400">Renda:</span>
                            <div className="font-medium">{formatCurrency(scenario.renda)}</div>
                          </div>
                          <div>
                            <span className="text-gray-600 dark:text-gray-400">Necessidades:</span>
                            <div className="font-medium text-green-600">{formatCurrency(scenario.renda * scenario.config.necessidades / 100)}</div>
                            <div className="text-xs text-gray-500">({scenario.config.necessidades}%)</div>
                          </div>
                          <div>
                            <span className="text-gray-600 dark:text-gray-400">Desejos:</span>
                            <div className="font-medium text-amber-600">{formatCurrency(scenario.renda * scenario.config.desejos / 100)}</div>
                            <div className="text-xs text-gray-500">({scenario.config.desejos}%)</div>
                          </div>
                          <div>
                            <span className="text-gray-600 dark:text-gray-400">Poupança:</span>
                            <div className="font-medium text-blue-600">{formatCurrency(scenario.renda * scenario.config.poupanca / 100)}</div>
                            <div className="text-xs text-gray-500">({scenario.config.poupanca}%)</div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Análise Comparativa */}
                  {comparisonScenarios.length > 1 && (
                    <Card className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20">
                      <CardHeader>
                        <CardTitle className="text-lg">Análise Comparativa</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-green-600">
                              {Math.max(...comparisonScenarios.map(s => s.config.necessidades))}%
                            </div>
                            <div className="text-sm text-gray-600">Maior % Necessidades</div>
                            <div className="text-xs text-gray-500 mt-1">
                              {comparisonScenarios.find(s => s.config.necessidades === Math.max(...comparisonScenarios.map(s => s.config.necessidades)))?.name}
                            </div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-amber-600">
                              {Math.max(...comparisonScenarios.map(s => s.config.desejos))}%
                            </div>
                            <div className="text-sm text-gray-600">Maior % Desejos</div>
                            <div className="text-xs text-gray-500 mt-1">
                              {comparisonScenarios.find(s => s.config.desejos === Math.max(...comparisonScenarios.map(s => s.config.desejos)))?.name}
                            </div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-blue-600">
                              {Math.max(...comparisonScenarios.map(s => s.config.poupanca))}%
                            </div>
                            <div className="text-sm text-gray-600">Maior % Poupança</div>
                            <div className="text-xs text-gray-500 mt-1">
                              {comparisonScenarios.find(s => s.config.poupanca === Math.max(...comparisonScenarios.map(s => s.config.poupanca)))?.name}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  <TrendingUp className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Nenhum cenário salvo para comparação</p>
                  <p className="text-sm">Configure sua renda e clique em "Comparar" para adicionar cenários</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tips" className="space-y-6">
          {/* Dicas Personalizadas */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-yellow-500" />
                Dicas Personalizadas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {getPersonalizedTips().map((tip, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg border-l-4 border-blue-500"
                  >
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      {tip}
                    </p>
                  </motion.div>
                ))}
                
                {getPersonalizedTips().length === 0 && (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    <Lightbulb className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Configure sua renda para receber dicas personalizadas</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Dicas por Categoria */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Necessidades */}
            <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20">
              <CardHeader>
                <CardTitle className="text-lg text-green-700 dark:text-green-300">
                  💚 Necessidades
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                    <p className="text-sm font-medium">Regra dos 6 meses</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      Mantenha uma reserva de emergência equivalente a 6 meses de gastos essenciais
                    </p>
                  </div>
                  <div className="p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                    <p className="text-sm font-medium">Priorize qualidade</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      Invista em itens duráveis para necessidades básicas
                    </p>
                  </div>
                  <div className="p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                    <p className="text-sm font-medium">Compare preços</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      Pesquise antes de comprar itens essenciais
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Desejos */}
            <Card className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20">
              <CardHeader>
                <CardTitle className="text-lg text-amber-700 dark:text-amber-300">
                  🧡 Desejos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                    <p className="text-sm font-medium">Regra das 24h</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      Espere 24h antes de compras por impulso
                    </p>
                  </div>
                  <div className="p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                    <p className="text-sm font-medium">Liste prioridades</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      Ordene seus desejos por importância
                    </p>
                  </div>
                  <div className="p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                    <p className="text-sm font-medium">Busque alternativas</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      Considere opções mais baratas ou gratuitas
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Poupança */}
            <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
              <CardHeader>
                <CardTitle className="text-lg text-blue-700 dark:text-blue-300">
                  💙 Poupança
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                    <p className="text-sm font-medium">Automatize</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      Configure transferências automáticas para poupança
                    </p>
                  </div>
                  <div className="p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                    <p className="text-sm font-medium">Diversifique</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      Distribua investimentos em diferentes modalidades
                    </p>
                  </div>
                  <div className="p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                    <p className="text-sm font-medium">Comece pequeno</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      Mesmo R$ 50/mês fazem diferença no longo prazo
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Calculadora de Metas */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-purple-500" />
                Calculadora de Metas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="goalAmount">Valor da Meta (R$)</Label>
                    <Input
                      id="goalAmount"
                      type="number"
                      placeholder="Ex: 10000"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="monthlyContribution">Contribuição Mensal (R$)</Label>
                    <Input
                      id="monthlyContribution"
                      type="number"
                      placeholder="Ex: 500"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="interestRate">Taxa de Juros Anual (%)</Label>
                    <Input
                      id="interestRate"
                      type="number"
                      placeholder="Ex: 12"
                      className="mt-1"
                    />
                  </div>
                </div>
                <div className="flex items-center justify-center">
                  <div className="text-center p-6 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg">
                    <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                      24
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      meses para atingir a meta
                    </div>
                    <div className="text-xs text-gray-500 mt-2">
                      Com juros compostos
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recomendações do hook */}
          {recommendations.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-orange-500" />
                  Recomendações do Sistema
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recommendations.map((rec, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                      className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg border-l-4 border-orange-500"
                    >
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        {rec}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Aba de Metas Financeiras */}
        <TabsContent value="goals" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Criar Nova Meta */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5 text-green-500" />
                  Criar Nova Meta
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="goalName">Nome da Meta</Label>
                  <Input
                    id="goalName"
                    placeholder="Ex: Viagem para Europa"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="goalValue">Valor Necessário (R$)</Label>
                  <Input
                    id="goalValue"
                    type="number"
                    placeholder="Ex: 15000"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="goalDeadline">Prazo (meses)</Label>
                  <Input
                    id="goalDeadline"
                    type="number"
                    placeholder="Ex: 24"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="goalCategory">Categoria</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="viagem">Viagem</SelectItem>
                      <SelectItem value="casa">Casa Própria</SelectItem>
                      <SelectItem value="carro">Veículo</SelectItem>
                      <SelectItem value="educacao">Educação</SelectItem>
                      <SelectItem value="emergencia">Emergência</SelectItem>
                      <SelectItem value="aposentadoria">Aposentadoria</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button 
                  onClick={() => addFinancialGoal({
                    name: "Nova Meta",
                    targetAmount: 10000,
                    deadline: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                    category: "poupanca"
                  })}
                  className="w-full"
                >
                  <Target className="h-4 w-4 mr-2" />
                  Criar Meta
                </Button>
              </CardContent>
            </Card>

            {/* Metas Pré-definidas */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-yellow-500" />
                  Metas Sugeridas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {FINANCIAL_GOALS.map((goal, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                      className="p-4 border rounded-lg hover:border-blue-300 dark:hover:border-blue-600 cursor-pointer transition-all"
                      onClick={() => addFinancialGoal(goal)}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium">{goal.name}</h4>
                        <Badge variant="outline">{goal.category}</Badge>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        {goal.description}
                      </p>
                      <div className="flex justify-between text-sm">
                        <span className="text-green-600 dark:text-green-400 font-medium">
                          {formatCurrency(goal.targetAmount)}
                        </span>
                        <span className="text-gray-500">
                          {Math.ceil((new Date(goal.deadline).getTime() - Date.now()) / (30 * 24 * 60 * 60 * 1000))} meses
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Metas Ativas */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-purple-500" />
                Suas Metas Financeiras
              </CardTitle>
            </CardHeader>
            <CardContent>
              {financialGoals.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {financialGoals.map((goal, index) => {
                    const progress = (goal.currentAmount / goal.targetAmount) * 100;
                    const monthsLeft = Math.ceil((new Date(goal.deadline).getTime() - Date.now()) / (30 * 24 * 60 * 60 * 1000));
                    const monthlyNeeded = (goal.targetAmount - goal.currentAmount) / Math.max(monthsLeft, 1);
                    
                    return (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.4, delay: index * 0.1 }}
                        className="p-4 border rounded-lg bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20"
                      >
                        <div className="flex justify-between items-start mb-3">
                          <h4 className="font-medium">{goal.name}</h4>
                          <Badge variant="outline">{goal.category}</Badge>
                        </div>
                        
                        <div className="space-y-2 mb-3">
                          <div className="flex justify-between text-sm">
                            <span>Progresso</span>
                            <span>{progress.toFixed(1)}%</span>
                          </div>
                          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                            <motion.div
                              className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full"
                              initial={{ width: 0 }}
                              animate={{ width: `${Math.min(progress, 100)}%` }}
                              transition={{ duration: 1, delay: index * 0.2 }}
                            />
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-gray-600 dark:text-gray-400">Atual</p>
                            <p className="font-medium text-green-600 dark:text-green-400">
                              {formatCurrency(goal.currentAmount)}
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-600 dark:text-gray-400">Meta</p>
                            <p className="font-medium">{formatCurrency(goal.targetAmount)}</p>
                          </div>
                          <div>
                            <p className="text-gray-600 dark:text-gray-400">Faltam</p>
                            <p className="font-medium text-orange-600 dark:text-orange-400">
                              {monthsLeft} meses
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-600 dark:text-gray-400">Mensal</p>
                            <p className="font-medium text-blue-600 dark:text-blue-400">
                              {formatCurrency(monthlyNeeded)}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  <Target className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Nenhuma meta criada ainda</p>
                  <p className="text-sm">Crie sua primeira meta financeira!</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Aba de Análise de Tendências */}
        <TabsContent value="trends" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Gráfico de Tendências */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-blue-500" />
                  Análise de Tendências
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-48 sm:h-64 md:h-80 w-full overflow-hidden">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={trendData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" fontSize={10} tick={{ fontSize: 10 }} />
                      <YAxis fontSize={10} tick={{ fontSize: 10 }} width={50} />
                      <Tooltip />
                      <Line 
                        type="monotone" 
                        dataKey="necessidades" 
                        stroke="#10b981" 
                        strokeWidth={2}
                        name="Necessidades"
                      />
                      <Line 
                        type="monotone" 
                        dataKey="desejos" 
                        stroke="#f59e0b" 
                        strokeWidth={2}
                        name="Desejos"
                      />
                      <Line 
                        type="monotone" 
                        dataKey="poupanca" 
                        stroke="#3b82f6" 
                        strokeWidth={2}
                        name="Poupança"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Comparação Demográfica */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-purple-500" />
                  Comparação Demográfica
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Selecione seu perfil</Label>
                  <Select value={selectedDemographic} onValueChange={setSelectedDemographic}>
                    <SelectTrigger>
                      <SelectValue placeholder="Escolha um perfil" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(DEMOGRAPHIC_DATA).map(([key, data]) => (
                        <SelectItem key={key} value={key}>
                          {data.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {selectedDemographic && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-4"
                  >
                    <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg">
                      <h4 className="font-medium mb-2">
                        {DEMOGRAPHIC_DATA[selectedDemographic].name}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                        {DEMOGRAPHIC_DATA[selectedDemographic].description}
                      </p>
                      
                      <div className="grid grid-cols-3 gap-2 text-sm">
                        <div className="text-center p-2 bg-white/50 dark:bg-gray-800/50 rounded">
                          <div className="font-medium text-green-600 dark:text-green-400">
                            {DEMOGRAPHIC_DATA[selectedDemographic].necessidades}%
                          </div>
                          <div className="text-xs text-gray-500">Necessidades</div>
                        </div>
                        <div className="text-center p-2 bg-white/50 dark:bg-gray-800/50 rounded">
                          <div className="font-medium text-amber-600 dark:text-amber-400">
                            {DEMOGRAPHIC_DATA[selectedDemographic].desejos}%
                          </div>
                          <div className="text-xs text-gray-500">Desejos</div>
                        </div>
                        <div className="text-center p-2 bg-white/50 dark:bg-gray-800/50 rounded">
                          <div className="font-medium text-blue-600 dark:text-blue-400">
                            {DEMOGRAPHIC_DATA[selectedDemographic].poupanca}%
                          </div>
                          <div className="text-xs text-gray-500">Poupança</div>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 border rounded-lg">
                      <h5 className="font-medium mb-2">Comparação com seu perfil atual:</h5>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Necessidades:</span>
                          <span className={config.necessidades > DEMOGRAPHIC_DATA[selectedDemographic].necessidades ? 'text-red-500' : 'text-green-500'}>
                            {config.necessidades > DEMOGRAPHIC_DATA[selectedDemographic].necessidades ? '+' : ''}
                            {config.necessidades - DEMOGRAPHIC_DATA[selectedDemographic].necessidades}%
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Desejos:</span>
                          <span className={config.desejos > DEMOGRAPHIC_DATA[selectedDemographic].desejos ? 'text-red-500' : 'text-green-500'}>
                            {config.desejos > DEMOGRAPHIC_DATA[selectedDemographic].desejos ? '+' : ''}
                            {config.desejos - DEMOGRAPHIC_DATA[selectedDemographic].desejos}%
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Poupança:</span>
                          <span className={config.poupanca < DEMOGRAPHIC_DATA[selectedDemographic].poupanca ? 'text-red-500' : 'text-green-500'}>
                            {config.poupanca > DEMOGRAPHIC_DATA[selectedDemographic].poupanca ? '+' : ''}
                            {config.poupanca - DEMOGRAPHIC_DATA[selectedDemographic].poupanca}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Simulador "E se..." */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-indigo-500" />
                Simulador "E se..."
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div>
                  <Label>E se minha renda aumentasse...</Label>
                  <Select onValueChange={(value) => simulateWhatIf('salary_increase')}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o aumento" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0.1">10%</SelectItem>
                      <SelectItem value="0.2">20%</SelectItem>
                      <SelectItem value="0.3">30%</SelectItem>
                      <SelectItem value="0.5">50%</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>E se eu reduzisse os desejos...</Label>
                  <Select onValueChange={(value) => simulateWhatIf('expense_reduction')}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a redução" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0.1">10%</SelectItem>
                      <SelectItem value="0.2">20%</SelectItem>
                      <SelectItem value="0.3">30%</SelectItem>
                      <SelectItem value="0.5">50%</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>E se eu aumentasse a poupança...</Label>
                  <Select onValueChange={(value) => simulateWhatIf('emergency_expense')}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o aumento" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0.05">5%</SelectItem>
                      <SelectItem value="0.1">10%</SelectItem>
                      <SelectItem value="0.15">15%</SelectItem>
                      <SelectItem value="0.2">20%</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg">
                  <h4 className="font-medium text-green-700 dark:text-green-300 mb-2">
                    Impacto na Poupança
                  </h4>
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                    +{formatCurrency(500)}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">por mês</p>
                </div>
                <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg">
                  <h4 className="font-medium text-blue-700 dark:text-blue-300 mb-2">
                    Em 1 Ano
                  </h4>
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {formatCurrency(6000)}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">economia adicional</p>
                </div>
                <div className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg">
                  <h4 className="font-medium text-purple-700 dark:text-purple-300 mb-2">
                    Em 5 Anos
                  </h4>
                  <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                    {formatCurrency(30000)}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">com juros compostos</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Alertas Inteligentes */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-orange-500" />
                Alertas Inteligentes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {getSmartAlerts().map((alert, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className={`p-4 rounded-lg border-l-4 ${
                      alert.type === 'warning' 
                        ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-500' 
                        : alert.type === 'danger'
                        ? 'bg-red-50 dark:bg-red-900/20 border-red-500'
                        : 'bg-blue-50 dark:bg-blue-900/20 border-blue-500'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`p-1 rounded-full ${
                        alert.type === 'warning' 
                          ? 'bg-yellow-100 dark:bg-yellow-800' 
                          : alert.type === 'danger'
                          ? 'bg-red-100 dark:bg-red-800'
                          : 'bg-blue-100 dark:bg-blue-800'
                      }`}>
                        {alert.type === 'warning' && <AlertTriangle className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />}
                        {alert.type === 'danger' && <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />}
                        {alert.type === 'info' && <Bell className="h-4 w-4 text-blue-600 dark:text-blue-400" />}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium mb-1">{alert.title}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{alert.message}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Aba de Conquistas e Gamificação */}
        <TabsContent value="achievements" className="space-y-6">
          {/* Nível e Experiência */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Crown className="h-5 w-5 text-yellow-500" />
                Seu Progresso
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="relative w-24 h-24 mx-auto mb-4">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 flex items-center justify-center">
                      <span className="text-2xl font-bold text-white">{gamificationLevel}</span>
                    </div>
                    <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                      <Badge variant="secondary">Nível</Badge>
                    </div>
                  </div>
                  <h3 className="font-medium">Planejador Financeiro</h3>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>Experiência</span>
                    <span>{experiencePoints} / {gamificationLevel * 1000} XP</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                    <motion.div
                      className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${(experiencePoints % 1000) / 10}%` }}
                      transition={{ duration: 1 }}
                    />
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {1000 - (experiencePoints % 1000)} XP para o próximo nível
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">
                    {scenariosTestedCount}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Cenários testados
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Notificações de Conquistas */}
          {notifications.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5 text-blue-500" />
                  Conquistas Recentes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {notifications.map((notification, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                      className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg border border-green-200 dark:border-green-800"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-green-100 dark:bg-green-800 rounded-full">
                          <Trophy className="h-5 w-5 text-green-600 dark:text-green-400" />
                        </div>
                        <div>
                          <h4 className="font-medium text-green-800 dark:text-green-200">
                            Nova Conquista!
                          </h4>
                          <p className="text-sm text-green-600 dark:text-green-400">
                            {notification.message}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Grid de Conquistas */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5 text-purple-500" />
                Suas Conquistas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {ACHIEVEMENTS.map((achievement, index) => {
                  const isUnlocked = achievements.includes(achievement.id);
                  const IconComponent = achievement.icon;
                  
                  return (
                    <motion.div
                      key={achievement.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        isUnlocked
                          ? 'border-yellow-300 bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20'
                          : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50'
                      }`}
                    >
                      <div className="text-center">
                        <div className={`w-16 h-16 mx-auto mb-3 rounded-full flex items-center justify-center ${
                          isUnlocked
                            ? 'bg-gradient-to-r from-yellow-400 to-orange-500'
                            : 'bg-gray-200 dark:bg-gray-700'
                        }`}>
                          <IconComponent 
                            className={`h-8 w-8 ${
                              isUnlocked ? 'text-white' : 'text-gray-400 dark:text-gray-500'
                            }`} 
                          />
                        </div>
                        <h4 className={`font-medium mb-2 ${
                          isUnlocked ? 'text-yellow-800 dark:text-yellow-200' : 'text-gray-500 dark:text-gray-400'
                        }`}>
                          {achievement.title}
                        </h4>
                        <p className={`text-sm ${
                          isUnlocked ? 'text-yellow-600 dark:text-yellow-400' : 'text-gray-400 dark:text-gray-500'
                        }`}>
                          {achievement.description}
                        </p>
                        {isUnlocked && (
                          <div className="mt-3">
                            <Badge variant="secondary" className="bg-yellow-100 dark:bg-yellow-800 text-yellow-800 dark:text-yellow-200">
                              +{achievement.points} XP
                            </Badge>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Estatísticas de Progresso */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-indigo-500" />
                Estatísticas de Progresso
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-1">
                    {achievements.length}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Conquistas</p>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400 mb-1">
                    {scenariosTestedCount}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Simulações</p>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600 dark:text-purple-400 mb-1">
                    {customCategories.necessidades.length + customCategories.desejos.length + customCategories.poupanca.length}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Categorias</p>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600 dark:text-orange-400 mb-1">
                    {Math.round((achievements.length / ACHIEVEMENTS.length) * 100)}%
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Completude</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};