import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { CreditCard, TrendingDown, Target, AlertTriangle, CheckCircle, Trash2, Save, Download } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { useDividas } from '../../hooks/useDividas';
import { formatCurrency, formatPercentage } from '../../utils/educacaoFinanceiraCalculos';
import type { DebtStrategy } from '../../types/educacaoFinanceira';

const ESTRATEGIAS = [
  { value: 'bola_neve', label: 'Bola de Neve', description: 'Quite primeiro as menores dívidas' },
  { value: 'avalanche', label: 'Avalanche', description: 'Quite primeiro as dívidas com maior juros' },
  { value: 'minimo', label: 'Pagamento Mínimo', description: 'Pague apenas o mínimo de cada dívida' }
];

const MOTIVATIONAL_MESSAGES = [
  "Cada pagamento te aproxima da liberdade financeira! 💪",
  "Você está no caminho certo para quitar suas dívidas! 🎯",
  "Persistência é a chave para o sucesso financeiro! ⭐",
  "Cada real pago é um passo em direção aos seus sonhos! 🌟",
  "Sua disciplina hoje será sua liberdade amanhã! 🚀"
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
        <p className="font-semibold text-gray-900 dark:text-white">Mês {label}</p>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Saldo: {formatCurrency(payload[0].value)}
        </p>
      </div>
    );
  }
  return null;
};

export const SolucoesDividas: React.FC = () => {
  const {
    // Estados
    valorDivida,
    rendaMensal,
    estrategiaSelecionada,
    isCalculating,
    errors,
    debtProgress,
    // Setters
    setValorDivida: updateValorDivida,
    setRendaMensal: updateRendaMensal,
    setEstrategiaSelecionada: updateEstrategia,
    validateInputs,
    saveDebtProgress,
    updateDebtProgress,
    removeDebt,
    markDebtAsPaid,
    clearAll,
    
    // Dados computados
    calculations,
    statistics,
    recommendations,
    formattedData
  } = useDividas();

  const [showProgressHistory, setShowProgressHistory] = useState(false);
  const [selectedProgress, setSelectedProgress] = useState<string | null>(null);

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
      estrategiaSelecionada,
      calculations,
      timestamp: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { 
      type: 'application/json' 
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `solucoes-dividas-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getRandomMotivationalMessage = () => {
    return MOTIVATIONAL_MESSAGES[Math.floor(Math.random() * MOTIVATIONAL_MESSAGES.length)];
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
            Soluções para Dívidas
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Calcule o tempo para quitar suas dívidas e descubra as melhores estratégias 
            para reconquistar sua liberdade financeira
          </p>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Configuração */}
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
              {/* Inputs */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="divida">Valor Total da Dívida</Label>
                  <Input
                    id="divida"
                    type="text"
                    value={formattedData.valorDivida}
                    onChange={(e) => updateValorDivida(e.target.value)}
                    placeholder="R$ 0,00"
                    className={errors.valorDivida ? 'border-red-500' : ''}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="renda">Renda Mensal Líquida</Label>
                  <Input
                    id="renda"
                    type="text"
                    value={formattedData.rendaMensal}
                    onChange={(e) => updateRendaMensal(e.target.value)}
                    placeholder="R$ 0,00"
                    className={errors.rendaMensal ? 'border-red-500' : ''}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="estrategia">Estratégia de Quitação</Label>
                  <Select value={estrategiaSelecionada as unknown as string} onValueChange={(value) => updateEstrategia(value as unknown as DebtStrategy)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma estratégia" />
                    </SelectTrigger>
                    <SelectContent>
                      {ESTRATEGIAS.map((estrategia) => (
                        <SelectItem key={estrategia.value} value={estrategia.value}>
                          <div>
                            <div className="font-medium">{estrategia.label}</div>
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

              {/* Ações */}
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

              {/* Histórico de Progresso */}
              {debtProgress.length > 0 && (
                <div className="space-y-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowProgressHistory(!showProgressHistory)}
                    className="w-full"
                  >
                    {showProgressHistory ? 'Ocultar' : 'Ver'} Histórico ({debtProgress.length})
                  </Button>
                  
                  {showProgressHistory && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="space-y-2 max-h-40 overflow-y-auto"
                    >
                      {debtProgress.map((progress) => (
                        <div
                          key={progress.id}
                          className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded text-sm"
                        >
                          <div>
                            <div className="font-medium">
                              {formatCurrency(progress.valorInicial)} - {progress.estrategia.name}
                            </div>
                            <div className="text-gray-500">
                              {new Date(progress.createdAt).toLocaleDateString()}
                            </div>
                          </div>
                          <div className="flex gap-1">
                            {progress.valorAtual > 0 && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => markDebtAsPaid(progress.id)}
                              >
                                <CheckCircle className="h-3 w-3" />
                              </Button>
                            )}
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => removeDebt(progress.id)}
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
              {calculations ? (
                <div className="space-y-6">
                  {/* Estatísticas Principais */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                        {calculations.result?.mesesParaQuitar || 0}
                      </div>
                      <div className="text-sm text-blue-700 dark:text-blue-300">
                        Meses para quitar
                      </div>
                    </div>
                    <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                        {formatCurrency(calculations.result?.valorMensalRecomendado || 0)}
                      </div>
                      <div className="text-sm text-green-700 dark:text-green-300">
                        Pagamento mensal
                      </div>
                    </div>
                  </div>

                  {/* Progresso Visual */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progresso da Quitação</span>
                      <span>{formatPercentage(calculations.result?.percentualRenda || 0)}</span>
                    </div>
                    <Progress value={calculations.result?.percentualRenda || 0} className="h-2" />
                  </div>

                  {/* Estratégia Selecionada */}
                  <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingDown className="h-4 w-4 text-blue-500" />
                      <span className="font-medium">Estratégia: {estrategiaSelecionada.name}</span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {estrategiaSelecionada.description}
                    </p>
                  </div>

                  {/* Mensagem Motivacional */}
                  <div className="p-4 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-lg border-l-4 border-green-500">
                    <p className="text-sm text-gray-700 dark:text-gray-300 font-medium">
                      {getRandomMotivationalMessage()}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="h-64 flex items-center justify-center text-gray-500 dark:text-gray-400">
                  <div className="text-center">
                    <CreditCard className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Preencha os dados para ver seu plano de quitação</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>



      {/* Recomendações */}
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

      {/* Estatísticas de Dívidas */}
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