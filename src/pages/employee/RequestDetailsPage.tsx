import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PageHeader } from '../../components/layout/PageHeader';
import { Status } from '../../components/ui/Status/Status';
import { InfoField } from '../../components/shared/InfoField/InfoField';
import { Input } from '../../components/ui/Input/Input';
import { Textarea } from '../../components/ui/Textarea/Textarea';
import { Button } from '../../components/ui/Button/Button';
import { requestsApi } from '../../api/requestsApi';
import type { RequestWithAnalytics } from '../../types/api';
import cabinet from '../Cabinet.module.css';

export const RequestDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [request, setRequest] = useState<RequestWithAnalytics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  // Состояния для режима редактирования (если статус "На доработке")
  const [isEditing, setIsEditing] = useState(false);
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [dailyAllowance, setDailyAllowance] = useState('');
  const [destination, setDestination] = useState('');
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!id) return;
    let isMounted = true;

    requestsApi
      .getById(id)
      .then((data) => {
        if (!isMounted) return;
        if (data) {
          setRequest(data);
          setDateFrom(data.dateFrom);
          setDateTo(data.dateTo);
          setReason(data.reason);
          if (data.type === 'trip') {
            setDailyAllowance(String(data.dailyAllowance));
            setDestination(data.destination);
          }
        } else {
          setRequest(null);
        }
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [id, refreshKey]);

  const handleBack = () => {
    if (!request) {
      navigate('/my-requests');
      return;
    }
    const isArchived = request.status === 'approved' || request.status === 'rejected';
    navigate(isArchived ? '/history' : '/my-requests');
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!request) return;

    if (dateFrom > dateTo) {
      alert('Дата окончания не может быть раньше даты начала');
      return;
    }

    setIsSubmitting(true);
    try {
      await requestsApi.update(request.id, {
        dateFrom,
        dateTo,
        reason,
        ...(request.type === 'trip' && {
          dailyAllowance: Number(dailyAllowance),
          destination,
        }),
      });
      setIsEditing(false);
      setIsLoading(true);
      setRefreshKey((prev) => prev + 1);
    } catch {
      alert('Ошибка при сохранении изменений');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <p className={cabinet.emptyText}>Загрузка заявления...</p>;
  }

  if (!request) {
    return (
      <div>
        <p className={cabinet.emptyText}>Заявление не найдено</p>
        <Button variant="secondary" onClick={() => navigate('/my-requests')}>
          К списку заявлений
        </Button>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title={`Заявление #${request.number}`}
        rightSlot={<Status status={request.status} />}
      />

      <div className={cabinet.card}>
        {request.comment && (
          <div
            style={{
              padding: '12px',
              backgroundColor: '#f8fafc',
              borderRadius: '8px',
              marginBottom: '16px',
              borderLeft: '4px solid var(--primary)',
            }}
          >
            <InfoField label="Комментарий руководителя" value={request.comment} />
          </div>
        )}

        {isEditing ? (
          <form onSubmit={handleSaveEdit} className={cabinet.form}>
            <InfoField
              label="Тип заявления"
              value={request.type === 'vacation' ? 'Отпуск' : 'Командировка'}
            />
            <Input
              type="date"
              label="Период с"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              required
            />
            <Input
              type="date"
              label="Период по"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              required
            />
            {request.type === 'trip' && (
              <>
                <Input
                  type="number"
                  label="Суточные (₽)"
                  value={dailyAllowance}
                  onChange={(e) => setDailyAllowance(e.target.value)}
                  required
                />
                <Input
                  label="Направление"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  required
                />
              </>
            )}
            <Textarea
              label="Причина"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              required
            />
            <div className={cabinet.actions}>
              <Button type="submit" isLoading={isSubmitting}>
                Сохранить и отправить повторно
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => setIsEditing(false)}
              >
                Отмена
              </Button>
            </div>
          </form>
        ) : (
          <>
            <InfoField
              label="Тип заявления"
              value={request.type === 'vacation' ? 'Отпуск' : 'Командировка'}
            />
            <InfoField label="Дата начала" value={request.dateFrom} />
            <InfoField label="Дата окончания" value={request.dateTo} />

            {request.type === 'trip' && (
              <>
                <InfoField label="Суточные" value={`${request.dailyAllowance} ₽`} />
                <InfoField label="Направление" value={request.destination} />
              </>
            )}

            <InfoField label="Причина" value={request.reason} />
          </>
        )}
      </div>

      {!isEditing && (
        <div className={cabinet.actions}>
          {request.status === 'revision' && (
            <Button onClick={() => setIsEditing(true)}>Редактировать заявление</Button>
          )}
          <Button variant="secondary" onClick={handleBack}>
            Назад
          </Button>
        </div>
      )}
    </div>
  );
};
