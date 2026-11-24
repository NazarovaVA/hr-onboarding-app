import type {
  User,
  RequestWithAnalytics,
  NotificationItem,
  DictionariesResponse,
} from '../types/api';

export const MOCK_USERS: Record<'employee' | 'employer', User> = {
  employee: {
    id: 'emp-001',
    email: 'ivanov@company.ru',
    fullName: 'Иванов Иван Иванович',
    role: 'employee',
    department: 'Отдел разработки',
    position: 'Frontend-разработчик',
  },
  employer: {
    id: 'boss-001',
    email: 'petrov@company.ru',
    fullName: 'Петров Пётр Сергеевич',
    role: 'employer',
    department: 'Руководство',
    position: 'Технический директор',
  },
};

export const MOCK_DICTIONARIES: DictionariesResponse = {
  departments: ['Отдел разработки', 'Отдел дизайна', 'Бухгалтерия', 'Отдел продаж'],
  positions: ['Frontend-разработчик', 'Backend-разработчик', 'UI/UX Дизайнер', 'Менеджер'],
};

export const MOCK_REQUESTS: RequestWithAnalytics[] = [
  {
    id: 'req-101',
    number: '12345',
    type: 'vacation',
    status: 'pending',
    dateFrom: '2026-12-10',
    dateTo: '2026-12-24',
    reason: 'Ежегодный оплачиваемый отпуск',
    comment: null,
    createdAt: '2026-11-20T10:00:00Z',
    employee: {
      id: 'emp-001',
      fullName: 'Иванов Иван Иванович',
      department: 'Отдел разработки',
      position: 'Frontend-разработчик',
    },
    analytics: {
            absenceStats: [
        { month: 'Январь', days: 0 },
        { month: 'Февраль', days: 3 },
        { month: 'Март', days: 0 },
        { month: 'Апрель', days: 0 },
        { month: 'Май', days: 5 },
        { month: 'Июнь', days: 0 },
        { month: 'Июль', days: 14 },
        { month: 'Август', days: 0 },
        { month: 'Сентябрь', days: 2 },
        { month: 'Октябрь', days: 0 },
        { month: 'Ноябрь', days: 4 },
        { month: 'Декабрь', days: 0 },
      ],
      importancePercent: 72,
      canBeReleased: true,
      recommendationText: 'Сотрудника можно отпустить: критических релизов на эти даты не запланировано.',
    },
  },
  {
    id: 'req-102',
    number: '12346',
    type: 'trip',
    status: 'approved',
    dateFrom: '2026-11-28',
    dateTo: '2026-12-02',
    destination: 'г. Санкт-Петербург, Офис партнёров',
    dailyAllowance: 2500,
    reason: 'Интеграция систем с заказчиком',
    comment: 'Согласовано, билеты забронирует офис-менеджер.',
    createdAt: '2026-11-15T14:20:00Z',
    employee: {
      id: 'emp-001',
      fullName: 'Иванов Иван Иванович',
      department: 'Отдел разработки',
      position: 'Frontend-разработчик',
    },
    analytics: {
      absenceStats: [
        { month: 'Январь', days: 0 },
        { month: 'Февраль', days: 3 },
        { month: 'Март', days: 0 },
        { month: 'Апрель', days: 0 },
        { month: 'Май', days: 5 },
        { month: 'Июнь', days: 0 },
        { month: 'Июль', days: 14 },
        { month: 'Август', days: 0 },
        { month: 'Сентябрь', days: 2 },
        { month: 'Октябрь', days: 0 },
        { month: 'Ноябрь', days: 4 },
        { month: 'Декабрь', days: 0 },
      ],

      importancePercent: 85,
      canBeReleased: true,
      recommendationText: 'Поездка необходима для закрытия этапа проекта.',
    },
  },
];

export const MOCK_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    status: 'approved',
    text: 'Ваше заявление #12346 (Командировка) было согласовано руководителем.',
    createdAt: '2026-11-16T09:15:00Z',
    isRead: false,
  },
  {
    id: 'notif-2',
    status: 'pending',
    text: 'Заявление #12345 (Отпуск) отправлено на рассмотрение.',
    createdAt: '2026-11-20T10:01:00Z',
    isRead: true,
  },
];

// Чтобы в мок-режиме создание заявки, 
// её просмотр и согласование работодателем работали 
// по-настоящему (и сохранялись даже после перезагрузки
// страницы), сделаем небольшой общий хранилище-сервис
// в src/mocks/mockData.ts с сохранением в localStorage.

const STORAGE_KEY = 'mock_requests_data';

export const getMockRequests = (): RequestWithAnalytics[] => {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    return JSON.parse(saved);
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(MOCK_REQUESTS));
  return MOCK_REQUESTS;
};

export const addMockRequest = (newReq: RequestWithAnalytics) => {
  const current = getMockRequests();
  const updated = [newReq, ...current];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
};

export const updateMockRequestDecision = (
  id: string,
  status: RequestWithAnalytics['status'],
  comment: string
) => {
  const current = getMockRequests();
  const updated = current.map((req) =>
    req.id === id ? { ...req, status, comment: comment || null } : req
  );
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
};

const NOTIF_STORAGE_KEY = 'mock_notifications_data';

export const getMockNotifications = (): NotificationItem[] => {
  const saved = localStorage.getItem(NOTIF_STORAGE_KEY);
  if (saved) {
    return JSON.parse(saved);
  }
  localStorage.setItem(NOTIF_STORAGE_KEY, JSON.stringify(MOCK_NOTIFICATIONS));
  return MOCK_NOTIFICATIONS;
};

export const markAllMockNotificationsRead = (): NotificationItem[] => {
  const updated = getMockNotifications().map((n) => ({ ...n, isRead: true }));
  localStorage.setItem(NOTIF_STORAGE_KEY, JSON.stringify(updated));
  return updated;
};

export const addMockNotification = (
  status: NotificationItem['status'],
  text: string
) => {
  const current = getMockNotifications();
  const newNotif: NotificationItem = {
    id: `notif-${Date.now()}`,
    status,
    text,
    createdAt: new Date().toISOString(),
    isRead: false,
  };
  localStorage.setItem(NOTIF_STORAGE_KEY, JSON.stringify([newNotif, ...current]));

  // Оповещаем MainLayout, что пора пересчитать красный бейдж в сайдбаре:
  window.dispatchEvent(new Event('notifications:updated'));
};

export const updateMockRequestContent = (
  id: string,
  payload: {
    dateFrom: string;
    dateTo: string;
    reason: string;
    dailyAllowance?: number;
    destination?: string;
  }
) => {
  const current = getMockRequests();
  const updated = current.map((req) => {
    if (req.id !== id) return req;
    const baseUpdated = {
      ...req,
      status: 'pending' as const, // Возвращаем на рассмотрение
      dateFrom: payload.dateFrom,
      dateTo: payload.dateTo,
      reason: payload.reason,
    };
    return req.type === 'trip'
      ? {
          ...baseUpdated,
          dailyAllowance: payload.dailyAllowance ?? req.dailyAllowance,
          destination: payload.destination ?? req.destination,
        }
      : baseUpdated;
  });
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
};
