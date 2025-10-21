import React, { useState, memo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calculator, TrendingUp, DollarSign, Calendar, Target, AlertTriangle, 
  CheckCircle, Save, Download, BarChart3, PieChart, Settings, 
  Layers, GitCompare, BookOpen, Lightbulb, Filter, Search, Plus,
  Edit, Trash2, Copy, Eye, FileText, TrendingDown, Users
} from 'lucide-react';
import { useCalculadoraAposentadoria } from '../hooks/useCalculadoraAposentadoria';
import { CalculadoraAposentadoriaInput } from '../types';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  Area, AreaChart, BarChart, Bar, PieChart as RechartsPieChart, Cell,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts';

type TabType = 'calculadora' | 'simulacoes' | 'comparacao' | 'cenarios' | 'dashboard' | 'configuracoes';
type ViewMode = 'cards' | 'table' | 'timeline';

export const CalculadoraAposentadoria: React.FC = () => {
  const { 
    loading, 
    resultado, 
    simulacoesAposentadoria,
    calcularAposentadoria, 
    limparResultados,
    salvarSimulacaoAposentadoria,
    atualizarSimulacaoAposentadoria,
    removerSimulacaoAposentadoria,
    compararSimulacoesAposentadoria,
    obterEstatisticasAposentadoria
  } = useCalculadoraAposentadoria();
  
  const [activeTab, setActiveTab] = useState<TabType>('calculadora');
  const [viewMode, setViewMode] = useState<ViewMode>('cards');
  const [filtroSimulacoes, setFiltroSimulacoes] = useState('');
  const [simulacoesSelecionadas, setSimulacoesSelecionadas] = useState<string[]>([]);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [nomeSimulacao, setNomeSimulacao] = useState('');
  const [observacoesSimulacao, setObservacoesSimulacao] = useState('');
  const [cenarioAtivo, setCenarioAtivo] = useState('otimista');
  
  const [input, setInput] = useState<CalculadoraAposentadoriaInput>({
    idadeAtual: 30,
    idadeAposentadoria: 65,
    valorMensalDesejado: 5000,
    patrimonioAtual: 50000,
    contribuicaoMensal: 1000,
    taxaJuros: 10,
    inflacao: 4,
    expectativaVida: 85
  });

  const handleInputChange = (field: keyof CalculadoraAposentadoriaInput, value: number) => {
    setInput(prev => ({ ...prev, [field]: value }));
  };

  const handleCalcular = async () => {
    await calcularAposentadoria(input);
  };

  const handleSalvarSimulacao = () => {
    if (resultado && nomeSimulacao.trim()) {
      salvarSimulacaoAposentadoria(nomeSimulacao, input, resultado, observacoesSimulacao);
      setShowSaveModal(false);
      setNomeSimulacao('');
      setObservacoesSimulacao('');
      setActiveTab('simulacoes');
    }
  };

  const handleExportarDados = () => {
    const dados = {
      input,
      resultado,
      simulacoes: simulacoesAposentadoria,
      dataExportacao: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(dados, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `aposentadoria_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const gerarCenarios = useCallback(() => {
    const cenarios = {
      pessimista: {
        ...input,
        taxaJuros: Math.max(input.taxaJuros - 3, 2),
        inflacao: input.inflacao + 2,
        valorMensalDesejado: input.valorMensalDesejado * 1.2
      },
      realista: input,
      otimista: {
        ...input,
        taxaJuros: input.taxaJuros + 2,
        inflacao: Math.max(input.inflacao - 1, 1),
        valorMensalDesejado: input.valorMensalDesejado * 0.9
      }
    };
    return cenarios;
  }, [input]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const chartData = resultado?.evolucaoAcumulacao.map((item, index) => ({
    ano: Math.floor(index / 12) + 1,
    saldo: item.saldoAcumulado,
    saldoReal: item.saldoReal
  })).filter((_, index) => index % 12 === 11) || [];

  const estatisticas = obterEstatisticasAposentadoria();

  const tabs = [
    { id: 'calculadora', label: 'Calculadora', icon: Calculator },
    { id: 'simulacoes', label: 'Simulações', icon: Layers },
    { id: 'comparacao', label: 'Comparação', icon: GitCompare },
    { id: 'cenarios', label: 'Cenários', icon: BarChart3 },
    { id: 'dashboard', label: 'Dashboard', icon: PieChart },
    { id: 'configuracoes', label: 'Configurações', icon: Settings }
  ];

  const cores = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'];

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center justify-center gap-3">
          <Calculator className="text-blue-600" />
          Calculadora de Aposentadoria Avançada
        </h1>
        <p className="text-gray-600 text-lg">
          Planeje sua aposentadoria com simulações detalhadas, análise de cenários e comparações
        </p>
      </motion.div>

      {/* Tabs */}
      <div className="flex flex-wrap justify-center gap-2 bg-white rounded-xl shadow-lg p-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabType)}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <Icon size={18} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        {activeTab === 'calculadora' && (
          <motion.div
            key="calculadora"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-8"
          >
            {/* Formulário */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                <Target className="text-blue-600" />
                Dados para Simulação
              </h2>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Idade Atual
                    </label>
                    <input
                      type="number"
                      value={input.idadeAtual}
                      onChange={(e) => handleInputChange('idadeAtual', Number(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      min="18"
                      max="80"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Idade de Aposentadoria
                    </label>
                    <input
                      type="number"
                      value={input.idadeAposentadoria}
                      onChange={(e) => handleInputChange('idadeAposentadoria', Number(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      min="50"
                      max="90"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Renda Mensal Desejada (R$)
                  </label>
                  <input
                    type="number"
                    value={input.valorMensalDesejado}
                    onChange={(e) => handleInputChange('valorMensalDesejado', Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    min="1000"
                    step="500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Patrimônio Atual (R$)
                  </label>
                  <input
                    type="number"
                    value={input.patrimonioAtual}
                    onChange={(e) => handleInputChange('patrimonioAtual', Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    min="0"
                    step="1000"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Contribuição Mensal Atual (R$)
                  </label>
                  <input
                    type="number"
                    value={input.contribuicaoMensal}
                    onChange={(e) => handleInputChange('contribuicaoMensal', Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    min="0"
                    step="100"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Taxa de Juros (% a.a.)
                    </label>
                    <input
                      type="number"
                      value={input.taxaJuros}
                      onChange={(e) => handleInputChange('taxaJuros', Number(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      min="0"
                      max="30"
                      step="0.5"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Inflação (% a.a.)
                    </label>
                    <input
                      type="number"
                      value={input.inflacao}
                      onChange={(e) => handleInputChange('inflacao', Number(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      min="0"
                      max="15"
                      step="0.5"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Expectativa de Vida
                  </label>
                  <input
                    type="number"
                    value={input.expectativaVida}
                    onChange={(e) => handleInputChange('expectativaVida', Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    min="70"
                    max="100"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={handleCalcular}
                  disabled={loading}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-lg font-medium hover:from-blue-700 hover:to-blue-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  ) : (
                    <>
                      <Calculator size={20} />
                      Calcular
                    </>
                  )}
                </button>
                {resultado && (
                  <>
                    <button
                      onClick={() => setShowSaveModal(true)}
                      className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                    >
                      <Save size={20} />
                      Salvar
                    </button>
                    <button
                      onClick={limparResultados}
                      className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Limpar
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Resultados */}
            {resultado && (
              <div className="space-y-6">
                {/* Cards de Resultado */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-white rounded-xl shadow-lg p-6">
                    <div className="flex items-center gap-3 mb-2">
                      <Target className="text-green-600" />
                      <h3 className="font-semibold text-gray-900">Valor Necessário</h3>
                    </div>
                    <p className="text-2xl font-bold text-green-600">
                      {formatCurrency(resultado.valorNecessario)}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      Para sustentar a renda desejada
                    </p>
                  </div>

                  <div className="bg-white rounded-xl shadow-lg p-6">
                    <div className="flex items-center gap-3 mb-2">
                      <TrendingUp className="text-blue-600" />
                      <h3 className="font-semibold text-gray-900">Valor Acumulado</h3>
                    </div>
                    <p className="text-2xl font-bold text-blue-600">
                      {formatCurrency(resultado.valorAcumulado)}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      Com contribuição atual
                    </p>
                  </div>

                  <div className={`bg-white rounded-xl shadow-lg p-6 ${resultado.deficit > 0 ? 'border-l-4 border-red-500' : 'border-l-4 border-green-500'}`}>
                    <div className="flex items-center gap-3 mb-2">
                      {resultado.deficit > 0 ? (
                        <AlertTriangle className="text-red-600" />
                      ) : (
                        <CheckCircle className="text-green-600" />
                      )}
                      <h3 className="font-semibold text-gray-900">
                        {resultado.deficit > 0 ? 'Déficit' : 'Superávit'}
                      </h3>
                    </div>
                    <p className={`text-2xl font-bold ${resultado.deficit > 0 ? 'text-red-600' : 'text-green-600'}`}>
                      {formatCurrency(Math.abs(resultado.deficit))}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      {resultado.deficit > 0 ? 'Valor em falta' : 'Valor excedente'}
                    </p>
                  </div>

                  <div className="bg-white rounded-xl shadow-lg p-6">
                    <div className="flex items-center gap-3 mb-2">
                      <DollarSign className="text-purple-600" />
                      <h3 className="font-semibold text-gray-900">Contribuição Sugerida</h3>
                    </div>
                    <p className="text-2xl font-bold text-purple-600">
                      {formatCurrency(resultado.contribuicaoSugerida)}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      Mensal para atingir a meta
                    </p>
                  </div>
                </div>

                {/* Informações Adicionais */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Calendar className="text-blue-600" />
                    Cronograma
                  </h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Anos de contribuição:</span>
                      <span className="font-semibold ml-2">{resultado.anosContribuicao} anos</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Anos de aposentadoria:</span>
                      <span className="font-semibold ml-2">{resultado.anosAposentadoria} anos</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        )}

        {activeTab === 'simulacoes' && (
          <motion.div
            key="simulacoes"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            {/* Header das Simulações */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                    <Layers className="text-blue-600" />
                    Simulações Salvas ({simulacoesAposentadoria.length})
                  </h2>
                  <p className="text-gray-600 mt-1">Gerencie suas simulações de aposentadoria</p>
                </div>
                <div className="flex gap-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                    <input
                      type="text"
                      placeholder="Buscar simulações..."
                      value={filtroSimulacoes}
                      onChange={(e) => setFiltroSimulacoes(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <button
                    onClick={handleExportarDados}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                  >
                    <Download size={16} />
                    Exportar
                  </button>
                </div>
              </div>
            </div>

            {/* Lista de Simulações */}
            {simulacoesAposentadoria.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {simulacoesAposentadoria
                  .filter(sim => sim.nome.toLowerCase().includes(filtroSimulacoes.toLowerCase()))
                  .map((simulacao) => (
                    <div key={simulacao.id} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="font-semibold text-gray-900">{simulacao.nome}</h3>
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              setInput(simulacao.input);
                              setActiveTab('calculadora');
                            }}
                            className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => removerSimulacaoAposentadoria(simulacao.id)}
                            className="p-1 text-red-600 hover:bg-red-50 rounded"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                      
                      <div className="space-y-3 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Valor Necessário:</span>
                          <span className="font-semibold">{formatCurrency(simulacao.resultado.valorNecessario)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Valor Acumulado:</span>
                          <span className="font-semibold">{formatCurrency(simulacao.resultado.valorAcumulado)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Déficit:</span>
                          <span className={`font-semibold ${simulacao.resultado.deficit > 0 ? 'text-red-600' : 'text-green-600'}`}>
                            {formatCurrency(Math.abs(simulacao.resultado.deficit))}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Contribuição Sugerida:</span>
                          <span className="font-semibold">{formatCurrency(simulacao.resultado.contribuicaoSugerida)}</span>
                        </div>
                      </div>
                      
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-gray-500">
                            {new Date(simulacao.dataCriacao).toLocaleDateString()}
                          </span>
                          <input
                            type="checkbox"
                            checked={simulacoesSelecionadas.includes(simulacao.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSimulacoesSelecionadas(prev => [...prev, simulacao.id]);
                              } else {
                                setSimulacoesSelecionadas(prev => prev.filter(id => id !== simulacao.id));
                              }
                            }}
                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-lg p-12 text-center">
                <Calculator className="mx-auto text-gray-400 mb-4" size={48} />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Nenhuma simulação salva</h3>
                <p className="text-gray-600 mb-6">Crie sua primeira simulação na aba Calculadora</p>
                <button
                  onClick={() => setActiveTab('calculadora')}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 mx-auto"
                >
                  <Plus size={20} />
                  Nova Simulação
                </button>
              </div>
            )}

            {/* Botão de Comparação */}
            {simulacoesSelecionadas.length >= 2 && (
              <div className="fixed bottom-6 right-6">
                <button
                  onClick={() => setActiveTab('comparacao')}
                  className="px-6 py-3 bg-purple-600 text-white rounded-full shadow-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
                >
                  <GitCompare size={20} />
                  Comparar ({simulacoesSelecionadas.length})
                </button>
              </div>
            )}
          </motion.div>
        )}

        {activeTab === 'comparacao' && (
          <motion.div
            key="comparacao"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                <GitCompare className="text-purple-600" />
                Comparação de Simulações
              </h2>

              {simulacoesSelecionadas.length >= 2 ? (
                <div className="space-y-6">
                  {/* Gráfico de Comparação */}
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={compararSimulacoesAposentadoria(simulacoesSelecionadas)}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="nome" />
                        <YAxis tickFormatter={(value) => `R$ ${(value / 1000).toFixed(0)}k`} />
                        <Tooltip formatter={(value: number) => formatCurrency(value)} />
                        <Bar dataKey="valorNecessario" fill="#3B82F6" name="Valor Necessário" />
                        <Bar dataKey="valorAcumulado" fill="#10B981" name="Valor Acumulado" />
                        <Bar dataKey="contribuicaoSugerida" fill="#F59E0B" name="Contribuição Sugerida" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Tabela de Comparação */}
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left py-3 px-4 font-semibold text-gray-900">Simulação</th>
                          <th className="text-right py-3 px-4 font-semibold text-gray-900">Valor Necessário</th>
                          <th className="text-right py-3 px-4 font-semibold text-gray-900">Valor Acumulado</th>
                          <th className="text-right py-3 px-4 font-semibold text-gray-900">Déficit</th>
                          <th className="text-right py-3 px-4 font-semibold text-gray-900">Contribuição Sugerida</th>
                          <th className="text-right py-3 px-4 font-semibold text-gray-900">Eficiência</th>
                        </tr>
                      </thead>
                      <tbody>
                        {compararSimulacoesAposentadoria(simulacoesSelecionadas).map((comp, index) => (
                          <tr key={comp.id} className="border-b border-gray-100 hover:bg-gray-50">
                            <td className="py-3 px-4 font-medium">{comp.nome}</td>
                            <td className="py-3 px-4 text-right">{formatCurrency(comp.valorNecessario)}</td>
                            <td className="py-3 px-4 text-right">{formatCurrency(comp.valorAcumulado)}</td>
                            <td className={`py-3 px-4 text-right font-semibold ${comp.deficit > 0 ? 'text-red-600' : 'text-green-600'}`}>
                              {formatCurrency(Math.abs(comp.deficit))}
                            </td>
                            <td className="py-3 px-4 text-right">{formatCurrency(comp.contribuicaoSugerida)}</td>
                            <td className="py-3 px-4 text-right font-semibold">{comp.eficiencia.toFixed(1)}%</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <GitCompare className="mx-auto text-gray-400 mb-4" size={48} />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Selecione simulações para comparar</h3>
                  <p className="text-gray-600 mb-6">Escolha pelo menos 2 simulações na aba Simulações</p>
                  <button
                    onClick={() => setActiveTab('simulacoes')}
                    className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    Ir para Simulações
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {activeTab === 'cenarios' && (
           <motion.div
             key="cenarios"
             initial={{ opacity: 0, x: 20 }}
             animate={{ opacity: 1, x: 0 }}
             exit={{ opacity: 0, x: -20 }}
             className="space-y-6"
           >
             <div className="bg-white rounded-xl shadow-lg p-6">
               <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                 <BarChart3 className="text-orange-600" />
                 Análise de Cenários
               </h2>

               <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                 {Object.entries(gerarCenarios()).map(([tipo, cenario]) => (
                   <div
                     key={tipo}
                     className={`p-6 rounded-xl border-2 cursor-pointer transition-all ${
                       cenarioAtivo === tipo
                         ? 'border-blue-500 bg-blue-50'
                         : 'border-gray-200 hover:border-gray-300'
                     }`}
                     onClick={() => setCenarioAtivo(tipo)}
                   >
                     <div className="flex items-center gap-3 mb-4">
                       {tipo === 'pessimista' && <TrendingDown className="text-red-600" />}
                       {tipo === 'realista' && <Target className="text-blue-600" />}
                       {tipo === 'otimista' && <TrendingUp className="text-green-600" />}
                       <h3 className="font-semibold text-gray-900 capitalize">{tipo}</h3>
                     </div>
                     
                     <div className="space-y-2 text-sm">
                       <div className="flex justify-between">
                         <span className="text-gray-600">Taxa de Juros:</span>
                         <span className="font-semibold">{cenario.taxaJuros}% a.a.</span>
                       </div>
                       <div className="flex justify-between">
                         <span className="text-gray-600">Inflação:</span>
                         <span className="font-semibold">{cenario.inflacao}% a.a.</span>
                       </div>
                       <div className="flex justify-between">
                         <span className="text-gray-600">Renda Desejada:</span>
                         <span className="font-semibold">{formatCurrency(cenario.valorMensalDesejado)}</span>
                       </div>
                     </div>
                   </div>
                 ))}
               </div>

               <div className="mt-8">
                 <button
                   onClick={() => {
                     const cenarios = gerarCenarios();
                     setInput(cenarios[cenarioAtivo as keyof typeof cenarios]);
                     setActiveTab('calculadora');
                   }}
                   className="w-full bg-gradient-to-r from-orange-600 to-orange-700 text-white px-6 py-3 rounded-lg font-medium hover:from-orange-700 hover:to-orange-800 transition-all duration-200 flex items-center justify-center gap-2"
                 >
                   <Calculator size={20} />
                   Simular Cenário {cenarioAtivo.charAt(0).toUpperCase() + cenarioAtivo.slice(1)}
                 </button>
               </div>
             </div>
           </motion.div>
         )}

         {activeTab === 'dashboard' && (
           <motion.div
             key="dashboard"
             initial={{ opacity: 0, x: 20 }}
             animate={{ opacity: 1, x: 0 }}
             exit={{ opacity: 0, x: -20 }}
             className="space-y-6"
           >
             <div className="bg-white rounded-xl shadow-lg p-6">
               <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                 <PieChart className="text-blue-600" />
                 Dashboard de Performance
               </h2>

               {estatisticas ? (
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                   <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white">
                     <div className="flex items-center gap-3 mb-2">
                       <Users className="text-blue-100" />
                       <h3 className="font-semibold">Total de Simulações</h3>
                     </div>
                     <p className="text-3xl font-bold">{estatisticas.total}</p>
                   </div>

                   <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white">
                     <div className="flex items-center gap-3 mb-2">
                       <Target className="text-green-100" />
                       <h3 className="font-semibold">Valor Necessário Médio</h3>
                     </div>
                     <p className="text-2xl font-bold">{formatCurrency(estatisticas.valorNecessarioMedio)}</p>
                   </div>

                   <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-6 text-white">
                     <div className="flex items-center gap-3 mb-2">
                       <TrendingUp className="text-purple-100" />
                       <h3 className="font-semibold">Valor Acumulado Médio</h3>
                     </div>
                     <p className="text-2xl font-bold">{formatCurrency(estatisticas.valorAcumuladoMedio)}</p>
                   </div>

                   <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl p-6 text-white">
                     <div className="flex items-center gap-3 mb-2">
                       <CheckCircle className="text-orange-100" />
                       <h3 className="font-semibold">Simulações Viáveis</h3>
                     </div>
                     <p className="text-3xl font-bold">{estatisticas.simulacoesViáveis}</p>
                     <p className="text-sm text-orange-100">
                       {((estatisticas.simulacoesViáveis / estatisticas.total) * 100).toFixed(1)}% do total
                     </p>
                   </div>
                 </div>
               ) : (
                 <div className="text-center py-12">
                   <PieChart className="mx-auto text-gray-400 mb-4" size={48} />
                   <h3 className="text-lg font-semibold text-gray-900 mb-2">Nenhum dado disponível</h3>
                   <p className="text-gray-600">Crie algumas simulações para ver as estatísticas</p>
                 </div>
               )}
             </div>
           </motion.div>
         )}

         {activeTab === 'configuracoes' && (
           <motion.div
             key="configuracoes"
             initial={{ opacity: 0, x: 20 }}
             animate={{ opacity: 1, x: 0 }}
             exit={{ opacity: 0, x: -20 }}
             className="space-y-6"
           >
             <div className="bg-white rounded-xl shadow-lg p-6">
               <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                 <Settings className="text-gray-600" />
                 Configurações Avançadas
               </h2>

               <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                 {/* Configurações de Cálculo */}
                 <div>
                   <h3 className="text-lg font-semibold text-gray-900 mb-4">Parâmetros de Cálculo</h3>
                   <div className="space-y-4">
                     <div>
                       <label className="block text-sm font-medium text-gray-700 mb-2">
                         Taxa de Juros Padrão (% a.a.)
                       </label>
                       <input
                         type="number"
                         defaultValue={10}
                         className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                         min="0"
                         max="30"
                         step="0.5"
                       />
                     </div>
                     
                     <div>
                       <label className="block text-sm font-medium text-gray-700 mb-2">
                         Inflação Padrão (% a.a.)
                       </label>
                       <input
                         type="number"
                         defaultValue={4}
                         className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                         min="0"
                         max="15"
                         step="0.5"
                       />
                     </div>
                     
                     <div>
                       <label className="block text-sm font-medium text-gray-700 mb-2">
                         Expectativa de Vida Padrão
                       </label>
                       <input
                         type="number"
                         defaultValue={85}
                         className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                         min="70"
                         max="100"
                       />
                     </div>
                   </div>
                 </div>

                 {/* Configurações de Interface */}
                 <div>
                   <h3 className="text-lg font-semibold text-gray-900 mb-4">Preferências de Interface</h3>
                   <div className="space-y-4">
                     <div>
                       <label className="flex items-center gap-3">
                         <input
                           type="checkbox"
                           defaultChecked
                           className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                         />
                         <span className="text-sm text-gray-700">Salvar simulações automaticamente</span>
                       </label>
                     </div>
                     
                     <div>
                       <label className="flex items-center gap-3">
                         <input
                           type="checkbox"
                           defaultChecked
                           className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                         />
                         <span className="text-sm text-gray-700">Mostrar valores em tempo real</span>
                       </label>
                     </div>
                     
                     <div>
                       <label className="flex items-center gap-3">
                         <input
                           type="checkbox"
                           className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                         />
                         <span className="text-sm text-gray-700">Modo escuro</span>
                       </label>
                     </div>
                     
                     <div>
                       <label className="block text-sm font-medium text-gray-700 mb-2">
                         Formato de Moeda
                       </label>
                       <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                         <option value="BRL">Real Brasileiro (R$)</option>
                         <option value="USD">Dólar Americano ($)</option>
                         <option value="EUR">Euro (€)</option>
                       </select>
                     </div>
                   </div>
                 </div>
               </div>

               {/* Ações */}
               <div className="mt-8 pt-6 border-t border-gray-200">
                 <div className="flex flex-wrap gap-3">
                   <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
                     <Save size={20} />
                     Salvar Configurações
                   </button>
                   
                   <button className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                     Restaurar Padrões
                   </button>
                   
                   <button
                     onClick={handleExportarDados}
                     className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                   >
                     <Download size={20} />
                     Exportar Dados
                   </button>
                   
                   <button className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2">
                     <Trash2 size={20} />
                     Limpar Todos os Dados
                   </button>
                 </div>
               </div>
             </div>
           </motion.div>
         )}
      </AnimatePresence>

      {/* Gráfico de Evolução */}
      {resultado && chartData.length > 0 && activeTab === 'calculadora' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-lg p-6"
        >
          <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
            <TrendingUp className="text-blue-600" />
            Evolução do Patrimônio
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="ano" 
                  label={{ value: 'Anos', position: 'insideBottom', offset: -5 }}
                />
                <YAxis 
                  tickFormatter={(value) => `R$ ${(value / 1000).toFixed(0)}k`}
                />
                <Tooltip 
                  formatter={(value: number, name: string) => [
                    formatCurrency(value),
                    name === 'saldo' ? 'Valor Nominal' : 'Valor Real'
                  ]}
                  labelFormatter={(label) => `Ano ${label}`}
                />
                <Area
                  type="monotone"
                  dataKey="saldo"
                  stackId="1"
                  stroke="#3B82F6"
                  fill="#3B82F6"
                  fillOpacity={0.6}
                />
                <Area
                  type="monotone"
                  dataKey="saldoReal"
                  stackId="2"
                  stroke="#10B981"
                  fill="#10B981"
                  fillOpacity={0.6}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-6 mt-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded"></div>
              <span>Valor Nominal</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded"></div>
              <span>Valor Real (descontada inflação)</span>
            </div>
          </div>
        </motion.div>
      )}

      {/* Modal de Salvar Simulação */}
      <AnimatePresence>
        {showSaveModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Salvar Simulação</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nome da Simulação
                  </label>
                  <input
                    type="text"
                    value={nomeSimulacao}
                    onChange={(e) => setNomeSimulacao(e.target.value)}
                    placeholder="Ex: Aposentadoria aos 60"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Observações (opcional)
                  </label>
                  <textarea
                    value={observacoesSimulacao}
                    onChange={(e) => setObservacoesSimulacao(e.target.value)}
                    placeholder="Adicione observações sobre esta simulação..."
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <div className="flex gap-3 mt-6">
                <button
                  onClick={handleSalvarSimulacao}
                  disabled={!nomeSimulacao.trim()}
                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Salvar
                </button>
                <button
                  onClick={() => setShowSaveModal(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default memo(CalculadoraAposentadoria);