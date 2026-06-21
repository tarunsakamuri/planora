import React from 'react';
import { cn } from '../../utils/cn';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  message?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md', className, message
}) => {
  const sizes = {
    sm: 'h-5 w-5 border-2',
    md: 'h-8 w-8 border-2',
    lg: 'h-12 w-12 border-3',
    xl: 'h-16 w-16 border-4',
  };

  return (
    <div className={cn('flex flex-col items-center justify-center gap-3', className)}>
      <div
        className={cn(
          'animate-spin rounded-full border-indigo-600/20 border-t-indigo-600',
          sizes[size]
        )}
      />
      {message && (
        <p className="text-sm text-slate-500 dark:text-slate-400 animate-pulse">{message}</p>
      )}
    </div>
  );
};

export const PageLoader: React.FC<{ message?: string }> = ({ message = 'Loading...' }) => {
  return (
    <div className="fixed inset-0 bg-white dark:bg-slate-900 flex items-center justify-center z-50">
      <div className="text-center space-y-4">
        <div className="relative">
          <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mx-auto shadow-lg shadow-indigo-200 dark:shadow-indigo-900/40">
            <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <div className="absolute -inset-2 rounded-3xl border-4 border-indigo-500/20 animate-ping" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Todo-Calender</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 animate-pulse">{message}</p>
        </div>
      </div>
    </div>
  );
};

export const SkeletonCard: React.FC = () => (
  <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 p-6 animate-pulse">
    <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4 mb-4" />
    <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-1/2 mb-2" />
    <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-2/3" />
  </div>
);
