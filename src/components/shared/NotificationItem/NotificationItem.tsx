import React from 'react';
import type { NotificationItem as NotificationType } from '../../../types/api';

const ICON_MAP: Record<NotificationType['status'], string> = {
  approved: '✅',
  rejected: '❌',
  pending: '⏳',
};

export const NotificationItem: React.FC<{ item: NotificationType }> = ({ item }) => {
  return (
    <div
      style={{
        display: 'flex',
        gap: '14px',
        padding: '16px',
        borderRadius: 'var(--radius)',
        border: '1px solid var(--border)',
        backgroundColor: item.isRead ? 'var(--bg-card)' : '#eff6ff',
      }}
    >
      <span style={{ fontSize: '20px' }}>{ICON_MAP[item.status]}</span>
      <div>
        <p style={{ marginBottom: '6px', fontSize: '15px' }}>{item.text}</p>
        <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
          {new Date(item.createdAt).toLocaleString('ru-RU')}
        </span>
      </div>
    </div>
  );
};
