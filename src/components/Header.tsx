import { motion } from 'framer-motion';
import { Calculator } from 'lucide-react';
import { CentroNotificacoes } from './CentroNotificacoes';
import { ThemeToggleEnhanced } from './ThemeToggleEnhanced';
import { AccessibilityEnhanced } from './AccessibilityEnhanced';

export function Header() {

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-white dark:bg-gray-900 shadow-lg border-b border-gray-200 dark:border-gray-700"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo e Título */}
          <motion.div 
            className="flex items-center space-x-3"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
              <Calculator className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                Calculadora de Juros Compostos
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 hidden sm:block">
                Simule seus investimentos e compare resultados
              </p>
            </div>
          </motion.div>

          {/* Ações do Header */}
          <div className="flex items-center space-x-3">
            {/* Centro de Notificações */}
            <CentroNotificacoes />

            {/* Acessibilidade */}
            <AccessibilityEnhanced />

            {/* Toggle de Tema Melhorado */}
            <ThemeToggleEnhanced variant="dropdown" showLabel={false} />
          </div>
        </div>
      </div>
    </motion.header>
  );
}