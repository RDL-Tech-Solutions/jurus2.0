import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Switch } from './ui/switch';
import { Slider } from './ui/slider';
import { Separator } from './ui/separator';
import {
  Brain,
  TrendingUp,
  TrendingDown,
  Target,
  AlertTriangle,
  CheckCircle,
  Star,
  Award,
  Settings,
  RefreshCw,
  Eye,
  EyeOff,
  Lightbulb,
  BarChart3,
  PieChart,
  Activity,
  Zap,
  Trophy,
  Clock,
  DollarSign,
  Percent,
  ArrowUp,
  ArrowDown,
  Minus,
  X,
  ThumbsUp,
  ThumbsDown,
  Filter,
  Calendar,
  Users,
  Bookmark
} from 'lucide-react';
import { useInsights } from '../hooks/useInsights';
import { SugestaoPersonalizada, AlertaOportunidade, MetricaPerformance } from '../types/insights';

export const DashboardInsights: React.FC = () => {
  const {
    insights,
    isLoading,
    ultimaAtualizacao,
    configuracao,
    conquistasDesbloqueadas,
    pontuacaoUsuario,
    sugestoesFiltradas,
    alertasFiltrados,
    metricasPrincipais,
    estatisticasResumo,
    tendenciasIdentificadas,
    scoreFinanceiro,
    recomendacoesPrioritarias,
    temNovosInsights,
    marcarSugestaoComoVisualizada,
    aplicarSugestao,
    descartarAlerta,
    marcarAlertaComoVisualizado,
    atualizarConfiguracao,
    forcarAtualizacao,
    formatarMoeda,
    formatarPorcentagem
  } = useInsights();

  const [modalConfiguracao, setModalConfiguracao] = useState(false);
  const [modalConquistas, setModalConquistas] = useState(false);
  const [filtroSugestoes, setFiltroSugestoes] = useState<'todas' | 'alta' | 'media' | 'baixa'>('todas');

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-8 bg-gray-200 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!insights || !estatisticasResumo) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <Brain className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">
            Insights não disponíveis
          </h3>
          <p className="text-gray-500 mb-4">
            Crie algumas simulações para começar a receber insights personalizados sobre seus investimentos.
          </p>
          <Button onClick={forcarAtualizacao}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Atualizar Análise
          </Button>
        </CardContent>
      </Card>
    );
  }

  const sugestoesFiltradas_filtered = sugestoesFiltradas.filter(s => {
    if (filtroSugestoes === 'todas') return true;
    return s.prioridade === filtroSugestoes;
  });

  return (
    <div className="space-y-6">
      {/* Header com estatísticas principais */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Dashboard de Insights
          </h1>
          <p className="text-gray-600 mt-1">
            Análise inteligente dos seus padrões de investimento
          </p>
          {ultimaAtualizacao && (
            <p className="text-sm text-gray-500 mt-1">
              Última atualização: {ultimaAtualizacao.toLocaleString()}
            </p>
          )}
        </div>
        
        <div className="flex gap-2">
          {temNovosInsights && (
            <Button variant="outline" onClick={forcarAtualizacao}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Atualizar
            </Button>
          )}
          
          <Dialog open={modalConfiguracao} onOpenChange={setModalConfiguracao}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Settings className="w-4 h-4 mr-2" />
                Configurações
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Configurações de Insights</DialogTitle>
              </DialogHeader>
              <ConfiguracaoInsights 
                configuracao={configuracao}
                onAtualizarConfiguracao={atualizarConfiguracao}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Cards de estatísticas principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm">Score Financeiro</p>
                  <p className="text-3xl font-bold">{scoreFinanceiro.toFixed(0)}</p>
                  <p className="text-blue-100 text-xs">de 100 pontos</p>
                </div>
                <Activity className="w-8 h-8 text-blue-200" />
              </div>
              <Progress 
                value={scoreFinanceiro} 
                className="mt-3 bg-blue-400"
              />
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Total de Simulações</p>
                  <p className="text-3xl font-bold">{estatisticasResumo.totalSimulacoes}</p>
                  <p className="text-green-600 text-xs flex items-center">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    Nível {estatisticasResumo.nivel}
                  </p>
                </div>
                <BarChart3 className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Oportunidades</p>
                  <p className="text-3xl font-bold text-orange-600">
                    {recomendacoesPrioritarias && typeof recomendacoesPrioritarias === 'object' && 'total' in recomendacoesPrioritarias ? recomendacoesPrioritarias.total : 0}
                  </p>
                  <p className="text-orange-600 text-xs">
                    {recomendacoesPrioritarias && typeof recomendacoesPrioritarias === 'object' && 'sugestoes' in recomendacoesPrioritarias ? recomendacoesPrioritarias.sugestoes.length : 0} sugestões
                  </p>
                </div>
                <Lightbulb className="w-8 h-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Conquistas</p>
                  <p className="text-3xl font-bold text-purple-600">
                    {conquistasDesbloqueadas.length}
                  </p>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-purple-600 p-0 h-auto text-xs"
                    onClick={() => setModalConquistas(true)}
                  >
                    Ver todas
                  </Button>
                </div>
                <Trophy className="w-8 h-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Conteúdo principal em abas */}
      <Tabs defaultValue="resumo" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="resumo">Resumo</TabsTrigger>
          <TabsTrigger value="sugestoes">
            Sugestões
            {recomendacoesPrioritarias && typeof recomendacoesPrioritarias === 'object' && 'sugestoes' in recomendacoesPrioritarias && recomendacoesPrioritarias.sugestoes.length > 0 && (
              <Badge variant="destructive" className="ml-2 text-xs">
                {recomendacoesPrioritarias.sugestoes.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="alertas">
            Alertas
            {alertasFiltrados.length > 0 && (
              <Badge variant="secondary" className="ml-2 text-xs">
                {alertasFiltrados.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="metricas">Métricas</TabsTrigger>
          <TabsTrigger value="tendencias">Tendências</TabsTrigger>
        </TabsList>

        <TabsContent value="resumo" className="space-y-6">
          <ResumoExecutivo 
            insights={insights}
            estatisticas={estatisticasResumo}
            pontuacao={pontuacaoUsuario}
            formatarMoeda={formatarMoeda}
          />
        </TabsContent>

        <TabsContent value="sugestoes" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Sugestões Personalizadas</h3>
            <Select value={filtroSugestoes} onValueChange={(value: any) => setFiltroSugestoes(value)}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todas">Todas</SelectItem>
                <SelectItem value="alta">Alta Prioridade</SelectItem>
                <SelectItem value="media">Média Prioridade</SelectItem>
                <SelectItem value="baixa">Baixa Prioridade</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-4">
            <AnimatePresence>
              {sugestoesFiltradas_filtered.map((sugestao, index) => (
                <SugestaoCard
                  key={sugestao.id}
                  sugestao={sugestao}
                  index={index}
                  onVisualizar={() => marcarSugestaoComoVisualizada(sugestao.id)}
                  onAplicar={() => aplicarSugestao(sugestao.id)}
                />
              ))}
            </AnimatePresence>
            
            {sugestoesFiltradas_filtered.length === 0 && (
              <Card>
                <CardContent className="p-8 text-center">
                  <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-600 mb-2">
                    Nenhuma sugestão no momento
                  </h3>
                  <p className="text-gray-500">
                    Você está indo muito bem! Continue criando simulações para receber mais insights.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="alertas" className="space-y-4">
          <h3 className="text-lg font-semibold">Alertas e Oportunidades</h3>
          
          <div className="space-y-4">
            <AnimatePresence>
              {alertasFiltrados.map((alerta, index) => (
                <AlertaCard
                  key={alerta.id}
                  alerta={alerta}
                  index={index}
                  onVisualizar={() => marcarAlertaComoVisualizado(alerta.id)}
                  onDescartar={() => descartarAlerta(alerta.id)}
                />
              ))}
            </AnimatePresence>
            
            {alertasFiltrados.length === 0 && (
              <Card>
                <CardContent className="p-8 text-center">
                  <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-600 mb-2">
                    Nenhum alerta ativo
                  </h3>
                  <p className="text-gray-500">
                    Tudo está funcionando bem com seus investimentos!
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="metricas" className="space-y-4">
          <h3 className="text-lg font-semibold">Métricas de Performance</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {metricasPrincipais.map((metrica) => (
              <MetricaCard key={metrica.id} metrica={metrica} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="tendencias" className="space-y-4">
          <h3 className="text-lg font-semibold">Análise de Tendências</h3>
          
          <div className="space-y-4">
            {tendenciasIdentificadas.map((tendencia) => (
              <TendenciaCard key={tendencia.id} tendencia={tendencia} />
            ))}
            
            {tendenciasIdentificadas.length === 0 && (
              <Card>
                <CardContent className="p-8 text-center">
                  <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-600 mb-2">
                    Aguardando mais dados
                  </h3>
                  <p className="text-gray-500">
                    Crie mais simulações para identificar padrões e tendências nos seus investimentos.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* Modal de Conquistas */}
      <Dialog open={modalConquistas} onOpenChange={setModalConquistas}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Suas Conquistas</DialogTitle>
          </DialogHeader>
          <ConquistasModal conquistas={conquistasDesbloqueadas} pontuacao={pontuacaoUsuario} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Componente para card de sugestão
interface SugestaoCardProps {
  sugestao: SugestaoPersonalizada;
  index: number;
  onVisualizar: () => void;
  onAplicar: () => void;
}

const SugestaoCard: React.FC<SugestaoCardProps> = ({ sugestao, index, onVisualizar, onAplicar }) => {
  const [expandido, setExpandido] = useState(false);

  const getIconePrioridade = () => {
    switch (sugestao.prioridade) {
      case 'alta': return <AlertTriangle className="w-5 h-5 text-red-500" />;
      case 'media': return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'baixa': return <Lightbulb className="w-5 h-5 text-blue-500" />;
    }
  };

  const getCorPrioridade = () => {
    switch (sugestao.prioridade) {
      case 'alta': return 'border-l-red-500';
      case 'media': return 'border-l-yellow-500';
      case 'baixa': return 'border-l-blue-500';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ delay: index * 0.1 }}
    >
      <Card className={`border-l-4 ${getCorPrioridade()} ${sugestao.visualizada ? 'opacity-75' : ''}`}>
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-3">
              {getIconePrioridade()}
              <div className="flex-1">
                <CardTitle className="text-lg">{sugestao.titulo}</CardTitle>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant={sugestao.prioridade === 'alta' ? 'destructive' : 'secondary'}>
                    {sugestao.prioridade} prioridade
                  </Badge>
                  <Badge variant="outline">{sugestao.categoria}</Badge>
                  <Badge variant={sugestao.impacto === 'alto' ? 'default' : 'secondary'}>
                    Impacto {sugestao.impacto}
                  </Badge>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              {!sugestao.visualizada && (
                <Button variant="ghost" size="sm" onClick={onVisualizar}>
                  <Eye className="w-4 h-4" />
                </Button>
              )}
              {!sugestao.aplicada && (
                <Button size="sm" onClick={onAplicar}>
                  <ThumbsUp className="w-4 h-4 mr-1" />
                  Aplicar
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="pt-0">
          <p className="text-gray-600 mb-3">{sugestao.descricao}</p>
          
          {sugestao.acoes.length > 0 && (
            <div className="space-y-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setExpandido(!expandido)}
                className="text-blue-600"
              >
                {expandido ? 'Ocultar' : 'Ver'} ações recomendadas
                {expandido ? <ArrowUp className="w-4 h-4 ml-1" /> : <ArrowDown className="w-4 h-4 ml-1" />}
              </Button>
              
              <AnimatePresence>
                {expandido && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-2 pl-4 border-l-2 border-gray-200"
                  >
                    {sugestao.acoes.map((acao) => (
                      <div key={acao.id} className="text-sm">
                        <p className="font-medium">{acao.descricao}</p>
                        {acao.impactoEstimado.rendimentoAdicional && (
                          <p className="text-green-600">
                            Impacto estimado: +{new Intl.NumberFormat('pt-BR', {
                              style: 'currency',
                              currency: 'BRL'
                            }).format(acao.impactoEstimado.rendimentoAdicional)}
                          </p>
                        )}
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
          
          {sugestao.aplicada && (
            <div className="flex items-center text-green-600 text-sm mt-3">
              <CheckCircle className="w-4 h-4 mr-1" />
              Sugestão aplicada
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

// Componente para card de alerta
interface AlertaCardProps {
  alerta: AlertaOportunidade;
  index: number;
  onVisualizar: () => void;
  onDescartar: () => void;
}

const AlertaCard: React.FC<AlertaCardProps> = ({ alerta, index, onVisualizar, onDescartar }) => {
  const getIconeUrgencia = () => {
    switch (alerta.urgencia) {
      case 'alta': return <AlertTriangle className="w-5 h-5 text-red-500" />;
      case 'media': return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'baixa': return <Lightbulb className="w-5 h-5 text-blue-500" />;
    }
  };

  const getCorUrgencia = () => {
    switch (alerta.urgencia) {
      case 'alta': return 'border-l-red-500 bg-red-50';
      case 'media': return 'border-l-yellow-500 bg-yellow-50';
      case 'baixa': return 'border-l-blue-500 bg-blue-50';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ delay: index * 0.1 }}
    >
      <Card className={`border-l-4 ${getCorUrgencia()}`}>
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-3">
              {getIconeUrgencia()}
              <div className="flex-1">
                <CardTitle className="text-lg">{alerta.titulo}</CardTitle>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant={alerta.urgencia === 'alta' ? 'destructive' : 'secondary'}>
                    {alerta.urgencia} urgência
                  </Badge>
                  <Badge variant="outline">{alerta.categoria}</Badge>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              {!alerta.visualizado && (
                <Button variant="ghost" size="sm" onClick={onVisualizar}>
                  <Eye className="w-4 h-4" />
                </Button>
              )}
              <Button variant="ghost" size="sm" onClick={onDescartar}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="pt-0">
          <p className="text-gray-600 mb-3">{alerta.descricao}</p>
          
          <div className="bg-white p-3 rounded-lg border">
            <p className="text-sm font-medium text-gray-700 mb-1">Ação recomendada:</p>
            <p className="text-sm text-gray-600">{alerta.acaoRecomendada}</p>
          </div>
          
          {alerta.dataExpiracao && (
            <div className="flex items-center text-orange-600 text-sm mt-3">
              <Calendar className="w-4 h-4 mr-1" />
              Expira em: {alerta.dataExpiracao.toLocaleDateString()}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

// Componente para card de métrica
interface MetricaCardProps {
  metrica: MetricaPerformance;
}

const MetricaCard: React.FC<MetricaCardProps> = ({ metrica }) => {
  const getIconeTendencia = () => {
    switch (metrica.tendencia) {
      case 'positiva': return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'negativa': return <TrendingDown className="w-4 h-4 text-red-500" />;
      case 'neutra': return <Minus className="w-4 h-4 text-gray-500" />;
    }
  };

  const formatarValor = (valor: number, unidade: string) => {
    if (unidade === 'R$') {
      return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      }).format(valor);
    } else if (unidade === '%') {
      return `${valor.toFixed(1)}%`;
    } else {
      return `${valor.toFixed(0)} ${unidade}`;
    }
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-2">
          <h4 className="font-semibold text-gray-700">{metrica.nome}</h4>
          {getIconeTendencia()}
        </div>
        
        <div className="space-y-2">
          <p className="text-2xl font-bold">
            {formatarValor(metrica.valor, metrica.unidade)}
          </p>
          
          {metrica.benchmark && (
            <div className="text-sm text-gray-600">
              <span>Benchmark: {formatarValor(metrica.benchmark, metrica.unidade)}</span>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                <div 
                  className={`h-2 rounded-full ${
                    metrica.valor >= metrica.benchmark ? 'bg-green-500' : 'bg-red-500'
                  }`}
                  style={{ 
                    width: `${Math.min(100, (metrica.valor / metrica.benchmark) * 100)}%` 
                  }}
                />
              </div>
            </div>
          )}
          
          <p className="text-xs text-gray-500">{metrica.descricao}</p>
        </div>
      </CardContent>
    </Card>
  );
};

// Componente para resumo executivo
interface ResumoExecutivoProps {
  insights: any;
  estatisticas: any;
  pontuacao: any;
  formatarMoeda: (valor: number) => string;
}

const ResumoExecutivo: React.FC<ResumoExecutivoProps> = ({ 
  insights, 
  estatisticas, 
  pontuacao, 
  formatarMoeda 
}) => {
  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-blue-500 to-purple-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Brain className="w-5 h-5 mr-2 text-blue-600" />
            Resumo Executivo
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold text-gray-700 mb-2">Perfil do Investidor</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Nível de experiência:</span>
                  <Badge variant="outline">{estatisticas.nivel}</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Total investido:</span>
                  <span className="font-medium">{formatarMoeda(estatisticas.valorTotalInvestido || 0)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Simulações criadas:</span>
                  <span className="font-medium">{estatisticas.totalSimulacoes}</span>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-700 mb-2">Performance Geral</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Score financeiro:</span>
                  <span className="font-medium text-blue-600">{pontuacao.scoreTotal}/100</span>
                </div>
                <div className="flex justify-between">
                  <span>Rentabilidade média:</span>
                  <span className="font-medium text-green-600">
                    {((estatisticas.rentabilidadeMedia || 0) * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Diversificação:</span>
                  <Badge variant={estatisticas.indiceDiversificacao > 0.7 ? 'default' : 'secondary'}>
                    {estatisticas.indiceDiversificacao > 0.7 ? 'Boa' : 'Pode melhorar'}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
          
          {insights.analiseComportamental && (
            <div className="border-t pt-4">
              <h4 className="font-semibold text-gray-700 mb-2">Análise Comportamental</h4>
              <p className="text-sm text-gray-600">
                {insights.analiseComportamental.resumo}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6 text-center">
            <Target className="w-8 h-8 text-blue-500 mx-auto mb-2" />
            <h4 className="font-semibold text-gray-700">Próxima Meta</h4>
            <p className="text-sm text-gray-600 mt-1">
              Diversificar portfólio
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 text-center">
            <Zap className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
            <h4 className="font-semibold text-gray-700">Ação Prioritária</h4>
            <p className="text-sm text-gray-600 mt-1">
              Revisar alocação de ativos
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 text-center">
            <Award className="w-8 h-8 text-purple-500 mx-auto mb-2" />
            <h4 className="font-semibold text-gray-700">Conquista Recente</h4>
            <p className="text-sm text-gray-600 mt-1">
              100 simulações criadas
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

// Componente para card de tendência
interface TendenciaCardProps {
  tendencia: any;
}

const TendenciaCard: React.FC<TendenciaCardProps> = ({ tendencia }) => {
  const getIconeTipo = () => {
    switch (tendencia.tipo) {
      case 'crescimento': return <TrendingUp className="w-5 h-5 text-green-500" />;
      case 'declinio': return <TrendingDown className="w-5 h-5 text-red-500" />;
      case 'estabilidade': return <Minus className="w-5 h-5 text-blue-500" />;
      case 'volatilidade': return <Activity className="w-5 h-5 text-orange-500" />;
      default: return <BarChart3 className="w-5 h-5 text-gray-500" />;
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {getIconeTipo()}
            <CardTitle className="text-lg">{tendencia.nome}</CardTitle>
          </div>
          <Badge variant="outline">{tendencia.periodo}</Badge>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <p className="text-gray-600 mb-3">{tendencia.descricao}</p>
        
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Confiança:</span>
            <span className="font-medium">{(tendencia.confianca * 100).toFixed(0)}%</span>
          </div>
          <Progress value={tendencia.confianca * 100} className="h-2" />
        </div>
        
        {tendencia.impacto && (
          <div className="mt-3 p-3 bg-gray-50 rounded-lg">
            <p className="text-sm font-medium text-gray-700 mb-1">Impacto esperado:</p>
            <p className="text-sm text-gray-600">{tendencia.impacto}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// Componente para configuração de insights
interface ConfiguracaoInsightsProps {
  configuracao: any;
  onAtualizarConfiguracao: (config: any) => void;
}

const ConfiguracaoInsights: React.FC<ConfiguracaoInsightsProps> = ({ 
  configuracao, 
  onAtualizarConfiguracao 
}) => {
  const [config, setConfig] = useState(configuracao);

  const handleSalvar = () => {
    onAtualizarConfiguracao(config);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium">Notificações automáticas</label>
          <Switch
            checked={config.notificacoesAtivas}
            onCheckedChange={(checked) => 
              setConfig({ ...config, notificacoesAtivas: checked })
            }
          />
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium">Frequência de análise</label>
          <Select
            value={config.frequenciaAnalise}
            onValueChange={(value) => 
              setConfig({ ...config, frequenciaAnalise: value })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="diaria">Diária</SelectItem>
              <SelectItem value="semanal">Semanal</SelectItem>
              <SelectItem value="mensal">Mensal</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium">
            Sensibilidade de alertas: {config.sensibilidadeAlertas}
          </label>
          <Slider
            value={[config.sensibilidadeAlertas]}
            onValueChange={([value]) => 
              setConfig({ ...config, sensibilidadeAlertas: value })
            }
            max={10}
            min={1}
            step={1}
            className="w-full"
          />
        </div>
        
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium">Incluir análise comportamental</label>
          <Switch
            checked={config.incluirAnaliseComportamental}
            onCheckedChange={(checked) => 
              setConfig({ ...config, incluirAnaliseComportamental: checked })
            }
          />
        </div>
        
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium">Sugestões avançadas</label>
          <Switch
            checked={config.sugestoesAvancadas}
            onCheckedChange={(checked) => 
              setConfig({ ...config, sugestoesAvancadas: checked })
            }
          />
        </div>
      </div>
      
      <Separator />
      
      <div className="flex justify-end space-x-2">
        <Button variant="outline" onClick={() => setConfig(configuracao)}>
          Cancelar
        </Button>
        <Button onClick={handleSalvar}>
          Salvar Configurações
        </Button>
      </div>
    </div>
  );
};

// Componente para modal de conquistas
interface ConquistasModalProps {
  conquistas: any[];
  pontuacao: any;
}

const ConquistasModal: React.FC<ConquistasModalProps> = ({ conquistas, pontuacao }) => {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <Trophy className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
        <h3 className="text-xl font-bold">Suas Conquistas</h3>
        <p className="text-gray-600">
          Pontuação total: {pontuacao.scoreTotal} pontos
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
        {conquistas.map((conquista) => (
          <Card key={conquista.id} className="border-yellow-200 bg-yellow-50">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center">
                  <Award className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold">{conquista.titulo}</h4>
                  <p className="text-sm text-gray-600">{conquista.descricao}</p>
                  <div className="flex items-center mt-1">
                    <Star className="w-4 h-4 text-yellow-500 mr-1" />
                    <span className="text-sm font-medium">+{conquista.pontos} pontos</span>
                  </div>
                </div>
              </div>
              
              {conquista.dataDesbloqueio && (
                <p className="text-xs text-gray-500 mt-2">
                  Desbloqueada em: {conquista.dataDesbloqueio.toLocaleDateString()}
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
      
      {conquistas.length === 0 && (
        <div className="text-center py-8">
          <Trophy className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">
            Nenhuma conquista ainda
          </h3>
          <p className="text-gray-500">
            Continue usando a plataforma para desbloquear conquistas!
          </p>
        </div>
      )}
    </div>
  );
};

export default DashboardInsights;