import React from 'react';
import { cn } from '../../utils/cn';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hover?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export const Card: React.FC<CardProps> = ({
  children, className, onClick, hover = false, padding = 'md'
}) => {
  const paddings = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  return (
    <div
      onClick={onClick}
      className={cn(
        'bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm',
        paddings[padding],
        hover && 'transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 cursor-pointer',
        onClick && 'cursor-pointer',
        className
      )}
    >
      {children}
    </div>
  );
};

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  trend?: { value: number; isPositive: boolean };
  color?: 'indigo' | 'emerald' | 'amber' | 'red' | 'purple' | 'cyan';
  className?: string;
}

const colorMap = {
  indigo:  { bg: 'bg-indigo-50  dark:bg-indigo-900/20',  text: 'text-indigo-600  dark:text-indigo-400',  icon: 'bg-indigo-100  dark:bg-indigo-900/40' },
  emerald: { bg: 'bg-emerald-50 dark:bg-emerald-900/20', text: 'text-emerald-600 dark:text-emerald-400', icon: 'bg-emerald-100 dark:bg-emerald-900/40' },
  amber:   { bg: 'bg-amber-50   dark:bg-amber-900/20',   text: 'text-amber-600   dark:text-amber-400',   icon: 'bg-amber-100   dark:bg-amber-900/40' },
  red:     { bg: 'bg-red-50     dark:bg-red-900/20',     text: 'text-red-600     dark:text-red-400',     icon: 'bg-red-100     dark:bg-red-900/40' },
  purple:  { bg: 'bg-purple-50  dark:bg-purple-900/20',  text: 'text-purple-600  dark:text-purple-400',  icon: 'bg-purple-100  dark:bg-purple-900/40' },
  cyan:    { bg: 'bg-cyan-50    dark:bg-cyan-900/20',    text: 'text-cyan-600    dark:text-cyan-400',    icon: 'bg-cyan-100    dark:bg-cyan-900/40' },
};

export const StatCard: React.FC<StatCardProps> = ({
  title, value, subtitle, icon, trend, color = 'indigo', className
}) => {
  const colors = colorMap[color];

  return (
    <Card className={cn('overflow-hidden', className)}>
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400 truncate">{title}</p>
          <p className={cn('text-3xl font-bold mt-1 tracking-tight', colors.text)}>{value}</p>
          {subtitle && (
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{subtitle}</p>
          )}
          {trend && (
            <div className={cn('flex items-center gap-1 mt-2 text-xs font-medium', trend.isPositive ? 'text-emerald-600' : 'text-red-500')}>
              <span>{trend.isPositive ? '↑' : '↓'}</span>
              <span>{Math.abs(trend.value)}% from last week</span>
            </div>
          )}
        </div>
        <div className={cn('h-12 w-12 rounded-xl flex items-center justify-center flex-shrink-0', colors.icon, colors.text)}>
          {icon}
        </div>
      </div>
      <div className={cn('mt-4 h-1 rounded-full', colors.bg)}>
        <div className={cn('h-full rounded-full', colors.text.replace('text', 'bg'))} style={{ width: '60%' }} />
      </div>
    </Card>
  );
};
