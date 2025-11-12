// Re-exporta tudo de constants/bancosDigitais.ts
export * from '../constants/bancosDigitais';

// Alias para compatibilidade
export { bancosDigitaisBrasil as bancosDigitais } from '../constants/bancosDigitais';

// Funções auxiliares para labels
export const getTipoLabel = (tipo: string): string => {
  const labels: Record<string, string> = {
    'cdb': 'CDB',
    'lci_lca': 'LCI/LCA',
    'poupanca': 'Poupança',
    'rdb': 'RDB',
    'fundo_di': 'Fundo DI',
    'tesouro': 'Tesouro Direto'
  };
  return labels[tipo] || tipo;
};

export const getLiquidezLabel = (liquidez: string): string => {
  const labels: Record<string, string> = {
    'diaria': 'Liquidez Diária',
    'vencimento': 'No Vencimento',
    'carencia': 'Com Carência'
  };
  return labels[liquidez] || liquidez;
};
