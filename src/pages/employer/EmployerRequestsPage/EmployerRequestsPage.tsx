// Импортируем хуки состояния, эффектов и мемоизации (кэширования вычислений)
import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import type { RequestType, RequestWithAnalytics, DictionariesResponse } from '../../../types/api';
import { PageHeader } from '../../../components/layout/PageHeader/PageHeader';
import { Select } from '../../../components/ui/Select/Select';
import { Input } from '../../../components/ui/Input/Input';
import { RequestCard } from '../../../components/shared/RequestCard/RequestCard';
import { requestsApi } from '../../../api/requestsApi';
import styles from './EmployerRequestsPage.module.css';

interface EmployerRequestsPageProps {
  type: RequestType; // Тип страницы: 'vacation' (вкладка «Отпуска») или 'trip' (вкладка «Командировки»)
}

export const EmployerRequestsPage = ({ type }: EmployerRequestsPageProps) => {
  const navigate = useNavigate(); // Хук для перехода на страницу согласования при клике по карточке

  // Состояния для данных с сервера (или из моков)
  const [requests, setRequests] = useState<RequestWithAnalytics[]>([]);
  const [dictionaries, setDictionaries] = useState<DictionariesResponse>({
    departments: [],
    positions: [],
  });
  const [isLoading, setIsLoading] = useState(true);

  // Состояния трех фильтров в шапке списка
  const [department, setDepartment] = useState('');
  const [position, setPosition] = useState('');
  const [search, setSearch] = useState('');

  // Загружаем заявки и справочники параллельно при первом открытии страницы
  useEffect(() => {
    let isMounted = true; // Защита от обновления состояния, если пользователь быстро ушел со страницы

    // Promise.all запускает оба запроса одновременно, чтобы страница загрузилась быстрее
    Promise.all([requestsApi.getAll(), requestsApi.getDictionaries()])
      .then(([reqsData, dictData]) => {
        if (!isMounted) return;
        setRequests(reqsData);
        setDictionaries(dictData);
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // useMemo кэширует отфильтрованный список и пересчитывает его только тогда,
  // когда изменились сами заявки, тип вкладки или одно из полей фильтра
  const filteredRequests = useMemo(() => {
    return requests
      .filter((req) => {
        // 1. Оставляем только заявления нужного типа (отпуска или командировки)
        if (req.type !== type) return false;
        // 2. Если выбран отдел — отсеиваем сотрудников из других отделов
        if (department && req.employee.department !== department) return false;
        // 3. Если выбрана должность — отсеиваем остальные должности
        if (position && req.employee.position !== position) return false;
        // 4. Поиск по ФИО без учета регистра (toLowerCase)
        if (search && !req.employee.fullName.toLowerCase().includes(search.toLowerCase())) {
          return false;
        }
        return true;
      })
      // Сортируем: заявки со статусом 'pending' («На рассмотрении») всегда поднимаем наверх списка
      .sort((a, b) => (a.status === 'pending' ? -1 : b.status === 'pending' ? 1 : 0));
  }, [requests, type, department, position, search]);

  return (
    <div>
      {/* Заголовок меняется в зависимости от переданного пропса type */}
      <PageHeader title={type === 'vacation' ? 'Отпуска' : 'Командировки'} className={styles.lkTitle} />

      {/* Панель фильтрации по отделу, должности и поиску по фамилии */}
      <div className={styles.filters}>
        <Select
          label="Отдел"
          labelClassName={styles.filter}
          placeholder="Все отделы"
          classNameFont={styles.filterInput}
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
          // Преобразуем массив строк ['Отдел разработки', ...] в формат [{ value, label }, ...]
          options={dictionaries.departments.map((d) => ({ value: d, label: d }))}
        />
        <Select
          label="Должность"
          labelClassName={styles.filter}
          placeholder="Все должности"
          classNameFont={styles.filterInput}
          value={position}
          onChange={(e) => setPosition(e.target.value)}
          options={dictionaries.positions.map((p) => ({ value: p, label: p }))}
        />
        <Input
          label="Поиск по сотруднику"
          labelClassName={styles.filter}
          classNameInput={styles.filterInput}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Список карточек заявлений */}
      <div className={styles.list}>
        {isLoading ? (
          <p className={styles.emptyText}>Загрузка заявлений...</p>
        ) : filteredRequests.length === 0 ? (
          <p className={styles.emptyText}>Заявлений по выбранным фильтрам не найдено.</p>
        ) : (
          filteredRequests.map((req) => (
            <RequestCard
              key={req.id}
              request={req}
              showEmployeeInfo // Включаем отображение ФИО и отдела сотрудника на карточке
              onClick={() => navigate(`/employer/requests/${req.id}`)}
            />
          ))
        )}
      </div>
    </div>
  );
};
