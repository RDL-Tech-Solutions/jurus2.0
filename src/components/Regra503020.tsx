import { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Wallet, Sparkles, Plus, Trash2 } from 'lucide-react';
import { formatarMoeda } from '../utils/calculos';
import { cn } from '../utils/cn';

type MetodoType = '50/30/20' | '70/20/10' | '80/20' | 'personalizado';

interface CategoriaPersonalizada {
  nome: string;
  percentual: number;
  cor: string;
  descricao: string;
}

export function Regra503020() {
  const [rendaMensal, setRendaMensal] = useState(5000);
  const [metodo, setMetodo] = useState<MetodoType>('50/30/20');
  
  // Categorias personalizadas
  const [categoriasPersonalizadas, setCategoriasPersonalizadas] = useState<CategoriaPersonalizada[]>([
    { nome: 'Essenciais', percentual: 50, cor: '#ef4444', descricao: 'Moradia, alimentação, transporte' },
    { nome: 'Desejos', percentual: 30, cor: '#f59e0b', descricao: 'Lazer, entretenimento' },
    { nome: 'Investimentos', percentual: 20, cor: '#10b981', descricao: 'Poupança, investimentos' }
  ]);

  // Calcular dados baseado no método selecionado
  const getDados = () => {
    switch (metodo) {
      case '50/30/20':
        return [
          { nome: 'Essenciais (50%)', valor: rendaMensal * 0.5, cor: '#ef4444', descricao: 'Moradia, alimentação, transporte, saúde' },
          { nome: 'Desejos (30%)', valor: rendaMensal * 0.3, cor: '#f59e0b', descricao: 'Lazer, restaurantes, streaming, hobbies' },
          { nome: 'Investimentos (20%)', valor: rendaMensal * 0.2, cor: '#10b981', descricao: 'Reserva de emergência, aposentadoria' }
        ];
      case '70/20/10':
        return [
          { nome: 'Essenciais (70%)', valor: rendaMensal * 0.7, cor: '#ef4444', descricao: 'Necessidades básicas e dívidas' },
          { nome: 'Investimentos (20%)', valor: rendaMensal * 0.2, cor: '#10b981', descricao: 'Poupança e investimentos' },
          { nome: 'Lazer (10%)', valor: rendaMensal * 0.1, cor: '#f59e0b', descricao: 'Entretenimento e desejos' }
        ];
      case '80/20':
        return [
          { nome: 'Gastos (80%)', valor: rendaMensal * 0.8, cor: '#ef4444', descricao: 'Todas as despesas do mês' },
          { nome: 'Investimentos (20%)', valor: rendaMensal * 0.2, cor: '#10b981', descricao: 'Poupança e investimentos' }
        ];
      case 'personalizado':
        return categoriasPersonalizadas.map(cat => ({
          nome: `${cat.nome} (${cat.percentual}%)`,
          valor: rendaMensal * (cat.percentual / 100),
          cor: cat.cor,
          descricao: cat.descricao
        }));
      default:
        return [];
    }
  };

  const dados = getDados();
  const totalPercentual = categoriasPersonalizadas.reduce((acc, cat) => acc + cat.percentual, 0);

  const adicionarCategoria = () => {
    setCategoriasPersonalizadas([...categoriasPersonalizadas, {
      nome: 'Nova Categoria',
      percentual: 0,
      cor: '#6366f1',
      descricao: 'Descrição'
    }]);
  };

  const removerCategoria = (index: number) => {
    setCategoriasPersonalizadas(categoriasPersonalizadas.filter((_, i) => i !== index));
  };

  const atualizarCategoria = (index: number, campo: keyof CategoriaPersonalizada, valor: any) => {
    const novasCategorias = [...categoriasPersonalizadas];
    novasCategorias[index] = { ...novasCategorias[index], [campo]: valor };
    setCategoriasPersonalizadas(novasCategorias);
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
          <p className="font-semibold text-gray-900 dark:text-white">{payload[0].name}</p>
          <p className="text-primary-600 dark:text-primary-400 font-bold">
            {formatarMoeda(payload[0].value)}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {((payload[0].value / rendaMensal) * 100).toFixed(0)}% da renda
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="card-mobile space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-2">
        <Wallet className="w-6 h-6 text-primary-600 dark:text-primary-400" />
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          Planejamento Financeiro
        </h2>
      </div>

      <p className="text-sm text-gray-600 dark:text-gray-400">
        Escolha um método de planejamento ou crie sua própria divisão personalizada.
      </p>

      {/* Seletor de Método */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          Método de Planejamento
        </label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <button
            onClick={() => setMetodo('50/30/20')}
            className={cn(
              'p-4 rounded-lg border-2 transition-all',
              metodo === '50/30/20'
                ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                : 'border-gray-200 dark:border-gray-700 hover:border-primary-300'
            )}
          >
            <div className="text-center">
              <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">50/30/20</div>
              <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">Clássico</div>
            </div>
          </button>

          <button
            onClick={() => setMetodo('70/20/10')}
            className={cn(
              'p-4 rounded-lg border-2 transition-all',
              metodo === '70/20/10'
                ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                : 'border-gray-200 dark:border-gray-700 hover:border-primary-300'
            )}
          >
            <div className="text-center">
              <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">70/20/10</div>
              <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">Conservador</div>
            </div>
          </button>

          <button
            onClick={() => setMetodo('80/20')}
            className={cn(
              'p-4 rounded-lg border-2 transition-all',
              metodo === '80/20'
                ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                : 'border-gray-200 dark:border-gray-700 hover:border-primary-300'
            )}
          >
            <div className="text-center">
              <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">80/20</div>
              <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">Simples</div>
            </div>
          </button>

          <button
            onClick={() => setMetodo('personalizado')}
            className={cn(
              'p-4 rounded-lg border-2 transition-all',
              metodo === 'personalizado'
                ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                : 'border-gray-200 dark:border-gray-700 hover:border-primary-300'
            )}
          >
            <div className="text-center">
              <Sparkles className="w-6 h-6 mx-auto text-primary-600 dark:text-primary-400" />
              <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">Personalizado</div>
            </div>
          </button>
        </div>
      </div>

      {/* Input de Renda */}
      <div>
        <label htmlFor="rendaMensal" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Sua Renda Mensal (R$)
        </label>
        <input
          id="rendaMensal"
          type="number"
          value={rendaMensal}
          onChange={(e) => setRendaMensal(Number(e.target.value))}
          className="input-mobile"
          placeholder="5000"
          min="0"
          step="100"
        />
      </div>

      {/* Modo Personalizado */}
      {metodo === 'personalizado' && (
        <div className="space-y-4 animate-slide-up">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Suas Categorias
            </h3>
            <button
              onClick={adicionarCategoria}
              className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-primary-600 text-white hover:bg-primary-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span className="text-sm">Adicionar</span>
            </button>
          </div>

          {/* Alerta de Total */}
          <div className={cn(
            'p-3 rounded-lg border-2',
            totalPercentual === 100
              ? 'bg-green-50 dark:bg-green-900/20 border-green-500'
              : 'bg-amber-50 dark:bg-amber-900/20 border-amber-500'
          )}>
            <p className="text-sm font-medium">
              Total: <span className="text-lg font-bold">{totalPercentual}%</span>
              {totalPercentual !== 100 && (
                <span className="text-amber-600 dark:text-amber-400 ml-2">
                  (Deve somar 100%)
                </span>
              )}
              {totalPercentual === 100 && (
                <span className="text-green-600 dark:text-green-400 ml-2">
                  ✓ Perfeito!
                </span>
              )}
            </p>
          </div>

          {/* Lista de Categorias */}
          <div className="space-y-3">
            {categoriasPersonalizadas.map((categoria, index) => (
              <div key={index} className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
                  <div className="md:col-span-3">
                    <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">Nome</label>
                    <input
                      type="text"
                      value={categoria.nome}
                      onChange={(e) => atualizarCategoria(index, 'nome', e.target.value)}
                      className="input-mobile text-sm"
                      placeholder="Ex: Essenciais"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">%</label>
                    <input
                      type="number"
                      value={categoria.percentual}
                      onChange={(e) => atualizarCategoria(index, 'percentual', Number(e.target.value))}
                      className="input-mobile text-sm"
                      placeholder="50"
                      min="0"
                      max="100"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">Cor</label>
                    <input
                      type="color"
                      value={categoria.cor}
                      onChange={(e) => atualizarCategoria(index, 'cor', e.target.value)}
                      className="w-full h-10 rounded-lg border border-gray-300 dark:border-gray-600 cursor-pointer"
                    />
                  </div>

                  <div className="md:col-span-4">
                    <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">Descrição</label>
                    <input
                      type="text"
                      value={categoria.descricao}
                      onChange={(e) => atualizarCategoria(index, 'descricao', e.target.value)}
                      className="input-mobile text-sm"
                      placeholder="Ex: Moradia, alimentação"
                    />
                  </div>

                  <div className="md:col-span-1 flex items-end">
                    <button
                      onClick={() => removerCategoria(index)}
                      className="w-full px-3 py-2 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
                      title="Remover categoria"
                    >
                      <Trash2 className="w-4 h-4 mx-auto" />
                    </button>
                  </div>
                </div>

                <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                  Valor: <span className="font-bold text-gray-900 dark:text-white">
                    {formatarMoeda(rendaMensal * (categoria.percentual / 100))}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Gráfico de Pizza */}
      <div className="w-full h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={dados}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ percent }) => `${((Number(percent) || 0) * 100).toFixed(0)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="valor"
            >
              {dados.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.cor} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Cards de Distribuição */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {dados.map((item, index) => (
          <div
            key={index}
            className="p-4 rounded-lg border-2"
            style={{
              backgroundColor: `${item.cor}10`,
              borderColor: item.cor
            }}
          >
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
              {item.nome}
            </h3>
            <p className="text-2xl font-bold" style={{ color: item.cor }}>
              {formatarMoeda(item.valor)}
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
              {item.descricao}
            </p>
          </div>
        ))}
      </div>

      {/* Dicas por Método */}
      {metodo !== 'personalizado' && (
        <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
          <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-3">
            💡 Sobre o Método {metodo}
          </h3>
          {metodo === '50/30/20' && (
            <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
              <li>• <strong>50% Essenciais:</strong> Moradia, alimentação, transporte, saúde</li>
              <li>• <strong>30% Desejos:</strong> Lazer, restaurantes, hobbies, viagens</li>
              <li>• <strong>20% Investimentos:</strong> Reserva de emergência, aposentadoria</li>
              <li className="mt-3 text-blue-700 dark:text-blue-300">✓ Método equilibrado e popular</li>
            </ul>
          )}
          {metodo === '70/20/10' && (
            <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
              <li>• <strong>70% Essenciais:</strong> Necessidades básicas e pagamento de dívidas</li>
              <li>• <strong>20% Investimentos:</strong> Poupança e investimentos</li>
              <li>• <strong>10% Lazer:</strong> Entretenimento e desejos</li>
              <li className="mt-3 text-blue-700 dark:text-blue-300">✓ Ideal para quem tem dívidas ou custos altos</li>
            </ul>
          )}
          {metodo === '80/20' && (
            <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
              <li>• <strong>80% Gastos:</strong> Todas as despesas mensais</li>
              <li>• <strong>20% Investimentos:</strong> Poupança e investimentos</li>
              <li className="mt-3 text-blue-700 dark:text-blue-300">✓ Método simples e direto</li>
            </ul>
          )}
        </div>
      )}

      {/* Projeção Anual */}
      <div className="p-4 rounded-lg bg-gradient-to-r from-primary-50 to-purple-50 dark:from-primary-900/20 dark:to-purple-900/20 border border-primary-200 dark:border-primary-800">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
          📊 Projeção de Acumulação
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {dados.map((item, index) => {
            const valorAnual = item.valor * 12;
            return (
              <div key={index}>
                <p className="text-xs text-gray-600 dark:text-gray-400">{item.nome.split(' (')[0]}</p>
                <p className="text-lg font-bold" style={{ color: item.cor }}>
                  {formatarMoeda(valorAnual)}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">por ano</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
