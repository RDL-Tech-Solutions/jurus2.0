// Sistema de Educação Financeira

import React, { useState, useMemo } from 'react';
import {
  BookOpen,
  Lightbulb,
  Trophy,
  User,
  Search,
  Filter,
  Clock,
  Star,
  Play,
  CheckCircle,
  Target,
  TrendingUp,
  Award,
  Calendar,
  BarChart3,
  Brain,
  Zap
} from 'lucide-react';
import useEducacao from '../hooks/useEducacao';
import {
  TutorialInterativo,
  ArtigoEducativo,
  TermoGlossario,
  DicaFinanceira
} from '../types/educacao';

const SistemaEducacao: React.FC = () => {
  const {
    glossario,
    dicas,
    tutoriais,
    artigos,
    conquistas,
    perfil,
    sessaoAtual,
    estatisticas,
    conquistasDesbloqueadas,
    proximasConquistas,
    obterRecomendacoes,
    obterDicasContextuais,
    obterPlanoEstudos,
    obterProgressoAprendizado,
    iniciarSessao,
    finalizarSessao,
    completarTutorial,
    lerArtigo,
    setTutorialAtivo,
    tutorialAtivo
  } = useEducacao();

  // Estados da interface
  const [abaSelecionada, setAbaSelecionada] = useState<string>('home');
  const [termoPesquisa, setTermoPesquisa] = useState<string>('');
  const [filtroCategoria, setFiltroCategoria] = useState<string>('');
  const [filtroNivel, setFiltroNivel] = useState<string>('');
  const [tutorialSelecionado, setTutorialSelecionado] = useState<TutorialInterativo | null>(null);
  const [artigoSelecionado, setArtigoSelecionado] = useState<ArtigoEducativo | null>(null);

  // Dados computados
  const recomendacoes = useMemo(() => obterRecomendacoes(), [obterRecomendacoes]);
  const dicasContextuais = useMemo(() => obterDicasContextuais('geral'), [obterDicasContextuais]);
  const planoEstudos = useMemo(() => obterPlanoEstudos(), [obterPlanoEstudos]);
  const progressoAprendizado = useMemo(() => obterProgressoAprendizado(), [obterProgressoAprendizado]);

  // Filtrar dados baseado na pesquisa e filtros
  const dadosFiltrados = useMemo(() => {
    const filtrarPorTexto = (items: any[], campos: string[]) => {
      if (!termoPesquisa) return items;
      return items.filter(item =>
        campos.some(campo =>
          item[campo]?.toLowerCase().includes(termoPesquisa.toLowerCase())
        )
      );
    };

    const filtrarPorCategoria = (items: any[]) => {
      if (!filtroCategoria) return items;
      return items.filter(item => item.categoria === filtroCategoria);
    };

    const filtrarPorNivel = (items: any[]) => {
      if (!filtroNivel) return items;
      return items.filter(item => item.nivel === filtroNivel);
    };

    return {
      glossario: filtrarPorCategoria(filtrarPorTexto(glossario, ['termo', 'definicao'])),
      dicas: filtrarPorNivel(filtrarPorCategoria(filtrarPorTexto(dicas, ['titulo', 'conteudo']))),
      tutoriais: filtrarPorNivel(filtrarPorCategoria(filtrarPorTexto(tutoriais, ['titulo', 'descricao']))),
      artigos: filtrarPorNivel(filtrarPorCategoria(filtrarPorTexto(artigos, ['titulo', 'resumo'])))
    };
  }, [glossario, dicas, tutoriais, artigos, termoPesquisa, filtroCategoria, filtroNivel]);

  // Função para iniciar uma sessão de estudo
  const handleIniciarSessao = () => {
    if (!sessaoAtual) {
      iniciarSessao();
    }
  };

  // Função para finalizar sessão
  const handleFinalizarSessao = () => {
    if (sessaoAtual) {
      finalizarSessao();
    }
  };

  // Função para completar tutorial
  const handleCompletarTutorial = (tutorialId: string) => {
    completarTutorial(tutorialId);
    setTutorialSelecionado(null);
  };

  // Função para ler artigo
  const handleLerArtigo = (artigoId: string) => {
    lerArtigo(artigoId);
    setArtigoSelecionado(null);
  };

  if (!perfil || !estatisticas) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Carregando sistema de educação...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header com estatísticas do usuário */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-lg">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
          <div className="mb-4 md:mb-0">
            <h1 className="text-2xl font-bold mb-2">Sistema de Educação Financeira</h1>
            <p className="text-blue-100">
              Aprenda sobre investimentos e construa seu conhecimento financeiro
            </p>
          </div>
          <div className="flex items-center space-x-6">
            <div className="text-center">
              <div className="text-2xl font-bold">{estatisticas.nivel}</div>
              <div className="text-sm text-blue-100">Nível</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{estatisticas.conquistasDesbloqueadas}</div>
              <div className="text-sm text-blue-100">Conquistas</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{Math.round(estatisticas.tempoTotalEstudo)}</div>
              <div className="text-sm text-blue-100">Min. Estudados</div>
            </div>
          </div>
        </div>

        {/* Barra de progresso do nível */}
        <div className="mt-4">
          <div className="flex items-center justify-between text-sm mb-1">
            <span>Progresso do Nível {estatisticas.nivel}</span>
            <span>{estatisticas.experiencia}/{estatisticas.proximoNivel} XP</span>
          </div>
          <div className="w-full bg-blue-500/30 rounded-full h-2">
            <div
              className="bg-white rounded-full h-2 transition-all duration-300"
              style={{ width: `${estatisticas.progressoNivel}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Controle de Sessão */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`w-3 h-3 rounded-full ${sessaoAtual ? 'bg-green-500' : 'bg-gray-400'}`}></div>
            <span className="font-medium text-gray-900 dark:text-white">
              {sessaoAtual ? 'Sessão de Estudo Ativa' : 'Nenhuma Sessão Ativa'}
            </span>
            {sessaoAtual && (
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {Math.round((Date.now() - sessaoAtual.inicio) / 1000 / 60)} min
              </span>
            )}
          </div>
          <button
            onClick={sessaoAtual ? handleFinalizarSessao : handleIniciarSessao}
            className={`px-4 py-2 rounded-lg font-medium ${
              sessaoAtual
                ? 'bg-red-600 hover:bg-red-700 text-white'
                : 'bg-green-600 hover:bg-green-700 text-white'
            }`}
          >
            {sessaoAtual ? 'Finalizar Sessão' : 'Iniciar Sessão'}
          </button>
        </div>
      </div>

      {/* Navegação por abas */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <div className="relative">
          {/* Gradiente de fade para indicar scroll no mobile */}
          <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white dark:from-gray-900 to-transparent z-10 pointer-events-none sm:hidden"></div>
          
          <nav className="flex space-x-2 sm:space-x-8 overflow-x-auto scrollbar-hide pb-0">
            {[
              { id: 'home', label: 'Início', icon: BookOpen },
              { id: 'plano', label: 'Plano de Estudos', icon: Target },
              { id: 'progresso', label: 'Progresso', icon: TrendingUp },
              { id: 'glossario', label: 'Glossário', icon: BookOpen },
              { id: 'dicas', label: 'Dicas', icon: Lightbulb },
              { id: 'tutoriais', label: 'Tutoriais', icon: Play },
              { id: 'artigos', label: 'Artigos', icon: BookOpen },
              { id: 'conquistas', label: 'Conquistas', icon: Trophy },
              { id: 'perfil', label: 'Perfil', icon: User }
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setAbaSelecionada(id)}
                className={`flex items-center space-x-1 sm:space-x-2 py-4 px-2 sm:px-1 border-b-2 font-medium text-xs sm:text-sm whitespace-nowrap flex-shrink-0 ${
                  abaSelecionada === id
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                <span className="hidden xs:inline sm:inline">{label}</span>
                <span className="xs:hidden sm:hidden text-xs">{label.split(' ')[0]}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Conteúdo das abas */}
      <div className="min-h-96">
        {/* Aba Início */}
        {abaSelecionada === 'home' && (
          <div className="space-y-6">
            {/* Recomendações Personalizadas */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <Brain className="w-5 h-5 mr-2 text-blue-600" />
                Recomendações Personalizadas
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {recomendacoes.slice(0, 6).map((rec) => (
                  <div key={rec.id} className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className={`text-xs px-2 py-1 rounded ${
                        rec.tipo === 'tutorial' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-200' :
                        'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-200'
                      }`}>
                        {rec.tipo}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded ${
                        rec.nivel === 'iniciante' ? 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-200' :
                        rec.nivel === 'intermediario' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-200' :
                        'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-200'
                      }`}>
                        {rec.nivel}
                      </span>
                    </div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                      {rec.titulo}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                      {rec.motivo}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 text-xs text-gray-500">
                        <Clock className="w-3 h-3" />
                        <span>{rec.tempoEstimado}min</span>
                      </div>
                      <button
                        onClick={() => {
                          if (rec.tipo === 'tutorial') {
                            setAbaSelecionada('tutoriais');
                            const tutorial = tutoriais.find(t => t.id === rec.id);
                            if (tutorial) setTutorialSelecionado(tutorial);
                          } else if (rec.tipo === 'artigo') {
                            setAbaSelecionada('artigos');
                            const artigo = artigos.find(a => a.id === rec.id);
                            if (artigo) setArtigoSelecionado(artigo);
                          }
                        }}
                        className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                      >
                        Começar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Dicas Rápidas */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <Lightbulb className="w-5 h-5 mr-2 text-yellow-600" />
                Dicas Rápidas
              </h3>
              <div className="space-y-3">
                {dicasContextuais.slice(0, 3).map((dica) => (
                  <div key={dica.id} className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg border border-yellow-200 dark:border-yellow-800">
                    <div className="flex items-start space-x-3">
                      <Lightbulb className="w-5 h-5 text-yellow-600 mt-0.5" />
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 dark:text-white mb-1">
                          {dica.titulo}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {dica.conteudo}
                        </p>
                        <div className="flex items-center space-x-2 mt-2">
                          {dica.tags.map((tag) => (
                            <span key={tag} className="text-xs bg-yellow-100 dark:bg-yellow-900/40 text-yellow-800 dark:text-yellow-200 px-2 py-1 rounded">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Próximas Conquistas */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <Trophy className="w-5 h-5 mr-2 text-purple-600" />
                Próximas Conquistas
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {proximasConquistas.map((conquista) => (
                  <div key={conquista.id} className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                    <div className="flex items-center space-x-3 mb-2">
                      <span className="text-2xl">{conquista.icone}</span>
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white">
                          {conquista.nome}
                        </h4>
                        <p className="text-xs text-gray-500">
                          {conquista.raridade}
                        </p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                      {conquista.descricao}
                    </p>
                    <div className="space-y-1">
                      {conquista.criterios.map((criterio, index) => (
                        <div key={index} className="text-xs text-gray-500">
                          • {criterio.descricao}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Aba Plano de Estudos */}
        {abaSelecionada === 'plano' && planoEstudos && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <Target className="w-5 h-5 mr-2 text-blue-600" />
                Seu Plano de Estudos Personalizado
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Próximos Tutoriais */}
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-3">Próximos Tutoriais</h4>
                  <div className="space-y-3">
                    {planoEstudos.proximosTutoriais.map((tutorial) => (
                      <div key={tutorial.id} className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                        <h5 className="font-medium text-gray-900 dark:text-white">{tutorial.titulo}</h5>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{tutorial.motivo}</p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs text-blue-600">{tutorial.tempoEstimado} min</span>
                          <button
                            onClick={() => {
                              setAbaSelecionada('tutoriais');
                              // Buscar o tutorial completo pelos dados
                              const tutorialCompleto = tutoriais.find(t => t.id === tutorial.id);
                              if (tutorialCompleto) {
                                setTutorialSelecionado(tutorialCompleto);
                              }
                            }}
                            className="text-xs bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700"
                          >
                            Começar
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Artigos Recomendados */}
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-3">Artigos Recomendados</h4>
                  <div className="space-y-3">
                    {planoEstudos.artigosRecomendados.map((artigo) => (
                      <div key={artigo.id} className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
                        <h5 className="font-medium text-gray-900 dark:text-white">{artigo.titulo}</h5>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{artigo.motivo}</p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs text-green-600">{artigo.tempoEstimado} min</span>
                          <button
                            onClick={() => {
                              setAbaSelecionada('artigos');
                              // Buscar o artigo completo pelos dados
                              const artigoCompleto = artigos.find(a => a.id === artigo.id);
                              if (artigoCompleto) {
                                setArtigoSelecionado(artigoCompleto);
                              }
                            }}
                            className="text-xs bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700"
                          >
                            Ler
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Meta Semanal */}
              <div className="mt-6 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <h4 className="font-medium text-gray-900 dark:text-white mb-2 flex items-center">
                  <Calendar className="w-4 h-4 mr-2 text-purple-600" />
                  Meta Semanal
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  Tempo recomendado: {planoEstudos.metaSemanal.tempoRecomendado} minutos
                </p>
                <div className="space-y-1">
                  {planoEstudos.metaSemanal.objetivos.map((objetivo, index) => (
                    <div key={index} className="text-sm text-gray-700 dark:text-gray-300">
                      • {objetivo}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Aba Progresso */}
        {abaSelecionada === 'progresso' && progressoAprendizado && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <BarChart3 className="w-5 h-5 mr-2 text-green-600" />
                Seu Progresso de Aprendizado
              </h3>

              {/* Progresso Geral */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-gray-900 dark:text-white">Progresso Geral</span>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {Math.round(progressoAprendizado.progressoGeral)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                  <div
                    className="bg-green-600 rounded-full h-3 transition-all duration-300"
                    style={{ width: `${progressoAprendizado.progressoGeral}%` }}
                  ></div>
                </div>
              </div>

              {/* Progresso por Área */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(progressoAprendizado.progressoPorArea).map(([area, progresso]) => (
                  <div key={area} className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-gray-900 dark:text-white capitalize">{area}</span>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {Math.round(progresso)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                      <div
                        className="bg-blue-600 rounded-full h-2 transition-all duration-300"
                        style={{ width: `${progresso}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Estatísticas */}
              <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{progressoAprendizado.totalTutoriais}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Tutoriais</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{progressoAprendizado.totalArtigos}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Artigos</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{progressoAprendizado.totalConquistas}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Conquistas</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">{Math.round(progressoAprendizado.tempoTotal)}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Minutos</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Outras abas simplificadas para manter o componente funcional */}
        {abaSelecionada === 'glossario' && (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Buscar termos..."
                  value={termoPesquisa}
                  onChange={(e) => setTermoPesquisa(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {dadosFiltrados.glossario.map((termo) => (
                <div key={termo.id} className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                    {termo.termo}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {termo.definicao}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {abaSelecionada === 'dicas' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {dadosFiltrados.dicas.map((dica) => (
                <div key={dica.id} className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                    {dica.titulo}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {dica.conteudo}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {abaSelecionada === 'tutoriais' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {dadosFiltrados.tutoriais.map((tutorial) => (
                <div key={tutorial.id} className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                    {tutorial.titulo}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    {tutorial.descricao}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">{tutorial.duracao} min</span>
                    <button
                      onClick={() => handleCompletarTutorial(tutorial.id)}
                      className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                    >
                      Completar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {abaSelecionada === 'artigos' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {dadosFiltrados.artigos.map((artigo) => (
                <div key={artigo.id} className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                    {artigo.titulo}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    {artigo.resumo}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">{artigo.tempoLeitura} min</span>
                    <button
                      onClick={() => handleLerArtigo(artigo.id)}
                      className="text-green-600 hover:text-green-700 font-medium text-sm"
                    >
                      Ler
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {abaSelecionada === 'conquistas' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {conquistasDesbloqueadas.map((conquista) => (
                <div key={conquista.id} className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
                  <div className="flex items-center space-x-3 mb-2">
                    <span className="text-2xl">{conquista.icone}</span>
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        {conquista.nome}
                      </h4>
                      <p className="text-xs text-green-600">Desbloqueada</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {conquista.descricao}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {abaSelecionada === 'perfil' && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Perfil do Usuário
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">Estatísticas</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Nível:</span>
                      <span className="font-medium">{estatisticas.nivel}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Experiência:</span>
                      <span className="font-medium">{estatisticas.experiencia} XP</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Tutoriais Completos:</span>
                      <span className="font-medium">{estatisticas.tutoriaisCompletos}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Artigos Lidos:</span>
                      <span className="font-medium">{estatisticas.artigosLidos}</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">Progresso por Área</h4>
                  <div className="space-y-2">
                    {Object.entries(perfil.areas).map(([area, dados]) => (
                      <div key={area} className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400 capitalize">{area}:</span>
                        <span className="font-medium">Nível {dados.nivel}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SistemaEducacao;