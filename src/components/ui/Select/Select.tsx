// Наследуем стандартные атрибуты выпадающего списка <select> (value, onChange, disabled)
import type { SelectHTMLAttributes } from 'react';
import cn from 'classnames';
import styles from '../Input/Input.module.css';

// Интерфейс одного пункта списка (экспортируем, если понадобится типизировать массив снаружи)
export interface SelectOption {
  value: string; // Техническое значение (например, 'vacation' или 'trip')
  label: string; // Понятный текст для пользователя (например, 'Отпуск')
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;          // Подпись над селектом
  labelClassName?: string; // Необязательный класс для переопределения стиля подписи в конкретном месте
  options: SelectOption[]; // Массив вариантов выбора
  placeholder?: string;    // Первый пустой пункт по умолчанию (например, «Все отделы»)
  classNameFont?: string;
}

export const Select = ({
  label,
  labelClassName,
  options,
  placeholder,
  classNameFont,
  className,
  ...props
}: SelectProps) => {
  return (
    <div className={cn(styles.field, className)}>
      {label && <label className={cn(styles.label, labelClassName)}>{label}</label>}
      <select className={cn(styles.control, classNameFont)} {...props}>
        {/* Если передан placeholder, добавляем первым пунктом опцию с пустым значением value="" */}
        {placeholder && <option value="">{placeholder}</option>}

        {/* Превращаем каждый элемент массива options в HTML-тег <option> */}
        {options.map((opt) => (
          // Атрибут key помогает React эффективно обновлять список при изменении данных
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
};
