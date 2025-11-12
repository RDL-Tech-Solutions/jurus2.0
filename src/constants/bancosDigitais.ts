export interface BancoDigital {
  id: string;
  nome: string;
  logo?: string;
  cor: string;
  modalidades: ModalidadeBanco[];
}

export interface ModalidadeBanco {
  id: string;
  nome: string;
  taxaAnual: number;
  tipo: 'cdb' | 'lci_lca' | 'poupanca' | 'rdb' | 'fundo_di' | 'tesouro' | 'debentures' | 'fundos_imobiliarios';
  liquidez: 'diaria' | 'vencimento' | 'carencia';
  valorMinimo: number;
  garantia: 'fgc' | 'tesouro' | 'sem_garantia';
  descricao: string;
  prazo?: number; // em dias
  ultimoAtualizado: string;
}

// Bancos digitais populares do Brasil (Dados atualizados - Outubro 2024)
export const bancosDigitaisBrasil: BancoDigital[] = [
  {
    id: 'nubank',
    nome: 'Nubank',
    cor: '#8A05BE',
    modalidades: [
      {
        id: 'nubank_poupanca',
        nome: 'NuConta (Poupança)',
        taxaAnual: 6.17,
        tipo: 'poupanca',
        liquidez: 'diaria',
        valorMinimo: 0,
        garantia: 'fgc',
        descricao: 'Conta digital com rendimento da poupança',
        ultimoAtualizado: '2024-10-01'
      },
      {
        id: 'nubank_cdb',
        nome: 'CDB Nubank',
        taxaAnual: 14.20,
        tipo: 'cdb',
        liquidez: 'diaria',
        valorMinimo: 1,
        garantia: 'fgc',
        descricao: 'CDB com liquidez diária a 102% do CDI',
        ultimoAtualizado: '2024-10-01'
      },
      {
        id: 'nubank_rdb',
        nome: 'RDB Nubank',
        taxaAnual: 15.50,
        tipo: 'rdb',
        liquidez: 'vencimento',
        valorMinimo: 1000,
        garantia: 'fgc',
        descricao: 'RDB com vencimento em 2 anos a 112% do CDI',
        prazo: 730,
        ultimoAtualizado: '2024-10-01'
      },
      {
        id: 'nubank_fundos',
        nome: 'Fundos Nubank',
        taxaAnual: 13.80,
        tipo: 'fundo_di',
        liquidez: 'diaria',
        valorMinimo: 1,
        garantia: 'sem_garantia',
        descricao: 'Fundos multimercados e renda fixa',
        ultimoAtualizado: '2024-10-01'
      },
      {
        id: 'nubank_tesouro',
        nome: 'Tesouro Direto Nubank',
        taxaAnual: 12.90,
        tipo: 'tesouro',
        liquidez: 'diaria',
        valorMinimo: 30,
        garantia: 'tesouro',
        descricao: 'Tesouro Selic com acesso direto no app',
        ultimoAtualizado: '2024-10-01'
      }
    ]
  },
  {
    id: 'inter',
    nome: 'Banco Inter',
    cor: '#FF7A00',
    modalidades: [
      {
        id: 'inter_poupanca',
        nome: 'Poupança Inter',
        taxaAnual: 6.17,
        tipo: 'poupanca',
        liquidez: 'diaria',
        valorMinimo: 0,
        garantia: 'fgc',
        descricao: 'Poupança digital com rendimento tradicional',
        ultimoAtualizado: '2024-10-01'
      },
      {
        id: 'inter_cdb',
        nome: 'CDB Inter',
        taxaAnual: 16.80,
        tipo: 'cdb',
        liquidez: 'diaria',
        valorMinimo: 100,
        garantia: 'fgc',
        descricao: 'CDB com liquidez diária a 122% do CDI',
        ultimoAtualizado: '2024-10-01'
      },
      {
        id: 'inter_lci',
        nome: 'LCI Inter',
        taxaAnual: 13.90,
        tipo: 'lci_lca',
        liquidez: 'carencia',
        valorMinimo: 5000,
        garantia: 'fgc',
        descricao: 'LCI isenta de IR com carência de 90 dias',
        prazo: 90,
        ultimoAtualizado: '2024-10-01'
      },
      {
        id: 'inter_fundo_di',
        nome: 'Fundo DI Inter',
        taxaAnual: 14.30,
        tipo: 'fundo_di',
        liquidez: 'diaria',
        valorMinimo: 100,
        garantia: 'sem_garantia',
        descricao: 'Fundo DI com liquidez diária',
        ultimoAtualizado: '2024-10-01'
      },
      {
        id: 'inter_debentures',
        nome: 'Debêntures Inter',
        taxaAnual: 15.20,
        tipo: 'debentures',
        liquidez: 'vencimento',
        valorMinimo: 1000,
        garantia: 'sem_garantia',
        descricao: 'Debêntures de infraestrutura com vencimento em 5 anos',
        prazo: 1825,
        ultimoAtualizado: '2024-10-01'
      }
    ]
  },
  {
    id: 'c6bank',
    nome: 'C6 Bank',
    cor: '#FFD700',
    modalidades: [
      {
        id: 'c6_poupanca',
        nome: 'Poupança C6',
        taxaAnual: 6.17,
        tipo: 'poupanca',
        liquidez: 'diaria',
        valorMinimo: 0,
        garantia: 'fgc',
        descricao: 'Poupança digital gratuita',
        ultimoAtualizado: '2024-10-01'
      },
      {
        id: 'c6_cdb',
        nome: 'CDB C6',
        taxaAnual: 17.90,
        tipo: 'cdb',
        liquidez: 'vencimento',
        valorMinimo: 500,
        garantia: 'fgc',
        descricao: 'CDB com vencimento em 1 ano a 130% do CDI',
        prazo: 365,
        ultimoAtualizado: '2024-10-01'
      },
      {
        id: 'c6_lca',
        nome: 'LCA C6',
        taxaAnual: 15.40,
        tipo: 'lci_lca',
        liquidez: 'vencimento',
        valorMinimo: 1000,
        garantia: 'fgc',
        descricao: 'LCA isenta de IR com vencimento em 2 anos',
        prazo: 730,
        ultimoAtualizado: '2024-10-01'
      },
      {
        id: 'c6_fundos',
        nome: 'C6 Invest',
        taxaAnual: 14.60,
        tipo: 'fundo_di',
        liquidez: 'diaria',
        valorMinimo: 100,
        garantia: 'sem_garantia',
        descricao: 'Plataforma de investimentos completa',
        ultimoAtualizado: '2024-10-01'
      },
      {
        id: 'c6_fiis',
        nome: 'FIIs C6',
        taxaAnual: 12.50,
        tipo: 'fundos_imobiliarios',
        liquidez: 'diaria',
        valorMinimo: 1,
        garantia: 'sem_garantia',
        descricao: 'Fundos imobiliários com dividendos mensais',
        ultimoAtualizado: '2024-10-01'
      }
    ]
  },
  {
    id: 'pagbank',
    nome: 'PagBank',
    cor: '#133A5E',
    modalidades: [
      {
        id: 'pagbank_poupanca',
        nome: 'Poupança PagBank',
        taxaAnual: 6.17,
        tipo: 'poupanca',
        liquidez: 'diaria',
        valorMinimo: 0,
        garantia: 'fgc',
        descricao: 'Poupança integrada ao PagSeguro',
        ultimoAtualizado: '2024-10-01'
      },
      {
        id: 'pagbank_cdb',
        nome: 'CDB PagBank',
        taxaAnual: 15.70,
        tipo: 'cdb',
        liquidez: 'diaria',
        valorMinimo: 100,
        garantia: 'fgc',
        descricao: 'CDB com liquidez diária a 114% do CDI',
        ultimoAtualizado: '2024-10-01'
      },
      {
        id: 'pagbank_lci',
        nome: 'LCI PagBank',
        taxaAnual: 14.20,
        tipo: 'lci_lca',
        liquidez: 'carencia',
        valorMinimo: 3000,
        garantia: 'fgc',
        descricao: 'LCI isenta de IR com carência de 90 dias',
        prazo: 90,
        ultimoAtualizado: '2024-10-01'
      },
      {
        id: 'pagbank_tesouro',
        nome: 'Tesouro PagBank',
        taxaAnual: 13.10,
        tipo: 'tesouro',
        liquidez: 'diaria',
        valorMinimo: 30,
        garantia: 'tesouro',
        descricao: 'Tesouro IPCA+ com proteção contra inflação',
        ultimoAtualizado: '2024-10-01'
      }
    ]
  },
  {
    id: 'magalu',
    nome: 'Banco Magalu',
    cor: '#F8471E',
    modalidades: [
      {
        id: 'magalu_poupanca',
        nome: 'Poupança Magalu',
        taxaAnual: 6.17,
        tipo: 'poupanca',
        liquidez: 'diaria',
        valorMinimo: 0,
        garantia: 'fgc',
        descricao: 'Poupança digital do Magazine Luiza',
        ultimoAtualizado: '2024-10-01'
      },
      {
        id: 'magalu_cdb',
        nome: 'CDB Magalu',
        taxaAnual: 16.40,
        tipo: 'cdb',
        liquidez: 'vencimento',
        valorMinimo: 100,
        garantia: 'fgc',
        descricao: 'CDB com vencimento em 1 ano a 119% do CDI',
        prazo: 365,
        ultimoAtualizado: '2024-10-01'
      },
      {
        id: 'magalu_lci',
        nome: 'LCI Magalu',
        taxaAnual: 14.80,
        tipo: 'lci_lca',
        liquidez: 'vencimento',
        valorMinimo: 5000,
        garantia: 'fgc',
        descricao: 'LCI isenta de IR com vencimento em 18 meses',
        prazo: 547,
        ultimoAtualizado: '2024-10-01'
      }
    ]
  },
  {
    id: 'bs2',
    nome: 'BS2',
    cor: '#1F77B4',
    modalidades: [
      {
        id: 'bs2_poupanca',
        nome: 'Poupança BS2',
        taxaAnual: 6.17,
        tipo: 'poupanca',
        liquidez: 'diaria',
        valorMinimo: 0,
        garantia: 'fgc',
        descricao: 'Poupança digital para empresas e pessoas físicas',
        ultimoAtualizado: '2024-10-01'
      },
      {
        id: 'bs2_cdb',
        nome: 'CDB BS2',
        taxaAnual: 15.90,
        tipo: 'cdb',
        liquidez: 'diaria',
        valorMinimo: 500,
        garantia: 'fgc',
        descricao: 'CDB com liquidez diária a 115% do CDI',
        ultimoAtualizado: '2024-10-01'
      },
      {
        id: 'bs2_lci',
        nome: 'LCI BS2',
        taxaAnual: 13.60,
        tipo: 'lci_lca',
        liquidez: 'carencia',
        valorMinimo: 10000,
        garantia: 'fgc',
        descricao: 'LCI isenta de IR para pessoa jurídica',
        prazo: 180,
        ultimoAtualizado: '2024-10-01'
      }
    ]
  },
  {
    id: 'picpay',
    nome: 'PicPay',
    cor: '#21C25E',
    modalidades: [
      {
        id: 'picpay_poupanca',
        nome: 'Poupança PicPay',
        taxaAnual: 6.17,
        tipo: 'poupanca',
        liquidez: 'diaria',
        valorMinimo: 0,
        garantia: 'fgc',
        descricao: 'Poupança digital integrada ao app',
        ultimoAtualizado: '2024-10-01'
      },
      {
        id: 'picpay_cdb',
        nome: 'CDB PicPay',
        taxaAnual: 15.10,
        tipo: 'cdb',
        liquidez: 'diaria',
        valorMinimo: 1,
        garantia: 'fgc',
        descricao: 'CDB com liquidez diária a 109% do CDI',
        ultimoAtualizado: '2024-10-01'
      },
      {
        id: 'picpay_fundos',
        nome: 'PicPay Invest',
        taxaAnual: 13.90,
        tipo: 'fundo_di',
        liquidez: 'diaria',
        valorMinimo: 50,
        garantia: 'sem_garantia',
        descricao: 'Fundos de investimento direto no app',
        ultimoAtualizado: '2024-10-01'
      }
    ]
  },
  {
    id: 'original',
    nome: 'Banco Original',
    cor: '#00D4AA',
    modalidades: [
      {
        id: 'original_poupanca',
        nome: 'Poupança Original',
        taxaAnual: 6.17,
        tipo: 'poupanca',
        liquidez: 'diaria',
        valorMinimo: 0,
        garantia: 'fgc',
        descricao: 'Poupança digital sem tarifas',
        ultimoAtualizado: '2024-10-01'
      },
      {
        id: 'original_cdb',
        nome: 'CDB Original',
        taxaAnual: 18.40,
        tipo: 'cdb',
        liquidez: 'vencimento',
        valorMinimo: 1000,
        garantia: 'fgc',
        descricao: 'CDB com vencimento em 3 anos a 134% do CDI',
        prazo: 1095,
        ultimoAtualizado: '2024-10-01'
      },
      {
        id: 'original_lci',
        nome: 'LCI Original',
        taxaAnual: 16.20,
        tipo: 'lci_lca',
        liquidez: 'vencimento',
        valorMinimo: 5000,
        garantia: 'fgc',
        descricao: 'LCI isenta de IR com vencimento em 2 anos',
        prazo: 730,
        ultimoAtualizado: '2024-10-01'
      }
    ]
  },
  {
    id: 'next',
    nome: 'Next (Bradesco)',
    cor: '#E60012',
    modalidades: [
      {
        id: 'next_poupanca',
        nome: 'Poupança Next',
        taxaAnual: 6.17,
        tipo: 'poupanca',
        liquidez: 'diaria',
        valorMinimo: 0,
        garantia: 'fgc',
        descricao: 'Poupança digital do Bradesco',
        ultimoAtualizado: '2024-10-01'
      },
      {
        id: 'next_cdb',
        nome: 'CDB Next',
        taxaAnual: 16.60,
        tipo: 'cdb',
        liquidez: 'vencimento',
        valorMinimo: 500,
        garantia: 'fgc',
        descricao: 'CDB com vencimento em 2 anos a 121% do CDI',
        prazo: 730,
        ultimoAtualizado: '2024-10-01'
      },
      {
        id: 'next_tesouro',
        nome: 'Tesouro Direto Next',
        taxaAnual: 13.20,
        tipo: 'tesouro',
        liquidez: 'diaria',
        valorMinimo: 30,
        garantia: 'tesouro',
        descricao: 'Tesouro Selic com liquidez diária',
        ultimoAtualizado: '2024-10-01'
      }
    ]
  },
  {
    id: 'neon',
    nome: 'Neon',
    cor: '#00E88F',
    modalidades: [
      {
        id: 'neon_poupanca',
        nome: 'Poupança Neon',
        taxaAnual: 6.17,
        tipo: 'poupanca',
        liquidez: 'diaria',
        valorMinimo: 0,
        garantia: 'fgc',
        descricao: 'Poupança digital sem tarifas',
        ultimoAtualizado: '2024-10-01'
      },
      {
        id: 'neon_cdb',
        nome: 'CDB Neon',
        taxaAnual: 14.50,
        tipo: 'cdb',
        liquidez: 'diaria',
        valorMinimo: 1,
        garantia: 'fgc',
        descricao: 'CDB com liquidez diária a 105% do CDI',
        ultimoAtualizado: '2024-10-01'
      }
    ]
  },
  {
    id: 'itau',
    nome: 'Itaú (iti)',
    cor: '#EC7000',
    modalidades: [
      {
        id: 'iti_poupanca',
        nome: 'Poupança iti',
        taxaAnual: 6.17,
        tipo: 'poupanca',
        liquidez: 'diaria',
        valorMinimo: 0,
        garantia: 'fgc',
        descricao: 'Poupança digital do Itaú',
        ultimoAtualizado: '2024-10-01'
      },
      {
        id: 'iti_cdb',
        nome: 'CDB iti',
        taxaAnual: 15.80,
        tipo: 'cdb',
        liquidez: 'diaria',
        valorMinimo: 100,
        garantia: 'fgc',
        descricao: 'CDB com liquidez diária a 115% do CDI',
        ultimoAtualizado: '2024-10-01'
      }
    ]
  },
  {
    id: 'will',
    nome: 'Will Bank',
    cor: '#6B46C1',
    modalidades: [
      {
        id: 'will_poupanca',
        nome: 'Poupança Will',
        taxaAnual: 6.17,
        tipo: 'poupanca',
        liquidez: 'diaria',
        valorMinimo: 0,
        garantia: 'fgc',
        descricao: 'Poupança digital com foco em investimentos',
        ultimoAtualizado: '2024-10-01'
      },
      {
        id: 'will_cdb',
        nome: 'CDB Will',
        taxaAnual: 17.20,
        tipo: 'cdb',
        liquidez: 'vencimento',
        valorMinimo: 1000,
        garantia: 'fgc',
        descricao: 'CDB com vencimento em 1 ano a 125% do CDI',
        prazo: 365,
        ultimoAtualizado: '2024-10-01'
      },
      {
        id: 'will_lci',
        nome: 'LCI Will',
        taxaAnual: 15.60,
        tipo: 'lci_lca',
        liquidez: 'vencimento',
        valorMinimo: 3000,
        garantia: 'fgc',
        descricao: 'LCI isenta de IR com vencimento em 18 meses',
        prazo: 547,
        ultimoAtualizado: '2024-10-01'
      }
    ]
  },
  {
    id: 'btg',
    nome: 'BTG Pactual digital',
    cor: '#1E3A8A',
    modalidades: [
      {
        id: 'btg_poupanca',
        nome: 'Poupança BTG',
        taxaAnual: 6.17,
        tipo: 'poupanca',
        liquidez: 'diaria',
        valorMinimo: 0,
        garantia: 'fgc',
        descricao: 'Poupança digital do BTG',
        ultimoAtualizado: '2024-10-01'
      },
      {
        id: 'btg_cdb',
        nome: 'CDB BTG',
        taxaAnual: 18.70,
        tipo: 'cdb',
        liquidez: 'vencimento',
        valorMinimo: 5000,
        garantia: 'fgc',
        descricao: 'CDB com vencimento em 2 anos a 136% do CDI',
        prazo: 730,
        ultimoAtualizado: '2024-10-01'
      },
      {
        id: 'btg_lci',
        nome: 'LCI BTG',
        taxaAnual: 16.90,
        tipo: 'lci_lca',
        liquidez: 'vencimento',
        valorMinimo: 10000,
        garantia: 'fgc',
        descricao: 'LCI isenta de IR com vencimento em 3 anos',
        prazo: 1095,
        ultimoAtualizado: '2024-10-01'
      },
      {
        id: 'btg_fundo_di',
        nome: 'Fundo DI BTG',
        taxaAnual: 16.40,
        tipo: 'fundo_di',
        liquidez: 'diaria',
        valorMinimo: 1000,
        garantia: 'sem_garantia',
        descricao: 'Fundo DI com gestão ativa',
        ultimoAtualizado: '2024-10-01'
      }
    ]
  },
  {
    id: 'mercadopago',
    nome: 'Mercado Pago',
    cor: '#009EE3',
    modalidades: [
      {
        id: 'mercadopago_cofrinho',
        nome: 'Cofrinho Mercado Pago',
        taxaAnual: 6.17,
        tipo: 'poupanca',
        liquidez: 'diaria',
        valorMinimo: 0,
        garantia: 'fgc',
        descricao: 'Cofrinho digital com rendimento da poupança',
        ultimoAtualizado: '2024-10-01'
      },
      {
        id: 'mercadopago_poupanca',
        nome: 'Poupança Mercado Pago',
        taxaAnual: 6.17,
        tipo: 'poupanca',
        liquidez: 'diaria',
        valorMinimo: 0,
        garantia: 'fgc',
        descricao: 'Poupança digital integrada ao Mercado Pago',
        ultimoAtualizado: '2024-10-01'
      },
      {
        id: 'mercadopago_fundo',
        nome: 'Mercado Fundo',
        taxaAnual: 14.80,
        tipo: 'fundo_di',
        liquidez: 'diaria',
        valorMinimo: 1,
        garantia: 'sem_garantia',
        descricao: 'Fundo DI com liquidez diária e baixo valor mínimo',
        ultimoAtualizado: '2024-10-01'
      },
      {
        id: 'mercadopago_cdb',
        nome: 'CDB Mercado Pago',
        taxaAnual: 15.50,
        tipo: 'cdb',
        liquidez: 'diaria',
        valorMinimo: 100,
        garantia: 'fgc',
        descricao: 'CDB com liquidez diária e boa rentabilidade',
        ultimoAtualizado: '2024-10-01'
      },
      {
        id: 'mercadopago_tesouro',
        nome: 'Tesouro Direto MP',
        taxaAnual: 13.60,
        tipo: 'tesouro',
        liquidez: 'diaria',
        valorMinimo: 30,
        garantia: 'tesouro',
        descricao: 'Tesouro Selic com acesso facilitado pelo app',
        ultimoAtualizado: '2024-10-01'
      },
      {
        id: 'mercadopago_lci',
        nome: 'LCI Mercado Pago',
        taxaAnual: 14.90,
        tipo: 'lci_lca',
        liquidez: 'carencia',
        valorMinimo: 5000,
        garantia: 'fgc',
        descricao: 'LCI isenta de IR com carência de 90 dias',
        prazo: 90,
        ultimoAtualizado: '2024-10-01'
      }
    ]
  },
  {
    id: 'sofisa',
    nome: 'Sofisa Direto',
    cor: '#FF6B35',
    modalidades: [
      {
        id: 'sofisa_cdb',
        nome: 'CDB Sofisa',
        taxaAnual: 19.20,
        tipo: 'cdb',
        liquidez: 'vencimento',
        valorMinimo: 1000,
        garantia: 'fgc',
        descricao: 'CDB com vencimento em 3 anos a 140% do CDI',
        prazo: 1095,
        ultimoAtualizado: '2024-10-01'
      },
      {
        id: 'sofisa_debentures',
        nome: 'Debêntures Sofisa',
        taxaAnual: 17.80,
        tipo: 'debentures',
        liquidez: 'vencimento',
        valorMinimo: 1000,
        garantia: 'sem_garantia',
        descricao: 'Debêntures de crédito privado com alto rendimento',
        prazo: 1825,
        ultimoAtualizado: '2024-10-01'
      }
    ]
  },
  {
    id: 'modalmais',
    nome: 'Modalmais',
    cor: '#6366F1',
    modalidades: [
      {
        id: 'modalmais_cdb',
        nome: 'CDB Modalmais',
        taxaAnual: 16.90,
        tipo: 'cdb',
        liquidez: 'diaria',
        valorMinimo: 100,
        garantia: 'fgc',
        descricao: 'CDB com liquidez diária a 123% do CDI',
        ultimoAtualizado: '2024-10-01'
      },
      {
        id: 'modalmais_lci',
        nome: 'LCI Modalmais',
        taxaAnual: 14.70,
        tipo: 'lci_lca',
        liquidez: 'carencia',
        valorMinimo: 5000,
        garantia: 'fgc',
        descricao: 'LCI isenta de IR com carência de 90 dias',
        prazo: 90,
        ultimoAtualizado: '2024-10-01'
      }
    ]
  }
];

// Função para buscar banco por ID
export const buscarBancoPorId = (id: string): BancoDigital | undefined => {
  return bancosDigitaisBrasil.find(banco => banco.id === id);
};

// Função para buscar modalidade por ID
export const buscarModalidadePorId = (bancoId: string, modalidadeId: string): ModalidadeBanco | undefined => {
  const banco = buscarBancoPorId(bancoId);
  return banco?.modalidades.find(modalidade => modalidade.id === modalidadeId);
};

// Função para obter todas as modalidades de um tipo específico
export const obterModalidadesPorTipo = (tipo: ModalidadeBanco['tipo']): ModalidadeBanco[] => {
  const modalidades: ModalidadeBanco[] = [];
  bancosDigitaisBrasil.forEach(banco => {
    banco.modalidades.forEach(modalidade => {
      if (modalidade.tipo === tipo) {
        modalidades.push(modalidade);
      }
    });
  });
  return modalidades;
};

// Função para comparar modalidades por rentabilidade
export const compararModalidadesPorRentabilidade = (modalidades: ModalidadeBanco[]): ModalidadeBanco[] => {
  return [...modalidades].sort((a, b) => b.taxaAnual - a.taxaAnual);
};