import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area
} from 'recharts';
import { 
  Calculator, DollarSign, TrendingDown, AlertTriangle, CheckCircle, 
  Trash2, Save, Download, Bell, Target, Calendar, Clock, 
  CreditCard, PiggyBank, Zap, Shield, Award, Star, Trophy,
  TrendingUp, BarChart3, Users, Brain, Eye, Gift, Crown,
  Flame, Medal, Gamepad2, RefreshCw, Settings, Info
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useDividas } from '@/hooks/useDividas';
import { formatCurrency } from '@/utils/formatters';

const MOTIVATIONAL_MESSAGES = [
  "Cada pagamento te aproxima da liberdade financeira! 💪",
  "Você está no caminho certo para quitar suas dívidas! 🎯",
  "Persistência é a chave para o sucesso financeiro! ⭐",
  "Cada real pago é um passo em direção aos seus sonhos! 🌟",
  "Sua disciplina hoje será sua liberdade amanhã! 🚀"
];

// Conquistas para gamificação
const DEBT_ACHIEVEMENTS = [
  {
    id: 'first_payment',
    title: 'Primeiro Passo',
    description: 'Fez o primeiro pagamento de dívida',
    icon: Trophy,
    color: 'text-yellow-500',
    bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
    borderColor: 'border-yellow-200 dark:border-yellow-800',
    points: 50,
    condition: (progress: any) => progress.length > 0
  },
  {
    id: 'debt_killer',
    title: 'Matador de Dívidas',
    description: 'Quitou sua primeira dívida completamente',
    icon: Award,
    color: 'text-green-500',
    bgColor: 'bg-green-50 dark:bg-green-900/20',
    borderColor: 'border-green-200 dark:border-green-800',
    points: 200,
    condition: (progress: any) => progress.some((p: any) => p.valorAtual === 0)
  },
  {
    id: 'consistent_payer',
    title: 'Pagador Consistente',
    description: 'Manteve pagamentos por 3 meses consecutivos',
    icon: Medal,
    color: 'text-blue-500',
    bgColor: 'bg-blue-50 dark:bg-blue-900/20',
    borderColor: 'border-blue-200 dark:border-blue-800',
    points: 150,
    condition: (progress: any) => progress.length >= 3
  },
  {
    id: 'debt_free',
    title: 'Livre de Dívidas',
    description: 'Quitou todas as dívidas registradas',
    icon: Crown,
    color: 'text-purple-500',
    bgColor: 'bg-purple-50 dark:bg-purple-900/20',
    borderColor: 'border-purple-200 dark:border-purple-800',
    points: 500,
    condition: (progress: any) => progress.length > 0 && progress.every((p: any) => p.valorAtual === 0)
  }
];

// Tipos de renegociação
const NEGOTIATION_TYPES = [
  {
    id: 'discount',
    name: 'Desconto à Vista',
    description: 'Negocie um desconto para pagamento à vista',
    icon: DollarSign,
    color: 'text-green-500',
    expectedDiscount: '10-30%'
  },
  {
    id: 'installments',
    name: 'Parcelamento',
    description: 'Divida o valor em parcelas menores',
    icon: Calendar,
    color: 'text-blue-500',
    expectedDiscount: '5-15%'
  },
  {
    id: 'interest_reduction',
    name: 'Redução de Juros',
    description: 'Negocie uma taxa de juros menor',
    icon: TrendingDown,
    color: 'text-orange-500',
    expectedDiscount: '20-50%'
  },
  {
    id: 'payment_plan',
    name: 'Plano de Pagamento',
    description: 'Crie um plano personalizado de pagamento',
    icon: Target,
    color: 'text-purple-500',
    expectedDiscount: '15-25%'
  }
];

// Alertas inteligentes para dívidas
const SMART_DEBT_ALERTS = [
  {
    id: 'high_interest',
    title: 'Juros Altos Detectados',
    message: 'Suas dívidas têm juros acima da média. Considere renegociar.',
    icon: AlertTriangle,
    color: 'text-red-500',
    priority: 'high',
    condition: (debt: number, income: number) => (debt / income) > 5
  },
  {
    id: 'payment_capacity',
    title: 'Capacidade de Pagamento',
    message: 'Você pode aumentar o valor mensal para quitar mais rápido.',
    icon: TrendingUp,
    color: 'text-blue-500',
    priority: 'medium',
    condition: (debt: number, income: number) => (debt / income) < 2
  },
  {
    id: 'emergency_fund',
    title: 'Reserva de Emergência',
    message: 'Mantenha uma reserva mesmo quitando dívidas.',
    icon: Shield,
    color: 'text-yellow-500',
    priority: 'medium',
    condition: () => true
  }
];

export const SolucoesDividas: React.FC = () => {
  const {
    valorDivida,
    rendaMensal,
    estrategiaSelecionada,
    isCalculating,
    errors,
    debtProgress,
    setValorDivida,
    setRendaMensal,
    setEstrategiaSelecionada,
    validateInputs,
    saveDebtProgress,
    markDebtAsPaid,
    removeDebt,
    clearAll,
    calculations,
    recommendations,
    statistics,
    formattedData,
    strategies,
    isValid,
    hasErrors,
    canCalculate
  } = useDividas();

  const [activeTab, setActiveTab] = useState('calculator');
  const [reminders, setReminders] = useState<boolean>(true);
  
  // Estados para funcionalidades avançadas
  const [achievements, setAchievements] = useState<string[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [experiencePoints, setExperiencePoints] = useState(0);
  const [gamificationLevel, setGamificationLevel] = useState(1);
  const [negotiationData, setNegotiationData] = useState({
    originalValue: '',
    negotiationType: '',
    proposedValue: '',
    installments: '',
    interestRate: '',
    notes: ''
  });
  const [compoundInterestData, setCompoundInterestData] = useState({
    principal: '',
    rate: '',
    time: '',
    compound: 'monthly'
  });
  const [impactAnalysis, setImpactAnalysis] = useState<any>(null);
  const [motivationLevel, setMotivationLevel] = useState(0);

  const handleSaveProgress = () => {
    if (validateInputs()) {
      if (calculations.result) {
        saveDebtProgress(calculations.result);
      }
    }
  };

  const handleExportData = () => {
    const exportData = {
      valorDivida,
      rendaMensal,
      estrategia: estrategiaSelecionada,
      calculations: calculations.result,
      timestamp: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dividas-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Funções avançadas
  const checkAchievements = () => {
    const newAchievements: string[] = [];
    let newPoints = 0;

    DEBT_ACHIEVEMENTS.forEach(achievement => {
      if (!achievements.includes(achievement.id) && achievement.condition(debtProgress)) {
        newAchievements.push(achievement.id);
        newPoints += achievement.points;
        addNotification({
          id: Date.now().toString(),
          type: 'achievement',
          title: `Conquista Desbloqueada: ${achievement.title}`,
          message: achievement.description,
          icon: achievement.icon,
          color: achievement.color,
          timestamp: new Date()
        });
      }
    });

    if (newAchievements.length > 0) {
      setAchievements(prev => [...prev, ...newAchievements]);
      setExperiencePoints(prev => prev + newPoints);
    }
  };

  const addNotification = (notification: any) => {
    setNotifications(prev => [notification, ...prev.slice(0, 4)]);
  };

  const getSmartAlerts = () => {
    const debt = parseFloat(valorDivida) || 0;
    const income = parseFloat(rendaMensal) || 0;
    
    return SMART_DEBT_ALERTS.filter(alert => 
      alert.condition(debt, income)
    );
  };

  const calculateCompoundInterest = () => {
    const principal = parseFloat(compoundInterestData.principal) || 0;
    const rate = parseFloat(compoundInterestData.rate) / 100 || 0;
    const time = parseFloat(compoundInterestData.time) || 0;
    const n = compoundInterestData.compound === 'monthly' ? 12 : 
              compoundInterestData.compound === 'quarterly' ? 4 : 1;

    const amount = principal * Math.pow((1 + rate / n), n * time);
    const interest = amount - principal;

    return {
      finalAmount: amount,
      totalInterest: interest,
      monthlyPayment: amount / (time * 12)
    };
  };

  const simulateNegotiation = () => {
    const original = parseFloat(negotiationData.originalValue) || 0;
    const proposed = parseFloat(negotiationData.proposedValue) || 0;
    const installments = parseInt(negotiationData.installments) || 1;
    const rate = parseFloat(negotiationData.interestRate) / 100 || 0;

    const savings = original - proposed;
    const savingsPercentage = (savings / original) * 100;
    const monthlyPayment = proposed / installments;
    
    // Simular impacto nos juros
    const withInterest = proposed * (1 + rate * (installments / 12));
    const totalWithInterest = withInterest;
    const interestAmount = totalWithInterest - proposed;

    return {
      originalValue: original,
      negotiatedValue: proposed,
      savings,
      savingsPercentage,
      monthlyPayment,
      totalWithInterest,
      interestAmount,
      installments
    };
  };

  const calculateImpactAnalysis = () => {
    const debt = parseFloat(valorDivida) || 0;
    const income = parseFloat(rendaMensal) || 0;
    
    if (debt === 0 || income === 0) return null;

    const debtToIncomeRatio = (debt / income);
    const monthlyPayment = debt * (estrategiaSelecionada.recommendedPercentage / 100);
    const timeToPayOff = debt / monthlyPayment;
    
    // Simular cenários
    const scenarios = [
      {
        name: 'Pagamento Mínimo',
        monthlyPayment: monthlyPayment * 0.5,
        timeToPayOff: debt / (monthlyPayment * 0.5),
        totalInterest: debt * 0.3
      },
      {
        name: 'Pagamento Recomendado',
        monthlyPayment,
        timeToPayOff,
        totalInterest: debt * 0.15
      },
      {
        name: 'Pagamento Acelerado',
        monthlyPayment: monthlyPayment * 1.5,
        timeToPayOff: debt / (monthlyPayment * 1.5),
        totalInterest: debt * 0.08
      }
    ];

    return {
      debtToIncomeRatio,
      scenarios,
      recommendation: debtToIncomeRatio > 5 ? 'high_risk' : 
                     debtToIncomeRatio > 2 ? 'medium_risk' : 'low_risk'
    };
  };

  const updateMotivationLevel = () => {
    const completedDebts = debtProgress.filter(p => p.valorAtual === 0).length;
    const totalDebts = debtProgress.length;
    const achievementCount = achievements.length;
    
    const motivation = Math.min(100, 
      (completedDebts / Math.max(totalDebts, 1)) * 50 + 
      achievementCount * 10 + 
      (experiencePoints / 100) * 10
    );
    
    setMotivationLevel(motivation);
  };

  const updateGamificationLevel = () => {
    const newLevel = Math.floor(experiencePoints / 100) + 1;
    if (newLevel > gamificationLevel) {
      setGamificationLevel(newLevel);
      addNotification({
        id: Date.now().toString(),
        type: 'level_up',
        title: `Nível ${newLevel} Alcançado!`,
        message: 'Você está progredindo muito bem!',
        icon: Crown,
        color: 'text-purple-500',
        timestamp: new Date()
      });
    }
  };

  // useEffect para verificar conquistas e atualizar gamificação
  useEffect(() => {
    checkAchievements();
    updateMotivationLevel();
    updateGamificationLevel();
    
    const analysis = calculateImpactAnalysis();
    setImpactAnalysis(analysis);
  }, [debtProgress, valorDivida, rendaMensal, estrategiaSelecionada]);

  useEffect(() => {
    updateGamificationLevel();
  }, [experiencePoints]);

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
            Soluções para Dívidas
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Calcule o tempo para quitar suas dívidas e descubra as melhores estratégias 
            para reconquistar sua liberdade financeira
          </p>
        </motion.div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-0.5 sm:gap-1 overflow-x-auto">
          <TabsTrigger value="calculator" className="flex items-center gap-1 text-xs sm:text-sm px-2 sm:px-3 py-2 min-w-0 min-h-[44px] touch-manipulation">
            <Calculator className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
            <span className="hidden xs:inline truncate">Calculadora</span>
            <span className="xs:hidden">Calc</span>
          </TabsTrigger>
          <TabsTrigger value="strategies" className="flex items-center gap-1 text-xs sm:text-sm px-2 sm:px-3 py-2 min-w-0 min-h-[44px] touch-manipulation">
            <Target className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
            <span className="hidden xs:inline truncate">Estratégias</span>
            <span className="xs:hidden">Estr</span>
          </TabsTrigger>
          <TabsTrigger value="renegotiation" className="flex items-center gap-1 text-xs sm:text-sm px-2 sm:px-3 py-2 min-w-0 min-h-[44px] touch-manipulation">
            <DollarSign className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
            <span className="hidden xs:inline truncate">Renegociação</span>
            <span className="xs:hidden">Reneg</span>
          </TabsTrigger>
          <TabsTrigger value="tracking" className="flex items-center gap-1 text-xs sm:text-sm px-2 sm:px-3 py-2 min-w-0 min-h-[44px] touch-manipulation">
            <TrendingDown className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
            <span className="hidden xs:inline truncate">Acompanhamento</span>
            <span className="xs:hidden">Acomp</span>
          </TabsTrigger>
          <TabsTrigger value="analysis" className="flex items-center gap-1 text-xs sm:text-sm px-2 sm:px-3 py-2 min-w-0 min-h-[44px] touch-manipulation">
            <BarChart3 className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
            <span className="hidden xs:inline truncate">Análise</span>
            <span className="xs:hidden">Anál</span>
          </TabsTrigger>
          <TabsTrigger value="motivation" className="flex items-center gap-1 text-xs sm:text-sm px-2 sm:px-3 py-2 min-w-0 min-h-[44px] touch-manipulation">
            <Trophy className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
            <span className="hidden xs:inline truncate">Motivação</span>
            <span className="xs:hidden">Motiv</span>
          </TabsTrigger>
          <TabsTrigger value="tools" className="flex items-center gap-1 text-xs sm:text-sm px-2 sm:px-3 py-2 min-w-0 min-h-[44px] touch-manipulation">
            <Settings className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
            <span className="hidden xs:inline truncate">Ferramentas</span>
            <span className="xs:hidden">Ferr</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="calculator" className="space-y-4 sm:space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5 text-red-500" />
                    Configuração da Dívida
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="divida">Valor Total da Dívida</Label>
                      <Input
                        id="divida"
                        type="text"
                        value={valorDivida}
                        onChange={(e) => setValorDivida(e.target.value)}
                        placeholder="Digite o valor da dívida (ex: 15000)"
                        className={errors.valorDivida ? 'border-red-500' : ''}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="renda">Renda Mensal Líquida</Label>
                      <Input
                        id="renda"
                        type="text"
                        value={rendaMensal}
                        onChange={(e) => setRendaMensal(e.target.value)}
                        placeholder="Digite sua renda mensal (ex: 5000)"
                        className={errors.rendaMensal ? 'border-red-500' : ''}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="estrategia">Estratégia de Quitação</Label>
                      <Select value={estrategiaSelecionada.id} onValueChange={(value) => setEstrategiaSelecionada(strategies[value])}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione uma estratégia" />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.values(strategies).map((estrategia) => (
                            <SelectItem key={estrategia.id} value={estrategia.id}>
                              <div>
                                <div className="font-medium">{estrategia.name}</div>
                                <div className="text-sm text-gray-500">{estrategia.description}</div>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {Object.keys(errors).length > 0 && (
                      <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                        <div className="flex items-center gap-2">
                          <AlertTriangle className="h-4 w-4 text-red-500" />
                          <div className="space-y-1">
                            {Object.values(errors).map((error, index) => (
                              <p key={index} className="text-sm text-red-600 dark:text-red-400">{error}</p>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <Button
                      onClick={handleSaveProgress}
                      disabled={!valorDivida || !rendaMensal || Object.keys(errors).length > 0}
                      className="flex-1"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      Salvar Progresso
                    </Button>
                    <Button
                      variant="outline"
                      onClick={handleExportData}
                      disabled={!valorDivida || !rendaMensal || Object.keys(errors).length > 0}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="space-y-4 pt-4 border-t">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="reminders">Lembretes de Pagamento</Label>
                      <Switch
                        id="reminders"
                        checked={reminders}
                        onCheckedChange={setReminders}
                      />
                    </div>
                    

                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {calculations.result && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="h-5 w-5 text-green-500" />
                      Plano de Quitação
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                            {calculations.result.mesesParaQuitar}
                          </div>
                          <div className="text-sm text-blue-700 dark:text-blue-300">
                            Meses para quitar
                          </div>
                        </div>
                        <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                          <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                            {formatCurrency(calculations.result.valorMensalRecomendado)}
                          </div>
                          <div className="text-sm text-green-700 dark:text-green-300">
                            Valor mensal
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">Progresso da quitação</span>
                          <span className="text-sm text-gray-500">0%</span>
                        </div>
                        <Progress value={0} className="h-2" />
                      </div>

                      {calculations.result && (
                        <div className="grid grid-cols-2 gap-4 mt-4">
                          <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                            <div className="text-lg font-bold text-blue-600 dark:text-blue-400">
                              {formattedData.valorMensal}
                            </div>
                            <div className="text-sm text-blue-700 dark:text-blue-300">
                              Pagamento Mensal
                            </div>
                          </div>
                          <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                            <div className="text-lg font-bold text-green-600 dark:text-green-400">
                              {calculations.result.mesesParaQuitar} meses
                            </div>
                            <div className="text-sm text-green-700 dark:text-green-300">
                              Tempo para Quitar
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="strategies" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Estratégias de Quitação</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.values(strategies).map((strategy) => (
                  <div
                    key={strategy.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      estrategiaSelecionada.id === strategy.id
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setEstrategiaSelecionada(strategy)}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                        <Target className="h-4 w-4 text-blue-600" />
                      </div>
                      <h3 className="font-medium">{strategy.name}</h3>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                      {strategy.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <Badge variant="outline">
                        {strategy.recommendedPercentage}% da renda
                      </Badge>
                      {estrategiaSelecionada.id === strategy.id && (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="renegotiation" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-green-500" />
                  Simulador de Renegociação
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="originalValue">Valor Original da Dívida</Label>
                  <Input
                    id="originalValue"
                    type="text"
                    value={negotiationData.originalValue}
                    onChange={(e) => setNegotiationData(prev => ({ ...prev, originalValue: e.target.value }))}
                    placeholder="Ex: 10000"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="negotiationType">Tipo de Negociação</Label>
                  <Select value={negotiationData.negotiationType} onValueChange={(value) => setNegotiationData(prev => ({ ...prev, negotiationType: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      {NEGOTIATION_TYPES.map((type) => (
                        <SelectItem key={type.id} value={type.id}>
                          <div className="flex items-center gap-2">
                            <type.icon className={`h-4 w-4 ${type.color}`} />
                            <div>
                              <div className="font-medium">{type.name}</div>
                              <div className="text-sm text-gray-500">{type.expectedDiscount}</div>
                            </div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="proposedValue">Valor Proposto</Label>
                  <Input
                    id="proposedValue"
                    type="text"
                    value={negotiationData.proposedValue}
                    onChange={(e) => setNegotiationData(prev => ({ ...prev, proposedValue: e.target.value }))}
                    placeholder="Ex: 7000"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="installments">Parcelas</Label>
                    <Input
                      id="installments"
                      type="text"
                      value={negotiationData.installments}
                      onChange={(e) => setNegotiationData(prev => ({ ...prev, installments: e.target.value }))}
                      placeholder="Ex: 12"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="interestRate">Taxa de Juros (%)</Label>
                    <Input
                      id="interestRate"
                      type="text"
                      value={negotiationData.interestRate}
                      onChange={(e) => setNegotiationData(prev => ({ ...prev, interestRate: e.target.value }))}
                      placeholder="Ex: 2.5"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Observações</Label>
                  <Textarea
                    id="notes"
                    value={negotiationData.notes}
                    onChange={(e) => setNegotiationData(prev => ({ ...prev, notes: e.target.value }))}
                    placeholder="Adicione observações sobre a negociação..."
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            {negotiationData.originalValue && negotiationData.proposedValue && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="h-5 w-5 text-blue-500" />
                      Resultado da Simulação
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {(() => {
                      const result = simulateNegotiation();
                      return (
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="text-center p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                              <div className="text-lg font-bold text-red-600 dark:text-red-400">
                                {formatCurrency(result.originalValue)}
                              </div>
                              <div className="text-sm text-red-700 dark:text-red-300">
                                Valor Original
                              </div>
                            </div>
                            <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                              <div className="text-lg font-bold text-green-600 dark:text-green-400">
                                {formatCurrency(result.negotiatedValue)}
                              </div>
                              <div className="text-sm text-green-700 dark:text-green-300">
                                Valor Negociado
                              </div>
                            </div>
                          </div>

                          <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                              {formatCurrency(result.savings)}
                            </div>
                            <div className="text-sm text-blue-700 dark:text-blue-300">
                              Economia Total ({result.savingsPercentage.toFixed(1)}%)
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div className="text-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                              <div className="text-lg font-bold text-purple-600 dark:text-purple-400">
                                {formatCurrency(result.monthlyPayment)}
                              </div>
                              <div className="text-sm text-purple-700 dark:text-purple-300">
                                Parcela Mensal
                              </div>
                            </div>
                            <div className="text-center p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                              <div className="text-lg font-bold text-orange-600 dark:text-orange-400">
                                {result.installments}x
                              </div>
                              <div className="text-sm text-orange-700 dark:text-orange-300">
                                Parcelas
                              </div>
                            </div>
                          </div>

                          {result.interestAmount > 0 && (
                            <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border-l-4 border-yellow-500">
                              <div className="flex items-center gap-2">
                                <AlertTriangle className="h-4 w-4 text-yellow-500" />
                                <div>
                                  <div className="font-medium text-yellow-700 dark:text-yellow-300">
                                    Juros: {formatCurrency(result.interestAmount)}
                                  </div>
                                  <div className="text-sm text-yellow-600 dark:text-yellow-400">
                                    Total com juros: {formatCurrency(result.totalWithInterest)}
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })()}
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="h-5 w-5 text-blue-500" />
                Tipos de Renegociação
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {NEGOTIATION_TYPES.map((type) => (
                  <div
                    key={type.id}
                    className="p-4 border rounded-lg hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => setNegotiationData(prev => ({ ...prev, negotiationType: type.id }))}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <type.icon className={`h-5 w-5 ${type.color}`} />
                      <h3 className="font-medium">{type.name}</h3>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      {type.description}
                    </p>
                    <Badge variant="outline" className="text-xs">
                      Desconto: {type.expectedDiscount}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tracking" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Acompanhamento de Dívidas</CardTitle>
            </CardHeader>
            <CardContent>
              {debtProgress.length > 0 ? (
                <div className="space-y-3">
                  {debtProgress.map((progress) => (
                    <motion.div
                      key={progress.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3 }}
                      className="p-4 border rounded-lg bg-white dark:bg-gray-800"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">
                            {formatCurrency(progress.valorInicial)} - {progress.estrategia.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            Criado em: {new Date(progress.createdAt).toLocaleDateString()}
                          </div>
                          <div className="text-sm text-gray-500">
                            Valor atual: {formatCurrency(progress.valorAtual)}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          {progress.valorAtual > 0 ? (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => markDebtAsPaid(progress.id)}
                            >
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Marcar como Paga
                            </Button>
                          ) : (
                            <Badge variant="secondary" className="bg-green-100 text-green-800">
                              Quitada
                            </Badge>
                          )}
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => removeDebt(progress.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      
                      {progress.valorAtual > 0 && (
                        <div className="mt-3">
                          <div className="flex justify-between text-sm mb-1">
                            <span>Progresso</span>
                            <span>
                              {Math.round(((progress.valorInicial - progress.valorAtual) / progress.valorInicial) * 100)}%
                            </span>
                          </div>
                          <Progress 
                            value={((progress.valorInicial - progress.valorAtual) / progress.valorInicial) * 100} 
                            className="h-2" 
                          />
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  <TrendingDown className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Nenhuma dívida registrada ainda</p>
                  <p className="text-sm">Use a calculadora para começar a acompanhar suas dívidas</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analysis" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {impactAnalysis && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-blue-500" />
                    Análise de Impacto Financeiro
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center p-4 bg-gray-50 dark:bg-gray-900/20 rounded-lg">
                      <div className="text-2xl font-bold text-gray-700 dark:text-gray-300">
                        {impactAnalysis.debtToIncomeRatio.toFixed(1)}x
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Relação Dívida/Renda
                      </div>
                      <Badge 
                        variant={impactAnalysis.recommendation === 'high_risk' ? 'destructive' : 
                                impactAnalysis.recommendation === 'medium_risk' ? 'default' : 'secondary'}
                        className="mt-2"
                      >
                        {impactAnalysis.recommendation === 'high_risk' ? 'Alto Risco' :
                         impactAnalysis.recommendation === 'medium_risk' ? 'Risco Médio' : 'Baixo Risco'}
                      </Badge>
                    </div>

                    <div className="space-y-3">
                      <h4 className="font-medium">Cenários de Pagamento</h4>
                      {impactAnalysis.scenarios.map((scenario: any, index: number) => (
                        <div key={index} className="p-3 border rounded-lg">
                          <div className="flex justify-between items-center mb-2">
                            <span className="font-medium">{scenario.name}</span>
                            <Badge variant="outline">
                              {scenario.timeToPayOff.toFixed(1)} meses
                            </Badge>
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div>
                              <span className="text-gray-500">Parcela: </span>
                              <span className="font-medium">{formatCurrency(scenario.monthlyPayment)}</span>
                            </div>
                            <div>
                              <span className="text-gray-500">Juros: </span>
                              <span className="font-medium">{formatCurrency(scenario.totalInterest)}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-orange-500" />
                  Alertas Inteligentes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {getSmartAlerts().map((alert, index) => (
                    <motion.div
                      key={alert.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                      className={`p-4 rounded-lg border-l-4 ${
                        alert.priority === 'high' ? 'bg-red-50 dark:bg-red-900/20 border-red-500' :
                        alert.priority === 'medium' ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-500' :
                        'bg-blue-50 dark:bg-blue-900/20 border-blue-500'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <alert.icon className={`h-5 w-5 ${alert.color} mt-0.5`} />
                        <div>
                          <h4 className="font-medium mb-1">{alert.title}</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {alert.message}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-500" />
                Gráfico de Progresso
              </CardTitle>
            </CardHeader>
            <CardContent>
              {debtProgress.length > 0 ? (
                <div className="h-48 sm:h-64 md:h-80 w-full overflow-hidden">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart 
                      data={debtProgress.map((p, index) => ({
                        mes: `Mês ${index + 1}`,
                        valorRestante: p.valorAtual,
                        valorPago: p.valorInicial - p.valorAtual
                      }))}
                      margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="mes" fontSize={10} tick={{ fontSize: 10 }} />
                      <YAxis fontSize={10} tick={{ fontSize: 10 }} width={60} />
                      <Tooltip formatter={(value: any) => formatCurrency(value)} />
                      <Area 
                        type="monotone" 
                        dataKey="valorRestante" 
                        stackId="1"
                        stroke="#ef4444" 
                        fill="#ef4444" 
                        fillOpacity={0.6}
                        name="Valor Restante"
                      />
                      <Area 
                        type="monotone" 
                        dataKey="valorPago" 
                        stackId="1"
                        stroke="#22c55e" 
                        fill="#22c55e" 
                        fillOpacity={0.6}
                        name="Valor Pago"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Nenhum dado de progresso disponível</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="motivation" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-yellow-500" />
                  Sistema de Conquistas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center p-4 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                      Nível {gamificationLevel}
                    </div>
                    <div className="text-sm text-purple-700 dark:text-purple-300">
                      {experiencePoints} XP
                    </div>
                    <Progress 
                      value={(experiencePoints % 100)} 
                      className="mt-2 h-2" 
                    />
                    <div className="text-xs text-gray-500 mt-1">
                      {100 - (experiencePoints % 100)} XP para o próximo nível
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-medium">Conquistas Disponíveis</h4>
                    <div className="grid grid-cols-1 gap-3">
                      {DEBT_ACHIEVEMENTS.map((achievement) => {
                        const isUnlocked = achievements.includes(achievement.id);
                        const IconComponent = achievement.icon;
                        
                        return (
                          <div
                            key={achievement.id}
                            className={`p-3 rounded-lg border ${
                              isUnlocked 
                                ? `${achievement.bgColor} ${achievement.borderColor}` 
                                : 'bg-gray-50 dark:bg-gray-900/20 border-gray-200 dark:border-gray-800'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <IconComponent 
                                className={`h-6 w-6 ${
                                  isUnlocked ? achievement.color : 'text-gray-400'
                                }`} 
                              />
                              <div className="flex-1">
                                <div className={`font-medium ${
                                  isUnlocked ? 'text-gray-900 dark:text-white' : 'text-gray-500'
                                }`}>
                                  {achievement.title}
                                </div>
                                <div className="text-sm text-gray-600 dark:text-gray-400">
                                  {achievement.description}
                                </div>
                              </div>
                              <div className="text-right">
                                <Badge variant={isUnlocked ? "default" : "outline"}>
                                  {achievement.points} XP
                                </Badge>
                                {isUnlocked && (
                                  <CheckCircle className="h-4 w-4 text-green-500 mt-1" />
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Flame className="h-5 w-5 text-orange-500" />
                  Motivação e Progresso
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center p-4 bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-lg">
                    <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                      {motivationLevel.toFixed(0)}%
                    </div>
                    <div className="text-sm text-orange-700 dark:text-orange-300">
                      Nível de Motivação
                    </div>
                    <Progress 
                      value={motivationLevel} 
                      className="mt-2 h-3" 
                    />
                  </div>

                  {notifications.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="font-medium">Notificações Recentes</h4>
                      <div className="space-y-2 max-h-64 overflow-y-auto">
                        {notifications.map((notification) => {
                          const IconComponent = notification.icon;
                          return (
                            <motion.div
                              key={notification.id}
                              initial={{ opacity: 0, scale: 0.95 }}
                              animate={{ opacity: 1, scale: 1 }}
                              className="p-3 bg-white dark:bg-gray-800 border rounded-lg shadow-sm"
                            >
                              <div className="flex items-start gap-3">
                                <IconComponent className={`h-5 w-5 ${notification.color} mt-0.5`} />
                                <div className="flex-1">
                                  <div className="font-medium text-sm">
                                    {notification.title}
                                  </div>
                                  <div className="text-xs text-gray-600 dark:text-gray-400">
                                    {notification.message}
                                  </div>
                                  <div className="text-xs text-gray-500 mt-1">
                                    {new Date(notification.timestamp).toLocaleString()}
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <h4 className="font-medium mb-2 text-blue-700 dark:text-blue-300">
                      Mensagem Motivacional
                    </h4>
                    <p className="text-sm text-blue-600 dark:text-blue-400">
                      {MOTIVATIONAL_MESSAGES[Math.floor(Math.random() * MOTIVATIONAL_MESSAGES.length)]}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="tools" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="h-5 w-5 text-purple-500" />
                  Calculadora de Juros Compostos
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="principal">Valor Principal</Label>
                  <Input
                    id="principal"
                    type="text"
                    value={compoundInterestData.principal}
                    onChange={(e) => setCompoundInterestData(prev => ({ ...prev, principal: e.target.value }))}
                    placeholder="Ex: 10000"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="rate">Taxa de Juros Anual (%)</Label>
                  <Input
                    id="rate"
                    type="text"
                    value={compoundInterestData.rate}
                    onChange={(e) => setCompoundInterestData(prev => ({ ...prev, rate: e.target.value }))}
                    placeholder="Ex: 12"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="time">Tempo (anos)</Label>
                    <Input
                      id="time"
                      type="text"
                      value={compoundInterestData.time}
                      onChange={(e) => setCompoundInterestData(prev => ({ ...prev, time: e.target.value }))}
                      placeholder="Ex: 2"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="compound">Capitalização</Label>
                    <Select value={compoundInterestData.compound} onValueChange={(value) => setCompoundInterestData(prev => ({ ...prev, compound: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="monthly">Mensal</SelectItem>
                        <SelectItem value="quarterly">Trimestral</SelectItem>
                        <SelectItem value="annually">Anual</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {compoundInterestData.principal && compoundInterestData.rate && compoundInterestData.time && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg"
                  >
                    {(() => {
                      const result = calculateCompoundInterest();
                      return (
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600 dark:text-gray-400">Valor Final:</span>
                            <span className="font-medium">{formatCurrency(result.finalAmount)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600 dark:text-gray-400">Juros Totais:</span>
                            <span className="font-medium text-red-600 dark:text-red-400">
                              {formatCurrency(result.totalInterest)}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600 dark:text-gray-400">Pagamento Mensal:</span>
                            <span className="font-medium">{formatCurrency(result.monthlyPayment)}</span>
                          </div>
                        </div>
                      );
                    })()}
                  </motion.div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <RefreshCw className="h-5 w-5 text-green-500" />
                  Ferramentas Adicionais
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => {
                    const message = MOTIVATIONAL_MESSAGES[Math.floor(Math.random() * MOTIVATIONAL_MESSAGES.length)];
                    addNotification({
                      id: Date.now().toString(),
                      type: 'motivation',
                      title: 'Mensagem Motivacional',
                      message,
                      icon: Star,
                      color: 'text-yellow-500',
                      timestamp: new Date()
                    });
                  }}
                >
                  <Star className="h-4 w-4 mr-2" />
                  Receber Motivação
                </Button>

                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={handleExportData}
                  disabled={!valorDivida || !rendaMensal}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Exportar Dados
                </Button>

                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => {
                    setAchievements([]);
                    setNotifications([]);
                    setExperiencePoints(0);
                    setGamificationLevel(1);
                    setMotivationLevel(0);
                  }}
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Resetar Progresso
                </Button>

                <div className="p-4 bg-gray-50 dark:bg-gray-900/20 rounded-lg">
                  <h4 className="font-medium mb-2">Estatísticas Rápidas</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Conquistas:</span>
                      <span className="font-medium">{achievements.length}/{DEBT_ACHIEVEMENTS.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>XP Total:</span>
                      <span className="font-medium">{experiencePoints}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Nível Atual:</span>
                      <span className="font-medium">{gamificationLevel}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Dívidas Ativas:</span>
                      <span className="font-medium">{debtProgress.filter(p => p.valorAtual > 0).length}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {recommendations.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Recomendações Personalizadas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recommendations.map((rec, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg border-l-4 border-amber-500"
                  >
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      {rec}
                    </p>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {statistics && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.0 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Estatísticas Gerais</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                  <div className="text-lg font-bold text-red-600 dark:text-red-400">
                    {statistics.totalDividas}
                  </div>
                  <div className="text-sm text-red-700 dark:text-red-300">
                    Total em Dívidas
                  </div>
                </div>
                <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div className="text-lg font-bold text-blue-600 dark:text-blue-400">
                    {statistics.dividasAtivas}
                  </div>
                  <div className="text-sm text-blue-700 dark:text-blue-300">
                    Dívidas Ativas
                  </div>
                </div>
                <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <div className="text-lg font-bold text-green-600 dark:text-green-400">
                    {statistics.dividasQuitadas}
                  </div>
                  <div className="text-sm text-green-700 dark:text-green-300">
                    Dívidas Quitadas
                  </div>
                </div>
                <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <div className="text-lg font-bold text-purple-600 dark:text-purple-400">
                    {statistics.progressoMedio}%
                  </div>
                  <div className="text-sm text-purple-700 dark:text-purple-300">
                    Taxa de Quitação
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
};