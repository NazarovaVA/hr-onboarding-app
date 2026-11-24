import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/authContextInstance';
import { requestsApi } from '../../api/requestsApi';
import type { RequestType, CreateRequestDto } from '../../types/api';
import { PageHeader } from '../../components/layout/PageHeader/PageHeader';
import { Select } from '../../components/ui/Select/Select';
import { Input } from '../../components/ui/Input/Input';
import { Textarea } from '../../components/ui/Textarea/Textarea';
import { Button } from '../../components/ui/Button/Button';
// import cabinet from '../Cabinet.module.css';

export const CreateRequestPage: React.FC = () => {
  const navigate = useNavigate();
  const auth = useContext(AuthContext);

  const [type, setType] = useState<RequestType>('vacation');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [dailyAllowance, setDailyAllowance] = useState('');
  const [destination, setDestination] = useState('');
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (dateFrom > dateTo) {
      alert('Дата окончания не может быть раньше даты начала');
      return;
    }

    const payload: CreateRequestDto = {
      type,
      dateFrom,
      dateTo,
      reason,
      ...(type === 'trip' && {
        dailyAllowance: Number(dailyAllowance),
        destination,
      }),
    };

    setIsSubmitting(true);
    try {
      await requestsApi.create(payload, auth?.user);
      navigate('/my-requests');
    } catch {
      alert('Ошибка при создании заявления');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <PageHeader title="Создание заявления" />
      {/* <div className={cabinet.card}> */}
      <div>
        {/* <form onSubmit={handleSubmit} className={cabinet.form}> */}
         <form onSubmit={handleSubmit}>
          <Select
            label="Тип заявления"
            value={type}
            onChange={(e) => setType(e.target.value as RequestType)}
            options={[
              { value: 'vacation', label: 'Отпуск' },
              { value: 'trip', label: 'Командировка' },
            ]}
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

          {type === 'trip' && (
            <>
              <Input
                type="number"
                label="Суточные (₽)"
                placeholder="Например: 2000"
                value={dailyAllowance}
                onChange={(e) => setDailyAllowance(e.target.value)}
                required
              />
              <Input
                label="Направление"
                placeholder="Город и организация"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                required
              />
            </>
          )}

          <Textarea
            label="Причина"
            placeholder="Опишите причину или цель поездки"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            required
          />

          {/* <div className={cabinet.actions}> */}
          <div>
            <Button type="submit" isLoading={isSubmitting}>
              Создать заявление
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate('/my-requests')}
            >
              Отмена
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
