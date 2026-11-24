// Импортируем хук состояния useState, хук контекста useContext и тип события отправки формы FormEvent
import { useState, useContext, type SyntheticEvent } from 'react';
// import { useNavigate, Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import cn from 'classnames'; // Объединяем общие стили карточки из Cabinet.module.css и локальные из LoginPage.module.css
import { AuthContext } from '../../context/authContextInstance';
import { Input } from '../../components/ui/Input/Input';
import { PasswordInput } from '../../components/ui/PasswordInput/PasswordInput';
import { Button } from '../../components/ui/Button/Button';
import styles from './LoginPage.module.css';

export const LoginPage = () => {
  const auth = useContext(AuthContext); // Достаем метод login из глобального контекста авторизации
  const navigate = useNavigate();       // Хук для перенаправления в личный кабинет после успешного входа

  // Состояния полей формы, текста ошибки и индикатора загрузки
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Обработчик отправки формы входа (типизируем событие через SyntheticEvent<HTMLFormElement>)
  const handleSubmit = async (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault(); // Отменяем стандартную перезагрузку страницы браузером при отправке формы
    setError(null);     // Сбрасываем старую ошибку перед новой попыткой входа
    setIsSubmitting(true); // Блокируем кнопку и включаем текст «Загрузка...»

    try {
      if (!auth) return;

      // Отправляем email и пароль на проверку (в моки или на бэкенд 1С) и получаем объект пользователя
      const user = await auth.login({ email, password });

      // Определяем стартовый маршрут в зависимости от роли, вернувшейся с сервера
      const target = user.role === 'employer' ? '/employer/vacations' : '/my-requests';

      // Перенаправляем пользователя в нужный кабинет (replace заменяет страницу входа в истории браузера)
      navigate(target, { replace: true });
    } catch (err) {
      // Если сервер вернул ошибку (например, 401), выводим понятное сообщение пользователю
      setError(err instanceof Error ? err.message : 'Неверный email или пароль');
    } finally {
      // В любом случае (успех или ошибка) разблокируем кнопку отправки
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.page}>
      {/* Склеиваем базовый класс карточки и ширину формы */}
      <div className={cn(styles.card)}>
        <h2 className={styles.title}>Войти в  аккаунт</h2>

        <form onSubmit={handleSubmit} className={styles.form}>
          <Input
            label="Логин"
            labelClassName={styles.loginInputLabel}
            type="email"
            placeholder="ivanov@company.ru"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            classNameInput={styles.loginInput}
            required
          />

          <PasswordInput
            label="Пароль"
            labelClassName={styles.loginInputLabel}
            placeholder="Введите пароль"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            classNameInput={styles.loginInput}
            required
          />

          {/* Условный рендеринг: красная строка с ошибкой появляется только если error не null */}
          {error && <p className={styles.error}>{error}</p>}

          <Button type="submit" isLoading={isSubmitting} className={styles.loginBtn}>
            Подтвердить
          </Button>
        </form>

        {/* Ссылка для возврата на главную приветственную страницу */}
        {/* <Link to="/" className={styles.backLink}>
          Назад на главную
        </Link> */}
      </div>
    </div>
  );
};
