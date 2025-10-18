import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calculator, 
  Download, 
  GitCompare, 
  FileText, 
  X, 
  BarChart3, 
  FileSpreadsheet,
  Package,
  TrendingUp,
  ChevronDown,
  Target,
  History
} from 'lucide-react';
import { useState } from 'react';

interface FloatingActionButtonProps {
  onCalcular: () => void;
  onExportarPDF: () => void;
  onExportarPDFCompleto: () => void;
  onExportarCSV: () => void;
  onExportarXLSX: () => void;
  onExportarCompleto: () => void;
  onExportarGraficos: () => void;
  onMostrarComparador: () => void;
  onAbrirCalculadoraMeta: () => void;
  onAbrirHistorico: () => void;
  temResultados: boolean;
}

export function FloatingActionButton({
  onCalcular,
  onExportarPDF,
  onExportarPDFCompleto,
  onExportarCSV,
  onExportarXLSX,
  onExportarCompleto,
  onExportarGraficos,
  onMostrarComparador,
  onAbrirCalculadoraMeta,
  onAbrirHistorico,
  temResultados
}: FloatingActionButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
    setShowExportMenu(false);
  };

  const toggleExportMenu = () => {
    setShowExportMenu(!showExportMenu);
  };

  const acoesPrincipais = [
    {
      icon: Calculator,
      label: 'Calcular',
      onClick: () => {
        onCalcular();
        setIsOpen(false);
      },
      color: 'from-blue-500 to-blue-600',
      enabled: true
    },
    {
      icon: Target,
      label: 'Meta',
      onClick: () => {
        onAbrirCalculadoraMeta();
        setIsOpen(false);
      },
      color: 'from-purple-500 to-purple-600',
      enabled: true
    },
    {
      icon: History,
      label: 'Histórico',
      onClick: () => {
        onAbrirHistorico();
        setIsOpen(false);
      },
      color: 'from-indigo-500 to-indigo-600',
      enabled: true
    },
    {
      icon: GitCompare,
      label: 'Comparar',
      onClick: () => {
        onMostrarComparador();
        setIsOpen(false);
      },
      color: 'from-orange-500 to-orange-600',
      enabled: temResultados
    }
  ];

  const acoesExportacao = [
    {
      icon: FileText,
      label: 'PDF Básico',
      onClick: () => {
        onExportarPDF();
        setIsOpen(false);
        setShowExportMenu(false);
      },
      color: 'from-red-500 to-red-600'
    },
    {
      icon: BarChart3,
      label: 'PDF Completo',
      onClick: () => {
        onExportarPDFCompleto();
        setIsOpen(false);
        setShowExportMenu(false);
      },
      color: 'from-red-600 to-red-700'
    },
    {
      icon: TrendingUp,
      label: 'PDF Gráficos',
      onClick: () => {
        onExportarGraficos();
        setIsOpen(false);
        setShowExportMenu(false);
      },
      color: 'from-purple-500 to-purple-600'
    },
    {
      icon: Download,
      label: 'CSV',
      onClick: () => {
        onExportarCSV();
        setIsOpen(false);
        setShowExportMenu(false);
      },
      color: 'from-green-500 to-green-600'
    },
    {
      icon: FileSpreadsheet,
      label: 'Excel',
      onClick: () => {
        onExportarXLSX();
        setIsOpen(false);
        setShowExportMenu(false);
      },
      color: 'from-emerald-500 to-emerald-600'
    },
    {
      icon: Package,
      label: 'Completo',
      onClick: () => {
        onExportarCompleto();
        setIsOpen(false);
        setShowExportMenu(false);
      },
      color: 'from-indigo-500 to-indigo-600'
    }
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50 md:hidden">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute bottom-16 right-0 space-y-3"
          >
            {/* Ações Principais */}
            {acoesPrincipais.map((acao, index) => (
              <motion.button
                key={acao.label}
                initial={{ scale: 0, x: 20 }}
                animate={{ scale: 1, x: 0 }}
                exit={{ scale: 0, x: 20 }}
                transition={{ delay: index * 0.1 }}
                onClick={acao.onClick}
                disabled={!acao.enabled}
                className={`flex items-center space-x-3 px-4 py-3 rounded-full shadow-lg transition-all ${
                  acao.enabled
                    ? `bg-gradient-to-r ${acao.color} text-white hover:shadow-xl`
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                <acao.icon className="w-5 h-5" />
                <span className="text-sm font-medium whitespace-nowrap">
                  {acao.label}
                </span>
              </motion.button>
            ))}

            {/* Menu de Exportação */}
            {temResultados && (
              <motion.div
                initial={{ scale: 0, x: 20 }}
                animate={{ scale: 1, x: 0 }}
                exit={{ scale: 0, x: 20 }}
                transition={{ delay: acoesPrincipais.length * 0.1 }}
                className="relative"
              >
                <button
                  onClick={toggleExportMenu}
                  className="flex items-center space-x-3 px-4 py-3 rounded-full shadow-lg transition-all bg-gradient-to-r from-slate-600 to-slate-700 text-white hover:shadow-xl"
                >
                  <Download className="w-5 h-5" />
                  <span className="text-sm font-medium whitespace-nowrap">
                    Exportar
                  </span>
                  <motion.div
                    animate={{ rotate: showExportMenu ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </motion.div>
                </button>

                {/* Submenu de Exportação */}
                <AnimatePresence>
                  {showExportMenu && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8, x: 20 }}
                      animate={{ opacity: 1, scale: 1, x: 0 }}
                      exit={{ opacity: 0, scale: 0.8, x: 20 }}
                      className="absolute bottom-0 right-full mr-3 space-y-2 min-w-max"
                    >
                      {acoesExportacao.map((acao, index) => (
                        <motion.button
                          key={acao.label}
                          initial={{ opacity: 0, x: 10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 10 }}
                          transition={{ delay: index * 0.05 }}
                          onClick={acao.onClick}
                          className={`flex items-center space-x-3 px-3 py-2 rounded-lg shadow-md transition-all bg-gradient-to-r ${acao.color} text-white hover:shadow-lg text-sm`}
                        >
                          <acao.icon className="w-4 h-4" />
                          <span className="font-medium whitespace-nowrap">
                            {acao.label}
                          </span>
                        </motion.button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Botão Principal */}
      <motion.button
        onClick={toggleMenu}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className={`w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all ${
          isOpen
            ? 'bg-red-500 hover:bg-red-600'
            : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700'
        }`}
      >
        <motion.div
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ duration: 0.2 }}
        >
          {isOpen ? (
            <X className="w-6 h-6 text-white" />
          ) : (
            <Calculator className="w-6 h-6 text-white" />
          )}
        </motion.div>
      </motion.button>

      {/* Overlay para fechar o menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => {
              setIsOpen(false);
              setShowExportMenu(false);
            }}
            className="fixed inset-0 bg-black bg-opacity-20 -z-10"
          />
        )}
      </AnimatePresence>
    </div>
  );
}