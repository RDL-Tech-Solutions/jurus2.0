// Tipos para Funcionalidades Premium

// Sistema de Relatórios PDF
export interface RelatorioConfig {
  id: string;
  nome: string;
  descricao: string;
  tipo: 'completo' | 'resumido' | 'comparativo' | 'personalizado';
  template: TemplateRelatorio;
  configuracoes: ConfiguracaoRelatorio;
  dataUltimaModificacao: Date;
}

export interface TemplateRelatorio {
  id: string;
  nome: string;
  layout: 'portrait' | 'landscape';
  tamanho: 'A4' | 'A3' | 'Letter';
  margens: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
  cabecalho: SecaoRelatorio;
  rodape: SecaoRelatorio;
  secoes: SecaoRelatorio[];
  estilos: EstilosRelatorio;
}

export interface SecaoRelatorio {
  id: string;
  tipo: 'texto' | 'tabela' | 'grafico' | 'imagem' | 'espacamento' | 'quebra_pagina';
  titulo?: string;
  conteudo: ConteudoSecao;
  posicao: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  visivel: boolean;
  condicional?: CondicaoVisibilidade;
}

export interface ConteudoSecao {
  texto?: string;
  tabela?: DadosTabela;
  grafico?: ConfiguracaoGrafico;
  imagem?: ConfiguracaoImagem;
  variaveis?: { [key: string]: any };
}

export interface DadosTabela {
  cabecalhos: string[];
  linhas: (string | number)[][];
  estilos: EstilosTabela;
  paginacao?: boolean;
  ordenacao?: {
    coluna: number;
    direcao: 'asc' | 'desc';
  };
}

export interface ConfiguracaoGrafico {
  tipo: 'linha' | 'barra' | 'pizza' | 'area' | 'dispersao';
  dados: any[];
  opcoes: {
    titulo?: string;
    legendas: boolean;
    cores: string[];
    eixos?: {
      x: ConfiguracaoEixo;
      y: ConfiguracaoEixo;
    };
  };
  tamanho: {
    width: number;
    height: number;
  };
}

export interface ConfiguracaoEixo {
  titulo: string;
  formato?: string;
  escala?: 'linear' | 'logaritmica';
  minimo?: number;
  maximo?: number;
}

export interface ConfiguracaoImagem {
  url: string;
  alt: string;
  ajuste: 'cover' | 'contain' | 'fill' | 'none';
  qualidade: number;
}

export interface EstilosRelatorio {
  fonte: {
    familia: string;
    tamanho: number;
    cor: string;
  };
  cores: {
    primaria: string;
    secundaria: string;
    fundo: string;
    texto: string;
    destaque: string;
  };
  espacamento: {
    linha: number;
    paragrafo: number;
    secao: number;
  };
}

export interface EstilosTabela {
  cabecalho: {
    fundo: string;
    texto: string;
    fonte: string;
  };
  linhas: {
    alternada: boolean;
    corPar: string;
    corImpar: string;
  };
  bordas: {
    cor: string;
    espessura: number;
    estilo: 'solid' | 'dashed' | 'dotted';
  };
}

export interface CondicaoVisibilidade {
  campo: string;
  operador: '=' | '!=' | '>' | '<' | '>=' | '<=' | 'contains' | 'not_contains';
  valor: any;
}

export interface ConfiguracaoRelatorio {
  incluirCapa: boolean;
  incluirIndice: boolean;
  incluirResumoExecutivo: boolean;
  incluirGraficos: boolean;
  incluirTabelas: boolean;
  incluirComparacoes: boolean;
  incluirRecomendacoes: boolean;
  incluirDisclaimer: boolean;
  marca: {
    logo?: string;
    nome: string;
    cores: string[];
  };
  personalizacao: {
    [key: string]: any;
  };
}

export interface DadosRelatorio {
  simulacao: any;
  resultado: any;
  comparacoes?: any[];
  analises?: any[];
  recomendacoes?: any[];
  metadados: {
    dataGeracao: Date;
    versao: string;
    usuario?: string;
    configuracoes: any;
  };
}

export interface RelatorioGerado {
  id: string;
  nome: string;
  tipo: string;
  tamanho: number;
  dataGeracao: Date;
  url?: string;
  buffer?: ArrayBuffer;
  status: 'gerando' | 'concluido' | 'erro';
  erro?: string;
  progresso: number;
}

// Análise de Monte Carlo Avançada
export interface ConfiguracaoMonteCarlo {
  numeroSimulacoes: number;
  semente?: number;
  distribuicoes: DistribuicaoParametro[];
  correlacoes?: MatrizCorrelacao;
  cenarios: CenarioMonteCarlo[];
  metricas: MetricaMonteCarlo[];
  configuracaoAvancada: ConfiguracaoAvancadaMonteCarlo;
}

export interface DistribuicaoParametro {
  parametro: string;
  tipo: 'normal' | 'lognormal' | 'uniforme' | 'triangular' | 'beta' | 'gamma';
  parametros: {
    media?: number;
    desvio?: number;
    minimo?: number;
    maximo?: number;
    moda?: number;
    alpha?: number;
    beta?: number;
  };
  limitesRealisticos?: {
    minimo: number;
    maximo: number;
  };
}

export interface MatrizCorrelacao {
  parametros: string[];
  matriz: number[][];
}

export interface CenarioMonteCarlo {
  id: string;
  nome: string;
  descricao: string;
  probabilidade: number;
  ajustes: {
    [parametro: string]: number;
  };
  condicoes?: CondicaoCenario[];
}

export interface CondicaoCenario {
  parametro: string;
  operador: '>' | '<' | '=' | '>=' | '<=';
  valor: number;
}

export interface MetricaMonteCarlo {
  nome: string;
  tipo: 'percentil' | 'probabilidade' | 'valor_esperado' | 'var' | 'cvar' | 'sharpe' | 'sortino' | 'max_drawdown';
  parametros?: {
    percentil?: number;
    limite?: number;
    confianca?: number;
  };
}

export interface ConfiguracaoAvancadaMonteCarlo {
  metodoAmostragem: 'aleatorio' | 'latin_hypercube' | 'sobol' | 'halton';
  reducaoVariancia: boolean;
  controleAntitetico: boolean;
  estratificacao: boolean;
  paralelizacao: boolean;
  numeroThreads?: number;
  salvarTrajetorias: boolean;
  intervalosConfianca: number[];
}

export interface ResultadoMonteCarlo {
  id: string;
  configuracao: ConfiguracaoMonteCarlo;
  estatisticas: EstatisticasMonteCarlo;
  distribuicoes: DistribuicaoResultado[];
  cenarios: ResultadoCenario[];
  trajetorias?: TrajetoriaMonteCarlo[];
  metricas: ResultadoMetrica[];
  analiseRisco: AnaliseRiscoMonteCarlo;
  tempoExecucao: number;
  dataGeracao: Date;
}

export interface EstatisticasMonteCarlo {
  media: number;
  mediana: number;
  desvio: number;
  variancia: number;
  assimetria: number;
  curtose: number;
  minimo: number;
  maximo: number;
  percentis: { [percentil: number]: number };
}

export interface DistribuicaoResultado {
  parametro: string;
  valores: number[];
  densidade: { x: number; y: number }[];
  estatisticas: EstatisticasMonteCarlo;
}

export interface ResultadoCenario {
  cenario: CenarioMonteCarlo;
  frequencia: number;
  resultadoMedio: number;
  impacto: number;
  probabilidadeOcorrencia: number;
}

export interface TrajetoriaMonteCarlo {
  simulacao: number;
  valores: { periodo: number; valor: number }[];
  parametros: { [nome: string]: number };
  resultado: number;
}

export interface ResultadoMetrica {
  metrica: MetricaMonteCarlo;
  valor: number;
  interpretacao: string;
  categoria: 'baixo' | 'medio' | 'alto';
}

export interface AnaliseRiscoMonteCarlo {
  var95: number;
  var99: number;
  cvar95: number;
  cvar99: number;
  probabilidadePerdas: number;
  perdaMaxima: number;
  perdaEsperada: number;
  sharpeRatio: number;
  sortinoRatio: number;
  maxDrawdown: number;
  classificacaoRisco: 'conservador' | 'moderado' | 'agressivo';
  recomendacoes: string[];
}

// Integração com APIs de Mercado
export interface ConfiguracaoAPI {
  id: string;
  nome: string;
  tipo: 'cotacoes' | 'indices' | 'commodities' | 'criptomoedas' | 'fundos' | 'acoes';
  provedor: string;
  endpoint: string;
  chaveAPI?: string;
  parametros: { [key: string]: any };
  limiteTaxa: number;
  cache: ConfiguracaoCache;
  ativo: boolean;
}

export interface ConfiguracaoCache {
  duracao: number; // em minutos
  tamanhoMaximo: number; // em MB
  estrategia: 'lru' | 'fifo' | 'ttl';
}

export interface DadosMercado {
  simbolo: string;
  nome: string;
  preco: number;
  variacao: number;
  variacaoPercentual: number;
  volume: number;
  timestamp: Date;
  fonte: string;
  metadados?: { [key: string]: any };
}

export interface HistoricoPrecosAPI {
  simbolo: string;
  periodo: string;
  dados: {
    data: Date;
    abertura: number;
    fechamento: number;
    maximo: number;
    minimo: number;
    volume: number;
  }[];
  fonte: string;
  ultimaAtualizacao: Date;
}

export interface IndicadorEconomico {
  nome: string;
  codigo: string;
  valor: number;
  unidade: string;
  periodo: string;
  dataReferencia: Date;
  fonte: string;
  descricao?: string;
}

export interface StatusAPI {
  provedor: string;
  status: 'online' | 'offline' | 'limitado' | 'erro';
  latencia: number;
  ultimaVerificacao: Date;
  limitesUso: {
    usado: number;
    limite: number;
    resetEm: Date;
  };
  erro?: string;
}

// Sistema de Backup na Nuvem
export interface ConfiguracaoBackup {
  id: string;
  provedor: 'aws' | 'google' | 'azure' | 'dropbox' | 'onedrive';
  credenciais: CredenciaisNuvem;
  configuracao: ConfiguracaoSincronizacao;
  criptografia: ConfiguracaoCriptografia;
  ativo: boolean;
}

export interface CredenciaisNuvem {
  chaveAcesso?: string;
  chaveSecreta?: string;
  token?: string;
  bucket?: string;
  regiao?: string;
  pasta?: string;
}

export interface ConfiguracaoSincronizacao {
  automatico: boolean;
  frequencia: 'tempo_real' | 'diario' | 'semanal' | 'mensal';
  horario?: string;
  incluirHistorico: boolean;
  incluirConfiguracoes: boolean;
  incluirRelatorios: boolean;
  compressao: boolean;
  versionamento: boolean;
  retencao: number; // dias
}

export interface ConfiguracaoCriptografia {
  ativo: boolean;
  algoritmo: 'AES-256' | 'ChaCha20';
  chave?: string;
  salt?: string;
}

export interface BackupItem {
  id: string;
  tipo: 'simulacao' | 'relatorio' | 'configuracao' | 'historico';
  nome: string;
  tamanho: number;
  dataBackup: Date;
  checksum: string;
  versao: number;
  criptografado: boolean;
  url?: string;
  metadados: { [key: string]: any };
}

export interface StatusBackup {
  ultimoBackup: Date;
  proximoBackup?: Date;
  itensBackup: number;
  tamanhoTotal: number;
  status: 'sincronizado' | 'pendente' | 'erro' | 'sincronizando';
  progresso?: number;
  erro?: string;
  estatisticas: {
    totalBackups: number;
    sucessos: number;
    falhas: number;
    espacoUsado: number;
    espacoDisponivel: number;
  };
}

export interface LogBackup {
  id: string;
  timestamp: Date;
  operacao: 'backup' | 'restore' | 'delete' | 'sync';
  status: 'sucesso' | 'erro' | 'em_progresso';
  detalhes: string;
  itensAfetados: number;
  tamanho?: number;
  duracao?: number;
  erro?: string;
}

// Configurações Premium Gerais
export interface ConfiguracaoPremium {
  ativa: boolean;
  plano: 'basico' | 'profissional' | 'empresarial';
  dataVencimento: Date;
  funcionalidades: {
    relatoriosPDF: boolean;
    monteCarloAvancado: boolean;
    integracaoAPIs: boolean;
    backupNuvem: boolean;
    suportePrioritario: boolean;
    analisePersonalizada: boolean;
  };
  limites: {
    relatoriosMes: number;
    simulacoesMonteCarlo: number;
    chamadasAPI: number;
    espacoBackup: number; // em GB
  };
  uso: {
    relatoriosGerados: number;
    simulacoesRealizadas: number;
    chamadasAPI: number;
    espacoUtilizado: number;
  };
}

export interface LicencaPremium {
  id: string;
  usuario: string;
  plano: string;
  dataInicio: Date;
  dataVencimento: Date;
  status: 'ativa' | 'expirada' | 'suspensa' | 'cancelada';
  renovacaoAutomatica: boolean;
  metodoPagamento?: string;
  historicoPagamentos: HistoricoPagamento[];
}

export interface HistoricoPagamento {
  id: string;
  data: Date;
  valor: number;
  moeda: string;
  status: 'pago' | 'pendente' | 'falhou' | 'reembolsado';
  metodo: string;
  transacaoId?: string;
}

export interface AnaliseUso {
  periodo: {
    inicio: Date;
    fim: Date;
  };
  estatisticas: {
    relatoriosGerados: number;
    simulacoesRealizadas: number;
    chamadasAPI: number;
    tempoUso: number; // em minutos
    funcionalidadesMaisUsadas: { nome: string; uso: number }[];
  };
  tendencias: {
    crescimentoUso: number;
    picos: Date[];
    padroes: string[];
  };
  recomendacoes: string[];
}