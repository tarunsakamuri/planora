import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { useTheme } from '../../context/ThemeContext';
import { Sun, Moon } from 'lucide-react';
import { storage } from '../../lib/utils';

export const LoginPage: React.FC = () => {
  const location = useLocation();
  const { login } = useAuth();
  const { toggleTheme, isDark } = useTheme();
  const navigate = useNavigate();
  const savedEmail = storage.get<string | null>('Todo-Calender_remember_email', null);
  const registrationEmail = (location.state as { email?: string })?.email;
  const [email, setEmail] = useState<string>(() => registrationEmail || savedEmail || 'admin@gmail.com');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState<boolean>(() => Boolean(savedEmail));
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState<string | null>(() => registrationEmail ? 'Account created successfully. Please login below.' : null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      setError('Enter valid email');
      return;
    }

    if (password.trim().length < 8) {
      setError('Enter valid password');
      return;
    }

    setIsLoading(true);
    try {
      await login({ email, password });
      if (rememberMe) {
        storage.set('Todo-Calender_remember_email', email);
      } else {
        storage.remove('Todo-Calender_remember_email');
      }
      navigate('/dashboard');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-purple-50/20 dark:from-slate-950 dark:via-indigo-950/30 dark:to-slate-950 flex flex-col">
      {/* Top Bar */}
      <div className="flex items-center justify-between p-4 sm:p-6">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-cyan-500 via-sky-500 to-indigo-600 flex items-center justify-center shadow-md shadow-cyan-200 dark:shadow-cyan-900/30">
            <svg viewBox="0 0 24 24" className="h-4 w-4 text-white" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="6" />
              <path d="M12 6v4" />
              <path d="M12 14a4 4 0 0 1 4 4" />
            </svg>
          </div>
          <span className="font-bold text-slate-900 dark:text-white">Todo-Calender</span>
        </div>
        <button onClick={toggleTheme} className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 dark:text-slate-400">
          {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          {/* Card */}
          <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-700 p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-rose-500 via-orange-500 to-amber-500 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-rose-200 dark:shadow-rose-900/40">
                <svg viewBox="0 0 24 24" className="h-8 w-8 text-white" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="4" />
                  <path d="M7.5 12a6.5 6.5 0 0 1 13 0" />
                  <path d="M12 6v4" />
                  <path d="M9 16l3-4 3 4" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Welcome back!</h1>
              <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm">Sign in to your Todo-Calender account</p>
            </div>

            {/* Demo Hint */}
            <div className="bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800/40 rounded-2xl p-4 mb-6">
              <p className="text-xs text-indigo-700 dark:text-indigo-300 font-medium mb-1">🎉 Demo credentials pre-filled</p>
              <p className="text-xs text-indigo-600 dark:text-indigo-400">Email:admin@gmail.com • Password:admin@1702</p>
            </div>

            {/* Success */}
            {successMessage && (
              <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800/40 rounded-xl p-3 mb-4">
                <p className="text-sm text-emerald-700 dark:text-emerald-200">{successMessage}</p>
              </div>
            )}

            {/* Error */}
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/40 rounded-xl p-3 mb-4">
                <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              <Input
                label="Email Address"
                type="email"
                placeholder="admin@gmail.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                leftIcon={<Mail className="h-4 w-4" />}
                required
              />
              <Input
                label="Password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                leftIcon={<Lock className="h-4 w-4" />}
                rightIcon={
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="cursor-pointer hover:text-slate-600">
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                }
                required
              />

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={e => setRememberMe(e.target.checked)}
                    className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="text-slate-600 dark:text-slate-400">Remember me</span>
                </label>
                <button type="button" className="text-indigo-600 dark:text-indigo-400 hover:underline font-medium">
                  Forgot password?
                </button>
              </div>

              <Button type="submit" isLoading={isLoading} size="lg" className="w-full">
                Sign In
              </Button>
            </form>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200 dark:border-slate-700" /></div>
              <div className="relative flex justify-center"><span className="bg-white dark:bg-slate-800 px-3 text-xs text-slate-400">OR</span></div>
            </div>

            {/* Register Link */}
            <p className="text-center text-sm text-slate-600 dark:text-slate-400">
              Don't have an account?{' '}
              <Link to="/register" className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline">
                Create one free →
              </Link>
            </p>
          </div>

          {/* Features */}
          <div className="mt-8 grid grid-cols-3 gap-4 text-center">
            {[
              { icon: '📅', label: 'Smart Calendar' },
              { icon: '📊', label: 'Analytics' },
              { icon: '🔔', label: 'Reminders' },
            ].map(f => (
              <div key={f.label} className="bg-white/60 dark:bg-slate-800/60 backdrop-blur rounded-2xl p-3 border border-slate-100 dark:border-slate-700">
                <div className="text-2xl mb-1">{f.icon}</div>
                <p className="text-xs font-medium text-slate-600 dark:text-slate-400">{f.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
