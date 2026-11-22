import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/authContextInstance';
import { Input } from '../components/ui/Input/Input';
import { PasswordInput } from '../components/ui/PasswordInput/PasswordInput';
import { Button } from '../components/ui/Button/Button';
import cabinet from './Cabinet.module.css';

export const LoginPage: React.FC = () => {
  const auth = useContext(AuthContext);
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      if (!auth) return;
      const user = await auth.login({ email, password });
      const target = user.role === 'employer' ? '/employer/vacations' : '/my-requests';
      navigate(target, { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Неверный email или пароль');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: '16px' }}>
      <div className={cabinet.card} style={{ width: '100%', maxWidth: '400px' }}>
        <h2 style={{ marginBottom: '20px', textAlign: 'center' }}>Вход</h2>
        <form onSubmit={handleSubmit} className={cabinet.form}>
          <Input
            label="Email"
            type="email"
            placeholder="ivanov@company.ru"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <PasswordInput
            label="Пароль"
            placeholder="Введите пароль"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {error && <p style={{ color: 'var(--danger)', fontSize: '13px' }}>{error}</p>}
          <Button type="submit" isLoading={isSubmitting}>Подтвердить</Button>
        </form>
      </div>
    </div>
  );
};
