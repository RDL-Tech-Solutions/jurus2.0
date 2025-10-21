import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Textarea } from './ui/textarea';
import { Switch } from './ui/switch';
import { Separator } from './ui/separator';
import { useToast } from '../hooks/useToast';
import {
  Heart,
  Star,
  Search,
  Filter,
  Download,
  Plus,
  Copy,
  Edit,
  Trash2,
  Tag,
  BarChart3,
  TrendingUp,
  Calendar,
  DollarSign,
  Target,
  Users,
  Share2,
  Eye,
  Grid,
  List,
  SortAsc,
  SortDesc,
  X,
  BookmarkPlus,
  Bookmark,
  GitCompare,
  CheckCircle,
  AlertCircle,
  Info
} from 'lucide-react';
import { useFavoritosAvancados } from '../hooks/useFavoritosAvancados';
import { useSimulacao } from '../store/useAppStore';
import { SimulacaoFavorita, Tag as TagType } from '../types/favoritos';
import { CATEGORIAS_SIMULACAO, CORES_TAGS } from '../utils/favoritos';

export const SistemaFavoritos: React.FC = () => {
  const { addToast } = useToast();
  const {
    simulacoesFiltradas,
    comparacoesSimulacoes,
    tags,
    tagsPopulares,
    filtrosFavoritos,
    estatisticas,
    simulacoesPorCategoria,
    simulacoesRecentes,
    melhoresSimulacoes,
    salvarComoFavorita,
    criarNovaTag,
    criarComparacao,
    exportar,
    buscarSimulacoes,
    filtrarPorTags,
    filtrarPorCategoria,
    ordenarSimulacoes,
    limparFiltros,
    toggleFavorita,
    duplicarSimulacaoFavorita,
    removerSimulacaoFavorita,
    incrementarVisualizacoes,
    adicionarTagASimulacao,
    removerTagDeSimulacao,
    obterSimulacoesSimilares,
    formatarMoeda,
    formatarPorcentagem
  } = useFavoritosAvancados();

  const { simulacao, resultado } = useSimulacao();

  const [visualizacao, setVisualizacao] = useState<'grid' | 'lista'>('grid');
  const [simulacoesSelecionadas, setSimulacoesSelecionadas] = useState<string[]>([]);
  const [modalSalvar, setModalSalvar] = useState(false);
  const [modalTag, setModalTag] = useState(false);
  const [modalComparacao, setModalComparacao] = useState(false);
  const [modalExportar, setModalExportar] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Estados para formulários
  const [formSalvar, setFormSalvar] = useState({
    nome: '',
    descricao: '',
    categoria: 'pessoal' as const,
    tags: [] as string[]
  });

  const [formTag, setFormTag] = useState({
    nome: '',
    descricao: '',
    cor: CORES_TAGS[0]
  });

  const [formComparacao, setFormComparacao] = useState({
    nome: '',
    descricao: ''
  });

  // Função para selecionar/deselecionar simulação
  const toggleSelecao = (id: string) => {
    setSimulacoesSelecionadas(prev => 
      prev.includes(id) 
        ? prev.filter(simId => simId !== id)
        : [...prev, id]
    );
  };

  // Função para selecionar todas as simulações
  const selecionarTodas = () => {
    setSimulacoesSelecionadas(simulacoesFiltradas.map(sim => sim.id));
  };

  // Função para limpar seleção
  const limparSelecao = () => {
    setSimulacoesSelecionadas([]);
  };

  // Função para salvar simulação atual
  const handleSalvarSimulacao = async () => {
    if (!formSalvar.nome.trim()) {
      addToast({
        type: 'error',
        title: 'Erro de validação',
        message: 'Nome é obrigatório'
      });
      return;
    }

    if (!simulacao) {
      addToast({
        type: 'error',
        title: 'Erro',
        message: 'Nenhuma simulação encontrada para salvar'
      });
      return;
    }

    setIsLoading(true);
    try {
      await salvarComoFavorita(
        formSalvar.nome,
        simulacao,
        resultado || undefined,
        {
          descricao: formSalvar.descricao,
          categoria: formSalvar.categoria,
          tags: formSalvar.tags
        }
      );
      
      addToast({
        type: 'success',
        title: 'Sucesso!',
        message: 'Simulação salva como favorita'
      });
      
      setModalSalvar(false);
      setFormSalvar({ nome: '', descricao: '', categoria: 'pessoal', tags: [] });
    } catch (error) {
      console.error('Erro ao salvar simulação:', error);
      addToast({
        type: 'error',
        title: 'Erro',
        message: error instanceof Error ? error.message : 'Erro ao salvar simulação'
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Função para criar nova tag
  const handleCriarTag = () => {
    if (!formTag.nome.trim()) {
      addToast({
        type: 'error',
        title: 'Erro',
        message: 'Nome da tag é obrigatório'
      });
      return;
    }

    setIsLoading(true);
    try {
      criarNovaTag(formTag.nome, {
        descricao: formTag.descricao,
        cor: formTag.cor
      });
      
      addToast({
        type: 'success',
        title: 'Sucesso!',
        message: 'Tag criada com sucesso'
      });
      
      setModalTag(false);
      setFormTag({ nome: '', descricao: '', cor: CORES_TAGS[0] });
    } catch (error) {
      console.error('Erro ao criar tag:', error);
      addToast({
        type: 'error',
        title: 'Erro',
        message: 'Erro ao criar tag'
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Função para criar comparação
  const handleCriarComparacao = () => {
    if (!formComparacao.nome.trim()) {
      addToast({
        type: 'error',
        title: 'Erro',
        message: 'Nome da comparação é obrigatório'
      });
      return;
    }

    if (simulacoesSelecionadas.length < 2) {
      addToast({
        type: 'error',
        title: 'Erro',
        message: 'Selecione pelo menos 2 simulações para comparar'
      });
      return;
    }

    setIsLoading(true);
    try {
      const simulacoesSelecionadasObj = simulacoesFiltradas.filter(sim => 
        simulacoesSelecionadas.includes(sim.id)
      );
      
      criarComparacao(simulacoesSelecionadasObj, formComparacao.nome);
      
      addToast({
        type: 'success',
        title: 'Sucesso!',
        message: 'Comparação criada com sucesso'
      });
      
      setModalComparacao(false);
      setFormComparacao({ nome: '', descricao: '' });
      limparSelecao();
    } catch (error) {
      console.error('Erro ao criar comparação:', error);
      addToast({
        type: 'error',
        title: 'Erro',
        message: 'Erro ao criar comparação'
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Função para exportar simulações
  const handleExportar = async (formato: 'json' | 'csv' | 'excel') => {
    setIsLoading(true);
    try {
      const simulacoesParaExportar = simulacoesSelecionadas.length > 0
        ? simulacoesFiltradas.filter(sim => simulacoesSelecionadas.includes(sim.id))
        : undefined;
      
      const dados = await exportar(formato, simulacoesParaExportar);
      
      // Criar e baixar arquivo
      const blob = new Blob([dados], { 
        type: formato === 'json' ? 'application/json' : 'text/csv' 
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `simulacoes-favoritas.${formato}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      addToast({
        type: 'success',
        title: 'Sucesso!',
        message: `Simulações exportadas em formato ${formato.toUpperCase()}`
      });
      
      setModalExportar(false);
    } catch (error) {
      console.error('Erro ao exportar:', error);
      addToast({
        type: 'error',
        title: 'Erro',
        message: 'Erro ao exportar simulações'
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Função para remover simulação com confirmação
  const handleRemoverSimulacao = (id: string, nome: string) => {
    if (window.confirm(`Tem certeza que deseja remover a simulação "${nome}"?`)) {
      try {
        removerSimulacaoFavorita(id);
        addToast({
          type: 'success',
          title: 'Sucesso!',
          message: 'Simulação removida com sucesso'
        });
      } catch (error) {
        addToast({
          type: 'error',
          title: 'Erro',
          message: 'Erro ao remover simulação'
        });
      }
    }
  };

  // Verificar se há simulação atual para salvar
  const temSimulacaoAtual = simulacao && (simulacao.valorInicial > 0 || simulacao.valorMensal > 0);

  return (
    <div className="space-y-6">
      {/* Header com estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Bookmark className="w-5 h-5 text-blue-500" />
              <div>
                <p className="text-sm text-gray-600">Total Favoritas</p>
                <p className="text-2xl font-bold">{estatisticas.totalFavoritas}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <GitCompare className="w-5 h-5 text-green-500" />
              <div>
                <p className="text-sm text-gray-600">Comparações</p>
                <p className="text-2xl font-bold">{comparacoesSimulacoes.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Tag className="w-5 h-5 text-purple-500" />
              <div>
                <p className="text-sm text-gray-600">Tags</p>
                <p className="text-2xl font-bold">{tags.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-orange-500" />
              <div>
                <p className="text-sm text-gray-600">Rendimento Médio</p>
                <p className="text-2xl font-bold">{formatarMoeda(estatisticas.rendimentoMedio)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Barra de ferramentas */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            {/* Busca e filtros */}
            <div className="flex flex-1 gap-2 items-center">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Buscar simulações..."
                  value={filtrosFavoritos.busca}
                  onChange={(e) => buscarSimulacoes(e.target.value)}
                  className="pl-10"
                />
              </div>

              <Select
                value={filtrosFavoritos.ordenarPor}
                onValueChange={(value: any) => ordenarSimulacoes(value, filtrosFavoritos.ordemCrescente)}
              >
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="data">Data</SelectItem>
                  <SelectItem value="nome">Nome</SelectItem>
                  <SelectItem value="categoria">Categoria</SelectItem>
                  <SelectItem value="rendimento">Rendimento</SelectItem>
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                size="sm"
                onClick={() => ordenarSimulacoes(filtrosFavoritos.ordenarPor, !filtrosFavoritos.ordemCrescente)}
              >
                {filtrosFavoritos.ordemCrescente ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />}
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={limparFiltros}
              >
                <X className="w-4 h-4 mr-1" />
                Limpar
              </Button>
            </div>

            {/* Ações */}
            <div className="flex gap-2">
              {/* Salvar simulação atual */}
              <Dialog open={modalSalvar} onOpenChange={setModalSalvar}>
                <DialogTrigger>
                  <Button 
                    variant="outline" 
                    size="sm"
                    disabled={!temSimulacaoAtual}
                    title={!temSimulacaoAtual ? "Faça uma simulação primeiro" : "Salvar simulação atual como favorita"}
                  >
                    <BookmarkPlus className="w-4 h-4 mr-1" />
                    Salvar Atual
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Salvar Simulação como Favorita</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    {!temSimulacaoAtual && (
                      <div className="flex items-center gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                        <AlertCircle className="w-4 h-4 text-yellow-600" />
                        <p className="text-sm text-yellow-700">
                          Faça uma simulação primeiro para poder salvá-la como favorita.
                        </p>
                      </div>
                    )}
                    
                    <div>
                      <Label htmlFor="nome">Nome *</Label>
                      <Input
                        id="nome"
                        value={formSalvar.nome}
                        onChange={(e) => setFormSalvar(prev => ({ ...prev, nome: e.target.value }))}
                        placeholder="Nome da simulação"
                        maxLength={100}
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        {formSalvar.nome.length}/100 caracteres
                      </p>
                    </div>
                    
                    <div>
                      <Label htmlFor="descricao">Descrição</Label>
                      <Textarea
                        id="descricao"
                        value={formSalvar.descricao}
                        onChange={(e) => setFormSalvar(prev => ({ ...prev, descricao: e.target.value }))}
                        placeholder="Descrição opcional"
                        maxLength={500}
                        rows={3}
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        {formSalvar.descricao.length}/500 caracteres
                      </p>
                    </div>
                    
                    <div>
                      <Label htmlFor="categoria">Categoria</Label>
                      <Select
                        value={formSalvar.categoria}
                        onValueChange={(value: any) => setFormSalvar(prev => ({ ...prev, categoria: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {CATEGORIAS_SIMULACAO.map(cat => (
                            <SelectItem key={cat.id} value={cat.id}>
                              <div className="flex items-center gap-2">
                                <div 
                                  className="w-3 h-3 rounded-full" 
                                  style={{ backgroundColor: cat.cor }}
                                />
                                {cat.nome}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button 
                        onClick={handleSalvarSimulacao} 
                        className="flex-1"
                        disabled={isLoading || !temSimulacaoAtual}
                      >
                        {isLoading ? "Salvando..." : "Salvar"}
                      </Button>
                      <Button variant="outline" onClick={() => setModalSalvar(false)}>
                        Cancelar
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>

              {/* Visualização */}
              <div className="flex border rounded-md">
                <Button
                  variant={visualizacao === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setVisualizacao('grid')}
                  className="rounded-r-none"
                >
                  <Grid className="w-4 h-4" />
                </Button>
                <Button
                  variant={visualizacao === 'lista' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setVisualizacao('lista')}
                  className="rounded-l-none"
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>

              {/* Exportar */}
              <Dialog open={modalExportar} onOpenChange={setModalExportar}>
                <DialogTrigger>
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-1" />
                    Exportar
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Exportar Simulações</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 p-3 bg-blue-50 border border-blue-200 rounded-md">
                      <Info className="w-4 h-4 text-blue-600" />
                      <p className="text-sm text-blue-700">
                        {simulacoesSelecionadas.length > 0 
                          ? `Exportando ${simulacoesSelecionadas.length} simulações selecionadas`
                          : `Exportando todas as ${simulacoesFiltradas.length} simulações filtradas`
                        }
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        onClick={() => handleExportar('json')} 
                        className="flex-1"
                        disabled={isLoading}
                      >
                        {isLoading ? "Exportando..." : "JSON"}
                      </Button>
                      <Button 
                        onClick={() => handleExportar('csv')} 
                        className="flex-1"
                        disabled={isLoading}
                      >
                        {isLoading ? "Exportando..." : "CSV"}
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Seleção múltipla */}
          {simulacoesSelecionadas.length > 0 && (
            <div className="mt-4 p-3 bg-blue-50 rounded-lg flex items-center justify-between">
              <span className="text-sm text-blue-700">
                {simulacoesSelecionadas.length} simulação(ões) selecionada(s)
              </span>
              <div className="flex gap-2">
                <Dialog open={modalComparacao} onOpenChange={setModalComparacao}>
                  <DialogTrigger>
                    <Button size="sm" disabled={simulacoesSelecionadas.length < 2}>
                      <GitCompare className="w-4 h-4 mr-1" />
                      Comparar
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Criar Comparação</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="nomeComparacao">Nome da Comparação *</Label>
                        <Input
                          id="nomeComparacao"
                          value={formComparacao.nome}
                          onChange={(e) => setFormComparacao(prev => ({ ...prev, nome: e.target.value }))}
                          placeholder="Nome da comparação"
                          maxLength={100}
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button onClick={handleCriarComparacao} className="flex-1">
                          Criar Comparação
                        </Button>
                        <Button variant="outline" onClick={() => setModalComparacao(false)}>
                          Cancelar
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
                <Button size="sm" variant="outline" onClick={limparSelecao}>
                  Limpar Seleção
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Conteúdo principal */}
      <Tabs defaultValue="simulacoes" className="space-y-4">
        <TabsList>
          <TabsTrigger value="simulacoes">
            Simulações Favoritas
            {estatisticas.totalFavoritas > 0 && (
              <Badge variant="secondary" className="ml-2">
                {estatisticas.totalFavoritas}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="comparacoes">
            Comparações
            {comparacoesSimulacoes.length > 0 && (
              <Badge variant="secondary" className="ml-2">
                {comparacoesSimulacoes.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="tags">
            Tags
            {tags.length > 0 && (
              <Badge variant="secondary" className="ml-2">
                {tags.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="estatisticas">Estatísticas</TabsTrigger>
        </TabsList>

        <TabsContent value="simulacoes" className="space-y-4">
          {simulacoesFiltradas.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Bookmark className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">
                  {estatisticas.totalFavoritas === 0 
                    ? "Nenhuma simulação favorita ainda"
                    : "Nenhuma simulação encontrada"
                  }
                </h3>
                <p className="text-gray-500 mb-6 max-w-md mx-auto">
                  {estatisticas.totalFavoritas === 0 
                    ? "Comece salvando suas simulações como favoritas para organizá-las melhor e acessá-las rapidamente."
                    : "Tente ajustar os filtros de busca para encontrar suas simulações."
                  }
                </p>
                <div className="flex gap-3 justify-center">
                  {estatisticas.totalFavoritas === 0 ? (
                    <Button 
                      onClick={() => setModalSalvar(true)}
                      disabled={!temSimulacaoAtual}
                    >
                      <BookmarkPlus className="w-4 h-4 mr-2" />
                      Salvar Simulação Atual
                    </Button>
                  ) : (
                    <Button variant="outline" onClick={limparFiltros}>
                      <X className="w-4 h-4 mr-2" />
                      Limpar Filtros
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ) : (
            <>
              {/* Ações em lote */}
              {simulacoesFiltradas.length > 1 && (
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={simulacoesSelecionadas.length === simulacoesFiltradas.length}
                      onChange={() => {
                        if (simulacoesSelecionadas.length === simulacoesFiltradas.length) {
                          limparSelecao();
                        } else {
                          selecionarTodas();
                        }
                      }}
                      className="rounded"
                    />
                    <span className="text-sm text-gray-600">
                      Selecionar todas ({simulacoesFiltradas.length})
                    </span>
                  </div>
                  {simulacoesSelecionadas.length > 0 && (
                    <span className="text-sm text-blue-600">
                      {simulacoesSelecionadas.length} selecionadas
                    </span>
                  )}
                </div>
              )}

              <div className={visualizacao === 'grid' 
                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'
                : 'space-y-4'
              }>
                <AnimatePresence>
                  {simulacoesFiltradas.map((simulacao) => (
                    <SimulacaoCard
                      key={simulacao.id}
                      simulacao={simulacao}
                      visualizacao={visualizacao}
                      selecionada={simulacoesSelecionadas.includes(simulacao.id)}
                      onSelecionar={() => toggleSelecao(simulacao.id)}
                      onToggleFavorita={() => toggleFavorita(simulacao.id)}
                      onDuplicar={() => duplicarSimulacaoFavorita(simulacao.id)}
                      onRemover={() => handleRemoverSimulacao(simulacao.id, simulacao.nome)}
                      onVisualizar={() => incrementarVisualizacoes(simulacao.id)}
                      tags={tags}
                      formatarMoeda={formatarMoeda}
                      formatarPorcentagem={formatarPorcentagem}
                    />
                  ))}
                </AnimatePresence>
              </div>
            </>
          )}
        </TabsContent>

        <TabsContent value="comparacoes">
          <div className="space-y-4">
            {comparacoesSimulacoes.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <GitCompare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">
                    Nenhuma comparação criada
                  </h3>
                  <p className="text-gray-500 mb-6 max-w-md mx-auto">
                    Selecione múltiplas simulações favoritas para criar comparações e analisar qual é a melhor opção.
                  </p>
                  <Button 
                    variant="outline"
                    onClick={() => {
                      // Mudar para aba de simulações
                      const tabsElement = document.querySelector('[value="simulacoes"]') as HTMLElement;
                      tabsElement?.click();
                    }}
                  >
                    <Bookmark className="w-4 h-4 mr-2" />
                    Ver Simulações
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {comparacoesSimulacoes.map((comparacao) => (
                  <Card key={comparacao.id}>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span>{comparacao.nome}</span>
                        <Badge variant="secondary">
                          {comparacao.simulacoes.length} simulações
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600 mb-4">
                        {comparacao.descricao || 'Sem descrição'}
                      </p>
                      <div className="space-y-2">
                        {comparacao.simulacoes.slice(0, 3).map((sim) => (
                          <div key={sim.id} className="flex items-center justify-between text-sm">
                            <span>{sim.nome}</span>
                            <span className="font-medium">
                              {sim.resultado ? formatarMoeda(sim.resultado.valorFinal) : 'Sem resultado'}
                            </span>
                          </div>
                        ))}
                        {comparacao.simulacoes.length > 3 && (
                          <p className="text-xs text-gray-500">
                            +{comparacao.simulacoes.length - 3} simulações
                          </p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="tags">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Gerenciar Tags</h3>
              <Dialog open={modalTag} onOpenChange={setModalTag}>
                <DialogTrigger>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Nova Tag
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Criar Nova Tag</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="nomeTag">Nome *</Label>
                      <Input
                        id="nomeTag"
                        value={formTag.nome}
                        onChange={(e) => setFormTag(prev => ({ ...prev, nome: e.target.value }))}
                        placeholder="Nome da tag"
                        maxLength={50}
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        {formTag.nome.length}/50 caracteres
                      </p>
                    </div>
                    <div>
                      <Label htmlFor="descricaoTag">Descrição</Label>
                      <Textarea
                        id="descricaoTag"
                        value={formTag.descricao}
                        onChange={(e) => setFormTag(prev => ({ ...prev, descricao: e.target.value }))}
                        placeholder="Descrição opcional"
                        maxLength={200}
                        rows={2}
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        {formTag.descricao.length}/200 caracteres
                      </p>
                    </div>
                    <div>
                      <Label>Cor</Label>
                      <div className="flex gap-2 mt-2 flex-wrap">
                        {CORES_TAGS.map((cor) => (
                          <button
                            key={cor}
                            className={`w-8 h-8 rounded-full border-2 transition-all hover:scale-110 ${
                              formTag.cor === cor ? 'border-gray-800 ring-2 ring-gray-300' : 'border-gray-300'
                            }`}
                            style={{ backgroundColor: cor }}
                            onClick={() => setFormTag(prev => ({ ...prev, cor }))}
                            title={cor}
                          />
                        ))}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={handleCriarTag} className="flex-1">
                        Criar Tag
                      </Button>
                      <Button variant="outline" onClick={() => setModalTag(false)}>
                        Cancelar
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {tags.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <Tag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">
                    Nenhuma tag criada
                  </h3>
                  <p className="text-gray-500 mb-6 max-w-md mx-auto">
                    Crie tags para organizar melhor suas simulações favoritas por categorias personalizadas.
                  </p>
                  <Button onClick={() => setModalTag(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Criar Primeira Tag
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {tagsPopulares.map((tag) => (
                  <Card key={tag.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <Badge 
                          style={{ backgroundColor: tag.cor, color: 'white' }}
                          className="text-sm"
                        >
                          {tag.nome}
                        </Badge>
                        <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                          {tag.uso} {tag.uso === 1 ? 'uso' : 'usos'}
                        </span>
                      </div>
                      {tag.descricao && (
                        <p className="text-sm text-gray-600">{tag.descricao}</p>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="estatisticas">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Estatísticas gerais */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Resumo Geral
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>Total de Simulações:</span>
                  <span className="font-semibold">{estatisticas.totalSimulacoes}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Simulações Favoritas:</span>
                  <span className="font-semibold text-blue-600">{estatisticas.totalFavoritas}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Valor Médio Investido:</span>
                  <span className="font-semibold text-green-600">{formatarMoeda(estatisticas.valorMedioInvestido)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Período Médio:</span>
                  <span className="font-semibold">{Math.round(estatisticas.periodoMedio)} meses</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Rendimento Médio:</span>
                  <span className="font-semibold text-orange-600">{formatarMoeda(estatisticas.rendimentoMedio)}</span>
                </div>
              </CardContent>
            </Card>

            {/* Categorias */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Por Categoria
                </CardTitle>
              </CardHeader>
              <CardContent>
                {Object.keys(estatisticas.categorias).length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500">Nenhuma categoria com simulações ainda</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {Object.entries(estatisticas.categorias).map(([categoria, quantidade]) => {
                      const categoriaInfo = CATEGORIAS_SIMULACAO.find(cat => cat.id === categoria);
                      const porcentagem = (quantidade / estatisticas.totalSimulacoes) * 100;
                      
                      return (
                        <div key={categoria}>
                          <div className="flex justify-between text-sm mb-1">
                            <div className="flex items-center gap-2">
                              <div 
                                className="w-3 h-3 rounded-full" 
                                style={{ backgroundColor: categoriaInfo?.cor }}
                              />
                              <span>{categoriaInfo?.nome || categoria}</span>
                            </div>
                            <span className="font-medium">
                              {quantidade} ({porcentagem.toFixed(1)}%)
                            </span>
                          </div>
                          <Progress value={porcentagem} className="h-2" />
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

// Componente SimulacaoCard
interface SimulacaoCardProps {
  simulacao: SimulacaoFavorita;
  visualizacao: 'grid' | 'lista';
  selecionada: boolean;
  onSelecionar: () => void;
  onToggleFavorita: () => void;
  onDuplicar: () => void;
  onRemover: () => void;
  onVisualizar: () => void;
  tags: TagType[];
  formatarMoeda: (valor: number) => string;
  formatarPorcentagem: (valor: number) => string;
}

const SimulacaoCard: React.FC<SimulacaoCardProps> = ({
  simulacao,
  visualizacao,
  selecionada,
  onSelecionar,
  onToggleFavorita,
  onDuplicar,
  onRemover,
  onVisualizar,
  tags,
  formatarMoeda,
  formatarPorcentagem
}) => {
  const categoriaInfo = CATEGORIAS_SIMULACAO.find(cat => cat.id === simulacao.categoria);
  
  if (visualizacao === 'lista') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.2 }}
      >
        <Card className={`hover:shadow-md transition-all ${selecionada ? 'ring-2 ring-blue-500' : ''}`}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 flex-1">
                <input
                  type="checkbox"
                  checked={selecionada}
                  onChange={onSelecionar}
                  className="rounded"
                />
                
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-lg">{simulacao.nome}</h3>
                    {categoriaInfo && (
                      <Badge 
                        variant="secondary"
                        style={{ backgroundColor: categoriaInfo.cor, color: 'white' }}
                      >
                        {categoriaInfo.nome}
                      </Badge>
                    )}
                  </div>
                  
                  {simulacao.descricao && (
                    <p className="text-sm text-gray-600 mb-2">{simulacao.descricao}</p>
                  )}
                  
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span>Valor Inicial: {formatarMoeda(simulacao.simulacao.valorInicial)}</span>
                    <span>Período: {simulacao.simulacao.periodo} meses</span>
                    <span>Taxa: {formatarPorcentagem(simulacao.simulacao.parametros?.taxa || 0)}</span>
                    {simulacao.resultado && (
                      <span className="text-green-600 font-medium">
                        Final: {formatarMoeda(simulacao.resultado.valorFinal)}
                      </span>
                    )}
                  </div>
                  
                  {simulacao.tags.length > 0 && (
                    <div className="flex gap-1 mt-2">
                      {simulacao.tags.slice(0, 3).map((tagId) => {
                        const tag = tags.find(t => t.id === tagId);
                        return tag ? (
                          <Badge 
                            key={tag.id}
                            variant="outline"
                            style={{ borderColor: tag.cor, color: tag.cor }}
                            className="text-xs"
                          >
                            {tag.nome}
                          </Badge>
                        ) : null;
                      })}
                      {simulacao.tags.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{simulacao.tags.length - 3}
                        </Badge>
                      )}
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <div className="text-right text-sm text-gray-500 mr-4">
                  <div>Criado em {new Date(simulacao.dataCriacao).toLocaleDateString()}</div>
                  <div>{simulacao.estatisticas.visualizacoes} visualizações</div>
                </div>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onToggleFavorita}
                  className="text-red-500 hover:text-red-600"
                >
                  <Heart className="w-4 h-4 fill-current" />
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onDuplicar}
                  title="Duplicar simulação"
                >
                  <Copy className="w-4 h-4" />
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onVisualizar}
                  title="Visualizar simulação"
                >
                  <Eye className="w-4 h-4" />
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onRemover}
                  className="text-red-500 hover:text-red-600"
                  title="Remover simulação"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.2 }}
    >
      <Card className={`hover:shadow-lg transition-all cursor-pointer ${selecionada ? 'ring-2 ring-blue-500' : ''}`}>
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={selecionada}
                onChange={onSelecionar}
                className="rounded"
                onClick={(e) => e.stopPropagation()}
              />
              <div>
                <CardTitle className="text-lg">{simulacao.nome}</CardTitle>
                {categoriaInfo && (
                  <Badge 
                    variant="secondary"
                    style={{ backgroundColor: categoriaInfo.cor, color: 'white' }}
                    className="mt-1"
                  >
                    {categoriaInfo.nome}
                  </Badge>
                )}
              </div>
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onToggleFavorita();
              }}
              className="text-red-500 hover:text-red-600"
            >
              <Heart className="w-4 h-4 fill-current" />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {simulacao.descricao && (
            <p className="text-sm text-gray-600 line-clamp-2">{simulacao.descricao}</p>
          )}
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Valor Inicial:</span>
              <span className="font-medium">{formatarMoeda(simulacao.simulacao.valorInicial)}</span>
            </div>
            
            {simulacao.simulacao.valorMensal > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Valor Mensal:</span>
                <span className="font-medium">{formatarMoeda(simulacao.simulacao.valorMensal)}</span>
              </div>
            )}
            
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Período:</span>
              <span className="font-medium">{simulacao.simulacao.periodo} meses</span>
            </div>
            
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Taxa:</span>
              <span className="font-medium">{formatarPorcentagem(simulacao.simulacao.parametros?.taxa || 0)}</span>
            </div>
            
            {simulacao.resultado && (
              <>
                <Separator />
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Valor Final:</span>
                  <span className="font-semibold text-green-600">
                    {formatarMoeda(simulacao.resultado.valorFinal)}
                  </span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Rendimento:</span>
                  <span className="font-semibold text-blue-600">
                    {formatarMoeda(simulacao.resultado.rendimentoTotal)}
                  </span>
                </div>
              </>
            )}
          </div>
          
          {simulacao.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {simulacao.tags.slice(0, 3).map((tagId) => {
                const tag = tags.find(t => t.id === tagId);
                return tag ? (
                  <Badge 
                    key={tag.id}
                    variant="outline"
                    style={{ borderColor: tag.cor, color: tag.cor }}
                    className="text-xs"
                  >
                    {tag.nome}
                  </Badge>
                ) : null;
              })}
              {simulacao.tags.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{simulacao.tags.length - 3}
                </Badge>
              )}
            </div>
          )}
          
          <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t">
            <span>{new Date(simulacao.dataCriacao).toLocaleDateString()}</span>
            <span>{simulacao.estatisticas.visualizacoes} visualizações</span>
          </div>
          
          <div className="flex gap-2 pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onDuplicar();
              }}
              className="flex-1"
            >
              <Copy className="w-4 h-4 mr-1" />
              Duplicar
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onVisualizar();
              }}
              className="flex-1"
            >
              <Eye className="w-4 h-4 mr-1" />
              Ver
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onRemover();
              }}
              className="text-red-500 hover:text-red-600"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default SistemaFavoritos;