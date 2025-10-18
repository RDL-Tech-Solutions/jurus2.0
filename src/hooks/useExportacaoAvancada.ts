import { useState } from 'react';
import { SimulacaoInput, ResultadoSimulacao } from '../types';

export interface ExportOptions {
  incluirGraficos: boolean;
  incluirTabelas: boolean;
  incluirAnaliseRisco: boolean;
  incluirBenchmarks: boolean;
  formato: 'pdf' | 'excel' | 'word';
  template: 'executivo' | 'completo' | 'resumido';
}

export interface RelatorioData {
  simulacao: SimulacaoInput;
  resultado: ResultadoSimulacao;
  dataGeracao: Date;
  versao: string;
  graficos?: {
    evolucao: string; // base64
    distribuicao: string; // base64
    comparacao: string; // base64
  };
}

export function useExportacaoAvancada() {
  const [isExporting, setIsExporting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const capturarGrafico = async (elementId: string): Promise<string> => {
    try {
      const element = document.getElementById(elementId);
      if (!element) throw new Error(`Elemento ${elementId} não encontrado`);

      // Usar html2canvas para capturar o gráfico
      const html2canvas = await import('html2canvas');
      const canvas = await html2canvas.default(element, {
        backgroundColor: '#ffffff',
        scale: 2,
        useCORS: true,
        allowTaint: true
      });

      return canvas.toDataURL('image/png', 0.9);
    } catch (err) {
      console.error('Erro ao capturar gráfico:', err);
      return '';
    }
  };

  const gerarPDF = async (data: RelatorioData, options: ExportOptions): Promise<Blob> => {
    const jsPDF = await import('jspdf');
    const doc = new jsPDF.jsPDF();

    // Configurações do documento
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 20;
    let yPosition = margin;

    // Função auxiliar para adicionar texto
    const addText = (text: string, fontSize = 12, isBold = false) => {
      doc.setFontSize(fontSize);
      if (isBold) doc.setFont(undefined, 'bold');
      else doc.setFont(undefined, 'normal');
      
      if (yPosition > pageHeight - margin) {
        doc.addPage();
        yPosition = margin;
      }
      
      doc.text(text, margin, yPosition);
      yPosition += fontSize * 0.5;
    };

    // Cabeçalho
    addText('RELATÓRIO DE SIMULAÇÃO DE JUROS COMPOSTOS', 16, true);
    yPosition += 10;
    addText(`Gerado em: ${data.dataGeracao.toLocaleDateString('pt-BR')}`, 10);
    addText(`Versão: ${data.versao}`, 10);
    yPosition += 15;

    // Dados da simulação
    addText('DADOS DA SIMULAÇÃO', 14, true);
    yPosition += 5;
    addText(`Valor Inicial: R$ ${data.simulacao.valorInicial.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`);
    addText(`Aporte Mensal: R$ ${data.simulacao.valorMensal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`);
    addText(`Taxa: ${data.simulacao.taxaPersonalizada || data.simulacao.modalidade?.taxaAnual || 0}% ao ano`);
    addText(`Período: ${data.simulacao.periodo} ${data.simulacao.unidadePeriodo}`);
    yPosition += 15;

    // Resultados
    addText('RESULTADOS', 14, true);
    yPosition += 5;
    addText(`Valor Final: R$ ${data.resultado.saldoFinal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`);
    addText(`Total Investido: R$ ${data.resultado.totalInvestido.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`);
    addText(`Juros Ganhos: R$ ${data.resultado.totalJuros.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`);
    addText(`Rentabilidade: ${data.resultado.rentabilidadeTotal.toFixed(2)}%`);
    yPosition += 15;

    // Adicionar gráficos se solicitado
    if (options.incluirGraficos && data.graficos) {
      if (data.graficos.evolucao) {
        doc.addPage();
        yPosition = margin;
        addText('GRÁFICO DE EVOLUÇÃO', 14, true);
        yPosition += 10;
        
        try {
          doc.addImage(data.graficos.evolucao, 'PNG', margin, yPosition, pageWidth - 2 * margin, 120);
          yPosition += 130;
        } catch (err) {
          console.error('Erro ao adicionar gráfico:', err);
        }
      }
    }

    // Adicionar tabela se solicitado
    if (options.incluirTabelas) {
      doc.addPage();
      yPosition = margin;
      addText('EVOLUÇÃO MENSAL', 14, true);
      yPosition += 10;

      // Cabeçalho da tabela
      doc.setFontSize(10);
      doc.text('Mês', margin, yPosition);
      doc.text('Saldo', margin + 30, yPosition);
      doc.text('Aporte', margin + 70, yPosition);
      doc.text('Juros', margin + 110, yPosition);
      yPosition += 8;

      // Dados da tabela (primeiros 12 meses)
      data.resultado.evolucaoMensal.slice(0, 12).forEach((item, index) => {
        if (yPosition > pageHeight - margin) {
          doc.addPage();
          yPosition = margin;
        }
        
        doc.text(`${index + 1}`, margin, yPosition);
        doc.text(`R$ ${item.saldoAcumulado.toLocaleString('pt-BR')}`, margin + 30, yPosition);
        doc.text(`R$ ${item.contribuicao.toLocaleString('pt-BR')}`, margin + 70, yPosition);
        doc.text(`R$ ${item.juros.toLocaleString('pt-BR')}`, margin + 110, yPosition);
        yPosition += 6;
      });
    }

    return doc.output('blob');
  };

  const gerarExcel = async (data: RelatorioData): Promise<Blob> => {
    const XLSX = await import('xlsx');
    
    // Criar workbook
    const wb = XLSX.utils.book_new();

    // Planilha de resumo
    const resumoData = [
      ['SIMULAÇÃO DE JUROS COMPOSTOS'],
      [''],
      ['Dados da Simulação'],
      ['Valor Inicial', `R$ ${data.simulacao.valorInicial.toLocaleString('pt-BR')}`],
      ['Aporte Mensal', `R$ ${data.simulacao.valorMensal.toLocaleString('pt-BR')}`],
      ['Taxa', `${data.simulacao.taxaPersonalizada || data.simulacao.modalidade?.taxaAnual || 0}% ao ano`],
      ['Período', `${data.simulacao.periodo} ${data.simulacao.unidadePeriodo}`],
      [''],
      ['Resultados'],
      ['Valor Final', `R$ ${data.resultado.saldoFinal.toLocaleString('pt-BR')}`],
      ['Total Investido', `R$ ${data.resultado.totalInvestido.toLocaleString('pt-BR')}`],
      ['Juros Ganhos', `R$ ${data.resultado.totalJuros.toLocaleString('pt-BR')}`],
      ['Rentabilidade Total', `${data.resultado.rentabilidadeTotal.toFixed(2)}%`]
    ];

    const wsResumo = XLSX.utils.aoa_to_sheet(resumoData);
    XLSX.utils.book_append_sheet(wb, wsResumo, 'Resumo');

    // Planilha de evolução mensal
    const evolucaoData = [
      ['Mês', 'Saldo Inicial', 'Aporte', 'Juros', 'Saldo Final']
    ];

    data.resultado.evolucaoMensal.forEach((item, index) => {
      evolucaoData.push([
        (index + 1).toString(),
        (item.saldoAcumulado - item.contribuicao - item.juros).toFixed(2),
        item.contribuicao.toFixed(2),
        item.juros.toFixed(2),
        item.saldoAcumulado.toFixed(2)
      ]);
    });

    const wsEvolucao = XLSX.utils.aoa_to_sheet(evolucaoData);
    XLSX.utils.book_append_sheet(wb, wsEvolucao, 'Evolução Mensal');

    // Converter para blob
    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    return new Blob([wbout], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  };

  const exportarRelatorio = async (
    simulacao: SimulacaoInput,
    resultado: ResultadoSimulacao,
    options: ExportOptions
  ): Promise<void> => {
    setIsExporting(true);
    setProgress(0);
    setError(null);

    try {
      // Preparar dados
      setProgress(20);
      const data: RelatorioData = {
        simulacao,
        resultado,
        dataGeracao: new Date(),
        versao: '1.0.0'
      };

      // Capturar gráficos se necessário
      if (options.incluirGraficos) {
        setProgress(40);
        const graficos = {
          evolucao: await capturarGrafico('grafico-evolucao'),
          distribuicao: await capturarGrafico('grafico-distribuicao'),
          comparacao: await capturarGrafico('grafico-comparacao')
        };
        data.graficos = graficos;
      }

      setProgress(60);

      // Gerar arquivo
      let blob: Blob;
      let filename: string;

      switch (options.formato) {
        case 'pdf':
          blob = await gerarPDF(data, options);
          filename = `simulacao-juros-${Date.now()}.pdf`;
          break;
        case 'excel':
          blob = await gerarExcel(data);
          filename = `simulacao-juros-${Date.now()}.xlsx`;
          break;
        default:
          throw new Error('Formato não suportado');
      }

      setProgress(80);

      // Download
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setProgress(100);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao exportar relatório');
    } finally {
      setIsExporting(false);
      setTimeout(() => setProgress(0), 1000);
    }
  };

  return {
    exportarRelatorio,
    isExporting,
    progress,
    error,
    capturarGrafico
  };
}