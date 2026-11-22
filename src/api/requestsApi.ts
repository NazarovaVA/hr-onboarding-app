import { apiClient, USE_MOCKS } from './client';
import {
  getMockRequests,
  addMockRequest,
  updateMockRequestDecision,
  updateMockRequestContent,
  addMockNotification,
  MOCK_DICTIONARIES,
} from '../mocks/mockData';
import type {
  RequestWithAnalytics,
  CreateRequestDto,
  DecisionDto,
  DictionariesResponse,
  User,
} from '../types/api';

export const requestsApi = {
  // Получить все заявки
  getAll: async (): Promise<RequestWithAnalytics[]> => {
    if (USE_MOCKS) {
      return getMockRequests();
    }
    const { data } = await apiClient.get<RequestWithAnalytics[]>('/requests');
    return data;
  },

  // Получить одну заявку по ID
  getById: async (id: string): Promise<RequestWithAnalytics | undefined> => {
    if (USE_MOCKS) {
      return getMockRequests().find((r) => r.id === id);
    }
    const { data } = await apiClient.get<RequestWithAnalytics>(`/requests/${id}`);
    return data;
  },

  // Создать новую заявку (Стр. 9)
  create: async (payload: CreateRequestDto, currentUser?: User | null): Promise<void> => {
    if (USE_MOCKS) {
      const base = {
        id: `req-${Date.now()}`,
        number: String(Math.floor(10000 + Math.random() * 90000)),
        status: 'pending' as const,
        dateFrom: payload.dateFrom,
        dateTo: payload.dateTo,
        reason: payload.reason,
        comment: null,
        createdAt: new Date().toISOString(),
        employee: {
          id: currentUser?.id || 'emp-001',
          fullName: currentUser?.fullName || 'Иванов Иван Иванович',
          department: currentUser?.department || 'Отдел разработки',
          position: currentUser?.position || 'Frontend-разработчик',
        },
        analytics: {
          absenceStats: [
            { month: 'Сентябрь', days: 0 },
            { month: 'Октябрь', days: 2 },
            { month: 'Ноябрь', days: 0 },
          ],
          importancePercent: 65,
          canBeReleased: true,
          recommendationText: 'Сотрудника можно отпустить: критических задач на этот период нет.',
        },
      };

      const newReq: RequestWithAnalytics =
        payload.type === 'trip'
          ? {
              ...base,
              type: 'trip',
              dailyAllowance: payload.dailyAllowance || 0,
              destination: payload.destination || '',
            }
          : { ...base, type: 'vacation' };

      addMockRequest(newReq);

      const typeText = payload.type === 'trip' ? 'Командировка' : 'Отпуск';
      addMockNotification(
        'pending',
        `Заявление #${newReq.number} (${typeText}) отправлено на рассмотрение.`
      );
      return;
    }

    await apiClient.post('/requests', payload);
    window.dispatchEvent(new Event('notifications:updated'));
  },

  // Повторная отправка после доработки (Стр. 10)
  update: async (id: string, payload: Omit<CreateRequestDto, 'type'>): Promise<void> => {
    if (USE_MOCKS) {
      updateMockRequestContent(id, payload);
      const targetReq = getMockRequests().find((r) => r.id === id);
      if (targetReq) {
        const typeText = targetReq.type === 'trip' ? 'Командировка' : 'Отпуск';
        addMockNotification(
          'pending',
          `Заявление #${targetReq.number} (${typeText}) исправлено и повторно отправлено на рассмотрение.`
        );
      }
      return;
    }

    await apiClient.put(`/requests/${id}`, payload);
    window.dispatchEvent(new Event('notifications:updated'));
  },

  // Решение работодателя: Согласовать / На доработку / Отказать (Стр. 11)
  sendDecision: async (id: string, payload: DecisionDto): Promise<void> => {
    if (USE_MOCKS) {
      updateMockRequestDecision(id, payload.decision, payload.comment);

      const targetReq = getMockRequests().find((r) => r.id === id);
      if (targetReq) {
        const typeText = targetReq.type === 'trip' ? 'Командировка' : 'Отпуск';

        if (payload.decision === 'approved') {
          addMockNotification(
            'approved',
            `Ваше заявление #${targetReq.number} (${typeText}) согласовано руководителем.`
          );
        } else if (payload.decision === 'rejected') {
          addMockNotification(
            'rejected',
            `По вашему заявлению #${targetReq.number} (${typeText}) отказано.`
          );
        } else if (payload.decision === 'revision') {
          addMockNotification(
            'pending',
            `Ваше заявление #${targetReq.number} (${typeText}) отправлено на доработку.`
          );
        }
      }
      return;
    }

    await apiClient.patch(`/requests/${id}/decision`, payload);
  },

  // Справочники отделов и должностей (Стр. 4, 5)
  getDictionaries: async (): Promise<DictionariesResponse> => {
    if (USE_MOCKS) {
      return MOCK_DICTIONARIES;
    }
    const { data } = await apiClient.get<DictionariesResponse>('/dictionaries');
    return data;
  },
};
