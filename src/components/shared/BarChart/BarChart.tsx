import React from 'react';
import type { AbsenceMonthStat } from '../../../types/api';

export const BarChart: React.FC<{ data: AbsenceMonthStat[] }> = ({ data }) => {
  const maxDays = Math.max(...data.map((d) => d.days), 1);

  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: '16px', height: '150px', paddingTop: '20px' }}>
      {data.map((item) => {
        const heightPx = Math.max(Math.round((item.days / maxDays) * 100), 6);
        return (
          <div key={item.month} style={{ flex: 1, textAlign: 'center' }}>
            <div style={{ fontSize: '12px', marginBottom: '4px', fontWeight: 600 }}>{item.days} дн.</div>
            <div
              style={{
                height: `${heightPx}px`,
                backgroundColor: 'var(--primary)',
                borderRadius: '6px 6px 0 0',
              }}
            />
            <div style={{ fontSize: '12px', marginTop: '6px', color: 'var(--text-muted)' }}>
              {item.month}
            </div>
          </div>
        );
      })}
    </div>
  );
};
