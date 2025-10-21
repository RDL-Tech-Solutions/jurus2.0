// Utilitário para testar a persistência do localStorage
export const testLocalStoragePersistence = () => {
  const testKey = 'jurus_test_persistence';
  const testData = {
    timestamp: new Date().toISOString(),
    testValue: 'Teste de persistência',
    randomNumber: Math.random()
  };

  try {
    // Teste 1: Salvar dados
    localStorage.setItem(testKey, JSON.stringify(testData));
    console.log('✓ Dados salvos no localStorage');

    // Teste 2: Recuperar dados
    const retrieved = localStorage.getItem(testKey);
    if (!retrieved) {
      throw new Error('Dados não encontrados no localStorage');
    }

    const parsedData = JSON.parse(retrieved);
    console.log('✓ Dados recuperados do localStorage:', parsedData);

    // Teste 3: Verificar integridade
    if (parsedData.testValue === testData.testValue && 
        parsedData.randomNumber === testData.randomNumber) {
      console.log('✓ Integridade dos dados verificada');
    } else {
      throw new Error('Dados corrompidos');
    }

    // Teste 4: Limpar dados de teste
    localStorage.removeItem(testKey);
    console.log('✓ Dados de teste removidos');

    return {
      success: true,
      message: 'Todos os testes de persistência passaram'
    };

  } catch (error) {
    console.error('✗ Erro no teste de persistência:', error);
    
    // Limpar dados de teste em caso de erro
    try {
      localStorage.removeItem(testKey);
    } catch (cleanupError) {
      console.error('Erro ao limpar dados de teste:', cleanupError);
    }

    return {
      success: false,
      message: `Teste de persistência falhou: ${error instanceof Error ? error.message : 'Erro desconhecido'}`
    };
  }
};

// Função para verificar o status atual do localStorage
export const checkLocalStorageStatus = () => {
  try {
    // Verificar se localStorage está disponível
    if (typeof Storage === 'undefined') {
      return {
        available: false,
        message: 'localStorage não está disponível neste navegador'
      };
    }

    // Verificar se há dados salvos
    const keys = Object.keys(localStorage).filter(key => key.startsWith('jurus_'));
    
    return {
      available: true,
      keysCount: keys.length,
      keys: keys,
      message: `localStorage disponível com ${keys.length} chaves do Jurus`
    };

  } catch (error) {
    return {
      available: false,
      message: `Erro ao verificar localStorage: ${error instanceof Error ? error.message : 'Erro desconhecido'}`
    };
  }
};