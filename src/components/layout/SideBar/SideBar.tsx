import { useContext } from 'react';
// NavLink — специальная ссылка из react-router-dom, которая сама определяет, совпадает ли текущий URL с её адресом
import { NavLink, useNavigate } from 'react-router-dom';
import cn from 'classnames';
import { AuthContext } from '../../../context/authContextInstance';
import { Button } from '../../ui/Button/Button';
import styles from './SideBar.module.css';

interface SideBarProps {
  unreadCount?: number; // Необязательный счетчик непрочитанных уведомлений (по умолчанию 0)
}

export const SideBar = ({ unreadCount = 0 }: SideBarProps) => {
  const auth = useContext(AuthContext); // Получаем данные текущего авторизованного пользователя из контекста
  const navigate = useNavigate();       // Хук для перенаправления пользователя на другую страницу

  // Обработчик кнопки «Выйти»
  const handleLogout = () => {
    auth?.logout(); // Удаляем токены из localStorage и сбрасываем пользователя в состоянии
    navigate('/');  // Переводим на приветственную страницу (стр. 1)
  };

  const role = auth?.user?.role; // Роль пользователя: 'employee' (работник) или 'employer' (работодатель)

  // Функция для пропса className в NavLink: React Router сам передает сюда объект { isActive: boolean }
  const getLinkClass = ({ isActive }: { isActive: boolean }) =>
    cn(styles.link, { [styles.active]: isActive }); // Добавляем класс .active только активной вкладке

  return (
    <aside className={styles.sidebar}>
      <div>
        {/* Верхний блок с ФИО и ролью текущего пользователя */}
        <div className={styles.userBlock}>
          <span className={styles.userName}>{auth?.user?.fullName}</span>
          <span className={styles.userRole}>
            {role === 'employer' ? 'Работодатель' : 'Сотрудник'}
          </span>
        </div>

        {/* Меню навигации строится по условию в зависимости от роли пользователя */}
        <nav className={styles.nav}>
          {role === 'employer' ? (
            // Пункты меню для кабинета работодателя
            <>
              <NavLink to="/employer/vacations" className={getLinkClass}>
                Отпуска
              </NavLink>
              <NavLink to="/employer/trips" className={getLinkClass}>
                Командировки
              </NavLink>
            </>
          ) : (
            // Пункты меню для кабинета работника
            <>
              <NavLink to="/my-requests" className={getLinkClass}>
                Заявления
              </NavLink>
              <NavLink to="/history" className={getLinkClass}>
                История
              </NavLink>
              <NavLink to="/notifications" className={getLinkClass}>
                <span>Уведомления</span>
                {/* Красный кружок с цифрой рендерится только если есть непрочитанные уведомления */}
                {unreadCount > 0 && <span className={styles.badge}>{unreadCount}</span>}
              </NavLink>
            </>
          )}
        </nav>
      </div>

      {/* Кнопка выхода прижата к нижнему краю сайдбара за счет justify-content: space-between в CSS */}
      <Button variant="ghost" onClick={handleLogout}>
        Выйти
      </Button>
    </aside>
  );
};
