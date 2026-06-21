import React, { useState } from 'react';
import { Activity, CheckCircle2, Plus, Edit2, Trash2, RotateCcw } from 'lucide-react';
import { useTasks } from '../context/TaskContext';
import { ActivityLog } from '../types';
import { Card } from '../components/ui/Card';
import { EmptyState } from '../components/ui/EmptyState';
import { formatRelativeTime, formatDateTime } from '../lib/utils';
import { cn } from '../utils/cn';

const ACTION_CONFIG: Record<ActivityLog['action'], { icon: React.ReactNode; label: string; color: string; bg: string }> = {
  created:   { icon: <Plus className="h-4 w-4" />,          label: 'Created',   color: 'text-indigo-600',  bg: 'bg-indigo-100 dark:bg-indigo-900/30' },
  updated:   { icon: <Edit2 className="h-4 w-4" />,         label: 'Updated',   color: 'text-amber-600',   bg: 'bg-amber-100 dark:bg-amber-900/30' },
  deleted:   { icon: <Trash2 className="h-4 w-4" />,        label: 'Deleted',   color: 'text-red-600',     bg: 'bg-red-100 dark:bg-red-900/30' },
  completed: { icon: <CheckCircle2 className="h-4 w-4" />,  label: 'Completed', color: 'text-emerald-600', bg: 'bg-emerald-100 dark:bg-emerald-900/30' },
  reopened:  { icon: <RotateCcw className="h-4 w-4" />,     label: 'Reopened',  color: 'text-purple-600',  bg: 'bg-purple-100 dark:bg-purple-900/30' },
};

type FilterType = 'all' | ActivityLog['action'];

export const ActivityPage: React.FC = () => {
  const { activityLogs } = useTasks();
  const [filter, setFilter] = useState<FilterType>('all');

  const filteredLogs = filter === 'all' ? activityLogs : activityLogs.filter(l => l.action === filter);

  const filterButtons: { key: FilterType; label: string }[] = [
    { key: 'all',       label: 'All' },
    { key: 'created',   label: 'Created' },
    { key: 'updated',   label: 'Updated' },
    { key: 'completed', label: 'Completed' },
    { key: 'deleted',   label: 'Deleted' },
  ];

  // Group by date
  const grouped = filteredLogs.reduce<Record<string, ActivityLog[]>>((acc, log) => {
    const date = new Date(log.createdAt).toDateString();
    if (!acc[date]) acc[date] = [];
    acc[date].push(log);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Activity className="h-7 w-7 text-indigo-500" />
          Activity Log
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Track all changes to your tasks</p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {(Object.entries(ACTION_CONFIG) as [ActivityLog['action'], typeof ACTION_CONFIG[ActivityLog['action']]][]).map(([action, cfg]) => {
          const count = activityLogs.filter(l => l.action === action).length;
          return (
            <Card key={action} padding="sm">
              <div className="flex items-center gap-3">
                <div className={cn('h-9 w-9 rounded-xl flex items-center justify-center', cfg.bg, cfg.color)}>
                  {cfg.icon}
                </div>
                <div>
                  <p className="text-xl font-bold text-slate-900 dark:text-white">{count}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{cfg.label}</p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        {filterButtons.map(btn => (
          <button
            key={btn.key}
            onClick={() => setFilter(btn.key)}
            className={cn(
              'px-4 py-2 rounded-xl text-sm font-medium transition-colors',
              filter === btn.key
                ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-200'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:border-indigo-300 hover:text-indigo-600'
            )}
          >
            {btn.label}
            <span className={cn(
              'ml-1.5 text-xs px-1.5 py-0.5 rounded-full',
              filter === btn.key ? 'bg-white/20 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
            )}>
              {btn.key === 'all' ? activityLogs.length : activityLogs.filter(l => l.action === btn.key).length}
            </span>
          </button>
        ))}
      </div>

      {/* Activity Timeline */}
      {filteredLogs.length === 0 ? (
        <EmptyState icon="📋" title="No activity found" description="No activity matches your current filter." />
      ) : (
        <div className="space-y-6">
          {Object.entries(grouped).map(([date, logs]) => (
            <div key={date}>
              {/* Date Header */}
              <div className="flex items-center gap-3 mb-3">
                <div className="h-px flex-1 bg-slate-100 dark:bg-slate-700" />
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-900 px-3 py-1 rounded-full">
                  {date === new Date().toDateString() ? 'Today' : date}
                </span>
                <div className="h-px flex-1 bg-slate-100 dark:bg-slate-700" />
              </div>

              {/* Log Items */}
              <div className="space-y-2">
                {logs.map((log, i) => {
                  const cfg = ACTION_CONFIG[log.action];
                  return (
                    <div
                      key={log.id}
                      className="flex items-start gap-4 p-4 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 hover:shadow-sm transition-shadow"
                    >
                      {/* Timeline Line */}
                      <div className="flex flex-col items-center flex-shrink-0">
                        <div className={cn('h-9 w-9 rounded-xl flex items-center justify-center', cfg.bg, cfg.color)}>
                          {cfg.icon}
                        </div>
                        {i < logs.length - 1 && (
                          <div className="w-px h-full bg-slate-100 dark:bg-slate-700 mt-2" />
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <span className={cn('text-sm font-semibold capitalize', cfg.color)}>{log.action}</span>
                            {' '}
                            {log.taskTitle && (
                              <span className="text-sm text-slate-700 dark:text-slate-300">
                                "<span className="font-medium">{log.taskTitle}</span>"
                              </span>
                            )}
                          </div>
                          <span className="text-xs text-slate-400 flex-shrink-0">{formatRelativeTime(log.createdAt)}</span>
                        </div>
                        {log.details && (
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{log.details}</p>
                        )}
                        <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">{formatDateTime(log.createdAt)}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
