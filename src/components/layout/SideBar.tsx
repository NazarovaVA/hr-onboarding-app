import React, { useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/authContextInstance';
import { Button } from '../ui/Button/Button';
import styles from './SideBar.module.css';

interface SideBarProps {
  unreadCount?: number;
}

export const SideBar: React.FC<SideBarProps> = ({ unreadCount = 0 }) => {
  const auth = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    auth?.logout();
    navigate('/');
  };

  const role = auth?.user?.role;
  const getLinkClass = ({ isActive }: { isActive: boolean }) =>
    `${styles.link} ${isActive ? styles.active : ''}`;

  return (
    <aside className={styles.sidebar}>
      <div>
        <div className={styles.userBlock}>
          <span className={styles.userName}>{auth?.user?.fullName}</span>
          <span className={styles.userRole}>
            {role === 'employer' ? 'Работодатель' : 'Сотрудник'}
          </span>
        </div>

        <nav className={styles.nav}>
          {role === 'employer' ? (
            <>
              <NavLink to="/employer/vacations" className={getLinkClass}>Отпуска</NavLink>
              <NavLink to="/employer/trips" className={getLinkClass}>Командировки</NavLink>
            </>
          ) : (
            <>
              <NavLink to="/my-requests" className={getLinkClass}>Заявления</NavLink>
              <NavLink to="/history" className={getLinkClass}>История</NavLink>
              <NavLink to="/notifications" className={getLinkClass}>
                <span>Уведомления</span>
                {unreadCount > 0 && <span className={styles.badge}>{unreadCount}</span>}
              </NavLink>
            </>
          )}
        </nav>
      </div>

      <Button variant="secondary" onClick={handleLogout}>Выйти</Button>
    </aside>
  );
};
