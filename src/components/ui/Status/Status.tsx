import React from 'react';
import type { RequestStatus } from '../../../types/api';
import styles from './Status.module.css';

const STATUS_LABELS: Record<RequestStatus, string> = {
  pending: 'На рассмотрении',
  revision: 'На доработке',
  approved: 'Согласовано',
  rejected: 'Отказано',
};

export const Status: React.FC<{ status: RequestStatus }> = ({ status }) => {
  return <span className={`${styles.badge} ${styles[status]}`}>{STATUS_LABELS[status]}</span>;
};
