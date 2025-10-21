import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { Home } from '../components/Home';

// Lazy loading dos componentes com preload hints
const SistemaTemasAvancado = lazy(() => import('../components/SistemaTemasAvancado'));
const SistemaEducacao = lazy(() => import('../components/SistemaEducacao'));
const CentroNotificacoes = lazy(() => import('../components/CentroNotificacoes'));
const ConfiguracoesAcessibilidade = lazy(() => 
  import('../components/ConfiguracoesAcessibilidade').then(module => ({ 
    default: module.ConfiguracoesAcessibilidade 
  }))
);

const EducacaoFinanceira = lazy(() => import('../pages/EducacaoFinanceira'));

// Componente de Loading aprimorado com acessibilidade
function PageLoader() {
  return (
    <div 
      className="flex items-center justify-center min-h-[60vh]"
      role="status"
      aria-live="polite"
      aria-label="Carregando página"
    >
      <div className="flex flex-col items-center space-y-4">
        <div 
          className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"
          aria-hidden="true"
        ></div>
        <p className="text-gray-600 dark:text-gray-400 sr-only">
          Carregando conteúdo da página...
        </p>
        <div className="text-gray-600 dark:text-gray-400">Carregando...</div>
      </div>
    </div>
  );
}

// Error Boundary para lazy loading
class LazyLoadErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback?: React.ReactNode },
  { hasError: boolean; error?: Error }
> {
  constructor(props: { children: React.ReactNode; fallback?: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Lazy loading error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div 
          className="flex flex-col items-center justify-center min-h-[60vh] text-center p-4"
          role="alert"
          aria-live="assertive"
        >
          <h2 className="text-xl font-semibold text-red-600 dark:text-red-400 mb-2">
            Erro ao carregar página
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Ocorreu um erro inesperado. Tente recarregar a página.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            aria-label="Recarregar página"
          >
            Recarregar
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

// Componente 404 aprimorado
function NotFound() {
  return (
    <div 
      className="flex flex-col items-center justify-center min-h-[60vh] text-center p-4"
      role="main"
      aria-labelledby="not-found-title"
    >
      <h1 
        id="not-found-title"
        className="text-6xl font-bold text-gray-300 dark:text-gray-600 mb-4"
        aria-label="Erro 404"
      >
        404
      </h1>
      <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
        Página não encontrada
      </h2>
      <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-md">
        A página que você está procurando não existe ou foi movida.
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={() => window.history.back()}
          className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          aria-label="Voltar para página anterior"
        >
          Voltar
        </button>
        <button
          onClick={() => window.location.href = '/'}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          aria-label="Ir para página inicial"
        >
          Página Inicial
        </button>
      </div>
    </div>
  );
}

// Wrapper para lazy loading com error boundary
function LazyRoute({ children }: { children: React.ReactNode }) {
  return (
    <LazyLoadErrorBoundary>
      <Suspense fallback={<PageLoader />}>
        {children}
      </Suspense>
    </LazyLoadErrorBoundary>
  );
}

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          {/* Rota principal - sem lazy loading para melhor UX inicial */}
          <Route index element={<Home />} />
          
          
          {/* Sistema de Temas */}
          <Route 
            path="sistema-temas" 
            element={
              <LazyRoute>
                <div className="min-h-screen bg-gray-50 p-4">
                  <SistemaTemasAvancado onFechar={() => window.history.back()} />
                </div>
              </LazyRoute>
            } 
          />
          
          {/* Sistema de Educação */}
          <Route 
            path="sistema-educacao" 
            element={
              <LazyRoute>
                <SistemaEducacao />
              </LazyRoute>
            } 
          />
          
          {/* Centro de Notificações */}
          <Route 
            path="notificacoes" 
            element={
              <LazyRoute>
                <CentroNotificacoes />
              </LazyRoute>
            } 
          />
          
          {/* Configurações de Acessibilidade */}
          <Route 
            path="acessibilidade" 
            element={
              <LazyRoute>
                <ConfiguracoesAcessibilidade />
              </LazyRoute>
            } 
          />
          
          {/* Educação Financeira */}
          <Route 
            path="educacao-financeira" 
            element={
              <LazyRoute>
                <EducacaoFinanceira />
              </LazyRoute>
            } 
          />
          
          {/* Redirecionamentos para compatibilidade */}
          <Route path="home" element={<Navigate to="/" replace />} />
          <Route path="calculadora" element={<Navigate to="/" replace />} />
          <Route path="temas" element={<Navigate to="/sistema-temas" replace />} />
          <Route path="educacao" element={<Navigate to="/sistema-educacao" replace />} />
          
          {/* Página 404 */}
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}