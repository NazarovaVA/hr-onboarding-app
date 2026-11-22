import React from 'react';
import styles from './Input.module.css';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  isSearch?: boolean;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  isSearch = false,
  className = '',
  ...props
}) => {
  return (
    <div className={`${styles.field} ${className}`}>
      {label && <label className={styles.label}>{label}</label>}
      <div className={styles.wrapper}>
        <input
          className={`${styles.control} ${isSearch ? styles.withIcon : ''}`}
          {...props}
        />
        {isSearch && <span className={styles.iconBtn}>🔍</span>}
      </div>
      {error && <span className={styles.error}>{error}</span>}
    </div>
  );
};
