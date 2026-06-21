import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CheckSquare, Clock, TrendingUp, AlertCircle, Target, Flame,
  Plus, ArrowRight, Calendar, BarChart2
} from 'lucide-react';
import { format, subDays, eachDayOfInterval } from 'date-fns';
import { useTasks } from '../context/TaskContext';
import { useAuth } from '../context/AuthContext';
import { StatCard } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { TaskCard } from '../components/tasks/TaskCard';
import { EmptyState } from '../components/ui/EmptyState';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { Modal } from '../components/ui/Modal';
import { TaskForm } from '../components/tasks/TaskForm';
import { isOverdue, isDueToday, formatRelativeTime } from '../lib/utils';
import { Task } from '../types';
import { PRIORITY_CONFIG, CHART_COLORS } from '../lib/constants';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';

export const DashboardPage: React.FC = () => {
  const { tasks, categories, isLoading, activityLogs } = useTasks();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showCreateModal, setShowCreateModal] = React.useState(false);
  const [editTask, setEditTask] = React.useState<Task | null>(null);

  const stats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter(t => t.isCompleted).length;
    const pending = tasks.filter(t => t.status === 'pending').length;
    const inProgress = tasks.filter(t => t.status === 'in_progress').length;
    const dueToday = tasks.filter(t => isDueToday(t) && !t.isCompleted).length;
    const overdue = tasks.filter(t => isOverdue(t)).length;
    const completionPct = total > 0 ? Math.round((completed / total) * 100) : 0;
    return { total, completed, pending, inProgress, dueToday, overdue, completionPct };
  }, [tasks]);

  const upcomingTasks = useMemo(() => {
    return tasks
      .filter(t => !t.isCompleted)
      .sort((a, b) => a.dueDate.localeCompare(b.dueDate))
      .slice(0, 5);
  }, [tasks]);

  const overdueTasks = useMemo(() => tasks.filter(t => isOverdue(t)), [tasks]);

  const todayTasks = useMemo(() => {
    const today = format(new Date(), 'yyyy-MM-dd');
    return tasks.filter(t => t.dueDate === today);
  }, [tasks]);

  const weeklyChartData = useMemo(() => {
    const days = eachDayOfInterval({ start: subDays(new Date(), 6), end: new Date() });
    return days.map(day => {
      const dayKey = format(day, 'yyyy-MM-dd');
      const created = tasks.filter(t => format(new Date(t.createdAt), 'yyyy-MM-dd') === dayKey).length;
      const completed = tasks.filter(
        t => t.completedAt && format(new Date(t.completedAt), 'yyyy-MM-dd') === dayKey
      ).length;
      return { day: format(day, 'EEE'), created, completed };
    });
  }, [tasks]);

  const categoryDistribution = useMemo(() => {
    const counts = tasks.reduce<Record<string, number>>((acc, task) => {
      acc[task.categoryId] = (acc[task.categoryId] || 0) + 1;
      return acc;
    }, {});

    return categories
      .map((category, index) => ({
        name: category.name,
        value: counts[category.id] || 0,
        color: category.color || CHART_COLORS[index % CHART_COLORS.length],
      }))
      .filter(item => item.value > 0);
  }, [categories, tasks]);

  const greeting = useMemo(() => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 18) return 'Good afternoon';
    return 'Good evening';
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <LoadingSpinner size="lg" message="Loading your dashboard..." />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-700 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-32 translate-x-16" />
        <div className="absolute bottom-0 right-16 w-32 h-32 bg-white/5 rounded-full translate-y-16" />
        <div className="relative">
          <p className="text-indigo-200 text-sm font-medium">{greeting},</p>
          <h1 className="text-2xl sm:text-3xl font-bold mt-1">{user?.name} 👋</h1>
          <p className="text-indigo-200 mt-2 text-sm">
            {stats.dueToday > 0
              ? `You have ${stats.dueToday} task${stats.dueToday > 1 ? 's' : ''} due today and ${stats.overdue} overdue.`
              : `You're all caught up! ${stats.completionPct}% of your tasks are completed.`
            }
          </p>
          <div className="flex gap-3 mt-5">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowCreateModal(true)}
              leftIcon={<Plus className="h-4 w-4" />}
              className="bg-white/10 border-white/30 text-white hover:bg-white/20 backdrop-blur"
            >
              New Task
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/calendar')}
              leftIcon={<Calendar className="h-4 w-4" />}
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              View Calendar
            </Button>
          </div>
        </div>

        {/* Completion Ring */}
        <div className="absolute top-6 right-6 sm:right-8 hidden sm:flex flex-col items-center">
          <div className="relative h-20 w-20">
            <svg className="w-20 h-20 -rotate-90" viewBox="0 0 80 80">
              <circle cx="40" cy="40" r="32" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="6" />
              <circle
                cx="40" cy="40" r="32" fill="none"
                stroke="white" strokeWidth="6"
                strokeDasharray={`${2 * Math.PI * 32}`}
                strokeDashoffset={`${2 * Math.PI * 32 * (1 - stats.completionPct / 100)}`}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-lg font-bold text-white">{stats.completionPct}%</span>
              <span className="text-[10px] text-indigo-200">done</span>
            </div>
          </div>
          <p className="text-xs text-indigo-200 mt-1">Completion</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Tasks" value={stats.total} icon={<CheckSquare className="h-6 w-6" />}
          color="indigo" subtitle={`${stats.inProgress} in progress`}
        />
        <StatCard
          title="Completed" value={stats.completed} icon={<TrendingUp className="h-6 w-6" />}
          color="emerald" subtitle={`${stats.completionPct}% completion rate`}
        />
        <StatCard
          title="Due Today" value={stats.dueToday} icon={<Clock className="h-6 w-6" />}
          color="amber" subtitle={`${todayTasks.filter(t => t.isCompleted).length} done today`}
        />
        <StatCard
          title="Overdue" value={stats.overdue} icon={<AlertCircle className="h-6 w-6" />}
          color="red" subtitle={stats.overdue > 0 ? 'Needs attention' : 'All on track!'}
        />
      </div>

      {/* Charts + Tasks Row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Weekly Chart */}
        <div className="xl:col-span-2 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-white">Weekly Overview</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Tasks created vs completed</p>
            </div>
            <BarChart2 className="h-5 w-5 text-slate-400" />
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={weeklyChartData} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" className="dark:opacity-20" />
              <XAxis dataKey="day" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
              />
              <Bar dataKey="created" name="Created" fill="#e0e7ff" radius={[4, 4, 0, 0]} />
              <Bar dataKey="completed" name="Completed" fill="#6366f1" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Category Distribution */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-white">By Category</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Task distribution</p>
            </div>
          </div>
          <div className="flex justify-center mb-4">
            <PieChart width={160} height={160}>
              <Pie data={categoryDistribution} cx={80} cy={80} innerRadius={50} outerRadius={75} paddingAngle={3} dataKey="value">
                {categoryDistribution.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </div>
          <div className="space-y-2">
            {categoryDistribution.length === 0 ? (
              <div className="text-sm text-slate-500 dark:text-slate-400 text-center">No tasks assigned to categories yet.</div>
            ) : (
              categoryDistribution.map(item => (
                <div key={item.name} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-sm flex-shrink-0" style={{ backgroundColor: item.color }} />
                    <span className="text-slate-600 dark:text-slate-400">{item.name}</span>
                  </div>
                  <span className="font-semibold text-slate-700 dark:text-slate-300">{item.value}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Upcoming + Overdue Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Tasks */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
              <Target className="h-4 w-4 text-indigo-500" /> Upcoming Tasks
            </h3>
            <button onClick={() => navigate('/tasks')} className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1">
              View all <ArrowRight className="h-3 w-3" />
            </button>
          </div>
          {upcomingTasks.length === 0 ? (
            <EmptyState icon="🎉" title="All clear!" description="No upcoming tasks. Enjoy your free time!" />
          ) : (
            <div className="space-y-2">
              {upcomingTasks.map(task => (
                <TaskCard key={task.id} task={task} onEdit={setEditTask} view="compact" />
              ))}
            </div>
          )}
        </div>

        {/* Overdue + Activity */}
        <div className="space-y-6">
          {/* Overdue */}
          {overdueTasks.length > 0 && (
            <div className="bg-red-50 dark:bg-red-900/10 rounded-2xl border border-red-100 dark:border-red-900/30 p-5">
              <h3 className="font-semibold text-red-700 dark:text-red-400 flex items-center gap-2 mb-3">
                <AlertCircle className="h-4 w-4" /> Overdue ({overdueTasks.length})
              </h3>
              <div className="space-y-2">
                {overdueTasks.slice(0, 3).map(task => (
                  <TaskCard key={task.id} task={task} onEdit={setEditTask} view="compact" />
                ))}
                {overdueTasks.length > 3 && (
                  <button onClick={() => navigate('/tasks')} className="text-sm text-red-600 hover:underline">
                    +{overdueTasks.length - 3} more overdue tasks
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Recent Activity */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 p-5">
            <h3 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2 mb-4">
              <Flame className="h-4 w-4 text-amber-500" /> Recent Activity
            </h3>
            <div className="space-y-3">
              {activityLogs.slice(0, 5).map(log => {
                const actionIcon: Record<string, string> = {
                  created: '✅', updated: '✏️', deleted: '🗑️', completed: '🎉', reopened: '🔄'
                };
                return (
                  <div key={log.id} className="flex items-start gap-3">
                    <span className="text-base flex-shrink-0">{actionIcon[log.action]}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-slate-700 dark:text-slate-300">
                        <span className="font-medium capitalize">{log.action}</span>
                        {' '}
                        <span className="text-indigo-600 dark:text-indigo-400 truncate">{log.taskTitle}</span>
                      </p>
                      <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">{formatRelativeTime(log.createdAt)}</p>
                    </div>
                  </div>
                );
              })}
            </div>
            <button onClick={() => navigate('/activity')} className="mt-4 text-xs text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1">
              View full activity log <ArrowRight className="h-3 w-3" />
            </button>
          </div>
        </div>
      </div>

      {/* Quick Priority Summary */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 p-6">
        <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Priority Breakdown</h3>
        <div className="grid grid-cols-3 gap-4">
          {(['high', 'medium', 'low'] as const).map(priority => {
            const count = tasks.filter(t => t.priority === priority && !t.isCompleted).length;
            const cfg = PRIORITY_CONFIG[priority];
            return (
              <div key={priority} className={`rounded-xl p-4 ${cfg.bg} ${cfg.dark}`}>
                <p className={`text-2xl font-bold ${cfg.text}`}>{count}</p>
                <p className={`text-sm font-medium ${cfg.text} capitalize`}>{cfg.label}</p>
                <p className={`text-xs mt-1 ${cfg.text} opacity-70`}>priority tasks</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modals */}
      <Modal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} title="Create New Task" size="lg">
        <TaskForm onSuccess={() => setShowCreateModal(false)} onCancel={() => setShowCreateModal(false)} />
      </Modal>
      <Modal isOpen={!!editTask} onClose={() => setEditTask(null)} title="Edit Task" size="lg">
        {editTask && <TaskForm task={editTask} onSuccess={() => setEditTask(null)} onCancel={() => setEditTask(null)} />}
      </Modal>
    </div>
  );
};
