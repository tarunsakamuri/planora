import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Plus, LayoutGrid, List, CheckSquare, SortAsc } from 'lucide-react';
import { useTasks } from '../context/TaskContext';
import { Task } from '../types';
import { TaskCard } from '../components/tasks/TaskCard';
import { TaskFilters } from '../components/tasks/TaskFilters';
import { TaskForm } from '../components/tasks/TaskForm';
import { Modal } from '../components/ui/Modal';
import { Button } from '../components/ui/Button';
import { EmptyState } from '../components/ui/EmptyState';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { Select } from '../components/ui/Input';
import { sortTasks } from '../lib/utils';
import { cn } from '../utils/cn';

type ViewMode = 'list' | 'grid';
type SortKey = 'dueDate' | 'priority' | 'status' | 'title' | 'createdAt';

export const TasksPage: React.FC = () => {
  const { filteredTasks, isLoading, setFilters } = useTasks();
  const [searchParams] = useSearchParams();

  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [sortBy, setSortBy] = useState<SortKey>('dueDate');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editTask, setEditTask] = useState<Task | null>(null);
  const [showFilters, setShowFilters] = useState(true);

  // Handle search param from URL
  useEffect(() => {
    const search = searchParams.get('search');
    if (search) setFilters({ search });
  }, [searchParams]);

  const sortedTasks = sortTasks(filteredTasks, sortBy);

  const sortOptions = [
    { value: 'dueDate',   label: 'Sort by Due Date' },
    { value: 'priority',  label: 'Sort by Priority' },
    { value: 'status',    label: 'Sort by Status' },
    { value: 'title',     label: 'Sort by Title' },
    { value: 'createdAt', label: 'Sort by Created' },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <LoadingSpinner size="lg" message="Loading tasks..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <CheckSquare className="h-7 w-7 text-indigo-500" />
            Tasks
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            {filteredTasks.length} task{filteredTasks.length !== 1 ? 's' : ''} found
          </p>
        </div>
        <div className="sm:ml-auto flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
          >
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </Button>
          <Button
            size="sm"
            leftIcon={<Plus className="h-4 w-4" />}
            onClick={() => setShowCreateModal(true)}
          >
            New Task
          </Button>
        </div>
      </div>

      {/* Filters */}
      {showFilters && <TaskFilters />}

      {/* Toolbar */}
      <div className="flex items-center justify-between gap-4">
        <div className="text-sm text-slate-500 dark:text-slate-400">
          Showing <span className="font-semibold text-slate-700 dark:text-slate-300">{sortedTasks.length}</span> tasks
        </div>
        <div className="flex items-center gap-3">
          {/* Sort */}
          <div className="flex items-center gap-2">
            <SortAsc className="h-4 w-4 text-slate-400" />
            <Select
              options={sortOptions}
              value={sortBy}
              onChange={e => setSortBy(e.target.value as SortKey)}
              className="text-xs py-1.5 px-3 w-auto"
            />
          </div>
          {/* View Toggle */}
          <div className="flex rounded-xl overflow-hidden border border-slate-200 dark:border-slate-600">
            <button
              onClick={() => setViewMode('list')}
              className={cn(
                'p-2 transition-colors',
                viewMode === 'list'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white dark:bg-slate-800 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-700'
              )}
            >
              <List className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={cn(
                'p-2 transition-colors',
                viewMode === 'grid'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white dark:bg-slate-800 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-700'
              )}
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Task List */}
      {sortedTasks.length === 0 ? (
        <EmptyState
          icon="📋"
          title="No tasks found"
          description="No tasks match your current filters. Try adjusting your search or create a new task."
          action={{ label: 'Create Task', onClick: () => setShowCreateModal(true) }}
        />
      ) : (
        <div className={cn(
          viewMode === 'grid'
            ? 'grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4'
            : 'space-y-3'
        )}>
          {sortedTasks.map(task => (
            <TaskCard
              key={task.id}
              task={task}
              onEdit={setEditTask}
              view={viewMode}
            />
          ))}
        </div>
      )}

      {/* Modals */}
      <Modal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} title="Create New Task" size="lg">
        <TaskForm
          onSuccess={() => setShowCreateModal(false)}
          onCancel={() => setShowCreateModal(false)}
        />
      </Modal>
      <Modal isOpen={!!editTask} onClose={() => setEditTask(null)} title="Edit Task" size="lg">
        {editTask && (
          <TaskForm
            task={editTask}
            onSuccess={() => setEditTask(null)}
            onCancel={() => setEditTask(null)}
          />
        )}
      </Modal>
    </div>
  );
};
