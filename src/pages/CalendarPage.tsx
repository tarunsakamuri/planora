import React, { useState, useMemo } from 'react';
import {
  format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval,
  addMonths, subMonths, addWeeks, subWeeks, isSameMonth, isToday,
  addDays, subDays
} from 'date-fns';
import { ChevronLeft, ChevronRight, Plus, Calendar, AlignJustify, Grid } from 'lucide-react';
import { useTasks } from '../context/TaskContext';
import { Task } from '../types';
import { TaskForm } from '../components/tasks/TaskForm';
import { Modal } from '../components/ui/Modal';
import { Button } from '../components/ui/Button';
import { cn } from '../utils/cn';
import { PRIORITY_CONFIG } from '../lib/constants';
import { isOverdue } from '../lib/utils';

type CalView = 'month' | 'week' | 'day';

export const CalendarPage: React.FC = () => {
  const { tasks, moveTaskDate } = useTasks();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<CalView>('month');
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editTask, setEditTask] = useState<Task | null>(null);
  const [draggedTask, setDraggedTask] = useState<Task | null>(null);
  const [dragOverDate, setDragOverDate] = useState<string | null>(null);

  const getTasksForDate = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return tasks.filter(t => t.dueDate === dateStr);
  };

  // ─── Month View ────────────────────────────────────────────────────────────
  const monthDays = useMemo(() => {
    const start = startOfWeek(startOfMonth(currentDate));
    const end = endOfWeek(endOfMonth(currentDate));
    return eachDayOfInterval({ start, end });
  }, [currentDate]);

  // ─── Week View ─────────────────────────────────────────────────────────────
  const weekDays = useMemo(() => {
    const start = startOfWeek(currentDate);
    const end = endOfWeek(currentDate);
    return eachDayOfInterval({ start, end });
  }, [currentDate]);

  // ─── Navigation ────────────────────────────────────────────────────────────
  const navigate = (dir: 'prev' | 'next') => {
    if (view === 'month') setCurrentDate(prev => dir === 'prev' ? subMonths(prev, 1) : addMonths(prev, 1));
    else if (view === 'week') setCurrentDate(prev => dir === 'prev' ? subWeeks(prev, 1) : addWeeks(prev, 1));
    else setCurrentDate(prev => dir === 'prev' ? subDays(prev, 1) : addDays(prev, 1));
  };

  const goToday = () => setCurrentDate(new Date());

  // ─── Drag & Drop ───────────────────────────────────────────────────────────
  const handleDragStart = (task: Task) => setDraggedTask(task);
  const handleDragOver = (e: React.DragEvent, dateStr: string) => {
    e.preventDefault();
    setDragOverDate(dateStr);
  };
  const handleDrop = (e: React.DragEvent, dateStr: string) => {
    e.preventDefault();
    if (draggedTask && draggedTask.dueDate !== dateStr) {
      moveTaskDate(draggedTask.id, dateStr);
    }
    setDraggedTask(null);
    setDragOverDate(null);
  };
  const handleDragEnd = () => { setDraggedTask(null); setDragOverDate(null); };

  const title = view === 'month'
    ? format(currentDate, 'MMMM yyyy')
    : view === 'week'
      ? `${format(startOfWeek(currentDate), 'MMM d')} – ${format(endOfWeek(currentDate), 'MMM d, yyyy')}`
      : format(currentDate, 'EEEE, MMMM d, yyyy');

  const viewButtons: { key: CalView; label: string; icon: React.ReactNode }[] = [
    { key: 'month', label: 'Month', icon: <Grid className="h-4 w-4" /> },
    { key: 'week',  label: 'Week',  icon: <AlignJustify className="h-4 w-4" /> },
    { key: 'day',   label: 'Day',   icon: <Calendar className="h-4 w-4" /> },
  ];

  const TaskPill: React.FC<{ task: Task; compact?: boolean }> = ({ task, compact = false }) => (
    <div
      draggable
      onDragStart={() => handleDragStart(task)}
      onDragEnd={handleDragEnd}
      onClick={e => { e.stopPropagation(); setEditTask(task); }}
      className={cn(
        'rounded-lg cursor-grab active:cursor-grabbing text-white text-xs font-medium px-2 py-0.5 truncate',
        'hover:opacity-90 transition-opacity',
        task.isCompleted && 'opacity-50 line-through',
        isOverdue(task) && !task.isCompleted && 'ring-1 ring-red-400'
      )}
      style={{ backgroundColor: PRIORITY_CONFIG[task.priority].color }}
      title={task.title}
    >
      {compact ? task.title.slice(0, 20) : task.title}
    </div>
  );

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 p-4">
        <div className="flex flex-wrap items-center gap-3">
          {/* Navigation */}
          <div className="flex items-center gap-2">
            <button onClick={() => navigate('prev')} className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
              <ChevronLeft className="h-5 w-5 text-slate-600 dark:text-slate-400" />
            </button>
            <button onClick={goToday} className="px-3 py-1.5 rounded-lg text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors">
              Today
            </button>
            <button onClick={() => navigate('next')} className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
              <ChevronRight className="h-5 w-5 text-slate-600 dark:text-slate-400" />
            </button>
          </div>

          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex-1 text-center sm:text-left">{title}</h2>

          <div className="flex items-center gap-2 ml-auto">
            {/* View Toggle */}
            <div className="flex rounded-xl overflow-hidden border border-slate-200 dark:border-slate-600">
              {viewButtons.map(btn => (
                <button
                  key={btn.key}
                  onClick={() => setView(btn.key)}
                  className={cn(
                    'flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium transition-colors',
                    view === btn.key
                      ? 'bg-indigo-600 text-white'
                      : 'bg-white dark:bg-slate-800 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-700'
                  )}
                >
                  {btn.icon}
                  <span className="hidden sm:inline">{btn.label}</span>
                </button>
              ))}
            </div>
            <Button size="sm" leftIcon={<Plus className="h-4 w-4" />} onClick={() => setShowCreateModal(true)}>
              Add Task
            </Button>
          </div>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 overflow-hidden">
        {/* ─── Month View ─────────────────────────────────────────── */}
        {view === 'month' && (
          <>
            {/* Weekday Headers */}
            <div className="grid grid-cols-7 border-b border-slate-100 dark:border-slate-700">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                <div key={d} className="text-center text-xs font-semibold text-slate-500 dark:text-slate-400 py-3">
                  {d}
                </div>
              ))}
            </div>
            {/* Days Grid */}
            <div className="grid grid-cols-7">
              {monthDays.map((day, i) => {
                const dayTasks = getTasksForDate(day);
                const dateStr = format(day, 'yyyy-MM-dd');
                const isCurrentMonth = isSameMonth(day, currentDate);
                const isDragOver = dragOverDate === dateStr;

                return (
                  <div
                    key={i}
                    onDragOver={e => handleDragOver(e, dateStr)}
                    onDrop={e => handleDrop(e, dateStr)}
                    onClick={() => { setSelectedDate(dateStr); setShowCreateModal(true); }}
                    className={cn(
                      'min-h-24 p-2 border-b border-r border-slate-100 dark:border-slate-700 cursor-pointer',
                      'transition-colors hover:bg-slate-50 dark:hover:bg-slate-700/50',
                      !isCurrentMonth && 'bg-slate-50/50 dark:bg-slate-800/50',
                      isDragOver && 'bg-indigo-50 dark:bg-indigo-900/20 border-indigo-200 dark:border-indigo-700',
                      isToday(day) && 'bg-indigo-50/30 dark:bg-indigo-900/10'
                    )}
                  >
                    <div className={cn(
                      'w-7 h-7 rounded-full flex items-center justify-center text-sm font-medium mb-1',
                      isToday(day)
                        ? 'bg-indigo-600 text-white'
                        : isCurrentMonth
                          ? 'text-slate-700 dark:text-slate-300'
                          : 'text-slate-300 dark:text-slate-600'
                    )}>
                      {format(day, 'd')}
                    </div>
                    <div className="space-y-0.5">
                      {dayTasks.slice(0, 3).map(task => (
                        <TaskPill key={task.id} task={task} compact />
                      ))}
                      {dayTasks.length > 3 && (
                        <div className="text-xs text-slate-400 pl-1">+{dayTasks.length - 3} more</div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* ─── Week View ──────────────────────────────────────────── */}
        {view === 'week' && (
          <>
            <div className="grid grid-cols-7 border-b border-slate-100 dark:border-slate-700">
              {weekDays.map((day, i) => (
                <div key={i} className={cn('text-center py-3 border-r last:border-0 border-slate-100 dark:border-slate-700')}>
                  <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">{format(day, 'EEE')}</p>
                  <div className={cn(
                    'w-9 h-9 rounded-full flex items-center justify-center mx-auto mt-1 text-sm font-bold',
                    isToday(day) ? 'bg-indigo-600 text-white' : 'text-slate-700 dark:text-slate-300'
                  )}>
                    {format(day, 'd')}
                  </div>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 min-h-72">
              {weekDays.map((day, i) => {
                const dayTasks = getTasksForDate(day);
                const dateStr = format(day, 'yyyy-MM-dd');
                return (
                  <div
                    key={i}
                    onDragOver={e => handleDragOver(e, dateStr)}
                    onDrop={e => handleDrop(e, dateStr)}
                    onClick={() => { setSelectedDate(dateStr); setShowCreateModal(true); }}
                    className={cn(
                      'border-r last:border-0 border-slate-100 dark:border-slate-700 p-2 cursor-pointer',
                      'hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors',
                      dragOverDate === dateStr && 'bg-indigo-50 dark:bg-indigo-900/20'
                    )}
                  >
                    <div className="space-y-1">
                      {dayTasks.map(task => <TaskPill key={task.id} task={task} compact />)}
                    </div>
                    {dayTasks.length === 0 && (
                      <div className="flex items-center justify-center h-full">
                        <Plus className="h-4 w-4 text-slate-200 dark:text-slate-700" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* ─── Day View ───────────────────────────────────────────── */}
        {view === 'day' && (() => {
          const dayTasks = getTasksForDate(currentDate);
          const dateStr = format(currentDate, 'yyyy-MM-dd');
          return (
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-slate-900 dark:text-white">
                  {dayTasks.length} task{dayTasks.length !== 1 ? 's' : ''} scheduled
                </h3>
                <Button
                  size="sm"
                  variant="outline"
                  leftIcon={<Plus className="h-4 w-4" />}
                  onClick={() => { setSelectedDate(dateStr); setShowCreateModal(true); }}
                >
                  Add Task
                </Button>
              </div>
              {dayTasks.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="text-5xl mb-3">📅</div>
                  <p className="text-slate-500 dark:text-slate-400">No tasks for this day. Click to add one!</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {dayTasks
                    .sort((a, b) => (a.dueTime || '').localeCompare(b.dueTime || ''))
                    .map(task => (
                      <div
                        key={task.id}
                        onClick={() => setEditTask(task)}
                        draggable
                        onDragStart={() => handleDragStart(task)}
                        className={cn(
                          'flex items-start gap-4 p-4 rounded-2xl border cursor-pointer',
                          'hover:shadow-md transition-all duration-200',
                          isOverdue(task) && !task.isCompleted
                            ? 'border-red-200 bg-red-50 dark:border-red-900/40 dark:bg-red-900/10'
                            : 'border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-700/30'
                        )}
                      >
                        <div className="w-1 self-stretch rounded-full flex-shrink-0" style={{ backgroundColor: PRIORITY_CONFIG[task.priority].color }} />
                        <div className="flex-1 min-w-0">
                          <p className={cn('font-semibold text-slate-800 dark:text-slate-200', task.isCompleted && 'line-through opacity-60')}>{task.title}</p>
                          {task.description && <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">{task.description}</p>}
                          <div className="flex items-center gap-3 mt-2">
                            {task.dueTime && <span className="text-xs text-indigo-600 dark:text-indigo-400 font-medium">{task.dueTime}</span>}
                            <span className="text-xs text-slate-400 capitalize">{task.priority} priority</span>
                          </div>
                        </div>
                      </div>
                    ))
                  }
                </div>
              )}
            </div>
          );
        })()}
      </div>

      {/* Legend */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 p-4">
        <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">Priority Legend</p>
        <div className="flex flex-wrap gap-4">
          {(['high', 'medium', 'low'] as const).map(p => (
            <div key={p} className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-sm" style={{ backgroundColor: PRIORITY_CONFIG[p].color }} />
              <span className="text-xs text-slate-600 dark:text-slate-400 capitalize">{p}</span>
            </div>
          ))}
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-sm border border-red-400" />
            <span className="text-xs text-slate-600 dark:text-slate-400">Overdue</span>
          </div>
        </div>
        <p className="text-xs text-slate-400 dark:text-slate-500 mt-2">💡 Drag tasks to reschedule them</p>
      </div>

      {/* Modals */}
      <Modal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} title="Create New Task" size="lg">
        <TaskForm
          defaultDate={selectedDate || undefined}
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
