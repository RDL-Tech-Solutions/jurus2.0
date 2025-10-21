import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { DollarSign, Settings, RotateCcw, Save, Download } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Slider } from '../ui/slider';
import { Badge } from '../ui/badge';
import { useSimulador5030 } from '../../hooks/useSimulador5030';
import { formatCurrency } from '../../utils/educacaoFinanceiraCalculos';

const COLORS = {
  necessidades: '#10B981', // green-500
  desejos: '#F59E0B',      // amber-500
  poupanca: '#3B82F6'      // blue-500
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
        <p className="font-semibold text-gray-900 dark:text-white">{data.name}</p>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {data.percentage}% - {formatCurrency(data.value)}
        </p>
      </div>
    );
  }
  return null;
};

export const Simulador5030: React.FC = () => {
  const {
    // // Estados
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

  const handleSaveCustomConfig = () => {
    applyCustomConfig(tempConfig.necessidades, tempConfig.desejos, tempConfig.poupanca);
    setShowCustomConfig(false);
  };

  const handleExportData = () => {
    const exportData = {
      rendaMensal,
      config,
      calculations,
      timestamp: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { 
      type: 'application/json' 
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `simulador-50-30-20-${new Date().toISOString().split('T')[0]}.json`;
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
            Simulador 50-30-20
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Organize suas finanças seguindo a regra 50-30-20: 50% para necessidades, 
            30% para desejos e 20% para poupança e investimentos
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
                <DollarSign className="h-5 w-5 text-green-500" />
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
                  value={formattedData.renda}
                  onChange={(e) => updateRendaMensal(e.target.value)}
                  placeholder="R$ 0,00"
                  className={errors.rendaMensal ? 'border-red-500' : ''}
                />
                {errors.rendaMensal && (
                  <p className="text-sm text-red-500">{errors.rendaMensal}</p>
                )}
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
                    </div>

                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={handleSaveCustomConfig}
                        className="flex-1"
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
                  onClick={saveSimulation}
                  disabled={!rendaMensal || parseFloat(rendaMensal.replace(',', '.')) <= 0}
                  className="flex-1"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Salvar
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
              <CardTitle>Distribuição da Renda</CardTitle>
            </CardHeader>
            <CardContent>
              {parseFloat(rendaMensal.replace(',', '.')) > 0 ? (
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={calculations.pieData as any}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={120}
                        paddingAngle={2}
                        dataKey="value"
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
                    className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border-l-4 border-blue-500"
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
    </div>
  );
};