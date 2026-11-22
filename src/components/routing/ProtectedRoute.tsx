import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../../context/authContextInstance';
import type { UserRole } from '../../types/api';

interface ProtectedRouteProps {
  allowedRole?: UserRole;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRole }) => {
  const auth = useContext(AuthContext);

  if (!auth || auth.isLoading) {
    return <div style={{ padding: '40px' }}>Загрузка сессии...</div>;
  }

  if (!auth.isAuth || !auth.user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRole && auth.user.role !== allowedRole) {
    const defaultPath = auth.user.role === 'employer' ? '/employer/vacations' : '/my-requests';
    return <Navigate to={defaultPath} replace />;
  }

  return <Outlet />;
};
