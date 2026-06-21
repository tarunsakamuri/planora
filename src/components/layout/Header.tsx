import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Moon, Sun, Search, X, CheckCheck } from 'lucide-react';
import { cn } from '../../utils/cn';
import { useTheme } from '../../context/ThemeContext';
import { useTasks } from '../../context/TaskContext';
import { useAuth } from '../../context/AuthContext';
import { MobileMenuButton } from './Sidebar';
import { formatRelativeTime } from '../../lib/utils';
import { getInitials } from '../../lib/utils';

interface HeaderProps {
  onMobileMenuOpen: () => void;
  pageTitle?: string;
}

const notifTypeIcon: Record<string, string> = {
  reminder: '⏰',
  overdue:  '🔴',
  upcoming: '📅',
  system:   '💬',
};

export const Header: React.FC<HeaderProps> = ({ onMobileMenuOpen, pageTitle = 'Dashboard' }) => {
  const { toggleTheme, isDark } = useTheme();
  const { notifications, unreadCount, markNotificationRead, markAllNotificationsRead } = useTasks();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [showNotifs, setShowNotifs] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const notifsRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (notifsRef.current && !notifsRef.current.contains(e.target as Node)) {
        setShowNotifs(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => {
    if (searchOpen && searchRef.current) searchRef.current.focus();
  }, [searchOpen]);

  return (
    <header className="sticky top-0 z-30 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-100 dark:border-slate-700/50">
      <div className="flex items-center justify-between px-4 py-3 gap-4">
        {/* Left */}
        <div className="flex items-center gap-3">
          <MobileMenuButton onClick={onMobileMenuOpen} />
          <h1 className="text-lg font-semibold text-slate-900 dark:text-white hidden sm:block">{pageTitle}</h1>
        </div>

        {/* Search Bar - Desktop */}
        <div className="hidden md:flex flex-1 max-w-md">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter' && searchQuery.trim()) {
                  navigate(`/tasks?search=${encodeURIComponent(searchQuery.trim())}`);
                  setSearchQuery('');
                }
              }}
              className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all"
            />
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          {/* Mobile Search */}
          <button
            className="md:hidden p-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 dark:text-slate-400 transition-colors"
            onClick={() => setSearchOpen(!searchOpen)}
          >
            <Search className="h-5 w-5" />
          </button>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
          >
            {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>

          {/* Notifications */}
          <div className="relative" ref={notifsRef}>
            <button
              onClick={() => setShowNotifs(!showNotifs)}
              className="relative p-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
            >
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-white dark:ring-slate-900">
                  <span className="absolute inset-0 rounded-full bg-red-500 animate-ping opacity-75" />
                </span>
              )}
            </button>

            {/* Notifications Dropdown */}
            {showNotifs && (
              <div className="absolute right-0 top-12 w-80 sm:w-96 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 z-50 overflow-hidden">
                <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-slate-700">
                  <h3 className="font-semibold text-slate-900 dark:text-white">
                    Notifications {unreadCount > 0 && <span className="ml-1.5 text-xs bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400 px-1.5 py-0.5 rounded-full">{unreadCount}</span>}
                  </h3>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllNotificationsRead}
                      className="flex items-center gap-1 text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 font-medium"
                    >
                      <CheckCheck className="h-3.5 w-3.5" />
                      Mark all read
                    </button>
                  )}
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="py-8 text-center text-sm text-slate-500">No notifications</div>
                  ) : (
                    notifications.slice(0, 10).map(notif => (
                      <div
                        key={notif.id}
                        onClick={() => markNotificationRead(notif.id)}
                        className={cn(
                          'flex gap-3 px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-700/50 cursor-pointer border-b border-slate-50 dark:border-slate-700/50 last:border-0',
                          !notif.isRead && 'bg-indigo-50/50 dark:bg-indigo-900/10'
                        )}
                      >
                        <span className="text-lg flex-shrink-0">{notifTypeIcon[notif.type] || '🔔'}</span>
                        <div className="flex-1 min-w-0">
                          <p className={cn('text-sm font-medium truncate', !notif.isRead ? 'text-slate-900 dark:text-white' : 'text-slate-600 dark:text-slate-300')}>
                            {notif.title}
                          </p>
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2">{notif.message}</p>
                          <p className="text-xs text-slate-400 mt-1">{formatRelativeTime(notif.createdAt)}</p>
                        </div>
                        {!notif.isRead && <div className="h-2 w-2 rounded-full bg-indigo-500 flex-shrink-0 mt-1.5" />}
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User Avatar */}
          <button
            onClick={() => navigate('/profile')}
            className="h-9 w-9 rounded-xl overflow-hidden flex-shrink-0 ring-2 ring-indigo-100 dark:ring-indigo-900/50 hover:ring-indigo-300 transition-all"
          >
            {user?.avatar ? (
              <img src={user.avatar} alt={user.name} className="h-full w-full object-cover" />
            ) : (
              <div className="h-full w-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                <span className="text-xs font-bold text-white">{getInitials(user?.name || 'U')}</span>
              </div>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Search Bar */}
      {searchOpen && (
        <div className="md:hidden px-4 pb-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              ref={searchRef}
              type="text"
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter' && searchQuery.trim()) {
                  navigate(`/tasks?search=${encodeURIComponent(searchQuery.trim())}`);
                  setSearchQuery('');
                  setSearchOpen(false);
                }
              }}
              className="w-full pl-10 pr-10 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
            />
            <button onClick={() => setSearchOpen(false)} className="absolute right-3 top-1/2 -translate-y-1/2">
              <X className="h-4 w-4 text-slate-400" />
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
