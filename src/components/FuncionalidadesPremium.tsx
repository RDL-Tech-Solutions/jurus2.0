// Componente principal para Funcionalidades Premium

import React, { useState, useCallback, useMemo } from 'react';
import {
  Crown,
  FileText,
  TrendingUp,
  Database,
  Cloud,
  Settings,
  Download,
  Upload,
  Play,
  Pause,
  BarChart3,
  PieChart,
  LineChart,
  Activity,
  Shield,
  Zap,
  Star,
  AlertCircle,
  CheckCircle,
  Clock,
  Users,
  Target,
  Briefcase,
  Calendar,
  Filter,
  Search,
  RefreshCw,
  Eye,
  Edit,
  Trash2,
  Plus,
  Save,
  X,
  Info,
  Lightbulb,
  Award,
  Gauge
} from 'lucide-react';
import usePremium from '../hooks/usePremium';
import { TemplateRelatorio, ConfiguracaoMonteCarlo, ConfiguracaoAPI } from '../types/premium';

interface FuncionalidadesPremiumProps {
  className?: string;
}

const FuncionalidadesPremium: React.FC<FuncionalidadesPremiumProps> = ({ className = '' }) => {
  const {
    configuracao,
    licenca,
    templatesRelatorio,
    relatoriosGerados,
    configuracoesMonteCarlo,
    resultadosMonteCarlo,
    configuracoesAPI,
    dadosMercado,
    statusAPIs,
    statusBackup,
    logsBackup,
    gerarRelatorio,
    criarTemplate,
    executarMonteCarlo,
    obterCotacao,
    executarBackup,
    verificarLimites,
    obterEstatisticasUso,
    isLoading,
    error
  } = usePremium();

  const [abaSelecionada, setAbaSelecionada] = useState('dashboard');
  const [modalAberto, setModalAberto] = useState<string | null>(null);
  const [filtros, setFiltros] = useState({
    busca: '',
    tipo: 'todos',
    periodo: '30d'
  });

  // Dados do dashboard
  const estatisticasDashboard = useMemo(() => {
    if (!configuracao) return null;

    return {
      relatorios: {
        gerados: configuracao.uso.relatoriosGerados,
        limite: configuracao.limites.relatoriosMes,
        percentual: (configuracao.uso.relatoriosGerados / configuracao.limites.relatoriosMes) * 100
      },
      simulacoes: {
        realizadas: configuracao.uso.simulacoesRealizadas,
        limite: configuracao.limites.simulacoesMonteCarlo,
        percentual: (configuracao.uso.simulacoesRealizadas / configuracao.limites.simulacoesMonteCarlo) * 100
      },
      apis: {
        chamadas: configuracao.uso.chamadasAPI,
        limite: configuracao.limites.chamadasAPI,
        percentual: (configuracao.uso.chamadasAPI / configuracao.limites.chamadasAPI) * 100
      },
      backup: {
        usado: configuracao.uso.espacoUtilizado,
        limite: configuracao.limites.espacoBackup,
        percentual: (configuracao.uso.espacoUtilizado / configuracao.limites.espacoBackup) * 100
      }
    };
  }, [configuracao]);

  const abas = [
    { id: 'dashboard', label: 'Dashboard', icon: Gauge },
    { id: 'relatorios', label: 'Relatórios PDF', icon: FileText },
    { id: 'montecarlo', label: 'Monte Carlo', icon: TrendingUp },
    { id: 'apis', label: 'APIs Mercado', icon: Database },
    { id: 'backup', label: 'Backup Nuvem', icon: Cloud },
    { id: 'configuracoes', label: 'Configurações', icon: Settings }
  ];

  const handleGerarRelatorio = useCallback(async (templateId: string) => {
    try {
      const template = templatesRelatorio.find(t => t.id === templateId);
      if (!template) return;

      const dados = {
        titulo: 'Relatório de Investimentos',
        periodo: { inicio: new Date(), fim: new Date() },
        dados: {},
        configuracao: {},
        simulacao: {},
        resultado: {},
        metadados: {
          dataGeracao: new Date(),
          versao: '1.0.0',
          usuario: 'usuário',
          configuracoes: {}
        }
      };

      await gerarRelatorio(dados, template);
    } catch (err) {
      console.error('Erro ao gerar relatório:', err);
    }
  }, [templatesRelatorio, gerarRelatorio]);

  const handleExecutarMonteCarlo = useCallback(async () => {
    try {
      const config: ConfiguracaoMonteCarlo = {
        numeroSimulacoes: 10000,
        distribuicoes: [],
        correlacoes: { parametros: [], matriz: [] },
        cenarios: [],
        metricas: [],
        configuracaoAvancada: {
          metodoAmostragem: 'latin_hypercube',
          reducaoVariancia: false,
          controleAntitetico: false,
          estratificacao: false,
          paralelizacao: false,
          salvarTrajetorias: true,
          intervalosConfianca: [0.95, 0.99]
        }
      };

      await executarMonteCarlo(config, {});
    } catch (err) {
      console.error('Erro ao executar Monte Carlo:', err);
    }
  }, [executarMonteCarlo]);

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Status da Licença */}
      <div className="bg-gradient-to-r from-yellow-50 to-amber-50 border border-yellow-200 rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Crown className="h-8 w-8 text-yellow-600" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Plano Premium Ativo</h3>
              <p className="text-sm text-gray-600">
                Válido até {configuracao?.dataVencimento.toLocaleDateString('pt-BR')}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            <span className="text-sm font-medium text-green-700">Ativo</span>
          </div>
        </div>
      </div>

      {/* Estatísticas de Uso */}
      {estatisticasDashboard && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Relatórios PDF</p>
                <p className="text-2xl font-bold text-gray-900">
                  {estatisticasDashboard.relatorios.gerados}
                </p>
                <p className="text-xs text-gray-500">
                  de {estatisticasDashboard.relatorios.limite} mensais
                </p>
              </div>
              <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <div className="mt-4">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full"
                  style={{ width: `${Math.min(estatisticasDashboard.relatorios.percentual, 100)}%` }}
                />
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Monte Carlo</p>
                <p className="text-2xl font-bold text-gray-900">
                  {estatisticasDashboard.simulacoes.realizadas}
                </p>
                <p className="text-xs text-gray-500">
                  de {estatisticasDashboard.simulacoes.limite} mensais
                </p>
              </div>
              <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <div className="mt-4">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-600 h-2 rounded-full"
                  style={{ width: `${Math.min(estatisticasDashboard.simulacoes.percentual, 100)}%` }}
                />
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Chamadas API</p>
                <p className="text-2xl font-bold text-gray-900">
                  {estatisticasDashboard.apis.chamadas.toLocaleString()}
                </p>
                <p className="text-xs text-gray-500">
                  de {estatisticasDashboard.apis.limite.toLocaleString()} mensais
                </p>
              </div>
              <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Database className="h-6 w-6 text-purple-600" />
              </div>
            </div>
            <div className="mt-4">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-purple-600 h-2 rounded-full"
                  style={{ width: `${Math.min(estatisticasDashboard.apis.percentual, 100)}%` }}
                />
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Backup Nuvem</p>
                <p className="text-2xl font-bold text-gray-900">
                  {estatisticasDashboard.backup.usado.toFixed(1)} GB
                </p>
                <p className="text-xs text-gray-500">
                  de {estatisticasDashboard.backup.limite} GB
                </p>
              </div>
              <div className="h-12 w-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Cloud className="h-6 w-6 text-orange-600" />
              </div>
            </div>
            <div className="mt-4">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-orange-600 h-2 rounded-full"
                  style={{ width: `${Math.min(estatisticasDashboard.backup.percentual, 100)}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Ações Rápidas */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Ações Rápidas</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button
            onClick={() => setModalAberto('novo-relatorio')}
            className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <FileText className="h-6 w-6 text-blue-600" />
            <span className="font-medium text-gray-900">Novo Relatório</span>
          </button>

          <button
            onClick={handleExecutarMonteCarlo}
            disabled={!verificarLimites('montecarlo')}
            className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <TrendingUp className="h-6 w-6 text-green-600" />
            <span className="font-medium text-gray-900">Monte Carlo</span>
          </button>

          <button
            onClick={() => obterCotacao('PETR4')}
            disabled={!verificarLimites('api')}
            className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Database className="h-6 w-6 text-purple-600" />
            <span className="font-medium text-gray-900">Atualizar Dados</span>
          </button>

          <button
            onClick={executarBackup}
            className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Cloud className="h-6 w-6 text-orange-600" />
            <span className="font-medium text-gray-900">Backup Agora</span>
          </button>
        </div>
      </div>

      {/* Status dos Serviços */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Status dos Serviços</h3>
        <div className="space-y-3">
          {statusAPIs.map((status) => (
            <div key={status.provedor} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className={`h-3 w-3 rounded-full ${
                  status.status === 'online' ? 'bg-green-500' : 'bg-red-500'
                }`} />
                <span className="font-medium text-gray-900">{status.provedor}</span>
                <span className="text-sm text-gray-500">{status.latencia}ms</span>
              </div>
              <div className="text-sm text-gray-600">
                {status.limitesUso?.usado.toLocaleString()} / {status.limitesUso?.limite.toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderRelatorios = () => (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Relatórios PDF</h2>
          <p className="text-gray-600">Gere relatórios profissionais dos seus investimentos</p>
        </div>
        <button
          onClick={() => setModalAberto('novo-template')}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>Novo Template</span>
        </button>
      </div>

      {/* Templates Disponíveis */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Templates Disponíveis</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {templatesRelatorio.map((template) => (
            <div key={template.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium text-gray-900">{template.nome}</h4>
                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => setModalAberto(`editar-template-${template.id}`)}
                    className="p-1 text-gray-400 hover:text-gray-600"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button className="p-1 text-gray-400 hover:text-red-600">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-3">
                {template.layout} • {template.tamanho} • {template.secoes.length} seções
              </p>
              <button
                onClick={() => handleGerarRelatorio(template.id)}
                disabled={!verificarLimites('relatorios')}
                className="w-full px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Gerar Relatório
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Relatórios Gerados */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Relatórios Gerados</h3>
        <div className="space-y-3">
          {relatoriosGerados.map((relatorio) => (
            <div key={relatorio.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
              <div className="flex items-center space-x-3">
                <FileText className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="font-medium text-gray-900">{relatorio.nome}</p>
                  <p className="text-sm text-gray-500">
                    {relatorio.dataGeracao.toLocaleDateString('pt-BR')} • {(relatorio.tamanho / 1024 / 1024).toFixed(1)} MB
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 text-xs rounded-full ${
                  relatorio.status === 'concluido' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {relatorio.status === 'concluido' ? 'Concluído' : 'Processando'}
                </span>
                <button className="p-1 text-gray-400 hover:text-blue-600">
                  <Download className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderMonteCarlo = () => (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Análise Monte Carlo Avançada</h2>
          <p className="text-gray-600">Simulações estatísticas avançadas para análise de risco</p>
        </div>
        <button
          onClick={handleExecutarMonteCarlo}
          disabled={!verificarLimites('montecarlo') || isLoading}
          className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
          <span>Nova Simulação</span>
        </button>
      </div>

      {/* Configurações Rápidas */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Configuração Rápida</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Número de Simulações
            </label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500">
              <option value="1000">1.000 simulações</option>
              <option value="10000">10.000 simulações</option>
              <option value="100000">100.000 simulações</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Método de Amostragem
            </label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500">
              <option value="random">Aleatório</option>
              <option value="lhs">Latin Hypercube</option>
              <option value="sobol">Sequência Sobol</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Intervalo de Confiança
            </label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500">
              <option value="95">95%</option>
              <option value="99">99%</option>
              <option value="both">Ambos</option>
            </select>
          </div>
        </div>
      </div>

      {/* Resultados Recentes */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Resultados Recentes</h3>
        <div className="space-y-4">
          {resultadosMonteCarlo.map((resultado) => (
            <div key={resultado.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="font-medium text-gray-900">
                    Simulação {resultado.id.split('_')[1]}
                  </p>
                  <p className="text-sm text-gray-500">
                    {resultado.dataGeracao.toLocaleDateString('pt-BR')} • {resultado.tempoExecucao}ms
                  </p>
                </div>
                <button className="flex items-center space-x-2 px-3 py-1 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                  <Eye className="h-4 w-4" />
                  <span>Ver Detalhes</span>
                </button>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="text-gray-600">Média</p>
                  <p className="font-medium">R$ {resultado.estatisticas.media.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-gray-600">Desvio Padrão</p>
                  <p className="font-medium">R$ {resultado.estatisticas.desvio.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-gray-600">VaR 95%</p>
                  <p className="font-medium">R$ {resultado.analiseRisco.var95.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-gray-600">Risco</p>
                  <p className={`font-medium ${
                    resultado.analiseRisco.classificacaoRisco === 'conservador' ? 'text-green-600' :
                    resultado.analiseRisco.classificacaoRisco === 'moderado' ? 'text-yellow-600' :
                    'text-red-600'
                  }`}>
                    {resultado.analiseRisco.classificacaoRisco}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderAPIs = () => (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">APIs de Mercado</h2>
          <p className="text-gray-600">Integração com dados financeiros em tempo real</p>
        </div>
        <button
          onClick={() => setModalAberto('nova-api')}
          className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>Nova API</span>
        </button>
      </div>

      {/* Status das APIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statusAPIs.map((status) => (
          <div key={status.provedor} className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">{status.provedor}</h3>
              <div className={`h-3 w-3 rounded-full ${
                status.status === 'online' ? 'bg-green-500' : 'bg-red-500'
              }`} />
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Status</span>
                <span className={`text-sm font-medium ${
                  status.status === 'online' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {status.status === 'online' ? 'Online' : 'Offline'}
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Latência</span>
                <span className="text-sm font-medium">{status.latencia}ms</span>
              </div>
              
              {status.limitesUso && (
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-gray-600">Uso</span>
                    <span className="text-sm font-medium">
                      {status.limitesUso.usado.toLocaleString()} / {status.limitesUso.limite.toLocaleString()}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-purple-600 h-2 rounded-full"
                      style={{ 
                        width: `${Math.min((status.limitesUso.usado / status.limitesUso.limite) * 100, 100)}%` 
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Dados Recentes */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Dados Recentes</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-900">Símbolo</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Nome</th>
                <th className="text-right py-3 px-4 font-medium text-gray-900">Preço</th>
                <th className="text-right py-3 px-4 font-medium text-gray-900">Variação</th>
                <th className="text-right py-3 px-4 font-medium text-gray-900">Volume</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Atualização</th>
              </tr>
            </thead>
            <tbody>
              {dadosMercado.map((dado) => (
                <tr key={dado.simbolo} className="border-b border-gray-100">
                  <td className="py-3 px-4 font-medium text-gray-900">{dado.simbolo}</td>
                  <td className="py-3 px-4 text-gray-600">{dado.nome}</td>
                  <td className="py-3 px-4 text-right font-medium">
                    R$ {dado.preco.toFixed(2)}
                  </td>
                  <td className={`py-3 px-4 text-right font-medium ${
                    dado.variacao >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {dado.variacao >= 0 ? '+' : ''}{dado.variacaoPercentual.toFixed(2)}%
                  </td>
                  <td className="py-3 px-4 text-right text-gray-600">
                    {dado.volume.toLocaleString()}
                  </td>
                  <td className="py-3 px-4 text-gray-600">
                    {dado.timestamp.toLocaleTimeString('pt-BR')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderBackup = () => (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Backup na Nuvem</h2>
          <p className="text-gray-600">Mantenha seus dados seguros e sincronizados</p>
        </div>
        <button
          onClick={executarBackup}
          disabled={isLoading}
          className="flex items-center space-x-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
          <span>Backup Agora</span>
        </button>
      </div>

      {/* Status do Backup */}
      {statusBackup && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Status do Backup</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="h-12 w-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                <Clock className="h-6 w-6 text-orange-600" />
              </div>
              <p className="text-sm text-gray-600">Último Backup</p>
              <p className="font-medium text-gray-900">
                {statusBackup.ultimoBackup.toLocaleDateString('pt-BR')}
              </p>
            </div>

            <div className="text-center">
              <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                <Calendar className="h-6 w-6 text-blue-600" />
              </div>
              <p className="text-sm text-gray-600">Próximo Backup</p>
              <p className="font-medium text-gray-900">
                {statusBackup.proximoBackup.toLocaleDateString('pt-BR')}
              </p>
            </div>

            <div className="text-center">
              <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                <Shield className="h-6 w-6 text-green-600" />
              </div>
              <p className="text-sm text-gray-600">Itens Protegidos</p>
              <p className="font-medium text-gray-900">
                {statusBackup.itensBackup.toLocaleString()}
              </p>
            </div>

            <div className="text-center">
              <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                <Database className="h-6 w-6 text-purple-600" />
              </div>
              <p className="text-sm text-gray-600">Espaço Usado</p>
              <p className="font-medium text-gray-900">
                {(statusBackup.tamanhoTotal / (1024 * 1024 * 1024)).toFixed(1)} GB
              </p>
            </div>
          </div>

          <div className="mt-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">Espaço de Armazenamento</span>
              <span className="text-sm text-gray-500">
                {(statusBackup.estatisticas.espacoUsado / (1024 * 1024 * 1024)).toFixed(1)} GB de{' '}
                {((statusBackup.estatisticas.espacoUsado + statusBackup.estatisticas.espacoDisponivel) / (1024 * 1024 * 1024)).toFixed(1)} GB
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-orange-600 h-3 rounded-full"
                style={{
                  width: `${(statusBackup.estatisticas.espacoUsado / (statusBackup.estatisticas.espacoUsado + statusBackup.estatisticas.espacoDisponivel)) * 100}%`
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Logs de Backup */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Histórico de Backups</h3>
        <div className="space-y-3">
          {logsBackup.map((log) => (
            <div key={log.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className={`h-3 w-3 rounded-full ${
                  log.status === 'sucesso' ? 'bg-green-500' : 'bg-red-500'
                }`} />
                <div>
                  <p className="font-medium text-gray-900">
                    {log.operacao === 'backup' ? 'Backup' : 'Restauração'}
                  </p>
                  <p className="text-sm text-gray-500">{log.detalhes}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">
                  {log.timestamp.toLocaleDateString('pt-BR')}
                </p>
                <p className="text-xs text-gray-500">
                  {log.itensAfetados} itens • {log.duracao}ms
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderConteudo = () => {
    switch (abaSelecionada) {
      case 'dashboard':
        return renderDashboard();
      case 'relatorios':
        return renderRelatorios();
      case 'montecarlo':
        return renderMonteCarlo();
      case 'apis':
        return renderAPIs();
      case 'backup':
        return renderBackup();
      default:
        return renderDashboard();
    }
  };

  if (!configuracao) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Crown className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Funcionalidades Premium</h3>
          <p className="text-gray-600 mb-4">Upgrade para acessar recursos avançados</p>
          <button className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors">
            Fazer Upgrade
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Navegação */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {abas.map((aba) => {
            const Icon = aba.icon;
            return (
              <button
                key={aba.id}
                onClick={() => setAbaSelecionada(aba.id)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  abaSelecionada === aba.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span>{aba.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Conteúdo */}
      {renderConteudo()}

      {/* Indicador de Loading */}
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 flex items-center space-x-3">
            <RefreshCw className="h-6 w-6 text-blue-600 animate-spin" />
            <span className="text-gray-900">Processando...</span>
          </div>
        </div>
      )}

      {/* Mensagem de Erro */}
      {error && (
        <div className="fixed bottom-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
          <div className="flex items-center space-x-2">
            <AlertCircle className="h-5 w-5" />
            <span>{error}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default FuncionalidadesPremium;