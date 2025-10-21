import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home, Bug } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  level?: 'page' | 'component' | 'critical';
  showDetails?: boolean;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  errorId: string;
}

export class ErrorBoundary extends Component<Props, State> {
  private retryCount = 0;
  private maxRetries = 3;

  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: ''
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return {
      hasError: true,
      error,
      errorId: `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({
      error,
      errorInfo
    });

    // Log error
    this.logError(error, errorInfo);

    // Call custom error handler
    this.props.onError?.(error, errorInfo);

    // Report to error tracking service (if available)
    this.reportError(error, errorInfo);
  }

  private logError(error: Error, errorInfo: ErrorInfo) {
    const errorData = {
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      errorId: this.state.errorId,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
      level: this.props.level || 'component'
    };

    console.group(`🚨 Error Boundary - ${this.props.level || 'Component'} Level`);
    console.error('Error:', error);
    console.error('Error Info:', errorInfo);
    console.error('Error Data:', errorData);
    console.groupEnd();

    // Store in localStorage for debugging
    try {
      const existingErrors = JSON.parse(localStorage.getItem('jurus_errors') || '[]');
      existingErrors.push(errorData);
      
      // Keep only last 10 errors
      if (existingErrors.length > 10) {
        existingErrors.splice(0, existingErrors.length - 10);
      }
      
      localStorage.setItem('jurus_errors', JSON.stringify(existingErrors));
    } catch (e) {
      console.warn('Failed to store error in localStorage:', e);
    }
  }

  private reportError(error: Error, errorInfo: ErrorInfo) {
    // Here you would integrate with error reporting services like Sentry, LogRocket, etc.
    // For now, we'll just prepare the data structure
    const errorReport = {
      errorId: this.state.errorId,
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      level: this.props.level || 'component',
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
      userId: localStorage.getItem('userId') || 'anonymous',
      sessionId: sessionStorage.getItem('sessionId') || 'unknown'
    };

    // Simulate error reporting (replace with actual service)
    console.log('Error report prepared:', errorReport);
  }

  private handleRetry = () => {
    if (this.retryCount < this.maxRetries) {
      this.retryCount++;
      this.setState({
        hasError: false,
        error: null,
        errorInfo: null,
        errorId: ''
      });
    }
  };

  private handleReload = () => {
    window.location.reload();
  };

  private handleGoHome = () => {
    window.location.href = '/';
  };

  private renderErrorDetails() {
    const { error, errorInfo, errorId } = this.state;
    
    if (!this.props.showDetails || !error) return null;

    return (
      <details className="mt-4 p-4 bg-gray-50 rounded-lg border">
        <summary className="cursor-pointer font-medium text-gray-700 hover:text-gray-900">
          Detalhes Técnicos
        </summary>
        <div className="mt-3 space-y-3 text-sm">
          <div>
            <strong>ID do Erro:</strong>
            <code className="ml-2 px-2 py-1 bg-gray-200 rounded text-xs">{errorId}</code>
          </div>
          <div>
            <strong>Mensagem:</strong>
            <pre className="mt-1 p-2 bg-gray-100 rounded text-xs overflow-auto">
              {error.message}
            </pre>
          </div>
          <div>
            <strong>Stack Trace:</strong>
            <pre className="mt-1 p-2 bg-gray-100 rounded text-xs overflow-auto max-h-32">
              {error.stack}
            </pre>
          </div>
          {errorInfo && (
            <div>
              <strong>Component Stack:</strong>
              <pre className="mt-1 p-2 bg-gray-100 rounded text-xs overflow-auto max-h-32">
                {errorInfo.componentStack}
              </pre>
            </div>
          )}
        </div>
      </details>
    );
  }

  private renderComponentError() {
    const { error } = this.state;
    const canRetry = this.retryCount < this.maxRetries;

    return (
      <div className="p-4 border border-red-200 bg-red-50 rounded-lg">
        <div className="flex items-start">
          <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
          <div className="ml-3 flex-1">
            <h3 className="text-sm font-medium text-red-800">
              Erro no Componente
            </h3>
            <p className="mt-1 text-sm text-red-700">
              {error?.message || 'Ocorreu um erro inesperado neste componente.'}
            </p>
            {canRetry && (
              <div className="mt-3">
                <button
                  onClick={this.handleRetry}
                  className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  <RefreshCw className="h-3 w-3 mr-1" />
                  Tentar Novamente ({this.maxRetries - this.retryCount} tentativas restantes)
                </button>
              </div>
            )}
            {this.renderErrorDetails()}
          </div>
        </div>
      </div>
    );
  }

  private renderPageError() {
    const { error } = this.state;

    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <div className="text-center">
              <AlertTriangle className="mx-auto h-12 w-12 text-red-500" />
              <h2 className="mt-4 text-lg font-medium text-gray-900">
                Ops! Algo deu errado
              </h2>
              <p className="mt-2 text-sm text-gray-600">
                {error?.message || 'Ocorreu um erro inesperado. Nossa equipe foi notificada.'}
              </p>
            </div>

            <div className="mt-6 space-y-3">
              <button
                onClick={this.handleRetry}
                className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Tentar Novamente
              </button>

              <button
                onClick={this.handleGoHome}
                className="w-full flex justify-center items-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <Home className="h-4 w-4 mr-2" />
                Voltar ao Início
              </button>

              <button
                onClick={this.handleReload}
                className="w-full flex justify-center items-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Recarregar Página
              </button>
            </div>

            {this.renderErrorDetails()}

            <div className="mt-6 text-center">
              <p className="text-xs text-gray-500">
                ID do Erro: {this.state.errorId}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  private renderCriticalError() {
    return (
      <div className="min-h-screen bg-red-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 border-2 border-red-200">
            <div className="text-center">
              <Bug className="mx-auto h-12 w-12 text-red-600" />
              <h2 className="mt-4 text-lg font-medium text-red-900">
                Erro Crítico do Sistema
              </h2>
              <p className="mt-2 text-sm text-red-700">
                O sistema encontrou um erro crítico e precisa ser reiniciado.
              </p>
            </div>

            <div className="mt-6">
              <button
                onClick={this.handleReload}
                className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Reiniciar Sistema
              </button>
            </div>

            {this.renderErrorDetails()}

            <div className="mt-6 text-center">
              <p className="text-xs text-red-600">
                ID do Erro: {this.state.errorId}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  render() {
    if (this.state.hasError) {
      // Custom fallback
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Level-based error rendering
      switch (this.props.level) {
        case 'critical':
          return this.renderCriticalError();
        case 'page':
          return this.renderPageError();
        case 'component':
        default:
          return this.renderComponentError();
      }
    }

    return this.props.children;
  }
}

// Specialized error boundaries for different use cases
export const ComponentErrorBoundary: React.FC<{ children: ReactNode; onError?: (error: Error, errorInfo: ErrorInfo) => void }> = ({ children, onError }) => (
  <ErrorBoundary level="component" onError={onError}>
    {children}
  </ErrorBoundary>
);

export const PageErrorBoundary: React.FC<{ children: ReactNode; onError?: (error: Error, errorInfo: ErrorInfo) => void }> = ({ children, onError }) => (
  <ErrorBoundary level="page" showDetails={process.env.NODE_ENV === 'development'} onError={onError}>
    {children}
  </ErrorBoundary>
);

export const CriticalErrorBoundary: React.FC<{ children: ReactNode; onError?: (error: Error, errorInfo: ErrorInfo) => void }> = ({ children, onError }) => (
  <ErrorBoundary level="critical" showDetails={process.env.NODE_ENV === 'development'} onError={onError}>
    {children}
  </ErrorBoundary>
);

// Hook for error reporting
export function useErrorHandler() {
  const reportError = React.useCallback((error: Error, context?: string) => {
    const errorData = {
      message: error.message,
      stack: error.stack,
      context: context || 'Manual Report',
      timestamp: new Date().toISOString(),
      url: window.location.href
    };

    console.error('Manual Error Report:', errorData);

    // Store in localStorage
    try {
      const existingErrors = JSON.parse(localStorage.getItem('jurus_errors') || '[]');
      existingErrors.push(errorData);
      
      if (existingErrors.length > 10) {
        existingErrors.splice(0, existingErrors.length - 10);
      }
      
      localStorage.setItem('jurus_errors', JSON.stringify(existingErrors));
    } catch (e) {
      console.warn('Failed to store error in localStorage:', e);
    }
  }, []);

  return { reportError };
}

// Utility to get stored errors (for debugging)
export function getStoredErrors(): any[] {
  try {
    return JSON.parse(localStorage.getItem('jurus_errors') || '[]');
  } catch {
    return [];
  }
}

// Utility to clear stored errors
export function clearStoredErrors(): void {
  localStorage.removeItem('jurus_errors');
}