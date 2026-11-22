// --- 1. Пользователи и Авторизация (Стр. 1, 2, 3) ---

export type UserRole = 'employee' | 'employer';

export interface User {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  department?: string;
  position?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

// --- 2. Заявки на отпуск и командировки (Стр. 4, 5, 6, 7, 9, 10, 11) ---

export type RequestType = 'vacation' | 'trip';

// Статусы: на рассмотрении, на доработке, согласовано, отказано
export type RequestStatus = 'pending' | 'revision' | 'approved' | 'rejected';

// Базовые поля, общие для любой заявки
interface BaseRequest {
  id: string;
  number: string; // Например: "ЗН-0042"
  type: RequestType;
  status: RequestStatus;
  dateFrom: string; // ISO формат: "2026-12-01"
  dateTo: string;   // ISO формат: "2026-12-14"
  reason: string;
  comment: string | null; // Комментарий руководителя (может не быть)
  createdAt: string;
  // Данные сотрудника (нужны работодателю в списках и карточке)
  employee: {
    id: string;
    fullName: string;
    department: string;
    position: string;
  };
}

// Заявка на отпуск
export interface VacationRequest extends BaseRequest {
  type: 'vacation';
}

// Заявка на командировку (добавляются суточные и направление)
export interface TripRequest extends BaseRequest {
  type: 'trip';
  dailyAllowance: number; // Суточные
  destination: string;    // Направление (город/организация)
}

// Объединенный тип заявки (TypeScript сам поймет по полю type, какие поля доступны!)
export type AppRequest = VacationRequest | TripRequest;

// --- 3. Аналитика для страницы согласования (Стр. 11) ---

export interface AbsenceMonthStat {
  month: string; // Например: "Октябрь"
  days: number;  // Количество дней отсутствия
}

export interface RequestAnalytics {
  absenceStats: AbsenceMonthStat[]; // Данные для диаграммы
  importancePercent: number;        // Процент нужности сотрудника (0-100)
  canBeReleased: boolean;           // Флаг: можно ли отпустить
  recommendationText: string;       // Текстовый вердикт от 1С
}

// Расширенная модель для страницы 11 (Заявка + Аналитика)
export type RequestWithAnalytics = AppRequest & {
  analytics?: RequestAnalytics;
};

// --- 4. Тела запросов на изменение данных (Стр. 9 и 11) ---

export interface CreateRequestDto {
  type: RequestType;
  dateFrom: string;
  dateTo: string;
  reason: string;
  // Опциональны, заполняются только если type === 'trip'
  dailyAllowance?: number;
  destination?: string;
}

export type DecisionAction = 'approved' | 'revision' | 'rejected';

export interface DecisionDto {
  decision: DecisionAction;
  comment: string;
}

// --- 5. Справочники и Уведомления (Стр. 4, 5, 8) ---

export interface DictionariesResponse {
  departments: string[];
  positions: string[];
}

export interface NotificationItem {
  id: string;
  status: 'approved' | 'rejected' | 'pending'; // Для иконки: галочка, крестик, часики
  text: string;
  createdAt: string; // ISO дата и время
  isRead: boolean;   // Для счетчика непрочитанных в сайдбаре
}
