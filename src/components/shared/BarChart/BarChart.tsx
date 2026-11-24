import cn from 'classnames';
import type { AbsenceMonthStat } from '../../../types/api';
import styles from './BarChart.module.css';

interface BarChartProps {
  data: AbsenceMonthStat[]; // Массив из 12 месяцев
}

const SHORT_MONTHS: Record<string, string> = {
  Январь: 'Янв',
  Февраль: 'Фев',
  Март: 'Мар',
  Апрель: 'Апр',
  Май: 'Май',
  Июнь: 'Июн',
  Июль: 'Июл',
  Август: 'Авг',
  Сентябрь: 'Сен',
  Октябрь: 'Окт',
  Ноябрь: 'Ноя',
  Декабрь: 'Дек',
};

export const BarChart = ({ data }: BarChartProps) => {
  const maxDays = Math.max(...data.map((d) => d.days), 1);

  return (
    <div className={styles.chart}>
      {data.map((item) => {
        const heightPx = item.days > 0 ? Math.max(Math.round((item.days / maxDays) * 105), 10) : 4;

        return (
          <div key={item.month} className={styles.column}>
            {/* Выводим число дней всегда, включая 0 */}
            <span className={cn(styles.value, { [styles.valueEmpty]: item.days === 0 })}>
              {item.days}
            </span>

            <div
              className={cn(styles.bar, { [styles.barEmpty]: item.days === 0 })}
              style={{ height: `${heightPx}px` }}
              title={`${item.month}: ${item.days} дн.`}
            />

            <span className={styles.label}>
              {SHORT_MONTHS[item.month] || item.month.slice(0, 3)}
            </span>
          </div>
        );
      })}
    </div>
  );
};

