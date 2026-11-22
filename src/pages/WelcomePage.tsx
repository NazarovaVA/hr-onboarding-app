import React, { useContext } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/authContextInstance';
import { Button } from '../components/ui/Button/Button';
import authImg from '../assets/auth-image.jpg';

export const WelcomePage: React.FC = () => {
  const auth = useContext(AuthContext);
  const navigate = useNavigate();

  if (auth?.isAuth && auth.user) {
    const target = auth.user.role === 'employer' ? '/employer/vacations' : '/my-requests';
    return <Navigate to={target} replace />;
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', gap: '48px', padding: '24px' }}>
      <div style={{ maxWidth: '420px' }}>
        <img src={authImg} alt="Отпуска и командировки" style={{ width: '100%' }} />
      </div>
      <div style={{ maxWidth: '440px' }}>
        <h1 style={{ fontSize: '32px', marginBottom: '16px' }}>Сервис отпусков и командировок</h1>
        <p style={{ color: 'var(--text-muted)', marginBottom: '24px', fontSize: '16px' }}>
          Удобное оформление заявлений и быстрое согласование отсутствий сотрудников.
        </p>
        <Button onClick={() => navigate('/login')}>Вход</Button>
      </div>
    </div>
  );
};
