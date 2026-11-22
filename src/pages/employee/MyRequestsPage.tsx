import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../../components/layout/PageHeader';
import { Button } from '../../components/ui/Button/Button';
import { RequestCard } from '../../components/shared/RequestCard/RequestCard';
import { requestsApi } from '../../api/requestsApi';
import type { RequestWithAnalytics } from '../../types/api';
import cabinet from '../Cabinet.module.css';

export const MyRequestsPage: React.FC = () => {
  const navigate = useNavigate();
  const [requests, setRequests] = useState<RequestWithAnalytics[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    requestsApi
      .getAll()
      .then((data) => {
        const active = data.filter(
          (req) => req.status === 'pending' || req.status === 'revision'
        );
        setRequests(active);
      })
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div>
      <PageHeader
        title="Заявления"
        rightSlot={<Button onClick={() => navigate('/my-requests/new')}>+ Создать</Button>}
      />
      <div className={cabinet.list}>
        {isLoading ? (
          <p className={cabinet.emptyText}>Загрузка заявлений...</p>
        ) : requests.length === 0 ? (
          <p className={cabinet.emptyText}>У вас нет активных заявлений.</p>
        ) : (
          requests.map((req) => (
            <RequestCard
              key={req.id}
              request={req}
              onClick={() => navigate(`/my-requests/${req.id}`)}
            />
          ))
        )}
      </div>
    </div>
  );
};
