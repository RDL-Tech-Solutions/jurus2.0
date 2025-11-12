import { useState } from 'react';
import { Calculator } from 'lucide-react';
import { useSimulacao } from '../store/useAppStore';
import { calcularJurosCompostos } from '../utils/calculos';
import { bancosDigitais } from '../data/bancosDigitais';
import { useAppStore } from '../store/useAppStore';

export function FormularioEntrada() {
  const { simulacao, setSimulacao, setResultado } = useSimulacao();
  const adicionarHistorico = useAppStore(state => state.adicionarHistorico);
  const [erros, setErros] = useState<Record<string, string>>({});

  const handleChange = (campo: string, valor: any) => {
    setSimulacao({ ...simulacao, [campo]: valor });
    // Limpar erro do campo
    if (erros[campo]) {
      setErros({ ...erros, [campo]: '' });
    }
  };

  const validar = () => {
    const novosErros: Record<string, string> = {};

    if (simulacao.valorInicial <= 0) {
      novosErros.valorInicial = 'Valor inicial deve ser maior que zero';
    }

    if (simulacao.valorMensal < 0) {
      novosErros.valorMensal = 'Valor mensal não pode ser negativo';
    }

    if (simulacao.periodo <= 0) {
      novosErros.periodo = 'Período deve ser maior que zero';
    }

    if (simulacao.taxaType === 'personalizada' && simulacao.taxaPersonalizada <= 0) {
      novosErros.taxaPersonalizada = 'Taxa deve ser maior que zero';
    }

    if (simulacao.taxaType === 'cdi' && simulacao.percentualCdi <= 0) {
      novosErros.percentualCdi = 'Percentual deve ser maior que zero';
    }

    if (simulacao.taxaType === 'banco_digital') {
      if (!simulacao.bancoDigitalId) {
        novosErros.bancoDigitalId = 'Selecione um banco';
      }
      if (!simulacao.modalidadeBancoId) {
        novosErros.modalidadeBancoId = 'Selecione uma modalidade';
      }
    }

    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validar()) {
      return;
    }

    try {
      const resultado = calcularJurosCompostos(simulacao);
      setResultado(resultado);
      adicionarHistorico(simulacao, resultado);
    } catch (error) {
      console.error('Erro ao calcular:', error);
      alert('Erro ao calcular. Verifique os valores informados.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card-mobile space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-2">
        <Calculator className="w-6 h-6 text-primary-600 dark:text-primary-400" />
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          Simulação de Investimento
        </h2>
      </div>

      {/* Valor Inicial */}
      <div>
        <label htmlFor="valorInicial" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Valor Inicial (R$) *
        </label>
        <input
          id="valorInicial"
          type="number"
          value={simulacao.valorInicial}
          onChange={(e) => handleChange('valorInicial', Number(e.target.value))}
          className="input-mobile"
          placeholder="10000"
          min="0"
          step="100"
        />
        {erros.valorInicial && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">{erros.valorInicial}</p>
        )}
      </div>

      {/* Valor Mensal */}
      <div>
        <label htmlFor="valorMensal" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Aporte Mensal (R$)
        </label>
        <input
          id="valorMensal"
          type="number"
          value={simulacao.valorMensal}
          onChange={(e) => handleChange('valorMensal', Number(e.target.value))}
          className="input-mobile"
          placeholder="500"
          min="0"
          step="50"
        />
        {erros.valorMensal && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">{erros.valorMensal}</p>
        )}
      </div>

      {/* Período */}
      <div>
        <label htmlFor="periodo" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Período (meses) *
        </label>
        <input
          id="periodo"
          type="number"
          value={simulacao.periodo}
          onChange={(e) => handleChange('periodo', Number(e.target.value))}
          className="input-mobile"
          placeholder="12"
          min="1"
          step="1"
        />
        {erros.periodo && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">{erros.periodo}</p>
        )}
      </div>

      {/* Tipo de Taxa */}
      <div>
        <label htmlFor="taxaType" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Tipo de Investimento *
        </label>
        <select
          id="taxaType"
          value={simulacao.taxaType}
          onChange={(e) => handleChange('taxaType', e.target.value)}
          className="input-mobile"
        >
          <option value="banco">Banco/Corretora</option>
          <option value="banco_digital">Banco Digital</option>
          <option value="cdi">CDI Personalizado</option>
          <option value="personalizada">Taxa Personalizada</option>
        </select>
      </div>

      {/* Taxa Personalizada */}
      {simulacao.taxaType === 'personalizada' && (
        <div>
          <label htmlFor="taxaPersonalizada" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Taxa Anual (%) *
          </label>
          <input
            id="taxaPersonalizada"
            type="number"
            value={simulacao.taxaPersonalizada}
            onChange={(e) => handleChange('taxaPersonalizada', Number(e.target.value))}
            className="input-mobile"
            placeholder="10"
            min="0"
            max="100"
            step="0.1"
          />
          {erros.taxaPersonalizada && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{erros.taxaPersonalizada}</p>
          )}
        </div>
      )}

      {/* Percentual CDI */}
      {simulacao.taxaType === 'cdi' && (
        <div>
          <label htmlFor="percentualCdi" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Percentual do CDI (%) *
          </label>
          <input
            id="percentualCdi"
            type="number"
            value={simulacao.percentualCdi}
            onChange={(e) => handleChange('percentualCdi', Number(e.target.value))}
            className="input-mobile"
            placeholder="100"
            min="0"
            max="200"
            step="1"
          />
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            💰 CDI atual: 13,71% a.a. | Ex: 100% = 13,71% a.a., 110% = 15,08% a.a.
          </p>
          {erros.percentualCdi && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{erros.percentualCdi}</p>
          )}
        </div>
      )}

      {simulacao.taxaType === 'banco_digital' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Banco Digital *
            </label>
            <select
              value={simulacao.bancoDigitalId}
              onChange={(e) => handleChange('bancoDigitalId', e.target.value)}
              className="input-mobile"
            >
              <option value="">Selecione</option>
              {bancosDigitais.map((banco) => (
                <option key={banco.id} value={banco.id}>{banco.nome}</option>
              ))}
            </select>
            {erros.bancoDigitalId && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{erros.bancoDigitalId}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Modalidade *
            </label>
            <select
              value={simulacao.modalidadeBancoId}
              onChange={(e) => handleChange('modalidadeBancoId', e.target.value)}
              className="input-mobile"
              disabled={!simulacao.bancoDigitalId}
            >
              <option value="">Selecione</option>
              {simulacao.bancoDigitalId &&
                bancosDigitais.find(b => b.id === simulacao.bancoDigitalId)?.modalidades.map((m) => (
                  <option key={m.id} value={m.id}>{m.nome}</option>
                ))}
            </select>
            {erros.modalidadeBancoId && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{erros.modalidadeBancoId}</p>
            )}
          </div>
        </div>
      )}

      {/* Botão Calcular */}
      <button
        type="submit"
        className="btn btn-primary w-full flex items-center justify-center space-x-2"
      >
        <Calculator className="w-5 h-5 mr-2" />
        Calcular Investimento
      </button>
    </form>
  );
}
