// Componente principal do Simulador de Cenários Econômicos

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  TrendingUp,
  TrendingDown,
  Activity,
  AlertTriangle,
  Settings,
  Play,
  Download,
  Plus,
  Eye,
  EyeOff,
  BarChart3,
  PieChart,
  LineChart,
  Zap,
  Shield,
  Target,
  Brain,
  Lightbulb,
  Clock,
  DollarSign,
  Percent,
  Calendar,
  Filter,
  RefreshCw,
  Save,
  Trash2,
  Copy,
  Edit3,
  Info,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';
import { useCenarios } from '../hooks/useCenarios';
import { CenarioEconomico, ParametrosCenario, EventoEconomico } from '../types/cenarios';
import { AnimatedContainer, StaggeredContainer, AnimatedItem } from './AnimatedContainer';
import { AnimatedButton } from './AnimatedButton';
import { formatarMoeda, formatarPercentual } from '../utils/formatters';

const SimuladorCenarios: React.FC = () => {
  const {
    cenarios,
    resultados,
    comparacoes,
    stressTests,
    configuracao,
    alertas,
    isLoading,
    ultimaAtualizacao,
    cenariosAtivos,
    resultadosAtivos,
    alertasAtivos,
    estatisticasGerais,
    adicionarCenario,
    atualizarCenario,
    removerCenario,
    alternarCenario,
    simularCenarios,
    criarComparacao,
    executarStressTestPersonalizado,
    marcarAlertaComoVisualizado,
    resolverAlerta,
    exportarDados,
    limparDados,
    setConfiguracao,
    formatarMoeda,
    formatarPercentual
  } = useCenarios();

  // Estados locais
  const [abaSelecionada, setAbaSelecionada] = useState<'cenarios' | 'resultados' | 'comparacao' | 'stress' | 'alertas' | 'configuracao'>('cenarios');
  const [modalAberto, setModalAberto] = useState<string | null>(null);
  const [cenarioEditando, setCenarioEditando] = useState<CenarioEconomico | null>(null);
  const [filtros, setFiltros] = useState({
    tipo: 'todos',
    risco: 'todos',
    ordenacao: 'nome'
  });

  // Executar simulação automaticamente quando cenários mudarem
  useEffect(() => {
    if (cenariosAtivos.length > 0) {
      simularCenarios();
    }
  }, [cenariosAtivos.length]);

  const abas = [
    { id: 'cenarios', label: 'Cenários', icon: Activity, count: cenarios.length },
    { id: 'resultados', label: 'Resultados', icon: BarChart3, count: resultadosAtivos.length },
    { id: 'comparacao', label: 'Comparação', icon: PieChart, count: comparacoes.length },
    { id: 'stress', label: 'Stress Test', icon: Shield, count: stressTests.length },
    { id: 'alertas', label: 'Alertas', icon: AlertTriangle, count: alertasAtivos.length },
    { id: 'configuracao', label: 'Configuração', icon: Settings, count: 0 }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <AnimatedContainer variant="fadeIn">
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Simulador de Cenários Econômicos
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Analise diferentes cenários econômicos e seus impactos nos seus investimentos
              </p>
            </div>
            
            <div className="flex items-center space-x-3">
              <AnimatedButton
                onClick={() => simularCenarios()}
                disabled={isLoading || cenariosAtivos.length === 0}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                {isLoading ? (
                  <RefreshCw className="w-4 h-4 animate-spin mr-2" />
                ) : (
                  <Play className="w-4 h-4 mr-2" />
                )}
                {isLoading ? 'Simulando...' : 'Simular'}
              </AnimatedButton>
              
              <AnimatedButton
                onClick={() => setModalAberto('novo-cenario')}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Novo Cenário
              </AnimatedButton>
              
              <AnimatedButton
                onClick={() => exportarDados('json')}
                disabled={resultadosAtivos.length === 0}
                variant="outline"
              >
                <Download className="w-4 h-4 mr-2" />
                Exportar
              </AnimatedButton>
            </div>
          </div>

          {/* Estatísticas Rápidas */}
          {estatisticasGerais && (
            <StaggeredContainer className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <AnimatedItem>
                <EstatisticaCard
                  titulo="Melhor Cenário"
                  valor={formatarMoeda(estatisticasGerais.melhorCenario)}
                  icone={TrendingUp}
                  cor="text-green-600"
                />
              </AnimatedItem>
              <AnimatedItem>
                <EstatisticaCard
                  titulo="Pior Cenário"
                  valor={formatarMoeda(estatisticasGerais.piorCenario)}
                  icone={TrendingDown}
                  cor="text-red-600"
                />
              </AnimatedItem>
              <AnimatedItem>
                <EstatisticaCard
                  titulo="Rentabilidade Média"
                  valor={formatarPercentual(estatisticasGerais.mediaRentabilidade)}
                  icone={Percent}
                  cor="text-blue-600"
                />
              </AnimatedItem>
              <AnimatedItem>
                <EstatisticaCard
                  titulo="Volatilidade"
                  valor={formatarPercentual(estatisticasGerais.volatilidade)}
                  icone={Activity}
                  cor="text-orange-600"
                />
              </AnimatedItem>
            </StaggeredContainer>
          )}
        </div>
      </AnimatedContainer>

      {/* Alertas Ativos */}
      {alertasAtivos.length > 0 && (
        <AnimatedContainer variant="slideUp">
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center">
                <AlertTriangle className="w-5 h-5 text-yellow-600 mr-2" />
                <h3 className="font-semibold text-yellow-800 dark:text-yellow-200">
                  Alertas Ativos ({alertasAtivos.length})
                </h3>
              </div>
              <button
                onClick={() => setAbaSelecionada('alertas')}
                className="text-yellow-600 hover:text-yellow-700 text-sm font-medium"
              >
                Ver todos
              </button>
            </div>
            <div className="space-y-2">
              {alertasAtivos.slice(0, 3).map(alerta => (
                <div key={alerta.id} className="flex items-center justify-between bg-white dark:bg-gray-800 rounded-lg p-3">
                  <div className="flex items-center">
                    <div className={`w-2 h-2 rounded-full mr-3 ${
                      alerta.severidade === 'critica' ? 'bg-red-500' :
                      alerta.severidade === 'alta' ? 'bg-orange-500' :
                      alerta.severidade === 'media' ? 'bg-yellow-500' : 'bg-blue-500'
                    }`} />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white text-sm">
                        {alerta.titulo}
                      </p>
                      <p className="text-gray-600 dark:text-gray-400 text-xs">
                        {alerta.descricao}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => marcarAlertaComoVisualizado(alerta.id)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </AnimatedContainer>
      )}

      {/* Navegação por Abas */}
      <AnimatedContainer variant="slideUp">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="flex space-x-8 px-6">
              {abas.map(aba => (
                <button
                  key={aba.id}
                  onClick={() => setAbaSelecionada(aba.id as any)}
                  className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                    abaSelecionada === aba.id
                      ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                      : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                  }`}
                >
                  <div className="flex items-center">
                    <aba.icon className="w-4 h-4 mr-2" />
                    {aba.label}
                    {aba.count > 0 && (
                      <span className={`ml-2 px-2 py-1 text-xs rounded-full ${
                        abaSelecionada === aba.id
                          ? 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300'
                          : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                      }`}>
                        {aba.count}
                      </span>
                    )}
                  </div>
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            <AnimatePresence mode="wait">
              {abaSelecionada === 'cenarios' && (
                <AbaCenarios
                  cenarios={cenarios}
                  cenariosAtivos={cenariosAtivos}
                  onAlternarCenario={alternarCenario}
                  onEditarCenario={(cenario) => {
                    setCenarioEditando(cenario);
                    setModalAberto('editar-cenario');
                  }}
                  onRemoverCenario={removerCenario}
                  filtros={filtros}
                  onFiltrosChange={setFiltros}
                />
              )}

              {abaSelecionada === 'resultados' && (
                <AbaResultados
                  resultados={resultadosAtivos}
                  cenarios={cenarios}
                  isLoading={isLoading}
                />
              )}

              {abaSelecionada === 'comparacao' && (
                <AbaComparacao
                  comparacoes={comparacoes}
                  resultados={resultadosAtivos}
                  cenarios={cenarios}
                  onCriarComparacao={criarComparacao}
                />
              )}

              {abaSelecionada === 'stress' && (
                <AbaStressTest
                  stressTests={stressTests}
                  onExecutarStressTest={executarStressTestPersonalizado}
                  isLoading={isLoading}
                />
              )}

              {abaSelecionada === 'alertas' && (
                <AbaAlertas
                  alertas={alertas}
                  onMarcarVisualizado={marcarAlertaComoVisualizado}
                  onResolver={resolverAlerta}
                />
              )}

              {abaSelecionada === 'configuracao' && (
                <AbaConfiguracao
                  configuracao={configuracao}
                  onConfigChange={setConfiguracao}
                  onLimparDados={limparDados}
                  onExportar={exportarDados}
                />
              )}
            </AnimatePresence>
          </div>
        </div>
      </AnimatedContainer>

      {/* Modais */}
      <AnimatePresence>
        {modalAberto === 'novo-cenario' && (
          <ModalNovoCenario
            onClose={() => setModalAberto(null)}
            onSalvar={(cenario) => {
              adicionarCenario(cenario);
              setModalAberto(null);
            }}
          />
        )}

        {modalAberto === 'editar-cenario' && cenarioEditando && (
          <ModalEditarCenario
            cenario={cenarioEditando}
            onClose={() => {
              setModalAberto(null);
              setCenarioEditando(null);
            }}
            onSalvar={(atualizacoes) => {
              atualizarCenario(cenarioEditando.id, atualizacoes);
              setModalAberto(null);
              setCenarioEditando(null);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

// Componente de Estatística
const EstatisticaCard: React.FC<{
  titulo: string;
  valor: string;
  icone: React.ComponentType<any>;
  cor: string;
}> = ({ titulo, valor, icone: Icone, cor }) => (
  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
          {titulo}
        </p>
        <p className={`text-lg font-bold ${cor}`}>
          {valor}
        </p>
      </div>
      <Icone className={`w-6 h-6 ${cor}`} />
    </div>
  </div>
);

// Componentes das Abas (implementações simplificadas)
const AbaCenarios: React.FC<any> = ({ cenarios, cenariosAtivos, onAlternarCenario, onEditarCenario, onRemoverCenario, filtros, onFiltrosChange }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    className="space-y-4"
  >
    <div className="flex items-center justify-between">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
        Cenários Disponíveis
      </h3>
      <div className="flex items-center space-x-2">
        <select
          value={filtros.tipo}
          onChange={(e) => onFiltrosChange({ ...filtros, tipo: e.target.value })}
          className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm"
        >
          <option value="todos">Todos os tipos</option>
          <option value="otimista">Otimista</option>
          <option value="realista">Realista</option>
          <option value="pessimista">Pessimista</option>
          <option value="personalizado">Personalizado</option>
        </select>
      </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {cenarios.map(cenario => (
        <CenarioCard
          key={cenario.id}
          cenario={cenario}
          ativo={cenariosAtivos.includes(cenario.id)}
          onAlternar={() => onAlternarCenario(cenario.id)}
          onEditar={() => onEditarCenario(cenario)}
          onRemover={() => onRemoverCenario(cenario.id)}
        />
      ))}
    </div>
  </motion.div>
);

const AbaResultados: React.FC<any> = ({ resultados, cenarios, isLoading }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    className="space-y-4"
  >
    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
      Resultados das Simulações
    </h3>
    
    {isLoading ? (
      <div className="flex items-center justify-center py-12">
        <RefreshCw className="w-8 h-8 animate-spin text-blue-600" />
        <span className="ml-2 text-gray-600 dark:text-gray-400">Simulando cenários...</span>
      </div>
    ) : resultados.length > 0 ? (
      <div className="space-y-4">
        {resultados.map(resultado => (
          <ResultadoCard
            key={resultado.cenarioId}
            resultado={resultado}
            cenario={cenarios.find(c => c.id === resultado.cenarioId)}
          />
        ))}
      </div>
    ) : (
      <div className="text-center py-12">
        <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600 dark:text-gray-400">
          Nenhum resultado disponível. Execute uma simulação primeiro.
        </p>
      </div>
    )}
  </motion.div>
);

const AbaComparacao: React.FC<any> = ({ comparacoes, resultados, cenarios, onCriarComparacao }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    className="space-y-4"
  >
    <div className="flex items-center justify-between">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
        Comparações de Cenários
      </h3>
      <AnimatedButton
        onClick={() => {
          if (resultados.length >= 2) {
            const cenarioIds = resultados.slice(0, 2).map(r => r.cenarioId);
            onCriarComparacao('Nova Comparação', cenarioIds);
          }
        }}
        disabled={resultados.length < 2}
        className="bg-blue-600 hover:bg-blue-700 text-white"
      >
        <Plus className="w-4 h-4 mr-2" />
        Nova Comparação
      </AnimatedButton>
    </div>

    {comparacoes.length > 0 ? (
      <div className="space-y-4">
        {comparacoes.map(comparacao => (
          <ComparacaoCard
            key={comparacao.id}
            comparacao={comparacao}
            cenarios={cenarios}
          />
        ))}
      </div>
    ) : (
      <div className="text-center py-12">
        <PieChart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600 dark:text-gray-400">
          Nenhuma comparação criada ainda.
        </p>
      </div>
    )}
  </motion.div>
);

const AbaStressTest: React.FC<any> = ({ stressTests, onExecutarStressTest, isLoading }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    className="space-y-4"
  >
    <div className="flex items-center justify-between">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
        Stress Tests
      </h3>
      <AnimatedButton
        onClick={() => {
          // Implementar modal de stress test
        }}
        disabled={isLoading}
        className="bg-red-600 hover:bg-red-700 text-white"
      >
        <Shield className="w-4 h-4 mr-2" />
        Novo Stress Test
      </AnimatedButton>
    </div>

    {stressTests.length > 0 ? (
      <div className="space-y-4">
        {stressTests.map(test => (
          <StressTestCard key={test.id} stressTest={test} />
        ))}
      </div>
    ) : (
      <div className="text-center py-12">
        <Shield className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600 dark:text-gray-400">
          Nenhum stress test executado ainda.
        </p>
      </div>
    )}
  </motion.div>
);

const AbaAlertas: React.FC<any> = ({ alertas, onMarcarVisualizado, onResolver }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    className="space-y-4"
  >
    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
      Alertas e Notificações
    </h3>

    {alertas.length > 0 ? (
      <div className="space-y-3">
        {alertas.map(alerta => (
          <AlertaCard
            key={alerta.id}
            alerta={alerta}
            onMarcarVisualizado={() => onMarcarVisualizado(alerta.id)}
            onResolver={() => onResolver(alerta.id)}
          />
        ))}
      </div>
    ) : (
      <div className="text-center py-12">
        <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-4" />
        <p className="text-gray-600 dark:text-gray-400">
          Nenhum alerta ativo no momento.
        </p>
      </div>
    )}
  </motion.div>
);

const AbaConfiguracao: React.FC<any> = ({ configuracao, onConfigChange, onLimparDados, onExportar }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    className="space-y-6"
  >
    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
      Configurações
    </h3>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-4">
        <h4 className="font-medium text-gray-900 dark:text-white">Alertas</h4>
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Perda Máxima (%)
            </label>
            <input
              type="number"
              value={configuracao.alertas.perdaMaxima}
              onChange={(e) => onConfigChange({
                ...configuracao,
                alertas: { ...configuracao.alertas, perdaMaxima: Number(e.target.value) }
              })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Volatilidade (%)
            </label>
            <input
              type="number"
              value={configuracao.alertas.volatilidade}
              onChange={(e) => onConfigChange({
                ...configuracao,
                alertas: { ...configuracao.alertas, volatilidade: Number(e.target.value) }
              })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg"
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h4 className="font-medium text-gray-900 dark:text-white">Ações</h4>
        <div className="space-y-3">
          <AnimatedButton
            onClick={() => onExportar('json')}
            variant="outline"
            className="w-full"
          >
            <Download className="w-4 h-4 mr-2" />
            Exportar Dados (JSON)
          </AnimatedButton>
          <AnimatedButton
            onClick={() => onExportar('csv')}
            variant="outline"
            className="w-full"
          >
            <Download className="w-4 h-4 mr-2" />
            Exportar Dados (CSV)
          </AnimatedButton>
          <AnimatedButton
            onClick={onLimparDados}
            variant="outline"
            className="w-full text-red-600 border-red-300 hover:bg-red-50"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Limpar Todos os Dados
          </AnimatedButton>
        </div>
      </div>
    </div>
  </motion.div>
);

// Componentes auxiliares (implementações simplificadas)
const CenarioCard: React.FC<any> = ({ cenario, ativo, onAlternar, onEditar, onRemover }) => (
  <div className={`border-2 rounded-xl p-4 transition-all ${
    ativo ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-200 dark:border-gray-700'
  }`}>
    <div className="flex items-center justify-between mb-3">
      <div className="flex items-center">
        <span className="text-2xl mr-2">{cenario.icone}</span>
        <div>
          <h4 className="font-semibold text-gray-900 dark:text-white">{cenario.nome}</h4>
          <p className="text-sm text-gray-600 dark:text-gray-400">{cenario.tipo}</p>
        </div>
      </div>
      <button
        onClick={onAlternar}
        className={`p-2 rounded-lg transition-colors ${
          ativo ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
        }`}
      >
        {ativo ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
      </button>
    </div>
    
    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
      {cenario.descricao}
    </p>
    
    <div className="flex items-center justify-between">
      <div className="text-xs text-gray-500">
        Inflação: {cenario.parametros.inflacao.inicial}% - {cenario.parametros.inflacao.final}%
      </div>
      <div className="flex space-x-2">
        <button
          onClick={onEditar}
          className="p-1 text-gray-400 hover:text-blue-600"
        >
          <Edit3 className="w-4 h-4" />
        </button>
        {cenario.tipo === 'personalizado' && (
          <button
            onClick={onRemover}
            className="p-1 text-gray-400 hover:text-red-600"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  </div>
);

const ResultadoCard: React.FC<any> = ({ resultado, cenario }) => (
  <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6">
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center">
        <span className="text-2xl mr-3">{cenario?.icone}</span>
        <div>
          <h4 className="font-semibold text-gray-900 dark:text-white">{cenario?.nome}</h4>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Risco: {resultado.riscos.nivel} ({resultado.riscos.pontuacao}%)
          </p>
        </div>
      </div>
      <div className="text-right">
        <p className="text-2xl font-bold text-gray-900 dark:text-white">
          {formatarMoeda(resultado.resultados.saldoFinal)}
        </p>
        <p className={`text-sm font-medium ${
          resultado.resultados.rentabilidadeTotal > 0 ? 'text-green-600' : 'text-red-600'
        }`}>
          {formatarPercentual(resultado.resultados.rentabilidadeTotal)}
        </p>
      </div>
    </div>
    
    <div className="grid grid-cols-3 gap-4 text-sm">
      <div>
        <p className="text-gray-600 dark:text-gray-400">Volatilidade</p>
        <p className="font-medium">{formatarPercentual(resultado.metricas.volatilidade)}</p>
      </div>
      <div>
        <p className="text-gray-600 dark:text-gray-400">Sharpe</p>
        <p className="font-medium">{resultado.metricas.sharpe.toFixed(2)}</p>
      </div>
      <div>
        <p className="text-gray-600 dark:text-gray-400">Max Drawdown</p>
        <p className="font-medium text-red-600">{formatarPercentual(resultado.metricas.maxDrawdown)}</p>
      </div>
    </div>
  </div>
);

const ComparacaoCard: React.FC<any> = ({ comparacao, cenarios }) => (
  <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6">
    <div className="flex items-center justify-between mb-4">
      <h4 className="font-semibold text-gray-900 dark:text-white">{comparacao.nome}</h4>
      <span className="text-sm text-gray-600 dark:text-gray-400">
        {comparacao.cenarios.length} cenários
      </span>
    </div>
    
    <div className="space-y-2 mb-4">
      {comparacao.cenarios.map((cenarioId: string) => {
        const cenario = cenarios.find((c: any) => c.id === cenarioId);
        return (
          <div key={cenarioId} className="flex items-center text-sm">
            <span className="mr-2">{cenario?.icone}</span>
            <span>{cenario?.nome}</span>
          </div>
        );
      })}
    </div>
    
    <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Recomendação:</p>
      <p className="text-sm font-medium">{comparacao.analiseComparativa.recomendacao}</p>
      <p className="text-xs text-gray-500 mt-2">
        Confiança: {comparacao.analiseComparativa.confianca}%
      </p>
    </div>
  </div>
);

const StressTestCard: React.FC<any> = ({ stressTest }) => (
  <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6">
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center">
        <Shield className="w-6 h-6 text-red-600 mr-3" />
        <div>
          <h4 className="font-semibold text-gray-900 dark:text-white">{stressTest.nome}</h4>
          <p className="text-sm text-gray-600 dark:text-gray-400">{stressTest.descricao}</p>
        </div>
      </div>
      <div className="text-right">
        <p className="text-lg font-bold text-red-600">
          -{formatarMoeda(stressTest.resultados.perdaMaxima)}
        </p>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Perda máxima
        </p>
      </div>
    </div>
    
    <div className="grid grid-cols-2 gap-4 text-sm">
      <div>
        <p className="text-gray-600 dark:text-gray-400">Tempo de Recuperação</p>
        <p className="font-medium">{stressTest.resultados.tempoRecuperacao} meses</p>
      </div>
      <div>
        <p className="text-gray-600 dark:text-gray-400">Prob. Sobrevivência</p>
        <p className="font-medium">{formatarPercentual(stressTest.resultados.probabilidadeSobrevivencia)}</p>
      </div>
    </div>
  </div>
);

const AlertaCard: React.FC<any> = ({ alerta, onMarcarVisualizado, onResolver }) => (
  <div className={`border-l-4 rounded-lg p-4 ${
    alerta.severidade === 'critica' ? 'border-red-500 bg-red-50 dark:bg-red-900/20' :
    alerta.severidade === 'alta' ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20' :
    alerta.severidade === 'media' ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20' :
    'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
  }`}>
    <div className="flex items-center justify-between">
      <div className="flex-1">
        <div className="flex items-center mb-2">
          {alerta.tipo === 'risco' && <AlertTriangle className="w-4 h-4 mr-2 text-red-600" />}
          {alerta.tipo === 'oportunidade' && <Lightbulb className="w-4 h-4 mr-2 text-green-600" />}
          {alerta.tipo === 'evento' && <Calendar className="w-4 h-4 mr-2 text-blue-600" />}
          {alerta.tipo === 'meta' && <Target className="w-4 h-4 mr-2 text-purple-600" />}
          <h4 className="font-semibold text-gray-900 dark:text-white">{alerta.titulo}</h4>
          {!alerta.visualizado && (
            <span className="ml-2 w-2 h-2 bg-blue-500 rounded-full"></span>
          )}
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{alerta.descricao}</p>
        <p className="text-xs font-medium text-gray-700 dark:text-gray-300">
          Ação recomendada: {alerta.acao}
        </p>
      </div>
      <div className="flex items-center space-x-2 ml-4">
        {!alerta.visualizado && (
          <button
            onClick={onMarcarVisualizado}
            className="p-2 text-gray-400 hover:text-blue-600"
            title="Marcar como visualizado"
          >
            <Eye className="w-4 h-4" />
          </button>
        )}
        {!alerta.resolvido && (
          <button
            onClick={onResolver}
            className="p-2 text-gray-400 hover:text-green-600"
            title="Resolver alerta"
          >
            <CheckCircle className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  </div>
);

// Modais (implementações simplificadas)
const ModalNovoCenario: React.FC<any> = ({ onClose, onSalvar }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    onClick={onClose}
  >
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.9, opacity: 0 }}
      className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-2xl mx-4"
      onClick={(e) => e.stopPropagation()}
    >
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Criar Novo Cenário
      </h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Nome do Cenário
          </label>
          <input
            type="text"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg"
            placeholder="Ex: Cenário de Crise"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Descrição
          </label>
          <textarea
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg"
            rows={3}
            placeholder="Descreva as características deste cenário..."
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Inflação Inicial (%)
            </label>
            <input
              type="number"
              step="0.1"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Inflação Final (%)
            </label>
            <input
              type="number"
              step="0.1"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg"
            />
          </div>
        </div>
      </div>
      
      <div className="flex justify-end space-x-3 mt-6">
        <AnimatedButton onClick={onClose} variant="outline">
          Cancelar
        </AnimatedButton>
        <AnimatedButton
          onClick={() => {
            // Implementar lógica de salvamento
            onSalvar({
              nome: 'Novo Cenário',
              descricao: 'Cenário personalizado',
              tipo: 'personalizado',
              parametros: {
                inflacao: { inicial: 4, final: 6, variacao: 'linear' },
                taxaJuros: { inicial: 10, final: 12, variacao: 'linear' },
                crescimentoEconomico: { pib: 1, emprego: 0, renda: 1.5 },
                volatilidade: { mercado: 25, cambio: 15, commodities: 20 },
                eventos: []
              },
              cor: '#8B5CF6',
              icone: '⚙️',
              ativo: true
            });
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          Criar Cenário
        </AnimatedButton>
      </div>
    </motion.div>
  </motion.div>
);

const ModalEditarCenario: React.FC<any> = ({ cenario, onClose, onSalvar }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    onClick={onClose}
  >
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.9, opacity: 0 }}
      className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-2xl mx-4"
      onClick={(e) => e.stopPropagation()}
    >
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Editar Cenário: {cenario.nome}
      </h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Nome do Cenário
          </label>
          <input
            type="text"
            defaultValue={cenario.nome}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Descrição
          </label>
          <textarea
            defaultValue={cenario.descricao}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg"
            rows={3}
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Inflação Inicial (%)
            </label>
            <input
              type="number"
              step="0.1"
              defaultValue={cenario.parametros.inflacao.inicial}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Inflação Final (%)
            </label>
            <input
              type="number"
              step="0.1"
              defaultValue={cenario.parametros.inflacao.final}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg"
            />
          </div>
        </div>
      </div>
      
      <div className="flex justify-end space-x-3 mt-6">
        <AnimatedButton onClick={onClose} variant="outline">
          Cancelar
        </AnimatedButton>
        <AnimatedButton
          onClick={() => {
            onSalvar({
              nome: cenario.nome,
              descricao: cenario.descricao
            });
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          Salvar Alterações
        </AnimatedButton>
      </div>
    </motion.div>
  </motion.div>
);

export default SimuladorCenarios;