import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import type { DecisionAction, RequestWithAnalytics } from '../../types/api';
import { PageHeader } from '../../components/layout/PageHeader';
import { Status } from '../../components/ui/Status/Status';
import { Button } from '../../components/ui/Button/Button';
import { InfoField } from '../../components/shared/InfoField/InfoField';
import { BarChart } from '../../components/shared/BarChart/BarChart';
import { Textarea } from '../../components/ui/Textarea/Textarea';
import { requestsApi } from '../../api/requestsApi';
import cabinet from '../Cabinet.module.css';

export const ApprovalPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [request, setRequest] = useState<RequestWithAnalytics | null>(null);
  const [comment, setComment] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!id) return;
    requestsApi
      .getById(id)
      .then((data) => {
        if (data) {
          setRequest(data);
          setComment(data.comment || '');
        }
      })
      .finally(() => setIsLoading(false));
  }, [id]);

  const goBackToList = () => {
    const targetPath =
      request?.type === 'trip' ? '/employer/trips' : '/employer/vacations';
    navigate(targetPath);
  };

  if (isLoading) {
    return <p className={cabinet.emptyText}>Загрузка данных заявления...</p>;
  }

  if (!request) {
    return (
      <div>
        <p className={cabinet.emptyText}>Заявление не найдено</p>
        <Button variant="secondary" onClick={goBackToList}>
          Вернуться к списку
        </Button>
      </div>
    );
  }

  const handleDecision = async (decision: DecisionAction) => {
    setIsSubmitting(true);
    try {
      await requestsApi.sendDecision(request.id, { decision, comment });
      goBackToList();
    } catch {
      alert('Ошибка при отправке решения');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <PageHeader
        title={`Заявление #${request.number} / ${request.employee.fullName}`}
        rightSlot={
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <Status status={request.status} />
            <Button variant="ghost" onClick={goBackToList}>
              ✕
            </Button>
          </div>
        }
      />

      <div className={cabinet.card}>
        <h3 style={{ marginBottom: '16px' }}>Данные заявления</h3>
        <InfoField label="Сотрудник" value={request.employee.fullName} />
        <InfoField label="Отдел" value={request.employee.department} />
        <InfoField label="Должность" value={request.employee.position} />
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
      </div>

      {request.analytics && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div className={cabinet.card}>
            <h3 style={{ marginBottom: '12px' }}>Статистика отсутствий</h3>
            <BarChart data={request.analytics.absenceStats} />
          </div>

          <div className={cabinet.card}>
            <h3 style={{ marginBottom: '12px' }}>Оценка влияния на работу</h3>
            <p style={{ fontSize: '18px', marginBottom: '10px' }}>
              Нужность сотрудника: <strong>{request.analytics.importancePercent}%</strong>
            </p>
            <p style={{ color: 'var(--text-muted)' }}>
              {request.analytics.recommendationText}
            </p>
          </div>
        </div>
      )}

      <div className={cabinet.card}>
        <Textarea
          label="Комментарий"
          placeholder="Оставьте комментарий для сотрудника..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
        <div className={cabinet.actions}>
          <Button
            variant="success"
            disabled={isSubmitting}
            onClick={() => handleDecision('approved')}
          >
            Согласовать
          </Button>
          <Button
            variant="secondary"
            disabled={isSubmitting}
            onClick={() => handleDecision('revision')}
          >
            Отправить на доработку
          </Button>
          <Button
            variant="danger"
            disabled={isSubmitting}
            onClick={() => handleDecision('rejected')}
          >
            Отказать
          </Button>
        </div>
      </div>
    </div>
  );
};
