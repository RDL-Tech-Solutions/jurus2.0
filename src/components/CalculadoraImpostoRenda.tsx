import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { 
  Calculator, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Percent, 
  Calendar,
  BarChart3,
  PieChart,
  Info,
  Save,
  Download
} from 'lucide-react';
import { useImpostoRenda } from '../store/useAppStore';
import { 
  calcularIRProgressivo, 
  calcularIRRegressivo, 
  compararModalidadesIR,
  calcularIRJurosCompostos,
  analisarMelhorModalidade,
  calcularPontoEquilibrio,
  formatarMoeda,
  formatarPercentual
} from '../utils/impostoRenda';
import { formatCurrency } from '../utils/formatters';

interface FormularioIR {
  valorInicial: number;
  valorMensal: number;
  taxaJuros: number;
  prazoMeses: number;
  modalidade: 'progressiva' | 'regressiva' | 'comparar';
}

const CalculadoraImpostoRenda: React.FC = () => {
  const { 
    simulacoesIR, 
    adicionarSimulacaoIR, 
    adicionarComparacaoIR 
  } = useImpostoRenda();

  const [formulario, setFormulario] = useState<FormularioIR>({
    valorInicial: 10000,
    valorMensal: 1000,
    taxaJuros: 12,
    prazoMeses: 24,
    modalidade: 'comparar'
  });

  const [nomeSimulacao, setNomeSimulacao] = useState('');
  const [abaSelecionada, setAbaSelecionada] = useState('calculadora');

  // Cálculos principais
  const resultados = useMemo(() => {
    const { valorInicial, valorMensal, taxaJuros, prazoMeses } = formulario;
    
    // Calcular valor final com juros compostos
    const taxaMensal = taxaJuros / 100 / 12;
    const totalInvestido = valorInicial + (valorMensal * prazoMeses);
    const valorFinal = valorInicial * Math.pow(1 + taxaMensal, prazoMeses) +
      valorMensal * ((Math.pow(1 + taxaMensal, prazoMeses) - 1) / taxaMensal);
    const rendimentoBruto = valorFinal - totalInvestido;

    // Cálculos de IR
    const irProgressivo = calcularIRJurosCompostos(valorInicial, valorMensal, taxaJuros, prazoMeses, 'progressiva');
    const irRegressivo = calcularIRJurosCompostos(valorInicial, valorMensal, taxaJuros, prazoMeses, 'regressiva');
    const comparacao = compararModalidadesIR(rendimentoBruto, prazoMeses);
    const analise = analisarMelhorModalidade(valorInicial, valorMensal, taxaJuros, prazoMeses);
    
    let pontoEquilibrio = null;
    try {
      pontoEquilibrio = calcularPontoEquilibrio(valorInicial, valorMensal, taxaJuros);
    } catch (error) {
      console.warn('Erro ao calcular ponto de equilíbrio:', error);
    }

    return {
      totalInvestido,
      valorFinal,
      rendimentoBruto,
      irProgressivo,
      irRegressivo,
      comparacao,
      analise,
      pontoEquilibrio
    };
  }, [formulario]);

  const handleInputChange = (campo: keyof FormularioIR, valor: string | number) => {
    setFormulario(prev => ({
      ...prev,
      [campo]: typeof valor === 'string' ? parseFloat(valor) || 0 : valor
    }));
  };

  const salvarSimulacao = () => {
    if (!nomeSimulacao.trim()) {
      alert('Por favor, insira um nome para a simulação');
      return;
    }

    const { irProgressivo, irRegressivo, comparacao } = resultados;
    
    // Salvar simulação progressiva
    adicionarSimulacaoIR({
      nome: `${nomeSimulacao} - Progressiva`,
      valorInicial: formulario.valorInicial,
      valorMensal: formulario.valorMensal,
      taxaJuros: formulario.taxaJuros,
      prazoMeses: formulario.prazoMeses,
      modalidadeIR: 'progressiva',
      resultadoBruto: irProgressivo.valorBruto,
      resultadoLiquido: irProgressivo.valorLiquido,
      totalIR: irProgressivo.valorIR,
      aliquotaEfetiva: irProgressivo.aliquotaEfetiva
    });

    // Salvar simulação regressiva
    adicionarSimulacaoIR({
      nome: `${nomeSimulacao} - Regressiva`,
      valorInicial: formulario.valorInicial,
      valorMensal: formulario.valorMensal,
      taxaJuros: formulario.taxaJuros,
      prazoMeses: formulario.prazoMeses,
      modalidadeIR: 'regressiva',
      resultadoBruto: irRegressivo.valorBruto,
      resultadoLiquido: irRegressivo.valorLiquido,
      totalIR: irRegressivo.valorIR,
      aliquotaEfetiva: irRegressivo.aliquotaEfetiva
    });

    // Salvar comparação
    adicionarComparacaoIR({
      nome: nomeSimulacao,
      simulacoes: [
        {
          id: Date.now().toString(),
          nome: `${nomeSimulacao} - Progressiva`,
          valorInicial: formulario.valorInicial,
          valorMensal: formulario.valorMensal,
          taxaJuros: formulario.taxaJuros,
          prazoMeses: formulario.prazoMeses,
          modalidadeIR: 'progressiva',
          resultadoBruto: irProgressivo.valorBruto,
          resultadoLiquido: irProgressivo.valorLiquido,
          totalIR: irProgressivo.valorIR,
          aliquotaEfetiva: irProgressivo.aliquotaEfetiva,
          dataCriacao: new Date().toISOString()
        },
        {
          id: (Date.now() + 1).toString(),
          nome: `${nomeSimulacao} - Regressiva`,
          valorInicial: formulario.valorInicial,
          valorMensal: formulario.valorMensal,
          taxaJuros: formulario.taxaJuros,
          prazoMeses: formulario.prazoMeses,
          modalidadeIR: 'regressiva',
          resultadoBruto: irRegressivo.valorBruto,
          resultadoLiquido: irRegressivo.valorLiquido,
          totalIR: irRegressivo.valorIR,
          aliquotaEfetiva: irRegressivo.aliquotaEfetiva,
          dataCriacao: new Date().toISOString()
        }
      ],
      melhorOpcao: comparacao.melhorOpcao,
      diferencaValor: comparacao.economia,
      diferencaPercentual: comparacao.economiaPercentual
    });

    setNomeSimulacao('');
    alert('Simulação salva com sucesso!');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Calculator className="h-6 w-6" />
            Calculadora de Imposto de Renda
          </h2>
          <p className="text-muted-foreground">
            Compare as modalidades de tributação e otimize seus investimentos
          </p>
        </div>
      </div>

      <Tabs value={abaSelecionada} onValueChange={setAbaSelecionada}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="calculadora">Calculadora</TabsTrigger>
          <TabsTrigger value="simulacoes">Simulações Salvas</TabsTrigger>
          <TabsTrigger value="comparacoes">Comparações</TabsTrigger>
        </TabsList>

        <TabsContent value="calculadora" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Formulário de Entrada */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Dados do Investimento
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="valorInicial">Valor Inicial</Label>
                    <Input
                      id="valorInicial"
                      type="number"
                      value={formulario.valorInicial}
                      onChange={(e) => handleInputChange('valorInicial', e.target.value)}
                      placeholder="10.000"
                    />
                  </div>
                  <div>
                    <Label htmlFor="valorMensal">Aporte Mensal</Label>
                    <Input
                      id="valorMensal"
                      type="number"
                      value={formulario.valorMensal}
                      onChange={(e) => handleInputChange('valorMensal', e.target.value)}
                      placeholder="1.000"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="taxaJuros">Taxa de Juros (% a.a.)</Label>
                    <Input
                      id="taxaJuros"
                      type="number"
                      step="0.1"
                      value={formulario.taxaJuros}
                      onChange={(e) => handleInputChange('taxaJuros', e.target.value)}
                      placeholder="12.0"
                    />
                  </div>
                  <div>
                    <Label htmlFor="prazoMeses">Prazo (meses)</Label>
                    <Input
                      id="prazoMeses"
                      type="number"
                      value={formulario.prazoMeses}
                      onChange={(e) => handleInputChange('prazoMeses', e.target.value)}
                      placeholder="24"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="modalidade">Modalidade de Análise</Label>
                  <Select 
                    value={formulario.modalidade} 
                    onValueChange={(value: 'progressiva' | 'regressiva' | 'comparar') => 
                      handleInputChange('modalidade', value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="comparar">Comparar Ambas</SelectItem>
                      <SelectItem value="progressiva">Apenas Progressiva</SelectItem>
                      <SelectItem value="regressiva">Apenas Regressiva</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="pt-4 border-t">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Nome da simulação"
                      value={nomeSimulacao}
                      onChange={(e) => setNomeSimulacao(e.target.value)}
                      className="flex-1"
                    />
                    <Button onClick={salvarSimulacao} size="sm">
                      <Save className="h-4 w-4 mr-1" />
                      Salvar
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Resumo dos Resultados */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Resumo dos Resultados
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-muted-foreground">Total Investido</p>
                    <p className="text-lg font-bold text-blue-600">
                      {formatCurrency(resultados.totalInvestido)}
                    </p>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <p className="text-sm text-muted-foreground">Valor Final Bruto</p>
                    <p className="text-lg font-bold text-green-600">
                      {formatCurrency(resultados.valorFinal)}
                    </p>
                  </div>
                </div>

                <div className="text-center p-3 bg-purple-50 rounded-lg">
                  <p className="text-sm text-muted-foreground">Rendimento Bruto</p>
                  <p className="text-xl font-bold text-purple-600">
                    {formatCurrency(resultados.rendimentoBruto)}
                  </p>
                </div>

                {formulario.modalidade === 'comparar' && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="text-sm font-medium">Tabela Progressiva</p>
                        <p className="text-xs text-muted-foreground">
                          IR: {formatCurrency(resultados.irProgressivo.valorIR)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-green-600">
                          {formatCurrency(resultados.irProgressivo.valorLiquido)}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {formatarPercentual(resultados.irProgressivo.aliquotaEfetiva)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="text-sm font-medium">Tabela Regressiva</p>
                        <p className="text-xs text-muted-foreground">
                          IR: {formatCurrency(resultados.irRegressivo.valorIR)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-green-600">
                          {formatCurrency(resultados.irRegressivo.valorLiquido)}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {formatarPercentual(resultados.irRegressivo.aliquotaEfetiva)}
                        </p>
                      </div>
                    </div>

                    <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                      <div className="flex items-center gap-2 mb-2">
                        <TrendingUp className="h-4 w-4 text-yellow-600" />
                        <p className="text-sm font-medium text-yellow-800">
                          Melhor Opção: {resultados.comparacao.melhorOpcao === 'progressiva' ? 'Progressiva' : 'Regressiva'}
                        </p>
                      </div>
                      <p className="text-xs text-yellow-700">
                        Economia: {formatCurrency(resultados.comparacao.economia)} 
                        ({formatarPercentual(resultados.comparacao.economiaPercentual)})
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Análise Detalhada */}
          {formulario.modalidade === 'comparar' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="h-5 w-5" />
                  Análise Detalhada
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium mb-3">Recomendação</h4>
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Info className="h-4 w-4 text-blue-600" />
                        <Badge variant={
                          resultados.analise.recomendacao === 'progressiva' ? 'default' :
                          resultados.analise.recomendacao === 'regressiva' ? 'secondary' : 'outline'
                        }>
                          {resultados.analise.recomendacao === 'progressiva' ? 'Progressiva' :
                           resultados.analise.recomendacao === 'regressiva' ? 'Regressiva' : 'Indiferente'}
                        </Badge>
                      </div>
                      <p className="text-sm text-blue-700">
                        {resultados.analise.justificativa}
                      </p>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-3">Ponto de Equilíbrio</h4>
                    {resultados.pontoEquilibrio ? (
                      <div className="p-4 bg-green-50 rounded-lg">
                        <p className="text-sm text-green-700 mb-1">
                          <strong>{resultados.pontoEquilibrio.prazoMeses} meses</strong>
                        </p>
                        <p className="text-xs text-green-600">
                          Rendimento: {formatCurrency(resultados.pontoEquilibrio.rendimento)}
                        </p>
                        <p className="text-xs text-muted-foreground mt-2">
                          Prazo onde ambas as modalidades têm resultado similar
                        </p>
                      </div>
                    ) : (
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <p className="text-sm text-muted-foreground">
                          Não foi possível calcular o ponto de equilíbrio para estes parâmetros
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Gráfico de Comparação Visual */}
                <div className="mt-6">
                  <h4 className="font-medium mb-3">Comparação Visual</h4>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Tabela Progressiva</span>
                        <span>{formatCurrency(resultados.irProgressivo.valorLiquido)}</span>
                      </div>
                      <Progress 
                        value={(resultados.irProgressivo.valorLiquido / resultados.valorFinal) * 100} 
                        className="h-3"
                      />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Tabela Regressiva</span>
                        <span>{formatCurrency(resultados.irRegressivo.valorLiquido)}</span>
                      </div>
                      <Progress 
                        value={(resultados.irRegressivo.valorLiquido / resultados.valorFinal) * 100} 
                        className="h-3"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="simulacoes" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Simulações Salvas ({simulacoesIR.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {simulacoesIR.length === 0 ? (
                <div className="text-center py-8">
                  <Calculator className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Nenhuma simulação salva ainda</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {simulacoesIR.map((simulacao) => (
                    <div key={simulacao.id} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">{simulacao.nome}</h4>
                        <Badge variant={simulacao.modalidadeIR === 'progressiva' ? 'default' : 'secondary'}>
                          {simulacao.modalidadeIR === 'progressiva' ? 'Progressiva' : 'Regressiva'}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Valor Inicial</p>
                          <p className="font-medium">{formatCurrency(simulacao.valorInicial)}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Aporte Mensal</p>
                          <p className="font-medium">{formatCurrency(simulacao.valorMensal)}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Resultado Líquido</p>
                          <p className="font-medium text-green-600">{formatCurrency(simulacao.resultadoLiquido)}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">IR Pago</p>
                          <p className="font-medium text-red-600">{formatCurrency(simulacao.totalIR)}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="comparacoes" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Comparações Salvas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Funcionalidade em desenvolvimento</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CalculadoraImpostoRenda;