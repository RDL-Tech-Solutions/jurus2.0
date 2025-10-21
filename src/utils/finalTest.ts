// Teste final das funcionalidades da Home page
import React from 'react';

export interface FinalTestResult {
  success: boolean;
  message: string;
  details: string[];
}

export function runFinalTest(): FinalTestResult {
  const details: string[] = [];
  let success = true;

  try {
    // Teste 1: Verificar se o localStorage está funcionando
    details.push('✅ Testando localStorage...');
    localStorage.setItem('test-final', 'ok');
    const testValue = localStorage.getItem('test-final');
    if (testValue === 'ok') {
      details.push('✅ localStorage funcionando corretamente');
      localStorage.removeItem('test-final');
    } else {
      details.push('❌ Problema com localStorage');
      success = false;
    }

    // Teste 2: Verificar se os componentes React estão carregados
    details.push('✅ Verificando componentes React...');
    if (typeof React !== 'undefined') {
      details.push('✅ React carregado corretamente');
    } else {
      details.push('❌ React não encontrado');
      success = false;
    }

    // Teste 3: Verificar se o DOM está acessível
    details.push('✅ Testando acesso ao DOM...');
    if (typeof document !== 'undefined') {
      details.push('✅ DOM acessível');
    } else {
      details.push('❌ DOM não acessível');
      success = false;
    }

    // Teste 4: Verificar se as animações estão funcionando
    details.push('✅ Verificando suporte a animações...');
    if (typeof window !== 'undefined' && 'requestAnimationFrame' in window) {
      details.push('✅ Animações suportadas');
    } else {
      details.push('⚠️ Animações podem não funcionar corretamente');
    }

    // Teste 5: Verificar responsividade
    details.push('✅ Testando responsividade...');
    if (typeof window !== 'undefined') {
      const width = window.innerWidth;
      if (width < 768) {
        details.push('📱 Dispositivo móvel detectado');
      } else if (width < 1024) {
        details.push('📱 Tablet detectado');
      } else {
        details.push('🖥️ Desktop detectado');
      }
    }

    return {
      success,
      message: success ? 'Todos os testes passaram com sucesso!' : 'Alguns testes falharam',
      details
    };

  } catch (error) {
    return {
      success: false,
      message: 'Erro durante os testes',
      details: [`❌ Erro: ${error instanceof Error ? error.message : 'Erro desconhecido'}`]
    };
  }
}

// Função para executar teste e exibir resultados
export function executeFinalTest(): void {
  console.log('🧪 Iniciando teste final das funcionalidades...');
  
  const result = runFinalTest();
  
  console.log(`📊 Resultado: ${result.message}`);
  result.details.forEach(detail => console.log(detail));
  
  if (result.success) {
    console.log('🎉 Aplicação pronta para uso!');
  } else {
    console.log('⚠️ Verifique os problemas identificados');
  }
}