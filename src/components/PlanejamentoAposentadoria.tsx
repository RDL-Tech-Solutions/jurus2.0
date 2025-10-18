import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calculator, TrendingDown, PiggyBank } from 'lucide-react';
import { CalculadoraAposentadoria } from './CalculadoraAposentadoria';
import { RetiradasProgramadas } from './RetiradasProgramadas';

type TabType = 'acumulacao' | 'retiradas';

export const PlanejamentoAposentadoria: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('acumulacao');

  const tabs = [
    {
      id: 'acumulacao' as TabType,
      label: 'Acumulação',
      icon: PiggyBank,
      description: 'Planeje quanto investir para aposentadoria'
    },
    {
      id: 'retiradas' as TabType,
      label: 'Retiradas',
      icon: TrendingDown,
      description: 'Simule retiradas do seu patrimônio'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4 flex items-center justify-center gap-3">
            <Calculator className="text-blue-600" />
            Planejamento de Aposentadoria
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Ferramentas completas para planejar sua aposentadoria: desde a acumulação de patrimônio 
            até a estratégia de retiradas
          </p>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex justify-center mb-8"
        >
          <div className="bg-white rounded-xl shadow-lg p-2 flex gap-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative px-6 py-4 rounded-lg font-medium transition-all duration-200 flex items-center gap-3 ${
                    activeTab === tab.id
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <Icon size={20} />
                  <div className="text-left">
                    <div className="font-semibold">{tab.label}</div>
                    <div className={`text-xs ${
                      activeTab === tab.id ? 'text-blue-100' : 'text-gray-500'
                    }`}>
                      {tab.description}
                    </div>
                  </div>
                  {activeTab === tab.id && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 bg-blue-600 rounded-lg -z-10"
                      initial={false}
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'acumulacao' && <CalculadoraAposentadoria />}
          {activeTab === 'retiradas' && <RetiradasProgramadas />}
        </motion.div>
      </div>
    </div>
  );
};

export default PlanejamentoAposentadoria;