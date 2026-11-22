import React, { useState, useEffect } from 'react';
import type { User, LoginRequest, AuthResponse } from '../types/api';
import { MOCK_USERS } from '../mocks/mockData';
import { AuthContext } from './authContextInstance';
import { apiClient, USE_MOCKS } from '../api/client';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('mockUserRole');
    setUser(null);
  };

  // Восстановление сессии при обновлении страницы (F5)
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        if (USE_MOCKS) {
          const savedRole = localStorage.getItem('mockUserRole') as 'employee' | 'employer';
          setUser(MOCK_USERS[savedRole] || MOCK_USERS.employee);
        } else {
          const { data } = await apiClient.get<User>('/auth/me');
          setUser(data);
        }
      } catch {
        logout();
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();

    // Подписка на принудительный разлогин из интерсептора Axios
    window.addEventListener('auth:logout', logout);
    return () => window.removeEventListener('auth:logout', logout);
  }, []);

  const login = async (credentials: LoginRequest): Promise<User> => {
    if (USE_MOCKS) {
      // Имитация задержки сети 400мс
      await new Promise((res) => setTimeout(res, 400));

      const matchedUser = Object.values(MOCK_USERS).find(
        (u) => u.email.toLowerCase() === credentials.email.toLowerCase()
      );

      if (!matchedUser) {
        throw new Error('Пользователь с таким email не найден (попробуйте ivanov@company.ru или petrov@company.ru)');
      }
      if (!matchedUser || credentials.password !== '12345') {
        throw new Error('Неверный email или пароль');
      }

      localStorage.setItem('accessToken', 'mock-access-token');
      localStorage.setItem('refreshToken', 'mock-refresh-token');
      localStorage.setItem('mockUserRole', matchedUser.role);
      setUser(matchedUser);
      return matchedUser;
    }

    

    // Реальный запрос в 1С
    const { data } = await apiClient.post<AuthResponse>('/auth/login', credentials);
    localStorage.setItem('accessToken', data.accessToken);
    localStorage.setItem('refreshToken', data.refreshToken);
    setUser(data.user);
    return data.user;
  };

  return (
    <AuthContext.Provider value={{ user, isAuth: !!user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
