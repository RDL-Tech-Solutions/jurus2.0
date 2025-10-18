import { useEffect } from 'react';
import './styles/animations.css';
import './styles/accessibility.css';
import './styles/responsive.css';
import { ToastContainer } from './components/Toast';
import { useToast } from './hooks/useToast';
import { ContextualNotification } from './components/ContextualNotification';
import { HeaderEnhanced } from './components/HeaderEnhanced';
import { Home } from './components/Home';
import { ModoDemo } from './components/ModoDemo';
import { useThemeObject } from './hooks/useTheme';
import { useAppStore } from './store/useAppStore';

function App() {
  const { theme } = useThemeObject();
  const { toasts, removeToast } = useToast();
  
  // Estado global do Zustand
  const {
    // Simulação para notificações
    simulacao,
    resultado: resultadoStore
  } = useAppStore();



  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      theme === 'dark' 
        ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' 
        : 'bg-gradient-to-br from-blue-50 via-white to-purple-50'
    }`}>
      {/* Header */}
      <HeaderEnhanced />

      {/* Main Content */}
      <Home />



      {/* Toast Container */}
      <ToastContainer toasts={toasts} onClose={removeToast} />
    </div>
  );
}

export default App;
