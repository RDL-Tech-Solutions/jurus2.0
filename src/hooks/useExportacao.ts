import { useState } from 'react';
import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import html2canvas from 'html2canvas';

export interface DadosRelatorio {
  simulacao: any;
  resultado: any;
  historico?: any[];
  metas?: any[];
  performance?: any;
  cenarios?: any[];
  recomendacoes?: any[];
}

export interface ConfiguracaoRelatorio {
  incluirGraficos: boolean;
  incluirHistorico: boolean;
  incluirMetas: boolean;
  incluirPerformance: boolean;
  incluirCenarios: boolean;
  incluirRecomendacoes: boolean;
  formatoData: 'dd/mm/yyyy' | 'mm/dd/yyyy' | 'yyyy-mm-dd';
  moeda: 'BRL' | 'USD' | 'EUR';
  idioma: 'pt-BR' | 'en-US' | 'es-ES';
}

interface UseExportacaoReturn {
  isExporting: boolean;
  exportarPDF: (dados: DadosRelatorio, config: ConfiguracaoRelatorio) => Promise<void>;
  exportarExcel: (dados: DadosRelatorio, config: ConfiguracaoRelatorio) => Promise<void>;
  exportarJSON: (dados: DadosRelatorio) => void;
  compartilharSimulacao: (dados: DadosRelatorio) => Promise<string>;
  gerarRelatorioCompleto: (dados: DadosRelatorio, config: ConfiguracaoRelatorio) => Promise<void>;
}

export function useExportacao(): UseExportacaoReturn {
  const [isExporting, setIsExporting] = useState(false);

  const formatarMoeda = (valor: number, moeda: string = 'BRL'): string => {
    const formatters = {
      BRL: new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }),
      USD: new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }),
      EUR: new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' })
    };
    return formatters[moeda as keyof typeof formatters]?.format(valor) || `R$ ${valor.toLocaleString()}`;
  };

  const formatarData = (data: Date, formato: string = 'dd/mm/yyyy'): string => {
    const dia = data.getDate().toString().padStart(2, '0');
    const mes = (data.getMonth() + 1).toString().padStart(2, '0');
    const ano = data.getFullYear();

    switch (formato) {
      case 'mm/dd/yyyy': return `${mes}/${dia}/${ano}`;
      case 'yyyy-mm-dd': return `${ano}-${mes}-${dia}`;
      default: return `${dia}/${mes}/${ano}`;
    }
  };

  const capturarGrafico = async (elementId: string): Promise<string> => {
    const elemento = document.getElementById(elementId);
    if (!elemento) return '';

    try {
      const canvas = await html2canvas(elemento, {
        backgroundColor: '#ffffff',
        scale: 2,
        logging: false,
        useCORS: true
      });
      return canvas.toDataURL('image/png');
    } catch (error) {
      console.error('Erro ao capturar gráfico:', error);
      return '';
    }
  };

  const exportarPDF = async (dados: DadosRelatorio, config: ConfiguracaoRelatorio): Promise<void> => {
    setIsExporting(true);
    
    try {
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      let yPosition = 20;

      // Cabeçalho
      pdf.setFontSize(20);
      pdf.setTextColor(59, 130, 246); // blue-600
      pdf.text('Relatório de Simulação - Juros Compostos', pageWidth / 2, yPosition, { align: 'center' });
      
      yPosition += 15;
      pdf.setFontSize(12);
      pdf.setTextColor(107, 114, 128); // gray-500
      pdf.text(`Gerado em: ${formatarData(new Date(), config.formatoData)}`, pageWidth / 2, yPosition, { align: 'center' });

      yPosition += 20;

      // Dados da Simulação
      pdf.setFontSize(16);
      pdf.setTextColor(17, 24, 39); // gray-900
      pdf.text('Dados da Simulação', 20, yPosition);
      yPosition += 10;

      pdf.setFontSize(11);
      const dadosSimulacao = [
        `Valor Inicial: ${formatarMoeda(dados.simulacao.valorInicial, config.moeda)}`,
        `Aporte Mensal: ${formatarMoeda(dados.simulacao.aporteMensal, config.moeda)}`,
        `Taxa de Juros: ${dados.simulacao.taxaJuros}% ao ano`,
        `Período: ${dados.simulacao.periodo} meses`,
        `Valor Final: ${formatarMoeda(dados.resultado.valorFinal, config.moeda)}`,
        `Total Investido: ${formatarMoeda(dados.resultado.totalInvestido, config.moeda)}`,
        `Juros Ganhos: ${formatarMoeda(dados.resultado.jurosGanhos, config.moeda)}`
      ];

      dadosSimulacao.forEach(linha => {
        pdf.text(linha, 25, yPosition);
        yPosition += 6;
      });

      yPosition += 10;

      // Gráfico (se configurado)
      if (config.incluirGraficos) {
        const graficoImg = await capturarGrafico('grafico-principal');
        if (graficoImg) {
          pdf.addImage(graficoImg, 'PNG', 20, yPosition, pageWidth - 40, 80);
          yPosition += 90;
        }
      }

      // Nova página se necessário
      if (yPosition > pageHeight - 50) {
        pdf.addPage();
        yPosition = 20;
      }

      // Histórico (se configurado)
      if (config.incluirHistorico && dados.historico && dados.historico.length > 0) {
        pdf.setFontSize(16);
        pdf.setTextColor(17, 24, 39);
        pdf.text('Histórico de Simulações', 20, yPosition);
        yPosition += 10;

        pdf.setFontSize(10);
        dados.historico.slice(0, 10).forEach((item, index) => {
          const linha = `${index + 1}. ${formatarData(new Date(item.data), config.formatoData)} - ${formatarMoeda(item.valorFinal, config.moeda)}`;
          pdf.text(linha, 25, yPosition);
          yPosition += 5;
        });

        yPosition += 10;
      }

      // Performance (se configurado)
      if (config.incluirPerformance && dados.performance) {
        if (yPosition > pageHeight - 60) {
          pdf.addPage();
          yPosition = 20;
        }

        pdf.setFontSize(16);
        pdf.setTextColor(17, 24, 39);
        pdf.text('Análise de Performance', 20, yPosition);
        yPosition += 10;

        pdf.setFontSize(11);
        const performanceData = [
          `Rentabilidade Anual: ${dados.performance.rentabilidadeAnual?.toFixed(2)}%`,
          `Comparação CDI: ${dados.performance.comparacaoCDI?.toFixed(2)}%`,
          `Volatilidade: ${dados.performance.volatilidade?.toFixed(2)}%`,
          `Sharpe Ratio: ${dados.performance.sharpeRatio?.toFixed(2)}`
        ];

        performanceData.forEach(linha => {
          pdf.text(linha, 25, yPosition);
          yPosition += 6;
        });
      }

      // Recomendações (se configurado)
      if (config.incluirRecomendacoes && dados.recomendacoes && dados.recomendacoes.length > 0) {
        if (yPosition > pageHeight - 80) {
          pdf.addPage();
          yPosition = 20;
        }

        pdf.setFontSize(16);
        pdf.setTextColor(17, 24, 39);
        pdf.text('Recomendações IA', 20, yPosition);
        yPosition += 10;

        pdf.setFontSize(10);
        dados.recomendacoes.slice(0, 5).forEach((rec, index) => {
          pdf.text(`${index + 1}. ${rec.nome} (${rec.percentualSugerido?.toFixed(1)}%)`, 25, yPosition);
          yPosition += 5;
          pdf.text(`   ${rec.motivo}`, 30, yPosition);
          yPosition += 8;
        });
      }

      // Rodapé
      const totalPages = pdf.internal.pages.length - 1;
      for (let i = 1; i <= totalPages; i++) {
        pdf.setPage(i);
        pdf.setFontSize(8);
        pdf.setTextColor(107, 114, 128);
        pdf.text(`Página ${i} de ${totalPages}`, pageWidth / 2, pageHeight - 10, { align: 'center' });
        pdf.text('Gerado por Calculadora de Juros Compostos', pageWidth / 2, pageHeight - 5, { align: 'center' });
      }

      // Salvar PDF
      const nomeArquivo = `relatorio-simulacao-${formatarData(new Date(), 'yyyy-mm-dd')}.pdf`;
      pdf.save(nomeArquivo);

    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      throw new Error('Falha ao gerar relatório PDF');
    } finally {
      setIsExporting(false);
    }
  };

  const exportarExcel = async (dados: DadosRelatorio, config: ConfiguracaoRelatorio): Promise<void> => {
    setIsExporting(true);

    try {
      const workbook = XLSX.utils.book_new();

      // Aba: Resumo da Simulação
      const resumoData = [
        ['Relatório de Simulação - Juros Compostos'],
        [`Gerado em: ${formatarData(new Date(), config.formatoData)}`],
        [''],
        ['DADOS DA SIMULAÇÃO'],
        ['Valor Inicial', formatarMoeda(dados.simulacao.valorInicial, config.moeda)],
        ['Aporte Mensal', formatarMoeda(dados.simulacao.aporteMensal, config.moeda)],
        ['Taxa de Juros', `${dados.simulacao.taxaJuros}% ao ano`],
        ['Período', `${dados.simulacao.periodo} meses`],
        [''],
        ['RESULTADOS'],
        ['Valor Final', formatarMoeda(dados.resultado.valorFinal, config.moeda)],
        ['Total Investido', formatarMoeda(dados.resultado.totalInvestido, config.moeda)],
        ['Juros Ganhos', formatarMoeda(dados.resultado.jurosGanhos, config.moeda)],
        ['Rentabilidade Total', `${((dados.resultado.valorFinal / dados.resultado.totalInvestido - 1) * 100).toFixed(2)}%`]
      ];

      const resumoSheet = XLSX.utils.aoa_to_sheet(resumoData);
      XLSX.utils.book_append_sheet(workbook, resumoSheet, 'Resumo');

      // Aba: Evolução Mensal
      if (dados.resultado.evolucaoMensal) {
        const evolucaoData = [
          ['Mês', 'Valor Acumulado', 'Aporte do Mês', 'Juros do Mês', 'Total Investido']
        ];

        dados.resultado.evolucaoMensal.forEach((item: any, index: number) => {
          evolucaoData.push([
            index + 1,
            item.valor,
            dados.simulacao.aporteMensal,
            item.juros || 0,
            item.totalInvestido || 0
          ]);
        });

        const evolucaoSheet = XLSX.utils.aoa_to_sheet(evolucaoData);
        XLSX.utils.book_append_sheet(workbook, evolucaoSheet, 'Evolução Mensal');
      }

      // Aba: Histórico (se configurado)
      if (config.incluirHistorico && dados.historico && dados.historico.length > 0) {
        const historicoData = [
          ['Data', 'Valor Inicial', 'Aporte Mensal', 'Taxa (%)', 'Período (meses)', 'Valor Final']
        ];

        dados.historico.forEach((item: any) => {
          historicoData.push([
            formatarData(new Date(item.data), config.formatoData),
            item.valorInicial,
            item.aporteMensal,
            item.taxaJuros,
            item.periodo,
            item.valorFinal
          ]);
        });

        const historicoSheet = XLSX.utils.aoa_to_sheet(historicoData);
        XLSX.utils.book_append_sheet(workbook, historicoSheet, 'Histórico');
      }

      // Aba: Cenários (se configurado)
      if (config.incluirCenarios && dados.cenarios && dados.cenarios.length > 0) {
        const cenariosData = [
          ['Cenário', 'Inflação (%)', 'Volatilidade (%)', 'Valor Final', 'Probabilidade (%)']
        ];

        dados.cenarios.forEach((cenario: any) => {
          cenariosData.push([
            cenario.nome,
            cenario.inflacao,
            cenario.volatilidade,
            cenario.valorFinal,
            cenario.probabilidade || 0
          ]);
        });

        const cenariosSheet = XLSX.utils.aoa_to_sheet(cenariosData);
        XLSX.utils.book_append_sheet(workbook, cenariosSheet, 'Cenários');
      }

      // Aba: Recomendações (se configurado)
      if (config.incluirRecomendacoes && dados.recomendacoes && dados.recomendacoes.length > 0) {
        const recomendacoesData = [
          ['Investimento', 'Tipo', 'Percentual Sugerido (%)', 'Rentabilidade Esperada (%)', 'Risco', 'Motivo']
        ];

        dados.recomendacoes.forEach((rec: any) => {
          recomendacoesData.push([
            rec.nome,
            rec.tipo,
            rec.percentualSugerido,
            rec.rentabilidadeEsperada,
            rec.risco,
            rec.motivo
          ]);
        });

        const recomendacoesSheet = XLSX.utils.aoa_to_sheet(recomendacoesData);
        XLSX.utils.book_append_sheet(workbook, recomendacoesSheet, 'Recomendações IA');
      }

      // Salvar Excel
      const nomeArquivo = `relatorio-simulacao-${formatarData(new Date(), 'yyyy-mm-dd')}.xlsx`;
      const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
      const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      saveAs(blob, nomeArquivo);

    } catch (error) {
      console.error('Erro ao gerar Excel:', error);
      throw new Error('Falha ao gerar relatório Excel');
    } finally {
      setIsExporting(false);
    }
  };

  const exportarJSON = (dados: DadosRelatorio): void => {
    try {
      const dadosExportacao = {
        ...dados,
        metadados: {
          versao: '1.0',
          dataExportacao: new Date().toISOString(),
          aplicacao: 'Calculadora de Juros Compostos'
        }
      };

      const jsonString = JSON.stringify(dadosExportacao, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      const nomeArquivo = `simulacao-${formatarData(new Date(), 'yyyy-mm-dd')}.json`;
      saveAs(blob, nomeArquivo);
    } catch (error) {
      console.error('Erro ao exportar JSON:', error);
      throw new Error('Falha ao exportar dados JSON');
    }
  };

  const compartilharSimulacao = async (dados: DadosRelatorio): Promise<string> => {
    try {
      // Criar um link compartilhável (simulação)
      const dadosCompartilhamento = {
        simulacao: dados.simulacao,
        resultado: dados.resultado,
        timestamp: Date.now()
      };

      const dadosEncoded = btoa(JSON.stringify(dadosCompartilhamento));
      const baseUrl = window.location.origin + window.location.pathname;
      const linkCompartilhamento = `${baseUrl}?shared=${dadosEncoded}`;

      // Copiar para clipboard se disponível
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(linkCompartilhamento);
      }

      return linkCompartilhamento;
    } catch (error) {
      console.error('Erro ao gerar link de compartilhamento:', error);
      throw new Error('Falha ao gerar link de compartilhamento');
    }
  };

  const gerarRelatorioCompleto = async (dados: DadosRelatorio, config: ConfiguracaoRelatorio): Promise<void> => {
    setIsExporting(true);

    try {
      // Gerar PDF e Excel simultaneamente
      await Promise.all([
        exportarPDF(dados, config),
        exportarExcel(dados, config)
      ]);
    } catch (error) {
      console.error('Erro ao gerar relatório completo:', error);
      throw new Error('Falha ao gerar relatório completo');
    } finally {
      setIsExporting(false);
    }
  };

  return {
    isExporting,
    exportarPDF,
    exportarExcel,
    exportarJSON,
    compartilharSimulacao,
    gerarRelatorioCompleto
  };
}