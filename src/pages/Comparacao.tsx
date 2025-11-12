import { useState, useMemo } from 'react';
import { TrendingUp, Filter, BarChart3, Table, Eye, EyeOff, AlertTriangle, CheckCircle, Info } from 'lucide-react';
import { useSimulacao } from '../store/useAppStore';
import { gerarCenariosInvestimento, calcularJurosCompostos } from '../utils/calculations';
import { formatarMoeda, formatarPercentual } from '../utils/calculos';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell } from 'recharts';

type RiscoFilter = 'todos' | 'baixo' | 'medio' | 'alto';
type LiquidezFilter = 'todos' | 'alta' | 'media' | 'baixa';
type VisualizacaoType = 'barras' | 'pizza' | 'tabela';

const CORES_RISCO = {
  baixo: '#10b981',
  medio: '#f59e0b',
  alto: '#ef4444'
};

const CORES_LIQUIDEZ = {
  alta: '#3b82f6',
  media: '#8b5cf6',
  baixa: '#64748b'
};

export function Comparacao() {
  const { simulacao } = useSimulacao();
  const [riscoFilter, setRiscoFilter] = useState<RiscoFilter>('todos');
  const [liquidezFilter, setLiquidezFilter] = useState<LiquidezFilter>('todos');
  const [visualizacao, setVisualizacao] = useState<VisualizacaoType>('barras');
  const [cenariosSelecionados, setCenariosSelecionados] = useState<Set<number>>(new Set());

  // Gerar cenários expandidos
  const todosCenarios = useMemo(() => {
    const cenariosBasicos = gerarCenariosInvestimento(simulacao);

    // Adicionar cenários adicionais
    const cenariosAdicionais = [
      {
        nome: 'Fundos Imobiliários',
        taxaAnual: 10.5,
        risco: 'medio' as const,
        liquidez: 'alta' as const,
        tributacao: 20
      },
      {
        nome: 'Criptomoedas',
        taxaAnual: 25.0,
        risco: 'alto' as const,
        liquidez: 'alta' as const,
        tributacao: 15
      },
      {
        nome: 'Previdência Privada',
        taxaAnual: 8.5,
        risco: 'baixo' as const,
        liquidez: 'baixa' as const,
        tributacao: 10
      },
      {
        nome: 'Debêntures',
        taxaAnual: 11.2,
        risco: 'medio' as const,
        liquidez: 'media' as const,
        tributacao: 15
      }
    ];

    return [...cenariosBasicos, ...cenariosAdicionais.map(cenario => {
      const inputCenario = {
        ...simulacao,
        taxaType: 'personalizada' as const,
        taxaPersonalizada: cenario.taxaAnual
      };

      const resultado = calcularJurosCompostos(inputCenario);

      // Aplicar tributação
      if (cenario.tributacao > 0) {
        const impostoSobreGanhos = resultado.totalJuros * (cenario.tributacao / 100);
        resultado.valorFinal -= impostoSobreGanhos;
        resultado.totalJuros -= impostoSobreGanhos;
      }

      return {
        ...cenario,
        resultado
      };
    })];
  }, [simulacao]);

  // Filtrar cenários
  const cenariosFiltrados = useMemo(() => {
    return todosCenarios.filter(cenario => {
      const riscoOk = riscoFilter === 'todos' || cenario.risco === riscoFilter;
      const liquidezOk = liquidezFilter === 'todos' || cenario.liquidez === liquidezFilter;
      return riscoOk && liquidezOk;
    });
  }, [todosCenarios, riscoFilter, liquidezFilter]);

  // Dados para gráficos
  const dadosGrafico = useMemo(() => {
    return cenariosFiltrados.map((cenario, index) => ({
      id: index,
      nome: cenario.nome,
      Investido: cenario.resultado.totalInvestido,
      Juros: cenario.resultado.totalJuros,
      Total: cenario.resultado.valorFinal,
      Rentabilidade: (cenario.resultado.totalJuros / cenario.resultado.totalInvestido) * 100,
      Risco: cenario.risco,
      Liquidez: cenario.liquidez,
      selecionado: cenariosSelecionados.has(index)
    }));
  }, [cenariosFiltrados, cenariosSelecionados]);

  // Dados para gráfico de pizza (top 5 cenários)
  const dadosPizza = useMemo(() => {
    return dadosGrafico
      .sort((a, b) => b.Total - a.Total)
      .slice(0, 5)
      .map((item, index) => ({
        ...item,
        fill: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'][index] || '#64748b'
      }));
  }, [dadosGrafico]);

  // Toggle cenário selecionado
  const toggleCenario = (index: number) => {
    const novosSelecionados = new Set(cenariosSelecionados);
    if (novosSelecionados.has(index)) {
      novosSelecionados.delete(index);
    } else {
      novosSelecionados.add(index);
    }
    setCenariosSelecionados(novosSelecionados);
  };

  // Análise de viabilidade
  const analiseViabilidade = useMemo(() => {
    const melhor = cenariosFiltrados.reduce((prev, curr) =>
      curr.resultado.valorFinal > prev.resultado.valorFinal ? curr : prev
    );

    const maisConservador = cenariosFiltrados
      .filter(c => c.risco === 'baixo')
      .reduce((prev, curr) =>
        curr.resultado.valorFinal > prev.resultado.valorFinal ? curr : prev,
        cenariosFiltrados[0]
      );

    return { melhor, maisConservador };
  }, [cenariosFiltrados]);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 max-w-xs">
          <p className="font-semibold text-gray-900 dark:text-white mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex justify-between items-center mb-1">
              <span className="text-sm" style={{ color: entry.color }}>
                {entry.name}:
              </span>
              <span className="text-sm font-medium ml-2">
                {entry.dataKey === 'Rentabilidade'
                  ? formatarPercentual(entry.value)
                  : formatarMoeda(entry.value)
                }
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="page-container space-y-6">
      <div className="card-mobile flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <TrendingUp className="w-6 h-6 text-primary-600 dark:text-primary-400" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Comparação de Investimentos
          </h1>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {cenariosFiltrados.length} cenários
          </span>
        </div>
      </div>

      {/* Filtros */}
      <div className="card-mobile">
        <div className="flex items-center space-x-2 mb-4">
          <Filter className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Filtros</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Risco
            </label>
            <select
              value={riscoFilter}
              onChange={(e) => setRiscoFilter(e.target.value as RiscoFilter)}
              className="input-mobile"
            >
              <option value="todos">Todos os riscos</option>
              <option value="baixo">Baixo Risco</option>
              <option value="medio">Médio Risco</option>
              <option value="alto">Alto Risco</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Liquidez
            </label>
            <select
              value={liquidezFilter}
              onChange={(e) => setLiquidezFilter(e.target.value as LiquidezFilter)}
              className="input-mobile"
            >
              <option value="todos">Todas as liquidezes</option>
              <option value="alta">Alta Liquidez</option>
              <option value="media">Média Liquidez</option>
              <option value="baixa">Baixa Liquidez</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Visualização
            </label>
            <div className="flex space-x-2">
              <button
                onClick={() => setVisualizacao('barras')}
                className={`btn ${visualizacao === 'barras' ? 'btn-primary' : ''}`}
              >
                <BarChart3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setVisualizacao('pizza')}
                className={`btn ${visualizacao === 'pizza' ? 'btn-primary' : ''}`}
              >
                <TrendingUp className="w-4 h-4" />
              </button>
              <button
                onClick={() => setVisualizacao('tabela')}
                className={`btn ${visualizacao === 'tabela' ? 'btn-primary' : ''}`}
              >
                <Table className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Análise de Viabilidade */}
      <div className="card-mobile">
        <div className="flex items-center space-x-2 mb-4">
          <Info className="w-5 h-5 text-blue-500" />
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Análise Recomendada</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
              <h3 className="font-semibold text-green-800 dark:text-green-200">Melhor Retorno</h3>
            </div>
            <p className="text-sm text-green-700 dark:text-green-300 mb-2">
              {analiseViabilidade.melhor.nome}
            </p>
            <p className="text-lg font-bold text-green-800 dark:text-green-200">
              {formatarMoeda(analiseViabilidade.melhor.resultado.valorFinal)}
            </p>
            <p className="text-xs text-green-600 dark:text-green-400">
              Rentabilidade: {formatarPercentual((analiseViabilidade.melhor.resultado.totalJuros / analiseViabilidade.melhor.resultado.totalInvestido) * 100)}
            </p>
          </div>

          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <AlertTriangle className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <h3 className="font-semibold text-blue-800 dark:text-blue-200">Mais Conservador</h3>
            </div>
            <p className="text-sm text-blue-700 dark:text-blue-300 mb-2">
              {analiseViabilidade.maisConservador.nome}
            </p>
            <p className="text-lg font-bold text-blue-800 dark:text-blue-200">
              {formatarMoeda(analiseViabilidade.maisConservador.resultado.valorFinal)}
            </p>
            <p className="text-xs text-blue-600 dark:text-blue-400">
              Rentabilidade: {formatarPercentual((analiseViabilidade.maisConservador.resultado.totalJuros / analiseViabilidade.maisConservador.resultado.totalInvestido) * 100)}
            </p>
          </div>
        </div>
      </div>

      {/* Gráfico */}
      {visualizacao !== 'tabela' && (
        <div className="card-mobile">
          <div className="w-full h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              {visualizacao === 'barras' ? (
                <BarChart data={dadosGrafico} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.2} />
                  <XAxis
                    dataKey="nome"
                    stroke="#9ca3af"
                    angle={-45}
                    textAnchor="end"
                    interval={0}
                    height={80}
                    fontSize={12}
                  />
                  <YAxis
                    stroke="#9ca3af"
                    tickFormatter={(v) => `R$ ${(v / 1000).toFixed(0)}k`}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Bar dataKey="Investido" stackId="a" fill="#3b82f6" name="Investido" />
                  <Bar dataKey="Juros" stackId="a" fill="#f59e0b" name="Juros" />
                </BarChart>
              ) : (
                <PieChart>
                  <Pie
                    data={dadosPizza}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={120}
                    paddingAngle={2}
                    dataKey="Total"
                    nameKey="nome"
                  >
                    {dadosPizza.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => formatarMoeda(value)} />
                  <Legend />
                </PieChart>
              )}
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Tabela Detalhada */}
      <div className="card-mobile">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Cenários Detalhados
          </h2>
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {cenariosFiltrados.length} cenários encontrados
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-3 px-2 font-semibold text-gray-900 dark:text-white">
                  Cenário
                </th>
                <th className="text-center py-3 px-2 font-semibold text-gray-900 dark:text-white">
                  Risco
                </th>
                <th className="text-center py-3 px-2 font-semibold text-gray-900 dark:text-white">
                  Liquidez
                </th>
                <th className="text-right py-3 px-2 font-semibold text-gray-900 dark:text-white">
                  Investido
                </th>
                <th className="text-right py-3 px-2 font-semibold text-gray-900 dark:text-white">
                  Juros
                </th>
                <th className="text-right py-3 px-2 font-semibold text-gray-900 dark:text-white">
                  Total
                </th>
                <th className="text-right py-3 px-2 font-semibold text-gray-900 dark:text-white">
                  Rentabilidade
                </th>
                <th className="text-center py-3 px-2 font-semibold text-gray-900 dark:text-white">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody>
              {cenariosFiltrados.map((cenario, index) => {
                const rentabilidade = (cenario.resultado.totalJuros / cenario.resultado.totalInvestido) * 100;
                return (
                  <tr key={index} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                    <td className="py-3 px-2 text-gray-900 dark:text-white font-medium">
                      {cenario.nome}
                    </td>
                    <td className="py-3 px-2 text-center">
                      <span
                        className="px-2 py-1 rounded-full text-xs font-medium"
                        style={{
                          backgroundColor: CORES_RISCO[cenario.risco] + '20',
                          color: CORES_RISCO[cenario.risco]
                        }}
                      >
                        {cenario.risco}
                      </span>
                    </td>
                    <td className="py-3 px-2 text-center">
                      <span
                        className="px-2 py-1 rounded-full text-xs font-medium"
                        style={{
                          backgroundColor: CORES_LIQUIDEZ[cenario.liquidez] + '20',
                          color: CORES_LIQUIDEZ[cenario.liquidez]
                        }}
                      >
                        {cenario.liquidez}
                      </span>
                    </td>
                    <td className="py-3 px-2 text-right text-blue-600 dark:text-blue-400">
                      {formatarMoeda(cenario.resultado.totalInvestido)}
                    </td>
                    <td className="py-3 px-2 text-right text-amber-600 dark:text-amber-400">
                      {formatarMoeda(cenario.resultado.totalJuros)}
                    </td>
                    <td className="py-3 px-2 text-right font-semibold text-green-600 dark:text-green-400">
                      {formatarMoeda(cenario.resultado.valorFinal)}
                    </td>
                    <td className="py-3 px-2 text-right text-purple-600 dark:text-purple-400">
                      {formatarPercentual(rentabilidade)}
                    </td>
                    <td className="py-3 px-2 text-center">
                      <button
                        onClick={() => toggleCenario(index)}
                        className={`btn ${cenariosSelecionados.has(index) ? 'btn-primary' : ''}`}
                      >
                        {cenariosSelecionados.has(index) ? (
                          <Eye className="w-4 h-4" />
                        ) : (
                          <EyeOff className="w-4 h-4" />
                        )}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {cenariosSelecionados.size > 0 && (
          <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <p className="text-sm text-blue-800 dark:text-blue-200">
              <strong>{cenariosSelecionados.size}</strong> cenários selecionados para análise detalhada.
              Você pode salvar esta comparação ou exportar os dados.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
