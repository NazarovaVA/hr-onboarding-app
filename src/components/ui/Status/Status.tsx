// Наследуем стандартные HTML-атрибуты строчного тега <span>
import type { HTMLAttributes } from 'react';
import cn from 'classnames';
import type { RequestStatus } from '../../../types/api'; // Тип статуса: 'pending' | 'revision' | 'approved' | 'rejected'
import styles from './Status.module.css';

interface StatusProps extends HTMLAttributes<HTMLSpanElement> {
  status: RequestStatus; // Технический код статуса заявления
}

// Словарь (Record) для перевода статуса от бэкенда на русский язык
// TypeScript проверит, что здесь описаны все 4 возможных варианта из RequestStatus
const STATUS_LABELS: Record<RequestStatus, string> = {
  pending: 'На рассмотрении',
  revision: 'На доработке',
  approved: 'Согласовано',
  rejected: 'Отказано',
};

export const Status = ({ status, className, ...props }: StatusProps) => {
  return (
    // Динамически подставляем CSS-класс цвета из Status.module.css по ключу статуса (styles[status])
    <span className={cn(styles.badge, styles[status], className)} {...props}>
      {STATUS_LABELS[status]}
    </span>
  );
};
