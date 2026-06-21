import React, { useState } from 'react';
import { Calendar, Clock, Tag, MoreVertical, Edit2, Trash2, CheckCircle2, Circle, Flag, RefreshCw } from 'lucide-react';
import { cn } from '../../utils/cn';
import { Task } from '../../types';
import { Badge } from '../ui/Badge';
import { ConfirmModal } from '../ui/Modal';
import { useTasks } from '../../context/TaskContext';
import { getPriorityBadgeClass, getStatusBadgeClass, isOverdue, isDueToday, formatTime, getDueDateLabel } from '../../lib/utils';
import { PRIORITY_CONFIG, STATUS_CONFIG, RECURRENCE_CONFIG } from '../../lib/constants';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  view?: 'list' | 'grid' | 'compact';
}

export const TaskCard: React.FC<TaskCardProps> = ({ task, onEdit, view = 'list' }) => {
  const { toggleTask, deleteTask } = useTasks();
  const [showMenu, setShowMenu] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const overdue = isOverdue(task);
  const dueToday = isDueToday(task);

  const content = view === 'compact' ? (
    <div className={cn(
      'flex items-center gap-3 px-4 py-2.5 rounded-xl border transition-all duration-200',
      'bg-white dark:bg-slate-800 hover:shadow-sm',
      overdue && !task.isCompleted ? 'border-red-200 dark:border-red-900/40' : 'border-slate-100 dark:border-slate-700',
      task.isCompleted && 'opacity-60'
    )}>
      <button onClick={() => toggleTask(task.id)} className="flex-shrink-0">
        {task.isCompleted
          ? <CheckCircle2 className="h-5 w-5 text-emerald-500" />
          : <Circle className="h-5 w-5 text-slate-300 hover:text-indigo-500 transition-colors" />
        }
      </button>
      <div className="flex-1 min-w-0">
        <p className={cn('text-sm font-medium text-slate-800 dark:text-slate-200 truncate', task.isCompleted && 'line-through text-slate-400')}>{task.title}</p>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        <button
          onClick={() => setShowDeleteConfirm(true)}
          className="p-1 rounded-lg text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
          aria-label="Delete task"
        >
          <Trash2 className="h-4 w-4" />
        </button>
        <span className="text-xs text-slate-400">{getDueDateLabel(task.dueDate)}</span>
        <span className={cn('h-2 w-2 rounded-full flex-shrink-0', PRIORITY_CONFIG[task.priority].bg.replace('bg-', 'bg-'))} style={{ backgroundColor: PRIORITY_CONFIG[task.priority].color }} />
      </div>
    </div>
  ) : (
    <>
      <div className={cn(
        'group relative bg-white dark:bg-slate-800 rounded-2xl border transition-all duration-200',
        'hover:shadow-md hover:-translate-y-0.5',
        overdue && !task.isCompleted
          ? 'border-red-200 dark:border-red-900/40 shadow-red-50 dark:shadow-red-900/10'
          : dueToday && !task.isCompleted
            ? 'border-amber-200 dark:border-amber-900/40'
            : 'border-slate-100 dark:border-slate-700',
        task.isCompleted && 'opacity-70',
        view === 'grid' ? 'p-4' : 'p-5'
      )}>
        {/* Priority Stripe */}
        <div
          className="absolute top-0 left-0 bottom-0 w-1 rounded-l-2xl"
          style={{ backgroundColor: PRIORITY_CONFIG[task.priority].color }}
        />

        <div className="pl-3">
          {/* Header */}
          <div className="flex items-start gap-3 mb-3">
            <button
              onClick={() => toggleTask(task.id)}
              className="flex-shrink-0 mt-0.5 transition-transform hover:scale-110"
            >
              {task.isCompleted
                ? <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                : <Circle className="h-5 w-5 text-slate-300 hover:text-indigo-500 transition-colors" />
              }
            </button>

            <div className="flex-1 min-w-0">
              <h3 className={cn(
                'text-sm font-semibold text-slate-800 dark:text-slate-200 leading-snug',
                task.isCompleted && 'line-through text-slate-400 dark:text-slate-500'
              )}>
                {task.title}
              </h3>
              {task.description && (
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">{task.description}</p>
              )}
            </div>

            {/* Menu */}
            <div className="relative flex-shrink-0">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="p-1.5 rounded-lg text-slate-300 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700 dark:hover:text-slate-300 opacity-0 group-hover:opacity-100 transition-all"
              >
                <MoreVertical className="h-4 w-4" />
              </button>

              {showMenu && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setShowMenu(false)} />
                  <div className="absolute right-0 top-8 z-20 w-36 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
                    <button
                      onClick={() => { onEdit(task); setShowMenu(false); }}
                      className="flex items-center gap-2 w-full px-3 py-2.5 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700"
                    >
                      <Edit2 className="h-3.5 w-3.5" /> Edit
                    </button>
                    <button
                      onClick={() => { toggleTask(task.id); setShowMenu(false); }}
                      className="flex items-center gap-2 w-full px-3 py-2.5 text-sm text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5" /> {task.isCompleted ? 'Reopen' : 'Complete'}
                    </button>
                    <button
                      onClick={() => { setShowDeleteConfirm(true); setShowMenu(false); }}
                      className="flex items-center gap-2 w-full px-3 py-2.5 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                    >
                      <Trash2 className="h-3.5 w-3.5" /> Delete
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Badges */}
          <div className="flex flex-wrap gap-2 mb-3">
            <Badge className={getPriorityBadgeClass(task.priority)}>
              <Flag className="h-3 w-3" />
              {PRIORITY_CONFIG[task.priority].label}
            </Badge>
            <Badge className={getStatusBadgeClass(task.status)}>
              {STATUS_CONFIG[task.status].label}
            </Badge>
            {task.categoryName && (
              <Badge
                className="text-white text-opacity-90"
                style={{ backgroundColor: task.categoryColor + '33', color: task.categoryColor }}
              >
                <Tag className="h-3 w-3" />
                {task.categoryName}
              </Badge>
            )}
            {task.recurrence !== 'none' && (
              <Badge className="bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400">
                <RefreshCw className="h-3 w-3" />
                {RECURRENCE_CONFIG[task.recurrence].label}
              </Badge>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center gap-3 text-xs">
            <div className={cn(
              'flex items-center gap-1 font-medium',
              overdue && !task.isCompleted ? 'text-red-500' : dueToday && !task.isCompleted ? 'text-amber-600' : 'text-slate-400 dark:text-slate-500'
            )}>
              <Calendar className="h-3.5 w-3.5" />
              {getDueDateLabel(task.dueDate)}
            </div>
            {task.dueTime && (
              <div className="flex items-center gap-1 text-slate-400 dark:text-slate-500">
                <Clock className="h-3.5 w-3.5" />
                {formatTime(task.dueTime)}
              </div>
            )}
            {overdue && !task.isCompleted && (
              <span className="ml-auto bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400 px-2 py-0.5 rounded-full font-medium">
                Overdue
              </span>
            )}
          </div>
        </div>
      </div>
    </>
  );

  return (
    <>
      {content}
      <ConfirmModal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={() => deleteTask(task.id)}
        title="Delete Task"
        message={`Are you sure you want to delete "${task.title}"? This action cannot be undone.`}
        confirmLabel="Delete"
        variant="danger"
      />
    </>
  );
};
