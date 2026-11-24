import { useContext } from 'react';
// Navigate — компонент для мгновенного перенаправления, useNavigate — хук для перехода по клику на кнопку
import { Navigate, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/authContextInstance';
import { Button } from '../../components/ui/Button/Button';
import authImg from '../../assets/auth-image.jpg';
import styles from './WelcomePage.module.css';

export const WelcomePage = () => {
  const auth = useContext(AuthContext); // Достаем состояние авторизации из контекста
  const navigate = useNavigate();       // Хук для перехода на страницу /login при нажатии на кнопку

  // Если пользователь уже вошел в систему (например, открыл сайт повторно с живым токеном),
  // не показываем приветственный экран, а сразу перенаправляем в его рабочий кабинет
  if (auth?.isAuth && auth.user) {
    const target = auth.user.role === 'employer' ? '/employer/vacations' : '/my-requests';
    return <Navigate to={target} replace />;
  }

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        {/* Левая часть экрана: тематическая иллюстрация */}
        <div className={styles.imageWrapper}>
          <img
            src={authImg}
            alt="Сервис отпусков и командировок"
            className={styles.image}
          />
        </div>

        {/* Правая часть экрана: название сервиса, описание и кнопка перехода ко входу */}
        <div className={styles.content}>
          <h1 className={styles.title}>Сервис отпусков и командировок</h1>
          <p className={styles.description}>
            Удобное оформление заявлений и быстрое согласование отсутствий сотрудников.
          </p>

          {/* Передаем кастомный класс styles.loginBtn поверх базового стиля Button */}
          <Button
            className={styles.loginBtn}
            onClick={() => navigate('/login')}
          >
            Войти
          </Button>
        </div>
      </div>
    </div>
  );
};
