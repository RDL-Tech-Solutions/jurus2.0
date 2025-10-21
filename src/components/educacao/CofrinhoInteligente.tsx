import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { PiggyBank, TrendingUp, Settings, RotateCcw, Save, Download, Trash2, Star } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';
import { Slider } from '../ui/slider';
import { useCofrinho } from '../../hooks/useCofrinho';
import { formatCurrency, formatPercentage } from '../../utils/educacaoFinanceiraCalculos';

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

  const handleSaveCdiConfig = () => {
    updateCdiConfig(tempCdiConfig);
    setShowCdiConfig(false);
  };

  const handleExportData = () => {
    const exportData = {
      valorInicial,
      tempoMeses,
      aporteMensal,
      calculations,
      cdiConfig,
      history,
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
            Veja como seu dinheiro pode crescer ao longo do tempo!
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
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
                  <Label htmlFor="valorInicial">Valor Inicial</Label>
                  <Input
                    id="valorInicial"
                    type="text"
                    value={formattedData.valorInicial}
                    onChange={(e) => setValorInicial(e.target.value)}
                    placeholder="R$ 0,00"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contribuicao">Contribuição Mensal (Opcional)</Label>
                  <Input
                    id="contribuicao"
                    type="text"
                    value={formattedData.aporteMensal}
                    onChange={(e) => setAporteMensal(e.target.value)}
                    placeholder="R$ 0,00"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tempo">Tempo de Investimento: {tempoMeses} meses</Label>
                  <Slider
                    value={[parseInt(tempoMeses) || 12]}
                    onValueChange={([value]) => setTempoMeses(value.toString())}
                    max={120}
                    min={1}
                    step={1}
                    className="mt-2"
                  />
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
              <div className="flex gap-2">
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
                  Salvar
                </Button>
                <Button
                  variant="outline"
                  onClick={handleExportData}
                  disabled={!valorInicial || parseFloat(valorInicial.replace(',', '.')) <= 0}
                >
                  <Download className="h-4 w-4" />
                </Button>
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
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                        {calculations.result ? formatCurrency(calculations.result.valorFinal) : 'R$ 0,00'}
                      </div>
                      <div className="text-sm text-green-700 dark:text-green-300">
                        Valor Final
                      </div>
                    </div>
                    <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                        {calculations.result ? formatCurrency(calculations.result.ganhoTotal) : 'R$ 0,00'}
                      </div>
                      <div className="text-sm text-blue-700 dark:text-blue-300">
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
      {calculations && calculations.result && calculations.result.crescimentoMensal && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Evolução do Investimento</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={calculations.result.crescimentoMensal}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="mes" 
                      label={{ value: 'Mês', position: 'insideBottom', offset: -5 }}
                    />
                    <YAxis 
                      tickFormatter={(value) => formatCurrency(value)}
                      label={{ value: 'Valor', angle: -90, position: 'insideLeft' }}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Area 
                      type="monotone" 
                      dataKey="cofrinho" 
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
    </div>
  );
};