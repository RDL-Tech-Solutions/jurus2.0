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
  GitCompare
} from 'lucide-react';
import { useFavoritosAvancados } from '../hooks/useFavoritosAvancados';
import { useSimulacao } from '../store/useAppStore';
import { SimulacaoFavorita, Tag as TagType } from '../types/favoritos';
import { CATEGORIAS_SIMULACAO, CORES_TAGS } from '../utils/favoritos';

export const SistemaFavoritos: React.FC = () => {
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
      setModalSalvar(false);
      setFormSalvar({ nome: '', descricao: '', categoria: 'pessoal', tags: [] });
    } catch (error) {
      console.error('Erro ao salvar simulação:', error);
    }
  };

  // Função para criar nova tag
  const handleCriarTag = () => {
    try {
      criarNovaTag(formTag.nome, {
        descricao: formTag.descricao,
        cor: formTag.cor
      });
      setModalTag(false);
      setFormTag({ nome: '', descricao: '', cor: CORES_TAGS[0] });
    } catch (error) {
      console.error('Erro ao criar tag:', error);
    }
  };

  // Função para criar comparação
  const handleCriarComparacao = () => {
    try {
      const simulacoesSelecionadasObj = simulacoesFiltradas.filter(sim => 
        simulacoesSelecionadas.includes(sim.id)
      );
      
      criarComparacao(simulacoesSelecionadasObj, formComparacao.nome);
      setModalComparacao(false);
      setFormComparacao({ nome: '', descricao: '' });
      limparSelecao();
    } catch (error) {
      console.error('Erro ao criar comparação:', error);
    }
  };

  // Função para exportar simulações
  const handleExportar = async (formato: 'json' | 'csv' | 'excel') => {
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
      
      setModalExportar(false);
    } catch (error) {
      console.error('Erro ao exportar:', error);
    }
  };

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
                  <Button variant="outline" size="sm">
                    <BookmarkPlus className="w-4 h-4 mr-1" />
                    Salvar Atual
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Salvar Simulação como Favorita</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="nome">Nome</Label>
                      <Input
                        id="nome"
                        value={formSalvar.nome}
                        onChange={(e) => setFormSalvar(prev => ({ ...prev, nome: e.target.value }))}
                        placeholder="Nome da simulação"
                      />
                    </div>
                    <div>
                      <Label htmlFor="descricao">Descrição</Label>
                      <Textarea
                        id="descricao"
                        value={formSalvar.descricao}
                        onChange={(e) => setFormSalvar(prev => ({ ...prev, descricao: e.target.value }))}
                        placeholder="Descrição opcional"
                      />
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
                              {cat.nome}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={handleSalvarSimulacao} className="flex-1">
                        Salvar
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
                    <p className="text-sm text-gray-600">
                      {simulacoesSelecionadas.length > 0 
                        ? `Exportando ${simulacoesSelecionadas.length} simulações selecionadas`
                        : `Exportando todas as ${simulacoesFiltradas.length} simulações filtradas`
                      }
                    </p>
                    <div className="flex gap-2">
                      <Button onClick={() => handleExportar('json')} className="flex-1">
                        JSON
                      </Button>
                      <Button onClick={() => handleExportar('csv')} className="flex-1">
                        CSV
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
                        <Label htmlFor="nomeComparacao">Nome da Comparação</Label>
                        <Input
                          id="nomeComparacao"
                          value={formComparacao.nome}
                          onChange={(e) => setFormComparacao(prev => ({ ...prev, nome: e.target.value }))}
                          placeholder="Nome da comparação"
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
          <TabsTrigger value="simulacoes">Simulações Favoritas</TabsTrigger>
          <TabsTrigger value="comparacoes">Comparações</TabsTrigger>
          <TabsTrigger value="tags">Tags</TabsTrigger>
          <TabsTrigger value="estatisticas">Estatísticas</TabsTrigger>
        </TabsList>

        <TabsContent value="simulacoes" className="space-y-4">
          {simulacoesFiltradas.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Bookmark className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-600 mb-2">
                  Nenhuma simulação favorita encontrada
                </h3>
                <p className="text-gray-500 mb-4">
                  Comece salvando suas simulações como favoritas para organizá-las melhor.
                </p>
                <Button onClick={() => setModalSalvar(true)}>
                  <BookmarkPlus className="w-4 h-4 mr-2" />
                  Salvar Simulação Atual
                </Button>
              </CardContent>
            </Card>
          ) : (
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
                    onRemover={() => removerSimulacaoFavorita(simulacao.id)}
                    onVisualizar={() => incrementarVisualizacoes(simulacao.id)}
                    tags={tags}
                    formatarMoeda={formatarMoeda}
                    formatarPorcentagem={formatarPorcentagem}
                  />
                ))}
              </AnimatePresence>
            </div>
          )}
        </TabsContent>

        <TabsContent value="comparacoes">
          <div className="space-y-4">
            {comparacoesSimulacoes.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <GitCompare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-600 mb-2">
                    Nenhuma comparação criada
                  </h3>
                  <p className="text-gray-500">
                    Selecione múltiplas simulações para criar comparações.
                  </p>
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
                      <Label htmlFor="nomeTag">Nome</Label>
                      <Input
                        id="nomeTag"
                        value={formTag.nome}
                        onChange={(e) => setFormTag(prev => ({ ...prev, nome: e.target.value }))}
                        placeholder="Nome da tag"
                      />
                    </div>
                    <div>
                      <Label htmlFor="descricaoTag">Descrição</Label>
                      <Textarea
                        id="descricaoTag"
                        value={formTag.descricao}
                        onChange={(e) => setFormTag(prev => ({ ...prev, descricao: e.target.value }))}
                        placeholder="Descrição opcional"
                      />
                    </div>
                    <div>
                      <Label>Cor</Label>
                      <div className="flex gap-2 mt-2">
                        {CORES_TAGS.map((cor) => (
                          <button
                            key={cor}
                            className={`w-8 h-8 rounded-full border-2 ${
                              formTag.cor === cor ? 'border-gray-800' : 'border-gray-300'
                            }`}
                            style={{ backgroundColor: cor }}
                            onClick={() => setFormTag(prev => ({ ...prev, cor }))}
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

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {tagsPopulares.map((tag) => (
                <Card key={tag.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <Badge style={{ backgroundColor: tag.cor, color: 'white' }}>
                        {tag.nome}
                      </Badge>
                      <span className="text-sm text-gray-500">{tag.uso} usos</span>
                    </div>
                    {tag.descricao && (
                      <p className="text-sm text-gray-600">{tag.descricao}</p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="estatisticas">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Estatísticas gerais */}
            <Card>
              <CardHeader>
                <CardTitle>Resumo Geral</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>Total de Simulações:</span>
                  <span className="font-semibold">{estatisticas.totalSimulacoes}</span>
                </div>
                <div className="flex justify-between">
                  <span>Simulações Favoritas:</span>
                  <span className="font-semibold">{estatisticas.totalFavoritas}</span>
                </div>
                <div className="flex justify-between">
                  <span>Valor Médio Investido:</span>
                  <span className="font-semibold">{formatarMoeda(estatisticas.valorMedioInvestido)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Período Médio:</span>
                  <span className="font-semibold">{Math.round(estatisticas.periodoMedio)} meses</span>
                </div>
                <div className="flex justify-between">
                  <span>Rendimento Médio:</span>
                  <span className="font-semibold">{formatarMoeda(estatisticas.rendimentoMedio)}</span>
                </div>
              </CardContent>
            </Card>

            {/* Categorias */}
            <Card>
              <CardHeader>
                <CardTitle>Por Categoria</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Object.entries(estatisticas.categorias).map(([categoria, quantidade]) => {
                    const categoriaInfo = CATEGORIAS_SIMULACAO.find(cat => cat.id === categoria);
                    const porcentagem = (quantidade / estatisticas.totalSimulacoes) * 100;
                    
                    return (
                      <div key={categoria}>
                        <div className="flex justify-between text-sm mb-1">
                          <span>{categoriaInfo?.nome || categoria}</span>
                          <span>{quantidade} ({porcentagem.toFixed(1)}%)</span>
                        </div>
                        <Progress value={porcentagem} className="h-2" />
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

// Componente para card de simulação
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
  const tagsSimulacao = tags.filter(tag => simulacao.tags.includes(tag.id));
  const categoria = CATEGORIAS_SIMULACAO.find(cat => cat.id === simulacao.categoria);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={visualizacao === 'grid' ? '' : 'w-full'}
    >
      <Card className={`cursor-pointer transition-all hover:shadow-md ${
        selecionada ? 'ring-2 ring-blue-500' : ''
      }`}>
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <input
                  type="checkbox"
                  checked={selecionada}
                  onChange={onSelecionar}
                  className="rounded"
                />
                <CardTitle className="text-lg">{simulacao.nome}</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onToggleFavorita}
                  className="p-1"
                >
                  <Heart 
                    className={`w-4 h-4 ${
                      simulacao.isFavorita ? 'fill-red-500 text-red-500' : 'text-gray-400'
                    }`} 
                  />
                </Button>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Badge 
                  variant="secondary" 
                  style={{ backgroundColor: categoria?.cor, color: 'white' }}
                >
                  {categoria?.nome}
                </Badge>
                <span>{simulacao.dataCriacao.toLocaleDateString()}</span>
              </div>
            </div>
            <div className="flex gap-1">
              <Button variant="ghost" size="sm" onClick={onDuplicar}>
                <Copy className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={onRemover}>
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="pt-0">
          {simulacao.descricao && (
            <p className="text-sm text-gray-600 mb-3">{simulacao.descricao}</p>
          )}
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-xs text-gray-500">Valor Inicial</p>
              <p className="font-semibold">{formatarMoeda(simulacao.simulacao.parametros.valorInicial)}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Período</p>
              <p className="font-semibold">{simulacao.simulacao.parametros.periodo} meses</p>
            </div>
            {simulacao.resultado && (
              <>
                <div>
                  <p className="text-xs text-gray-500">Saldo Final</p>
                  <p className="font-semibold text-green-600">
                    {formatarMoeda(simulacao.resultado.valorFinal)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Rendimento</p>
                  <p className="font-semibold text-blue-600">
                    {formatarMoeda(simulacao.resultado.totalJuros)}
                  </p>
                </div>
              </>
            )}
          </div>

          {tagsSimulacao.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-3">
              {tagsSimulacao.map(tag => (
                <Badge 
                  key={tag.id} 
                  variant="outline" 
                  className="text-xs"
                  style={{ borderColor: tag.cor, color: tag.cor }}
                >
                  {tag.nome}
                </Badge>
              ))}
            </div>
          )}

          {simulacao.estatisticas && (
            <div className="flex items-center gap-4 text-xs text-gray-500">
              <div className="flex items-center gap-1">
                <Eye className="w-3 h-3" />
                {simulacao.estatisticas.visualizacoes}
              </div>
              <div className="flex items-center gap-1">
                <Copy className="w-3 h-3" />
                {simulacao.estatisticas.copias}
              </div>
              <div className="flex items-center gap-1">
                <Share2 className="w-3 h-3" />
                {simulacao.estatisticas.compartilhamentos}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default SistemaFavoritos;