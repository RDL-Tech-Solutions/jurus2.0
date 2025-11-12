import { useState, useMemo } from 'react';
import { Target, PiggyBank, TrendingUp, Wallet, AlertTriangle, Calculator, DollarSign, Calendar, Shield, BarChart3 } from 'lucide-react';
import { Regra503020 } from '../components/Regra503020';
import { formatarMoeda } from '../utils/calculos';
import { cn } from '../utils/cn';

type FerramentaAtiva = 'orcamento' | 'emergencia' | 'aposentadoria' | 'metas' | 'fluxo';

interface GastoMensal {
  categoria: string;
  valor: number;
  cor: string;
  icone: string;
}

interface FluxoCaixa {
  descricao: string;
  valor: number;
  tipo: 'entrada' | 'saida';
  categoria: string;
  data: string;
}

export function Planejamento() {
  const [ferramentaAtiva, setFerramentaAtiva] = useState<FerramentaAtiva>('orcamento');

  // Dados para orçamento mensal
  const [rendaMensal, setRendaMensal] = useState(5000);
  const [gastosMensais, setGastosMensais] = useState<GastoMensal[]>([
    { categoria: 'Moradia', valor: 1500, cor: '#ef4444', icone: '🏠' },
    { categoria: 'Alimentação', valor: 800, cor: '#f59e0b', icone: '🍽️' },
    { categoria: 'Transporte', valor: 400, cor: '#10b981', icone: '🚗' },
    { categoria: 'Saúde', valor: 300, cor: '#3b82f6', icone: '🏥' },
    { categoria: 'Educação', valor: 200, cor: '#8b5cf6', icone: '📚' },
    { categoria: 'Lazer', valor: 500, cor: '#ec4899', icone: '🎉' },
    { categoria: 'Investimentos', valor: 600, cor: '#64748b', icone: '📈' }
  ]);

  // Dados para fundo de emergência
  const [fundoEmergencia, setFundoEmergencia] = useState({
    mesesAlvo: 6,
    rendaMensal: 5000,
    gastosEssenciaisMensais: 3000,
    valorAtual: 0
  });

  // Dados para planejamento de aposentadoria
  const [aposentadoria, setAposentadoria] = useState({
    idadeAtual: 30,
    idadeAposentadoria: 65,
    rendaAtual: 5000,
    aporteMensal: 800,
    taxaJuros: 8,
    inflacao: 3,
    expectativaVida: 85
  });

  // Dados para metas de longo prazo
  const [metaLongoPrazo, setMetaLongoPrazo] = useState({
    objetivo: 'Comprar casa própria',
    valorMeta: 300000,
    valorAtual: 50000,
    prazoAnos: 10,
    aporteMensal: 1500,
    taxaJuros: 7
  });

  // Dados para fluxo de caixa
  const [fluxoCaixa, setFluxoCaixa] = useState<FluxoCaixa[]>([
    { descricao: 'Salário', valor: 5000, tipo: 'entrada', categoria: 'Renda', data: '2024-01-01' },
    { descricao: 'Freelance', valor: 800, tipo: 'entrada', categoria: 'Extra', data: '2024-01-15' },
    { descricao: 'Aluguel', valor: 1500, tipo: 'saida', categoria: 'Moradia', data: '2024-01-01' },
    { descricao: 'Supermercado', valor: 600, tipo: 'saida', categoria: 'Alimentação', data: '2024-01-05' },
    { descricao: 'Transporte', valor: 200, tipo: 'saida', categoria: 'Transporte', data: '2024-01-10' },
    { descricao: 'Academia', valor: 150, tipo: 'saida', categoria: 'Saúde', data: '2024-01-12' }
  ]);

  // Cálculos para orçamento
  const totalGastos = useMemo(() =>
    gastosMensais.reduce((acc, gasto) => acc + gasto.valor, 0),
    [gastosMensais]
  );

  const saldoMensal = rendaMensal - totalGastos;
  const percentualGastos = rendaMensal > 0 ? (totalGastos / rendaMensal) * 100 : 0;

  // Cálculos para fundo de emergência
  const valorAlvoEmergencia = fundoEmergencia.gastosEssenciaisMensais * fundoEmergencia.mesesAlvo;
  const progressoEmergencia = valorAlvoEmergencia > 0 ? (fundoEmergencia.valorAtual / valorAlvoEmergencia) * 100 : 0;
  const mesesRestantesEmergencia = Math.max(0, fundoEmergencia.mesesAlvo - Math.floor(fundoEmergencia.valorAtual / fundoEmergencia.gastosEssenciaisMensais));

  // Cálculos para aposentadoria
  const anosContribuicao = aposentadoria.idadeAposentadoria - aposentadoria.idadeAtual;
  const mesesContribuicao = anosContribuicao * 12;
  const aporteAnual = aposentadoria.aporteMensal * 12;

  const calcularValorFuturo = (principal: number, aporteMensal: number, taxaMensal: number, meses: number) => {
    const valorPrincipal = principal * Math.pow(1 + taxaMensal, meses);
    const valorAportes = aporteMensal * ((Math.pow(1 + taxaMensal, meses) - 1) / taxaMensal);
    return valorPrincipal + valorAportes;
  };

  const taxaMensal = aposentadoria.taxaJuros / 100 / 12;
  const valorAposentadoria = calcularValorFuturo(0, aposentadoria.aporteMensal, taxaMensal, mesesContribuicao);
  const rendaMensalAposentadoria = valorAposentadoria / ((aposentadoria.expectativaVida - aposentadoria.idadeAposentadoria) * 12);

  // Cálculos para meta de longo prazo
  const mesesMeta = metaLongoPrazo.prazoAnos * 12;
  const taxaMensalMeta = metaLongoPrazo.taxaJuros / 100 / 12;
  const valorProjetadoMeta = calcularValorFuturo(metaLongoPrazo.valorAtual, metaLongoPrazo.aporteMensal, taxaMensalMeta, mesesMeta);
  const progressoMeta = metaLongoPrazo.valorMeta > 0 ? (valorProjetadoMeta / metaLongoPrazo.valorMeta) * 100 : 0;

  // Cálculos para fluxo de caixa
  const entradas = fluxoCaixa.filter(item => item.tipo === 'entrada').reduce((acc, item) => acc + item.valor, 0);
  const saidas = fluxoCaixa.filter(item => item.tipo === 'saida').reduce((acc, item) => acc + item.valor, 0);
  const saldoFluxo = entradas - saidas;

  const ferramentas = [
    { id: 'orcamento', nome: 'Orçamento 50/30/20', icone: Wallet, descricao: 'Regra de distribuição da renda' },
    { id: 'emergencia', nome: 'Fundo de Emergência', icone: Shield, descricao: 'Planejamento de reserva financeira' },
    { id: 'aposentadoria', nome: 'Aposentadoria', icone: PiggyBank, descricao: 'Projeções para aposentadoria' },
    { id: 'metas', nome: 'Metas de Longo Prazo', icone: Target, descricao: 'Objetivos financeiros futuros' },
    { id: 'fluxo', nome: 'Fluxo de Caixa', icone: BarChart3, descricao: 'Controle de entradas e saídas' }
  ];

  const renderizarFerramenta = () => {
    switch (ferramentaAtiva) {
      case 'orcamento':
        return <Regra503020 />;

      case 'emergencia':
        return (
          <div className="space-y-6">
            <div className="card-mobile">
              <div className="flex items-center space-x-2 mb-4">
                <Shield className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Fundo de Emergência
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Meses de proteção desejada
                  </label>
                  <select
                    value={fundoEmergencia.mesesAlvo}
                    onChange={(e) => setFundoEmergencia(prev => ({ ...prev, mesesAlvo: Number(e.target.value) }))}
                    className="input-mobile"
                  >
                    <option value={3}>3 meses</option>
                    <option value={6}>6 meses</option>
                    <option value={9}>9 meses</option>
                    <option value={12}>12 meses</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Gastos essenciais mensais
                  </label>
                  <input
                    type="number"
                    value={fundoEmergencia.gastosEssenciaisMensais}
                    onChange={(e) => setFundoEmergencia(prev => ({ ...prev, gastosEssenciaisMensais: Number(e.target.value) }))}
                    className="input-mobile"
                    placeholder="Ex: 3000"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Valor atual do fundo
                  </label>
                  <input
                    type="number"
                    value={fundoEmergencia.valorAtual}
                    onChange={(e) => setFundoEmergencia(prev => ({ ...prev, valorAtual: Number(e.target.value) }))}
                    className="input-mobile"
                    placeholder="Ex: 5000"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <p className="text-sm text-blue-800 dark:text-blue-200 font-medium">Valor Alvo</p>
                    <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                      {formatarMoeda(valorAlvoEmergencia)}
                    </p>
                  </div>

                  <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <p className="text-sm text-green-800 dark:text-green-200 font-medium">Valor Atual</p>
                    <p className="text-2xl font-bold text-green-900 dark:text-green-100">
                      {formatarMoeda(fundoEmergencia.valorAtual)}
                    </p>
                  </div>

                  <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                    <p className="text-sm text-purple-800 dark:text-purple-200 font-medium">Progresso</p>
                    <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                      {progressoEmergencia.toFixed(1)}%
                    </p>
                  </div>
                </div>

                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4">
                  <div
                    className="bg-blue-600 dark:bg-blue-500 h-4 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(progressoEmergencia, 100)}%` }}
                  />
                </div>

                {mesesRestantesEmergencia > 0 ? (
                  <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                      <div>
                        <p className="text-sm font-medium text-amber-800 dark:text-amber-200">
                          Ainda faltam {mesesRestantesEmergencia} meses para completar seu fundo
                        </p>
                        <p className="text-xs text-amber-600 dark:text-amber-400">
                          Aporte mensal necessário: {formatarMoeda(fundoEmergencia.gastosEssenciaisMensais)}
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Shield className="w-5 h-5 text-green-600 dark:text-green-400" />
                      <p className="text-sm font-medium text-green-800 dark:text-green-200">
                        🎉 Parabéns! Seu fundo de emergência está completo!
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      case 'aposentadoria':
        return (
          <div className="space-y-6">
            <div className="card-mobile">
              <div className="flex items-center space-x-2 mb-6">
                <PiggyBank className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Planejamento de Aposentadoria
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Idade atual
                  </label>
                  <input
                    type="number"
                    value={aposentadoria.idadeAtual}
                    onChange={(e) => setAposentadoria(prev => ({ ...prev, idadeAtual: Number(e.target.value) }))}
                    className="input-mobile"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Idade para aposentar
                  </label>
                  <input
                    type="number"
                    value={aposentadoria.idadeAposentadoria}
                    onChange={(e) => setAposentadoria(prev => ({ ...prev, idadeAposentadoria: Number(e.target.value) }))}
                    className="input-mobile"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Aporte mensal
                  </label>
                  <input
                    type="number"
                    value={aposentadoria.aporteMensal}
                    onChange={(e) => setAposentadoria(prev => ({ ...prev, aporteMensal: Number(e.target.value) }))}
                    className="input-mobile"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Taxa de juros (% a.a.)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={aposentadoria.taxaJuros}
                    onChange={(e) => setAposentadoria(prev => ({ ...prev, taxaJuros: Number(e.target.value) }))}
                    className="input-mobile"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Expectativa de vida
                  </label>
                  <input
                    type="number"
                    value={aposentadoria.expectativaVida}
                    onChange={(e) => setAposentadoria(prev => ({ ...prev, expectativaVida: Number(e.target.value) }))}
                    className="input-mobile"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <p className="text-sm text-purple-800 dark:text-purple-200 font-medium">Valor acumulado</p>
                  <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                    {formatarMoeda(valorAposentadoria)}
                  </p>
                  <p className="text-xs text-purple-600 dark:text-purple-400">
                    em {anosContribuicao} anos
                  </p>
                </div>

                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <p className="text-sm text-blue-800 dark:text-blue-200 font-medium">Renda mensal</p>
                  <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                    {formatarMoeda(rendaMensalAposentadoria)}
                  </p>
                  <p className="text-xs text-blue-600 dark:text-blue-400">
                    durante {aposentadoria.expectativaVida - aposentadoria.idadeAposentadoria} anos
                  </p>
                </div>

                <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <p className="text-sm text-green-800 dark:text-green-200 font-medium">Total aportado</p>
                  <p className="text-2xl font-bold text-green-900 dark:text-green-100">
                    {formatarMoeda(aposentadoria.aporteMensal * mesesContribuicao)}
                  </p>
                  <p className="text-xs text-green-600 dark:text-green-400">
                    {formatarMoeda(aposentadoria.aporteMensal)}/mês
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      case 'metas':
        return (
          <div className="space-y-6">
            <div className="card-mobile">
              <div className="flex items-center space-x-2 mb-6">
                <Target className="w-6 h-6 text-green-600 dark:text-green-400" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Metas de Longo Prazo
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Objetivo
                  </label>
                  <input
                    type="text"
                    value={metaLongoPrazo.objetivo}
                    onChange={(e) => setMetaLongoPrazo(prev => ({ ...prev, objetivo: e.target.value }))}
                    className="input-mobile"
                    placeholder="Ex: Comprar casa própria"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Valor da meta
                  </label>
                  <input
                    type="number"
                    value={metaLongoPrazo.valorMeta}
                    onChange={(e) => setMetaLongoPrazo(prev => ({ ...prev, valorMeta: Number(e.target.value) }))}
                    className="input-mobile"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Valor atual
                  </label>
                  <input
                    type="number"
                    value={metaLongoPrazo.valorAtual}
                    onChange={(e) => setMetaLongoPrazo(prev => ({ ...prev, valorAtual: Number(e.target.value) }))}
                    className="input-mobile"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Prazo (anos)
                  </label>
                  <input
                    type="number"
                    value={metaLongoPrazo.prazoAnos}
                    onChange={(e) => setMetaLongoPrazo(prev => ({ ...prev, prazoAnos: Number(e.target.value) }))}
                    className="input-mobile"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Aporte mensal
                  </label>
                  <input
                    type="number"
                    value={metaLongoPrazo.aporteMensal}
                    onChange={(e) => setMetaLongoPrazo(prev => ({ ...prev, aporteMensal: Number(e.target.value) }))}
                    className="input-mobile"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Taxa esperada (% a.a.)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={metaLongoPrazo.taxaJuros}
                    onChange={(e) => setMetaLongoPrazo(prev => ({ ...prev, taxaJuros: Number(e.target.value) }))}
                    className="input-mobile"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <p className="text-sm text-green-800 dark:text-green-200 font-medium">Valor projetado</p>
                  <p className="text-2xl font-bold text-green-900 dark:text-green-100">
                    {formatarMoeda(valorProjetadoMeta)}
                  </p>
                  <p className="text-xs text-green-600 dark:text-green-400">
                    em {metaLongoPrazo.prazoAnos} anos
                  </p>
                </div>

                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <p className="text-sm text-blue-800 dark:text-blue-200 font-medium">Valor restante</p>
                  <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                    {formatarMoeda(Math.max(metaLongoPrazo.valorMeta - valorProjetadoMeta, 0))}
                  </p>
                  <p className="text-xs text-blue-600 dark:text-blue-400">
                    Progresso: {progressoMeta.toFixed(1)}%
                  </p>
                </div>

                <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <p className="text-sm text-purple-800 dark:text-purple-200 font-medium">Aporte mensal</p>
                  <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                    {formatarMoeda(metaLongoPrazo.aporteMensal)}
                  </p>
                  <p className="text-xs text-purple-600 dark:text-purple-400">
                    Total aportado: {formatarMoeda(metaLongoPrazo.valorAtual + metaLongoPrazo.aporteMensal * mesesMeta)}
                  </p>
                </div>
              </div>

              <div className="mt-4">
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4">
                  <div
                    className={cn(
                      "h-4 rounded-full transition-all duration-500",
                      progressoMeta >= 100 ? "bg-green-500" : "bg-blue-500"
                    )}
                    style={{ width: `${Math.min(progressoMeta, 100)}%` }}
                  />
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 text-center">
                  {progressoMeta >= 100
                    ? "🎉 Meta atingida!"
                    : `Faltam ${formatarMoeda(Math.max(metaLongoPrazo.valorMeta - valorProjetadoMeta, 0))} para atingir a meta`
                  }
                </p>
              </div>
            </div>
          </div>
        );

      case 'fluxo':
        return (
          <div className="space-y-6">
            <div className="card-mobile">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-2">
                  <BarChart3 className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Fluxo de Caixa
                  </h3>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Saldo do mês</p>
                  <p className={cn(
                    "text-2xl font-bold",
                    saldoFluxo >= 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
                  )}>
                    {formatarMoeda(saldoFluxo)}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <p className="text-sm text-green-800 dark:text-green-200 font-medium">Entradas</p>
                  <p className="text-2xl font-bold text-green-900 dark:text-green-100">
                    {formatarMoeda(entradas)}
                  </p>
                </div>

                <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                  <p className="text-sm text-red-800 dark:text-red-200 font-medium">Saídas</p>
                  <p className="text-2xl font-bold text-red-900 dark:text-red-100">
                    {formatarMoeda(saidas)}
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {fluxoCaixa.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className={cn(
                        "w-3 h-3 rounded-full",
                        item.tipo === 'entrada' ? "bg-green-500" : "bg-red-500"
                      )} />
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{item.descricao}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{item.categoria}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={cn(
                        "font-semibold",
                        item.tipo === 'entrada' ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
                      )}>
                        {item.tipo === 'entrada' ? '+' : '-'}{formatarMoeda(item.valor)}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-500">{item.data}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="page-container space-y-6">
      <div className="card-mobile">
        <div className="flex items-center space-x-2 mb-4">
          <Calculator className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Planejamento Financeiro
          </h1>
        </div>

        {/* Seletor de ferramentas */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          {ferramentas.map((ferramenta) => {
            const Icon = ferramenta.icone;
            return (
              <button
                key={ferramenta.id}
                onClick={() => setFerramentaAtiva(ferramenta.id as FerramentaAtiva)}
                className={cn(
                  'p-4 rounded-lg border-2 transition-all text-left',
                  ferramentaAtiva === ferramenta.id
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600'
                )}
              >
                <Icon className="w-6 h-6 mb-2 text-blue-600 dark:text-blue-400" />
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                  {ferramenta.nome}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {ferramenta.descricao}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Conteúdo da ferramenta selecionada */}
      {renderizarFerramenta()}
    </div>
  );
}
