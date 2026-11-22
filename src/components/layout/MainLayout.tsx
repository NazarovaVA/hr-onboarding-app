import React, { useState, useEffect, useContext } from 'react';
import { Outlet } from 'react-router-dom';
import { SideBar } from './SideBar';
import { AuthContext } from '../../context/authContextInstance';
import { notificationsApi } from '../../api/notificationsApi';

export const MainLayout: React.FC = () => {
  const auth = useContext(AuthContext);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    let isMounted = true;

    const loadUnreadCount = async () => {
      if (auth?.user?.role !== 'employee') return;
      try {
        const list = await notificationsApi.getAll();
        if (isMounted) {
          setUnreadCount(list.filter((n) => !n.isRead).length);
        }
      } catch {
        // Игнорируем фоновую ошибку
      }
    };

    void loadUnreadCount();
    window.addEventListener('notifications:updated', loadUnreadCount);

    // Фоновый опрос 1С каждые 30 секунд
    const intervalId = setInterval(() => {
      void loadUnreadCount();
    }, 30000);

    return () => {
      isMounted = false;
      clearInterval(intervalId);
      window.removeEventListener('notifications:updated', loadUnreadCount);
    };
  }, [auth?.user?.role]);


  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <SideBar unreadCount={unreadCount} />
      <main style={{ flex: 1, padding: '32px', maxWidth: '1100px' }}>
        <Outlet />
      </main>
    </div>
  );
};
