import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { cn } from '../../utils/cn';

const PAGE_TITLES: Record<string, string> = {
  '/dashboard':  'Dashboard',
  '/tasks':      'Tasks',
  '/calendar':   'Calendar',
  '/categories': 'Categories',
  '/analytics':  'Analytics',
  '/activity':   'Activity Log',
  '/profile':    'Profile',
};

export const AppLayout: React.FC = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const pageTitle = PAGE_TITLES[location.pathname] || 'Todo-Calender';

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-slate-950">
      {/* Sidebar */}
      <Sidebar
        isCollapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(prev => !prev)}
        isMobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />

      {/* Main Content */}
      <div className={cn('flex-1 flex flex-col min-w-0 overflow-hidden')}>
        <Header
          onMobileMenuOpen={() => setMobileOpen(true)}
          pageTitle={pageTitle}
        />
        <main className="flex-1 overflow-y-auto">
          <div className="p-4 sm:p-6 max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};
