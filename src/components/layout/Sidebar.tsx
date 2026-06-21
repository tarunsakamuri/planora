import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, CheckSquare, Calendar, Tag, BarChart2,
  Activity, User, LogOut, ChevronLeft, ChevronRight,
  Zap, Menu, X
} from 'lucide-react';
import { cn } from '../../utils/cn';
import { useAuth } from '../../context/AuthContext';
import { getInitials } from '../../lib/utils';

const NAV_ITEMS = [
  { path: '/dashboard',   label: 'Dashboard',   icon: LayoutDashboard },
  { path: '/tasks',       label: 'Tasks',       icon: CheckSquare },
  { path: '/calendar',    label: 'Calendar',    icon: Calendar },
  { path: '/categories',  label: 'Categories',  icon: Tag },
  { path: '/analytics',   label: 'Analytics',   icon: BarChart2 },
  { path: '/activity',    label: 'Activity',    icon: Activity },
  { path: '/profile',     label: 'Profile',     icon: User },
];

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
  isMobileOpen: boolean;
  onMobileClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isCollapsed, onToggle, isMobileOpen, onMobileClose
}) => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const sidebarContent = (
    <div className="flex flex-col h-full bg-white dark:bg-slate-900 border-r border-slate-100 dark:border-slate-700/50 transition-all duration-300">
      {/* Logo */}
      <div className={cn(
        'flex items-center gap-3 px-4 py-5 border-b border-slate-100 dark:border-slate-700/50',
        isCollapsed ? 'justify-center px-2' : ''
      )}>
        <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-sky-500 via-indigo-500 to-fuchsia-600 flex items-center justify-center flex-shrink-0 shadow-md shadow-sky-200 dark:shadow-sky-900/30">
          <svg viewBox="0 0 24 24" className="h-5 w-5 text-white" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="5.2" />
            <path d="M7.5 14.5c1.5-2 3-2.5 4.5-2.5s3 1 4.5 2.5" />
            <path d="M8.5 10.5c1.5-1.5 3-1.8 4.5-1.8s3 .3 4.5 1.8" />
          </svg>
        </div>
        {!isCollapsed && (
          <div className="min-w-0">
            <span className="font-bold text-slate-900 dark:text-white text-lg">Todo-Calender</span>
          </div>
        )}
        <button
          onClick={onToggle}
          className="ml-auto p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 dark:hover:text-slate-300 transition-colors lg:flex hidden"
        >
          {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
        <button
          onClick={onMobileClose}
          className="ml-auto p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 lg:hidden"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Nav Items */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map(({ path, label, icon: Icon }) => {
          const isActive = location.pathname === path || (path !== '/dashboard' && location.pathname.startsWith(path));
          return (
            <NavLink
              key={path}
              to={path}
              onClick={onMobileClose}
              className={cn(
                'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200',
                isActive
                  ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200',
                isCollapsed ? 'justify-center px-2' : ''
              )}
            >
              <Icon className={cn('h-5 w-5 flex-shrink-0', isActive ? 'text-indigo-600 dark:text-indigo-400' : '')} />
              {!isCollapsed && <span>{label}</span>}
              {!isCollapsed && isActive && (
                <div className="ml-auto h-2 w-2 rounded-full bg-indigo-500" />
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Bottom Section */}
      <div className="p-3 border-t border-slate-100 dark:border-slate-700/50 space-y-1">
        <button
          onClick={logout}
          className={cn(
            'w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium',
            'text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors',
            isCollapsed ? 'justify-center px-2' : ''
          )}
        >
          <LogOut className="h-5 w-5 flex-shrink-0" />
          {!isCollapsed && <span>Logout</span>}
        </button>

        {/* User Info */}
        <div className={cn(
          'flex items-center gap-3 px-3 py-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 mt-2',
          isCollapsed ? 'justify-center px-2' : ''
        )}>
          {user?.avatar ? (
            <img src={user.avatar} alt={user.name} className="h-8 w-8 rounded-lg object-cover flex-shrink-0" />
          ) : (
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center flex-shrink-0">
              <span className="text-xs font-bold text-white">{getInitials(user?.name || 'U')}</span>
            </div>
          )}
          {!isCollapsed && (
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-slate-700 dark:text-slate-200 truncate">{user?.name}</p>
              <p className="text-xs text-slate-400 truncate">{user?.email}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={onMobileClose} />
      )}
      {/* Mobile Sidebar */}
      <aside className={cn(
        'fixed inset-y-0 left-0 z-50 w-64 lg:hidden',
        'transform transition-transform duration-300',
        isMobileOpen ? 'translate-x-0' : '-translate-x-full'
      )}>
        {sidebarContent}
      </aside>
      {/* Desktop Sidebar */}
      <aside className={cn(
        'hidden lg:flex flex-col h-full transition-all duration-300',
        isCollapsed ? 'w-16' : 'w-64'
      )}>
        {sidebarContent}
      </aside>
    </>
  );
};

export const MobileMenuButton: React.FC<{ onClick: () => void }> = ({ onClick }) => (
  <button
    onClick={onClick}
    className="lg:hidden p-2 rounded-xl text-slate-500 hover:text-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 dark:hover:text-slate-300 transition-colors"
  >
    <Menu className="h-5 w-5" />
  </button>
);
