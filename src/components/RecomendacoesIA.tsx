import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Brain, 
  TrendingUp, 
  Shield, 
  DollarSign, 
  AlertTriangle,
  CheckCircle,
  Settings,
  BarChart3,
  Target,
  Clock,
  Zap,
  User,
  PieChart
} from 'lucide-react';
import { useRecomendacoesIA, PerfilInvestidor, RecomendacaoInvestimento, AlertaRebalanceamento } from '../hooks/useRecomendacoesIA';

interface RecomendacoesIAProps {
  simulacao: any;
}

const PerfilInvestidorForm: React.FC<{
  perfil: PerfilInvestidor | null;
  onSalvar: (perfil: PerfilInvestidor) => void;
  onCancelar: () => void;
}> = ({ perfil, onSalvar, onCancelar }) => {
  const [formData, setFormData] = useState<PerfilInvestidor>(perfil || {
    idade: 30,
    rendaMensal: 5000,
    objetivos: ['aposentadoria'],
    toleranciaRisco: 'moderado',
    prazoInvestimento: 10,
    experiencia: 'intermediario',
    situacaoFinanceira: 'estavel'
  });

  const objetivosDisponiveis = [
    'aposentadoria',
    'casa_propria',
    'educacao_filhos',
    'viagem',
    'reserva_emergencia',
    'renda_passiva',
    'crescimento_patrimonio'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSalvar(formData);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg"
    >
      <div className="flex items-center gap-3 mb-6">
        <User className="w-6 h-6 text-blue-600" />
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
          Perfil do Investidor
        </h3>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Idade
            </label>
            <input
              type="number"
              value={formData.idade}
              onChange={(e) => setFormData(prev => ({ ...prev, idade: Number(e.target.value) }))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              min="18"
              max="100"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Renda Mensal (R$)
            </label>
            <input
              type="number"
              value={formData.rendaMensal}
              onChange={(e) => setFormData(prev => ({ ...prev, rendaMensal: Number(e.target.value) }))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              min="0"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Tolerância ao Risco
            </label>
            <select
              value={formData.toleranciaRisco}
              onChange={(e) => setFormData(prev => ({ ...prev, toleranciaRisco: e.target.value as any }))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="conservador">Conservador</option>
              <option value="moderado">Moderado</option>
              <option value="agressivo">Agressivo</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Prazo de Investimento (anos)
            </label>
            <input
              type="number"
              value={formData.prazoInvestimento}
              onChange={(e) => setFormData(prev => ({ ...prev, prazoInvestimento: Number(e.target.value) }))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              min="1"
              max="50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Experiência
            </label>
            <select
              value={formData.experiencia}
              onChange={(e) => setFormData(prev => ({ ...prev, experiencia: e.target.value as any }))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="iniciante">Iniciante</option>
              <option value="intermediario">Intermediário</option>
              <option value="avancado">Avançado</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Situação Financeira
            </label>
            <select
              value={formData.situacaoFinanceira}
              onChange={(e) => setFormData(prev => ({ ...prev, situacaoFinanceira: e.target.value as any }))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="estavel">Estável</option>
              <option value="crescimento">Em Crescimento</option>
              <option value="aposentadoria">Aposentadoria</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Objetivos de Investimento
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {objetivosDisponiveis.map(objetivo => (
              <label key={objetivo} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.objetivos.includes(objetivo)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setFormData(prev => ({ 
                        ...prev, 
                        objetivos: [...prev.objetivos, objetivo] 
                      }));
                    } else {
                      setFormData(prev => ({ 
                        ...prev, 
                        objetivos: prev.objetivos.filter(obj => obj !== objetivo) 
                      }));
                    }
                  }}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300 capitalize">
                  {objetivo.replace('_', ' ')}
                </span>
              </label>
            ))}
          </div>
        </div>

        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Salvar Perfil
          </button>
          <button
            type="button"
            onClick={onCancelar}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            Cancelar
          </button>
        </div>
      </form>
    </motion.div>
  );
};

const RecomendacaoCard: React.FC<{ recomendacao: RecomendacaoInvestimento }> = ({ recomendacao }) => {
  const [expanded, setExpanded] = useState(false);

  const getRiscoColor = (risco: string) => {
    switch (risco) {
      case 'baixo': return 'text-green-600 bg-green-100 dark:bg-green-900/20';
      case 'medio': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20';
      case 'alto': return 'text-red-600 bg-red-100 dark:bg-red-900/20';
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-900/20';
    }
  };

  const getTipoIcon = (tipo: string) => {
    switch (tipo) {
      case 'renda_fixa': return <Shield className="w-5 h-5" />;
      case 'renda_variavel': return <TrendingUp className="w-5 h-5" />;
      case 'fundos': return <BarChart3 className="w-5 h-5" />;
      case 'imoveis': return <Target className="w-5 h-5" />;
      default: return <DollarSign className="w-5 h-5" />;
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg text-blue-600">
            {getTipoIcon(recomendacao.tipo)}
          </div>
          <div>
            <h3 className="font-bold text-gray-900 dark:text-white">
              {recomendacao.nome}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {recomendacao.tipo.replace('_', ' ').toUpperCase()}
            </p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-blue-600">
            {recomendacao.percentualSugerido.toFixed(1)}%
          </div>
          <div className="text-sm text-gray-500">da carteira</div>
        </div>
      </div>

      <p className="text-gray-700 dark:text-gray-300 mb-4">
        {recomendacao.descricao}
      </p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <div className="text-center">
          <div className="text-lg font-bold text-green-600">
            {recomendacao.rentabilidadeEsperada.toFixed(1)}%
          </div>
          <div className="text-xs text-gray-500">Rentabilidade</div>
        </div>
        <div className="text-center">
          <div className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getRiscoColor(recomendacao.risco)}`}>
            {recomendacao.risco}
          </div>
          <div className="text-xs text-gray-500 mt-1">Risco</div>
        </div>
        <div className="text-center">
          <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {recomendacao.liquidez}
          </div>
          <div className="text-xs text-gray-500">Liquidez</div>
        </div>
        <div className="text-center">
          <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
            R$ {recomendacao.valorMinimo}
          </div>
          <div className="text-xs text-gray-500">Mín. inicial</div>
        </div>
      </div>

      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 mb-4">
        <div className="flex items-start gap-2">
          <Brain className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-blue-800 dark:text-blue-200">
            <strong>IA Recomenda:</strong> {recomendacao.motivo}
          </p>
        </div>
      </div>

      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors"
      >
        {expanded ? 'Ver menos' : 'Ver detalhes'}
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700"
          >
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium text-green-600 mb-2">Vantagens</h4>
                <ul className="space-y-1">
                  {recomendacao.vantagens.map((vantagem, index) => (
                    <li key={index} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <CheckCircle className="w-3 h-3 text-green-500 flex-shrink-0" />
                      {vantagem}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-red-600 mb-2">Desvantagens</h4>
                <ul className="space-y-1">
                  {recomendacao.desvantagens.map((desvantagem, index) => (
                    <li key={index} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <AlertTriangle className="w-3 h-3 text-red-500 flex-shrink-0" />
                      {desvantagem}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <Clock className="w-4 h-4 text-gray-500" />
                <span className="font-medium text-gray-700 dark:text-gray-300">Prazo Recomendado</span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">{recomendacao.prazoRecomendado}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const AlertaCard: React.FC<{ 
  alerta: AlertaRebalanceamento; 
  onMarcarLido: (id: string) => void;
}> = ({ alerta, onMarcarLido }) => {
  const getUrgenciaColor = (urgencia: string) => {
    switch (urgencia) {
      case 'alta': return 'border-red-500 bg-red-50 dark:bg-red-900/20';
      case 'media': return 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20';
      case 'baixa': return 'border-blue-500 bg-blue-50 dark:bg-blue-900/20';
      default: return 'border-gray-500 bg-gray-50 dark:bg-gray-900/20';
    }
  };

  const getUrgenciaIcon = (urgencia: string) => {
    switch (urgencia) {
      case 'alta': return <AlertTriangle className="w-5 h-5 text-red-600" />;
      case 'media': return <Zap className="w-5 h-5 text-yellow-600" />;
      case 'baixa': return <Target className="w-5 h-5 text-blue-600" />;
      default: return <AlertTriangle className="w-5 h-5 text-gray-600" />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className={`border-l-4 rounded-lg p-4 ${getUrgenciaColor(alerta.urgencia)}`}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          {getUrgenciaIcon(alerta.urgencia)}
          <div>
            <h4 className="font-medium text-gray-900 dark:text-white">
              {alerta.titulo}
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {alerta.descricao}
            </p>
            <div className="mt-2 p-2 bg-white dark:bg-gray-800 rounded border">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Ação sugerida: {alerta.acaoSugerida}
              </p>
            </div>
            <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
              <span>Impacto: +{alerta.impactoEstimado.toFixed(1)}%</span>
              <span>Urgência: {alerta.urgencia}</span>
            </div>
          </div>
        </div>
        <button
          onClick={() => onMarcarLido(alerta.id)}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <CheckCircle className="w-5 h-5" />
        </button>
      </div>
    </motion.div>
  );
};

export default function RecomendacoesIA({ simulacao }: RecomendacoesIAProps) {
  const {
    perfil,
    recomendacoes,
    alertas,
    otimizacao,
    isLoading,
    atualizarPerfil,
    gerarRecomendacoes,
    verificarRebalanceamento,
    otimizarCarteira,
    marcarAlertaComoLido
  } = useRecomendacoesIA();

  const [showPerfilForm, setShowPerfilForm] = useState(!perfil);
  const [activeTab, setActiveTab] = useState<'recomendacoes' | 'alertas' | 'otimizacao'>('recomendacoes');

  const handleSalvarPerfil = (novoPerfil: PerfilInvestidor) => {
    atualizarPerfil(novoPerfil);
    setShowPerfilForm(false);
  };

  const tabs = [
    { id: 'recomendacoes', label: 'Recomendações', icon: Brain, count: recomendacoes.length },
    { id: 'alertas', label: 'Alertas', icon: AlertTriangle, count: alertas.length },
    { id: 'otimizacao', label: 'Otimização', icon: PieChart, count: otimizacao ? 1 : 0 }
  ];

  if (showPerfilForm) {
    return (
      <div className="max-w-4xl mx-auto">
        <PerfilInvestidorForm
          perfil={perfil}
          onSalvar={handleSalvarPerfil}
          onCancelar={() => setShowPerfilForm(false)}
        />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">Sistema de Recomendações IA</h2>
            <p className="opacity-90">
              Análise inteligente baseada no seu perfil de investidor
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setShowPerfilForm(true)}
              className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
            >
              <Settings className="w-4 h-4" />
              Editar Perfil
            </button>
            <button
              onClick={gerarRecomendacoes}
              disabled={isLoading}
              className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              <Brain className="w-4 h-4" />
              {isLoading ? 'Analisando...' : 'Atualizar'}
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center gap-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
                {tab.count > 0 && (
                  <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs px-2 py-0.5 rounded-full">
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        {activeTab === 'recomendacoes' && (
          <motion.div
            key="recomendacoes"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {isLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
                <p className="text-gray-600 dark:text-gray-400">Analisando seu perfil...</p>
              </div>
            ) : recomendacoes.length > 0 ? (
              <div className="grid gap-6">
                {recomendacoes.map((recomendacao) => (
                  <RecomendacaoCard key={recomendacao.id} recomendacao={recomendacao} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Brain className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-400">
                  Configure seu perfil para receber recomendações personalizadas
                </p>
              </div>
            )}
          </motion.div>
        )}

        {activeTab === 'alertas' && (
          <motion.div
            key="alertas"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-4"
          >
            {alertas.length > 0 ? (
              alertas.map((alerta) => (
                <AlertaCard
                  key={alerta.id}
                  alerta={alerta}
                  onMarcarLido={marcarAlertaComoLido}
                />
              ))
            ) : (
              <div className="text-center py-12">
                <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-400">
                  Nenhum alerta no momento. Sua carteira está bem balanceada!
                </p>
              </div>
            )}
          </motion.div>
        )}

        {activeTab === 'otimizacao' && (
          <motion.div
            key="otimizacao"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Otimização de Carteira
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Simule diferentes cenários de alocação baseados na sua simulação atual
              </p>
              <button
                onClick={() => otimizarCarteira({ renda_fixa: 60, renda_variavel: 30, imoveis: 10 })}
                disabled={isLoading}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors disabled:opacity-50"
              >
                {isLoading ? 'Otimizando...' : 'Otimizar Carteira'}
              </button>
            </div>

            {otimizacao && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg"
              >
                <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                  Resultado da Otimização
                </h4>
                
                <div className="grid md:grid-cols-3 gap-6 mb-6">
                  <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      +{otimizacao.beneficiosEsperados.aumentoRentabilidade.toFixed(1)}%
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Aumento de Rentabilidade</div>
                  </div>
                  <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">
                      -{otimizacao.beneficiosEsperados.reducaoRisco.toFixed(1)}%
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Redução de Risco</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">
                      {otimizacao.beneficiosEsperados.melhorDiversificacao ? '✓' : '✗'}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Melhor Diversificação</div>
                  </div>
                </div>

                <div>
                  <h5 className="font-medium text-gray-900 dark:text-white mb-3">Ações Recomendadas:</h5>
                  <ul className="space-y-2">
                    {otimizacao.acoes.map((acao, index) => (
                      <li key={index} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                        {acao}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}