// Импортируем стандартные типы React только для проверки на этапе компиляции (import type)
import type { ButtonHTMLAttributes, ReactNode } from 'react';
import cn from 'classnames'; // Библиотека для удобного объединения CSS-классов
import styles from './Button.module.css'; // Изолированные стили кнопки

// Интерфейс пропсов: наследуем все стандартные HTML-атрибуты кнопки (onClick, type, disabled и др.)
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode; // Содержимое кнопки (текст, иконка или другой JSX)
  variant?: 'primary' | 'secondary' | 'withBorder' | 'ghost'; // Вариант оформления (по умолчанию primary)
  isLoading?: boolean; // Флаг состояния загрузки (блокирует клики и меняет текст)
}

export const Button = ({
  children,              // Текст или элемент внутри кнопки
  variant = 'primary',   // Если вариант не передан, кнопка будет главной синей
  isLoading = false,     // По умолчанию загрузка выключена
  disabled,              // Стандартный HTML-атрибут блокировки кнопки
  className,             // Дополнительный внешний CSS-класс, если передали из родителя
  ...props               // Rest-оператор: собирает остальные стандартные атрибуты (onClick, type="submit" и т.д.)
}: ButtonProps) => {
  return (
    <button
      disabled={disabled || isLoading} // Кнопка неактивна, если передан disabled ИЛИ идет загрузка
      className={cn(styles.btn, styles[variant], className)} // Объединяем базовый класс, стиль варианта и внешний класс
      {...props} // Пробрасываем оставшиеся атрибуты (например, onClick) в HTML-тег <button>
    >
      {/* Если идет отправка формы — показываем «Загрузка...», иначе рендерим текст кнопки */}
      {isLoading ? 'Загрузка...' : children}
    </button>
  );
};
