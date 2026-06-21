import { format, formatDistanceToNow, isToday, isTomorrow, isPast, parseISO } from 'date-fns';
import { Task, Priority, TaskStatus } from '../types';
import { PRIORITY_CONFIG, STATUS_CONFIG } from './constants';

// ─── Date Utilities ───────────────────────────────────────────────────────────
export const formatDate = (date: string | Date): string => {
  const d = typeof date === 'string' ? parseISO(date) : date;
  return format(d, 'MMM dd, yyyy');
};

export const formatDateTime = (date: string | Date): string => {
  const d = typeof date === 'string' ? parseISO(date) : date;
  return format(d, 'MMM dd, yyyy • h:mm a');
};

export const formatTime = (time: string): string => {
  const [hours, minutes] = time.split(':');
  const h = parseInt(hours);
  const ampm = h >= 12 ? 'PM' : 'AM';
  const h12 = h % 12 || 12;
  return `${h12}:${minutes} ${ampm}`;
};

export const formatRelativeTime = (date: string | Date): string => {
  const d = typeof date === 'string' ? parseISO(date) : date;
  return formatDistanceToNow(d, { addSuffix: true });
};

export const getDueDateLabel = (dueDate: string): string => {
  const date = parseISO(dueDate);
  if (isToday(date)) return 'Today';
  if (isTomorrow(date)) return 'Tomorrow';
  if (isPast(date)) return `Overdue (${formatDate(date)})`;
  return formatDate(date);
};

export const isOverdue = (task: Task): boolean => {
  if (task.isCompleted) return false;
  const today = format(new Date(), 'yyyy-MM-dd');
  return task.dueDate < today;
};

export const isDueToday = (task: Task): boolean => {
  const today = format(new Date(), 'yyyy-MM-dd');
  return task.dueDate === today;
};

// ─── Priority Utilities ───────────────────────────────────────────────────────
export const getPriorityConfig = (priority: Priority) => PRIORITY_CONFIG[priority];

export const getPriorityBadgeClass = (priority: Priority): string => {
  const cfg = PRIORITY_CONFIG[priority];
  return `${cfg.bg} ${cfg.text} ${cfg.dark}`;
};

// ─── Status Utilities ─────────────────────────────────────────────────────────
export const getStatusConfig = (status: TaskStatus) => STATUS_CONFIG[status];

export const getStatusBadgeClass = (status: TaskStatus): string => {
  const cfg = STATUS_CONFIG[status];
  return `${cfg.bg} ${cfg.text} ${cfg.dark}`;
};

// ─── ID Generation ────────────────────────────────────────────────────────────
export const generateId = (prefix: string = 'id'): string => {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// ─── String Utilities ─────────────────────────────────────────────────────────
export const truncate = (str: string, maxLength: number): string => {
  if (str.length <= maxLength) return str;
  return `${str.slice(0, maxLength)}...`;
};

export const capitalize = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1).replace(/_/g, ' ');
};

// ─── Filter Utilities ─────────────────────────────────────────────────────────
export const filterTasks = (
  tasks: Task[],
  filters: {
    search?: string;
    status?: string;
    priority?: string;
    categoryId?: string;
    dateFrom?: string;
    dateTo?: string;
  }
): Task[] => {
  return tasks.filter(task => {
    if (filters.search && !task.title.toLowerCase().includes(filters.search.toLowerCase()) &&
      !task.description?.toLowerCase().includes(filters.search.toLowerCase())) {
      return false;
    }
    if (filters.status && filters.status !== 'all' && task.status !== filters.status) return false;
    if (filters.priority && filters.priority !== 'all' && task.priority !== filters.priority) return false;
    if (filters.categoryId && filters.categoryId !== 'all' && task.categoryId !== filters.categoryId) return false;
    if (filters.dateFrom && task.dueDate < filters.dateFrom) return false;
    if (filters.dateTo && task.dueDate > filters.dateTo) return false;
    return true;
  });
};

// ─── Sort Utilities ───────────────────────────────────────────────────────────
export const sortTasks = (tasks: Task[], sortBy: 'dueDate' | 'priority' | 'status' | 'title' | 'createdAt' = 'dueDate'): Task[] => {
  const priorityOrder = { high: 0, medium: 1, low: 2 };
  const statusOrder = { in_progress: 0, pending: 1, completed: 2 };

  return [...tasks].sort((a, b) => {
    switch (sortBy) {
      case 'priority': return priorityOrder[a.priority] - priorityOrder[b.priority];
      case 'status': return statusOrder[a.status] - statusOrder[b.status];
      case 'title': return a.title.localeCompare(b.title);
      case 'createdAt': return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      default: return a.dueDate.localeCompare(b.dueDate);
    }
  });
};

// ─── Storage Utilities ────────────────────────────────────────────────────────
export const storage = {
  get: <T>(key: string, fallback: T): T => {
    try {
      const item = localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : fallback;
    } catch {
      return fallback;
    }
  },
  set: (key: string, value: unknown): void => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      console.error('Failed to save to localStorage');
    }
  },
  remove: (key: string): void => {
    try {
      localStorage.removeItem(key);
    } catch {
      console.error('Failed to remove from localStorage');
    }
  },
};

// ─── Color Utilities ──────────────────────────────────────────────────────────
export const hexToRgba = (hex: string, alpha: number): string => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

export const getInitials = (name: string): string => {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
};
