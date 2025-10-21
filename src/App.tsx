import React, { useEffect } from 'react';
import './styles/animations.css';
import './styles/accessibility.css';
import './styles/responsive.css';
import { AppRouter } from './router/AppRouter';
import { CriticalErrorBoundary } from './components/ErrorBoundary';
import { initializePerformanceOptimizations } from './utils/performance';
import { initializeAccessibility } from './utils/accessibility';
import { initializeResponsiveUtils } from './utils/responsive';

function App() {
  useEffect(() => {
    // Initialize all optimization systems
    const initializeApp = async () => {
      try {
        // Initialize performance optimizations
        initializePerformanceOptimizations();
        
        // Initialize accessibility features
        initializeAccessibility();
        
        // Initialize responsive utilities
        initializeResponsiveUtils();
        
        // Add app-level meta tags for better SEO and performance
        const metaTags = [
          { name: 'viewport', content: 'width=device-width, initial-scale=1.0, viewport-fit=cover' },
          { name: 'theme-color', content: '#3B82F6' },
          { name: 'apple-mobile-web-app-capable', content: 'yes' },
          { name: 'apple-mobile-web-app-status-bar-style', content: 'default' },
          { name: 'apple-mobile-web-app-title', content: 'Jurus' },
          { name: 'application-name', content: 'Jurus' },
          { name: 'msapplication-TileColor', content: '#3B82F6' },
          { name: 'msapplication-config', content: '/browserconfig.xml' }
        ];

        metaTags.forEach(({ name, content }) => {
          let meta = document.querySelector(`meta[name="${name}"]`);
          if (!meta) {
            meta = document.createElement('meta');
            meta.setAttribute('name', name);
            document.head.appendChild(meta);
          }
          meta.setAttribute('content', content);
        });

        // Add preconnect hints for external resources
        const preconnectUrls = [
          'https://fonts.googleapis.com',
          'https://fonts.gstatic.com'
        ];

        preconnectUrls.forEach(url => {
          const link = document.createElement('link');
          link.rel = 'preconnect';
          link.href = url;
          link.crossOrigin = 'anonymous';
          document.head.appendChild(link);
        });

        // Set up global error handling
        window.addEventListener('unhandledrejection', (event) => {
          console.error('Unhandled promise rejection:', event.reason);
          // Prevent the default browser behavior
          event.preventDefault();
        });

        // Set up performance monitoring
        if ('performance' in window && 'PerformanceObserver' in window) {
          // Monitor Core Web Vitals
          const observer = new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
              if (entry.entryType === 'navigation') {
                console.log('Navigation timing:', entry);
              } else if (entry.entryType === 'paint') {
                console.log(`${entry.name}:`, entry.startTime);
              }
            }
          });

          observer.observe({ entryTypes: ['navigation', 'paint'] });
        }

        // Set up service worker registration (if available)
        if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
          try {
            await navigator.serviceWorker.register('/sw.js');
            console.log('Service Worker registered successfully');
          } catch (error) {
            console.log('Service Worker registration failed:', error);
          }
        }

        console.log('🚀 Jurus app initialized successfully');
      } catch (error) {
        console.error('Failed to initialize app:', error);
      }
    };

    initializeApp();
  }, []);

  return (
    <CriticalErrorBoundary>
      <div 
        className="App min-h-screen bg-gray-50"
        role="application"
        aria-label="Jurus - Sistema de Gestão Financeira"
      >
        <AppRouter />
      </div>
    </CriticalErrorBoundary>
  );
}

export default App;
