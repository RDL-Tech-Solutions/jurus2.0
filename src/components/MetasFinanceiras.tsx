import React, { useState, memo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { 
  Target, 
  Plus, 
  Edit, 
  Trash2, 
  Calendar, 
  DollarSign, 
  TrendingUp,
  Pause,
  Play,
  CheckCircle,
  AlertTriangle,
  Clock,
  BarChart3,
  PieChart,
  Bell,
  Filter
} from 'lucide-react';
import { MetaFinanceira } from '../types/metas';
import { formatCurrency } from '../utils/formatters';
import { useMetasFinanceiras } from '../hooks/useMetasFinanceiras';
import TimelineMetas from './TimelineMetas';
import { AnimatedContainer, AnimatedItem, StaggeredContainer } from './AnimatedContainer';

const MetasFinanceiras = memo(() => {
  const {
    metas,
    notificacoesMetas,
    estatisticas,
    metasPorCategoria,
    metasProximasVencimento,
    criarMeta,
    editarMeta,
    excluirMeta,
    adicionarContribuicao,
    alternarStatusMeta,
    calcularTempoRestante,
    calcularValorMensalNecessario,
    marcarNotificacaoLida
  } = useMetasFinanceiras();

  const [modalAberto, setModalAberto] = useState(false);
  const [metaEditando, setMetaEditando] = useState<MetaFinanceira | null>(null);
  const [modalContribuicao, setModalContribuicao] = useState<string | null>(null);
  const [filtroCategoria, setFiltroCategoria] = useState<string>('todas');
  const [filtroStatus, setFiltroStatus] = useState<string>('todos');
  const [visualizacao, setVisualizacao] = useState<'cards' | 'timeline'>('cards');

  // Filtrar metas
  const metasFiltradas = metas.filter(meta => {
    const categoriaMatch = filtroCategoria === 'todas' || meta.categoria === filtroCategoria;
    const statusMatch = filtroStatus === 'todos' || meta.status === filtroStatus;
    return categoriaMatch && statusMatch;
  });

  const categorias = ['emergencia', 'aposentadoria', 'casa', 'viagem', 'educacao', 'investimento', 'outros'];
  const categoriasDisponiveis = Object.keys(metasPorCategoria);

  return (
    <div className="space-y-6">
      {/* Header com Estatísticas */}
      <AnimatedContainer variant="fadeIn">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total de Metas</p>
                  <p className="text-2xl font-bold">{estatisticas.total}</p>
                </div>
                <Target className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Concluídas</p>
                  <p className="text-2xl font-bold text-green-600">{estatisticas.concluidas}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Em Andamento</p>
                  <p className="text-2xl font-bold text-blue-600">{estatisticas.emAndamento}</p>
                </div>
                <Clock className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Progresso Geral</p>
                  <p className="text-2xl font-bold">{estatisticas.progressoGeral.toFixed(1)}%</p>
                </div>
                <TrendingUp className="h-8 w-8 text-purple-500" />
              </div>
              <Progress value={estatisticas.progressoGeral} className="mt-2" />
            </CardContent>
          </Card>
        </div>
      </AnimatedContainer>

      {/* Notificações */}
      {notificacoesMetas.filter(n => !n.lida).length > 0 && (
        <AnimatedContainer variant="slideUp">
          <Card className="border-orange-200 bg-orange-50">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-orange-600" />
                <CardTitle className="text-lg text-orange-800">Notificações</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {notificacoesMetas.filter(n => !n.lida).slice(0, 3).map(notificacao => (
                  <div 
                    key={notificacao.id}
                    className="flex items-center justify-between p-3 bg-white rounded-lg border"
                  >
                    <div>
                      <p className="font-medium">{notificacao.titulo}</p>
                      <p className="text-sm text-muted-foreground">{notificacao.mensagem}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => marcarNotificacaoLida(notificacao.id)}
                    >
                      Marcar como lida
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </AnimatedContainer>
      )}

      {/* Controles */}
      <AnimatedContainer variant="slideUp">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex flex-wrap gap-2">
            <Select value={filtroCategoria} onValueChange={setFiltroCategoria}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Categoria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todas">Todas</SelectItem>
                {categoriasDisponiveis.map(categoria => (
                  <SelectItem key={categoria} value={categoria}>
                    {categoria.charAt(0).toUpperCase() + categoria.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filtroStatus} onValueChange={setFiltroStatus}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos</SelectItem>
                <SelectItem value="em_andamento">Em Andamento</SelectItem>
                <SelectItem value="pausada">Pausada</SelectItem>
                <SelectItem value="concluida">Concluída</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex border rounded-lg">
              <Button
                variant={visualizacao === 'cards' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setVisualizacao('cards')}
                className="rounded-r-none"
              >
                <BarChart3 className="h-4 w-4" />
              </Button>
              <Button
                variant={visualizacao === 'timeline' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setVisualizacao('timeline')}
                className="rounded-l-none"
              >
                <PieChart className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <Dialog open={modalAberto} onOpenChange={setModalAberto}>
            <DialogTrigger>
              <Button onClick={() => setMetaEditando(null)}>
                <Plus className="h-4 w-4 mr-2" />
                Nova Meta
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <FormularioMeta
                meta={metaEditando}
                onSalvar={(dados) => {
                  if (metaEditando) {
                    editarMeta(metaEditando.id, dados);
                  } else {
                    criarMeta(dados);
                  }
                  setModalAberto(false);
                  setMetaEditando(null);
                }}
                onCancelar={() => {
                  setModalAberto(false);
                  setMetaEditando(null);
                }}
              />
            </DialogContent>
          </Dialog>
        </div>
      </AnimatedContainer>

      {/* Conteúdo Principal */}
      {visualizacao === 'cards' ? (
        <StaggeredContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {metasFiltradas.map(meta => (
            <AnimatedItem key={meta.id}>
              <MetaCard
                meta={meta}
                onEditar={(meta) => {
                  setMetaEditando(meta);
                  setModalAberto(true);
                }}
                onExcluir={excluirMeta}
                onContribuir={(id) => setModalContribuicao(id)}
                onAlternarStatus={alternarStatusMeta}
                calcularTempoRestante={calcularTempoRestante}
                calcularValorMensalNecessario={calcularValorMensalNecessario}
              />
            </AnimatedItem>
          ))}
        </StaggeredContainer>
      ) : (
        <AnimatedContainer variant="fadeIn">
          <TimelineMetas />
        </AnimatedContainer>
      )}

      {/* Modal de Contribuição */}
      {modalContribuicao && (
        <ModalContribuicao
          metaId={modalContribuicao}
          onContribuir={adicionarContribuicao}
          onFechar={() => setModalContribuicao(null)}
        />
      )}

      {metasFiltradas.length === 0 && (
        <AnimatedContainer variant="fadeIn">
          <Card>
            <CardContent className="p-8 text-center">
              <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Nenhuma meta encontrada</h3>
              <p className="text-muted-foreground mb-4">
                {metas.length === 0 
                  ? 'Comece criando sua primeira meta financeira!'
                  : 'Ajuste os filtros para ver suas metas.'
                }
              </p>
              {metas.length === 0 && (
                <Button onClick={() => setModalAberto(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Criar Primeira Meta
                </Button>
              )}
            </CardContent>
          </Card>
        </AnimatedContainer>
      )}
    </div>
  );
});

// Componente MetaCard
const MetaCard = memo(({ 
  meta, 
  onEditar, 
  onExcluir, 
  onContribuir, 
  onAlternarStatus,
  calcularTempoRestante,
  calcularValorMensalNecessario
}: {
  meta: MetaFinanceira;
  onEditar: (meta: MetaFinanceira) => void;
  onExcluir: (id: string) => void;
  onContribuir: (id: string) => void;
  onAlternarStatus: (id: string) => void;
  calcularTempoRestante: (meta: MetaFinanceira) => any;
  calcularValorMensalNecessario: (meta: MetaFinanceira) => number;
}) => {
  const progresso = (meta.valorAtual / meta.valorMeta) * 100;
  const tempoRestante = calcularTempoRestante(meta);
  const valorMensalNecessario = calcularValorMensalNecessario(meta);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'concluida': return 'bg-green-100 text-green-800';
      case 'pausada': return 'bg-yellow-100 text-yellow-800';
      case 'em_andamento': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'concluida': return <CheckCircle className="h-4 w-4" />;
      case 'pausada': return <Pause className="h-4 w-4" />;
      case 'em_andamento': return <Clock className="h-4 w-4" />;
      default: return <Target className="h-4 w-4" />;
    }
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg">{meta.nome}</CardTitle>
            <Badge className={`mt-1 ${getStatusColor(meta.status)}`}>
              {getStatusIcon(meta.status)}
              <span className="ml-1 capitalize">{meta.status.replace('_', ' ')}</span>
            </Badge>
          </div>
          <div className="flex gap-1">
            <Button variant="ghost" size="sm" onClick={() => onEditar(meta)}>
              <Edit className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={() => onExcluir(meta.id)}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {meta.descricao && (
          <p className="text-sm text-muted-foreground">{meta.descricao}</p>
        )}

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Progresso</span>
            <span className="font-medium">{progresso.toFixed(1)}%</span>
          </div>
          <Progress value={progresso} />
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>{formatCurrency(meta.valorAtual)}</span>
            <span>{formatCurrency(meta.valorMeta)}</span>
          </div>
        </div>

        {meta.dataLimite && (
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="h-4 w-4" />
            <span>
              {tempoRestante?.vencida 
                ? 'Vencida' 
                : `${tempoRestante?.dias} dias restantes`
              }
            </span>
            {tempoRestante?.vencida && (
              <AlertTriangle className="h-4 w-4 text-red-500" />
            )}
          </div>
        )}

        {valorMensalNecessario > 0 && meta.status !== 'concluida' && (
          <div className="flex items-center gap-2 text-sm">
            <DollarSign className="h-4 w-4" />
            <span>
              {formatCurrency(valorMensalNecessario)}/mês necessário
            </span>
          </div>
        )}

        <div className="flex gap-2 pt-2">
          {meta.status !== 'concluida' && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => onContribuir(meta.id)}
              className="flex-1"
            >
              <Plus className="h-4 w-4 mr-1" />
              Contribuir
            </Button>
          )}
          
          {meta.status !== 'concluida' && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => onAlternarStatus(meta.id)}
            >
              {meta.status === 'pausada' ? (
                <Play className="h-4 w-4" />
              ) : (
                <Pause className="h-4 w-4" />
              )}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
});

// Componente FormularioMeta
const FormularioMeta = memo(({ 
  meta, 
  onSalvar, 
  onCancelar 
}: {
  meta: MetaFinanceira | null;
  onSalvar: (dados: Omit<MetaFinanceira, 'id' | 'dataCriacao' | 'valorAtual' | 'status'>) => void;
  onCancelar: () => void;
}) => {
  const [dados, setDados] = useState({
    nome: meta?.nome || '',
    descricao: meta?.descricao || '',
    valorMeta: meta?.valorMeta || 0,
    categoria: meta?.categoria || 'outro',
    prioridade: meta?.prioridade || 'media',
    dataLimite: meta?.dataLimite ? (meta.dataLimite instanceof Date ? meta.dataLimite.toISOString().split('T')[0] : meta.dataLimite) : ''
  });

  const categorias = [
    { value: 'emergencia', label: 'Emergência' },
    { value: 'aposentadoria', label: 'Aposentadoria' },
    { value: 'casa', label: 'Casa Própria' },
    { value: 'carro', label: 'Carro' },
    { value: 'viagem', label: 'Viagem' },
    { value: 'educacao', label: 'Educação' },
    { value: 'outro', label: 'Outro' }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dados.nome || dados.valorMeta <= 0) return;
    
    const dadosCompletos = {
      ...dados,
      dataLimite: dados.dataLimite ? new Date(dados.dataLimite) : new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
      valorObjetivo: dados.valorMeta,
      dataInicio: new Date(),
      dataObjetivo: dados.dataLimite ? new Date(dados.dataLimite) : new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
      cor: '#3B82F6',
      notificacoes: {
        marcos: true,
        prazo: true,
        contribuicao: true
      },
      historico: []
    };
    
    onSalvar(dadosCompletos);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <DialogHeader>
        <DialogTitle>
          {meta ? 'Editar Meta' : 'Nova Meta Financeira'}
        </DialogTitle>
      </DialogHeader>

      <div className="space-y-4">
        <div>
          <Label htmlFor="nome">Nome da Meta</Label>
          <Input
            id="nome"
            value={dados.nome}
            onChange={(e) => setDados(prev => ({ ...prev, nome: e.target.value }))}
            placeholder="Ex: Reserva de emergência"
            required
          />
        </div>

        <div>
          <Label htmlFor="descricao">Descrição (opcional)</Label>
          <Textarea
            id="descricao"
            value={dados.descricao}
            onChange={(e) => setDados(prev => ({ ...prev, descricao: e.target.value }))}
            placeholder="Descreva sua meta..."
            rows={3}
          />
        </div>

        <div>
          <Label htmlFor="valorMeta">Valor da Meta</Label>
          <Input
            id="valorMeta"
            type="number"
            value={dados.valorMeta}
            onChange={(e) => setDados(prev => ({ ...prev, valorMeta: Number(e.target.value) }))}
            placeholder="0,00"
            min="0"
            step="0.01"
            required
          />
        </div>

        <div>
          <Label htmlFor="categoria">Categoria</Label>
          <Select value={dados.categoria} onValueChange={(value) => setDados(prev => ({ ...prev, categoria: value as any }))}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {categorias.map(categoria => (
                <SelectItem key={categoria.value} value={categoria.value}>
                  {categoria.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="prioridade">Prioridade</Label>
          <Select value={dados.prioridade} onValueChange={(value) => setDados(prev => ({ ...prev, prioridade: value as any }))}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="baixa">Baixa</SelectItem>
              <SelectItem value="media">Média</SelectItem>
              <SelectItem value="alta">Alta</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="dataLimite">Data Limite (opcional)</Label>
          <Input
            id="dataLimite"
            type="date"
            value={dados.dataLimite}
            onChange={(e) => setDados(prev => ({ ...prev, dataLimite: e.target.value }))}
          />
        </div>
      </div>

      <div className="flex gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancelar} className="flex-1">
          Cancelar
        </Button>
        <Button type="submit" className="flex-1">
          {meta ? 'Atualizar' : 'Criar Meta'}
        </Button>
      </div>
    </form>
  );
});

// Componente ModalContribuicao
const ModalContribuicao = memo(({ 
  metaId, 
  onContribuir, 
  onFechar 
}: {
  metaId: string;
  onContribuir: (id: string, valor: number, descricao?: string) => void;
  onFechar: () => void;
}) => {
  const [valor, setValor] = useState('');
  const [descricao, setDescricao] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const valorNumerico = Number(valor);
    if (valorNumerico > 0) {
      onContribuir(metaId, valorNumerico, descricao || undefined);
      onFechar();
    }
  };

  return (
    <Dialog open={true} onOpenChange={onFechar}>
      <DialogContent className="max-w-md">
        <form onSubmit={handleSubmit} className="space-y-4">
          <DialogHeader>
            <DialogTitle>Adicionar Contribuição</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="valor">Valor da Contribuição</Label>
              <Input
                id="valor"
                type="number"
                value={valor}
                onChange={(e) => setValor(e.target.value)}
                placeholder="0,00"
                min="0"
                step="0.01"
                required
                autoFocus
              />
            </div>

            <div>
              <Label htmlFor="descricao">Descrição (opcional)</Label>
              <Input
                id="descricao"
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                placeholder="Ex: Salário do mês"
              />
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onFechar} className="flex-1">
              Cancelar
            </Button>
            <Button type="submit" className="flex-1">
              Adicionar
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
});

export default MetasFinanceiras;