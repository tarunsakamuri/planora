// ─── API Configuration ────────────────────────────────────────────────────────
export const API_BASE_URL = 'http://localhost:8000/api/v1';

// ─── Storage Keys ─────────────────────────────────────────────────────────────
export const STORAGE_KEYS = {
  TOKEN: 'Todo-Calender_token',
  USER: 'Todo-Calender_user',
  THEME: 'Todo-Calender_theme',
  CALENDAR_VIEW: 'Todo-Calender_calendar_view',
} as const;

// ─── Default Categories ───────────────────────────────────────────────────────
export const DEFAULT_CATEGORIES = [
  { id: 'cat_study',    name: 'Study',    color: '#6366f1', icon: '📚', isDefault: true },
  { id: 'cat_work',     name: 'Work',     color: '#f59e0b', icon: '💼', isDefault: true },
  { id: 'cat_personal', name: 'Personal', color: '#10b981', icon: '🏠', isDefault: true },
  { id: 'cat_fitness',  name: 'Fitness',  color: '#ef4444', icon: '💪', isDefault: true },
  { id: 'cat_other',    name: 'Other',    color: '#8b5cf6', icon: '✨', isDefault: true },
] as const;

// ─── Priority Config ──────────────────────────────────────────────────────────
export const PRIORITY_CONFIG = {
  high:   { label: 'High',   color: '#ef4444', bg: 'bg-red-100',    text: 'text-red-700',    dark: 'dark:bg-red-900/30 dark:text-red-400' },
  medium: { label: 'Medium', color: '#f59e0b', bg: 'bg-amber-100',  text: 'text-amber-700',  dark: 'dark:bg-amber-900/30 dark:text-amber-400' },
  low:    { label: 'Low',    color: '#10b981', bg: 'bg-emerald-100', text: 'text-emerald-700', dark: 'dark:bg-emerald-900/30 dark:text-emerald-400' },
} as const;

// ─── Status Config ────────────────────────────────────────────────────────────
export const STATUS_CONFIG = {
  pending:     { label: 'Pending',     color: '#94a3b8', bg: 'bg-slate-100',  text: 'text-slate-700',  dark: 'dark:bg-slate-700 dark:text-slate-300' },
  in_progress: { label: 'In Progress', color: '#6366f1', bg: 'bg-indigo-100', text: 'text-indigo-700', dark: 'dark:bg-indigo-900/30 dark:text-indigo-400' },
  completed:   { label: 'Completed',   color: '#10b981', bg: 'bg-emerald-100', text: 'text-emerald-700', dark: 'dark:bg-emerald-900/30 dark:text-emerald-400' },
} as const;

// ─── Recurrence Config ────────────────────────────────────────────────────────
export const RECURRENCE_CONFIG = {
  none:    { label: 'No Repeat' },
  daily:   { label: 'Daily' },
  weekly:  { label: 'Weekly' },
  monthly: { label: 'Monthly' },
} as const;

// ─── Chart Colors ─────────────────────────────────────────────────────────────
export const CHART_COLORS = [
  '#6366f1', '#f59e0b', '#10b981', '#ef4444', '#8b5cf6',
  '#06b6d4', '#f97316', '#84cc16', '#ec4899', '#14b8a6',
];

// ─── Navigation Items ─────────────────────────────────────────────────────────
export const NAV_ITEMS = [
  { path: '/dashboard',  label: 'Dashboard',  icon: 'LayoutDashboard' },
  { path: '/tasks',      label: 'Tasks',      icon: 'CheckSquare' },
  { path: '/calendar',   label: 'Calendar',   icon: 'Calendar' },
  { path: '/categories', label: 'Categories', icon: 'Tag' },
  { path: '/analytics',  label: 'Analytics',  icon: 'BarChart2' },
  { path: '/activity',   label: 'Activity',   icon: 'Activity' },
  { path: '/profile',    label: 'Profile',    icon: 'User' },
] as const;
