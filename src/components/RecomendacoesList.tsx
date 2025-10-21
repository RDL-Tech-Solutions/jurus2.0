import React from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  ThumbsUp,
  ThumbsDown,
  Star,
  Clock,
  Target,
  DollarSign,
  PieChart,
  BarChart3,
  Lightbulb,
  Zap,
  Shield,
  Activity
} from 'lucide-react';
import { formatarMoeda, formatarPercentual } from '../utils/formatters';

interface RecomendacoesListProps {
  recomendacoes: any[];
  modoVisualizacao: 'cards' | 'lista' | 'timeline';
  onAceitar: (id: string) => void;
  onRejeitar: (id: string) => void;
  confiancaMinima: number;
}

const RecomendacoesList: React.FC<RecomendacoesListProps> = ({
  recomendacoes,
  modoVisualizacao,
  onAceitar,
  onRejeitar,
  confiancaMinima
}) => {
  const recomendacoesFiltradas = recomendacoes.filter(r => r.confianca >= confiancaMinima);

  const getIconePorTipo = (tipo: string) => {
    switch (tipo) {
      case 'investimento': return DollarSign;
      case 'rebalanceamento': return PieChart;
      case 'diversificacao': return BarChart3;
      case 'alerta': return AlertTriangle;
      default: return Lightbulb;
    }
  };

  const getCorPorUrgencia = (urgencia: string) => {
    switch (urgencia) {
      case 'alta': return 'border-red-500 bg-red-50 dark:bg-red-900/20';
      case 'media': return 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20';
      case 'baixa': return 'border-green-500 bg-green-50 dark:bg-green-900/20';
      default: return 'border-blue-500 bg-blue-50 dark:bg-blue-900/20';
    }
  };

  if (recomendacoesFiltradas.length === 0) {
    return (
      <div className="bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-8 text-center">
        <Lightbulb className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Nenhuma recomendação disponível
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          Ajuste os filtros ou atualize as recomendações para ver sugestões personalizadas.
        </p>
      </div>
    );
  }

  if (modoVisualizacao === 'cards') {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {recomendacoesFiltradas.map((recomendacao, index) => (
          <RecomendacaoCard
            key={recomendacao.id}
            recomendacao={recomendacao}
            onAceitar={() => onAceitar(recomendacao.id)}
            onRejeitar={() => onRejeitar(recomendacao.id)}
            index={index}
          />
        ))}
      </div>
    );
  }

  if (modoVisualizacao === 'lista') {
    return (
      <div className="space-y-3">
        {recomendacoesFiltradas.map((recomendacao, index) => (
          <RecomendacaoLista
            key={recomendacao.id}
            recomendacao={recomendacao}
            onAceitar={() => onAceitar(recomendacao.id)}
            onRejeitar={() => onRejeitar(recomendacao.id)}
            index={index}
          />
        ))}
      </div>
    );
  }

  if (modoVisualizacao === 'timeline') {
    return (
      <div className="relative">
        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-600"></div>
        <div className="space-y-6">
          {recomendacoesFiltradas.map((recomendacao, index) => (
            <RecomendacaoTimeline
              key={recomendacao.id}
              recomendacao={recomendacao}
              onAceitar={() => onAceitar(recomendacao.id)}
              onRejeitar={() => onRejeitar(recomendacao.id)}
              index={index}
            />
          ))}
        </div>
      </div>
    );
  }

  return null;
};

const RecomendacaoCard: React.FC<{
  recomendacao: any;
  onAceitar: () => void;
  onRejeitar: () => void;
  index: number;
}> = ({ recomendacao, onAceitar, onRejeitar, index }) => {
  const Icone = getIconePorTipo(recomendacao.tipo);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className={`rounded-xl p-6 border-l-4 ${getCorPorUrgencia(recomendacao.urgencia)} hover:shadow-lg transition-all duration-200`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center">
          <div className={`p-2 rounded-lg ${
            recomendacao.urgencia === 'alta' ? 'bg-red-100 dark:bg-red-800' :
            recomendacao.urgencia === 'media' ? 'bg-yellow-100 dark:bg-yellow-800' :
            'bg-green-100 dark:bg-green-800'
          }`}>
            <Icone className={`w-5 h-5 ${
              recomendacao.urgencia === 'alta' ? 'text-red-600 dark:text-red-200' :
              recomendacao.urgencia === 'media' ? 'text-yellow-600 dark:text-yellow-200' :
              'text-green-600 dark:text-green-200'
            }`} />
          </div>
          <div className="ml-3">
            <span className={`text-xs px-2 py-1 rounded-full font-medium ${
              recomendacao.urgencia === 'alta' ? 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100' :
              recomendacao.urgencia === 'media' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100' :
              'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100'
            }`}>
              {recomendacao.urgencia.toUpperCase()}
            </span>
          </div>
        </div>
        <div className="flex items-center">
          <Star className="w-4 h-4 text-yellow-500 mr-1" />
          <span className="text-sm font-medium">{recomendacao.confianca}%</span>
        </div>
      </div>

      <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
        {recomendacao.titulo}
      </h3>
      
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
        {recomendacao.descricao}
      </p>

      {recomendacao.impactoFinanceiro && (
        <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Impacto Estimado:</span>
            <span className={`font-medium ${
              recomendacao.impactoFinanceiro > 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {recomendacao.impactoFinanceiro > 0 ? '+' : ''}
              {formatarMoeda(recomendacao.impactoFinanceiro)}
            </span>
          </div>
          {recomendacao.retornoEsperado && (
            <div className="flex items-center justify-between text-sm mt-1">
              <span className="text-gray-600 dark:text-gray-400">Retorno Esperado:</span>
              <span className="font-medium text-blue-600">
                {formatarPercentual(recomendacao.retornoEsperado)}
              </span>
            </div>
          )}
        </div>
      )}

      <div className="flex items-center justify-between">
        <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
          <Clock className="w-3 h-3 mr-1" />
          {new Date(recomendacao.dataGeracao).toLocaleDateString()}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onRejeitar}
            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
            title="Rejeitar recomendação"
          >
            <ThumbsDown className="w-4 h-4" />
          </button>
          <button
            onClick={onAceitar}
            className="p-2 text-gray-400 hover:text-green-500 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors"
            title="Aceitar recomendação"
          >
            <ThumbsUp className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

const RecomendacaoLista: React.FC<{
  recomendacao: any;
  onAceitar: () => void;
  onRejeitar: () => void;
  index: number;
}> = ({ recomendacao, onAceitar, onRejeitar, index }) => {
  const Icone = getIconePorTipo(recomendacao.tipo);
  
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      className={`flex items-center p-4 rounded-lg border-l-4 ${getCorPorUrgencia(recomendacao.urgencia)} hover:shadow-md transition-all duration-200`}
    >
      <div className={`p-2 rounded-lg mr-4 ${
        recomendacao.urgencia === 'alta' ? 'bg-red-100 dark:bg-red-800' :
        recomendacao.urgencia === 'media' ? 'bg-yellow-100 dark:bg-yellow-800' :
        'bg-green-100 dark:bg-green-800'
      }`}>
        <Icone className={`w-5 h-5 ${
          recomendacao.urgencia === 'alta' ? 'text-red-600 dark:text-red-200' :
          recomendacao.urgencia === 'media' ? 'text-yellow-600 dark:text-yellow-200' :
          'text-green-600 dark:text-green-200'
        }`} />
      </div>

      <div className="flex-1">
        <div className="flex items-center justify-between mb-1">
          <h3 className="font-semibold text-gray-900 dark:text-white">
            {recomendacao.titulo}
          </h3>
          <div className="flex items-center">
            <Star className="w-4 h-4 text-yellow-500 mr-1" />
            <span className="text-sm font-medium">{recomendacao.confianca}%</span>
          </div>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
          {recomendacao.descricao}
        </p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
            <span className={`px-2 py-1 rounded-full ${
              recomendacao.urgencia === 'alta' ? 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100' :
              recomendacao.urgencia === 'media' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100' :
              'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100'
            }`}>
              {recomendacao.tipo}
            </span>
            <span className="flex items-center">
              <Clock className="w-3 h-3 mr-1" />
              {new Date(recomendacao.dataGeracao).toLocaleDateString()}
            </span>
            {recomendacao.impactoFinanceiro && (
              <span className={`font-medium ${
                recomendacao.impactoFinanceiro > 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {recomendacao.impactoFinanceiro > 0 ? '+' : ''}
                {formatarMoeda(recomendacao.impactoFinanceiro)}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onRejeitar}
              className="p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
            >
              <ThumbsDown className="w-4 h-4" />
            </button>
            <button
              onClick={onAceitar}
              className="p-1 text-gray-400 hover:text-green-500 hover:bg-green-50 dark:hover:bg-green-900/20 rounded transition-colors"
            >
              <ThumbsUp className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const RecomendacaoTimeline: React.FC<{
  recomendacao: any;
  onAceitar: () => void;
  onRejeitar: () => void;
  index: number;
}> = ({ recomendacao, onAceitar, onRejeitar, index }) => {
  const Icone = getIconePorTipo(recomendacao.tipo);
  
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      className="relative pl-10"
    >
      <div className={`absolute left-0 w-8 h-8 rounded-full border-4 border-white dark:border-gray-800 flex items-center justify-center ${
        recomendacao.urgencia === 'alta' ? 'bg-red-500' :
        recomendacao.urgencia === 'media' ? 'bg-yellow-500' :
        'bg-green-500'
      }`}>
        <Icone className="w-4 h-4 text-white" />
      </div>
      
      <div className={`rounded-lg p-4 border-l-4 ${getCorPorUrgencia(recomendacao.urgencia)}`}>
        <div className="flex items-start justify-between mb-2">
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">
              {recomendacao.titulo}
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <span className={`text-xs px-2 py-1 rounded-full ${
                recomendacao.urgencia === 'alta' ? 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100' :
                recomendacao.urgencia === 'media' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100' :
                'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100'
              }`}>
                {recomendacao.tipo}
              </span>
              <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                <Clock className="w-3 h-3 mr-1" />
                {new Date(recomendacao.dataGeracao).toLocaleDateString()}
              </div>
            </div>
          </div>
          <div className="flex items-center">
            <Star className="w-4 h-4 text-yellow-500 mr-1" />
            <span className="text-sm font-medium">{recomendacao.confianca}%</span>
          </div>
        </div>
        
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
          {recomendacao.descricao}
        </p>

        {recomendacao.impactoFinanceiro && (
          <div className="mb-3 p-2 bg-gray-50 dark:bg-gray-700 rounded text-sm">
            <span className="text-gray-600 dark:text-gray-400">Impacto: </span>
            <span className={`font-medium ${
              recomendacao.impactoFinanceiro > 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {recomendacao.impactoFinanceiro > 0 ? '+' : ''}
              {formatarMoeda(recomendacao.impactoFinanceiro)}
            </span>
          </div>
        )}

        <div className="flex items-center justify-end gap-2">
          <button
            onClick={onRejeitar}
            className="flex items-center px-3 py-1 text-sm text-gray-600 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
          >
            <ThumbsDown className="w-4 h-4 mr-1" />
            Rejeitar
          </button>
          <button
            onClick={onAceitar}
            className="flex items-center px-3 py-1 text-sm text-gray-600 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded transition-colors"
          >
            <ThumbsUp className="w-4 h-4 mr-1" />
            Aceitar
          </button>
        </div>
      </div>
    </motion.div>
  );
};

// Função auxiliar para obter ícone por tipo
function getIconePorTipo(tipo: string) {
  switch (tipo) {
    case 'investimento': return DollarSign;
    case 'rebalanceamento': return PieChart;
    case 'diversificacao': return BarChart3;
    case 'alerta': return AlertTriangle;
    default: return Lightbulb;
  }
}

// Função auxiliar para obter cor por urgência
function getCorPorUrgencia(urgencia: string) {
  switch (urgencia) {
    case 'alta': return 'border-red-500 bg-red-50 dark:bg-red-900/20';
    case 'media': return 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20';
    case 'baixa': return 'border-green-500 bg-green-50 dark:bg-green-900/20';
    default: return 'border-blue-500 bg-blue-50 dark:bg-blue-900/20';
  }
}

export default RecomendacoesList;