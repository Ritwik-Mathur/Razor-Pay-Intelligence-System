import React from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from '../components/common/Header';
import { Sidebar } from '../components/common/Sidebar';
import { Footer } from '../components/common/Footer';
import { useSidebar } from '../contexts/SidebarContext';
import { cn } from '../utils/cn';

export const MainLayout: React.FC = () => {
  const { isCollapsed } = useSidebar();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      <Header />
      <div className="flex-1 flex w-full max-w-[1920px] mx-auto relative">
        <Sidebar />
        <main
          className={cn(
            'flex-1 flex flex-col min-w-0 p-4 md:p-6 lg:p-8 bg-slate-50/50 transition-all duration-300 ease-in-out',
            isCollapsed ? 'md:ml-16' : 'md:ml-64'
          )}
        >
          <div className="flex-1 max-w-7xl w-full mx-auto space-y-6">
            <Outlet />
          </div>
          <Footer />
        </main>
      </div>
    </div>
  );
};
