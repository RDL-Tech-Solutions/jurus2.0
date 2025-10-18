import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, X, Check, Settings, Trash2, AlertCircle, Target, TrendingUp, Calendar } from 'lucide-react';
import { useNotificacoes, Notificacao } from '../hooks/useNotificacoes';
import { AnimatedButton } from './AnimatedButton';
import { AnimatedModal } from './AnimatedModal';

const iconesPorTipo = {
  meta: Target,
  oportunidade: TrendingUp,
  lembrete: Calendar,
  alerta: AlertCircle
};

const coresPorTipo = {
  meta: 'text-blue-600',
  oportunidade: 'text-green-600',
  lembrete: 'text-yellow-600',
  alerta: 'text-red-600'
};

const coresPorPrioridade = {
  baixa: 'border-l-gray-400',
  media: 'border-l-yellow-400',
  alta: 'border-l-red-400'
};

interface NotificacaoItemProps {
  notificacao: Notificacao;
  onMarcarLida: (id: string) => void;
  onRemover: (id: string) => void;
}

const NotificacaoItem: React.FC<NotificacaoItemProps> = ({ 
  notificacao, 
  onMarcarLida, 
  onRemover 
}) => {
  const IconeComponente = iconesPorTipo[notificacao.tipo];
  const corTipo = coresPorTipo[notificacao.tipo];
  const corPrioridade = coresPorPrioridade[notificacao.prioridade];

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className={`p-4 bg-white dark:bg-gray-800 rounded-lg border-l-4 ${corPrioridade} shadow-sm hover:shadow-md transition-shadow ${
        !notificacao.lida ? 'bg-blue-50 dark:bg-blue-900/20' : ''
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3 flex-1">
          <IconeComponente className={`w-5 h-5 mt-0.5 ${corTipo}`} />
          <div className="flex-1">
            <h4 className={`font-medium text-gray-900 dark:text-white ${
              !notificacao.lida ? 'font-semibold' : ''
            }`}>
              {notificacao.titulo}
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
              {notificacao.mensagem}
            </p>
            <div className="flex items-center justify-between mt-2">
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {new Date(notificacao.timestamp).toLocaleString('pt-BR')}
              </span>
              {notificacao.acao && (
                <button
                  onClick={notificacao.acao.callback}
                  className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-2 py-1 rounded hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
                >
                  {notificacao.acao.texto}
                </button>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2 ml-2">
          {!notificacao.lida && (
            <button
              onClick={() => onMarcarLida(notificacao.id)}
              className="p-1 text-gray-400 hover:text-green-600 transition-colors"
              title="Marcar como lida"
            >
              <Check className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={() => onRemover(notificacao.id)}
            className="p-1 text-gray-400 hover:text-red-600 transition-colors"
            title="Remover notificação"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

interface ConfiguracoesNotificacoesProps {
  isOpen: boolean;
  onClose: () => void;
}

const ConfiguracoesNotificacoes: React.FC<ConfiguracoesNotificacoesProps> = ({ 
  isOpen, 
  onClose 
}) => {
  const { preferencias, atualizarPreferencias } = useNotificacoes();

  const handleConfigChange = (key: keyof typeof preferencias, value: any) => {
    atualizarPreferencias({ [key]: value });
  };

  return (
    <AnimatedModal isOpen={isOpen} onClose={onClose} title="Configurações de Notificações">
      <div className="space-y-6">
        <div className="space-y-4">
          <h3 className="font-medium text-gray-900 dark:text-white">Tipos de Notificação</h3>
          
          <label className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={preferencias.metas}
              onChange={(e) => handleConfigChange('metas', e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">
              Alertas de metas próximas
            </span>
          </label>

          <label className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={preferencias.oportunidades}
              onChange={(e) => handleConfigChange('oportunidades', e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">
              Oportunidades de mercado
            </span>
          </label>

          <label className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={preferencias.aportes}
              onChange={(e) => handleConfigChange('aportes', e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">
              Lembretes de aportes
            </span>
          </label>

          <label className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={preferencias.alertas}
              onChange={(e) => handleConfigChange('alertas', e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">
              Alertas de performance
            </span>
          </label>

          <label className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={preferencias.som}
              onChange={(e) => handleConfigChange('som', e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">
              Sons de notificação
            </span>
          </label>

          <label className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={preferencias.desktop}
              onChange={(e) => handleConfigChange('desktop', e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">
              Notificações desktop
            </span>
          </label>
        </div>

        <div className="space-y-4">
          <h3 className="font-medium text-gray-900 dark:text-white">Frequência dos Lembretes</h3>
          
          <select
            value={preferencias.frequenciaAportes}
            onChange={(e) => handleConfigChange('frequenciaAportes', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="diaria">Diário</option>
            <option value="semanal">Semanal</option>
            <option value="mensal">Mensal</option>
          </select>
        </div>

        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-600">
          <AnimatedButton
            variant="secondary"
            onClick={onClose}
          >
            Fechar
          </AnimatedButton>
        </div>
      </div>
    </AnimatedModal>
  );
};

export const CentroNotificacoes: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showConfiguracoes, setShowConfiguracoes] = useState(false);
  const [filtroTipo, setFiltroTipo] = useState<string>('todas');
  
  const {
    notificacoes,
    naoLidas,
    marcarComoLida,
    marcarTodasComoLidas,
    removerNotificacao,
    limparNotificacoes
  } = useNotificacoes();

  const notificacoesFiltradas = filtroTipo === 'todas' 
    ? notificacoes 
    : notificacoes.filter(n => n.tipo === filtroTipo);

  const notificacoesNaoLidas = notificacoesFiltradas.filter(n => !n.lida);
  const notificacoesLidas = notificacoesFiltradas.filter(n => n.lida);

  return (
    <>
      {/* Botão de Notificações */}
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="relative p-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
        >
          <Bell className="w-6 h-6" />
          {naoLidas > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {naoLidas > 9 ? '9+' : naoLidas}
            </span>
          )}
        </button>

        {/* Dropdown de Notificações */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              className="absolute right-0 mt-2 w-96 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-50"
            >
              {/* Header */}
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    Notificações
                  </h3>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setShowConfiguracoes(true)}
                      className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                      title="Configurações"
                    >
                      <Settings className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setIsOpen(false)}
                      className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Filtros */}
                <div className="flex items-center space-x-2 mt-3">
                  <select
                    value={filtroTipo}
                    onChange={(e) => setFiltroTipo(e.target.value)}
                    className="text-xs px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="todas">Todas</option>
                    <option value="meta">Metas</option>
                    <option value="oportunidade">Oportunidades</option>
                    <option value="lembrete">Lembretes</option>
                    <option value="alerta">Alertas</option>
                  </select>

                  {naoLidas > 0 && (
                    <button
                      onClick={marcarTodasComoLidas}
                      className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      Marcar todas como lidas
                    </button>
                  )}

                  {notificacoes.length > 0 && (
                    <button
                      onClick={limparNotificacoes}
                      className="text-xs text-red-600 dark:text-red-400 hover:underline flex items-center space-x-1"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Limpar</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Lista de Notificações */}
              <div className="max-h-96 overflow-y-auto">
                {notificacoesFiltradas.length === 0 ? (
                  <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                    <Bell className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>Nenhuma notificação encontrada</p>
                  </div>
                ) : (
                  <div className="p-2 space-y-2">
                    {/* Notificações não lidas */}
                    {notificacoesNaoLidas.length > 0 && (
                      <>
                        <h4 className="text-xs font-medium text-gray-500 dark:text-gray-400 px-2 py-1">
                          Não lidas ({notificacoesNaoLidas.length})
                        </h4>
                        <AnimatePresence>
                          {notificacoesNaoLidas.map(notificacao => (
                            <NotificacaoItem
                              key={notificacao.id}
                              notificacao={notificacao}
                              onMarcarLida={marcarComoLida}
                              onRemover={removerNotificacao}
                            />
                          ))}
                        </AnimatePresence>
                      </>
                    )}

                    {/* Notificações lidas */}
                    {notificacoesLidas.length > 0 && (
                      <>
                        {notificacoesNaoLidas.length > 0 && (
                          <div className="border-t border-gray-200 dark:border-gray-700 my-2" />
                        )}
                        <h4 className="text-xs font-medium text-gray-500 dark:text-gray-400 px-2 py-1">
                          Lidas ({notificacoesLidas.length})
                        </h4>
                        <AnimatePresence>
                          {notificacoesLidas.slice(0, 5).map(notificacao => (
                            <NotificacaoItem
                              key={notificacao.id}
                              notificacao={notificacao}
                              onMarcarLida={marcarComoLida}
                              onRemover={removerNotificacao}
                            />
                          ))}
                        </AnimatePresence>
                      </>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Modal de Configurações */}
      <ConfiguracoesNotificacoes
        isOpen={showConfiguracoes}
        onClose={() => setShowConfiguracoes(false)}
      />
    </>
  );
};