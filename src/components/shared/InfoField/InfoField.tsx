import React from 'react';

interface InfoFieldProps {
  label: string;
  value: string | number | null | undefined;
}

export const InfoField: React.FC<InfoFieldProps> = ({ label, value }) => {
  return (
    <div style={{ marginBottom: '12px' }}>
      <span style={{ display: 'block', fontSize: '12px', color: 'var(--text-muted)' }}>
        {label}
      </span>
      <span style={{ fontSize: '15px', fontWeight: 500 }}>
        {value ?? '—'}
      </span>
    </div>
  );
};
