import { useState, useEffect, useContext } from 'react';
// Outlet — компонент из react-router-dom, в который подставляется текущая активная страница
import { Outlet } from 'react-router-dom';
import { SideBar } from '../SideBar/SideBar';
import { AuthContext } from '../../../context/authContextInstance';
import { notificationsApi } from '../../../api/notificationsApi';
import styles from './MainLayout.module.css';

export const MainLayout = () => {
  const auth = useContext(AuthContext); // Получаем данные текущего пользователя (в том числе его роль)
  const [unreadCount, setUnreadCount] = useState(0); // Счетчик непрочитанных уведомлений для бейджа в меню

  useEffect(() => {
    let isMounted = true; // Флаг защиты от обновления состояния, если компонент уже размонтирован

    // Асинхронная функция загрузки списка уведомлений и подсчета непрочитанных
    const loadUnreadCount = async () => {
      // У работодателя нет раздела уведомлений, поэтому для него запрос не отправляем
      if (auth?.user?.role !== 'employee') return;

      try {
        const list = await notificationsApi.getAll();
        if (isMounted) {
          // Считаем только те уведомления, у которых isRead === false
          setUnreadCount(list.filter((n) => !n.isRead).length);
        }
      } catch {
        // Игнорируем фоновую ошибку, чтобы сбой сети не ломал интерфейс кабинета
      }
    };

    void loadUnreadCount(); // Запускаем первичную загрузку при входе в личный кабинет

    // Подписываемся на кастомное событие, чтобы счетчик обновлялся мгновенно при создании заявки или чтении уведомлений
    window.addEventListener('notifications:updated', loadUnreadCount);

    // Фоновый опрос сервера 1С каждые 30 секунд на случай, если руководитель согласовал заявку
    const intervalId = setInterval(() => {
      void loadUnreadCount();
    }, 30000);

    // Функция очистки: срабатывает при выходе из кабинета или закрытии вкладки
    return () => {
      isMounted = false;
      clearInterval(intervalId); // Останавливаем таймер, чтобы он не работал в фоне после разлогина
      window.removeEventListener('notifications:updated', loadUnreadCount); // Отписываемся от события
    };
  }, [auth?.user?.role]); // Перезапускаем эффект только при смене роли пользователя

  return (
    <div className={styles.layout}>
      <SideBar unreadCount={unreadCount} />
      <main className={styles.main}>
        {/* Сюда React Router рендерит нужную страницу (Заявления, История, Отпуска, Согласование и т.д.) */}
        <Outlet />
      </main>
    </div>
  );
};
