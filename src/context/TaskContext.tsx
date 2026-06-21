import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { Task, CreateTaskInput, UpdateTaskInput, TaskFilters, Category, CreateCategoryInput, ActivityLog, Notification } from '../types';
import { MOCK_USER, MOCK_TASKS, MOCK_CATEGORIES, MOCK_ACTIVITY_LOGS, MOCK_NOTIFICATIONS } from '../lib/mockData';
import { DEFAULT_CATEGORIES } from '../lib/constants';
import { generateId, filterTasks } from '../lib/utils';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import { useAuth } from './AuthContext';

// ─── State ────────────────────────────────────────────────────────────────────
interface TaskState {
  tasks: Task[];
  categories: Category[];
  activityLogs: ActivityLog[];
  notifications: Notification[];
  filters: TaskFilters;
  isLoading: boolean;
}

type TaskAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'LOAD_DATA'; payload: { tasks: Task[]; categories: Category[]; activityLogs: ActivityLog[]; notifications: Notification[] } }
  | { type: 'ADD_TASK'; payload: Task }
  | { type: 'UPDATE_TASK'; payload: { id: string; updates: UpdateTaskInput } }
  | { type: 'DELETE_TASK'; payload: string }
  | { type: 'TOGGLE_TASK'; payload: string }
  | { type: 'ADD_CATEGORY'; payload: Category }
  | { type: 'UPDATE_CATEGORY'; payload: { id: string; updates: Partial<Category> } }
  | { type: 'DELETE_CATEGORY'; payload: string }
  | { type: 'SET_FILTERS'; payload: Partial<TaskFilters> }
  | { type: 'RESET_FILTERS' }
  | { type: 'ADD_LOG'; payload: ActivityLog }
  | { type: 'MARK_NOTIFICATION_READ'; payload: string }
  | { type: 'MARK_ALL_NOTIFICATIONS_READ' }
  | { type: 'ADD_NOTIFICATION'; payload: Notification }
  | { type: 'MOVE_TASK_DATE'; payload: { taskId: string; newDate: string } };

interface TaskContextType extends TaskState {
  filteredTasks: Task[];
  addTask: (input: CreateTaskInput) => void;
  updateTask: (id: string, updates: UpdateTaskInput) => void;
  deleteTask: (id: string) => void;
  toggleTask: (id: string) => void;
  moveTaskDate: (taskId: string, newDate: string) => void;
  addCategory: (input: CreateCategoryInput) => void;
  updateCategory: (id: string, updates: Partial<Category>) => void;
  deleteCategory: (id: string) => void;
  setFilters: (filters: Partial<TaskFilters>) => void;
  resetFilters: () => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  unreadCount: number;
  getTasksByDate: (date: string) => Task[];
}

// ─── Default Filters ──────────────────────────────────────────────────────────
const defaultFilters: TaskFilters = {
  search: '',
  status: 'all',
  priority: 'all',
  categoryId: 'all',
  dateFrom: '',
  dateTo: '',
};

// ─── Initial State ────────────────────────────────────────────────────────────
const initialState: TaskState = {
  tasks: [],
  categories: [],
  activityLogs: [],
  notifications: [],
  filters: defaultFilters,
  isLoading: true,
};

// ─── Reducer ──────────────────────────────────────────────────────────────────
const taskReducer = (state: TaskState, action: TaskAction): TaskState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };

    case 'LOAD_DATA':
      return {
        ...state,
        tasks: action.payload.tasks,
        categories: action.payload.categories,
        activityLogs: action.payload.activityLogs,
        notifications: action.payload.notifications,
        isLoading: false,
      };

    case 'ADD_TASK':
      return { ...state, tasks: [action.payload, ...state.tasks] };

    case 'UPDATE_TASK': {
      const category = state.categories.find(c => c.id === (action.payload.updates.categoryId || ''));
      return {
        ...state,
        tasks: state.tasks.map(t =>
          t.id === action.payload.id
            ? {
                ...t,
                ...action.payload.updates,
                categoryName: category?.name || t.categoryName,
                categoryColor: category?.color || t.categoryColor,
                updatedAt: new Date().toISOString(),
              }
            : t
        ),
      };
    }

    case 'DELETE_TASK':
      return { ...state, tasks: state.tasks.filter(t => t.id !== action.payload) };

    case 'TOGGLE_TASK':
      return {
        ...state,
        tasks: state.tasks.map(t =>
          t.id === action.payload
            ? {
                ...t,
                isCompleted: !t.isCompleted,
                status: !t.isCompleted ? 'completed' : 'pending',
                completedAt: !t.isCompleted ? new Date().toISOString() : undefined,
                updatedAt: new Date().toISOString(),
              }
            : t
        ),
      };

    case 'MOVE_TASK_DATE':
      return {
        ...state,
        tasks: state.tasks.map(t =>
          t.id === action.payload.taskId
            ? { ...t, dueDate: action.payload.newDate, updatedAt: new Date().toISOString() }
            : t
        ),
      };

    case 'ADD_CATEGORY':
      return { ...state, categories: [...state.categories, action.payload] };

    case 'UPDATE_CATEGORY':
      return {
        ...state,
        categories: state.categories.map(c =>
          c.id === action.payload.id ? { ...c, ...action.payload.updates } : c
        ),
      };

    case 'DELETE_CATEGORY':
      return { ...state, categories: state.categories.filter(c => c.id !== action.payload) };

    case 'SET_FILTERS':
      return { ...state, filters: { ...state.filters, ...action.payload } };

    case 'RESET_FILTERS':
      return { ...state, filters: defaultFilters };

    case 'ADD_LOG':
      return { ...state, activityLogs: [action.payload, ...state.activityLogs] };

    case 'MARK_NOTIFICATION_READ':
      return {
        ...state,
        notifications: state.notifications.map(n =>
          n.id === action.payload ? { ...n, isRead: true } : n
        ),
      };

    case 'MARK_ALL_NOTIFICATIONS_READ':
      return {
        ...state,
        notifications: state.notifications.map(n => ({ ...n, isRead: true })),
      };

    case 'ADD_NOTIFICATION':
      return { ...state, notifications: [action.payload, ...state.notifications] };

    default:
      return state;
  }
};

// ─── Context ──────────────────────────────────────────────────────────────────
const TaskContext = createContext<TaskContextType | undefined>(undefined);

// ─── Provider ────────────────────────────────────────────────────────────────
export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [state, dispatch] = useReducer(taskReducer, initialState);

  // Load data on mount / user change
  useEffect(() => {
    if (!user) return;
    const storageKey = `Todo-Calender_data_${user.id}`;
    const saved = localStorage.getItem(storageKey);

    setTimeout(() => {
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          dispatch({ type: 'LOAD_DATA', payload: parsed });
        } catch {
          dispatch({
            type: 'LOAD_DATA',
            payload: user.id === MOCK_USER.id
              ? { tasks: MOCK_TASKS, categories: MOCK_CATEGORIES, activityLogs: MOCK_ACTIVITY_LOGS, notifications: MOCK_NOTIFICATIONS }
              : {
                tasks: [],
                categories: DEFAULT_CATEGORIES.map(category => ({
                  ...category,
                  userId: user.id,
                  createdAt: new Date().toISOString(),
                })),
                activityLogs: [],
                notifications: [],
              },
          });
        }
      } else {
        dispatch({
          type: 'LOAD_DATA',
          payload: user.id === MOCK_USER.id
            ? { tasks: MOCK_TASKS, categories: MOCK_CATEGORIES, activityLogs: MOCK_ACTIVITY_LOGS, notifications: MOCK_NOTIFICATIONS }
            : {
              tasks: [],
              categories: DEFAULT_CATEGORIES.map(category => ({
                ...category,
                userId: user.id,
                createdAt: new Date().toISOString(),
              })),
              activityLogs: [],
              notifications: [],
            },
        });
      }
    }, 500);
  }, [user]);

  // Persist data
  useEffect(() => {
    if (!user || state.isLoading) return;
    const storageKey = `Todo-Calender_data_${user.id}`;
    localStorage.setItem(storageKey, JSON.stringify({
      tasks: state.tasks,
      categories: state.categories,
      activityLogs: state.activityLogs,
      notifications: state.notifications,
    }));
  }, [state.tasks, state.categories, state.activityLogs, state.notifications, user, state.isLoading]);

  // ─── Helpers ────────────────────────────────────────────────────────────────
  const addLog = useCallback((taskId: string, taskTitle: string, action: ActivityLog['action'], details?: string) => {
    const log: ActivityLog = {
      id: generateId('log'),
      userId: user?.id || '',
      taskId,
      taskTitle,
      action,
      details,
      createdAt: new Date().toISOString(),
    };
    dispatch({ type: 'ADD_LOG', payload: log });
  }, [user]);

  // ─── Task Actions ─────────────────────────────────────────────────────────
  const addTask = useCallback((input: CreateTaskInput): void => {
    const category = state.categories.find(c => c.id === input.categoryId);
    const task: Task = {
      id: generateId('task'),
      ...input,
      categoryName: category?.name,
      categoryColor: category?.color,
      isCompleted: false,
      userId: user?.id || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    dispatch({ type: 'ADD_TASK', payload: task });
    addLog(task.id, task.title, 'created', 'New task created');
    toast.success('Task created successfully! ✅');
  }, [state.categories, user, addLog]);

  const updateTask = useCallback((id: string, updates: UpdateTaskInput): void => {
    const task = state.tasks.find(t => t.id === id);
    dispatch({ type: 'UPDATE_TASK', payload: { id, updates } });
    if (task) addLog(id, task.title, 'updated', 'Task updated');
    toast.success('Task updated successfully! 📝');
  }, [state.tasks, addLog]);

  const deleteTask = useCallback((id: string): void => {
    const task = state.tasks.find(t => t.id === id);
    dispatch({ type: 'DELETE_TASK', payload: id });
    if (task) addLog(id, task.title, 'deleted', 'Task deleted');
    toast.success('Task deleted successfully! 🗑️');
  }, [state.tasks, addLog]);

  const toggleTask = useCallback((id: string): void => {
    const task = state.tasks.find(t => t.id === id);
    if (!task) return;
    dispatch({ type: 'TOGGLE_TASK', payload: id });
    const isNowCompleted = !task.isCompleted;
    addLog(id, task.title, isNowCompleted ? 'completed' : 'reopened', isNowCompleted ? 'Task marked as completed' : 'Task reopened');
    toast.success(isNowCompleted ? `"${task.title}" completed! 🎉` : `"${task.title}" reopened`);
  }, [state.tasks, addLog]);

  const moveTaskDate = useCallback((taskId: string, newDate: string): void => {
    const task = state.tasks.find(t => t.id === taskId);
    dispatch({ type: 'MOVE_TASK_DATE', payload: { taskId, newDate } });
    if (task) addLog(taskId, task.title, 'updated', `Due date moved to ${newDate}`);
    toast.success('Task rescheduled! 📅');
  }, [state.tasks, addLog]);

  // ─── Category Actions ──────────────────────────────────────────────────────
  const addCategory = useCallback((input: CreateCategoryInput): void => {
    const category: Category = {
      id: generateId('cat'),
      ...input,
      userId: user?.id || '',
      isDefault: false,
      taskCount: 0,
      createdAt: new Date().toISOString(),
    };
    dispatch({ type: 'ADD_CATEGORY', payload: category });
    toast.success('Category created! 🏷️');
  }, [user]);

  const updateCategory = useCallback((id: string, updates: Partial<Category>): void => {
    dispatch({ type: 'UPDATE_CATEGORY', payload: { id, updates } });
    toast.success('Category updated! ✏️');
  }, []);

  const deleteCategory = useCallback((id: string): void => {
    const category = state.categories.find(c => c.id === id);
    if (category?.isDefault) {
      toast.error('Cannot delete default categories');
      return;
    }
    dispatch({ type: 'DELETE_CATEGORY', payload: id });
    toast.success('Category deleted! 🗑️');
  }, [state.categories]);

  // ─── Filter Actions ────────────────────────────────────────────────────────
  const setFilters = useCallback((filters: Partial<TaskFilters>): void => {
    dispatch({ type: 'SET_FILTERS', payload: filters });
  }, []);

  const resetFilters = useCallback((): void => {
    dispatch({ type: 'RESET_FILTERS' });
  }, []);

  // ─── Notification Actions ──────────────────────────────────────────────────
  const markNotificationRead = useCallback((id: string): void => {
    dispatch({ type: 'MARK_NOTIFICATION_READ', payload: id });
  }, []);

  const markAllNotificationsRead = useCallback((): void => {
    dispatch({ type: 'MARK_ALL_NOTIFICATIONS_READ' });
  }, []);

  // ─── Computed Values ───────────────────────────────────────────────────────
  const filteredTasks = filterTasks(state.tasks, state.filters);
  const unreadCount = state.notifications.filter(n => !n.isRead).length;

  const getTasksByDate = useCallback((date: string): Task[] => {
    return state.tasks.filter(t => t.dueDate === date);
  }, [state.tasks]);

  // ─── Check for overdue tasks on load ──────────────────────────────────────
  useEffect(() => {
    if (state.isLoading) return;
    const today = format(new Date(), 'yyyy-MM-dd');
    const overdueCount = state.tasks.filter(t => !t.isCompleted && t.dueDate < today).length;
    if (overdueCount > 0) {
      const existingOverdueNotif = state.notifications.find(n => n.type === 'overdue' && !n.isRead);
      if (!existingOverdueNotif) {
        const notif: Notification = {
          id: generateId('notif'),
          userId: user?.id || '',
          title: 'Overdue Tasks',
          message: `You have ${overdueCount} overdue task${overdueCount > 1 ? 's' : ''}. Please review and update them.`,
          isRead: false,
          type: 'overdue',
          createdAt: new Date().toISOString(),
        };
        dispatch({ type: 'ADD_NOTIFICATION', payload: notif });
      }
    }
  }, [state.isLoading]);

  return (
    <TaskContext.Provider
      value={{
        ...state,
        filteredTasks,
        addTask,
        updateTask,
        deleteTask,
        toggleTask,
        moveTaskDate,
        addCategory,
        updateCategory,
        deleteCategory,
        setFilters,
        resetFilters,
        markNotificationRead,
        markAllNotificationsRead,
        unreadCount,
        getTasksByDate,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

// ─── Hook ─────────────────────────────────────────────────────────────────────
export const useTasks = (): TaskContextType => {
  const context = useContext(TaskContext);
  if (!context) throw new Error('useTasks must be used within TaskProvider');
  return context;
};
