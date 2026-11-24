import { useState, type InputHTMLAttributes } from 'react';
import cn from 'classnames';
import eyeOpenIcon from '../../../assets/eye-open.svg';
import eyeClosedIcon from '../../../assets/eye-closed.svg';
// Переиспользуем стили из соседней папки Input, чтобы не дублировать CSS для одинаковых полей
import styles from '../Input/Input.module.css';

interface PasswordInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string; // Подпись над полем (по умолчанию будет «Пароль»)
  labelClassName?: string;
  error?: string; // Текст ошибки под полем
  classNameInput?:string;
}

export const PasswordInput = ({
  label = 'Пароль',
  labelClassName,
  error, 
  classNameInput,
  className,
  ...props
}: PasswordInputProps) => {
  // Локальное состояние видимости пароля: false — точки, true — открытый текст
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className={cn(styles.field, className)}>
      {label && <label className={cn(styles.label, labelClassName)}>{label}</label>}
      <div className={styles.wrapper}>
        <input
          // Динамически переключаем HTML-атрибут type между 'text' и 'password'
          type={isVisible ? 'text' : 'password'}
          // Всегда добавляем отступ справа (withIcon), чтобы длинный пароль не наезжал на кнопку-глазик
          className={cn(styles.control, styles.withIcon, classNameInput)}
          {...props}
        />
        <button
          // type="button" обязателен! Без него внутри <form> клик по глазику отправит форму входа
          type="button"
          className={styles.iconBtn}
          // Инвертируем состояние видимости при каждом клике
          onClick={() => setIsVisible((prev) => !prev)}
          aria-label="Показать или скрыть пароль"
        >
          <img
            src={isVisible ? eyeOpenIcon : eyeClosedIcon}
            alt=""
            width={55}
            height={55}
          />
        </button>
      </div>
      {error && <span className={styles.error}>{error}</span>}
    </div>
  );
};
