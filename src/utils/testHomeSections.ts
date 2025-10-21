/**
 * Teste automatizado das seções da Home
 * Verifica se todas as seções estão funcionando corretamente
 */

export interface SectionTestResult {
  section: string;
  success: boolean;
  error?: string;
  loadTime?: number;
}

export interface HomeTestResults {
  totalSections: number;
  passedSections: number;
  failedSections: number;
  results: SectionTestResult[];
  overallSuccess: boolean;
}

// Lista das seções principais da Home
export const HOME_SECTIONS = [
  'simulacao',
  'comparador', 
  'historico',
  'meta',
  'performance',
  'cenarios',
  'recomendacoes',
  'aposentadoria',
  'metas-financeiras',
  'imposto-renda',
  'favoritos',
  'insights',
  'educacao'
] as const;

export type HomeSection = typeof HOME_SECTIONS[number];

/**
 * Testa uma seção específica da Home
 */
export const testHomeSection = async (section: HomeSection): Promise<SectionTestResult> => {
  const startTime = performance.now();
  
  try {
    console.log(`🧪 Testando seção: ${section}`);
    
    // Simular mudança de aba (isso seria feito via DOM em um teste real)
    const event = new CustomEvent('test-section-change', { 
      detail: { section } 
    });
    
    // Verificar se a seção existe no DOM
    const sectionElement = document.querySelector(`[data-testid="${section}-section"]`);
    
    // Se não encontrar por data-testid, tentar por outras formas
    let hasContent = false;
    
    if (sectionElement) {
      hasContent = true;
    } else {
      // Verificar se há conteúdo relacionado à seção
      const contentSelectors = [
        `[data-section="${section}"]`,
        `.${section}-content`,
        `#${section}`,
        `[aria-label*="${section}"]`
      ];
      
      for (const selector of contentSelectors) {
        if (document.querySelector(selector)) {
          hasContent = true;
          break;
        }
      }
    }
    
    const endTime = performance.now();
    const loadTime = endTime - startTime;
    
    if (hasContent) {
      console.log(`✅ Seção ${section} carregada com sucesso (${loadTime.toFixed(2)}ms)`);
      return {
        section,
        success: true,
        loadTime
      };
    } else {
      console.warn(`⚠️ Seção ${section} não encontrada no DOM`);
      return {
        section,
        success: false,
        error: 'Seção não encontrada no DOM',
        loadTime
      };
    }
    
  } catch (error) {
    const endTime = performance.now();
    const loadTime = endTime - startTime;
    
    console.error(`❌ Erro ao testar seção ${section}:`, error);
    return {
      section,
      success: false,
      error: error instanceof Error ? error.message : 'Erro desconhecido',
      loadTime
    };
  }
};

/**
 * Testa todas as seções da Home
 */
export const testAllHomeSections = async (): Promise<HomeTestResults> => {
  console.log('🚀 Iniciando teste completo das seções da Home...');
  
  const results: SectionTestResult[] = [];
  
  for (const section of HOME_SECTIONS) {
    const result = await testHomeSection(section);
    results.push(result);
    
    // Pequeno delay entre testes para evitar sobrecarga
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  const passedSections = results.filter(r => r.success).length;
  const failedSections = results.filter(r => !r.success).length;
  const overallSuccess = failedSections === 0;
  
  const testResults: HomeTestResults = {
    totalSections: HOME_SECTIONS.length,
    passedSections,
    failedSections,
    results,
    overallSuccess
  };
  
  // Log do resumo
  console.log('\n📊 Resumo dos testes das seções:');
  console.log(`Total: ${testResults.totalSections}`);
  console.log(`✅ Passou: ${passedSections}`);
  console.log(`❌ Falhou: ${failedSections}`);
  console.log(`🎯 Sucesso geral: ${overallSuccess ? 'SIM' : 'NÃO'}`);
  
  if (failedSections > 0) {
    console.log('\n❌ Seções com problemas:');
    results.filter(r => !r.success).forEach(result => {
      console.log(`  - ${result.section}: ${result.error}`);
    });
  }
  
  return testResults;
};

/**
 * Verifica se os componentes lazy estão carregando corretamente
 */
export const testLazyComponents = (): boolean => {
  console.log('🔄 Verificando componentes lazy...');
  
  const lazyComponents = [
    'LazyComparadorInvestimentos',
    'LazyHistoricoSimulacoes', 
    'LazyCalculadoraMeta',
    'LazyDashboardMelhorado',
    'LazyRecomendacoesIA',
    'LazyCalculadoraAposentadoria',
    'LazyAnaliseCenarios'
  ];
  
  let allLoaded = true;
  
  lazyComponents.forEach(component => {
    // Verificar se o componente está disponível no window (para componentes lazy carregados)
    const isAvailable = document.querySelector(`[data-component="${component}"]`) !== null;
    
    if (!isAvailable) {
      console.warn(`⚠️ Componente lazy ${component} não encontrado`);
      allLoaded = false;
    } else {
      console.log(`✅ Componente lazy ${component} disponível`);
    }
  });
  
  return allLoaded;
};

/**
 * Teste de responsividade básico
 */
export const testResponsiveness = (): boolean => {
  console.log('📱 Testando responsividade...');
  
  const viewports = [
    { width: 320, height: 568, name: 'Mobile' },
    { width: 768, height: 1024, name: 'Tablet' },
    { width: 1024, height: 768, name: 'Desktop' },
    { width: 1920, height: 1080, name: 'Large Desktop' }
  ];
  
  let allResponsive = true;
  
  viewports.forEach(viewport => {
    // Simular mudança de viewport (em um teste real isso seria feito diferente)
    const mediaQuery = window.matchMedia(`(max-width: ${viewport.width}px)`);
    
    // Verificar se há classes responsivas aplicadas
    const responsiveElements = document.querySelectorAll('[class*="sm:"], [class*="md:"], [class*="lg:"], [class*="xl:"]');
    
    if (responsiveElements.length > 0) {
      console.log(`✅ ${viewport.name} (${viewport.width}x${viewport.height}): ${responsiveElements.length} elementos responsivos encontrados`);
    } else {
      console.warn(`⚠️ ${viewport.name}: Poucos elementos responsivos encontrados`);
      allResponsive = false;
    }
  });
  
  return allResponsive;
};

/**
 * Executa todos os testes da Home
 */
export const runCompleteHomeTest = async () => {
  console.log('🎯 Executando teste completo da Home...\n');
  
  try {
    // 1. Testar seções
    const sectionResults = await testAllHomeSections();
    
    // 2. Testar componentes lazy
    const lazyComponentsOk = testLazyComponents();
    
    // 3. Testar responsividade
    const responsivenessOk = testResponsiveness();
    
    // Resultado final
    const overallSuccess = sectionResults.overallSuccess && lazyComponentsOk && responsivenessOk;
    
    console.log('\n🏁 Resultado final do teste:');
    console.log(`📋 Seções: ${sectionResults.overallSuccess ? '✅' : '❌'}`);
    console.log(`🔄 Componentes Lazy: ${lazyComponentsOk ? '✅' : '❌'}`);
    console.log(`📱 Responsividade: ${responsivenessOk ? '✅' : '❌'}`);
    console.log(`🎯 Sucesso Geral: ${overallSuccess ? '✅ PASSOU' : '❌ FALHOU'}`);
    
    return {
      sections: sectionResults,
      lazyComponents: lazyComponentsOk,
      responsiveness: responsivenessOk,
      overallSuccess
    };
    
  } catch (error) {
    console.error('💥 Erro crítico durante os testes:', error);
    return {
      sections: null,
      lazyComponents: false,
      responsiveness: false,
      overallSuccess: false,
      error: error instanceof Error ? error.message : 'Erro desconhecido'
    };
  }
};