import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home, 
  BarChart3, 
  TrendingUp, 
  Calculator, 
  FileText, 
  Settings, 
  Bell, 
  User, 
  Moon, 
  Sun, 
  Menu, 
  X, 
  HelpCircle,
  Shield,
  Brain,
  Gamepad2,
  Palette,
  GraduationCap,
  Database
} from 'lucide-react';
import { useThemeObject } from '../hooks/useTheme';
import { useNotificacoes } from '../hooks/useNotificacoes';
import CentroNotificacoes from './CentroNotificacoes';
import { DataManager } from './DataManager';

interface MenuItem {
  id: string;
  label: string;
  path: string;
  icon: React.ComponentType<any>;
}

function HeaderEnhanced() {
  const location = useLocation();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useThemeObject();
  const { notificacoes } = useNotificacoes();
  
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showDataManager, setShowDataManager] = useState(false);

  // Calcular notificações não lidas
  const naoLidas = notificacoes.filter(n => !n.lida).length;

  // Menu items disponíveis
  const menuItems: MenuItem[] = [
    { id: 'home', label: 'Início', path: '/', icon: Home },
    { id: 'dashboard', label: 'Dashboard', path: '/dashboard', icon: BarChart3 },
    { id: 'dashboard-executivo', label: 'Dashboard Executivo', path: '/dashboard-executivo', icon: TrendingUp },
    { id: 'dashboard-avancado', label: 'Dashboard Avançado', path: '/dashboard-executivo-avancado', icon: BarChart3 },
    { id: 'recomendacoes-ia', label: 'Recomendações IA', path: '/recomendacoes-ia', icon: Brain },
    { id: 'temas', label: 'Temas', path: '/sistema-temas', icon: Palette },
    { id: 'educacao', label: 'Educação', path: '/sistema-educacao', icon: GraduationCap }
  ];

  // Função para navegar
  const handleNavigation = (path: string) => {
    navigate(path);
    setShowMobileMenu(false);
  };

  // Fechar dropdowns quando clicar fora
  useEffect(() => {
    const handleClickOutside = () => {
      setShowNotifications(false);
      setShowUserMenu(false);
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40 backdrop-blur-sm bg-white/95 dark:bg-gray-900/95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center space-x-3 cursor-pointer"
            onClick={() => handleNavigation('/')}
          >
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">J</span>
            </div>
            <span className="text-xl font-bold text-gray-900 dark:text-white">
              Jurus
            </span>
          </motion.div>

          {/* Navegação Desktop */}
          <nav className="hidden md:flex items-center space-x-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <motion.button
                  key={item.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleNavigation(item.path)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                    isActive 
                      ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20' 
                      : 'text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm font-medium">{item.label}</span>
                </motion.button>
              );
            })}
          </nav>

          {/* Ações do Header */}
          <div className="flex items-center space-x-2">
            {/* Notificações */}
            <div className="relative">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              >
                <Bell className="w-5 h-5" />
                {naoLidas > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium"
                  >
                    {naoLidas > 9 ? '9+' : naoLidas}
                  </motion.span>
                )}
              </motion.button>

              {/* Dropdown de Notificações */}
              <AnimatePresence>
                {showNotifications && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    className="absolute right-0 mt-2 w-96 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50"
                  >
                    <CentroNotificacoes />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Toggle Tema */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleTheme}
              className="p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            >
              {theme === 'light' ? (
                <Moon className="w-5 h-5" />
              ) : (
                <Sun className="w-5 h-5" />
              )}
            </motion.button>

            {/* Menu do Usuário */}
            <div className="relative">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center space-x-2 p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              >
                <User className="w-5 h-5" />
              </motion.button>

              {/* Dropdown do Usuário */}
              <AnimatePresence>
                {showUserMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50"
                  >
                    <div className="py-2">
                      <button 
                        onClick={() => {
                          setShowDataManager(true);
                          setShowUserMenu(false);
                        }}
                        className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        <Database className="w-4 h-4" />
                        <span>Gerenciar Dados</span>
                      </button>
                      <button 
                        onClick={() => handleNavigation('/configuracoes')}
                        className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        <Settings className="w-4 h-4" />
                        <span>Configurações</span>
                      </button>
                      <button 
                        onClick={() => handleNavigation('/acessibilidade')}
                        className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        <Shield className="w-4 h-4" />
                        <span>Acessibilidade</span>
                      </button>
                      <button className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                        <HelpCircle className="w-4 h-4" />
                        <span>Ajuda</span>
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Menu Mobile */}
            <div className="md:hidden">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              >
                {showMobileMenu ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </motion.button>
            </div>
          </div>
        </div>

        {/* Menu Mobile Expandido */}
        <AnimatePresence>
          {showMobileMenu && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-gray-200 dark:border-gray-700 py-4"
            >
              <nav className="space-y-2">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;
                  
                  return (
                    <motion.button
                      key={item.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleNavigation(item.path)}
                      className={`flex items-center space-x-3 w-full px-3 py-2 rounded-lg transition-colors ${
                        isActive 
                          ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20' 
                          : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-medium">{item.label}</span>
                    </motion.button>
                  );
                })}
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Overlay para fechar dropdowns */}
      {(showNotifications || showUserMenu || showMobileMenu) && (
        <div
          className="fixed inset-0 z-30"
          onClick={() => {
            setShowNotifications(false);
            setShowUserMenu(false);
            setShowMobileMenu(false);
          }}
        />
      )}

      {/* Data Manager Modal */}
      <DataManager
        isOpen={showDataManager}
        onClose={() => setShowDataManager(false)}
      />
    </header>
  );
}

export default HeaderEnhanced;