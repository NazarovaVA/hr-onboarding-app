// Импортируем тип ReactNode — он разрешает передавать в rightSlot любой JSX (кнопку, бейдж статуса, иконку)
import type { ReactNode } from 'react';
import cn from 'classnames';
import styles from './PageHeader.module.css';

interface PageHeaderProps {
  title: string;         // Обязательный текст заголовка страницы
  rightSlot?: ReactNode; // Необязательный элемент справа (например, кнопка «+ Создать» или статус заявки)
  className?: string;    // Необязательный класс для кастомизации
}

export const PageHeader = ({ title, rightSlot, className }: PageHeaderProps) => {
  return (
    <header className={styles.header}>
      <h1 className={cn(styles.title, className)}>{title}</h1>
      {/* Условный рендеринг: обертка для правого блока появится в DOM только если передан rightSlot */}
      {rightSlot && <div>{rightSlot}</div>}
    </header>
  );
};
