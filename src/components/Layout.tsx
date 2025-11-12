import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import { Sidebar } from './Sidebar';
import { BottomNav } from './BottomNav';

export function Layout() {
  const { theme } = useAppStore();

  // Aplicar tema ao documento
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
  }, [theme]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <Sidebar />
      
      <main className="lg:ml-64 pb-16 lg:pb-0">
        <div className="container mx-auto px-4 py-6">
          <Outlet />
        </div>
      </main>
      
      <BottomNav />
    </div>
  );
}