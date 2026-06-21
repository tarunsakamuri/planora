import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { PageLoader } from '../ui/LoadingSpinner';

export const ProtectedRoute: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) return <PageLoader message="Authenticating..." />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  return <Outlet />;
};

export const PublicRoute: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) return <PageLoader message="Loading..." />;
  if (isAuthenticated) return <Navigate to="/dashboard" replace />;

  return <Outlet />;
};
