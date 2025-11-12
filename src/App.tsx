import { useEffect } from 'react';
import { AppRouter } from './router';
import { useAppStore } from './store/useAppStore';

function App() {
  const { theme } = useAppStore();

  useEffect(() => {
    // Sincronizar tema com o store Zustand
    const root = window.document.documentElement;
    const savedTheme = localStorage.getItem('theme') || 'light';
    
    // Aplicar o tema salvo ao store
    if (savedTheme !== theme) {
      useAppStore.getState().setTheme(savedTheme as 'light' | 'dark');
    }

    // Registrar Service Worker em produção
    if ('serviceWorker' in navigator && import.meta.env.PROD) {
      navigator.serviceWorker.register('/sw.js').catch((error) => {
        console.log('Service Worker registration failed:', error);
      });
    }
  }, []);

  return (
    <div className="App min-h-screen bg-gray-50 dark:bg-gray-900">
      <AppRouter />
    </div>
  );
}

export default App;
