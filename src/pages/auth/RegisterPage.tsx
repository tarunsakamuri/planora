import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Zap, Mail, Lock, User, CheckCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { useTheme } from '../../context/ThemeContext';
import { Sun, Moon } from 'lucide-react';

export const RegisterPage: React.FC = () => {
  const { register } = useAuth();
  const { toggleTheme, isDark } = useTheme();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (field: keyof typeof formData) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      await register(formData);
      navigate('/dashboard');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  const passwordStrength = (): { level: number; label: string; color: string } => {
    const p = formData.password;
    if (!p) return { level: 0, label: '', color: '' };
    if (p.length < 6) return { level: 1, label: 'Weak', color: 'bg-red-500' };
    if (p.length < 10) return { level: 2, label: 'Fair', color: 'bg-amber-500' };
    if (p.length >= 10 && /[A-Z]/.test(p) && /[0-9]/.test(p)) return { level: 4, label: 'Strong', color: 'bg-emerald-500' };
    return { level: 3, label: 'Good', color: 'bg-blue-500' };
  };

  const { level, label, color } = passwordStrength();

  const features = [
    'Unlimited tasks & categories',
    'Smart calendar & scheduling',
    'Analytics & productivity insights',
    'Due date reminders & notifications',
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-purple-50/20 dark:from-slate-950 dark:via-indigo-950/30 dark:to-slate-950 flex flex-col">
      {/* Top Bar */}
      <div className="flex items-center justify-between p-4 sm:p-6">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
            <Zap className="h-4 w-4 text-white" />
          </div>
          <span className="font-bold text-slate-900 dark:text-white">Todo-Calender</span>
        </div>
        <button onClick={toggleTheme} className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 dark:text-slate-400">
          {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </button>
      </div>

      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-700 p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-indigo-200 dark:shadow-indigo-900/40">
                <Zap className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Create your account</h1>
              <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm">Start managing tasks like a pro</p>
            </div>

            {/* Features list */}
            <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl p-4 mb-6 space-y-2">
              {features.map(f => (
                <div key={f} className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-indigo-500 flex-shrink-0" />
                  <span className="text-xs text-indigo-700 dark:text-indigo-300">{f}</span>
                </div>
              ))}
            </div>

            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/40 rounded-xl p-3 mb-4">
                <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <Input
                label="Full Name"
                type="text"
                placeholder="John Doe"
                value={formData.name}
                onChange={handleChange('name')}
                leftIcon={<User className="h-4 w-4" />}
                required
              />
              <Input
                label="Email Address"
                type="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange('email')}
                leftIcon={<Mail className="h-4 w-4" />}
                required
              />

              <div>
                <Input
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Min. 8 characters"
                  value={formData.password}
                  onChange={handleChange('password')}
                  leftIcon={<Lock className="h-4 w-4" />}
                  rightIcon={
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="cursor-pointer hover:text-slate-600">
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  }
                  required
                />
                {formData.password && (
                  <div className="mt-2">
                    <div className="flex gap-1">
                      {[1, 2, 3, 4].map(i => (
                        <div key={i} className={`h-1 flex-1 rounded-full transition-colors ${i <= level ? color : 'bg-slate-200 dark:bg-slate-700'}`} />
                      ))}
                    </div>
                    <p className="text-xs text-slate-500 mt-1">Password strength: <span className="font-medium">{label}</span></p>
                  </div>
                )}
              </div>

              <Input
                label="Confirm Password"
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Re-enter your password"
                value={formData.confirmPassword}
                onChange={handleChange('confirmPassword')}
                leftIcon={<Lock className="h-4 w-4" />}
                rightIcon={
                  <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="cursor-pointer hover:text-slate-600">
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                }
                required
              />

              <p className="text-xs text-slate-500 dark:text-slate-400">
                By creating an account, you agree to our{' '}
                <button type="button" className="text-indigo-600 hover:underline">Terms of Service</button>
                {' '}and{' '}
                <button type="button" className="text-indigo-600 hover:underline">Privacy Policy</button>
              </p>

              <Button type="submit" isLoading={isLoading} size="lg" className="w-full">
                Create Free Account
              </Button>
            </form>

            <p className="text-center text-sm text-slate-600 dark:text-slate-400 mt-6">
              Already have an account?{' '}
              <Link to="/login" className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline">
                Sign in →
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
