import { Task, Category, ActivityLog, Notification, DashboardStats, WeeklyChartData, MonthlyChartData, CategoryChartData, User } from '../types';
import { format, subDays, addDays, subHours } from 'date-fns';

// ─── Mock User ────────────────────────────────────────────────────────────────
export const MOCK_USER: User = {
  id: 'user_1',
  name: 'Alex Johnson',
  email: 'Tarun@Todo-Calender.io',
  avatar: '',
  createdAt: '2024-01-15T10:00:00Z',
};

// ─── Mock Categories ──────────────────────────────────────────────────────────
export const MOCK_CATEGORIES: Category[] = [
  { id: 'cat_study',    name: 'Study',    color: '#6366f1', icon: '📚', userId: 'user_1', isDefault: true, taskCount: 8,  createdAt: '2024-01-15T10:00:00Z' },
  { id: 'cat_work',     name: 'Work',     color: '#f59e0b', icon: '💼', userId: 'user_1', isDefault: true, taskCount: 12, createdAt: '2024-01-15T10:00:00Z' },
  { id: 'cat_personal', name: 'Personal', color: '#10b981', icon: '🏠', userId: 'user_1', isDefault: true, taskCount: 6,  createdAt: '2024-01-15T10:00:00Z' },
  { id: 'cat_fitness',  name: 'Fitness',  color: '#ef4444', icon: '💪', userId: 'user_1', isDefault: true, taskCount: 4,  createdAt: '2024-01-15T10:00:00Z' },
  { id: 'cat_other',    name: 'Other',    color: '#8b5cf6', icon: '✨', userId: 'user_1', isDefault: true, taskCount: 3,  createdAt: '2024-01-15T10:00:00Z' },
];

// ─── Mock Tasks ───────────────────────────────────────────────────────────────
const today = new Date();
export const MOCK_TASKS: Task[] = [
  {
    id: 'task_1', title: 'Complete React project documentation', description: 'Write comprehensive docs for the new React components', status: 'in_progress', priority: 'high',
    categoryId: 'cat_work', categoryName: 'Work', categoryColor: '#f59e0b', dueDate: format(today, 'yyyy-MM-dd'), dueTime: '17:00',
    recurrence: 'none', isCompleted: false, userId: 'user_1', createdAt: subDays(today, 2).toISOString(), updatedAt: subDays(today, 1).toISOString(), tags: ['react', 'docs'],
  },
  {
    id: 'task_2', title: 'Morning workout session', description: '30 minutes cardio + strength training', status: 'completed', priority: 'medium',
    categoryId: 'cat_fitness', categoryName: 'Fitness', categoryColor: '#ef4444', dueDate: format(today, 'yyyy-MM-dd'), dueTime: '07:00',
    recurrence: 'daily', isCompleted: true, completedAt: subHours(today, 3).toISOString(), userId: 'user_1', createdAt: subDays(today, 7).toISOString(), updatedAt: today.toISOString(), tags: ['health'],
  },
  {
    id: 'task_3', title: 'Study TypeScript generics', description: 'Deep dive into advanced TypeScript patterns', status: 'pending', priority: 'high',
    categoryId: 'cat_study', categoryName: 'Study', categoryColor: '#6366f1', dueDate: format(addDays(today, 1), 'yyyy-MM-dd'), dueTime: '14:00',
    recurrence: 'none', isCompleted: false, userId: 'user_1', createdAt: subDays(today, 1).toISOString(), updatedAt: subDays(today, 1).toISOString(), tags: ['typescript', 'learning'],
  },
  {
    id: 'task_4', title: 'Grocery shopping', description: 'Buy vegetables, fruits, and weekly essentials', status: 'pending', priority: 'low',
    categoryId: 'cat_personal', categoryName: 'Personal', categoryColor: '#10b981', dueDate: format(addDays(today, 1), 'yyyy-MM-dd'), dueTime: '11:00',
    recurrence: 'weekly', isCompleted: false, userId: 'user_1', createdAt: subDays(today, 3).toISOString(), updatedAt: subDays(today, 3).toISOString(), tags: [],
  },
  {
    id: 'task_5', title: 'Team standup meeting', description: 'Daily sync with the engineering team', status: 'completed', priority: 'medium',
    categoryId: 'cat_work', categoryName: 'Work', categoryColor: '#f59e0b', dueDate: format(today, 'yyyy-MM-dd'), dueTime: '09:00',
    recurrence: 'daily', isCompleted: true, completedAt: subHours(today, 5).toISOString(), userId: 'user_1', createdAt: subDays(today, 30).toISOString(), updatedAt: today.toISOString(), tags: ['meeting'],
  },
  {
    id: 'task_6', title: 'Read "Clean Code" chapter 5', description: 'Focus on functions and clean abstractions', status: 'pending', priority: 'medium',
    categoryId: 'cat_study', categoryName: 'Study', categoryColor: '#6366f1', dueDate: format(addDays(today, 2), 'yyyy-MM-dd'), dueTime: '20:00',
    recurrence: 'none', isCompleted: false, userId: 'user_1', createdAt: subDays(today, 1).toISOString(), updatedAt: subDays(today, 1).toISOString(), tags: ['books', 'reading'],
  },
  {
    id: 'task_7', title: 'Deploy staging environment', description: 'Push latest changes to staging server and run tests', status: 'in_progress', priority: 'high',
    categoryId: 'cat_work', categoryName: 'Work', categoryColor: '#f59e0b', dueDate: format(today, 'yyyy-MM-dd'), dueTime: '15:00',
    recurrence: 'none', isCompleted: false, userId: 'user_1', createdAt: subDays(today, 1).toISOString(), updatedAt: today.toISOString(), tags: ['devops', 'deployment'],
  },
  {
    id: 'task_8', title: 'Yoga and meditation', description: '20 minute yoga followed by 10 minute meditation', status: 'pending', priority: 'low',
    categoryId: 'cat_fitness', categoryName: 'Fitness', categoryColor: '#ef4444', dueDate: format(addDays(today, 1), 'yyyy-MM-dd'), dueTime: '06:30',
    recurrence: 'daily', isCompleted: false, userId: 'user_1', createdAt: subDays(today, 5).toISOString(), updatedAt: subDays(today, 5).toISOString(), tags: ['mindfulness'],
  },
  {
    id: 'task_9', title: 'Pay monthly bills', description: 'Electricity, internet, and credit card bill', status: 'pending', priority: 'high',
    categoryId: 'cat_personal', categoryName: 'Personal', categoryColor: '#10b981', dueDate: format(subDays(today, 1), 'yyyy-MM-dd'), dueTime: '12:00',
    recurrence: 'monthly', isCompleted: false, userId: 'user_1', createdAt: subDays(today, 5).toISOString(), updatedAt: subDays(today, 5).toISOString(), tags: ['finance'],
  },
  {
    id: 'task_10', title: 'Code review for PR #42', description: 'Review teammate\'s pull request for the auth module', status: 'pending', priority: 'medium',
    categoryId: 'cat_work', categoryName: 'Work', categoryColor: '#f59e0b', dueDate: format(addDays(today, 3), 'yyyy-MM-dd'), dueTime: '16:00',
    recurrence: 'none', isCompleted: false, userId: 'user_1', createdAt: today.toISOString(), updatedAt: today.toISOString(), tags: ['code-review'],
  },
  {
    id: 'task_11', title: 'Write unit tests for API', description: 'Cover edge cases for the task CRUD endpoints', status: 'pending', priority: 'high',
    categoryId: 'cat_work', categoryName: 'Work', categoryColor: '#f59e0b', dueDate: format(addDays(today, 4), 'yyyy-MM-dd'), dueTime: '14:00',
    recurrence: 'none', isCompleted: false, userId: 'user_1', createdAt: today.toISOString(), updatedAt: today.toISOString(), tags: ['testing'],
  },
  {
    id: 'task_12', title: 'Monthly budget review', description: 'Analyze spending and adjust budget for next month', status: 'completed', priority: 'medium',
    categoryId: 'cat_personal', categoryName: 'Personal', categoryColor: '#10b981', dueDate: format(subDays(today, 3), 'yyyy-MM-dd'), dueTime: '19:00',
    recurrence: 'monthly', isCompleted: true, completedAt: subDays(today, 3).toISOString(), userId: 'user_1', createdAt: subDays(today, 10).toISOString(), updatedAt: subDays(today, 3).toISOString(), tags: ['finance'],
  },
  {
    id: 'task_13', title: 'Learn Docker containers', description: 'Complete Docker fundamentals course', status: 'in_progress', priority: 'medium',
    categoryId: 'cat_study', categoryName: 'Study', categoryColor: '#6366f1', dueDate: format(addDays(today, 5), 'yyyy-MM-dd'), dueTime: '21:00',
    recurrence: 'none', isCompleted: false, userId: 'user_1', createdAt: subDays(today, 4).toISOString(), updatedAt: subDays(today, 2).toISOString(), tags: ['docker', 'devops'],
  },
  {
    id: 'task_14', title: '5K run training', description: 'Interval training for 5K race preparation', status: 'completed', priority: 'high',
    categoryId: 'cat_fitness', categoryName: 'Fitness', categoryColor: '#ef4444', dueDate: format(subDays(today, 1), 'yyyy-MM-dd'), dueTime: '06:00',
    recurrence: 'none', isCompleted: true, completedAt: subDays(today, 1).toISOString(), userId: 'user_1', createdAt: subDays(today, 7).toISOString(), updatedAt: subDays(today, 1).toISOString(), tags: ['running'],
  },
  {
    id: 'task_15', title: 'Database schema optimization', description: 'Add indexes and optimize slow queries', status: 'pending', priority: 'high',
    categoryId: 'cat_work', categoryName: 'Work', categoryColor: '#f59e0b', dueDate: format(addDays(today, 2), 'yyyy-MM-dd'), dueTime: '11:00',
    recurrence: 'none', isCompleted: false, userId: 'user_1', createdAt: today.toISOString(), updatedAt: today.toISOString(), tags: ['database', 'optimization'],
  },
];

// ─── Mock Activity Logs ───────────────────────────────────────────────────────
export const MOCK_ACTIVITY_LOGS: ActivityLog[] = [
  { id: 'log_1', userId: 'user_1', taskId: 'task_2', taskTitle: 'Morning workout session', action: 'completed', details: 'Task marked as completed', createdAt: subHours(today, 3).toISOString() },
  { id: 'log_2', userId: 'user_1', taskId: 'task_5', taskTitle: 'Team standup meeting', action: 'completed', details: 'Task marked as completed', createdAt: subHours(today, 5).toISOString() },
  { id: 'log_3', userId: 'user_1', taskId: 'task_7', taskTitle: 'Deploy staging environment', action: 'updated', details: 'Status changed to In Progress', createdAt: subHours(today, 2).toISOString() },
  { id: 'log_4', userId: 'user_1', taskId: 'task_15', taskTitle: 'Database schema optimization', action: 'created', details: 'New task created', createdAt: subHours(today, 1).toISOString() },
  { id: 'log_5', userId: 'user_1', taskId: 'task_11', taskTitle: 'Write unit tests for API', action: 'created', details: 'New task created', createdAt: subHours(today, 4).toISOString() },
  { id: 'log_6', userId: 'user_1', taskId: 'task_12', taskTitle: 'Monthly budget review', action: 'completed', details: 'Task marked as completed', createdAt: subDays(today, 3).toISOString() },
  { id: 'log_7', userId: 'user_1', taskId: 'task_14', taskTitle: '5K run training', action: 'completed', details: 'Task marked as completed', createdAt: subDays(today, 1).toISOString() },
  { id: 'log_8', userId: 'user_1', taskId: 'task_9', taskTitle: 'Pay monthly bills', action: 'created', details: 'New task created', createdAt: subDays(today, 5).toISOString() },
  { id: 'log_9', userId: 'user_1', taskId: 'task_1', taskTitle: 'Complete React project documentation', action: 'updated', details: 'Priority changed to High', createdAt: subDays(today, 1).toISOString() },
  { id: 'log_10', userId: 'user_1', taskId: 'task_3', taskTitle: 'Study TypeScript generics', action: 'created', details: 'New task created', createdAt: subDays(today, 1).toISOString() },
];

// ─── Mock Notifications ───────────────────────────────────────────────────────
export const MOCK_NOTIFICATIONS: Notification[] = [
  { id: 'notif_1', userId: 'user_1', taskId: 'task_1', title: 'Task Due Today', message: 'Complete React project documentation is due at 5:00 PM', isRead: false, type: 'reminder', createdAt: subHours(today, 1).toISOString() },
  { id: 'notif_2', userId: 'user_1', taskId: 'task_9', title: 'Overdue Task', message: 'Pay monthly bills was due yesterday!', isRead: false, type: 'overdue', createdAt: subHours(today, 2).toISOString() },
  { id: 'notif_3', userId: 'user_1', taskId: 'task_7', title: 'Task Due Soon', message: 'Deploy staging environment is due at 3:00 PM', isRead: false, type: 'upcoming', createdAt: subHours(today, 3).toISOString() },
  { id: 'notif_4', userId: 'user_1', taskId: 'task_3', title: 'Upcoming Task', message: 'Study TypeScript generics is due tomorrow at 2:00 PM', isRead: true, type: 'upcoming', createdAt: subHours(today, 6).toISOString() },
  { id: 'notif_5', userId: 'user_1', title: 'Welcome to Todo-Calender!', message: 'Your account is set up. Start creating tasks to boost your productivity!', isRead: true, type: 'system', createdAt: subDays(today, 7).toISOString() },
];

// ─── Mock Dashboard Stats ─────────────────────────────────────────────────────
export const MOCK_DASHBOARD_STATS: DashboardStats = {
  totalTasks: MOCK_TASKS.length,
  completedTasks: MOCK_TASKS.filter(t => t.isCompleted).length,
  pendingTasks: MOCK_TASKS.filter(t => t.status === 'pending').length,
  inProgressTasks: MOCK_TASKS.filter(t => t.status === 'in_progress').length,
  completionPercentage: Math.round((MOCK_TASKS.filter(t => t.isCompleted).length / MOCK_TASKS.length) * 100),
  tasksDueToday: MOCK_TASKS.filter(t => t.dueDate === format(today, 'yyyy-MM-dd') && !t.isCompleted).length,
  overdueTasksCount: MOCK_TASKS.filter(t => t.dueDate < format(today, 'yyyy-MM-dd') && !t.isCompleted).length,
  upcomingTasks: MOCK_TASKS.filter(t => !t.isCompleted).slice(0, 5),
  recentActivity: MOCK_ACTIVITY_LOGS.slice(0, 5),
};

// ─── Mock Weekly Chart Data ───────────────────────────────────────────────────
export const MOCK_WEEKLY_CHART: WeeklyChartData[] = [
  { day: 'Mon', completed: 3, created: 4 },
  { day: 'Tue', completed: 5, created: 3 },
  { day: 'Wed', completed: 2, created: 6 },
  { day: 'Thu', completed: 7, created: 5 },
  { day: 'Fri', completed: 4, created: 4 },
  { day: 'Sat', completed: 6, created: 2 },
  { day: 'Sun', completed: 3, created: 1 },
];

// ─── Mock Monthly Chart Data ──────────────────────────────────────────────────
export const MOCK_MONTHLY_CHART: MonthlyChartData[] = [
  { week: 'Week 1', completed: 18, total: 24 },
  { week: 'Week 2', completed: 22, total: 28 },
  { week: 'Week 3', completed: 15, total: 20 },
  { week: 'Week 4', completed: 25, total: 30 },
];

// ─── Mock Category Chart Data ─────────────────────────────────────────────────
export const MOCK_CATEGORY_CHART: CategoryChartData[] = [
  { name: 'Work',     value: 12, color: '#f59e0b' },
  { name: 'Study',    value: 8,  color: '#6366f1' },
  { name: 'Personal', value: 6,  color: '#10b981' },
  { name: 'Fitness',  value: 4,  color: '#ef4444' },
  { name: 'Other',    value: 3,  color: '#8b5cf6' },
];
