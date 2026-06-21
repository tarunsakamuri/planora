
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// ─── Providers ────────────────────────────────────────────────────────────────
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { TaskProvider } from './context/TaskContext';

// ─── Routing ─────────────────────────────────────────────────────────────────
import { ProtectedRoute, PublicRoute } from './components/routing/ProtectedRoute';

// ─── Layout ───────────────────────────────────────────────────────────────────
import { AppLayout } from './components/layout/AppLayout';

// ─── Auth Pages ───────────────────────────────────────────────────────────────
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';

// ─── App Pages ────────────────────────────────────────────────────────────────
import { DashboardPage } from './pages/DashboardPage';
import { TasksPage } from './pages/TasksPage';
import { CalendarPage } from './pages/CalendarPage';
import { CategoriesPage } from './pages/CategoriesPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { ActivityPage } from './pages/ActivityPage';
import { ProfilePage } from './pages/ProfilePage';

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                borderRadius: '12px',
                padding: '12px 16px',
                fontSize: '14px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
              },
              success: {
                iconTheme: { primary: '#10b981', secondary: '#fff' },
              },
              error: {
                iconTheme: { primary: '#ef4444', secondary: '#fff' },
              },
            }}
          />

          <Routes>
            {/* ─── Public Routes ─────────────────────────────────────── */}
            <Route element={<PublicRoute />}>
              <Route path="/login"    element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
            </Route>

            {/* ─── Protected Routes ──────────────────────────────────── */}
            <Route element={<ProtectedRoute />}>
              <Route element={
                <TaskProvider>
                  <AppLayout />
                </TaskProvider>
              }>
                <Route index element={<Navigate to="/dashboard" replace />} />
                <Route path="/dashboard"  element={<DashboardPage />} />
                <Route path="/tasks"      element={<TasksPage />} />
                <Route path="/calendar"   element={<CalendarPage />} />
                <Route path="/categories" element={<CategoriesPage />} />
                <Route path="/analytics"  element={<AnalyticsPage />} />
                <Route path="/activity"   element={<ActivityPage />} />
                <Route path="/profile"    element={<ProfilePage />} />
              </Route>
            </Route>

            {/* ─── Catch All ─────────────────────────────────────────── */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}
