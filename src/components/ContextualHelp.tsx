import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  HelpCircle, 
  X, 
  Search, 
  Book, 
  Video, 
  FileText, 
  ExternalLink,
  ChevronRight,
  Star,
  Clock,
  User,
  MessageCircle,
  Lightbulb,
  AlertCircle,
  CheckCircle,
  Play
} from 'lucide-react';
import { useMicroInteractions } from '../hooks/useMicroInteractions';
import { Z_INDEX } from '../constants/zIndex';

export interface HelpArticle {
  id: string;
  title: string;
  content: string;
  category: 'tutorial' | 'faq' | 'guide' | 'troubleshooting' | 'feature';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: number;
  tags: string[];
  lastUpdated: Date;
  author: string;
  rating: number;
  views: number;
  relatedArticles?: string[];
  videoUrl?: string;
  attachments?: Array<{
    name: string;
    url: string;
    type: 'pdf' | 'image' | 'video' | 'link';
  }>;
}

export interface HelpSection {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  articles: HelpArticle[];
  featured?: boolean;
}

interface ContextualHelpProps {
  isOpen: boolean;
  onClose: () => void;
  context?: string;
  searchQuery?: string;
}

export const ContextualHelp: React.FC<ContextualHelpProps> = ({
  isOpen,
  onClose,
  context,
  searchQuery: initialSearchQuery = ''
}) => {
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedArticle, setSelectedArticle] = useState<HelpArticle | null>(null);
  const [searchResults, setSearchResults] = useState<HelpArticle[]>([]);
  const [recentlyViewed, setRecentlyViewed] = useState<HelpArticle[]>([]);
  const [bookmarked, setBookmarked] = useState<Set<string>>(new Set());

  const searchInputRef = useRef<HTMLInputElement>(null);
  const { useButtonInteraction, playSound } = useMicroInteractions();
  const buttonInteraction = useButtonInteraction({ animation: 'scale', haptic: true });

  // Dados de exemplo para artigos de ajuda
  const helpSections: HelpSection[] = [
    {
      id: 'getting-started',
      title: 'Primeiros Passos',
      description: 'Aprenda o básico da plataforma Jurus',
      icon: <Play className="w-5 h-5" />,
      featured: true,
      articles: [
        {
          id: 'intro-jurus',
          title: 'Introdução ao Jurus',
          content: 'Bem-vindo ao Jurus! Esta plataforma foi desenvolvida para ajudar você a gerenciar seus investimentos de forma inteligente e gratuita.',
          category: 'tutorial',
          difficulty: 'beginner',
          estimatedTime: 5,
          tags: ['introdução', 'básico', 'overview'],
          lastUpdated: new Date(),
          author: 'Equipe Jurus',
          rating: 4.8,
          views: 1250,
          videoUrl: 'https://example.com/intro-video'
        },
        {
          id: 'first-portfolio',
          title: 'Criando seu Primeiro Portfólio',
          content: 'Aprenda como criar e configurar seu primeiro portfólio de investimentos no Jurus.',
          category: 'tutorial',
          difficulty: 'beginner',
          estimatedTime: 10,
          tags: ['portfólio', 'criação', 'tutorial'],
          lastUpdated: new Date(),
          author: 'Equipe Jurus',
          rating: 4.9,
          views: 980
        }
      ]
    },
    {
      id: 'features',
      title: 'Funcionalidades',
      description: 'Explore todas as funcionalidades disponíveis',
      icon: <Star className="w-5 h-5" />,
      articles: [
        {
          id: 'simulation-guide',
          title: 'Guia de Simulação de Juros',
          content: 'Aprenda como usar a calculadora de juros compostos para planejar seus investimentos.',
          category: 'guide',
          difficulty: 'beginner',
          estimatedTime: 10,
          tags: ['simulação', 'juros', 'planejamento'],
          lastUpdated: new Date(),
          author: 'Equipe Jurus',
          rating: 4.8,
          views: 1200
        },
        {
          id: 'education-guide',
          title: 'Sistema de Educação Financeira',
          content: 'Explore os recursos educacionais para melhorar seus conhecimentos financeiros.',
          category: 'feature',
          difficulty: 'beginner',
          estimatedTime: 8,
          tags: ['educação', 'aprendizado', 'finanças'],
          lastUpdated: new Date(),
          author: 'Equipe Jurus',
          rating: 4.7,
          views: 850
        }
      ]
    },
    {
      id: 'troubleshooting',
      title: 'Solução de Problemas',
      description: 'Resolva problemas comuns rapidamente',
      icon: <AlertCircle className="w-5 h-5" />,
      articles: [
        {
          id: 'common-issues',
          title: 'Problemas Comuns e Soluções',
          content: 'Lista dos problemas mais comuns e suas soluções.',
          category: 'troubleshooting',
          difficulty: 'beginner',
          estimatedTime: 8,
          tags: ['problemas', 'soluções', 'faq'],
          lastUpdated: new Date(),
          author: 'Equipe Jurus',
          rating: 4.5,
          views: 420
        }
      ]
    }
  ];

  const allArticles = helpSections.flatMap(section => section.articles);

  // Buscar artigos
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    const results = allArticles.filter(article => 
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    setSearchResults(results);
  }, [searchQuery]);

  // Focar no input quando abrir
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      setTimeout(() => searchInputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // Busca contextual baseada na página atual
  useEffect(() => {
    if (context && isOpen) {
      const contextualResults = allArticles.filter(article =>
        article.tags.some(tag => tag.toLowerCase().includes(context.toLowerCase()))
      );
      if (contextualResults.length > 0) {
        setSearchResults(contextualResults);
      }
    }
  }, [context, isOpen]);

  const handleArticleClick = (article: HelpArticle) => {
    setSelectedArticle(article);
    
    // Adicionar aos recentemente visualizados
    setRecentlyViewed(prev => {
      const filtered = prev.filter(a => a.id !== article.id);
      return [article, ...filtered].slice(0, 5);
    });

    playSound(600, 100);
  };

  const toggleBookmark = (articleId: string) => {
    setBookmarked(prev => {
      const newBookmarked = new Set(prev);
      if (newBookmarked.has(articleId)) {
        newBookmarked.delete(articleId);
      } else {
        newBookmarked.add(articleId);
      }
      return newBookmarked;
    });
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'text-green-600 bg-green-100 dark:bg-green-900/30';
      case 'intermediate': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30';
      case 'advanced': return 'text-red-600 bg-red-100 dark:bg-red-900/30';
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-900/30';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'tutorial': return <Play className="w-4 h-4" />;
      case 'guide': return <Book className="w-4 h-4" />;
      case 'faq': return <MessageCircle className="w-4 h-4" />;
      case 'troubleshooting': return <AlertCircle className="w-4 h-4" />;
      case 'feature': return <Star className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div 
        className="fixed inset-0 flex items-center justify-center p-4"
        style={{ zIndex: Z_INDEX.CONTEXTUAL_HELP }}
      >
        {/* Overlay */}
        <motion.div
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        />

        {/* Modal */}
        <motion.div
          className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 w-full max-w-4xl h-[80vh] flex flex-col"
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ duration: 0.3 }}
        >
          {/* Header */}
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                  <HelpCircle className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    Central de Ajuda
                  </h2>
                  <p className="text-sm text-gray-500">
                    Encontre respostas e aprenda a usar o Jurus
                  </p>
                </div>
              </div>
              <motion.button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Fechar ajuda"
              >
                <X className="w-5 h-5" />
              </motion.button>
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Buscar artigos de ajuda..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex-1 flex overflow-hidden">
            {/* Sidebar */}
            {!selectedArticle && (
              <div className="w-80 border-r border-gray-200 dark:border-gray-700 p-6 overflow-y-auto">
                {/* Categories */}
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                    Categorias
                  </h3>
                  <div className="space-y-1">
                    <button
                      onClick={() => setSelectedCategory('all')}
                      className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                        selectedCategory === 'all'
                          ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600'
                          : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                      }`}
                    >
                      Todos os artigos
                    </button>
                    {helpSections.map(section => (
                      <button
                        key={section.id}
                        onClick={() => setSelectedCategory(section.id)}
                        className={`w-full text-left px-3 py-2 rounded-lg transition-colors flex items-center gap-2 ${
                          selectedCategory === section.id
                            ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600'
                            : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                        }`}
                      >
                        {section.icon}
                        <span className="text-sm">{section.title}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Recently Viewed */}
                {recentlyViewed.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                      Visualizados Recentemente
                    </h3>
                    <div className="space-y-2">
                      {recentlyViewed.map(article => (
                        <button
                          key={article.id}
                          onClick={() => handleArticleClick(article)}
                          className="w-full text-left p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                        >
                          <div className="text-sm font-medium text-gray-900 dark:text-white truncate">
                            {article.title}
                          </div>
                          <div className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                            <Clock className="w-3 h-3" />
                            {article.estimatedTime} min
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Main Content */}
            <div className="flex-1 overflow-y-auto">
              {selectedArticle ? (
                /* Article View */
                <div className="p-6">
                  <div className="mb-6">
                    <button
                      onClick={() => setSelectedArticle(null)}
                      className="flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors mb-4"
                    >
                      <ChevronRight className="w-4 h-4 rotate-180" />
                      Voltar aos artigos
                    </button>

                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                          {selectedArticle.title}
                        </h1>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <User className="w-4 h-4" />
                            {selectedArticle.author}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {selectedArticle.estimatedTime} min de leitura
                          </div>
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-yellow-500" />
                            {selectedArticle.rating}
                          </div>
                        </div>
                      </div>
                      <motion.button
                        onClick={() => toggleBookmark(selectedArticle.id)}
                        className={`p-2 rounded-lg transition-colors ${
                          bookmarked.has(selectedArticle.id)
                            ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600'
                            : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                        }`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Star className={`w-5 h-5 ${
                          bookmarked.has(selectedArticle.id) ? 'fill-current' : ''
                        }`} />
                      </motion.button>
                    </div>

                    <div className="flex items-center gap-2 mb-6">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(selectedArticle.difficulty)}`}>
                        {selectedArticle.difficulty === 'beginner' && 'Iniciante'}
                        {selectedArticle.difficulty === 'intermediate' && 'Intermediário'}
                        {selectedArticle.difficulty === 'advanced' && 'Avançado'}
                      </span>
                      <span className="flex items-center gap-1 px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded-full text-xs">
                        {getCategoryIcon(selectedArticle.category)}
                        {selectedArticle.category}
                      </span>
                    </div>
                  </div>

                  {/* Video */}
                  {selectedArticle.videoUrl && (
                    <div className="mb-6">
                      <div className="bg-gray-100 dark:bg-gray-800 rounded-xl p-4 flex items-center gap-3">
                        <Video className="w-5 h-5 text-blue-600" />
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900 dark:text-white">
                            Vídeo Tutorial
                          </h3>
                          <p className="text-sm text-gray-500">
                            Assista ao tutorial em vídeo para este artigo
                          </p>
                        </div>
                        <motion.button
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          Assistir
                        </motion.button>
                      </div>
                    </div>
                  )}

                  {/* Content */}
                  <div className="prose dark:prose-invert max-w-none">
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      {selectedArticle.content}
                    </p>
                  </div>

                  {/* Tags */}
                  <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                      Tags
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedArticle.tags.map(tag => (
                        <span
                          key={tag}
                          className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full text-sm"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                /* Articles List */
                <div className="p-6">
                  {searchQuery && searchResults.length > 0 ? (
                    /* Search Results */
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        Resultados da busca para "{searchQuery}"
                      </h2>
                      <div className="space-y-4">
                        {searchResults.map(article => (
                          <motion.div
                            key={article.id}
                            className="p-4 border border-gray-200 dark:border-gray-700 rounded-xl hover:border-blue-300 dark:hover:border-blue-600 transition-colors cursor-pointer"
                            onClick={() => handleArticleClick(article)}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                                  {article.title}
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-2">
                                  {article.content}
                                </p>
                                <div className="flex items-center gap-3 text-xs text-gray-500">
                                  <span className={`px-2 py-1 rounded-full ${getDifficultyColor(article.difficulty)}`}>
                                    {article.difficulty}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    {article.estimatedTime} min
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <Star className="w-3 h-3 text-yellow-500" />
                                    {article.rating}
                                  </span>
                                </div>
                              </div>
                              <ChevronRight className="w-5 h-5 text-gray-400" />
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  ) : searchQuery && searchResults.length === 0 ? (
                    /* No Results */
                    <div className="text-center py-12">
                      <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        Nenhum resultado encontrado
                      </h3>
                      <p className="text-gray-500">
                        Tente usar palavras-chave diferentes ou navegue pelas categorias
                      </p>
                    </div>
                  ) : (
                    /* Categories View */
                    <div>
                      {selectedCategory === 'all' ? (
                        <div>
                          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                            Todos os Artigos
                          </h2>
                          {helpSections.map(section => (
                            <div key={section.id} className="mb-8">
                              <div className="flex items-center gap-3 mb-4">
                                <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                                  {section.icon}
                                </div>
                                <div>
                                  <h3 className="font-semibold text-gray-900 dark:text-white">
                                    {section.title}
                                  </h3>
                                  <p className="text-sm text-gray-500">
                                    {section.description}
                                  </p>
                                </div>
                              </div>
                              <div className="grid gap-4">
                                {section.articles.map(article => (
                                  <motion.div
                                    key={article.id}
                                    className="p-4 border border-gray-200 dark:border-gray-700 rounded-xl hover:border-blue-300 dark:hover:border-blue-600 transition-colors cursor-pointer"
                                    onClick={() => handleArticleClick(article)}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                  >
                                    <div className="flex items-start justify-between">
                                      <div className="flex-1">
                                        <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                                          {article.title}
                                        </h4>
                                        <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-2">
                                          {article.content}
                                        </p>
                                        <div className="flex items-center gap-3 text-xs text-gray-500">
                                          <span className={`px-2 py-1 rounded-full ${getDifficultyColor(article.difficulty)}`}>
                                            {article.difficulty}
                                          </span>
                                          <span className="flex items-center gap-1">
                                            <Clock className="w-3 h-3" />
                                            {article.estimatedTime} min
                                          </span>
                                          <span className="flex items-center gap-1">
                                            <Star className="w-3 h-3 text-yellow-500" />
                                            {article.rating}
                                          </span>
                                        </div>
                                      </div>
                                      <ChevronRight className="w-5 h-5 text-gray-400" />
                                    </div>
                                  </motion.div>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div>
                          {helpSections
                            .filter(section => section.id === selectedCategory)
                            .map(section => (
                              <div key={section.id}>
                                <div className="flex items-center gap-3 mb-6">
                                  <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                                    {section.icon}
                                  </div>
                                  <div>
                                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                                      {section.title}
                                    </h2>
                                    <p className="text-gray-500">
                                      {section.description}
                                    </p>
                                  </div>
                                </div>
                                <div className="grid gap-4">
                                  {section.articles.map(article => (
                                    <motion.div
                                      key={article.id}
                                      className="p-4 border border-gray-200 dark:border-gray-700 rounded-xl hover:border-blue-300 dark:hover:border-blue-600 transition-colors cursor-pointer"
                                      onClick={() => handleArticleClick(article)}
                                      whileHover={{ scale: 1.02 }}
                                      whileTap={{ scale: 0.98 }}
                                    >
                                      <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                          <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                                            {article.title}
                                          </h3>
                                          <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-2">
                                            {article.content}
                                          </p>
                                          <div className="flex items-center gap-3 text-xs text-gray-500">
                                            <span className={`px-2 py-1 rounded-full ${getDifficultyColor(article.difficulty)}`}>
                                              {article.difficulty}
                                            </span>
                                            <span className="flex items-center gap-1">
                                              <Clock className="w-3 h-3" />
                                              {article.estimatedTime} min
                                            </span>
                                            <span className="flex items-center gap-1">
                                              <Star className="w-3 h-3 text-yellow-500" />
                                              {article.rating}
                                            </span>
                                          </div>
                                        </div>
                                        <ChevronRight className="w-5 h-5 text-gray-400" />
                                      </div>
                                    </motion.div>
                                  ))}
                                </div>
                              </div>
                            ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

// Hook para gerenciar ajuda contextual
export const useContextualHelp = () => {
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [helpContext, setHelpContext] = useState<string>('');

  const openHelp = (context?: string) => {
    if (context) setHelpContext(context);
    setIsHelpOpen(true);
  };

  const closeHelp = () => {
    setIsHelpOpen(false);
    setHelpContext('');
  };

  return {
    isHelpOpen,
    helpContext,
    openHelp,
    closeHelp
  };
};