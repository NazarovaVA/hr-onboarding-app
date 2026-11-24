import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import type { DecisionAction, RequestWithAnalytics } from '../../../types/api';
import { PageHeader } from '../../../components/layout/PageHeader/PageHeader';
import { Status } from '../../../components/ui/Status/Status';
import { Button } from '../../../components/ui/Button/Button';
import { InfoField } from '../../../components/shared/InfoField/InfoField';
import { BarChart } from '../../../components/shared/BarChart/BarChart';
import { Textarea } from '../../../components/ui/Textarea/Textarea';
import { requestsApi } from '../../../api/requestsApi';
import styles from './ApprovalPage.module.css';

export const ApprovalPage = () => {
  // Достаем параметр :id из URL (например, /employer/requests/req-101)
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Состояния данных заявления, комментария руководителя, загрузки и отправки решения
  const [request, setRequest] = useState<RequestWithAnalytics | null>(null);
  const [comment, setComment] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Загружаем подробную информацию по заявлению и блок аналитики при открытии страницы
  useEffect(() => {
    if (!id) return;
    let isMounted = true; // Защита от обновления состояния после ухода со страницы

    requestsApi
      .getById(id)
      .then((data) => {
        if (!isMounted) return;
        if (data) {
          setRequest(data);
          // Если руководитель ранее уже оставлял комментарий, подставляем его в поле
          setComment(data.comment || '');
        }
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [id]);

  // Безопасный возврат в нужный список (Отпуска или Командировки) в зависимости от типа текущей заявки
  const goBackToList = () => {
    const targetPath = request?.type === 'trip' ? '/employer/trips' : '/employer/vacations';
    navigate(targetPath);
  };

  // Экран загрузки
  if (isLoading) {
    return <p className={styles.emptyText}>Загрузка данных заявления...</p>;
  }

  // Если заявка с таким ID не найдена
  if (!request) {
    return (
      <div>
        <p className={styles.emptyText}>Заявление не найдено</p>
        <Button variant="secondary" onClick={goBackToList}>
          Вернуться к списку
        </Button>
      </div>
    );
  }

  // Единый обработчик для всех трёх кнопок решения ('approved' | 'revision' | 'rejected')
  const handleDecision = async (decision: DecisionAction) => {
    setIsSubmitting(true); // Блокируем кнопки на время запроса
    try {
      await requestsApi.sendDecision(request.id, { decision, comment });
      goBackToList(); // После успешного сохранения возвращаемся в общий список
    } catch {
      alert('Ошибка при отправке решения');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.container}>
      {/* Шапка: номер заявки + ФИО сотрудника слева, статус и кнопка закрытия «✕» справа */}
      <PageHeader
        title={`Заявление #${request.number} / ${request.employee.fullName}`}
        rightSlot={
          <div className={styles.headerRight}>
            <Status status={request.status} />
            <Button variant="ghost" onClick={goBackToList} aria-label="Закрыть">
              ✕
            </Button>
          </div>
        }
        className={styles.approvalPageHeader}
      />

      {/* Секция 1: Заголовок сверху + белая карточка с данными */}
      <section>
        <h3 className={styles.sectionTitle}>Данные заявления</h3>
        <div className={styles.card}>
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
      </section>

      {/* Секции 2 и 3: Заголовки над каждой из двух колонок аналитики */}
      {request.analytics && (
        <div className={styles.analyticsGrid}>
          <section className={styles.analyticsSection}>
            <h3 className={styles.sectionTitle}>Статистика отсутствий</h3>
            <div className={styles.card}>
              <BarChart data={request.analytics.absenceStats} />
            </div>
          </section>

          <section className={styles.analyticsSection}>
            <h3 className={styles.sectionTitle}>Оценка влияния на работу</h3>
            <div className={styles.card}>
              <p className={styles.importanceText}>
                Этот сотрудник нужен на: 
              </p>
              <p className={styles.importancePercent}>{request.analytics.importancePercent}%</p>
              <p className={styles.recommendation}>{request.analytics.recommendationText}</p>
            </div>
          </section>
        </div>
      )}

      {/* Секция 4: Только поле комментария в белой карточке (или без заголовка, если его нет в макете) */}
      <section>
        <h3 className={styles.sectionTitle}>Комментарий</h3>
        <div className={styles.card}>
          <Textarea
            placeholder="Оставьте комментарий для сотрудника..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className={styles.textarea}
          />
        </div>
      </section>

      {/* Отдельный блок кнопок принятия решения под всеми карточками */}
      <div className={styles.actions}>
        <div className={styles.goodActions}>
          <Button
          variant="primary"
          disabled={isSubmitting}
          onClick={() => handleDecision('approved')}
          className={styles.approvalBtn}
        >
          Согласовать
        </Button>
        <Button
          variant="secondary"
          disabled={isSubmitting}
          onClick={() => handleDecision('revision')}
          className={styles.approvalBtn}
        >
          Отправить на доработку
        </Button>
        </div>
        <Button
          variant="withBorder"
          disabled={isSubmitting}
          onClick={() => handleDecision('rejected')}
          className={styles.approvalBtn}
        >
          Отказать
        </Button>
      </div>
    </div>
  );
};
