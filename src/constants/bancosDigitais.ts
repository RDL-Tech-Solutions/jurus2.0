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
  tipo: 'cdb' | 'lci_lca' | 'poupanca' | 'rdb' | 'fundo_di' | 'tesouro';
  liquidez: 'diaria' | 'vencimento' | 'carencia';
  valorMinimo: number;
  garantia: 'fgc' | 'tesouro' | 'sem_garantia';
  descricao: string;
}

// Bancos digitais populares do Brasil
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
        descricao: 'Conta digital com rendimento da poupança'
      },
      {
        id: 'nubank_cdb',
        nome: 'CDB Nubank',
        taxaAnual: 13.75,
        tipo: 'cdb',
        liquidez: 'diaria',
        valorMinimo: 1,
        garantia: 'fgc',
        descricao: 'CDB com liquidez diária a 100% do CDI'
      },
      {
        id: 'nubank_rdb',
        nome: 'RDB Nubank',
        taxaAnual: 14.44,
        tipo: 'rdb',
        liquidez: 'vencimento',
        valorMinimo: 1000,
        garantia: 'fgc',
        descricao: 'RDB com vencimento em 2 anos a 105% do CDI'
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
        descricao: 'Poupança digital com rendimento tradicional'
      },
      {
        id: 'inter_cdb',
        nome: 'CDB Inter',
        taxaAnual: 15.13,
        tipo: 'cdb',
        liquidez: 'diaria',
        valorMinimo: 100,
        garantia: 'fgc',
        descricao: 'CDB com liquidez diária a 110% do CDI'
      },
      {
        id: 'inter_lci',
        nome: 'LCI Inter',
        taxaAnual: 12.38,
        tipo: 'lci_lca',
        liquidez: 'carencia',
        valorMinimo: 5000,
        garantia: 'fgc',
        descricao: 'LCI isenta de IR com carência de 90 dias'
      },
      {
        id: 'inter_fundo_di',
        nome: 'Fundo DI Inter',
        taxaAnual: 13.06,
        tipo: 'fundo_di',
        liquidez: 'diaria',
        valorMinimo: 100,
        garantia: 'sem_garantia',
        descricao: 'Fundo DI com liquidez diária'
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
        descricao: 'Poupança digital gratuita'
      },
      {
        id: 'c6_cdb',
        nome: 'CDB C6',
        taxaAnual: 16.50,
        tipo: 'cdb',
        liquidez: 'vencimento',
        valorMinimo: 500,
        garantia: 'fgc',
        descricao: 'CDB com vencimento em 1 ano a 120% do CDI'
      },
      {
        id: 'c6_lca',
        nome: 'LCA C6',
        taxaAnual: 13.75,
        tipo: 'lci_lca',
        liquidez: 'vencimento',
        valorMinimo: 1000,
        garantia: 'fgc',
        descricao: 'LCA isenta de IR com vencimento em 2 anos'
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
        descricao: 'Poupança digital integrada ao app'
      },
      {
        id: 'picpay_cdb',
        nome: 'CDB PicPay',
        taxaAnual: 14.44,
        tipo: 'cdb',
        liquidez: 'diaria',
        valorMinimo: 1,
        garantia: 'fgc',
        descricao: 'CDB com liquidez diária a 105% do CDI'
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
        descricao: 'Poupança digital sem tarifas'
      },
      {
        id: 'original_cdb',
        nome: 'CDB Original',
        taxaAnual: 17.19,
        tipo: 'cdb',
        liquidez: 'vencimento',
        valorMinimo: 1000,
        garantia: 'fgc',
        descricao: 'CDB com vencimento em 3 anos a 125% do CDI'
      },
      {
        id: 'original_lci',
        nome: 'LCI Original',
        taxaAnual: 15.13,
        tipo: 'lci_lca',
        liquidez: 'vencimento',
        valorMinimo: 5000,
        garantia: 'fgc',
        descricao: 'LCI isenta de IR com vencimento em 2 anos'
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
        descricao: 'Poupança digital do Bradesco'
      },
      {
        id: 'next_cdb',
        nome: 'CDB Next',
        taxaAnual: 15.81,
        tipo: 'cdb',
        liquidez: 'vencimento',
        valorMinimo: 500,
        garantia: 'fgc',
        descricao: 'CDB com vencimento em 2 anos a 115% do CDI'
      },
      {
        id: 'next_tesouro',
        nome: 'Tesouro Direto Next',
        taxaAnual: 12.50,
        tipo: 'tesouro',
        liquidez: 'diaria',
        valorMinimo: 30,
        garantia: 'tesouro',
        descricao: 'Tesouro Selic com liquidez diária'
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
        descricao: 'Poupança digital sem tarifas'
      },
      {
        id: 'neon_cdb',
        nome: 'CDB Neon',
        taxaAnual: 13.06,
        tipo: 'cdb',
        liquidez: 'diaria',
        valorMinimo: 1,
        garantia: 'fgc',
        descricao: 'CDB com liquidez diária a 95% do CDI'
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
        descricao: 'Poupança digital do Itaú'
      },
      {
        id: 'iti_cdb',
        nome: 'CDB iti',
        taxaAnual: 14.44,
        tipo: 'cdb',
        liquidez: 'diaria',
        valorMinimo: 100,
        garantia: 'fgc',
        descricao: 'CDB com liquidez diária a 105% do CDI'
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
        descricao: 'Poupança digital com foco em investimentos'
      },
      {
        id: 'will_cdb',
        nome: 'CDB Will',
        taxaAnual: 16.50,
        tipo: 'cdb',
        liquidez: 'vencimento',
        valorMinimo: 1000,
        garantia: 'fgc',
        descricao: 'CDB com vencimento em 1 ano a 120% do CDI'
      },
      {
        id: 'will_lci',
        nome: 'LCI Will',
        taxaAnual: 14.44,
        tipo: 'lci_lca',
        liquidez: 'vencimento',
        valorMinimo: 3000,
        garantia: 'fgc',
        descricao: 'LCI isenta de IR com vencimento em 18 meses'
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
        descricao: 'Poupança digital do BTG'
      },
      {
        id: 'btg_cdb',
        nome: 'CDB BTG',
        taxaAnual: 17.19,
        tipo: 'cdb',
        liquidez: 'vencimento',
        valorMinimo: 5000,
        garantia: 'fgc',
        descricao: 'CDB com vencimento em 2 anos a 125% do CDI'
      },
      {
        id: 'btg_lci',
        nome: 'LCI BTG',
        taxaAnual: 15.81,
        tipo: 'lci_lca',
        liquidez: 'vencimento',
        valorMinimo: 10000,
        garantia: 'fgc',
        descricao: 'LCI isenta de IR com vencimento em 3 anos'
      },
      {
        id: 'btg_fundo_di',
        nome: 'Fundo DI BTG',
        taxaAnual: 15.13,
        tipo: 'fundo_di',
        liquidez: 'diaria',
        valorMinimo: 1000,
        garantia: 'sem_garantia',
        descricao: 'Fundo DI com gestão ativa'
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
        descricao: 'Cofrinho digital com rendimento da poupança'
      },
      {
        id: 'mercadopago_poupanca',
        nome: 'Poupança Mercado Pago',
        taxaAnual: 6.17,
        tipo: 'poupanca',
        liquidez: 'diaria',
        valorMinimo: 0,
        garantia: 'fgc',
        descricao: 'Poupança digital integrada ao Mercado Pago'
      },
      {
        id: 'mercadopago_fundo',
        nome: 'Mercado Fundo',
        taxaAnual: 13.50,
        tipo: 'fundo_di',
        liquidez: 'diaria',
        valorMinimo: 1,
        garantia: 'sem_garantia',
        descricao: 'Fundo DI com liquidez diária e baixo valor mínimo'
      },
      {
        id: 'mercadopago_cdb',
        nome: 'CDB Mercado Pago',
        taxaAnual: 14.20,
        tipo: 'cdb',
        liquidez: 'diaria',
        valorMinimo: 100,
        garantia: 'fgc',
        descricao: 'CDB com liquidez diária e boa rentabilidade'
      },
      {
        id: 'mercadopago_tesouro',
        nome: 'Tesouro Direto MP',
        taxaAnual: 12.80,
        tipo: 'tesouro',
        liquidez: 'diaria',
        valorMinimo: 30,
        garantia: 'tesouro',
        descricao: 'Tesouro Selic com acesso facilitado pelo app'
      },
      {
        id: 'mercadopago_lci',
        nome: 'LCI Mercado Pago',
        taxaAnual: 13.80,
        tipo: 'lci_lca',
        liquidez: 'carencia',
        valorMinimo: 5000,
        garantia: 'fgc',
        descricao: 'LCI isenta de IR com carência de 90 dias'
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