// Página principal de Educação Financeira

import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  GraduationCap, 
  PieChart, 
  TrendingDown, 
  PiggyBank,
  BookOpen,
  Target,
  Calculator,
  ArrowRight,
  CreditCard,
  Coins
} from 'lucide-react';
import { Header } from '../components/Header';
import { useEducacaoFinanceira } from '../hooks/useEducacaoFinanceira';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';

// Importar seções
import { EducacaoAnimada } from '../components/educacao/EducacaoAnimada';
import { Simulador5030 } from '../components/educacao/Simulador5030';
import { SolucoesDividas } from '../components/educacao/SolucoesDividas';
import { CofrinhoInteligente } from '../components/educacao/CofrinhoInteligente';



export default function EducacaoFinanceira() {
  const {
    activeSection,
    navigateToSection,
    statistics,
    sections
  } = useEducacaoFinanceira();

  // Mapeamento de ícones
  const iconMap = {
    GraduationCap,
    PieChart,
    CreditCard,
    Coins
  };

  // Atualizar título da página
  useEffect(() => {
    document.title = 'Educação Financeira - Jurus';
    return () => {
      document.title = 'Jurus - Sistema de Gestão Financeira';
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 text-white py-16"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="w-20 h-20 mx-auto mb-6 bg-white/20 rounded-full flex items-center justify-center"
            >
              <GraduationCap className="w-10 h-10" />
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-4xl md:text-5xl font-bold mb-4"
            >
              Educação Financeira
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto"
            >
              Aprenda a gerenciar suas finanças com simulações interativas, 
              estratégias inteligentes e ferramentas práticas
            </motion.p>
            
            {/* Estatísticas */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto"
            >
              <div className="bg-white/10 rounded-lg p-4">
                <div className="text-2xl font-bold">{statistics.completedSections}</div>
                <div className="text-sm text-blue-100">Seções Concluídas</div>
              </div>
              <div className="bg-white/10 rounded-lg p-4">
                <div className="text-2xl font-bold">{statistics.totalSimulations}</div>
                <div className="text-sm text-blue-100">Simulações</div>
              </div>
              <div className="bg-white/10 rounded-lg p-4">
                <div className="text-2xl font-bold">{Math.floor(statistics.totalStudyTime / 60)}h</div>
                <div className="text-sm text-blue-100">Tempo de Estudo</div>
              </div>
              <div className="bg-white/10 rounded-lg p-4">
                <div className="text-2xl font-bold">{statistics.progressPercentage}%</div>
                <div className="text-sm text-blue-100">Progresso</div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Navegação das Seções */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="py-8 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-4">
            {sections.map((section, index) => {
              const IconComponent = iconMap[section.icon as keyof typeof iconMap];
              return (
                <motion.button
                  key={section.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                  onClick={() => navigateToSection(section.id)}
                  className={`
                    flex items-center space-x-2 px-6 py-3 rounded-full transition-all duration-200
                    ${activeSection === section.id
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }
                  `}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {IconComponent && <IconComponent className="w-5 h-5" />}
                  <span className="font-medium">{section.title}</span>
                  {activeSection === section.id && (
                    <ArrowRight className="w-4 h-4" />
                  )}
                </motion.button>
              );
            })}
          </div>
        </div>
      </motion.section>

      {/* Conteúdo Principal */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Seção Educação Financeira Animada */}
        {activeSection === 'educacao' && (
          <motion.section
            key="educacao"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            id="educacao"
            className="mb-16"
          >
            <EducacaoAnimada />
          </motion.section>
        )}

        {/* Seção Simulador 50-30-20 */}
        {activeSection === 'simulador' && (
          <motion.section
            key="simulador"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            id="simulador"
            className="mb-16"
          >
            <Simulador5030 />
          </motion.section>
        )}

        {/* Seção Soluções para Dívidas */}
        {activeSection === 'dividas' && (
          <motion.section
            key="dividas"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            id="dividas"
            className="mb-16"
          >
            <SolucoesDividas />
          </motion.section>
        )}

        {/* Seção Cofrinho Inteligente */}
        {activeSection === 'cofrinho' && (
          <motion.section
            key="cofrinho"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            id="cofrinho"
            className="mb-16"
          >
            <CofrinhoInteligente />
          </motion.section>
        )}
      </main>

      {/* Call to Action */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="bg-gray-100 dark:bg-gray-800 py-16"
      >
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Pronto para transformar sua vida financeira?
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
            Explore todas as ferramentas e comece sua jornada rumo à independência financeira
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => navigateToSection('educacao')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3"
            >
              <BookOpen className="w-5 h-5 mr-2" />
              Começar Aprendizado
            </Button>
            <Button
              onClick={() => navigateToSection('simulador')}
              variant="outline"
              className="px-8 py-3"
            >
              <Calculator className="w-5 h-5 mr-2" />
              Simular Orçamento
            </Button>
          </div>
        </div>
      </motion.section>
    </div>
  );
}