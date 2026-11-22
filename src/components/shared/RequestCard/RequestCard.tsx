import React from 'react';
import type { AppRequest } from '../../../types/api';
import { InfoField } from '../InfoField/InfoField';
import { Status } from '../../ui/Status/Status';
import styles from './RequestCard.module.css';

interface RequestCardProps {
  request: AppRequest;
  showEmployeeInfo?: boolean;
  onClick: () => void;
}

export const RequestCard: React.FC<RequestCardProps> = ({
  request,
  showEmployeeInfo = false,
  onClick,
}) => {
  return (
    <div className={styles.card} onClick={onClick}>
      <div className={styles.fields}>
        {showEmployeeInfo && (
          <>
            <InfoField label="Сотрудник" value={request.employee.fullName} />
            <InfoField label="Отдел" value={request.employee.department} />
          </>
        )}
        <InfoField
          label="Тип заявления"
          value={request.type === 'vacation' ? 'Отпуск' : 'Командировка'}
        />
        <InfoField label="Дата начала" value={request.dateFrom} />
        <InfoField label="Дата окончания" value={request.dateTo} />
      </div>
      <Status status={request.status} />
    </div>
  );
};
