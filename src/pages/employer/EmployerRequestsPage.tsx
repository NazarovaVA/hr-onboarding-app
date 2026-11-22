import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import type { RequestType, RequestWithAnalytics, DictionariesResponse } from '../../types/api';
import { PageHeader } from '../../components/layout/PageHeader';
import { Select } from '../../components/ui/Select/Select';
import { Input } from '../../components/ui/Input/Input';
import { RequestCard } from '../../components/shared/RequestCard/RequestCard';
import { requestsApi } from '../../api/requestsApi';
import cabinet from '../Cabinet.module.css';

interface EmployerRequestsPageProps {
  type: RequestType;
}

export const EmployerRequestsPage: React.FC<EmployerRequestsPageProps> = ({ type }) => {
  const navigate = useNavigate();

  const [requests, setRequests] = useState<RequestWithAnalytics[]>([]);
  const [dictionaries, setDictionaries] = useState<DictionariesResponse>({
    departments: [],
    positions: [],
  });
  const [isLoading, setIsLoading] = useState(true);

  const [department, setDepartment] = useState('');
  const [position, setPosition] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    Promise.all([requestsApi.getAll(), requestsApi.getDictionaries()])
      .then(([reqsData, dictData]) => {
        setRequests(reqsData);
        setDictionaries(dictData);
      })
      .finally(() => setIsLoading(false));
  }, []);

  const filteredRequests = useMemo(() => {
    return requests
      .filter((req) => {
        if (req.type !== type) return false;
        if (department && req.employee.department !== department) return false;
        if (position && req.employee.position !== position) return false;
        if (search && !req.employee.fullName.toLowerCase().includes(search.toLowerCase())) {
          return false;
        }
        return true;
      })
      // Заявки "На рассмотрении" всегда поднимаем наверх списка
      .sort((a, b) => (a.status === 'pending' ? -1 : b.status === 'pending' ? 1 : 0));
  }, [requests, type, department, position, search]);

  return (
    <div>
      <PageHeader title={type === 'vacation' ? 'Отпуска' : 'Командировки'} />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1.5fr', gap: '12px', marginBottom: '20px' }}>
        <Select
          placeholder="Все отделы"
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
          options={dictionaries.departments.map((d) => ({ value: d, label: d }))}
        />
        <Select
          placeholder="Все должности"
          value={position}
          onChange={(e) => setPosition(e.target.value)}
          options={dictionaries.positions.map((p) => ({ value: p, label: p }))}
        />
        <Input
          isSearch
          placeholder="Поиск по сотруднику..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className={cabinet.list}>
        {isLoading ? (
          <p className={cabinet.emptyText}>Загрузка заявлений...</p>
        ) : filteredRequests.length === 0 ? (
          <p className={cabinet.emptyText}>Заявлений по выбранным фильтрам не найдено.</p>
        ) : (
          filteredRequests.map((req) => (
            <RequestCard
              key={req.id}
              request={req}
              showEmployeeInfo
              onClick={() => navigate(`/employer/requests/${req.id}`)}
            />
          ))
        )}
      </div>
    </div>
  );
};
