import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { TrendingDown, BarChart3, PieChart, Download, Activity, Brain } from 'lucide-react';
import { ResultadoSimulacao as ResultadoType, SimulacaoInput } from '../types';
import { CardsResumo } from './CardsResumo';
import { TabelaDetalhada } from './TabelaDetalhada';
import { AnimatedContainer } from './AnimatedContainer';
import { AnimatedButton } from './AnimatedButton';
import { StaggeredContainer } from './AnimatedContainer';

interface ResultadoSimulacaoProps {
  resultado: ResultadoType;
  simulacao?: SimulacaoInput;
  onMostrarInflacao?: () => void;
  onMostrarCenarios?: () => void;
  onMostrarAnaliseAvancada?: () => void;
  onMostrarDashboard?: () => void;
  onMostrarExportacao?: () => void;
  onMostrarPerformance?: () => void;
}

const ResultadoSimulacao = memo(function ResultadoSimulacao({ resultado, simulacao, onMostrarInflacao,
  onMostrarCenarios,
  onMostrarAnaliseAvancada,
  onMostrarDashboard,
  onMostrarExportacao,
  onMostrarPerformance }: ResultadoSimulacaoProps) {
  return (
    <AnimatedContainer
      variant="slideUp"
      delay={0.2}
      className="space-y-6"
    >
      <StaggeredContainer>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <CardsResumo resultado={resultado} />
        </motion.div>
        
        {/* Botões de Análises Avançadas */}
        {(onMostrarInflacao || onMostrarCenarios || onMostrarAnaliseAvancada || onMostrarDashboard || onMostrarExportacao || onMostrarPerformance) && simulacao && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex justify-center gap-4 flex-wrap">
              {onMostrarInflacao && (
                <AnimatedButton
                  onClick={onMostrarInflacao}
                  variant="secondary"
                  className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white"
                >
                  <TrendingDown className="w-5 h-5" />
                  Simular com Inflação
                </AnimatedButton>
              )}
              
              {onMostrarCenarios && (
                <AnimatedButton
                  onClick={onMostrarCenarios}
                  variant="secondary"
                  className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white"
                >
                  <BarChart3 className="w-5 h-5" />
                  Análise de Cenários
                </AnimatedButton>
              )}

              {onMostrarAnaliseAvancada && (
                <AnimatedButton
                  onClick={onMostrarAnaliseAvancada}
                  variant="secondary"
                  className="bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600 text-white"
                >
                  <Brain className="w-5 h-5" />
                  Análise Avançada
                </AnimatedButton>
              )}
              
              {onMostrarDashboard && (
                <AnimatedButton
                  onClick={onMostrarDashboard}
                  variant="secondary"
                  className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white"
                >
                  <PieChart className="w-5 h-5" />
                  Dashboard Avançado
                </AnimatedButton>
              )}

              {onMostrarPerformance && (
                <AnimatedButton
                  onClick={onMostrarPerformance}
                  variant="secondary"
                  className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white"
                >
                  <Activity className="w-5 h-5" />
                  Performance
                </AnimatedButton>
              )}
              
              {onMostrarExportacao && (
                <AnimatedButton
                  onClick={onMostrarExportacao}
                  variant="secondary"
                  className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white"
                >
                  <Download className="w-5 h-5" />
                  Exportar Relatório
                </AnimatedButton>
              )}
             </div>
           </motion.div>
         )}
         
         <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ delay: 0.3 }}
         >
           <TabelaDetalhada dados={resultado.evolucaoMensal} />
         </motion.div>
       </StaggeredContainer>
     </AnimatedContainer>
   );
});

export { ResultadoSimulacao };