import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../../components/layout/PageHeader/PageHeader';
import { RequestCard } from '../../components/shared/RequestCard/RequestCard';
import { requestsApi } from '../../api/requestsApi';
import type { RequestWithAnalytics } from '../../types/api';
// import cabinet from '../Cabinet.module.css';

export const HistoryPage: React.FC = () => {
  const navigate = useNavigate();
  const [requests, setRequests] = useState<RequestWithAnalytics[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    requestsApi
      .getAll()
      .then((data) => {
        const archived = data.filter(
          (req) => req.status === 'approved' || req.status === 'rejected'
        );
        setRequests(archived);
      })
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div>
      <PageHeader title="История" />
      {/* <div className={cabinet.list}> */}
      <div>
        {isLoading ? (
          // <p className={cabinet.emptyText}>Загрузка истории...</p>
          <p>Загрузка истории...</p>
        ) : requests.length === 0 ? (
          // <p className={cabinet.emptyText}>История заявлений пуста.</p>
          <p>История заявлений пуста.</p>
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
