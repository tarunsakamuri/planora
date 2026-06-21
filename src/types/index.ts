// ─── Auth Types ───────────────────────────────────────────────────────────────
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

// ─── Task Types ───────────────────────────────────────────────────────────────
export type Priority = 'high' | 'medium' | 'low';
export type TaskStatus = 'pending' | 'in_progress' | 'completed';
export type RecurrenceType = 'none' | 'daily' | 'weekly' | 'monthly';

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: Priority;
  categoryId: string;
  categoryName?: string;
  categoryColor?: string;
  dueDate: string;
  dueTime?: string;
  recurrence: RecurrenceType;
  isCompleted: boolean;
  completedAt?: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  tags?: string[];
}

export interface CreateTaskInput {
  title: string;
  description?: string;
  status: TaskStatus;
  priority: Priority;
  categoryId: string;
  dueDate: string;
  dueTime?: string;
  recurrence: RecurrenceType;
  tags?: string[];
}

export interface UpdateTaskInput extends Partial<CreateTaskInput> {
  isCompleted?: boolean;
}

// ─── Category Types ───────────────────────────────────────────────────────────
export interface Category {
  id: string;
  name: string;
  color: string;
  icon: string;
  userId: string;
  isDefault: boolean;
  taskCount?: number;
  createdAt: string;
}

export interface CreateCategoryInput {
  name: string;
  color: string;
  icon: string;
}

// ─── Activity Log Types ───────────────────────────────────────────────────────
export type ActivityAction = 'created' | 'updated' | 'deleted' | 'completed' | 'reopened';

export interface ActivityLog {
  id: string;
  userId: string;
  taskId?: string;
  taskTitle?: string;
  action: ActivityAction;
  details?: string;
  createdAt: string;
}

// ─── Notification Types ───────────────────────────────────────────────────────
export interface Notification {
  id: string;
  userId: string;
  taskId?: string;
  title: string;
  message: string;
  isRead: boolean;
  type: 'reminder' | 'overdue' | 'upcoming' | 'system';
  createdAt: string;
}

// ─── Dashboard Types ───────────────────────────────────────────────────────────
export interface DashboardStats {
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
  inProgressTasks: number;
  completionPercentage: number;
  tasksDueToday: number;
  overdueTasksCount: number;
  upcomingTasks: Task[];
  recentActivity: ActivityLog[];
}

export interface WeeklyChartData {
  day: string;
  completed: number;
  created: number;
}

export interface MonthlyChartData {
  week: string;
  completed: number;
  total: number;
}

export interface CategoryChartData {
  name: string;
  value: number;
  color: string;
}

// ─── Filter Types ─────────────────────────────────────────────────────────────
export interface TaskFilters {
  search: string;
  status: TaskStatus | 'all';
  priority: Priority | 'all';
  categoryId: string | 'all';
  dateFrom: string;
  dateTo: string;
}

// ─── Calendar Types ───────────────────────────────────────────────────────────
export type CalendarView = 'month' | 'week' | 'day';

export interface CalendarDay {
  date: Date;
  tasks: Task[];
  isCurrentMonth: boolean;
  isToday: boolean;
  isSelected: boolean;
}

// ─── Theme Types ──────────────────────────────────────────────────────────────
export type Theme = 'light' | 'dark';

// ─── API Types ────────────────────────────────────────────────────────────────
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
