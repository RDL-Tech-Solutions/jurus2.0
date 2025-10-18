// Componente de Configuração de Acessibilidade

import React, { useState } from 'react';
import { 
  Settings, 
  Eye, 
  Keyboard, 
  Volume2, 
  Monitor, 
  Users, 
  Save, 
  RotateCcw, 
  Download, 
  Upload,
  Play,
  Pause,
  TestTube,
  BarChart3,
  HelpCircle,
  CheckCircle,
  AlertCircle,
  Info
} from 'lucide-react';
import useAcessibilidade, { ConfiguracaoAcessibilidade, PerfilAcessibilidade } from '../hooks/useAcessibilidade';

interface ConfiguracaoAcessibilidadeProps {
  isOpen: boolean;
  onClose: () => void;
}

const ConfiguracaoAcessibilidadeComponent: React.FC<ConfiguracaoAcessibilidadeProps> = ({
  isOpen,
  onClose
}) => {
  const {
    configuracao,
    perfis,
    perfilAtivo,
    logs,
    estatisticas,
    setConfiguracao,
    aplicarPerfil,
    criarPerfil,
    excluirPerfil,
    anunciar,
    reproduzirFeedback,
    verificarCompatibilidade
  } = useAcessibilidade();

  const [abaSelecionada, setAbaSelecionada] = useState<'configuracoes' | 'perfis' | 'teste' | 'estatisticas'>('configuracoes');
  const [novoPerfil, setNovoPerfil] = useState({ nome: '', descricao: '' });
  const [testeAtivo, setTesteAtivo] = useState(false);
  const [compatibilidade] = useState(verificarCompatibilidade());

  if (!isOpen) return null;

  // Atualizar configuração
  const atualizarConfig = <K extends keyof ConfiguracaoAcessibilidade>(
    chave: K,
    valor: ConfiguracaoAcessibilidade[K]
  ) => {
    setConfiguracao(prev => ({ ...prev, [chave]: valor }));
    anunciar(`${chave} alterado para ${valor}`, 'baixa');
  };

  // Testar funcionalidade
  const testarFuncionalidade = (tipo: 'audio' | 'foco' | 'navegacao' | 'anuncio') => {
    setTesteAtivo(true);
    
    switch (tipo) {
      case 'audio':
        reproduzirFeedback('sucesso');
        anunciar('Teste de áudio executado', 'media');
        break;
      case 'foco':
        const botao = document.querySelector('button');
        if (botao) {
          (botao as HTMLElement).focus();
        }
        break;
      case 'navegacao':
        anunciar('Teste de navegação por teclado. Use Tab para navegar', 'media');
        break;
      case 'anuncio':
        anunciar('Este é um teste de anúncio para leitores de tela', 'alta');
        break;
    }
    
    setTimeout(() => setTesteAtivo(false), 2000);
  };

  // Exportar configurações
  const exportarConfiguracoes = () => {
    const dados = {
      configuracao,
      perfis: perfis.filter(p => !p.predefinido),
      timestamp: Date.now()
    };
    
    const blob = new Blob([JSON.stringify(dados, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'acessibilidade-config.json';
    a.click();
    URL.revokeObjectURL(url);
    
    anunciar('Configurações exportadas', 'media');
  };

  // Importar configurações
  const importarConfiguracoes = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const dados = JSON.parse(e.target?.result as string);
        if (dados.configuracao) {
          setConfiguracao(dados.configuracao);
          anunciar('Configurações importadas com sucesso', 'media');
        }
      } catch (error) {
        anunciar('Erro ao importar configurações', 'media');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Cabeçalho */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <Settings className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Configurações de Acessibilidade
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            aria-label="Fechar configurações"
          >
            ✕
          </button>
        </div>

        {/* Abas */}
        <div className="flex border-b border-gray-200 dark:border-gray-700">
          {[
            { id: 'configuracoes', label: 'Configurações', icon: Settings },
            { id: 'perfis', label: 'Perfis', icon: Users },
            { id: 'teste', label: 'Teste', icon: TestTube },
            { id: 'estatisticas', label: 'Estatísticas', icon: BarChart3 }
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setAbaSelecionada(id as any)}
              className={`flex items-center space-x-2 px-6 py-3 border-b-2 transition-colors ${
                abaSelecionada === id
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
              aria-selected={abaSelecionada === id}
            >
              <Icon className="w-4 h-4" />
              <span>{label}</span>
            </button>
          ))}
        </div>

        {/* Conteúdo */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {/* Aba Configurações */}
          {abaSelecionada === 'configuracoes' && (
            <div className="space-y-8">
              {/* Configurações Visuais */}
              <div>
                <div className="flex items-center space-x-2 mb-4">
                  <Eye className="w-5 h-5 text-blue-600" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    Configurações Visuais
                  </h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={configuracao.altoContraste}
                      onChange={(e) => atualizarConfig('altoContraste', e.target.checked)}
                      className="rounded border-gray-300"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      Alto Contraste
                    </span>
                  </label>

                  <div>
                    <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">
                      Tamanho da Fonte
                    </label>
                    <select
                      value={configuracao.tamanhoFonte}
                      onChange={(e) => atualizarConfig('tamanhoFonte', e.target.value as any)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="pequeno">Pequeno</option>
                      <option value="normal">Normal</option>
                      <option value="grande">Grande</option>
                      <option value="extra-grande">Extra Grande</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">
                      Espaçamento de Linhas
                    </label>
                    <select
                      value={configuracao.espacamentoLinhas}
                      onChange={(e) => atualizarConfig('espacamentoLinhas', e.target.value as any)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="compacto">Compacto</option>
                      <option value="normal">Normal</option>
                      <option value="expandido">Expandido</option>
                    </select>
                  </div>

                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={configuracao.reducaoMovimento}
                      onChange={(e) => atualizarConfig('reducaoMovimento', e.target.checked)}
                      className="rounded border-gray-300"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      Reduzir Movimento
                    </span>
                  </label>

                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={configuracao.modoEscuroForcado}
                      onChange={(e) => atualizarConfig('modoEscuroForcado', e.target.checked)}
                      className="rounded border-gray-300"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      Modo Escuro Forçado
                    </span>
                  </label>

                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={configuracao.destacarFoco}
                      onChange={(e) => atualizarConfig('destacarFoco', e.target.checked)}
                      className="rounded border-gray-300"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      Destacar Foco
                    </span>
                  </label>
                </div>
              </div>

              {/* Configurações de Navegação */}
              <div>
                <div className="flex items-center space-x-2 mb-4">
                  <Keyboard className="w-5 h-5 text-blue-600" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    Navegação
                  </h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={configuracao.navegacaoTeclado}
                      onChange={(e) => atualizarConfig('navegacaoTeclado', e.target.checked)}
                      className="rounded border-gray-300"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      Navegação por Teclado
                    </span>
                  </label>

                  <div>
                    <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">
                      Indicador de Foco
                    </label>
                    <select
                      value={configuracao.indicadorFoco}
                      onChange={(e) => atualizarConfig('indicadorFoco', e.target.value as any)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="padrao">Padrão</option>
                      <option value="destacado">Destacado</option>
                      <option value="colorido">Colorido</option>
                    </select>
                  </div>

                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={configuracao.pularLinks}
                      onChange={(e) => atualizarConfig('pularLinks', e.target.checked)}
                      className="rounded border-gray-300"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      Links para Pular
                    </span>
                  </label>

                  <div>
                    <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">
                      Tempo de Resposta
                    </label>
                    <select
                      value={configuracao.tempoResposta}
                      onChange={(e) => atualizarConfig('tempoResposta', e.target.value as any)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="rapido">Rápido</option>
                      <option value="normal">Normal</option>
                      <option value="lento">Lento</option>
                      <option value="muito-lento">Muito Lento</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Configurações de Áudio */}
              <div>
                <div className="flex items-center space-x-2 mb-4">
                  <Volume2 className="w-5 h-5 text-blue-600" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    Áudio e Som
                  </h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={configuracao.audioHabilitado}
                      onChange={(e) => atualizarConfig('audioHabilitado', e.target.checked)}
                      className="rounded border-gray-300"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      Áudio Habilitado
                    </span>
                  </label>

                  <div>
                    <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">
                      Volume: {Math.round(configuracao.volumeAudio * 100)}%
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      value={configuracao.volumeAudio}
                      onChange={(e) => atualizarConfig('volumeAudio', parseFloat(e.target.value))}
                      className="w-full"
                    />
                  </div>

                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={configuracao.feedbackSonoro}
                      onChange={(e) => atualizarConfig('feedbackSonoro', e.target.checked)}
                      className="rounded border-gray-300"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      Feedback Sonoro
                    </span>
                  </label>

                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={configuracao.leituraAutomatica}
                      onChange={(e) => atualizarConfig('leituraAutomatica', e.target.checked)}
                      className="rounded border-gray-300"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      Leitura Automática
                    </span>
                  </label>
                </div>
              </div>

              {/* Configurações de Leitura de Tela */}
              <div>
                <div className="flex items-center space-x-2 mb-4">
                  <Monitor className="w-5 h-5 text-blue-600" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    Leitura de Tela
                  </h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={configuracao.leitorTela}
                      onChange={(e) => atualizarConfig('leitorTela', e.target.checked)}
                      className="rounded border-gray-300"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      Suporte a Leitor de Tela
                    </span>
                  </label>

                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={configuracao.descricaoDetalhada}
                      onChange={(e) => atualizarConfig('descricaoDetalhada', e.target.checked)}
                      className="rounded border-gray-300"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      Descrições Detalhadas
                    </span>
                  </label>

                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={configuracao.anuncioMudancas}
                      onChange={(e) => atualizarConfig('anuncioMudancas', e.target.checked)}
                      className="rounded border-gray-300"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      Anunciar Mudanças
                    </span>
                  </label>

                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={configuracao.rotulos}
                      onChange={(e) => atualizarConfig('rotulos', e.target.checked)}
                      className="rounded border-gray-300"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      Rótulos Descritivos
                    </span>
                  </label>
                </div>
              </div>

              {/* Configurações de Conteúdo */}
              <div>
                <div className="flex items-center space-x-2 mb-4">
                  <HelpCircle className="w-5 h-5 text-blue-600" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    Conteúdo e Interação
                  </h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={configuracao.confirmarAcoes}
                      onChange={(e) => atualizarConfig('confirmarAcoes', e.target.checked)}
                      className="rounded border-gray-300"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      Confirmar Ações
                    </span>
                  </label>

                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={configuracao.simplificarInterface}
                      onChange={(e) => atualizarConfig('simplificarInterface', e.target.checked)}
                      className="rounded border-gray-300"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      Interface Simplificada
                    </span>
                  </label>

                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={configuracao.ajudaContextual}
                      onChange={(e) => atualizarConfig('ajudaContextual', e.target.checked)}
                      className="rounded border-gray-300"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      Ajuda Contextual
                    </span>
                  </label>

                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={configuracao.linguagemSimples}
                      onChange={(e) => atualizarConfig('linguagemSimples', e.target.checked)}
                      className="rounded border-gray-300"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      Linguagem Simples
                    </span>
                  </label>

                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={configuracao.explicacoesTecnicas}
                      onChange={(e) => atualizarConfig('explicacoesTecnicas', e.target.checked)}
                      className="rounded border-gray-300"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      Explicações Técnicas
                    </span>
                  </label>

                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={configuracao.exemplosVisuais}
                      onChange={(e) => atualizarConfig('exemplosVisuais', e.target.checked)}
                      className="rounded border-gray-300"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      Exemplos Visuais
                    </span>
                  </label>

                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={configuracao.resumoConteudo}
                      onChange={(e) => atualizarConfig('resumoConteudo', e.target.checked)}
                      className="rounded border-gray-300"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      Resumo de Conteúdo
                    </span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Aba Perfis */}
          {abaSelecionada === 'perfis' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  Perfis de Acessibilidade
                </h3>
                <div className="flex space-x-2">
                  <button
                    onClick={exportarConfiguracoes}
                    className="flex items-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    <Download className="w-4 h-4" />
                    <span>Exportar</span>
                  </button>
                  <label className="flex items-center space-x-2 px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 cursor-pointer">
                    <Upload className="w-4 h-4" />
                    <span>Importar</span>
                    <input
                      type="file"
                      accept=".json"
                      onChange={importarConfiguracoes}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* Lista de Perfis */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {perfis.map((perfil) => (
                  <div
                    key={perfil.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      perfilAtivo === perfil.id
                        ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-gray-300 dark:border-gray-600 hover:border-gray-400'
                    }`}
                    onClick={() => aplicarPerfil(perfil.id)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        {perfil.nome}
                      </h4>
                      {perfilAtivo === perfil.id && (
                        <CheckCircle className="w-5 h-5 text-blue-600" />
                      )}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                      {perfil.descricao}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className={`text-xs px-2 py-1 rounded ${
                        perfil.predefinido
                          ? 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                          : 'bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400'
                      }`}>
                        {perfil.predefinido ? 'Predefinido' : 'Personalizado'}
                      </span>
                      {!perfil.predefinido && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            excluirPerfil(perfil.id);
                          }}
                          className="text-red-600 hover:text-red-700"
                          aria-label={`Excluir perfil ${perfil.nome}`}
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Criar Novo Perfil */}
              <div className="border-t pt-6">
                <h4 className="font-medium text-gray-900 dark:text-white mb-4">
                  Criar Novo Perfil
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Nome do perfil"
                    value={novoPerfil.nome}
                    onChange={(e) => setNovoPerfil(prev => ({ ...prev, nome: e.target.value }))}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="text"
                    placeholder="Descrição"
                    value={novoPerfil.descricao}
                    onChange={(e) => setNovoPerfil(prev => ({ ...prev, descricao: e.target.value }))}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <button
                  onClick={() => {
                    if (novoPerfil.nome && novoPerfil.descricao) {
                      criarPerfil(novoPerfil.nome, novoPerfil.descricao);
                      setNovoPerfil({ nome: '', descricao: '' });
                      anunciar('Novo perfil criado', 'media');
                    }
                  }}
                  disabled={!novoPerfil.nome || !novoPerfil.descricao}
                  className="mt-4 flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Save className="w-4 h-4" />
                  <span>Criar Perfil</span>
                </button>
              </div>
            </div>
          )}

          {/* Aba Teste */}
          {abaSelecionada === 'teste' && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Testar Funcionalidades
              </h3>

              {/* Compatibilidade */}
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 dark:text-white mb-3">
                  Compatibilidade do Navegador
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {Object.entries(compatibilidade).map(([recurso, suportado]) => (
                    <div key={recurso} className="flex items-center space-x-2">
                      {suportado ? (
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-red-600" />
                      )}
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        {recurso}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Testes */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  onClick={() => testarFuncionalidade('audio')}
                  disabled={testeAtivo}
                  className="flex items-center justify-center space-x-2 p-4 border border-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
                >
                  <Volume2 className="w-5 h-5" />
                  <span>Testar Áudio</span>
                </button>

                <button
                  onClick={() => testarFuncionalidade('foco')}
                  disabled={testeAtivo}
                  className="flex items-center justify-center space-x-2 p-4 border border-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
                >
                  <Eye className="w-5 h-5" />
                  <span>Testar Foco</span>
                </button>

                <button
                  onClick={() => testarFuncionalidade('navegacao')}
                  disabled={testeAtivo}
                  className="flex items-center justify-center space-x-2 p-4 border border-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
                >
                  <Keyboard className="w-5 h-5" />
                  <span>Testar Navegação</span>
                </button>

                <button
                  onClick={() => testarFuncionalidade('anuncio')}
                  disabled={testeAtivo}
                  className="flex items-center justify-center space-x-2 p-4 border border-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
                >
                  <Monitor className="w-5 h-5" />
                  <span>Testar Anúncio</span>
                </button>
              </div>

              {testeAtivo && (
                <div className="flex items-center justify-center space-x-2 text-blue-600">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                  <span>Executando teste...</span>
                </div>
              )}
            </div>
          )}

          {/* Aba Estatísticas */}
          {abaSelecionada === 'estatisticas' && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Estatísticas de Uso
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <BarChart3 className="w-5 h-5 text-blue-600" />
                    <span className="font-medium text-gray-900 dark:text-white">
                      Total de Interações
                    </span>
                  </div>
                  <span className="text-2xl font-bold text-blue-600">
                    {estatisticas.totalInteracoes}
                  </span>
                </div>

                <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="font-medium text-gray-900 dark:text-white">
                      Taxa de Sucesso
                    </span>
                  </div>
                  <span className="text-2xl font-bold text-green-600">
                    {estatisticas.totalInteracoes > 0 
                      ? Math.round((estatisticas.sucessos / estatisticas.totalInteracoes) * 100)
                      : 0}%
                  </span>
                </div>

                <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <Keyboard className="w-5 h-5 text-purple-600" />
                    <span className="font-medium text-gray-900 dark:text-white">
                      Uso do Teclado
                    </span>
                  </div>
                  <span className="text-2xl font-bold text-purple-600">
                    {estatisticas.totalInteracoes > 0 
                      ? Math.round((estatisticas.interacoesTeclado / estatisticas.totalInteracoes) * 100)
                      : 0}%
                  </span>
                </div>
              </div>

              {/* Elementos mais focados */}
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-3">
                  Elementos Mais Utilizados
                </h4>
                <div className="space-y-2">
                  {Object.entries(estatisticas.elementosMaisFocados)
                    .sort(([,a], [,b]) => b - a)
                    .slice(0, 5)
                    .map(([elemento, count]) => (
                      <div key={elemento} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded">
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                          {elemento}
                        </span>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {count}
                        </span>
                      </div>
                    ))}
                </div>
              </div>

              {/* Tempo médio de resposta */}
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                  Tempo Médio de Resposta
                </h4>
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <span className="text-lg font-bold text-gray-900 dark:text-white">
                    {estatisticas.tempoMedioResposta.toFixed(0)}ms
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Rodapé */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
            <Info className="w-4 h-4" />
            <span>Configurações salvas automaticamente</span>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={() => {
                setConfiguracao({
                  altoContraste: false,
                  tamanhoFonte: 'normal',
                  espacamentoLinhas: 'normal',
                  reducaoMovimento: false,
                  modoEscuroForcado: false,
                  destacarFoco: true,
                  navegacaoTeclado: true,
                  indicadorFoco: 'padrao',
                  pularLinks: true,
                  ordemTabulacao: true,
                  audioHabilitado: true,
                  volumeAudio: 0.5,
                  feedbackSonoro: false,
                  leituraAutomatica: false,
                  leitorTela: false,
                  descricaoDetalhada: false,
                  anuncioMudancas: false,
                  rotulos: true,
                  tempoResposta: 'normal',
                  confirmarAcoes: false,
                  simplificarInterface: false,
                  ajudaContextual: true,
                  linguagemSimples: false,
                  explicacoesTecnicas: true,
                  exemplosVisuais: true,
                  resumoConteudo: false
                });
                anunciar('Configurações restauradas para o padrão', 'media');
              }}
              className="flex items-center space-x-2 px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Restaurar Padrão</span>
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Fechar
            </button>
          </div>
        </div>
      </div>

      {/* Região de anúncios para leitores de tela */}
      <div
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      >
        {/* Conteúdo será anunciado aqui */}
      </div>
    </div>
  );
};

export default ConfiguracaoAcessibilidadeComponent;