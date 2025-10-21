import React, { memo, useState, useMemo } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  Calculator, 
  TrendingUp, 
  Calendar, 
  DollarSign, 
  Target,
  BarChart3,
  PieChart,
  Zap
} from 'lucide-react';
import { MetaFinanceira } from '../types/metas';
import { formatCurrency } from '../utils/formatters';
import { useMetasFinanceiras } from '../hooks/useMetasFinanceiras';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

interface ModalSimulacaoProps {
  metaId: string;
  onFechar: () => void;
}

const ModalSimulacao = memo(({ metaId, onFechar }: ModalSimulacaoProps) => {
  const { metas } = useMetasFinanceiras();
  const meta = metas.find(m => m.id === metaId);

  const [simulacao, setSimulacao] = useState({
    valorMensal: 500,
    valorInicial: 0,
    taxaJuros: 0.5, // 0.5% ao mês
    prazoMeses: 12
  });

  const [cenarioComparacao, setCenarioComparacao] = useState({
    cenario1: { valorMensal: 500, taxaJuros: 0.5 },
    cenario2: { valorMensal: 750, taxaJuros: 0.5 },
    cenario3: { valorMensal: 1000, taxaJuros: 0.5 }
  });

  // Cálculos da simulação
  const resultadoSimulacao = useMemo(() => {
    if (!meta) return null;

    const { valorMensal, valorInicial, taxaJuros, prazoMeses } = simulacao;
    const taxaMensal = taxaJuros / 100;
    
    // Cálculo do valor futuro com juros compostos
    const valorFuturoInicial = valorInicial * Math.pow(1 + taxaMensal, prazoMeses);
    
    // Cálculo do valor futuro das parcelas mensais
    const valorFuturoParcelas = valorMensal * (Math.pow(1 + taxaMensal, prazoMeses) - 1) / taxaMensal;
    
    const valorTotal = valorFuturoInicial + valorFuturoParcelas;
    const totalInvestido = valorInicial + (valorMensal * prazoMeses);
    const jurosGanhos = valorTotal - totalInvestido;
    
    // Tempo para atingir a meta
    let mesesParaMeta = 0;
    let valorAcumulado = valorInicial;
    
    while (valorAcumulado < meta.valorMeta && mesesParaMeta < 600) { // máximo 50 anos
      mesesParaMeta++;
      valorAcumulado = valorAcumulado * (1 + taxaMensal) + valorMensal;
    }

    // Evolução mensal
    const evolucaoMensal = [];
    let saldo = valorInicial;
    
    for (let mes = 0; mes <= Math.min(prazoMeses, mesesParaMeta); mes++) {
      if (mes > 0) {
        saldo = saldo * (1 + taxaMensal) + valorMensal;
      }
      
      evolucaoMensal.push({
        mes,
        saldo,
        investido: valorInicial + (valorMensal * mes),
        juros: saldo - (valorInicial + (valorMensal * mes))
      });
    }

    return {
      valorTotal,
      totalInvestido,
      jurosGanhos,
      mesesParaMeta,
      evolucaoMensal,
      atingeMeta: valorTotal >= meta.valorMeta
    };
  }, [meta, simulacao]);

  // Comparação de cenários
  const comparacaoCenarios = useMemo(() => {
    if (!meta) return [];

    return Object.entries(cenarioComparacao).map(([nome, cenario]) => {
      const { valorMensal, taxaJuros } = cenario;
      const taxaMensal = taxaJuros / 100;
      
      // Calcular tempo para atingir a meta
      let meses = 0;
      let valor = meta.valorAtual;
      
      while (valor < meta.valorMeta && meses < 600) {
        meses++;
        valor = valor * (1 + taxaMensal) + valorMensal;
      }
      
      const totalInvestido = (valorMensal * meses);
      const jurosGanhos = meta.valorMeta - meta.valorAtual - totalInvestido;
      
      return {
        nome: nome === 'cenario1' ? 'Conservador' : nome === 'cenario2' ? 'Moderado' : 'Agressivo',
        valorMensal,
        taxaJuros,
        meses,
        anos: (meses / 12).toFixed(1),
        totalInvestido,
        jurosGanhos,
        cor: nome === 'cenario1' ? '#8884d8' : nome === 'cenario2' ? '#82ca9d' : '#ffc658'
      };
    });
  }, [meta, cenarioComparacao]);

  if (!meta) {
    return null;
  }

  return (
    <Dialog open={true} onOpenChange={onFechar}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Simulador de Cenários: {meta.nome}
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="simulacao" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="simulacao">Simulação Personalizada</TabsTrigger>
            <TabsTrigger value="cenarios">Comparação de Cenários</TabsTrigger>
            <TabsTrigger value="estrategias">Estratégias</TabsTrigger>
          </TabsList>

          <TabsContent value="simulacao" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Parâmetros da Simulação */}
              <Card>
                <CardHeader>
                  <CardTitle>Parâmetros da Simulação</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="valorMensal">Valor Mensal (R$)</Label>
                    <Input
                      id="valorMensal"
                      type="number"
                      value={simulacao.valorMensal}
                      onChange={(e) => setSimulacao(prev => ({ ...prev, valorMensal: Number(e.target.value) }))}
                      min="0"
                      step="50"
                    />
                  </div>

                  <div>
                    <Label htmlFor="valorInicial">Valor Inicial (R$)</Label>
                    <Input
                      id="valorInicial"
                      type="number"
                      value={simulacao.valorInicial}
                      onChange={(e) => setSimulacao(prev => ({ ...prev, valorInicial: Number(e.target.value) }))}
                      min="0"
                      step="100"
                    />
                  </div>

                  <div>
                    <Label htmlFor="taxaJuros">Taxa de Juros Mensal (%)</Label>
                    <Input
                      id="taxaJuros"
                      type="number"
                      value={simulacao.taxaJuros}
                      onChange={(e) => setSimulacao(prev => ({ ...prev, taxaJuros: Number(e.target.value) }))}
                      min="0"
                      max="5"
                      step="0.1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="prazoMeses">Prazo (meses)</Label>
                    <Input
                      id="prazoMeses"
                      type="number"
                      value={simulacao.prazoMeses}
                      onChange={(e) => setSimulacao(prev => ({ ...prev, prazoMeses: Number(e.target.value) }))}
                      min="1"
                      max="600"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Resultados */}
              <Card>
                <CardHeader>
                  <CardTitle>Resultados da Simulação</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {resultadoSimulacao && (
                    <>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-3 bg-blue-50 rounded-lg">
                          <p className="text-sm text-blue-600">Valor Total</p>
                          <p className="text-lg font-bold text-blue-800">
                            {formatCurrency(resultadoSimulacao.valorTotal)}
                          </p>
                        </div>
                        
                        <div className="p-3 bg-green-50 rounded-lg">
                          <p className="text-sm text-green-600">Juros Ganhos</p>
                          <p className="text-lg font-bold text-green-800">
                            {formatCurrency(resultadoSimulacao.jurosGanhos)}
                          </p>
                        </div>
                        
                        <div className="p-3 bg-purple-50 rounded-lg">
                          <p className="text-sm text-purple-600">Total Investido</p>
                          <p className="text-lg font-bold text-purple-800">
                            {formatCurrency(resultadoSimulacao.totalInvestido)}
                          </p>
                        </div>
                        
                        <div className="p-3 bg-orange-50 rounded-lg">
                          <p className="text-sm text-orange-600">Tempo para Meta</p>
                          <p className="text-lg font-bold text-orange-800">
                            {resultadoSimulacao.mesesParaMeta} meses
                          </p>
                        </div>
                      </div>

                      <div className={`p-3 rounded-lg ${resultadoSimulacao.atingeMeta ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                        <p className={`font-medium ${resultadoSimulacao.atingeMeta ? 'text-green-800' : 'text-red-800'}`}>
                          {resultadoSimulacao.atingeMeta 
                            ? '✅ Meta será atingida no prazo!' 
                            : '⚠️ Meta não será atingida no prazo especificado'
                          }
                        </p>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Gráfico de Evolução */}
            {resultadoSimulacao && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Evolução do Investimento
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={resultadoSimulacao.evolucaoMensal}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="mes" />
                      <YAxis />
                      <Tooltip formatter={(value: any) => [formatCurrency(value), '']} />
                      <Line type="monotone" dataKey="saldo" stroke="#8884d8" strokeWidth={2} name="Saldo Total" />
                      <Line type="monotone" dataKey="investido" stroke="#82ca9d" strokeWidth={2} name="Total Investido" />
                      <Line type="monotone" dataKey="juros" stroke="#ffc658" strokeWidth={2} name="Juros Acumulados" />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="cenarios" className="space-y-6">
            {/* Configuração dos Cenários */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {Object.entries(cenarioComparacao).map(([key, cenario], index) => (
                <Card key={key}>
                  <CardHeader>
                    <CardTitle className="text-lg">
                      {key === 'cenario1' ? 'Conservador' : key === 'cenario2' ? 'Moderado' : 'Agressivo'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <Label>Valor Mensal (R$)</Label>
                      <Input
                        type="number"
                        value={cenario.valorMensal}
                        onChange={(e) => setCenarioComparacao(prev => ({
                          ...prev,
                          [key]: { ...prev[key as keyof typeof prev], valorMensal: Number(e.target.value) }
                        }))}
                        min="0"
                        step="50"
                      />
                    </div>
                    <div>
                      <Label>Taxa Mensal (%)</Label>
                      <Input
                        type="number"
                        value={cenario.taxaJuros}
                        onChange={(e) => setCenarioComparacao(prev => ({
                          ...prev,
                          [key]: { ...prev[key as keyof typeof prev], taxaJuros: Number(e.target.value) }
                        }))}
                        min="0"
                        max="5"
                        step="0.1"
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Comparação Visual */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Comparação de Cenários
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={comparacaoCenarios}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="nome" />
                    <YAxis />
                    <Tooltip formatter={(value: any) => [value, '']} />
                    <Bar dataKey="meses" fill="#8884d8" name="Meses para Meta" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Tabela de Comparação */}
            <Card>
              <CardHeader>
                <CardTitle>Detalhes dos Cenários</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-2">Cenário</th>
                        <th className="text-left p-2">Valor Mensal</th>
                        <th className="text-left p-2">Taxa (%)</th>
                        <th className="text-left p-2">Tempo</th>
                        <th className="text-left p-2">Total Investido</th>
                        <th className="text-left p-2">Juros Ganhos</th>
                      </tr>
                    </thead>
                    <tbody>
                      {comparacaoCenarios.map((cenario, index) => (
                        <tr key={index} className="border-b">
                          <td className="p-2 font-medium">{cenario.nome}</td>
                          <td className="p-2">{formatCurrency(cenario.valorMensal)}</td>
                          <td className="p-2">{cenario.taxaJuros}%</td>
                          <td className="p-2">{cenario.anos} anos</td>
                          <td className="p-2">{formatCurrency(cenario.totalInvestido)}</td>
                          <td className="p-2">{formatCurrency(cenario.jurosGanhos)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="estrategias" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5" />
                    Estratégias Recomendadas
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <h4 className="font-semibold text-blue-800 mb-2">💰 Aumento Gradual</h4>
                    <p className="text-blue-700 text-sm">
                      Comece com um valor menor e aumente 10% a cada 6 meses. 
                      Isso torna o objetivo mais sustentável a longo prazo.
                    </p>
                  </div>

                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <h4 className="font-semibold text-green-800 mb-2">🎯 Meta Intermediária</h4>
                    <p className="text-green-700 text-sm">
                      Divida sua meta em marcos menores (25%, 50%, 75%). 
                      Celebre cada conquista para manter a motivação.
                    </p>
                  </div>

                  <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                    <h4 className="font-semibold text-purple-800 mb-2">⚡ Automatização</h4>
                    <p className="text-purple-700 text-sm">
                      Configure transferências automáticas no dia do seu salário. 
                      Isso remove a tentação de gastar o dinheiro.
                    </p>
                  </div>

                  <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                    <h4 className="font-semibold text-orange-800 mb-2">📈 Diversificação</h4>
                    <p className="text-orange-700 text-sm">
                      Considere diferentes tipos de investimento conforme o prazo: 
                      poupança para emergência, CDB/Tesouro para médio prazo.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    Dicas Específicas para sua Meta
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {meta.categoria === 'emergencia' && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                      <h4 className="font-semibold text-red-800 mb-2">🚨 Reserva de Emergência</h4>
                      <p className="text-red-700 text-sm">
                        Priorize liquidez sobre rentabilidade. Use poupança ou CDB com liquidez diária.
                        Meta: 6-12 meses de gastos essenciais.
                      </p>
                    </div>
                  )}

                  {meta.categoria === 'aposentadoria' && (
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <h4 className="font-semibold text-blue-800 mb-2">🏖️ Aposentadoria</h4>
                      <p className="text-blue-700 text-sm">
                        Foque em investimentos de longo prazo com maior potencial de retorno.
                        Considere PGBL/VGBL para benefícios fiscais.
                      </p>
                    </div>
                  )}

                  {meta.categoria === 'casa' && (
                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                      <h4 className="font-semibold text-green-800 mb-2">🏠 Casa Própria</h4>
                      <p className="text-green-700 text-sm">
                        Use FGTS e considere financiamento. Invista em CDB/LCI/LCA 
                        para preservar o capital com isenção de IR.
                      </p>
                    </div>
                  )}

                  <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                    <h4 className="font-semibold text-gray-800 mb-2">📊 Revisão Periódica</h4>
                    <p className="text-gray-700 text-sm">
                      Revise sua estratégia a cada 3 meses. Ajuste valores conforme 
                      mudanças na renda ou nas condições do mercado.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex gap-2 pt-4">
          <Button variant="outline" onClick={onFechar} className="flex-1">
            Fechar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
});

export default ModalSimulacao;