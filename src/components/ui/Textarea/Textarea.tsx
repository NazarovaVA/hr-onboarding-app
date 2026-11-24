// Наследуем стандартные атрибуты многострочного поля <textarea> (value, onChange, rows, required)
import type { TextareaHTMLAttributes } from 'react';
import cn from 'classnames';
import styles from '../Input/Input.module.css';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string; // Подпись над полем
  error?: string; // Текст ошибки
}

export const Textarea = ({
  label,
  error,
  className,
  ...props
}: TextareaProps) => {
  return (
    <div className={cn(styles.field)}>
      {label && <label className={styles.label}>{label}</label>}
      {/* rows={4} задает стартовую высоту в 4 строки; при передаче другого rows в props он перезапишется */}
      <textarea className={cn(styles.control, className)} rows={4} {...props} />
      {error && <span className={styles.error}>{error}</span>}
    </div>
  );
};
