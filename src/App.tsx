import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/routing/ProtectedRoute';
import { MainLayout } from './components/layout/MainLayout/MainLayout';

import { WelcomePage } from './pages/WelcomePage/WelcomePage';
import { LoginPage } from './pages/LoginPage/LoginPage';
import { MyRequestsPage } from './pages/employee/MyRequestsPage';
import { CreateRequestPage } from './pages/employee/CreateRequestPage';
import { RequestDetailsPage } from './pages/employee/RequestDetailsPage';
import { HistoryPage } from './pages/employee/HistoryPage';
import { NotificationsPage } from './pages/employee/NotificationsPage';
import { EmployerRequestsPage } from './pages/employer/EmployerRequestsPage/EmployerRequestsPage';
import { ApprovalPage } from './pages/employer/ApprovalPage/ApprovalPage';

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <HashRouter>
        <Routes>
          <Route path="/" element={<WelcomePage />} />
          <Route path="/login" element={<LoginPage />} />

          {/* Кабинет работника */}
          <Route element={<ProtectedRoute allowedRole="employee" />}>
            <Route element={<MainLayout />}>
              <Route path="/my-requests" element={<MyRequestsPage />} />
              <Route path="/my-requests/new" element={<CreateRequestPage />} />
              <Route path="/my-requests/:id" element={<RequestDetailsPage />} />
              <Route path="/history" element={<HistoryPage />} />
              <Route path="/notifications" element={<NotificationsPage />} />
            </Route>
          </Route>

          {/* Кабинет работодателя */}
          <Route element={<ProtectedRoute allowedRole="employer" />}>
            <Route element={<MainLayout />}>
              <Route path="/employer/vacations" element={<EmployerRequestsPage key="vacation" type="vacation" />} />
              <Route path="/employer/trips" element={<EmployerRequestsPage key="trip" type="trip" />} />
              <Route path="/employer/requests/:id" element={<ApprovalPage />} />
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </HashRouter>
    </AuthProvider>
  );
};
