import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Wallet, Sparkles, Target, Shield, BarChart3, PiggyBank, TrendingUp, DollarSign, Settings, Check, AlertCircle, Plus, X } from 'lucide-react';
import { useSimuladorPlanejamento } from '../hooks/useSimulador5030';
import { METODOS_PLANEJAMENTO, MetodoPlanejamento } from '../types/educacaoFinanceira';
import { cn } from '../utils/cn';

// Hook personalizado para detectar se estamos em mobile
const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };

    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  return isMobile;
};

export function Regra503020() {
  const {
    rendaMensal,
    metodoSelecionado,
    config,
    errors,
    setRendaMensal,
    selecionarMetodo,
    updateConfig,
    applyCustomConfig,
    calculations,
    formattedData,
    recommendations
  } = useSimuladorPlanejamento();

  const isMobile = useIsMobile();

  // Estados para modo personalizado
  const [isCustomModeOpen, setIsCustomModeOpen] = useState(false);
  const [customValues, setCustomValues] = useState({
    necessidades: 50,
    desejos: 30,
    poupanca: 20
  });
  const [customErrors, setCustomErrors] = useState<string>('');
  const [categoriasPersonalizadas, setCategoriasPersonalizadas] = useState<Array<{
    id: string;
    nome: string;
    percentual: number;
    cor: string;
    descricao: string;
  }>>([
    { id: '1', nome: 'Essenciais', percentual: 50, cor: '#ef4444', descricao: 'Moradia, alimentação, transporte' },
    { id: '2', nome: 'Desejos', percentual: 30, cor: '#f59e0b', descricao: 'Lazer, entretenimento' },
    { id: '3', nome: 'Investimentos', percentual: 20, cor: '#10b981', descricao: 'Poupança, investimentos' }
  ]);

  // Atualizar valores customizados quando o método muda
  useEffect(() => {
    if (metodoSelecionado === 'personalizado') {
      setCustomValues({
        necessidades: config.necessidades,
        desejos: config.desejos,
        poupanca: config.poupanca
      });
    }
  }, [metodoSelecionado, config]);

  // Abrir modo personalizado quando selecionado
  useEffect(() => {
    if (metodoSelecionado === 'personalizado') {
      setIsCustomModeOpen(true);
    } else {
      setIsCustomModeOpen(false);
    }
  }, [metodoSelecionado]);

  // Calcular soma dos valores customizados
  const customTotal = customValues.necessidades + customValues.desejos + customValues.poupanca;

  // Atualizar valor customizado
  const updateCustomValue = (field: keyof typeof customValues, value: number) => {
    const newValues = { ...customValues, [field]: value };
    setCustomValues(newValues);

    // Validar soma
    const total = newValues.necessidades + newValues.desejos + newValues.poupanca;
    if (total !== 100) {
      setCustomErrors(`A soma deve ser 100% (atual: ${total}%)`);
    } else {
      setCustomErrors('');
    }
  };

  // Aplicar configurações personalizadas
  const handleApplyCustom = () => {
    const totalPercentual = categoriasPersonalizadas.reduce((acc, cat) => acc + cat.percentual, 0);
    if (totalPercentual === 100) {
      // Aqui podemos salvar as categorias personalizadas para uso futuro
      // Por enquanto, mantemos a lógica simples mantendo compatibilidade
      applyCustomConfig(50, 30, 20); // Valores padrão, mas a interface mostra as categorias
      setIsCustomModeOpen(false);
    }
  };

  // Resetar para valores padrão
  const handleResetCustom = () => {
    const defaultValues = { necessidades: 50, desejos: 30, poupanca: 20 };
    setCustomValues(defaultValues);
    setCustomErrors('');
    applyCustomConfig(50, 30, 20);
    // Resetar categorias também
    setCategoriasPersonalizadas([
      { id: '1', nome: 'Essenciais', percentual: 50, cor: '#ef4444', descricao: 'Moradia, alimentação, transporte' },
      { id: '2', nome: 'Desejos', percentual: 30, cor: '#f59e0b', descricao: 'Lazer, entretenimento' },
      { id: '3', nome: 'Investimentos', percentual: 20, cor: '#10b981', descricao: 'Poupança, investimentos' }
    ]);
  };

  // Funções para gerenciar categorias personalizadas
  const adicionarCategoria = () => {
    const novaCategoria = {
      id: Date.now().toString(),
      nome: 'Nova Categoria',
      percentual: 0,
      cor: '#6366f1',
      descricao: 'Descrição da categoria'
    };
    setCategoriasPersonalizadas([...categoriasPersonalizadas, novaCategoria]);
  };

  const removerCategoria = (id: string) => {
    setCategoriasPersonalizadas(categoriasPersonalizadas.filter(cat => cat.id !== id));
  };

  const atualizarCategoria = (id: string, campo: keyof typeof categoriasPersonalizadas[0], valor: string | number) => {
    setCategoriasPersonalizadas(categoriasPersonalizadas.map(cat =>
      cat.id === id ? { ...cat, [campo]: valor } : cat
    ));
  };

  // Mapeamento de ícones por método
  const metodoIcons: Record<MetodoPlanejamento, React.ComponentType<any>> = {
    '503020': Wallet,
    '603010': Shield,
    '702010': BarChart3,
    '802000': TrendingUp,
    'pay_yourself_first': PiggyBank,
    'personalizado': Sparkles
  };

  // Dados para o gráfico
  const dadosGrafico = calculations.pieData.map(item => ({
    nome: item.name,
    valor: item.value,
    cor: item.color,
    descricao: getDescricaoCategoria(item.name)
  }));

  function getDescricaoCategoria(nome: string): string {
    if (nome.includes('Necessidades')) return 'Moradia, alimentação, transporte, saúde';
    if (nome.includes('Desejos')) return 'Lazer, entretenimento, hobbies';
    if (nome.includes('Poupança')) return 'Investimentos, reserva de emergência';
    return '';
  }

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const item = payload[0];
      return (
        <div className="bg-white dark:bg-gray-800 p-2 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 max-w-[200px]">
          <p className="font-semibold text-gray-900 dark:text-white text-sm">{item.name}</p>
          <p className="text-primary-600 dark:text-primary-400 font-bold text-sm">
            R$ {item.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {item.payload.percentage.toFixed(1)}% da renda
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="card-mobile space-y-4 sm:space-y-6 px-3 sm:px-4">
      {/* Header Mobile-First */}
      <div className="flex items-center space-x-2 mb-1">
        <Wallet className="w-5 h-5 sm:w-6 sm:h-6 text-primary-600 dark:text-primary-400" />
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
            Planejamento Financeiro
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            Organize sua renda com métodos inteligentes
          </p>
        </div>
      </div>

      {/* Seletor de Método - Mobile Optimized */}
      <div>
        <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 sm:mb-3">
          Método de Planejamento
        </label>
        {isMobile ? (
          /* Mobile: Lista Vertical */
          <div className="space-y-2">
            {(Object.keys(METODOS_PLANEJAMENTO) as MetodoPlanejamento[]).map((metodo) => {
              const metodoInfo = METODOS_PLANEJAMENTO[metodo];
              const IconComponent = metodoIcons[metodo];
              const isSelected = metodoSelecionado === metodo;

              return (
                <button
                  key={metodo}
                  onClick={() => selecionarMetodo(metodo)}
                  className={cn(
                    'w-full p-4 rounded-lg border-2 transition-all text-left active:scale-95 touch-manipulation',
                    'min-h-[90px]',
                    isSelected
                      ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 shadow-md ring-2 ring-primary-200 dark:ring-primary-800'
                      : 'border-gray-200 dark:border-gray-700 hover:border-primary-300'
                  )}
                >
                  <div className="flex items-start space-x-3">
                    <IconComponent className={cn(
                      "w-5 h-5 mt-0.5 flex-shrink-0",
                      isSelected ? "text-primary-600 dark:text-primary-400" : "text-gray-500"
                    )} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <div className="font-semibold text-gray-900 dark:text-white text-base">
                          {metodoInfo.nome}
                        </div>
                        <div className="text-xs font-mono text-gray-500 dark:text-gray-500 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                          {metodoInfo.necessidades}/{metodoInfo.desejos}/{metodoInfo.poupanca}
                        </div>
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                        {metodoInfo.descricao}
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        ) : (
          /* Desktop: Grid Layout */
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
            {(Object.keys(METODOS_PLANEJAMENTO) as MetodoPlanejamento[]).map((metodo) => {
              const metodoInfo = METODOS_PLANEJAMENTO[metodo];
              const IconComponent = metodoIcons[metodo];
              const isSelected = metodoSelecionado === metodo;

              return (
                <button
                  key={metodo}
                  onClick={() => selecionarMetodo(metodo)}
                  className={cn(
                    'p-4 rounded-lg border-2 transition-all text-left hover:shadow-md',
                    'min-h-[100px]',
                    isSelected
                      ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 shadow-md ring-2 ring-primary-200 dark:ring-primary-800'
                      : 'border-gray-200 dark:border-gray-700 hover:border-primary-300'
                  )}
                >
                  <div className="flex items-start space-x-3">
                    <IconComponent className={cn(
                      "w-5 h-5 mt-0.5 flex-shrink-0",
                      isSelected ? "text-primary-600 dark:text-primary-400" : "text-gray-500"
                    )} />
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-gray-900 dark:text-white text-base truncate">
                        {metodoInfo.nome}
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                        {metodoInfo.descricao}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-500 mt-1 font-mono">
                        {metodoInfo.necessidades}/{metodoInfo.desejos}/{metodoInfo.poupanca}
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Divisor Visual */}
      <div className="border-t border-gray-200 dark:border-gray-700 my-4 sm:my-6"></div>

      {/* Input de Renda - Mobile Optimized */}
      <div>
        <div className="flex items-center space-x-2 mb-2">
          <DollarSign className="w-4 h-4 text-primary-600 dark:text-primary-400" />
          <label htmlFor="rendaMensal" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Renda Mensal
          </label>
        </div>
        <input
          id="rendaMensal"
          type="number"
          value={rendaMensal}
          onChange={(e) => setRendaMensal(e.target.value)}
          className={cn(
            "input-mobile text-base sm:text-sm", // Maior fonte no mobile para melhor toque
            errors.rendaMensal ? "border-red-500 focus:border-red-500" : ""
          )}
          placeholder="5000"
          min="0"
          step="100"
          inputMode="numeric"
        />
        {errors.rendaMensal && (
          <p className="text-red-500 text-xs mt-1">{errors.rendaMensal}</p>
        )}
      </div>

      {/* Divisor Visual */}
      <div className="border-t border-gray-200 dark:border-gray-700 my-4 sm:my-6"></div>

      {/* Informações do Método Selecionado - Mobile Responsive */}
      <div className="p-3 sm:p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
        <div className="flex items-start space-x-2 sm:space-x-3">
          {React.createElement(metodoIcons[metodoSelecionado], {
            className: "w-4 h-4 sm:w-5 sm:h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0"
          })}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-1 sm:mb-2 text-sm sm:text-base">
                Sobre o Método {METODOS_PLANEJAMENTO[metodoSelecionado].nome}
              </h3>
              {metodoSelecionado === 'personalizado' && (
                <div className="flex items-center space-x-2">
                  {!isCustomModeOpen && (
                    <div className="flex items-center space-x-1 text-amber-600 dark:text-amber-400">
                      <AlertCircle className="w-3 h-3" />
                      <span className="text-xs font-medium">Configurar</span>
                    </div>
                  )}
                  <button
                    onClick={() => setIsCustomModeOpen(!isCustomModeOpen)}
                    className="p-1.5 rounded-full bg-blue-100 dark:bg-blue-800 hover:bg-blue-200 dark:hover:bg-blue-700 transition-colors"
                    title={isCustomModeOpen ? "Fechar configuração" : "Abrir configuração"}
                  >
                    <Settings className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600 dark:text-blue-400" />
                  </button>
                </div>
              )}
            </div>
            <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 mb-2 sm:mb-3 leading-relaxed">
              {METODOS_PLANEJAMENTO[metodoSelecionado].descricao}
            </p>

            {/* Percentuais - Mobile Stack */}
            <div className="grid grid-cols-3 gap-2 sm:gap-4">
              <div className="text-center">
                <div className="text-lg sm:text-2xl font-bold text-red-600 dark:text-red-400">
                  {METODOS_PLANEJAMENTO[metodoSelecionado].necessidades}%
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">Necessidades</div>
              </div>
              <div className="text-center">
                <div className="text-lg sm:text-2xl font-bold text-amber-600 dark:text-amber-400">
                  {METODOS_PLANEJAMENTO[metodoSelecionado].desejos}%
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">Desejos</div>
              </div>
              <div className="text-center">
                <div className="text-lg sm:text-2xl font-bold text-green-600 dark:text-green-400">
                  {METODOS_PLANEJAMENTO[metodoSelecionado].poupanca}%
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">Poupança</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modo Personalizado - Expandable Section */}
      {isCustomModeOpen && (
        <div className="space-y-4 animate-slide-up">
          <div className="p-3 sm:p-4 rounded-lg bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <Settings className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600 dark:text-purple-400" />
                <h3 className="font-semibold text-purple-900 dark:text-purple-100 text-sm sm:text-base">
                  Configuração Personalizada
                </h3>
              </div>
              <button
                onClick={() => setIsCustomModeOpen(false)}
                className="p-1 rounded-full hover:bg-purple-100 dark:hover:bg-purple-800 transition-colors"
              >
                <X className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              </button>
            </div>

            <p className="text-xs sm:text-sm text-purple-700 dark:text-purple-300 mb-4">
              Personalize suas categorias de gastos e distribua sua renda conforme suas necessidades.
            </p>

            {/* Header com botão adicionar */}
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-medium text-gray-900 dark:text-white text-sm">Suas Categorias</h4>
              <button
                onClick={adicionarCategoria}
                className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-primary-600 text-white hover:bg-primary-700 transition-colors text-xs"
              >
                <Plus className="w-3 h-3" />
                <span>Adicionar</span>
              </button>
            </div>

            {/* Alerta de Total */}
            <div className={cn(
              'p-3 rounded-lg border-2 mb-4 flex items-center space-x-2',
              categoriasPersonalizadas.reduce((acc, cat) => acc + cat.percentual, 0) === 100
                ? 'bg-green-50 dark:bg-green-900/20 border-green-500'
                : 'bg-amber-50 dark:bg-amber-900/20 border-amber-500'
            )}>
              {categoriasPersonalizadas.reduce((acc, cat) => acc + cat.percentual, 0) === 100 ? (
                <Check className="w-4 h-4 text-green-600 dark:text-green-400 flex-shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 flex-shrink-0" />
              )}
              <div>
                <p className="text-sm font-medium">
                  Total: <span className="font-bold">{categoriasPersonalizadas.reduce((acc, cat) => acc + cat.percentual, 0)}%</span>
                  {categoriasPersonalizadas.reduce((acc, cat) => acc + cat.percentual, 0) !== 100 && (
                    <span className="text-amber-600 dark:text-amber-400 ml-2">
                      (Deve somar 100%)
                    </span>
                  )}
                  {categoriasPersonalizadas.reduce((acc, cat) => acc + cat.percentual, 0) === 100 && (
                    <span className="text-green-600 dark:text-green-400 ml-2">
                      ✓ Perfeito!
                    </span>
                  )}
                </p>
              </div>
            </div>

            {/* Lista de Categorias */}
            <div className="space-y-3 mb-4">
              {categoriasPersonalizadas.map((categoria, index) => (
                <div key={categoria.id} className="p-3 sm:p-4 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                    {/* Nome */}
                    <div className="sm:col-span-3">
                      <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">Nome</label>
                      <input
                        type="text"
                        value={categoria.nome}
                        onChange={(e) => atualizarCategoria(categoria.id, 'nome', e.target.value)}
                        className="input-mobile text-sm w-full"
                        placeholder="Ex: Essenciais"
                      />
                    </div>

                    {/* Percentual */}
                    <div className="sm:col-span-2">
                      <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">% Total</label>
                      <input
                        type="number"
                        value={categoria.percentual}
                        onChange={(e) => atualizarCategoria(categoria.id, 'percentual', Number(e.target.value) || 0)}
                        className="input-mobile text-sm w-full text-center"
                        placeholder="50"
                        min="0"
                        max="100"
                      />
                    </div>

                    {/* Valor calculado */}
                    <div className="sm:col-span-2">
                      <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">Valor (R$)</label>
                      <div className="text-sm font-medium text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-700 px-2 py-2 rounded text-center">
                        {((parseFloat(rendaMensal.replace(',', '.')) || 0) * categoria.percentual / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </div>
                    </div>

                    {/* Cor */}
                    <div className="sm:col-span-2">
                      <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">Cor</label>
                      <input
                        type="color"
                        value={categoria.cor}
                        onChange={(e) => atualizarCategoria(categoria.id, 'cor', e.target.value)}
                        className="w-full h-10 rounded-lg border border-gray-300 dark:border-gray-600 cursor-pointer"
                      />
                    </div>

                    {/* Descrição */}
                    <div className="sm:col-span-2">
                      <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">Descrição</label>
                      <input
                        type="text"
                        value={categoria.descricao}
                        onChange={(e) => atualizarCategoria(categoria.id, 'descricao', e.target.value)}
                        className="input-mobile text-sm w-full"
                        placeholder="Ex: Moradia, alimentação"
                      />
                    </div>

                    {/* Botão remover */}
                    <div className="sm:col-span-1 flex items-end">
                      <button
                        onClick={() => removerCategoria(categoria.id)}
                        className="w-full px-3 py-2 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
                        title="Remover categoria"
                      >
                        <X className="w-4 h-4 mx-auto" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Botões de ação */}
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              <button
                onClick={handleApplyCustom}
                disabled={categoriasPersonalizadas.reduce((acc, cat) => acc + cat.percentual, 0) !== 100}
                className={cn(
                  'flex-1 px-4 py-2 rounded-lg font-medium transition-all flex items-center justify-center space-x-2',
                  categoriasPersonalizadas.reduce((acc, cat) => acc + cat.percentual, 0) === 100
                    ? 'bg-primary-600 hover:bg-primary-700 text-white shadow-md'
                    : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                )}
              >
                <Check className="w-4 h-4" />
                <span>Aplicar Configuração</span>
              </button>

              <button
                onClick={handleResetCustom}
                className="px-4 py-2 rounded-lg font-medium border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all flex items-center justify-center space-x-2"
              >
                <Settings className="w-4 h-4" />
                <span>Resetar</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Recomendações - Mobile Optimized */}
      {recommendations.length > 0 && (
        <div className="p-3 sm:p-4 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
          <h3 className="font-semibold text-green-900 dark:text-green-100 mb-2 sm:mb-3 flex items-center text-sm sm:text-base">
            <Target className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
            Recomendações para este método
          </h3>
          <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-gray-700 dark:text-gray-300">
            {recommendations.map((rec, index) => (
              <li key={index} className="flex items-start">
                <span className="text-green-600 dark:text-green-400 mr-1.5 sm:mr-2 mt-1.5 text-xs">•</span>
                <span className="leading-relaxed">{rec}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Divisor Visual */}
      <div className="border-t border-gray-200 dark:border-gray-700 my-4 sm:my-6"></div>

      {/* Resumo Financeiro - Mobile Stack */}
      <div className="space-y-3">
        <div className="flex items-center space-x-2 mb-3">
          <BarChart3 className="w-4 h-4 text-primary-600 dark:text-primary-400" />
          <h3 className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base">
            Distribuição da Renda
          </h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          {/* Necessidades */}
          <div className="p-3 sm:p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
            <div className="flex items-center space-x-2 mb-2">
              <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-red-500 flex-shrink-0"></div>
              <h4 className="font-semibold text-gray-900 dark:text-white text-sm">Necessidades</h4>
            </div>
            <p className="text-xl sm:text-2xl font-bold text-red-600 dark:text-red-400 mb-1">
              {formattedData.necessidades}
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              {METODOS_PLANEJAMENTO[metodoSelecionado].necessidades}% da renda
            </p>
          </div>

          {/* Desejos */}
          <div className="p-3 sm:p-4 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
            <div className="flex items-center space-x-2 mb-2">
              <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-amber-500 flex-shrink-0"></div>
              <h4 className="font-semibold text-gray-900 dark:text-white text-sm">Desejos</h4>
            </div>
            <p className="text-xl sm:text-2xl font-bold text-amber-600 dark:text-amber-400 mb-1">
              {formattedData.desejos}
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              {METODOS_PLANEJAMENTO[metodoSelecionado].desejos}% da renda
            </p>
          </div>

          {/* Poupança */}
          <div className="p-3 sm:p-4 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
            <div className="flex items-center space-x-2 mb-2">
              <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-green-500 flex-shrink-0"></div>
              <h4 className="font-semibold text-gray-900 dark:text-white text-sm">Poupança</h4>
            </div>
            <p className="text-xl sm:text-2xl font-bold text-green-600 dark:text-green-400 mb-1">
              {formattedData.poupanca}
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              {METODOS_PLANEJAMENTO[metodoSelecionado].poupanca}% da renda
            </p>
          </div>
        </div>
      </div>

      {/* Divisor Visual */}
      <div className="border-t border-gray-200 dark:border-gray-700 my-4 sm:my-6"></div>

      {/* Gráfico de Pizza - Mobile Optimized */}
      {dadosGrafico.length > 0 && (
        <div className="w-full">
          <div className="flex items-center space-x-2 mb-3">
            <Target className="w-4 h-4 text-primary-600 dark:text-primary-400" />
            <h3 className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base">
              Visualização da Distribuição
            </h3>
          </div>
          <div className="h-[250px] sm:h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={dadosGrafico}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ percent }) => `${((Number(percent) || 0) * 100).toFixed(0)}%`}
                  outerRadius={isMobile ? 60 : 80}
                  fill="#8884d8"
                  dataKey="valor"
                >
                  {dadosGrafico.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.cor} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  wrapperStyle={{ fontSize: isMobile ? '12px' : '14px' }}
                  iconSize={isMobile ? 8 : 10}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Projeção Anual - Mobile Responsive */}
      <div className="p-3 sm:p-4 rounded-lg bg-gradient-to-r from-primary-50 to-purple-50 dark:from-primary-900/20 dark:to-purple-900/20 border border-primary-200 dark:border-primary-800">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-2 sm:mb-3 flex items-center text-sm sm:text-base">
          <DollarSign className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
          Projeção Anual
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          <div className="text-center p-2 sm:p-0">
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Necessidades</p>
            <p className="text-base sm:text-lg font-bold text-red-600 dark:text-red-400">
              R$ {((parseFloat(rendaMensal.replace(',', '.')) || 0) * METODOS_PLANEJAMENTO[metodoSelecionado].necessidades / 100 * 12).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
          </div>
          <div className="text-center p-2 sm:p-0">
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Desejos</p>
            <p className="text-base sm:text-lg font-bold text-amber-600 dark:text-amber-400">
              R$ {((parseFloat(rendaMensal.replace(',', '.')) || 0) * METODOS_PLANEJAMENTO[metodoSelecionado].desejos / 100 * 12).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
          </div>
          <div className="text-center p-2 sm:p-0">
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Poupança</p>
            <p className="text-base sm:text-lg font-bold text-green-600 dark:text-green-400">
              R$ {((parseFloat(rendaMensal.replace(',', '.')) || 0) * METODOS_PLANEJAMENTO[metodoSelecionado].poupanca / 100 * 12).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
