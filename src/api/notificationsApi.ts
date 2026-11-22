import { apiClient, USE_MOCKS } from './client';
import { getMockNotifications, markAllMockNotificationsRead } from '../mocks/mockData';
import type { NotificationItem } from '../types/api';

export const notificationsApi = {
  getAll: async (): Promise<NotificationItem[]> => {
    if (USE_MOCKS) {
      return getMockNotifications();
    }
    const { data } = await apiClient.get<NotificationItem[]>('/notifications');
    return data;
  },

  markAllAsRead: async (): Promise<void> => {
    if (USE_MOCKS) {
      markAllMockNotificationsRead();
      window.dispatchEvent(new Event('notifications:updated'));
      return;
    }
    await apiClient.patch('/notifications/read-all');
    window.dispatchEvent(new Event('notifications:updated'));
  },
};
