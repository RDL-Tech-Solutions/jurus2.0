// Sistema de Educação Financeira

import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Lightbulb,
  GraduationCap,
  Trophy,
  Search,
  Play,
  Clock,
  Star,
  Award,
  Target,
  TrendingUp,
  Brain,
  Users,
  Settings,
  ChevronRight,
  CheckCircle,
  Circle,
  Filter,
  Heart,
  Share2,
  Bookmark
} from 'lucide-react';
import useEducacao from '../hooks/useEducacao';
import { TermoGlossario, DicaFinanceira, TutorialInterativo, ArtigoEducativo } from '../types/educacao';

interface SistemaEducacaoProps {
  className?: string;
}

const SistemaEducacao: React.FC<SistemaEducacaoProps> = ({ className = '' }) => {
  const {
    glossario,
    dicas,
    tutoriais,
    artigos,
    perfil,
    estatisticas,
    conquistasDesbloqueadas,
    proximasConquistas,
    obterDicasContextuais,
    obterRecomendacoes,
    iniciarSessao,
    completarTutorial,
    lerArtigo,
    pesquisar,
    setTutorialAtivo,
    configuracao,
    setConfiguracao
  } = useEducacao();

  const [abaSelecionada, setAbaSelecionada] = useState<'inicio' | 'glossario' | 'dicas' | 'tutoriais' | 'artigos' | 'perfil'>('inicio');
  const [termoPesquisa, setTermoPesquisa] = useState('');
  const [filtroCategoria, setFiltroCategoria] = useState<string>('');
  const [filtroNivel, setFiltroNivel] = useState<string>('');
  const [tutorialSelecionado, setTutorialSelecionado] = useState<TutorialInterativo | null>(null);
  const [artigoSelecionado, setArtigoSelecionado] = useState<ArtigoEducativo | null>(null);
  const [dicaExpandida, setDicaExpandida] = useState<string | null>(null);

  // Dados filtrados
  const dadosFiltrados = {
    glossario: glossario.filter(termo => 
      (!termoPesquisa || termo.termo.toLowerCase().includes(termoPesquisa.toLowerCase()) ||
       termo.definicao.toLowerCase().includes(termoPesquisa.toLowerCase())) &&
      (!filtroCategoria || termo.categoria === filtroCategoria)
    ),
    dicas: dicas.filter(dica =>
      (!termoPesquisa || dica.titulo.toLowerCase().includes(termoPesquisa.toLowerCase()) ||
       dica.conteudo.toLowerCase().includes(termoPesquisa.toLowerCase())) &&
      (!filtroCategoria || dica.categoria === filtroCategoria) &&
      (!filtroNivel || dica.nivel === filtroNivel)
    ),
    tutoriais: tutoriais.filter(tutorial =>
      (!termoPesquisa || tutorial.titulo.toLowerCase().includes(termoPesquisa.toLowerCase()) ||
       tutorial.descricao.toLowerCase().includes(termoPesquisa.toLowerCase())) &&
      (!filtroCategoria || tutorial.categoria === filtroCategoria) &&
      (!filtroNivel || tutorial.nivel === filtroNivel)
    ),
    artigos: artigos.filter(artigo =>
      (!termoPesquisa || artigo.titulo.toLowerCase().includes(termoPesquisa.toLowerCase()) ||
       artigo.resumo.toLowerCase().includes(termoPesquisa.toLowerCase())) &&
      (!filtroCategoria || artigo.categoria === filtroCategoria) &&
      (!filtroNivel || artigo.nivel === filtroNivel)
    )
  };

  // Recomendações
  const recomendacoes = obterRecomendacoes();
  const dicasContextuais = obterDicasContextuais('geral');

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-lg ${className}`}>
      {/* Cabeçalho */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <GraduationCap className="w-8 h-8 text-blue-600" />
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Educação Financeira
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Aprenda e evolua seus conhecimentos financeiros
              </p>
            </div>
          </div>
          
          {/* Estatísticas do usuário */}
          {estatisticas && (
            <div className="flex items-center space-x-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {estatisticas.nivel}
                </div>
                <div className="text-xs text-gray-500">Nível</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {estatisticas.conquistasDesbloqueadas}
                </div>
                <div className="text-xs text-gray-500">Conquistas</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {Math.round(estatisticas.tempoTotalEstudo)}m
                </div>
                <div className="text-xs text-gray-500">Estudo</div>
              </div>
            </div>
          )}
        </div>

        {/* Barra de progresso do nível */}
        {estatisticas && (
          <div className="mt-4">
            <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 mb-1">
              <span>Progresso do Nível {estatisticas.nivel}</span>
              <span>{estatisticas.experiencia}/{estatisticas.proximoNivel} XP</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${estatisticas.progressoNivel}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Navegação */}
      <div className="flex border-b border-gray-200 dark:border-gray-700">
        {[
          { id: 'inicio', label: 'Início', icon: BookOpen },
          { id: 'glossario', label: 'Glossário', icon: Brain },
          { id: 'dicas', label: 'Dicas', icon: Lightbulb },
          { id: 'tutoriais', label: 'Tutoriais', icon: Play },
          { id: 'artigos', label: 'Artigos', icon: BookOpen },
          { id: 'perfil', label: 'Perfil', icon: Users }
        ].map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setAbaSelecionada(id as any)}
            className={`flex items-center space-x-2 px-6 py-3 border-b-2 transition-colors ${
              abaSelecionada === id
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <Icon className="w-4 h-4" />
            <span>{label}</span>
          </button>
        ))}
      </div>

      {/* Conteúdo */}
      <div className="p-6">
        {/* Aba Início */}
        {abaSelecionada === 'inicio' && (
          <div className="space-y-6">
            {/* Recomendações */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Recomendado para Você
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {recomendacoes.slice(0, 3).map((rec) => (
                  <div key={rec.id} className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                    <div className="flex items-center space-x-2 mb-2">
                      {rec.tipo === 'tutorial' && <Play className="w-4 h-4 text-blue-600" />}
                      {rec.tipo === 'artigo' && <BookOpen className="w-4 h-4 text-blue-600" />}
                      <span className="text-xs font-medium text-blue-600 uppercase">
                        {rec.tipo}
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
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
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
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
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

        {/* Aba Glossário */}
        {abaSelecionada === 'glossario' && (
          <div className="space-y-6">
            {/* Busca e Filtros */}
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
              <select
                value={filtroCategoria}
                onChange={(e) => setFiltroCategoria(e.target.value)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="">Todas as categorias</option>
                <option value="basico">Básico</option>
                <option value="intermediario">Intermediário</option>
                <option value="avancado">Avançado</option>
              </select>
            </div>

            {/* Lista de Termos */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {dadosFiltrados.glossario.map((termo) => (
                <div key={termo.id} className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-gray-900 dark:text-white">
                      {termo.termo}
                    </h4>
                    <span className={`text-xs px-2 py-1 rounded ${
                      termo.categoria === 'basico' ? 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-200' :
                      termo.categoria === 'intermediario' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-200' :
                      'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-200'
                    }`}>
                      {termo.categoria}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    {termo.definicao}
                  </p>
                  {termo.exemplos.length > 0 && (
                    <div className="mb-3">
                      <h5 className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Exemplos:
                      </h5>
                      <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                        {termo.exemplos.map((exemplo, index) => (
                          <li key={index}>• {exemplo}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  <div className="flex flex-wrap gap-1">
                    {termo.tags.map((tag) => (
                      <span key={tag} className="text-xs bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-200 px-2 py-1 rounded">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Aba Dicas */}
        {abaSelecionada === 'dicas' && (
          <div className="space-y-6">
            {/* Busca e Filtros */}
            <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Buscar dicas..."
                  value={termoPesquisa}
                  onChange={(e) => setTermoPesquisa(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
              <select
                value={filtroCategoria}
                onChange={(e) => setFiltroCategoria(e.target.value)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="">Todas as categorias</option>
                <option value="investimento">Investimento</option>
                <option value="economia">Economia</option>
                <option value="planejamento">Planejamento</option>
                <option value="impostos">Impostos</option>
                <option value="geral">Geral</option>
              </select>
              <select
                value={filtroNivel}
                onChange={(e) => setFiltroNivel(e.target.value)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="">Todos os níveis</option>
                <option value="iniciante">Iniciante</option>
                <option value="intermediario">Intermediário</option>
                <option value="avancado">Avançado</option>
              </select>
            </div>

            {/* Lista de Dicas */}
            <div className="space-y-4">
              {dadosFiltrados.dicas.map((dica) => (
                <div key={dica.id} className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      <Lightbulb className="w-5 h-5 text-yellow-600" />
                      <h4 className="font-semibold text-gray-900 dark:text-white">
                        {dica.titulo}
                      </h4>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`text-xs px-2 py-1 rounded ${
                        dica.nivel === 'iniciante' ? 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-200' :
                        dica.nivel === 'intermediario' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-200' :
                        'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-200'
                      }`}>
                        {dica.nivel}
                      </span>
                      <div className="flex items-center space-x-1 text-gray-500">
                        <Star className="w-4 h-4" />
                        <span className="text-sm">{dica.relevancia}</span>
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 dark:text-gray-400 mb-3">
                    {dicaExpandida === dica.id ? dica.conteudo : `${dica.conteudo.slice(0, 150)}...`}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex flex-wrap gap-1">
                      {dica.tags.map((tag) => (
                        <span key={tag} className="text-xs bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-300 px-2 py-1 rounded">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setDicaExpandida(dicaExpandida === dica.id ? null : dica.id)}
                        className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                      >
                        {dicaExpandida === dica.id ? 'Menos' : 'Mais'}
                      </button>
                      <button className="text-gray-400 hover:text-red-500">
                        <Heart className="w-4 h-4" />
                      </button>
                      <button className="text-gray-400 hover:text-blue-500">
                        <Share2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Aba Tutoriais */}
        {abaSelecionada === 'tutoriais' && (
          <div className="space-y-6">
            {tutorialSelecionado ? (
              <TutorialViewer 
                tutorial={tutorialSelecionado}
                onClose={() => setTutorialSelecionado(null)}
                onComplete={(id) => {
                  completarTutorial(id);
                  setTutorialSelecionado(null);
                }}
              />
            ) : (
              <>
                {/* Busca e Filtros */}
                <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Buscar tutoriais..."
                      value={termoPesquisa}
                      onChange={(e) => setTermoPesquisa(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  <select
                    value={filtroCategoria}
                    onChange={(e) => setFiltroCategoria(e.target.value)}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  >
                    <option value="">Todas as categorias</option>
                    <option value="calculadora">Calculadora</option>
                    <option value="investimentos">Investimentos</option>
                    <option value="planejamento">Planejamento</option>
                    <option value="analise">Análise</option>
                  </select>
                  <select
                    value={filtroNivel}
                    onChange={(e) => setFiltroNivel(e.target.value)}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  >
                    <option value="">Todos os níveis</option>
                    <option value="iniciante">Iniciante</option>
                    <option value="intermediario">Intermediário</option>
                    <option value="avancado">Avançado</option>
                  </select>
                </div>

                {/* Lista de Tutoriais */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {dadosFiltrados.tutoriais.map((tutorial) => {
                    const jaCompleto = perfil?.tutoriaisCompletos.includes(tutorial.id);
                    
                    return (
                      <div key={tutorial.id} className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg overflow-hidden">
                        <div className="p-4">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-2">
                              <Play className="w-5 h-5 text-blue-600" />
                              {jaCompleto && <CheckCircle className="w-4 h-4 text-green-600" />}
                            </div>
                            <span className={`text-xs px-2 py-1 rounded ${
                              tutorial.nivel === 'iniciante' ? 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-200' :
                              tutorial.nivel === 'intermediario' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-200' :
                              'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-200'
                            }`}>
                              {tutorial.nivel}
                            </span>
                          </div>
                          
                          <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                            {tutorial.titulo}
                          </h4>
                          
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                            {tutorial.descricao}
                          </p>
                          
                          <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                            <div className="flex items-center space-x-1">
                              <Clock className="w-4 h-4" />
                              <span>{tutorial.duracao} min</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Target className="w-4 h-4" />
                              <span>{tutorial.etapas.length} etapas</span>
                            </div>
                          </div>
                          
                          <button
                            onClick={() => setTutorialSelecionado(tutorial)}
                            className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
                              jaCompleto
                                ? 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-200'
                                : 'bg-blue-600 text-white hover:bg-blue-700'
                            }`}
                          >
                            {jaCompleto ? 'Revisar' : 'Começar'}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        )}

        {/* Aba Artigos */}
        {abaSelecionada === 'artigos' && (
          <div className="space-y-6">
            {artigoSelecionado ? (
              <ArtigoViewer 
                artigo={artigoSelecionado}
                onClose={() => setArtigoSelecionado(null)}
                onRead={(id) => {
                  lerArtigo(id);
                  setArtigoSelecionado(null);
                }}
              />
            ) : (
              <>
                {/* Busca e Filtros */}
                <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Buscar artigos..."
                      value={termoPesquisa}
                      onChange={(e) => setTermoPesquisa(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  <select
                    value={filtroCategoria}
                    onChange={(e) => setFiltroCategoria(e.target.value)}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  >
                    <option value="">Todas as categorias</option>
                    <option value="conceitos">Conceitos</option>
                    <option value="estrategias">Estratégias</option>
                    <option value="mercado">Mercado</option>
                    <option value="impostos">Impostos</option>
                    <option value="planejamento">Planejamento</option>
                  </select>
                  <select
                    value={filtroNivel}
                    onChange={(e) => setFiltroNivel(e.target.value)}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  >
                    <option value="">Todos os níveis</option>
                    <option value="iniciante">Iniciante</option>
                    <option value="intermediario">Intermediário</option>
                    <option value="avancado">Avançado</option>
                  </select>
                </div>

                {/* Lista de Artigos */}
                <div className="space-y-4">
                  {dadosFiltrados.artigos.map((artigo) => {
                    const jaLido = perfil?.artigosLidos.includes(artigo.id);
                    
                    return (
                      <div key={artigo.id} className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <BookOpen className="w-5 h-5 text-blue-600" />
                              {jaLido && <CheckCircle className="w-4 h-4 text-green-600" />}
                              <span className={`text-xs px-2 py-1 rounded ${
                                artigo.nivel === 'iniciante' ? 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-200' :
                                artigo.nivel === 'intermediario' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-200' :
                                'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-200'
                              }`}>
                                {artigo.nivel}
                              </span>
                            </div>
                            
                            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                              {artigo.titulo}
                            </h4>
                            
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                              {artigo.resumo}
                            </p>
                            
                            <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                              <div className="flex items-center space-x-1">
                                <Clock className="w-4 h-4" />
                                <span>{artigo.tempoLeitura} min</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Users className="w-4 h-4" />
                                <span>{artigo.visualizacoes} visualizações</span>
                              </div>
                              <span>Por {artigo.autor}</span>
                            </div>
                            
                            <div className="flex flex-wrap gap-1 mb-3">
                              {artigo.tags.map((tag) => (
                                <span key={tag} className="text-xs bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-300 px-2 py-1 rounded">
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>
                          
                          <div className="flex flex-col space-y-2 ml-4">
                            <button
                              onClick={() => setArtigoSelecionado(artigo)}
                              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                            >
                              {jaLido ? 'Reler' : 'Ler'}
                            </button>
                            <button className="text-gray-400 hover:text-yellow-500">
                              <Bookmark className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        )}

        {/* Aba Perfil */}
        {abaSelecionada === 'perfil' && (
          <PerfilEducativo 
            perfil={perfil}
            estatisticas={estatisticas}
            conquistasDesbloqueadas={conquistasDesbloqueadas}
            configuracao={configuracao}
            onConfigChange={setConfiguracao}
          />
        )}
      </div>
    </div>
  );
};

// Componente para visualizar tutorial
const TutorialViewer: React.FC<{
  tutorial: TutorialInterativo;
  onClose: () => void;
  onComplete: (id: string) => void;
}> = ({ tutorial, onClose, onComplete }) => {
  const [etapaAtual, setEtapaAtual] = useState(0);
  const [respostasQuiz, setRespostasQuiz] = useState<{ [key: string]: number }>({});

  const etapa = tutorial.etapas[etapaAtual];
  const isUltimaEtapa = etapaAtual === tutorial.etapas.length - 1;

  const proximaEtapa = () => {
    if (isUltimaEtapa) {
      onComplete(tutorial.id);
    } else {
      setEtapaAtual(etapaAtual + 1);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
      {/* Cabeçalho do Tutorial */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              {tutorial.titulo}
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Etapa {etapaAtual + 1} de {tutorial.etapas.length}: {etapa.titulo}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            ✕
          </button>
        </div>
        
        {/* Barra de Progresso */}
        <div className="mt-4">
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((etapaAtual + 1) / tutorial.etapas.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Conteúdo da Etapa */}
      <div className="p-6">
        <div className="mb-6">
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
            {etapa.titulo}
          </h4>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {etapa.descricao}
          </p>
        </div>

        {/* Conteúdo baseado no tipo */}
        {etapa.tipo === 'explicacao' && etapa.conteudo.texto && (
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg mb-6">
            <p className="text-gray-700 dark:text-gray-300">
              {etapa.conteudo.texto}
            </p>
          </div>
        )}

        {etapa.tipo === 'quiz' && etapa.conteudo.quiz && (
          <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg mb-6">
            <h5 className="font-medium text-gray-900 dark:text-white mb-3">
              {etapa.conteudo.quiz.pergunta}
            </h5>
            <div className="space-y-2">
              {etapa.conteudo.quiz.opcoes.map((opcao, index) => (
                <label key={opcao.id} className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    name={`quiz-${etapa.id}`}
                    value={index}
                    onChange={(e) => setRespostasQuiz({
                      ...respostasQuiz,
                      [etapa.id]: parseInt(e.target.value)
                    })}
                    className="text-blue-600"
                  />
                  <span className="text-gray-700 dark:text-gray-300">
                    {opcao.texto}
                  </span>
                </label>
              ))}
            </div>
            {respostasQuiz[etapa.id] !== undefined && (
              <div className="mt-3 p-3 bg-gray-100 dark:bg-gray-700 rounded">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {etapa.conteudo.quiz.explicacao}
                </p>
              </div>
            )}
          </div>
        )}

        {etapa.tipo === 'interacao' && etapa.conteudo.interacao && (
          <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg mb-6">
            <p className="text-gray-700 dark:text-gray-300 mb-3">
              {etapa.conteudo.interacao.feedback}
            </p>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Ação: {etapa.conteudo.interacao.acao}
            </div>
          </div>
        )}

        {/* Dicas */}
        {etapa.dicas && etapa.dicas.length > 0 && (
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg mb-6">
            <h5 className="font-medium text-gray-900 dark:text-white mb-2">
              💡 Dicas:
            </h5>
            <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
              {etapa.dicas.map((dica, index) => (
                <li key={index}>• {dica}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Navegação */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => setEtapaAtual(Math.max(0, etapaAtual - 1))}
            disabled={etapaAtual === 0}
            className="px-4 py-2 text-gray-600 dark:text-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Anterior
          </button>
          
          <div className="flex items-center space-x-1">
            {tutorial.etapas.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full ${
                  index <= etapaAtual ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
                }`}
              />
            ))}
          </div>
          
          <button
            onClick={proximaEtapa}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            {isUltimaEtapa ? 'Concluir' : 'Próximo'}
          </button>
        </div>
      </div>
    </div>
  );
};

// Componente para visualizar artigo
const ArtigoViewer: React.FC<{
  artigo: ArtigoEducativo;
  onClose: () => void;
  onRead: (id: string) => void;
}> = ({ artigo, onClose, onRead }) => {
  const [progresso, setProgresso] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const element = document.getElementById('artigo-conteudo');
      if (element) {
        const scrollTop = element.scrollTop;
        const scrollHeight = element.scrollHeight - element.clientHeight;
        const progress = (scrollTop / scrollHeight) * 100;
        setProgresso(Math.min(100, Math.max(0, progress)));
      }
    };

    const element = document.getElementById('artigo-conteudo');
    element?.addEventListener('scroll', handleScroll);
    return () => element?.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (progresso >= 80) {
      onRead(artigo.id);
    }
  }, [progresso, artigo.id, onRead]);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
      {/* Cabeçalho do Artigo */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              {artigo.titulo}
            </h3>
            <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
              <span>Por {artigo.autor}</span>
              <span>{artigo.tempoLeitura} min de leitura</span>
              <span>{new Date(artigo.dataPublicacao).toLocaleDateString()}</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            ✕
          </button>
        </div>
        
        {/* Barra de Progresso de Leitura */}
        <div className="mt-4">
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1">
            <div 
              className="bg-blue-600 h-1 rounded-full transition-all duration-300"
              style={{ width: `${progresso}%` }}
            />
          </div>
        </div>
      </div>

      {/* Conteúdo do Artigo */}
      <div 
        id="artigo-conteudo"
        className="p-6 max-h-96 overflow-y-auto"
      >
        <div className="prose dark:prose-invert max-w-none">
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
            {artigo.resumo}
          </p>
          
          <div className="text-gray-700 dark:text-gray-300 leading-relaxed">
            {artigo.conteudo.split('\n').map((paragrafo, index) => (
              <p key={index} className="mb-4">
                {paragrafo}
              </p>
            ))}
          </div>
        </div>
        
        {/* Tags */}
        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
          <div className="flex flex-wrap gap-2">
            {artigo.tags.map((tag) => (
              <span key={tag} className="text-xs bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-200 px-2 py-1 rounded">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Componente do Perfil Educativo
const PerfilEducativo: React.FC<{
  perfil: any;
  estatisticas: any;
  conquistasDesbloqueadas: any[];
  configuracao: any;
  onConfigChange: (config: any) => void;
}> = ({ perfil, estatisticas, conquistasDesbloqueadas, configuracao, onConfigChange }) => {
  if (!perfil || !estatisticas) return null;

  return (
    <div className="space-y-6">
      {/* Estatísticas Gerais */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg text-center">
          <div className="text-2xl font-bold text-blue-600 mb-1">
            {estatisticas.nivel}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Nível Atual
          </div>
        </div>
        
        <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg text-center">
          <div className="text-2xl font-bold text-green-600 mb-1">
            {estatisticas.tutoriaisCompletos}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Tutoriais Completos
          </div>
        </div>
        
        <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg text-center">
          <div className="text-2xl font-bold text-purple-600 mb-1">
            {Math.round(estatisticas.tempoTotalEstudo)}m
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Tempo de Estudo
          </div>
        </div>
        
        <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg text-center">
          <div className="text-2xl font-bold text-yellow-600 mb-1">
            {estatisticas.conquistasDesbloqueadas}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Conquistas
          </div>
        </div>
      </div>

      {/* Conquistas Desbloqueadas */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Conquistas Desbloqueadas
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {conquistasDesbloqueadas.map((conquista) => (
            <div key={conquista.id} className="bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 p-4 rounded-lg border border-yellow-200 dark:border-yellow-800">
              <div className="flex items-center space-x-3 mb-2">
                <span className="text-2xl">{conquista.icone}</span>
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">
                    {conquista.nome}
                  </h4>
                  <p className="text-xs text-yellow-600 dark:text-yellow-400">
                    {conquista.raridade}
                  </p>
                </div>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {conquista.descricao}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Configurações */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Configurações de Aprendizado
        </h3>
        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg space-y-4">
          <label className="flex items-center justify-between">
            <span className="text-gray-700 dark:text-gray-300">
              Dicas Contextuais
            </span>
            <input
              type="checkbox"
              checked={configuracao.dicasContextuais}
              onChange={(e) => onConfigChange({
                ...configuracao,
                dicasContextuais: e.target.checked
              })}
              className="rounded border-gray-300"
            />
          </label>
          
          <label className="flex items-center justify-between">
            <span className="text-gray-700 dark:text-gray-300">
              Explicações Detalhadas
            </span>
            <input
              type="checkbox"
              checked={configuracao.explicacoesDetalhadas}
              onChange={(e) => onConfigChange({
                ...configuracao,
                explicacoesDetalhadas: e.target.checked
              })}
              className="rounded border-gray-300"
            />
          </label>
          
          <label className="flex items-center justify-between">
            <span className="text-gray-700 dark:text-gray-300">
              Gamificação
            </span>
            <input
              type="checkbox"
              checked={configuracao.gamificacao}
              onChange={(e) => onConfigChange({
                ...configuracao,
                gamificacao: e.target.checked
              })}
              className="rounded border-gray-300"
            />
          </label>
          
          <div>
            <label className="block text-gray-700 dark:text-gray-300 mb-2">
              Nível de Dificuldade
            </label>
            <select
              value={configuracao.nivelDificuldade}
              onChange={(e) => onConfigChange({
                ...configuracao,
                nivelDificuldade: e.target.value
              })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-600 dark:text-white"
            >
              <option value="automatico">Automático</option>
              <option value="iniciante">Iniciante</option>
              <option value="intermediario">Intermediário</option>
              <option value="avancado">Avançado</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SistemaEducacao;