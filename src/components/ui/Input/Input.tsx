// Наследуем стандартные атрибуты тега <input> (value, onChange, type, placeholder, required)
import type { InputHTMLAttributes } from 'react';
import cn from 'classnames';
import styles from './Input.module.css';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;     // Необязательная подпись над полем ввода
  labelClassName?: string; // Необязательный класс для переопределения стиля подписи в конкретном месте
  error?: string;     // Необязательный текст ошибки валидации под полем
  classNameInput?: string;
}

export const Input = ({
  label,
  labelClassName,
  error,
  classNameInput,
  className,
  ...props // Все стандартные свойства <input> (например, type="date" или type="number")
}: InputProps) => {
  return (
    // Внешняя обертка поля: склеиваем базовый класс .field и возможный внешний className
    <div className={cn(styles.field, className)}>
      {/* Условный рендеринг: тег <label> появится только если передали текст label */}
      {label && <label className={cn(styles.label, labelClassName)}>{label}</label>}

      {/* Контейнер с position: relative, чтобы позиционировать иконку поверх правого края инпута */}
      <div className={cn(styles.wrapper)}>
        <input
          className={cn(styles.control, classNameInput)}
          {...props}
        />
      </div>

      {/* Если передана ошибка, выводим её красным текстом под полем */}
      {error && <span className={styles.error}>{error}</span>}
    </div>
  );
};
