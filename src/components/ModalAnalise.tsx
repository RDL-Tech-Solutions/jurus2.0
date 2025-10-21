import React, { memo, useMemo } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { 
  Target, 
  TrendingUp, 
  Calendar, 
  DollarSign, 
  Clock,
  AlertTriangle,
  CheckCircle,
  BarChart3,
  PieChart
} from 'lucide-react';
import { MetaFinanceira } from '../types/metas';
import { formatCurrency } from '../utils/formatters';
import { useMetasFinanceiras } from '../hooks/useMetasFinanceiras';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

interface ModalAnaliseProps {
  metaId: string;
  onFechar: () => void;
  calcularTempoRestante: (meta: MetaFinanceira) => any;
  calcularValorMensalNecessario: (meta: MetaFinanceira) => number;
}

const ModalAnalise = memo(({ metaId, onFechar, calcularTempoRestante, calcularValorMensalNecessario }: ModalAnaliseProps) => {
  const { metas } = useMetasFinanceiras();
  const meta = metas.find(m => m.id === metaId);

  const analise = useMemo(() => {
    if (!meta) return null;

    const progresso = (meta.valorAtual / meta.valorMeta) * 100;
    const tempoRestante = calcularTempoRestante(meta);
    const valorMensalNecessario = calcularValorMensalNecessario(meta);
    const valorRestante = meta.valorMeta - meta.valorAtual;
    
    // Simular histórico de contribuições (em um cenário real, viria do banco de dados)
    const historicoSimulado = Array.from({ length: 12 }, (_, i) => {
      const data = new Date();
      data.setMonth(data.getMonth() - (11 - i));
      const contribuicao = Math.random() * valorMensalNecessario * 1.5;
      return {
        mes: data.toLocaleDateString('pt-BR', { month: 'short' }),
        contribuicao,
        acumulado: contribuicao * (i + 1)
      };
    });

    // Projeção futura
    const projecaoFutura = Array.from({ length: 12 }, (_, i) => {
      const data = new Date();
      data.setMonth(data.getMonth() + i + 1);
      const valorProjetado = meta.valorAtual + (valorMensalNecessario * (i + 1));
      return {
        mes: data.toLocaleDateString('pt-BR', { month: 'short' }),
        valorProjetado: Math.min(valorProjetado, meta.valorMeta),
        progresso: Math.min((valorProjetado / meta.valorMeta) * 100, 100)
      };
    });

    return {
      progresso,
      tempoRestante,
      valorMensalNecessario,
      valorRestante,
      historicoSimulado,
      projecaoFutura,
      status: progresso >= 100 ? 'concluida' : tempoRestante?.vencida ? 'atrasada' : 'no_prazo'
    };
  }, [meta, calcularTempoRestante, calcularValorMensalNecessario]);

  if (!meta || !analise) {
    return null;
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'concluida': return 'text-green-600';
      case 'atrasada': return 'text-red-600';
      case 'no_prazo': return 'text-blue-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'concluida': return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'atrasada': return <AlertTriangle className="h-5 w-5 text-red-500" />;
      case 'no_prazo': return <Clock className="h-5 w-5 text-blue-500" />;
      default: return <Target className="h-5 w-5 text-gray-500" />;
    }
  };

  return (
    <Dialog open={true} onOpenChange={onFechar}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Análise Detalhada: {meta.nome}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Status Geral */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Status</p>
                    <p className={`text-lg font-semibold ${getStatusColor(analise.status)}`}>
                      {analise.status === 'concluida' ? 'Concluída' : 
                       analise.status === 'atrasada' ? 'Atrasada' : 'No Prazo'}
                    </p>
                  </div>
                  {getStatusIcon(analise.status)}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Progresso</p>
                    <p className="text-lg font-semibold">{analise.progresso.toFixed(1)}%</p>
                  </div>
                  <TrendingUp className="h-5 w-5 text-purple-500" />
                </div>
                <Progress value={analise.progresso} className="mt-2" />
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Valor Restante</p>
                    <p className="text-lg font-semibold">{formatCurrency(analise.valorRestante)}</p>
                  </div>
                  <DollarSign className="h-5 w-5 text-green-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Métricas Detalhadas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Informações da Meta</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Valor Objetivo:</span>
                  <span className="font-medium">{formatCurrency(meta.valorMeta)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Valor Atual:</span>
                  <span className="font-medium">{formatCurrency(meta.valorAtual)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Categoria:</span>
                  <span className="font-medium capitalize">{meta.categoria}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Prioridade:</span>
                  <span className="font-medium capitalize">{meta.prioridade}</span>
                </div>
                {meta.dataLimite && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Data Limite:</span>
                    <span className="font-medium">
                      {meta.dataLimite.toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Análise de Prazo</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {analise.tempoRestante && (
                  <>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Dias Restantes:</span>
                      <span className="font-medium">
                        {analise.tempoRestante.vencida ? 'Vencida' : `${analise.tempoRestante.dias} dias`}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Valor Mensal Necessário:</span>
                      <span className="font-medium">{formatCurrency(analise.valorMensalNecessario)}</span>
                    </div>
                  </>
                )}
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Data de Início:</span>
                  <span className="font-medium">
                    {meta.dataInicio.toLocaleDateString('pt-BR')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tempo Decorrido:</span>
                  <span className="font-medium">
                    {Math.floor((Date.now() - meta.dataInicio.getTime()) / (1000 * 60 * 60 * 24))} dias
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Gráficos */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Histórico de Contribuições */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Histórico de Contribuições
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={analise.historicoSimulado}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="mes" />
                    <YAxis />
                    <Tooltip formatter={(value: any) => [formatCurrency(value), 'Contribuição']} />
                    <Bar dataKey="contribuicao" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Projeção Futura */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Projeção de Progresso
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={analise.projecaoFutura}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="mes" />
                    <YAxis />
                    <Tooltip formatter={(value: any) => [`${value.toFixed(1)}%`, 'Progresso']} />
                    <Line type="monotone" dataKey="progresso" stroke="#82ca9d" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Recomendações */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Recomendações
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {analise.status === 'atrasada' && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-800 font-medium">⚠️ Meta em atraso</p>
                    <p className="text-red-700 text-sm">
                      Considere aumentar suas contribuições mensais para {formatCurrency(analise.valorMensalNecessario * 1.2)} 
                      ou revisar o prazo da meta.
                    </p>
                  </div>
                )}
                
                {analise.progresso < 25 && (
                  <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-yellow-800 font-medium">💡 Acelere o progresso</p>
                    <p className="text-yellow-700 text-sm">
                      Você está no início da jornada. Considere automatizar suas contribuições para manter a consistência.
                    </p>
                  </div>
                )}

                {analise.progresso >= 75 && analise.progresso < 100 && (
                  <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-green-800 font-medium">🎯 Quase lá!</p>
                    <p className="text-green-700 text-sm">
                      Você está muito próximo do objetivo. Mantenha o foco e continue com as contribuições regulares.
                    </p>
                  </div>
                )}

                {analise.progresso >= 100 && (
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-blue-800 font-medium">🎉 Meta concluída!</p>
                    <p className="text-blue-700 text-sm">
                      Parabéns! Agora considere criar uma nova meta ou aumentar o valor desta para continuar crescendo.
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Botões de Ação */}
          <div className="flex gap-2 pt-4">
            <Button variant="outline" onClick={onFechar} className="flex-1">
              Fechar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
});

export default ModalAnalise;