import React, { useState, useEffect } from 'react';
import { User, Mail, Camera, Lock, Save, Shield, LogOut, Trash2, Bell } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTasks } from '../context/TaskContext';
import { useTheme } from '../context/ThemeContext';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { getInitials, formatDate } from '../lib/utils';
import toast from 'react-hot-toast';

export const ProfilePage: React.FC = () => {
  const { user, updateUser, changePassword, logout } = useAuth();
  const { tasks } = useTasks();
  const { theme, toggleTheme } = useTheme();

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [profileData, setProfileData] = useState({ name: user?.name || '', email: user?.email || '' });
  const [passwordData, setPasswordData] = useState({ current: '', newPass: '', confirm: '' });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setProfileData({ name: user?.name || '', email: user?.email || '' });
  }, [user]);
  const [passwordError, setPasswordError] = useState('');

  // Stats
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.isCompleted).length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profileData.name.trim()) { toast.error('Name is required'); return; }
    setIsSaving(true);
    await new Promise(r => setTimeout(r, 600));
    updateUser({ name: profileData.name.trim(), email: profileData.email.trim() });
    toast.success('Profile updated successfully! ✅');
    setIsEditingProfile(false);
    setIsSaving(false);
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    if (passwordData.newPass.length < 8) { setPasswordError('New password must be at least 8 characters'); return; }
    if (passwordData.newPass !== passwordData.confirm) { setPasswordError('Passwords do not match'); return; }
    setIsSaving(true);
    try {
      await changePassword(passwordData.current, passwordData.newPass);
      setPasswordData({ current: '', newPass: '', confirm: '' });
      setIsChangingPassword(false);
    } catch (err: unknown) {
      setPasswordError(err instanceof Error ? err.message : 'Failed to change password');
    } finally {
      setIsSaving(false);
    }
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) { toast.error('Image must be less than 2MB'); return; }
    const reader = new FileReader();
    reader.onload = () => {
      updateUser({ avatar: reader.result as string });
      toast.success('Profile picture updated!');
    };
    reader.readAsDataURL(file);
  };

  const [notifSettings, setNotifSettings] = useState({
    emailNotifs: true,
    browserNotifs: true,
    dueDateReminders: true,
    weeklyDigest: false,
  });

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <User className="h-7 w-7 text-indigo-500" />
          Profile Settings
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Manage your account and preferences</p>
      </div>

      {/* Profile Card */}
      <Card>
        <div className="flex flex-col sm:flex-row items-start gap-6">
          {/* Avatar */}
          <div className="relative flex-shrink-0">
            <div className="h-24 w-24 rounded-2xl overflow-hidden bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
              {user?.avatar ? (
                <img src={user.avatar} alt="Profile" className="h-full w-full object-cover" />
              ) : (
                <span className="text-3xl font-bold text-white">{getInitials(user?.name || 'U')}</span>
              )}
            </div>
            <label className="absolute -bottom-2 -right-2 h-8 w-8 bg-indigo-600 rounded-xl flex items-center justify-center cursor-pointer hover:bg-indigo-700 transition-colors shadow-md">
              <Camera className="h-4 w-4 text-white" />
              <input type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
            </label>
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">{user?.name}</h2>
            <p className="text-slate-500 dark:text-slate-400 mt-0.5">{user?.email}</p>
            <p className="text-xs text-slate-400 mt-1">Member since {user?.createdAt ? formatDate(user.createdAt) : 'N/A'}</p>

            {/* Quick Stats */}
            <div className="flex gap-6 mt-4">
              <div>
                <p className="text-xl font-bold text-indigo-600">{totalTasks}</p>
                <p className="text-xs text-slate-500">Total Tasks</p>
              </div>
              <div>
                <p className="text-xl font-bold text-emerald-600">{completedTasks}</p>
                <p className="text-xs text-slate-500">Completed</p>
              </div>
              <div>
                <p className="text-xl font-bold text-amber-600">{completionRate}%</p>
                <p className="text-xs text-slate-500">Rate</p>
              </div>
            </div>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsEditingProfile(!isEditingProfile)}
          >
            {isEditingProfile ? 'Cancel' : 'Edit Profile'}
          </Button>
        </div>

        {/* Edit Profile Form */}
        {isEditingProfile && (
          <form onSubmit={handleSaveProfile} className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-700 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Full Name"
                value={profileData.name}
                onChange={e => setProfileData(p => ({ ...p, name: e.target.value }))}
                leftIcon={<User className="h-4 w-4" />}
              />
              <Input
                label="Email Address"
                type="email"
                value={profileData.email}
                onChange={e => setProfileData(p => ({ ...p, email: e.target.value }))}
                leftIcon={<Mail className="h-4 w-4" />}
              />
            </div>
            <Button type="submit" isLoading={isSaving} leftIcon={<Save className="h-4 w-4" />}>
              Save Changes
            </Button>
          </form>
        )}
      </Card>

      {/* Password Card */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
              <Lock className="h-5 w-5 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-800 dark:text-slate-200">Password & Security</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Keep your account secure</p>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={() => setIsChangingPassword(!isChangingPassword)}>
            {isChangingPassword ? 'Cancel' : 'Change Password'}
          </Button>
        </div>

        {isChangingPassword && (
          <form onSubmit={handleChangePassword} className="space-y-4">
            <Input
              label="Current Password"
              type="password"
              placeholder="Enter current password"
              value={passwordData.current}
              onChange={e => setPasswordData(p => ({ ...p, current: e.target.value }))}
            />
            <Input
              label="New Password"
              type="password"
              placeholder="Min. 8 characters"
              value={passwordData.newPass}
              onChange={e => setPasswordData(p => ({ ...p, newPass: e.target.value }))}
            />
            <Input
              label="Confirm New Password"
              type="password"
              placeholder="Re-enter new password"
              value={passwordData.confirm}
              onChange={e => setPasswordData(p => ({ ...p, confirm: e.target.value }))}
              error={passwordError}
            />
            <Button type="submit" isLoading={isSaving} leftIcon={<Shield className="h-4 w-4" />}>
              Update Password
            </Button>
          </form>
        )}
      </Card>

      {/* Notifications Card */}
      <Card>
        <div className="flex items-center gap-3 mb-4">
          <div className="h-10 w-10 rounded-xl bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
            <Bell className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-800 dark:text-slate-200">Notifications</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Manage your notification preferences</p>
          </div>
        </div>
        <div className="space-y-4">
          {[
            { key: 'emailNotifs',      label: 'Email Notifications',   desc: 'Receive task updates via email' },
            { key: 'browserNotifs',    label: 'Browser Notifications', desc: 'Get desktop push notifications' },
            { key: 'dueDateReminders', label: 'Due Date Reminders',    desc: 'Alert before task deadlines' },
            { key: 'weeklyDigest',     label: 'Weekly Digest',         desc: 'Summary email every Monday' },
          ].map(setting => (
            <div key={setting.key} className="flex items-center justify-between py-2">
              <div>
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300">{setting.label}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">{setting.desc}</p>
              </div>
              <button
                onClick={() => setNotifSettings(p => ({ ...p, [setting.key]: !p[setting.key as keyof typeof p] }))}
                className={`relative h-6 w-11 rounded-full transition-colors ${notifSettings[setting.key as keyof typeof notifSettings] ? 'bg-indigo-600' : 'bg-slate-200 dark:bg-slate-700'}`}
              >
                <div className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow-sm transition-transform ${notifSettings[setting.key as keyof typeof notifSettings] ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
            </div>
          ))}
        </div>
      </Card>

      {/* Appearance Card */}
      <Card>
        <h3 className="font-semibold text-slate-800 dark:text-slate-200 mb-4">Appearance</h3>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-700 dark:text-slate-300">Dark Mode</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">Toggle between light and dark theme</p>
          </div>
          <button
            onClick={toggleTheme}
            className={`relative h-6 w-11 rounded-full transition-colors ${theme === 'dark' ? 'bg-indigo-600' : 'bg-slate-200 dark:bg-slate-700'}`}
          >
            <div className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow-sm transition-transform ${theme === 'dark' ? 'translate-x-6' : 'translate-x-1'}`} />
          </button>
        </div>
      </Card>

      {/* Danger Zone */}
      <Card className="border-red-100 dark:border-red-900/40">
        <h3 className="font-semibold text-red-600 dark:text-red-400 mb-4 flex items-center gap-2">
          <Trash2 className="h-5 w-5" />
          Danger Zone
        </h3>
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            variant="danger"
            size="sm"
            leftIcon={<LogOut className="h-4 w-4" />}
            onClick={logout}
          >
            Sign Out
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
            onClick={() => toast.error('Account deletion is not available in demo mode')}
          >
            Delete Account
          </Button>
        </div>
      </Card>
    </div>
  );
};
