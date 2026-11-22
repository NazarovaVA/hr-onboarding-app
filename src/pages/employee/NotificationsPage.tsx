import React, { useState, useEffect } from 'react';
import { PageHeader } from '../../components/layout/PageHeader';
import { NotificationItem } from '../../components/shared/NotificationItem/NotificationItem';
import { notificationsApi } from '../../api/notificationsApi';
import type { NotificationItem as NotificationType } from '../../types/api';
import cabinet from '../Cabinet.module.css';

export const NotificationsPage: React.FC = () => {
  const [items, setItems] = useState<NotificationType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      try {
        const data = await notificationsApi.getAll();
        setItems(data);
        if (data.some((n) => !n.isRead)) {
          await notificationsApi.markAllAsRead();
        }
      } finally {
        setIsLoading(false);
      }
    };
    init();
  }, []);

  return (
    <div>
      <PageHeader title="Уведомления" />
      <div className={cabinet.list}>
        {isLoading ? (
          <p className={cabinet.emptyText}>Загрузка уведомлений...</p>
        ) : items.length === 0 ? (
          <p className={cabinet.emptyText}>Уведомлений пока нет.</p>
        ) : (
          items.map((item) => <NotificationItem key={item.id} item={item} />)
        )}
      </div>
    </div>
  );
};
