import React from 'react';
import { Search, X, SlidersHorizontal } from 'lucide-react';
import { useTasks } from '../../context/TaskContext';
import { Input, Select } from '../ui/Input';

interface TaskFiltersProps {
  showDateFilter?: boolean;
}

export const TaskFilters: React.FC<TaskFiltersProps> = ({ showDateFilter = true }) => {
  const { filters, setFilters, resetFilters, categories } = useTasks();

  const hasActiveFilters = filters.search || filters.status !== 'all' || filters.priority !== 'all' ||
    filters.categoryId !== 'all' || filters.dateFrom || filters.dateTo;

  const statusOptions = [
    { value: 'all',         label: 'All Status' },
    { value: 'pending',     label: 'Pending' },
    { value: 'in_progress', label: 'In Progress' },
    { value: 'completed',   label: 'Completed' },
  ];

  const priorityOptions = [
    { value: 'all',    label: 'All Priority' },
    { value: 'high',   label: '🔴 High' },
    { value: 'medium', label: '🟡 Medium' },
    { value: 'low',    label: '🟢 Low' },
  ];

  const categoryOptions = [
    { value: 'all', label: 'All Categories' },
    ...categories.map(c => ({ value: c.id, label: `${c.icon} ${c.name}` })),
  ];

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
          <SlidersHorizontal className="h-4 w-4 text-indigo-500" />
          Filters
          {hasActiveFilters && (
            <span className="bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400 text-xs px-1.5 py-0.5 rounded-full font-semibold">
              Active
            </span>
          )}
        </div>
        {hasActiveFilters && (
          <button
            onClick={resetFilters}
            className="flex items-center gap-1 text-xs text-slate-500 hover:text-red-500 transition-colors"
          >
            <X className="h-3.5 w-3.5" />
            Clear all
          </button>
        )}
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <input
          type="text"
          placeholder="Search tasks..."
          value={filters.search}
          onChange={e => setFilters({ search: e.target.value })}
          className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all"
        />
        {filters.search && (
          <button
            onClick={() => setFilters({ search: '' })}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Filters Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <Select
          options={statusOptions}
          value={filters.status}
          onChange={e => setFilters({ status: e.target.value as typeof filters.status })}
        />
        <Select
          options={priorityOptions}
          value={filters.priority}
          onChange={e => setFilters({ priority: e.target.value as typeof filters.priority })}
        />
        <Select
          options={categoryOptions}
          value={filters.categoryId}
          onChange={e => setFilters({ categoryId: e.target.value })}
        />
      </div>

      {/* Date Range */}
      {showDateFilter && (
        <div className="grid grid-cols-2 gap-3">
          <Input
            label="From"
            type="date"
            value={filters.dateFrom}
            onChange={e => setFilters({ dateFrom: e.target.value })}
          />
          <Input
            label="To"
            type="date"
            value={filters.dateTo}
            onChange={e => setFilters({ dateTo: e.target.value })}
          />
        </div>
      )}
    </div>
  );
};
