import React, { useState } from 'react';
import styles from '../Input/Input.module.css';

interface PasswordInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const PasswordInput: React.FC<PasswordInputProps> = ({
  label = 'Пароль',
  error,
  className = '',
  ...props
}) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className={`${styles.field} ${className}`}>
      {label && <label className={styles.label}>{label}</label>}
      <div className={styles.wrapper}>
        <input
          type={isVisible ? 'text' : 'password'}
          className={`${styles.control} ${styles.withIcon}`}
          {...props}
        />
        <button
          type="button"
          className={styles.iconBtn}
          onClick={() => setIsVisible((prev) => !prev)}
          aria-label="Показать или скрыть пароль"
        >
          {isVisible ? '🙈' : '👁️'}
        </button>
      </div>
      {error && <span className={styles.error}>{error}</span>}
    </div>
  );
};
