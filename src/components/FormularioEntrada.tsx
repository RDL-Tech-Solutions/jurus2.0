import React, { memo, useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  DollarSign, 
  TrendingUp, 
  Calendar, 
  Percent, 
  Calculator, 
  Loader2, 
  Info, 
  AlertCircle, 
  CheckCircle,
  TrendingDown
} from 'lucide-react';
import { SimulacaoInput, TaxaType } from '../types';
import { modalidadesPadrao } from "../constants";
import { inflacaoPresets } from "../constants";
import { bancosDigitaisBrasil, buscarBancoPorId, buscarModalidadePorId } from "../constants/bancosDigitais";
import { Tooltip } from './Tooltip';
import { useFormValidation, ValidationRules } from '../hooks/useFormValidation';
import { useSkeletonLoading } from "../hooks/useLoadingStates";
import { useDebouncedInput } from '../hooks/useDebounce';
import { SkeletonLoader } from './SkeletonLoader';
import { AnimatedWrapper } from './AnimatedWrapper';
import { AnimatedInput } from './AnimatedInput';
import { AnimatedButton } from './AnimatedButton';
import { AnimatedCard } from './AnimatedCard';
import { StateTransition } from './StateTransition';
import { 
  StaggerContainer, 
  StaggerItem
} from './AnimatedWrapper';
import { 
  buttonHoverVariants,
  slideUpVariants,
  fadeInVariants
} from '../utils/animations';

interface FormularioEntradaProps {
  simulacao: SimulacaoInput;
  onSimulacaoChange: (simulacao: SimulacaoInput) => void;
  onCalcular: () => void;
  isLoading?: boolean;
  showSkeleton?: boolean;
}

const FormularioEntrada = memo(function FormularioEntrada({ 
  simulacao, 
  onSimulacaoChange, 
  onCalcular,
  isLoading = false,
  showSkeleton = false
}: FormularioEntradaProps) {
  const [internalLoading, setInternalLoading] = useState(false);
  const isCalculating = isLoading || internalLoading;
  const { showSkeleton: internalSkeleton, startLoading, stopLoading } = useSkeletonLoading(200);
  const isInternalUpdate = useRef(false);

  // Debounced inputs para melhor performance
  const [valorInicialInput, debouncedValorInicial, setValorInicialInput] = useDebouncedInput(simulacao.valorInicial, 300);
  const [valorMensalInput, debouncedValorMensal, setValorMensalInput] = useDebouncedInput(simulacao.valorMensal, 300);
  const [periodoInput, debouncedPeriodo, setPeriodoInput] = useDebouncedInput(simulacao.periodo, 500);

  // Mostrar skeleton se solicitado externamente ou internamente
  const shouldShowSkeleton = showSkeleton || internalSkeleton;

  // Definir regras de validação
  const validationRules: ValidationRules = {
    valorInicial: {
      min: 0,
      max: 10000000,
      custom: (value: number) => {
        if (value < 0) return 'O valor inicial não pode ser negativo';
        if (value > 10000000) return 'O valor inicial não pode exceder R$ 10.000.000';
        return null;
      }
    },
    valorMensal: {
      min: 0,
      max: 1000000,
      custom: (value: number) => {
        if (value < 0) return 'O aporte mensal não pode ser negativo';
        if (value > 1000000) return 'O aporte mensal não pode exceder R$ 1.000.000';
        return null;
      }
    },
    periodo: {
      required: true,
      min: 1,
      max: 600,
      custom: (value: number) => {
        if (value < 1) return 'O período deve ser de pelo menos 1 mês';
        if (value > 600) return 'O período não pode exceder 600 meses (50 anos)';
        return null;
      }
    },
    percentualCdi: {
      custom: (value: number) => {
        if (simulacao.taxaType === 'cdi') {
          if (!value || value <= 0) return 'O percentual do CDI deve ser maior que 0';
          if (value > 300) return 'O percentual do CDI não pode exceder 300%';
        }
        return null;
      }
    },
    taxaPersonalizada: {
      custom: (value: number) => {
        if (simulacao.taxaType === 'personalizada') {
          if (!value || value <= 0) return 'A taxa deve ser maior que 0';
          if (value > 100) return 'A taxa não pode exceder 100% ao ano';
        }
        return null;
      }
    },
    modalidade: {
      custom: (value: any) => {
        if (simulacao.taxaType === 'banco' && !value) {
          return 'Selecione uma modalidade de investimento';
        }
        return null;
      }
    },
    bancoDigitalId: {
      custom: (value: any) => {
        if (simulacao.taxaType === 'banco_digital' && !value) {
          return 'Selecione um banco digital';
        }
        return null;
      }
    },
    modalidadeBancoId: {
      custom: (value: any) => {
        if (simulacao.taxaType === 'banco_digital' && simulacao.bancoDigitalId && !value) {
          return 'Selecione uma modalidade de investimento';
        }
        return null;
      }
    }
  };

  const {
    values,
    errors,
    touched,
    isValid,
    setValue,
    setFieldTouched,
    getFieldError,
    hasFieldError,
    validateForm,
    handleSubmit,
    setValues
  } = useFormValidation(simulacao, validationRules);

  // Sincronizar valores com props apenas quando simulacao muda externamente
  useEffect(() => {
    if (!isInternalUpdate.current) {
      setValues(simulacao);
    }
    isInternalUpdate.current = false;
  }, [simulacao, setValues]);

  // Notificar mudanças para o componente pai apenas quando values muda internamente
  useEffect(() => {
    if (isInternalUpdate.current) {
      onSimulacaoChange(values);
    }
  }, [values, onSimulacaoChange]);

  // Sincronizar valores debounced com o estado principal
  useEffect(() => {
    if (debouncedValorInicial !== simulacao.valorInicial) {
      handleInputChange('valorInicial', debouncedValorInicial);
    }
  }, [debouncedValorInicial]);

  useEffect(() => {
    if (debouncedValorMensal !== simulacao.valorMensal) {
      handleInputChange('valorMensal', debouncedValorMensal);
    }
  }, [debouncedValorMensal]);

  useEffect(() => {
    if (debouncedPeriodo !== simulacao.periodo) {
      handleInputChange('periodo', debouncedPeriodo);
    }
  }, [debouncedPeriodo]);

  const handleInputChange = (field: keyof SimulacaoInput, value: any) => {
    isInternalUpdate.current = true;
    setValue(field, value);
  };

  const handleFieldBlur = (field: string) => {
    setFieldTouched(field, true);
  };

  const formatarMoeda = (valor: string) => {
    const numero = valor.replace(/\D/g, '');
    const valorNumerico = Number(numero) / 100;
    
    return valorNumerico.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  };

  const handleValorInicialChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const valor = e.target.value.replace(/\D/g, '');
    const valorNumerico = Number(valor) / 100;
    setValorInicialInput(valorNumerico);
  };

  const handleAporteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const valor = e.target.value.replace(/\D/g, '');
    const valorNumerico = Number(valor) / 100;
    setValorMensalInput(valorNumerico);
  };

  const handlePeriodoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const valor = Number(e.target.value);
    setPeriodoInput(valor);
  };

  const handleCalcular = async () => {
    // Validação especial: pelo menos valor inicial ou aporte mensal deve ser maior que 0
    if (values.valorInicial === 0 && values.valorMensal === 0) {
      setFieldTouched('valorInicial', true);
      setFieldTouched('valorMensal', true);
      return;
    }

    const success = await handleSubmit(async () => {
      setInternalLoading(true);
      
      // Simular delay de processamento para mostrar loading
      await new Promise(resolve => setTimeout(resolve, 300));
      
      onCalcular();
      setInternalLoading(false);
    });

    if (!success) {
      setInternalLoading(false);
    }
  };

  const inputClassName = (field: string) => `
    w-full px-4 py-3 border rounded-lg transition-all duration-200 
    focus:ring-2 focus:ring-blue-500 focus:border-transparent 
    bg-white dark:bg-gray-800 text-gray-900 dark:text-white
    ${hasFieldError(field) 
      ? 'border-red-500 dark:border-red-400 focus:ring-red-500' 
      : 'border-gray-300 dark:border-gray-600'
    }
  `;

  return (
    <AnimatedCard
      variant="elevated"
      size="lg"
      hover={true}
      className="relative w-full max-w-none"
    >
      {/* Header responsivo */}
      <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-3 mb-6">
        <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg flex-shrink-0">
          <Calculator className="w-5 h-5 text-white" />
        </div>
        <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
          Dados da Simulação
        </h2>
      </div>

      {/* Grid responsivo para campos principais */}
      <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-6">
        {/* Valor Inicial */}
        <StaggerItem className="md:col-span-1">
          <div className="space-y-2">
            <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <DollarSign className="w-4 h-4" />
              </motion.div>
              <span>Valor Inicial</span>
              <Tooltip content="Valor que você já possui para investir no início. Pode ser R$ 0,00 se você vai começar apenas com aportes mensais.">
                <Info className="w-4 h-4 text-gray-400 hover:text-blue-500 transition-colors" />
              </Tooltip>
            </label>
            <AnimatedInput
              type="text"
              value={formatarMoeda(String(valorInicialInput * 100))}
              onChange={handleValorInicialChange}
              onBlur={() => handleFieldBlur('valorInicial')}
              className={inputClassName('valorInicial')}
              placeholder="R$ 0,00"
              icon={<DollarSign className="w-4 h-4" />}
              error={getFieldError('valorInicial')}
            />
          </div>
        </StaggerItem>

        {/* Aporte Mensal */}
        <StaggerItem className="md:col-span-1">
          <div className="space-y-2">
            <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              <motion.div
                whileHover={{ scale: 1.1, y: -2 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <TrendingUp className="w-4 h-4" />
              </motion.div>
              <span>Aporte Mensal</span>
              <Tooltip content="Valor que você pretende investir todo mês. Esse valor será aplicado mensalmente durante todo o período da simulação.">
                <Info className="w-4 h-4 text-gray-400 hover:text-blue-500 transition-colors" />
              </Tooltip>
            </label>
            <AnimatedInput
              type="text"
              value={formatarMoeda(String(valorMensalInput * 100))}
              onChange={handleAporteChange}
              onBlur={() => handleFieldBlur('valorMensal')}
              className={inputClassName('valorMensal')}
              placeholder="R$ 0,00"
              icon={<TrendingUp className="w-4 h-4" />}
              error={getFieldError('valorMensal')}
            />
          </div>
        </StaggerItem>

        {/* Período */}
        <StaggerItem className="md:col-span-1 lg:col-span-1">
          <div className="space-y-2">
            <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              <motion.div
                whileHover={{ scale: 1.1, rotate: 10 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <Calendar className="w-4 h-4" />
              </motion.div>
              <span>Período (meses)</span>
              <Tooltip content="Por quanto tempo você pretende manter o investimento. Exemplo: 12 meses = 1 ano, 60 meses = 5 anos.">
                <Info className="w-4 h-4 text-gray-400 hover:text-blue-500 transition-colors" />
              </Tooltip>
            </label>
            <AnimatedInput
              type="number"
              value={periodoInput}
              onChange={handlePeriodoChange}
              onBlur={() => handleFieldBlur('periodo')}
              min="1"
              max="600"
              className={inputClassName('periodo')}
              placeholder="12"
              icon={<Calendar className="w-4 h-4" />}
              error={getFieldError('periodo')}
            />
            <motion.div 
              className="text-xs text-gray-500 mt-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: periodoInput > 0 ? 1 : 0 }}
              transition={{ duration: 0.2 }}
            >
              {periodoInput > 0 && (
                <span>≈ {(periodoInput / 12).toFixed(1)} anos</span>
              )}
            </motion.div>
          </div>
        </StaggerItem>

        {/* Tipo de Taxa - Ocupa toda a largura */}
        <StaggerItem className="md:col-span-2 lg:col-span-3">
          <div className="space-y-2">
            <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              <motion.div
                whileHover={{ scale: 1.1, rotate: -5 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <Percent className="w-4 h-4" />
              </motion.div>
              <span>Tipo de Taxa</span>
              <Tooltip content="Escolha como definir a rentabilidade: modalidades pré-cadastradas, percentual do CDI ou taxa personalizada.">
                <Info className="w-4 h-4 text-gray-400 hover:text-blue-500 transition-colors" />
              </Tooltip>
            </label>
            <motion.select
              value={simulacao.taxaType}
              onChange={(e) => handleInputChange('taxaType', e.target.value as TaxaType)}
              className={inputClassName('taxaType')}
              whileFocus={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <option value="banco">Banco/Modalidade</option>
              <option value="banco_digital">Bancos Digitais</option>
              <option value="cdi">CDI</option>
              <option value="personalizada">Personalizada</option>
            </motion.select>
          </div>
        </StaggerItem>
      </StaggerContainer>

      {/* Seção de configurações específicas da taxa */}
      <div className="space-y-6">
        {/* Taxa específica baseada no tipo */}
        <AnimatePresence mode="wait">
          {simulacao.taxaType === 'banco' && (
            <motion.div
              key="banco"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <span>Modalidade de Investimento</span>
                <Tooltip content="Modalidades de investimento com taxas baseadas no mercado atual. As taxas são aproximadas e podem variar.">
                  <Info className="w-4 h-4 text-gray-400 hover:text-blue-500 transition-colors" />
                </Tooltip>
              </label>
              <select
                value={simulacao.modalidade?.id || ''}
                onChange={(e) => {
                  const modalidadeSelecionada = modalidadesPadrao.find(m => m.id === e.target.value);
                  handleInputChange('modalidade', modalidadeSelecionada);
                }}
                onBlur={() => handleFieldBlur('modalidade')}
                className={inputClassName('modalidade')}
              >
                <option value="">Selecione uma modalidade</option>
                {modalidadesPadrao.map((modalidade) => (
                  <option key={modalidade.id} value={modalidade.id}>
                    {modalidade.nome} ({modalidade.taxaAnual.toFixed(2)}% a.a.)
                  </option>
                ))}
              </select>
              <AnimatePresence>
                {hasFieldError('modalidade') && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex items-center space-x-1 mt-1 text-red-500 text-xs"
                  >
                    <AlertCircle className="w-3 h-3" />
                    <span>{getFieldError('modalidade')}</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}

          {simulacao.taxaType === 'banco_digital' && (
            <motion.div
              key="banco_digital"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              {/* Seleção do Banco Digital */}
              <div>
                <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <span>Banco Digital</span>
                  <Tooltip content="Selecione um dos principais bancos digitais do Brasil para ver suas modalidades de investimento.">
                    <Info className="w-4 h-4 text-gray-400 hover:text-blue-500 transition-colors" />
                  </Tooltip>
                </label>
                <select
                  value={simulacao.bancoDigitalId || ''}
                  onChange={(e) => {
                    handleInputChange('bancoDigitalId', e.target.value);
                    // Limpar modalidade quando trocar de banco
                    handleInputChange('modalidadeBancoId', '');
                  }}
                  onBlur={() => handleFieldBlur('bancoDigitalId')}
                  className={inputClassName('bancoDigitalId')}
                >
                  <option value="">Selecione um banco digital</option>
                  {bancosDigitaisBrasil.map((banco) => (
                    <option key={banco.id} value={banco.id}>
                      {banco.nome}
                    </option>
                  ))}
                </select>
                <AnimatePresence>
                  {hasFieldError('bancoDigitalId') && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="flex items-center space-x-1 mt-1 text-red-500 text-xs"
                    >
                      <AlertCircle className="w-3 h-3" />
                      <span>{getFieldError('bancoDigitalId')}</span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Seleção da Modalidade do Banco */}
              {simulacao.bancoDigitalId && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <span>Modalidade de Investimento</span>
                    <Tooltip content="Modalidades disponíveis no banco selecionado com suas respectivas taxas e características.">
                      <Info className="w-4 h-4 text-gray-400 hover:text-blue-500 transition-colors" />
                    </Tooltip>
                  </label>
                  <select
                    value={simulacao.modalidadeBancoId || ''}
                    onChange={(e) => handleInputChange('modalidadeBancoId', e.target.value)}
                    onBlur={() => handleFieldBlur('modalidadeBancoId')}
                    className={inputClassName('modalidadeBancoId')}
                  >
                    <option value="">Selecione uma modalidade</option>
                    {buscarBancoPorId(simulacao.bancoDigitalId)?.modalidades.map((modalidade) => (
                      <option key={modalidade.id} value={modalidade.id}>
                        {modalidade.nome} ({modalidade.taxaAnual.toFixed(2)}% a.a.)
                      </option>
                    ))}
                  </select>
                  <AnimatePresence>
                    {hasFieldError('modalidadeBancoId') && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="flex items-center space-x-1 mt-1 text-red-500 text-xs"
                      >
                        <AlertCircle className="w-3 h-3" />
                        <span>{getFieldError('modalidadeBancoId')}</span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  
                  {/* Informações da modalidade selecionada */}
                  {simulacao.modalidadeBancoId && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800"
                    >
                      {(() => {
                        const modalidade = buscarModalidadePorId(simulacao.bancoDigitalId!, simulacao.modalidadeBancoId);
                        if (!modalidade) return null;
                        
                        return (
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-600 dark:text-gray-400">Tipo:</span>
                              <span className="font-medium text-gray-900 dark:text-white capitalize">
                                {modalidade.tipo.replace('_', ' ')}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600 dark:text-gray-400">Liquidez:</span>
                              <span className="font-medium text-gray-900 dark:text-white capitalize">
                                {modalidade.liquidez === 'diaria' ? 'Diária' : 
                                 modalidade.liquidez === 'vencimento' ? 'No vencimento' : 'Com carência'}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600 dark:text-gray-400">Valor mínimo:</span>
                              <span className="font-medium text-gray-900 dark:text-white">
                                {modalidade.valorMinimo === 0 ? 'Sem mínimo' : 
                                 modalidade.valorMinimo.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600 dark:text-gray-400">Garantia:</span>
                              <span className="font-medium text-gray-900 dark:text-white">
                                {modalidade.garantia === 'fgc' ? 'FGC até R$ 250.000' :
                                 modalidade.garantia === 'tesouro' ? 'Tesouro Nacional' : 'Sem garantia'}
                              </span>
                            </div>
                            <div className="mt-2 pt-2 border-t border-blue-200 dark:border-blue-700">
                              <p className="text-gray-700 dark:text-gray-300 text-xs">
                                {modalidade.descricao}
                              </p>
                            </div>
                          </div>
                        );
                      })()}
                    </motion.div>
                  )}
                </motion.div>
              )}
            </motion.div>
          )}

          {simulacao.taxaType === 'cdi' && (
            <motion.div
              key="cdi"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <span>Percentual do CDI (%)</span>
                <Tooltip content="Percentual do CDI que o investimento rende. Exemplo: 100% = rende igual ao CDI, 120% = rende 20% a mais que o CDI.">
                  <Info className="w-4 h-4 text-gray-400 hover:text-blue-500 transition-colors" />
                </Tooltip>
              </label>
              <input
                type="number"
                value={simulacao.percentualCdi || ''}
                onChange={(e) => handleInputChange('percentualCdi', Number(e.target.value))}
                onBlur={() => handleFieldBlur('percentualCdi')}
                min="0"
                max="300"
                step="0.1"
                className={inputClassName('percentualCdi')}
                placeholder="100"
              />
              <AnimatePresence>
                {hasFieldError('percentualCdi') && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex items-center space-x-1 mt-1 text-red-500 text-xs"
                  >
                    <AlertCircle className="w-3 h-3" />
                    <span>{getFieldError('percentualCdi')}</span>
                  </motion.div>
                )}
              </AnimatePresence>
              <div className="text-xs text-gray-500 mt-1">
                CDI atual: ~13,75% a.a. (referência)
              </div>
            </motion.div>
          )}

          {simulacao.taxaType === 'personalizada' && (
            <motion.div
              key="personalizada"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <span>Taxa Anual (%)</span>
                <Tooltip content="Taxa de rentabilidade anual personalizada. Será convertida automaticamente para taxa mensal nos cálculos.">
                  <Info className="w-4 h-4 text-gray-400 hover:text-blue-500 transition-colors" />
                </Tooltip>
              </label>
              <input
                type="number"
                value={simulacao.taxaPersonalizada || ''}
                onChange={(e) => handleInputChange('taxaPersonalizada', Number(e.target.value))}
                onBlur={() => handleFieldBlur('taxaPersonalizada')}
                min="0"
                max="100"
                step="0.01"
                className={inputClassName('taxaPersonalizada')}
                placeholder="10.00"
              />
              <AnimatePresence>
                {hasFieldError('taxaPersonalizada') && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex items-center space-x-1 mt-1 text-red-500 text-xs"
                  >
                    <AlertCircle className="w-3 h-3" />
                    <span>{getFieldError('taxaPersonalizada')}</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Configurações de Inflação */}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
          <div className="flex items-center space-x-2 mb-4">
            <TrendingDown className="w-5 h-5 text-orange-500" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Simulação de Inflação
            </h3>
            <Tooltip content="A inflação reduz o poder de compra do dinheiro ao longo do tempo. Ative esta opção para ver o valor real do seu investimento.">
              <Info className="w-4 h-4 text-gray-400 hover:text-blue-500 transition-colors" />
            </Tooltip>
          </div>

          {/* Toggle para considerar inflação */}
          <div className="mb-4">
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={simulacao.considerarInflacao || false}
                onChange={(e) => handleInputChange('considerarInflacao', e.target.checked)}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
              />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Considerar inflação nos cálculos
              </span>
            </label>
            <p className="text-xs text-gray-500 mt-1 ml-7">
              Mostra o valor real do investimento descontando a inflação
            </p>
          </div>

          {/* Configurações de inflação (aparecem quando ativado) */}
          <AnimatePresence>
            {simulacao.considerarInflacao && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                {/* Preset de inflação */}
                <div>
                  <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <span>Cenário de Inflação</span>
                    <Tooltip content="Escolha um cenário pré-definido ou configure uma taxa personalizada de inflação.">
                      <Info className="w-4 h-4 text-gray-400 hover:text-blue-500 transition-colors" />
                    </Tooltip>
                  </label>
                  <select
                    value={simulacao.taxaInflacao || ''}
                    onChange={(e) => {
                      const valor = e.target.value;
                      if (valor === 'personalizada') {
                        handleInputChange('taxaInflacao', 0);
                      } else {
                        const preset = inflacaoPresets.find(p => p.taxaAnual.toString() === valor);
                        if (preset) {
                          handleInputChange('taxaInflacao', preset.taxaAnual);
                        }
                      }
                    }}
                    className={inputClassName('taxaInflacao')}
                  >
                    <option value="">Selecione um cenário</option>
                    {inflacaoPresets.map((preset) => (
                      <option key={preset.id} value={preset.taxaAnual}>
                        {preset.nome} ({preset.taxaAnual}% a.a.)
                      </option>
                    ))}
                    <option value="personalizada">Taxa Personalizada</option>
                  </select>
                  
                  {/* Descrição do preset selecionado */}
                  {simulacao.taxaInflacao && (
                    <div className="mt-2 p-2 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded text-xs text-orange-700 dark:text-orange-400">
                      {inflacaoPresets.find(p => p.taxaAnual === simulacao.taxaInflacao)?.descricao || 
                       'Taxa de inflação personalizada'}
                    </div>
                  )}
                </div>

                {/* Taxa personalizada de inflação */}
                {simulacao.taxaInflacao !== undefined && 
                 !inflacaoPresets.some(p => p.taxaAnual === simulacao.taxaInflacao) && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      <span>Taxa de Inflação Anual (%)</span>
                      <Tooltip content="Taxa de inflação anual esperada. No Brasil, a meta do Banco Central é de 3,25% para 2024.">
                        <Info className="w-4 h-4 text-gray-400 hover:text-blue-500 transition-colors" />
                      </Tooltip>
                    </label>
                    <input
                      type="number"
                      value={simulacao.taxaInflacao || ''}
                      onChange={(e) => handleInputChange('taxaInflacao', Number(e.target.value))}
                      min="0"
                      max="50"
                      step="0.01"
                      className={inputClassName('taxaInflacao')}
                      placeholder="3.25"
                    />
                    <div className="text-xs text-gray-500 mt-1">
                      Meta do Banco Central: 3,25% a.a. (2024)
                    </div>
                  </motion.div>
                )}

                {/* Informações sobre o impacto da inflação */}
                {simulacao.taxaInflacao && simulacao.taxaInflacao > 0 && (
                  <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                    <div className="flex items-start space-x-2">
                      <TrendingDown className="w-4 h-4 text-yellow-600 mt-0.5" />
                      <div className="text-xs text-yellow-700 dark:text-yellow-400">
                        <p className="font-medium mb-1">Impacto da Inflação:</p>
                        <p>
                          Com inflação de {simulacao.taxaInflacao}% a.a., R$ 100 hoje valerão aproximadamente R$ {(100 / Math.pow(1 + simulacao.taxaInflacao / 100, simulacao.periodo / 12)).toFixed(2)} em poder de compra ao final do período.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>

      {/* Resumo de Validação */}
      <AnimatePresence>
        {errors.length === 0 && Object.keys(touched).length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center space-x-2 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg mt-6"
          >
            <CheckCircle className="w-4 h-4 text-green-500" />
            <span className="text-sm text-green-700 dark:text-green-400">
              Todos os dados estão válidos!
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Descrição oculta para acessibilidade */}
      <div id="calc-button-description" className="sr-only">
        Clique para calcular os juros compostos baseado nos valores informados no formulário
      </div>

      {/* Botão Calcular */}
      <div className="mt-6">
        <StateTransition
          state={isCalculating ? 'loading' : 'idle'}
          loadingText="Processando cálculos..."
        >
          <AnimatedButton
            onClick={handleCalcular}
            disabled={isCalculating}
            loading={isCalculating}
            variant="primary"
            size="lg"
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
            aria-label={isCalculating ? "Calculando juros compostos..." : "Calcular juros compostos"}
            aria-describedby="calc-button-description"
          >
            {!isCalculating && <Calculator className="w-5 h-5" />}
            {isCalculating ? 'Calculando...' : 'Calcular Juros Compostos'}
          </AnimatedButton>
        </StateTransition>
      </div>

      {/* Skeleton Overlay */}
      <AnimatePresence>
        {shouldShowSkeleton && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-xl z-10"
          >
            <SkeletonLoader variant="rectangular" height="400px" />
          </motion.div>
        )}
      </AnimatePresence>
    </AnimatedCard>
  );
});

export { FormularioEntrada };